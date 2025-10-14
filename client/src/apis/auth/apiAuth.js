import axios from 'axios';

export const signUp = async (data) => {
  try {
    const response = await axios.post('/api/auth/signup', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post('/api/auth/login', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await axios.post('/api/auth/forgot-password', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post('/api/auth/reset-password', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
