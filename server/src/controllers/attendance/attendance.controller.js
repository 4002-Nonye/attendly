const mongoose = require('mongoose');
const Attendance = mongoose.model('Attendance');
const Session = mongoose.model('Session');

exports.markAttendance = async (req, res) => {
  // POST /api/courses/:courseId/sessions/:sessionId/attendance

  try {
    const { courseId, sessionId } = req.params;
    const { id: userId } = req.user;
    // Access token sent to frontend when session was created
    const { token } = req.body;

    // 1. check if class is still ongoing
    const activeSession = await Session.findById(sessionId);
    if (
      !activeSession ||
      activeSession.status !== 'active' ||
      Date.now() > activeSession.expiredAt
    )
      return res.status(400).json({ error: 'Class already ended' });

    // 3. check if token is valid
    if (activeSession.token !== token)
      return res.status(401).json({ error: 'Invalid token' });

    // 4. prevent duplicate attendance
    const existingAttendance = await Attendance.findOne({
      course: courseId,
      session: sessionId,
      student: userId,
    });
    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked' });
    }

    // 5. mark attendance
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
