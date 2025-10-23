const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireStudentAccess } = require('../../../middlewares/roleAccess');
const {
  registerCourse,
  getRegisteredCoursesForStudent,
  unregisterCourse,
} = require('../../../controllers/course/student/studentCourse.controller');

const {
  markAttendance,
  getStudentAttendanceReport,
  getStudentSessionDetails,
} = require('../../../controllers/attendance/student/studentAttendance.controller');

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

// Mark attendance
studentCourseRoute.post(
  '/:courseId/sessions/:sessionId/attendance/mark',
  requireLogin,
  requireStudentAccess,
  markAttendance
);

// Get student attendance report
studentCourseRoute.get(
  '/attendance-report',
  requireLogin,
  requireStudentAccess,
  getStudentAttendanceReport
);

// Get student session details
studentCourseRoute.get(
  '/:courseId/attendance-details',
  requireLogin,
  requireStudentAccess,
  getStudentSessionDetails
);




module.exports = studentCourseRoute;
