const mongoose = require('mongoose');

const { Schema } = mongoose;

const studentEnrollment = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });

studentEnrollment.index({ student: 1, course: 1 }, { unique: true });

mongoose.model('StudentEnrollment', studentEnrollment); // two arguments means we are trying to create a collection
