import axios from 'axios';

export const getWeeklyAttendance = async () => {
  try {
    const response = await axios.get('/api/admin/attendance/trends/weekly');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
