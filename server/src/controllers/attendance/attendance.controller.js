const mongoose = require('mongoose');
const Attendance = mongoose.model('Attendance');
const Session = mongoose.model('Session');

exports.markAttendance = async (req, res) => {
  // POST /api/courses/:courseId/sessions/:sessionId/attendance

  try {
    const { courseId, sessionId } = req.params;
    const { id: userId } = req.user;

    // 1. check if class is still ongoing
    const activeSession = await Session.findById(sessionId);
    if (!activeSession || activeSession.status !== 'active')
      return res.status(400).json({ error: 'Class already ended' });

    // 2. prevent duplicate attendance
    const existingAttendance = await Attendance.findOne({
      course: courseId,
      session: sessionId,
      student: userId,
    });
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked' });
    }

    // 3. mark attendance
    const markedAttendance = await new Attendance({
      course: courseId,
      session: sessionId,
      student: userId,
      status: 'Present',
    });
    markedAttendance.save();
    return res
      .status(201)
      .json({ message: 'Attendance taken', markedAttendance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
