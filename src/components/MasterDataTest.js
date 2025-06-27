import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMasterData } from '../store/slices/masterDataSlice';
import styled from 'styled-components';

const TestContainer = styled.div`
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 20px;
`;

const DataSection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e1e5e9;
  border-radius: 6px;
`;

const SectionTitle = styled.h3`
  color: #333;
  margin-bottom: 10px;
`;

const DataItem = styled.div`
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const LoadingText = styled.div`
  color: #666;
  font-style: italic;
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-weight: bold;
`;

const RefreshButton = styled.button`
  background: rgb(52, 152, 219);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background: rgb(41, 128, 185);
  }
`;

const MasterDataTest = () => {
  const dispatch = useDispatch();
  const { 
    courses, 
    sessions, 
    instructors, 
    students, 
    isLoading, 
    error, 
    success,
    lastFetched 
  } = useSelector(state => state.masterData);

  const handleRefresh = () => {
    dispatch(fetchMasterData());
  };

  return (
    <TestContainer>
      <h2>Master Data Test Component</h2>
      
      <RefreshButton onClick={handleRefresh}>
        Refresh Master Data
      </RefreshButton>

      {isLoading && <LoadingText>Loading master data...</LoadingText>}
      {error && <ErrorText>Error: {error}</ErrorText>}
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>✓ Data loaded successfully</div>}
      {lastFetched && (
        <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
          Last fetched: {new Date(lastFetched).toLocaleString()}
        </div>
      )}

      <DataSection>
        <SectionTitle>Courses ({courses.length})</SectionTitle>
        {courses.length > 0 ? (
          courses.map(course => (
            <DataItem key={course.id}>
              <strong>{course.course_name}</strong> - {course.course_code || 'No Code'} 
              {course.instructor_name && ` (Instructor: ${course.instructor_name})`}
            </DataItem>
          ))
        ) : (
          <LoadingText>No courses found</LoadingText>
        )}
      </DataSection>

      <DataSection>
        <SectionTitle>Sessions ({sessions.length})</SectionTitle>
        {sessions.length > 0 ? (
          sessions.map(session => (
            <DataItem key={session.id}>
              <strong>{session.session_name || 'Unnamed Session'}</strong> - 
              {session.course_name && ` Course: ${session.course_name}`} - 
              {session.session_date && ` Date: ${new Date(session.session_date).toLocaleDateString()}`}
            </DataItem>
          ))
        ) : (
          <LoadingText>No sessions found</LoadingText>
        )}
      </DataSection>

      <DataSection>
        <SectionTitle>Instructors ({instructors.length})</SectionTitle>
        {instructors.length > 0 ? (
          instructors.map(instructor => (
            <DataItem key={instructor.id}>
              <strong>{instructor.name}</strong> - {instructor.email || 'No Email'} 
              {instructor.qualification && ` (${instructor.qualification})`}
            </DataItem>
          ))
        ) : (
          <LoadingText>No instructors found</LoadingText>
        )}
      </DataSection>

      <DataSection>
        <SectionTitle>Students ({students.length})</SectionTitle>
        {students.length > 0 ? (
          students.slice(0, 5).map(student => (
            <DataItem key={student.id}>
              <strong>{student.firstName} {student.lastName}</strong> - {student.email || 'No Email'}
              {student.course && ` (Course: ${student.course})`}
            </DataItem>
          ))
        ) : (
          <LoadingText>No students found</LoadingText>
        )}
        {students.length > 5 && (
          <DataItem style={{ color: '#666', fontStyle: 'italic' }}>
            ... and {students.length - 5} more students
          </DataItem>
        )}
      </DataSection>
    </TestContainer>
  );
};

export default MasterDataTest; 