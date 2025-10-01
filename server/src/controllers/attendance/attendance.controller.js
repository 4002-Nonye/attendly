const mongoose = require('mongoose');
const Attendance = mongoose.model('Attendance');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Course = mongoose.model('Course');

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
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLecturerAttendanceOverview = async (req, res) => {
  // returns course -> total sessions -> total students -> average attendance
  try {
    const { id } = req.user;
    const overview = await Course.aggregate([
      // 1. find all courses where the lecturer is assigned to
      {
        $match: {
          lecturers: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },

      // 2. Go into sessions collection and find all sessions for a course : save as 'sessions'
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'course',
          as: 'sessions',
        },
      },

      // 3. Go into student enrollments collection and get students who registered for a course : save as 'studentenrollments
      {
        $lookup: {
          from: 'studentenrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'studentenrollments',
        },
      },

      // 4.  Go into attendance collection to get all attendances for a course : save as 'attendances'
      {
        $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'course',
          as: 'attendances',
        },
      },

      // 5. Compute total students who enrolled in a course
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
      //  averageAttendance (%) = (Number of "Present" attendance records / Total possible attendances) ×100

      {
        $addFields: {
          // - add a field of "averageAttendance" to store computed average attendance
          averageAttendance: {
            // - to calculate avg attendance, there must be at least a session
            $cond: [
              {
                $gt: [
                  {
                    $size: '$sessions', // - how many sessions exist
                  },
                  0, // existing session count must be greater than 0
                ],
              },
              {
                $round: [
                  // round off result to whole number
                  {
                    // - if the condiion is met, proceed to calculate avg attendance
                    $multiply: [
                      {
                        $divide: [
                          {
                            // -  go into the attendance record and count how many 'Present' exist (this is the numerator)
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
                            // - compute total possible attendance - this is the denominator
                            $multiply: [
                              {
                                $size: '$sessions', // total sessions held
                              },
                              {
                                $size: '$studentenrollments', // total students enrolled in a course
                              },
                            ],
                          },
                        ],
                      },
                      100, // convert to percentage
                    ],
                  },
                  0,
                ],
              },

              // else - if no sessions held, set avg attendance to be 0
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
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLecturerSessionDetails = async (req, res) => {
  // returns session date -> total students -> total present -> total absent -> average attendance (% present) ->view details
  try {
    const { courseId } = req.params;

    const sessionDetails = await Course.aggregate([
      {
        // 1. Find course that was clicked
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(courseId),
        },
      },

      // 2. Go into student enrollments and find all enrolled students for that course
      {
        $lookup: {
          from: 'studentenrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'studentenrollments',
        },
      },

      // 3. Go into sessions and find all sessions tied to that course
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
          foreignField: 'course',
          as: 'sessions',
        },
      },

      // 4. Unpack the sessions found (array) so each session becomes a separate doc (makes it easier to perform actions)
      {
        $unwind: {
          path: '$sessions',
        },
      },

      // 5. Store Date and time of each session
      {
        $addFields: {
          'sessions.date': {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$sessions.createdAt',
            },
          },
          'sessions.time': {
            $dateToString: {
              format: '%H:%M',
              date: '$sessions.createdAt',
            },
          },
        },
      },

      // 6. Go into attandance and look for all docs for each session
      {
        $lookup: {
          from: 'attendances',
          localField: 'sessions._id',
          foreignField: 'session',
          as: 'attendances',
        },
      },

      // 7. Compute total students enrolled in that course
      {
        $addFields: {
          totalStudents: {
            $size: '$studentenrollments',
          },
        },
      },

      // 8. Compute total present for each session
      {
        $addFields: {
          totalPresent: {
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

      // 9. Compute total absent for each session
      {
        $addFields: {
          totalAbsent: {
            $subtract: ['$totalStudents', '$totalPresent'],
          },
        },
      },

      // 10. Calculate average attendance per session
      //  averageAttendance (%) = (Number of "Present" students in session / Total students enrolled in session) × 100
      {
        $addFields: {
          averageAttendance: {
            $cond: [
              {
                $gt: ['$totalStudents', 0], // only calculate if there are students enrolled in that course
              },
              {
                $round: [
                  // round final result to a whole number
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

      // 11. Final result
      {
        $project: {
          _id: 1,
          courseCode: 1,
          courseTitle: 1,
          'sessions._id': 1,
          'sessions.date': 1,
          'sessions.time': 1,
          totalStudents: 1,
          totalPresent: 1,
          totalAbsent: 1,
          averageAttendance: 1,
          session: 1,
        },
      },
    ]);
    return res.status(200).json({ sessionDetails });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLecturerSessionStudentDetails = async (req, res) => {
  // returns id -> matric number -> name -> status (present/absent) -> time marked (optional)
  try {
    const { sessionId } = req.params;

    // Validate sessionId
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const details = await Attendance.find({
      session: sessionId,
    })
      .select('status createdAt')
      .populate('student', 'matricNo fullName');

    if (!details || details.length === 0) {
      return res
        .status(404)
        .json({ message: 'No attendance record found for this session' });
    }
    res.status(200).json({ sessionDetails: details });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLecturerAttendanceReport = async (req, res) => {
  // returns student id -> name -> sessions total -> attended total -> % attended -> eligible
};

exports.downloadLecturerAttendanceReport = async (req, res) => {
  // returns downloadable PDF for a course
};

exports.getStudentAttendanceReport = async (req, res) => {
  // returns course -> total sessions -> total attended -> eligibile -> view details
};

exports.getStudentSessionDetails = async (req, res) => {
  // returns session date -> lecturer -> Time -> status (present/absent)
};

exports.getAdminAttendanceReport = async (req, res) => {
  // accepts filters: facultyId, departmentId, level, courseId
  // returns student id -> name -> sessions total -> attended total -> % attended -> eligible
};

exports.downloadAdminAttendanceReport = async (req, res) => {
  // accepts filters: facultyId, departmentId, level, courseId
  // returns downloadable PDF across chosen scope
};

// ✅ Should use aggregate

// getLecturerAttendanceOverview

// getLecturerSessionDetails

// getLecturerAttendanceReport

// getAdminAttendanceReport

// 🚫 Doesn’t strictly need aggregate

// getLecturerSessionStudentDetails

// getStudentAttendanceReport (optional)

// getStudentSessionDetails
