const mongoose = require('mongoose');

const { Schema } = mongoose;

const schoolSchema = new Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    schoolName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    currentAcademicYear: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
    },
    currentSemester: {
      type: String,
      enum: ['First', 'Second'],
      default: 'First',
    },
  },
  { timestamps: true }
);

// Add a case-insensitive unique index for schoolName
// eg: 'University of Lagos' and 'university of lagos' are the same
schoolSchema.index(
  { schoolName: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

mongoose.model('School', schoolSchema); // two arguments means we are trying to create a collection
