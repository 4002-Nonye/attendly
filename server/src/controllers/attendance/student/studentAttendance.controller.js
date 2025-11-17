const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');
const Attendance = mongoose.model('Attendance');
const User = mongoose.model('User');

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

    // TODO: GET THE PERCENTAGE FOR CALCULATING ELIGIBILITY FROM SCHOOL'S SETTING

    // Get the school's current academic period
    const schoolDoc = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    if (!schoolDoc) return res.status(404).json({ error: 'School not found' });

    const { currentAcademicYear, currentSemester } = schoolDoc;
    if (!currentAcademicYear || !currentSemester)
      return res
        .status(400)
        .json({ error: 'No active academic period for this school' });

    // Get the student level
    const student = await User.findById(id).select('level');
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const report = await StudentEnrollment.aggregate([
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

      // 5. Lookup sessions only after student enrolled
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
          as: 'sessions',
        },
      },

      // 6. Lookup attendances for this student in this course
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

      // 7. Compute totals
      {
        $addFields: {
          totalSessions: { $size: '$sessions' },
          totalAttended: {
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

      // 8. Compute percentage
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

      // 9. Eligibility (>= 70%)
      {
        $addFields: {
          eligible: { $gte: ['$attendancePercentage', 70] },
        },
      },

      // 10. Final projection
      {
        $project: {
          _id: 0,
          courseId: '$course._id',
          courseCode: '$course.courseCode',
          courseTitle: '$course.courseTitle',
          totalSessions: 1,
          totalAttended: 1,
          attendancePercentage: 1,
          eligible: 1,
          enrolledAt: '$createdAt',
        },
      },
    ]);

    return res.status(200).json({ report });
  } catch (error) {
    console.error('Attendance report error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStudentSessionDetails = async (req, res) => {
  // returns session date -> lecturer (startedBy) -> Time -> status (present/absent)
  try {
    const { courseId } = req.params;
    const { id, schoolId } = req.user;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    //  Get current academic year and semester for the student's school
    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    if (!school || !school.currentAcademicYear) {
      return res
        .status(404)
        .json({ error: 'No current academic period found for this school' });
    }

    // Find all sessions for the course in the current academic period

    const sessions = await Session.find({
      course: courseId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .populate('startedBy', 'fullName')
      .populate('endedBy', 'fullName')
      .select('createdAt status')
      .lean();

    if (!sessions.length) {
      return res
        .status(404)
        .json({ error: 'No sessions found for this course' });
    }

    // Extract the session ids into an array
    const sessionIds = sessions.map((s) => s._id);

    // Use the session id to find attendance records for a student for a selected course
    const attendanceRecord = await Attendance.find({
      course: courseId,
      session: { $in: sessionIds },
      student: id,
    }).select('session status createdAt');

    // return {"some-session-id" : "Present"} for easy lookup
    const attendanceMap = attendanceRecord.reduce((acc, record) => {
      acc[record.session.toString()] = record.status;
      return acc;
    }, {});

    const sessionDetails = sessions.map((s) => {
      // access the attendance status
      const attendanceStatus = attendanceMap[s._id.toString()];

      let finalStatus;

      if (attendanceStatus) {
        finalStatus = attendanceStatus; // student attended (or has a record)
      } else if (s.status === 'ended') {
        finalStatus = 'Absent'; // session ended but student didn’t mark attendance
      } else if (s.status === 'active') {
        finalStatus = 'Not yet taken'; // session is ongoing but student is yet to mark attendance
      } else {
        finalStatus = 'Unknown';
      }

      // send to fe
      return {
        sessionId: s._id,
        createdAt: s.createdAt,
        lecturer: s.startedBy?.fullName || 'Unknown',
        sessionStatus: s.status, // -> "active" or "ended"
        studentStatus: finalStatus, // -> "Present", "Absent", "Not yet taken"
      };
    });
    return res.status(200).json({ sessionDetails });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
