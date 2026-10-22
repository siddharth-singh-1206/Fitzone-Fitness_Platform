const mongoose = require('mongoose');

/**
 * Plan model — membership plans with pricing, duration and feature list.
 */
const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    durationInDays: {
      type: Number,
      required: [true, 'Duration in days is required'],
    },
    features: {
      type: [String],
      default: [],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
