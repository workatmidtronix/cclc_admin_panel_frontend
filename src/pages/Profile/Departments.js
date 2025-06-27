import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaList, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { showSuccess, showError } from '../../components/CustomAlert';
import { useConfirm } from '../../components/useConfirm';
import CustomConfirm from '../../components/CustomConfirm';

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
  font-size: 1.7rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const IconButton = styled.button`
  background: transparent;
  border: 1px solid #e9ecef;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const AddButton = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
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
  max-width: 500px;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
`;

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const ResetButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
  }
`;

const ExampleText = styled.div`
  color: #6c757d;
  font-size: 0.8rem;
  margin-top: 5px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const CheckboxInput = styled.input`
  transform: scale(1.2);
`;

const CheckboxLabel = styled.label`
  color: #2c3e50;
  font-size: 0.9rem;
  cursor: pointer;
`;

const DepartmentsContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeaderText = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #2c3e50;
  color: white;
`;

const Th = styled.th`
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  border-right: 1px solid #34495e;
  
  &:last-child {
    border-right: none;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }
  

  
  border-bottom: 1px solid #e9ecef;
`;

const Td = styled.td`
  padding: 15px 20px;
  color: #495057;
  font-size: 0.95rem;
  border-right: 1px solid #e9ecef;
  
  &:last-child {
    border-right: none;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? '#dc3545' : 'rgb(51, 66, 147)'};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-right: 5px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ActionCell = styled.td`
  width: 120px;
  text-align: center;
`;

const Departments = () => {
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [departmentsData, setDepartmentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    departmentName: '',
    isActive: false
  });

  const { confirmState, showDeleteConfirm } = useConfirm();

  // Fetch departments from API
  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/departments');
      const data = await response.json();
      if (data.success) {
        setDepartmentsData(data.departments);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openModal = (department = null) => {
    if (department) {
      setEditingDepartment(department);
      setFormData({
        departmentName: department.department_name,
        isActive: department.is_active
      });
    } else {
      setEditingDepartment(null);
      setFormData({
        departmentName: '',
        isActive: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDepartment(null);
    setFormData({
      departmentName: '',
      isActive: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.departmentName.trim()) {
      showError('Please enter a department name');
      return;
    }

    setLoading(true);
    try {
      const url = editingDepartment 
        ? `http://localhost:5000/api/profile/departments/${editingDepartment.id}`
        : 'http://localhost:5000/api/profile/departments';
      
      const method = editingDepartment ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departmentName: formData.departmentName,
          isActive: formData.isActive
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Department updated successfully');
        closeModal();
        fetchDepartments();
      } else {
        showError(result.message || 'Failed to update department');
      }
    } catch (error) {
      showError('Error updating department');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirm(
      departmentsData.find(dept => dept.id === id)?.department_name || 'Department',
      'department'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/profile/departments/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Department deleted successfully');
        fetchDepartments();
      } else {
        showError(result.message || 'Failed to delete department');
      }
    } catch (error) {
      showError('Error deleting department');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (editingDepartment) {
      setFormData({
        departmentName: editingDepartment.department_name,
        isActive: editingDepartment.is_active
      });
    } else {
      setFormData({
        departmentName: '',
        isActive: false
      });
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedDepartments(departmentsData.map(dept => dept.id));
    } else {
      setSelectedDepartments([]);
    }
  };

  const handleSelectDepartment = (deptId) => {
    setSelectedDepartments(prev => {
      if (prev.includes(deptId)) {
        return prev.filter(id => id !== deptId);
      } else {
        return [...prev, deptId];
      }
    });
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading departments...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Departments</Title>
        <ActionButtons>
          <IconButton>
            <FaSearch />
          </IconButton>
          <AddButton onClick={() => openModal()}>
            <FaPlus />
          </AddButton>
          <IconButton>
            <FaList />
          </IconButton>
        </ActionButtons>
      </Header>

      <DepartmentsContainer>
        <TableHeader>
          <CheckboxInput
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <HeaderText>Department Records</HeaderText>
        </TableHeader>

        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: '50px' }}></Th>
              <Th>Department ID</Th>
              <Th>Department</Th>
              <Th style={{ width: '120px' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {departmentsData.map((dept) => (
              <Tr key={dept.id}>
                <Td>
                  <CheckboxInput
                    type="checkbox"
                    checked={selectedDepartments.includes(dept.id)}
                    onChange={() => handleSelectDepartment(dept.id)}
                  />
                </Td>
                <Td>{dept.department_id}</Td>
                <Td>{dept.department_name}</Td>
                <ActionCell>
                  <ActionButton onClick={() => openModal(dept)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton danger onClick={() => handleDelete(dept.id)}>
                    <FaTrash />
                  </ActionButton>
                </ActionCell>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </DepartmentsContainer>

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

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingDepartment ? 'Edit Department' : 'Add Department'}</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label required>Department Name</Label>
                  <Input
                    type="text"
                    name="departmentName"
                    value={formData.departmentName}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                    required
                  />
                  <ExampleText>Example: Computer Science, Mathematics, Physics</ExampleText>
                </FormGroup>

                <CheckboxContainer>
                  <CheckboxInput
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <CheckboxLabel>Set as Active Department</CheckboxLabel>
                </CheckboxContainer>

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (editingDepartment ? 'Update' : 'Add')}
                  </SubmitButton>
                </ButtonGroup>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Departments; 