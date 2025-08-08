// models/Booking.js
const mongoose = require('mongoose');

const tyreSchema = new mongoose.Schema({
  width: Number,
  profile: Number,
  rimSize: String,
  brand: String,
  model: String,
  image: String,
  price: Number
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  phone: String,
  tyre: tyreSchema, //  Embedded tyre data
  quantity: { type: Number, default: 1 },
  date: { type: String, default: () => new Date().toLocaleDateString('en-GB') },
  time: { type: String, default: () => new Date().toLocaleTimeString('en-GB') },
  address: String,
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['CashOnDelivery', 'Stripe'],
    default: 'CashOnDelivery'
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
