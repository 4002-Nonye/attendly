const mongoose = require('mongoose');
const School = mongoose.model('School');
const Course = mongoose.model('Course');

exports.getAdminAttendanceReport = async (req, res) => {
  try {
    const { facultyId, departmentId, level, search } = req.query;
    const { schoolId } = req.user;

    // Find the school's current academic period
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester attendanceThreshold')
      .lean();

    if (!school) return res.status(404).json({ error: 'School not found' });


    const threshold = school.attendanceThreshold || 65;
  

    const matchFilters = {
      schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId),
    };

    // Build filters for courses
    if (facultyId)
      matchFilters.faculty =
        mongoose.Types.ObjectId.createFromHexString(facultyId);
    if (departmentId)
      matchFilters.department =
        mongoose.Types.ObjectId.createFromHexString(departmentId);
    if (level) matchFilters.level = parseInt(level);

    const coursesList = await Course.aggregate([
      // 1. Filter courses
      { $match: matchFilters },

      // 2. Optional: Search filter
      ...(search
        ? [
            {
              $match: {
                $or: [
                  { courseCode: { $regex: search, $options: 'i' } },
                  { courseTitle: { $regex: search, $options: 'i' } },
                ],
              },
            },
          ]
        : []),

      // 3. Lookup department
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'department',
        },
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },

      // 4. Lookup faculty
      {
        $lookup: {
          from: 'faculties',
          localField: 'faculty',
          foreignField: '_id',
          as: 'faculty',
        },
      },
      { $unwind: { path: '$faculty', preserveNullAndEmptyArrays: true } },

      // 5. Fetch all sessions for this course (sorted by date)
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
                    { $eq: ['$academicYear', school.currentAcademicYear] },
                    { $eq: ['$semester', school.currentSemester] },
                    { $in: ['$status', ['ended']] },
                  ],
                },
              },
            },
            { $sort: { createdAt: 1 } },
          ],
          as: 'allSessions',
        },
      },

      // 6. Get active enrolled students with their enrollment dates
      {
        $lookup: {
          from: 'studentenrollments',
          let: { courseId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $eq: ['$enrollmentStatus', 'active'] },
                    { $eq: ['$academicYear', school.currentAcademicYear] },
                    { $eq: ['$semester', school.currentSemester] },
                  ],
                },
              },
            },
          ],
          as: 'enrollments',
        },
      },

      // 7. Calculate per-student attendance
      {
        $addFields: {
          studentsWithAttendance: {
            $map: {
              input: '$enrollments',
              as: 'enrollment',
              in: {
                $let: {
                  vars: {
                    // Find applicable sessions (after enrollment)
                    applicableSessions: {
                      $filter: {
                        input: '$allSessions',
                        as: 'session',
                        cond: {
                          $gte: [
                            '$$session.createdAt',
                            '$$enrollment.createdAt',
                          ],
                        },
                      },
                    },
                  },
                  in: {
                    studentId: '$$enrollment.student',
                    applicableSessionCount: { $size: '$$applicableSessions' },
                    applicableSessionIds: {
                      $map: {
                        input: '$$applicableSessions',
                        as: 'session',
                        in: '$$session._id',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // 8. Lookup attendance records for all students
      {
        $lookup: {
          from: 'attendances',
          let: { courseId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $eq: ['$academicYear', school.currentAcademicYear] },
                    { $eq: ['$semester', school.currentSemester] },
                    { $eq: ['$status', 'Present'] },
                  ],
                },
              },
            },
            {
              $group: {
                _id: '$student',
                attendedSessions: { $push: '$session' },
                attendedCount: { $sum: 1 },
              },
            },
          ],
          as: 'attendanceRecords',
        },
      },

      // 9. Calculate eligibility per student
      {
        $addFields: {
          eligibilityData: {
            $map: {
              input: '$studentsWithAttendance',
              as: 'student',
              in: {
                $let: {
                  vars: {
                    // Find this student's attendance record
                    studentAttendance: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$attendanceRecords',
                            as: 'record',
                            cond: {
                              $eq: ['$$record._id', '$$student.studentId'],
                            },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    $let: {
                      vars: {
                        // Count attended sessions that are in applicable sessions
                        attendedApplicable: {
                          $size: {
                            $filter: {
                              input: {
                                $ifNull: [
                                  '$$studentAttendance.attendedSessions',
                                  [],
                                ],
                              },
                              as: 'attendedSession',
                              cond: {
                                $in: [
                                  '$$attendedSession',
                                  '$$student.applicableSessionIds',
                                ],
                              },
                            },
                          },
                        },
                        applicableCount: '$$student.applicableSessionCount',
                      },
                      in: {
                        attendedCount: '$$attendedApplicable',
                        applicableCount: '$$applicableCount',
                        attendanceRate: {
                          $cond: [
                            { $eq: ['$$applicableCount', 0] },
                            100,
                            {
                              $multiply: [
                                {
                                  $divide: [
                                    '$$attendedApplicable',
                                    '$$applicableCount',
                                  ],
                                },
                                100,
                              ],
                            },
                          ],
                        },
                        eligible: {
                          $cond: [
                            { $eq: ['$$applicableCount', 0] },
                            true,
                            {
                              $gte: [
                                {
                                  $multiply: [
                                    {
                                      $divide: [
                                        '$$attendedApplicable',
                                        '$$applicableCount',
                                      ],
                                    },
                                    100,
                                  ],
                                },
                                threshold,
                              ],
                            },
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // 10. Calculate summary stats
      {
        $addFields: {
          totalStudents: { $size: '$enrollments' },
          totalSessions: { $size: '$allSessions' },

          eligibleCount: {
            $size: {
              $filter: {
                input: '$eligibilityData',
                as: 'data',
                cond: '$$data.eligible',
              },
            },
          },

          // Average attendance across all students
          avgAttendance: {
            $cond: [
              { $gt: [{ $size: '$eligibilityData' }, 0] },
              {
                $round: [
                  {
                    $avg: {
                      $map: {
                        input: '$eligibilityData',
                        as: 'data',
                        in: '$$data.attendanceRate',
                      },
                    },
                  },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },

      // 11. Calculate not eligible count
      {
        $addFields: {
          notEligibleCount: {
            $subtract: ['$totalStudents', '$eligibleCount'],
          },
        },
      },

      // 12. Project final structure
      {
        $project: {
          _id: 1,
          courseCode: 1,
          courseTitle: 1,
          level: 1,
          department: { _id: '$department._id', name: '$department.name' },
          faculty: { _id: '$faculty._id', name: '$faculty.name' },
          totalStudents: 1,
          totalSessions: 1,
          avgAttendance: 1,
          eligibleCount: 1,
          notEligibleCount: 1,
        },
      },

      // 13. Sort by course code
      { $sort: { courseCode: 1 } },
    ]);

    res.json({ data: coursesList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};