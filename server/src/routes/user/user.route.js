const express = require('express');
const { requireAdminAccess } = require('../../middlewares/roleAccess');
const requireLogin = require('../../middlewares/requireLogin');
const { getLecturers, getStudents } = require('../../controllers/users/admin/adminUser.controller');
const { getUserProfile } = require('../../controllers/users/general/user.controller');


const userRoute = express.Router();

userRoute.get('/lecturers', requireLogin, requireAdminAccess, getLecturers);
userRoute.get('/students', requireLogin, requireAdminAccess, getStudents);
userRoute.get('/me', requireLogin, getUserProfile); // user profile (non-lightweight)

module.exports = userRoute;
