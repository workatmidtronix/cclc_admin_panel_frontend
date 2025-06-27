import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { logout } from '../store/slices/authSlice';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 280px;
  background: #f8f9fa;
`;

const TopBar = styled.div`
  background: white;
  padding: 15px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #2c3e50;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgb(51, 66, 147);;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #2c3e50;
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: background 0.3s ease;

  &:hover {
    background: #c0392b;
  }
`;

const ContentArea = styled.div`
  min-height: calc(100vh - 70px);
`;

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent>
        <TopBar>
          <div></div>
          <UserSection>
            <UserInfo>
              <UserAvatar>
                <FaUser />
              </UserAvatar>
              <UserName>{user?.firstName} {user?.lastName}</UserName>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </LogoutButton>
          </UserSection>
        </TopBar>
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 