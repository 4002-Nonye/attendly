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
          lecturers: new ObjectId(id),
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
      //  averageAttendance (%) = Number of "Present" attendance records
      //                          ---------------------------------------- ×100
      //                          Total possible attendances
      //
      // 	​

      /*Where:

       Number of "Present" attendance records → count of attendance documents with status: "Present" for the course.
       Total possible attendances → totalSessions × totalStudents
       totalSessions = number of sessions for the course
       totalStudents = number of enrolled students in the course */
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

              // else - if no sessions held, set avg attendance to be 0
              0,
            ],
          },
        },
      },

      // Final result
      {
        $project: {
          _id: 0,
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
  // returns session date -> total students -> total present -> total absent -> % present ->view details
};

exports.getLecturerSessionStudentDetails = async (req, res) => {
  // returns id -> matric number -> name -> status (present/absent) -> time marked (optional)
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
