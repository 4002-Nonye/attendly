import { apiClient, handleRequest } from '../../services/apiClient';

// ==================== ADMIN ====================

// get admin dashboard stats
export const getAdminDashboardStats = () => {
  return handleRequest(() => apiClient.get('/admin/dashboard/stats'));
};

// get school-wide weekly attendance trends
export const getWeeklyAttendanceBySchool = () => {
  return handleRequest(() => apiClient.get('/admin/dashboard/trends/school-weekly'));
};

// get faculty-level weekly attendance trends
export const getWeeklyAttendanceByFaculty = () => {
  return handleRequest(() => apiClient.get('/admin/dashboard/trends/faculty-weekly'));
};

// ==================== LECTURER ====================

// get lecturer dashboard stats
export const getLecturerDashboardStats = () => {
  return handleRequest(() => apiClient.get('/lecturer/dashboard/stats'));
};

// ==================== STUDENT ====================

// get student dashboard stats
export const getStudentDashboardStats = () => {
  return handleRequest(() => apiClient.get('/student/dashboard/stats'));
};

// get student's recent sessions
export const getStudentRecentSessions = () => {
  return handleRequest(() => apiClient.get('/student/dashboard/recent-sessions'));
};

// ==================== GENERAL ====================

// get recent sessions
export const getRecentSessions = () => {
  return handleRequest(() => apiClient.get('/dashboard/recent-sessions'));
};