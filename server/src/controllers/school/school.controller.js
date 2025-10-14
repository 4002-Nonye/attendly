const mongoose = require('mongoose');

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