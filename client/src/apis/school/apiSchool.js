import { apiClient, handleRequest } from '../../services/apiClient';

// ==================== GENERAL ====================

// get all schools (for signup dropdown)
export const getSchools = () => {
  return handleRequest(() => apiClient.get('/schools'));
};

// ==================== ADMIN ====================

// update school-wide attendance threshold
export const updateAttendanceThresholdAdmin = (data) => {
  return handleRequest(() => apiClient.patch('/schools/attendance-threshold', data));
};

// create new academic year
export const createAcademicYear = (data) => {
  return handleRequest(() => apiClient.post('/schools/academic-year', data));
};

// switch between semesters
export const switchSemester = (data) => {
  return handleRequest(() => apiClient.put('/schools/academic-year/semester/switch', data));
};