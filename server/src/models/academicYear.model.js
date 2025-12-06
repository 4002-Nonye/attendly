const mongoose = require('mongoose');
const { Schema } = mongoose;

const academicYear = new Schema(
  {
    year: { type: String },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
    },
    isActive: { type: Boolean, default: false },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// compound unique index, same year can exist for different schools
academicYear.index({ year: 1, school: 1 }, { unique: true });

mongoose.model('AcademicYear', academicYear);