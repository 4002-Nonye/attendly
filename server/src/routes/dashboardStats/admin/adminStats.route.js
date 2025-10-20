const express = require('express');
const requireLogin = require('../../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../../middlewares/roleAccess');
const {
  getTotalFaculties,
  getTotalDepartments,
  getTotalCoursesAdmin,
  getLecturerTotal,
  getStudentsTotal,
  getFacultyAttendanceTrend,
  getSchoolAttendanceTrend,
} = require('../../../controllers/dashboardStats/admin/adminStats.controller');

const adminStatsRoute = express.Router();

adminStatsRoute.get(
  '/total-faculties',
  requireLogin,
  requireAdminAccess,
  getTotalFaculties
);
adminStatsRoute.get(
  '/total-departments',
  requireLogin,
  requireAdminAccess,
  getTotalDepartments
);

adminStatsRoute.get(
  '/total-courses',
  requireLogin,
  requireAdminAccess,
  getTotalCoursesAdmin
);

adminStatsRoute.get(
  '/total-lecturers',
  requireLogin,
  requireAdminAccess,
  getLecturerTotal
);
adminStatsRoute.get(
  '/total-students',
  requireLogin,
  requireAdminAccess,
  getStudentsTotal
);


adminStatsRoute.get(
  '/trends/faculty-weekly',
  requireLogin,
  requireAdminAccess,
  getFacultyAttendanceTrend

);

adminStatsRoute.get(
  '/trends/school-weekly',
  requireLogin,
  requireAdminAccess,
  getSchoolAttendanceTrend
);

module.exports = adminStatsRoute;