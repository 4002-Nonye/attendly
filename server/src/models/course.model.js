const mongoose = require('mongoose');

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    courseCode: {
      type: String,
      required: true,
      trim: true,
      
    },

    courseTitle: {
      type: String,
      trim: true,
      
    },
    lecturers: [
      {
        type: mongoose.Schema.Types.ObjectId, // multiple lecturers
        ref: 'User',
      },
    ],
    faculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    
    semester: {
      type: String,
      enum: ['First', 'Second'],
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
    schoolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
    },
  },
  { timestamps: true }
);

// courseCode must be unique within a department + school
courseSchema.index({ courseCode: 1, department: 1, schoolID: 1 }, { unique: true });

// courseTitle must be unique within a department + school
courseSchema.index({ courseTitle: 1, department: 1, schoolID: 1 }, { unique: true });


mongoose.model('Course', courseSchema); // two arguments means we are trying to create a collection
