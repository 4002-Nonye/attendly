const mongoose = require('mongoose');
const setAuthCookie = require('../../../utils/setAuthCookie');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../../lib/sendEmail');
const confirmAccountLinkHtml = require('../../../utils/emailTemplates/confirmAccountLink');

require('dotenv').config();


const User = mongoose.model('User');


exports.linkAccount = async (req, res) => {
  const { token } = req.body;
  try {
    // retrieve the user stored from the token and decode it
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { email, googleId } = payload;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    if (existingUser.googleId) {
      return res.status(409).json({ error: 'Account already linked' });
    }
    // add google ID to link account that initially signed in with email and password
    existingUser.googleId = googleId;
    await existingUser.save();

    // send email -successfully linked
    await sendEmail(
      email,
      'A new sign-in method was added to your account',
      confirmAccountLinkHtml(existingUser.fullName)
    );

    setAuthCookie(res, existingUser);
    return res
      .status(200)
      .json({ message: 'Account linked successfully', user: existingUser });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};