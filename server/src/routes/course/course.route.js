const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');

const {
  requireStudentAccess,
  requireLecturerAccess,
  requireAdminAccess,
} = require('../../middlewares/roleAccess');

const {
  getCourseById,
  getCourses,
} = require('../../controllers/course/course.controller');

const {
  createCourse,
  deleteCourse,
  editCourse,
} = require('../../controllers/course/admin/adminCourse.controller');
const {
  assignLecturer,
  unassignLecturer,
  getAssignedCoursesForLecturer,
} = require('../../controllers/course/lecturer/lecturerCourse.controller');
const {
  registerCourse,
  getRegisteredCoursesForStudent,
  unregisterCourse,
} = require('../../controllers/course/student/studentCourse.controller');
const {
  createSession,
} = require('../../controllers/session/session.controller');
const { getStudentSessionDetails, getStudentAttendanceReport, markAttendance } = require('../../controllers/attendance/student/studentAttendance.controller');
const { getLecturerAttendanceReport, getLecturerSessionDetails, getLecturerAttendanceOverview } = require('../../controllers/attendance/lecturer/lecturerAttendance.controller');


const courseRoute = express.Router();

// General roles
courseRoute.get('/:id', requireLogin, getCourseById); // get a single course
courseRoute.get('/', requireLogin, getCourses);

// Admin roles
courseRoute.post('/', requireLogin, requireAdminAccess, createCourse); // create a new course
courseRoute.put('/:id', requireLogin, requireAdminAccess, editCourse); // edit a course
courseRoute.delete('/:id', requireLogin, requireAdminAccess, deleteCourse); // delete a course

// Lecturer roles
courseRoute.post(
  '/assign',
  requireLogin,
  requireLecturerAccess,
  assignLecturer
);
courseRoute.delete(
  '/:courseId/unassign',
  requireLogin,
  requireLecturerAccess,
  unassignLecturer
);
courseRoute.get(
  '/lecturer/courses',
  requireLogin,
  requireLecturerAccess,
  getAssignedCoursesForLecturer
);

// Student roles
courseRoute.post(
  '/register',
  requireLogin,
  requireStudentAccess,
  registerCourse
);
courseRoute.get(
  '/student/courses',
  requireLogin,
  requireStudentAccess,
  getRegisteredCoursesForStudent
);
courseRoute.delete(
  '/:courseId/unregister',
  requireLogin,
  requireStudentAccess,
  unregisterCourse
);

// SESSIONS //
// lecturer roles
// start attendance session
courseRoute.post(
  '/:courseId/session/start',
  requireLogin,
  requireLecturerAccess,
  createSession
);

// MARKING ATTENDANCE // (students)
courseRoute.post(
  '/:courseId/sessions/:sessionId/attendance/mark',
  requireLogin,
  requireStudentAccess,
  markAttendance
);

// LECTURER ATTENDANCE OVERVIEW
courseRoute.get(
  '/attendance/overview',
  requireLogin,
  requireLecturerAccess,
  getLecturerAttendanceOverview
);

// Lecturer get all sessions for a course
courseRoute.get(
  '/:courseId/sessions',
  requireLogin,
  requireLecturerAccess,
  getLecturerSessionDetails
);

// Lecturer get course attendance report
courseRoute.get(
  '/:courseId/report',
  requireLogin,
  requireLecturerAccess,
  getLecturerAttendanceReport
);

// Student get attendance report
courseRoute.get(
  '/student/attendance-report',
  requireLogin,
  requireStudentAccess,
  getStudentAttendanceReport
);

// student get report details
courseRoute.get(
  '/:courseId/student/attendance-details',
  requireLogin,
  requireStudentAccess,
  getStudentSessionDetails
);
module.exports = courseRoute;
