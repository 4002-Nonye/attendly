const mongoose = require('mongoose');
const sanitizeUser = require('../../../utils/sanitizeUser');
const User = mongoose.model('User');

exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id)
      .select(
        'email role fullName faculty department schoolId level matricNo password attendanceThreshold'
      )
      .populate('faculty', 'name')
      .populate('department', 'name')
      .populate({
        path: 'schoolId',
        select: 'schoolName currentAcademicYear currentSemester attendanceThreshold',
        populate: {
          path: 'currentAcademicYear',
          select: 'year',
        },
      })
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const hasPassword = !!user.password;
    const safeUser = sanitizeUser(user);

    return res.status(200).json({
      user: { ...safeUser, hasPassword },
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
