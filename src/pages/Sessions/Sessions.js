import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaList, FaTimes, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
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
  
  &::placeholder {
    color: #adb5bd;
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

const DateInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DateInput = styled(Input)`
  padding-right: 45px;
`;

const CalendarIcon = styled.div`
  position: absolute;
  right: 15px;
  color: #6c757d;
  pointer-events: none;
`;

const StatusSelectWrapper = styled.div`
  position: relative;
`;

const StatusSelect = styled(Select)`
  padding-right: 45px;
`;

const ClearStatusButton = styled.button`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 2px;
  
  &:hover {
    color: #2c3e50;
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

const SessionsContainer = styled.div`
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
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

const StatusText = styled.span`
  background: ${props => props.active ? '#28a745' : '#6c757d'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
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

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 1.1rem;
`;

const ExampleText = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 4px;
  display: block;
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Sessions = () => {
  const [sessionsData, setSessionsData] = useState([]);
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    sessionName: '',
    sessionDate: '',
    startTime: '',
    endTime: '',
    room: '',
    notes: '',
    status: 'Scheduled'
  });

  const { user } = useSelector(state => state.auth);
  const { confirmState, showDeleteConfirm } = useConfirm();

  // Fetch sessions from API
  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sessions');
      const data = await response.json();
      if (data.success) {
        setSessionsData(data.sessions);
      } else {
        showError(data.message || 'Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      showError('Error fetching sessions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses for dropdown
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sessions/courses/list');
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchCourses();
  }, []);

  const openModal = (session = null) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        courseId: session.course_id || '',
        sessionName: session.session_name || '',
        sessionDate: session.session_date || '',
        startTime: session.start_time || '',
        endTime: session.end_time || '',
        room: session.room || '',
        notes: session.notes || '',
        status: session.status || 'Scheduled'
      });
    } else {
      setEditingSession(null);
      setFormData({
        courseId: '',
        sessionName: '',
        sessionDate: '',
        startTime: '',
        endTime: '',
        room: '',
        notes: '',
        status: 'Scheduled'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSession(null);
    setFormData({
      courseId: '',
      sessionName: '',
      sessionDate: '',
      startTime: '',
      endTime: '',
      room: '',
      notes: '',
      status: 'Scheduled'
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
    if (!formData.courseId) {
      showError('Please select a course');
      return;
    }
    if (!formData.sessionDate) {
      showError('Please select a session date');
      return;
    }

    setLoading(true);
    try {
      const url = editingSession 
        ? `http://localhost:5000/api/sessions/${editingSession.id}`
        : 'http://localhost:5000/api/sessions';
      
      const method = editingSession ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || (editingSession ? 'Session updated successfully' : 'Session created successfully'));
        fetchSessions();
        closeModal();
      } else {
        showError(result.message || 'Failed to save session');
      }
    } catch (error) {
      console.error('Error saving session:', error);
      showError('Error saving session');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirm(
      sessionsData.find(session => session.id === id)?.session_name || 'Session',
      'session'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/sessions/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Session deleted successfully');
        fetchSessions();
      } else {
        showError(result.message || 'Failed to delete session');
      }
    } catch (error) {
      showError('Error deleting session');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      courseId: '',
      sessionName: '',
      sessionDate: '',
      startTime: '',
      endTime: '',
      room: '',
      notes: '',
      status: 'Scheduled'
    });
  };

  const clearStatus = () => {
    setFormData(prev => ({
      ...prev,
      status: ''
    }));
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedSessions(sessionsData.map(session => session.id));
    } else {
      setSelectedSessions([]);
    }
  };

  const handleSelectSession = (sessionId) => {
    setSelectedSessions(prev => {
      if (prev.includes(sessionId)) {
        return prev.filter(id => id !== sessionId);
      } else {
        return [...prev, sessionId];
      }
    });
  };

  if (loading && sessionsData.length === 0) {
    return (
      <Container>
        <LoadingText>Loading sessions...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Sessions</Title>
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

      <SessionsContainer>
        <TableHeader>
          <TableCheckbox
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <HeaderText>Sessions List</HeaderText>
        </TableHeader>

        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: '50px' }}></Th>
              <Th>Session Name</Th>
              <Th>Course</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Room</Th>
              <Th>Status</Th>
              <Th style={{ width: '120px' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sessionsData.map((session) => (
              <Tr key={session.id}>
                <Td>
                  <TableCheckbox
                    type="checkbox"
                    checked={selectedSessions.includes(session.id)}
                    onChange={() => handleSelectSession(session.id)}
                  />
                </Td>
                <Td>{session.session_name || '-'}</Td>
                <Td>{session.course_name}</Td>
                <Td>{session.session_date ? new Date(session.session_date).toLocaleDateString() : '-'}</Td>
                <Td>
                  {session.start_time && session.end_time 
                    ? `${session.start_time} - ${session.end_time}`
                    : session.start_time || '-'
                  }
                </Td>
                <Td>{session.room || '-'}</Td>
                <Td>
                  <StatusText active={session.status === 'completed' || session.status === 'Completed'}>
                    {session.status}
                  </StatusText>
                </Td>
                <ActionCell>
                  <ActionButton onClick={() => openModal(session)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton danger onClick={() => handleDelete(session.id)}>
                    <FaTrash />
                  </ActionButton>
                </ActionCell>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </SessionsContainer>

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
              <ModalTitle>{editingSession ? 'Edit Session' : 'Add Session'}</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label required>Course</Label>
                  <Select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.course_name} ({course.course_code})
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Session Name</Label>
                  <Input
                    type="text"
                    name="sessionName"
                    value={formData.sessionName}
                    onChange={handleInputChange}
                    placeholder="e.g., Introduction to Patient Care"
                  />
                  <ExampleText>Example: Introduction to Patient Care, Lab Session 1</ExampleText>
                </FormGroup>

                <FormGroup>
                  <Label required>Session Date</Label>
                  <DateInputWrapper>
                    <DateInput
                      type="date"
                      name="sessionDate"
                      value={formData.sessionDate}
                      onChange={handleInputChange}
                      required
                    />
                   
                  </DateInputWrapper>
                </FormGroup>

                <FormGroup>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Room</Label>
                  <Input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    placeholder="e.g., Room 101"
                  />
                  <ExampleText>Example: Room 101, Lab A, Conference Room</ExampleText>
                </FormGroup>

                <FormGroup>
                  <Label>Notes</Label>
                  <TextArea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Enter session notes..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Status</Label>
                  <StatusSelectWrapper>
                    <StatusSelect
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </StatusSelect>
                    {formData.status && (
                      <ClearStatusButton onClick={clearStatus}>
                        <FaTimes />
                      </ClearStatusButton>
                    )}
                  </StatusSelectWrapper>
                </FormGroup>

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (editingSession ? 'Update' : 'Add')}
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

export default Sessions; 