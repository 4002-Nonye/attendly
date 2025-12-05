const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../../middlewares/roleAccess');
const {
  createCourse,
  editCourse,
  deleteCourse,
} = require('../../../controllers/course/admin/adminCourse.controller');

const adminCourseRoute = express.Router();

// Create a new course
adminCourseRoute.post('/', requireLogin, requireAdminAccess, createCourse);

// Edit a course
adminCourseRoute.put('/:id', requireLogin, requireAdminAccess, editCourse);
// Delete a course
adminCourseRoute.delete('/:id', requireLogin, requireAdminAccess, deleteCourse);


module.exports = adminCourseRoute;
