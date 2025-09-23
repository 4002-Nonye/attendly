const mongoose = require('mongoose');

const { Schema } = mongoose;

const facultySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      
    },
    schoolID: {
      type: Schema.Types.ObjectId,
      ref: 'School',
      required: true,
    }
  },
  { timestamps: true }
);



facultySchema.index({ name: 1, schoolID: 1 }, { unique: true });

mongoose.model('Faculty', facultySchema); // two arguments means we are trying to create a collection
