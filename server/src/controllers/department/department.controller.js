const mongoose = require('mongoose');

const Department = mongoose.model('Department');
const Course = mongoose.model('Course');
const User = mongoose.model('User');
const School = mongoose.model('School');

exports.addDepartment = async (req, res) => {
  try {
    const { name, faculty: facultyId, maxLevel } = req.body;
    const { schoolId } = req.user;
    if (!name || !facultyId) {
      return res.status(400).json({ error: 'Name and Faculty are required' });
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


    // Check if department already exists in this faculty & school
    const existingDepartment = await Department.findOne({
      name,
      faculty: facultyId,
      schoolId,
    });

    if (existingDepartment) {
      return res.status(400).json({ error: 'Department already exists' });
    }

    const newDepartment = await new Department({
      name,
      faculty: facultyId,
      schoolId,
      maxLevel,
    });
    await newDepartment.save();
    return res.status(201).json({
      message: 'Department created successfully',
      department: newDepartment,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getDepartmentStats = async (req, res) => {
  try {
    const { schoolId } = req.user;
    const { name = '', page = 1, limit = 10, facultyId } = req.query;

    const matchFilter = {
      schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId),
    };

    // OPTIONAL FILTERING
    if (facultyId) {
      matchFilter.faculty =
        mongoose.Types.ObjectId.createFromHexString(facultyId);
    }
    if (name) {
      matchFilter.name = { $regex: name, $options: 'i' };
    }

    // PAGINATION
    const skip = (page - 1) * limit;

    const result = await Department.aggregate([
      //  1: Match departments based on filters
      { $match: matchFilter },

      //  2: Sort by creation date
      { $sort: { createdAt: -1 } },

      //  3: Use $facet for parallel processing of count and data
      {
        $facet: {
          // Get total count
          metadata: [{ $count: 'totalDepartments' }],

          // Get paginated data with stats
          data: [
            { $skip: skip },
            { $limit: Number(limit) },

            // Lookup faculty information
            {
              $lookup: {
                from: 'faculties',
                localField: 'faculty',
                foreignField: '_id',
                as: 'faculty',
              },
            },
            {
              $unwind: {
                path: '$faculty',
                preserveNullAndEmptyArrays: true,
              },
            },

            // Lookup and count students
            {
              $lookup: {
                from: 'users',
                let: { deptId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$department', '$$deptId'] },
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

            // Lookup and count lecturers
            {
              $lookup: {
                from: 'users',
                let: { deptId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$department', '$$deptId'] },
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

            // Lookup and count courses
            {
              $lookup: {
                from: 'courses',
                let: { deptId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: { $eq: ['$department', '$$deptId'] },
                    },
                  },
                  { $count: 'count' },
                ],
                as: 'courseCount',
              },
            },

            // Project final data
            {
              $project: {
                _id: 1,
                name: 1,
                code: 1,
                description: 1,
                schoolId: 1,
                maxLevel: 1,
                createdAt: 1,
                updatedAt: 1,
                faculty: {
                  _id: '$faculty._id',
                  name: '$faculty.name',
                },
                totalStudents: {
                  $ifNull: [{ $arrayElemAt: ['$studentCount.count', 0] }, 0],
                },
                totalLecturers: {
                  $ifNull: [{ $arrayElemAt: ['$lecturerCount.count', 0] }, 0],
                },
                totalCourses: {
                  $ifNull: [{ $arrayElemAt: ['$courseCount.count', 0] }, 0],
                },
              },
            },
          ],
        },
      },

      //  4:  reshape output
      {
        $project: {
          departmentStats: '$data',
          totalDepartments: {
            $ifNull: [{ $arrayElemAt: ['$metadata.totalDepartments', 0] }, 0],
          },
        },
      },
    ]);

    const response = result[0] || {
      departmentStats: [],
      totalDepartments: 0,
    };

    res.status(200).json({
      departmentStats: response.departmentStats,
      totalPages: Math.ceil(response.totalDepartments / limit),
      totalDepartments: response.totalDepartments,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editDepartment = async (req, res) => {
  // allow faculty update too
  try {
    const { id: departmentId } = req.params;
    const { name, faculty } = req.body;
    const { schoolId } = req.user;

    // check if the department name already exist before assigning new name
    const existingDepartment = await Department.findOne({
      name,
      faculty,
      schoolId,
    });
    if (
      existingDepartment &&
      existingDepartment._id.toString() !== departmentId
    ) {
      return res
        .status(409)
        .json({ error: 'Department name already exists in this faculty' });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      { name: name.trim(), faculty },
      { new: true }
    ).populate('faculty', 'name');

    if (!updatedDepartment) {
      return res.status(404).json({ error: 'Failed to update department' });
    }

    return res.status(200).json({
      message: 'Department updated successfully',
      department: updatedDepartment,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id: departmentId } = req.params;
    const { schoolId } = req.user;

    // Check if department exists
    const department = await Department.findOne({
      _id: departmentId,
      schoolId,
    });
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    //  Check if any users are associated with this department
    const usersCount = await User.countDocuments({ department: departmentId });
    if (usersCount > 0) {
      return res.status(400).json({
        error: `Cannot delete department. ${usersCount} user(s) are still associated with it.`,
      });
    }

    //  Delete all courses linked to this department
    const coursesDeleted = await Course.deleteMany({
      department: departmentId,
    });

    // Delete department
    await Department.findByIdAndDelete(departmentId);

    return res.status(200).json({
      message: 'Department deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getDepartmentsByFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    if (!facultyId) {
      return res.status(400).json({ error: 'Faculty ID is required' });
    }

    const departments = await Department.find({ faculty: facultyId })
      .select('name maxLevel id')
      .lean();

    if (!departments.length) {
      return res
        .status(404)
        .json({ error: 'No departments found for this faculty' });
    }

    return res.status(200).json({ departments });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
