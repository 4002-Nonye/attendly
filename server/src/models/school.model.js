const mongoose = require('mongoose');

const { Schema } = mongoose;

const schoolSchema = new Schema(
  {
    schoolName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    }
  },
  { timestamps: true }
);


mongoose.model('School', schoolSchema); // two arguments means we are trying to create a collection
