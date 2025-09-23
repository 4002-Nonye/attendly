const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');

exports.getRegisteredCoursesForStudent = async (req, res) => {
  try {
    const studentID = req.user.id;

    // do not fetch enrolled students here
    const courses = await StudentEnrollment.find({ student: studentID })
      .populate('course', 'courseTitle courseCode')
      .populate('student', 'fullName');
    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found' });
    }

    res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerCourse = async (req, res) => {
  try {
    const { courseIDs } = req.body;
    const studentID = req.user.id;

    // Validate IDs
    if (!courseIDs || !Array.isArray(courseIDs) || courseIDs.length === 0) {
      return res.status(400).json({ message: 'No courses selected' });
    }

    // Filter out invalid MongoDB ObjectIds
    const validIds = courseIDs.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (validIds.length !== courseIDs.length) {
      return res.status(400).json({ message: 'Some course IDs are invalid' });
    }

    // Prepare documents
  //  todo: in frontend, we block registering courses that are already registered
    const enrollments = validIds.map((courseID) => ({
      student: studentID,
      course: courseID,
    }));

    // insert with duplicate skip
    const result = await StudentEnrollment.insertMany(enrollments, {
      ordered: false,
    }).catch((err) => {
      if (err.code === 11000) return;
      throw err;
    });

    res.status(201).json({
      message: 'Courses registered successfully',
      registered: result,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.unregisterCourse = async (req, res) => {
  try {
    const { id: courseID } = req.params;
    const { id: studentID } = req.user;
    const deleted = await StudentEnrollment.findOneAndDelete({
      student: studentID,
      course: courseID,
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'You are not enrolled in this course' });
    }

    return res.status(200).json({ message: 'Unregistered successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
