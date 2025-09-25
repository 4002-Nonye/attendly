const mongoose = require('mongoose');

const Session = mongoose.model('Session');
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
    const { id: courseID } = req.params;
    if (!courseID)
      return res
        .status(404)
        .json({ error: 'A course ID is required to end an ongoing session' });

    const closedSession = await Session.findOneAndUpdate(
      {
        course: courseID,
        status: 'active',
      },
      { status: 'ended' },
      { new: true }
    );
    if (!closedSession)
      return res
        .status(404)
        .json({ error: 'No active session found for this course' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
