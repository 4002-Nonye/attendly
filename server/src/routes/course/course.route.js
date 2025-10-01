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
  endSession,
} = require('../../controllers/session/session.controller');
const { markAttendance } = require('../../controllers/attendance/attendance.controller');

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
  '/:id/unassign',
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
  '/enrollments/:id/unregister',
  requireLogin,
  requireStudentAccess,
  unregisterCourse
);

// SESSIONS //
// lecturer roles
// start attendance session
courseRoute.post(
  '/:id/session/start',
  requireLogin,
  requireLecturerAccess,
  createSession
);


// MARKING ATTENDANCE // (students)
courseRoute.post('/:courseId/sessions/:sessionId/attendance',requireLogin,requireStudentAccess,markAttendance)

module.exports = courseRoute;
