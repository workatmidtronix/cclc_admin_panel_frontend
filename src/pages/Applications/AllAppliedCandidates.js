import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaPhone } from 'react-icons/fa';
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

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>All Applied Candidates</Title>
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
          <Title>All Applied Candidates</Title>
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
        <Title>All Applied Candidates</Title>
        {/* <ActionButtons>
          <SaveButton onClick={handleSaveChanges}>
            Save Changes
          </SaveButton>
          <RemoveButton onClick={handleRemoveChanges}>
            Remove Changes
          </RemoveButton>
        </ActionButtons> */}
      </Header>

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
      </SearchContainer>

      <TableContainer>
        <TableControls>
          <CheckboxInput type="checkbox" />
        </TableControls>

        <TableWrapper>
          <Table>
            <Thead>
              <Tr>
                <Th style={{ width: '50px' }}></Th>
                <SortableHeader>Last Name ↕</SortableHeader>
                <SortableHeader>First Name ↕</SortableHeader>
                <SortableHeader>Added Time ↕</SortableHeader>
                <SortableHeader>Email Address ↕</SortableHeader>
                <SortableHeader>Days Preferred - 1 ↕</SortableHeader>
                <SortableHeader>Days Preferred - 2 ↕</SortableHeader>
                <SortableHeader>Phone number ↕</SortableHeader>
              </Tr>
            </Thead>
            <Tbody>
              {applications.length === 0 ? (
                <Tr>
                  <Td colSpan="8" style={{ textAlign: 'center', padding: '50px' }}>
                    {searchTerm ? 'No applications found matching your search criteria.' : 'No applications found.'}
                  </Td>
                </Tr>
              ) : (
                applications.map((application) => (
                  <Tr key={application.id}>
                    <Td>
                      <CheckboxInput
                        type="checkbox"
                        checked={selectedCandidates.includes(application.id)}
                        onChange={() => handleSelectCandidate(application.id)}
                      />
                    </Td>
                    <Td style={{ fontWeight: '500' }}>{application.last_name}</Td>
                    <Td style={{ fontWeight: '500' }}>{application.first_name}</Td>
                    <Td>{formatDateTime(application.added_time)}</Td>
                    <Td>
                      <EmailLink href={`mailto:${application.email}`}>
                        {application.email}
                      </EmailLink>
                    </Td>
                    <Td>
                      <PreferenceText>{application.days_preferred_1 || '-'}</PreferenceText>
                    </Td>
                    <Td>
                      <PreferenceText>{application.days_preferred_2 || '-'}</PreferenceText>
                    </Td>
                    <Td>
                      <PhoneLink href={`tel:${application.phone_number}`}>
                        <FaPhone size={12} />
                        {application.phone_number}
                      </PhoneLink>
                    </Td>
                  </Tr>
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