import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all departments
export const fetchDepartments = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/profile/departments`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch departments');
  }
};

// Add department
export const addDepartment = async (departmentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/profile/departments`, departmentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add department');
  }
};

// Update department
export const updateDepartment = async (id, departmentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/profile/departments/${id}`, departmentData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update department');
  }
};

// Delete department
export const deleteDepartment = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_URL}/profile/departments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete department');
  }
}; 