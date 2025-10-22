const express = require('express');
const { requireStudentAccess } = require('../../../middlewares/roleAccess');

const requireLogin = require('../../../middlewares/requireLogin');
const {
  getStudentDashboardStats,
} = require('../../../controllers/dashboardStats/student/studentStats.controller');

const studentStatsRoute = express.Router();

studentStatsRoute.get(
  '/stats',
  requireLogin,
  requireStudentAccess,
  getStudentDashboardStats
);

module.exports = studentStatsRoute;
