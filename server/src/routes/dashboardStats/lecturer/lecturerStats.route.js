const express = require('express');
const {
  getLecturerDashboardStats,
} = require('../../../controllers/dashboardStats/lecturer/lecturerStats.controller');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireLecturerAccess } = require('../../../middlewares/roleAccess');

const lecturerStatsRoute = express.Router();

lecturerStatsRoute.get(
  '/stats',
  requireLogin,
  requireLecturerAccess,
  getLecturerDashboardStats
);

module.exports = lecturerStatsRoute;
