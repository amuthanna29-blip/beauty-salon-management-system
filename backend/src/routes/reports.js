const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const reportController = require('../controllers/reportController');

// Revenue report
router.get(
  '/revenue',
  auth,
  authorize('admin', 'manager'),
  reportController.getRevenueReport
);

// Bookings report
router.get(
  '/bookings',
  auth,
  authorize('admin', 'manager'),
  reportController.getBookingsReport
);

// Client statistics
router.get(
  '/clients',
  auth,
  authorize('admin', 'manager'),
  reportController.getClientStats
);

module.exports = router;