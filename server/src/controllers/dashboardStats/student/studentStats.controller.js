const mongoose = require('mongoose');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Session = mongoose.model('Session');
const School = mongoose.model('School');
const Attendance = mongoose.model('Attendance');
const Course = mongoose.model('Course');

exports.getStudentDashboardStats = async (req, res) => {
  try {
    const { id: studentId, schoolId } = req.user;

    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    const enrollments = await StudentEnrollment.find({
      student: studentId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .select('course')
      .lean();

    const courseIds = enrollments.map((e) => e.course);

    // Get all stats
    const [totalSessions, attendedSessions, activeSessions] = await Promise.all(
      [
        Session.countDocuments({
          schoolId,
          course: { $in: courseIds },
          academicYear: school.currentAcademicYear,
          semester: school.currentSemester,
        }),
        Attendance.countDocuments({
          student: studentId,
          course: { $in: courseIds },
          academicYear: school.currentAcademicYear,
          semester: school.currentSemester,
          status: 'Present',
        }),

        Session.countDocuments({
          schoolId,
          course: { $in: courseIds },
          academicYear: school.currentAcademicYear,
          semester: school.currentSemester,
          status: 'active',
        }),
      ]
    );

    return res.status(200).json({
      totalCourses: enrollments.length,
      totalSessions,
      attendedSessions,
      activeSessions,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};


