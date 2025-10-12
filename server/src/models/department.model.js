const mongoose = require('mongoose');

const { Schema } = mongoose;

const departmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', required: true },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    },
    maxLevel: { type: Number, default: 400 }, // duration of a course
  },
  { timestamps: true }
);

mongoose.model('Department', departmentSchema);
