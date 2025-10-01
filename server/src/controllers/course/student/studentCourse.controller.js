const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');

exports.getRegisteredCoursesForStudent = async (req, res) => {
  try {
    const studentId = req.user.id;

    // do not fetch enrolled students here
    const courses = await StudentEnrollment.find({ student: studentId })
      .populate('course', 'courseTitle courseCode')
      .populate('student', 'fullName');
    if (!courses || courses.length === 0) {
      return res.status(404).json({ error: 'No courses found' });
    }

    res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerCourse = async (req, res) => {
  try {
    const { courseIds } = req.body;
    const studentId = req.user.id;

    // Validate IDs
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ error: 'No courses selected' });
    }

    // Filter out invalid MongoDB ObjectIds
    const validIds = courseIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (validIds.length !== courseIds.length) {
      return res.status(400).json({ error: 'Some course IDs are invalid' });
    }

    // Prepare documents
  //  todo: in frontend, we block receiving ids of courses that are already registered
    const enrollments = validIds.map((courseId) => ({
      student: studentId,
      course: courseId,
    }));

    // insert with duplicate skip
   await StudentEnrollment.insertMany(enrollments, {
      ordered: false,
    }).catch((err) => {
      if (err.code === 11000) return;
      throw err;
    });

    res.status(201).json({
      message: 'Courses registered successfully',
     
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.unregisterCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id: studentId } = req.user;
    const deleted = await StudentEnrollment.findOneAndDelete({
      student: studentId,
      course: courseId,
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ error: 'You are not enrolled in this course' });
    }

    return res.status(200).json({ message: 'Unregistered successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
