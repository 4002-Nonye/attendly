import axios from 'axios';

// for dropdown
export const getFaculties = async (schoolId) => {
  try {
    if (!schoolId) return;
    const response = await axios.get(`/api/faculties/${schoolId}`);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
