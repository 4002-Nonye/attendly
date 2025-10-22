import axios from 'axios';
axios.defaults.withCredentials = true;

export const getLecturerAssignedCourses = async () => {
  try {
    const response = await axios.get('/api/lecturer/courses');

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStudentRegisteredCourses = async () => {
  try {
    const response = await axios.get('/api/student/courses');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
