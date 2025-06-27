import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaBook, 
  FaCalendarAlt, 
  FaHistory,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaClock,
  FaUser,
  FaCalendar,
  FaTag
} from 'react-icons/fa';
import { fetchRecentActivities } from '../store/slices/dashboardSlice';

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  background: rgb(51, 66, 147);
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

const ContentWrapper = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
`;

const MainContent = styled.div`
  flex: 1;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const PageHeader = styled.div`
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PageTitle = styled.h2`
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 'rgb(51, 66, 147)' : 'white'};
  color: ${props => props.primary ? 'white' : '#495057'};
  border: 1px solid ${props => props.primary ? 'rgb(51, 66, 147)' : '#e9ecef'};
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.primary ? 'rgb(40, 53, 120)' : '#f8f9fa'};
    transform: translateY(-1px);
  }
`;

const FilterSection = styled.div`
  padding: 20px 30px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: #495057;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
  }
`;

const FilterInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
  }
`;

const ActivitiesList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 25px 30px;
  border-bottom: 1px solid #f1f3f4;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background: #f8f9fa;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'student_enrollment': return '#3498db';
      case 'course_creation': return '#2ecc71';
      case 'grade_update': return '#f39c12';
      case 'session_scheduled': return '#9b59b6';
      case 'instructor_assignment': return '#e74c3c';
      case 'attendance_marked': return '#1abc9c';
      case 'document_uploaded': return '#34495e';
      default: return '#95a5a6';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityMessage = styled.div`
  color: #2c3e50;
  font-weight: 500;
  font-size: 1rem;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ActivityMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #7f8c8d;
  flex-wrap: wrap;
  gap: 15px;
`;

const ActivityTime = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #95a5a6;
`;

const ActivityUser = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  color: rgb(51, 66, 147);
  font-weight: 500;
`;

const ActivityType = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  background: ${props => {
    switch (props.type) {
      case 'student_enrollment': return '#e3f2fd';
      case 'course_creation': return '#e8f5e8';
      case 'grade_update': return '#fff3e0';
      case 'session_scheduled': return '#f3e5f5';
      case 'instructor_assignment': return '#ffebee';
      case 'attendance_marked': return '#e0f2f1';
      case 'document_uploaded': return '#eceff1';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'student_enrollment': return '#1976d2';
      case 'course_creation': return '#2e7d32';
      case 'grade_update': return '#f57c00';
      case 'session_scheduled': return '#7b1fa2';
      case 'instructor_assignment': return '#d32f2f';
      case 'attendance_marked': return '#00796b';
      case 'document_uploaded': return '#455a64';
      default: return '#757575';
    }
  }};
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const Sidebar = styled.div`
  width: 300px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 25px;
`;

const SidebarTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
`;

const StatsCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const StatsNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: rgb(51, 66, 147);
  margin-bottom: 5px;
`;

const StatsLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 30px;
  color: #7f8c8d;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #bdc3c7;
