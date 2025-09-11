const mongoose = require('mongoose');

const { Schema } = mongoose;

const studentRegSchema = new Schema(
  {
    courseID: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', required: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model('StudentReg', studentRegSchema); // two arguments means we are trying to create a collection
