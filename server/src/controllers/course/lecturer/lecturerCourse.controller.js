const mongoose = require('mongoose');
const Course = mongoose.model('Course');

exports.getAssignedCoursesForLecturer = async (req, res) => {
  try {
    const lecturerId = req.user.id;

    const courses = await Course.find({ lecturers: lecturerId }).populate(
      'lecturers',
      'fullName'
    );

    if (!courses || courses.length === 0) {
      return res.status(404).json({ error: 'No courses found' });
    }

    res.status(200).json({ courses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.assignLecturer = async (req, res) => {
  try {
    const { courseIds } = req.body;
    const lecturerId = req.user.id;

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

    // check if courses exist
    const existingCourses = await Course.find({ _id: { $in: validIds } });

    if (!existingCourses.length) {
      return res
        .status(404)
        .json({ error: 'No courses found with the provided IDs' });
    }

    // Update all courses in one go
     await Course.updateMany(
      { _id: { $in: validIds } },
      { $addToSet: { lecturers: lecturerId } }
    );

    

    res.status(200).json({
      message: 'Courses assigned successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.unassignLecturer = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { id: lecturerId } = req.user;

    const updatedCourse = await Course.findOneAndUpdate(
      { _id: courseId, lecturers: lecturerId }, // find all courses where the lecturerId is in the course.lecturer
      { $pull: { lecturers: lecturerId } }, // remove the lecturerId from the array
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        error: 'Course not found or you are not assigned to this course',
      });
    }

    return res.status(200).json({
      message: 'Unassigned successfully'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
