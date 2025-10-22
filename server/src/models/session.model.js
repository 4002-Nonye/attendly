const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },

    startedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    endedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'ended'],
      default: 'active',
    },
    academicYear: {
      type: mongoose.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    semester: {
      type: String,
      enum: ['First', 'Second'],
    },
    token: String,
  },
  { timestamps: true }
);



sessionSchema.index({ schoolId: 1, course: 1, academicYear: 1, semester: 1, status: 1 });

mongoose.model('Session', sessionSchema);
