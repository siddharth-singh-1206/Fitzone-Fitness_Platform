const mongoose = require('mongoose');

/**
 * Facility model — gym amenities and spaces available to members.
 */
const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/600x400?text=Facility',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facility', facilitySchema);
