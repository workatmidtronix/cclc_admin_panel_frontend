import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const PageCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0 0 30px 0;
  font-size: 1.7rem;
  font-weight: 600;
`;

const FormSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin: 0 0 25px 0;
  font-size: 1.2rem;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
  padding-bottom: 10px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-bottom: 25px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
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
    box-shadow: 0 0 0 3px rgba(51, 66, 147, 0.1);
  }
`;

const AssignButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  margin-top: 20px;

  &:hover {
    background: rgb(45, 58, 130);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(51, 66, 147, 0.3);
  }
`;

const UpdateCourseSession = () => {
  const [formData, setFormData] = useState({
    student: '',
    course: '',
    session: '',
    firstChoiceCourse: '',
    firstChoiceLocation: '',
    firstChoiceDays: '',
    secondChoiceCourse: '',
    secondChoiceLocation: '',
    secondChoiceDays: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add logic to handle form submission
  };

  const students = [
    'John Doe',
    'Jane Smith', 
    'Michael Johnson',
    'Emily Davis',
    'David Wilson'
  ];

  const courses = [
    'EKG',
    'Certified Medical Assistant',
    'Patient Care Technician',
    'Pharmacy Technician',
    'Medical Billing'
  ];

  const sessions = [
    'Morning Session',
    'Afternoon Session',
    'Evening Session',
    'Weekend Session'
  ];

  const locations = [
    'Main Campus',
    'Downtown Center',
    'North Campus',
    'South Campus',
    'Online'
  ];

  const daysPreferred = [
    'Monday-Friday',
    'Monday-Wednesday-Friday',
    'Tuesday-Thursday',
    'Weekends Only',
    'Flexible'
  ];

  return (
    <Container>
      <PageCard>
        <Title>Assign Course & Session</Title>
        
        <form onSubmit={handleSubmit}>
          <FormSection>
            <FormRow>
              <FormGroup>
                <Label required>Student</Label>
                <Select
                  name="student"
                  value={formData.student}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-Select-</option>
                  {students.map((student, index) => (
                    <option key={index} value={student}>{student}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label required>Course</Label>
                <Select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-Select-</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label required>Session</Label>
                <Select
                  name="session"
                  value={formData.session}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-Select-</option>
                  {sessions.map((session, index) => (
                    <option key={index} value={session}>{session}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>Course Preference - 1st Choice</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label>Course Interested in</Label>
                <Select
                  name="firstChoiceCourse"
                  value={formData.firstChoiceCourse}
                  onChange={handleInputChange}
                >
                  <option value="">-Select-</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Location Preference</Label>
                <Select
                  name="firstChoiceLocation"
                  value={formData.firstChoiceLocation}
                  onChange={handleInputChange}
                >
                  <option value="">-Select-</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Days Preferred</Label>
                <Select
                  name="firstChoiceDays"
                  value={formData.firstChoiceDays}
                  onChange={handleInputChange}
                >
                  <option value="">-Select-</option>
                  {daysPreferred.map((days, index) => (
                    <option key={index} value={days}>{days}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>
          </FormSection>

          <FormSection>
            <SectionTitle>Course Preference - 2nd Choice</SectionTitle>
            <FormRow>
              <FormGroup>
                <Label>Course Interested in</Label>
                <Select
                  name="secondChoiceCourse"
                  value={formData.secondChoiceCourse}
                  onChange={handleInputChange}
                >
                  <option value="">-Select-</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Location Preference</Label>
                <Select
                  name="secondChoiceLocation"
                  value={formData.secondChoiceLocation}
                  onChange={handleInputChange}
                >
                  <option value="">-Select-</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Days Preferred</Label>
                <Select
                  name="secondChoiceDays"
                  value={formData.secondChoiceDays}
                  onChange={handleInputChange}
                >
                  <option value="">-Select-</option>
                  {daysPreferred.map((days, index) => (
                    <option key={index} value={days}>{days}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>
          </FormSection>

          <AssignButton type="submit">
            Assign
          </AssignButton>
        </form>
      </PageCard>
    </Container>
  );
};

export default UpdateCourseSession; 