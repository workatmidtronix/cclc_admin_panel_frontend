// Courses API utility functions

import { API_BASE_URL } from './apiConfig';

const COURSES_API = `${API_BASE_URL}/api/courses`;

// Fetch all courses
export async function fetchCourses() {
  const response = await fetch(COURSES_API);
  return response.json();
}

// Get course by ID
export async function fetchCourse(courseId) {
  const response = await fetch(`${COURSES_API}/${courseId}`);
  return response.json();
} 