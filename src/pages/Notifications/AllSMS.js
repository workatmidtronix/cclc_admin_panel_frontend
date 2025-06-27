import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaList } from 'react-icons/fa';

const Container = styled.div`
  padding: 30px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid #e9ecef;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  
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
  
  &:first-child {
    width: 40px;
  }
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  border-bottom: 1px solid #e9ecef;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const Td = styled.td`
  padding: 12px 20px;
  color: #2c3e50;
  font-size: 0.9rem;
  
  &:first-child {
    width: 40px;
  }
`;

const MessageCell = styled.td`
  padding: 12px 20px;
  color: #2c3e50;
  font-size: 0.9rem;
  max-width: 400px;
`;

const CourseLabel = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const StudentName = styled.span`
  font-weight: 500;
`;

const SelectAllLabel = styled.span`
  font-style: italic;
  color: #666;
`;

const AllSMS = () => {
  const [smsData] = useState([
    {
      id: 1,
      message: 'Hello monkey how are you?',
      course: 'EKG',
      student: 'false',
      selectAllStudents: false
    },
    {
      id: 2,
      message: 'Hello Sheila, How are you?',
      course: 'EKG',
      student: 'false',
      selectAllStudents: false
    },
    {
      id: 3,
      message: 'TEST',
      course: 'EKG',
      student: 'false',
      selectAllStudents: false
    }
  ]);

  return (
    <Container>
      <Header>
        <Title>All SMS</Title>
      </Header>

      <TableContainer>
        <TableHeader>
          <div></div>
          <HeaderActions>
            <ActionButton>
              <FaSearch />
            </ActionButton>
            <ActionButton>
              <FaPlus />
            </ActionButton>
            <ActionButton>
              <FaList />
            </ActionButton>
          </HeaderActions>
        </TableHeader>

        <Table>
          <Thead>
            <tr>
              <Th></Th>
              <Th>Message</Th>
              <Th>Course</Th>
              <Th>Student</Th>
              <Th>Select all students</Th>
            </tr>
          </Thead>
          <Tbody>
            {smsData.map(sms => (
              <Tr key={sms.id}>
                <Td></Td>
                <MessageCell>{sms.message}</MessageCell>
                <Td>
                  <CourseLabel>{sms.course}</CourseLabel>
                </Td>
                <Td>
                  {sms.student === 'false' ? (
                    <SelectAllLabel>false</SelectAllLabel>
                  ) : (
                    <StudentName>{sms.student}</StudentName>
                  )}
                </Td>
                <Td>
                  <SelectAllLabel>{sms.selectAllStudents ? 'true' : 'false'}</SelectAllLabel>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AllSMS; 