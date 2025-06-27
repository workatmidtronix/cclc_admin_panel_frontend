import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMasterData, 
  fetchCourseSessionData, 
  fetchInstructorData,
  fetchSemesterDepartmentData
} from '../store/slices/masterDataSlice';

// Hook to get all master data
export const useMasterData = () => {
  const dispatch = useDispatch();
  const { 
    courses, 
    sessions, 
    instructors, 
    students, 
    semesters,
    departments,
    isLoading, 
    error, 
    success,
    lastFetched,
    isInitialized
  } = useSelector(state => state.masterData);

  useEffect(() => {
    // Only fetch if not initialized or if it's been more than 5 minutes
    const shouldFetch = !isInitialized || 
      !lastFetched || 
      (new Date() - new Date(lastFetched)) > 5 * 60 * 1000;
    
    if (shouldFetch) {
      dispatch(fetchMasterData());
    }
  }, [dispatch, isInitialized, lastFetched]);

  return {
    courses,
    sessions,
    instructors,
    students,
    semesters,
    departments,
    isLoading,
    error,
    success,
    isInitialized
  };
};

// Hook to get only course and session data
export const useCourseSessionData = () => {
  const dispatch = useDispatch();
  const { 
    courses, 
    sessions, 
    isLoading, 
    error, 
    success,
    lastFetched,
    isInitialized
  } = useSelector(state => state.masterData);

  useEffect(() => {
    // Only fetch if not initialized or if it's been more than 5 minutes
    const shouldFetch = !isInitialized || 
      !lastFetched || 
      (new Date() - new Date(lastFetched)) > 5 * 60 * 1000;
    
    if (shouldFetch) {
      dispatch(fetchCourseSessionData());
    }
  }, [dispatch, isInitialized, lastFetched]);

  return {
    courses,
    sessions,
    isLoading,
    error,
    success,
    isInitialized
  };
};

// Hook to get only instructor data
export const useInstructorData = () => {
  const dispatch = useDispatch();
  const { 
    instructors, 
    isLoading, 
    error, 
    success,
    lastFetched,
    isInitialized
  } = useSelector(state => state.masterData);

  useEffect(() => {
    // Only fetch if not initialized or if it's been more than 5 minutes
    const shouldFetch = !isInitialized || 
      !lastFetched || 
      (new Date() - new Date(lastFetched)) > 5 * 60 * 1000;
    
    if (shouldFetch) {
      dispatch(fetchInstructorData());
    }
  }, [dispatch, isInitialized, lastFetched]);

  return {
    instructors,
    isLoading,
    error,
    success,
    isInitialized
  };
};

// Hook to get only semester and department data
export const useSemesterDepartmentData = () => {
  const dispatch = useDispatch();
  const { 
    semesters, 
    departments, 
    isLoading, 
    error, 
    success,
    lastFetched,
    isInitialized
  } = useSelector(state => state.masterData);

  useEffect(() => {
    // Only fetch if not initialized or if it's been more than 5 minutes
    const shouldFetch = !isInitialized || 
      !lastFetched || 
      (new Date() - new Date(lastFetched)) > 5 * 60 * 1000;
    
    if (shouldFetch) {
      dispatch(fetchSemesterDepartmentData());
    }
  }, [dispatch, isInitialized, lastFetched]);

  return {
    semesters,
    departments,
    isLoading,
    error,
    success,
    isInitialized
  };
};

// Helper functions to format data for dropdowns
export const formatCourseOptions = (courses) => {
  return courses.map(course => ({
    value: course.id,
    label: course.course_name || course.name || 'Unnamed Course'
  }));
};

export const formatSessionOptions = (sessions) => {
  return sessions.map(session => ({
    value: session.id,
    label: session.session_name || session.name || 'Unnamed Session'
  }));
};

export const formatInstructorOptions = (instructors) => {
  return instructors.map(instructor => ({
    value: instructor.id,
    label: instructor.name || 'Unnamed Instructor'
  }));
};

export const formatStudentOptions = (students) => {
  return students.map(student => ({
    value: student.id,
    label: `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Unnamed Student'
  }));
};

export const formatSemesterOptions = (semesters) => {
  return semesters.map(semester => ({
    value: semester.id,
    label: semester.semester_name || 'Unnamed Semester'
  }));
};

export const formatDepartmentOptions = (departments) => {
  return departments.map(department => ({
    value: department.id,
    label: department.department_name || 'Unnamed Department'
  }));
}; 