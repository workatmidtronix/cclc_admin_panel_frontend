import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaDownload, FaSearch } from 'react-icons/fa';
import { getAllVouchers, createVoucher, updateVoucher, deleteVoucher } from '../../utils/vouchersApi';
import { showSuccess, showError } from '../../components/CustomAlert';
import { useConfirm } from '../../components/useConfirm';
import CustomConfirm from '../../components/CustomConfirm';

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const BreadcrumbItem = styled.span`
  &:after {
    content: '>';
    margin-left: 8px;
  }
  
  &:last-child:after {
    content: '';
  }
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  padding: 10px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  width: 300px;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
  }
`;

const AddButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgb(41, 56, 137);
    transform: translateY(-2px);
  }
`;

const VouchersContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 0.9rem;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }
`;

const Td = styled.td`
  padding: 15px 20px;
  color: #495057;
  font-size: 0.95rem;
`;

const StudentInfo = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const StudentName = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const StudentDetails = styled.div`
  font-size: 0.9rem;
  color: #6c757d;
`;

const VoucherData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
`;

const VoucherField = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldLabel = styled.label`
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 2px;
  font-weight: 500;
`;

const FieldValue = styled.div`
  font-size: 0.9rem;
  color: #495057;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
  }
`;

const FileInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const EditButton = styled(Button)`
  background: #ffc107;
  color: #212529;
  
  &:hover {
    background: #e0a800;
  }
`;

const SaveButton = styled(Button)`
  background: #28a745;
  color: white;
  
  &:hover {
    background: #218838;
  }
`;

const CancelButton = styled(Button)`
  background: #6c757d;
  color: white;
  
  &:hover {
    background: #5a6268;
  }
`;

const DeleteButton = styled(Button)`
  background: #dc3545;
  color: white;
  
  &:hover {
    background: #c82333;
  }
`;

const DownloadButton = styled(Button)`
  background: #17a2b8;
  color: white;
  
  &:hover {
    background: #138496;
  }
`;

const NoData = styled.div`
  text-align: center;
  padding: 50px;
  color: #6c757d;
  font-size: 1.1rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 50px;
  color: #6c757d;
  font-size: 1.1rem;
`;

// Modal Styles
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    color: #dc3545;
  }
`;

const ModalForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
`;

const FormInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
  }
`;

const FormFileInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
`;

const ModalButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled(ModalButton)`
  background: rgb(51, 66, 147);
  color: white;
  
  &:hover {
    background: rgb(41, 56, 137);
  }
`;

const CancelModalButton = styled(ModalButton)`
  background: #6c757d;
  color: white;
  
  &:hover {
    background: #5a6268;
  }
`;

const AddVoucherButton = styled(Button)`
  background: rgb(51, 66, 147);
  color: white;
  
  &:hover {
    background: rgb(41, 56, 137);
  }
