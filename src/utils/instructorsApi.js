// Instructors API utility functions

import { API_BASE_URL } from './apiConfig';

const INSTRUCTORS_API = `${API_BASE_URL}/api/instructors`;

// Fetch all instructors
export async function fetchInstructors() {
  const response = await fetch(INSTRUCTORS_API);
  return response.json();
}

// Get instructor by ID
export async function fetchInstructor(instructorId) {
  const response = await fetch(`${INSTRUCTORS_API}/${instructorId}`);
  return response.json();
} 