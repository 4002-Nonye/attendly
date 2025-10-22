const mongoose = require('mongoose');

const { Schema } = mongoose;

const studentEnrollment = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    academicYear: {
      type: mongoose.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    semester: {
      type: String,
      enum: ['First', 'Second'],
    },
    school:{ type: Schema.Types.ObjectId, ref: 'School', required: true },
  },
  { timestamps: true }
);

studentEnrollment.index({ student: 1, course: 1 ,academicYear: 1, semester: 1}, { unique: true });


mongoose.model('StudentEnrollment', studentEnrollment); // two arguments means we are trying to create a collection
