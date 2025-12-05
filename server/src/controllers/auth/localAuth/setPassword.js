
const mongoose = require('mongoose');

require('dotenv').config();
const hashPassword = require('../../../utils/hashPassword');

const User = mongoose.model('User');


exports.setPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user;

    if (!newPassword) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await User.findById(id).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 1. check if user currently has password or not
    if (user.password) {
      return res.status(400).json({ error: 'Password already set.' });
    }

    // 2. hasg new password
    user.password = await hashPassword(newPassword);

    await user.save();

    return res.json({ message: 'Password set successfully' });
  } catch (error) {
    console.error('Set password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
