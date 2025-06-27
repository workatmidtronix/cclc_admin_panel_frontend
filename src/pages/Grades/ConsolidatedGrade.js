import React, { useState } from 'react';
import styled from 'styled-components';
import { FaFilePdf, FaDownload } from 'react-icons/fa';
import { showInfo } from '../../components/CustomAlert';

const Container = styled.div`
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background:rgb(17, 114, 179);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const FilterContainer = styled.div`
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: end;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 14px;
  
  &::after {
    content: "*";
    color: #dc3545;
    margin-left: 4px;
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  color: #333;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
  
  option {
    color: #333;
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
  
    &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ContentContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoRecordsMessage = styled.div`
  color: #6c757d;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

const ConsolidatedGrade = () => {
  const [filters, setFilters] = useState({
    course: '',
    session: ''
  });

  const courses = [
    'EKG',
    'CPR/AED/BLS',
    'CNA',
    'Phlebotomy',
    'Medical Assistant',
    'Pharmacy Technician'
  ];

  const sessions = [
    'Morning Session',
    'Afternoon Session',
    'Evening Session',
    'Weekend Session',
    'Mon/Wed Session',
    'Tue/Thu Session',
    'Saturday Session'
  ];

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log('Searching consolidated grades with filters:', filters);
    // Here you would typically fetch consolidated grade data based on filters
    // For now, we'll just show "No Records found" as in the image
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePDF = () => {
    showInfo('PDF generation would be implemented here');
  };

  return (
    <Container>
      <Header>
        <Title>Consolidated Grade</Title>
        <ActionButtons>
          <ActionButton onClick={handlePrint}>Print</ActionButton>
          <ActionButton onClick={handleGeneratePDF}>PDF</ActionButton>
        </ActionButtons>
      </Header>
      
      <FilterContainer>
        <FilterRow>
          <FilterGroup>
            <Label>Course</Label>
            <Select 
              value={filters.course}
              onChange={(e) => handleFilterChange('course', e.target.value)}
            >
              <option value="">--Select--</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <Label>Session</Label>
            <Select 
              value={filters.session}
              onChange={(e) => handleFilterChange('session', e.target.value)}
            >
              <option value="">--Select--</option>
              {sessions.map((session, index) => (
                <option key={index} value={session}>{session}</option>
              ))}
            </Select>
          </FilterGroup>
          
          <SearchButton onClick={handleSearch}>
            Search
          </SearchButton>
        </FilterRow>
      </FilterContainer>
      
      <ContentContainer>
        <NoRecordsMessage>
          No Records found
        </NoRecordsMessage>
      </ContentContainer>
    </Container>
  );
};

export default ConsolidatedGrade; 