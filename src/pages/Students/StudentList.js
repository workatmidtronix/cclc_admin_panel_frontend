import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FaEye, FaPaperPlane, FaDownload, FaSearch, FaCog, FaList, FaTrash } from 'react-icons/fa';
import { fetchStudents } from '../../store/slices/studentsSlice';
import { getStudentDetails, deleteStudent } from '../../utils/studentsApi';
import { useMasterData } from '../../hooks/useMasterData';
import { CourseSelect, SessionSelect } from '../../components/MasterDataSelect';
import { showSuccess, showError } from '../../components/CustomAlert';
import { useConfirm } from '../../components/useConfirm';
import CustomConfirm from '../../components/CustomConfirm';

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const FilterSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 200px;
`;

const Label = styled.label`
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
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

const SearchButton = styled.button`
   border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: transform 0.2s ease;
  background: transparent;
  border: 1px solid #e9ecef;
  color: #2f2e2e;
  margin-top: 24px;

  &:hover {
    transform: translateY(-2px);
  }
`;

const StudentListContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const ListHeader = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
`;

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const BreadcrumbItem = styled.span`
  &:after {
    content: '>';
    margin-left: 8px;
  }
  
  &:last-child:after {
    content: '';
  }
`;

const ListTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
`;

const TableControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
`;

const ControlsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ControlsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background: #f8f9fa;
`;

const Th = styled.th`
  padding: 15px 20px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 0.9rem;
`;

const SortableHeader = styled(Th)`
  cursor: pointer;
  user-select: none;
  text-align: left;
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
  padding: 15px 20px;
  color: #495057;
  font-size: 0.95rem;
`;

const CheckboxInput = styled.input`
  transform: scale(1.2);
`;

const ActionButton = styled.button`
  border: 1px solid rgb(52 152 219);
  color: rgb(52 152 219);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  margin-right: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  ${props => props.action === 'delete' && `
    border-color: #dc3545;
    color: #dc3545;
    
    &:hover {
      background: #dc3545;
      color: white;
    }
  `}
`;

const StudentStatus = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #d4edda;
  color: #155724;
`;

const Pagination = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e9ecef;
`;

const ShowingText = styled.span`
  color: #6c757d;
  font-size: 0.9rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  max-width: 1200px;
  width: 100vw;
  max-height: 100vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  margin: 0;
  position: relative;
  padding: 0;
`;

const ModalHeader = styled.div`
  position: sticky;
  top: 0;
  background: #fff;
  border-radius: 15px 15px 0 0;
  border-bottom: 1px solid #e9ecef;
  padding: 30px 40px 18px 40px;
  display: flex;
  align-items: center;
  z-index: 2;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.35rem;
  font-weight: 600;
  flex: 1;
`;

