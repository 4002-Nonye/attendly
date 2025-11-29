const mongoose = require('mongoose');
const User = mongoose.model('User');
const School = mongoose.model('School');

// get only schools that have at least one faculty and the faculty has at least 1 department
exports.getSchools = async (req, res) => {
  try {
    const schools = await School.aggregate([
      {
        $lookup: {
          from: 'faculties',
          let: { schoolId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$schoolId', '$$schoolId'] },
              },
            },
            {
              $lookup: {
                from: 'departments',
                let: { facultyId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$faculty', '$$facultyId'] },
                    },
                  },
                  { $limit: 1 }, // Stop at first department found
                ],
                as: 'departments',
              },
            },
            {
              $match: {
                'departments.0': { $exists: true },
              },
            },
            { $limit: 1 }, // Stop at first valid faculty found
          ],
          as: 'validFaculties',
        },
      },
      {
        $match: {
          'validFaculties.0': { $exists: true },
        },
      },
      {
        $project: {
          _id: 1,
          schoolName: 1,
        },
      },
      {
        $sort: { schoolName: 1 },
      },
    ]);

    if (!schools.length) {
      return res.status(404).json({ error: 'No schools found' });
    }

    return res.status(200).json({ schools });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Admin: sets school-wide threshold
// Lecturer: sets own threshold

exports.setAttendanceThreshold = async (req, res) => {
  try {
    const { threshold } = req.body;
    const { id: userId, role, schoolId } = req.user;

    // validate threshold
    if (
      !threshold ||
      typeof threshold !== 'number' ||
      threshold < 50 ||
      threshold > 100
    ) {
      return res
        .status(400)
        .json({ error: 'Threshold must be a number between 50 and 100' });
    }

    if (role === 'admin') {
      // Admin sets school-wide threshold
      const school = await School.findByIdAndUpdate(
        schoolId,
        { attendanceThreshold: threshold },
        { new: true }
      );
      if (!school) {
        return res.status(404).json({ error: 'School not found' });
      }
      return res.json({
        message: 'School attendance threshold updated',
        threshold: school.attendanceThreshold,
      });
    } else if (role === 'lecturer') {
      // Lecturer sets personal threshold
      const lecturer = await User.findByIdAndUpdate(
        userId,
        { attendanceThreshold: threshold },
        { new: true }
      );
      if (!lecturer) {
        return res.status(404).json({ error: 'Lecturer not found' });
      }
      return res.json({
        message: 'Your attendance threshold updated',
        threshold: lecturer.attendanceThreshold,
      });
    
    }
  } catch (err) {
    console.error('Error setting attendance threshold:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
