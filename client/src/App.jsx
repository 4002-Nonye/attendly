import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import LinkAccountSample from './tests/LinkAccountSample';
import Home from './tests/Home';
import ScanQrCode from './tests/ScanQrCode';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import LinkAccountPage from './pages/auth/LinkAccountPage';

import CompleteProfile from './pages/auth/CompleteProfilePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AppLayout from './layouts/AppLayout';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/link-account' element={<LinkAccountPage />} />
        <Route path='/complete-profile' element={<CompleteProfile />} />
 <Route element={<AppLayout />}>
          <Route path='dashboard' element='dashboard' />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
