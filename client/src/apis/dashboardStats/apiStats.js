import axios from 'axios';
axios.defaults.withCredentials = true;
/* ----------------------- ADMIN -----------------------------*/

export const getAdminDashboardStats = async () => {
  try {
    const response = await axios.get('/api/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWeeklyAttendanceBySchool = async () => {
  try {
    const response = await axios.get(
      '/api/admin/dashboard/trends/school-weekly'
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWeeklyAttendanceByFaculty = async () => {
  try {
    const response = await axios.get(
      '/api/admin/dashboard/trends/faculty-weekly'
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

/* ----------------------- GENERAL -----------------------------*/

export const getRecentSessions = async () => {
  try {
    const response = await axios.get('/api/dashboard/recent-sessions');
    return response.data;
  } catch (error) {

    throw error.response.data;
  }
};

/* ----------------------- LECTURER -----------------------------*/

export const getLecturerDashboardStats = async () => {
  try {
    const response = await axios.get('/api/lecturer/dashboard/stats');

    return response.data;
  } catch (error) {
    console.log(error)
    throw error.response.data;
  }
};

/* ----------------------- STUDENT -----------------------------*/

export const getStudentDashboardStats = async () => {
  try {
    const response = await axios.get('/api/student/dashboard/stats');
    return response.data;
  } catch (error) {
    console.log(error)
    throw error.response.data;
  }
};

export const getStudentRecentSessions = async () => {
  try {
    const response = await axios.get('/api/student/dashboard/recent-sessions');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
