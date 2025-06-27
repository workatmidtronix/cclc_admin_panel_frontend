import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { 
  fetchGradeColumns, 
  createGradeColumn, 
  updateGradeColumn, 
  deleteGradeColumn,
  fetchCourses,
  fetchCategoriesDropdown
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
  grid-template-columns: 1fr 1fr 1fr 100px 120px 100px;
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
  grid-template-columns: 1fr 1fr 1fr 100px 120px 100px;
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

const CategoryCell = styled(TableCell)`
  color: #007bff;
`;

const NameCell = styled(TableCell)`
  font-weight: 500;
`;

const MaxPointsCell = styled(TableCell)`
  text-align: center;
  font-weight: 500;
`;

const IncludeCell = styled(TableCell)`
  text-align: center;
`;

const IncludeBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.include ? '#d4edda' : '#f8d7da'};
  color: ${props => props.include ? '#155724' : '#721c24'};
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-weight: 500;
  color: #333;
  cursor: pointer;
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

const GradeColumns = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [columns, setColumns] = useState([]);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingColumn, setEditingColumn] = useState(null);
  const { confirmState, showDeleteConfirm } = useConfirm();
  const [formData, setFormData] = useState({
    course_id: '',
    category_id: '',
    column_name: '',
    max_points: '',
    include_in_calculation: true
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
      const [columnsRes, coursesRes, categoriesRes] = await Promise.all([
        fetchGradeColumns(),
        fetchCourses(),
        fetchCategoriesDropdown()
      ]);
      
      setColumns(columnsRes.columns || []);
      setCourses(coursesRes.courses || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Error loading data:', error);
      showError('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingColumn(null);
    setFormData({
      course_id: '',
      category_id: '',
      column_name: '',
      max_points: '',
      include_in_calculation: true
    });
    setShowModal(true);
  };

  const handleEdit = (column) => {
    setEditingColumn(column);
    setFormData({
      course_id: column.course_id || '',
      category_id: column.category_id || '',
      column_name: column.column_name || '',
      max_points: column.max_points || '',
      include_in_calculation: column.include_in_calculation !== false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await showDeleteConfirm('grade column', 'grade column');
    if (!confirmed) return;
    
    try {
      await deleteGradeColumn(id);
      await loadData();
      showSuccess('Grade column deleted successfully');
    } catch (error) {
      console.error('Error deleting column:', error);
      showError('Error deleting column: ' + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingColumn) {
        await updateGradeColumn(editingColumn.id, formData);
        showSuccess('Grade column updated successfully');
      } else {
        await createGradeColumn(formData);
        showSuccess('Grade column created successfully');
      }
      
      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error saving column:', error);
      showError('Error saving column: ' + error.message);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredColumns = selectedCategory && selectedCategory !== 'All Categories' 
    ? columns.filter(col => col.category === selectedCategory)
    : columns;

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading grade columns...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Grade Columns</Title>
        <AddButton onClick={handleAddNew}>
          <FaPlus />
          Add Column
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
          <HeaderCell>Category</HeaderCell>
          <HeaderCell>Name</HeaderCell>
          <HeaderCell>Max Points</HeaderCell>
          <HeaderCell>Include In Calculation</HeaderCell>
          <HeaderCell>Actions</HeaderCell>
        </TableHeader>
        
        {filteredColumns.map((column) => (
          <TableRow key={column.id}>
            <CourseCell>{column.course}</CourseCell>
            <CategoryCell>{column.category}</CategoryCell>
            <NameCell>{column.column_name}</NameCell>
            <MaxPointsCell>{column.max_points}</MaxPointsCell>
            <IncludeCell>
              <IncludeBadge include={column.include_in_calculation}>
                {column.include_in_calculation ? 'Yes' : 'No'}
              </IncludeBadge>
            </IncludeCell>
            <ActionCell>
              <ActionButton 
                variant="edit" 
                onClick={() => handleEdit(column)}
                title="Edit"
              >
                <FaEdit />
              </ActionButton>
              <ActionButton 
                variant="delete" 
                onClick={() => handleDelete(column.id)}
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
                {editingColumn ? 'Edit Grade Column' : 'Add Grade Column'}
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
                <Label>Category</Label>
                <Select 
                  value={formData.category_id} 
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Name</Label>
                <Input 
                  type="text" 
                  value={formData.column_name}
                  onChange={(e) => handleInputChange('column_name', e.target.value)}
                  placeholder="Enter column name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Max Points</Label>
                <Input 
                  type="number" 
                  value={formData.max_points}
                  onChange={(e) => handleInputChange('max_points', e.target.value)}
                  placeholder="Enter max points"
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>

              <FormGroup>
                <CheckboxContainer>
                  <Checkbox 
                    type="checkbox" 
                    id="include_in_calculation"
                    checked={formData.include_in_calculation}
                    onChange={(e) => handleInputChange('include_in_calculation', e.target.checked)}
                  />
                  <CheckboxLabel htmlFor="include_in_calculation">
                    Include In Calculation
                  </CheckboxLabel>
                </CheckboxContainer>
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </CancelButton>
                <SubmitButton type="submit">
                  {editingColumn ? 'Update' : 'Create'}
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

export default GradeColumns; 