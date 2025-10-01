const passport = require('passport');
const setAuthCookie = require('../../utils/setAuthCookie');
require('dotenv').config();

exports.authGoogle = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

exports.authGoogleCallback = (req, res, next) =>
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong' });
    }

    // We receive the info to link account

    if (info?.message === 'LINK_ACCOUNT') {
      // retrieve the info stored in the token and attach to client URL
      const token = info.token;
      // redirect user to ask for consent
      return res.redirect(
        `${process.env.CLIENT_URL}/link-account/?token=${token}`
      );
    }

    // profile is incomplete if schoolId or role is missing
    const profileIncomplete =
      !user.schoolId ||
      !user.role ||
      (user.role === 'student' && !user.matricNo);

    // Set auth cookie
    setAuthCookie(res, user);

    if (profileIncomplete) {
      // Redirect user to complete profile page
      return res.redirect(`${process.env.CLIENT_URL}/complete-profile`);
    }

    // Otherwise, redirect to homepage/dashboard
    return res.redirect('/');
  })(req, res, next);
