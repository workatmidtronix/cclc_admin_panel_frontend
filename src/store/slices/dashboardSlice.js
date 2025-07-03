import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch dashboard stats from API
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {

      const response = await fetch('/api/dashboard/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });



      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();

      return data.stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
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
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer; 