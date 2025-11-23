const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');
const Course = mongoose.model('Course');


exports.getAdminAttendanceReport1 = async (req, res) => {
  // accepts filters: facultyId, departmentId, level, courseId
  // returns
  // course information
  // student id -> name -> sessions total -> attended total -> % attended -> eligible
  // scoped to the current academic year and semester
  try {
    const { facultyId, departmentId, level, courseId } = req.query;
    const { schoolId } = req.user;

    if (!facultyId || !departmentId || !level || !courseId)
      return res.status(400).json({ error: 'All fields are required' });

    // find the school's current academic period
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    if (!school) return res.status(404).json({ error: 'School not found' });

    const matchFilters = {};

    // Build filters
    if (facultyId)
      matchFilters['student.faculty'] =
        mongoose.Types.ObjectId.createFromHexString(facultyId);
    if (departmentId)
      matchFilters['student.department'] =
        mongoose.Types.ObjectId.createFromHexString(departmentId);
    if (level) matchFilters['student.level'] = parseInt(level);

  

    const report = await StudentEnrollment.aggregate([
      // 1. Filter enrollments by course
      {
        $match: {
          course: mongoose.Types.ObjectId.createFromHexString(courseId),
          enrollmentStatus: 'active'  
        },
      },

      // 2. Lookup student info from users
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },

      //   3. Apply faculty/department/level filters
      {
        $match: matchFilters,
      },

      // 4. Lookup all sessions for this course — scoped to current academic period
      {
        $lookup: {
          from: 'sessions',
          let: { courseId: '$course' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $eq: ['$academicYear', school.currentAcademicYear] },
                    { $eq: ['$semester', school.currentSemester] },
                  ],
                },
              },
            },
          ],
          as: 'sessions',
        },
      },

      // 5. Lookup attendance records for this student (same academic period)
      {
        $lookup: {
          from: 'attendances',
          let: { studentId: '$student._id', courseId: '$course' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$student', '$$studentId'] },
                    { $eq: ['$course', '$$courseId'] },
                    { $eq: ['$academicYear', school.currentAcademicYear] },
                    { $eq: ['$semester', school.currentSemester] },
                  ],
                },
              },
            },
          ],
          as: 'attendances',
        },
      },

      // 6. Compute totals per student
      {
        $addFields: {
          totalSessions: { $size: '$sessions' },
          attendedSessions: {
            $size: {
              $filter: {
                input: '$attendances',
                as: 'att',
                cond: { $eq: ['$$att.status', 'Present'] },
              },
            },
          },
        },
      },

      // 7. Compute attendance % & eligibility
      {
        $addFields: {
          attendancePercentage: {
            $cond: [
              { $gt: ['$totalSessions', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$attendedSessions', '$totalSessions'] },
                      100,
                    ],
                  },
                  2,
                ],
              },
              0,
            ],
          },
          eligible: {
            $gte: [{ $divide: ['$attendedSessions', '$totalSessions'] }, 0.7],
          },
        },
      },

      // 8. Lookup course info
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo',
        },
      },
      { $unwind: '$courseInfo' },

      // 9. Lookup faculty info
      {
        $lookup: {
          from: 'faculties',
          localField: 'courseInfo.faculty',
          foreignField: '_id',
          as: 'faculty',
        },
      },
      { $unwind: '$faculty' },

      // 10. Lookup department info
      {
        $lookup: {
          from: 'departments',
          localField: 'courseInfo.department',
          foreignField: '_id',
          as: 'department',
        },
      },
      { $unwind: '$department' },

      // 11. Lookup lecturer info
      {
        $lookup: {
          from: 'users',
          localField: 'courseInfo.lecturers',
          foreignField: '_id',
          as: 'lecturers',
        },
      },

      // 12. Group all students into an array and include course info once
      {
        $group: {
          _id: '$course',
          courseInfo: { $first: '$courseInfo' },
          faculty: { $first: '$faculty' },
          department: { $first: '$department' },
          lecturers: { $first: '$lecturers' },
          students: {
            $push: {
              studentId: '$student._id',
              matricNo: '$student.matricNo',
              fullName: '$student.fullName',
              totalSessions: '$totalSessions',
              attendedSessions: '$attendedSessions',
              attendancePercentage: '$attendancePercentage',
              eligible: '$eligible',
            },
          },
          totalStudents: { $sum: 1 },
        },
      },

      // 13. Project final structure
      {
        $project: {
          _id: 0,
          courseInfo: {
            _id: '$courseInfo._id',
            courseCode: '$courseInfo.courseCode',
            courseTitle: '$courseInfo.courseTitle',
            level: '$courseInfo.level',
          },
          faculty: { _id: '$faculty._id', name: '$faculty.name' },
          department: { _id: '$department._id', name: '$department.name' },
          lecturers: { _id: '$lecturers._id', fullName: '$lecturers.fullName' },
          totalStudents: 1,
          students: 1,
        },
      },
    ]);

    res.json({ data: report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.downloadAdminAttendanceReport = async (req, res) => {
  // returns downloadable PDF across chosen scope
};


exports.getAdminAttendanceReport = async (req, res) => {
  try {
    const { facultyId, departmentId, level, search } = req.query;
    const { schoolId } = req.user;

    // Find the school's current academic period
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester attendanceThreshold')
      .lean();

    if (!school) return res.status(404).json({ error: 'School not found' });


    // TODO: ADD ATTENDANCE THRESHOLD
    const threshold = school.attendanceThreshold || 65;

    const matchFilters = { 
      schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId) 
    };

    // Build filters for courses
    if (facultyId) matchFilters.faculty = mongoose.Types.ObjectId.createFromHexString(facultyId);
    if (departmentId) matchFilters.department = mongoose.Types.ObjectId.createFromHexString(departmentId);
    if (level) matchFilters.level = parseInt(level);

    const coursesList = await Course.aggregate([
      // 1. Filter courses
      { $match: matchFilters },

      // 2. Optional: Search filter
      ...(search ? [{
        $match: {
          $or: [
            { courseCode: { $regex: search, $options: 'i' } },
            { courseTitle: { $regex: search, $options: 'i' } }
          ]
        }
      }] : []),

      // 3. Lookup department
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'department'
        }
      },
      { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },

      // 4. Lookup faculty
      {
        $lookup: {
          from: 'faculties',
          localField: 'faculty',
          foreignField: '_id',
          as: 'faculty'
        }
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
                    { $in: ['$status', ['ended']] }
                  ]
                }
              }
            },
            { $sort: { createdAt: 1 } }
          ],
          as: 'allSessions'
        }
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
                    { $eq: ['$semester', school.currentSemester] }
                  ]
                }
              }
            }
          ],
          as: 'enrollments'
        }
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
                        cond: { $gte: ['$$session.createdAt', '$$enrollment.createdAt'] }
                      }
                    }
                  },
                  in: {
                    studentId: '$$enrollment.student',
                    applicableSessionCount: { $size: '$$applicableSessions' },
                    applicableSessionIds: {
                      $map: {
                        input: '$$applicableSessions',
                        as: 'session',
                        in: '$$session._id'
                      }
                    }
                  }
                }
              }
            }
          }
        }
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
                    { $eq: ['$status', 'Present'] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: '$student',
                attendedSessions: { $push: '$session' },
                attendedCount: { $sum: 1 }
              }
            }
          ],
          as: 'attendanceRecords'
        }
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
                            cond: { $eq: ['$$record._id', '$$student.studentId'] }
                          }
                        },
                        0
                      ]
                    }
                  },
                  in: {
                    $let: {
                      vars: {
                        // Count attended sessions that are in applicable sessions
                        attendedApplicable: {
                          $size: {
                            $filter: {
                              input: { $ifNull: ['$$studentAttendance.attendedSessions', []] },
                              as: 'attendedSession',
                              cond: { 
                                $in: ['$$attendedSession', '$$student.applicableSessionIds'] 
                              }
                            }
                          }
                        },
                        applicableCount: '$$student.applicableSessionCount'
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
                                { $divide: ['$$attendedApplicable', '$$applicableCount'] },
                                100
                              ]
                            }
                          ]
                        },
                        eligible: {
                          $cond: [
                            { $eq: ['$$applicableCount', 0] },
                            true,
                            {
                              $gte: [
                                {
                                  $multiply: [
                                    { $divide: ['$$attendedApplicable', '$$applicableCount'] },
                                    100
                                  ]
                                },
                                threshold
                              ]
                            }
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
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
                cond: '$$data.eligible'
              }
            }
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
                        in: '$$data.attendanceRate'
                      }
                    }
                  },
                  0
                ]
              },
              0
            ]
          }
        }
      },

      // 11. Calculate not eligible count
      {
        $addFields: {
          notEligibleCount: {
            $subtract: ['$totalStudents', '$eligibleCount']
          }
        }
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
          notEligibleCount: 1
        }
      },

      // 13. Sort by course code
      { $sort: { courseCode: 1 } }
    ]);

    res.json({ data: coursesList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};