`;

const EmptyMessage = styled.div`
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const EmptySubmessage = styled.div`
  font-size: 0.9rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 30px;
  color: #7f8c8d;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid rgb(51, 66, 147);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RecentActivities = () => {
  const dispatch = useDispatch();
  const { recentActivities, isLoading } = useSelector(state => state.dashboard);
  const [filters, setFilters] = useState({
    type: '',
    user: '',
    dateRange: 'all'
  });

  useEffect(() => {
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
      case 'attendance_marked':
        return <FaClock />;
      case 'document_uploaded':
        return <FaBook />;
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

  // Helper function to get activity type label
  const getActivityTypeLabel = (type) => {
    switch (type) {
      case 'student_enrollment':
        return 'Enrollment';
      case 'course_creation':
        return 'Course';
      case 'grade_update':
        return 'Grade';
      case 'session_scheduled':
        return 'Session';
      case 'instructor_assignment':
        return 'Instructor';
      case 'attendance_marked':
        return 'Attendance';
      case 'document_uploaded':
        return 'Document';
      default:
        return 'Activity';
    }
  };

  // Filter activities based on current filters
  const filteredActivities = recentActivities.filter(activity => {
    if (filters.type && activity.type !== filters.type) return false;
    if (filters.user && !activity.user?.toLowerCase().includes(filters.user.toLowerCase())) return false;
    if (filters.dateRange !== 'all') {
      const activityDate = new Date(activity.timestamp);
      const now = new Date();
      const diffInDays = Math.floor((now - activityDate) / (1000 * 60 * 60 * 24));
      
      switch (filters.dateRange) {
        case 'today':
          return diffInDays === 0;
        case 'week':
          return diffInDays <= 7;
        case 'month':
          return diffInDays <= 30;
        default:
          return true;
      }
    }
    return true;
  });

  // Get unique activity types for filter
  const activityTypes = [...new Set(recentActivities.map(activity => activity.type))];

  // Calculate statistics
  const totalActivities = recentActivities.length;
  const todayActivities = recentActivities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    const today = new Date();
    return activityDate.toDateString() === today.toDateString();
  }).length;

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting activities...');
  };

  const handleViewDetails = (activity) => {
    // Implement view details functionality
    console.log('Viewing activity details:', activity);
  };

  if (isLoading) {
    return (
      <Container>
        <Header>
          <Title>Recent Activities</Title>
        </Header>
        <LoadingState>
          <LoadingSpinner />
          <div>Loading activities...</div>
        </LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Recent Activities</Title>
      </Header>

      <ContentWrapper>
        <MainContent>
          <PageHeader>
            <PageTitle>Activity Log</PageTitle>
            <HeaderActions>
              <ActionButton onClick={handleExport}>
                <FaDownload />
                Export
              </ActionButton>
            </HeaderActions>
          </PageHeader>

          <FilterSection>
            <FilterRow>
              <FilterGroup>
                <FilterLabel>Activity Type</FilterLabel>
                <FilterSelect
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  {activityTypes.map(type => (
                    <option key={type} value={type}>
                      {getActivityTypeLabel(type)}
                    </option>
                  ))}
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>User</FilterLabel>
                <FilterInput
                  type="text"
                  placeholder="Search by user..."
                  value={filters.user}
                  onChange={(e) => handleFilterChange('user', e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Date Range</FilterLabel>
                <FilterSelect
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </FilterSelect>
              </FilterGroup>
            </FilterRow>
          </FilterSection>

          <ActivitiesList>
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity, index) => (
                <ActivityItem key={index} onClick={() => handleViewDetails(activity)}>
                  <ActivityIcon type={activity.type}>
                    {getActivityIcon(activity.type)}
                  </ActivityIcon>
                  
                  <ActivityContent>
                    <ActivityMessage>{activity.message}</ActivityMessage>
                    <ActivityMeta>
                      <ActivityTime>
                        <FaClock />
                        {formatTimestamp(activity.timestamp)}
                      </ActivityTime>
                      
                      {activity.user && (
                        <ActivityUser>
                          <FaUser />
                          {activity.user}
                        </ActivityUser>
                      )}
                      
                      <ActivityType type={activity.type}>
                        <FaTag />
                        {getActivityTypeLabel(activity.type)}
                      </ActivityType>
                    </ActivityMeta>
                  </ActivityContent>
                </ActivityItem>
              ))
            ) : (
              <EmptyState>
                <EmptyIcon>
                  <FaHistory />
                </EmptyIcon>
                <EmptyMessage>No activities found</EmptyMessage>
                <EmptySubmessage>
                  {filters.type || filters.user || filters.dateRange !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Activities will appear here as they occur'}
                </EmptySubmessage>
              </EmptyState>
            )}
          </ActivitiesList>
        </MainContent>

        <Sidebar>
          <SidebarTitle>Activity Statistics</SidebarTitle>
          
          <StatsCard>
            <StatsNumber>{totalActivities}</StatsNumber>
            <StatsLabel>Total Activities</StatsLabel>
          </StatsCard>
          
          <StatsCard>
            <StatsNumber>{todayActivities}</StatsNumber>
            <StatsLabel>Today's Activities</StatsLabel>
          </StatsCard>
          
          <StatsCard>
            <StatsNumber>{filteredActivities.length}</StatsNumber>
            <StatsLabel>Filtered Results</StatsLabel>
          </StatsCard>

          <SidebarTitle style={{ marginTop: '30px' }}>Activity Types</SidebarTitle>
          {activityTypes.map(type => (
            <StatsCard key={type}>
              <StatsNumber>
                {recentActivities.filter(activity => activity.type === type).length}
              </StatsNumber>
              <StatsLabel>{getActivityTypeLabel(type)}</StatsLabel>
            </StatsCard>
          ))}
        </Sidebar>
      </ContentWrapper>
    </Container>
  );
};

export default RecentActivities; 