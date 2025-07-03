import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar, FaUser, FaGraduationCap, FaFileAlt, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getApplications } from '../../utils/applicationsApi';
import { showSuccess, showError } from '../../components/CustomAlert';

const Container = styled.div`
  padding: 30px 30px 0 30px;
  background: #f8f9fa;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
  font-size: 1.7rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;

const SaveButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #218838;
    transform: translateY(-1px);
  }
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
`;

const SearchContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SearchLabel = styled.span`
  background: #e9ecef;
  padding: 8px 15px;
  border-radius: 6px;
  font-weight: 600;
  color: #495057;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: 1px solid #e9ecef;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #6c757d;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableContainer = styled.div`
 background: white;
  border-radius: 15px;
  width: calc(100vw - 360px);
  height: calc(100vh - 300px);
  position: sticky;
  bottom: 0; 
  z-index: 10;
  overflow-x: auto;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const TableControls = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CheckboxInput = styled.input`
  transform: scale(1.2);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 0.85rem;
  white-space: nowrap;
  min-width: 140px;
`;

const SortableHeader = styled(Th)`
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: #e9ecef;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background: #f8f9fa;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }
`;

const Td = styled.td`
  padding: 15px 12px;
  color: #495057;
  font-size: 0.9rem;
  border-right: 1px solid #f1f3f4;
  
  &:last-child {
    border-right: none;
  }
`;

const ExpandButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 5px;
  
  &:hover {
    color: rgb(51, 66, 147);
  }
`;

const EmailLink = styled.a`
  color: rgb(51, 66, 147);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PhoneLink = styled.a`
  color: rgb(51, 66, 147);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const PreferenceText = styled.span`
  color: #495057;
  font-size: 0.85rem;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'approved': return '#d4edda';
      case 'pending': return '#fff3cd';
      case 'rejected': return '#f8d7da';
      default: return '#e9ecef';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'approved': return '#155724';
      case 'pending': return '#856404';
      case 'rejected': return '#721c24';
      default: return '#6c757d';
    }
  }};
`;

const ExpandedRow = styled.tr`
  background: #f8f9fa;
`;

const ExpandedCell = styled.td`
  padding: 20px;
  border-top: 1px solid #e9ecef;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const DetailSection = styled.div`
  background: white;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const SectionTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailItem = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #495057;
  font-size: 0.8rem;
  min-width: 120px;
`;

const DetailValue = styled.span`
  color: #6c757d;
  font-size: 0.8rem;
