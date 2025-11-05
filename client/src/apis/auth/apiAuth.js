import axios from 'axios';
axios.defaults.withCredentials = true;

export const signUp = async (data) => {
  try {
    const response = await axios.post('/api/auth/signup', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post('/api/auth/login', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await axios.post('/api/auth/forgot-password', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await axios.post('/api/auth/reset-password', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const linkAccount = async (data) => {
  try {
    const response = await axios.post('/api/auth/link-account', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const completeProfile = async (data) => {
  try {
    const response = await axios.put('/api/auth/complete-profile', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUser = async () => {
  try {
    const response = await axios.get('/api/auth/user');

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
