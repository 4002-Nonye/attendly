const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Session = mongoose.model('Session');
const School = mongoose.model('School');
const Attendance = mongoose.model('Attendance');

// stats card
exports.getStudentDashboardStats = async (req, res) => {
  try {
    const { id: studentId, schoolId } = req.user;

    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    const enrollments = await StudentEnrollment.find({
      student: studentId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .select('course')
      .lean();

    const courseIds = enrollments.map((e) => e.course);

    // Get all stats
    const [totalSessions, attendedSessions, activeSessions] = await Promise.all(
      [
        Session.countDocuments({
          schoolId,
          course: { $in: courseIds },
          academicYear: school.currentAcademicYear,
          semester: school.currentSemester,
        }),
        Attendance.countDocuments({
          student: studentId,
          course: { $in: courseIds },
          academicYear: school.currentAcademicYear,
          semester: school.currentSemester,
          status: 'Present',
        }),

        Session.countDocuments({
          schoolId,
          course: { $in: courseIds },
          academicYear: school.currentAcademicYear,
          semester: school.currentSemester,
          status: 'active',
        }),
      ]
    );

    return res.status(200).json({
      totalCourses: enrollments.length,
      totalSessions,
      attendedSessions,
      activeSessions,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// recent sessions
exports.getStudentRecentSessions = async (req, res) => {
  try {
    const { id: studentId, schoolId } = req.user;

    // Get current academic year and semester
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    if (!school || !school.currentAcademicYear) {
      return res
        .status(404)
        .json({ error: 'No current academic period found for this school' });
    }

    // Get all courses the student is enrolled in
    const enrollments = await StudentEnrollment.find({
      student: studentId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .select('course')
      .lean();

    if (!enrollments.length) {
      return res.status(200).json({ recentSessions: [] });
    }

    const courseIds = enrollments.map((e) => e.course);

    // Get recent sessions across all enrolled courses
    const sessions = await Session.find({
      course: { $in: courseIds },
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

    // Get session IDs for attendance lookup
    const sessionIds = sessions.map((s) => s._id);

    // Get attendance records for these sessions
    const attendanceRecords = await Attendance.find({
      student: studentId,
      session: { $in: sessionIds },
    })
      .select('session status')
      .lean();

    //  return {"some-session-id" : "Present"} for easy lookup
    const attendanceMap = attendanceRecords.reduce((acc, record) => {
      acc[record.session.toString()] = record.status;
      return acc;
    }, {});

    // build session details
    const recentSessions = sessions.map((session) => {
      const attendanceStatus = attendanceMap[session._id.toString()];

      let studentStatus;
      if (attendanceStatus) {
        studentStatus = attendanceStatus; // "Present" or "Absent"
      } else if (session.status === 'ended') {
        studentStatus = 'Absent'; // Session ended but no attendance record
      } else if (session.status === 'active') {
        studentStatus = 'Not yet taken'; // Session ongoing
      } else {
        studentStatus = 'Unknown';
      }

      return {
        sessionId: session._id,
        courseCode: session.course.courseCode,
        courseTitle: session.course.courseTitle,
        date: session.createdAt.toISOString().split('T')[0],
        time: new Date(session.createdAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        lecturer: session.startedBy?.fullName || 'Unknown',
        sessionStatus: session.status,
        studentStatus: studentStatus,
      };
    });
    console.log(recentSessions)

    return res.status(200).json({ recentSessions });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
