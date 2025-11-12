const mongoose = require('mongoose');
const User = mongoose.model('User');
const School = mongoose.model('School');
const Course = mongoose.model('Course');
const Department = mongoose.model('Department');
const Faculty = mongoose.model('Faculty');
const dayjs = require('dayjs');
const Attendance = mongoose.model('Attendance');

// for dashboard trends
exports.getSchoolAttendanceTrend = async (req, res) => {
  try {
    const { schoolId } = req.user;

    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    // compute the date range (past 7 days)
    const today = dayjs().endOf('day');
    const lastWeek = dayjs().subtract(6, 'day').startOf('day');

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
    records.forEach((record) => {
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
        day.rate = Number((day.present / day.total) * 100).toFixed(1);
      }
    });
    // starts from Monday instead of Sunday
    const ordered = [...weekData.slice(1), weekData[0]];

    return res.json({ trend: ordered });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// for dashboard trends
exports.getFacultyAttendanceTrend = async (req, res) => {
  try {
    const { schoolId } = req.user;

    // get the current academic year and semester for the school
    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    // compute the date range (past 7 days)
    const today = dayjs().endOf('day');
    const lastWeek = dayjs().subtract(6, 'day').startOf('day');

    // get all attendance records for the current academic year and semester for last 7 days
    const attendances = await Attendance.find({
      createdAt: { $gte: lastWeek, $lte: today },
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    }).populate({
      path: 'student',
      select: 'faculty',
      populate: { path: 'faculty', select: 'name' },
    });

    // get all faculties in the school
    const faculties = await Faculty.find({ schoolId }).select('name');

    // Days structure for 1 week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const facultyWeekData = {};

    // build data structure
    faculties.forEach((fac) => {
      facultyWeekData[fac.name] = {};
      days.forEach((day) => {
        facultyWeekData[fac.name][day] = { total: 0, present: 0 };
      });
    });

    // bui;d attendance records
    attendances.forEach((record) => {
      const faculty = record.student?.faculty?.name;
      if (facultyWeekData[faculty]) {
        const dayIndex = dayjs(record.createdAt).day();
        const dayName = days[dayIndex];

        facultyWeekData[faculty][dayName].total++;
        if (record.status === 'Present') {
          facultyWeekData[faculty][dayName].present++;
        }
      }
    });

    // rearrange days to start from monday
    const orderedWeekDays = [...days.slice(1), days[0]];
    const chartData = orderedWeekDays.map((day) => {
      const dayObject = { day };

      faculties.forEach((fac) => {
        const { total, present } = facultyWeekData[fac.name][day];
        dayObject[fac.name] =
          total > 0 ? Number(((present / total) * 100).toFixed(1)) : 0;
      });

      return dayObject;
    });

    return res.status(200).json({ trend: chartData });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// for admin dashboard stat cards
exports.getAdminDashboardStats = async (req, res) => {
  try {
    const { schoolId } = req.user;

    // Get school info
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    //  Get all stats
    const [
      totalFaculties,
      totalDepartments,
      totalCourses,
      totalLecturers,
      totalStudents,
    ] = await Promise.all([
      Faculty.countDocuments({ schoolId }),

      Department.countDocuments({ schoolId }),

      Course.countDocuments({
        schoolId,
        academicYear: school.currentAcademicYear,
        semester: school.currentSemester,
      }),

      User.countDocuments({
        schoolId,
        role: 'lecturer',
      }),

      User.countDocuments({
        schoolId,
        role: 'student',
      }),
    ]);

    return res.status(200).json({
      totalFaculties,
      totalDepartments,
      totalCourses,
      totalLecturers,
      totalStudents,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
