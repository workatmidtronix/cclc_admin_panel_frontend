import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaSearch, FaTimes, FaPlus, FaBars, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdRefresh } from "react-icons/md";
import { fetchStudents } from '../../store/slices/studentsSlice';
import { updateStudentStatus, deleteStudent } from '../../utils/studentsApi';
import { showSuccess, showError } from '../../components/CustomAlert';
import { useConfirm } from '../../components/useConfirm';
import CustomConfirm from '../../components/CustomConfirm';

const Container = styled.div`
  padding: 30px;
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

const IconButton = styled.button`
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

const AddButton = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 15px;
  width: calc(100vw - 360px);
  height: calc(100vh - 200px);
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

const EyeIcon = styled.div`
  color: #6c757d;
  cursor: pointer;
`;

const CheckboxInput = styled.input`
  transform: scale(1.2);
`;


const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 2000px;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 0.8rem;
  white-space: nowrap;
  min-width: 100px;
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
  padding: 12px 8px;
  color: #495057;
  font-size: 0.85rem;
  white-space: nowrap;
  border-right: 1px solid #f1f3f4;
  vertical-align: middle;
  
  &:last-child {
    border-right: none;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'Active':
      case 'active':
      case 'Approved':
        return '#d4edda';
      case 'Inactive':
      case 'inactive':
        return '#f8d7da';
      case 'Pending':
        return '#fff3cd';
      default:
        return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Active':
      case 'active':
      case 'Approved':
        return '#155724';
      case 'Inactive':
      case 'inactive':
        return '#721c24';
      case 'Pending':
        return '#856404';
      default:
        return '#383d41';
    }
  }};
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? '#007bff' : props.danger ? '#dc3545' :'#6c757d'};
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-right: 5px;

  &:hover {
    background: ${props => props.primary ? '#0056b3' : '#545b62'};
    transform: translateY(-1px);
  }
`;

const EmailLink = styled.a`
  color: #007bff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AppliedCandidates = () => {
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const navigate = useNavigate();
  const { students, isLoading } = useSelector(state => state.students);
  const dispatch = useDispatch();
  const { confirmState, showDeleteConfirm } = useConfirm();

  useEffect(() => {
    if (students.length === 0) {
      dispatch(fetchStudents());
    }
  }, [dispatch]);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedCandidates(students.map(candidate => candidate.id));
    } else {
      setSelectedCandidates([]);
    }
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

  const handleStatus = async (candidateId, status) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [candidateId]: true }));
      
      const response = await updateStudentStatus(candidateId, status);
      
      if (response.success) {
        // Update the local state by dispatching fetchStudents to refresh the data
        dispatch(fetchStudents());
        
        // Show success message (you can add a toast notification here)
        console.log(`Status updated successfully: ${response.message}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      // Show error message (you can add a toast notification here)
      showError(`Error updating status: ${error.message}`);
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [candidateId]: false }));
    }
  };

  const handleDelete = async (candidateId) => {
    const confirmed = await showDeleteConfirm('candidate', 'candidate');
    if (!confirmed) return;
    
    try {
      await deleteStudent(candidateId);
      dispatch(fetchStudents());
      showSuccess('Candidate deleted successfully');
    } catch (err) {
      console.error('Error deleting candidate:', err);
      showError('Error deleting candidate');
    }
  };

  return (
    <Container>
      <Header>
        <Title>Applied Candidates</Title>
        <ActionButtons>
          <IconButton>
            <FaSearch />
          </IconButton>
          <AddButton onClick={() => navigate('/students/add')}>
            <FaPlus />
          </AddButton>
          <IconButton>
            <FaBars />
          </IconButton>
          <IconButton onClick={() => dispatch(fetchStudents())}>
            <MdRefresh size={18} />
          </IconButton>
        </ActionButtons>
      </Header>

      <TableContainer>
        <TableControls>
          <EyeIcon>👁</EyeIcon>
          <CheckboxInput
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
        </TableControls>

        <div>
          <Table>
            <Thead>
              <Tr>
                <Th style={{ width: '30px' }}></Th>
                <SortableHeader>Status</SortableHeader>
                <SortableHeader>Approval</SortableHeader>
                <SortableHeader>Convert</SortableHeader>
                <SortableHeader>Last Name</SortableHeader>
                <SortableHeader>First Name</SortableHeader>
                <SortableHeader>Applied At</SortableHeader>
                <SortableHeader>Email Address</SortableHeader>
                <SortableHeader>Last Four of Social Security Num...</SortableHeader>
                <SortableHeader>Course Interested In - 1</SortableHeader>
                <SortableHeader>Days Preferred - 1</SortableHeader>
                <SortableHeader>Location Preference - 1</SortableHeader>
                <SortableHeader>Course Interested In - 2</SortableHeader>
                <SortableHeader>Days Preferred - 2</SortableHeader>
                <SortableHeader>Location Preference - 2</SortableHeader>
                <SortableHeader>Actions</SortableHeader>
              </Tr>
            </Thead>
            <Tbody>
              {students.map((candidate) => (
                <Tr key={candidate.id}>
                  {console.log(candidate.status)}
                  <Td>
                    <CheckboxInput
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => handleSelectCandidate(candidate.id)}
                    />
                  </Td>
                  <Td>
                    <StatusBadge status={candidate.status}>{candidate.status}</StatusBadge>
                  </Td>
                  <Td>
                    
                    <ActionButton
                      primary
                      disabled={candidate.status === "Active" || candidate.status === "active" || candidate.status === "Approved" || updatingStatus[candidate.id]} 
                      style={candidate.status === "Active" || candidate.status === "active" || candidate.status === "Approved" || updatingStatus[candidate.id] ? { background: "#d3d3d3", cursor: 'default' } : {}}
                      onClick={() => handleStatus(candidate.id, "Active")}
                    >
                      {updatingStatus[candidate.id] ? 'Updating...' : 'Approve'}
                    </ActionButton>
                  </Td>
                  <Td>
                    <ActionButton 
                      disabled={candidate.status === "Inactive" || candidate.status === "inactive" || candidate.status === "Pending" || updatingStatus[candidate.id]} 
                      style={candidate.status === "Inactive" || candidate.status === "inactive"|| candidate.status === "Pending" || updatingStatus[candidate.id] ? { background: "#d3d3d3", cursor: 'default' } : {}} 
                      onClick={() => handleStatus(candidate.id, "Inactive")}
                    >
                      {updatingStatus[candidate.id] ? 'Updating...' : 'Suspend'}
                    </ActionButton>
                  </Td>
                  <Td>{candidate.lastName}</Td>
                  <Td>{candidate.firstName}</Td>
                  <Td>{candidate.enrollmentDate}</Td>
                  <Td>
                    <EmailLink href={`mailto:${candidate.email}`}>
                      {candidate.email}
                    </EmailLink>
                  </Td>
                  <Td>{candidate.last_four_ssn}</Td>
                  <Td>{candidate.course_pref1}</Td>
                  <Td>{candidate.days_pref1}</Td>
                  <Td>{candidate.location_pref1}</Td>

                  <Td>{candidate.course_pref2}</Td>
                  <Td>{candidate.days_pref2}</Td>
                  <Td>{candidate.location_pref2}</Td>

                  <Td>
                    <ActionButton danger onClick={() => handleDelete(candidate.id)}><FaTrash /></ActionButton>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      </TableContainer>

      <CustomConfirm
        isOpen={confirmState.isOpen}
        onClose={confirmState.onCancel}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        variant={confirmState.variant}
        details={confirmState.details}
        itemName={confirmState.itemName}
      />
    </Container>
  );
};

export default AppliedCandidates; 