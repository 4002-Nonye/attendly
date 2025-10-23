import axios from 'axios';

export const getStudentAttendanceReport = async () => {
  try {
    const response = await axios.get('/api/student/courses/attendance-report');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
