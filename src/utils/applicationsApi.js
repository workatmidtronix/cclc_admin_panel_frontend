const API_BASE_URL = '/api/applications';

// Get all applications
export const getApplications = async (searchTerm = '') => {
  try {
    const url = searchTerm ? `${API_BASE_URL}?search=${encodeURIComponent(searchTerm)}` : API_BASE_URL;
    const response = await fetch(url);
    const data = await response.json();
   
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch applications');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
};

// Get application by ID
export const getApplication = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch application');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
};

// Create a new application
export const createApplication = async (applicationData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create application');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
};

// Update an application
export const updateApplication = async (id, applicationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update application');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};

// Delete an application
export const deleteApplication = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete application');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
};

// Update application status
export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update application status');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
}; 