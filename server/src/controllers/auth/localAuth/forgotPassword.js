
const mongoose = require('mongoose');

const sendEmail = require('../../../lib/sendEmail');
require('dotenv').config();
const crypto = require('crypto');
const passwordResetHtml = require('../../../utils/emailTemplates/resetPasswordTemplate');


const User = mongoose.model('User');


exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const existingUser = await User.findOne({ email }).select('+password');
    if (!existingUser) {
    
      return res
        .status(200)
        .json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // check if user signed up with Google only
    if (!existingUser.password) {
      return res.status(400).json({
        error: 'This account uses Google Sign-In. Please log in with Google.',
      });
    }

    // generate token and save to DB
    const token = crypto.randomBytes(32).toString('hex');
    existingUser.resetPasswordToken = token;
    existingUser.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await existingUser.save();

    // create reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${email}`;

    // send reset email
    await sendEmail(
      email,
      'Reset Your Attendly Password',
      passwordResetHtml(resetLink, existingUser.fullName)
    );

    return res.status(200).json({
      message: 'Reset link sent to your email.',
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res
      .status(500)
      .json({ error: 'Something went wrong. Please try again later.' });
  }
};
