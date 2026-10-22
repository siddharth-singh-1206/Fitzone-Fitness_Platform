const mongoose = require('mongoose');

/**
 * Trainer model — gym trainers with their specialization and bio.
 */
const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trainer name is required'],
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300x300?text=Trainer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);
