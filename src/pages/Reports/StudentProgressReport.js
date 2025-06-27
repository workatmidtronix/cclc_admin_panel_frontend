import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaList, FaTimes, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { CourseSelect, SessionSelect, StudentSelect, InstructorSelect } from '../../components/MasterDataSelect';
import { showSuccess, showError } from '../../components/CustomAlert';
import { useConfirm } from '../../components/useConfirm';
import CustomConfirm from '../../components/CustomConfirm';
import { 
  getStudentProgressReports, 
  createStudentProgressReport, 
  updateStudentProgressReport, 
  deleteStudentProgressReport 
} from '../../utils/studentProgressReportsApi';

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
  font-size: 1.7rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const IconButton = styled.button`
  background: transparent;
  border: 1px solid #e9ecef;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const AddButton = styled(IconButton)`
  background: rgb(51, 66, 147);
  color: white;
  border-color: rgb(51, 66, 147);

  &:hover {
    background: rgb(40, 53, 120);
    color: white;
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 15px 15px 0 0;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    background: #e9ecef;
    color: #2c3e50;
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  &:after {
    content: ${props => props.required ? '" *"' : '""'};
    color: #dc3545;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SignatureContainer = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  min-height: 120px;
  position: relative;
  background: #fafafa;
  display: flex;
  flex-direction: column;
`;

const SignatureArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #adb5bd;
  font-style: italic;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
`;

const SignatureControls = styled.div`
  padding: 10px 15px;
  display: flex;
  justify-content: flex-end;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: rgb(51, 66, 147);
  cursor: pointer;
  font-size: 0.85rem;
  padding: 5px 10px;
  border-radius: 4px;
  
  &:hover {
    background: #f0f2ff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
`;

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const ResetButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
  }
`;

const ReportContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const TableControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
`;

const ControlsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 0.9rem;
`;

const BreadcrumbItem = styled.span`
  &:after {
    content: '>';
    margin-left: 8px;
  }
  
  &:last-child:after {
    content: '';
  }
`;

const CheckboxInput = styled.input`
  transform: scale(1.2);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1400px;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 15px 8px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 0.8rem;
  white-space: nowrap;
  min-width: 120px;
`;

const SortableHeader = styled(Th)`
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: #e9ecef;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }
`;

const Td = styled.td`
  padding: 15px 8px;
  color: #495057;
  font-size: 0.85rem;
  white-space: nowrap;
  border-right: 1px solid #f1f3f4;
  
  &:last-child {
    border-right: none;
  }
`;

const SignatureCell = styled(Td)`
  text-align: center;
  font-style: italic;
  color: #6c757d;
`;

const SendButton = styled.button`
  border: 1px solid rgb(51, 66, 147);
  color: rgb(51, 66, 147);
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const StudentProgressReport = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { confirmState, showDeleteConfirm } = useConfirm();

  const [formData, setFormData] = useState({
    course_id: '',
    session_id: '',
    student_id: '',
    instructor_id: '',
    type_of_progress_report: '',
    date_of_report: new Date().toISOString().split('T')[0],
    problem_area: '',
    student_goals: '',
    conference_with_spencer: '',
    comments: '',
    date_given_to_student: '',
    date_sent_to_case_manager: '',
    instructor_signature: '',
    status: 'Draft'
  });

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getStudentProgressReports();
      if (response.success) {
        setReportsData(response.reports);
      } else {
        setError('Failed to fetch reports');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Error fetching reports');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (report = null) => {
    if (report) {
      setEditingReport(report);
      // Format the date properly for editing
      let formattedDate = report.date_of_report;
      if (report.date_of_report && report.date_of_report.includes('T')) {
        formattedDate = report.date_of_report.split('T')[0];
      }
      
      setFormData({
        course_id: report.course_id || '',
        session_id: report.session_id || '',
        student_id: report.student_id || '',
        instructor_id: report.instructor_id || '',
        type_of_progress_report: report.type_of_progress_report || '',
        date_of_report: formattedDate || new Date().toISOString().split('T')[0],
        problem_area: report.problem_area || '',
        student_goals: report.student_goals || '',
        conference_with_spencer: report.conference_with_spencer || '',
        comments: report.comments || '',
        date_given_to_student: report.date_given_to_student || '',
        date_sent_to_case_manager: report.date_sent_to_case_manager || '',
        instructor_signature: report.instructor_signature || '',
        status: report.status || 'Draft'
      });
    } else {
      setEditingReport(null);
      setFormData({
        course_id: '',
        session_id: '',
        student_id: '',
        instructor_id: '',
        type_of_progress_report: '',
        date_of_report: new Date().toISOString().split('T')[0],
        problem_area: '',
        student_goals: '',
        conference_with_spencer: '',
        comments: '',
        date_given_to_student: '',
        date_sent_to_case_manager: '',
        instructor_signature: '',
        status: 'Draft'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReport(null);
    setFormData({
      course_id: '',
      session_id: '',
      student_id: '',
      instructor_id: '',
      type_of_progress_report: '',
      date_of_report: new Date().toISOString().split('T')[0],
      problem_area: '',
      student_goals: '',
      conference_with_spencer: '',
      comments: '',
      date_given_to_student: '',
      date_sent_to_case_manager: '',
      instructor_signature: '',
      status: 'Draft'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingReport) {
        // Update existing report
        const response = await updateStudentProgressReport(editingReport.id, formData);
        if (response.success) {
          showSuccess('Report updated successfully!');
          fetchReports();
          closeModal();
        } else {
          showError('Failed to update report');
        }
      } else {
        // Create new report
        const response = await createStudentProgressReport(formData);
        if (response.success) {
          showSuccess('Report created successfully!');
          fetchReports();
          closeModal();
        } else {
          showError('Failed to create report');
        }
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      showError('Error submitting report');
    }
  };

  const handleDelete = async (reportId) => {
    const confirmed = await showDeleteConfirm('report', 'report');
    if (!confirmed) return;

    try {
      const response = await deleteStudentProgressReport(reportId);
      if (response.success) {
        showSuccess('Report deleted successfully!');
        fetchReports();
      } else {
        showError('Failed to delete report');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      showError('Error deleting report');
    }
  };

  const handleReset = () => {
    setFormData({
      course_id: '',
      session_id: '',
      student_id: '',
      instructor_id: '',
      type_of_progress_report: '',
      date_of_report: new Date().toISOString().split('T')[0],
      problem_area: '',
      student_goals: '',
      conference_with_spencer: '',
      comments: '',
      date_given_to_student: '',
      date_sent_to_case_manager: '',
      instructor_signature: '',
      status: 'Draft'
    });
  };

  const clearSignature = () => {
    setFormData(prev => ({
      ...prev,
      instructor_signature: ''
    }));
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Loading reports...</h3>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          <h3>Error: {error}</h3>
          <button onClick={fetchReports}>Retry</button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Student Progress Report</Title>
        <ActionButtons>
          <IconButton>
            <FaSearch />
          </IconButton>
          <AddButton onClick={() => openModal()}>
            <FaPlus />
          </AddButton>
          <IconButton>
            <FaList />
          </IconButton>
        </ActionButtons>
      </Header>

      <ReportContainer>
        <TableControls>
          <ControlsLeft>
            <CheckboxInput type="checkbox" />
            <BreadcrumbNav>
              <BreadcrumbItem>Home</BreadcrumbItem>
              <BreadcrumbItem>Student Progress Report</BreadcrumbItem>
            </BreadcrumbNav>
          </ControlsLeft>
        </TableControls>

        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <SortableHeader>Date</SortableHeader>
                <SortableHeader>Student Name</SortableHeader>
                <SortableHeader>Course</SortableHeader>
                <SortableHeader>Session</SortableHeader>
                <SortableHeader>Type</SortableHeader>
                <SortableHeader>Problem Area</SortableHeader>
                <SortableHeader>Student Goals</SortableHeader>
                <SortableHeader>Conference with Spencer</SortableHeader>
                <SortableHeader>Date Given</SortableHeader>
                <SortableHeader>Date for Case Manager</SortableHeader>
                <SortableHeader>Status</SortableHeader>
                <SortableHeader style={{textAlign: 'center'}}>Actions</SortableHeader>
              </Tr>
            </Thead>
            <Tbody>
              {reportsData.length === 0 ? (
                <Tr>
                  <Td colSpan="12" style={{ textAlign: 'center', padding: '50px' }}>
                    No reports found. Click the + button to add a new report.
                  </Td>
                </Tr>
              ) : (
                reportsData.map((report) => (
                  <Tr key={report.id}>
                    <Td>{new Date(report.date_of_report).toLocaleDateString()}</Td>
                    <Td>{report.student_name || 'N/A'}</Td>
                    <Td>{report.course_name || 'N/A'}</Td>
                    <Td>{report.session_name || 'N/A'}</Td>
                    <Td>{report.type_of_progress_report || 'N/A'}</Td>
                    <Td>{report.problem_area || 'N/A'}</Td>
                    <Td>{report.student_goals || 'N/A'}</Td>
                    <Td>{report.conference_with_spencer || 'N/A'}</Td>
                    <Td>{report.date_given_to_student ? new Date(report.date_given_to_student).toLocaleDateString() : 'N/A'}</Td>
                    <Td>{report.date_sent_to_case_manager ? new Date(report.date_sent_to_case_manager).toLocaleDateString() : 'N/A'}</Td>
                    <Td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: report.status === 'Approved' ? '#d4edda' : 
                                       report.status === 'Submitted' ? '#fff3cd' : 
                                       report.status === 'Reviewed' ? '#cce5ff' : '#f8d7da',
                        color: report.status === 'Approved' ? '#155724' : 
                               report.status === 'Submitted' ? '#856404' : 
                               report.status === 'Reviewed' ? '#004085' : '#721c24'
                      }}>
                        {report.status}
                      </span>
                    </Td>
                    <Td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <IconButton
                          onClick={() => openModal(report)}
                          style={{ padding: '6px', fontSize: '0.8rem' }}
                          title="Edit"
                        >
                          <FaEdit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(report.id)}
                          style={{ padding: '6px', fontSize: '0.8rem', color: '#dc3545' }}
                          title="Delete"
                        >
                          <FaTrash />
                        </IconButton>
                      </div>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableWrapper>
      </ReportContainer>

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingReport ? 'Edit Student Progress Report' : 'Add Student Progress Report'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <LeftColumn>
                    <FormGroup>
                      <Label required>Course</Label>
                      <CourseSelect
                        value={formData.course_id}
                        onChange={(value) => handleSelectChange('course_id', value)}
                        placeholder="Select course"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label required>Session</Label>
                      <SessionSelect
                        value={formData.session_id}
                        onChange={(value) => handleSelectChange('session_id', value)}
                        placeholder="Select session"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label required>Student</Label>
                      <StudentSelect
                        value={formData.student_id}
                        onChange={(value) => handleSelectChange('student_id', value)}
                        placeholder="Select student"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Instructor</Label>
                      <InstructorSelect
                        value={formData.instructor_id}
                        onChange={(value) => handleSelectChange('instructor_id', value)}
                        placeholder="Select instructor"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label required>Type of Progress Report</Label>
                      <Select
                        name="type_of_progress_report"
                        value={formData.type_of_progress_report}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Biweekly">Biweekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Mid-term">Mid-term</option>
                        <option value="Final">Final</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label required>Date of Report</Label>
                      <Input
                        type="date"
                        name="date_of_report"
                        value={formData.date_of_report}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Status</Label>
                      <Select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="Draft">Draft</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Approved">Approved</option>
                      </Select>
                    </FormGroup>
                  </LeftColumn>

                  <RightColumn>
                    <FormGroup>
                      <Label>Problem Area</Label>
                      <TextArea
                        name="problem_area"
                        value={formData.problem_area}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Describe any problem areas"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Student Goals</Label>
                      <TextArea
                        name="student_goals"
                        value={formData.student_goals}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Enter student goals"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Conference with Spencer</Label>
                      <TextArea
                        name="conference_with_spencer"
                        value={formData.conference_with_spencer}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Notes from conference with Spencer"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Comments</Label>
                      <TextArea
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Additional comments"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Date Given to Student</Label>
                      <Input
                        type="date"
                        name="date_given_to_student"
                        value={formData.date_given_to_student}
                        onChange={handleInputChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Date Sent to Case Manager</Label>
                      <Input
                        type="date"
                        name="date_sent_to_case_manager"
                        value={formData.date_sent_to_case_manager}
                        onChange={handleInputChange}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Instructor Signature</Label>
                      <SignatureContainer>
                        <SignatureArea>
                          {formData.instructor_signature || 'Draw your signature'}
                        </SignatureArea>
                        <SignatureControls>
                          <ClearButton type="button" onClick={clearSignature}>
                            Clear
                          </ClearButton>
                        </SignatureControls>
                      </SignatureContainer>
                    </FormGroup>
                  </RightColumn>
                </FormGrid>

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit">
                    {editingReport ? 'Update' : 'Submit'}
                  </SubmitButton>
                </ButtonGroup>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      <CustomConfirm
        isOpen={confirmState.isOpen}
        onClose={confirmState.onCancel}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        details={confirmState.details}
        itemName={confirmState.itemName}
      />
    </Container>
  );
};

export default StudentProgressReport; 