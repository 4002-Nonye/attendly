const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  googleID: String,
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
});

// To create a collection of users (Table of users)
mongoose.model('User', userSchema); // two arguments means we are trying to create a collection
