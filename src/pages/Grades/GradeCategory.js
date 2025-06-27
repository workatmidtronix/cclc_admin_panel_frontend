import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { 
  fetchGradeCategories, 
  createGradeCategory, 
  updateGradeCategory, 
  deleteGradeCategory,
  fetchCourses,
  fetchInstructors
} from '../../utils/gradesApi';
import { useConfirm } from '../../components/useConfirm';
import CustomConfirm from '../../components/CustomConfirm';
import { showSuccess, showError } from '../../components/CustomAlert';

const Container = styled.div`
  padding: 20px;
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
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const AddButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #0e66a1;
    transform: translateY(-1px);
  }
`;

const FilterContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 80px 100px;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #333;
`;

const HeaderCell = styled.div`
  padding: 15px 12px;
  border-right: 1px solid #dee2e6;
  font-size: 14px;
  
  &:last-child {
    border-right: none;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 80px 100px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableCell = styled.div`
  padding: 12px;
  border-right: 1px solid #eee;
  font-size: 14px;
  color: #333;
  
  &:last-child {
    border-right: none;
  }
`;

const CourseCell = styled(TableCell)`
  color: #007bff;
  font-weight: 500;
`;

const InstructorCell = styled(TableCell)`
  color: #007bff;
`;

const CategoryCell = styled(TableCell)`
  font-weight: 500;
`;

const WeightCell = styled(TableCell)`
  text-align: center;
  font-weight: 500;
`;

const ActionCell = styled(TableCell)`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'edit' ? '#ffc107' : '#dc3545'};
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'edit' ? '#e0a800' : '#c82333'};
    transform: translateY(-1px);
  }
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
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: #333;
  font-size: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  
  &::after {
    content: "*";
    color: #dc3545;
    margin-left: 4px;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: #0e66a1;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: #5a6268;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
`;

const GradeCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const { confirmState, showDeleteConfirm } = useConfirm();
  const [formData, setFormData] = useState({
    course_id: '',
    instructor_id: '',
    category_name: '',
    weight: ''
  });

  const categoryTypes = [
    'All Categories',
    'Exams',
    'Final Exam',
    'Quizzes',
    'Homework',
    'Clinical Labs',
    'Assignments'
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, coursesRes, instructorsRes] = await Promise.all([
        fetchGradeCategories(),
        fetchCourses(),
        fetchInstructors()
      ]);
      
      setCategories(categoriesRes.categories || []);
      setCourses(coursesRes.courses || []);
      setInstructors(instructorsRes.instructors || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      course_id: '',
      instructor_id: '',
      category_name: '',
      weight: ''
    });
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      course_id: category.course_id || '',
      instructor_id: category.instructor_id || '',
      category_name: category.category_name || '',
      weight: category.weight || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirm('grade category', 'grade category');
    if (!confirmed) return;
    
    try {
      await deleteGradeCategory(id);
      await loadData();
      showSuccess('Grade category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      showError('Error deleting category: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await updateGradeCategory(editingCategory.id, formData);
        showSuccess('Grade category updated successfully');
      } else {
        await createGradeCategory(formData);
        showSuccess('Grade category created successfully');
      }
      
      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error saving category:', error);
      showError('Error saving category: ' + error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredCategories = selectedCategory && selectedCategory !== 'All Categories' 
    ? categories.filter(cat => cat.category_name === selectedCategory)
    : categories;

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading grade categories...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Grade Category</Title>
        <AddButton onClick={handleAddNew}>
          <FaPlus />
          Add Category
        </AddButton>
      </Header>
      
      <FilterContainer>
        <FilterSelect 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Grade Category</option>
          {categoryTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </FilterSelect>
      </FilterContainer>
      
      <TableContainer>
        <TableHeader>
          <HeaderCell>Course</HeaderCell>
          <HeaderCell>Instructor</HeaderCell>
          <HeaderCell>Category</HeaderCell>
          <HeaderCell>Weight</HeaderCell>
          <HeaderCell>Actions</HeaderCell>
        </TableHeader>
        
        {filteredCategories.map((category) => (
          <TableRow key={category.id}>
            <CourseCell>{category.course}</CourseCell>
            <InstructorCell>{category.instructor}</InstructorCell>
            <CategoryCell>{category.category_name}</CategoryCell>
            <WeightCell>{category.weight}%</WeightCell>
            <ActionCell>
              <ActionButton 
                variant="edit" 
                onClick={() => handleEdit(category)}
                title="Edit"
              >
                <FaEdit />
              </ActionButton>
              <ActionButton 
                variant="delete" 
                onClick={() => handleDelete(category.id)}
                title="Delete"
              >
                <FaTrash />
              </ActionButton>
            </ActionCell>
          </TableRow>
        ))}
      </TableContainer>

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingCategory ? 'Edit Grade Category' : 'Add Grade Category'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>&times;</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Course</Label>
                <Select 
                  value={formData.course_id} 
                  onChange={(e) => handleInputChange('course_id', e.target.value)}
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Instructor</Label>
                <Select 
                  value={formData.instructor_id} 
                  onChange={(e) => handleInputChange('instructor_id', e.target.value)}
                >
                  <option value="">Select Instructor</option>
                  {instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Category Name</Label>
                <Input 
                  type="text" 
                  value={formData.category_name}
                  onChange={(e) => handleInputChange('category_name', e.target.value)}
                  placeholder="Enter category name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Weight (%)</Label>
                <Input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="Enter weight percentage"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                />
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  {editingCategory ? 'Update' : 'Create'}
                </SubmitButton>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

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
    </Container>
  );
};

export default GradeCategory; 