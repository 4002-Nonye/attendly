const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');
const User = mongoose.model('User');
const Course = mongoose.model('Course');

exports.getRegisteredCoursesForStudent = async (req, res) => {
  try {
    const { id: studentId, schoolId } = req.user;

    // get the active academic year and semester for the student's school
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear || !school.currentSemester) {
      return res
        .status(400)
        .json({ error: 'No active academic year or semester found' });
    }

    // get the student's level and department
    const student = await User.findById(studentId)
      .select('level department')
      .populate('department', 'name _id')
      .lean();

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // fetch courses the student registered for in the active session
    const enrollments = await StudentEnrollment.find({
      student: studentId,
      school: schoolId,
      enrollmentStatus:'active',
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

    // flatten and filter to ensure only valid courses (matching level)
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

    // make sure sthere  are selected courses
    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({ error: 'no courses selected' });
    }

    // filter out invalid mongodb ids
    const validIds = courseIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (validIds.length !== courseIds.length) {
      return res.status(400).json({ error: 'some course ids are invalid' });
    }

    // get the student info for validation
    const student = await User.findById(studentId)
      .select('level department faculty')
      .lean();
    if (!student) return res.status(404).json({ error: 'student not found' });

    
    // confirm school has an active academic year and semester
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear || !school.currentSemester) {
      return res
        .status(400)
        .json({ error: 'no active academic year or semester found' });
    }

    // fetch all selected courses
    const courses = await Course.find({ _id: { $in: validIds } })
      .select('level department faculty')
      .lean();

    // make sure the courses match the student level and department
    const invalidCourses = courses.filter(
      (c) =>
        c.level !== student.level ||
        String(c.department) !== String(student.department)
    );
    if (invalidCourses.length > 0) {
      return res.status(400).json({
        error:
          'some selected courses are not available for your level or department',
      });
    }

    // reactivate dropped enrollments or insert new ones
    await Promise.all(
      validIds.map(async (courseId) => {
        await StudentEnrollment.findOneAndUpdate(
          {
            student: studentId,
            course: courseId,
            academicYear: school.currentAcademicYear,
            semester: school.currentSemester,
          },
          {
            student: studentId,
            course: courseId,
            school: schoolId,
            academicYear: school.currentAcademicYear,
            semester: school.currentSemester,
            enrollmentStatus: 'active',
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      })
    );

    
    return res.status(201).json({
      message: 'courses registered successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'internal server error' });
  }
};


exports.unregisterCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id: studentId } = req.user;

    const enrollment = await StudentEnrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res
        .status(404)
        .json({ error: 'You are not enrolled in this course' });
    }

    if (enrollment.enrollmentStatus === 'dropped') {
      return res
        .status(400)
        .json({ error: 'You have already unregistered from this course' });
    }

    enrollment.enrollmentStatus = 'dropped';
    await enrollment.save();

    return res.status(200).json({ message: 'Unregistered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
