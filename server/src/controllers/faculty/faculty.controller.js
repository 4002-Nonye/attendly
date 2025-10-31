const mongoose = require('mongoose');

const Faculty = mongoose.model('Faculty');
const Department = mongoose.model('Department');
const Course = mongoose.model('Course');


// FOR DROPDOWNS
exports.getFacultiesBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;

    if (!schoolId) {
      return res.status(400).json({ error: 'School ID is required' });
    }

    const faculties = await Faculty.find({ schoolId }).select('name id').lean();

    res.status(200).json({ faculties });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createFaculty = async (req, res) => {
  try {
    const {  facultyName } = req.body;
    const { schoolId, id: userId } = req.user;

    // ensure no empty fields
    if (!facultyName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // prevent duplicates within a school
    const existingFaculty = await Faculty.findOne({
      name: facultyName,
      schoolId,
    });

    if (existingFaculty) {
      return res.status(400).json({ error: 'Faculty already exists' });
    }

    // create and save new faculty
    const newFaculty = await new Faculty({
      name: facultyName,
      schoolId,
      userId,
    }).save();
    if (!newFaculty) {
      return res.status(404).json({ error: 'Failed to create faculty' });
    }
    return res
      .status(201)
      .json({ message: 'Faculty created successfully', faculty: newFaculty });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { facultyName } = req.body;
    const { schoolId } = req.user;

    if (!facultyId) {
      return res.status(400).json({ error: 'Faculty ID is required' });
    }

    if (!facultyName) {
      return res.status(400).json({ error: 'Faculty name is required' });
    }

    // Check if another faculty already uses this name within a school
    const existingFaculty = await Faculty.findOne({
      name: facultyName,
      schoolId,
    });
    if (existingFaculty && existingFaculty._id.toString() !== facultyId) {
      return res.status(409).json({ error: 'Faculty name already exists' });
    }

    // update faculty name
    const updatedData = await Faculty.findOneAndUpdate(
      { _id: facultyId, schoolId },
      { name: facultyName },
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).json({ error: 'Failed to update faculty' });
    }

    return res.status(200).json({
      message: 'Faculty updated successfully',
      faculty: updatedData,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// in deleting a faculty, you delete the departments and courses tied to it
exports.deleteFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { schoolId } = req.user;
    if (!facultyId) {
      return res.status(400).json({ error: 'Faculty ID is required' });
    }

    // Verify faculty exists in the user's school
    const faculty = await Faculty.findOne({ _id: facultyId, schoolId });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Find all departments under this faculty
    const departments = await Department.find({
      faculty: facultyId,
      schoolId,
    }).select('_id');
    const departmentIds = departments.map((dep) => dep._id);

    // Delete all courses linked to these departments
    await Course.deleteMany({ department: { $in: departmentIds } });

    // Delete all departments under this faculty
    await Department.deleteMany({ faculty: facultyId });

    // Delete the faculty itself and capture the result
    const deletedFaculty = await Faculty.findByIdAndDelete(facultyId);

    if (!deletedFaculty) {
      return res.status(404).json({ error: 'Failed to delete faculty' });
    }
    return res.status(200).json({
      message:
        'Faculty deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getFacultyStats = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { name } = req.query;

    const matchFilter = {
      schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId),
    };

    // Add search filter
    if (name) {
      matchFilter.name = { $regex: name, $options: 'i' };
    }

    const facultyStats = await Faculty.aggregate([
      // 1. Match faculties for this school (with optional search)
      { $match: matchFilter },

      // 2. Lookup and count departments
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: 'faculty',
          as: 'departments',
        },
      },

      // 3. Lookup and count courses
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: 'faculty',
          as: 'courses',
        },
      },

      // 4. Lookup and count students
      {
        $lookup: {
          from: 'users',
          let: { facultyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$faculty', '$$facultyId'] },
                    { $eq: ['$role', 'student'] },
                  ],
                },
              },
            },
          ],
          as: 'students',
        },
      },

      // 5. Lookup and count lecturers
      {
        $lookup: {
          from: 'users',
          let: { facultyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$faculty', '$$facultyId'] },
                    { $eq: ['$role', 'lecturer'] },
                  ],
                },
              },
            },
          ],
          as: 'lecturers',
        },
      },

      // 6. Add computed fields
      {
        $addFields: {
          totalDepartments: { $size: '$departments' },
          totalCourses: { $size: '$courses' },
          totalStudents: { $size: '$students' },
          totalLecturers: { $size: '$lecturers' },
        },
      },

      // 7. Project only needed fields
      {
        $project: {
          _id: 1,
          name: 1,
          code: 1,
          dean: 1,
          description: 1,
          totalDepartments: 1,
          totalCourses: 1,
          totalStudents: 1,
          totalLecturers: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },

      // 8. Sort by name
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      facultyStats,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

