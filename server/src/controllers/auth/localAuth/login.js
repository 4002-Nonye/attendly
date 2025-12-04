const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const setAuthCookie = require('../../../utils/setAuthCookie');
const sanitizeUser = require('../../../utils/sanitizeUser');
const User = mongoose.model('User');

require('dotenv').config();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const existingUser = await User.findOne({ email }).select('+password');
    // if there is no existing user, block log in
    if (!existingUser) {
      return res
        .status(401)
        .json({ error: 'User does not exist! Create an account to continue' });
    }

    if (existingUser) {
      if (!existingUser.password) {
        return res.status(401).json({
          error: 'This account uses Google Sign-In. Please log in with Google.',
        });
      }
      // compare password to allow login if there is a user
      const comparePassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      // if passwords dont match
      if (!comparePassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      setAuthCookie(res, existingUser);

      // remove sensitive or unnecessary fields before sending to the client
      const safeToSendUser = sanitizeUser(existingUser._doc);

      return res.status(200).json({
        message: 'User successfully logged in',
        user: safeToSendUser,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};