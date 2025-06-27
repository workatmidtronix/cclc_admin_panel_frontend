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

const DesignationsContainer = styled.div`
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

const TableCheckbox = styled.input`
  margin-right: 10px;
  transform: scale(1.2);
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

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const StatusText = styled.span`
  background: ${props => props.active ? '#28a745' : '#6c757d'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ExampleText = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 4px;
  display: block;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const CheckboxLabel = styled.label`
  margin-left: 8px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
`;

const Designations = () => {
  const [selectedDesignations, setSelectedDesignations] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null);
  const [designationsData, setDesignationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    designationName: '',
    designationCode: '',
    description: '',
    isActive: false
  });

  const { confirmState, showDeleteConfirm } = useConfirm();

  // Fetch designations from API
  const fetchDesignations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/designations');
      const data = await response.json();
      if (data.success) {
        setDesignationsData(data.designations);
      }
    } catch (error) {
      console.error('Error fetching designations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const openModal = (designation = null) => {
    if (designation) {
      setEditingDesignation(designation);
      setFormData({
        designationName: designation.designation_name || '',
        designationCode: designation.designation_code || '',
        description: designation.description || '',
        isActive: designation.is_active || false
      });
    } else {
      setEditingDesignation(null);
      setFormData({
        designationName: '',
        designationCode: '',
        description: '',
        isActive: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDesignation(null);
    setFormData({
      designationName: '',
      designationCode: '',
      description: '',
      isActive: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.designationName.trim()) {
      showError('Please enter a designation name');
      return;
    }

    setLoading(true);
    try {
      const url = editingDesignation 
        ? `http://localhost:5000/api/profile/designations/${editingDesignation.id}`
        : 'http://localhost:5000/api/profile/designations';
      
      const method = editingDesignation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          designationName: formData.designationName,
          designationCode: formData.designationCode,
          description: formData.description,
          isActive: formData.isActive
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Designation updated successfully');
        closeModal();
        fetchDesignations();
      } else {
        showError(result.message || 'Failed to update designation');
      }
    } catch (error) {
      showError('Error updating designation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirm(
      designationsData.find(designation => designation.id === id)?.designation_name || 'Designation',
      'designation'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/profile/designations/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Designation deleted successfully');
        fetchDesignations();
      } else {
        showError(result.message || 'Failed to delete designation');
      }
    } catch (error) {
      showError('Error deleting designation');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (editingDesignation) {
      setFormData({
        designationName: editingDesignation.designation_name || '',
        designationCode: editingDesignation.designation_code || '',
        description: editingDesignation.description || '',
        isActive: editingDesignation.is_active || false
      });
    } else {
      setFormData({
        designationName: '',
        designationCode: '',
        description: '',
        isActive: false
      });
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedDesignations(designationsData.map(des => des.id));
    } else {
      setSelectedDesignations([]);
    }
  };

  const handleSelectDesignation = (desId) => {
    setSelectedDesignations(prev => {
      if (prev.includes(desId)) {
        return prev.filter(id => id !== desId);
      } else {
        return [...prev, desId];
      }
    });
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading designations...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Designations</Title>
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

      <DesignationsContainer>
        <TableHeader>
          <TableCheckbox
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <HeaderText>Designation Records</HeaderText>
        </TableHeader>

        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: '50px' }}></Th>
              <Th>Designation Name</Th>
              <Th>Designation Code</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th style={{ width: '120px' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {designationsData.map((des) => (
              <Tr key={des.id}>
                <Td>
                  <TableCheckbox
                    type="checkbox"
                    checked={selectedDesignations.includes(des.id)}
                    onChange={() => handleSelectDesignation(des.id)}
                  />
                </Td>
                <Td>{des.designation_name}</Td>
                <Td>{des.designation_code}</Td>
                <Td>{des.description || '-'}</Td>
                <Td>
                  <StatusText active={des.is_active}>
                    {des.is_active ? 'Active' : 'Inactive'}
                  </StatusText>
                </Td>
                <ActionCell>
                  <ActionButton onClick={() => openModal(des)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton danger onClick={() => handleDelete(des.id)}>
                    <FaTrash />
                  </ActionButton>
                </ActionCell>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </DesignationsContainer>

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
              <ModalTitle>{editingDesignation ? 'Edit Designation' : 'Add Designation'}</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label required>Designation Name</Label>
                  <Input
                    type="text"
                    name="designationName"
                    value={formData.designationName}
                    onChange={handleInputChange}
                    placeholder="e.g., Professor"
                    required
                  />
                  <ExampleText>Example: Professor, Assistant Professor, Lecturer</ExampleText>
                </FormGroup>

                <FormGroup>
                  <Label>Designation Code</Label>
                  <Input
                    type="text"
                    name="designationCode"
                    value={formData.designationCode}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter description..."
                  />
                </FormGroup>

                <CheckboxContainer>
                  <TableCheckbox
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <CheckboxLabel>Set as Active Designation</CheckboxLabel>
                </CheckboxContainer>

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (editingDesignation ? 'Update' : 'Add')}
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

export default Designations; 