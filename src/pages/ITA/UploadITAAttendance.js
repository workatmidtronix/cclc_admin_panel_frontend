import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaList, FaDownload, FaFile, FaTimes, FaUpload, FaFilter, FaBook, FaRegCalendarAlt } from 'react-icons/fa';
import { itaAttendanceSignedApi } from '../../utils/itaApi';
import { SessionSelect, StudentSelect, CourseSelect } from '../../components/MasterDataSelect';
import { showSuccess, showError } from '../../components/CustomAlert';
import axios from 'axios';

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
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

const AddButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
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
  max-width: 500px;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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
  border: 1px solid ${props => props.primary ? '#007bff' : '#e9ecef'};
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;
  ${props => props.primary && 'box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);'}
  
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
`;

const FileUploadContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const FileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileUploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  font-size: 0.9rem;
  width: 100%;
  justify-content: flex-start;
  
  &:hover {
    background: #f8f9fa;
    border-color: rgb(51, 66, 147);
  }
`;

const UploadIcon = styled.div`
  color: #007bff;
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

const ITAContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const SessionSelector = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DropdownSelect = styled.select`
  background: white;
  color: black;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const ShowingInfo = styled.div`
  background: #f8f9fa;
  padding: 10px 20px;
  border-bottom: 1px solid #e9ecef;
  color: #6c757d;
  font-size: 0.9rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #2c3e50;
  color: white;
`;

const Th = styled.th`
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  border-right: 1px solid #34495e;
  
  &:last-child {
    border-right: none;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }
  
  border-bottom: 1px solid #e9ecef;
`;

const Td = styled.td`
  padding: 15px 20px;
  color: #495057;
  font-size: 0.95rem;
  border-right: 1px solid #e9ecef;
  
  &:last-child {
    border-right: none;
  }
`;

const CheckboxInput = styled.input`
  transform: scale(1.2);
`;

const DocumentLink = styled.a`
  color: rgb(51, 66, 147);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SSNText = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #6c757d;
  font-size: 1.1rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #dc3545;
  font-size: 1.1rem;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #6c757d;
  font-size: 1.1rem;
  text-align: center;
`;

const StudentListContainer = styled.div`
  margin-top: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
`;

const StudentListHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
`;

const StudentItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const StudentName = styled.span`
  font-weight: 500;
  color: #2c3e50;
`;

const AttendanceSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 2px rgba(51, 66, 147, 0.1);
  }
`;

const UploadAttendanceButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(51, 66, 147, 0.3);
  }
`;

const InfoText = styled.p`
  text-align: center;
  color: #6c757d;
  padding: 2rem;
  background: #f1f3f5;
  border-radius: 8px;
  margin-top: 1rem;
`;

const LoadingText = styled(InfoText)``;

const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SelectGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SelectIcon = styled.div`
  position: absolute;
  left: 15px;
  color: #adb5bd;
  z-index: 1;
