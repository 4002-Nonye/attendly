const mongoose = require('mongoose');

const Department = mongoose.model('Department');

exports.addDepartment = async (req, res) => {
  try {
    const { name, faculty: facultyID } = req.body;
    const { schoolID } = req.user;
    if (!name || !facultyID) {
      return res.status(400).json({ error: 'Name and Faculty are required' });
    }

    // Check if department already exists in this faculty & school
    const existingDepartment = await Department.findOne({
      name,
      faculty: facultyID,
      schoolID,
    });

    if (existingDepartment) {
      return res.status(400).json({ error: 'Department already exists' });
    }

    const newDepartment = await new Department({
      name,
      faculty: facultyID,
      schoolID,
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

exports.getDepartments = async (req, res) => {
  try {
    const { schoolID } = req.user;

    // get all departments in a school
    const departments = await Department.find({
      schoolID,
    })
      .populate('faculty', 'name')
      .lean();

    if (!departments.length) {
      return res
        .status(404)
        .json({ message: 'No departments found for this school' });
    }

    return res.status(200).json({ departments });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getDepartmentByID = async (req, res) => {
  try {
    const { id: departmentID } = req.params;

    const department = await Department.findById(departmentID).populate(
      'faculty',
      'name'
    );
    if (!department)
      return res.status(404).json({ error: 'Department not found' });

    res.status(200).json({
      department,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.editDepartment = async (req, res) => {

    // allow faculty update too
  try {
    const { id: departmentID } = req.params;
    const { name, facultyID } = req.body;

    // check if the department name already exist before assigning new name
    const existingDepartment = await Department.findOne({
      name,
      faculty: facultyID,
    });
    if (
      existingDepartment &&
      existingDepartment._id.toString() !== departmentID
    ) {
      return res
        .status(409)
        .json({ error: 'Department name already exists in this faculty' });
    }



    const updatedDepartment = await Department.findByIdAndUpdate(
      departmentID,
      { name: name.trim(),faculty:facultyID },
      { new: true }
    ).populate('faculty','name');


    if (!updatedDepartment) {
      return res.status(404).json({ error: 'Failed to update department' });
    }

    return res.status(200).json({
      message: 'Department updated successfully',
      department: updatedDepartment
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id: departmentID } = req.params;

    // Check if department exists
    const department = await Department.findById(departmentID);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // Delete department
    await Department.findByIdAndDelete(departmentID);

    return res.status(200).json({
      message: 'Department deleted successfully',
      departmentID,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
