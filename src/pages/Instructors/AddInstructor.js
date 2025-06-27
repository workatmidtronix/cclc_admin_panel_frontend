import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const FormColumn = styled.div`
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
  font-size: 14px;
  
  &::after {
    content: ${props => props.required ? '"*"' : '""'};
    color: #dc3545;
    margin-left: 4px;
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

const Select = styled.select`
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

const GenderGroup = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
`;

const RadioLabel = styled.label`
  font-size: 14px;
  color: #333;
  cursor: pointer;
`;

const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  
  &:focus-within {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const CountryCode = styled.div`
  background: #f8f9fa;
  padding: 10px 12px;
  border-right: 1px solid #ddd;
  font-size: 14px;
`;

const PhoneInput = styled.input`
  border: none;
  padding: 10px 12px;
  font-size: 14px;
  flex: 1;
  
  &:focus {
    outline: none;
  }
`;

const FileInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  color: #6c757d;
  flex: 1;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const UploadButton = styled.label`
  background: #f3f3f3;
  color: #212529;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  
  &:hover {
    background: #ffca2c;
  }
`;

const AddressGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AddressRow = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const AddressInput = styled(Input)`
  flex: 1;
`;

const AddressLabel = styled.div`
  font-size: 12px;
  color: #6c757d;
  margin-top: 4px;
`;

const StatusSelect = styled(Select)`
  background: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  grid-column: 1 / -1;
