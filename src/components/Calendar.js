import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaPlus, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../utils/calendarApi';

const CalendarContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const CalendarTitle = styled.h3`
  margin: 0;
  color: #2c3e50;
  font-size: 1.3rem;
`;

const ViewTabs = styled.div`
  display: flex;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
`;

const ViewTab = styled.button`
  background: ${props => props.active ? 'rgb(51, 66, 147);' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? 'rgb(51, 66, 147);' : '#f8f9fa'};
  }
`;

const CalendarControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const NavigationButton = styled.button`
  background: none;
  border: 1px solid #e9ecef;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    border-color: #dee2e6;
  }
`;

const MonthYearDisplay = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.1rem;
  min-width: 140px;
  text-align: center;
`;

const TodayButton = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6fd8;
  }
`;

const AddEventButton = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6fd8;
  }
`;

const CalendarGrid = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
`;

const CalendarRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DayHeader = styled.div`
  background: #f8f9fa;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 1px solid #e9ecef;
  font-size: 0.9rem;

  &:not(:last-child) {
    border-right: 1px solid #e9ecef;
  }
`;

const CalendarDay = styled.div`
  min-height: 100px;
  padding: 8px;
  border-bottom: 1px solid #e9ecef;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:not(:last-child) {
    border-right: 1px solid #e9ecef;
  }

  &:hover {
    background: #f8f9fa;
  }

  ${props => props.otherMonth && `
    color: #bdc3c7;
    background: #fafafa;
  `}

  ${props => props.today && `
    background: #e3f2fd;
    
    &::before {
      content: '';
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      background: #2196f3;
      border-radius: 50%;
    }
  `}
`;

const DayNumber = styled.div`
  font-weight: 500;
  margin-bottom: 4px;
`;

const Event = styled.div`
  background: ${props => props.color || 'rgb(51, 66, 147);'};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 2px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }
`;

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: 25px 30px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border-radius: 15px 15px 0 0;
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6c757d;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  
  &:hover {
    background: #e9ecef;
    color: #2c3e50;
  }
`;

const ModalBody = styled.div`
  padding: 30px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  &:after {
    content: ${props => props.required ? '" *"' : '""'};
    color: #dc3545;
  }
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 80px;
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: rgb(51, 66, 147);;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
`;

const SubmitButton = styled.button`
  background: rgb(51, 66, 147);;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const ResetButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6268;
    transform: translateY(-1px);
  }
