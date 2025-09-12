const mongoose = require('mongoose');

const Faculty = mongoose.model('Faculty');
const Department = mongoose.model('Department');
const Course = mongoose.model('Course');

exports.getFaculties = async (req, res) => {
  try {
    const schoolID = req.user.schoolID; // get school ID from logged-in user

    if (!schoolID) {
      return res
        .status(400)
        .json({ error: 'School ID not found in user data' });
    }

    const faculties = await Faculty.find({ schoolID }).lean(); // get faculties within a school
    if (!faculties.length) {
      return res
        .status(404)
        .json({ message: 'No faculties found for this school' });
    }

    res.status(200).json(faculties);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// get faculty by ID + its departments
exports.getFacultyByID = async (req, res) => {
  try {
    const facultyId = req.params.id;

    // Fetch faculty
    const faculty = await Faculty.findById(facultyId)
      .select('-userID')
      .populate('schoolID', 'schoolName')
      .lean();
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    // Fetch departments that belong to this faculty
    const departments = await Department.find({ faculty: facultyId }).select(
      '_id name'
    );

    res.status(200).json({
      ...faculty,
      departments,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createFaculty = async (req, res) => {
  try {
    const { name: facultyName } = req.body;
    const { schoolID, id: userID } = req.user;

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

// in deleting a faculty, you delete the departments and courses tied to it
exports.deleteFaculty = async (req, res) => {
  try {
    const { facultyID } = req.params;
    const { schoolID } = req.user;
    if (!facultyID) {
      return res.status(400).json({ error: 'Faculty ID is required' });
    }

    // Verify faculty exists in the user's school
    const faculty = await Faculty.findOne({ _id: facultyID, schoolID });
    if (!faculty) {
      return res
        .status(404)
        .json({ error: 'Faculty not found or not in your school' });
    }

    // Find all departments under this faculty
    const departments = await Department.find({ faculty: facultyID }).select(
      '_id'
    );
    const departmentIDs = departments.map((dep) => dep._id);

    // Delete all courses linked to these departments
    await Course.deleteMany({ department: { $in: departmentIDs } });

    // Delete all departments under this faculty
    await Department.deleteMany({ faculty: facultyID });

    // Delete the faculty itself and capture the result
    const deletedFaculty = await Faculty.findByIdAndDelete(facultyID);

    if (!deletedFaculty) {
      return res.status(404).json({ error: 'Failed to delete faculty' });
    }
    return res.status(200).json({
      message:
        'Faculty, its departments, and linked courses deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
