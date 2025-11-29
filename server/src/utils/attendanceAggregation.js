const mongoose = require('mongoose');

exports.buildStudentAttendanceAggregation = (
  courseId,
  schoolId,
  school,
  threshold,
  course
) => {
  return [
    // 1. Filter courses
    {
      $match: {
        _id: mongoose.Types.ObjectId.createFromHexString(courseId),
        schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId),
      },
    },

    // 2. Fetch all ended sessions for this course (sorted by date)
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
                  { $eq: ['$status', 'ended'] },
                ],
              },
            },
          },
          { $sort: { createdAt: 1 } },
        ],
        as: 'allSessions',
      },
    },

    // 3. Get active enrolled students with their enrollment dates
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
          {
            $lookup: {
              from: 'users',
              localField: 'student',
              foreignField: '_id',
              as: 'studentInfo',
            },
          },
          { $unwind: '$studentInfo' },
          {
            $project: {
              studentId: '$student',
              matricNo: '$studentInfo.matricNo',
              fullName: '$studentInfo.fullName',
              createdAt: 1,
            },
          },
        ],
        as: 'enrollments',
      },
    },

    // 4. Calculate which session each student enrolled at and get applicable sessions
    {
      $addFields: {
        enrollmentsWithSessionNumber: {
          $map: {
            input: '$enrollments',
            as: 'enrollment',
            in: {
              $mergeObjects: [
                '$$enrollment',
                {
                  enrolledAtSession: {
                    $size: {
                      $filter: {
                        input: '$allSessions',
                        as: 'session',
                        cond: {
                          $lt: [
                            '$$session.createdAt',
                            '$$enrollment.createdAt',
                          ],
                        },
                      },
                    },
                  },
                  applicableSessions: {
                    $filter: {
                      input: '$allSessions',
                      as: 'session',
                      cond: {
                        $gte: ['$$session.createdAt', '$$enrollment.createdAt'],
                      },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },

    // 5. Extract session IDs and count for each student
    {
      $addFields: {
        enrollmentsWithSessionIds: {
          $map: {
            input: '$enrollmentsWithSessionNumber',
            as: 'enrollment',
            in: {
              $mergeObjects: [
                '$$enrollment',
                {
                  applicableSessionIds: {
                    $map: {
                      input: '$$enrollment.applicableSessions',
                      as: 'session',
                      in: '$$session._id',
                    },
                  },
                  totalSessions: { $size: '$$enrollment.applicableSessions' },
                },
              ],
            },
          },
        },
      },
    },

    // 6. Lookup attendance records for all students
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
            },
          },
        ],
        as: 'attendanceRecords',
      },
    },

    // 7. Calculate attendance stats per student
    {
      $addFields: {
        students: {
          $map: {
            input: '$enrollmentsWithSessionIds',
            as: 'enrollment',
            in: {
              $let: {
                vars: {
                  studentAttendance: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: '$attendanceRecords',
                          as: 'record',
                          cond: {
                            $eq: ['$$record._id', '$$enrollment.studentId'],
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
                                '$$enrollment.applicableSessionIds',
                              ],
                            },
                          },
                        },
                      },
                    },
                    in: {
                      $let: {
                        vars: {
                          roundedPercentage: {
                            $cond: [
                              { $eq: ['$$enrollment.totalSessions', 0] },
                              100,
                              {
                                $round: [
                                  {
                                    $multiply: [
                                      {
                                        $divide: [
                                          '$$attendedApplicable',
                                          '$$enrollment.totalSessions',
                                        ],
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
                        in: {
                          studentId: '$$enrollment.studentId',
                          matricNo: '$$enrollment.matricNo',
                          fullName: '$$enrollment.fullName',
                          enrolledAtSession: {
                            $add: ['$$enrollment.enrolledAtSession', 1],
                          },
                          totalSessions: '$$enrollment.totalSessions',
                          totalAttended: '$$attendedApplicable',
                          totalAbsent: {
                            $subtract: [
                              '$$enrollment.totalSessions',
                              '$$attendedApplicable',
                            ],
                          },

                          attendancePercentage: '$$roundedPercentage',

                          eligible: {
                            $cond: [
                              { $eq: ['$$enrollment.totalSessions', 0] },
                              true,
                              { $gte: ['$$roundedPercentage', threshold] },
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
      },
    },

    // 8. Sort students by matric number
    {
      $addFields: {
        students: {
          $sortArray: {
            input: '$students',
            sortBy: { matricNo: 1 },
          },
        },
      },
    },

    // 9. Calculate summary stats
    {
      $addFields: {
        totalStudents: { $size: '$students' },
        totalSessions: { $size: '$allSessions' },
        eligibleCount: {
          $size: {
            $filter: {
              input: '$students',
              as: 'student',
              cond: '$$student.eligible',
            },
          },
        },
      },
    },

    // 10. Calculate not eligible count
    {
      $addFields: {
        notEligibleCount: {
          $subtract: ['$totalStudents', '$eligibleCount'],
        },
      },
    },

    // 11. Project
    {
      $project: {
        courseInfo: {
          _id: '$_id',
          courseCode: '$courseCode',
          courseTitle: '$courseTitle',
          level: '$level',
          department: course.department,
          faculty: course.faculty,
          totalSessions: '$totalSessions',
        },
        summary: {
          totalStudents: '$totalStudents',
          eligibleCount: '$eligibleCount',
          notEligibleCount: '$notEligibleCount',
          threshold: { $literal: threshold },
        },
        students: 1,
      },
    },
  ];
};