`;

const FileLink = styled.a`
  color: rgb(51, 66, 147);
  text-decoration: none;
  font-size: 0.8rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AcceptButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 10px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover:not(:disabled) {
    background: #218838;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const RejectButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  min-width: 120px;

  &:hover:not(:disabled) {
    background: #c82333;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #6c757d;
  font-size: 1.1rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #dc3545;
  font-size: 1.1rem;
  text-align: center;
`;

const AllAppliedCandidates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const { students, isLoading } = useSelector(state => state.students);

  // Fetch applications on component mount and when search term changes
  useEffect(() => {
    fetchApplications();
  }, [searchTerm]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApplications(searchTerm);
      if (response.success) {
        setApplications(response.applications);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleSaveChanges = () => {
    console.log('Saving changes...');
  };

  const handleRemoveChanges = () => {
    console.log('Removing changes...');
  };

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidates(prev => {
      if (prev.includes(candidateId)) {
        return prev.filter(id => id !== candidateId);
      } else {
        return [...prev, candidateId];
      }
    });
  };

  const toggleExpandedRow = (applicationId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(applicationId)) {
        newSet.delete(applicationId);
      } else {
        newSet.add(applicationId);
      }
      return newSet;
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    });
  };

  const handleAcceptApplication = async (applicationId) => {
    try {
      // First, update the application status to approved
      const statusResponse = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Approved' })
      });

      const statusData = await statusResponse.json();

      if (!statusData.success) {
        showError(statusData.message || 'Failed to accept application');
        return;
      }

      // Get the application data to register as student
      const applicationResponse = await fetch(`/api/applications/${applicationId}`);
      const applicationData = await applicationResponse.json();

      if (!applicationData.success) {
        showError('Failed to fetch application data for student registration');
        return;
      }

      const application = applicationData.application;

      // Helper function to format dates properly
      const formatDateForDatabase = (dateString) => {
        if (!dateString) return null;
        try {
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0]; // YYYY-MM-DD format
          }
        } catch (error) {
          console.error('Error formatting date:', error);
        }
        return null;
      };

      // Format all date fields properly
      const formattedDateOfBirth = formatDateForDatabase(application.date_of_birth);
      const formattedTaraItaCompletionDate = formatDateForDatabase(application.tara_ita_packet_date);
      const formattedInfoSessionDate = formatDateForDatabase(application.info_session_date);
      const formattedDateOfJoining = formatDateForDatabase(application.date_of_joining);

      // Register the applicant as a student
      const studentResponse = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: application.first_name || '',
          lastName: application.last_name || '',
          email: application.email_address || '',
          phone: application.contact_number || '',
          dateOfBirth: formattedDateOfBirth,
          course: application.course || '',
          department: application.department || '',
          studentNotes: application.student_notes || '',
          session: application.session || '',
          semester: application.semester || '',
          registrationNumber: `${application.session || 'UNK'}-${application.course || 'UNK'}-${application.id}`,
          socialSecurityNumber: application.social_security_number || null,
          driversLicense: application.driver_license_number || '',
          studentPcpInfo: application.student_pcp_info || '',
          studentPcpPhone: application.student_pcp_phone || '',
          emergencyContactInfo: application.emergency_contact_info || '',
          emergencyContactPhone: application.emergency_contact_phone || '',
          otherEmergencyContact: application.other_emergency_contact || '',
          caseworkerName: application.caseworker_name || '',
          workforceCenter: application.workforce_center || '',
          taraItaCompletionDate: formattedTaraItaCompletionDate, // Use formatted date
          infoSessionDate: formattedInfoSessionDate, // Use formatted date
          coursePref1: application.course_interest_1 || '',
          daysPref1: application.days_preferred_1 || '',
          locationPref1: application.location_preference_1 || '',
          coursePref2: application.course_interest_2 || '',
          daysPref2: application.days_preferred_2 || '',
          locationPref2: application.location_preference_2 || '',
          attendedInfoSession: application.attended_info_session || false,
          infoSessionLocation: application.filled_out_where || '',
          additionalComments: application.additional_comments || '',
          signature: application.signature || '',
          addressLine1: application.address || '',
          state: application.state_province || '',
          gender: application.gender === 'Male' || application.gender === 'Female' ? application.gender : 'Other',
          religion: application.religion || '',
          nationality: application.nationality || '',
          dateOfJoining: formattedDateOfJoining, // Use formatted date
          status: 'Active',
          // Generate login ID and password for the new student
          loginId: application.login_id || '',
          password: application.password || ''
        })
      });

      const studentData = await studentResponse.json();

      if (studentData.success) {
        // Update local state immediately for better UX
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'approved' }
            : app
        ));
        
        showSuccess(`Application accepted successfully! Student registered with ID: ${studentData.studentId}`);
      } else {
        // If student registration fails, revert the application status
        await fetch(`/api/applications/${applicationId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'Pending' })
        });
        
        // Show detailed error message
        if (studentData.errors) {
          const errorMessages = studentData.errors.map(err => `${err.param}: ${err.msg}`).join(', ');
          showError(`Validation errors: ${errorMessages}`);
        } else {
          showError(studentData.message || 'Failed to register student. Application status reverted.');
        }
      }
    } catch (error) {
      console.error('Error accepting application:', error);
      showError('Failed to accept application. Please try again.');
    }
  };

  const handleRejectApplication = async (applicationId) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Rejected' })
      });

      const data = await response.json();

      if (data.success) {
        // Update local state immediately for better UX
        setApplications(prev => prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'rejected' }
            : app
        ));
        
        showSuccess('Application rejected successfully!');
      } else {
        showError(data.message || 'Failed to reject application');
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      showError('Failed to reject application. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Applications</Title>
        </Header>
        <LoadingContainer>
          Loading applications...
        </LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <Title>Applications</Title>
        </Header>
        <ErrorContainer>
          <div>
            <div>Error: {error}</div>
            <button onClick={fetchApplications} style={{ marginTop: '10px', padding: '8px 16px' }}>
              Retry
            </button>
          </div>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Applications</Title>
        {/* <ActionButtons>
          <SaveButton onClick={handleSaveChanges}>
            Save Changes
          </SaveButton>
          <RemoveButton onClick={handleRemoveChanges}>
            Remove Changes
          </RemoveButton>
        </ActionButtons> */}
      </Header>
{/* 
      <SearchContainer>
        <SearchBar>
          <SearchLabel>SEARCH</SearchLabel>
          <SearchInput
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name, email, or phone number..."
          />
          <ClearButton onClick={clearSearch}>
            <FaTimes />
          </ClearButton>
        </SearchBar>
      </SearchContainer> */}

      <TableContainer>
        {/* <TableControls>
          <CheckboxInput type="checkbox" />
        </TableControls> */}

        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th style={{ width: '50px' }}>Expand</Th>
                <SortableHeader>Last Name ↕</SortableHeader >
                <SortableHeader>First Name ↕</SortableHeader>
                <SortableHeader>Email Address ↕</SortableHeader>
                <SortableHeader>Phone Number ↕</SortableHeader>
                <SortableHeader>Course Interest ↕</SortableHeader>
                <SortableHeader>Status ↕</SortableHeader>
                <SortableHeader>Applied Date ↕</SortableHeader>
              </Tr>
            </Thead>
            <Tbody>
              {applications.length === 0 ? (
                <Tr>
                  <Td colSpan="9" style={{ textAlign: 'center', padding: '50px' }}>
                    {searchTerm ? 'No applications found matching your search criteria.' : 'No applications found.'}
                  </Td>
                </Tr>
              ) : (
                applications.map((application) => (
                  <React.Fragment key={application.id}>
                    <Tr>
                      {/* <Td>
                      <CheckboxInput
                        type="checkbox"
                        checked={selectedCandidates.includes(application.id)}
                        onChange={() => handleSelectCandidate(application.id)}
                      />
                      </Td> */}
                      <Td>
                        <ExpandButton onClick={() => toggleExpandedRow(application.id)}>
                          {expandedRows.has(application.id) ? <FaChevronDown /> : <FaChevronRight />}
                        </ExpandButton>
                    </Td>
                    <Td style={{ fontWeight: '500' }}>{application.last_name}</Td>
                    <Td style={{ fontWeight: '500' }}>{application.first_name}</Td>
                    <Td>
                        <EmailLink href={`mailto:${application.email_address}`} >
                          <FaEnvelope size={12} style={{marginRight:10}} />
                          {application.email_address}
                      </EmailLink>
                    </Td>
                    <Td>
                        <PhoneLink href={`tel:${application.contact_number}`}>
                          <FaPhone size={12} />
                          {application.contact_number}
                        </PhoneLink>
                    </Td>
                    <Td>
                        <PreferenceText>{application.course_interest_1 || '-'}</PreferenceText>
                    </Td>
                    <Td>
                        <StatusBadge status={application.status || 'pending'}>
                          {application.status || 'pending'}
                        </StatusBadge>
                    </Td>
                      <Td>{formatDateTime(application.created_at)}</Td>
                  </Tr>
                    {expandedRows.has(application.id) && (
                      <ExpandedRow>
                        <ExpandedCell colSpan="9">
                          <DetailGrid>
                            <DetailSection>
                              <SectionTitle>
                                <FaUser />
                                Personal Information
                              </SectionTitle>
                              <DetailItem>
                                <DetailLabel>Date of Birth:</DetailLabel>
                                <DetailValue>{formatDate(application.date_of_birth)}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Gender:</DetailLabel>
                                <DetailValue>{application.gender || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Nationality:</DetailLabel>
                                <DetailValue>{application.nationality || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Religion:</DetailLabel>
                                <DetailValue>{application.religion || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Address:</DetailLabel>
                                <DetailValue>{application.address || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>State/Province:</DetailLabel>
                                <DetailValue>{application.state_province || '-'}</DetailValue>
                              </DetailItem>
                            </DetailSection>

                            <DetailSection>
                              <SectionTitle>
                                <FaGraduationCap />
                                Academic Information
                              </SectionTitle>
                              <DetailItem>
                                <DetailLabel>Department:</DetailLabel>
                                <DetailValue>{application.department || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Semester:</DetailLabel>
                                <DetailValue>{application.semester || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Session:</DetailLabel>
                                <DetailValue>{application.session || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Course Interest 1:</DetailLabel>
                                <DetailValue>{application.course_interest_1 || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Days Preferred 1:</DetailLabel>
                                <DetailValue>{application.days_preferred_1 || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Location Preference 1:</DetailLabel>
                                <DetailValue>{application.location_preference_1 || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Course Interest 2:</DetailLabel>
                                <DetailValue>{application.course_interest_2 || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Days Preferred 2:</DetailLabel>
                                <DetailValue>{application.days_preferred_2 || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Location Preference 2:</DetailLabel>
                                <DetailValue>{application.location_preference_2 || '-'}</DetailValue>
                              </DetailItem>
                            </DetailSection>

                            <DetailSection>
                              <SectionTitle>
                                <FaPhone />
                                Emergency Contacts
                              </SectionTitle>
                              <DetailItem>
                                <DetailLabel>Emergency Contact:</DetailLabel>
                                <DetailValue>{application.emergency_contact_info || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Emergency Phone:</DetailLabel>
                                <DetailValue>{application.emergency_contact_phone || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Other Emergency:</DetailLabel>
                                <DetailValue>{application.other_emergency_contact || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>PCP Info:</DetailLabel>
                                <DetailValue>{application.student_pcp_info || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>PCP Phone:</DetailLabel>
                                <DetailValue>{application.student_pcp_phone || '-'}</DetailValue>
                              </DetailItem>
                            </DetailSection>

                            <DetailSection>
                              <SectionTitle>
                                <FaFileAlt />
                                Documents & Files
                              </SectionTitle>
                              <DetailItem>
                                <DetailLabel>Photo:</DetailLabel>
                                <DetailValue>
                                  {application.photo_path ? (
                                    <FileLink href={`/uploads/${application.photo_path}`} target="_blank">
                                      View Photo
                                    </FileLink>
                                  ) : '-'}
                                </DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Social Security:</DetailLabel>
                                <DetailValue>
                                  {application.social_security_path ? (
                                    <FileLink href={`/uploads/${application.social_security_path}`} target="_blank">
                                      View Document
                                    </FileLink>
                                  ) : '-'}
                                </DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Driver License:</DetailLabel>
                                <DetailValue>
                                  {application.dl_path ? (
                                    <FileLink href={`/uploads/${application.dl_path}`} target="_blank">
                                      View Document
                                    </FileLink>
                                  ) : '-'}
                                </DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>TARA ITA:</DetailLabel>
                                <DetailValue>
                                  {application.tara_ita_path ? (
                                    <FileLink href={`/uploads/${application.tara_ita_path}`} target="_blank">
                                      View Document
                                    </FileLink>
                                  ) : '-'}
                                </DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Voucher Dates:</DetailLabel>
                                <DetailValue>
                                  {application.voucher_dates_path ? (
                                    <FileLink href={`/uploads/${application.voucher_dates_path}`} target="_blank">
                                      View Document
                                    </FileLink>
                                  ) : '-'}
                                </DetailValue>
                              </DetailItem>
                            </DetailSection>

                            <DetailSection>
                              <SectionTitle>
                                <FaCalendar />
                                Additional Information
                              </SectionTitle>
                              <DetailItem>
                                <DetailLabel>Date of Joining:</DetailLabel>
                                <DetailValue>{formatDate(application.date_of_joining)}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Info Session Date:</DetailLabel>
                                <DetailValue>{formatDate(application.info_session_date)}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>TARA ITA Date:</DetailLabel>
                                <DetailValue>{formatDate(application.tara_ita_packet_date)}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Attended Info Session:</DetailLabel>
                                <DetailValue>{application.attended_info_session || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Filled Out Where:</DetailLabel>
                                <DetailValue>{application.filled_out_where || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Caseworker:</DetailLabel>
                                <DetailValue>{application.caseworker_name || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Workforce Center:</DetailLabel>
                                <DetailValue>{application.workforce_center || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Student Notes:</DetailLabel>
                                <DetailValue>{application.student_notes || '-'}</DetailValue>
                              </DetailItem>
                              <DetailItem>
                                <DetailLabel>Additional Comments:</DetailLabel>
                                <DetailValue>{application.additional_comments || '-'}</DetailValue>
                              </DetailItem>
                            </DetailSection>

                            <DetailSection>
                              <SectionTitle>
                                <FaUser />
                                Application Actions
                              </SectionTitle>
                              <DetailItem style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
                                <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
                                  <AcceptButton 
                                    onClick={() => handleAcceptApplication(application.id)}
                                    disabled={application.status === 'approved'}
                                  >
                                    {application.status === 'approved' ? 'Already Accepted' : 'Accept Application'}
                                  </AcceptButton>
                                  <RejectButton 
                                    onClick={() => handleRejectApplication(application.id)}
                                    disabled={application.status === 'rejected'}
                                  >
                                    {application.status === 'rejected' ? 'Already Rejected' : 'Reject Application'}
                                  </RejectButton>
                                </div>
                                {application.status && (
                                  <div style={{ marginTop: '10px' }}>
                                    <DetailLabel>Current Status:</DetailLabel>
                                    <StatusBadge status={application.status} style={{ marginLeft: '10px' }}>
                                      {application.status}
                                    </StatusBadge>
                                  </div>
                                )}
                              </DetailItem>
                            </DetailSection>
                          </DetailGrid>
                        </ExpandedCell>
                      </ExpandedRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </Tbody>
          </Table>
        </TableWrapper>
      </TableContainer>
    </Container>
  );
};

export default AllAppliedCandidates; 