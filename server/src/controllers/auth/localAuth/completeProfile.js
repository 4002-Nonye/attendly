const mongoose = require('mongoose');
const setAuthCookie = require('../../../utils/setAuthCookie');
const User = mongoose.model('User');
const School = mongoose.model('School');

require('dotenv').config();


// complete user profile if sign up with google
exports.completeProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { role, schoolInput, faculty, department, matricNo, level } =
      req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    //  update role
    let updateData = { role };
    if (role === 'student') {
      if (!faculty || !department || !matricNo || !level) {
        return res.status(400).json({
          error:
            'Student must have faculty, department, level and matric number',
        });
      }

      const existingMatricNo = await User.findOne({
        matricNo,
        schoolId: schoolInput,
        role: 'student',
      });
      if (existingMatricNo) {
        return res.status(400).json({ error: 'Matric number already in use' });
      }
      updateData = {
        ...updateData,
        faculty,
        level,
        department,
        matricNo,
        schoolId: schoolInput,
      };
    }

    if (role === 'lecturer') {
      if (!faculty || !department) {
        return res.status(400).json({
          error: 'Lecturer must have faculty and department',
        });
      }
      updateData = {
        ...updateData,
        faculty,
        department,
        schoolId: schoolInput,
      };
    }

    let schoolDoc;
    if (role === 'admin') {
      if (!schoolInput) {
        return res.status(400).json({ error: 'Admin must have school name' });
      }
      schoolDoc = await School.findOne({ schoolName: schoolInput }).collation({
        locale: 'en',
        strength: 2,
      });
      if (schoolDoc) {
        return res.status(409).json({ error: 'School name already exists' });
      }
      schoolDoc = await School.create({ schoolName: schoolInput, admin: null });

      updateData = { ...updateData, schoolId: schoolDoc._id };
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    //  cookie
    setAuthCookie(res, updatedUser);

    return res.status(200).json({
      message: 'Profile completed successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};