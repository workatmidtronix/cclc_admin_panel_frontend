import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaCalendarAlt, FaUserPlus, FaUserFriends, FaEnvelope, FaSync, FaTimes, FaUsers, FaChalkboard, FaFileUpload, FaCalendar, FaUpload, FaHistory, FaGraduationCap, FaChartLine, FaPlus, FaSearch, FaList, FaEllipsisV, FaFileAlt, FaDownload, FaEdit, FaTrash, FaEye, FaBell, FaSms, FaClock, FaMapMarkerAlt, FaUserTie, FaClipboardList, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { fetchDashboardStats, fetchRecentActivities, fetchDashboardData } from '../store/slices/dashboardSlice';
import { useNavigate } from 'react-router-dom';
import Calendar from '../components/Calendar';
import { useMasterData } from '../hooks/useMasterData';
import { SessionSelect } from '../components/MasterDataSelect';
import { CourseSelect } from '../components/MasterDataSelect';
const DashboardContainer = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  background: rgb(51, 66, 147);;
  color: white;
  padding: 20px 30px;
  margin: -30px -30px 30px -30px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.color || 'rgb(51, 66, 147);'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ActionsSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const ActionCard = styled.div`
  background: linear-gradient(135deg, ${props => props.gradient || 'rgb(51, 66, 147);, #2980b9'});
  color: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 15px;
`;

const ActionTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ActionSubtitle = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const CalendarSection = styled.div`
  margin-bottom: 30px;
`;

const RecentActivitiesSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f1f3f4;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'student_enrollment': return '#3498db';
      case 'course_creation': return '#2ecc71';
      case 'grade_update': return '#f39c12';
      case 'session_scheduled': return '#9b59b6';
      case 'instructor_assignment': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityMessage = styled.div`
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 5px;
`;

const ActivityMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #7f8c8d;
`;

const ActivityTime = styled.span`
  color: #95a5a6;
`;

const ActivityUser = styled.span`
  color: #3498db;
  font-weight: 500;
`;

const ActionButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: rgb(40, 53, 120);
    transform: translateY(-1px);
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: ${props => props.maxWidth || '600px'};
  max-height: 90vh;
`;

const ModalHeader = styled.div`
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 15px 15px 0 0;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    background: #e9ecef;
    color: #2c3e50;
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  &:after {
    content: ${props => props.required ? '" *"' : '""'};
    color: #dc3545;
  }
`;

const FormInput = styled.input`
  width: 94%;
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(51, 66, 147, 0.1);
  }
`;

