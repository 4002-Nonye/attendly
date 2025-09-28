const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    lecturer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'ended'],
      default: 'active',
    },
    token: { type: String, required: true },
    expiredAt: { type: Date },
  },
  { timestamps: true }
);

mongoose.model('Session',sessionSchema)