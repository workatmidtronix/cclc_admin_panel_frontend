import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { showSuccess, showError } from '../../components/CustomAlert';
import { CourseSelect, SessionSelect } from '../../components/MasterDataSelect';

const Container = styled.div`
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
`;

const FormContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
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
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  
  &::after {
    content: ${props => props.required ? '"*"' : '""'};
    color: #dc3545;
    margin-left: 4px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const Input = styled.input`
  width: 100%;
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

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const CheckboxLabel = styled.label`
  color: #333;
  font-size: 14px;
  cursor: pointer;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 30px 0 20px 0;
`;

const GradeTable = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 30px;
  background: white;
`;

const GradeHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
`;

const HeaderCell = styled.div`
  padding: 12px 15px;
  font-weight: 600;
  color: #333;
  border-right: 1px solid #ddd;
  
  &:last-child {
    border-right: none;
  }
`;

const EmptyGradeTable = styled.div`
  padding: 40px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #0e66a1;
  }
`;

const ResetButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #5a6268;
  }
`;

const Grade = () => {
  const [formData, setFormData] = useState({
    course: '',
    session: '',
    category: '',
    name: '',
    maxPoints: '',
    includeInCalculation: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Grade Configuration:', formData);
    showSuccess('Grade configuration submitted successfully!');
  };

  const handleReset = () => {
    setFormData({
      course: '',
      session: '',
      category: '',
      name: '',
      maxPoints: '',
      includeInCalculation: false
    });
  };

  return (
    <Container>
      <Title>Grade</Title>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label required>Course</Label>
              <CourseSelect
                value={formData.course}
                onChange={(value) => handleInputChange('course', value)}
                placeholder="Select course"
                isClearable={false}
              />
            </FormGroup>
            
            <FormGroup>
              <Label required>Session</Label>
              <SessionSelect
                value={formData.session}
                onChange={(value) => handleInputChange('session', value)}
                placeholder="Select session"
                isClearable={false}
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label required>Category</Label>
              <Select 
                value={formData.category} 
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              >
                <option value="">--Select--</option>
                <option value="Exams">Exams</option>
                <option value="Final Exam">Final Exam</option>
                <option value="Quizzes">Quizzes</option>
                <option value="Homework">Homework</option>
                <option value="Clinical (EKG Lab)">Clinical (EKG Lab)</option>
                <option value="Assignments">Assignments</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label required>Name</Label>
              <Select 
                value={formData.name} 
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              >
                <option value="">--Select--</option>
                <option value="Clinical Exam- Anatomy & EKG Tracings">Clinical Exam- Anatomy & EKG Tracings</option>
                <option value="Clinical Quiz- EKG Machine Set Up">Clinical Quiz- EKG Machine Set Up</option>
                <option value="Homework Chapter 1">Homework Chapter 1</option>
                <option value="Homework Chapters 2 & 3">Homework Chapters 2 & 3</option>
                <option value="Exam 1 = Chapter 3, 4, & 8">Exam 1 = Chapter 3, 4, & 8</option>
                <option value="Exam 2 = Chapter 5, 6, 7 & 9">Exam 2 = Chapter 5, 6, 7 & 9</option>
                <option value="Quiz 1 - Chapter 1 & 2">Quiz 1 - Chapter 1 & 2</option>
                <option value="Quiz 2 - Chapter 7 and 9">Quiz 2 - Chapter 7 and 9</option>
                <option value="Comprehensive Final Exam">Comprehensive Final Exam</option>
              </Select>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Max Points</Label>
              <Input 
                type="number" 
                value={formData.maxPoints}
                onChange={(e) => handleInputChange('maxPoints', e.target.value)}
                placeholder="Enter maximum points"
              />
            </FormGroup>
            <FormGroup></FormGroup>
          </FormRow>

          <CheckboxGroup>
            <Checkbox 
              type="checkbox" 
              id="includeInCalculation"
              checked={formData.includeInCalculation}
              onChange={(e) => handleInputChange('includeInCalculation', e.target.checked)}
            />
            <CheckboxLabel htmlFor="includeInCalculation">
              Is Include in Calculation?
            </CheckboxLabel>
          </CheckboxGroup>

          <SectionTitle>Grade</SectionTitle>
          
          <GradeTable>
            <GradeHeader>
              <HeaderCell>Student</HeaderCell>
              <HeaderCell>Points Scored</HeaderCell>
            </GradeHeader>
            
            <EmptyGradeTable>
              No students selected. Please choose a course and session to load students.
            </EmptyGradeTable>
          </GradeTable>

          <ButtonGroup>
            <SubmitButton type="submit">Submit</SubmitButton>
            <ResetButton type="button" onClick={handleReset}>Reset</ResetButton>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};

export default Grade; 