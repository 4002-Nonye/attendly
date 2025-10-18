const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const School = mongoose.model('School');
const dayjs = require('dayjs');
const Attendance = mongoose.model('Attendance');
const Faculty = mongoose.model('Faculty');

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

    if (!school) return res.status(404).json({ error: 'School not found' });

    const matchFilters = {};

    // Build filters
    if (facultyId)
      matchFilters['student.faculty'] =
        mongoose.Types.ObjectId.createFromHexString(facultyId);
    if (departmentId)
      matchFilters['student.department'] =
        mongoose.Types.ObjectId.createFromHexString(departmentId);
    if (level) matchFilters['student.level'] = parseInt(level);

    console.log(matchFilters);

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

// for dashboard trends
exports.getWeeklyAttendance = async (req, res) => {
  try {
    const { schoolId } = req.user;

    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    // compute the date range (past 7 days)
    const today = dayjs().endOf('day');
    const lastWeek = dayjs().subtract(5, 'day').startOf('day');

    // Fetch attendance records from the last 7 days
    const records = await Attendance.find({
      createdAt: { $gte: lastWeek, $lte: today },
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    }).select('createdAt status');

    // Days structure for 1 week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const weekData = days.map((day) => ({
      day,
      total: 0,
      present: 0,
      rate: 0,
    }));

    // compute attendance with status or present
    const data = records.forEach((record) => {
      // get the day each attendance record was taken
      const dayIndex = dayjs(record.createdAt).day();
      // increase the total of that day
      weekData[dayIndex].total += 1;

      // count how many were present on that day
      if (record.status === 'Present') weekData[dayIndex].present += 1;
    });

    // Calculate rate for each day
    weekData.forEach((day) => {
      if (day.total > 0) {
        day.rate = ((day.present / day.total) * 100).toFixed(2);
      }
    });
    // starts from Monday instead of Sunday
    const ordered = [...weekData.slice(1), weekData[0]];

    res.json({ trend: ordered });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// for dashboard trends
exports.getFacultyAttendanceStats = async (req, res) => {
  try {
    const { schoolId } = req.user;

    // get the current academic year and semester for the school
    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    // compute the date range (past 7 days)
    const today = dayjs().endOf('day');
    const lastWeek = dayjs().subtract(5, 'day').startOf('day');

    // get all attendance records for the current academic year and semester
    const attendances = await Attendance.find({
      createdAt: { $gte: lastWeek, $lte: today },
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    }).populate({
      path: 'student',
      select: 'faculty',
      populate: { path: 'faculty', select: 'name' },
    });

    // group attendance records by faculty
    const facultyStats = {};

    // get all faculties in the school first (Reason - if no session has been held, attendance cant be tracked)
    const faculties = await Faculty.find({ schoolId }).select('name');

    // store all faculties with zero stats
    faculties.forEach((fac) => {
      facultyStats[fac.name] = { total: 0, present: 0 };
    });

    // loop through attendance to update only existing faculties
    attendances.forEach((record) => {
      const faculty = record.student?.faculty?.name;
      if (facultyStats[faculty]) {
        facultyStats[faculty].total++;
        if (record.status === 'Present') facultyStats[faculty].present++;
      }
    });

    // calculate the rate
    const result = faculties.map((fac) => {
      const { total, present } = facultyStats[fac.name];
      const rate = total > 0 ? (present / total) * 100 : 0;
      return { faculty: fac.name, rate: Math.round(rate) };
    });

    return res.status(200).json({ trend:result });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
