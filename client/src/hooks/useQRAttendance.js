import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useUser } from '../features/auth/hooks/useUser';
import {useMarkAttendance}from '../features/session/student/useMarkAttendance'


export function useQRAttendance() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    markAttendance,
    isPending: isMarking,
    isSuccess,
    isError,
    error,
  } = useMarkAttendance();
  const { data, isPending: isCheckingAuth } = useUser();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('sessionId');
    const token = params.get('token');

    // invalid QR code
    if (!sessionId || !token) {
      setStatus('invalid');
      setTimeout(() => navigate('/dashboard'), 2000);
      return;
    }

    //  checking authentication
    if (isCheckingAuth) return;

    // not logged in
    if (!data?.user) {
      navigate('/', {
        state: { returnTo: `/mark-attendance${location.search}` },
      });
      return;
    }

    // mark attendance
    markAttendance({ sessionId, token });
  }, [location, navigate, markAttendance, data, isCheckingAuth]);

  //  success
  useEffect(() => {
    if (isSuccess) {
      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 2500);
    }
  }, [isSuccess, navigate]);

  // error
  useEffect(() => {
    if (isError) {
      setStatus('error');
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  }, [isError, navigate]);

  return {
    status,
    isCheckingAuth,
    isMarking,
    error: error?.error || 'Failed to mark attendance',
  };
}
