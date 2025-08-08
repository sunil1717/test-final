const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/adminVerify');

const bookingController = require('../controllers/bookingController');

// User routes
router.post('/create', bookingController.createBooking);
router.get('/user', bookingController.getUserBookings);

// Admin routes
router.get('/all',verifyAdmin, bookingController.getAllBookings);
router.patch('/:id/status', verifyAdmin, bookingController.updateBookingStatus);

router.delete('/:id',verifyAdmin, bookingController.deleteBooking);

module.exports = router;
