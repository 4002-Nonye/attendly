
const mongoose = require('mongoose');

require('dotenv').config();

const hashPassword = require('../../utils/hashPassword');

const User = mongoose.model('User');

exports.resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  try {
    // fetch the user if the token is still valid
    const existingUser = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const hashedPassword = await hashPassword(newPassword);
    existingUser.password = hashedPassword; //reset password
    existingUser.resetPasswordToken = undefined; // clear token
    existingUser.resetPasswordExpires = undefined;
    await existingUser.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};