import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCourses } from '../../utils/coursesApi';
import { fetchSessions } from '../../utils/sessionsApi';
import { fetchInstructors } from '../../utils/instructorsApi';
import { fetchStudents } from '../../utils/studentsApi';
import { fetchSemesters } from '../../utils/semestersApi';
import { fetchDepartments } from '../../utils/departmentsApi';

// Fetch all master data (courses, sessions, instructors, students, semesters, departments)
export const fetchMasterData = createAsyncThunk(
  'masterData/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [coursesResponse, sessionsResponse, instructorsResponse, studentsResponse, semestersResponse, departmentsResponse] = await Promise.all([
        fetchCourses(),
        fetchSessions(),
        fetchInstructors(),
        fetchStudents(),
        fetchSemesters(),
        fetchDepartments()
      ]);

      return {
        courses: coursesResponse.courses || coursesResponse,
        sessions: sessionsResponse.sessions || sessionsResponse,
        instructors: instructorsResponse.instructors || instructorsResponse,
        students: studentsResponse.students || studentsResponse,
        semesters: semestersResponse.semesters || semestersResponse,
        departments: departmentsResponse.departments || departmentsResponse
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch only courses and sessions (for forms that need course/session dropdowns)
export const fetchCourseSessionData = createAsyncThunk(
  'masterData/fetchCourseSession',
  async (_, { rejectWithValue }) => {
    try {
      const [coursesResponse, sessionsResponse] = await Promise.all([
        fetchCourses(),
        fetchSessions()
      ]);

      return {
        courses: coursesResponse.courses || coursesResponse,
        sessions: sessionsResponse.sessions || sessionsResponse
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch only instructors (for instructor dropdowns)
export const fetchInstructorData = createAsyncThunk(
  'masterData/fetchInstructors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchInstructors();
      return {
        instructors: response.instructors || response
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch only semesters and departments (for forms that need semester/department dropdowns)
export const fetchSemesterDepartmentData = createAsyncThunk(
  'masterData/fetchSemesterDepartment',
  async (_, { rejectWithValue }) => {
    try {
      const [semestersResponse, departmentsResponse] = await Promise.all([
        fetchSemesters(),
        fetchDepartments()
      ]);

      return {
        semesters: semestersResponse.semesters || semestersResponse,
        departments: departmentsResponse.departments || departmentsResponse
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  courses: [],
  sessions: [],
  instructors: [],
  students: [],
  semesters: [],
  departments: [],
  isLoading: false,
  error: null,
  success: false,
  lastFetched: null,
  isInitialized: false
};

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetState: (state) => {
      state.courses = [];
      state.sessions = [];
      state.instructors = [];
      state.students = [];
      state.semesters = [];
      state.departments = [];
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.lastFetched = null;
      state.isInitialized = false;
    },
    // Force refresh data
    refreshData: (state) => {
      state.lastFetched = null;
      state.isInitialized = false;
    },
    // Helper selectors for forms
    getCourseOptions: (state) => {
      return state.courses.map(course => ({
        value: course.id,
        label: course.course_name || course.name
      }));
    },
    getSessionOptions: (state) => {
      return state.sessions.map(session => ({
        value: session.id,
        label: session.session_name || session.name
      }));
    },
    getInstructorOptions: (state) => {
      return state.instructors.map(instructor => ({
        value: instructor.id,
        label: instructor.name
      }));
    },
    getStudentOptions: (state) => {
      return state.students.map(student => ({
        value: student.id,
        label: `${student.firstName} ${student.lastName}`
      }));
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all master data cases
      .addCase(fetchMasterData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMasterData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.courses || [];
        state.sessions = action.payload.sessions || [];
        state.instructors = action.payload.instructors || [];
        state.students = action.payload.students || [];
        state.semesters = action.payload.semesters || [];
        state.departments = action.payload.departments || [];
        state.error = null;
        state.success = true;
        state.lastFetched = new Date().toISOString();
        state.isInitialized = true;
      })
      .addCase(fetchMasterData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch course/session data cases
      .addCase(fetchCourseSessionData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourseSessionData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courses = action.payload.courses || [];
        state.sessions = action.payload.sessions || [];
        state.error = null;
        state.success = true;
        state.lastFetched = new Date().toISOString();
        state.isInitialized = true;
      })
      .addCase(fetchCourseSessionData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch instructor data cases
      .addCase(fetchInstructorData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInstructorData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.instructors = action.payload.instructors || [];
        state.error = null;
        state.success = true;
        state.lastFetched = new Date().toISOString();
        state.isInitialized = true;
      })
      .addCase(fetchInstructorData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch semester/department data cases
      .addCase(fetchSemesterDepartmentData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSemesterDepartmentData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.semesters = action.payload.semesters || [];
        state.departments = action.payload.departments || [];
        state.error = null;
        state.success = true;
        state.lastFetched = new Date().toISOString();
        state.isInitialized = true;
      })
      .addCase(fetchSemesterDepartmentData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearError, 
  clearSuccess, 
  resetState,
  refreshData,
  getCourseOptions,
  getSessionOptions,
  getInstructorOptions,
  getStudentOptions
} = masterDataSlice.actions;

export default masterDataSlice.reducer; 