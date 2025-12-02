import axios from 'axios';
axios.defaults.withCredentials = true;

export const getRecentSessions = async () => {
  try {
    const response = await axios.get('/api/sessions/recent');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getActiveSessionsLecturer = async () => {
  try {
    const response = await axios.get('/api/lecturer/sessions/active');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// lecturer create session
export const createSession = async (id) => {
  try {
    const response = await axios.post(
      `/api/lecturer/courses/${id}/session/start`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// get session details for lecturer
export const getSessionDetails = async (sessionId) => {
  try {
    const response = await axios.get(`/api/lecturer/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// end session lecture
export const endSession = async (sessionId) => {
  try {
    const response = await axios.patch(
      `/api/lecturer/sessions/${sessionId}/end`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// STUDENT
export const getActiveSessionsStudent = async () => {
  try {
    const response = await axios.get('/api/student/sessions/active');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// student mark attendance session
export const markAttendance = async (sessionId,token) => {
 
  try {
    const response = await axios.post(
      `/api/student/sessions/${sessionId}/attendance/mark`,token
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
