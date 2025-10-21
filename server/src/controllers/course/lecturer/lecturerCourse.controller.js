const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const School = mongoose.model('School');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Session = mongoose.model('Session');

exports.getAssignedCoursesForLecturer = async (req, res) => {
  try {
    const { id: lecturerId, schoolId } = req.user;

    // Find the lecturer's school and check if it has an active academic year
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();
    if (!school || !school.currentAcademicYear) {
      return res.status(400).json({ error: 'No active academic year found' });
    }

    // Filter courses by lecturer and current academic year
    const courses = await Course.find({
      lecturers: lecturerId,
      schoolId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .populate('faculty', 'name')
      .populate('department', 'name')
      .sort({ level: 1, courseCode: 1 })
      .lean();

    //  lecturer has no assigned courses
    if (!courses.length) {
      return res.status(200).json({ courses: [] });
    }

    // Get total students and total sessions for each course
    const [studentCounts, sessionCounts] = await Promise.all([
      // Count how many students are enrolled in each course
      StudentEnrollment.aggregate([
        { $match: { course: { $in: courses.map((c) => c._id) } } },
        { $group: { _id: '$course', count: { $sum: 1 } } },
      ]),

      // Count how many sessions each course has in the current academic year and semester
      Session.aggregate([
        {
          $match: {
            course: { $in: courses.map((c) => c._id) },
            academicYear: school.currentAcademicYear,
            semester: school.currentSemester,
          },
        },
        { $group: { _id: '$course', count: { $sum: 1 } } },
      ]),
    ]);

    // Create quick lookup objects for students and sessions
    const studentMap = Object.fromEntries(
      studentCounts.map((i) => [i._id.toString(), i.count])
    );
    const sessionMap = Object.fromEntries(
      sessionCounts.map((i) => [i._id.toString(), i.count])
    );

    // Attach the totals to each course
    const data = courses.map((course) => ({
      ...course,
      totalStudents: studentMap[course._id.toString()] || 0,
      totalSessions: sessionMap[course._id.toString()] || 0,
    }));

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.assignLecturer = async (req, res) => {
  try {
    const { courseIds } = req.body;
    const lecturerId = req.user.id;
    const { schoolId } = req.user;

    //   Validate that courseIds exist and are in array form
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ error: 'No courses selected' });
    }

    //   Filter out invalid ObjectIds
    const validIds = courseIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (validIds.length !== courseIds.length) {
      return res.status(400).json({ error: 'Some course IDs are invalid' });
    }

    //   Get the school's active academic year and semester
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear || !school.currentSemester) {
      return res
        .status(400)
        .json({ error: 'No active academic year or semester found' });
    }

    //   Verify that the selected courses exist for this school and session
    const existingCourses = await Course.find({
      _id: { $in: validIds },
      schoolId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    });

    if (!existingCourses.length) {
      return res
        .status(404)
        .json({ error: 'No valid courses found for the active session' });
    }

    //   Assign the lecturer to all valid courses (without duplicates)
    await Course.updateMany(
      {
        _id: { $in: existingCourses.map((c) => c._id) },
        schoolId,
      },
      { $addToSet: { lecturers: lecturerId } }
    );

    return res.status(200).json({
      message: 'Courses assigned successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.unassignLecturer = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id: lecturerId, schoolId } = req.user;

    //  Validate the courseId
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    //  Get the school's active academic year and semester
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear || !school.currentSemester) {
      return res
        .status(400)
        .json({ error: 'No active academic year or semester found' });
    }

    //  Find and update the course if it’s in the current active session
    const updatedCourse = await Course.findOneAndUpdate(
      {
        _id: courseId,
        lecturers: lecturerId,
        schoolId,
        academicYear: school.currentAcademicYear,
        semester: school.currentSemester,
      },
      { $pull: { lecturers: lecturerId } }, // remove the lecturer from the array
      { new: true }
    );

    //  If not found, return proper error
    if (!updatedCourse) {
      return res.status(404).json({
        error:
          'Course not found in the active session or you are not assigned to this course',
      });
    }

    //
    return res.status(200).json({
      message: 'Lecturer unassigned successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
