import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserPlus, FaTimes, FaUpload } from 'react-icons/fa';
import { showSuccess, showError } from '../../components/CustomAlert';

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
  max-width: 500px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
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

const EmailInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const EmailInput = styled(Input)`
  padding-right: 40px;
`;

const EmailIcon = styled.div`
  position: absolute;
  right: 12px;
  color: #6c757d;
  font-size: 16px;
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
    background:rgb(18, 107, 167);
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

const AddStaff = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch('/api/staff/add', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        showSuccess('Staff member added successfully!');
        setFormData({
          name: '',
          phone: '',
          email: ''
        });
      } else {
        showError(result.message || 'Failed to add staff member');
      }
    } catch (error) {
      showError('Error adding staff member');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      phone: '',
      email: ''
    });
  };

  return (
    <Container>
      <Title>Add Staff</Title>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label required>Name</Label>
            <Input 
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone</Label>
            <PhoneInputContainer>
              <CountryCode>🇺🇸 +1</CountryCode>
              <PhoneInput 
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="222 555 7777"
              />
            </PhoneInputContainer>
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <EmailInputContainer>
              <EmailInput 
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
              
            </EmailInputContainer>
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

export default AddStaff; 