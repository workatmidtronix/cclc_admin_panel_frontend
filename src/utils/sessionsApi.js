// Sessions API utility functions

import { API_BASE_URL } from './apiConfig';

const SESSIONS_API = `${API_BASE_URL}/api/sessions`;

// Fetch all sessions
export async function fetchSessions() {
  const response = await fetch(SESSIONS_API);
  return response.json();
}

// Get session by ID
export async function fetchSession(sessionId) {
  const response = await fetch(`${SESSIONS_API}/${sessionId}`);
  return response.json();
} 