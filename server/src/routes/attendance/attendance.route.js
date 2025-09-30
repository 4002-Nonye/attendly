const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const { requireLecturerAccess } = require('../../middlewares/roleAccess');
const {
  getLecturerAttendanceOverview,
} = require('../../controllers/attendance/attendance.controller');

const attendanceRoute = express.Router();

attendanceRoute.get(
  '/lecturer/overview',
  requireLogin,
  requireLecturerAccess,
  getLecturerAttendanceOverview
);

module.exports = attendanceRoute;
