import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChartLine,
  FaFileAlt,
  FaUsersCog,
  FaClipboardList,
  FaChevronDown,
  FaChevronRight,
  FaBook,
  FaCalendarAlt,
  FaFileSignature,
  FaUserCircle,
  FaEdit,
  FaBell,
  FaHome,
  FaChartBar,
  FaCalendarCheck,
  FaHistory
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { IoSettingsSharp } from "react-icons/io5";

const SidebarContainer = styled.div`
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #555 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
  }
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #34495e;
  text-align: center;
  cursor: pointer;
`;

const Logo = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #3498db
`;

const Subtitle = styled.p`
  margin: 5px 0 0 0;
  font-size: 0.8rem;
  color: #bdc3c7;
`;

const Nav = styled.nav`
  padding: 20px 0;
`;

const NavItem = styled.div`
  margin-bottom: 5px;
`;

const NavLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  color: ${props => props.active ? '#3498db' : '#ecf0f1'};
  background: ${props => props.active ? 'rgba(52, 152, 219, 0.1)' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: ${props => props.active ? '4px solid #3498db' : '4px solid transparent'};

  &:hover {
    background: rgba(52, 152, 219, 0.1);
    color: #3498db
  }
`;

const NavLinkContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavIcon = styled.div`
  font-size: 1.1rem;
  width: 20px;
  display: flex;
  justify-content: center;
`;

const NavText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
`;

const ChevronIcon = styled.div`
  font-size: 0.8rem;
  transition: transform 0.3s ease;
  transform: ${props => props.expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const SubMenu = styled.div`
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: max-height 0.3s ease;
  max-height: ${props => props.expanded ? '500px' : '0'};
`;

const SubNavItem = styled.div`
  padding: 8px 20px 8px 60px;
  color: ${props => props.active ? '#3498db' : '#bdc3c7'};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border-left: ${props => props.active ? '4px solid #3498db' : '4px solid transparent'};

  &:hover {
    color: #3498db;
    background: rgba(52, 152, 219, 0.1);
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <FaHome />,
      path: '/dashboard'
    },

    {
      id: 'students',
      label: 'Students',
      icon: <FaUserGraduate />,
      subItems: [
        { id: 'add-student', label: 'Add Student', path: '/students/add' },
        { id: 'student-list', label: 'Student List', path: '/students/list' },
        ...(isAdmin ? [
                  { id: 'assign-session', label: 'Assign Session', path: '/students/assign-session' },
        { id: 'previous-course', label: 'Previous Course', path: '/students/previous-course' },
        { id: 'vouchers', label: 'Vouchers', path: '/students/vouchers' }
        ] : [])
      ]
    },
    {
      id: 'sessions-courses',
      label: 'Sessions / Courses',
      icon: <FaBook />,
      subItems: [
        { id: 'sessions', label: 'Sessions', path: '/sessions' },
        { id: 'courses', label: 'Courses', path: '/courses' }
      ]
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: <FaFileAlt />,
      path: '/applications/all-applied-candidates',
      
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <FaBell />,
      subItems: [
        { id: 'send-announcement', label: 'Send Announcement', path: '/notifications/send-announcement' },
        { id: 'announcements-list', label: 'Announcements List', path: '/notifications/announcements-list' },
        { id: 'send-sms', label: 'Send SMS', path: '/notifications/send-sms' },
        { id: 'all-sms', label: 'All SMS', path: '/notifications/all-sms' },
        { id: 'sms-chat', label: 'SMS Chat', path: '/notifications/sms-chat' },
      ]
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <FaCalendarCheck />,
      subItems: [
        // { id: 'add-attendance', label: 'Add Attendance', path: '/attendance/add' },
        { id: 'attendance-report', label: 'Attendance Dashboard', path: 'https://office.ngteco.com/dashboard', external: true },
        { id: 'monthly-attendance', label: 'Monthly Attendance', path: '/attendance/monthly' }
      ]
    },
    (isAdmin && {
      id: 'staff',
      label: 'Staff Management',
      icon: <FaUsersCog />,
      subItems: [
        { id: 'add-employee', label: 'Add Employee', path: '/instructors/add' },
        { id: 'all-staff', label: 'All Staff Members', path: '/staff/all' },
        { id: 'all-instructors', label: 'All Instructors', path: '/instructors/all' }
      ]
    }),
    (isAdmin &&
    {
      id: 'profile',
      label: 'Settings',
      icon: <IoSettingsSharp />,
      subItems: [
        { id: 'academic-year', label: 'Academic Year', path: '/profile/academic-year' },
        { id: 'departments', label: 'Departments', path: '/profile/departments' },
        { id: 'semesters', label: 'Semesters', path: '/profile/semesters' },
        { id: 'designations', label: 'Designations', path: '/profile/designations' },
        { id: 'locations', label: 'Locations', path: '/profile/locations' },
        { id: 'days-preferred', label: 'Days Preferred', path: '/profile/days-preferred' },
        { id: 'individuals', label: 'Individuals', path: '/profile/individuals' },
        { id: 'workforces', label: 'Workforces', path: '/profile/workforces' },
        { id: 'master-data', label: 'Master Data', path: '/profile/master-data' }
      ]
    }),
  ];

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleNavigation = (path, external = false) => {
    if (external) {
      window.open(path, '_blank', 'noopener,noreferrer');
    } else {
      navigate(path);
    }
  };

  const isPathActive = (path) => {
    return location.pathname === path;
  };

  const isMenuActive = (item) => {
    if (item.path && !item.external) {
      return isPathActive(item.path);
    }
    return item.subItems?.some(subItem => !subItem.external && isPathActive(subItem.path));
  };

  return (
    <SidebarContainer>
      <Header onClick={() => handleNavigation('/dashboard')}>
        <Logo>CCLC</Logo>
        <Subtitle>Admin Panel</Subtitle>
      </Header>

      <Nav>
        {menuItems.map(item => (
          <NavItem key={item.id}>
            <NavLink
              active={isMenuActive(item)}
              onClick={() => {
                if (item.subItems) {
                  toggleMenu(item.id);
                } else {
                  handleNavigation(item.path, item.external);
                }
              }}
            >
              <NavLinkContent>
                <NavIcon>{item.icon}</NavIcon>
                <NavText>{item.label}</NavText>
              </NavLinkContent>
              {item.subItems && (
                <ChevronIcon expanded={expandedMenus[item.id]}>
                  <FaChevronDown />
                </ChevronIcon>
              )}
            </NavLink>

            {item.subItems && (
              <SubMenu expanded={expandedMenus[item.id]}>
                {item.subItems.map(subItem => (
                  <SubNavItem
                    key={subItem.id}
                    active={!subItem.external && isPathActive(subItem.path)}
                    onClick={() => handleNavigation(subItem.path, subItem.external)}
                  >
                    {subItem.label}
                  </SubNavItem>
                ))}
              </SubMenu>
            )}
          </NavItem>
        ))}
      </Nav>
    </SidebarContainer>
  );
};

export default Sidebar;