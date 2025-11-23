const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../../middlewares/roleAccess');
const { getAdminAttendanceReport } = require('../../../controllers/attendance/admin/adminAttendance.controller');

const adminAttendanceRoute = express.Router();

// Admin attendance report
adminAttendanceRoute.get(
  '/report',
  requireLogin,
  requireAdminAccess,
  getAdminAttendanceReport
);

module.exports = adminAttendanceRoute;
