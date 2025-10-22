const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../../middlewares/roleAccess');
const {
  getAdminDashboardStats,
  getFacultyAttendanceTrend,
  getSchoolAttendanceTrend,
} = require('../../../controllers/dashboardStats/admin/adminStats.controller');

const adminStatsRoute = express.Router();

adminStatsRoute.get(
  '/stats',
  requireLogin,
  requireAdminAccess,
  getAdminDashboardStats
);

adminStatsRoute.get(
  '/trends/faculty-weekly',
  requireLogin,
  requireAdminAccess,
  getFacultyAttendanceTrend
);

adminStatsRoute.get(
  '/trends/school-weekly',
  requireLogin,
  requireAdminAccess,
  getSchoolAttendanceTrend
);

module.exports = adminStatsRoute;
