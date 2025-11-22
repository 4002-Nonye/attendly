const express = require('express');
const { requireStudentAccess } = require('../../../middlewares/roleAccess');
const requireLogin = require('../../../middlewares/requireLogin');
const { getStudentAttendanceReport, getStudentSessionDetails } = require('../../../controllers/attendance/student/studentAttendance.controller');
const studentAttendanceRoute = express.Router();
// Get student attendance report
studentAttendanceRoute.get(
  '/report',
  requireLogin,
  requireStudentAccess,
  getStudentAttendanceReport
);

// Get student session details
studentAttendanceRoute.get(
  '/courses/:courseId/details',
  requireLogin,
  requireStudentAccess,
  getStudentSessionDetails
);



module.exports = studentAttendanceRoute;