`;

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background:rgb(5, 71, 141) 66, 147);
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
    background: #545b62;
  }
`;

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    employeeType: '',
    salutation: '',
    contactNumber: '',
    email: '',
    qualification: '',
    dateOfBirth: '',
    course: '',
    gender: '',
    addressLine1: '',
    maritalStatus: '',
    addressLine2: '',
    photo: null,
    cityDistrict: '',
    stateProvince: '',
    department: '',
    postalCode: '',
    designation: '',
    country: '',
    status: 'Active'
  });

  const [apiMessage, setApiMessage] = useState(null);
  const [apiError, setApiError] = useState(null);

  const salutations = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  const departments = ['EKG & PHL', 'CNA', 'CPR/AED/BLS', 'Phlebotomy', 'Medical Assistant'];
  const designations = ['Instructor', 'Senior Instructor', 'Lead Instructor', 'Department Head'];
  const courses = ['EKG', 'CNA', 'CPR/AED/BLS', 'Phlebotomy', 'Medical Assistant', 'Pharmacy Technician'];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia'];
  const employeeTypes = ['Instructor', 'Staff Member'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      photo: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMessage(null);
    setApiError(null);
    try {
      const data = new FormData();
      data.append('employee_id', formData.employeeId);
      data.append('name', formData.employeeName);
      data.append('employee_type', formData.employeeType);
      data.append('salutation', formData.salutation);
      data.append('contact_number', formData.contactNumber);
      data.append('email', formData.email);
      data.append('qualification', formData.qualification);
      data.append('course', formData.course);
      data.append('date_of_birth', formData.dateOfBirth);
      data.append('gender', formData.gender);
      data.append('marital_status', formData.maritalStatus);
      data.append('department', formData.department);
      data.append('designation', formData.designation);
      data.append('status', formData.status);
      data.append('address_line1', formData.addressLine1);
      data.append('address_line2', formData.addressLine2);
      data.append('city', formData.cityDistrict);
      data.append('state', formData.stateProvince);
      data.append('postal_code', formData.postalCode);
      data.append('country', formData.country);
      if (formData.photo) data.append('photo', formData.photo);
      
      const endpoint = formData.employeeType === 'Instructor' ? '/api/instructors/add' : '/api/staff/add';
      const response = await axios.post(`http://localhost:5000${endpoint}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        setApiMessage(response.data.message || 'Employee added successfully.');
        setFormData({
          employeeName: '', employeeId: '', employeeType: '', salutation: '', contactNumber: '', email: '', qualification: '', dateOfBirth: '', course: '', gender: '', addressLine1: '', maritalStatus: '', addressLine2: '', photo: null, cityDistrict: '', stateProvince: '', department: '', postalCode: '', designation: '', country: '', status: 'Active'
        });
      } else {
        setApiError(response.data.message || 'Failed to add employee.');
      }
    } catch (err) {
      setApiError(err.response?.data?.message || 'Server error while adding employee.');
    }
  };

  const handleReset = () => {
    setFormData({
      employeeName: '',
      employeeId: '',
      employeeType: '',
      salutation: '',
      contactNumber: '',
      email: '',
      qualification: '',
      dateOfBirth: '',
      course: '',
      gender: '',
      addressLine1: '',
      maritalStatus: '',
      addressLine2: '',
      photo: null,
      cityDistrict: '',
      stateProvince: '',
      department: '',
      postalCode: '',
      designation: '',
      country: '',
      status: 'Active'
    });
  };

  return (
    <Container>
      <Title>Add Employee</Title>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGrid>
            {/* Left Column */}
            <FormColumn>
              <FormGroup>
                <Label required>Employee Name</Label>
                <Input 
                  type="text"
                  value={formData.employeeName}
                  onChange={(e) => handleInputChange('employeeName', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label required>Employee Type</Label>
                <Select 
                  value={formData.employeeType}
                  onChange={(e) => handleInputChange('employeeType', e.target.value)}
                  required
                >
                  <option value="">--Select Employee Type--</option>
                  {employeeTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Salutation</Label>
                <Select 
                  value={formData.salutation}
                  onChange={(e) => handleInputChange('salutation', e.target.value)}
                >
                  <option value="">--Select--</option>
                  {salutations.map((sal, index) => (
                    <option key={index} value={sal}>{sal}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Date of Birth</Label>
                <Input 
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Gender</Label>
                <GenderGroup>
                  <RadioGroup>
                    <RadioInput 
                      type="radio"
                      id="male"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    />
                    <RadioLabel htmlFor="male">Male</RadioLabel>
                  </RadioGroup>
                  <RadioGroup>
                    <RadioInput 
                      type="radio"
                      id="female"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    />
                    <RadioLabel htmlFor="female">Female</RadioLabel>
                  </RadioGroup>
                  <RadioGroup>
                    <RadioInput 
                      type="radio"
                      id="others"
                      name="gender"
                      value="Others"
                      checked={formData.gender === 'Others'}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    />
                    <RadioLabel htmlFor="others">Others</RadioLabel>
                  </RadioGroup>
                </GenderGroup>
              </FormGroup>

              <FormGroup>
                <Label>Marital Status</Label>
                <Select 
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                >
                  <option value="">--Select--</option>
                  {maritalStatuses.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Photo</Label>
                <FileInputContainer>
                  <FileInput 
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <FileInputLabel htmlFor="photo">
                    {formData.photo ? formData.photo.name : 'Select Image'}
                  </FileInputLabel>
                  <UploadButton htmlFor="photo">📁</UploadButton>
                </FileInputContainer>
              </FormGroup>

              {formData.employeeType === 'Instructor' && (
                <>
                  <FormGroup>
                    <Label>Department</Label>
                    <Select 
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Designation</Label>
                    <Select 
                      value={formData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {designations.map((designation, index) => (
                        <option key={index} value={designation}>{designation}</option>
                      ))}
                    </Select>
                  </FormGroup>
                </>
              )}

              <FormGroup>
                <Label required>Status</Label>
                <StatusSelect 
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </StatusSelect>
              </FormGroup>
            </FormColumn>

            {/* Right Column */}
            <FormColumn>
              {formData.employeeType === 'Instructor' && (
                <FormGroup>
                  <Label>Instructor ID</Label>
                  <Input 
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  />
                </FormGroup>
              )}

              <FormGroup>
                <Label>Contact Number</Label>
                <PhoneInputContainer>
                  <CountryCode>🇺🇸 +1</CountryCode>
                  <PhoneInput 
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    placeholder="222-555-7777"
                  />
                </PhoneInputContainer>
              </FormGroup>

              <FormGroup>
                <Label>Qualification</Label>
                <Input 
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                />
              </FormGroup>

              {formData.employeeType === 'Instructor' && (
                <FormGroup>
                  <Label>Course</Label>
                  <Select 
                    value={formData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                  >
                    <option value="">--Select--</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  </Select>
                </FormGroup>
              )}

              <FormGroup>
                <Label>Address</Label>
                <AddressGroup>
                  <div>
                    <AddressInput 
                      type="text"
                      value={formData.addressLine1}
                      onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    />
                    <AddressLabel>Address Line 1</AddressLabel>
                  </div>
                  <div>
                    <AddressInput 
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    />
                    <AddressLabel>Address Line 2</AddressLabel>
                  </div>
                  <AddressRow>
                    <div style={{ flex: 1 }}>
                      <AddressInput 
                        type="text"
                        value={formData.cityDistrict}
                        onChange={(e) => handleInputChange('cityDistrict', e.target.value)}
                      />
                      <AddressLabel>City / District</AddressLabel>
                    </div>
                    <div style={{ flex: 1 }}>
                      <AddressInput 
                        type="text"
                        value={formData.stateProvince}
                        onChange={(e) => handleInputChange('stateProvince', e.target.value)}
                      />
                      <AddressLabel>State / Province</AddressLabel>
                    </div>
                  </AddressRow>
                  <AddressRow>
                    <div style={{ flex: 1 }}>
                      <AddressInput 
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      />
                      <AddressLabel>Postal Code</AddressLabel>
                    </div>
                    <div style={{ flex: 1 }}>
                      <Select 
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                      >
                        <option value="">--Select--</option>
                        {countries.map((country, index) => (
                          <option key={index} value={country}>{country}</option>
                        ))}
                      </Select>
                      <AddressLabel>Country</AddressLabel>
                    </div>
                  </AddressRow>
                </AddressGroup>
              </FormGroup>
            </FormColumn>

            <ButtonGroup>
              <SubmitButton type="submit">Submit</SubmitButton>
              <ResetButton type="button" onClick={handleReset}>Reset</ResetButton>
            </ButtonGroup>
          </FormGrid>
        </form>
      </FormContainer>
      {apiError && <div style={{ color: 'red', marginBottom: 10 }}>{apiError}</div>}
      {apiMessage && <div style={{ color: 'green', marginBottom: 10 }}>{apiMessage}</div>}
    </Container>
  );
};

export default AddEmployee;