const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 2.1rem;
  color: #b0b0b0;
  cursor: pointer;
  margin-left: 18px;
  margin-top: 0;
  transition: color 0.2s;
  &:hover {
    color: #333;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 1.08rem;
  color: #334;
  font-weight: 600;
  padding: 32px 0 8px 0;
  border-top: 1px solid #e9ecef;
`;

const DetailsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 0;
  font-size: 0.98rem;
  background: #fff;
  th, td {
    padding: 10px 18px;
    border-bottom: 1px solid #f0f0f0;
    vertical-align: top;
  }
  th {
    color: #555;
    font-weight: 500;
    background: #f8f9fa;
    width: 260px;
    border-right: 1px solid #f0f0f0;
  }
  tr:last-child td, tr:last-child th {
    border-bottom: none;
  }
`;

const FileLink = styled.a`
  color: #3366cc;
  text-decoration: underline;
  font-size: 0.97rem;
`;

function StudentDetailsModal({ student, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!student?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await getStudentDetails(student.id);
        setDetails(response.studentDetails);
      } catch (err) {
        console.error('Error fetching student details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [student?.id]);

  if (!student) return null;

  if (loading) {
    return (
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Loading Student Details...</ModalTitle>
            <ModalClose onClick={onClose}>&times;</ModalClose>
          </ModalHeader>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Loading student information...
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (error) {
    return (
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Error</ModalTitle>
            <ModalClose onClick={onClose}>&times;</ModalClose>
          </ModalHeader>
          <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
            Error loading student details: {error}
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  }

  if (!details) {
    return (
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>No Data</ModalTitle>
            <ModalClose onClick={onClose}>&times;</ModalClose>
          </ModalHeader>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            No student details found.
          </div>
        </ModalContent>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Overview</ModalTitle>
          <ModalClose onClick={onClose}>&times;</ModalClose>
        </ModalHeader>
        <div style={{ padding: '0 40px 0px 15px' }}>
          <DetailsTable>
            <tbody style={{textAlign: 'left'}}>
              <tr><th>Registration Number</th><td>{details.student.registrationNumber || 'N/A'}</td></tr>
              <tr><th>Last Name</th><td>{details.student.lastName || 'N/A'}</td></tr>
              <tr><th>First Name</th><td>{details.student.firstName || 'N/A'}</td></tr>
              <tr><th>Date of Birth</th><td>{details.student.dateOfBirth ? new Date(details.student.dateOfBirth).toLocaleDateString() : 'N/A'}</td></tr>
              <tr><th>Gender</th><td>{details.student.gender || 'N/A'}</td></tr>
              <tr><th>Email Address</th><td>{details.student.email || 'N/A'}</td></tr>
              <tr><th>Contact Number</th><td>{details.student.phone || 'N/A'}</td></tr>
              <tr><th>Address</th><td>{details.student.address || 'N/A'}</td></tr>
              <tr><th>Emergency Contact Info</th><td>{details.student.emergencyContact || 'N/A'}</td></tr>
              <tr><th>Other Emergency Contact</th><td>{details.student.otherEmergencyContact || 'N/A'}</td></tr>
              <tr><th>Emergency Contact Phone</th><td>{details.student.emergencyContactPhone || 'N/A'}</td></tr>
              <tr><th>Course</th><td>{details.student.course || 'N/A'}</td></tr>
              <tr><th>Student Notes</th><td>{details.student.studentNotes || 'N/A'}</td></tr>
              <tr><th>Session</th><td>{details.student.session || 'N/A'}</td></tr>
              <tr><th>Department</th><td>{details.student.department || 'N/A'}</td></tr>
              <tr><th>Semester</th><td>{details.student.semester || 'N/A'}</td></tr>
              <tr><th>Religion</th><td>{details.student.religion || 'N/A'}</td></tr>
              <tr><th>Nationality</th><td>{details.student.nationality || 'N/A'}</td></tr>
              <tr><th>Date of Joining</th><td>{details.student.dateOfJoining ? new Date(details.student.dateOfJoining).toLocaleDateString() : 'N/A'}</td></tr>
              <tr><th>Social Security Number</th><td>{details.student.socialSecurityNumber || 'N/A'}</td></tr>
              <tr><th>SSN Upload</th><td>{details.student.ssnUpload ? <FileLink href={details.student.ssnUpload} target="_blank">View SSN Document</FileLink> : 'N/A'}</td></tr>
              <tr><th>DL or State ID Upload</th><td>{details.student.dlUpload ? <FileLink href={details.student.dlUpload} target="_blank">View DL Document</FileLink> : 'N/A'}</td></tr>
              <tr><th>Student PCP Info</th><td>{details.student.studentPcpInfo || 'N/A'}</td></tr>
              <tr><th>Student PCP Phone Number</th><td>{details.student.studentPcpPhone || 'N/A'}</td></tr>
              <tr><th>Status</th><td>{details.student.status || 'N/A'}</td></tr>
              <tr><th>Added Time</th><td>{details.student.addedTime ? new Date(details.student.addedTime).toLocaleString() : 'N/A'}</td></tr>
            </tbody>
          </DetailsTable>

          <SectionTitle>Workforce Information</SectionTitle>
          <DetailsTable>
            <tbody style={{textAlign: 'left'}}>
              <tr><th>Caseworker's Name</th><td>{details.workforce.caseworker || 'N/A'}</td><th>Workforce Center</th><td>{details.workforce.workforceCenter || 'N/A'}</td></tr>
              <tr><th>Tara/ITA Packet Upload</th><td colSpan={3}>{details.workforce.taraPacket ? <FileLink href={details.workforce.taraPacket} target="_blank">View Tara/ITA Packet</FileLink> : 'N/A'}</td></tr>
              <tr><th>Tara/ITA Completion Date</th><td colSpan={3}>{details.workforce.taraCompletionDate ? new Date(details.workforce.taraCompletionDate).toLocaleDateString() : 'N/A'}</td></tr>
              <tr><th>Voucher Dates</th><td colSpan={3}>{details.workforce.voucherDates || 'N/A'}</td></tr>
            </tbody>
          </DetailsTable>

          <SectionTitle>Signed Documents</SectionTitle>
          <DetailsTable style={{textAlign: 'left'}}>
            <tbody>
              {details.documents && details.documents.length > 0 ? (
                details.documents.map((doc, idx) => (
                  <tr key={idx}>
                    <th>{doc.particulars}</th>
                    <td colSpan={3}>
                      {doc.file ? <FileLink href={doc.file} target="_blank">{doc.file}</FileLink> : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4}>No signed documents found</td></tr>
              )}
            </tbody>
          </DetailsTable>

          <SectionTitle>Signed ITA Attendance Details</SectionTitle>
          <DetailsTable>
            <tbody style={{textAlign: 'left'}}>
              <tr><th>Date</th><th>Status</th><th>Hours Completed</th><th>Instructor</th><th>Course</th></tr>
              {details.itaAttendance && details.itaAttendance.length > 0 ? (
                details.itaAttendance.map((att, idx) => (
                  <tr key={idx}>
                    <td>{att.date ? new Date(att.date).toLocaleDateString() : 'N/A'}</td>
                    <td>{att.status || 'N/A'}</td>
                    <td>{att.hoursCompleted || 'N/A'}</td>
                    <td>{att.instructor || 'N/A'}</td>
                    <td>{att.course || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5}>No ITA attendance records found</td></tr>
              )}
            </tbody>
          </DetailsTable>

          <SectionTitle>Previous Course Details</SectionTitle>
          <DetailsTable>
            <tbody style={{textAlign: 'left'}}>
              <tr><th>Course</th><th>Session</th><th>Moved Date</th><th>Student Course Status</th></tr>
              {details.previousCourses && details.previousCourses.length > 0 ? (
                details.previousCourses.map((c, idx) => (
                  <tr key={idx}>
                    <td>{c.course || 'N/A'}</td>
                    <td>{c.session || 'N/A'}</td>
                    <td>{c.movedDate ? new Date(c.movedDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{c.status || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4}>No previous course records found</td></tr>
              )}
            </tbody>
          </DetailsTable>

          <SectionTitle>Grade</SectionTitle>
          <DetailsTable>
            <tbody style={{textAlign: 'left'}}>
              <tr><th>Session</th><th>Category</th><th>Name</th><th>Max Points</th><th>Points Scored</th></tr>
              {details.grades && details.grades.length > 0 ? (
                details.grades.map((g, idx) => (
                  <tr key={idx}>
                    <td>{g.session || 'N/A'}</td>
                    <td>{g.category || 'N/A'}</td>
                    <td>{g.name || 'N/A'}</td>
                    <td>{g.maxPoints || 'N/A'}</td>
                    <td>{g.pointsScored || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5}>No grade records found</td></tr>
              )}
            </tbody>
          </DetailsTable>

          <SectionTitle>Attendance Records</SectionTitle>
          <DetailsTable>
            <tbody style={{textAlign: 'left'}}>
              <tr><th>Date</th><th>Status</th><th>Course</th><th>Notes</th></tr>
              {details.attendance && details.attendance.length > 0 ? (
                details.attendance.map((att, idx) => (
                  <tr key={idx}>
                    <td>{att.date ? new Date(att.date).toLocaleDateString() : 'N/A'}</td>
                    <td>{att.status || 'N/A'}</td>
                    <td>{att.course || 'N/A'}</td>
                    <td>{att.notes || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4}>No attendance records found</td></tr>
              )}
            </tbody>
          </DetailsTable>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
}

const StudentList = () => {
  const dispatch = useDispatch();
  const { students, isLoading } = useSelector(state => state.students);
  const { courses, sessions } = useMasterData();
  const { confirmState, showDeleteConfirm } = useConfirm();
  const [filters, setFilters] = useState({
    course: '',
    session: ''
  });
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const handleSearch = () => {
    // Implement search logic
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSend = (studentId) => {
    console.log('Sending document to student:', studentId);
  };

  const handleDownload = (studentId) => {
    console.log('Downloading documents for student:', studentId);
  };

  const handleDelete = async (studentId) => {
    const confirmed = await showDeleteConfirm('student', 'student');
    if (!confirmed) return;
    
    try {
      await deleteStudent(studentId);
      dispatch(fetchStudents());
      showSuccess('Student deleted successfully');
    } catch (err) {
      console.error('Error deleting student:', err);
      showError('Error deleting student');
    }
  };

  return (
    <Container>
      <FilterSection>
        <FilterRow>
          <FilterGroup>
            <Label htmlFor="course">Course *</Label>
            <CourseSelect
              value={filters.course}
              onChange={(value) => handleFilterChange('course', value)}
              placeholder="Select course"
              isClearable={true}
            />
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor="session">Session *</Label>
            <SessionSelect
              value={filters.session}
              onChange={(value) => handleFilterChange('session', value)}
              placeholder="Select session"
              isClearable={true}
            />
          </FilterGroup>

          <SearchButton onClick={handleSearch}>
            <FaSearch />
            Search
          </SearchButton>
        </FilterRow>
      </FilterSection>

      <StudentListContainer>
        <ListHeader>
          {/* <BreadcrumbNav>
            <BreadcrumbItem>Active</BreadcrumbItem>
            <BreadcrumbItem>EKG</BreadcrumbItem>
            <BreadcrumbItem>Saturday EKG Dr. Fernando II Soto Avellanez 08/24/2023 @ Evergreen</BreadcrumbItem>
          </BreadcrumbNav> */}
          <ListTitle>Student List</ListTitle>
        </ListHeader>

        <TableControls>
          {/* <ControlsLeft>
            <CheckboxInput type="checkbox" />
            <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>Select All Students</span>
          </ControlsLeft> */}
          <div></div>
          <ControlsRight>
            <IconButton>
              <FaSearch />
            </IconButton>
            <IconButton>
              <FaList />
            </IconButton>
          </ControlsRight>
        </TableControls>

        <Table>
          <Thead>
            <Tr>
              {/* <Th style={{ width: '50px' }}></Th> */}
              <SortableHeader>ID</SortableHeader>
              <SortableHeader>Last Name</SortableHeader>
              <SortableHeader>First Name</SortableHeader>
              <SortableHeader>Email Address</SortableHeader>
              <SortableHeader>Gender</SortableHeader>
              <SortableHeader>Phone Number</SortableHeader>
              <SortableHeader>Enrollment Date</SortableHeader>
              <SortableHeader style={{ textAlign: 'left' }}>Download Documents</SortableHeader>
              <SortableHeader style={{ textAlign: 'left' }}>Details</SortableHeader>
              <SortableHeader style={{ textAlign: 'left' }}>Actions</SortableHeader>
            </Tr>
          </Thead>
          <Tbody>
            {students.map((student) => (
              <Tr key={student.id}>
                {/* <Td>
                  <CheckboxInput
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                  />
                </Td> */}
                <Td style={{ fontWeight: '500' }}>{student.id}</Td>
                <Td style={{ fontWeight: '500' }}>{student.lastName}</Td>
                <Td style={{ fontWeight: '500' }}>{student.firstName}</Td>
                <Td style={{ color: 'rgb(51, 66, 147);' }}>{student.email}</Td>
                <Td>{student.gender}</Td>
                <Td style={{ fontFamily: 'Courier New, monospace' }}>
                  {student.phone}
                </Td>
                <Td style={{ fontSize: '0.85rem' }}>{student.enrollmentDate}</Td>
                <Td>
                  <ActionButton action="download" onClick={() => handleDownload(student.id)}>
                    Download
                  </ActionButton>
                </Td>
                <Td>
                  <ActionButton action="details" onClick={() => { setSelectedStudent(student); setShowDetailsModal(true); }}>
                    Details
                  </ActionButton>
                </Td>
                <Td>
                  <ActionButton action="delete" onClick={() => handleDelete(student.id)}>
                    Delete
                  </ActionButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Pagination goes here */}

{/* 
        <Pagination>
          <ShowingText>Showing 763 of 763</ShowingText>
          <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            Page navigation controls would go here
          </div>
        </Pagination> */}
      </StudentListContainer>
      {showDetailsModal && (
        <StudentDetailsModal student={selectedStudent} onClose={() => setShowDetailsModal(false)} />
      )}

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

export default StudentList; 