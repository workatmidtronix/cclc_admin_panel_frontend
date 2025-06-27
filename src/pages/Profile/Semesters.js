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

const SemestersContainer = styled.div`
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

const CheckboxInput = styled.input`
  margin-right: 8px;
  transform: scale(1.1);
`;

const Semesters = () => {
  const [selectedSemesters, setSelectedSemesters] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [semestersData, setSemestersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    semesterName: '',
    semesterCode: '',
    startDate: '',
    endDate: '',
    isActive: false
  });

  const { confirmState, showDeleteConfirm } = useConfirm();

  // Fetch semesters from API
  const fetchSemesters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/semesters');
      const data = await response.json();
      if (data.success) {
        setSemestersData(data.semesters);
      }
    } catch (error) {
      console.error('Error fetching semesters:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const openModal = (semester = null) => {
    if (semester) {
      setEditingSemester(semester);
      setFormData({
        semesterName: semester.semester_name || '',
        semesterCode: semester.semester_code || '',
        startDate: semester.start_date || '',
        endDate: semester.end_date || '',
        isActive: semester.is_active || false
      });
    } else {
      setEditingSemester(null);
      setFormData({
        semesterName: '',
        semesterCode: '',
        startDate: '',
        endDate: '',
        isActive: false
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSemester(null);
    setFormData({
      semesterName: '',
      semesterCode: '',
      startDate: '',
      endDate: '',
      isActive: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.semesterName.trim()) {
      showError('Please enter a semester name');
      return;
    }

    setLoading(true);
    try {
      const url = editingSemester 
        ? `http://localhost:5000/api/profile/semesters/${editingSemester.id}`
        : 'http://localhost:5000/api/profile/semesters';
      
      const method = editingSemester ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          semesterName: formData.semesterName,
          isActive: formData.isActive,
          semesterCode: formData.semesterCode,
          startDate: formData.startDate,
          endDate: formData.endDate
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Semester updated successfully');
        closeModal();
        fetchSemesters();
      } else {
        showError(result.message || 'Failed to update semester');
      }
    } catch (error) {
      showError('Error updating semester');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirm(
      semestersData.find(semester => semester.id === id)?.semester_name || 'Semester',
      'semester'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/profile/semesters/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Semester deleted successfully');
        fetchSemesters();
      } else {
        showError(result.message || 'Failed to delete semester');
      }
    } catch (error) {
      showError('Error deleting semester');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (editingSemester) {
      setFormData({
        semesterName: editingSemester.semester_name || '',
        semesterCode: editingSemester.semester_code || '',
        startDate: editingSemester.start_date || '',
        endDate: editingSemester.end_date || '',
        isActive: editingSemester.is_active || false
      });
    } else {
      setFormData({
        semesterName: '',
        semesterCode: '',
        startDate: '',
        endDate: '',
        isActive: false
      });
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedSemesters(semestersData.map(sem => sem.id));
    } else {
      setSelectedSemesters([]);
    }
  };

  const handleSelectSemester = (semId) => {
    setSelectedSemesters(prev => {
      if (prev.includes(semId)) {
        return prev.filter(id => id !== semId);
      } else {
        return [...prev, semId];
      }
    });
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading semesters...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Semesters</Title>
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

      <SemestersContainer>
        <TableHeader>
          <TableCheckbox
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <HeaderText>Semester Records</HeaderText>
        </TableHeader>

        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: '50px' }}></Th>
              <Th>Semester Name</Th>
              <Th>Semester Code</Th>
              <Th>Start Date</Th>
              <Th>End Date</Th>
              <Th style={{ width: '120px' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {semestersData.map((sem) => (
              <Tr key={sem.id}>
                <Td>
                  <TableCheckbox
                    type="checkbox"
                    checked={selectedSemesters.includes(sem.id)}
                    onChange={() => handleSelectSemester(sem.id)}
                  />
                </Td>
                <Td>{sem.semester_name}</Td>
                <Td>{sem.semester_code}</Td>
                <Td>{sem.start_date ? new Date(sem.start_date).toLocaleDateString() : '-'}</Td>
                <Td>{sem.end_date ? new Date(sem.end_date).toLocaleDateString() : '-'}</Td>
                <ActionCell>
                  <ActionButton onClick={() => openModal(sem)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton danger onClick={() => handleDelete(sem.id)}>
                    <FaTrash />
                  </ActionButton>
                </ActionCell>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </SemestersContainer>

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
              <ModalTitle>{editingSemester ? 'Edit Semester' : 'Add Semester'}</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label required>Semester Name</Label>
                  <Input
                    type="text"
                    name="semesterName"
                    value={formData.semesterName}
                    onChange={handleInputChange}
                    placeholder="e.g., Fall 2024"
                    required
                  />
                  <ExampleText>Example: Fall 2024, Spring 2025, Summer 2025</ExampleText>
                </FormGroup>

                <FormGroup>
                  <Label>Semester Code</Label>
                  <Input
                    type="text"
                    name="semesterCode"
                    value={formData.semesterCode}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <CheckboxContainer>
                  <CheckboxInput
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <CheckboxLabel>Set as Active Semester</CheckboxLabel>
                </CheckboxContainer>

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (editingSemester ? 'Update' : 'Add')}
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

export default Semesters; 