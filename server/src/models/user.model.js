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
      default: 'student',
      required: true,
    },
    googleID: {
      type: String,
      trim: true,
      sparse: true, // Allows multiple docs with null/undefined
    },
    matricNo: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
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
      type: String,
      
    },
    department: {
      type: String,
      
    },
  },
  { timestamps: true }
);

// To create a collection of users (Table of users)
mongoose.model('User', userSchema); // two arguments means we are trying to create a collection
