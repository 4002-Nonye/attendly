import axios from 'axios';

/* ----------------------- ADMIN -----------------------------*/
export const getStudentTotalAdmin = async () => {
  try {
    const response = await axios.get('/api/admin/dashboard/total-students');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLecturerTotalAdmin = async () => {
  try {
    const response = await axios.get('/api/admin/dashboard/total-lecturers');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getDepartmentTotalAdmin = async () => {
  try {
    const response = await axios.get('/api/admin/dashboard/total-departments');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getFacultyTotalAdmin = async () => {
  try {
    const response = await axios.get(`/api/admin/dashboard/total-faculties`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCoursesTotalAdmin = async () => {
  try {
    const response = await axios.get('/api/admin/dashboard/total-courses');
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
export const getCoursesTotalLecturer = async () => {
  try {
    const response = await axios.get('/api/lecturer/dashboard/total-courses');

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStudentTotalLecturer = async () => {
  try {
    const response = await axios.get('/api/lecturer/dashboard/total-students');

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSessionTotalLecturer = async () => {
  try {
    const response = await axios.get('/api/lecturer/dashboard/total-sessions');

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
