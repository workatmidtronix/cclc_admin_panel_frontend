import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { fetchMasterData } from './masterDataSlice';
import { API_BASE_URL } from '../../utils/apiConfig';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ loginID, password, role }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        loginID,
        password,
        role
      });

      const { token, user } = response.data;
      console.log("User",user);  
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Fetch master data immediately after successful login
      await dispatch(fetchMasterData()).unwrap();
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  }
);

// Signup user
export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ loginID, password, role, firstName, lastName, email }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        loginID,
        password,
        role,
        firstName,
        lastName,
        email
      });

      const { token, user } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Fetch master data immediately after successful signup
      await dispatch(fetchMasterData()).unwrap();
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Signup failed. Please try again.'
      );
    }
  }
);

// Verify token
export const verifyToken = createAsyncThunk(
  'auth/verify',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(
        `${API_URL}/auth/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Fetch master data immediately after successful token verification
      await dispatch(fetchMasterData()).unwrap();

      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

// Initialize app (for page refresh scenarios)
export const initializeApp = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user && !state.auth.isAuthenticated) {
        // User has token but not authenticated in Redux (page refresh)
        const response = await axios.post(
          `${API_URL}/auth/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Fetch master data immediately
        await dispatch(fetchMasterData()).unwrap();

        return response.data;
      }

      return null;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      // Signup cases
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })
      // Verify token cases
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Initialize app cases
      .addCase(initializeApp.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      })
      .addCase(initializeApp.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 