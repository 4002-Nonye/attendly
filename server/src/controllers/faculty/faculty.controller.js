const mongoose = require('mongoose');

const Faculty = mongoose.model('Faculty');
const Department = mongoose.model('Department');
const Course = mongoose.model('Course');
const User = mongoose.model('User');

// FOR DROPDOWNS
exports.getFacultiesAndDepartmentsBySchool = async (req, res) => {
  try {
    const { id: schoolID } = req.params;

    if (!schoolID) {
      return res
        .status(400)
        .json({ error: 'School ID not found in user data' });
    }

    const faculties = await Faculty.find({ schoolID }).select('name id').lean(); // get faculties within a school
    const departments = await Department.find({ schoolID })
      .select('name id')
      .lean();
    if (!faculties.length) {
      return res
        .status(404)
        .json({ message: 'No faculties found for this school' });
    }
    if (!departments.length) {
      return res
        .status(404)
        .json({ message: 'No departments found for this school' });
    }

    res.status(200).json({ faculties, departments });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
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
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Find all departments under this faculty
    const departments = await Department.find({
      faculty: facultyID,
      schoolID,
    }).select('_id');
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

exports.getFacultyStats = async (req, res) => {
  try {
    const { schoolID } = req.user;

    // 1. Fetch all faculties
    const faculties = await Faculty.find({ schoolID }).lean();

    const facultyStats = await Promise.all(
      faculties.map(async (faculty) => {
        // 2. Go through each faculty and calculate total
        //  Promise.all for parallel execution
        const [totalDepartments, totalCourses, totalStudents, totalLecturers] =
          await Promise.all([
            // check how many departments exist in each faculty
            Department.countDocuments({ faculty: faculty._id }),
            // check how many courses are existent in each faculty
            Course.countDocuments({ faculty: faculty._id }),
            // check how many students are in the faculty
            User.countDocuments({ faculty: faculty._id, role: 'student' }),
            // check how many lecturers exist in the faculty
            User.countDocuments({ faculty: faculty._id, role: 'lecturer' }),
          ]);

        // send back faculties and totals
        return {
          ...faculty,
          totalDepartments,
          totalCourses,
          totalStudents,
          totalLecturers,
        };
      })
    );

    res.status(200).json({ facultyStats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
