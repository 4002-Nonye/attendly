const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Session = mongoose.model('Session');
const School = mongoose.model('School');

exports.getLecturerDashboardStats = async (req, res) => {
  try {
    const { id: lecturerId, schoolId } = req.user;

    // Get school info
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    if (!school || !school.currentAcademicYear) {
      return res.status(400).json({ error: 'No active academic year found' });
    }

    // Get courses assigned to a  lecturer
    const courses = await Course.find({
      schoolId,
      lecturers: lecturerId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .select('_id')
      .lean();

    const courseIds = courses.map((c) => c._id);

    //  Get all stats
    const [totalStudents, totalSessions, activeSessions] = await Promise.all([
      // Total students enrolled in lecturer's courses
      StudentEnrollment.distinct('student', {
        course: { $in: courseIds },
      }),

      // Total sessions
      Session.countDocuments({
        schoolId,
        course: { $in: courseIds },
        academicYear: school.currentAcademicYear,
        semester: school.currentSemester,
      }),

      // Active sessions by this lecturer
      Session.countDocuments({
        schoolId,
        startedBy: lecturerId, // Active sessions by the lecturer
        academicYear: school.currentAcademicYear,
        semester: school.currentSemester,
        status: 'active',
      }),
    ]);

    return res.status(200).json({
      totalCourses: courses.length,
      totalStudents: totalStudents.length,
      totalSessions,
      activeSessions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};