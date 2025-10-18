const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../middlewares/roleAccess');
const {
  getWeeklyAttendance,
  getFacultyAttendanceStats,
} = require('../../controllers/attendance/admin/adminAttendance.controller');

//admin
const attendanceRoute = express.Router();

attendanceRoute.get(
  '/school-weekly',
  requireLogin,
  requireAdminAccess,
  getWeeklyAttendance
);
attendanceRoute.get(
  '/faculty-weekly',
  requireLogin,
  requireAdminAccess,
  getFacultyAttendanceStats

);

module.exports=attendanceRoute