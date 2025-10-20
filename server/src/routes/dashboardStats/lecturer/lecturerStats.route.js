const express = require('express');
const { getTotalCoursesLecturer, getStudentsTotal,getTotalSessions } = require('../../../controllers/dashboardStats/lecturer/lecturerStats.controller');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireLecturerAccess } = require('../../../middlewares/roleAccess');
const lecturerStatsRoute = express.Router();


lecturerStatsRoute.get(
  '/total-courses',
  requireLogin,
  requireLecturerAccess,
  getTotalCoursesLecturer
);
lecturerStatsRoute.get(
  '/total-students',
  requireLogin,
  requireLecturerAccess,
  getStudentsTotal
);

lecturerStatsRoute.get(
  '/total-sessions',
  requireLogin,
  requireLecturerAccess,
  getTotalSessions
);

// lecturerStatsRoute.get(
//   '/total-lecturers',
//   requireLogin,
//   requireLecturerAccess,
//   getLecturerTotal
// );



module.exports = lecturerStatsRoute;
