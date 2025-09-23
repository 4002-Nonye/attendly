const mongoose = require('mongoose');

const { Schema } = mongoose;

const studentCourseSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });

studentCourseSchema.index({ student: 1, course: 1 }, { unique: true });

mongoose.model('StudentReg', studentCourseSchema); // two arguments means we are trying to create a collection
