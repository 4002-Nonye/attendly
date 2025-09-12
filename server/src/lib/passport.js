const mongoose = require('mongoose');
const passport = require('passport');
const sanitizeUser = require('../utils/sanitizeUser');
const jwt =require('jsonwebtoken')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();
const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback', // when the user give us permission to access their profile, the user is thrown back to this URL with a code from google attached to the URL,
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      // todo: optimize later
      const { id, displayName, emails, photos } = profile;

      const userEmail = emails[0].value;
      const existingUser = await User.findOne({ email: userEmail });
      if (existingUser) {
        // CASE : User initially signed up with email and password,
        // then the user tries to login with google using same email account
        // we prompt the user to link their account (can sign in with both password and google)
        if (existingUser && !existingUser.googleID) {
          // store user information in a token
          const token = jwt.sign(
            { email:userEmail, googleID: id, displayName },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
          );

          // prepare data to be linked (googleID)
          return done(null, false, {
            message: 'LINK_ACCOUNT',
            token,
          });
        }
        const safeToSendUser = sanitizeUser(existingUser._doc);
        return done(null, safeToSendUser);
      } else {
        const newUser = await new User({
          googleID: id,
          email: userEmail,
          fullName: displayName,
        }).save();

        done(null, newUser);
      }
    }
  )
);
