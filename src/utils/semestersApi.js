import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all semesters
export const fetchSemesters = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/profile/semesters`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch semesters');
  }
};

// Add semester
export const addSemester = async (semesterData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/profile/semesters`, semesterData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add semester');
  }
};

// Update semester
export const updateSemester = async (id, semesterData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/profile/semesters/${id}`, semesterData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update semester');
  }
};

// Delete semester
export const deleteSemester = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/profile/semesters/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete semester');
  }
}; 