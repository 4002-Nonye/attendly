const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');

const {
  getCourseById,
  getCourses,
} = require('../../../controllers/course/course.controller');

const generalCourseRoute = express.Router();



// Get a single course
generalCourseRoute.get('/:id', requireLogin, getCourseById);
// Get all courses
generalCourseRoute.get('/', requireLogin, getCourses);

module.exports = generalCourseRoute;
