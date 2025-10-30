import axios from 'axios';

// for dropdown (general)
export const getFacultyOptions = async (schoolId) => {
  try {
    if (!schoolId) return;
    const response = await axios.get(`/api/faculties/${schoolId}`);

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// admin
export const getFacultyStats = async ({ queryKey }) => {
  const [_key, query] = queryKey;
  const params = new URLSearchParams(query).toString();

  try {
    const response = await axios.get(`/api/faculties?${params}`);
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
  console.log(id)
  try {
    const response = await axios.delete(`/api/faculties/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
