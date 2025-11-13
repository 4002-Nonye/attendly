import axios from 'axios';

export const getLecturers = async () => {
  try {
    const response = await axios.get('/api/users/lecturers');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStudents = async () => {
  try {
    const response = await axios.get('/api/users/students');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get('/api/users/me');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
