import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMasterData, formatCourseOptions, formatSessionOptions, formatInstructorOptions, formatStudentOptions } from '../hooks/useMasterData';
import { 
  useCourseSessionData, 
  useInstructorData, 
  useSemesterDepartmentData,
  formatSemesterOptions,
  formatDepartmentOptions
} from '../hooks/useMasterData';

const Select = styled.select`
  padding: 15px 40px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  background: white;
  width: 100%;

  &:focus {
    outline: none;
    border-color: rgb(52, 152, 219);
  }

  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
  }
`;

const Option = styled.option`
  padding: 8px;
`;

const LoadingText = styled.div`
  color: #6c757d;
  font-style: italic;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
`;

const ErrorText = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 4px;
`;

// Course Select Component
export const CourseSelect = ({ value, onChange, placeholder = "Select a course", isClearable = true, isDisabled = false, ...props }) => {
  const { courses, isLoading } = useCourseSessionData();
  
  if (isLoading) {
    return <LoadingText>Loading courses...</LoadingText>;
  }

  // Ensure courses is an array before mapping
  const coursesArray = Array.isArray(courses) ? courses : [];

  return (
    <Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={isDisabled}
      {...props}
    >
      <Option value="">{placeholder}</Option>
      {coursesArray.map(course => (
        <Option key={course.id} value={course.id}>
          {course.course_name}
        </Option>
      ))}
    </Select>
  );
};

// Session Select Component
export const SessionSelect = ({ value, onChange, placeholder = "Select a session", isClearable = true, isDisabled = false, ...props }) => {
  const { sessions, isLoading } = useCourseSessionData();
  
  if (isLoading) {
    return <LoadingText>Loading sessions...</LoadingText>;
  }

  // Ensure sessions is an array before mapping
  const sessionsArray = Array.isArray(sessions) ? sessions : [];

  return (
    <Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={isDisabled}
      {...props}
    >
      <Option value="">{placeholder}</Option>
      {sessionsArray.map(session => (
        <Option key={session.id} value={session.id}>
          {session.session_name}
        </Option>
      ))}
    </Select>
  );
};

// Instructor Select Component
export const InstructorSelect = ({ value, onChange, placeholder = "Select an instructor", isClearable = true, isDisabled = false, ...props }) => {
  const { instructors, isLoading } = useInstructorData();
  
  if (isLoading) {
    return <LoadingText>Loading instructors...</LoadingText>;
  }

  // Ensure instructors is an array before mapping
  const instructorsArray = Array.isArray(instructors) ? instructors : [];

  return (
    <Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={isDisabled}
      {...props}
    >
      <Option value="">{placeholder}</Option>
      {instructorsArray.map(instructor => (
        <Option key={instructor.id} value={instructor.id}>
          {instructor.name || 'Unnamed Instructor'}
        </Option>
      ))}
    </Select>
  );
};

// Semester Select Component
export const SemesterSelect = ({ value, onChange, placeholder = "Select a semester", isClearable = true, isDisabled = false, ...props }) => {
  const { semesters, isLoading } = useSemesterDepartmentData();
  
  if (isLoading) {
    return <LoadingText>Loading semesters...</LoadingText>;
  }

  // Ensure semesters is an array before mapping
  const semestersArray = Array.isArray(semesters) ? semesters : [];

  return (
    <Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={isDisabled}
      {...props}
    >
      <Option value="">{placeholder}</Option>
      {semestersArray.map(semester => (
        <Option key={semester.id} value={semester.id}>
          {semester.semester_name}
        </Option>
      ))}
    </Select>
  );
};

// Department Select Component
export const DepartmentSelect = ({ value, onChange, placeholder = "Select a department", isClearable = true, isDisabled = false, ...props }) => {
  const { departments, isLoading } = useSemesterDepartmentData();
  
  if (isLoading) {
    return <LoadingText>Loading departments...</LoadingText>;
  }

  // Ensure departments is an array before mapping
  const departmentsArray = Array.isArray(departments) ? departments : [];

  return (
    <Select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={isDisabled}
      {...props}
    >
      <Option value="">{placeholder}</Option>
      {departmentsArray.map(department => (
        <Option key={department.id} value={department.id}>
          {department.department_name}
        </Option>
      ))}
    </Select>
  );
};

// Student Select Component
export const StudentSelect = ({ value, onChange, placeholder = "Select Student", disabled = false, error = null }) => {
  const { students, isLoading, error: fetchError } = useMasterData();
console.log("pppppptttttt",students);
  if (isLoading) {
    return <LoadingText>Loading students...</LoadingText>;
  }

  if (fetchError) {
    return <ErrorText>Error loading students: {fetchError}</ErrorText>;
  }

  // Ensure students is an array before mapping
  const studentsArray = Array.isArray(students) ? students : [];

  return (
    <div>
      <Select 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ borderColor: error ? '#dc3545' : '#e1e5e9' }}
      >
        <Option value="">{placeholder}</Option>
        {studentsArray.map(student => (
          <Option key={student.id} value={student.id}>
            {student.firstName} {student.lastName}
          </Option>
        ))}
      </Select>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};

// ITA Master Select Component
export const ITAMasterSelect = ({ value, onChange, placeholder = "Select ITA Master", disabled = false, error = null }) => {
  const [itaMasters, setItaMasters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchITAMasters = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/ita-master');
        if (response.ok) {
          const data = await response.json();
          setItaMasters(data.data || []);
        } else {
          setFetchError('Failed to load ITA Masters');
        }
      } catch (error) {
        setFetchError('Error loading ITA Masters');
      } finally {
        setIsLoading(false);
      }
    };

    fetchITAMasters();
  }, []);

  if (isLoading) {
    return <LoadingText>Loading ITA Masters...</LoadingText>;
  }

  if (fetchError) {
    return <ErrorText>Error loading ITA Masters: {fetchError}</ErrorText>;
  }

  return (
    <div>
      <Select 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{ borderColor: error ? '#dc3545' : '#e1e5e9' }}
      >
        <Option value="">{placeholder}</Option>
        {itaMasters.map(itaMaster => (
          <Option key={itaMaster.id} value={itaMaster.id}>
            {itaMaster.student_name || `ITA Master ${itaMaster.id}`}
          </Option>
        ))}
      </Select>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}; 