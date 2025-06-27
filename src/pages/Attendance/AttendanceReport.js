import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FaCalendarAlt, FaUserGraduate, FaClipboardCheck, FaUser, FaClock } from 'react-icons/fa';

const ReportContainer = styled.div`
  padding: 2rem;
  background-color: #f8f9fa;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 2rem;
  font-weight: 600;
`;

const SessionGroup = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  overflow: hidden;
`;

const SessionHeader = styled.div`
  background-color: #e9ecef;
  padding: 1rem 1.5rem;
  font-weight: 600;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: #f1f3f5;
`;

const Th = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

const Status = styled.span`
  padding: 0.25em 0.6em;
  border-radius: 10px;
  font-size: 0.85em;
  color: #fff;
  background-color: ${({ status }) => {
    switch (status) {
      case 'Present': return '#28a745';
      case 'Absent': return '#dc3545';
      case 'Late': return '#ffc107';
      case 'Excused': return '#17a2b8';
      default: return '#6c757d';
    }
  }};
`;

const AttendanceReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/attendance/report');
        setReportData(res.data.report);
      } catch (error) {
        console.error('Error fetching attendance report:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return <ReportContainer><p>Loading attendance report...</p></ReportContainer>;
  }

  if (reportData.length === 0) {
    return <ReportContainer><Title>Attendance Report</Title><p>No attendance records found.</p></ReportContainer>;
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString();

  return (
    <ReportContainer>
      <Title>Attendance Report</Title>
      {reportData.map((sessionGroup, index) => (
        <SessionGroup key={index}>
          <SessionHeader>{sessionGroup.course_name} - {sessionGroup.session_name}</SessionHeader>
          <Table>
            <Thead>
              <Tr>
                <Th><FaCalendarAlt /> Date</Th>
                <Th><FaUserGraduate /> Student Name</Th>
                <Th><FaClipboardCheck /> Attendance</Th>
                <Th><FaUser /> Added User</Th>
                <Th><FaClock /> Added Time</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sessionGroup.records.map((record, recIndex) => (
                <Tr key={recIndex}>
                  <Td>{formatDate(record.attendance_date)}</Td>
                  <Td>{record.student_name}</Td>
                  <Td><Status status={record.attendance_status}>{record.attendance_status}</Status></Td>
                  <Td>{record.added_user}</Td>
                  <Td>{formatTime(record.added_time)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </SessionGroup>
      ))}
    </ReportContainer>
  );
};

export default AttendanceReport; 