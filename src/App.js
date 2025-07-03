import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Components
import Login from './components/Login';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AlertManager } from './components/CustomAlert';
import AppInitializer from './components/AppInitializer';

// Pages
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/Students/AddStudent';
import AssignSession from './pages/Students/AssignSession';
import StudentList from './pages/Students/StudentList';
import BulkSendDocument from './pages/Students/BulkSendDocument';
import PreviousCourse from './pages/Students/PreviousCourse';
import AppliedCandidates from './pages/Applications/AppliedCandidates';
import AllAppliedCandidates from './pages/Applications/AllAppliedCandidates';
import AddAttendance from './pages/Attendance/AddAttendance';
import AttendanceReportPage from './pages/Attendance/AttendanceReport';
import MonthlyAttendance from './pages/Attendance/MonthlyAttendance';

// Instructor Management
import AddEmployee from './pages/Instructors/AddEmployee';
import AllInstructors from './pages/Instructors/AllInstructors';

// Staff Management
import AddStaff from './pages/Staff/AddStaff';
import AllStaffs from './pages/Staff/AllStaffs';

// Sessions and Courses
import Sessions from './pages/Sessions/Sessions';
import Courses from './pages/Courses/Courses';

// Notifications
import SendAnnouncement from './pages/Notifications/SendAnnouncement';
import AnnouncementsList from './pages/Notifications/AnnouncementsList';
import SendSMS from './pages/Notifications/SendSMS';
import AllSMS from './pages/Notifications/AllSMS';
import SMSChat from './pages/Notifications/SMSChat';
import SendPassword from './pages/Notifications/SendPassword';

// Profile Management
import AcademicYear from './pages/Profile/AcademicYear';
import Departments from './pages/Profile/Departments';
import Semesters from './pages/Profile/Semesters';
import Designations from './pages/Profile/Designations';
import Locations from './pages/Profile/Locations';
import DaysPreferred from './pages/Profile/DaysPreferred';
import Individuals from './pages/Profile/Individuals';
import Workforces from './pages/Profile/Workforces';
import MasterData from './pages/Profile/MasterData';

// Update Course & Session
import UpdateCourseSession from './pages/UpdateCourseSession';
import StudentAcknowledgmentForm from './pages/Students/StudentAcknowledgmentForm';
import StudentEmergencyContactForm from './pages/Students/StudentEmergencyContactForm';
import Vouchers from './pages/Students/Vouchers';
import { StudentEnrollmentFormProvider } from './pages/Students/StudentEnrollmentFormContext';

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <Router>
          <AlertManager />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Sessions and Courses Routes */}
            <Route path="/sessions" element={
              <ProtectedRoute>
                <Layout>
                  <Sessions />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/courses" element={
              <ProtectedRoute>
                <Layout>
                  <Courses />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Notifications Routes */}
            <Route path="/notifications/send-announcement" element={
              <ProtectedRoute>
                <Layout>
                  <SendAnnouncement />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/notifications/announcements-list" element={
              <ProtectedRoute>
                <Layout>
                  <AnnouncementsList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/notifications/send-sms" element={
              <ProtectedRoute>
                <Layout>
                  <SendSMS />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/notifications/all-sms" element={
              <ProtectedRoute>
                <Layout>
                  <AllSMS />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/notifications/sms-chat" element={
              <ProtectedRoute>
                <Layout>
                  <SMSChat />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/notifications/send-password" element={
              <ProtectedRoute>
                <Layout>
                  <SendPassword />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/students/add" element={
              <ProtectedRoute>
                <Layout>
                  <AddStudent />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/students/list" element={
              <ProtectedRoute>
                <Layout>
                  <StudentList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/students/assign-session" element={
              <ProtectedRoute>
                <Layout>
                  <AssignSession />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/students/bulk-send-document" element={
              <ProtectedRoute>
                <Layout>
                  <BulkSendDocument />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/students/previous-course" element={
              <ProtectedRoute>
                <Layout>
                  <PreviousCourse />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/students/vouchers" element={
              <ProtectedRoute>
                <Layout>
                  <Vouchers />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Instructor Routes */}
            <Route path="/instructors/add" element={
              <ProtectedRoute>
                <Layout>
                  <AddEmployee />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/instructors/all" element={
              <ProtectedRoute>
                <Layout>
                  <AllInstructors />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Staff Routes */}
            <Route path="/staff/add" element={
              <ProtectedRoute>
                <Layout>
                  <AddStaff />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/staff/all" element={
              <ProtectedRoute>
                <Layout>
                  <AllStaffs />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Attendance Routes */}
            {/* <Route path="/attendance/add" element={
              <ProtectedRoute>
                <Layout>
                  <AddAttendance />
                </Layout>
              </ProtectedRoute>
            } />
             */}
            {/* <Route path="/attendance/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <AttendanceDashboard />
                </Layout>
              </ProtectedRoute>
            } /> */}
            
            <Route path="/attendance/monthly" element={
              <ProtectedRoute>
                <Layout>
                  <MonthlyAttendance />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Applications Routes */}
            <Route path="/applications/applied-candidates" element={
              <ProtectedRoute>
                <Layout>
                  <AllAppliedCandidates />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/applications/all-applied-candidates" element={
              <ProtectedRoute>
                <Layout>
                  <AllAppliedCandidates />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Profile Management Routes */}
            <Route path="/profile/academic-year" element={
              <ProtectedRoute>
                <Layout>
                  <AcademicYear />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile/departments" element={
              <ProtectedRoute>
                <Layout>
                  <Departments />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile/semesters" element={
              <ProtectedRoute>
                <Layout>
                  <Semesters />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile/designations" element={
              <ProtectedRoute>
                <Layout>
                  <Designations />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile/locations" element={
              <ProtectedRoute>
                <Layout>
                  <Locations />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile/days-preferred" element={
              <ProtectedRoute>
                <Layout>
                  <DaysPreferred />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile/individuals" element={
              <ProtectedRoute>
                <Layout>
                  <Individuals />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile/workforces" element={
              <ProtectedRoute>
                <Layout>
                  <Workforces />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile/master-data" element={
              <ProtectedRoute>
                <Layout>
                  <MasterData />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Update Course & Session Route */}
            <Route path="/update-course-session" element={
              <ProtectedRoute>
                <Layout>
                  <UpdateCourseSession />
                </Layout>
              </ProtectedRoute>
            } />

            {/* Student Acknowledgment Route */}
            <Route path="/student-acknowledgment/:email" element={
              <StudentEnrollmentFormProvider email={window.location.pathname.split('/').pop()}>
                <StudentAcknowledgmentForm />
              </StudentEnrollmentFormProvider>
            } />
            {/* Emergency Contact Form (view only) */}
            <Route path="/student-emergency-contact/:email" element={
              <StudentEnrollmentFormProvider email={window.location.pathname.split('/').pop()}>
                <StudentEmergencyContactForm />
              </StudentEnrollmentFormProvider>
            } />

            {/* Default redirect to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AppInitializer>
    </Provider>
  );
}

export default App;
