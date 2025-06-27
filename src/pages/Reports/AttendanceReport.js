import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { FaCalendarAlt, FaSearch, FaPlus, FaList, FaTimes, FaFileAlt, FaExclamationCircle, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useMasterData } from '../../hooks/useMasterData';
import { CourseSelect, SessionSelect, StudentSelect, InstructorSelect } from '../../components/MasterDataSelect';
import { showSuccess, showError } from '../../components/CustomAlert';
import { useConfirm } from '../../components/useConfirm';
import CustomConfirm from '../../components/CustomConfirm';
import { 
  getAttendanceReports, 
  createAttendanceReport, 
  updateAttendanceReport, 
  deleteAttendanceReport 
} from '../../utils/attendanceReportsApi';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

const MainContent = styled.div`
  flex: 1;
  transition: all 0.3s ease;
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
  background: white;
  border: 1px solid #e9ecef;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  color: #495057;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f3f5;
    color: #2c3e50;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
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

const CourseBadge = styled.div`
  background: white;
  padding: 15px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  display: inline-flex;
  align-items: center;
  gap: 15px;
`;

const CourseTag = styled.span`
  background: #28a745;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const CourseText = styled.span`
  color: #2c3e50;
  font-weight: 500;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const StudentCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0, 0.07);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0,0,0, 0.1);
  }

  ${({ selected }) => selected && `
    border-color: rgb(51, 66, 147);
    box-shadow: 0 12px 35px rgba(51, 66, 147, 0.2);
    transform: translateY(-5px);
  `}
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
`;

const CardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const DeleteButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
`;

const CalendarIcon = styled.div`
  background: rgba(51, 66, 147, 0.1);
  color: rgb(51, 66, 147);
  padding: 18px;
  border-radius: 50%;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const CourseInfo = styled.div`
  margin-bottom: 15px;
`;

const StudentName = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
`;

const CourseLabel = styled.span`
  background: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const AttendanceDetails = styled.div`
  color: #495057;
  font-size: 0.9rem;
  line-height: 1.5;
`;

// Detail Panel Styles
const DetailPanel = styled.div`
  width: 500px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 30px;
  height: fit-content;
  max-height: calc(100vh - 60px);
  overflow-y: auto;
  transition: all 0.3s ease;
  transform: ${props => props.show ? 'translateX(0)' : 'translateX(100%)'};
  opacity: ${props => props.show ? '1' : '0'};
  animation: ${fadeIn} 0.5s ease;
`;

const DetailHeader = styled.div`
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 15px 15px 0 0;
`;

const DetailTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  
  &:hover {
    background: #e9ecef;
    color: #2c3e50;
  }
`;

const DetailBody = styled.div`
  padding: 30px;
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
`;

const DetailLabel = styled.div`
  width: 140px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
  flex-shrink: 0;
`;

const DetailValue = styled.div`
  flex: 1;
  color: #495057;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const CourseTagDetail = styled.span`
  background: #28a745;
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
`;

const DecisionText = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid rgb(51, 66, 147);;
  line-height: 1.6;
  color: #495057;
  margin: 15px 0;
`;

const SignatureImage = styled.div`
  margin-top: 10px;
  padding: 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  text-align: center;
  font-style: italic;
  color: #6c757d;
`;

const ReportLink = styled.a`
  color: rgb(51, 66, 147);;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const DocumentId = styled.div`
  font-family: 'Courier New', monospace;
  color: #495057;
  font-size: 0.9rem;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  color: #6c757d;
  margin-top: 30px;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #adb5bd;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  color: #495057;
  margin-bottom: 10px;
`;

const EmptyStateText = styled.p`
  max-width: 400px;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const AddReportButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgb(45, 58, 130);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(51, 66, 147, 0.3);
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
  max-width: 800px;
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

const ModalCloseButton = styled.button`
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  
  ${props => props.fullWidth && `
    grid-column: 1 / -1;
  `}
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  &:after {
    content: ${props => props.required ? '" *"' : '""'};
    color: #dc3545;
  }
`;

const FormInput = styled.input`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(51, 66, 147, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const FormSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
  }
`;

