const crypto = require('crypto');
const QRCode = require('qrcode');
const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Attendance = mongoose.model('Attendance');
const Course = mongoose.model('Course');
const School = mongoose.model('School');

exports.createSession = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { id: lecturerId, schoolId } = req.user;

    if (!courseId)
      return res
        .status(404)
        .json({ error: 'A course ID is required to start a session' });

    // check if the lecturer is assigned to a course before he can start a session
    const isAssigned = await Course.findOne({
      _id: courseId,
      lecturers: lecturerId,
    });

    if (!isAssigned)
      return res
        .status(403)
        .json({ error: 'Lecturer not assigned to this course' });

    // Prevent duplicate active session for same course
    const existingSession = await Session.findOne({
      course: courseId,
      status: 'active',
    });

    if (existingSession) {
      return res.status(400).json({
        error: 'There is already an active session for this course',
      });
    }

    // Generate random token for a session
    const sessionToken = crypto.randomBytes(8).toString('hex');

    const session = await new Session({
      course: courseId,
      startedBy: lecturerId,
      date: new Date(),
      status: 'active',
      token: sessionToken,
      academicYear: isAssigned.academicYear,
      semester: isAssigned.semester,
      schoolId,
    }).save();

    // Build QR data for frontend
    const qrData = `${process.env.CLIENT_URL}/attendance?sessionId=${session._id}&token=${sessionToken}`;

    // Generate QR code as base64 string  <img src="" />
    const qrCode = await QRCode.toDataURL(qrData);

    res.status(201).json({ message: 'Session started', session, qrCode });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { id: userId } = req.user;

    //  Validate IDs
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({ error: 'Invalid sessionId' });
    }

    // 1. Find the session
    const session = await Session.findById(sessionId);

    if (!session || session.status !== 'active') {
      return res.status(404).json({ error: 'No active session found' });
    }

    // 2. access course id to find students enrolled in the course and lecturers assigned to the course
    const courseId = session.course;

    // 3. make sure only lecturers assigned to a course can end it
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const isLecturerAssigned = course.lecturers.some(
      (lecId) => lecId.toString() === userId.toString()
    );

    if (!isLecturerAssigned) {
      return res
        .status(403)
        .json({ error: 'You are not assigned to this course' });
    }

    // MARK STUDENTS THAT DIDNT MARK THE ATTENDANCE AS ABSENT

    // 4. get all students enrolled in the course
    const enrolledStudents = await StudentEnrollment.find({
      course: courseId,
    }).select('student');

    // 5. get students that marked attendance
    const markedAttendance = await Attendance.find({
      session: sessionId,
    }).select('student');

    // 6. Get enrolled & marked students
    const enrolledIds = enrolledStudents.map((e) => e.student.toString()); // array of strings
    const markedIds = markedAttendance.map((e) => e.student.toString()); //array of strings

    // 7. filter the absent students from enrolled students
    const absentStudentsId = enrolledIds.filter(
      (id) => !markedIds.includes(id)
    );

    // 8. if there are absent students, mark as 'absent' in attendance
    if (absentStudentsId.length) {
      await Attendance.insertMany(
        absentStudentsId.map((studentId) => ({
          student: studentId,
          session: sessionId,
          course: courseId,
          status: 'Absent',
          academicYear: session.academicYear,
        }))
      );
    }

    // CLOSE THE SESSION
    session.status = 'ended';
    session.endedBy = userId;
    await session.save();

    return res.status(200).json({ message: 'Session ended successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

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

    return res.status(200).json({ session: activeSessions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getActiveSessionsForLecturer = async (req, res) => {
  try {
    const { id, schoolId } = req.user;

    //  Get the lecturer’s school and its current academic year + semester
    const school = await School.findById(schoolId).populate(
      'currentAcademicYear'
    );
    if (!school || !school.currentAcademicYear) {
      return res
        .status(400)
        .json({ error: 'No active academic year found for this school' });
    }

    //  Find all courses this lecturer is assigned to
    const courses = await Course.find({ lecturers: id }).select('_id');
    const courseIds = courses.map((c) => c._id);

    //  Find active sessions for those courses under the current academic year and semester
    const sessions = await Session.find({
      course: { $in: courseIds },
      academicYear: school.currentAcademicYear._id,
      semester: school.currentSemester,
      status: 'active',
    })
      .populate('course', 'courseCode courseTitle')
      .populate('startedBy', 'fullName');

    return res.status(200).json({ session: sessions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getRecentSessions = async (req, res) => {
  try {
    const { schoolId } = req.user;

    const school = await School.findById(schoolId).select(
      'currentAcademicYear currentSemester'
    );
    //  Get recent sessions
    const sessions = await Session.find({
      schoolId,
      academicYear: school.currentAcademicYear,
      semester: school.currentSemester,
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
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
