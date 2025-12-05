import { apiClient, handleRequest } from '../../services/apiClient';

// ==================== GENERAL ====================

// get all courses (for enrollment/assignment)
export const getAllCourses = () => {
  return handleRequest(() => apiClient.get('/courses'));
};

// ==================== ADMIN ====================

// create new course
export const createCourse = (data) => {
  return handleRequest(() => apiClient.post('/admin/courses', data));
};

// edit course
export const editCourse = ({ id, ...updateData }) => {
  return handleRequest(() => apiClient.put(`/admin/courses/${id}`, updateData));
};

// delete course
export const deleteCourse = (id) => {
  return handleRequest(() => apiClient.delete(`/admin/courses/${id}`));
};

// ==================== LECTURER ====================

// get lecturer assigned courses  
export const getLecturerAssignedCourses = () => {
  return handleRequest(() => apiClient.get('/lecturer/courses'));
};

// assign self to a course
export const assignToCourse = (data) => {
  return handleRequest(() => apiClient.post('/lecturer/courses/assign', data));
};

// unassign self from a course
export const unassignFromCourse = (id) => {
  return handleRequest(() => apiClient.delete(`/lecturer/courses/${id}/unassign`));
};

// ==================== STUDENT ====================

// get courses student is registered for
export const getStudentRegisteredCourses = () => {
  return handleRequest(() => apiClient.get('/student/courses'));
};

// enroll in a course
export const enrollCourse = (data) => {
  return handleRequest(() => apiClient.post('/student/courses/register', data));
};

// unenroll from a course
export const unenrollCourse = (id) => {
  return handleRequest(() => apiClient.delete(`/student/courses/${id}/unregister`));
};