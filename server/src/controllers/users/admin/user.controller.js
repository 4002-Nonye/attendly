const mongoose = require('mongoose');
const sanitizeUser = require('../../../utils/sanitizeUser');
const User = mongoose.model('User');
const Course = mongoose.model('Course');
const StudentEnrollment = mongoose.model('StudentEnrollment');

exports.getLecturers = async (req, res) => {
  try {
    const lecturers = await User.find({
      role: 'lecturer',
    })
      .populate('faculty', 'name')
      .populate('department', 'name')
      .lean();

    const lecturersWithCourseCount = await Promise.all(
      lecturers.map(async (lect) => {
        const courseCount = await Course.countDocuments({
          lecturers: lect._id,
        });
        return {
          ...lect,
          coursesTotal: courseCount,
        };
      })
    );
    return res.status(200).json({ lecturers: lecturersWithCourseCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: 'student',
    })
      .populate('faculty', 'name')
      .populate('department', 'name')
      .lean();

    const studentsWithCourseCount = await Promise.all(
      students.map(async (student) => {
        const courseCount = await StudentEnrollment.countDocuments({
          student: student._id,
          enrollmentStatus:'active'
        });
        return {
          ...student,
          coursesTotal: courseCount,
        };
      })
    );
    return res.status(200).json({ students: studentsWithCourseCount });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id)
      .select('email role fullName faculty department schoolId level')
      .populate('faculty', 'name')
      .populate('department', 'name')
      .populate('schoolId', 'schoolName');

    if (!user) return res.status(404).json({ error: 'User not found' });
    const hasPassword = !!user.password;
    const safeToSendUser = sanitizeUser(user._doc);
    return res.status(200).json({
      user: { ...safeToSendUser, hasPassword },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
