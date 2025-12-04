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
  changePassword,
  setPassword,
} = require('../../controllers/auth/localAuth/index');

const localAuthRoute = express.Router();

localAuthRoute.post('/signup', signup);
localAuthRoute.post('/login', login);
localAuthRoute.get('/logout', logout);
localAuthRoute.put('/complete-profile', requireLogin, completeProfile);
localAuthRoute.post('/link-account', linkAccount);
localAuthRoute.post('/forgot-password', forgotPassword);
localAuthRoute.post('/reset-password', resetPassword);
localAuthRoute.get('/user', requireLogin, getUser); // authenticated user (lightweight data)
localAuthRoute.post('/change-password', requireLogin, changePassword);
localAuthRoute.post('/set-password', requireLogin, setPassword);

module.exports = localAuthRoute;
