const express = require('express');
require('./src/models/user');
const localAuthRoute = require('./src/routes/auth/localAuth.route');
const oAuthRoute = require('./src/routes/auth/oAuth.route');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const connectDB = require('./src/lib/db');

require('./src/lib/passport');

require('dotenv').config();






const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());




app.use('/api/auth', localAuthRoute);
app.use('/auth/google', oAuthRoute);












app.listen(process.env.PORT, () => {
  // Connect to the database after server starts
  console.log(process.env.PORT);
  connectDB();
});
