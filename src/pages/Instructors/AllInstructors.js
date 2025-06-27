import React, { useState, useEffect } from 'react';
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
  grid-template-columns: 40px 100px 200px 200px 120px 120px 150px 150px 120px 80px 80px 100px 80px 120px;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #333;
  min-width: 1500px;
`;

const TableBody = styled.div`
  min-width: 1500px;
  overflow-x: auto;
`;

const HeaderCell = styled.div`
  padding: 15px 8px;
  border-right: 1px solid #dee2e6;
  font-size: 12px;
  
  &:last-child {
    border-right: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 40px 100px 200px 200px 120px 120px 150px 150px 120px 80px 80px 100px 80px 120px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableCell = styled.div`
  padding: 12px 8px;
  border-right: 1px solid #eee;
  font-size: 12px;
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
  color: #007bff;
  font-weight: 500;
`;

const EmailCell = styled(TableCell)`
  color: #007bff;
`;

const DepartmentCell = styled(TableCell)`
  font-weight: 500;
`;

const CourseCell = styled(TableCell)`
  color: #007bff;
`;

const PhotoCell = styled(TableCell)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PhotoImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
`;

const StatusCell = styled(TableCell)`
  color: #28a745;
  font-weight: 500;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
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

const AllInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editApiMessage, setEditApiMessage] = useState(null);
  const [editApiError, setEditApiError] = useState(null);

  const { confirmState, showDeleteConfirm } = useConfirm();

  const departments = ['EKG & PHL', 'CNA', 'CPR/AED/BLS', 'Phlebotomy', 'Medical Assistant'];
  const designations = ['Instructor', 'Senior Instructor', 'Lead Instructor', 'Department Head'];
  const courses = ['EKG', 'CNA', 'CPR/AED/BLS', 'Phlebotomy', 'Medical Assistant', 'Pharmacy Technician'];

  const fetchInstructors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/staff/instructors');
      if (response.data.success) {
        setInstructors(response.data.instructors);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedInstructors(instructors.map(instructor => instructor.id));
    } else {
      setSelectedInstructors([]);
    }
  };

  const handleSelectInstructor = (instructorId, isSelected) => {
    if (isSelected) {
      setSelectedInstructors(prev => [...prev, instructorId]);
    } else {
      setSelectedInstructors(prev => prev.filter(id => id !== instructorId));
    }
  };

  const handleEdit = (instructor) => {
    setEditForm({ ...instructor });
    setEditApiMessage(null);
    setEditApiError(null);
    setEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    const instructor = instructors.find(inst => inst.id === id);
    const confirmed = await showDeleteConfirm(
      instructor?.name || 'Instructor',
      'instructor'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/instructors/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSuccess('Instructor deleted successfully');
        fetchInstructors();
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Error deleting instructor');
      }
    } catch (error) {
      showError('Error deleting instructor');
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
      data.append('instructor_id', editForm.instructor_id);
      data.append('name', editForm.name);
      data.append('salutation', editForm.salutation);
      data.append('contact_number', editForm.contact_number);
      data.append('email', editForm.email);
      data.append('qualification', editForm.qualification);
      data.append('course', editForm.course);
      data.append('date_of_birth', editForm.date_of_birth);
      data.append('gender', editForm.gender);
      data.append('marital_status', editForm.marital_status);
      data.append('department', editForm.department);
      data.append('designation', editForm.designation);
      data.append('status', editForm.status);
      data.append('address_line1', editForm.address_line1);
      data.append('address_line2', editForm.address_line2);
      data.append('city', editForm.city);
      data.append('state', editForm.state);
      data.append('postal_code', editForm.postal_code);
      data.append('country', editForm.country);
      if (editForm.photo instanceof File) data.append('photo', editForm.photo);
      
      const res = await axios.post(`http://localhost:5000/api/staff/edit-instructor/${editForm.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.success) {
        setEditApiMessage(res.data.message || 'Instructor updated successfully.');
        // Update the instructors list
        setInstructors(prev => prev.map(instructor => 
          instructor.id === editForm.id ? { ...instructor, ...editForm } : instructor
        ));
        setTimeout(() => {
          setEditModalOpen(false);
        }, 2000);
      }
    } catch (err) {
      setEditApiError(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <Container>
      <Title>All Instructors</Title>
      
      <TableContainer>
        <TableWrapper>
          <TableHeader>
            <HeaderCell>
              <Checkbox 
                type="checkbox"
                checked={selectedInstructors.length === instructors.length && instructors.length > 0}
                onChange={handleSelectAll}
              />
            </HeaderCell>
            <HeaderCell>Instructor ID</HeaderCell>
            <HeaderCell>Instructor Name</HeaderCell>
            <HeaderCell>Email</HeaderCell>
            <HeaderCell>Department</HeaderCell>
            <HeaderCell>Designation</HeaderCell>
            <HeaderCell>Course</HeaderCell>
            <HeaderCell>Contact Number</HeaderCell>
            <HeaderCell>Date of Birth</HeaderCell>
            <HeaderCell>Gender</HeaderCell>
            <HeaderCell>Photo</HeaderCell>
            <HeaderCell>Status</HeaderCell>
            <HeaderCell>Actions</HeaderCell>
          </TableHeader>
          
          <TableBody>
            {instructors.map((instructor) => (
              <TableRow key={instructor.id}>
                <CheckboxCell>
                  <Checkbox 
                    type="checkbox"
                    checked={selectedInstructors.includes(instructor.id)}
                    onChange={(e) => handleSelectInstructor(instructor.id, e.target.checked)}
                  />
                </CheckboxCell>
                <TableCell>{instructor.instructor_id}</TableCell>
                <NameCell>{instructor.name}</NameCell>
                <EmailCell>{instructor.email}</EmailCell>
                <DepartmentCell>{instructor.department}</DepartmentCell>
                <TableCell>{instructor.designation}</TableCell>
                <CourseCell>{instructor.course}</CourseCell>
                <TableCell>{instructor.contact_number}</TableCell>
                <TableCell>{instructor.date_of_birth}</TableCell>
                <TableCell>{instructor.gender}</TableCell>
                <PhotoCell>
                  {instructor.photo ? (
                    <PhotoImage src={instructor.photo} alt="Instructor" />
                  ) : (
                    <div style={{ 
                      width: '30px', 
                      height: '30px', 
                      borderRadius: '50%', 
                      background: '#e9ecef',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: '#6c757d'
                    }}>
                      👤
                    </div>
                  )}
                </PhotoCell>
                <StatusCell>{instructor.status}</StatusCell>
                <TableCell style={{width: '135px'}}>
                  <ActionButton onClick={() => handleEdit(instructor)}>Edit</ActionButton>
                  <ActionButton danger onClick={() => handleDelete(instructor.id)}>Delete</ActionButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableWrapper>
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
              <ModalTitle>Edit Instructor</ModalTitle>
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
                    <Label required>Instructor Name</Label>
                    <Input 
                      value={editForm.name || ''} 
                      onChange={e => handleEditInputChange('name', e.target.value)} 
                      placeholder="Enter instructor name"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Instructor ID</Label>
                    <Input 
                      value={editForm.instructor_id || ''} 
                      onChange={e => handleEditInputChange('instructor_id', e.target.value)} 
                      placeholder="Enter instructor ID"
                    />
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
                    <Label>Course</Label>
                    <Select 
                      value={editForm.course || ''} 
                      onChange={e => handleEditInputChange('course', e.target.value)}
                    >
                      <option value="">--Select Course--</option>
                      {courses.map((course, index) => (
                        <option key={index} value={course}>{course}</option>
                      ))}
                    </Select>
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
                      <option value="Others">Others</option>
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Marital Status</Label>
                    <Select 
                      value={editForm.marital_status || ''} 
                      onChange={e => handleEditInputChange('marital_status', e.target.value)}
                    >
                      <option value="">--Select Status--</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </Select>
                  </FormGroup>
                </LeftColumn>
                
                <RightColumn>
                  <FormGroup>
                    <Label>Department</Label>
                    <Select 
                      value={editForm.department || ''} 
                      onChange={e => handleEditInputChange('department', e.target.value)}
                    >
                      <option value="">--Select Department--</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                      ))}
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Designation</Label>
                    <Select 
                      value={editForm.designation || ''} 
                      onChange={e => handleEditInputChange('designation', e.target.value)}
                    >
                      <option value="">--Select Designation--</option>
                      {designations.map((designation, index) => (
                        <option key={index} value={designation}>{designation}</option>
                      ))}
                    </Select>
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Status</Label>
                    <Select 
                      value={editForm.status || ''} 
                      onChange={e => handleEditInputChange('status', e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
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
                    <Label>Photo</Label>
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
                <Button primary onClick={handleUpdate}>Update Instructor</Button>
              </ButtonGroup>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AllInstructors; 