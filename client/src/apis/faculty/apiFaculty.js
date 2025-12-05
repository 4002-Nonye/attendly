import { apiClient, handleRequest } from '../../services/apiClient';

// ==================== GENERAL ====================

// get faculties by school id (for signup dropdown)
export const getFacultyOptions = (schoolId) => {
  if (!schoolId) return;
  return handleRequest(() => apiClient.get(`/faculties/${schoolId}`));
};

// get all faculties (for dropdowns/filtering in-app)
export const getAllFaculties = () => {
  return handleRequest(() => apiClient.get('/faculties/all'));
};

// ==================== ADMIN ====================

// get faculty stats
export const getFacultyStats = () => {
  return handleRequest(() => apiClient.get('/faculties'));
};

// create new faculty
export const createFaculty = (data) => {
  return handleRequest(() => apiClient.post('/faculties', data));
};

// edit faculty
export const editFaculty = ({ id, ...updateData }) => {
  return handleRequest(() => apiClient.put(`/faculties/${id}`, updateData));
};

// delete faculty
export const deleteFaculty = (id) => {
  return handleRequest(() => apiClient.delete(`/faculties/${id}`));
};