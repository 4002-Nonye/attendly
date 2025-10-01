const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');

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
    });
    await markedAttendance.save();
    return res
      .status(201)
      .json({ message: 'Attendance taken', markedAttendance });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStudentAttendanceReport = async (req, res) => {
  // returns course -> total sessions -> total attended -> eligibile -> view details
  try {
    const { id } = req.user;

    const report = await StudentEnrollment.aggregate([
      {
        $match: {
          student: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courses',
        },
      },
      {
        $lookup: {
          from: 'sessions',
          localField: 'courses._id',
          foreignField: 'course',
          as: 'sessions',
        },
      },
      {
        $addFields: {
          totalSessions: {
            $size: '$sessions',
          },
        },
      },
      {
        $lookup: {
          from: 'attendances',
          localField: 'student',
          foreignField: 'student',
          as: 'attendances',
        },
      },
      {
        $addFields: {
          totalAttended: {
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
        },
      },
      {
        $addFields: {
          attendancePercentage: {
            $cond: [
              {
                $eq: ['$totalSessions', 0],
              },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: ['$totalAttended', '$totalSessions'],
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
      {
        $addFields: {
          eligible: {
            $gte: ['$attendancePercentage', 70],
          },
        },
      },
      {
        $unwind: {
          path: '$courses',
        },
      },
      {
        $project: {
          _id: 0,
          courseId: '$courses._id',
          courseCode: '$courses.courseCode',
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
  // returns session date -> lecturer -> Time -> status (present/absent)
};
