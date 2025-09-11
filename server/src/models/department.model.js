const mongoose = require('mongoose');

const { Schema } = mongoose;

const departmentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  faculty: { type: Schema.Types.ObjectId, ref: 'Faculty', required: true }, 
}, { timestamps: true });

const Department = mongoose.model('Department', departmentSchema);