const FormTextArea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(51, 66, 147, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const SignatureArea = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  min-height: 100px;
  padding: 15px;
  background: #fafafa;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-style: italic;
`;

const ClearSignatureButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: 1px solid #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #6c757d;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
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
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgb(40, 53, 120);
    transform: translateY(-1px);
  }
`;

const ResetButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #545b62;
    transform: translateY(-1px);
  }
`;

const ActionButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
`;

const AttendanceReport = () => {
  const { courses, sessions, instructors } = useMasterData();
  const { confirmState, showDeleteConfirm } = useConfirm();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    course_id: '',
    session_id: '',
    student_id: '',
    instructor_id: '',
    report_date: new Date().toISOString().split('T')[0],
    absent_count: '',
    absent_with_excuse: '',
    absent_without_excuse: '',
    date_time1: '',
    date_time2: '',
    date_time3: '',
    decision: '',
    instructor_signature: '',
    report_status: 'Draft',
    notes: ''
  });
  const [reportsData, setReportsData] = useState([]);

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getAttendanceReports();
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

  const handleCardClick = (student) => {
    setSelectedStudent(student);
  };

  const closeDetailPanel = () => {
    setSelectedStudent(null);
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
        course_id: report.course_id || '',
        session_id: report.session_id || '',
        student_id: report.student_id || '',
        instructor_id: report.instructor_id || '',
        report_date: formattedDate || new Date().toISOString().split('T')[0],
        absent_count: report.absent_count || '',
        absent_with_excuse: report.absent_with_excuse || '',
        absent_without_excuse: report.absent_without_excuse || '',
        date_time1: report.date_time1 || '',
        date_time2: report.date_time2 || '',
        date_time3: report.date_time3 || '',
        decision: report.decision || '',
        instructor_signature: report.instructor_signature || '',
        report_status: report.report_status || 'Draft',
        notes: report.notes || ''
      });
    } else {
      setEditingReport(null);
      setFormData({
        course_id: '',
        session_id: '',
        student_id: '',
        instructor_id: '',
        report_date: new Date().toISOString().split('T')[0],
        absent_count: '',
        absent_with_excuse: '',
        absent_without_excuse: '',
        date_time1: '',
        date_time2: '',
        date_time3: '',
        decision: '',
        instructor_signature: '',
        report_status: 'Draft',
        notes: ''
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
      report_date: new Date().toISOString().split('T')[0],
      absent_count: '',
      absent_with_excuse: '',
      absent_without_excuse: '',
      date_time1: '',
      date_time2: '',
      date_time3: '',
      decision: '',
      instructor_signature: '',
      report_status: 'Draft',
      notes: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingReport) {
        // Update existing report
        const response = await updateAttendanceReport(editingReport.id, formData);
        if (response.success) {
          showSuccess('Attendance report updated successfully!');
          fetchReports();
          closeModal();
        } else {
          showError('Failed to update attendance report');
        }
      } else {
        // Create new report
        const response = await createAttendanceReport(formData);
        if (response.success) {
          showSuccess('Attendance report created successfully!');
          fetchReports();
          closeModal();
        } else {
          showError('Failed to create attendance report');
        }
      }
    } catch (error) {
      console.error('Error submitting attendance report:', error);
      showError('Error submitting attendance report');
    }
  };

  const handleReset = () => {
    setFormData({
      course_id: '',
      session_id: '',
      student_id: '',
      instructor_id: '',
      report_date: new Date().toISOString().split('T')[0],
      absent_count: '',
      absent_with_excuse: '',
      absent_without_excuse: '',
      date_time1: '',
      date_time2: '',
      date_time3: '',
      decision: '',
      instructor_signature: '',
      report_status: 'Draft',
      notes: ''
    });
  };

  const clearSignature = () => {
    setFormData(prev => ({
      ...prev,
      instructor_signature: ''
    }));
  };

  const handleDelete = async (reportId, e) => {
    e.stopPropagation(); // Prevent card click
    const confirmed = await showDeleteConfirm('attendance report', 'attendance report');
    if (!confirmed) return;

    try {
      const response = await deleteAttendanceReport(reportId);
      if (response.success) {
        showSuccess('Attendance report deleted successfully');
        fetchReports();
      } else {
        showError('Failed to delete attendance report');
      }
    } catch (err) {
      console.error('Error deleting attendance report:', err);
      showError('Error deleting attendance report');
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3>Loading attendance reports...</h3>
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
        <Title>Absenteeism / Attendance Progress Report</Title>
        <ActionButtons>
          <IconButton><FaSearch /></IconButton>
          <AddButton onClick={openModal}><FaPlus /></AddButton>
          <IconButton><FaList /></IconButton>
        </ActionButtons>
      </Header>

      <ContentWrapper>
        <MainContent>
          {reportsData.length > 0 ? (
            <>
              <CourseBadge>
                <CourseTag>EKG</CourseTag>
                <CourseText>Saturday EKG Dr. Fernando II Soto Avellanez 08/24/2023 @ Evergreen</CourseText>
              </CourseBadge>

              <ReportsGrid>
                {reportsData.map((report) => (
                  <StudentCard
                    key={report.id}
                    selected={selectedStudent?.id === report.id}
                    onClick={() => handleCardClick(report)}
                  >
                    <CardHeader>
                      <CalendarIcon>
                        <FaCalendarAlt size={20} />
                      </CalendarIcon>
                      <CourseInfo>
                        <StudentName>{report.student_name}</StudentName>
                        <CourseLabel>{report.course_name}</CourseLabel>
                      </CourseInfo>
                      <CardActions>
                        <ActionButton onClick={(e) => { e.stopPropagation(); openModal(report); }}>
                          <FaEdit />
                        </ActionButton>
                        <DeleteButton onClick={(e) => handleDelete(report.id, e)}>
                          <FaTrash />
                        </DeleteButton>
                      </CardActions>
                    </CardHeader>

                    <CardContent>
                      <AttendanceDetails>
                        <strong>Session:</strong> {report.session_name}<br />
                        <strong>Absent Count:</strong> {report.absent_count}<br />
                        <strong>Status:</strong> {report.report_status}<br />
                        <strong>Date:</strong> {new Date(report.report_date).toLocaleDateString()}
                      </AttendanceDetails>
                    </CardContent>
                  </StudentCard>
                ))}
              </ReportsGrid>
            </>
          ) : (
            <EmptyStateContainer>
              <EmptyStateIcon><FaExclamationCircle /></EmptyStateIcon>
              <EmptyStateTitle>No Reports Found</EmptyStateTitle>
              <EmptyStateText>
                There are currently no absenteeism or attendance progress reports to display.
                Create a new report to get started.
              </EmptyStateText>
              <AddReportButton onClick={openModal}>
                <FaPlus /> Create New Report
              </AddReportButton>
            </EmptyStateContainer>
          )}
        </MainContent>

        {selectedStudent && (
          <DetailPanel show={!!selectedStudent}>
            <DetailHeader>
              <DetailTitle>Report Details</DetailTitle>
              <CloseButton onClick={closeDetailPanel}>
                <FaTimes />
              </CloseButton>
            </DetailHeader>

            <DetailBody>
              <DetailRow>
                <DetailLabel>Course</DetailLabel>
                <DetailValue>
                  <CourseTagDetail>{selectedStudent.fullDetails.course}</CourseTagDetail>
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Session</DetailLabel>
                <DetailValue>{selectedStudent.fullDetails.session}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Student Name</DetailLabel>
                <DetailValue>{selectedStudent.fullDetails.studentName}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>No. of Absent w/wo excuse</DetailLabel>
                <DetailValue>{selectedStudent.fullDetails.absentCount}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Date-Time 1</DetailLabel>
                <DetailValue>{selectedStudent.fullDetails.dateTime1}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Date-Time 2</DetailLabel>
                <DetailValue>{selectedStudent.fullDetails.dateTime2}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Date-Time 3</DetailLabel>
                <DetailValue>{selectedStudent.fullDetails.dateTime3 || "-"}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Decision</DetailLabel>
                <DetailValue>
                  <DecisionText>{selectedStudent.fullDetails.decision}</DecisionText>
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Instructor Signature</DetailLabel>
                <DetailValue>
                  <SignatureImage>
                    [Instructor Signature]
                  </SignatureImage>
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Date</DetailLabel>
                <DetailValue>{selectedStudent.fullDetails.date}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Report</DetailLabel>
                <DetailValue>
                  <ReportLink href="#" download>
                    <FaFileAlt />
                    {selectedStudent.fullDetails.reportLink}
                  </ReportLink>
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Document ID</DetailLabel>
                <DetailValue>
                  <DocumentId>{selectedStudent.fullDetails.documentId}</DocumentId>
                </DetailValue>
              </DetailRow>
            </DetailBody>
          </DetailPanel>
        )}
      </ContentWrapper>

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingReport ? 'Edit Attendance Report' : 'Add Attendance Report'}</ModalTitle>
              <ModalCloseButton onClick={closeModal}>
                <FaTimes />
              </ModalCloseButton>
            </ModalHeader>

            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormRow>
                  <FormGroup>
                    <FormLabel required>Course</FormLabel>
                    <CourseSelect
                      value={formData.course_id}
                      onChange={(value) => handleInputChange('course_id', value)}
                      placeholder="Select course"
                      isClearable={false}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Instructor</FormLabel>
                    <InstructorSelect
                      value={formData.instructor_id}
                      onChange={(value) => handleInputChange('instructor_id', value)}
                      placeholder="Select instructor"
                      isClearable={false}
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <FormLabel>No. of Absent w/wo excuse</FormLabel>
                    <FormInput
                      type="text"
                      name="absent_count"
                      value={formData.absent_count}
                      onChange={(e) => handleInputChange('absent_count', e.target.value)}
                      placeholder="#######"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Absent with Excuse</FormLabel>
                    <FormInput
                      type="number"
                      name="absent_with_excuse"
                      value={formData.absent_with_excuse}
                      onChange={(e) => handleInputChange('absent_with_excuse', e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <FormLabel>Absent without Excuse</FormLabel>
                    <FormInput
                      type="number"
                      name="absent_without_excuse"
                      value={formData.absent_without_excuse}
                      onChange={(e) => handleInputChange('absent_without_excuse', e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Report Status</FormLabel>
                    <FormSelect
                      name="report_status"
                      value={formData.report_status}
                      onChange={(e) => handleInputChange('report_status', e.target.value)}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Approved">Approved</option>
                    </FormSelect>
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <FormLabel required>Session</FormLabel>
                    <SessionSelect
                      value={formData.session_id}
                      onChange={(value) => handleInputChange('session_id', value)}
                      placeholder="Select session"
                      isClearable={false}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Date-Time 1</FormLabel>
                    <FormInput
                      type="datetime-local"
                      name="date_time1"
                      value={formData.date_time1}
                      onChange={(e) => handleInputChange('date_time1', e.target.value)}
                      placeholder="MM/dd/yyyy hh:mm:ss AM"
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <FormLabel required>Student Name</FormLabel>
                    <StudentSelect
                      value={formData.student_id}
                      onChange={(value) => handleInputChange('student_id', value)}
                      placeholder="Select student"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Date-Time 2</FormLabel>
                    <FormInput
                      type="datetime-local"
                      name="date_time2"
                      value={formData.date_time2}
                      onChange={(e) => handleInputChange('date_time2', e.target.value)}
                      placeholder="MM/dd/yyyy hh:mm:ss AM"
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <FormLabel>Date</FormLabel>
                    <FormInput
                      type="date"
                      name="report_date"
                      value={formData.report_date}
                      onChange={(e) => handleInputChange('report_date', e.target.value)}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Date-Time 3</FormLabel>
                    <FormInput
                      type="datetime-local"
                      name="date_time3"
                      value={formData.date_time3}
                      onChange={(e) => handleInputChange('date_time3', e.target.value)}
                      placeholder="MM/dd/yyyy hh:mm:ss AM"
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <FormLabel>Instructor Signature</FormLabel>
                    <SignatureArea>
                      {formData.instructor_signature ? formData.instructor_signature : 'Draw your signature'}
                      <ClearSignatureButton type="button" onClick={clearSignature}>
                        Clear
                      </ClearSignatureButton>
                    </SignatureArea>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Decision</FormLabel>
                    <FormTextArea
                      name="decision"
                      value={formData.decision}
                      onChange={(e) => handleInputChange('decision', e.target.value)}
                      placeholder="Enter decision details..."
                    />
                  </FormGroup>
                </FormRow>

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

export default AttendanceReport; 