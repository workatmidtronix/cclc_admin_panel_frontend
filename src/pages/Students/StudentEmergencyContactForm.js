import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useEnrollmentFormData } from './StudentEnrollmentFormContext';

const Container = styled.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 40px 32px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 32px;
`;

const SubTitle = styled.div`
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 18px;
`;

const SchoolHeader = styled.div`
  text-align: center;
  margin-bottom: 18px;
`;

const SchoolLogo = styled.img`
  max-width: 350px;
  margin-bottom: 8px;
`;

const SchoolInfo = styled.div`
  font-size: 0.95rem;
  color: #222;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 18px;
`;

const Label = styled.label`
  min-width: 120px;
  font-weight: 500;
  color: #222;
`;

const BlankLine = styled.span`
  display: inline-block;
  min-width: 350px;
  border-bottom: 1px solid #333;
  margin-left: 8px;
  padding: 0 4px;
  font-weight: 500;
`;

const DownloadButton = styled.button`
  background: #334293;
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 32px auto 0 auto;
  display: block;

  &:hover {
    background: #2c3e50;
    transform: translateY(-2px);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #6c757d;
  font-size: 1.1rem;
  margin: 40px 0;
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  border: 1px solid #f5c6cb;
`;

const StudentEmergencyContactForm = () => {
  const { email } = useParams();
  const { data: student, loading, error } = useEnrollmentFormData();
  const docRef = useRef();

  const handleDownload = async () => {
    const input = docRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 40;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
    const fileName = `${student?.email || 'student'}_emergency_contact_form.pdf`;
    pdf.save(fileName);
  };

  if (loading) {
    return <Container><LoadingMessage>Loading student information...</LoadingMessage></Container>;
  }
  if (error || !student) {
    return <Container><ErrorMessage>{error || 'Student not found'}</ErrorMessage></Container>;
  }


  // Emergency contact fields (adjust field names as per your DB)
  const contacts = [
    {
      name: student.emergencyContact1Name || 'N/A',
      number: student.emergencyContact1Number || 'N/A',
      relationship: student.emergencyContact1Relationship || 'N/A',
    },
    {
      name: student.emergencyContact2Name || 'N/A',
      number: student.emergencyContact2Number || 'N/A',
      relationship: student.emergencyContact2Relationship || 'N/A',
    },
    {
      name: student.emergencyContact3Name || 'N/A',
      number: student.emergencyContact3Number || 'N/A',
      relationship: student.emergencyContact3Relationship || 'N/A',
    },
  ];

  return (
    <Container>
      <div ref={docRef} style={{ background: '#fff', color: '#222', padding: 0 }}>
        <SchoolHeader>
          <SchoolLogo src={process.env.PUBLIC_URL + '/CCLC_logo.jpg'} alt="Chicago Community Learning Center Logo" />
          <SchoolInfo>
            Chicago Campus: 840 W. Irving Park Road, suite 203, Illinois 60613 Office: (773) 506-1503<br />
            Evergreen Campus: 9730 S. Western Ave, suite 502, Evergreen Park Illinois 60805<br />
            www.cclctraining.org
          </SchoolInfo>
        </SchoolHeader>
        <Title>EMERGENCY CONTACT FORM</Title>
        {contacts.map((contact, idx) => (
          <FormSection key={idx}>
            <FormRow>
              <Label>Name:</Label>
              <BlankLine>{contact.name}</BlankLine>
            </FormRow>
            <FormRow>
              <Label>Number:</Label>
              <BlankLine>{contact.number}</BlankLine>
            </FormRow>
            <FormRow>
              <Label>Relationship:</Label>
              <BlankLine>{contact.relationship}</BlankLine>
            </FormRow>
          </FormSection>
        ))}
      </div>
      <DownloadButton onClick={handleDownload}>Download as PDF</DownloadButton>
    </Container>
  );
};

export default StudentEmergencyContactForm; 