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
    const response = await axios.post(`/api/lecturer/courses/${id}/session/start`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};



export const getActiveSessionsStudent = async () => {
  try {
    const response = await axios.get('/api/student/sessions/active');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};