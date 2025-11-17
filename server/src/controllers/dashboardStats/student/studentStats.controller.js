const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Session = mongoose.model('Session');
const School = mongoose.model('School');
const Attendance = mongoose.model('Attendance');
const User = mongoose.model('User');
const Course = mongoose.model('Course');

// stats card
exports.getStudentDashboardStats = async (req, res) => {
  try {
    const { id: studentId, schoolId } = req.user;

    // get school current academic period
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    if (!school || !school.currentAcademicYear || !school.currentSemester) {
      return res
        .status(400)
        .json({ error: 'No active academic year or semester found' });
    }

    // get student details (level & department)
    const student = await User.findById(studentId)
      .select('level department')
      .populate('department', '_id name')
      .lean();

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // get all current enrollments
    const enrollments = await StudentEnrollment.find({
      student: studentId,
      enrollmentStatus: 'active',
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .select('course createdAt')
      .lean();

    if (!enrollments.length) {
      return res.status(200).json({
        totalCourses: 0,
        totalSessions: 0,
        attendedSessions: 0,
        activeSessions: 0,
      });
    }

    const courseIds = enrollments.map((e) => e.course);

    // Filter courses to only those matching student's level & department
    const validCourses = await Course.find({
      _id: { $in: courseIds },
      level: student.level,
      department: student.department._id,
    })
      .select('_id')
      .lean();

    const validCourseIds = validCourses.map((c) => c._id);

    if (!validCourseIds.length) {
      return res.status(200).json({
        totalCourses: 0,
        totalSessions: 0,
        attendedSessions: 0,
        activeSessions: 0,
      });
    }

    const enrollmentDates = {};
    enrollments.forEach((e) => {
      enrollmentDates[e.course.toString()] = e.createdAt;
    });

    //  conditions: for each course, only count sessions after student enrolled (prevents past records)
    const sessionConditions = validCourseIds.map((courseId) => ({
      course: courseId,
      createdAt: { $gte: enrollmentDates[courseId.toString()] },
    }));

    // Run stats in at a go
    const [totalSessions, attendedSessions, missedSessions] = await Promise.all(
      [
        Session.countDocuments({
          schoolId,
          course: { $in: validCourseIds },
          academicYear: school.currentAcademicYear,
          semester: school.currentSemester,
          $or: sessionConditions,
        }),
        Attendance.countDocuments({
          student: studentId,
          course: { $in: validCourseIds },
          academicYear: school.currentAcademicYear,
          semester: school.currentSemester,
          status: 'Present',
        }),
        Session.countDocuments({
          schoolId,
          course: { $in: validCourseIds },
          academicYear: school.currentAcademicYear,
          semester: school.currentSemester,
          status: 'ended', // count only ended sessions
          $or: sessionConditions,
          _id: {
            // exclude records where the student was present
            $nin: await Attendance.find({
              student: studentId,
              course: { $in: validCourseIds },
              academicYear: school.currentAcademicYear,
              semester: school.currentSemester,
              status: 'Present',
            }).distinct('session'),
          },
        }),
      ]
    );
    return res.status(200).json({
      totalCourses: validCourseIds.length,
      totalSessions,
      attendedSessions,
      missedSessions,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// recent sessions
exports.getStudentRecentSessions = async (req, res) => {
  try {
    const { id: studentId } = req.user;

    // get student school and level
    const user = await User.findById(studentId).select('schoolId level');
    if (!user) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { schoolId, level } = user;

    // get current academic year and semester
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    if (!school || !school.currentAcademicYear) {
      return res.status(404).json({
        error: 'No current academic period found for this school',
      });
    }

    // get all enrollments for the student current academic period
    const enrollments = await StudentEnrollment.find({
      student: studentId,
      enrollmentStatus: 'active',
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .select('course createdAt')
      .populate('course', 'level')
      .lean();

    if (!enrollments.length) {
      return res.status(200).json({ recentSessions: [] });
    }

    // filter only courses that match student current level
    const filteredEnrollments = enrollments.filter(
      (e) => e.course && e.course.level === level
    );

    if (!filteredEnrollments.length) {
      return res.status(200).json({ recentSessions: [] });
    }

    const filteredCourseIds = filteredEnrollments.map((e) => e.course._id);
   

    // create map of courseId -> enrollment date
    const enrollmentDates = {};
    filteredEnrollments.forEach((e) => {
      enrollmentDates[e.course._id.toString()] = e.createdAt;
    });

    // build conditions: for each course, only get sessions AFTER enrollment
    const sessionConditions = filteredCourseIds.map((courseId) => ({
      course: courseId,
      createdAt: { $gte: enrollmentDates[courseId.toString()] },
    }));

    // get recent sessions across filtered courses
    const sessions = await Session.find({
      $or: sessionConditions,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .populate('course', 'courseCode courseTitle')
      .populate('startedBy', 'fullName')
      .populate('endedBy', 'fullName')
      .select('course createdAt status')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    if (!sessions.length) {
      return res.status(200).json({ recentSessions: [] });
    }

    // get attendance records for these sessions
    const sessionIds = sessions.map((s) => s._id);
    const attendanceRecords = await Attendance.find({
      student: studentId,
      session: { $in: sessionIds },
    })
      .select('session status')
      .lean();

    const attendanceMap = attendanceRecords.reduce((acc, record) => {
      acc[record.session.toString()] = record.status;
      return acc;
    }, {});

    // build session
    const recentSessions = sessions.map((session) => {
      const attendanceStatus = attendanceMap[session._id.toString()];

      let studentStatus;
      if (attendanceStatus) {
        studentStatus = attendanceStatus; // "Present" or "Absent"
      } else if (session.status === 'ended') {
        studentStatus = 'Absent';
      } else if (session.status === 'active') {
        studentStatus = 'Not yet taken';
      } else {
        studentStatus = 'Unknown';
      }

      return {
        sessionId: session._id,
        courseCode: session.course.courseCode,
        courseTitle: session.course.courseTitle,
        createdAt: session.createdAt,
        lecturer: session.startedBy.fullName,
        sessionStatus: session.status,
        studentStatus,
      };
    });

    return res.status(200).json({ recentSessions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
