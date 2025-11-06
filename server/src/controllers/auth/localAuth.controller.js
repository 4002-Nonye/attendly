const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const setAuthCookie = require('../../utils/setAuthCookie');
const sanitizeUser = require('../../utils/sanitizeUser');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../lib/sendEmail');
require('dotenv').config();
const crypto = require('crypto');
const passwordResetHtml = require('../../utils/emailTemplates/resetPasswordTemplate');
const confirmAccountLinkHtml = require('../../utils/emailTemplates/confirmAccountLink');
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
      schoolDoc = await School.findOne({ schoolName: schoolInput }).collation({
        locale: 'en',
        strength: 2,
      });
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
          return res
            .status(400)
            .json({ error: 'Matric number already in use' });
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
      hasPassword: !!password,
      matricNo: matricNo,
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
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// complete user profile if sign up with google
exports.completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role, schoolInput, faculty, department, matricNo, level } =
      req.body;

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    // Always update role
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

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    // refresh cookie
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
          error: 'This account uses Google Sign-In. Please log in with Google.',
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
  const { token } = req.body;
  try {
    // retrieve the user stored from the token and decode it
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { email, googleId } = payload;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    if (existingUser.googleId) {
      return res.status(409).json({ error: 'Account already linked' });
    }
    // add google ID to link account that initially signed in with email and password
    existingUser.googleId = googleId;
    await existingUser.save();

    // send email -successfully linked
    await sendEmail(
      email,
      'A new sign-in method was added to your account',
      confirmAccountLinkHtml(existingUser.fullName)
    );

    setAuthCookie(res, existingUser);
    return res
      .status(200)
      .json({ message: 'Account linked successfully', user: existingUser });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const existingUser = await User.findOne({ email }).select('+password');
    if (!existingUser) {
      // Return generic success message to avoid revealing whether email exists
      return res
        .status(200)
        .json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Check if user signed up with Google only
    if (!existingUser.password) {
      return res.status(400).json({
        error: 'This account uses Google Sign-In. Please log in with Google.',
      });
    }

    // Generate token and save to DB
    const token = crypto.randomBytes(32).toString('hex');
    existingUser.resetPasswordToken = token;
    existingUser.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await existingUser.save();

    // Create reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${email}`;

    // Send reset email
    await sendEmail(
      email,
      'Reset Your Attendly Password',
      passwordResetHtml(resetLink, existingUser.fullName)
    );

    return res.status(200).json({
      message: 'Reset link sent to your email.',
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res
      .status(500)
      .json({ error: 'Something went wrong. Please try again later.' });
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
  try {
    const { id } = req.user;
    const user = await User.findById(id)
      .select('email role fullName password level schoolId')
      .populate({
        path: 'schoolId',
        select: 'schoolName currentAcademicYear currentSemester',
        populate: {
          path: 'currentAcademicYear',
          select: 'year',
        },
      });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const hasPassword = !!user.password;
    const safeToSendUser = sanitizeUser(user._doc);

    return res.status(200).json({ user: { ...safeToSendUser, hasPassword } });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id)
      .select('email role fullName faculty department schoolId level')
      .populate('faculty', 'name')
      .populate('department', 'name')
      .populate('schoolId', 'schoolName');

    if (!user) return res.status(404).json({ error: 'User not found' });
    const hasPassword = !!user.password;
    const safeToSendUser = sanitizeUser(user._doc);
    return res.status(200).json({
      user: { ...safeToSendUser, hasPassword },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
