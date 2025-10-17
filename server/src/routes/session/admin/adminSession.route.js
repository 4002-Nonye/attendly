const express = require('express');

const requireLogin = require('../../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../../middlewares/roleAccess');
const {
  getRecentSessions,
} = require('../../../controllers/session/session.controller');

const adminSessionRoute = express.Router();

adminSessionRoute.get(
  '/recent',
  requireLogin,
  requireAdminAccess,
  getRecentSessions
);

module.exports = adminSessionRoute;
