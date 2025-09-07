const express = require('express');
const {
  authGoogle,
  authGoogleCallback,
} = require('../../controllers/oAuth.controller');
const oAuthRoute = express.Router();

oAuthRoute.get('/', authGoogle);

oAuthRoute.get('/callback', authGoogleCallback);

module.exports = oAuthRoute;
