import axios from 'axios';

// for dropdown (general)
export const getDepartmentsOptions = async (facultyId) => {
  try {
    if (!facultyId) return;
    const response = await axios.get(`/api/departments/${facultyId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getDepartmentStats = async () => {
  try {
    const response = await axios.get('/api/departments');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
