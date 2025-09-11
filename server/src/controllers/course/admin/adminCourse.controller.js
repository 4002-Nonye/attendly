const mongoose = require('mongoose');
const Course = mongoose.model('Course');


exports.createCourse = async (req, res) => {
  try {
    const {
      courseCode,
    courseTitle,
      semester,
      department,
      faculty,
      session,
      level,
    } = req.body;
    // prettier-ignore
    if ( !courseCode || !courseTitle || !semester || !department || !faculty || !session|| !level) {
      return res.status(400).json({
        error: 'All fields are required',
      });

    }

    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(409).json({ error: 'Course already exists' });
    }

    const newCourse = await new Course({
      courseCode,
      courseTitle,
      semester,
      department,
      faculty,
      session,
      level,
    }).save();
    return res.status(201).json({ message: 'Course created', newCourse });
  } catch (error) {
   
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCoursesForAdmin = async (req, res) => {
  try {
    // Optionally filter by faculty, department, level, or session using query params
    const filter = {};
    if (req.query.faculty) filter.faculty = req.query.faculty;
    if (req.query.department) filter.department = req.query.department;
    if (req.query.level) filter.level = req.query.level;
    if (req.query.session) filter.session = req.query.session;
    const courses = await Course.find(filter)
      .populate('lecturers', 'fullName email')
      .populate('students', 'fullName email');

    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editCourse = async (req, res) => {};
exports.deleteCourse = async (req, res) => {};
