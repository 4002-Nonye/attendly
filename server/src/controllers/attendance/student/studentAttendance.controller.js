const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');
const Attendance = mongoose.model('Attendance');
const User = mongoose.model('User');
const Course = mongoose.model('Course');

exports.markAttendance = async (req, res) => {
  // SUPPORTS BOTH QR CODE SCANNING AND BUTTON MARKING
  try {
    const { sessionId } = req.params;
    const { id: userId } = req.user;
    const { token } = req.body || {};

    // 1. get the session and populate course
    const session = await Session.findById(sessionId).populate('course', '_id');
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // 2. check if class is ongoing
    if (session.status !== 'active')
      return res.status(400).json({ error: 'Class already ended' });

    // 3. validate QR token
    if (token && session.token !== token)
      return res.status(401).json({ error: 'Invalid token' });

    // 4. check enrollment
    const enrolled = await StudentEnrollment.findOne({
      student: userId,
      course: session.course._id,
    });
    if (!enrolled)
      return res.status(403).json({ error: 'Not enrolled in this course' });

    // 5. pevent duplicate attendance
    const existing = await Attendance.findOne({
      session: sessionId,
      course: session.course._id,
      student: userId,
    });
    if (existing)
      return res.status(400).json({ error: 'Attendance already marked' });

    // 6. mark attendance
    const attendance = await Attendance.create({
      session: sessionId,
      course: session.course,
      student: userId,
      status: 'Present',
      academicYear: session.academicYear,
      semester: session.semester,
    });

    return res
      .status(201)
      .json({ message: 'Attendance marked successfully', attendance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStudentAttendanceReport = async (req, res) => {
  try {
    const { id, schoolId } = req.user;

    // Get the school's current academic period and default threshold
    const schoolDoc = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester attendanceThreshold'
    );

    if (!schoolDoc) return res.status(404).json({ error: 'School not found' });

    const { currentAcademicYear, currentSemester, attendanceThreshold } =
      schoolDoc;
    const defaultThreshold = attendanceThreshold || 65;

    if (!currentAcademicYear || !currentSemester) {
      return res.status(400).json({
        error: 'No active academic period for this school',
      });
    }

    // Get the student level
    const student = await User.findById(id).select('level');
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const rawReport = await StudentEnrollment.aggregate([
      // 1. Get all enrollments for this student
      {
        $match: {
          student: mongoose.Types.ObjectId.createFromHexString(id),
          enrollmentStatus: 'active',
          academicYear: mongoose.Types.ObjectId.createFromHexString(
            currentAcademicYear.toString()
          ),
          semester: currentSemester,
        },
      },

      // 2. Lookup the course details
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course',
        },
      },

      // 3. Each enrollment - one course
      { $unwind: '$course' },

      // 4. Filter out courses that are not for this student level
      {
        $match: { 'course.level': student.level },
      },

      // 5. Lookup course lecturers to get their threshold overrides
      {
        $lookup: {
          from: 'users',
          localField: 'course.lecturers',
          foreignField: '_id',
          as: 'lecturers',
          pipeline: [
            {
              $project: {
                attendanceThreshold: 1,
              },
            },
          ],
        },
      },

      // 6. Lookup ALL sessions (after enrollment)
      {
        $lookup: {
          from: 'sessions',
          let: {
            courseId: '$course._id',
            enrollmentDate: '$createdAt',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $gte: ['$createdAt', '$$enrollmentDate'] },
                  ],
                },
                academicYear: mongoose.Types.ObjectId.createFromHexString(
                  currentAcademicYear.toString()
                ),
                semester: currentSemester,
              },
            },
          ],
          as: 'allSessions',
        },
      },

      // 7. Lookup ENDED sessions only
      {
        $lookup: {
          from: 'sessions',
          let: {
            courseId: '$course._id',
            enrollmentDate: '$createdAt',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $gte: ['$createdAt', '$$enrollmentDate'] },
                  ],
                },
                status: 'ended',
                academicYear: mongoose.Types.ObjectId.createFromHexString(
                  currentAcademicYear.toString()
                ),
                semester: currentSemester,
              },
            },
          ],
          as: 'endedSessions',
        },
      },

      // 8. NEW: Lookup ACTIVE sessions only
      {
        $lookup: {
          from: 'sessions',
          let: {
            courseId: '$course._id',
            enrollmentDate: '$createdAt',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $gte: ['$createdAt', '$$enrollmentDate'] },
                  ],
                },
                status: 'active',
                academicYear: mongoose.Types.ObjectId.createFromHexString(
                  currentAcademicYear.toString()
                ),
                semester: currentSemester,
              },
            },
          ],
          as: 'activeSessions',
        },
      },

      // 9. Lookup attendances for this student (with session info)
      {
        $lookup: {
          from: 'attendances',
          let: {
            courseId: '$course._id',
            studentId: '$student',
            enrollmentDate: '$createdAt',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $eq: ['$student', '$$studentId'] },
                    { $gte: ['$createdAt', '$$enrollmentDate'] },
                  ],
                },
                academicYear: mongoose.Types.ObjectId.createFromHexString(
                  currentAcademicYear.toString()
                ),
                semester: currentSemester,
              },
            },
            {
              $project: {
                session: 1,
                status: 1,
              },
            },
          ],
          as: 'attendances',
        },
      },

      // 10. Compute totals
      {
        $addFields: {
          totalSessions: { $size: '$allSessions' },
          endedSessionsCount: { $size: '$endedSessions' },
          activeSessionsCount: { $size: '$activeSessions' },

          // Get array of ended session IDs
          endedSessionIds: {
            $map: {
              input: '$endedSessions',
              as: 'session',
              in: '$$session._id',
            },
          },

          // Get array of active session IDs
          activeSessionIds: {
            $map: {
              input: '$activeSessions',
              as: 'session',
              in: '$$session._id',
            },
          },

          // Get array of marked session IDs
          markedSessionIds: {
            $map: {
              input: '$attendances',
              as: 'att',
              in: '$$att.session',
            },
          },
        },
      },

      // 11. Count attended and missed ONLY from ended sessions
      {
        $addFields: {
          totalAttended: {
            $size: {
              $filter: {
                input: '$attendances',
                as: 'att',
                cond: {
                  $and: [
                    { $eq: ['$$att.status', 'Present'] },
                    { $in: ['$$att.session', '$endedSessionIds'] },
                  ],
                },
              },
            },
          },

          totalMissed: {
            $size: {
              $filter: {
                input: '$attendances',
                as: 'att',
                cond: {
                  $and: [
                    { $eq: ['$$att.status', 'Absent'] },
                    { $in: ['$$att.session', '$endedSessionIds'] },
                  ],
                },
              },
            },
          },
        },
      },

      // 12. Calculate PENDING: active sessions where student hasn't marked attendance
      {
        $addFields: {
          totalPending: {
            $size: {
              $filter: {
                input: '$activeSessionIds',
                as: 'activeSession',
                cond: {
                  $not: { $in: ['$$activeSession', '$markedSessionIds'] },
                },
              },
            },
          },
        },
      },

      // 13. Calculate rounded percentage
      {
        $addFields: {
          roundedPercentage: {
            $cond: [
              { $eq: ['$endedSessionsCount', 0] },
              100,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$totalAttended', '$endedSessionsCount'] },
                      100,
                    ],
                  },
                  0,
                ],
              },
            ],
          },
        },
      },

      // 14. Determine threshold (lecturer override or school default)
      {
        $addFields: {
          courseThreshold: {
            $ifNull: [
              { $arrayElemAt: ['$lecturers.attendanceThreshold', 0] },
              defaultThreshold,
            ],
          },
        },
      },

      // 15. Eligibility based on rounded percentage and course specific threshold
      {
        $addFields: {
          eligible: {
            $cond: [
              { $eq: ['$endedSessionsCount', 0] },
              true,
              { $gte: ['$roundedPercentage', '$courseThreshold'] },
            ],
          },
        },
      },

      // 16. Final projection
      {
        $project: {
          _id: 0,
          courseId: '$course._id',
          courseCode: '$course.courseCode',
          courseTitle: '$course.courseTitle',
          totalSessions: 1,
          endedSessions: '$endedSessionsCount',
          totalAttended: 1,
          totalMissed: 1,
          totalPending: 1, // Now calculated in aggregation
          attendancePercentage: '$roundedPercentage',
          threshold: '$courseThreshold',
          eligible: 1,
          enrolledAt: '$createdAt',
        },
      },
    ]);

    return res.status(200).json({ report: rawReport });
  } catch (error) {
    console.error('Attendance report error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

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

    const defaultThreshold = school.attendanceThreshold || 65;

    // Get course details with lecturers
    const course = await Course.findById(courseId)
      .select('courseCode courseTitle level lecturers')
      .populate('lecturers', 'attendanceThreshold')
      .lean();

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Determine threshold: lecturer override or school default
    let threshold = defaultThreshold;
    if (course.lecturers?.length > 0) {
      const lecturerThreshold = course.lecturers[0].attendanceThreshold;
      if (lecturerThreshold !== undefined && lecturerThreshold !== null) {
        threshold = lecturerThreshold;
      }
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
          // Other status (shouldn't happen)
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
    const totalSessions = endedSessionsCount; // ✅ Only count ended sessions
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
