const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'lecturer'],
    },
    googleId: {
      type: String,
      trim: true,
      sparse: true, // Allows multiple docs with null/undefined
    },
    matricNo: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: false, // Set to false to allow Google sign-in users without password
      select: false,
    },
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
    },
    level: {
      type: String,
      enum: ['100', '200', '300', '400', '500'],
    },
    session: {
      type: String,
      required: true, // Example: "2024/2025"
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// if user is a student, enforce uniqueness in matric number within a school
userSchema.index(
  { schoolId: 1, matricNo: 1 },
  {
    unique: true,
    partialFilterExpression: { role: 'student', matricNo: { $type: 'string' } },
  }
);

// To create a collection of users (Table of users)
mongoose.model('User', userSchema); // two arguments means we are trying to create a collection
