import axios from 'axios';
axios.defaults.withCredentials = true;

export const getStudentAttendanceReport = async () => {
  try {
    const response = await axios.get('/api/student/courses/attendance-report');
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
