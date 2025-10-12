const mongoose = require('mongoose');
const { Schema } = mongoose;

const academicYear = new Schema(
  {
    year: { type: String, unique: true }, // e.g 2024/2025
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
    },
    isActive: { type: Boolean, default: false },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

mongoose.model('AcademicYear', academicYear);
