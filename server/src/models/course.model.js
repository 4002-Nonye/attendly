const mongoose = require('mongoose');

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    courseCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    courseTitle: {
      type: String,
      trim: true,
      unique: true,
    },
    lecturers: [
      {
        type: mongoose.Schema.Types.ObjectId, // multiple lecturers
        ref: 'User',
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    semester: {
      type: String,
      enum: ['First', 'Second'],
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      required: true, // Example: "2024/2025"
    },
  },
  { timestamps: true }
);

// To create a collection of users (Table of users)
mongoose.model('Course', courseSchema); // two arguments means we are trying to create a collection
