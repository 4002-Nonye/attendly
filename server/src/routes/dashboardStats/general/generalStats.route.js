const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireRoles } = require('../../../middlewares/roleAccess');
const { getRecentSessions } = require('../../../controllers/dashboardStats/general/generalStats.controller');
const generalStatsRoute = express.Router();

// recent sessions (admin and lecturer)
generalStatsRoute.get(
  '/recent-sessions',
  requireLogin,
  requireRoles('admin', 'lecturer'),
  getRecentSessions
);


module.exports=generalStatsRoute