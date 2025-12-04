const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');
const User = mongoose.model('User');


exports.getStudentAttendanceReport = async (req, res) => {
  try {
    const { id, schoolId } = req.user;

    // Get school settings
    const schoolDoc = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester attendanceThreshold'
    );

    if (!schoolDoc)
      return res.status(404).json({ error: 'School not found' });

    const { currentAcademicYear, currentSemester, attendanceThreshold } =
      schoolDoc;

    const defaultThreshold = attendanceThreshold || 65;

    if (!currentAcademicYear || !currentSemester) {
      return res.status(400).json({
        error: 'No active academic period for this school',
      });
    }

    // Get student level
    const student = await User.findById(id).select('level');
    if (!student)
      return res.status(404).json({ error: 'Student not found' });

    const rawReport = await StudentEnrollment.aggregate([
      // 1. Enrollments for this student
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

      // 2. Lookup course details
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course',
        },
      },

      // 3. Flatten course
      { $unwind: '$course' },

      // 4. Only courses for student's level
      { $match: { 'course.level': student.level } },

      // **REMOVED lecturer threshold lookup**

      // 5. Lookup ALL sessions
      {
        $lookup: {
          from: 'sessions',
          let: { courseId: '$course._id', enrollmentDate: '$createdAt' },
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
          let: { courseId: '$course._id', enrollmentDate: '$createdAt' },
          pipeline: [
            {
              $match: {
                status: 'ended',
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
          as: 'endedSessions',
        },
      },

      // 7. Lookup ACTIVE sessions only
      {
        $lookup: {
          from: 'sessions',
          let: { courseId: '$course._id', enrollmentDate: '$createdAt' },
          pipeline: [
            {
              $match: {
                status: 'active',
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
          as: 'activeSessions',
        },
      },

      // 8. Lookup student's attendance
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
              $project: { session: 1, status: 1 },
            },
          ],
          as: 'attendances',
        },
      },

      // 9. Compute totals
      {
        $addFields: {
          totalSessions: { $size: '$allSessions' },
          endedSessionsCount: { $size: '$endedSessions' },
          activeSessionsCount: { $size: '$activeSessions' },

          endedSessionIds: {
            $map: { input: '$endedSessions', as: 's', in: '$$s._id' },
          },

          activeSessionIds: {
            $map: { input: '$activeSessions', as: 's', in: '$$s._id' },
          },

          markedSessionIds: {
            $map: { input: '$attendances', as: 'a', in: '$$a.session' },
          },
        },
      },

      // 10. Count attended & missed (from ended)
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

      // 11. Pending = active sessions not yet marked
      {
        $addFields: {
          totalPending: {
            $size: {
              $filter: {
                input: '$activeSessionIds',
                as: 'active',
                cond: { $not: { $in: ['$$active', '$markedSessionIds'] } },
              },
            },
          },
        },
      },

      // 12. Attendance percentage
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
                      {
                        $divide: ['$totalAttended', '$endedSessionsCount'],
                      },
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

      // 13. add school threshold
      {
        $addFields: {
          courseThreshold: { $literal: defaultThreshold },
        },
      },

      // 14. Eligibility check
      {
        $addFields: {
          eligible: {
            $cond: [
              { $eq: ['$endedSessionsCount', 0] },
              true, // auto-eligible if no ended sessions
              { $gte: ['$roundedPercentage', '$courseThreshold'] },
            ],
          },
        },
      },

      // 15. Final projection
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
          totalPending: 1,
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
