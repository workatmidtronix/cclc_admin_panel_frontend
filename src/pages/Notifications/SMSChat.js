import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaList, FaPaperPlane } from 'react-icons/fa';

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
  line-height: 1.5;
`;

const ExpandedMessage = styled.div`
  background: #f8f9fa;
  padding: 15px;
  margin: 5px 0;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  font-size: 0.9rem;
  line-height: 1.6;
`;

const DateCell = styled.td`
  padding: 12px 20px;
  color: #666;
  font-size: 0.85rem;
`;

const StatusCell = styled.td`
  padding: 12px 20px;
  font-size: 0.9rem;
`;

const SendButton = styled.button`
  background: rgb(51, 66, 147);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background:rgb(40, 23, 161) 66, 147);
  }
`;

const FooterInfo = styled.div`
  padding: 15px 20px;
  border-top: 1px solid #e9ecef;
  color: #666;
  font-size: 0.9rem;
  text-align: center;
`;

const SMSChat = () => {
  const [chatData] = useState([
    {
      id: 1,
      sendToReceived: 'Sent',
      message: 'Dear students: Quiz number 3 is now available online and it is mandatory to complete. You will have 15 minutes to answer all the questions. The quiz will close at midnight on Friday. All the best and keep in mind that we are in the final phase. Dr. Soto https://us02web.zoom.us/j/85377052299?pwd=6jqhG1NHdjNMTsStaUJ9MvdMkT5Sezx9Wud9U',
      date: '08/08/23',
      status: '',
      sendSMS: true
    },
    {
      id: 2,
      sendToReceived: 'Sent',
      message: 'B G is inviting you to a scheduled Zoom meeting. Topic: B G\'s Zoom Meeting Time: Aug 7, 2023 06:30 PM Central Time (US and Canada) Join Zoom Meeting https://us02web.zoom.us/j/84817201707?pwd=R00J5dzkZHTlEUypJy4WNzL6xWVGcG09 Meeting ID: 848 1720 1707 Passcode: 720160',
      date: '08/02/23',
      status: '',
      sendSMS: true
    },
    {
      id: 3,
      sendToReceived: 'Sent',
      message: 'One tap mobile +13092063328,,84817201707#,,,,*720160# US (Chicago) +13062051328,,84817201707#,,,,*720160# US +13012254888,,84817201707#,,,,*720160# US +19929845807,,84817201707#,,,,*720160# US (New York) +15672002400,,84817201707#,,,,*720160# US +19672006289,,84817201707#,,,,*720160# US +16132905500,,84817201707#,,,,*720160# US +18888881077,,84817201707#,,,,*720160# US +16189031878,,84817201707#,,,,*720160# US +13092063328,,84817201707#,,,,*720160# US (Chicago) Dial by location +13092063328,,84817201707#,,,,*720160# US (Chicago) +13062051328,,84817201707#,,,,*720160# US',
      date: '08/02/23',
      status: '',
      sendSMS: true
    },
    {
      id: 4,
      sendToReceived: 'Sent',
      message: 'Meeting ID: 848 1720 1707 Passcode: 720160 --- Find your local number: https://us02web.zoom.us/u/KzEMfPSsP) DR SOTO Dear Students, Here is the link, see you all at 6:30pm https://us02web.zoom.us/j/84217978847?pwd=M5YWh5OT2NjlhQN2KGRnhJLGwUTf9',
      date: '07/23/23',
      status: '',
      sendSMS: true
    },
    {
      id: 5,
      sendToReceived: 'Sent',
      message: 'Dr. Soto',
      date: '07/23/23',
      status: '',
      sendSMS: true
    }
  ]);

  const handleSendSMS = (id) => {
    console.log('Sending SMS for message:', id);
  };

  return (
    <Container>
      <Header>
        <Title>SMS Chat</Title>
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
              <Th>Send To / Received From</Th>
              <Th>Message</Th>
              <Th>Date</Th>
              <Th>Status</Th>
              <Th>Send SMS</Th>
            </tr>
          </Thead>
          <Tbody>
            {chatData.map(chat => (
              <Tr key={chat.id}>
                <Td></Td>
                <Td>{chat.sendToReceived}</Td>
                <MessageCell>
                  <ExpandedMessage>
                    {chat.message}
                  </ExpandedMessage>
                </MessageCell>
                <DateCell>{chat.date}</DateCell>
                <StatusCell>{chat.status}</StatusCell>
                <Td>
                  {chat.sendSMS && (
                    <SendButton onClick={() => handleSendSMS(chat.id)}>
                      <FaPaperPlane />
                    </SendButton>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <FooterInfo>
          Showing 257 of 257
        </FooterInfo>
      </TableContainer>
    </Container>
  );
};

export default SMSChat; 