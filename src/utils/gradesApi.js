// Grades API utility functions

const API_BASE_URL = '/api/grades';

// ==================== GRADE CATEGORIES ====================

// Fetch all grade categories
export const fetchGradeCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch grade categories');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching grade categories:', error);
    throw error;
  }
};

// Create new grade category
export const createGradeCategory = async (categoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create grade category');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating grade category:', error);
    throw error;
  }
};

// Update grade category
export const updateGradeCategory = async (id, categoryData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update grade category');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating grade category:', error);
    throw error;
  }
};

// Delete grade category
export const deleteGradeCategory = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete grade category');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting grade category:', error);
    throw error;
  }
};

// ==================== GRADE COLUMNS ====================

// Fetch all grade columns
export const fetchGradeColumns = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/columns`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch grade columns');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching grade columns:', error);
    throw error;
  }
};

// Create new grade column
export const createGradeColumn = async (columnData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/columns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(columnData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create grade column');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating grade column:', error);
    throw error;
  }
};

// Update grade column
export const updateGradeColumn = async (id, columnData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/columns/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(columnData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update grade column');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating grade column:', error);
    throw error;
  }
};

// Delete grade column
export const deleteGradeColumn = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/columns/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete grade column');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting grade column:', error);
    throw error;
  }
};

// ==================== HELPER ENDPOINTS ====================

// Fetch courses for dropdown
export const fetchCourses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch courses');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Fetch instructors for dropdown
export const fetchInstructors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/instructors`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch instructors');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};

// Fetch categories for dropdown
export const fetchCategoriesDropdown = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories-dropdown`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}; 