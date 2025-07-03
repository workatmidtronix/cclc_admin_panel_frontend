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

const Section = styled.div`
  margin-bottom: 18px;
`;

const List = styled.ol`
  margin-left: 18px;
  margin-bottom: 18px;
  font-size: 1rem;
`;

const Statement = styled.p`
  margin: 18px 0 8px 0;
  font-size: 1rem;
`;

const Blank = styled.span`
  display: inline-block;
  min-width: 120px;
  border-bottom: 1px solid #333;
  margin: 0 4px;
  padding: 0 4px;
  font-weight: 500;
`;

const SignatureRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 32px;
  font-size: 1rem;
`;

const SigLabel = styled.span`
  min-width: 120px;
  color: #222;
`;

const SigValue = styled.span`
  min-width: 180px;
  border-bottom: 1px solid #333;
  margin: 0 8px;
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

const StudentAcknowledgmentForm = () => {
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
    const fileName = `${student?.email || 'student'}_acknowledgement_form.pdf`;
    pdf.save(fileName);
  };

  if (loading) {
    return <Container><LoadingMessage>Loading student information...</LoadingMessage></Container>;
  }
  if (error || !student) {
    return <Container><ErrorMessage>{error || 'Student not found'}</ErrorMessage></Container>;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString();

  return (
    <Container>
      <div ref={docRef} style={{ background: '#fff', color: '#222', padding: 0 }}>
        <Title>Student Acknowledgement</Title>
        <Section style={{ fontWeight: 500, marginBottom: 10 }}>The Applicant Understands:</Section>
        <List>
          <li>Chicago Community Learning Center is an Illinois Board of Higher Education (IBHE) licensed facility as a Private Vocational School in Health-Career Education; we do not accept credit from previous education entities or any experimental learning, or CLEP.</li>
          <li>Chicago Community Learning Center only assists with Job Placement in the Field of health-care study, but we DO NOT guarantee job placement.</li>
          <li>Chicago Community Learning Center reserves the right to discontinue training for unsatisfactory progress, non-payment of fees or failure to abide by school guidelines.</li>
          <li>Chicago Community Learning Center reserves the right to reschedule the training start date when the number of participants scheduled is too small.</li>
          <li>Under WIOA tuition ITA, Chicago Community Learning Center only pays for license exams once for C.N.A State License, Patient Care Technician License with EKG & Phlebotomy. Retakes of any license exam is the responsibility of the student.</li>
        </List>
        <Statement>
          <Blank style={{ minWidth: 200 }}>{student.firstName} {student.lastName}</Blank> I have carefully read and received an exact copy of the acknowledgement
        </Statement>
        <Statement>
          <Blank style={{ minWidth: 200 }}>{student.firstName} {student.lastName}</Blank> I understand that Chicago Community Learning Center may terminate my Contract agreement if I fail to comply with attendance and financial requirement or if I disrupt the normal activities of training. I understand that my financial obligation to Chicago Community Learning Center must be paid in full before a certification may be awarded.
        </Statement>
        <SignatureRow style={{ marginTop: 40 }}>
          <SigLabel>Student Signature:</SigLabel>
          <SigValue>{student.firstName} {student.lastName}</SigValue>
          <SigLabel>Printed:</SigLabel>
          <SigValue>{student.firstName} {student.lastName}</SigValue>
          
        </SignatureRow>
        <SignatureRow style={{ marginTop: 10 }}>
        <SigLabel>Date:</SigLabel>
        <SigValue>{dateStr}</SigValue>
          <SigLabel>Email:</SigLabel>
          <SigValue>{student.email}</SigValue>
        </SignatureRow>
      </div>
      <DownloadButton onClick={handleDownload}>Download as PDF</DownloadButton>
    </Container>
  );
};

export default StudentAcknowledgmentForm; 