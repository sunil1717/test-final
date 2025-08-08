const Booking = require('../models/Booking');

// ✅ Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { user, phone, tyre, quantity, address, paymentMethod } = req.body;

    if (!user || !phone || !tyre || !quantity || !address) {
      return res.status(400).json({ error: 'Missing booking fields' });
    }

    const booking = new Booking({
      user,
      phone,
      tyre, // ✅ tyre is an object: { brand, model, width, profile, ... }
      quantity,
      address,
      paymentMethod: paymentMethod || 'CashOnDelivery'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};


// ✅ Get bookings by user phone
exports.getUserBookings = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number required' });
    }

    const bookings = await Booking.find({ phone });

    res.status(200).json(bookings.reverse()); // returns full booking object including status & paymentMethod
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};


// ✅ Get all bookings (Admin)

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();

    res.status(200).json(bookings.reverse());
  } catch (err) {
    console.error('Admin fetch bookings failed:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};


// ✅ Update booking status (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: 'Status updated successfully', booking });
  } catch (err) {
    console.error('Status update failed:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};


// ✅ Delete booking (Admin)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully', bookingId: booking._id });
  } catch (err) {
    console.error('Delete booking failed:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
};

