import { apiClient, handleRequest } from '../../services/apiClient';

// Dropdown - get departments by faculty
export const getDepartmentsOptions = (facultyId) => {
  if (!facultyId) return;
  return handleRequest(() => apiClient.get(`/departments/${facultyId}`));
};

// get all departments (for filtering)
export const getAllDepartments = () => {
  return handleRequest(() => apiClient.get('/departments/all'));
};

// get department stats
export const getDepartmentStats = () => {
  return handleRequest(() => apiClient.get('/departments'));
};

// crate department
export const createDepartment = (data) => {
  return handleRequest(() => apiClient.post('/departments', data));
};

// edit department
export const editDepartment = ({ id, ...updateData }) => {
  return handleRequest(() => apiClient.put(`/departments/${id}`, updateData));
};

// delete department
export const deleteDepartment = (id) => {
  return handleRequest(() => apiClient.delete(`/departments/${id}`));
};