const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireStudentAccess } = require('../../../middlewares/roleAccess');
const {
  registerCourse,
  getRegisteredCoursesForStudent,
  unregisterCourse,
} = require('../../../controllers/course/student/studentCourse.controller');

const studentCourseRoute = express.Router();

/* ----------------------------- STUDENT ROUTES ----------------------------- */
// Register for a course
studentCourseRoute.post(
  '/register',
  requireLogin,
  requireStudentAccess,
  registerCourse
);
// Get registered courses for student
studentCourseRoute.get(
  '/',
  requireLogin,
  requireStudentAccess,
  getRegisteredCoursesForStudent
);
// Unregister from a course
studentCourseRoute.delete(
  '/:courseId/unregister',
  requireLogin,
  requireStudentAccess,
  unregisterCourse
);

module.exports = studentCourseRoute;
