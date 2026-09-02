const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Get all payments
exports.getAllPayments = async (req, res, next) => {
  try {
    const { salonId, status, page = 1, limit = 10 } = req.query;

    let query = { salonId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const payments = await Payment.find(query)
      .populate('bookingId')
      .populate('clientId', 'firstName lastName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      count: payments.length,
      total,
      page: parseInt(page),
      payments
    });
  } catch (error) {
    next(error);
  }
};

// Get single payment
exports.getPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('bookingId')
      .populate('clientId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// Create payment
exports.createPayment = async (req, res, next) => {
  try {
    const { amount, currency, paymentMethod, bookingId, clientId, salonId } = req.body;

    const payment = new Payment({
      salonId,
      bookingId,
      clientId,
      amount,
      currency,
      paymentMethod,
      status: 'completed',
      transactionId: `TXN-${Date.now()}`
    });

    await payment.save();

    // Update booking payment status
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'paid' });
    }

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully',
      payment
    });
  } catch (error) {
    next(error);
  }
};

// Refund payment
exports.refundPayment = async (req, res, next) => {
  try {
    const { reason, refundAmount } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'refunded',
        refundAmount: refundAmount || payment.amount,
        refundReason: reason,
        refundDate: new Date()
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment refunded successfully',
      payment
    });
  } catch (error) {
    next(error);
  }
};