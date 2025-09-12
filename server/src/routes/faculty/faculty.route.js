const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../middlewares/roleAccess');
const {
  createFaculty,
  editFaculty,
  deleteFaculty,
  getFaculties,
  getFacultyByID,
} = require('../../controllers/faculty/faculty.controller');

const facultyRoute = express.Router();


facultyRoute.get('/',requireLogin,getFaculties)
facultyRoute.get('/:id',requireLogin,getFacultyByID)
facultyRoute.post('/', requireLogin, requireAdminAccess, createFaculty);
facultyRoute.put('/:facultyID',requireLogin,requireAdminAccess,editFaculty)
facultyRoute.delete('/:facultyID',requireLogin,requireAdminAccess,deleteFaculty)

module.exports = facultyRoute;
