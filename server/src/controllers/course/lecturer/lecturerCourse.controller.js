const mongoose = require('mongoose');
const Course = mongoose.model('Course');

exports.getAssignedCoursesForLecturer = async (req, res) => {
  try {
    const lecturerID = req.user.id;

    const courses = await Course.find({ lecturers: lecturerID }).populate(
      'lecturers',
      'fullName'
    );

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found' });
    }

    res.status(200).json({ courses });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.assignLecturer = async (req, res) => {
  try {
    const { courseIDs } = req.body;
    const lecturerID = req.user.id;

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

    // check if courses exist
    const existingCourses = await Course.find({ _id: { $in: courseIDs } });

    if (!existingCourses.length) {
      return res
        .status(404)
        .json({ message: 'No courses found with the provided IDs' });
    }

    // Prepare bulk operations
    // For each valid course ID, create an update operation
    const bulkOps = validIds.map((courseID) => ({
      updateOne: {
        // $ne ensures we only update courses where lecturer is NOT already assigned
        filter: {
          _id: courseID,
          lecturers: { $ne: lecturerID },
        },
        update: { $addToSet: { lecturers: lecturerID } },
        // $addToSet ensures we don't add duplicate IDs in the array
      },
    }));

    //Execute bulk update
    const result = await Course.bulkWrite(bulkOps);

    // fetch updated data for response
    const updatedCourses = await Course.find({
      _id: { $in: validIds },
    }).populate('lecturers', 'fullName email');
    res.status(200).json({
      message: 'Courses assigned successfully',
      updatedCourses,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.unassignLecturer = async (req, res) => {
  try {
    const { id: courseID } = req.params;
    const { id: lecturerID } = req.user;

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseID, lecturers: lecturerID }, // find all courses where the lecturerID is in the course.lecturer
      { $pull: { lecturers: lecturerID } }, // remove the lecturerID from the array
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        message: 'Course not found or you are not assigned to this course',
      });
    }

    return res.status(200).json({
      message: 'Unassigned successfully',
      course: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
