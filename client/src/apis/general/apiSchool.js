import axios from 'axios';

// for dropdown
export const getSchools = async () => {
  try {
    const response = await axios.get('/api/schools');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
