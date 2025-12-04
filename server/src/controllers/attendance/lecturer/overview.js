const mongoose = require('mongoose');
const Course = mongoose.model('Course');

const School = mongoose.model('School');
exports.getLecturerAttendanceOverview = async (req, res) => {
  try {
    const { id, schoolId } = req.user;

    // fetch current academic year and semester from lecturer's school
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

      // 2. Get all sessions for this course
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

      // 3. Add totalSessions field
      {
        $addFields: {
          totalSessions: { $size: '$sessions' },
        },
      },

      // 4. Filter: Only return courses with sessions > 0
      {
        $match: {
          totalSessions: { $gt: 0 },
        },
      },

      // 5. Final result
      {
        $project: {
          _id: 1,
          courseCode: 1,
          courseTitle: 1,
          totalSessions: 1,
        },
      },
    ]);

    return res.status(200).json({ overview });
  } catch (error) {
    console.error('Error in getLecturerAttendanceOverview:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
