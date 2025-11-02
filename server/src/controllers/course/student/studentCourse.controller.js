const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');
const User = mongoose.model('User');
const Course = mongoose.model('Course');

exports.getRegisteredCoursesForStudent = async (req, res) => {
  try {
    const { id: studentId, schoolId } = req.user;

    // Get the active academic year and semester for the student's school
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear || !school.currentSemester) {
      return res
        .status(400)
        .json({ error: 'No active academic year or semester found' });
    }

    // Get the student's level and department
    const student = await User.findById(studentId)
      .select('level department')
      .populate('department', 'name _id')
      .lean();

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Fetch courses the student registered for in the active session
    const enrollments = await StudentEnrollment.find({
      student: studentId,
      school: schoolId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .select('course -_id')
      .populate({
        path: 'course',
        select: 'courseTitle courseCode unit level department faculty',
        populate: [
          { path: 'department', select: 'name _id' },
          { path: 'faculty', select: 'name _id' },
        ],
      })
      .lean();

    // Flatten and filter to ensure only valid courses (matching level)
    const courses = enrollments
      .map((e) => e.course)
      .filter(
        (course) =>
          course &&
          course.level === student.level &&
          String(course.department?._id) === String(student.department?._id)
      );

    return res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
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

    //  Fetch student info
    const student = await User.findById(studentId).select('level department faculty').lean();
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    //  Fetch school and confirm there’s an active academic year & semester
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear || !school.currentSemester) {
      return res
        .status(400)
        .json({ error: 'No active academic year or semester found' });
    }

    //  Fetch selected courses
    const courses = await Course.find({ _id: { $in: validIds } })
      .select('level department faculty')
      .lean();

    //  Validate all courses belong to student's level (and optionally department)
    const invalidCourses = courses.filter(
      (c) =>
        c.level !== student.level ||
        String(c.department) !== String(student.department)
    );

    if (invalidCourses.length > 0) {
      return res.status(400).json({
        error: 'Some selected courses are not available for your level or department',
      });
    }

    //  Prepare enrollment documents for the active session
    const enrollments = validIds.map((courseId) => ({
      student: studentId,
      course: courseId,
      school: schoolId,
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
    console.error(error);
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
