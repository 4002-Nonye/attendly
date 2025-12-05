import { apiClient, handleRequest } from '../../services/apiClient';

// ==================== STUDENT ====================

export const getStudentAttendanceReport = () => {
  return handleRequest(() => apiClient.get('/student/attendance/report'));
};

export const getStudentSessionDetails = (courseId) => {
  return handleRequest(() => 
    apiClient.get(`/student/attendance/courses/${courseId}/details`)
  );
};

// ==================== LECTURER ====================

export const getLecturerAttendanceOverview = () => {
  return handleRequest(() => apiClient.get('/lecturer/attendance/overview'));
};

export const getLecturerSessionDetails = (courseId) => {
  return handleRequest(() => 
    apiClient.get(`/lecturer/attendance/courses/${courseId}/sessions`)
  );
};

export const getLecturerSessionStudentDetails = ({ courseId, sessionId }) => {
  return handleRequest(() => 
    apiClient.get(`/lecturer/attendance/courses/${courseId}/sessions/${sessionId}/students`)
  );
};

export const getLecturerAttendanceReport = (courseId) => {
  return handleRequest(() => 
    apiClient.get(`/lecturer/attendance/courses/${courseId}/report`)
  );
};

export const updateAttendanceThresholdLecturer = (data) => {
  return handleRequest(() => 
    apiClient.patch('/lecturer/attendance/threshold', data)
  );
};

// ==================== ADMIN ====================

export const getAdminAttendanceReport = () => {
  return handleRequest(() => apiClient.get('/admin/attendance/report'));
};

export const getAdminCourseAttendanceDetails = (courseId) => {
  return handleRequest(() => 
    apiClient.get(`/admin/attendance/courses/${courseId}/details`)
  );
};

// ==================== DOWNLOAD ====================

export const downloadAttendanceReport = async ({ courseId, role }) => {
  try {
    const basePath = role === 'lecturer' ? '/lecturer' : '/admin';

    const response = await apiClient.get(
      `${basePath}/attendance/courses/${courseId}/download`,
      { responseType: 'blob' }
    );

    // extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    let filename = `attendance-report-${courseId}-${Date.now()}.pdf`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
      if (filenameMatch?.[1]) {
        filename = filenameMatch[1];
      }
    }

    return {
      blob: response.data,
      filename,
      courseId,
    };
  } catch (error) {
    throw error.response?.data || { error: 'Download failed' };
  }
};