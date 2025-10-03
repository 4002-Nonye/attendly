const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireLecturerAccess } = require('../../../middlewares/roleAccess');
const { assignLecturer, unassignLecturer, getAssignedCoursesForLecturer } = require('../../../controllers/course/lecturer/lecturerCourse.controller');
const { createSession } = require('../../../controllers/session/session.controller');
const { getLecturerAttendanceOverview, getLecturerSessionDetails, getLecturerSessionStudentDetails, getLecturerAttendanceReport } = require('../../../controllers/attendance/lecturer/lecturerAttendance.controller');

const lecturerCourseRoute = express.Router();

/* ----------------------------- LECTURER ROUTES ----------------------------- */
// Assign lecturer to course
lecturerCourseRoute.post('/assign', requireLogin, requireLecturerAccess, assignLecturer);
// Unassign lecturer from course
lecturerCourseRoute.delete('/:courseId/unassign', requireLogin, requireLecturerAccess, unassignLecturer);
// Get courses assigned to lecturer
lecturerCourseRoute.get(
  '/',
  requireLogin,
  requireLecturerAccess,
  getAssignedCoursesForLecturer
);

// Start a session
lecturerCourseRoute.post('/:courseId/session/start', requireLogin, requireLecturerAccess, createSession);

// Get lecturer attendance overview
lecturerCourseRoute.get(
  '/attendance/overview',
  requireLogin,
  requireLecturerAccess,
  getLecturerAttendanceOverview
);

// Get all sessions for a course
lecturerCourseRoute.get('/:courseId/sessions', requireLogin, requireLecturerAccess, getLecturerSessionDetails);

// Get all students for a session
lecturerCourseRoute.get(
  '/:courseId/:sessionId/students',
  requireLogin,
  requireLecturerAccess,
  getLecturerSessionStudentDetails
);

// Get lecturer course attendance report
lecturerCourseRoute.get('/:courseId/report', requireLogin, requireLecturerAccess, getLecturerAttendanceReport);

module.exports = lecturerCourseRoute
