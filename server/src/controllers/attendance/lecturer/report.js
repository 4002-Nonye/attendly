const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const User = mongoose.model('User');
const Session = mongoose.model('Session');
const School = mongoose.model('School');

exports.getLecturerAttendanceReport = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id: userId, schoolId, role } = req.user;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    // Check if lecturer is assigned to the course
    const course = await Course.findOne({
      _id: courseId,
      lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(userId)] },
    }).select('courseCode courseTitle level semester');

    if (!course) {
      return res
        .status(403)
        .json({ error: 'Course not found or unauthorized' });
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

    let threshold = school.attendanceThreshold || 65;

    // Lecturer threshold override
    if (role === 'lecturer') {
      const lecturer = await User.findById(userId)
        .select('attendanceThreshold')
        .lean();
      if (lecturer?.attendanceThreshold) {
        threshold = lecturer.attendanceThreshold; // lecturer override
      }
    }
   

    const reportData = await Course.aggregate([
      // 1. Match course
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(courseId),
          lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(userId)] },
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
                status: { $in: ['ended'] },
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
              cond: {
                $lt: ['$$session.createdAt', '$studentEnrollments.createdAt'],
              },
            },
          },
          // Find sessions that occurred AFTER enrollment (applicable sessions)
          applicableSessionsArray: {
            $filter: {
              input: '$allSessions',
              as: 'session',
              cond: {
                $gte: ['$$session.createdAt', '$studentEnrollments.createdAt'],
              },
            },
          },
        },
      },

      // 6. Calculate enrollment details
      {
        $addFields: {
          sessionsBeforeEnrollmentCount: { $size: '$sessionsBeforeEnrollment' },
          enrolledAtSession: {
            $cond: [
              { $eq: [{ $size: '$sessionsBeforeEnrollment' }, 0] },
              1, // If no sessions before enrollment, enrolled at first session
              { $add: [{ $size: '$sessionsBeforeEnrollment' }, 1] }, // Otherwise, enrolled at next session
            ],
          },
          applicableSessions: { $size: '$applicableSessionsArray' },
          applicableSessionIds: {
            $map: {
              input: '$applicableSessionsArray',
              as: 'session',
              in: '$$session._id',
            },
          },
        },
      },

      // 7. Get attendances for this student (only for applicable sessions)
      {
        $lookup: {
          from: 'attendances',
          let: {
            studentId: '$studentEnrollments.student',
            applicableSessionIds: '$applicableSessionIds',
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
                    { $eq: ['$semester', school.currentSemester] },
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
          totalAttended: { $size: '$studentAttendances' },
        },
      },
      {
        $addFields: {
          totalAbsent: {
            $cond: [
              { $eq: ['$applicableSessions', 0] },
              0,
              { $subtract: ['$applicableSessions', '$totalAttended'] },
            ],
          },
        },
      },
      {
        $addFields: {
          attendancePercentage: {
            $cond: [
              { $eq: ['$applicableSessions', 0] },
              100, //  100% if no applicable sessions
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$totalAttended', '$applicableSessions'] },
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

      {
        $addFields: {
          eligible: {
            $cond: [
              { $eq: ['$applicableSessions', 0] },
              true, //  Always eligible if no applicable sessions
              { $gte: ['$attendancePercentage', threshold] },
            ],
          },
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
          totalSessions: '$applicableSessions',
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
      status: 'ended',
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
