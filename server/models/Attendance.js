const mongoose = require('mongoose');

/**
 * Attendance model — logs daily member gym check-ins and activities.
 */
const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    activity: {
      type: String,
      enum: ['Gym Floor', 'Cardio Session', 'Yoga Class', 'Swimming Pool', 'CrossFit Workout'],
      default: 'Gym Floor',
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
