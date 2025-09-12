const mongoose = require('mongoose');

const Faculty = mongoose.model('Faculty');

exports.createFaculty = async (req, res) => {
  try {
    const { name: facultyName } = req.body;
    const { schoolID, id:userID } = req.user;

    // ensure no empty fields
    if (!facultyName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // prevent duplicates within a school
    const existingFaculty = await Faculty.findOne({
      name: facultyName,
      schoolID,
    });

    if (existingFaculty) {
      return res.status(400).json({ error: 'Faculty already exists' });
    }

    // create and save new faculty
    const newFaculty = await new Faculty({
      name: facultyName,
      schoolID,
      userID,
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
    const { facultyID } = req.params;
    const { facultyName } = req.body;
    const { schoolID } = req.user;

    if (!facultyID) {
      return res.status(400).json({ error: 'Faculty ID is required' });
    }

    if (!facultyName) {
      return res.status(400).json({ error: 'Faculty name is required' });
    }

    // Check if another faculty already uses this name within a school
    const existingFaculty = await Faculty.findOne({
      name: facultyName,
      schoolID,
    });
    if (existingFaculty && existingFaculty._id.toString() !== facultyID) {
      return res.status(409).json({ error: 'Faculty name already exists' });
    }

    // update faculty name
    const updatedData = await Faculty.findOneAndUpdate(
      { _id: facultyID, schoolID }, // restrict to admin's school
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
   
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const { facultyID } = req.params;
    const { schoolID } = req.user;
    if (!facultyID) {
      return res.status(400).json({ error: 'Faculty ID is required' });
    }

    // delete faculty in a school
    const deletedFaculty = await Faculty.findOneAndDelete({
      _id: facultyID,
      schoolID,
    });
    if (!deletedFaculty) {
      return res.status(404).json({ error: 'Failed to delete faculty' });
    }
    return res.status(200).json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addDepartment = async (req, res) => {};

exports.editDepartment = async (req, res) => {};

exports.deleteDepartment = async (req, res) => {};
