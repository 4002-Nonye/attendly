import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import LinkAccountSample from './tests/LinkAccountSample';
import Home from './tests/Home';
import ScanQrCode from './tests/ScanQrCode';
import LoginPage from './pages/general/LoginPage';
import SignupPage from './pages/general/SignupPage';
import ForgotPasswordPage from './pages/general/ForgotPasswordPage';
import ResetPasswordPage from './pages/general/ResetPasswordPage';
import LinkAccountPage from './pages/general/LinkAccountPage';
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
        <Route path='/dashboard' element={<Home />} />
        <Route path='/link-account' element={<LinkAccountSample />} />
        <Route path='/scan-code' element={<ScanQrCode />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
