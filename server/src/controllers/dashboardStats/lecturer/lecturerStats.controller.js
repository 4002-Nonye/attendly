const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Session = mongoose.model('Session');
const School = mongoose.model('School');

exports.getStudentsTotal = async (req, res) => {
  try {
    const { id: lecturerId, schoolId } = req.user;

    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    const courses = await Course.find({
      lecturers: lecturerId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    }).select('_id');

    const courseIds = courses.map((course) => course._id);

    // avoid duplication ---- e.g a student is enrolled in 3 courses taught by the lecturer, count him as 1
    const students = await StudentEnrollment.distinct('student', {
      course: { $in: courseIds },
    });

    return res.status(200).json({
      total: students.length,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTotalCoursesLecturer = async (req, res) => {
  try {
    const { id: lecturerId, schoolId } = req.user;

    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    const total = await Course.countDocuments({
      lecturers: lecturerId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    });

    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTotalSessions = async (req, res) => {
  try {
    const { id: lecturerId, schoolId } = req.user;
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    const total = await Session.countDocuments({
      startedBy: lecturerId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    });
    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.avgAttendance = async (req, res) => {};
