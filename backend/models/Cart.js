const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  tyre: {
    width: Number,
    profile: Number,
    rimSize: String,
    brand: String,
    model: String,
    image: String,
    price: Number,
     //  Quantity-based pricing 
  "Price for 1": { type: Number, default: null },
  "Price for 2": { type: Number, default: null },
  "Price for 3": { type: Number, default: null },
  "Price for 4": { type: Number, default: null },
  "Price for 5": { type: Number, default: null },
   
  },
  quantity: { type: Number, min: 1, max: 5 },
});

const cartSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  items: [cartItemSchema],
});

module.exports = mongoose.model('Cart', cartSchema);
