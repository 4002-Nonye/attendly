const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    courseCode: { type: String, required: true, trim: true },
    courseTitle: { type: String, required: true, trim: true },
    unit: Number,
    academicYear: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear' },
    semester: {
      type: String,
      enum: ['First', 'Second'],
      default: 'First',
    },
    lecturers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    level: { type: Number, required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
   
  },
  { timestamps: true }
);

// Unique constraint within department + school + academicPeriod
courseSchema.index(
  { courseCode: 1, department: 1, schoolId: 1, academicPeriod: 1 },
  { unique: true }
);
courseSchema.index(
  { courseTitle: 1, department: 1, schoolId: 1, academicPeriod: 1 },
  { unique: true }
);

mongoose.model('Course', courseSchema);
