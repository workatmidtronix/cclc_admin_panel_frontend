import React, { useState } from 'react';
import styled from 'styled-components';
import { CourseSelect, SessionSelect, InstructorSelect, StudentSelect } from './MasterDataSelect';
import { showSuccess } from './CustomAlert';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
`;

const Button = styled.button`
  background: rgb(52, 152, 219);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;

  &:hover {
    background: rgb(41, 128, 185);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ResultDisplay = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid rgb(52, 152, 219);
`;

// Example form component that uses master data
const ExampleForm = () => {
  const [formData, setFormData] = useState({
    course: '',
    session: '',
    instructor: '',
    student: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = {};
    if (!formData.course) newErrors.course = 'Course is required';
    if (!formData.session) newErrors.session = 'Session is required';
    if (!formData.instructor) newErrors.instructor = 'Instructor is required';
    if (!formData.student) newErrors.student = 'Student is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Form is valid, you can submit the data
    console.log('Form submitted:', formData);
    showSuccess('Form submitted successfully! Check console for data.');
  };

  return (
    <FormContainer>
      <h2>Example Form with Master Data</h2>
      <p>This form demonstrates how to use the master data components in your forms.</p>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Course *</Label>
          <CourseSelect
            value={formData.course}
            onChange={(e) => handleChange({ target: { name: 'course', value: e.target.value } })}
            placeholder="Select a course"
            error={errors.course}
          />
        </FormGroup>

        <FormGroup>
          <Label>Session *</Label>
          <SessionSelect
            value={formData.session}
            onChange={(e) => handleChange({ target: { name: 'session', value: e.target.value } })}
            placeholder="Select a session"
            error={errors.session}
          />
        </FormGroup>

        <FormGroup>
          <Label>Instructor *</Label>
          <InstructorSelect
            value={formData.instructor}
            onChange={(e) => handleChange({ target: { name: 'instructor', value: e.target.value } })}
            placeholder="Select an instructor"
            error={errors.instructor}
          />
        </FormGroup>

        <FormGroup>
          <Label>Student *</Label>
          <StudentSelect
            value={formData.student}
            onChange={(e) => handleChange({ target: { name: 'student', value: e.target.value } })}
            placeholder="Select a student"
            error={errors.student}
          />
        </FormGroup>

        <Button type="submit">Submit Form</Button>
      </Form>

      <ResultDisplay>
        <h4>Current Form Data:</h4>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </ResultDisplay>
    </FormContainer>
  );
};

export default ExampleForm; 