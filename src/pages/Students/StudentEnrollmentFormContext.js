import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../utils/apiConfig';
const StudentEnrollmentFormContext = createContext();

export const StudentEnrollmentFormProvider = ({ email, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log("Enrollment form context data", data);
  useEffect(() => {
    if (!email) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/api/students/enrollment-forms/${email}`);
        const result = await response.json();
        if (result.success) {
          setData(result.student);
        } else {
          setError(result.message || 'Student not found');
        }
      } catch (err) {
        setError('Error loading student information');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [email]);

  return (
    <StudentEnrollmentFormContext.Provider value={{ data, loading, error }}>
      {children}
    </StudentEnrollmentFormContext.Provider>
  );
};

export const useEnrollmentFormData = () => useContext(StudentEnrollmentFormContext); 