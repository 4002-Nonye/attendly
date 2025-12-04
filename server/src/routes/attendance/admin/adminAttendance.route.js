const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../../middlewares/roleAccess');
const {
  getAdminAttendanceReport,
  getAdminCourseAttendanceDetails,

} = require('../../../controllers/attendance/admin/index');
const { downloadAttendanceReport } = require('../../../controllers/attendance/general/attendance.controller');

const adminAttendanceRoute = express.Router();

// Admin attendance report
adminAttendanceRoute.get(
  '/report',
  requireLogin,
  requireAdminAccess,
  getAdminAttendanceReport
);

adminAttendanceRoute.get(
  '/courses/:courseId/details',
  requireLogin,
  requireAdminAccess,
  getAdminCourseAttendanceDetails
);

adminAttendanceRoute.get('/courses/:courseId/download',requireLogin,requireAdminAccess,downloadAttendanceReport)

module.exports = adminAttendanceRoute;
