const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const School = mongoose.model('School');

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
      // Get ALL student enrollments (including inactive)
      {
        $lookup: {
          from: 'studentenrollments',
          localField: '_id',
          foreignField: 'course',
          as: 'studentenrollments',
          pipeline: [
            {
              $match: {
                academicYear: school.currentAcademicYear,
                semester: school.currentSemester,
              },
            },
            {
              $project: {
                student: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
      // Get all sessions
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
            { $sort: { createdAt: -1 } },
          ],
        },
      },
      { $unwind: '$sessions' },
      // For each session, find students who were enrolled BEFORE the session
      {
        $addFields: {
          // Filter students who were enrolled before this session
          eligibleStudents: {
            $filter: {
              input: '$studentenrollments',
              as: 'enrollment',
              cond: {
                $lte: ['$$enrollment.createdAt', '$sessions.createdAt'],
              },
            },
          },
        },
      },
      // Get attendances for this session
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
      // Calculate totals based on ELIGIBLE students only
      {
        $addFields: {
          totalEligibleStudents: { $size: '$eligibleStudents' },
          totalPresent: {
            $size: {
              $filter: {
                input: '$sessionAttendances',
                as: 'att',
                cond: { $eq: ['$$att.status', 'Present'] },
              },
            },
          },
        },
      },
      // Calculate absent/pending based on session status and ELIGIBLE students
      {
        $addFields: {
          totalAbsent: {
            $cond: [
              { $eq: ['$sessions.status', 'ended'] },
              {
                $max: [
                  { $subtract: ['$totalEligibleStudents', '$totalPresent'] },
                  0,
                ],
              },
              0,
            ],
          },
          totalPending: {
            $cond: [
              { $eq: ['$sessions.status', 'active'] },
              {
                $max: [
                  { $subtract: ['$totalEligibleStudents', '$totalPresent'] },
                  0,
                ],
              },
              0,
            ],
          },
        },
      },
      // Calculate attendance rate based on ELIGIBLE students
      {
        $addFields: {
          averageAttendance: {
            $cond: [
              {
                $and: [
                  { $gt: ['$totalEligibleStudents', 0] },
                  { $eq: ['$sessions.status', 'ended'] },
                ],
              },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$totalPresent', '$totalEligibleStudents'] },
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
      // Final projection
      {
        $project: {
          _id: '$sessions._id',
          createdAt: '$sessions.createdAt',
          updatedAt: '$sessions.updatedAt',
          status: '$sessions.status',
          totalStudents: '$totalEligibleStudents',
          totalPresent: 1,
          totalAbsent: 1,
          totalPending: 1,
          averageAttendance: 1,
        },
      },
      { $sort: { createdAt: -1 } },
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