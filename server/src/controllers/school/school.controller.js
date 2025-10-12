const mongoose = require('mongoose');

const School = mongoose.model('School');
exports.getSchools = async (req, res) => {
  try {
    const schools = await School.find().select('schoolName id').lean();

    if (!schools.length) {
      return res.status(404).json({ error: 'No schools found' });
    }

    return res.status(200).json({ schools });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
