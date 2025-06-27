import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { showSuccess, showError } from '../../components/CustomAlert';
import { FaBook, FaRegCalendarAlt, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { CourseSelect, SessionSelect } from '../../components/MasterDataSelect';

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

const AddAttendanceContainer = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 1.7rem;
`;

const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SelectWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
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
`;

const Select = styled.select`
  padding: 12px 15px 12px 45px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  background: white;
  appearance: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(51, 66, 147, 0.1);
  }

  &:disabled {
    background-color: #f1f3f5;
    cursor: not-allowed;
  }
`;

const ChevronIcon = styled(FaChevronDown)`
  position: absolute;
  right: 15px;
  color: #adb5bd;
  pointer-events: none;
`;

const StudentListContainer = styled.div`
  margin-top: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  animation: ${fadeIn} 0.3s ease-out;
`;

const StudentListHeader = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
`;

const StudentItem = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
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

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  align-self: flex-start;
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

const AddAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSession, setSelectedSession] = useState('');
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState({
    courses: true,
    sessions: false,
    students: false
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(prev => ({ ...prev, courses: true }));
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        showError('Failed to fetch courses.');
      } finally {
        setLoading(prev => ({ ...prev, courses: false }));
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      const fetchSessionsAndStudents = async () => {
        setLoading(prev => ({ ...prev, sessions: true, students: true }));
        try {
          // Fetch sessions
          const sessionRes = await axios.get(`http://localhost:5000/api/sessions/course/${selectedCourse}`);
          setSessions(sessionRes.data.sessions || []);
        } catch (error) {
          console.error('Error fetching sessions:', error);
          showError('Failed to fetch sessions.');
          setSessions([]);
        } finally {
            setLoading(prev => ({ ...prev, sessions: false }));
        }
        
        try {
          // Fetch students
          const studentRes = await axios.get(`http://localhost:5000/api/courses/${selectedCourse}/students`);
          const studentData = studentRes.data.students || [];
          setStudents(studentData);
          // Initialize attendance state
          const initialAttendance = studentData.reduce((acc, student) => {
            acc[student.id] = '';
            return acc;
          }, {});
          setAttendance(initialAttendance);
        } catch (error) {
          console.error('Error fetching students:', error);
          showError('Failed to fetch students.');
          setStudents([]);
        } finally {
            setLoading(prev => ({ ...prev, students: false }));
        }
      };
      fetchSessionsAndStudents();
    } else {
      setSessions([]);
      setStudents([]);
    }
  }, [selectedCourse]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSession) {
        showError('Please select a session.');
        return;
    }

    const attendanceRecords = Object.entries(attendance).map(([student_id, status]) => ({
      student_id,
      status,
    }));
    
    const session = sessions.find(s => s.id === parseInt(selectedSession));

    try {
      await axios.post('http://localhost:5000/api/attendance', {
        sessionId: selectedSession,
        attendanceDate: new Date(session.session_date).toISOString().split('T')[0], // format to YYYY-MM-DD
        attendanceRecords,
      });
      showSuccess('Attendance submitted successfully!');
      // Reset form
      setSelectedCourse('');
      setSelectedSession('');
      setStudents([]);
      setAttendance({});
    } catch (error) {
      showError(error.response?.data?.message || 'Error submitting attendance.');
      console.error('Error submitting attendance:', error);
    }
  };

  const isSubmitDisabled = students.length === 0 || Object.values(attendance).some(status => status === '');

  return (
    <AddAttendanceContainer>
      <Title>Add Attendance</Title>
      <FormContainer>
        {loading.courses ? (
            <LoadingText>Loading Courses...</LoadingText>
        ) : courses.length > 0 ? (
          <Form onSubmit={handleSubmit}>
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
                  placeholder={loading.sessions ? 'Loading...' : 'Select a Session'}
                  isClearable={false}
                  isDisabled={!selectedCourse || loading.sessions}
                />
              </SelectGroup>
            </SelectWrapper>
            
            {loading.students && <LoadingText>Loading Students...</LoadingText>}

            {!loading.students && selectedCourse && students.length === 0 && (
                <InfoText>No students enrolled in this course or session.</InfoText>
            )}

            {!loading.students && students.length > 0 && selectedSession && (
              <StudentListContainer>
                <StudentListHeader>
                  <span>Student Name</span>
                  <span>Attendance Status</span>
                </StudentListHeader>
                {students.map(student => (
                  <StudentItem key={student.id}>
                    <StudentName>{student.first_name} {student.last_name}</StudentName>
                    <Select value={attendance[student.id] || ''} onChange={(e) => handleAttendanceChange(student.id, e.target.value)}>
                      <option value="">Select Status</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Excused">Excused</option>
                    </Select>
                  </StudentItem>
                ))}
              </StudentListContainer>
            )}

            {students.length > 0 && (
                <SubmitButton type="submit" disabled={isSubmitDisabled}>
                    Submit Attendance
                </SubmitButton>
            )}
          </Form>
        ) : (
            <InfoText>No courses found. Please add a course first.</InfoText>
        )}
      </FormContainer>
    </AddAttendanceContainer>
  );
};

export default AddAttendance;