const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');
const Attendance = mongoose.model('Attendance');

exports.markAttendance = async (req, res) => {
  // SUPPORTS BOTH QR CODE SCANNING AND BUTTON MARKING

  try {
    const { courseId, sessionId } = req.params;
    const { id: userId } = req.user;
    // Access token sent to frontend when session was created
    const { token } = req.body || {}; // For just QR flow

    // 1. check if class exists
    const activeSession = await Session.findById(sessionId);
    if (!activeSession) {
      return res.status(404).json({ error: 'Session does not exist' });
    }

    // 2. check if session matches course
    if (activeSession.course.toString() !== courseId) {
      return res
        .status(400)
        .json({ error: 'Course does not match this session' });
    }
    // 3. check if class is still ongoing
    if (activeSession.status !== 'active')
      return res.status(400).json({ error: 'Class already ended' });

    // 4. check if token is valid for qr scan
    if (token && activeSession.token !== token) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // 5. only enrolled students can mark attendance
    const isEnrolled = await StudentEnrollment.findOne({
      student: userId,
      course: courseId,
    });

    if (!isEnrolled) {
      return res
        .status(403)
        .json({ error: 'Student is not enrolled in this course' });
    }

    // 6. prevent duplicate attendance
    const existingAttendance = await Attendance.findOne({
      course: courseId,
      session: sessionId,
      student: userId,
    });
    if (existingAttendance) {
      return res.status(400).json({ error: 'Attendance already marked' });
    }

    // 7. mark attendance
    const markedAttendance = await new Attendance({
      course: courseId,
      session: sessionId,
      student: userId,
      status: 'Present',
      academicYear: activeSession.academicYear,
      semester: activeSession.semester,
    });
    await markedAttendance.save();
    return res
      .status(201)
      .json({ message: 'Attendance taken', markedAttendance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStudentAttendanceReport = async (req, res) => {
  try {
    const { id, schoolId } = req.user;

    // TODO : GET THE PERCENTAGE FOR CALCULATING ELIGIBILITY FROM SCHOOL'S SETTING

    //  Get the school's current academic period
    const schoolDoc = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    if (!schoolDoc) return res.status(404).json({ error: 'School not found' });

    const { currentAcademicYear, currentSemester } = schoolDoc;
    if (!currentAcademicYear || !currentSemester)
      return res
        .status(400)
        .json({ error: 'No active academic period for this school' });

    const report = await StudentEnrollment.aggregate([
      // 1. Get all enrollments for this student
      {
        $match: {
          student: mongoose.Types.ObjectId.createFromHexString(id),
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

      // 4. Lookup sessions for the current academic period

      {
        $lookup: {
          from: 'sessions',
          let: { courseId: '$course._id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$course', '$$courseId'] },
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

      // 5. Lookup attendances for this student in this course
      {
        $lookup: {
          from: 'attendances',
          let: { courseId: '$course._id', studentId: '$student' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $eq: ['$student', '$$studentId'] },
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

      // 6. Compute totals
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

      // 7. Compute percentage
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

      // 8. Eligibility (>= 70%)
      {
        $addFields: {
          eligible: { $gte: ['$attendancePercentage', 70] },
        },
      },

      // 9. Final projection
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
        },
      },
    ]);

    return res.status(200).json({ report });
  } catch (error) {
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
        date: s.createdAt.toISOString().split('T')[0], // YYYY-MM-DD
        time: new Date(s.createdAt).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
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

