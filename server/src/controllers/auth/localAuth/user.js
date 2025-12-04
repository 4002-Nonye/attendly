
const mongoose = require('mongoose');

const sanitizeUser = require('../../../utils/sanitizeUser');

require('dotenv').config();
const User = mongoose.model('User');


exports.getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id)
      .select('email role fullName password level schoolId')
      .populate({
        path: 'schoolId',
        select: 'schoolName currentAcademicYear currentSemester',
        populate: {
          path: 'currentAcademicYear',
          select: 'year',
        },
      });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const safeToSendUser = sanitizeUser(user._doc);

    return res.status(200).json({ user: { ...safeToSendUser } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};