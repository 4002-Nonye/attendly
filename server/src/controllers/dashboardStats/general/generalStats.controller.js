const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Attendance = mongoose.model('Attendance');
const School = mongoose.model('School');
const Course = mongoose.model('Course');

// admin and lecturer
exports.getRecentSessions = async (req, res) => {
  try {
    const { schoolId, role, id: userId } = req.user;

    // get current academic year + semester
    const school = await School.findById(schoolId)
      .select('currentAcademicYear currentSemester')
      .lean();

    if (!school || !school.currentAcademicYear) {
      return res.status(404).json({
        error: 'No current academic period found for this school',
      });
    }

    let courseFilter = {};

    //  if user is a lecturer, find only their assigned courses
    if (role === 'lecturer') {
      const lecturerCourses = await Course.find({ lecturers: userId }).select(
        '_id'
      );
      const courseIds = lecturerCourses.map((c) => c._id);
      courseFilter = { course: { $in: courseIds } };
    }

    //  get sessions
    const sessions = await Session.find({
      schoolId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
      ...courseFilter, // get only sessions of courses the lecturer is assigned to
    })
      .select('course status startedBy endedBy createdAt')
      .populate('course', 'courseCode courseTitle')
      .populate('startedBy', 'fullName')
      .populate('endedBy', 'fullName')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    if (!sessions.length) {
      return res.status(200).json({ sessions: [] });
    }

    //  build summaries
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
          startedBy: session.startedBy.fullName,
          endedBy: session.endedBy?.fullName || '',
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
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
