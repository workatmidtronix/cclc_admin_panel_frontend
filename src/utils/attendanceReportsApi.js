import { API_BASE_URL } from './apiConfig';

const ATTENDANCE_API = `${API_BASE_URL}/api/attendance-reports`;

// Get all attendance reports
export async function fetchAttendanceReports() {
  const response = await fetch(ATTENDANCE_API);
  return response.json();
}

// Get attendance report by ID
export async function fetchAttendanceReport(id) {
  const response = await fetch(`${ATTENDANCE_API}/${id}`);
  return response.json();
}

// Create new attendance report
export async function createAttendanceReport(data) {
  const response = await fetch(ATTENDANCE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Update attendance report
export async function updateAttendanceReport(id, data) {
  const response = await fetch(`${ATTENDANCE_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Delete attendance report
export async function deleteAttendanceReport(id) {
  const response = await fetch(`${ATTENDANCE_API}/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

// Get attendance reports for a specific student
export async function fetchAttendanceReportsByStudent(studentId) {
  const response = await fetch(`${ATTENDANCE_API}/student/${studentId}`);
  return response.json();
}

// Get attendance reports for a specific course
export async function fetchAttendanceReportsByCourse(courseId) {
  const response = await fetch(`${ATTENDANCE_API}/course/${courseId}`);
  return response.json();
}

// Alias for backward compatibility
export const getAttendanceReports = fetchAttendanceReports; 