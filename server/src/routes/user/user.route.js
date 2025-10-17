const {
  getAllUsers,
  getStudentsTotal,
  getLecturerTotal,
} = require('../../controllers/user/user.controller');
const requireLogin = require('../../middlewares/requireLogin');
const { requireAdminAccess } = require('../../middlewares/roleAccess');

const express = require('express');

const userRoute = express.Router();

// admin
userRoute.get('/', requireLogin, requireAdminAccess, getAllUsers);

userRoute.get(
  '/students/total',
  requireLogin,
  requireAdminAccess,
  getStudentsTotal
);
userRoute.get(
  '/lecturers/total',
  requireLogin,
  requireAdminAccess,
  getLecturerTotal
);

module.exports = userRoute;
