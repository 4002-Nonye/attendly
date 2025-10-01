const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const setAuthCookie = require('../../utils/setAuthCookie');
const sanitizeUser = require('../../utils/sanitizeUser');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../lib/sendEmail');
require('dotenv').config();
const crypto = require('crypto');
const html = require('../../utils/emailTemplates/resetPasswordTemplate');
const validateFields = require('../../utils/validateSignup');
const hashPassword = require('../../utils/hashPassword');

const User = mongoose.model('User');
const School = mongoose.model('School');
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

    // 1. Validate required fields
    validateFields(role, req.body, res);

    // 2. Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // 3. Check if email already exists
    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'User already exists' });
    }

    let schoolDoc;

    // 4. Admin creates a new school if school does not exist
    if (role === 'admin') {
      schoolDoc = await School.findOne({ schoolName: schoolInput });
      if (schoolDoc) {
        return res.status(409).json({ error: 'School name already exists' });
      }
      schoolDoc = await School.create({ schoolName: schoolInput, admin: null });
    } else {
      // 5. Student/Lecturer must provide valid school ID
      if (!mongoose.Types.ObjectId.isValid(schoolInput)) {
        return res.status(400).json({ error: 'Invalid school ID' });
      }
      schoolDoc = await School.findById(schoolInput);
      if (!schoolDoc) {
        return res.status(404).json({ error: 'School not found' });
      }

      // 6. Check matric number for students
      if (role === 'student') {
        const existingMatricNo = await User.findOne({
          matricNo,
          schoolId: schoolDoc._id,
          role: 'student',
        });
        if (existingMatricNo) {
          return res.status(400).json({ error: 'Matric number already in use' });
        }
      }
    }

    // 7. Hash password
    const hashedPassword = await hashPassword(password);

    // 8. Create new user
    const newUser = await User.create({
      fullName,
      password: hashedPassword,
      email,
      role,
      department,
      faculty,
      level,
      matricNo:  matricNo,
      schoolId: schoolDoc._id,
    });

    // 9. Set admin for new school if needed
    if (role === 'admin' && !schoolDoc.admin) {
      schoolDoc.admin = newUser._id;
      await schoolDoc.save();
    }

    // 10. Set auth cookie
    setAuthCookie(res, newUser);

    // 11. Sanitize user object
    const safeToSendUser = sanitizeUser(newUser._doc);

    return res.status(201).json({
      message: 'User successfully registered',
      user: safeToSendUser,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// complete user profile if sign up with google
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role, schoolId, faculty, department, matricNo } = req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    // Always update role
    let updateData = { role };
    if (role === 'student') {
      if (!faculty || !department || !matricNo) {
        return res.status(400).json({
          error: 'Student must have faculty, department, and matric number',
        });
      }
      updateData = { ...updateData, faculty, department, matricNo };
    }

    if (role === 'lecturer') {
      if (!faculty || !department) {
        return res.status(400).json({
          error: 'Lecturer must have faculty and department',
        });
      }
      updateData = { ...updateData, faculty, department };
    }

    if (role === 'admin') {
      if (!schoolId) {
        return res.status(400).json({ error: 'Admin must have school ID' });
      }
      updateData = { ...updateData, schoolId };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    return res.status(200).json({
      message: 'Profile completed successfully',
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  //Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const existingUser = await User.findOne({ email }).select('+password');
    // If there is no existing user, do not log in
    if (!existingUser) {
      return res
        .status(401)
        .json({ error: 'User does not exist! Create an account to continue' });
    }

    if (existingUser) {
      if (!existingUser.password) {
        return res.status(401).json({
          error:
            'This account was created using Google. Please sign in with Google instead.',
        });
      }
      // compare password to allow login if there is a user
      const comparePassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      // if passwords do not match
      if (!comparePassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      setAuthCookie(res, existingUser);

      // Destructure the user object to remove sensitive or unnecessary fields before sending to the client
      const safeToSendUser = sanitizeUser(existingUser._doc);

      return res.status(200).json({
        message: 'User successfully logged in',
        user: safeToSendUser,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logout = async (_, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return res.status(200).json({ message: 'Logged out successful' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.linkAccount = async (req, res) => {
  const { token, password } = req.body;
  if (!password) {
    return res.status(404).json({ error: 'Password is required' });
  }

  try {
    // retrieve the user stored from the token and decode it
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { email, googleId } = payload;

    const existingUser = await User.findOne({ email }).select('+password');
    if (!existingUser) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    const comparePassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!comparePassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // add google ID to link account that initially signed in with email and password
    existingUser.googleId = googleId;
    await existingUser.save();

    setAuthCookie(res, existingUser);
    return res.status(200).json({ message: 'Account linked successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ error: 'User does not exist' });
    }

    // if there is a user trying to reset password, go ahead and generate a token

    const token = crypto.randomBytes(32).toString('hex');

    //save token to db
    existingUser.resetPasswordToken = token;
    existingUser.resetPasswordExpires = new Date(Date.now() + 3600000); // token expires in 1hr
    await existingUser.save();

    // Send email with token
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${email}`;

    try {
      await sendEmail(email, 'Password Reset', html(resetLink));
      return res
        .status(200)
        .json({ message: 'Reset link sent to your email.' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to send reset email' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  try {
    // fetch the user if the token is still valid
    const existingUser = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');
    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const hashedPassword = await hashPassword(newPassword);
    existingUser.password = hashedPassword; //reset password
    existingUser.resetPasswordToken = undefined; // clear token
    existingUser.resetPasswordExpires = undefined;
    await existingUser.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUser = async (req, res) => {
  res.status(200).json({ user: req.user });
};
