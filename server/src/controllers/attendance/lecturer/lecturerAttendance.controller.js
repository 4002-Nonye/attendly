const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Attendance = mongoose.model('Attendance');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');

exports.getLecturerAttendanceOverview = async (req, res) => {
  // returns course -> total sessions -> total students -> average attendance
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

      // 2. Go into sessions collection and find all sessions for a course : save as 'sessions'
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

      // 3. Go into student enrollments collection and get ACTIVE students who registered for a course : save as 'studentenrollments
      {
        $lookup: {
          from: 'studentenrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'studentenrollments',
          pipeline: [
            {
              $match: {
                enrollmentStatus: 'active',
              },
            },
          ],
        },
      },

      // 4. Go into attendance collection to get all attendances for a course of an academic period : save as 'attendances'
      {
        $lookup: {
          from: 'attendances',
          let: { courseId: '$_id', sessionIds: '$sessions._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $in: ['$session', '$$sessionIds'] },
                  ],
                },
              },
            },
          ],
          as: 'attendances',
        },
      },

      // 5. Compute total students who enrolled in a course (enrollmentStatus === 'active')
      {
        $addFields: {
          totalStudents: {
            $size: '$studentenrollments',
          },
        },
      },

      // 6. Compute total sessions for a course
      {
        $addFields: {
          totalSessions: {
            $size: '$sessions',
          },
        },
      },

      // 7. Calculate average attendance
      {
        $addFields: {
          averageAttendance: {
            $cond: [
              {
                $gt: [
                  {
                    $size: '$sessions',
                  },
                  0,
                ],
              },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          {
                            $size: {
                              $filter: {
                                input: '$attendances',
                                as: 'att',
                                cond: {
                                  $eq: ['$$att.status', 'Present'],
                                },
                              },
                            },
                          },
                          {
                            $multiply: [
                              {
                                $size: '$sessions',
                              },
                              {
                                $size: '$studentenrollments',
                              },
                            ],
                          },
                        ],
                      },
                      100,
                    ],
                  },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },

      // Final result
      {
        $project: {
          _id: 1,
          courseCode: 1,
          courseTitle: 1,
          totalSessions: 1,
          totalStudents: 1,
          averageAttendance: 1,
        },
      },
    ]);

    return res.status(200).json({ overview });
  } catch (error) {
    console.log(error);
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
      {
        $lookup: {
          from: 'studentenrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'studentenrollments',
          pipeline: [
            {
              $match: {
                enrollmentStatus: 'active',
              },
            },
          ],
        },
      },
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
          ],
        },
      },
      {
        $unwind: {
          path: '$sessions',
        },
      },
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
      {
        $addFields: {
          totalStudents: {
            $size: '$studentenrollments',
          },
        },
      },
      {
        $addFields: {
          totalPresent: {
            $size: {
              $filter: {
                input: '$sessionAttendances',
                as: 'att',
                cond: {
                  $eq: ['$$att.status', 'Present'],
                },
              },
            },
          },
        },
      },
      {
        // Calculate absent/pending based on session status
        $addFields: {
          unmarkedCount: {
            $subtract: ['$totalStudents', '$totalPresent'],
          },
          totalAbsent: {
            $cond: [
              {
                $in: ['$sessions.status', ['ended']],
              },
              {
                $subtract: ['$totalStudents', '$totalPresent'],
              },
              0,
            ],
          },
          totalPending: {
            $cond: [
              {
                $eq: ['$sessions.status', 'active'], 
              },
              {
                $subtract: ['$totalStudents', '$totalPresent'],
              },
              0,
            ],
          },
        },
      },
      {

        $addFields: {
          averageAttendance: {
            $cond: [
              {
                $and: [
                  { $gt: ['$totalStudents', 0] },
                  { $in: ['$sessions.status', ['ended']] }, 
                ],
              },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ['$totalPresent', '$totalStudents'],
                      },
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
      {
        $project: {
          _id: '$sessions._id',
          createdAt: '$sessions.createdAt',
          updatedAt: '$sessions.updatedAt',
          status: '$sessions.status',
          totalStudents: 1,
          totalPresent: 1,
          totalAbsent: 1,
          totalPending: 1,
          averageAttendance: 1,
        },
      },
      {

        $sort: { createdAt: -1 },
      },
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
  // returns studentId (matricNo) -> fullName -> status -> time marked
  try {
    const { sessionId, courseId } = req.params;
    const { id, schoolId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    // 1.  Get current academic period of the lecturer's school
    const schoolData = await School.findById(schoolId);

    if (!schoolData?.currentAcademicYear) {
      return res.status(400).json({ error: 'No active academic period found' });
    }

    const currentYearId = schoolData.currentAcademicYear;
    const currentSemester = schoolData.currentSemester;

    // 2.  Ensure the lecturer is assigned to the course
    const course = await Course.findOne({
      _id: courseId,
      lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
    });

    if (!course) {
      return res
        .status(403)
        .json({ error: 'Course not found or unauthorized' });
    }

    // 3. Find the session only within current academic period
    const session = await Session.findOne({
      _id: sessionId,
      course: courseId,
      academicYear: currentYearId,
      semester: currentSemester,
    });

    if (!session) {
      return res
        .status(404)
        .json({ error: 'Session not found in current period' });
    }

    // 4. Get active enrolled students (for that course)
    const enrollments = await StudentEnrollment.find({
      course: courseId,
      academicYear: currentYearId,
      semester: currentSemester,
      enrollmentStatus: 'active',
    }).populate('student', 'matricNo fullName');

    // 5. Get attendance records for this session
    const attendances = await Attendance.find({
      session: sessionId,
      course: courseId,
    }).select('status createdAt student');

    // 6. Map attendances by student
    const attendanceMap = new Map(
      attendances.map((a) => [a.student.toString(), a])
    );

    // 7. Build details list
    const details = enrollments.map((enr) => {
      const record = attendanceMap.get(enr.student._id.toString());
      return {
        studentId: enr.student._id,
        matricNo: enr.student.matricNo,
        fullName: enr.student.fullName,
        status: record
          ? record.status
          : session.status === 'ended'
          ? 'Absent'
          : 'Pending',
        timeMarked: record ? record.createdAt : null,
      };
    });

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
      students: details,
    });
  } catch (error) {
    console.log(error);
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

    //  Get threshold (default to 75% if not set)
    const threshold = school.attendanceThreshold || 75;

    const reportData = await Course.aggregate([
      // 1. Match course
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(courseId),
          lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
        },
      },

      // 2. Fetch sessions for current academic period
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
                status: { $in: ['ended'] }, 
              },
            },
          ],
        },
      },
      { $addFields: { totalSessions: { $size: '$sessions' } } },

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
      
      //  when no students enrolled
      {
        $match: {
          totalStudents: { $gt: 0 }
        }
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

      // 5. get attendances for this student in this period
      {
        $lookup: {
          from: 'attendances',
          let: { courseId: '$_id', studentId: '$studentEnrollments.student' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $eq: ['$student', '$$studentId'] },
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

      // 6. compute totals and percentages
      { $addFields: { totalAttended: { $size: '$studentAttendances' } } },
      {
        $addFields: {
          totalAbsent: { $subtract: ['$totalSessions', '$totalAttended'] },
        },
      },
      {
        $addFields: {
          attendancePercentage: {
            $cond: [
              { $eq: ['$totalSessions', 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$totalAttended', '$totalSessions'] },
                      100,
                    ],
                  },
                  1, //  round to 1 decimal place
                ],
              },
            ],
          },
        },
      },

      { 
        $addFields: { 
          eligible: { $gte: ['$attendancePercentage', threshold] } 
        } 
      },

      // 7. final result
      {
        $project: {
          _id: 0,
          studentId: '$studentEnrollments.student',
          studentName: '$studentInfo.fullName',
          studentMatricNo: '$studentInfo.matricNo',
          totalSessions: 1,
          totalAttended: 1,
          totalAbsent: 1,
          attendancePercentage: 1,
          eligible: 1,
        },
      },
      
      //  sort by matricNo
      {
        $sort: { studentMatricNo: 1 }
      }
    ]);

    //  calculate summary stats
    const totalStudents = reportData.length;
    const eligibleCount = reportData.filter(s => s.eligible).length;
    const notEligibleCount = totalStudents - eligibleCount;
    const totalSessions = reportData[0]?.totalSessions || 0;


    return res.status(200).json({
      course: {
        _id: course._id,
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
        level: course.level,
        semester: course.semester,
        totalSessions,
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
