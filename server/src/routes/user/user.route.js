const { getAllUsers } = require( '../../controllers/user/user.controller');
const requireLogin = require( '../../middlewares/requireLogin');
const { requireAdminAccess } = require( '../../middlewares/roleAccess');

const express = require('express');

const userRoute = express.Router();

userRoute.get('/', requireLogin, requireAdminAccess, getAllUsers);

module.exports= userRoute;
