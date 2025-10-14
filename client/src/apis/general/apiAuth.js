import axios from 'axios';

export const signUp = async (data) => {
  try {
    console.log(data)
    const response = await axios.post('api/auth/signup', data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
   console.log(error)
    throw error.response.data;
  }
};