`;

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('Month');
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    color: '#3788d8',
    location: '',
    from: '',
    to: '',
    allDay: false
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Fetch events for the current month
  useEffect(() => {
    const fetchCalendarEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().slice(0, 10) + ' 00:00:00';
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().slice(0, 10) + ' 23:59:59';
        const events = await fetchEvents({ start, end });
        setEvents(events.map(ev => ({
          ...ev,
          date: new Date(ev.start),
        })));
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchCalendarEvents();
  }, [currentDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add days from previous month
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.getDate() - i,
        isOtherMonth: true,
        fullDate: new Date(year, month - 1, prevMonth.getDate() - i)
      });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isOtherMonth: false,
        fullDate: new Date(year, month, day)
      });
    }

    // Add days from next month to fill the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: day,
        isOtherMonth: true,
        fullDate: new Date(year, month + 1, day)
      });
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const openModal = () => {
    setSelectedEvent(null);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({
      title: '',
      description: '',
      type: '',
      color: '#3788d8',
      location: '',
      from: '',
      to: '',
      allDay: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        start_date: formData.from,
        end_date: formData.to,
        all_day: formData.allDay,
        event_type: formData.type,
        color: formData.color,
        location: formData.location
      };
      let newEvent;
      if (selectedEvent) {
        newEvent = await updateEvent(selectedEvent.id, eventPayload);
        setEvents(events => events.map(ev => ev.id === newEvent.id ? { ...newEvent, date: new Date(newEvent.start) } : ev));
      } else {
        newEvent = await createEvent(eventPayload);
        setEvents(events => [...events, { ...newEvent, date: new Date(newEvent.start) }]);
      }
      closeModal();
    } catch (err) {
      setError('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      color: '#3788d8',
      location: '',
      from: '',
      to: '',
      allDay: false
    });
  };

  const handleDelete = async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteEvent(eventId);
      setEvents(events => events.filter(ev => ev.id !== eventId));
      closeModal();
    } catch (err) {
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      type: event.type,
      color: event.color,
      location: event.location,
      from: event.start?.slice(0, 16),
      to: event.end?.slice(0, 16),
      allDay: event.allDay
    });
    setShowModal(true);
  };

  const days = getDaysInMonth(currentDate);
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>Academic Calendar</CalendarTitle>
        <CalendarControls>
         
          <NavigationButton onClick={() => navigateMonth(-1)}>
            <FaChevronLeft />
          </NavigationButton>
          <MonthYearDisplay>
            {months[currentDate.getMonth()]}, {currentDate.getFullYear()}
          </MonthYearDisplay>
          <NavigationButton onClick={() => navigateMonth(1)}>
            <FaChevronRight />
          </NavigationButton>
          <TodayButton onClick={goToToday}>
            Today
          </TodayButton>
          <AddEventButton onClick={openModal}>
            <FaPlus />
            Add Event
          </AddEventButton>
        </CalendarControls>
      </CalendarHeader>

      <CalendarGrid>
        <CalendarRow>
          {daysOfWeek.map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}
        </CalendarRow>
        {weeks.map((week, weekIndex) => (
          <CalendarRow key={weekIndex}>
            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDate(day.fullDate);
              return (
                <CalendarDay
                  key={`${weekIndex}-${dayIndex}`}
                  otherMonth={day.isOtherMonth}
                  today={isToday(day.fullDate)}
                >
                  <DayNumber>{day.date}</DayNumber>
                  {dayEvents.map(event => (
                    <Event
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      color={event.color}
                    >
                      {event.title}
                    </Event>
                  ))}
                </CalendarDay>
              );
            })}
          </CalendarRow>
        ))}
      </CalendarGrid>

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</ModalTitle>
              <CloseButton onClick={closeModal}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              {error && (
                <div style={{
                  background: '#f8d7da',
                  color: '#721c24',
                  padding: '10px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  border: '1px solid #f5c6cb'
                }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label required>Location</Label>
                  <Select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-Select-</option>
                    <option value="Ever Green Campus">Ever Green Campus</option>
                    <option value="Main Campus">Main Campus</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label required>Title</Label>
                  <Input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Event title"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Description</Label>
                  <TextArea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Event description"
                  />
                </FormGroup>

                <FormGroup>
                  <Label required>Type</Label>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-Select-</option>
                    <option value="class">Class</option>
                    <option value="meeting">Meeting</option>
                    <option value="exam">Exam</option>
                    <option value="holiday">Holiday</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Color</Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Input
                      type="color"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      style={{ width: '50px', height: '40px', padding: '0' }}
                    />
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                      Choose event color
                    </span>
                  </div>
                </FormGroup>

                <FormGroup>
                  <Label required>From</Label>
                  <Input
                    type="datetime-local"
                    name="from"
                    value={formData.from}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label required>To</Label>
                  <Input
                    type="datetime-local"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <input
                      type="checkbox"
                      name="allDay"
                      checked={formData.allDay}
                      onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))}
                    />
                    All Day Event
                  </Label>
                </FormGroup>

                <ButtonGroup>
                  <ResetButton type="button" onClick={handleReset}>
                    Reset
                  </ResetButton>
                  {selectedEvent && (
                    <button
                      type="button"
                      onClick={() => handleDelete(selectedEvent.id)}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease'
                      }}
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                  <SubmitButton type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (selectedEvent ? 'Update' : 'Submit')}
                  </SubmitButton>
                </ButtonGroup>
              </form>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </CalendarContainer>
  );
};

export default Calendar; 