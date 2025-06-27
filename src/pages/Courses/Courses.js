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
    border: 1px solid rgb(51, 66, 147);
  color: rgb(51, 66, 147);
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
  border: 1px solid rgb(51, 66, 147);;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
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
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
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

const CoursesContainer = styled.div`
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

const CourseName = styled.div`
  font-weight: 500;
  color: #2c3e50;
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

const TableCheckbox = styled.input`
  margin-right: 10px;
  transform: scale(1.2);
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

const Courses = () => {
  const [coursesData, setCoursesData] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [instructors, setInstructors] = useState([]);
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    description: '',
    durationWeeks: '',
    instructorId: '',
    maxStudents: 25,
    status: 'Active',
    startDate: '',
    endDate: ''
  });

  const { confirmState, showDeleteConfirm } = useConfirm();

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      if (data.success) {
        setCoursesData(data.courses);
      } else {
        showError(data.message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      showError('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch instructors for dropdown
  const fetchInstructors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses/instructors/list');
      const data = await response.json();
      if (data.success) {
        setInstructors(data.instructors);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        courseName: course.course_name || '',
        courseCode: course.course_code || '',
        description: course.description || '',
        durationWeeks: course.duration_weeks || '',
        instructorId: course.instructor_id || '',
        maxStudents: course.max_students || 25,
        status: course.status || 'Active',
        startDate: course.start_date || '',
        endDate: course.end_date || ''
      });
    } else {
      setEditingCourse(null);
      setFormData({
        courseName: '',
        courseCode: '',
        description: '',
        durationWeeks: '',
        instructorId: '',
        maxStudents: 25,
        status: 'Active',
        startDate: '',
        endDate: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormData({
      courseName: '',
      courseCode: '',
      description: '',
      durationWeeks: '',
      instructorId: '',
      maxStudents: 25,
      status: 'Active',
      startDate: '',
      endDate: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || '' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.courseName.trim()) {
      showError('Please enter a course name');
      return;
    }

    setLoading(true);
    try {
      const url = editingCourse 
        ? `http://localhost:5000/api/courses/${editingCourse.id}`
        : 'http://localhost:5000/api/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || (editingCourse ? 'Course updated successfully' : 'Course created successfully'));
        fetchCourses();
        closeModal();
      } else {
        showError(result.message || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      showError('Error saving course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirm(
      coursesData.find(course => course.id === id)?.course_name || 'Course',
      'course'
    );

    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess(result.message || 'Course deleted successfully');
        fetchCourses();
      } else {
        showError(result.message || 'Failed to delete course');
      }
    } catch (error) {
      showError('Error deleting course');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      courseName: '',
      courseCode: '',
      description: '',
      durationWeeks: '',
      instructorId: '',
      maxStudents: 25,
      status: 'Active',
      startDate: '',
      endDate: ''
    });
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedCourses(coursesData.map(course => course.id));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourses(prev => {
      if (prev.includes(courseId)) {
        return prev.filter(id => id !== courseId);
      } else {
        return [...prev, courseId];
      }
    });
  };

  if (loading && coursesData.length === 0) {
    return (
      <Container>
        <LoadingText>Loading courses...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Courses</Title>
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

      <CoursesContainer>
        <TableHeader>
          <TableCheckbox 
            type="checkbox" 
            checked={selectAll}
            onChange={handleSelectAll}
          />
          <HeaderText>Courses List</HeaderText>
        </TableHeader>

        <Table>
          <Thead>
            <Tr>
              <Th style={{ width: '50px' }}></Th>
              <Th>Course Name</Th>
              <Th>Course Code</Th>
              <Th>Instructor</Th>
              <Th>Status</Th>
              <Th style={{ width: '120px' }}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {coursesData.map((course) => (
              <Tr key={course.id}>
                <Td>
                  <TableCheckbox 
                    type="checkbox"
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleSelectCourse(course.id)}
                  />
                </Td>
                <Td>
                  <CourseName>{course.course_name}</CourseName>
                </Td>
                <Td>{course.course_code || '-'}</Td>
                <Td>{course.instructor_name || '-'}</Td>
                <Td>
                  <StatusText active={course.status === 'Active' || course.status === 'active'}>
                    {course.status}
                  </StatusText>
                </Td>
                <ActionCell>
                  <ActionButton onClick={() => openModal(course)}>
                    <FaEdit />
                  </ActionButton>
                  <ActionButton danger onClick={() => handleDelete(course.id)}>
                    <FaTrash />
                  </ActionButton>
                </ActionCell>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </CoursesContainer>

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
              <ModalTitle>{editingCourse ? 'Edit Course' : 'Add Course'}</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label required>Course Name</Label>
                  <Input
                    type="text"
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    placeholder="e.g., Patient Care Technician"
                    required
                  />
                  <ExampleText>Example: Patient Care Technician, Medical Billing & Coding</ExampleText>
                </FormGroup>

                <FormGroup>
                  <Label>Course Code</Label>
                  <Input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleInputChange}
                    placeholder="e.g., PCT101"
                  />
                  <ExampleText>Example: PCT101, MBC201, EKG301</ExampleText>
                </FormGroup>

                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter course description..."
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Duration (Weeks)</Label>
                  <Input
                    type="number"
                    name="durationWeeks"
                    value={formData.durationWeeks}
                    onChange={handleInputChange}
                    placeholder="e.g., 12"
                    min="1"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Instructor</Label>
                  <Select
                    name="instructorId"
                    value={formData.instructorId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map(instructor => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name} - {instructor.specialization}
                      </option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Max Students</Label>
                  <Input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                    placeholder="e.g., 25"
                    min="1"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Completed">Completed</option>
                  </Select>
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

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (editingCourse ? 'Update' : 'Add')}
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

export default Courses; 