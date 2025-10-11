import axios from 'axios';

export const signUp = async (data) => {
  try {
    const response = await axios.post('api/auth/signup', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
   
    throw error.response.data;
  }
};
