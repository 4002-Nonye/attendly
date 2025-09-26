const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Attendance = mongoose.model('Attendance');
exports.createSession = async (req, res) => {
  try {
    const { id: courseID } = req.params;
    const { id: lecturerID } = req.user;

    if (!courseID)
      return res
        .status(404)
        .json({ error: 'A course ID is required to start a session' });

    // Prevent duplicate active session for same course
    const existingSession = await Session.findOne({
      course: courseID,
      status: 'active',
    });

    if (existingSession) {
      return res.status(400).json({
        error: 'There is already an active session for this course',
      });
    }
    const session = await new Session({
      course: courseID,
      lecturer: lecturerID,
      date: new Date(),
      status: 'active',
    }).save();
    res.status(201).json({ message: 'Session started', session });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
exports.endSession = async (req, res) => {
  try {
    const { id: courseId } = req.params;
    const { sessionId } = req.body;
    //  Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(sessionId)
    ) {
      return res.status(400).json({ message: 'Invalid courseId or sessionId' });
    }

    // MARK STUDENTS THAT DIDNT MARK THE ATTENDANCE AS ABSENT

    // 1. get all students enrolled in the course
    const enrolledStudents = await StudentEnrollment.find({
      course: courseId,
    }).select('student');

    // 2. get students that marked attendance
    const markedAttendance = await Attendance.find({
      session: sessionId,
    }).select('student');

    // 3. Get enrolled & marked students
    const enrolledIds = enrolledStudents.map((e) => e.student.toString()); // array of strings
    const markedIds = markedAttendance.map((e) => e.student.toString()); //array of strings

    // 4. filter the absent students from enrolled students
    const absentStudentsId = enrolledIds.filter(
      (id) => !markedIds.includes(id)
    );

    // 5. if there are absent students, mark as 'absent' in attendance
    if (absentStudentsId.length) {
      await Attendance.insertMany(
        absentStudentsId.map((studentId) => ({
          student: studentId,
          session: sessionId,
          course: courseId,
          status: 'Absent',
        }))
      );
    }

    // CLOSE THE SESSION
    const closedSession = await Session.findOneAndUpdate(
      {
        _id: sessionId,
        course: courseId,
        status: 'active',
      },
      { status: 'ended' }
    );
    if (!closedSession)
      return res
        .status(404)
        .json({ error: 'No active session found for this course' });

    return res.status(200).json({ message: 'Session ended successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
