import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { loginUser, clearError } from '../store/slices/authSlice';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(51, 66, 147);;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
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

  &::placeholder {
    color: #aaa;
  }
`;

const Button = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #fcc;
  text-align: center;
  margin-bottom: 1rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CredentialsInfo = styled.div`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  font-size: 0.85rem;
`;

const CredentialsTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 0.9rem;
`;

const CredentialsList = styled.ul`
  margin: 0;
  padding-left: 15px;
  color: #6c757d;
`;

const CredentialItem = styled.li`
  margin-bottom: 5px;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: rgb(51, 66, 147);
  }
`;

const QuickFillButton = styled.button`
  background: none;
  border: none;
  color: rgb(51, 66, 147);
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0;
  margin-left: 5px;
  
  &:hover {
    color: rgb(45, 58, 130);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  background-color: white;
  width: 100%;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
  }
`;

const Login = () => {
  const [loginID, setLoginID] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);



  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ loginID, password, role }));
  };


  return (
    <LoginContainer>
      <LoginCard>
        <Title>CCLC Admin</Title>
        <Subtitle>Chicago Community Learning Center</Subtitle>
        
        {/* <CredentialsInfo>
          <CredentialsTitle>Test Credentials (Frontend Only):</CredentialsTitle>
          <CredentialsList>
            {testCredentials.map((cred, index) => (
              <CredentialItem key={index}>
                <strong>{cred.loginID}</strong> / {cred.password} ({cred.role})
                <QuickFillButton onClick={() => quickFill(cred)}>
                  Quick Fill
                </QuickFillButton>
              </CredentialItem>
            ))}
          </CredentialsList>
        </CredentialsInfo> */}
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="role">Role</Label>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="admin">Administrator</option>
              <option value="staff">Staff Member</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="loginID">Login ID</Label>
            <Input
              type="text"
              id="loginID"
              value={loginID}
              onChange={(e) => setLoginID(e.target.value)}
              placeholder="Enter your login ID"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Sign In'}
          </Button>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 