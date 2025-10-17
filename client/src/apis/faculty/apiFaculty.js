import axios from 'axios';

// for dropdown (general)
export const getFaculties = async (schoolId) => {
  try {
    if (!schoolId) return;
    const response = await axios.get(`/api/faculties/${schoolId}`);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//admin
export const getFacultyTotal = async () => {
  try {
    const response = await axios.get(`/api/faculties/total`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
