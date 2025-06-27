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

const IndividualsContainer = styled.div`
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

const ShowingText = styled.div`
  padding: 15px 20px;
  color: #6c757d;
  font-size: 0.9rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
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

const StatusText = styled.span`
  color: ${props => props.active ? '#27ae60' : '#e74c3c'};
  font-weight: 600;
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

const StatusBadge = styled.span`
  background: ${props => props.active ? '#28a745' : '#6c757d'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const Individuals = () => {
  const [selectedIndividuals, setSelectedIndividuals] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingIndividual, setEditingIndividual] = useState(null);
  const [individualsData, setIndividualsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
    department: ''
  });

  const { confirmState, showDeleteConfirm } = useConfirm();

  // Fetch individuals from API
  const fetchIndividuals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/individuals');
      const data = await response.json();
      if (data.success) {
        setIndividualsData(data.individuals);
      }
    } catch (error) {
      console.error('Error fetching individuals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndividuals();
  }, []);

  const openModal = (individual = null) => {
    if (individual) {
      setEditingIndividual(individual);
      setFormData({
        firstName: individual.first_name || '',
        lastName: individual.last_name || '',
        email: individual.email || '',
        phone: individual.phone || '',
        designation: individual.designation || '',
        department: individual.department || ''
      });
    } else {
      setEditingIndividual(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        designation: '',
        department: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingIndividual(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      designation: '',
      department: ''
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
    // if (!formData.individualName.trim()) {
    //   showError('Please enter an individual name');
    //   return;
    // }
    console.log(formData);
    setLoading(true);
    try {
      const url = editingIndividual
        ? `http://localhost:5000/api/profile/individuals/${editingIndividual.id}`
        : 'http://localhost:5000/api/profile/individuals';

      const method = editingIndividual ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          designation: formData.designation,
          department: formData.department
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Individual updated successfully');
        closeModal();
        fetchIndividuals();
      } else {
        showError(result.message || 'Failed to update individual');
      }
    } catch (error) {
      showError('Error updating individual');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirm(
      individualsData.find(individual => individual.id === id)?.first_name || 'Individual',
      'individual'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/profile/individuals/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Individual deleted successfully');
        fetchIndividuals();
      } else {
        showError(result.message || 'Failed to delete individual');
      }
    } catch (error) {
      showError('Error deleting individual');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (editingIndividual) {
      setFormData({
        firstName: editingIndividual.first_name || '',
        lastName: editingIndividual.last_name || '',
        email: editingIndividual.email || '',
        phone: editingIndividual.phone || '',
        designation: editingIndividual.designation || '',
        department: editingIndividual.department || ''
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        designation: '',
        department: ''
      });
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedIndividuals(individualsData.map(ind => ind.id));
    } else {
      setSelectedIndividuals([]);
    }
  };

  const handleSelectIndividual = (indId) => {
    setSelectedIndividuals(prev => {
      if (prev.includes(indId)) {
        return prev.filter(id => id !== indId);
      } else {
        return [...prev, indId];
      }
    });
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading individuals...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Individuals</Title>
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

      <IndividualsContainer>
        <TableHeader>
          <TableCheckbox
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <HeaderText>Individual Records</HeaderText>
        </TableHeader>

        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: '50px' }}></Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Designation</Th>
              <Th>Department</Th>
              <Th style={{ width: '120px' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {individualsData.map((ind) => (
              <Tr key={ind.id}>
                <Td>
                  <TableCheckbox
                    type="checkbox"
                    checked={selectedIndividuals.includes(ind.id)}
                    onChange={() => handleSelectIndividual(ind.id)}
                  />
                </Td>
                <Td>{`${ind.first_name} ${ind.last_name}`}</Td>
                <Td>{ind.email || '-'}</Td>
                <Td>{ind.phone || '-'}</Td>
                <Td>{ind.designation || '-'}</Td>
                <Td>{ind.department || '-'}</Td>
                <ActionCell>
                  <ActionButton onClick={() => openModal(ind)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton danger onClick={() => handleDelete(ind.id)}>
                    <FaTrash />
                  </ActionButton>
                </ActionCell>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <ShowingText>
          Showing {individualsData.length} of {individualsData.length}
        </ShowingText>
      </IndividualsContainer>

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
              <ModalTitle>{editingIndividual ? 'Edit Individual' : 'Add Individual'}</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label required>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label required>Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Designation</Label>
                  <Input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Department</Label>
                  <Input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit">
                    {editingIndividual ? 'Update' : 'Submit'}
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

export default Individuals; 