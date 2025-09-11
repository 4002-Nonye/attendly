const mongoose = require('mongoose');

const Faculty = mongoose.model('Faculty');

exports.createFaculty = async (req, res) => {
  try {
    const facultyName = req.body.name.trim().toLowerCase();

    // ensure no empty fields
    if (!facultyName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // prevent duplicates
    const existingFaculty = await Faculty.findOne({ name: facultyName })

    if (existingFaculty) {
      return res.status(400).json({ error: 'Faculty already exists' });
    }

    // create and save new faculty
    const newFaculty = await new Faculty({
      name: facultyName,
      schoolID:req.user.schoolID
    }).save();

    return res
      .status(201)
      .json({ message: 'Faculty created successfully', newFaculty });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editFaculty = async (req, res) => {};

exports.deleteFaculty = async (req, res) => {};

exports.addDepartment = async (req, res) => {};

exports.editDepartment = async (req, res) => {};

exports.deleteDepartment = async (req, res) => {};
