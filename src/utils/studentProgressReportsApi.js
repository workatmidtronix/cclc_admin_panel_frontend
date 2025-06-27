import { API_BASE_URL } from './apiConfig';

const PROGRESS_API = `${API_BASE_URL}/api/student-progress-reports`;

// Get all student progress reports
export async function fetchStudentProgressReports() {
  const response = await fetch(PROGRESS_API);
  return response.json();
}

// Get student progress report by ID
export async function fetchStudentProgressReport(id) {
  const response = await fetch(`${PROGRESS_API}/${id}`);
  return response.json();
}

// Create a new student progress report
export async function createStudentProgressReport(data) {
  const response = await fetch(PROGRESS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Update a student progress report
export async function updateStudentProgressReport(id, data) {
  const response = await fetch(`${PROGRESS_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Delete a student progress report
export async function deleteStudentProgressReport(id) {
  const response = await fetch(`${PROGRESS_API}/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

// Get student progress reports for a specific student
export async function fetchStudentProgressReportsByStudent(studentId) {
  const response = await fetch(`${PROGRESS_API}/student/${studentId}`);
  return response.json();
}

// Get student progress reports for a specific course
export async function fetchStudentProgressReportsByCourse(courseId) {
  const response = await fetch(`${PROGRESS_API}/course/${courseId}`);
  return response.json();
}

// Alias for backward compatibility
export const getStudentProgressReports = fetchStudentProgressReports; 