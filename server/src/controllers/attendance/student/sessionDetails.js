const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');
const Attendance = mongoose.model('Attendance');
const Course = mongoose.model('Course');

exports.getStudentSessionDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id: studentId, schoolId } = req.user;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    // Get current academic year, semester, and default threshold
    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester attendanceThreshold'
    );

    if (!school || !school.currentAcademicYear) {
      return res.status(404).json({
        error: 'No current academic period found for this school',
      });
    }

    const threshold = school.attendanceThreshold || 65;

    // Get course details with lecturers
    const course = await Course.findById(courseId)
      .select('courseCode courseTitle level lecturers')
      .populate('lecturers', 'attendanceThreshold')
      .lean();

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }



    

    // Get student enrollment info
    const enrollment = await StudentEnrollment.findOne({
      student: studentId,
      course: courseId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .select('createdAt')
      .lean();

    // Find all sessions for the course (only after enrollment)
    const sessions = await Session.find({
      course: courseId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
      ...(enrollment && { createdAt: { $gte: enrollment.createdAt } }),
    })
      .populate('startedBy', 'fullName')
      .populate('endedBy', 'fullName')
      .select('createdAt status')
      .sort({ createdAt: -1 })
      .lean();

    // If no sessions, return default
    if (!sessions.length) {
      return res.status(200).json({
        course: {
          courseCode: course.courseCode,
          courseTitle: course.courseTitle,
          totalSessions: 0,
          endedSessions: 0,
          totalAttended: 0,
          totalAbsent: 0,
          totalPending: 0,
              activeSessions: 0, 
          attendancePercentage: 100,
          threshold,
          eligible: true,
          enrolledAt: enrollment?.createdAt || null,
        },
        sessions: [],
      });
    }

    // Get session IDs and attendance records
    const sessionIds = sessions.map((s) => s._id);

    const attendanceRecords = await Attendance.find({
      course: courseId,
      session: { $in: sessionIds },
      student: studentId,
    })
      .select('session status createdAt')
      .lean();

    // Create attendance map for quick lookup
    const attendanceMap = attendanceRecords.reduce((acc, record) => {
      acc[record.session.toString()] = {
        status: record.status,
        markedAt: record.createdAt,
      };
      return acc;
    }, {});

    // Build session details & calculate totals
    let totalAttended = 0;
    let totalAbsent = 0;
    let totalPending = 0;
    let endedSessionsCount = 0;

    const sessionDetails = sessions.map((s) => {
      const sessionIdStr = s._id.toString();
      const attendance = attendanceMap[sessionIdStr];
      let finalStatus;
      let timeMarked = null;

      // Count ended sessions
      if (s.status === 'ended') {
        endedSessionsCount++;
      }

      if (attendance) {
        // Student HAS marked attendance
        finalStatus = attendance.status;
        timeMarked = attendance.markedAt;

        // ONLY count in summary if session is ENDED
        if (s.status === 'ended') {
          if (finalStatus === 'Present') {
            totalAttended++;
          } else if (finalStatus === 'Absent') {
            totalAbsent++;
          }
        }
        // If active session is marked, don't count it in summary yet
      } else {
        // Student HASN'T marked attendance
        if (s.status === 'ended') {
          // Session ended without marking = Auto Absent
          finalStatus = 'Absent';
          totalAbsent++;
        } else if (s.status === 'active') {
          // Session active and not marked = Pending
          finalStatus = 'Pending';
          totalPending++;
        } else {
          // Other status
          finalStatus = 'Unknown';
        }
      }

      return {
        sessionId: s._id,
        sessionDate: s.createdAt,
        startedBy: s.startedBy?.fullName || 'Unknown',
        sessionStatus: s.status,
        studentStatus: finalStatus,
        timeMarked,
      };
    });

    // Calculate summary statistics
    const totalSessions = endedSessionsCount; 
    const attendancePercentage = endedSessionsCount
      ? Math.round((totalAttended / endedSessionsCount) * 100)
      : 100;

    const eligible = attendancePercentage >= threshold;
    const activeSessions = sessions.filter((s) => s.status === 'active').length;

    return res.status(200).json({
      course: {
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        totalSessions,
        endedSessions: endedSessionsCount,
        totalAttended,
        totalAbsent,
        totalPending,
        attendancePercentage,
        threshold,
        activeSessions,
        eligible,
        enrolledAt: enrollment?.createdAt || null,
      },
      sessions: sessionDetails,
    });
  } catch (error) {
    console.error('Get student session details error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
