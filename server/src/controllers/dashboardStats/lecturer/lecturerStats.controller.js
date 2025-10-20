const mongoose = require('mongoose');
const Course = mongoose.model('Course');

exports.getStudentsTotal = async (req, res) => {
  try {
    const { id: lecturerId } = req.user;
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTotalCoursesLecturer = async (req, res) => {
  try {
    const { id: lecturerId } = req.user;

    const total = await Course.countDocuments({
      lecturers: lecturerId,
    });

    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTotalSessions = async (req, res) => {};

exports.avgAttendance = async (req, res) => {};
