const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Get all payments
router.get(
  '/',
  auth,
  authorize('admin', 'manager'),
  paymentController.getAllPayments
);

// Get payment by ID
router.get(
  '/:id',
  auth,
  paymentController.getPayment
);

// Create payment
router.post(
  '/',
  auth,
  paymentController.createPayment
);

// Refund payment
router.post(
  '/refund/:id',
  auth,
  authorize('admin', 'manager'),
  paymentController.refundPayment
);

module.exports = router;