import axios from 'axios';

// for dropdown (general)
export const getDepartments = async (facultyId) => {
  try {
    if (!facultyId) return;
    const response = await axios.get(`/api/departments/${facultyId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// admin
export const getDepartmentTotal = async () => {
  try {
    const response = await axios.get(`/api/departments/total`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
