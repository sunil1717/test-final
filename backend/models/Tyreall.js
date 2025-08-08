const mongoose = require("mongoose");

const TyreSchema = new mongoose.Schema({
  Brand: { type: String },
  SIZE: { type: String },
  "LOAD/SPEED RATING": { type: String },
  Model: { type: String },
  Type: { type: String },
  Marking: { type: String, default: null },
  RunFlat: { type: String, default: null },

  //  Quantity-based pricing 
  "Price for 1": { type: Number, default: null },
  "Price for 2": { type: Number, default: null },
  "Price for 3": { type: Number, default: null },
  "Price for 4": { type: Number, default: null },
  "Price for 5": { type: Number, default: null },

  // Keep existing field for backward compatibility
  "Price Incl GST": { type: Number },

  "In Stock": { type: String },
  "UNLOADING IN 24 HRS": { type: Number },
  image_url: { type: String }
});

// Bind to existing "tyre_stock" collection
module.exports = mongoose.model("Tyreall", TyreSchema, "tyre_stock");
