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

