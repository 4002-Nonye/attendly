const express = require('express');
const {
  authGoogle,
  authGoogleCallback,
} = require('../../controllers/auth/oAuth.controller');
const oAuthRoute = express.Router();

oAuthRoute.get('/', authGoogle);

oAuthRoute.get('/callback', authGoogleCallback);

module.exports = oAuthRoute;
