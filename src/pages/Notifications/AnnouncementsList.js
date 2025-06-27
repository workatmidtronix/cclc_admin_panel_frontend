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

const CourseLabel = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const SessionLabel = styled.span`
  background: #f3e5f5;
  color: #7b1fa2;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const MessageCell = styled.td`
  padding: 12px 20px;
  color: #2c3e50;
  font-size: 0.9rem;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SubjectCell = styled.td`
  padding: 12px 20px;
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 500;
`;

const LinkText = styled.span`
  color: #3498db;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AnnouncementsList = () => {
  const [announcementsData] = useState([
    {
      id: 1,
      course: 'EKG',
      session: 'Saturday EKG Dr. Fernando II Soto Avellanet 08/24/2023 @ Evergreen',
      message: 'https://us02web.zoom.us/j/88426031659?pwd=aWR1OEx263eTfqdvIGNnIU1Kt2TfhBJcdnlYevYSqAKMtz2u9',
      subject: 'Crime and Join me we will start in 10 minutes'
    },
    {
      id: 2,
      course: 'EKG',
      session: 'Saturday EKG Dr. Fernando II Soto Avellanet 08/24/2023 @ Evergreen',
      message: 'https://us02web.zoom.us/j/81889217537?pwd=42Gi8CfgPhpecUGTm2LJu2mBfTdHNW.zJJ9',
      subject: 'ZOOM INVITE'
    },
    {
      id: 3,
      course: 'EKG',
      session: 'Saturday EKG Dr. Fernando II Soto Avellanet 08/24/2023 @ Evergreen',
      message: 'https://us02web.zoom.us/j/81889217537?pwd=Tlf8LKD2&0gLqvPmcuc17Tm2L2nBfTdHNW.zJJ9',
      subject: 'Zoom Meeting'
    },
    {
      id: 4,
      course: 'EKG',
      session: 'Saturday EKG Dr. Fernando II Soto Avellanet 08/24/2023 @ Evergreen',
      message: 'Dear students: Quiz number 3 is now available online and it is mandatory to complete. You will have 15 minutes to answer all the questions. The quiz will close at midnight on Friday. All the best and keep in mind that we are in the final phase. Dr. Soto',
      subject: 'ONLINE QUIZ # 3 is now OPEN!!!!'
    },
    {
      id: 5,
      course: 'EKG',
      session: 'Saturday EKG Dr. Fernando II Soto Avellanet 08/24/2023 @ Evergreen',
      message: 'https://us02web.zoom.us/j/85377052297?pwd=cJmjdAcQnAfkMbQa2Scjpu9YVJJtOFMEZK2u9',
      subject: 'Zoom link - NOW!!!'
    },
    {
      id: 6,
      course: 'EKG',
      session: 'Saturday EKG Dr. Fernando II Soto Avellanet 08/24/2023 @ Evergreen',
      message: 'https://us02web.zoom.us/j/81936080188?pwd=Tf20Sl5k0BSHJStP6k17WIP9hz0Nfc0H9',
      subject: 'Link Zoom'
    },
    {
      id: 7,
      course: 'EKG',
      session: 'Saturday EKG Dr. Fernando II Soto Avellanet 08/24/2023 @ Evergreen',
      message: 'Dear Student Campbell: You have a missing quiz, that will expire this Friday at 9pm Please let me know when would you like me to open the quiz in Trainer Central for you. You only need 15 minutes to answer it. One again. The offer expires on Friday at 9pm Dr. Soto',
      subject: 'Missing Quiz'
    },
    {
      id: 8,
      course: 'EKG',
      session: 'Saturday EKG Dr. Fernando II Soto Avellanet 08/24/2023 @ Evergreen',
      message: 'B G is inviting you to a scheduled Zoom meeting. Topic: B G\'s Zoom Meeting Time: Aug 7, 2023 06:30 PM Central Time (US and Canada) Join Zoom Meeting https://us02web.zoom.us/j/84817201707?pwd=RO0J5dzkZHTlEUypJy4WNzL6xWVGcG09 Meeting ID: 848 1720 1707 Passcode: 720160',
      subject: 'ZOOM Review in 30 Minutes!'
    }
  ]);

  return (
    <Container>
      <Header>
        <Title>Announcements List</Title>
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
              <Th>Course</Th>
              <Th>Session</Th>
              <Th>Message</Th>
              <Th>Subject</Th>
            </tr>
          </Thead>
          <Tbody>
            {announcementsData.map(announcement => (
              <Tr key={announcement.id}>
                <Td></Td>
                <Td>
                  <CourseLabel>{announcement.course}</CourseLabel>
                </Td>
                <Td>
                  <SessionLabel>{announcement.session}</SessionLabel>
                </Td>
                <MessageCell>
                  {announcement.message.startsWith('https://') ? (
                    <LinkText>{announcement.message}</LinkText>
                  ) : (
                    announcement.message
                  )}
                </MessageCell>
                <SubjectCell>{announcement.subject}</SubjectCell>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AnnouncementsList; 