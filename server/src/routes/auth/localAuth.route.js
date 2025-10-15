const express = require('express');
const requireLogin = require('../../middlewares/requireLogin');
const {
  signup,
  login,
  logout,
  completeProfile,
  linkAccount,
  forgotPassword,
  resetPassword,
   getUser,
   getUserProfile,
} = require('../../controllers/auth/localAuth.controller');

const localAuthRoute = express.Router();

localAuthRoute.post('/signup', signup);
localAuthRoute.post('/login', login);
localAuthRoute.get('/logout', logout);
localAuthRoute.put('/complete-profile',requireLogin,completeProfile)
localAuthRoute.post('/link-account', linkAccount);
localAuthRoute.post('/forgot-password', requireLogin, forgotPassword);
localAuthRoute.post('/reset-password', requireLogin, resetPassword); 
localAuthRoute.get('/user',requireLogin, getUser);
localAuthRoute.get('/me',requireLogin,getUserProfile)

module.exports = localAuthRoute;