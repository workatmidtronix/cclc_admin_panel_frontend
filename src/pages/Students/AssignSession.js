import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaTimes, FaFilter, FaUserPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { fetchStudents } from '../../store/slices/studentsSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdRefresh } from "react-icons/md";
import { CourseSelect, SessionSelect } from '../../components/MasterDataSelect';

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
  font-size: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const SearchButton = styled.button`
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: transform 0.2s ease;
  background: transparent;
  border: 1px solid #e9ecef;
  color: #2f2e2e;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AddButton = styled.button`
  color: rgb(51, 66, 147);
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: transform 0.2s ease;
border: none;
  &:hover {
    transform: translateY(-2px);
  }
`;

const TableContainer = styled.div`
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

const StudentName = styled.div`
  font-weight: 500;
  color: #2c3e50;
`;

const StudentEmail = styled.div`
  color: rgb(51, 66, 147);;
  font-size: 0.9rem;
  margin-top: 2px;
`;

const AssignButton = styled.button`
   border: 1px solid rgb(52 152 219);
  color: rgb(52 152 219);
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const SSNDisplay = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: 500;
`;

const GenderBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.gender === 'Female' ? '#ffe6f2' : '#e6f3ff'};
  color: ${props => props.gender === 'Female' ? '#d63384' : '#0066cc'};
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
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 1150px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #f8f9fa;
    color: #2c3e50;
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.95rem;
  
  &.required::after {
    content: ' *';
    color: #e74c3c;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #495057;
  background: white;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const StudentTag = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #495057;
`;

const RemoveStudentButton = styled.button`
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    color: #e74c3c;
  }
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin: 30px 0 20px 0;
  font-size: 1.2rem;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
