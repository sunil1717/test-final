// models/Tyre.js
const mongoose = require('mongoose');

const tyreSchema = new mongoose.Schema({
  width: { type: Number, required: true },
  profile: { type: Number, required: true },
  rimSize: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, required: true }, // ✅ single price field
  image: { type: String, required: true },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Tyre', tyreSchema);
