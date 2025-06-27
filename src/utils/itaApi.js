import { API_BASE_URL } from './apiConfig';

const ITA_API = `${API_BASE_URL}/api`;

export async function fetchITAMaster() {
  const response = await fetch(`${ITA_API}/ita-master`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

export async function searchITAMaster(searchParams) {
  const queryString = new URLSearchParams(searchParams).toString();
  const response = await fetch(`${ITA_API}/ita-master?${queryString}`);
  return response.json();
}

export async function fetchITAMasterById(id) {
  const response = await fetch(`${ITA_API}/ita-master/${id}`);
  return response.json();
}

export async function createITAMaster(data) {
  const response = await fetch(`${ITA_API}/ita-master`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function updateITAMaster(id, data) {
  const response = await fetch(`${ITA_API}/ita-master/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function deleteITAMaster(id) {
  const response = await fetch(`${ITA_API}/ita-master/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

export async function fetchITAMasterStats() {
  const response = await fetch(`${ITA_API}/ita-master/stats/overview`);
  return response.json();
}

export async function fetchITAAttendanceSigned() {
  const response = await fetch(`${ITA_API}/ita-attendance-signed`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

export async function searchITAAttendanceSigned(searchParams) {
  const queryString = new URLSearchParams(searchParams).toString();
  const response = await fetch(`${ITA_API}/ita-attendance-signed?${queryString}`);
  return response.json();
}

export async function fetchITAAttendanceSignedById(id) {
  const response = await fetch(`${ITA_API}/ita-attendance-signed/${id}`);
  return response.json();
}

export async function createITAAttendanceSigned(data) {
  const response = await fetch(`${ITA_API}/ita-attendance-signed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function updateITAAttendanceSigned(id, data) {
  const response = await fetch(`${ITA_API}/ita-attendance-signed/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function deleteITAAttendanceSigned(id) {
  const response = await fetch(`${ITA_API}/ita-attendance-signed/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

export async function updateStudentSignature(id, signatureData) {
  const response = await fetch(`${ITA_API}/ita-attendance-signed/${id}/student-signature`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signatureData)
  });
  return response.json();
}

export async function updateInstructorSignature(id, signatureData) {
  const response = await fetch(`${ITA_API}/ita-attendance-signed/${id}/instructor-signature`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signatureData)
  });
  return response.json();
}

export async function fetchITAAttendanceSignedStats() {
  const response = await fetch(`${ITA_API}/ita-attendance-signed/stats/overview`);
  return response.json();
}

export async function fetchSignedITAAttendance() {
  const response = await fetch(`${ITA_API}/signed-ita-attendance`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
}

export async function searchSignedITAAttendance(searchParams) {
  const queryString = new URLSearchParams(searchParams).toString();
  const response = await fetch(`${ITA_API}/signed-ita-attendance?${queryString}`);
  return response.json();
}

export async function fetchSignedITAAttendanceById(id) {
  const response = await fetch(`${ITA_API}/signed-ita-attendance/${id}`);
  return response.json();
}

export async function createSignedITAAttendance(data) {
  const response = await fetch(`${ITA_API}/signed-ita-attendance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function updateSignedITAAttendance(id, data) {
  const response = await fetch(`${ITA_API}/signed-ita-attendance/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function deleteSignedITAAttendance(id) {
  const response = await fetch(`${ITA_API}/signed-ita-attendance/${id}`, {
    method: 'DELETE'
  });
  return response.json();
}

export async function updateSignedStudentSignature(id, signatureData) {
  const response = await fetch(`${ITA_API}/signed-ita-attendance/${id}/student-signature`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signatureData)
  });
  return response.json();
}

export async function updateSignedInstructorSignature(id, signatureData) {
  const response = await fetch(`${ITA_API}/signed-ita-attendance/${id}/instructor-signature`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signatureData)
  });
  return response.json();
}

export async function fetchSignedITAAttendanceStats() {
  const response = await fetch(`${ITA_API}/signed-ita-attendance/stats/overview`);
  return response.json();
}

export async function fetchSignedITAAttendanceProgress(itaMasterId) {
  const response = await fetch(`${ITA_API}/signed-ita-attendance/progress/${itaMasterId}`);
  return response.json();
}

// Helper functions for common operations
export const itaHelpers = {
    // Format status for display
    formatStatus: (status) => {
        const statusMap = {
            'active': 'Active',
            'completed': 'Completed',
            'terminated': 'Terminated',
            'pending': 'Pending'
        };
        return statusMap[status] || status;
    },
    
    // Format date for display
    formatDate: (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
};

// API objects for backward compatibility
export const itaMasterApi = {
    fetch: fetchITAMaster,
    getAll: fetchITAMaster,
    search: searchITAMaster,
    fetchById: fetchITAMasterById,
    create: createITAMaster,
    update: updateITAMaster,
    delete: deleteITAMaster,
    fetchStats: fetchITAMasterStats
};

export const itaAttendanceSignedApi = {
    fetch: fetchITAAttendanceSigned,
    getAll: fetchITAAttendanceSigned,
    search: searchITAAttendanceSigned,
    fetchById: fetchITAAttendanceSignedById,
    create: createITAAttendanceSigned,
    update: updateITAAttendanceSigned,
    delete: deleteITAAttendanceSigned,
    updateStudentSignature,
    updateInstructorSignature,
    fetchStats: fetchITAAttendanceSignedStats
};

export const signedItaAttendanceApi = {
    fetch: fetchSignedITAAttendance,
    getAll: fetchSignedITAAttendance,
    search: searchSignedITAAttendance,
    fetchById: fetchSignedITAAttendanceById,
    create: createSignedITAAttendance,
    update: updateSignedITAAttendance,
    delete: deleteSignedITAAttendance,
    updateStudentSignature: updateSignedStudentSignature,
    updateInstructorSignature: updateSignedInstructorSignature,
    fetchStats: fetchSignedITAAttendanceStats,
    fetchProgress: fetchSignedITAAttendanceProgress
}; 