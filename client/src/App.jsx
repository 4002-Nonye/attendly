import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import ScanQrCode from './tests/ScanQrCode';
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
          <Route path='faculties' element='faculties' />
          <Route path='departments' element='departments' />
          <Route path='courses' element='courses' />
          <Route path='lecturers' element='lecturers' />
          <Route path='students' element='students' />
          <Route path='attendance' element='attendance' />
          <Route path='profile' element='profile' />
          <Route path='sessions' element='sessions' />
        </Route>

        <Route path='/scan-code' element={<ScanQrCode />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
