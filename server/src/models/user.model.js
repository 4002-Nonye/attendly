const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    role: { type: String, enum: ['student', 'admin', 'lecturer'] },

    attendanceThreshold: {
      type: Number,
      default: null,
      min: 50,
      max: 100,
    },

    googleId: { type: String, trim: true, sparse: true },
    matricNo: { type: String, trim: true, sparse: true, unique: true },

    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },

    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    level: Number,

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  // remove level if user is not a student
  if (this.role !== 'student') {
    this.level = undefined;
  }

  // remove attendanceThreshold for students & admins
  if (this.role !== 'lecturer') {
    this.attendanceThreshold = null;
  }
  next();
});

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
