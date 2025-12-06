const jwt = require('jsonwebtoken');
require('dotenv').config();

const setAuthCookie = (res, user) => {
 
  // create a jwt for a newly created user
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  // send the token to the browser as a HTTP-only token
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

module.exports = setAuthCookie;
