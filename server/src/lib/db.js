const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (error) {
    console.log(`MongoDB connection error : ${error}`);
  }
};
