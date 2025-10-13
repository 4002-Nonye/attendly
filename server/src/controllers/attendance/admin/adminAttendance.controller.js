const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');

exports.getAdminAttendanceReport = async (req, res) => {
  // accepts filters: facultyId, departmentId, level, courseId
  // returns
  // course information
  // student id -> name -> sessions total -> attended total -> % attended -> eligible
  // scoped to the current academic year and semester
  try {
    const { facultyId, departmentId, level, courseId } = req.query;
    const { schoolId } = req.user;

    if (!facultyId || !departmentId || !level || !courseId)
      return res.status(400).json({ error: 'All fields are required' });

    // find the school's current academic period
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();
      
    if (!school)
      return res.status(404).json({ error: 'School not found' });

    const matchFilters = {};

     // Build filters
    if (facultyId)
      matchFilters['student.faculty'] =
        mongoose.Types.ObjectId.createFromHexString(facultyId);
    if (departmentId)
      matchFilters['student.department'] =
        mongoose.Types.ObjectId.createFromHexString(departmentId);
    if (level) matchFilters['student.level'] = parseInt(level);

    console.log(matchFilters)

    const report = await StudentEnrollment.aggregate([
      // 1. Filter enrollments by course
      {
        $match: {
          course: mongoose.Types.ObjectId.createFromHexString(courseId),
        },
      },

      // 2. Lookup student info from users
      {
        $lookup: {
          from: 'users',
          localField: 'student',
          foreignField: '_id',
          as: 'student',
        },
      },
      { $unwind: '$student' },

   //   3. Apply faculty/department/level filters
      {
        $match: matchFilters,
      },

      // 4. Lookup all sessions for this course — scoped to current academic period
      {
        $lookup: {
          from: 'sessions',
          let: { courseId: '$course' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$course', '$$courseId'] },
                    { $eq: ['$academicYear', school.currentAcademicYear] },
                    { $eq: ['$semester', school.currentSemester] },
                  ],
                },
              },
            },
          ],
          as: 'sessions',
        },
      },

      // 5. Lookup attendance records for this student (same academic period)
      {
        $lookup: {
          from: 'attendances',
          let: { studentId: '$student._id', courseId: '$course' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$student', '$$studentId'] },
                    { $eq: ['$course', '$$courseId'] },
                    { $eq: ['$academicYear', school.currentAcademicYear] },
                    { $eq: ['$semester', school.currentSemester] },
                  ],
                },
              },
            },
          ],
          as: 'attendances',
        },
      },

      // 6. Compute totals per student
      {
        $addFields: {
          totalSessions: { $size: '$sessions' },
          attendedSessions: {
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

      // 7. Compute attendance % & eligibility
      {
        $addFields: {
          attendancePercentage: {
            $cond: [
              { $gt: ['$totalSessions', 0] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ['$attendedSessions', '$totalSessions'] },
                      100,
                    ],
                  },
                  2,
                ],
              },
              0,
            ],
          },
          eligible: {
            $gte: [{ $divide: ['$attendedSessions', '$totalSessions'] }, 0.7],
          },
        },
      },

      // 8. Lookup course info
      {
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'courseInfo',
        },
      },
      { $unwind: '$courseInfo' },

      // 9. Lookup faculty info
      {
        $lookup: {
          from: 'faculties',
          localField: 'courseInfo.faculty',
          foreignField: '_id',
          as: 'faculty',
        },
      },
      { $unwind: '$faculty' },

      // 10. Lookup department info
      {
        $lookup: {
          from: 'departments',
          localField: 'courseInfo.department',
          foreignField: '_id',
          as: 'department',
        },
      },
      { $unwind: '$department' },

      // 11. Lookup lecturer info
      {
        $lookup: {
          from: 'users',
          localField: 'courseInfo.lecturers',
          foreignField: '_id',
          as: 'lecturers',
        },
      },

      // 12. Group all students into an array and include course info once
      {
        $group: {
          _id: '$course',
          courseInfo: { $first: '$courseInfo' },
          faculty: { $first: '$faculty' },
          department: { $first: '$department' },
          lecturers: { $first: '$lecturers' },
          students: {
            $push: {
              studentId: '$student._id',
              matricNo: '$student.matricNo',
              fullName: '$student.fullName',
              totalSessions: '$totalSessions',
              attendedSessions: '$attendedSessions',
              attendancePercentage: '$attendancePercentage',
              eligible: '$eligible',
            },
          },
          totalStudents: { $sum: 1 },
        },
      },

      // 13. Project final structure
      {
        $project: {
          _id: 0,
          courseInfo: {
            _id: '$courseInfo._id',
            courseCode: '$courseInfo.courseCode',
            courseTitle: '$courseInfo.courseTitle',
            level: '$courseInfo.level',
          },
          faculty: { _id: '$faculty._id', name: '$faculty.name' },
          department: { _id: '$department._id', name: '$department.name' },
          lecturers: { _id: '$lecturers._id', fullName: '$lecturers.fullName' },
          totalStudents: 1,
          students: 1,
        },
      },
    ]);

    res.json({ data: report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.downloadAdminAttendanceReport = async (req, res) => {
  // returns downloadable PDF across chosen scope
};
