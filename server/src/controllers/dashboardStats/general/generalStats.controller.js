const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Attendance = mongoose.model('Attendance');
const School = mongoose.model('School');

// admin and lecturer
exports.getRecentSessions = async (req, res) => {
  try {
    const { schoolId, id: lecturerId, role } = req.user;

    let filter = {};
    if (role === 'lecturer') filter.startedBy = lecturerId;

    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    ).lean();
    //  Get recent sessions
    const sessions = await Session.find({
      schoolId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
      ...filter
    })
      .select('course status startedBy createdAt')
      .populate('course', 'courseCode courseTitle')
      .populate('startedBy', 'fullName')
      .sort({ createdAt: -1 }) // get latest
      .limit(5);

 

    //  Construct session summaries
    const sessionSummaries = await Promise.all(
      sessions.map(async (session) => {
        const attendanceCount = await Attendance.countDocuments({
          session: session._id,
          status: 'Present',
        });

        const enrolledCount = await StudentEnrollment.countDocuments({
          course: session.course._id,
        });

        return {
          id: session._id,
          course: session.course.courseTitle,
          courseCode: session.course.courseCode,
          lecturer: session.startedBy.fullName,
          date: session.createdAt.toISOString().split('T')[0],
          time: new Date(session.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          status: session.status,
          attended: attendanceCount,
          enrolled: enrolledCount,
        };
      })
    );

    return res.status(200).json({ sessions: sessionSummaries });
  } catch (error) {
  
    return res.status(500).json({ error: 'Internal server error' });
  }
};
