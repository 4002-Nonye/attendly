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


export const getAllCourses = async () => {
  try {
    const response = await axios.get('/api/courses');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// create course (admin)
export const createCourse = async () => {
  try {
    const response = await axios.post('/api/admin/courses');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};