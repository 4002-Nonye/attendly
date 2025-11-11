const express = require('express');
const { requireLecturerAccess } = require('../../../middlewares/roleAccess');

const requireLogin = require('../../../middlewares/requireLogin');
const {
  getActiveSessionsForLecturer,
  endSession,
  getSessionDetails,
} = require('../../../controllers/session/lecturer/lecturerSession.controller');

const lecturerSessionRoute = express.Router();

// get active sessions for lecturer
lecturerSessionRoute.get(
  '/active',
  requireLogin,
  requireLecturerAccess,
  getActiveSessionsForLecturer
);
// get session detail
lecturerSessionRoute.get(
  '/:sessionId',
  requireLogin,
  requireLecturerAccess,
  getSessionDetails
);

// end attendance session
lecturerSessionRoute.patch(
  '/:sessionId/end',
  requireLogin,
  requireLecturerAccess,
  endSession
);

module.exports = lecturerSessionRoute;
