
const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireLecturerAccess } = require('../../../middlewares/roleAccess');
const {
  assignLecturer,
  unassignLecturer,
  getAssignedCoursesForLecturer,
} = require('../../../controllers/course/lecturer/lecturerCourse.controller');

const {
  createSession,
} = require('../../../controllers/session/lecturer/lecturerSession.controller');

const lecturerCourseRoute = express.Router();

/* ----------------------------- LECTURER ROUTES ----------------------------- */
// Assign lecturer to course
lecturerCourseRoute.post(
  '/assign',
  requireLogin,
  requireLecturerAccess,
  assignLecturer
);
// Unassign lecturer from course
lecturerCourseRoute.delete(
  '/:courseId/unassign',
  requireLogin,
  requireLecturerAccess,
  unassignLecturer
);
// Get courses assigned to lecturer
lecturerCourseRoute.get(
  '/',
  requireLogin,
  requireLecturerAccess,
  getAssignedCoursesForLecturer
);

// Start a session
lecturerCourseRoute.post(
  '/:courseId/session/start',
  requireLogin,
  requireLecturerAccess,
  createSession
);



module.exports = lecturerCourseRoute;
