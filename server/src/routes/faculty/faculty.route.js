const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../middlewares/roleAccess');
const {
  createFaculty,
  editFaculty,
  deleteFaculty,
  getFacultiesAndDepartmentsBySchool,
  getFacultyStats,
} = require('../../controllers/faculty/faculty.controller');

const facultyRoute = express.Router();


facultyRoute.get('/:id/faculties-and-departments',requireLogin,getFacultiesAndDepartmentsBySchool)
facultyRoute.get('/',requireLogin,requireAdminAccess,getFacultyStats)
facultyRoute.post('/', requireLogin, requireAdminAccess, createFaculty);
facultyRoute.put('/:facultyID',requireLogin,requireAdminAccess,editFaculty)
facultyRoute.delete('/:facultyID',requireLogin,requireAdminAccess,deleteFaculty)

module.exports = facultyRoute;
