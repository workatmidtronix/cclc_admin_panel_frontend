import React, { useState } from 'react';
import styled from 'styled-components';

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

const FormContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 30px;
  max-width: 600px;
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
  
  &:after {
    content: ${props => props.required ? '"*"' : '""'};
    color: #e74c3c;
    margin-left: 3px;
  }
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  transform: scale(1.2);
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: #2c3e50;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  margin-top: 30px;
`;

const SendButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  
  &:hover {
    background:rgb(43, 29, 153) 66, 147);
  }
`;

const ResetButton = styled.button`
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
  padding: 12px 25px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  
  &:hover {
    background: #e9ecef;
  }
`;

const SendSMS = () => {
  const [formData, setFormData] = useState({
    course: '',
    session: '',
    selectAllStudents: false,
    student: '',
    message: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('SMS Form submitted:', formData);
  };

  const handleReset = () => {
    setFormData({
      course: '',
      session: '',
      selectAllStudents: false,
      student: '',
      message: ''
    });
  };

  return (
    <Container>
      <Header>
        <Title>Send SMS</Title>
      </Header>

      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label required>Course</Label>
            <Select
              value={formData.course}
              onChange={(e) => handleInputChange('course', e.target.value)}
            >
              <option value="">-Select-</option>
              <option value="certified-medical-assistant">Certified Medical Assistant</option>
              <option value="ekg">EKG</option>
              <option value="patient-care-technician">Patient Care Technician</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label required>Session</Label>
            <Select
              value={formData.session}
              onChange={(e) => handleInputChange('session', e.target.value)}
            >
              <option value="">-Select-</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </Select>
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="selectAllStudents"
              checked={formData.selectAllStudents}
              onChange={(e) => handleInputChange('selectAllStudents', e.target.checked)}
            />
            <CheckboxLabel htmlFor="selectAllStudents">Select all students</CheckboxLabel>
          </CheckboxContainer>

          <FormGroup>
            <Label required>Student</Label>
            <Select
              value={formData.student}
              onChange={(e) => handleInputChange('student', e.target.value)}
              disabled={formData.selectAllStudents}
            >
              <option value="">-Select-</option>
              <option value="student1">Student 1</option>
              <option value="student2">Student 2</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label required>Message</Label>
            <TextArea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Enter your SMS message"
            />
          </FormGroup>

          <ButtonGroup>
            <SendButton type="submit">Send</SendButton>
            <ResetButton type="button" onClick={handleReset}>Reset</ResetButton>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};

export default SendSMS; 