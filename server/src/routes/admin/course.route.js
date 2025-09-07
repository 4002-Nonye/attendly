const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const requireAdminAccess = require('../../middlewares/requireAdminAccess');
const {createCourse,getCourses,getCourseByID,editCourse,deleteCourse}=require('../../controllers/admin/course.controller')

const courseRoute = express.Router();

courseRoute.get('/', requireLogin, requireAdminAccess, getCourses); // get all courses
courseRoute.get('/:id', requireLogin, requireAdminAccess, getCourseByID); // get a single course
courseRoute.post('/', requireLogin, requireAdminAccess, createCourse); // create a new course
courseRoute.put('/:id', requireLogin, requireAdminAccess, editCourse); // edit a course
courseRoute.delete('/:id', requireLogin, requireAdminAccess, deleteCourse); // delete a course

module.exports = courseRoute;
