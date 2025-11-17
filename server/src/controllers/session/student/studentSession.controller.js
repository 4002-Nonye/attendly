const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Session = mongoose.model('Session');
const Attendance = mongoose.model('Attendance');
const School = mongoose.model('School');

exports.getActiveSessionsForStudent = async (req, res) => {
  try {
    const { id: studentId, schoolId } = req.user;

    // 1. get current academic year and semester for the school
    const school = await School.findById(schoolId).populate(
      'currentAcademicYear'
    );
    if (!school || !school.currentAcademicYear) {
      return res
        .status(400)
        .json({ error: 'No active academic year found for this school' });
    }

    // 2. get all courses the student is actively enrolled in
    const enrollments = await StudentEnrollment.find({
      student: studentId,
      enrollmentStatus: 'active',
    }).select('course createdAt');

    if (!enrollments.length) {
      return res.status(200).json({ session: [], total: 0 });
    }

    const courseIds = enrollments.map((enrollment) => enrollment.course);

    // create map of courseId -> enrollment date
    const enrollmentDates = {};
    enrollments.forEach((e) => {
      enrollmentDates[e.course.toString()] = e.createdAt;
    });

    // build conditions: for each course, only get sessions after student enrolled
    const sessionConditions = courseIds.map((courseId) => ({
      course: courseId,
      createdAt: { $gte: enrollmentDates[courseId.toString()] },
    }));

    // 3. get active sessions for these courses
    const activeSessions = await Session.find({
      $or: sessionConditions,
      academicYear: school.currentAcademicYear._id,
      semester: school.currentSemester,
      status: 'active',
    })
      .select('-token') // hide token
      .populate('course', 'courseTitle courseCode')
      .populate('startedBy', 'fullName')
      .lean();

    // 4. fetch all attendances for this student in these sessions
    const attendances = await Attendance.find({
      student: studentId,
      session: { $in: activeSessions.map((s) => s._id) },
      status: 'Present',
    }).select('session');

    const attendedSessionIds = new Set(
      attendances.map((a) => a.session.toString())
    );

    // 5. build sessions to include attendanceMarked status
    const activeSessionsWithAttendance = activeSessions.map((session) => ({
      ...session,
      attendanceMarked: attendedSessionIds.has(session._id.toString()),
    }));

    return res.status(200).json({
      session: activeSessionsWithAttendance,
      total: activeSessionsWithAttendance.length,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
