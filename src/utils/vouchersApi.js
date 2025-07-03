import { API_BASE_URL } from './apiConfig';
// Get all vouchers
export const getAllVouchers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/vouchers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch vouchers');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching vouchers:', error);
        throw error;
    }
};

// Get voucher by ID
export const getVoucherById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/vouchers/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch voucher');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching voucher:', error);
        throw error;
    }
};

// Create new voucher
export const createVoucher = async (voucherData) => {
    try {
        const formData = new FormData();

        // Add all voucher data to formData
        Object.keys(voucherData).forEach(key => {
            if (key === 'voucherFile' && voucherData[key]) {
                formData.append('voucherFile', voucherData[key]);
            } else if (voucherData[key] !== null && voucherData[key] !== undefined) {
                formData.append(key, voucherData[key]);
            }
        });

        const response = await fetch(`${API_BASE_URL}/api/vouchers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create voucher');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating voucher:', error);
        throw error;
    }
};

// Update voucher
export const updateVoucher = async (id, voucherData) => {
    try {
        const formData = new FormData();

        // Add all voucher data to formData
        Object.keys(voucherData).forEach(key => {
            if (key === 'voucherFile' && voucherData[key]) {
                formData.append('voucherFile', voucherData[key]);
            } else if (voucherData[key] !== null && voucherData[key] !== undefined) {
                formData.append(key, voucherData[key]);
            }
        });

        const response = await fetch(`${API_BASE_URL}/api/vouchers/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update voucher');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating voucher:', error);
        throw error;
    }
};

// Delete voucher
export const deleteVoucher = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/vouchers/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to delete voucher');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting voucher:', error);
        throw error;
    }
};

// Get vouchers by student ID
export const getVouchersByStudentId = async (studentId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/vouchers/student/${studentId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch student vouchers');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching student vouchers:', error);
        throw error;
    }
}; 