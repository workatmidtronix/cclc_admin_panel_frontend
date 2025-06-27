import React, { useState } from 'react';
import styled from 'styled-components';
import { FaChevronDown, FaChevronRight, FaSearch, FaPlus, FaTimes, FaEllipsisV } from 'react-icons/fa';
import { useMasterData } from '../../hooks/useMasterData';
import { CourseSelect, SessionSelect } from '../../components/MasterDataSelect';

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
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
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #e9ecef;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    background: #f8f9fa;
  }
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
  
  &:first-child {
    width: 40px;
  }
`;

const Tbody = styled.tbody``;

const CourseRow = styled.tr`
  background: #fafafa;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  
  &:hover {
    background: #f0f0f0;
  }
`;

const StudentRow = styled.tr`
  border-bottom: 1px solid #e9ecef;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const Td = styled.td`
  padding: 12px 20px;
  color: #2c3e50;
  font-size: 0.9rem;
  
  &:first-child {
    width: 40px;
  }
`;

const CourseName = styled.div`
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StudentName = styled.div`
  color: rgb(51, 66, 147);
  font-weight: 500;
  padding-left: 30px;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${props => props.status === 'Active' ? `
    background: #d4edda;
    color: #155724;
  ` : `
    background: #f8d7da;
    color: #721c24;
  `}
`;

const ExpandIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #666;
  transition: transform 0.2s ease;
  
  ${props => props.expanded && `
    transform: rotate(90deg);
  `}
`;

const Pagination = styled.div`
  padding: 20px;
  border-top: 1px solid #e9ecef;
  color: #666;
  font-size: 0.9rem;
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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
  margin-left: auto;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
  }
`;

const DateInput = styled.input`
  width: 100%;
  padding: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: rgb(22, 36, 114);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
  }
`;

const ModalFooter = styled.div`
  padding: 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: rgb(26, 42, 131);
  }
`;

const ResetButton = styled.button`
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #e9ecef;
  }
