import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch dashboard stats from API
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      console.log('Dashboard stats data:', data);
      return data.stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
    }
  }
);

// Fetch recent activities from API
export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/dashboard/recent-activities', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recent activities');
      }

      const data = await response.json();
      return data.activities;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch recent activities');
    }
  }
);

const initialState = {
  stats: {
    totalStudents: 0,
    totalInstructors: 0,
    totalCourses: 0,
    totalSessions: 0,
    totalEnrollments: 0,
    pendingApplications: 0,
  },
  recentActivities: [],
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stats cases
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch activities cases
      .addCase(fetchRecentActivities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recentActivities = action.payload;
        state.error = null;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 