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
    const school = await School.findById(schoolId)
      .select('currentAcademicYear')
      .populate('currentAcademicYear');
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
  
    // Find the user's school and ensure it has an active academic year
    const school = await School.findById(schoolId)
    if (!school || !school.currentAcademicYear) {
      return res.status(400).json({ error: 'No active academic year found' });
    }

    const currentSemesterId = school.currentSemester;
    const currentAcademicYearId = school.currentAcademicYear;

    // Build filters
    const matchFilter = {
      schoolId: mongoose.Types.ObjectId.createFromHexString(schoolId),
    };

    if (facultyId) {
      matchFilter.faculty =
        mongoose.Types.ObjectId.createFromHexString(facultyId);
    }
    if (name) {
      matchFilter.name = { $regex: name, $options: 'i' };
    }

    //  Pagination
    const skip = (page - 1) * limit;

    // Aggregation pipeline
    const result = await Department.aggregate([
      { $match: matchFilter },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [{ $count: 'totalDepartments' }],
          data: [
            { $skip: skip },
            { $limit: Number(limit) },

            // Faculty lookup
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

            // Student count
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

            // Lecturer count
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

            //  Course count filtered by current semester and year
            {
              $lookup: {
                from: 'courses',
                let: {
                  deptId: '$_id',
                  semesterId: currentSemesterId,
                  academicYearId: currentAcademicYearId,
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ['$department', '$$deptId'] },
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

            // Project final shape
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
    console.error('Error fetching department stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editDepartment = async (req, res) => {
  //dont  allow faculty update
  try {
    const { id: departmentId } = req.params;
    const { name, faculty, maxLevel } = req.body;
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
      { name: name.trim(), maxLevel },
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
