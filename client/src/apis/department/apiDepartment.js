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

export const getDepartmentStats = async ({ queryKey }) => {
  const [_key, query] = queryKey;
 
  const params = new URLSearchParams(query).toString();

  try {
    const response = await axios.get(`/api/departments?${params}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createDepartment = async (data) => {
  try {
    const response = await axios.post('/api/departments', data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const editDepartment = async (data) => {
  const { id, ...updateData } = data;
  try {
    const response = await axios.put(`/api/departments/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteDepartment = async (id) => {
  try {
    const response = await axios.delete(`/api/departments/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
