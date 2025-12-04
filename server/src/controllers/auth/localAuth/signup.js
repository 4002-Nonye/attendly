
const mongoose = require('mongoose');
const setAuthCookie = require('../../../utils/setAuthCookie');
const sanitizeUser = require('../../../utils/sanitizeUser');
const validateFields = require('../../../utils/validateSignup');
const hashPassword = require('../../../utils/hashPassword');
const User = mongoose.model('User');
const School = mongoose.model('School');

require('dotenv').config();


exports.signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      matricNo,
      schoolInput,
      department,
      faculty,
      level,
    } = req.body;

    // 1. validation
    validateFields(role, req.body, res);

    // 2. validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // 3. check if email already exists
    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'User already exists' });
    }

    let schoolDoc;

    // 4. Admin creates a new school if school does not exist
    if (role === 'admin') {
      schoolDoc = await School.findOne({ schoolName: schoolInput }).collation({
        locale: 'en',
        strength: 2,
      });
      if (schoolDoc) {
        return res.status(409).json({ error: 'School name already exists' });
      }
      schoolDoc = await School.create({ schoolName: schoolInput, admin: null });
    } else {
      // 5. Student/Lecturer must select valid school ID
      if (!mongoose.Types.ObjectId.isValid(schoolInput)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      schoolDoc = await School.findById(schoolInput);
      if (!schoolDoc) {
        return res.status(404).json({ error: 'School not found' });
      }

      // 6.  matric number check for students
      if (role === 'student') {
        const existingMatricNo = await User.findOne({
          matricNo,
          schoolId: schoolDoc._id,
          role: 'student',
        });
        if (existingMatricNo) {
          return res
            .status(400)
            .json({ error: 'Matric number already in use' });
        }
      }
    }

    // 7. hash password
    const hashedPassword = await hashPassword(password);

    // 8. create new user
    const newUser = await User.create({
      fullName,
      password: hashedPassword,
      email,
      role,
      department,
      faculty,
      level,
      hasPassword: !!password,
      matricNo: matricNo,
      schoolId: schoolDoc._id,
    });

    // 9. set admin for new school if none
    if (role === 'admin' && !schoolDoc.admin) {
      schoolDoc.admin = newUser._id;
      await schoolDoc.save();
    }

    // 10. set auth cookie
    setAuthCookie(res, newUser);

    // 11. sanitize user object
    const safeToSendUser = sanitizeUser(newUser._doc);

    return res.status(201).json({
      message: 'User successfully registered',
      user: safeToSendUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};