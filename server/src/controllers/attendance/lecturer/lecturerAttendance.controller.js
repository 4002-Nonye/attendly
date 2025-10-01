const mongoose = require('mongoose');
const Course = mongoose.model('Course');

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
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLecturerSessionDetails = async (req, res) => {
  // returns session date -> total students -> total present -> total absent -> average attendance (% present) ->view details
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }
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
        .json({ error: 'No attendance record found for this session' });
    }
    res.status(200).json({ sessionDetails: details });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLecturerAttendanceReport = async (req, res) => {
  // returns total students -> student matricNo -> name -> sessions total -> attended total -> % attended -> eligible
  try {
    const { courseId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }
    const report = await Course.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(courseId),
        },
      },
      {
        $lookup: {
          from: 'sessions',
          localField: '_id',
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
          from: 'studentenrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'studentEnrollments',
        },
      },
      {
        $addFields: {
          totalStudents: {
            $size: '$studentEnrollments',
          },
        },
      },
      {
        $unwind: {
          path: '$studentEnrollments',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'studentEnrollments.student',
          foreignField: '_id',
          as: 'studentInfo',
          pipeline: [
            {
              $project: {
                _id: 1,
                fullName: 1,
                matricNo: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$studentInfo',
        },
      },
      {
        $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'course',
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
                  $and: [
                    { $eq: ['$$att.student', '$studentEnrollments.student'] },
                    { $eq: ['$$att.status', 'Present'] },
                  ],
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
        $project: {
          _id: 0,
          studentId: '$studentEnrollments.student',
          studentName: '$studentInfo.fullName',
          studentMatricNo: '$studentInfo.matricNo',
          totalAttended: 1,
          attendancePercentage: 1,
          totalSessions: 1,
          eligible: 1,
        },
      },
    ]);
    return res.status(200).json({ report });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.downloadLecturerAttendanceReport = async (req, res) => {
  // returns downloadable PDF for a course
};