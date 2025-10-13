const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');

exports.getRegisteredCoursesForStudent = async (req, res) => {
  try {
    const { id: studentId, schoolId } = req.user;

    //  Get the active academic year and semester for the student's school
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear || !school.currentSemester) {
      return res
        .status(400)
        .json({ error: 'No active academic year or semester found' });
    }

    //  Fetch courses the student registered for in the active session
    const courses = await StudentEnrollment.find({
      student: studentId,
      schoolId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .populate('course', 'courseTitle courseCode')
      .populate('student', 'fullName')
      .lean();

    //  Handle if no courses found
    if (!courses.length) {
      return res.status(404).json({ error: 'No registered courses found' });
    }

    return res.status(200).json({ courses });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.registerCourse = async (req, res) => {
  try {
    const { courseIds } = req.body;
    const { id: studentId, schoolId } = req.user;

    //  Validate input
    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ error: 'No courses selected' });
    }

    //  Filter out invalid ObjectIds
    const validIds = courseIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (validIds.length !== courseIds.length) {
      return res.status(400).json({ error: 'Some course IDs are invalid' });
    }

    //  Fetch school and confirm there’s an active academic year & semester
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear || !school.currentSemester) {
      return res
        .status(400)
        .json({ error: 'No active academic year or semester found' });
    }

    //  Prepare enrollment documents for the active session
    const enrollments = validIds.map((courseId) => ({
      student: studentId,
      course: courseId,
      schoolId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    }));

    //  Insert documents, skipping duplicates (MongoDB error 11000)
    await StudentEnrollment.insertMany(enrollments, { ordered: false }).catch(
      (err) => {
        if (err.code === 11000) return; // skip duplicate key errors
        throw err;
      }
    );

    return res.status(201).json({
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

    // find and delete the student's enrollment record
    const deleted = await StudentEnrollment.findOneAndDelete({
      student: studentId,
      course: courseId,
    });

    // If no enrollment record was found, the student wasn’t enrolled
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
