const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireStudentAccess } = require('../../../middlewares/roleAccess');
const { getActiveSessionsForStudent } = require('../../../controllers/session/student/studentSession.controller');
const { markAttendance } = require('../../../controllers/attendance/student/studentAttendance.controller');


const studentSessionRoute = express.Router();

// get ongoing sessions for a student
studentSessionRoute.get(
  '/active',
  requireLogin,
  requireStudentAccess,
  getActiveSessionsForStudent
);

// Mark session
studentSessionRoute.post(
  '/:sessionId/attendance/mark',
  requireLogin,
  requireStudentAccess,
  markAttendance
);




module.exports = studentSessionRoute;
