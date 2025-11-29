const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const { getSchools, setAttendanceThreshold } = require('../../controllers/school/school.controller');
const { requireAdminAccess } = require('../../middlewares/roleAccess');
const {
  createNewAcademicYear,
  switchSemester,
  closeAcademicYear,
} = require('../../controllers/academicYear/academicYear.controller');

const schoolRoute = express.Router();

schoolRoute.get('/', getSchools);

schoolRoute.post(
  '/academic-year',
  requireLogin,
  requireAdminAccess,
  createNewAcademicYear
);
schoolRoute.put(
  '/academic-year/semester/switch',
  requireLogin,
  requireAdminAccess,
  switchSemester
);

schoolRoute.put(
  '/academic-year/close',
  requireLogin,
  requireAdminAccess,
  closeAcademicYear
);
schoolRoute.patch(
  '/attendance-threshold',
  requireLogin,
  requireAdminAccess,
  setAttendanceThreshold
);

module.exports = schoolRoute;
