import axios from 'axios';
axios.defaults.withCredentials = true;
// for dropdown (signup)
export const getFacultyOptions = async (schoolId) => {
  try {
    if (!schoolId) return;
    const response = await axios.get(`/api/faculties/${schoolId}`);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// for dropdown (creating a department in-app || filtering )
export const getAllFaculties = async () => {
  try {
    const response = await axios.get(`/api/faculties/all`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// admin
export const getFacultyStats = async () => {
  try {
    const response = await axios.get(`/api/faculties`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// admin create faculty
export const createFaculty = async (data) => {
  try {
    const response = await axios.post('/api/faculties', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// admin edit faculty
export const editFaculty = async (data) => {
  try {
    const { id, ...updateData } = data;
    const response = await axios.put(`/api/faculties/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteFaculty = async (id) => {
  try {
    const response = await axios.delete(`/api/faculties/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
