const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');

const {
  requireStudentAccess,
  requireLecturerAccess,
  requireAdminAccess,
} = require('../../middlewares/roleAccess');

const {
  getCourseByID,
  getCourses,
} = require('../../controllers/course/course.controller');

const {
  createCourse,
  deleteCourse,
  editCourse,
} = require('../../controllers/course/admin/adminCourse.controller');
const {
  assignLecturer,
} = require('../../controllers/course/lecturer/lecturerCourse.controller');
const {
  registerCourse,
} = require('../../controllers/course/student/studentCourse.controller');

const courseRoute = express.Router();

// General roles
courseRoute.get('/:id', requireLogin, getCourseByID); // get a single course
courseRoute.get('/', requireLogin, getCourses);

// Admin roles
courseRoute.post('/', requireLogin, requireAdminAccess, createCourse); // create a new course
courseRoute.put('/:id', requireLogin, requireAdminAccess, editCourse); // edit a course
courseRoute.delete('/:id', requireLogin, requireAdminAccess, deleteCourse); // delete a course

// Lecturer roles
courseRoute.post(
  '/assign-lecturer',
  requireLogin,
  requireLecturerAccess,
  assignLecturer
);

// Student roles
courseRoute.post(
  '/register',
  requireLogin,
  requireStudentAccess,
  registerCourse
);

module.exports = courseRoute;
