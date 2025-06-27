// Students API utility functions

import { API_BASE_URL } from './apiConfig';

const STUDENTS_API = `${API_BASE_URL}/api/students`;

// Fetch all students
export async function fetchStudents() {
  const response = await fetch(STUDENTS_API);
  return response.json();
}

// Update student status
export async function updateStudentStatus(studentId, status) {
  const response = await fetch(`${STUDENTS_API}/${studentId}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return response.json();
}

// Add new student
export async function addStudent(studentData) {
  const response = await fetch(STUDENTS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  return response.json();
}

// Assign course to student
export async function assignCourseToStudent(data) {
  const response = await fetch(`${STUDENTS_API}/assign-course`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Get student by ID
export async function getStudentById(studentId) {
  const response = await fetch(`${STUDENTS_API}/${studentId}`);
  return response.json();
}

// Get comprehensive student details
export async function getStudentDetails(studentId) {
  const response = await fetch(`${STUDENTS_API}/${studentId}/details`);
  return response.json();
}

// Delete student
export async function deleteStudent(studentId) {
  const response = await fetch(`${STUDENTS_API}/${studentId}`, {
    method: 'DELETE'
  });
  return response.json();
}

export async function updateStudent(studentId, studentData) {
  const response = await fetch(`${STUDENTS_API}/${studentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  return response.json();
} 