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
    // Destructure fields from the request body
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

    // 1. Validate inputs
    validateFields(role, req.body, res);

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    // 3. Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
      });
    }
    // Check for existing matric No in a school
    const existingMatricNo = await User.findOne({
      matricNo,
      schoolID: schoolInput,
      role: 'student',
    });

    if (existingMatricNo) {
      return res
        .status(400)
        .json({ error: 'Matric number already in use in this school' });
    }

    //Admins: send name as input - backend creates/finds the school.
    //Students && Lecturers: send _id as inputb- backend just validates the ID.

    // 4. Get or create school based on role
    let schoolDoc;
    if (role === 'admin') {
      const existingSchool = await School.findOne({ schoolInput });
      if (existingSchool) {
        return res
          .status(409)
          .json({ error: 'School name already exists, pick another' });
      }
      // School doesn't exist - create new school
      schoolDoc = await new School({
        schoolName: schoolInput,
        admin: null,
      }).save();
    } else {
      // If the user is not an admin
      // Student: school must exist (selected from dropdown)
      schoolDoc = await School.findById(schoolInput);
      if (!schoolDoc) {
        return res.status(404).json({ error: 'School not found' });
      }
    }

    // 5. Password hashing
    const hashedPassword = await hashPassword(password);

    // 6. Create new user
    const newUser = await new User({
      fullName,
      password: hashedPassword,
      email,
      role,
      department,
      faculty,
      level,
      matricNo, // only for students
      schoolID: schoolDoc._id, // Link the user to the school
    }).save();

    // 7. If the school has no admin, set this user as the creator if he is an admin
    if (role === 'admin' && !schoolDoc.admin) {
      schoolDoc.admin = newUser._id;
      await schoolDoc.save();
    }

    // 8. Set authentication cookie with JWT
    setAuthCookie(res, newUser);

    // 9. Sanitize user object before sending to client: Removes sensitive info like password
    const safeToSendUser = sanitizeUser(newUser._doc);

    return res.status(201).json({
      message: 'User successfully registered',
      user: safeToSendUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
};

// complete user profile if sign up with google
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role, schoolID, faculty, department, matricNo } = req.body;

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
      if (!schoolID) {
        return res.status(400).json({ error: 'Admin must have school ID' });
      }
      updateData = { ...updateData, schoolID };
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

      // if passwords do not match, send error ,msg
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
    const { email, googleID } = payload;

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
    existingUser.googleID = googleID;
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
