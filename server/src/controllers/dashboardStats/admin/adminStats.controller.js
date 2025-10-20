const mongoose = require('mongoose');
const User = mongoose.model('User');
const School = mongoose.model('School');
const Course = mongoose.model('Course');
const Department = mongoose.model('Department');
const Faculty = mongoose.model('Faculty');
const dayjs = require('dayjs');
const Attendance = mongoose.model('Attendance');


exports.getAllUsers = async (req, res) => {
  try {
    const { id, schoolId } = req.user;
    const {
      role,
      searchQuery = '',
      startDate,
      endDate,
      dateOption = 'latest', // earliest | latest | custom
      faculty,
      department,
      level,
      page = 1,
      limit = 10,
    } = req.query;

    // Base filter
    const filter = {
      _id: { $ne: id }, // exclude current user
      schoolId, // get only users for the school
    };

    // optional filter
    if (role) filter.role = role;
    if (level) filter.level = level;
    if (faculty) filter.faculty = faculty;
    if (department) filter.department = department;
    if (searchQuery) {
      // Search by fullName, email, or matricNo (case-insensitive)
      filter.$or = [
        { fullName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { matricNo: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // sorting
    let sortOption = { createdAt: -1 }; // default - latest

    if (dateOption === 'earliest') {
      sortOption = { createdAt: 1 };
    } else if (dateOption === 'custom' && (startDate || endDate)) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate).toISOString();
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999); // end of the day in UTC
        filter.createdAt.$lte = end.toISOString();
      }
    }

    const users = await User.find(filter)
      .populate('faculty', 'name')
      .populate('department', 'name')
      .populate('schoolId', 'schoolName')
      .sort(sortOption)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    // return total count for pagination
    const total = await User.countDocuments(filter);
    const pages = Math.ceil(total / limit);
    return res.status(200).json({ users, total, pages });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// get total faculties in a school
exports.getTotalFaculties = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const total = await Faculty.countDocuments({
      schoolId,
    });
    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTotalDepartments = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const total = await Department.countDocuments({
      schoolId,
    });
    return res.status(200).json({ total });
  } catch (error) {
   
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// admin
exports.getStudentsTotal = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const total = await User.countDocuments({
      schoolId,
      role: 'student',
    });
    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getLecturerTotal = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const total = await User.countDocuments({
      schoolId,
      role: 'lecturer',
    });
    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getTotalCoursesAdmin = async (req, res) => {
  try {
    const { schoolId } = req.user;

    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );

    const total = await Course.countDocuments({
      schoolId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    });

    return res.status(200).json({ total });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal servor error' });
  }
};

// for dashboard trends
exports.getSchoolAttendanceTrend = async (req, res) => {
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
    console.log(error)
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
