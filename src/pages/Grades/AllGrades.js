import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
`;

const FilterContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 100px 150px 2fr 120px 150px;
  background: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  color: #333;
`;

const HeaderCell = styled.div`
  padding: 15px 12px;
  border-right: 1px solid #dee2e6;
  font-size: 14px;
  
  &:last-child {
    border-right: none;
  }
`;

const ExpandableSection = styled.div`
  border-bottom: 1px solid #eee;
`;

const SectionHeader = styled.div`
  background: #e9ecef;
  padding: 10px 12px;
  font-size: 13px;
  color: #6c757d;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &::before {
    content: "▶";
    margin-right: 8px;
    transition: transform 0.2s;
  }
  
  &.expanded::before {
    transform: rotate(90deg);
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 100px 150px 2fr 120px 150px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableCell = styled.div`
  padding: 12px;
  border-right: 1px solid #eee;
  font-size: 14px;
  color: #333;
  
  &:last-child {
    border-right: none;
  }
`;

const CourseCell = styled(TableCell)`
  color: #007bff;
  font-weight: 500;
`;

const CategoryCell = styled(TableCell)`
  font-weight: 500;
`;

const NameCell = styled(TableCell)`
  color: #007bff;
`;

const PointsCell = styled(TableCell)`
  text-align: center;
  font-weight: 500;
`;

const CalculationCell = styled(TableCell)`
  text-align: center;
  
  &.true {
    color: #28a745;
    font-weight: 500;
  }
  
  &.false {
    color: #dc3545;
    font-weight: 500;
  }
`;

const AllGrades = () => {
  const [selectedGrades, setSelectedGrades] = useState('');
  const [expandedSections, setExpandedSections] = useState({});
  const [gradeData, setGradeData] = useState([]);

  const gradeTypes = [
    'All Grade Items',
    'Recent Grades',
    'Active Assignments',
    'Completed Assignments',
    'Draft Assignments'
  ];

  useEffect(() => {
    // Sample all grades data matching the image
    const sampleData = [
      {
        id: 1,
        course: 'EKG',
        category: 'Homework',
        name: 'Homework Chapter 1',
        maxPoints: 1,
        includeInCalculation: true,
        section: 'Saturday EKG Dr. Fernando || Soto Avellanet 06/24/2023 @ Evergreen'
      },
      {
        id: 2,
        course: 'EKG',
        category: 'Quizzes',
        name: 'Quiz 1 - Chapter 1 & 2',
        maxPoints: 40,
        includeInCalculation: true,
        section: 'Saturday EKG Dr. Fernando || Soto Avellanet 06/24/2023 @ Evergreen'
      },
      {
        id: 3,
        course: 'EKG',
        category: 'Homework',
        name: 'Homework Chapter 5, 6 & 8',
        maxPoints: 3,
        includeInCalculation: true,
        section: 'Saturday EKG Dr. Fernando || Soto Avellanet 06/24/2023 @ Evergreen'
      },
      {
        id: 4,
        course: 'EKG',
        category: 'Exams',
        name: 'Exam 1 = Chapter 3, 4, & 8',
        maxPoints: 100,
        includeInCalculation: true,
        section: 'Saturday EKG Dr. Fernando || Soto Avellanet 06/24/2023 @ Evergreen'
      },
      {
        id: 5,
        course: 'EKG',
        category: 'Homework',
        name: 'Homework Chapter 4',
        maxPoints: 1,
        includeInCalculation: true,
        section: 'Saturday EKG Dr. Fernando || Soto Avellanet 06/24/2023 @ Evergreen'
      },
      {
        id: 6,
        course: 'EKG',
        category: 'Homework',
        name: 'Homework Chapters 2 & 3',
        maxPoints: 2,
        includeInCalculation: true,
        section: 'Saturday EKG Dr. Fernando || Soto Avellanet 06/24/2023 @ Evergreen'
      },
      {
        id: 7,
        course: 'EKG',
        category: 'Clinical (EKG Lab)',
        name: 'Clinical Quiz- EKG Machine Set Up, Patient Bedside Manners & Leads Placement',
        maxPoints: 5,
        includeInCalculation: true,
        section: 'Saturday EKG Dr. Fernando || Soto Avellanet 06/24/2023 @ Evergreen'
      },
      {
        id: 8,
        course: 'EKG',
        category: 'Exams',
        name: 'Exam 2 = Chapter 5, 6, 7 & 9',
        maxPoints: 100,
        includeInCalculation: false,
        section: 'Saturday EKG Dr. Fernando || Soto Avellanet 06/24/2023 @ Evergreen'
      },
      {
        id: 9,
        course: 'EKG',
        category: 'Quizzes',
        name: 'Quiz 2 - Chapter 7 and 9',
        maxPoints: 40,
        includeInCalculation: false,
        section: 'Saturday EKG Dr. Fernando || Soto Avellanet 06/24/2023 @ Evergreen'
      }
    ];
    
    setGradeData(sampleData);
    setExpandedSections({ 'Saturday EKG Dr. Fernando || Soto Avellanet 06/24/2023 @ Evergreen': true });
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const groupedData = gradeData.reduce((acc, record) => {
    const section = record.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(record);
    return acc;
  }, {});

  return (
    <Container>
      <Title>All Grades</Title>
      
      <FilterContainer>
        <FilterSelect 
          value={selectedGrades} 
          onChange={(e) => setSelectedGrades(e.target.value)}
        >
          <option value="">All Grades</option>
          {gradeTypes.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </FilterSelect>
      </FilterContainer>
      
      <TableContainer>
        {Object.entries(groupedData).map(([section, records]) => (
          <ExpandableSection key={section}>
            <SectionHeader 
              className={expandedSections[section] ? 'expanded' : ''}
              onClick={() => toggleSection(section)}
            >
              {section}
            </SectionHeader>
            
            {expandedSections[section] && (
              <>
                <TableHeader>
                  <HeaderCell>Course</HeaderCell>
                  <HeaderCell>Category</HeaderCell>
                  <HeaderCell>Name</HeaderCell>
                  <HeaderCell>Max Points</HeaderCell>
                  <HeaderCell>Is Include In Calculation?</HeaderCell>
                </TableHeader>
                
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <CourseCell>{record.course}</CourseCell>
                    <CategoryCell>{record.category}</CategoryCell>
                    <NameCell>{record.name}</NameCell>
                    <PointsCell>{record.maxPoints}</PointsCell>
                    <CalculationCell className={record.includeInCalculation.toString()}>
                      {record.includeInCalculation.toString()}
                    </CalculationCell>
                  </TableRow>
                ))}
              </>
            )}
          </ExpandableSection>
        ))}
      </TableContainer>
    </Container>
  );
};

export default AllGrades; 