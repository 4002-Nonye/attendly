const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

require('dotenv').config();

const hashPassword = require('../../../utils/hashPassword');
const User = mongoose.model('User');

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    //  validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords are required' });
    }

    // get user
    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // check if user has a password set
    if (!user.password) {
      return res.status(400).json({
        error: 'No password set.',
      });
    }

    // 1. check if old password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // 2. block reusing old password
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        error: 'New password must be different from current password',
      });
    }

    // 3. hash new password
    user.password = await hashPassword(newPassword);

    await user.save();

    return res.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};