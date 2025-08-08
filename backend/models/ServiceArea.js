const mongoose = require('mongoose');

const serviceAreaSchema = new mongoose.Schema({
  postcode: {
    type: String,
    required: true,
  },
  suburb: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

// Optionally create a compound index to avoid duplicate entries
serviceAreaSchema.index({ postcode: 1, suburb: 1 }, { unique: true });

module.exports = mongoose.model('ServiceArea', serviceAreaSchema);
