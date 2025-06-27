import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { addStudent } from '../../store/slices/studentsSlice';
import { useMasterData } from '../../hooks/useMasterData';
import { CourseSelect, SessionSelect, SemesterSelect, DepartmentSelect } from '../../components/MasterDataSelect';
import SignaturePad from './SignaturePad';
import { toast, Toaster } from 'react-hot-toast';

const Container = styled.div`
  padding: 10px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 1.5rem;
`;

const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const Section = styled.div`
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
  font-weight: 600;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  transition: border-color 0.3s ease;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
  }
`;

const FileInput = styled.input`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
  }
`;

const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: rgb(51, 66, 147);;
  }
`;

const CountryCode = styled.div`
  background: #f8f9fa;
  padding: 12px 16px;
  border-right: 1px solid #e1e5e9;
  font-size: 16px;
  color: #495057;
`;

const PhoneInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  font-size: 16px;
  outline: none;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
`;

const PrimaryButton = styled(Button)`
  background: rgb(51, 66, 147);;
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: #e9ecef;
  color: #495057;

  &:hover {
    background: #dee2e6;
  }
`;

const ErrorSummary = styled.div`
  background-color: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  color: #d32f2f;
`;

const ErrorTitle = styled.h4`
  color: #d32f2f;
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ErrorList = styled.ul`
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
`;

const ErrorItem = styled.li`
  margin-bottom: 4px;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #4caf50;
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const AddStudent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courses, sessions, semesters, isLoading: masterDataLoading } = useMasterData();
  const [formErrors, setFormErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    course: '',
    department: '',
    studentNotes: '',
    session: '',
    driversLicense: '',
    dlUpload: null,
    studentPcpInfo: '',
    studentPcpPhone: '',
    status: 'Inactive',
    semester: '',
    socialSecurityNumber: '',
    socialSecurityUpload: null,
    emergencyContactInfo: '',
    emergencyContactPhone: '',
    otherEmergencyContact: '',
    caseworkerName: '',
    workforceCenter: '',
    taraItaPacketUpload: null,
    taraItaCompletionDate: '',
    voucherDates: null,
    infoSessionDate: '',
    notes: '',
    registrationNumber: '',
    phone: '',
    dateOfJoining: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    gender: '',
    religion: '',
    nationality: '',
    photo: null,
    coursePref1: '',
    daysPref1: '',
    locationPref1: '',
    coursePref2: '',
    daysPref2: '',
    locationPref2: '',
    attendedInfoSession: false,
    infoSessionLocation: '',
    additionalComments: '',
    signature: '',
    nameCapitalization: false,
    loginId: '',
    password: ''
  });

