const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    course: { type: mongoose.Types.ObjectId, ref: 'Course', required: true },
    session: { type: mongoose.Types.ObjectId, ref: 'Session', required: true },
    student: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    academicYear: {
      type: mongoose.Types.ObjectId,
      ref: 'AcademicYear',
      required: true,
    },
    semester: {
      type: String,
      enum: ['First', 'Second'],
    },
    status: {
      type: String,
      enum: ['Present', 'Absent', 'Excused'], // TODO: implement logic for an excused student
      required: true,
      default: 'Absent',
    },
  },
  { timestamps: true }
);

mongoose.model('Attendance', attendanceSchema);
