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
                enrollmentStatus: 'active', // ← ONLY ACTIVE STUDENTS
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

      // 5. Compute total students who enrolled in a course (ACTIVE ONLY)
      {
        $addFields: {
          totalStudents: {
            $size: '$studentenrollments', // Now only counts active students
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
                                $size: '$studentenrollments', // Now only active students
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
  // returns session date -> total students -> total present -> total absent -> average attendance (% present) -> view details
  try {
    const { courseId } = req.params;
    const { id, schoolId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    // Fetch current academic year and semester from lecturer’s school
    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    if (!school || !school.currentAcademicYear) {
      return res.status(404).json({
        error: 'No current academic period found for this school',
      });
    }

    // check if lecturer is assigned to the course
    const course = await Course.findOne({
      _id: courseId,
      lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
    });

    if (!course) {
      return res.status(403).json({ error: 'Course not found' });
    }

    const sessionDetails = await Course.aggregate([
      {
        // 1. Find course that was clicked
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(courseId),
          lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
        },
      },

      {
        // 2. Go into student enrollments and find all active enrolled students for that course
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
        // 3. Go into sessions and find all sessions tied to that course
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
        // 4. Unpack the sessions found (array) so each session becomes a separate doc (makes it easier to perform actions)
        $unwind: {
          path: '$sessions',
        },
      },

      {
        // 6. Go into attendance and look for all docs for each session (using pipeline for accurate matching)
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
        // 7. Compute total students enrolled in that course
        $addFields: {
          totalStudents: {
            $size: '$studentenrollments',
          },
        },
      },

      {
        // 8. Compute total present for each session
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
        // 9. Compute total absent for each session
        $addFields: {
          totalAbsent: {
            $subtract: ['$totalStudents', '$totalPresent'],
          },
        },
      },

      {
        // 10. Calculate average attendance per session
        // averageAttendance (%) = (Number of "Present" students in session / Total students enrolled in session) × 100
        $addFields: {
          averageAttendance: {
            $cond: [
              {
                $gt: ['$totalStudents', 0], // only calculate if there are students enrolled in that course
              },
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ['$totalPresent', '$totalStudents'],
                      },
                      100, // convert to percentage
                    ],
                  },
                  0, // round to whole number
                ],
              },
              0, // else if no students enrolled in the course, avg attendance is 0
            ],
          },
        },
      },

      {
        // 11. result
        $project: {
          _id: '$sessions._id',
          createdAt: '$sessions.createdAt',
          totalStudents: 1,
          totalPresent: 1,
          totalAbsent: 1,
          averageAttendance: 1,
        },
      },
    ]);

    return res.status(200).json({
      course: {
        _id: course._id,
        courseCode: course.courseCode,
        courseTitle: course.courseTitle,
      },
      sessionDetails,
    });
  } catch (error) {
    console.log(error);
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
        id: session._id,
        status: session.status,
      },
      students: details,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLecturerAttendanceReport = async (req, res) => {
  // returns total students -> student matricNo -> name -> sessions total -> attended total -> absent total -> % attended -> eligible
  try {
    const { courseId } = req.params;
    const { id, schoolId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    // check if lecturer is assigned to the course
    const course = await Course.findOne({
      _id: courseId,
      lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
    });
    if (!course) {
      return res.status(403).json({ error: 'Course not found' });
    }

    // Fetch current academic year and semester from lecturer’s school
    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    if (!school || !school.currentAcademicYear) {
      return res.status(404).json({
        error: 'No current academic period found for this school',
      });
    }

    const report = await Course.aggregate([
      // 1. Match course
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(courseId),
          lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
        },
      },

      // 2. Fetch only sessions belonging to this academic period
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
              },
            },
          ],
        },
      },
      { $addFields: { totalStudents: { $size: '$studentEnrollments' } } },
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

      // 5. Get attendances for this academic period
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

      // 6. Compute totals and percentages
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
                  0,
                ],
              },
            ],
          },
        },
      },
      { $addFields: { eligible: { $gte: ['$attendancePercentage', 70] } } },

      // 7. Final projection
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
    ]);

    return res.status(200).json({ report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.downloadLecturerAttendanceReport = async (req, res) => {
  // returns downloadable PDF for a course
};
