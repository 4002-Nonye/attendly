import axios from 'axios';

export const getStudentTotal = async () => {
  try {
    const response = await axios.get('/api/users/students/total');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLecturerTotal = async () => {
  try {
    const response = await axios.get('/api/users/lecturers/total');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
