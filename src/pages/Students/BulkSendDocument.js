import React, { useState } from 'react';
import styled from 'styled-components';
import { CourseSelect, SessionSelect, StudentSelect } from '../../components/MasterDataSelect';

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
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  max-width: 600px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 25px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.95rem;
  
  &:after {
    content: ${props => props.required ? '" *"' : '""'};
    color: #dc3545;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(51, 66, 147, 0.1);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  color: #2c3e50;
  font-size: 0.95rem;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
`;

const SendButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgb(45, 58, 130);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(51, 66, 147, 0.3);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ClearButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
  }
`;

const BulkSendDocument = () => {
  const [formData, setFormData] = useState({
    course: '',
    session: '',
    selectAllStudents: false,
    students: '',
    documents: ''
  });

  // Remove hardcoded arrays since we're using MasterDataSelect

  const documents = [
    'Course Syllabus',
    'Attendance Sheet',
    'Assignment Instructions',
    'Study Materials',
    'Practice Tests',
    'Certification Requirements',
    'Schedule Updates'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Bulk Send Document:', formData);
    // Add logic to send documents to selected students
  };

  const handleClear = () => {
    setFormData({
      course: '',
      session: '',
      selectAllStudents: false,
      students: '',
      documents: ''
    });
  };

  return (
    <Container>
      <Header>
        <Title>Bulk Send Document</Title>
      </Header>

      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label required>Course</Label>
            <CourseSelect
              value={formData.course}
              onChange={(value) => handleInputChange({ target: { name: 'course', value } })}
              placeholder="Select course"
              isClearable={false}
            />
          </FormGroup>

          <FormGroup>
            <Label required>Session</Label>
            <SessionSelect
              value={formData.session}
              onChange={(value) => handleInputChange({ target: { name: 'session', value } })}
              placeholder="Select session"
              isClearable={false}
            />
          </FormGroup>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="selectAllStudents"
              name="selectAllStudents"
              checked={formData.selectAllStudents}
              onChange={handleInputChange}
            />
            <CheckboxLabel htmlFor="selectAllStudents">
              Select all students
            </CheckboxLabel>
          </CheckboxContainer>

          <FormGroup>
            <Label required>Select Students</Label>
            <StudentSelect
              value={formData.students}
              onChange={(value) => handleInputChange({ target: { name: 'students', value } })}
              placeholder="Select students"
              disabled={formData.selectAllStudents}
            />
          </FormGroup>

          <FormGroup>
            <Label required>Select Documents</Label>
            <Select
              name="documents"
              value={formData.documents}
              onChange={handleInputChange}
              required
            >
              <option value="">-Select-</option>
              {documents.map(document => (
                <option key={document} value={document}>{document}</option>
              ))}
            </Select>
          </FormGroup>

          <ButtonGroup>
            <SendButton type="submit">
              Send
            </SendButton>
            <ClearButton type="button" onClick={handleClear}>
              Clear
            </ClearButton>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};

export default BulkSendDocument; 