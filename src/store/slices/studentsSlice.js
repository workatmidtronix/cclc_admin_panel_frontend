import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Add new student
export const addStudent = createAsyncThunk(
  'students/add',
  async (formData, { rejectWithValue }) => {
    try {
      // Log the incoming form data for debugging
      const response = await axios.post(`${API_URL}/students`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Log the response for debugging
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to add student');
      }

      return response.data;
    } catch (error) {
      console.error('Error in addStudent:', error.response?.data || error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
          .map(err => `${err.path}: ${err.msg}`)
          .join(', ');
        return rejectWithValue(validationErrors);
      }

      // Handle other errors
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Error adding student'
      );
    }
  }
);

// Get all students
export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching students'
      );
    }
  }
);

const initialState = {
  students: [],
  currentStudent: null,
  isLoading: false,
  error: null,
  success: false
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetState: (state) => {
      state.students = [];
      state.currentStudent = null;
      state.isLoading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add student cases
      .addCase(addStudent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.error = null;
        // Optionally add the new student to the list
        if (action.payload.student) {
          state.students.unshift(action.payload.student);
        }
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch students cases
      .addCase(fetchStudents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.students = action.payload.students;
        state.error = null;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, resetState } = studentsSlice.actions;
export default studentsSlice.reducer; 