`;

const PreviousCourse = () => {
  const { courses, sessions } = useMasterData();
  const [expandedCourses, setExpandedCourses] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    movedDate: '',
    session: '',
    course: '',
    studentCourseStatus: '',
    notes: ''
  });

  // Sample data based on the image
  const courseData = [
    {
      id: 'certified-medical-assistant',
      name: 'Certified Medical Assistant',
      students: [
        { name: 'Tiara Burris', movedDate: '02/02/25', status: 'Not Active', notes: '' },
        { name: 'Aja Williams', movedDate: '02/02/25', status: 'Not Active', notes: '' },
        { name: 'Jasmine Bradshaw', movedDate: '06/28/24', status: 'Not Active', notes: '' },
        { name: 'Kennedy Robinson', movedDate: '02/02/25', status: 'Not Active', notes: '' }
      ]
    },
    {
      id: 'ekg',
      name: 'EKG',
      students: [
        { name: 'Alana Brewer', movedDate: '07/19/24', status: 'Not Active', notes: '' }
      ]
    },
    {
      id: 'ekg-mon-wed',
      name: 'EKG ► Mon/Wed EKG Mr. Richard Shaw 12/16/2023 @ Evergreen',
      students: [
        { name: 'Kadie Coffey', movedDate: '06/11/24', status: 'Active', notes: '' },
        { name: 'Diamond Chaney', movedDate: '06/11/24', status: 'Active', notes: '' },
        { name: 'Aleecia Sampson', movedDate: '06/11/24', status: 'Active', notes: '' },
        { name: 'Tanyah Reeves', movedDate: '06/12/24', status: 'Active', notes: '' },
        { name: 'Jamise Carr', movedDate: '06/24/24', status: 'Active', notes: '' },
        { name: 'Brianna Murdock', movedDate: '06/11/24', status: 'Active', notes: '' },
        { name: 'Bianca Jordan', movedDate: '06/17/24', status: 'Active', notes: '' },
        { name: 'Shaneka Boykin', movedDate: '06/11/24', status: 'Active', notes: '' },
        { name: 'Brittany Pendleton', movedDate: '06/17/24', status: 'Active', notes: '' },
        { name: 'Dionna Redmond', movedDate: '06/19/24', status: 'Active', notes: '' },
        { name: 'Chelsea Robertson', movedDate: '06/19/24', status: 'Active', notes: '' },
        { name: 'Justice Johnson', movedDate: '06/19/24', status: 'Active', notes: '' },
        { name: 'Ariana Smith', movedDate: '06/19/24', status: 'Active', notes: '' },
        { name: 'Andrea Brown', movedDate: '06/19/24', status: 'Active', notes: '' },
        { name: 'Melany Arias', movedDate: '06/17/24', status: 'Active', notes: '' },
        { name: 'Daynyasha Perry', movedDate: '06/17/24', status: 'Active', notes: '' },
        { name: 'Vanessa Johnston', movedDate: '06/17/24', status: 'Active', notes: '' }
      ]
    },
    {
      id: 'patient-care-technician',
      name: 'Patient Care Technician w/ Computer Fundamentals',
      students: [
        { name: 'Rebecca Villegas', movedDate: '02/12/25', status: 'Not Active', notes: '' },
        { name: 'Jaeriph Alford', movedDate: '10/07/24', status: 'Active', notes: '' },
        { name: 'Aida Rocha', movedDate: '10/07/24', status: 'Active', notes: '' },
        { name: 'Shanette Moore', movedDate: '10/07/24', status: 'Active', notes: '' },
        { name: 'Kristina Payne', movedDate: '10/07/24', status: 'Active', notes: '' },
        { name: 'Radhiya Hubbard', movedDate: '10/07/24', status: 'Active', notes: '' },
        { name: 'Lameshia Bishop', movedDate: '10/07/24', status: 'Active', notes: '' },
        { name: 'Arial Fleming', movedDate: '10/07/24', status: 'Active', notes: '' },
        { name: 'Jalaya Taylor', movedDate: '07/24/24', status: 'Active', notes: '' },
        { name: 'Devan Thurman', movedDate: '10/07/24', status: 'Active', notes: '' },
        { name: 'Semia Stevens', movedDate: '07/24/24', status: 'Active', notes: '' }
      ]
    }
  ];

  const toggleCourseExpansion = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const getTotalStudents = () => {
    return courseData.reduce((total, course) => total + course.students.length, 0);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setFormData({
      student: '',
      movedDate: '',
      session: '',
      course: '',
      studentCourseStatus: '',
      notes: ''
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form submitted:', formData);
    handleModalClose();
  };

  const handleReset = () => {
    setFormData({
      student: '',
      movedDate: '',
      session: '',
      course: '',
      studentCourseStatus: '',
      notes: ''
    });
  };

  return (
    <Container>
      <Header>
        <Title>Previous Course</Title>
      </Header>

      <TableContainer>
        <TableHeader>
          <HeaderLeft>
            {/* Empty left section for alignment */}
          </HeaderLeft>
          <HeaderActions>
            <ActionButton>
              <FaSearch />
            </ActionButton>
            <ActionButton onClick={() => setShowModal(true)}>
              <FaPlus />
            </ActionButton>
            
            <ActionButton>
              <FaEllipsisV />
            </ActionButton>
          </HeaderActions>
        </TableHeader>

        <Table>
          <Thead>
            <tr>
              <Th></Th>
              <Th>Student</Th>
              <Th>Moved Date</Th>
              <Th>Student Course Status</Th>
              <Th>Notes</Th>
            </tr>
          </Thead>
          <Tbody>
            {courseData.map(course => (
              <React.Fragment key={course.id}>
                <CourseRow onClick={() => toggleCourseExpansion(course.id)}>
                  <Td>
                    <ExpandIcon expanded={expandedCourses[course.id]}>
                      <FaChevronRight />
                    </ExpandIcon>
                  </Td>
                  <Td colSpan="4">
                    <CourseName>
                      {course.name}
                    </CourseName>
                  </Td>
                </CourseRow>
                {expandedCourses[course.id] && course.students.map((student, index) => (
                  <StudentRow key={`${course.id}-${index}`}>
                    <Td></Td>
                    <Td>
                      <StudentName>{student.name}</StudentName>
                    </Td>
                    <Td>{student.movedDate}</Td>
                    <Td>
                      <StatusBadge status={student.status}>
                        {student.status}
                      </StatusBadge>
                    </Td>
                    <Td>{student.notes}</Td>
                  </StudentRow>
                ))}
              </React.Fragment>
            ))}
          </Tbody>
        </Table>

        <Pagination>
          Showing {getTotalStudents()} of {getTotalStudents()}
        </Pagination>
      </TableContainer>

      {/* Modal */}
      {showModal && (
        <ModalOverlay onClick={(e) => e.target === e.currentTarget && handleModalClose()}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>All Course Details</ModalTitle>
              <CloseButton onClick={handleModalClose}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <FormGroup>
                  <Label>Student</Label>
                  <Select
                    value={formData.student}
                    onChange={(e) => handleInputChange('student', e.target.value)}
                  >
                    <option value="">-Select-</option>
                    <option value="student1">Student 1</option>
                    <option value="student2">Student 2</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Moved Date</Label>
                  <DateInput
                    type="date"
                    value={formData.movedDate}
                    onChange={(e) => handleInputChange('movedDate', e.target.value)}
                    placeholder="MM/dd/yy"
                    style={{ padding: '15px -1px 15px 15px' }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Session</Label>
                  <SessionSelect
                    value={formData.session}
                    onChange={(value) => handleInputChange('session', value)}
                    placeholder="Select session"
                    isClearable={true}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Course</Label>
                  <CourseSelect
                    value={formData.course}
                    onChange={(value) => handleInputChange('course', value)}
                    placeholder="Select course"
                    isClearable={true}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Student Course Status</Label>
                  <Select
                    value={formData.studentCourseStatus}
                    onChange={(e) => handleInputChange('studentCourseStatus', e.target.value)}
                  >
                    <option value="">-Select-</option>
                    <option value="Active">Active</option>
                    <option value="Not Active">Not Active</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Notes</Label>
                  <TextArea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Enter notes..."
                  />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <ResetButton type="button" onClick={handleReset}>
                  Reset
                </ResetButton>
                <SubmitButton type="submit">
                  Submit
                </SubmitButton>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default PreviousCourse; 