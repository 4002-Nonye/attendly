import { apiClient, handleRequest } from '../../services/apiClient';


// ==================== LECTURER ====================

// get active sessions for lecturer
export const getActiveSessionsLecturer = () => {
  return handleRequest(() => apiClient.get('/lecturer/sessions/active'));
};

// start new session for a course
export const createSession = (id) => {
  return handleRequest(() => apiClient.post(`/lecturer/courses/${id}/session/start`));
};

// get session details
export const getSessionDetails = (sessionId) => {
  return handleRequest(() => apiClient.get(`/lecturer/sessions/${sessionId}`));
};

// end ongoing session
export const endSession = (sessionId) => {
  return handleRequest(() => apiClient.patch(`/lecturer/sessions/${sessionId}/end`));
};

// ==================== STUDENT ====================

// get active sessions for student
export const getActiveSessionsStudent = () => {
  return handleRequest(() => apiClient.get('/student/sessions/active'));
};

// mark attendance for a session
export const markAttendance = ({ sessionId, token }) => {
  return handleRequest(() => 
    apiClient.post(`/student/sessions/${sessionId}/attendance/mark`, { token })
  );
};