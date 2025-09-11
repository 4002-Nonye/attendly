const mongoose = require('mongoose');
const Course = mongoose.model('Course');

exports.getRegisteredCoursesForStudent = async (req, res) => {
  try {
    const studentID = req.user.id;

    // do not fetch enrolled students here
    const courses = await Course.find({ students: studentID })
      .select('-students')
      .populate('lecturers', 'fullName');

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

    // Prepare bulk operations
    // For each valid course ID, create an update operation
    const bulkOps = validIds.map((courseID) => ({
      updateOne: {
        // $ne ensures we only update courses where lecturer is NOT already assigned
        filter: {
          _id: courseID,
          students: { $ne: studentID },
        },
        update: { $addToSet: { students: studentID } },
        // $addToSet ensures we don't add duplicate IDs in the array
      },
    }));

    //Execute bulk update
    const result = await Course.bulkWrite(bulkOps);

    // fetch updated data for response
    const updatedCourses = await Course.find({
      _id: { $in: validIds },
    }).populate('students', 'fullName email matricNo');
    res.status(200).json({
      message: 'Courses registered successfully',
      updatedCourses,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.unregisterCourse = async (req, res) => {};