console.log(formData);
console.log(formData.course);
console.log(formData.session);


  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
      'loginId', 'password', 'course', 'session', 'gender',
      'socialSecurityNumber', 'driversLicense'
    ];

    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Contact number validation - must be 10 digits
    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 10) {
        errors.phone = 'Contact number must be 10 digits';
      }
    }
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    // Social Security Number validation - must be 9 digits
    if (formData.socialSecurityNumber) {
      const ssnDigits = formData.socialSecurityNumber.replace(/\D/g, '');
      if (ssnDigits.length !== 9) {
        errors.socialSecurityNumber = 'SSN must be 9 digits';
      }
    }

    // Gender validation
    if (formData.gender && !['Male', 'Female', 'Other'].includes(formData.gender)) {
      errors.gender = 'Please select a valid gender';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    // Format contact number as user types
    if (name === 'phone') {
      const phoneDigits = value.replace(/\D/g, '');
      const formattedPhone = phoneDigits.slice(0, 10).replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
    }
    // Format SSN as user types
    else if (name === 'socialSecurityNumber') {
      const ssnDigits = value.replace(/\D/g, '');
      const formattedSSN = ssnDigits.slice(0, 9).replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
      setFormData(prev => ({
        ...prev,
        [name]: formattedSSN
      }));
    }
    else if (type === 'file') {
      // Validate file type and size
      const file = files[0];
      if (file) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
          setFormErrors(prev => ({
            ...prev,
            [name]: 'Please upload a valid file (JPEG, PNG, GIF, or PDF)'
          }));
          return;
        }

        if (file.size > maxSize) {
          setFormErrors(prev => ({
            ...prev,
            [name]: 'File size should not exceed 5MB'
          }));
          return;
        }

        setFormData(prev => ({
          ...prev,
          [name]: file
        }));
      }
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous backend error
    setBackendError('');
    
    if (!validateForm()) {
      // Scroll to error summary
      const errorSummary = document.getElementById('error-summary');
      if (errorSummary) {
        errorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    
    try {
      // Create FormData object
      const formDataToSend = new FormData();

      // First, append all non-file fields
      const nonFileFields = [
        'firstName', 'lastName', 'email', 'phone', 'dateOfBirth',
        'loginId', 'password', 'course', 'session', 'gender',
        'socialSecurityNumber', 'driversLicense', 'addressLine1', 'city',
        'state', 'postalCode', 'country', 'religion', 'nationality',
        'studentPcpInfo', 'studentPcpPhone', 'emergencyContactInfo',
        'emergencyContactPhone', 'otherEmergencyContact', 'caseworkerName',
        'workforceCenter', 'taraItaCompletionDate', 'infoSessionDate',
        'registrationNumber', 'contactNumber', 'dateOfJoining',
        'coursePref1', 'daysPref1', 'locationPref1', 'coursePref2',
        'daysPref2', 'locationPref2', 'attendedInfoSession',
        'infoSessionLocation', 'additionalComments', 'signature',
        'nameCapitalization', 'status', 'semester', 'department',
        'studentNotes'
      ];

      nonFileFields.forEach(field => {
        if (formData[field] !== null && formData[field] !== undefined && formData[field] !== '') {
          formDataToSend.append(field, formData[field]);
        }
      });

      // Then, handle file uploads separately with detailed logging
      const fileFields = [
        { name: 'photo', field: formData.photo },
        { name: 'dlUpload', field: formData.dlUpload },
        { name: 'socialSecurityUpload', field: formData.socialSecurityUpload },
        { name: 'taraItaPacketUpload', field: formData.taraItaPacketUpload },
        { name: 'voucherDates', field: formData.voucherDates }
      ];

      fileFields.forEach(({ name, field }) => {
      
        if (field instanceof File) {
          console.log(`Appending file ${name}:`, {
            name: field.name,
            type: field.type,
            size: field.size,
            lastModified: field.lastModified
          });
          formDataToSend.append(name, field, field.name);
        } else {
          console.log(`No file for ${name} or not a File instance`);
        }
      });

      // Log the final FormData contents
      for (let pair of formDataToSend.entries()) {
        const value = pair[1];
        if (value instanceof File) {
          console.log(`${pair[0]}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${pair[0]}: ${value}`);
        }
      }

      // Send the request
      const response = await dispatch(addStudent(formDataToSend)).unwrap();
      
      if (response.success) {
        // Show success message
        toast.custom((t) => (
          <SuccessMessage>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
            </svg>
            Student registered successfully!
          </SuccessMessage>
        ), {
          duration: 4000,
          position: 'top-right',
        });
        handleReset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle backend error
      if (error) {
        setBackendError(error);
        // Scroll to error summary
        const errorSummary = document.getElementById('error-summary');
        if (errorSummary) {
          errorSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        setBackendError('Failed to register student. Please try again.');
      }
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      address: '',
      course: '',
      department: '',
      studentNotes: '',
      session: '',
      driversLicense: '',
      dlUpload: null,
      studentPcpInfo: '',
      studentPcpPhone: '',
      status: 'Active',
      semester: '',
      socialSecurityNumber: '',
      socialSecurityUpload: null,
      emergencyContactInfo: '',
      emergencyContactPhone: '',
      otherEmergencyContact: '',
      caseworkerName: '',
      workforceCenter: '',
      taraItaPacketUpload: null,
      taraItaCompletionDate: '',
      voucherDates: null,
      infoSessionDate: '',
      notes: '',
      registrationNumber: '',
      phone: '',
      dateOfJoining: '',
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      gender: '',
      religion: '',
      nationality: '',
      photo: null,
      coursePref1: '',
      daysPref1: '',
      locationPref1: '',
      coursePref2: '',
      daysPref2: '',
      locationPref2: '',
      attendedInfoSession: '',
      infoSessionLocation: '',
      additionalComments: '',
      signature: '',
      nameCapitalization: false,
      loginId: '',
      password: ''
    });
    setBackendError(''); // Clear backend error on reset
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          [name]: 'Please upload a valid file (JPEG, PNG, GIF, or PDF)'
        }));
        e.target.value = ''; // Clear the file input
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setFormErrors(prev => ({
          ...prev,
          [name]: 'File size should not exceed 5MB'
        }));
        e.target.value = ''; // Clear the file input
        return;
      }

      // Update form data with the file
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));

      // Clear any existing error
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }

    }
  };

  // Update getAllErrors to include backend error
  const getAllErrors = () => {
    const errors = [];
    
    // Add backend error if it exists
    if (backendError) {
      errors.push(backendError);
    }
    
    // Add form validation errors
    Object.entries(formErrors).forEach(([field, message]) => {
      if (message) {
        // Convert field name to a more readable format
        const readableField = field
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .replace(/([A-Z])/g, match => ' ' + match.toLowerCase());
        
        errors.push(`${readableField}: ${message}`);
      }
    });
    return errors;
  };

  return (
    <Container>
      <Toaster />
      <Title>Student Registration</Title>
      <Form onSubmit={handleSubmit}>
        {/* Student Registration Section */}
        <Section>
          <SectionTitle>Student Registration</SectionTitle>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label required>First Name</Label>
              <Input 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
                placeholder="Enter first name"
                error={!!formErrors.firstName}
              />
              {formErrors.firstName && <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.firstName}</span>}
            </FormGroup>
            <FormGroup>
              <Label>Registration Number</Label>
              <Input name="registrationNumber" value={formData.registrationNumber || ''} onChange={handleChange} placeholder="Enter registration number" />
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label required>Last Name</Label>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Enter last name" />
            </FormGroup>
            <FormGroup>
              <Label required>Contact Number</Label>
              <Input 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
                placeholder="(123) 456-7890"
                error={!!formErrors.phone}
                style={{ 
                  borderColor: formErrors.phone ? 'red' : '#e1e5e9',
                  borderWidth: formErrors.phone ? '2px' : '1px'
                }}
              />
              {formErrors.phone && (
                <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
                  {formErrors.phone}
                </span>
              )}
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label required>Email Address</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter email address" />
            </FormGroup>
            <FormGroup>
              <Label>Date of Joining</Label>
              <Input name="dateOfJoining" type="date" value={formData.dateOfJoining || ''} onChange={handleChange} placeholder="mm/dd/yyyy" />
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Date of Birth</Label>
              <Input name="dateOfBirth" type="date" value={formData.dateOfBirth || ''} onChange={handleChange} placeholder="mm/dd/yyyy" required />
            </FormGroup>
            <FormGroup>
              <Label>Address</Label>
              <Input name="addressLine1" value={formData.addressLine1 || ''} onChange={handleChange} placeholder="Address Line 1" />
              <Input name="city" value={formData.city || ''} onChange={handleChange} placeholder="City/District" style={{ marginTop: 8 }} />
              <Select name="state" value={formData.state || ''} onChange={handleChange} style={{ marginTop: 8 }}>
                <option value="">- Select State/Province -</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
                {/* Add more states as needed */}
              </Select>
              <Input name="postalCode" value={formData.postalCode || ''} onChange={handleChange} placeholder="Postal Code" style={{ marginTop: 8 }} />
              <Input name="country" value={formData.country || ''} onChange={handleChange} placeholder="Country" style={{ marginTop: 8 }} />
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Gender</Label>
              <div style={{ display: 'flex', gap: 16 }}>
                <label><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male</label>
                <label><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female</label>
                <label><input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} /> Other</label>
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Photo</Label>
              <FileInput 
                name="photo" 
                type="file" 
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,application/pdf"
              />
              {formErrors.photo && (
                <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.photo}</span>
              )}
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Religion</Label>
              <Input name="religion" value={formData.religion || ''} onChange={handleChange} placeholder="Enter religion" />
            </FormGroup>
            <FormGroup>
              <Label>Nationality</Label>
              <Input name="nationality" value={formData.nationality || ''} onChange={handleChange} placeholder="Enter nationality" />
            </FormGroup>
          </FormRow>
        </Section>

        {/* Other Details Section */}
        <Section>
          <SectionTitle>Other Details</SectionTitle>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Course</Label>
              <CourseSelect
                value={formData.course}
                onChange={(value) => setFormData(prev => ({ ...prev, course: value }))}
                placeholder="Select course"
                isClearable={false}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Department</Label>
              <DepartmentSelect
                value={formData.department}
                onChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                placeholder="Select department"
                isClearable={false}
                required
              />
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Student Notes</Label>
              <Input name="studentNotes" value={formData.studentNotes || ''} onChange={handleChange} placeholder="Add student notes... (Optional)" />
            </FormGroup>
            <FormGroup>
              <Label>Semester</Label>
              <SemesterSelect
                value={formData.semester}
                onChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}
                placeholder="Select semester"
                isClearable={false}
                required
              />
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Session</Label>
              <SessionSelect
                value={formData.session}
                onChange={(value) => setFormData(prev => ({ ...prev, session: value }))}
                placeholder="Select session"
                isClearable={false}
              />
              {formErrors.session && <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.session}</span>}
            </FormGroup>
            <FormGroup>
              <Label>Social Security Number</Label>
              <Input 
                name="socialSecurityNumber" 
                value={formData.socialSecurityNumber} 
                onChange={handleChange} 
                required 
                placeholder="123-45-6789"
                error={!!formErrors.socialSecurityNumber}
              />
              {formErrors.socialSecurityNumber && <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.socialSecurityNumber}</span>}
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Driver's Licence or State ID Number</Label>
              <Input name="driversLicense" value={formData.driversLicense || ''} onChange={handleChange} placeholder="Enter DL or State ID" required />
            </FormGroup>
            <FormGroup>
              <Label>Social Security Card Upload</Label>
              <FileInput 
                name="socialSecurityUpload" 
                type="file" 
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,application/pdf"
              />
              {formErrors.socialSecurityUpload && (
                <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.socialSecurityUpload}</span>
              )}
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Student PCP INFO (Name, Address)</Label>
              <TextArea name="studentPcpInfo" value={formData.studentPcpInfo || ''} onChange={handleChange} placeholder="Enter PCP Name and Address" />
            </FormGroup>
            <FormGroup>
              <Label>DL or State ID Upload</Label>
              <FileInput 
                name="dlUpload" 
                type="file" 
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,application/pdf"
              />
              {formErrors.dlUpload && (
                <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.dlUpload}</span>
              )}
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Student PCP Phone Number</Label>
              <Input name="studentPcpPhone" value={formData.studentPcpPhone || ''} onChange={handleChange} placeholder="(123) 555-6789" />
            </FormGroup>
            <FormGroup>
              <Label>Emergency Contact Info (Name, Address)</Label>
              <TextArea name="emergencyContactInfo" value={formData.emergencyContactInfo || ''} onChange={handleChange} placeholder="Name, Address" />
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Status</Label>
              <div style={{ display: 'flex', gap: 16 }}>
                <label><input type="radio" name="status" value="Active" checked={formData.status === 'Active'} onChange={handleChange} /> Active</label>
                <label><input type="radio" name="status" value="Inactive" checked={formData.status === 'Inactive'} onChange={handleChange} /> Inactive</label>
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Emergency Contact Phone</Label>
              <Input name="emergencyContactPhone" value={formData.emergencyContactPhone || ''} onChange={handleChange} placeholder="(123) 555-6789" />
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Other Emergency Contact Optional</Label>
              <Input name="otherEmergencyContact" value={formData.otherEmergencyContact || ''} onChange={handleChange} placeholder="Optional contact info" />
            </FormGroup>
          </FormRow>
        </Section>

        {/* Course Preference - 1st Choice */}
        <Section>
          <SectionTitle>Course Preference - 1st Choice</SectionTitle>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <FormGroup>
              <Label>Course you are interested in:</Label>
              <CourseSelect
                value={formData.coursePref1}
                onChange={(value) => setFormData(prev => ({ ...prev, coursePref1: value }))}
                placeholder="Select course"
                isClearable={true}
              />
            </FormGroup>
            <FormGroup>
              <Label>Days Preferred:</Label>
              <Select name="daysPref1" value={formData.daysPref1 || ''} onChange={handleChange}>
                <option value="">- Select Days -</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>

              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Location Preference:</Label>
              <Select name="locationPref1" value={formData.locationPref1 || ''} onChange={handleChange}>
                <option value="">- Select Location -</option>
                <option value="Online">Online</option>
                <option value="In-Person - Downtown">In-Person - Downtown</option>
                <option value="In-Person - North Campus">In-Person - North Campus</option>
              </Select>
            </FormGroup>
          </FormRow>
        </Section>

        {/* Course Preference - 2nd Choice */}
        <Section>
          <SectionTitle>Course Preference - 2nd Choice</SectionTitle>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <FormGroup>
              <Label>Course you are interested in:</Label>
              <CourseSelect
                value={formData.coursePref2}
                onChange={(value) => setFormData(prev => ({ ...prev, coursePref2: value }))}
                placeholder="Select course"
                isClearable={true}
              />
            </FormGroup>
            <FormGroup>
              <Label>Days Preferred:</Label>
              <Select name="daysPref2" value={formData.daysPref2 || ''} onChange={handleChange}>
                <option value="">- Select Days -</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="evenings">Evenings</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Location Preference:</Label>
              <Select name="locationPref2" value={formData.locationPref2 || ''} onChange={handleChange}>
                <option value="">- Select Location -</option>
                <option value="Online">Online</option>
                <option value="In-Person - Downtown">In-Person - Downtown</option>
                <option value="In-Person - North Campus">In-Person - North Campus</option>
              </Select>
            </FormGroup>
          </FormRow>
        </Section>

        {/* Information Session Details */}
        <Section>
          <SectionTitle>Information Session Details</SectionTitle>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>

              <Label>Have you attended an information session?</Label>
              <div style={{ display: 'flex', gap: 16 }}>
              <label><input type="radio" name="attendedInfoSession" value={true} checked={formData.attendedInfoSession === true} onChange={(e) => setFormData({ ...formData, attendedInfoSession: true })} /> Yes</label>
              <label><input type="radio" name="attendedInfoSession" value={false} checked={formData.attendedInfoSession === false} onChange={(e) => setFormData({ ...formData, attendedInfoSession: false })} /> No</label>
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Where did you fill out this information?</Label>
              <Select name="infoSessionLocation" value={formData.infoSessionLocation || ''} onChange={handleChange}>
                <option value="">- Select -</option>
                <option value="office">In Office</option>
                <option value="online">On Website</option>
              </Select>
            </FormGroup>
          </FormRow>
          <FormGroup>
            <Label>Additional Comments:</Label>
            <TextArea name="additionalComments" value={formData.additionalComments || ''} onChange={handleChange} placeholder="Enter any additional comments here..." />
          </FormGroup>
          <FormGroup>
            <Label>Student Signature:</Label>
            <SignaturePad />
          </FormGroup>

          <FormGroup style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" name="nameCapitalization" checked={formData.nameCapitalization || false} onChange={e => setFormData({ ...formData, nameCapitalization: e.target.checked })} />
              I have adhered to the above Name Capitalization instructions
            </label>
          </FormGroup>
        </Section>

        {/* Workforce Information */}
        <Section>
          <SectionTitle>Workforce Information</SectionTitle>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Caseworker's Name</Label>
              <Input name="caseworkerName" value={formData.caseworkerName || ''} onChange={handleChange} placeholder="Enter caseworker name" />
            </FormGroup>
            <FormGroup>
              <Label>Workforce Center</Label>
              <Input name="workforceCenter" value={formData.workforceCenter || ''} onChange={handleChange} placeholder="Enter workforce center" />
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Tara/ITA Packet Upload</Label>
              <FileInput 
                name="taraItaPacketUpload" 
                type="file" 
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,application/pdf"
              />
              {formErrors.taraItaPacketUpload && (
                <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.taraItaPacketUpload}</span>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Tara/ITA Packet Date of Completion</Label>
              <Input name="taraItaCompletionDate" type="date" value={formData.taraItaCompletionDate || ''} onChange={handleChange} placeholder="mm/dd/yyyy" />
            </FormGroup>
          </FormRow>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label>Voucher Dates</Label>
              <FileInput 
                name="voucherDates" 
                type="file" 
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,application/pdf"
              />
              {formErrors.voucherDates && (
                <span style={{ color: 'red', fontSize: '0.8rem' }}>{formErrors.voucherDates}</span>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Info Session Date</Label>
              <Input name="infoSessionDate" type="date" value={formData.infoSessionDate || ''} onChange={handleChange} placeholder="mm/dd/yyyy" />
            </FormGroup>
          </FormRow>
        </Section>

        {/* Student Portal Signup */}
        <Section>
          <SectionTitle>Student Portal Signup</SectionTitle>
          <FormRow style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormGroup>
              <Label required>Login ID</Label>
              <Input 
                name="loginId" 
                value={formData.loginId} 
                onChange={handleChange} 
                required 
                placeholder="Enter login ID (min. 8 characters)"
                error={!!formErrors.loginId}
                style={{ 
                  borderColor: formErrors.loginId ? 'red' : '#e1e5e9',
                  borderWidth: formErrors.loginId ? '2px' : '1px'
                }}
              />
              {formErrors.loginId && (
                <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>
                  {formErrors.loginId}
                </span>
              )}
              <span style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                Use only letters and numbers, minimum 8 characters
              </span>
            </FormGroup>
            <FormGroup>
              <Label>Password</Label>
              <Input name="password" type="password" value={formData.password || ''} onChange={handleChange} placeholder="Enter password" required />
            </FormGroup>
          </FormRow>
        </Section>

        {/* Update error summary to show when there are either form errors or backend error */}
        {(Object.keys(formErrors).length > 0 || backendError) && (
          <ErrorSummary id="error-summary">
            <ErrorTitle>
              {backendError ? 'Registration Error:' : 'Please fill in the following fields:'}
            </ErrorTitle>
            <ErrorList>
              {getAllErrors().map((error, index) => (
                <ErrorItem key={index}>{error}</ErrorItem>
              ))}
            </ErrorList>
          </ErrorSummary>
        )}

        <ButtonGroup>
          <SecondaryButton type="button" onClick={handleReset}>Reset</SecondaryButton>
          <PrimaryButton type="submit">Register Student</PrimaryButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default AddStudent; 