import axios from 'axios';
axios.defaults.withCredentials = true;

export const getStudentAttendanceReport = async () => {
  try {
    const response = await axios.get('/api/student/attendance/report');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStudentSessionDetails = async (courseId) => {
  try {
    const response = await axios.get(
      `/api/student/attendance/courses/${courseId}/details`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLecturerAttendanceOverview = async () => {
  try {
    const response = await axios.get('/api/lecturer/attendance/overview');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLecturerSessionDetails = async (courseId) => {
  try {
    const response = await axios.get(
      `/api/lecturer/attendance/courses/${courseId}/sessions`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLecturerSessionStudentDetails = async (ids) => {
  const { courseId, sessionId } = ids;
  try {
    const response = await axios.get(
      `/api/lecturer/attendance/courses/${courseId}/sessions/${sessionId}/students`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLecturerAttendanceReport = async (courseId) => {
  try {
    const response = await axios.get(
      `/api/lecturer/attendance/courses/${courseId}/report`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
