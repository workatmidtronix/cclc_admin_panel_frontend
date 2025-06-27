import { API_BASE_URL } from './apiConfig';

const MIDTERM_API = `${API_BASE_URL}/api/midterm-reports`;

// Get all midterm reports
export async function fetchMidtermReports() {
  const response = await fetch(MIDTERM_API, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

// Get single midterm report by ID
export async function fetchMidtermReport(id) {
  const response = await fetch(`${MIDTERM_API}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

// Create new midterm report
export async function createMidtermReport(data) {
  const response = await fetch(MIDTERM_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Update midterm report
export async function updateMidtermReport(id, data) {
  const response = await fetch(`${MIDTERM_API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

// Delete midterm report
export async function deleteMidtermReport(id) {
  const response = await fetch(`${MIDTERM_API}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

// Alias for backward compatibility
export const getMidtermReports = fetchMidtermReports; 