const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const { requireLecturerAccess } = require('../../middlewares/roleAccess');
const {
  getLecturerAttendanceOverview,
  getLecturerSessionDetails,
  getLecturerSessionStudentDetails,
} = require('../../controllers/attendance/attendance.controller');

const attendanceRoute = express.Router();

// LECTURER ROUTES//
attendanceRoute.get(
  '/lecturer/overview',
  requireLogin,
  requireLecturerAccess,
  getLecturerAttendanceOverview
);

attendanceRoute.get(
  '/lecturer/:courseId/sessions',
  requireLogin,
  requireLecturerAccess,
  getLecturerSessionDetails
);

attendanceRoute.get(
  '/lecturer/session/:sessionId/students',
  requireLogin,
  requireLecturerAccess,
  getLecturerSessionStudentDetails
);

module.exports = attendanceRoute;
