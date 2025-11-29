const express = require('express');

const { requireLecturerAccess } = require('../../../middlewares/roleAccess');

const {
  getLecturerAttendanceOverview,
  getLecturerSessionDetails,
  getLecturerSessionStudentDetails,
  getLecturerAttendanceReport,
} = require('../../../controllers/attendance/lecturer/lecturerAttendance.controller');
const requireLogin = require('../../../middlewares/requireLogin');
const { downloadAttendanceReport } = require('../../../controllers/attendance/general/attendance.controller');
const { setAttendanceThreshold } = require('../../../controllers/school/school.controller');

const lecturerAttendanceRoute = express.Router();

// Get lecturer attendance overview
lecturerAttendanceRoute.get(
  '/overview',
  requireLogin,
  requireLecturerAccess,
  getLecturerAttendanceOverview
);

// Get all sessions for a course
lecturerAttendanceRoute.get(
  '/courses/:courseId/sessions',
  requireLogin,
  requireLecturerAccess,
  getLecturerSessionDetails
);

// Get all students for a session
lecturerAttendanceRoute.get(
  '/courses/:courseId/sessions/:sessionId/students',
  requireLogin,
  requireLecturerAccess,
  getLecturerSessionStudentDetails
);

// Get lecturer course attendance report
lecturerAttendanceRoute.get(
  '/courses/:courseId/report',
  requireLogin,
  requireLecturerAccess,
  getLecturerAttendanceReport
);

lecturerAttendanceRoute.get('/courses/:courseId/download',requireLogin,requireLecturerAccess,downloadAttendanceReport)

lecturerAttendanceRoute.patch(
  '/threshold',
  requireLogin,
  requireLecturerAccess,
  setAttendanceThreshold
);


module.exports = lecturerAttendanceRoute;
