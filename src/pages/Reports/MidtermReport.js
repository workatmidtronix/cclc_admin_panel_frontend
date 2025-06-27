import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaList, FaTimes, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { CourseSelect, SessionSelect, StudentSelect, InstructorSelect } from '../../components/MasterDataSelect';
import { getMidtermReports, createMidtermReport, updateMidtermReport, deleteMidtermReport } from '../../utils/midtermReportsApi';
import { useConfirm } from '../../components/useConfirm';
import CustomConfirm from '../../components/CustomConfirm';
import { showSuccess, showError } from '../../components/CustomAlert';
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
  max-width: 900px;
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

const PercentageWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PercentageInput = styled(Input)`
  padding-right: 40px;
`;

const PercentageSymbol = styled.span`
  position: absolute;
  right: 15px;
  color: #6c757d;
  font-weight: 600;
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 0.85rem;
  white-space: nowrap;
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
  padding: 15px 12px;
  color: #495057;
  font-size: 0.9rem;
  vertical-align: top;
`;

const ScoreCell = styled(Td)`
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
`;

const MidtermReport = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { confirmState, showDeleteConfirm } = useConfirm();

  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    session_id: '',
    instructor_id: '',
    report_date: new Date().toISOString().split('T')[0],
    midterm_score: '',
    total_possible_score: '',
    percentage_score: '',
    grade_letter: '',
    attendance_score: '',
    participation_score: '',
    assignment_score: '',
    quiz_score: '',
    lab_score: '',
    comments: '',
    recommendations: '',
    instructor_signature: '',
    student_signature: '',
    status: 'Draft'
  });

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getMidtermReports();
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
      // Format the report_date properly for editing
      let formattedDate = report.report_date;
      if (report.report_date && report.report_date.includes('T')) {
        formattedDate = report.report_date.split('T')[0];
      }
      
      setFormData({
        student_id: report.student_id || '',
        course_id: report.course_id || '',
        session_id: report.session_id || '',
        instructor_id: report.instructor_id || '',
        report_date: formattedDate || new Date().toISOString().split('T')[0],
        midterm_score: report.midterm_score || '',
        total_possible_score: report.total_possible_score || '',
        percentage_score: report.percentage_score || '',
        grade_letter: report.grade_letter || '',
        attendance_score: report.attendance_score || '',
        participation_score: report.participation_score || '',
        assignment_score: report.assignment_score || '',
        quiz_score: report.quiz_score || '',
        lab_score: report.lab_score || '',
        comments: report.comments || '',
        recommendations: report.recommendations || '',
        instructor_signature: report.instructor_signature || '',
        student_signature: report.student_signature || '',
        status: report.status || 'Draft'
      });
    } else {
      setEditingReport(null);
      setFormData({
        student_id: '',
        course_id: '',
        session_id: '',
        instructor_id: '',
        report_date: new Date().toISOString().split('T')[0],
        midterm_score: '',
        total_possible_score: '',
        percentage_score: '',
        grade_letter: '',
        attendance_score: '',
        participation_score: '',
        assignment_score: '',
        quiz_score: '',
        lab_score: '',
        comments: '',
        recommendations: '',
        instructor_signature: '',
        student_signature: '',
        status: 'Draft'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingReport(null);
    setFormData({
      student_id: '',
      course_id: '',
      session_id: '',
      instructor_id: '',
      report_date: new Date().toISOString().split('T')[0],
      midterm_score: '',
      total_possible_score: '',
      percentage_score: '',
      grade_letter: '',
      attendance_score: '',
      participation_score: '',
      assignment_score: '',
      quiz_score: '',
      lab_score: '',
      comments: '',
      recommendations: '',
      instructor_signature: '',
      student_signature: '',
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
        const response = await updateMidtermReport(editingReport.id, formData);
        if (response.success) {
          showSuccess('Report updated successfully!');
          fetchReports();
          closeModal();
        } else {
          showError('Failed to update report');
        }
      } else {
        // Create new report
        const response = await createMidtermReport(formData);
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
      const response = await deleteMidtermReport(reportId);
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
      student_id: '',
      course_id: '',
      session_id: '',
      instructor_id: '',
      report_date: new Date().toISOString().split('T')[0],
      midterm_score: '',
      total_possible_score: '',
      percentage_score: '',
      grade_letter: '',
      attendance_score: '',
      participation_score: '',
      assignment_score: '',
      quiz_score: '',
      lab_score: '',
      comments: '',
      recommendations: '',
      instructor_signature: '',
      student_signature: '',
      status: 'Draft'
    });
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
        <Title>Mid-Term Progress Report</Title>
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
              <BreadcrumbItem>Mid-Term Progress Report</BreadcrumbItem>
            </BreadcrumbNav>
          </ControlsLeft>
        </TableControls>

        <Table>
          <Thead>
            <Tr>
              <SortableHeader>Date</SortableHeader>
              <SortableHeader>Student Name</SortableHeader>
              <SortableHeader>Course</SortableHeader>
              <SortableHeader>Session</SortableHeader>
              <SortableHeader>Midterm Score</SortableHeader>
              <SortableHeader>Percentage</SortableHeader>
              <SortableHeader>Status</SortableHeader>
              <SortableHeader style={{textAlign: 'center'}}>Actions</SortableHeader>
            </Tr>
          </Thead>
          <Tbody>
            {reportsData.length === 0 ? (
              <Tr>
                <Td colSpan="8" style={{ textAlign: 'center', padding: '50px' }}>
                  No reports found. Click the + button to add a new report.
                </Td>
              </Tr>
            ) : (
              reportsData.map((report) => (
                <Tr key={report.id}>
                  <Td>{new Date(report.report_date).toLocaleDateString()}</Td>
                  <Td>{report.student_name || 'N/A'}</Td>
                  <Td>{report.course_name || 'N/A'}</Td>
                  <Td>{report.session_name || 'N/A'}</Td>
                  <ScoreCell>
                    {report.midterm_score ? `${report.midterm_score}/${report.total_possible_score || 'N/A'}` : 'N/A'}
                  </ScoreCell>
                  <Td>{report.percentage_score ? `${report.percentage_score}%` : 'N/A'}</Td>
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
      </ReportContainer>

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingReport ? 'Edit Mid-Term Progress Report' : 'Add Mid-Term Progress Report'}
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
                      <Label required>Student</Label>
                      <StudentSelect
                        value={formData.student_id}
                        onChange={(value) => handleSelectChange('student_id', value)}
                        placeholder="Select student"
                      />
                    </FormGroup>

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
                      <Label>Instructor</Label>
                      <InstructorSelect
                        value={formData.instructor_id}
                        onChange={(value) => handleSelectChange('instructor_id', value)}
                        placeholder="Select instructor"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label required>Report Date</Label>
                      <Input
                        type="date"
                        name="report_date"
                        value={formData.report_date}
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
                      <Label>Midterm Score</Label>
                      <Input
                        type="number"
                        step="0.01"
                        name="midterm_score"
                        value={formData.midterm_score}
                        onChange={handleInputChange}
                        placeholder="Enter score"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Total Possible Score</Label>
                      <Input
                        type="number"
                        step="0.01"
                        name="total_possible_score"
                        value={formData.total_possible_score}
                        onChange={handleInputChange}
                        placeholder="Enter total possible score"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Percentage Score</Label>
                      <PercentageWrapper>
                        <PercentageInput
                          type="number"
                          step="0.01"
                          name="percentage_score"
                          value={formData.percentage_score}
                          onChange={handleInputChange}
                          placeholder="Enter percentage"
                        />
                        <PercentageSymbol>%</PercentageSymbol>
                      </PercentageWrapper>
                    </FormGroup>

                    <FormGroup>
                      <Label>Grade Letter</Label>
                      <Select
                        name="grade_letter"
                        value={formData.grade_letter}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Grade</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="F">F</option>
                      </Select>
                    </FormGroup>

                    <FormGroup>
                      <Label>Attendance Score</Label>
                      <Input
                        type="number"
                        step="0.01"
                        name="attendance_score"
                        value={formData.attendance_score}
                        onChange={handleInputChange}
                        placeholder="Enter attendance score"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Participation Score</Label>
                      <Input
                        type="number"
                        step="0.01"
                        name="participation_score"
                        value={formData.participation_score}
                        onChange={handleInputChange}
                        placeholder="Enter participation score"
                      />
                    </FormGroup>
                  </RightColumn>
                </FormGrid>

                <FormGrid>
                  <LeftColumn>
                    <FormGroup>
                      <Label>Assignment Score</Label>
                      <Input
                        type="number"
                        step="0.01"
                        name="assignment_score"
                        value={formData.assignment_score}
                        onChange={handleInputChange}
                        placeholder="Enter assignment score"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Quiz Score</Label>
                      <Input
                        type="number"
                        step="0.01"
                        name="quiz_score"
                        value={formData.quiz_score}
                        onChange={handleInputChange}
                        placeholder="Enter quiz score"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Lab Score</Label>
                      <Input
                        type="number"
                        step="0.01"
                        name="lab_score"
                        value={formData.lab_score}
                        onChange={handleInputChange}
                        placeholder="Enter lab score"
                      />
                    </FormGroup>
                  </LeftColumn>

                  <RightColumn>
                    <FormGroup>
                      <Label>Comments</Label>
                      <TextArea
                        name="comments"
                        value={formData.comments}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Enter comments about the student's performance"
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label>Recommendations</Label>
                      <TextArea
                        name="recommendations"
                        value={formData.recommendations}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Enter recommendations for improvement"
                      />
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

export default MidtermReport; 