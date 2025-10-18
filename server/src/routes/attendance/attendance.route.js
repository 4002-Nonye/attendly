const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../middlewares/roleAccess');
const {
  getWeeklyAttendance,
  getFacultyAttendance,
} = require('../../controllers/attendance/admin/adminAttendance.controller');

//admin
const attendanceRoute = express.Router();

attendanceRoute.get(
  '/weekly',
  requireLogin,
  requireAdminAccess,
  getWeeklyAttendance
);
attendanceRoute.get(
  'faculty',
  requireLogin,
  requireAdminAccess,
  getFacultyAttendance

);

module.exports=attendanceRoute