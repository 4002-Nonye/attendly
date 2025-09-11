const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../middlewares/roleAccess');
const {
  createFaculty,
} = require('../../controllers/faculty/faculty.controller');

const facultyRoute = express.Router();

facultyRoute.post('/', requireLogin, requireAdminAccess, createFaculty);

module.exports = facultyRoute;
