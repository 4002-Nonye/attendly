import { apiClient, handleRequest } from '../../services/apiClient';

// ==================== GENERAL ====================

// get current user's profile
export const getUserProfile = () => {
  return handleRequest(() => apiClient.get('/users/me'));
};

// ==================== ADMIN ====================

// get all lecturers
export const getLecturers = () => {
  return handleRequest(() => apiClient.get('/users/lecturers'));
};

// get all students
export const getStudents = () => {
  return handleRequest(() => apiClient.get('/users/students'));
};