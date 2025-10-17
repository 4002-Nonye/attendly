import axios from 'axios';

// admin
export const getCoursesTotal = async () => {
  try {
    const response = await axios.get('/api/admin/courses/total');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
