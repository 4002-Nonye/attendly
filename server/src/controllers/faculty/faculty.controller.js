const mongoose = require('mongoose');

const Faculty = mongoose.model('Faculty');
const Department = mongoose.model('Department');
const Course = mongoose.model('Course');
const User = mongoose.model('User');
const School = mongoose.model('School');

// FOR SIGNUP DROPDOWNS - only faculties that have departments
exports.getFacultiesBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;

    if (!schoolId) {
      return res.status(400).json({ error: 'School ID is required' });
    }

    // Get faculty IDs that have departments
    const facultyIds = await Department.distinct('faculty', { schoolId });

    const faculties = await Faculty.find({
      schoolId,
      _id: { $in: facultyIds },
    })
      .select('name id')
      .lean();

    return res.status(200).json({ faculties });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// FOR ADMIN DROPDOWNS - All faculties
exports.getAllFacultiesBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;

    if (!schoolId) {
      return res.status(400).json({ error: 'School ID is required' });
    }

    const faculties = await Faculty.find({ schoolId }).select('name id').lean();

    return res.status(200).json({ faculties });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createFaculty = async (req, res) => {
  try {
    const { facultyName } = req.body;
    const { schoolId, id: userId } = req.user;

    // ensure no empty fields
    if (!facultyName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // get school for academic year and semester
    const school = await School.findById(schoolId).populate(
      'currentAcademicYear'
    );
    if (!school.currentAcademicYear) {
      return res
        .status(400)
        .json({ error: 'No active academic year found for this school' });
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
    console.log(error);
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

    // check if faculty exists in the user's school
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

    // Check if there are any users in this faculty
    const usersInFaculty = await User.countDocuments({
      faculty: facultyId,
      schoolId,
    });

    if (usersInFaculty > 0) {
      return res.status(400).json({
        error: `Cannot delete faculty. ${usersInFaculty} user(s) are still associated with it.`,
      });
    }

    // Check if there are any users in facultys under this faculty
    const usersInDepartments = await User.countDocuments({
      department: { $in: departmentIds },
      schoolId,
    });

    if (usersInDepartments > 0) {
      return res.status(400).json({
        error: `Cannot delete faculty. ${usersInDepartments} user(s) are still associated with it.`,
      });
    }

    // Delete all courses linked to these departments
    await Course.deleteMany({ department: { $in: departmentIds } });

    // Delete all departments under this faculty
    await Department.deleteMany({ faculty: facultyId });

    // Delete the faculty itself
    const deletedFaculty = await Faculty.findByIdAndDelete(facultyId);

    if (!deletedFaculty) {
      return res.status(404).json({ error: 'Failed to delete faculty' });
    }

    return res.status(200).json({
      message: 'Faculty deleted successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getFacultyStats = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { name } = req.query;

    // Find the user's school and ensure it has an active academic year
    const school = await School.findById(schoolId);
    if (!school || !school.currentAcademicYear) {
      return res.status(400).json({ error: 'No active academic year found' });
    }

    const currentSemesterId = school.currentSemester;
    const currentAcademicYearId = school.currentAcademicYear;

    // Build base match filter
    const matchFilter = {
      schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId),
    };

    // Optional name filter
    if (name) {
      matchFilter.name = { $regex: name, $options: 'i' };
    }

    // Aggregation
    const facultyStats = await Faculty.aggregate([
      // Match faculties
      { $match: matchFilter },

      // Count departments
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
            { $count: 'count' },
          ],
          as: 'departmentCount',
        },
      },

      //  Count courses of current semester and year
      {
        $lookup: {
          from: 'courses',
          let: {
            facultyId: '$_id',
            semesterId: currentSemesterId,
            academicYearId: currentAcademicYearId,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$faculty', '$$facultyId'] },
                    { $eq: ['$semester', '$$semesterId'] },
                    { $eq: ['$academicYear', '$$academicYearId'] },
                  ],
                },
              },
            },
            { $count: 'count' },
          ],
          as: 'courseCount',
        },
      },

      // Count students
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
            { $count: 'count' },
          ],
          as: 'studentCount',
        },
      },

      // Count lecturers
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
            { $count: 'count' },
          ],
          as: 'lecturerCount',
        },
      },

      // Project computed stats
      {
        $project: {
          _id: 1,
          name: 1,
          code: 1,
          dean: 1,
          description: 1,
          totalDepartments: {
            $ifNull: [{ $arrayElemAt: ['$departmentCount.count', 0] }, 0],
          },
          totalCourses: {
            $ifNull: [{ $arrayElemAt: ['$courseCount.count', 0] }, 0],
          },
          totalStudents: {
            $ifNull: [{ $arrayElemAt: ['$studentCount.count', 0] }, 0],
          },
          totalLecturers: {
            $ifNull: [{ $arrayElemAt: ['$lecturerCount.count', 0] }, 0],
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },

      // Sort by newest first
      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      facultyStats,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