`;

const UploadITAAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [formData, setFormData] = useState({
    ita_master_id: '',
    student_id: '',
    session_date: '',
    start_time: '',
    end_time: '',
    hours_completed: '',
    student_signature: '',
    notes: ''
  });

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedSession) {
      fetchStudentsForCourseAndSession();
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [selectedCourse, selectedSession]);

  const fetchStudentsForCourseAndSession = async () => {
    try {
      setLoadingStudents(true);
      // Fetch students for the selected course
      const studentRes = await axios.get(`/api/courses/${selectedCourse}/students`);
      const studentData = studentRes.data.students || [];
      setStudents(studentData);
      
      // Initialize attendance state
      const initialAttendance = studentData.reduce((acc, student) => {
        acc[student.id] = {
          status: '',
          hours_completed: '',
          notes: ''
        };
        return acc;
      }, {});
      setAttendance(initialAttendance);
    } catch (error) {
      console.error('Error fetching students:', error);
      showError('Failed to fetch students for this course and session.');
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itaAttendanceSignedApi.getAll();
      if (response.success) {
        setAttendanceRecords(response.data || []);
      } else {
        setError('Failed to fetch attendance records');
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      setError('Error fetching attendance records');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({
      ita_master_id: '',
      student_id: '',
      session_date: '',
      start_time: '',
      end_time: '',
      hours_completed: '',
      student_signature: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAttendanceChange = (studentId, field, value) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleUploadAttendance = async () => {
    try {
      const attendanceRecords = Object.entries(attendance).map(([student_id, data]) => ({
        student_id: parseInt(student_id),
        session_date: new Date().toISOString().split('T')[0], // Today's date
        hours_completed: data.hours_completed || null,
        notes: data.notes || '',
        status: data.status || 'pending'
      }));

      // Create attendance records for each student
      for (const record of attendanceRecords) {
        if (record.status) { // Only create records for students with status
          await itaAttendanceSignedApi.create(record);
        }
      }

      showSuccess('ITA Attendance uploaded successfully!');
      fetchAttendanceRecords();
      // Reset form
      setSelectedCourse('');
      setSelectedSession('');
      setStudents([]);
      setAttendance({});
    } catch (error) {
      console.error('Error uploading attendance:', error);
      showError('Error uploading attendance');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await itaAttendanceSignedApi.create(formData);
      if (response.success) {
        showSuccess('ITA Attendance record created successfully!');
        closeModal();
        fetchAttendanceRecords();
      } else {
        showError(response.message || 'Failed to create attendance record');
      }
    } catch (error) {
      console.error('Error creating attendance record:', error);
      showError('Error creating attendance record');
    }
  };

  const handleReset = () => {
    setFormData({
      ita_master_id: '',
      student_id: '',
      session_date: '',
      start_time: '',
      end_time: '',
      hours_completed: '',
      student_signature: '',
      notes: ''
    });
  };

  const handleSessionFilter = (e) => {
    setSelectedSession(e.target.value);
  };

  const filteredRecords = selectedSession 
    ? attendanceRecords.filter(record => record.session_date === selectedSession)
    : attendanceRecords;

  const uniqueSessions = [...new Set(attendanceRecords.map(record => record.session_date))];

  const isUploadDisabled = students.length === 0 || Object.values(attendance).every(data => !data.status);

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Upload ITA Attendance Signed by Student</Title>
        </Header>
        <LoadingContainer>
          Loading attendance records...
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Upload ITA Attendance Signed by Student</Title>
        </Header>
        <ErrorContainer>
          <div>
            <div>Error: {error}</div>
            <button onClick={fetchAttendanceRecords} style={{ marginTop: '10px', padding: '8px 16px' }}>
              Retry
            </button>
          </div>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Upload ITA Attendance Signed by Student</Title>
        <ActionButtons>
          <IconButton>
            <FaSearch />
          </IconButton>
          <AddButton onClick={openModal}>
            <FaPlus />
          </AddButton>
          <IconButton>
            <FaList />
          </IconButton>
        </ActionButtons>
      </Header>

      <ITAContainer>
        <SessionSelector>
          <span>Filter by Session Date:</span>
          <DropdownSelect value={selectedSession} onChange={handleSessionFilter}>
            <option value="">All Sessions</option>
            {uniqueSessions.map((session) => (
              <option key={session} value={session}>{session}</option>
            ))}
          </DropdownSelect>
        </SessionSelector>

        <ShowingInfo>
          Showing {filteredRecords.length} of {attendanceRecords.length} records
        </ShowingInfo>

        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: '50px' }}></Th>
              <Th>Student</Th>
              <Th>Session Date</Th>
              <Th>Hours Completed</Th>
              <Th>Status</Th>
              <Th>Student Signature</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredRecords.length === 0 ? (
              <Tr>
                <Td colSpan="6" style={{ textAlign: 'center' }}>
                  <EmptyState>
                    {selectedSession ? 'No records found for selected session.' : 'No attendance records found.'}
                  </EmptyState>
                </Td>
              </Tr>
            ) : (
              filteredRecords.map((record) => (
                <Tr key={record.id}>
                  <Td>
                    <CheckboxInput
                      type="checkbox"
                      checked={false}
                    />
                  </Td>
                  <Td>
                    {record.student_name || `${record.student_first_name} ${record.student_last_name}`}
                  </Td>
                  <Td>{record.session_date}</Td>
                  <Td>{record.hours_completed || '-'}</Td>
                  <Td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: record.status === 'completed' ? '#d4edda' : 
                                     record.status === 'signed_by_student' ? '#fff3cd' : 
                                     record.status === 'signed_by_instructor' ? '#cce5ff' : '#f8d7da',
                      color: record.status === 'completed' ? '#155724' : 
                             record.status === 'signed_by_student' ? '#856404' : 
                             record.status === 'signed_by_instructor' ? '#004085' : '#721c24'
                    }}>
                      {record.status || 'pending'}
                    </span>
                  </Td>
                  <Td>
                    {record.student_signature ? (
                      <DocumentLink href="#" target="_blank">
                        <FaFile />
                        View Signature
                      </DocumentLink>
                    ) : (
                      <span style={{ color: '#6c757d', fontStyle: 'italic' }}>Not signed</span>
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </ITAContainer>

      {/* Course and Session Selection */}
      <ITAContainer style={{ marginTop: '2rem' }}>
        <h3 style={{ padding: '20px', margin: 0, borderBottom: '1px solid #e9ecef' }}>
          Mark ITA Attendance
        </h3>
        
        <div style={{ padding: '20px' }}>
          <SelectWrapper>
            <SelectGroup>
              <SelectIcon><FaBook /></SelectIcon>
              <CourseSelect
                value={selectedCourse}
                onChange={(value) => setSelectedCourse(value)}
                placeholder="Select a Course"
                isClearable={false}
              />
            </SelectGroup>
            <SelectGroup>
              <SelectIcon><FaRegCalendarAlt /></SelectIcon>
              <SessionSelect
                value={selectedSession}
                onChange={(value) => setSelectedSession(value)}
                placeholder="Select a Session"
                isClearable={false}
                isDisabled={!selectedCourse}
              />
            </SelectGroup>
          </SelectWrapper>

          {loadingStudents && <LoadingText>Loading Students...</LoadingText>}

          {!loadingStudents && selectedCourse && selectedSession && students.length === 0 && (
            <InfoText>No students enrolled in this course and session.</InfoText>
          )}

          {!loadingStudents && students.length > 0 && (
            <StudentListContainer>
              <StudentListHeader>
                <span>Student Name</span>
                <span>Status</span>
                <span>Hours Completed</span>
                <span>Notes</span>
              </StudentListHeader>
              {students.map(student => (
                <StudentItem key={student.id}>
                  <StudentName>{student.first_name} {student.last_name}</StudentName>
                  <AttendanceSelect 
                    value={attendance[student.id]?.status || ''} 
                    onChange={(e) => handleAttendanceChange(student.id, 'status', e.target.value)}
                  >
                    <option value="">Select Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="excused">Excused</option>
                  </AttendanceSelect>
                  <Input
                    type="number"
                    placeholder="Hours"
                    step="0.5"
                    min="0"
                    value={attendance[student.id]?.hours_completed || ''}
                    onChange={(e) => handleAttendanceChange(student.id, 'hours_completed', e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Notes"
                    value={attendance[student.id]?.notes || ''}
                    onChange={(e) => handleAttendanceChange(student.id, 'notes', e.target.value)}
                  />
                </StudentItem>
              ))}
            </StudentListContainer>
          )}

          {students.length > 0 && (
            <UploadAttendanceButton 
              onClick={handleUploadAttendance}
              disabled={isUploadDisabled}
            >
              Upload ITA Attendance
            </UploadAttendanceButton>
          )}
        </div>
      </ITAContainer>

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Manual ITA Attendance Upload</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label required>Session Date</Label>
                  <Input
                    type="date"
                    name="session_date"
                    value={formData.session_date}
                    onChange={handleInputChange}
                    required
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
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Hours Completed</Label>
                  <Input
                    type="number"
                    name="hours_completed"
                    value={formData.hours_completed}
                    onChange={handleInputChange}
                    step="0.5"
                    min="0"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Student Signature</Label>
                  <FileUploadContainer>
                    <FileInput
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => handleInputChange({ target: { name: 'student_signature', value: e.target.files[0]?.name || '' } })}
                    />
                    <FileUploadButton type="button">
                      <UploadIcon>
                        <FaUpload />
                      </UploadIcon>
                      {formData.student_signature || 'Select File'}
                    </FileUploadButton>
                  </FileUploadContainer>
                </FormGroup>

                <FormGroup>
                  <Label>Notes</Label>
                  <Input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes..."
                  />
                </FormGroup>

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit">
                    Submit
                  </SubmitButton>
                </ButtonGroup>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default UploadITAAttendance; 