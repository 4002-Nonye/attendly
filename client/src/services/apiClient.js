import axios from 'axios';

//  axios instance
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// request handler with error handling
const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Network error' };
  }
};

export { apiClient, handleRequest };