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

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-start;
  margin-top: 30px;
`;

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  
  &:hover {
    background: #5a4bd4;
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

const SendPassword = () => {
  const [formData, setFormData] = useState({
    course: '',
    session: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password Form submitted:', formData);
  };

  const handleReset = () => {
    setFormData({
      course: '',
      session: ''
    });
  };

  return (
    <Container>
      <Header>
        <Title>Send Password</Title>
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

          <ButtonGroup>
            <SubmitButton type="submit">Submit</SubmitButton>
            <ResetButton type="button" onClick={handleReset}>Reset</ResetButton>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};

export default SendPassword; 