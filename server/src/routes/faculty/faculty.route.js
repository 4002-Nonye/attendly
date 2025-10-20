const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../middlewares/roleAccess');
const {
  createFaculty,
  editFaculty,
  deleteFaculty,
  
  getFacultyStats,
  getFacultiesBySchool,
  
} = require('../../controllers/faculty/faculty.controller');

const facultyRoute = express.Router();

facultyRoute.get('/',requireLogin,requireAdminAccess,getFacultyStats)
facultyRoute.get('/:schoolId',getFacultiesBySchool)
facultyRoute.post('/', requireLogin, requireAdminAccess, createFaculty);
facultyRoute.put('/:facultyId',requireLogin,requireAdminAccess,editFaculty)
facultyRoute.delete('/:facultyId',requireLogin,requireAdminAccess,deleteFaculty)

module.exports = facultyRoute;
