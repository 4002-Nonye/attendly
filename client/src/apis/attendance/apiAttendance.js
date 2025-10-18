import axios from 'axios';

export const getWeeklyAttendanceBySchool = async () => {
  try {
    const response = await axios.get('/api/admin/attendance/trends/school-weekly');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWeeklyAttendanceByFaculty = async () => {
  try {
    const response = await axios.get('/api/admin/attendance/trends/faculty-weekly');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
