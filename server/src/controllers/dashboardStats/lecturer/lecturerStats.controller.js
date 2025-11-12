const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Session = mongoose.model('Session');
const School = mongoose.model('School');

exports.getLecturerDashboardStats = async (req, res) => {
  try {
    const { id: lecturerId, schoolId } = req.user;

    // get school info
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    if (!school || !school.currentAcademicYear) {
      return res.status(400).json({ error: 'No active academic year found' });
    }

    // get courses assigned to a  lecturer
    const courses = await Course.find({
      schoolId,
      lecturers: lecturerId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
    })
      .select('_id')
      .lean();

    const courseIds = courses.map((c) => c._id);

    //  get all stats
    const [totalStudents, totalSessions, activeSessions] = await Promise.all([
      // total students enrolled in lecturer's courses
      StudentEnrollment.distinct('student', {
        course: { $in: courseIds },
        enrollmentStatus:"active"
      }),

      // total sessions
      Session.countDocuments({
        schoolId,
        course: { $in: courseIds },
        academicYear: school.currentAcademicYear,
        semester: school.currentSemester,
      }),

      // active sessions by this lecturer where still assigned
      Session.countDocuments({
        schoolId,
        startedBy: lecturerId,
        course: { $in: courseIds },
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
