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

    // Get the school's current academic period
    const schoolDoc = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester attendanceThreshold'
    );

    if (!schoolDoc) return res.status(404).json({ error: 'School not found' });

    const { currentAcademicYear, currentSemester, attendanceThreshold } = schoolDoc;
    const threshold = attendanceThreshold || 65;
    
    if (!currentAcademicYear || !currentSemester)
      return res
        .status(400)
        .json({ error: 'No active academic period for this school' });

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

      // 5. Lookup ALL sessions (after enrollment)
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

      // 6. Lookup ENDED sessions only
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

      // 7. Lookup attendances for this student
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
          ],
          as: 'attendances',
        },
      },

      // 8. Compute totals
      {
        $addFields: {
          totalSessions: { $size: '$allSessions' },
          endedSessionsCount: { $size: '$endedSessions' },
          
          totalAttended: {
            $size: {
              $filter: {
                input: '$attendances',
                as: 'att',
                cond: { $eq: ['$$att.status', 'Present'] },
              },
            },
          },
          
          totalMissed: {
            $size: {
              $filter: {
                input: '$attendances',
                as: 'att',
                cond: { $eq: ['$$att.status', 'Absent'] },
              },
            },
          },
        },
      },

      // 9. Compute percentage (based on ENDED sessions only)
      {
        $addFields: {
          attendancePercentage: {
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

      // 10. Eligibility 
      {
        $addFields: {
          eligible: {
            $cond: [
              { $eq: ['$endedSessionsCount', 0] },
              true,
              { $gte: ['$attendancePercentage', threshold] }
            ]
          },
        },
      },

      // 11. Final projection
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
          attendancePercentage: 1,
          eligible: 1,
          enrolledAt: '$createdAt',
        },
      },
    ]);

    // Calculate pending after aggregation
    const report = rawReport.map(course => ({
      ...course,
      totalPending: course.totalSessions - (course.totalAttended + course.totalMissed)
    }));

    return res.status(200).json({ report });
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

    // Get current academic year and semester
    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    if (!school || !school.currentAcademicYear) {
      return res
        .status(404)
        .json({ error: 'No current academic period found for this school' });
    }

    // Get course details
    const course = await Course.findById(courseId)
      .select('courseCode courseTitle level')
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

    if (!sessions.length) {
      return res.status(404).json({ 
        error: 'No sessions found for this course',
        course: {
          courseCode: course.courseCode,
          courseTitle: course.courseTitle,
          totalSessions: 0,
          endedSessions: 0,
          totalAttended: 0,
          totalAbsent: 0,
          totalPending: 0,
          attendancePercentage: 100,
          eligible: true,
          enrolledAt: enrollment?.createdAt || null,
        },
        sessions: [],
      });
    }

    // Get session IDs
    const sessionIds = sessions.map((s) => s._id);

    // Get attendance records for this student with timestamps
    const attendanceRecords = await Attendance.find({
      course: courseId,
      session: { $in: sessionIds },
      student: studentId,
    }).select('session status createdAt').lean();

    // Create attendance map with status AND timestamp
    const attendanceMap = attendanceRecords.reduce((acc, record) => {
      acc[record.session.toString()] = {
        status: record.status,
        markedAt: record.createdAt,
      };
      return acc;
    }, {});

    // Build session details and calculate stats
    let totalAttended = 0;
    let totalAbsent = 0;
    let totalPending = 0;
    let endedSessionsCount = 0;

    const sessionDetails = sessions.map((s) => {
      const attendance = attendanceMap[s._id.toString()];
      let finalStatus;
      let timeMarked = null;

      if (attendance) {
        finalStatus = attendance.status;
        timeMarked = attendance.markedAt;
        
        if (attendance.status === 'Present') {
          totalAttended++;
        } else if (attendance.status === 'Absent') {
          totalAbsent++;
        }
      } else {
        if (s.status === 'ended') {
          finalStatus = 'Absent';
          totalAbsent++;
        } else if (s.status === 'active') {
          finalStatus = 'Not yet taken';
          totalPending++;
        } else {
          finalStatus = 'Unknown';
        }
      }

      // Count ended sessions
      if (s.status === 'ended') {
        endedSessionsCount++;
      }

      return {
        sessionId: s._id,
        sessionDate: s.createdAt,
        sessionStartTime: s.createdAt, // When session started
        startedBy: s.startedBy?.fullName || 'Unknown',
        sessionStatus: s.status,
        studentStatus: finalStatus,
        timeMarked, // When student marked attendance (null if not marked)
      };
    });

    // Calculate stats based on ENDED sessions only
    const totalSessions = sessions.length;
    const attendancePercentage = 
      endedSessionsCount > 0 
        ? Math.round((totalAttended / endedSessionsCount) * 100) 
        : 100;
    const eligible = attendancePercentage >= 65;

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