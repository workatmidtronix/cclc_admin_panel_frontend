import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';
import { FaTimes, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { showSuccess, showError } from '../../components/CustomAlert';
import { useConfirm } from '../../components/useConfirm';
import CustomConfirm from '../../components/CustomConfirm';

const Container = styled.div`
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr 1fr;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #333;
`;

const TableBody = styled.div`
  min-width: 100%;
`;

const HeaderCell = styled.div`
  padding: 15px 20px;
  border-right: 1px solid #dee2e6;
  font-size: 14px;
  
  &:last-child {
    border-right: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr 1fr;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableCell = styled.div`
  padding: 15px 20px;
  border-right: 1px solid #eee;
  font-size: 14px;
  color: #333;
  
  &:last-child {
    border-right: none;
  }
`;

const CheckboxCell = styled(TableCell)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NameCell = styled(TableCell)`
  color: #333;
  font-weight: 500;
`;

const EmailCell = styled(TableCell)`
  color: #007bff;
`;

const PhoneCell = styled(TableCell)`
  color: #333;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  background: ${props => props.danger ? '#dc3545' : 'rgb(51, 66, 147)'};
  color: white;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background: ${props => props.danger ? '#c82333' : 'rgb(5, 71, 141)'};
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 15px 15px 0 0;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    background: #e9ecef;
    color: #2c3e50;
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  &:after {
    content: ${props => props.required ? '" *"' : '""'};
    color: #dc3545;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 30px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.primary && `
    background: rgb(51, 66, 147);
    color: white;
    
    &:hover {
      background: rgb(5, 71, 141);
    }
  `}
  
  ${props => props.secondary && `
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #545b62;
    }
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
`;

const AllStaffs = () => {
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';
  const [staffs, setStaffs] = useState([]);
  const [selectedStaffs, setSelectedStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editApiMessage, setEditApiMessage] = useState(null);
  const [editApiError, setEditApiError] = useState(null);

  const { confirmState, showDeleteConfirm } = useConfirm();

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/staff/all');
      if (response.data.success) {
        setStaffs(response.data.staff);
      } else {
        setError('Failed to fetch staff data');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching staff data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStaffs(staffs.map(staff => staff.id));
    } else {
      setSelectedStaffs([]);
    }
  };

  const handleSelectStaff = (staffId, isSelected) => {
    if (isSelected) {
      setSelectedStaffs(prev => [...prev, staffId]);
    } else {
      setSelectedStaffs(prev => prev.filter(id => id !== staffId));
    }
  };

  const handleEdit = (staff) => {
    setEditForm({ ...staff });
    setEditApiMessage(null);
    setEditApiError(null);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    const staffMember = staffs.find(staff => staff.id === id);
    const confirmed = await showDeleteConfirm(
      staffMember?.name || 'Staff Member',
      'staff member'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/staff/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSuccess('Staff member deleted successfully');
        fetchStaffs();
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Error deleting staff member');
      }
    } catch (error) {
      showError('Error deleting staff member');
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    setEditForm(prev => ({ ...prev, photo: file }));
  };

  const handleUpdate = async () => {
    setEditApiMessage(null);
    setEditApiError(null);
    try {
      const data = new FormData();
      data.append('name', editForm.name);
      data.append('salutation', editForm.salutation);
      data.append('contact_number', editForm.contact_number);
      data.append('email', editForm.email);
      data.append('qualification', editForm.qualification);
      data.append('date_of_birth', editForm.date_of_birth);
      data.append('gender', editForm.gender);
      data.append('marital_status', editForm.marital_status);
      data.append('status', editForm.status);
      data.append('address_line1', editForm.address_line1);
      data.append('address_line2', editForm.address_line2);
      data.append('city', editForm.city);
      data.append('state', editForm.state);
      data.append('postal_code', editForm.postal_code);
      data.append('country', editForm.country);
      if (editForm.photo instanceof File) data.append('photo', editForm.photo);
      
      const res = await axios.post(`http://localhost:5000/api/staff/edit/${editForm.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        setEditApiMessage(res.data.message || 'Staff member updated successfully.');
        // Update the staffs list
        setStaffs(prev => prev.map(staff => 
          staff.id === editForm.id ? { ...staff, ...editForm } : staff
        ));
        setTimeout(() => {
          setEditModalOpen(false);
        }, 2000);
      }
    } catch (err) {
      setEditApiError(err.response?.data?.message || 'An error occurred.');
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>All Staff Members</Title>
        <div>Loading...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>All Staff Members</Title>
        <div style={{ color: 'red' }}>{error}</div>
      </Container>
    );
  }

  return (
    <Container>
      <Title>All Staff Members</Title>
      
      <TableContainer>
        <TableHeader>
          {isAdmin && (
            <HeaderCell>
              <Checkbox 
                type="checkbox" 
                checked={selectedStaffs.length === staffs.length && staffs.length > 0}
                onChange={handleSelectAll}
              />
            </HeaderCell>
          )}
          <HeaderCell>Name</HeaderCell>
          <HeaderCell>Email</HeaderCell>
          <HeaderCell>Phone</HeaderCell>
          {isAdmin && <HeaderCell>Actions</HeaderCell>}
        </TableHeader>
        
        <TableBody>
          {staffs.map((staff) => (
            <TableRow key={staff.id}>
              {isAdmin && (
                <CheckboxCell>
                  <Checkbox 
                    type="checkbox" 
                    checked={selectedStaffs.includes(staff.id)}
                    onChange={(e) => handleSelectStaff(staff.id, e.target.checked)}
                  />
                </CheckboxCell>
              )}
              <NameCell>{staff.name}</NameCell>
              <EmailCell>{staff.email}</EmailCell>
              <PhoneCell>{staff.contact_number}</PhoneCell>
              {isAdmin && (
                <TableCell>
                  <ActionButton onClick={() => handleEdit(staff)}>Edit</ActionButton>
                  <ActionButton danger onClick={() => handleDelete(staff.id)}>Delete</ActionButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </TableContainer>

      {/* Custom Confirmation Dialog */}
      <CustomConfirm
        isOpen={confirmState.isOpen}
        onClose={confirmState.onCancel}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        details={confirmState.details}
        itemName={confirmState.itemName}
      />

      {editModalOpen && editForm && (
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Edit Staff Member</ModalTitle>
              <CloseButton onClick={() => setEditModalOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              {editApiError && <div style={{ color: 'red', marginBottom: 15, padding: '10px', background: '#f8d7da', borderRadius: '4px' }}>{editApiError}</div>}
              {editApiMessage && <div style={{ color: 'green', marginBottom: 15, padding: '10px', background: '#d4edda', borderRadius: '4px' }}>{editApiMessage}</div>}
              
              <FormGrid>
                <LeftColumn>
                  <FormGroup>
                    <Label required>Staff Name</Label>
                    <Input 
                      value={editForm.name || ''} 
                      onChange={e => handleEditInputChange('name', e.target.value)} 
                      placeholder="Enter staff name"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Salutation</Label>
                    <Select 
                      value={editForm.salutation || ''} 
                      onChange={e => handleEditInputChange('salutation', e.target.value)}
                    >
                      <option value="">--Select Salutation--</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Email</Label>
                    <Input 
                      value={editForm.email || ''} 
                      onChange={e => handleEditInputChange('email', e.target.value)} 
                      placeholder="Enter email"
                      type="email"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Contact Number</Label>
                    <Input 
                      value={editForm.contact_number || ''} 
                      onChange={e => handleEditInputChange('contact_number', e.target.value)} 
                      placeholder="Enter contact number"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Qualification</Label>
                    <Input 
                      value={editForm.qualification || ''} 
                      onChange={e => handleEditInputChange('qualification', e.target.value)} 
                      placeholder="Enter qualification"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Date of Birth</Label>
                    <Input 
                      value={editForm.date_of_birth || ''} 
                      onChange={e => handleEditInputChange('date_of_birth', e.target.value)} 
                      type="date"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Gender</Label>
                    <Select 
                      value={editForm.gender || ''} 
                      onChange={e => handleEditInputChange('gender', e.target.value)}
                    >
                      <option value="">--Select Gender--</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormGroup>
                </LeftColumn>
                
                <RightColumn>
                  <FormGroup>
                    <Label>Marital Status</Label>
                    <Select 
                      value={editForm.marital_status || ''} 
                      onChange={e => handleEditInputChange('marital_status', e.target.value)}
                    >
                      <option value="">--Select Marital Status--</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Status</Label>
                    <Select 
                      value={editForm.status || ''} 
                      onChange={e => handleEditInputChange('status', e.target.value)}
                    >
                      <option value="">--Select Status--</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="On Leave">On Leave</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Address Line 1</Label>
                    <Input 
                      value={editForm.address_line1 || ''} 
                      onChange={e => handleEditInputChange('address_line1', e.target.value)} 
                      placeholder="Enter address line 1"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Address Line 2</Label>
                    <Input 
                      value={editForm.address_line2 || ''} 
                      onChange={e => handleEditInputChange('address_line2', e.target.value)} 
                      placeholder="Enter address line 2"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>City</Label>
                    <Input 
                      value={editForm.city || ''} 
                      onChange={e => handleEditInputChange('city', e.target.value)} 
                      placeholder="Enter city"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>State</Label>
                    <Input 
                      value={editForm.state || ''} 
                      onChange={e => handleEditInputChange('state', e.target.value)} 
                      placeholder="Enter state"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Postal Code</Label>
                    <Input 
                      value={editForm.postal_code || ''} 
                      onChange={e => handleEditInputChange('postal_code', e.target.value)} 
                      placeholder="Enter postal code"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Country</Label>
                    <Input 
                      value={editForm.country || ''} 
                      onChange={e => handleEditInputChange('country', e.target.value)} 
                      placeholder="Enter country"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Profile Photo</Label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={handleEditFileChange}
                    />
                  </FormGroup>
                </RightColumn>
              </FormGrid>
              
              <ButtonGroup>
                <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                <Button primary onClick={handleUpdate}>Update Staff Member</Button>
              </ButtonGroup>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AllStaffs; 