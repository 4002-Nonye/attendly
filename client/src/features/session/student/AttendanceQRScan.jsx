import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ClipLoader } from 'react-spinners';
import { useMarkAttendance } from './useMarkAttendance';
import { useUser } from '../../auth/hooks/useUser';

export default function AttendanceQRScan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { markAttendance, isPending: isMarking, isSuccess, isError, error } = useMarkAttendance();
  const { data, isPending: isCheckingAuth } = useUser();
  const [status, setStatus] = useState(null); // 'success' | 'error' | 'invalid'

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('sessionId');
    const token = params.get('token');

    // Invalid QR code
    if (!sessionId || !token) {
      setStatus('invalid');
      setTimeout(() => navigate('/dashboard'), 2000);
      return;
    }

    // Still checking authentication
    if (isCheckingAuth) return;

    // Not logged in - redirect to login with return URL
    if (!data?.user) {
      navigate('/', { 
        state: { returnTo: `/mark-attendance${location.search}` } 
      });
      return;
    }

    // User is authenticated - mark attendance
    markAttendance({ sessionId, token });
  }, [location, navigate, markAttendance, data, isCheckingAuth]);

  // Handle success
  useEffect(() => {
    if (isSuccess) {
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 2500);
    }
  }, [isSuccess, navigate]);

  // Handle error
  useEffect(() => {
    if (isError) {
      setStatus('error');
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  }, [isError, navigate]);

  // Loading state
  if (isCheckingAuth || isMarking) {
    return (
      <div className='flex h-screen items-center justify-center bg-gray-50'>
        <div className="text-center">
          <ClipLoader size={50} color='#1e1b4b' />
          <p className="mt-4 text-gray-600">
            {isCheckingAuth ? 'Checking authentication...' : 'Marking attendance...'}
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <div className='flex h-screen items-center justify-center bg-green-50'>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-4">
            <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            ✅ Attendance Marked!
          </h2>
          <p className="text-green-700">
            Your attendance has been recorded successfully.
          </p>
          <p className="text-sm text-green-600 mt-4">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    const errorMessage = error?.error || 'Failed to mark attendance';
    
    return (
      <div className='flex h-screen items-center justify-center bg-red-50'>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-4">
            <svg className="w-20 h-20 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            ❌ Failed
          </h2>
          <p className="text-red-700 mb-4">
            {errorMessage}
          </p>
          <p className="text-sm text-red-600">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Invalid QR state
  if (status === 'invalid') {
    return (
      <div className='flex h-screen items-center justify-center bg-yellow-50'>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-4">
            <svg className="w-20 h-20 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">
            ⚠️ Invalid QR Code
          </h2>
          <p className="text-yellow-700">
            This QR code is invalid or has expired.
          </p>
          <p className="text-sm text-yellow-600 mt-4">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return null;
}