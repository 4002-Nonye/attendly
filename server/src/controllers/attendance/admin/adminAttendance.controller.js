const mongoose = require('mongoose');
const { generateAttendancePDF } = require('../../../lib/pdfReportGenerator');
const {
  buildStudentAttendanceAggregation,
} = require('../../../utils/attendanceAggregation');
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

    // TODO: ADD ATTENDANCE THRESHOLD
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

exports.getAdminCourseAttendanceDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { schoolId } = req.user;

    // Find the school's current academic period
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester attendanceThreshold')
      .lean();

    if (!school) return res.status(404).json({ error: 'School not found' });

    const threshold = school.attendanceThreshold || 65;

    // Get course details
    const course = await Course.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(courseId),
      schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId),
    })
      .populate('department', 'name')
      .populate('faculty', 'name')
      .lean();

    if (!course) return res.status(404).json({ error: 'Course not found' });

    //Build and execute aggregation pipeline

    const pipeline = buildStudentAttendanceAggregation(
      courseId,
      schoolId,
      school,
      threshold,
      course
    );
    const result = await Course.aggregate(pipeline);
    if (!result || result.length === 0) {
      return res.json({
        courseInfo: {
          _id: course._id,
          courseCode: course.courseCode,
          courseTitle: course.courseTitle,
          level: course.level,
          department: course.department,
          faculty: course.faculty,
          totalSessions: 0,
        },
        summary: {
          totalStudents: 0,
          eligibleCount: 0,
          notEligibleCount: 0,
          threshold: threshold,
        },
        students: [],
      });
    }

    const data = result[0];

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.downloadAdminAttendanceReport = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { schoolId } = req.user;

    // Find the school's current academic period
    const school = await School.findById(schoolId)
      .select(
        'currentAcademicYear currentSemester attendanceThreshold schoolName'
      )
      .populate('currentAcademicYear', 'year')
      .lean();

    if (!school) return res.status(404).json({ error: 'School not found' });

    const threshold = school.attendanceThreshold || 65;

    // Get course details
    const course = await Course.findOne({
      _id: mongoose.Types.ObjectId.createFromHexString(courseId),
      schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId),
    })
      .populate('department', 'name')
      .populate('faculty', 'name')
      .lean();

    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Extract the academic year ID from the populated object
    const academicYearId = school.currentAcademicYear._id;
    const academicYearValue = school.currentAcademicYear.year;

    // Build and execute aggregation pipeline
    const pipeline = buildStudentAttendanceAggregation(
      courseId,
      schoolId,
      {
        currentAcademicYear: academicYearId,
        currentSemester: school.currentSemester,
      },
      threshold,
      course
    );

    const result = await Course.aggregate(pipeline);

    // Handle empty results
    if (!result || result.length === 0) {
      const emptyData = {
        universityName: school.schoolName || 'My University',
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        students: [],
      };

      const pdfBuffer = await generateAttendancePDF(emptyData, {
        watermark: true,
        confidential: true,
        showSealPlaceholder: true,
      });

      const emptyFilename = `attendance-${course.courseCode.replace(
        /\s+/g,
        '-'
      )}-${academicYearValue.replace('/', '-')}-${
        school.currentSemester
      }-Semester-${Date.now()}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${emptyFilename}"`
      );
      return res.send(pdfBuffer);
    }

    const data = result[0];

    // Format data for PDF generation
    const pdfData = {
      universityName: school.schoolName || 'My University',
      courseCode: data.courseInfo.courseCode,
      courseTitle: data.courseInfo.courseTitle,
      department: data.courseInfo.department?.name,
      faculty: data.courseInfo.faculty?.name,
      academicYear: academicYearValue,
      semester: school.currentSemester,
      threshold: threshold,
      totalSessions: data.courseInfo.totalSessions,
      summary: data.summary,
      students: data.students.map((student) => ({
        matricNo: student.matricNo,
        fullName: student.fullName,
        enrolledAtSession: student.enrolledAtSession,
        totalSessions: student.totalSessions,
        totalAttended: student.totalAttended,
        totalAbsent: student.totalAbsent,
        attendancePercentage: student.attendancePercentage,
        eligible: student.eligible,
      })),
    };

    // PDF generation options
    const pdfOptions = {
      watermark: true,
      confidential: true,
      showSealPlaceholder: true,
    };

    // Generate PDF
    const pdfBuffer = await generateAttendancePDF(pdfData, pdfOptions);

    // Set response headers and send
    const filename = `attendance-${data.courseInfo.courseCode.replace(
      /\s+/g,
      '-'
    )}-${academicYearValue.replace('/', '-')}-${
      school.currentSemester
    }-Semester-${Date.now()}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache');

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
