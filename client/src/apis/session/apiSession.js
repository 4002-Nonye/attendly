import axios from 'axios';

export const getRecentSessions = async () => {
  try {
    const response = await axios.get('/api/sessions/recent');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
