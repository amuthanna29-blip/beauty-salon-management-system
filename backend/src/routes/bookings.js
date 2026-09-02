const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

// Get all bookings
router.get('/', auth, bookingController.getAllBookings);

// Get booking by ID
router.get('/:id', auth, bookingController.getBooking);

// Create booking
router.post(
  '/',
  auth,
  bookingController.createBooking
);

// Update booking
router.put(
  '/:id',
  auth,
  authorize('admin', 'manager', 'staff'),
  bookingController.updateBooking
);

// Cancel booking
router.delete(
  '/:id',
  auth,
  bookingController.cancelBooking
);

// Confirm booking
router.post(
  '/:id/confirm',
  auth,
  authorize('admin', 'manager', 'staff'),
  bookingController.confirmBooking
);

// Complete booking
router.post(
  '/:id/complete',
  auth,
  authorize('admin', 'manager', 'staff'),
  bookingController.completeBooking
);

module.exports = router;