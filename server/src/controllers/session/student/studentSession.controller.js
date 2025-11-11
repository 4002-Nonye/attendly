const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');

const School = mongoose.model('School');



exports.getActiveSessionsForStudent = async (req, res) => {
  try {
    const { id, schoolId } = req.user;

    //  Get current academic year and semester for the student's school
    const school = await School.findById(schoolId).populate(
      'currentAcademicYear'
    );
    if (!school || !school.currentAcademicYear) {
      return res
        .status(400)
        .json({ error: 'No active academic year found for this school' });
    }

    //  Get all courses the student is enrolled in
    const enrollments = await StudentEnrollment.find({ student: id }).select(
      'course'
    );
    const courseIds = enrollments.map((enrollment) => enrollment.course);

    //  Find active sessions that match:
    //     - student's courses
    //     - current academic year
    //     - current semester
    //     - and session status = active
    const activeSessions = await Session.find({
      course: { $in: courseIds },
      academicYear: school.currentAcademicYear._id,
      semester: school.currentSemester,
      status: 'active',
    })
      .select('-token')
      .populate('course', 'courseTitle courseCode')
      .populate('startedBy', 'fullName');

    return res
      .status(200)
      .json({ session: activeSessions, total: activeSessions.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