const FormSelect = styled.select`
  width: 100%;
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

const FormTextArea = styled.textarea`
  width: 94%;
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(51, 66, 147, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const CheckboxInput = styled.input`
  margin-right: 8px;
`;

const PhoneInputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CountryCode = styled.select`
  padding: 12px;
  border: 1px solid #e9ecef;
  border-right: none;
  border-radius: 8px 0 0 8px;
  background: white;
  font-size: 0.9rem;
`;

const PhoneInput = styled.input`
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 0 8px 8px 0;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
    box-shadow: 0 0 0 3px rgba(51, 66, 147, 0.1);
  }
`;

const FileUploadButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6c757d;
  margin-left: 10px;
  
  &:hover {
    background: #e9ecef;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
`;

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgb(45, 58, 130);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(51, 66, 147, 0.3);
  }
`;

const ResetButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
`;

const EmptyMessage = styled.p`
  font-size: 1.1rem;
  margin-bottom: 20px;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: rgb(51, 66, 147);
  border: 1px solid rgb(51, 66, 147);
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgb(51, 66, 147);
    color: white;
  }
`;

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, recentActivities, isLoading, error } = useSelector(state => state.dashboard);
  const navigate = useNavigate();
  const [currentModal, setCurrentModal] = useState(null);
  const [formData, setFormData] = useState({});
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';
  const [showAddMasterModal, setShowAddMasterModal] = useState(false);
  const [showImportMasterModal, setShowImportMasterModal] = useState(false);
  const counterValue = useSelector((state) => console.log(state));
  const { sessions } = useMasterData();

console.log(user);
  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivities());

  }, [dispatch]);

  // Helper function to get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'student_enrollment':
        return <FaUserGraduate />;
      case 'course_creation':
        return <FaBook />;
      case 'grade_update':
        return <FaChalkboardTeacher />;
      case 'session_scheduled':
        return <FaCalendarAlt />;
      case 'instructor_assignment':
        return <FaChalkboardTeacher />;
      default:
        return <FaHistory />;
    }
  };

  // Helper function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const actionItems = [
    {
      icon: <FaUserPlus />,
      title: 'Add Student',
      subtitle: 'Enroll new student',
      gradient: 'darkslateblue, darkslateblue',
      path: '/students/add'
    },
    {
      icon: <FaUserFriends />,
      title: 'Add Employee',
      subtitle: 'Add new employee',
      gradient: '#e74c3c, #c0392b',
      path: '/instructors/add'
    },

    {
      icon: <FaEnvelope />,
      title: 'Send Announcement',
      subtitle: 'Notify students/staff',
      gradient: '#f39c12, #e67e22',
      modal: 'announcement'
    },
    ...(isAdmin ? [
      {
        icon: <FaSync />,
        title: 'Master Schedule',
        subtitle: 'Manage schedules',
        gradient: '#2ecc71, #27ae60',
        modal: 'schedule'
      },
      {
        icon: <FaChalkboard />,
        title: 'Master Syllabus',
        subtitle: 'Manage syllabus',
        gradient: '#34495e, #2c3e50',
        modal: 'syllabus'
      }
    ] : [])
  ];
  const handleActionClick = (item) => {
    if (item.modal) {
      setCurrentModal(item.modal);
      setFormData({});
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const closeModal = () => {
    setCurrentModal(null);
    setFormData({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
  };

  const handleAddMasterClick = () => {
    setShowAddMasterModal(true);
  };
  const handleImportMasterClick = () => {
    setShowImportMasterModal(true);
  };
  const closeAddMasterModal = () => setShowAddMasterModal(false);
  const closeImportMasterModal = () => setShowImportMasterModal(false);

  return (
    <DashboardContainer>
      <Header>
        <Title>Chicago Community Learning Center</Title>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon color="rgb(51, 66, 147);">
            <FaUserGraduate />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.totalStudents}</StatNumber>
            <StatLabel>Total Students</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#e74c3c">
            <FaChalkboardTeacher />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.totalInstructors}</StatNumber>
            <StatLabel>Total Instructors</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#f39c12">
            <FaBook />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.totalCourses}</StatNumber>
            <StatLabel>Total Courses</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#2ecc71">
            <FaCalendarAlt />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.totalSessions}</StatNumber>
            <StatLabel>Total Sessions</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#9b59b6">
            <FaUsers />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.totalEnrollments}</StatNumber>
            <StatLabel>Total Enrollments</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color="#e67e22">
            <FaFileUpload />
          </StatIcon>
          <StatContent>
            <StatNumber>{stats.pendingApplications}</StatNumber>
            <StatLabel>Pending Applications</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ActionsSection>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionsGrid>
          {actionItems.map((item, index) => (
            <ActionCard key={index} gradient={item.gradient} onClick={() => handleActionClick(item)}>
              <ActionIcon>{item.icon}</ActionIcon>
              <ActionTitle>{item.title}</ActionTitle>
              <ActionSubtitle>{item.subtitle}</ActionSubtitle>
            </ActionCard>
          ))}
        </ActionsGrid>
      </ActionsSection>

      <CalendarSection>
        <Calendar />
      </CalendarSection>

      {/* <RecentActivitiesSection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <SectionTitle>Recent Activities</SectionTitle>
          <ActionButton onClick={() => navigate('/recent-activities')}>
            View All Activities
          </ActionButton>
        </div>
        {recentActivities.slice(0, 5).map((activity, index) => (
          <ActivityItem key={index}>
            <ActivityIcon type={activity.type}>
              {getActivityIcon(activity.type)}
            </ActivityIcon>
            <ActivityContent>
              <ActivityMessage>{activity.message}</ActivityMessage>
              <ActivityMeta>
                <ActivityTime>{formatTimestamp(activity.timestamp)}</ActivityTime>
                {activity.user && <ActivityUser>{activity.user}</ActivityUser>}
              </ActivityMeta>
            </ActivityContent>
          </ActivityItem>
        ))}
        {recentActivities.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
            <div>No recent activities</div>
            <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>Activities will appear here as they occur</div>
          </div>
        )}
      </RecentActivitiesSection> */}

      {/* Send Announcement Modal */}
      {currentModal === 'announcement' && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()} maxWidth="500px">
            <ModalHeader>
              <ModalTitle>Send Announcement</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <p style={{ color: '#dc3545', marginBottom: '20px', fontSize: '0.9rem' }}>
                Send announcements to students through mail
              </p>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <FormLabel required>Course</FormLabel>

                  <CourseSelect
                    value={formData.course}
                    onChange={(value) => setFormData(prev => ({ ...prev, course: value }))}
                    placeholder="Select course"
                    isClearable={false}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel required>Session</FormLabel>
                  <SessionSelect
                    value={formData.session}
                    onChange={(value) => handleInputChange('session', value)}
                    placeholder="Select session"
                    isClearable={false}
                  />
                </FormGroup>

                <CheckboxGroup>
                  <CheckboxInput
                    type="checkbox"
                    name="selectAll"
                    checked={formData.selectAll || false}
                    onChange={(e) => handleInputChange('selectAll', e.target.checked)}
                  />
                  <FormLabel>Select all students</FormLabel>
                </CheckboxGroup>

                <FormGroup>
                  <FormLabel required>Students</FormLabel>
                  <FormSelect name="students" value={formData.students || ''} onChange={(e) => handleInputChange('students', e.target.value)} required disabled={formData.selectAll}>
                    <option value="">-Select-</option>
                    <option value="Fredericka Smith-Turner">Fredericka Smith-Turner</option>
                    <option value="Alana Thurman">Alana Thurman</option>
                  </FormSelect>
                </FormGroup>

                <FormGroup>
                  <FormLabel required>Date</FormLabel>
                  <FormInput
                    type="date"
                    name="date"
                    value={formData.date || '2023-06-11'}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel required>Subject</FormLabel>
                  <FormInput
                    type="text"
                    name="subject"
                    value={formData.subject || ''}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel required>Message</FormLabel>
                  <FormTextArea
                    name="message"
                    value={formData.message || ''}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Document - 1</FormLabel>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FormInput
                      type="text"
                      name="document1"
                      value={formData.document1 || ''}
                      onChange={(e) => handleInputChange('document1', e.target.value)}
                      placeholder="Select File"
                      readOnly
                    />
                    <FileUploadButton type="button">+</FileUploadButton>
                  </div>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Document - 2</FormLabel>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FormInput
                      type="text"
                      name="document2"
                      value={formData.document2 || ''}
                      onChange={(e) => handleInputChange('document2', e.target.value)}
                      placeholder="Select File"
                      readOnly
                    />
                    <FileUploadButton type="button">+</FileUploadButton>
                  </div>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Document - 3</FormLabel>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FormInput
                      type="text"
                      name="document3"
                      value={formData.document3 || ''}
                      onChange={(e) => handleInputChange('document3', e.target.value)}
                      placeholder="Select File"
                      readOnly
                    />
                    <FileUploadButton type="button">+</FileUploadButton>
                  </div>
                </FormGroup>

                <FormGroup>
                  <FormLabel required>Send</FormLabel>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <CheckboxGroup>
                      <CheckboxInput
                        type="checkbox"
                        name="sendMail"
                        checked={formData.sendMail || true}
                        onChange={(e) => handleInputChange('sendMail', e.target.checked)}
                      />
                      <span>Mail</span>
                    </CheckboxGroup>
                    <CheckboxGroup>
                      <CheckboxInput
                        type="checkbox"
                        name="sendSMS"
                        checked={formData.sendSMS || false}
                        onChange={(e) => handleInputChange('sendSMS', e.target.checked)}
                      />
                      <span>SMS</span>
                    </CheckboxGroup>
                  </div>
                </FormGroup>

                <ButtonGroup>
                  <ResetButton type="button" onClick={() => setFormData({})}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit">
                    Send
                  </SubmitButton>
                </ButtonGroup>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Master Schedule/Syllabus Modal */}
      {(currentModal === 'schedule' || currentModal === 'syllabus') && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()} maxWidth="600px">
            <ModalHeader>
              <ModalTitle>
                {currentModal === 'schedule' ? 'All Master Schedules' : 'All Master Syllabuses'}
              </ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <EmptyState>
                <EmptyMessage>You haven't added any records yet!</EmptyMessage>
                <ActionButtonsContainer>
                  <SubmitButton onClick={handleAddMasterClick}>
                    Add a Record
                  </SubmitButton>
                  <SecondaryButton onClick={handleImportMasterClick}>
                    Import Data
                  </SecondaryButton>
                </ActionButtonsContainer>
              </EmptyState>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Add Staff Modal */}
      {currentModal === 'staff' && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()} maxWidth="450px">
            <ModalHeader>
              <ModalTitle>Add Staff</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <FormLabel required>Name</FormLabel>
                  <FormInput
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel>Phone</FormLabel>
                  <PhoneInputContainer>
                    <CountryCode name="countryCode" value={formData.countryCode || '+1'} onChange={(e) => handleInputChange('countryCode', e.target.value)}>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                    </CountryCode>
                    <PhoneInput
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="000-000-0000"
                    />
                  </PhoneInputContainer>
                </FormGroup>

                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <FormInput
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </FormGroup>

                <ButtonGroup>
                  <ResetButton type="button" onClick={() => setFormData({})}>
                    Reset
                  </ResetButton>
                  <SubmitButton type="submit">
                    Submit
                  </SubmitButton>
                </ButtonGroup>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Add Master Schedule Modal */}
      {showAddMasterModal && (
        <ModalOverlay onClick={closeAddMasterModal}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <ModalHeader>
              <ModalTitle>Add Master Schedule</ModalTitle>
              <CloseButton onClick={closeAddMasterModal}><FaTimes /></CloseButton>
            </ModalHeader>
            <ModalBody>
              <form>
                <FormGroup>
                  <FormLabel required>Course</FormLabel>
                  <FormSelect required>
                    <option value="">-Select-</option>
                    <option>EKG</option>
                    <option>CNA</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel required>Session</FormLabel>
                  <FormSelect required>
                    <option value="">-Select-</option>
                    <option>Morning</option>
                    <option>Evening</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel required>Title</FormLabel>
                  <FormInput required />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Description</FormLabel>
                  <textarea style={{
                    width: "94%",
                    padding: "12px 15px",
                    border: "1px solid #e9ecef",
                    borderRadius: 8,
                    fontSize: "0.9rem",
                    transition: "all 0.2s ease"
                  }} />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Document</FormLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FormInput placeholder="Select a file" style={{ flex: 1, borderColor: '#e9ecef' }} type='file' />
                    <button type="button" style={{ border: "1px solid #e9ecef", background: '#fff', borderRadius: 4, padding: '6px 10px', cursor: 'pointer' }}>
                      <FaUpload color="rgb(51, 66, 147)" />
                    </button>
                  </div>
                </FormGroup>
                <ButtonGroup>
                  <SubmitButton type="submit" style={{ background: 'rgb(51, 66, 147)' }}>Submit</SubmitButton>
                  {/* <ResetButton type="button">Reset</ResetButton> */}
                </ButtonGroup>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Import Master Schedule Modal */}
      {showImportMasterModal && (
        <ModalOverlay onClick={closeImportMasterModal}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <ModalHeader>
              <ModalTitle>Import Data for "Add Master Schedule" [Step 1 of 3]</ModalTitle>
              <CloseButton onClick={closeImportMasterModal}><FaTimes /></CloseButton>
            </ModalHeader>
            <ModalBody>
              <form>
                <FormGroup>
                  <FormLabel>File Type</FormLabel>
                  <FormSelect>
                    <option>Excel</option>
                    <option>CSV</option>
                    <option>Text</option>
                  </FormSelect>
                </FormGroup>
                {/* <FormGroup>
                  <FormLabel>Data Location</FormLabel>
                  <div style={{ display: 'flex', gap: 18, marginTop: 4 }}>
                    <label><input type="radio" name="location" defaultChecked /> Local Drive</label>
                    <label><input type="radio" name="location" /> Paste Data</label>
                    <label><input type="radio" name="location" /> Desktop Uploader</label>
                  </div>
                </FormGroup> */}
                <FormGroup>
                  <FormLabel>Choose the file to Upload</FormLabel>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FormInput placeholder="Browse" style={{ flex: 1 }} type='file' />
                    <button type="button" style={{ border: '1px solid rgb(51, 66, 147)', background: '#fff', borderRadius: 4, padding: '6px 10px', cursor: 'pointer' }}>
                      <FaUpload color="rgb(51, 66, 147)" />
                    </button>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 6 }}>
                    (Supported file formats: .CSV, .TSV, .XLS, .XLSX and .TXT)
                  </div>
                </FormGroup>
                <div style={{ fontSize: '0.85rem', color: '#888', margin: '18px 0 10px 0' }}>
                  <div>Note:</div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>Column names in the data should match with filed label names.</li>
                    <li>Data size should be less than 9MB and the number of rows should be less than 100000</li>
                  </ul>
                </div>
                <ButtonGroup>
                  <SubmitButton type="button" style={{ background: 'rgb(51, 66, 147)' }}>Next</SubmitButton>

                </ButtonGroup>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 