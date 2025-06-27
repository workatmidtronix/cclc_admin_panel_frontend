# Master Data Usage Guide

This document explains how to use the centralized master data system in the CCLC Admin Panel.

## Overview

The master data system provides a centralized way to manage and access common data like courses, sessions, instructors, students, semesters, and departments across the application. Data is stored in Redux and automatically fetched when the user logs in.

## Redux Store Structure

The master data is stored in a single slice called `masterData` to avoid data duplication:

```javascript
{
  masterData: {
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
  }
}
```

## Automatic Data Fetching

Master data is automatically fetched in the following scenarios:
1. **User Login**: Data is fetched immediately after successful login
2. **User Signup**: Data is fetched immediately after successful signup
3. **Token Verification**: Data is fetched when verifying existing tokens
4. **Page Refresh**: Data is fetched when the app initializes on page refresh
5. **Component Mount**: Data is fetched when components that need it mount (if not already available)

## Available Hooks

### 1. useMasterData()
Fetches and provides access to all master data (courses, sessions, instructors, students, semesters, departments).

```javascript
import { useMasterData } from '../hooks/useMasterData';

function MyComponent() {
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
    isInitialized 
  } = useMasterData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Courses ({courses.length})</h2>
      <h2>Sessions ({sessions.length})</h2>
      <h2>Instructors ({instructors.length})</h2>
      <h2>Students ({students.length})</h2>
      <h2>Semesters ({semesters.length})</h2>
      <h2>Departments ({departments.length})</h2>
    </div>
  );
}
```

### 2. useCourseSessionData()
Fetches and provides access to only course and session data (for forms that need dropdowns).

```javascript
import { useCourseSessionData } from '../hooks/useMasterData';

function CourseForm() {
  const { courses, sessions, isLoading, error } = useCourseSessionData();

  if (isLoading) return <div>Loading...</div>;

  return (
    <form>
      <select>
        {courses.map(course => (
          <option key={course.id} value={course.id}>
            {course.course_name}
          </option>
        ))}
      </select>
    </form>
  );
}
```

### 3. useInstructorData()
Fetches and provides access to only instructor data.

```javascript
import { useInstructorData } from '../hooks/useMasterData';

function InstructorForm() {
  const { instructors, isLoading, error } = useInstructorData();

  if (isLoading) return <div>Loading...</div>;

  return (
    <form>
      <select>
        {instructors.map(instructor => (
          <option key={instructor.id} value={instructor.id}>
            {instructor.name}
          </option>
        ))}
      </select>
    </form>
  );
}
```

### 4. useSemesterDepartmentData()
Fetches and provides access to only semester and department data.

```javascript
import { useSemesterDepartmentData } from '../hooks/useMasterData';

function SemesterForm() {
  const { semesters, departments, isLoading, error } = useSemesterDepartmentData();

  if (isLoading) return <div>Loading...</div>;

  return (
    <form>
      <select>
        {semesters.map(semester => (
          <option key={semester.id} value={semester.id}>
            {semester.semester_name}
          </option>
        ))}
      </select>
    </form>
  );
}
```

## Helper Functions

### Formatting Functions
Use these functions to format data for dropdowns:

```javascript
import { 
  formatCourseOptions, 
  formatSessionOptions, 
  formatInstructorOptions,
  formatStudentOptions,
  formatSemesterOptions,
  formatDepartmentOptions
} from '../hooks/useMasterData';

// Format for react-select or similar components
const courseOptions = formatCourseOptions(courses);
const sessionOptions = formatSessionOptions(sessions);
const instructorOptions = formatInstructorOptions(instructors);
const studentOptions = formatStudentOptions(students);
const semesterOptions = formatSemesterOptions(semesters);
const departmentOptions = formatDepartmentOptions(departments);
```

## Reusable Select Components

### 1. CourseSelect
```javascript
import { CourseSelect } from '../components/MasterDataSelect';

function MyForm() {
  return (
    <form>
      <CourseSelect 
        value={selectedCourse}
        onChange={setSelectedCourse}
        placeholder="Select a course"
        isClearable
      />
    </form>
  );
}
```

### 2. SessionSelect
```javascript
import { SessionSelect } from '../components/MasterDataSelect';

function MyForm() {
  return (
    <form>
      <SessionSelect 
        value={selectedSession}
        onChange={setSelectedSession}
        placeholder="Select a session"
        isClearable
      />
    </form>
  );
}
```

### 3. InstructorSelect
```javascript
import { InstructorSelect } from '../components/MasterDataSelect';

function MyForm() {
  return (
    <form>
      <InstructorSelect 
        value={selectedInstructor}
        onChange={setSelectedInstructor}
        placeholder="Select an instructor"
        isClearable
      />
    </form>
  );
}
```

