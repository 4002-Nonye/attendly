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
    const { schoolID } = req.user;
    // prettier-ignore
    if ( !courseCode || !courseTitle || !semester || !department || !faculty || !session|| !level) {
      return res.status(400).json({
        error: 'All fields are required',
      });

    }

    // Check if a course with the same courseCode already exists in the same department of the same school to prevent duplicates
    const existingCourse = await Course.findOne({
      courseCode,
      department,
      schoolID,
    });
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
      schoolID,
    }).save();
    return res.status(201).json({ message: 'Course created', newCourse });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editCourse = async (req, res) => {};
exports.deleteCourse = async (req, res) => {};
