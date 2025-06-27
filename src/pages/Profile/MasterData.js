import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaList, FaTimes, FaEnvelope, FaUpload, FaEdit, FaTrash } from 'react-icons/fa';
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
  max-width: 700px;
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

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
`;

const FormSection = styled.div`
  margin-bottom: 35px;
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

const EmailInputContainer = styled.div`
  position: relative;
`;

const EmailInput = styled.input`
  padding: 12px 45px 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const EmailIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  pointer-events: none;
`;

const FileInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px 15px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: rgb(51, 66, 147);;
  }
`;

const FileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputText = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
  margin-right: auto;
`;

const UploadIcon = styled.div`
  color: rgb(51, 66, 147);;
  margin-left: 10px;
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

const MasterDataContainer = styled.div`
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

const CheckboxInput = styled.input`
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

const StatusBadge = styled.span`
  background: ${props => props.active ? '#28a745' : '#6c757d'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
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

const MasterData = () => {
  const [selectedData, setSelectedData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [masterDataRecords, setMasterDataRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    dataType: '',
    dataKey: '',
    dataValue: '',
    description: ''
  });

  const { confirmState, showDeleteConfirm } = useConfirm();

  // Fetch master data from API
  const fetchMasterData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile/master-data');
      const data = await response.json();
      if (data.success) {
        setMasterDataRecords(data.masterData);
      }
    } catch (error) {
      console.error('Error fetching master data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const openModal = (masterData = null) => {
    if (masterData) {
      setEditingData(masterData);
      setFormData({
        dataType: masterData.data_type || '',
        dataKey: masterData.data_key || '',
        dataValue: masterData.data_value || '',
        description: masterData.description || ''
      });
    } else {
      setEditingData(null);
      setFormData({
        dataType: '',
        dataKey: '',
        dataValue: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingData(null);
    setFormData({
      dataType: '',
      dataKey: '',
      dataValue: '',
      description: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.dataType.trim()) {
      showError('Please enter a data type');
      return;
    }
    if (!formData.dataKey.trim()) {
      showError('Please enter a data key');
      return;
    }
    if (!formData.dataValue.trim()) {
      showError('Please enter a data value');
      return;
    }

    setLoading(true);
    try {
      const url = editingData 
        ? `http://localhost:5000/api/profile/master-data/${editingData.id}`
        : 'http://localhost:5000/api/profile/master-data';
      
      const method = editingData ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataType: formData.dataType,
          dataKey: formData.dataKey,
          dataValue: formData.dataValue,
          description: formData.description
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Master data updated successfully');
        closeModal();
        fetchMasterData();
      } else {
        showError(result.message || 'Failed to update master data');
      }
    } catch (error) {
      showError('Error updating master data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirm(
      masterDataRecords.find(data => data.id === id)?.data_key || 'Master Data',
      'master data'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/profile/master-data/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Master data deleted successfully');
        fetchMasterData();
      } else {
        showError(result.message || 'Failed to delete master data');
      }
    } catch (error) {
      showError('Error deleting master data');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (editingData) {
      setFormData({
        dataType: editingData.data_type || '',
        dataKey: editingData.data_key || '',
        dataValue: editingData.data_value || '',
        description: editingData.description || ''
      });
    } else {
      setFormData({
        dataType: '',
        dataKey: '',
        dataValue: '',
        description: ''
      });
    }
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedData(masterDataRecords.map(record => record.id));
    } else {
      setSelectedData([]);
    }
  };

  const handleSelectRecord = (recordId) => {
    setSelectedData(prev => {
      if (prev.includes(recordId)) {
        return prev.filter(id => id !== recordId);
      } else {
        return [...prev, recordId];
      }
    });
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading master data...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Master Data</Title>
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

      <MasterDataContainer>
        <TableHeader>
          <CheckboxInput
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <HeaderText>Master Data Records</HeaderText>
        </TableHeader>

        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: '50px' }}></Th>
              <Th>Data Type</Th>
              <Th>Data Key</Th>
              <Th>Data Value</Th>
              <Th>Description</Th>
              <Th style={{ width: '120px' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {masterDataRecords.map((record) => (
              <Tr key={record.id}>
                <Td>
                  <CheckboxInput
                    type="checkbox"
                    checked={selectedData.includes(record.id)}
                    onChange={() => handleSelectRecord(record.id)}
                  />
                </Td>
                <Td>{record.data_type}</Td>
                <Td>{record.data_key}</Td>
                <Td>{record.data_value || '-'}</Td>
                <Td>{record.description || '-'}</Td>
                <ActionCell>
                  <ActionButton onClick={() => openModal(record)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton danger onClick={() => handleDelete(record.id)}>
                    <FaTrash />
                  </ActionButton>
                </ActionCell>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </MasterDataContainer>

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
              <ModalTitle>{editingData ? 'Edit Master Data' : 'Add Master Data'}</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label required>Data Type</Label>
                  <Input
                    type="text"
                    name="dataType"
                    value={formData.dataType}
                    onChange={handleInputChange}
                    placeholder="e.g. Email, Configuration, Settings"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label required>Data Key</Label>
                  <Input
                    type="text"
                    name="dataKey"
                    value={formData.dataKey}
                    onChange={handleInputChange}
                    placeholder="e.g. admin_email, student_prefix"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Data Value</Label>
                  <TextArea
                    name="dataValue"
                    value={formData.dataValue}
                    onChange={handleInputChange}
                    placeholder="Enter data value..."
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

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit">
                    {editingData ? 'Update' : 'Submit'}
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

export default MasterData; 