### 4. StudentSelect
```javascript
import { StudentSelect } from '../components/MasterDataSelect';

function MyForm() {
  return (
    <form>
      <StudentSelect 
        value={selectedStudent}
        onChange={setSelectedStudent}
        placeholder="Select a student"
        isClearable
      />
    </form>
  );
}
```

### 5. SemesterSelect
```javascript
import { SemesterSelect } from '../components/MasterDataSelect';

function MyForm() {
  return (
    <form>
      <SemesterSelect 
        value={selectedSemester}
        onChange={setSelectedSemester}
        placeholder="Select a semester"
        isClearable
      />
    </form>
  );
}
```

### 6. DepartmentSelect
```javascript
import { DepartmentSelect } from '../components/MasterDataSelect';

function MyForm() {
  return (
    <form>
      <DepartmentSelect 
        value={selectedDepartment}
        onChange={setSelectedDepartment}
        placeholder="Select a department"
        isClearable
      />
    </form>
  );
}
```

## Data Refresh

The system automatically refreshes data every 5 minutes. To manually refresh data:

```javascript
import { useDispatch } from 'react-redux';
import { refreshData } from '../store/slices/masterDataSlice';

function MyComponent() {
  const dispatch = useDispatch();

  const handleRefresh = () => {
    dispatch(refreshData());
  };

  return <button onClick={handleRefresh}>Refresh Data</button>;
}
```

## Error Handling

The hooks provide error states that you can handle:

```javascript
function MyComponent() {
  const { error, isLoading } = useMasterData();

  if (error) {
    return (
      <div className="error-message">
        <p>Failed to load data: {error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading data...</div>;
  }

  return <div>Data loaded successfully!</div>;
}
```

## Performance Optimizations

1. **Caching**: Data is cached for 5 minutes to avoid unnecessary API calls
2. **Selective Fetching**: Use specific hooks (useCourseSessionData, useInstructorData, useSemesterDepartmentData) when you only need certain data
3. **Initialization Check**: The `isInitialized` flag prevents duplicate API calls
4. **Background Updates**: Data is automatically refreshed in the background

## Best Practices

1. **Use the appropriate hook**: Choose the hook that fetches only the data you need
2. **Handle loading states**: Always check `isLoading` before rendering data
3. **Handle errors**: Provide user-friendly error messages
4. **Use reusable components**: Use the provided select components for consistency
5. **Avoid manual API calls**: Let the hooks handle data fetching automatically

## Example: Complete Form Component

```javascript
import React, { useState } from 'react';
import { useCourseSessionData, useSemesterDepartmentData } from '../hooks/useMasterData';
import { CourseSelect, SessionSelect, SemesterSelect, DepartmentSelect } from '../components/MasterDataSelect';

function AssignmentForm() {
  const { courses, sessions, isLoading: courseSessionLoading } = useCourseSessionData();
  const { semesters, departments, isLoading: semesterDeptLoading } = useSemesterDepartmentData();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  if (courseSessionLoading || semesterDeptLoading) return <div>Loading form data...</div>;

  return (
    <form>
      <div>
        <label>Course:</label>
        <CourseSelect
          value={selectedCourse}
          onChange={setSelectedCourse}
          placeholder="Select a course"
        />
      </div>
      
      <div>
        <label>Session:</label>
        <SessionSelect
          value={selectedSession}
          onChange={setSelectedSession}
          placeholder="Select a session"
        />
      </div>

      <div>
        <label>Semester:</label>
        <SemesterSelect
          value={selectedSemester}
          onChange={setSelectedSemester}
          placeholder="Select a semester"
        />
      </div>

      <div>
        <label>Department:</label>
        <DepartmentSelect
          value={selectedDepartment}
          onChange={setSelectedDepartment}
          placeholder="Select a department"
        />
      </div>
      
      <button type="submit">Create Assignment</button>
    </form>
  );
}

export default AssignmentForm;
```

## Forms Updated

The following forms have been updated to use Redux state instead of hardcoded dropdowns:

1. **AddStudent** - Uses CourseSelect, SessionSelect, SemesterSelect
2. **StudentList** - Uses CourseSelect, SessionSelect for filtering
3. **PreviousCourse** - Uses CourseSelect, SessionSelect in modal
4. **AttendanceReport** - Uses CourseSelect, SessionSelect in modal
5. **Dashboard** - Uses SessionSelect in announcement modal
6. **MidtermReport** - Uses CourseSelect, SessionSelect
7. **StudentProgressReport** - Uses CourseSelect, SessionSelect
8. **SendSMS** - Uses SessionSelect
9. **SendPassword** - Uses SessionSelect
10. **SendAnnouncement** - Uses SessionSelect

This system ensures that master data is always available when needed, automatically managed, and efficiently cached across the application. All forms now use dynamic data from the database instead of hardcoded values.