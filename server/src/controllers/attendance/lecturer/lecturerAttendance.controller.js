const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Attendance = mongoose.model('Attendance');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');
exports.getLecturerAttendanceOverview = async (req, res) => {
  try {
    const { id, schoolId } = req.user;

    // Fetch current academic year and semester from lecturer's school
    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    if (!school || !school.currentAcademicYear) {
      return res.status(404).json({
        error: 'No current academic period found for this school',
      });
    }

    const currentAcademicYearId = school.currentAcademicYear;
    const currentSemester = school.currentSemester;

    const overview = await Course.aggregate([
      // 1. find all courses where the lecturer is assigned to for the current academic year
      {
        $match: {
          lecturers: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },

      // 2. Get all sessions for this course
      {
        $lookup: {
          from: 'sessions',
          let: { courseId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $eq: ['$academicYear', currentAcademicYearId] },
                    { $eq: ['$semester', currentSemester] },
                  ],
                },
              },
            },
          ],
          as: 'sessions',
        },
      },

      // 3. Add totalSessions field
      {
        $addFields: {
          totalSessions: { $size: '$sessions' }
        }
      },

      // 4. Filter: Only return courses with sessions > 0
      {
        $match: {
          totalSessions: { $gt: 0 }
        }
      },

      // 5. Final projection 
      {
        $project: {
          _id: 1,
          courseCode: 1,
          courseTitle: 1,
          totalSessions: 1
        }
      }
    ]);

    return res.status(200).json({ overview });
  } catch (error) {
    console.error('Error in getLecturerAttendanceOverview:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getLecturerSessionDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id, schoolId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    if (!school || !school.currentAcademicYear) {
      return res.status(404).json({
        error: 'No current academic period found for this school',
      });
    }

    const course = await Course.findOne({
      _id: courseId,
      lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
    });

    if (!course) {
      return res.status(403).json({ error: 'Course not found' });
    }

    const sessionDetails = await Course.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(courseId),
          lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
        },
      },
      // Get ALL student enrollments (including inactive)
      {
        $lookup: {
          from: 'studentenrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'studentenrollments',
          pipeline: [
            {
              $match: {
                academicYear: school.currentAcademicYear,
                semester: school.currentSemester,
              },
            },
            {
              $project: {
                student: 1,
                createdAt: 1
              }
            }
          ],
        },
      },
      // Get all sessions
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'course',
          as: 'sessions',
          pipeline: [
            {
              $match: {
                academicYear: school.currentAcademicYear,
                semester: school.currentSemester,
              },
            },
            { $sort: { createdAt: -1 } }
          ],
        },
      },
      { $unwind: '$sessions' },
      // For each session, find students who were enrolled BEFORE the session
      {
        $addFields: {
          // Filter students who were enrolled before this session
          eligibleStudents: {
            $filter: {
              input: '$studentenrollments',
              as: 'enrollment',
              cond: {
                $lte: ['$$enrollment.createdAt', '$sessions.createdAt']
              }
            }
          }
        }
      },
      // Get attendances for this session
      {
        $lookup: {
          from: 'attendances',
          let: { sessionId: '$sessions._id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$session', '$$sessionId'] },
              },
            },
          ],
          as: 'sessionAttendances',
        },
      },
      // Calculate totals based on ELIGIBLE students only
      {
        $addFields: {
          totalEligibleStudents: { $size: '$eligibleStudents' },
          totalPresent: {
            $size: {
              $filter: {
                input: '$sessionAttendances',
                as: 'att',
                cond: { $eq: ['$$att.status', 'Present'] },
              },
            },
          },
        },
      },
      // Calculate absent/pending based on session status and ELIGIBLE students
      {
        $addFields: {
          totalAbsent: {
            $cond: [
              { $eq: ['$sessions.status', 'ended'] },
              { $max: [{ $subtract: ['$totalEligibleStudents', '$totalPresent'] }, 0] },
              0,
            ],
          },
          totalPending: {
            $cond: [
              { $eq: ['$sessions.status', 'active'] },
              { $max: [{ $subtract: ['$totalEligibleStudents', '$totalPresent'] }, 0] },
              0,
            ],
          },
        },
      },
      // Calculate attendance rate based on ELIGIBLE students
      {
        $addFields: {
          averageAttendance: {
            $cond: [
              {
                $and: [
                  { $gt: ['$totalEligibleStudents', 0] },
                  { $eq: ['$sessions.status', 'ended'] },
                ],
              },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$totalPresent', '$totalEligibleStudents'] },
                      100,
                    ],
                  },
                  1,
                ],
              },
              null,
            ],
          },
        },
      },
      // Final projection
      {
        $project: {
          _id: '$sessions._id',
          createdAt: '$sessions.createdAt',
          updatedAt: '$sessions.updatedAt',
          status: '$sessions.status',
          totalStudents: '$totalEligibleStudents',
          totalPresent: 1,
          totalAbsent: 1,
          totalPending: 1,
          averageAttendance: 1,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      course: {
        _id: course._id,
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        totalSessions: sessionDetails.length,
      },
      sessionDetails,
    });
  } catch (error) {
    console.error('Error fetching session details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLecturerSessionStudentDetails = async (req, res) => {
  try {
    const { sessionId, courseId } = req.params;
    const { id, schoolId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    // 1. Get current academic period of the lecturer's school
    const schoolData = await School.findById(schoolId);

    if (!schoolData?.currentAcademicYear) {
      return res.status(400).json({ error: 'No active academic period found' });
    }

    const currentYearId = schoolData.currentAcademicYear;
    const currentSemester = schoolData.currentSemester;

    // 2. Ensure the lecturer is assigned to the course
    const course = await Course.findOne({
      _id: courseId,
      lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
    });

    if (!course) {
      return res.status(403).json({ error: 'Course not found or unauthorized' });
    }

    // 3. Find the session only within current academic period
    const session = await Session.findOne({
      _id: sessionId,
      course: courseId,
      academicYear: currentYearId,
      semester: currentSemester,
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found in current period' });
    }

    // 4. Use aggregation to get ALL students (including inactive) who were enrolled at session time
    const studentDetails = await StudentEnrollment.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId.createFromHexString(courseId),
          academicYear: currentYearId,
          semester: currentSemester,
          createdAt: { $lte: session.createdAt } // Only students enrolled before session
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo',
          pipeline: [
            { $project: { matricNo: 1, fullName: 1 } }
          ]
        }
      },
      { $unwind: '$studentInfo' },
      {
        $lookup: {
          from: 'attendances',
          let: { studentId: '$student' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$student', '$$studentId'] },
                    { $eq: ['$session', mongoose.Types.ObjectId.createFromHexString(sessionId)] }
                  ]
                }
              }
            }
          ],
          as: 'attendance'
        }
      },
      {
        $addFields: {
          attendanceRecord: { $arrayElemAt: ['$attendance', 0] }
        }
      },
      {
        $project: {
          studentId: '$student',
          matricNo: '$studentInfo.matricNo',
          fullName: '$studentInfo.fullName',
          status: {
            $cond: {
              if: { $gt: [{ $size: '$attendance' }, 0] },
              then: '$attendanceRecord.status',
              else: {
                $cond: {
                  if: { $eq: [session.status, 'ended'] },
                  then: 'Absent',
                  else: 'Pending'
                }
              }
            }
          },
          timeMarked: {
            $cond: {
              if: { $gt: [{ $size: '$attendance' }, 0] },
              then: '$attendanceRecord.createdAt',
              else: null
            }
          },
          enrollmentDate: '$createdAt'
        }
      },
      { $sort: { matricNo: 1 } }
    ]);

    res.status(200).json({
      session: {
        _id: session._id,
        status: session.status,
        createdAt: session.createdAt,
        course: {
          _id: course._id,
          courseCode: course.courseCode,
          courseTitle: course.courseTitle,
        },
      },
      students: studentDetails,
    });
  } catch (error) {
    console.error('Error in getLecturerSessionStudentDetails:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLecturerAttendanceReport = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id, schoolId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    // Check if lecturer is assigned to the course
    const course = await Course.findOne({
      _id: courseId,
      lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
    }).select('courseCode courseTitle level semester');

    if (!course) {
      return res.status(403).json({ error: 'Course not found or unauthorized' });
    }

    // Fetch current academic year and semester
    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester attendanceThreshold'
    );

    if (!school || !school.currentAcademicYear) {
      return res.status(404).json({
        error: 'No current academic period found for this school',
      });
    }

    const threshold = school.attendanceThreshold || 75;

    const reportData = await Course.aggregate([
      // 1. Match course
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(courseId),
          lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
        },
      },

      // 2. Fetch ALL sessions for current academic period (sorted by date)
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'course',
          as: 'allSessions',
          pipeline: [
            {
              $match: {
                academicYear: school.currentAcademicYear,
                semester: school.currentSemester,
                status: { $in: ['ended'] }, // Only count ended sessions
              },
            },
            { $sort: { createdAt: 1 } },
          ],
        },
      },
      { $addFields: { totalSessionsHeld: { $size: '$allSessions' } } },

      // 3. Fetch active enrolled students
      {
        $lookup: {
          from: 'studentenrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'studentEnrollments',
          pipeline: [
            {
              $match: {
                enrollmentStatus: 'active',
                academicYear: school.currentAcademicYear,
                semester: school.currentSemester,
              },
            },
          ],
        },
      },
      { $addFields: { totalStudents: { $size: '$studentEnrollments' } } },

      // Guard: when no students enrolled
      {
        $match: {
          totalStudents: { $gt: 0 },
        },
      },

      { $unwind: '$studentEnrollments' },

      // 4. Get student info
      {
        $lookup: {
          from: 'users',
          localField: 'studentEnrollments.student',
          foreignField: '_id',
          as: 'studentInfo',
          pipeline: [{ $project: { _id: 1, fullName: 1, matricNo: 1 } }],
        },
      },
      { $unwind: '$studentInfo' },

      // 5. Find which session number the student enrolled at
      {
        $addFields: {
          // Find sessions that occurred BEFORE enrollment
          sessionsBeforeEnrollment: {
            $filter: {
              input: '$allSessions',
              as: 'session',
              cond: { $lt: ['$$session.createdAt', '$studentEnrollments.createdAt'] }
            }
          },
          // Find sessions that occurred AFTER enrollment (applicable sessions)
          applicableSessionsArray: {
            $filter: {
              input: '$allSessions',
              as: 'session',
              cond: { $gte: ['$$session.createdAt', '$studentEnrollments.createdAt'] }
            }
          }
        }
      },

      // 6. Calculate enrollment details
      {
        $addFields: {
          sessionsBeforeEnrollmentCount: { $size: '$sessionsBeforeEnrollment' },
          enrolledAtSession: { 
            $cond: [
              { $eq: [{ $size: '$sessionsBeforeEnrollment' }, 0] },
              1, // If no sessions before enrollment, enrolled at first session
              { $add: [{ $size: '$sessionsBeforeEnrollment' }, 1] } // Otherwise, enrolled at next session
            ]
          },
          applicableSessions: { $size: '$applicableSessionsArray' },
          applicableSessionIds: {
            $map: {
              input: '$applicableSessionsArray',
              as: 'session',
              in: '$$session._id'
            }
          }
        },
      },

      // 7. Get attendances for this student (only for applicable sessions)
      {
        $lookup: {
          from: 'attendances',
          let: { 
            studentId: '$studentEnrollments.student',
            applicableSessionIds: '$applicableSessionIds'
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$student', '$$studentId'] },
                    { $in: ['$session', '$$applicableSessionIds'] },
                    { $eq: ['$status', 'Present'] },
                    { $eq: ['$academicYear', school.currentAcademicYear] },
                    { $eq: ['$semester', school.currentSemester] }
                  ],
                },
              },
            },
          ],
          as: 'studentAttendances',
        },
      },

      // 8. Compute totals and percentages based on applicable sessions
      { 
        $addFields: { 
          totalAttended: { $size: '$studentAttendances' } 
        } 
      },
      {
        $addFields: {
          totalAbsent: { 
            $cond: [
              { $eq: ['$applicableSessions', 0] },
              0,
              { $subtract: ['$applicableSessions', '$totalAttended'] }
            ]
          },
        },
      },
      {
        $addFields: {
          attendancePercentage: {
            $cond: [
              { $eq: ['$applicableSessions', 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$totalAttended', '$applicableSessions'] },
                      100,
                    ],
                  },
                  1,
                ],
              },
            ],
          },
        },
      },

      {
        $addFields: {
          eligible: { $gte: ['$attendancePercentage', threshold] },
        },
      },

      // 9. Final result projection
      {
        $project: {
          _id: 0,
          studentId: '$studentEnrollments.student',
          fullName: '$studentInfo.fullName',
          matricNo: '$studentInfo.matricNo',
          enrolledAtSession: 1,
          totalSessions: '$applicableSessions', // Only sessions after enrollment
          totalAttended: 1,
          totalAbsent: 1,
          attendancePercentage: 1,
          eligible: 1,
          enrollmentDate: '$studentEnrollments.createdAt',
        },
      },

      // Sort by matricNo
      {
        $sort: { matricNo: 1 },
      },
    ]);

    // Calculate summary stats
    const totalStudents = reportData.length;
    const eligibleCount = reportData.filter((s) => s.eligible).length;
    const notEligibleCount = totalStudents - eligibleCount;
    
    const totalSessionsHeld = await Session.countDocuments({
      course: courseId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
      status: 'ended'
    });

    return res.status(200).json({
      course: {
        _id: course._id,
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        level: course.level,
        semester: course.semester,
        totalSessions: totalSessionsHeld,
      },
      summary: {
        totalStudents,
        eligibleCount,
        notEligibleCount,
        threshold,
      },
      students: reportData,
    });
  } catch (error) {
    console.error('Error generating attendance report:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.downloadLecturerAttendanceReport = async (req, res) => {
  // returns downloadable PDF for a course
};
