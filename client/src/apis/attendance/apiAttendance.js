import axios from 'axios';
axios.defaults.withCredentials = true;

export const getStudentAttendanceReport = async () => {
  try {
    const response = await axios.get('/api/student/attendance/report');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStudentSessionDetails = async (courseId) => {
  try {
    const response = await axios.get(
      `/api/student/attendance/courses/${courseId}/details`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLecturerAttendanceOverview = async () => {
  try {
    const response = await axios.get('/api/lecturer/attendance/overview');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLecturerSessionDetails = async (courseId) => {
  try {
    const response = await axios.get(
      `/api/lecturer/attendance/courses/${courseId}/sessions`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLecturerSessionStudentDetails = async (ids) => {
  const { courseId, sessionId } = ids;
  try {
    const response = await axios.get(
      `/api/lecturer/attendance/courses/${courseId}/sessions/${sessionId}/students`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getLecturerAttendanceReport = async (courseId) => {
  try {
    const response = await axios.get(
      `/api/lecturer/attendance/courses/${courseId}/report`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateAttendanceThresholdLecturer = async (data) => {
    try {
    const response = await axios.patch('/api/lecturer/attendance/threshold',data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const getAdminAttendanceReport = async () => {
  try {
    const response = await axios.get('/api/admin/attendance/report');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAdminCourseAttendanceDetails = async (courseId) => {
  try {
    const response = await axios.get(
      `/api/admin/attendance/courses/${courseId}/details`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const downloadAttendanceReport = async ({ courseId, role }) => {
  try {
    const basePath = role === 'lecturer' ? '/api/lecturer' : '/api/admin';

    const response = await axios.get(
      `${basePath}/attendance/courses/${courseId}/download`,
      {
        responseType: 'blob',
      }
    );

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    let filename = `attendance-report-${courseId}-${Date.now()}.pdf`; // Fallback

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Return both blob and filename
    return {
      blob: response.data,
      filename: filename,
      courseId: courseId,
    };
  } catch (error) {
    error.response.data;
  }
};
