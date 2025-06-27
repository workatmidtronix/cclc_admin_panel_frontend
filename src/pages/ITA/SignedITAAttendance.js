import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaList, FaFile, FaEnvelope, FaTimes, FaCalendarAlt, FaUpload } from 'react-icons/fa';
import { signedItaAttendanceApi } from '../../utils/itaApi';

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
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

const RedIndicator = styled.span`
  color: #e74c3c;
  font-weight: bold;
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
  
  &::placeholder {
    color: #adb5bd;
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

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const DateInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DateInput = styled.input`
  padding: 12px 15px;
  padding-right: 40px;
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
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const CalendarIcon = styled.div`
  position: absolute;
  right: 12px;
  color: #6c757d;
  pointer-events: none;
`;

const FileUploadContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const FileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileUploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  font-size: 0.9rem;
  width: 100%;
  justify-content: flex-start;
  
  &:hover {
    background: #f8f9fa;
    border-color: rgb(51, 66, 147);;
  }
`;

const UploadIcon = styled.div`
  color: #007bff;
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

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 'rgb(51, 66, 147);' : '#6c757d'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    opacity: 0.9;
  }
`;

const SearchSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #c0392b;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 200px;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
  }
`;

const ITAContainer = styled.div`
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

const CheckboxInput = styled.input`
  transform: scale(1.2);
`;

const DocumentLink = styled.a`
  color: rgb(51, 66, 147);;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const StudentInfo = styled.div`
  color: black;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 0.95rem;
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

const SendMailButton = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    opacity: 0.9;
  }
`;

const SignedITAAttendance = () => {
  const [signedAttendance, setSignedAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    ita_master_id: '',
    student_id: '',
    instructor_id: '',
    session_date: '',
    start_time: '',
    end_time: '',
    hours_completed: '',
    student_signature: '',
    instructor_signature: '',
    notes: ''
  });

  useEffect(() => {
    // fetchSignedAttendance();
  }, []);

  const fetchSignedAttendance = async () => {
    setLoading(true);
    const res = await signedItaAttendanceApi.getAll();
    setSignedAttendance(res.data || []);
    setLoading(false);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({
      ita_master_id: '',
      student_id: '',
      instructor_id: '',
      session_date: '',
      start_time: '',
      end_time: '',
      hours_completed: '',
      student_signature: '',
      instructor_signature: '',
      notes: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signedItaAttendanceApi.create(formData);
    closeModal();
    // fetchSignedAttendance();
  };

  const handleReset = () => {
    setFormData({
      ita_master_id: '',
      student_id: '',
      instructor_id: '',
      session_date: '',
      start_time: '',
      end_time: '',
      hours_completed: '',
      student_signature: '',
      instructor_signature: '',
      notes: ''
    });
  };

  const handleSendMail = (entryId) => {
    console.log('Sending mail for entry:', entryId);
  };

  return (
    <Container>
      <Header>
        <Title>Signed ITA Attendance</Title>
        <ActionButtons>
          <IconButton>
            <FaSearch />
          </IconButton>
          <AddButton onClick={openModal}>
            <FaPlus />
          </AddButton>
          <IconButton>
            <FaList />
          </IconButton>
        </ActionButtons>
      </Header>

      <ControlsSection>
        <ActionButton primary>Generate All</ActionButton>
        <ActionButton>Complete All</ActionButton>
      </ControlsSection>

      <SearchSection>
        <SearchButton>Search</SearchButton>
        <SearchInput
          placeholder="Search students..."
        />
      </SearchSection>

      <ITAContainer>
        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: '50px' }}></Th>
              <Th>Student</Th>
              <Th>Session Date</Th>
              <Th>Hours Completed</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {signedAttendance.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <CheckboxInput type="checkbox" />
                </Td>
                <Td>{item.student_first_name} {item.student_last_name}</Td>
                <Td>{item.session_date}</Td>
                <Td>{item.hours_completed}</Td>
                <Td>{item.status}</Td>
                <Td>
                  <SendMailButton onClick={() => handleSendMail(item.id)}>
                    <FaEnvelope />
                    Send Mail
                  </SendMailButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </ITAContainer>

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>ITA Attendance</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label required>Student ID</Label>
                  <Input
                    type="number"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label required>ITA Master ID</Label>
                  <Input
                    type="number"
                    name="ita_master_id"
                    value={formData.ita_master_id}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Instructor ID</Label>
                  <Input
                    type="number"
                    name="instructor_id"
                    value={formData.instructor_id}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label required>Session Date</Label>
                  <DateInputContainer>
                    <DateInput
                      type="date"
                      name="session_date"
                      value={formData.session_date}
                      onChange={handleInputChange}
                      required
                    />
                    <CalendarIcon>
                      <FaCalendarAlt />
                    </CalendarIcon>
                  </DateInputContainer>
                </FormGroup>

                <FormGroup>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Hours Completed</Label>
                  <Input
                    type="number"
                    step="0.01"
                    name="hours_completed"
                    value={formData.hours_completed}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Student Signature</Label>
                  <FileUploadContainer>
                    <FileInput
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'student_signature')}
                    />
                    <FileUploadButton type="button">
                      <UploadIcon>
                        <FaUpload />
                      </UploadIcon>
                      {formData.student_signature ? formData.student_signature.name : 'Select File'}
                    </FileUploadButton>
                  </FileUploadContainer>
                </FormGroup>

                <FormGroup>
                  <Label>Instructor Signature</Label>
                  <FileUploadContainer>
                    <FileInput
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'instructor_signature')}
                    />
                    <FileUploadButton type="button">
                      <UploadIcon>
                        <FaUpload />
                      </UploadIcon>
                      {formData.instructor_signature ? formData.instructor_signature.name : 'Select File'}
                    </FileUploadButton>
                  </FileUploadContainer>
                </FormGroup>

                <FormGroup>
                  <Label>Notes</Label>
                  <Input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit">
                    Submit
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

export default SignedITAAttendance; 