const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');

exports.getLecturerSessionStudentDetails = async (req, res) => {
  try {
    const { sessionId, courseId } = req.params;
    const { id, schoolId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    // 1. get current academic period of the lecturer's school
    const schoolData = await School.findById(schoolId);

    if (!schoolData?.currentAcademicYear) {
      return res.status(400).json({ error: 'No active academic period found' });
    }

    const currentYearId = schoolData.currentAcademicYear;
    const currentSemester = schoolData.currentSemester;

    // 2. endure the lecturer is assigned to the course
    const course = await Course.findOne({
      _id: courseId,
      lecturers: { $in: [mongoose.Types.ObjectId.createFromHexString(id)] },
    });

    if (!course) {
      return res
        .status(403)
        .json({ error: 'Course not found or unauthorized' });
    }

    // 3. find the session only within current academic period
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

    // 4.  get ALL students (including inactive) who were enrolled at session time
    const studentDetails = await StudentEnrollment.aggregate([
      {
        $match: {
          course: mongoose.Types.ObjectId.createFromHexString(courseId),
          academicYear: currentYearId,
          semester: currentSemester,
          createdAt: { $lte: session.createdAt }, // Only students enrolled before session
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo',
          pipeline: [{ $project: { matricNo: 1, fullName: 1 } }],
        },
      },
      { $unwind: '$studentInfo' },
      {
        $lookup: {
          from: 'attendances',
          let: { studentId: '$student' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$student', '$$studentId'] },
                    {
                      $eq: [
                        '$session',
                        mongoose.Types.ObjectId.createFromHexString(sessionId),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: 'attendance',
        },
      },
      {
        $addFields: {
          attendanceRecord: { $arrayElemAt: ['$attendance', 0] },
        },
      },
      {
        $project: {
          studentId: '$student',
          matricNo: '$studentInfo.matricNo',
          fullName: '$studentInfo.fullName',
          status: {
            $cond: {
              if: { $gt: [{ $size: '$attendance' }, 0] },
              then: '$attendanceRecord.status',
              else: {
                $cond: {
                  if: { $eq: [session.status, 'ended'] },
                  then: 'Absent',
                  else: 'Pending',
                },
              },
            },
          },
          timeMarked: {
            $cond: {
              if: { $gt: [{ $size: '$attendance' }, 0] },
              then: '$attendanceRecord.createdAt',
              else: null,
            },
          },
          enrollmentDate: '$createdAt',
        },
      },
      { $sort: { matricNo: 1 } },
    ]);

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
      students: studentDetails,
    });
  } catch (error) {
    console.error('Error in getLecturerSessionStudentDetails:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};