`;

const ModalFooter = styled.div`
  padding: 20px 30px;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const AssignSession = () => {
  const dispatch = useDispatch();
  const { students, isLoading } = useSelector(state => state.students);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    course: '',
    session: '',
    firstChoice: {
      courseInterestedIn: '',
      locationPreference: '',
      daysPreferred: ''
    },
    secondChoice: {
      courseInterestedIn: '',
      locationPreference: '',
      daysPreferred: ''
    }
  });
  const [apiMessage, setApiMessage] = useState(null);
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();


  // Sample dropdown data
  const courses = [
    'CNA (Certified Nursing Assistant)',
    'PCT (Patient Care Technician)',
    'Medical Assistant',
    'Pharmacy Technician',
    'Medical Billing & Coding',
    'EKG Technician',
    'Phlebotomy Technician'
  ];

  const sessions = [
    'Morning Session (8:00 AM - 12:00 PM)',
    'Afternoon Session (1:00 PM - 5:00 PM)',
    'Evening Session (6:00 PM - 10:00 PM)',
    'Weekend Session (Saturday & Sunday)'
  ];

  const locations = [
    'Main Campus @ Thorek Memorial Hospital',
    'Evergreen Park Campus'
  ];

  const daysOptions = [
    'Weekdays @ Main Campus - Thorek',
    'Weekends @ Main Campus - Thorek',
    'Evenings @ Main Campus - Thorek',
    'Weekdays @ Evergreen Park Campus',
    'Weekends @ Evergreen Park Campus',
    'Evenings @ Evergreen Park Campus'
  ];

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedStudents(students.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleAssign = (studentId) => {
    const student = students.find(s => s.id === studentId);
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setFormData({
      course: '',
      session: '',
      firstChoice: {
        courseInterestedIn: '',
        locationPreference: '',
        daysPreferred: ''
      },
      secondChoice: {
        courseInterestedIn: '',
        locationPreference: '',
        daysPreferred: ''
      }
    });
  };

  const handleFormChange = (field, value, choice = null) => {
    if (choice) {
      setFormData(prev => ({
        ...prev,
        [choice]: {
          ...prev[choice],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    setApiMessage(null);
    setApiError(null);
    if (!selectedStudent) {
      setApiError('Please select a student.');
      return;
    } else if (!formData.course) {
      setApiError('Please select a course.');
    } else if (!formData.session) {
      setApiError('Please select a session.');
    }
    try {
      const response = await axios.post('http://localhost:5000/api/students/assign-course', {
        studentId: selectedStudent.id,
        course: formData.course,
        session: formData.session,
        firstChoice: formData.firstChoice,
        secondChoice: formData.secondChoice
      });
      if (response.data.success) {
        setApiMessage(response.data.message || 'Course assigned successfully.');
        setTimeout(() => {
          closeModal();
          setApiMessage(null);
        }, 1500);
      } else {
        setApiError(response.data.message || 'Failed to assign course.');
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message || 'Server error while assigning course.'
      );
    }
  };

  return (
    <Container>
      <Header>
        <Title>Assign Session & Course</Title>
        <ActionButtons>
          <SearchButton>
            <FaSearch />
            Search
          </SearchButton>
          <AddButton onClick={() => navigate('/students/add')}>
            <FaPlus />
          </AddButton>
          <AddButton onClick={() => dispatch(fetchStudents())}>
            <MdRefresh size={18} />
          </AddButton>
        </ActionButtons>
      </Header>

      <TableContainer>
        <TableHeader>
          <CheckboxInput
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <HeaderText>Student Details</HeaderText>
        </TableHeader>

        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: '50px' }}></Th>

              <Th>ID</Th>
              <Th>Last Name</Th>
              <Th>First Name</Th>
              <Th>Email Address</Th>
              <Th>Gender</Th>
              <Th>Phone Number</Th>
              <Th>Enrollment Date</Th>
              <Th style={{ width: '120px' }}>Assign</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map((student) => (
              <Tr key={student.id}>
                <Td>
                  <CheckboxInput
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                  />
                </Td>
                <Td style={{ fontWeight: '500' }}>{student.id}</Td>
                <Td>
                  <StudentName>{student.lastName}</StudentName>
                </Td>
                <Td>
                  <StudentName>{student.firstName}</StudentName>
                </Td>
                <Td>
                  {student.email ? (
                    <StudentEmail>{student.email}</StudentEmail>
                  ) : (
                    <StudentEmail>N/A</StudentEmail>
                  )}
                </Td>
                <Td>
                  {student.gender ? (
                    <GenderBadge gender={student.gender}>
                      {student.gender}
                    </GenderBadge>
                  ) : (
                    <GenderBadge gender="N/A">N/A</GenderBadge>
                  )}
                </Td>
                <Td>
                  {student.phone && (
                    <SSNDisplay>{student.phone}</SSNDisplay>
                  )}
                </Td>
                <Td>
                  {student.enrollmentDate ? (
                    <SSNDisplay gender={student.enrollmentDate}>
                      {student.enrollmentDate}
                    </SSNDisplay>
                  ) : (
                    <SSNDisplay gender="N/A">N/A</SSNDisplay>
                  )}
                </Td>

                <Td>
                  <AssignButton onClick={() => handleAssign(student.id)}>
                    Assign
                  </AssignButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal */}
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Assign Course & Session</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              {apiError && <div style={{ color: 'red', marginBottom: 10 }}>{apiError}</div>}
              {apiMessage && <div style={{ color: 'green', marginBottom: 10 }}>{apiMessage}</div>}
              <FormRow>
                <FormGroup>
                  <Label className="required">Student</Label>
                  {selectedStudent && (
                    <StudentTag>
                      <span>{selectedStudent.firstName} {selectedStudent.lastName}</span>
                      <RemoveStudentButton onClick={closeModal}>
                        <FaTimes />
                      </RemoveStudentButton>
                    </StudentTag>
                  )}
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label className="required">Course</Label>
                  <CourseSelect
                    value={formData.course}
                    onChange={(value) => handleFormChange('course', value)}
                    placeholder="Select course"
                    isClearable={false}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="required">Session</Label>
                  <SessionSelect
                    value={formData.session}
                    onChange={(value) => handleFormChange('session', value)}
                    placeholder="Select session"
                    isClearable={false}
                  />
                </FormGroup>
              </FormRow>

              <SectionTitle>Course Preference - 1st Choice</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Course Interested In</Label>
                  <CourseSelect
                    value={formData.firstChoice.courseInterestedIn}
                    onChange={(value) => handleFormChange('courseInterestedIn', value, 'firstChoice')}
                    placeholder="Select course"
                    isClearable={true}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Location Preference</Label>
                  <Select
                    value={formData.firstChoice.locationPreference}
                    onChange={(e) => handleFormChange('locationPreference', e.target.value, 'firstChoice')}
                  >
                    <option value="">-Select-</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Days Preferred</Label>
                  <Select
                    value={formData.firstChoice.daysPreferred}
                    onChange={(e) => handleFormChange('daysPreferred', e.target.value, 'firstChoice')}
                  >
                    <option value="">-Select-</option>
                    {daysOptions.map((day, index) => (
                      <option key={index} value={day}>{day}</option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>

              <SectionTitle>Course Preference - 2nd Choice</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label>Course Interested In</Label>
                  <CourseSelect
                    value={formData.secondChoice.courseInterestedIn}
                    onChange={(value) => handleFormChange('courseInterestedIn', value, 'secondChoice')}
                    placeholder="Select course"
                    isClearable={true}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Location Preference</Label>
                  <Select
                    value={formData.secondChoice.locationPreference}
                    onChange={(e) => handleFormChange('locationPreference', e.target.value, 'secondChoice')}
                  >
                    <option value="">-Select-</option>
                    {locations.map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Days Preferred</Label>
                  <Select
                    value={formData.secondChoice.daysPreferred}
                    onChange={(e) => handleFormChange('daysPreferred', e.target.value, 'secondChoice')}
                  >
                    <option value="">-Select-</option>
                    {daysOptions.map((day, index) => (
                      <option key={index} value={day}>{day}</option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>
            </ModalBody>

            <ModalFooter>
              <SubmitButton onClick={handleSubmit}>
                Assign
              </SubmitButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AssignSession; 