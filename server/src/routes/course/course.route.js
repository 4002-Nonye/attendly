const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const {
  createCourse,
  getCoursesForStudent,
  getCoursesForLecturer,
  getCoursesForAdmin,
  getCourseByID,
  editCourse,
  deleteCourse,
  assignLecturer,
  registerCourse,
} = require('../../controllers/course/course.controller');

const {
  requireStudentAccess,
  requireLecturerAccess,
  requireAdminAccess,
} = require('../../middlewares/roleAccess');

const courseRoute = express.Router();

// General roles
courseRoute.get('/:id', requireLogin, getCourseByID); // get a single course

// Admin roles
courseRoute.post('/', requireLogin, requireAdminAccess, createCourse); // create a new course

courseRoute.get('/admin/all', requireLogin, requireAdminAccess, getCoursesForAdmin);
//courseRoute.put('/:id', requireLogin, requireAdminAccess, editCourse); // edit a course
courseRoute.delete('/:id', requireLogin, requireAdminAccess, deleteCourse); // delete a course



// Lecturer roles
courseRoute.post(
  '/assign-lecturer',
  requireLogin,
  requireLecturerAccess,
  assignLecturer
);
courseRoute.get('/lecturer', requireLogin, requireLecturerAccess, getCoursesForLecturer);

// Student roles
courseRoute.post(
  '/register',
  requireLogin,
  requireStudentAccess,
  registerCourse
);
courseRoute.get('/student', requireLogin, requireStudentAccess, getCoursesForStudent);

module.exports = courseRoute;