`;

const Vouchers = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newVoucherData, setNewVoucherData] = useState({});
    const { showConfirm } = useConfirm();
    useEffect(() => {
        fetchStudents();
    }, []);

    useEffect(() => {
    }, [editData]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await getAllVouchers();
            setStudents(response.data || []);
        } catch (error) {
            showError('Failed to fetch students');
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredStudents = students.filter(student => {
        const searchLower = searchTerm.toLowerCase();
        return (
            student.first_name?.toLowerCase().includes(searchLower) ||
            student.last_name?.toLowerCase().includes(searchLower) ||
            student.email?.toLowerCase().includes(searchLower) ||
            student.registration_number?.toLowerCase().includes(searchLower) ||
            student.program_name?.toLowerCase().includes(searchLower) ||
            student.instructor_name?.toLowerCase().includes(searchLower)
        );
    });

    const handleEdit = (student) => {
        
        // Format dates for HTML date inputs (YYYY-MM-DD)
        const formatDateForInput = (dateString) => {
            if (!dateString) return '';
            // If date is already in YYYY-MM-DD format, return as is
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                return dateString;
            }
            // If date is in a different format, convert to YYYY-MM-DD
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
        };
        const initialEditData = {
            studentId: student.student_id,
            referringWiaProvider: student.referring_wia_provider || '',
            caseManagerName: student.case_manager_name || '',
            caseManagerTelephone: student.case_manager_telephone || '',
            trainingProvider: student.training_provider || '',
            instructorName: student.instructor_name || '',
            programName: student.program_name || '',
            trainingPeriodStartDate: formatDateForInput(student.training_period_start_date),
            trainingPeriodEndDate: formatDateForInput(student.training_period_end_date),
            voucherFile: student.voucher_file_path || null
        };
        setEditingId(student.voucher_id);
        setEditData(initialEditData);
    };

    const handleSave = async (voucherId) => {
        try {
            // Ensure dates are in the correct format for the backend
            const dataToSend = {
                ...editData,
                trainingPeriodStartDate: editData.trainingPeriodStartDate || null,
                trainingPeriodEndDate: editData.trainingPeriodEndDate || null
            };
            
            await updateVoucher(voucherId, dataToSend);
            showSuccess('Voucher updated successfully');
            setEditingId(null);
            setEditData({});
            fetchStudents();
        } catch (error) {
            showError(error.message || 'Failed to save voucher');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleDelete = async (voucherId) => {
        const confirmed = await showConfirm('Are you sure you want to delete this voucher?');
        if (!confirmed) return;

        try {
            await deleteVoucher(voucherId);
            showSuccess('Voucher deleted successfully');
            fetchStudents();
        } catch (error) {
            showError(error.message || 'Failed to delete voucher');
        }
    };

    const handleDownload = (filePath) => {
        if (filePath) {
            const fullPath = `${process.env.REACT_APP_API_URL}/${filePath}`;
            window.open(fullPath, '_blank');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setEditData(prev => ({ ...prev, voucherFile: file }));
    };

      const handleInputChange = (field, value) => {
    setEditData(prev => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  };

    const handleAddVoucher = (student) => {
        setSelectedStudent(student);
        setNewVoucherData({
            studentId: student.student_id,
            referringWiaProvider: '',
            caseManagerName: '',
            caseManagerTelephone: '',
            trainingProvider: '',
            instructorName: '',
            programName: '',
            trainingPeriodStartDate: '',
            trainingPeriodEndDate: '',
            voucherFile: null
        });
        setShowModal(true);
    };
    const handleModalInputChange = (field, value) => {
        setNewVoucherData(prev => ({ ...prev, [field]: value }));
    };

    const handleModalFileChange = (e) => {
        const file = e.target.files[0];
        setNewVoucherData(prev => ({ ...prev, voucherFile: file }));
    };

    const handleSubmitVoucher = async (e) => {
        e.preventDefault();
        try {
            // Ensure dates are in the correct format for the backend
            const dataToSend = {
                ...newVoucherData,
                trainingPeriodStartDate: newVoucherData.trainingPeriodStartDate || null,
                trainingPeriodEndDate: newVoucherData.trainingPeriodEndDate || null
            };
            
            await createVoucher(dataToSend);
            showSuccess('Voucher created successfully');
            setShowModal(false);
            setSelectedStudent(null);
            setNewVoucherData({});
            fetchStudents();
        } catch (error) {
            showError(error.message || 'Failed to create voucher');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedStudent(null);
        setNewVoucherData({});
    };

    // Format date for display (MM/DD/YYYY)
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const renderStudentInfo = (student) => (
        <StudentInfo>
            <StudentName>{student.first_name} {student.last_name}</StudentName>
            <StudentDetails>
                Email: {student.email} | Registration ID: {student.registration_number}
            </StudentDetails>
        </StudentInfo>
    );

   

    const renderVoucherData = (student, isEditing = false) => {
        
        // If student has no voucher, show "No voucher" message
        if (!student.voucher_id) {
            return (
                <VoucherData>
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px 0', color: '#6c757d' }}>
                        No voucher found for this student
                    </div>
                </VoucherData>
            );
        }

        return (
            <VoucherData>
                <VoucherField>
                    <FieldLabel>Referring WIA Provider</FieldLabel>
                    {isEditing ? (
                        <Input
                            value={editData.referringWiaProvider || ''}
                            onChange={(e) => {
                                handleInputChange('referringWiaProvider', e.target.value);
                            }}
                        />
                    ) : (
                        <FieldValue>{student.referring_wia_provider || 'N/A'}</FieldValue>
                    )}
                </VoucherField>

                <VoucherField>
                    <FieldLabel>Case Manager Name</FieldLabel>
                    {isEditing ? (
                        <Input
                            value={editData.caseManagerName || ''}
                            onChange={(e) => handleInputChange('caseManagerName', e.target.value)}
                        />
                    ) : (
                        <FieldValue>{student.case_manager_name || 'N/A'}</FieldValue>
                    )}
                </VoucherField>

                <VoucherField>
                    <FieldLabel>Case Manager Telephone</FieldLabel>
                    {isEditing ? (
                        <Input
                            value={editData.caseManagerTelephone || ''}
                            onChange={(e) => handleInputChange('caseManagerTelephone', e.target.value)}
                            type='tel'
                            placeholder='1234567891'
                        />
                    ) : (
                        <FieldValue>{student.case_manager_telephone || 'N/A'}</FieldValue>
                    )}
                </VoucherField>

                <VoucherField>
                    <FieldLabel>Training Provider</FieldLabel>
                    {isEditing ? (
                        <Input
                            value={editData.trainingProvider || ''}
                            onChange={(e) => handleInputChange('trainingProvider', e.target.value)}
                        />
                    ) : (
                        <FieldValue>{student.training_provider || 'N/A'}</FieldValue>
                    )}
                </VoucherField>

                <VoucherField>
                    <FieldLabel>Instructor Name</FieldLabel>
                    {isEditing ? (
                        <Input
                            value={editData.instructorName || ''}
                            onChange={(e) => handleInputChange('instructorName', e.target.value)}
                        />
                    ) : (
                        <FieldValue>{student.instructor_name || 'N/A'}</FieldValue>
                    )}
                </VoucherField>

                <VoucherField>
                    <FieldLabel>Program Name</FieldLabel>
                    {isEditing ? (
                        <Input
                            value={editData.programName || ''}
                            onChange={(e) => handleInputChange('programName', e.target.value)}
                        />
                    ) : (
                        <FieldValue>{student.program_name || 'N/A'}</FieldValue>
                    )}
                </VoucherField>

                <VoucherField>
                    <FieldLabel>Training Period Start Date</FieldLabel>
                    {isEditing ? (
                        <Input
                            type="date"
                            value={editData.trainingPeriodStartDate || ''}
                            onChange={(e) => handleInputChange('trainingPeriodStartDate', e.target.value)}
                            required
                        />
                    ) : (
                        <FieldValue>{formatDateForDisplay(student.training_period_start_date)}</FieldValue>
                    )}
                </VoucherField>

                <VoucherField>
                    <FieldLabel>Training Period End Date</FieldLabel>
                    {isEditing ? (
                        <Input
                            type="date"
                            value={editData.trainingPeriodEndDate || ''}
                            onChange={(e) => handleInputChange('trainingPeriodEndDate', e.target.value)}
                            required
                        />
                    ) : (
                        <FieldValue>{formatDateForDisplay(student.training_period_end_date)}</FieldValue>
                    )}
                </VoucherField>
                <VoucherField>
                    <FieldLabel>Voucher File</FieldLabel>
                    {isEditing ? (
                        <FileInput
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                    ) : (
                        <FieldValue>
                            {student.voucher_file_path ? (
                                <DownloadButton onClick={() => handleDownload(student.voucher_file_path)}>
                                    <FaDownload /> Download
                                </DownloadButton>
                            ) : (
                                'No file uploaded'
                            )}
                        </FieldValue>
                    )}
                </VoucherField>
            </VoucherData>
        );
    };



    if (loading) {
        return (
            <Container>
                <Loading>Loading vouchers...</Loading>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <BreadcrumbNav>
                    <BreadcrumbItem>Students</BreadcrumbItem>
                    <BreadcrumbItem>Vouchers</BreadcrumbItem>
                </BreadcrumbNav>
                <Title>Student Vouchers</Title>

                <Controls>
                    <SearchBox>
                        <FaSearch />
                        <SearchInput
                            type="text"
                            placeholder="Search by name, email, registration ID, program, or instructor..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </SearchBox>
                </Controls>
            </Header>

            <VouchersContainer>
                <Table>
                    <Thead>
                        <tr>
                            <Th>Student Information</Th>
                            <Th>Voucher Data</Th>
                            <Th>Actions</Th>
                        </tr>
                    </Thead>
                    <Tbody>
                        {filteredStudents.length === 0 ? (
                            <tr>
                                <Td colSpan="3">
                                    <NoData>No students found</NoData>
                                </Td>
                            </tr>
                        ) : (
                            filteredStudents.map(student => (
                                <Tr key={student.student_id}>
                                    <Td>
                                        {renderStudentInfo(student)}
                                    </Td>
                                    <Td>
                                        {(() => {
                                            const isEditing = student.voucher_id !== null && editingId === student.voucher_id;
                                           
                                            return renderVoucherData(student, isEditing);
                                        })()}
                                    </Td>
                                    <Td>
                                        <ActionButtons>
                                            {student.voucher_id !== null && editingId === student.voucher_id ? (
                                                <>
                                                    <SaveButton onClick={() => handleSave(student.voucher_id)}>
                                                        <FaSave /> Save
                                                    </SaveButton>
                                                    <CancelButton onClick={handleCancel}>
                                                        <FaTimes /> Cancel
                                                    </CancelButton>
                                                </>
                                            ) : student.voucher_id ? (
                                                <>
                                                    <EditButton onClick={() => handleEdit(student)}>
                                                        <FaEdit /> Edit
                                                    </EditButton>
                                                    <DeleteButton onClick={() => handleDelete(student.voucher_id)}>
                                                        <FaTrash /> Delete
                                                    </DeleteButton>
                                                </>
                                            ) : (
                                                <AddVoucherButton onClick={() => handleAddVoucher(student)}>
                                                    <FaPlus /> Add Voucher
                                                </AddVoucherButton>
                                            )}
                                        </ActionButtons>
                                    </Td>
                                </Tr>
                            ))
                        )}
                    </Tbody>
                </Table>
            </VouchersContainer>

            <CustomConfirm />

            {/* Add Voucher Modal */}
            {showModal && (
                <Modal>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>
                                Add Voucher for {selectedStudent?.first_name} {selectedStudent?.last_name}
                            </ModalTitle>
                            <CloseButton onClick={handleCloseModal}>
                                <FaTimes />
                            </CloseButton>
                        </ModalHeader>

                        <ModalForm onSubmit={handleSubmitVoucher}>
                            <FormGroup>
                                <FormLabel>Referring WIA Provider</FormLabel>
                                <FormInput
                                    type="text"
                                    value={newVoucherData.referringWiaProvider || ''}
                                    onChange={(e) => handleModalInputChange('referringWiaProvider', e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>Case Manager Name</FormLabel>
                                <FormInput
                                    type="text"
                                    value={newVoucherData.caseManagerName || ''}
                                    onChange={(e) => handleModalInputChange('caseManagerName', e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>Case Manager Telephone</FormLabel>
                                <FormInput
                                    type="tel"
                                    value={newVoucherData.caseManagerTelephone || ''}
                                    onChange={(e) => handleModalInputChange('caseManagerTelephone', e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>Training Provider</FormLabel>
                                <FormInput
                                    type="text"
                                    value={newVoucherData.trainingProvider || ''}
                                    onChange={(e) => handleModalInputChange('trainingProvider', e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>Instructor Name</FormLabel>
                                <FormInput
                                    type="text"
                                    value={newVoucherData.instructorName || ''}
                                    onChange={(e) => handleModalInputChange('instructorName', e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>Program Name</FormLabel>
                                <FormInput
                                    type="text"
                                    value={newVoucherData.programName || ''}
                                    onChange={(e) => handleModalInputChange('programName', e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>Training Period Start Date</FormLabel>
                                <FormInput
                                    type="date"
                                    value={newVoucherData.trainingPeriodStartDate || ''}
                                    onChange={(e) => handleModalInputChange('trainingPeriodStartDate', e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>Training Period End Date</FormLabel>
                                <FormInput
                                    type="date"
                                    value={newVoucherData.trainingPeriodEndDate || ''}
                                    onChange={(e) => handleModalInputChange('trainingPeriodEndDate', e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup style={{ gridColumn: '1 / -1' }}>
                                <FormLabel>Voucher File</FormLabel>
                                <FormFileInput
                                    type="file"
                                    onChange={handleModalFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                            </FormGroup>

                            <ModalActions>
                                <CancelModalButton type="button" onClick={handleCloseModal}>
                                    Cancel
                                </CancelModalButton>
                                <SubmitButton type="submit">
                                    Add Voucher
                                </SubmitButton>
                            </ModalActions>
                        </ModalForm>
                    </ModalContent>
                </Modal>
            )}
        </Container>
    );
};

export default Vouchers;