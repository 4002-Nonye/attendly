const mongoose = require('mongoose');

const Department = mongoose.model('Department');
const Course = mongoose.model('Course');
const User = mongoose.model('User');

exports.addDepartment = async (req, res) => {
  try {
    const { name, faculty: facultyId } = req.body;
    const { schoolId } = req.user;
    if (!name || !facultyId) {
      return res.status(400).json({ message: 'Name and Faculty are required' });
    }

    // Check if department already exists in this faculty & school
    const existingDepartment = await Department.findOne({
      name,
      faculty: facultyId,
      schoolId,
    });

    if (existingDepartment) {
      return res.status(400).json({ message: 'Department already exists' });
    }

    const newDepartment = await new Department({
      name,
      faculty: facultyId,
      schoolId,
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
    const { searchQuery = '', page = 1, limit = 10, facultyId } = req.query;

    const filter = { schoolId }; // Base filter

    // OPTIONAL FILTERING
    if (facultyId) filter.faculty = facultyId; // Filter by faculy id (dropdown)
    if (searchQuery) {
      // search by department
      filter.name = { $regex: searchQuery, $options: 'i' };
    }

    // PAGINATION
    const skip = (page - 1) * limit;
    // Count total documents for pagination info
    const totalDepartments = await Department.countDocuments(filter);

    // 1. Fetch all departments for a given school, and populate name of faculty they belong to
    const departments = await Department.find(filter)
      .populate('faculty', 'name')
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // 2. For each department, calculate totals
    //    Promise.all for parallel execution
    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        // total students in each department
        const totalStudents = await User.countDocuments({
          department: dept._id,
          role: 'student',
        });
        // total lecturers in each department
        const totalLecturers = await User.countDocuments({
          department: dept._id,
          role: 'lecturer',
        });
        // total courses in each department
        const totalCourses = await Course.countDocuments({
          department: dept._id,
        });

        // store the department and totals
        return {
          ...dept,
          totalDepartments,
          totalStudents,
          totalLecturers,
          totalCourses,
        };
      })
    );

    res.status(200).json({
      departmentStats,
      totalPages: Math.ceil(totalDepartments / limit),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editDepartment = async (req, res) => {
  // allow faculty update too
  try {
    const { id: departmentId } = req.params;
    const { name, facultyId } = req.body;
    const { schoolId } = req.user;

    // check if the department name already exist before assigning new name
    const existingDepartment = await Department.findOne({
      name,
      faculty: facultyId,
      schoolId,
    });
    if (
      existingDepartment &&
      existingDepartment._id.toString() !== departmentId
    ) {
      return res
        .status(409)
        .json({ message: 'Department name already exists in this faculty' });
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentId,
      { name: name.trim(), faculty: facultyId },
      { new: true }
    ).populate('faculty', 'name');

    if (!updatedDepartment) {
      return res.status(404).json({ message: 'Failed to update department' });
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
    const department = await Department.findOne(departmentId, schoolId);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Delete all courses linked to this department
    await Course.deleteMany({ department: departmentId });

    // Delete department
    await Department.findByIdAndDelete(departmentId);

    return res.status(200).json({
      message: 'Department and its courses deleted successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
