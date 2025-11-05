import axios from 'axios';
axios.defaults.withCredentials = true;
// for dropdown (general)
export const getSchools = async () => {
  try {
    const response = await axios.get('/api/schools');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
