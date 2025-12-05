const mongoose = require('mongoose');

const AcademicYear = mongoose.model('AcademicYear');
const School = mongoose.model('School');
const User = mongoose.model('User');

exports.createNewAcademicYear = async (req, res) => {
  try {
    const { year } = req.body;
    const { schoolId } = req.user;

    // Validate input
    if (!year) {
      return res.status(400).json({ error: 'Year is required' });
    }

    const duplicateAcademicYear = await AcademicYear.findOne({
      year: year.trim(),
      school: schoolId,
    });
   ;
    if (duplicateAcademicYear) {
      return res.status(400).json({ error: 'Academic year already exists' });
    }
    // Check if school already has any academic year
    const existingAcademicYear = await AcademicYear.find({ school: schoolId });
    const isFirstAcademicYear = existingAcademicYear.length === 0;

    // just one academic year can be active at a time
    // Deactivate any active session
    await AcademicYear.updateMany({ school: schoolId }, { isActive: false });

    // create a new academic year and set it as active
    const newAcademicYear = await new AcademicYear({
      year: year.trim(),
      school: schoolId,
      isActive: true,
    });
    await newAcademicYear.save();

    // update the current academic year and semester of the school
    await School.findByIdAndUpdate(
      schoolId,
      {
        currentAcademicYear: newAcademicYear._id,
        currentSemester: 'First',
      },
      { new: true }
    ).populate('currentAcademicYear');

    // promote students to next level if it is not the first year being created
    if (!isFirstAcademicYear) {
      const students = await User.find({
        schoolId,
        role: 'student',
      }).populate('department');
      console.log(students)

      const updates = students.map(async (student) => {
        // Check if department exists
        if (!student.department) {
          return;
        }

        const maxLevel = student.department.maxLevel;

        if (student.level < maxLevel) {
          student.level += 100;
          await student.save();
        }
      });
      await Promise.all(updates);
    }

    return res.status(201).json({
      message: 'New academic year created successfully',
      academicYear: newAcademicYear,
      semester: 'First',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.switchSemester = async (req, res) => {
  try {
    const { semester } = req.body;
    const { schoolId } = req.user;

    // Validate semester
    if (!['First', 'Second'].includes(semester)) {
      return res.status(400).json({ error: 'Invalid semester value' });
    }

    // Check if academic year exists before switching
    const school = await School.findById(schoolId).populate(
      'currentAcademicYear'
    );

    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    if (!school.currentAcademicYear) {
      return res.status(400).json({
        error: 'No active academic year found. Create an academic year first.',
      });
    }

    // Update semester
    school.currentSemester = semester;
    await school.save();

    return res.status(200).json({
      message: 'Semester switched successfully',
      currentSemester: semester,
      academicYear: school.currentAcademicYear,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.closeAcademicYear = async (req, res) => {
  try {
    const { schoolId } = req.user;
    // find the active year for the school
    const activeYear = await AcademicYear.findOne({
      school: schoolId,
      isActive: true,
    });

    if (!activeYear) {
      return res.status(404).json({ error: 'No active academic year found' });
    }

    // mark the year as closed
    (activeYear.isActive = false), (activeYear.closedAt = new Date());
    await activeYear.save();

    // reset current academic year  and semester for the school
    await School.findByIdAndUpdate(schoolId, {
      currentAcademicYear: null,
      currentSemester: null,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
