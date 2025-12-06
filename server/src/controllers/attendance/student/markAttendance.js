const mongoose = require('mongoose');
const Session = mongoose.model('Session');
const StudentEnrollment = mongoose.model('StudentEnrollment');
const Attendance = mongoose.model('Attendance');


exports.markAttendance = async (req, res) => {
  // SUPPORTS BOTH QR CODE SCANNING AND BUTTON MARKING
  try {
    const { sessionId } = req.params;
    const { id: userId } = req.user;
    const { token } = req.body || {};

    // 1. get the session and populate course
    const session = await Session.findById(sessionId).populate('course', '_id');
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // 2. check if class is ongoing
    if (session.status !== 'active')
      return res.status(400).json({ error: 'Class already ended' });

    // 3. validate QR token
    if (token && session.token !== token)
      return res.status(401).json({ error: 'Invalid token' });

    // 4. check enrollment
    const enrolled = await StudentEnrollment.findOne({
      student: userId,
      course: session.course._id,
    });
    if (!enrolled)
      return res.status(403).json({ error: 'Not enrolled in this course' });

    // 5. pevent duplicate attendance
    const existing = await Attendance.findOne({
      session: sessionId,
      course: session.course._id,
      student: userId,
    });
    if (existing)
      return res.status(400).json({ error: 'Attendance already marked' });

    // 6. mark attendance
    const attendance = await Attendance.create({
      session: sessionId,
      course: session.course,
      student: userId,
      status: 'Present',
      academicYear: session.academicYear,
      semester: session.semester,
    });

    return res
      .status(201)
      .json({ message: 'Attendance marked successfully', attendance });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};