import React, { useState } from 'react';
import styled from 'styled-components';
import { CourseSelect } from '../../components/MasterDataSelect';
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
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #e74c3c;
  margin: 0;
  font-size: 0.9rem;
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

const DateInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
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
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
  }
`;

const FileUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const FileInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  flex: 1;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
  }
`;

const FileLabel = styled.span`
  font-size: 0.85rem;
  color: #666;
  margin-left: 10px;
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

const SendOptions = styled.div`
  margin-bottom: 20px;
`;

const SendOptionsLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
  
  &:after {
    content: "*";
    color: #e74c3c;
    margin-left: 3px;
  }
`;

const RadioContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const RadioInput = styled.input`
  margin: 0;
`;

const RadioLabel = styled.label`
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
    background: rgb(17, 37, 155);
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

const SendAnnouncement = () => {
  const [formData, setFormData] = useState({
    course: '',
    session: '',
    selectAllStudents: false,
    students: '',
    date: '06/12/25',
    subject: '',
    message: '',
    document1: null,
    document2: null,
    document3: null,
    sendMethod: 'mail'
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleReset = () => {
    setFormData({
      course: '',
      session: '',
      selectAllStudents: false,
      students: '',
      date: '06/12/25',
      subject: '',
      message: '',
      document1: null,
      document2: null,
      document3: null,
      sendMethod: 'mail'
    });
  };

  return (
    <Container>
      <Header>
        <Title>Send Announcement</Title>
        <Subtitle>Send announcements to students through mail</Subtitle>
      </Header>

      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label required>Course</Label>
            <CourseSelect
                value={formData.course}
                onChange={(value) => setFormData(prev => ({ ...prev, course: value }))}
                placeholder="Select course"
                isClearable={false}
              />
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
              id="selectAll"
              checked={formData.selectAllStudents}
              onChange={(e) => handleInputChange('selectAllStudents', e.target.checked)}
            />
            <CheckboxLabel htmlFor="selectAll">Select all students</CheckboxLabel>
          </CheckboxContainer>

          <FormGroup>
            <Label required>Students</Label>
            <Select
              value={formData.students}
              onChange={(e) => handleInputChange('students', e.target.value)}
              disabled={formData.selectAllStudents}
            >
              <option value="">-Select-</option>
              <option value="student1">Student 1</option>
              <option value="student2">Student 2</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label required>Date</Label>
            <DateInput
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label required>Subject</Label>
            <Input
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Enter subject"
            />
          </FormGroup>

          <FormGroup>
            <Label required>Message</Label>
            <TextArea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Enter your message"
            />
          </FormGroup>

          <FormGroup>
            <Label>Document - 1</Label>
            <FileUploadContainer>
              <FileInput
                type="file"
                onChange={(e) => handleFileChange('document1', e.target.files[0])}
              />
              <FileLabel>*</FileLabel>
            </FileUploadContainer>
          </FormGroup>

          <FormGroup>
            <Label>Document - 2</Label>
            <FileUploadContainer>
              <FileInput
                type="file"
                onChange={(e) => handleFileChange('document2', e.target.files[0])}
              />
              <FileLabel>*</FileLabel>
            </FileUploadContainer>
          </FormGroup>

          <FormGroup>
            <Label>Document - 3</Label>
            <FileUploadContainer>
              <FileInput
                type="file"
                onChange={(e) => handleFileChange('document3', e.target.files[0])}
              />
              <FileLabel>*</FileLabel>
            </FileUploadContainer>
          </FormGroup>

          <SendOptions>
            <SendOptionsLabel>Send</SendOptionsLabel>
            <RadioContainer>
              <RadioOption>
                <RadioInput
                  type="radio"
                  id="mail"
                  name="sendMethod"
                  value="mail"
                  checked={formData.sendMethod === 'mail'}
                  onChange={(e) => handleInputChange('sendMethod', e.target.value)}
                />
                <RadioLabel htmlFor="mail">Mail</RadioLabel>
              </RadioOption>
              <RadioOption>
                <RadioInput
                  type="radio"
                  id="sms"
                  name="sendMethod"
                  value="sms"
                  checked={formData.sendMethod === 'sms'}
                  onChange={(e) => handleInputChange('sendMethod', e.target.value)}
                />
                <RadioLabel htmlFor="sms">SMS</RadioLabel>
              </RadioOption>
            </RadioContainer>
          </SendOptions>

          <ButtonGroup>
            <SendButton type="submit">Send</SendButton>
            <ResetButton type="button" onClick={handleReset}>Reset</ResetButton>
          </ButtonGroup>
        </form>
      </FormContainer>
    </Container>
  );
};

export default SendAnnouncement; 