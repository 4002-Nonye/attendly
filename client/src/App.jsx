import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import LinkAccountPage from './pages/auth/LinkAccountPage';

import CompleteProfile from './pages/auth/CompleteProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import CompleteProfileProtected from './components/CompleteProfileProtected';
import DashboardPage from './pages/dashboard/DashboardPage';
import PublicRoute from './components/PublicRoute';
import CoursePage from './pages/course/CoursePage';
import FacultyPage from './pages/faculty/FacultyPage';
import DepartmentPage from './pages/department/DepartmentPage';
import SessionPage from './pages/session/SessionPage';
import SessionDetailsPage from './pages/session/SessionDetailsPage';
import ActiveSessions from './pages/session/ActiveSessions';
import LecturerPage from './pages/users/LecturerPage';
import StudentPage from './pages/users/StudentPage';
import AttendanceOverviewPage from './pages/attendance/AttendanceOverviewPage';
import AttendancePage from './pages/attendance/AttendancePage';
import AttendanceDetailsPage from './pages/attendance/AttendanceDetailsPage';
import AttendanceStudentsDetailsPage from './pages/attendance/AttendanceStudentsDetailsPage';
import AttendanceReport from './features/attendance/lecturer/AttendanceReport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/link-account' element={<LinkAccountPage />} />
        <Route
          path='/complete-profile'
          element={
            <CompleteProfileProtected>
              <CompleteProfile />
            </CompleteProfileProtected>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path='dashboard' element={<DashboardPage />} />
          <Route
            path='faculties'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <FacultyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='departments'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DepartmentPage />
              </ProtectedRoute>
            }
          />
          <Route path='courses' element={<CoursePage />} />
          <Route
            path='lecturers'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <LecturerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='students'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <StudentPage />
              </ProtectedRoute>
            }
          />

         <Route path='attendance' element={<AttendancePage />}>
  <Route index element={<AttendanceOverviewPage />} />
  <Route path='course/:courseId' element={<AttendanceDetailsPage />} />
  <Route path='course/:courseId/report' element={<AttendanceReport />} />
  <Route path='course/:courseId/session/:sessionId' element={<AttendanceStudentsDetailsPage />} />
</Route>
          <Route path='profile' element='profile' />
          <Route path='sessions' element={<SessionPage />}>
            <Route
              index
              element={
                <ProtectedRoute allowedRoles={['lecturer', 'student']}>
                  <ActiveSessions />
                </ProtectedRoute>
              }
            />

            <Route
              path=':id'
              element={
                <ProtectedRoute allowedRoles={['lecturer']}>
                  <SessionDetailsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
