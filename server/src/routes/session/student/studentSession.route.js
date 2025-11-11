const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireStudentAccess } = require('../../../middlewares/roleAccess');
const { getActiveSessionsForStudent } = require('../../../controllers/session/student/studentSession.controller');


const studentSessionRoute = express.Router();

// get ongoing sessions for a student
studentSessionRoute.get(
  '/active',
  requireLogin,
  requireStudentAccess,
  getActiveSessionsForStudent
);

module.exports = studentSessionRoute;
