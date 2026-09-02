const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');

// Get all bookings
exports.getAllBookings = async (req, res, next) => {
  try {
    const { salonId, status, page = 1, limit = 10 } = req.query;

    let query = { salonId };
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const bookings = await Booking.find(query)
      .populate('clientId')
      .populate('staffId', 'firstName lastName')
      .populate('serviceId', 'name price duration')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ startTime: -1 });

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// Get single booking
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('clientId')
      .populate('staffId')
      .populate('serviceId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Create booking
exports.createBooking = async (req, res, next) => {
  try {
    const { clientId, staffId, serviceId, startTime, salonId, notes } = req.body;

    // Get service for price and duration
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check staff availability
    const endTime = new Date(new Date(startTime).getTime() + service.duration * 60000);
    const conflictingBooking = await Booking.findOne({
      staffId,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } }
      ],
      status: { $in: ['confirmed', 'in-progress'] }
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Staff member is not available at this time'
      });
    }

    const booking = new Booking({
      salonId,
      clientId,
      staffId,
      serviceId,
      startTime,
      duration: service.duration,
      price: service.price,
      finalPrice: service.discountPrice || service.price,
      notes
    });

    await booking.save();
    await booking.populate('clientId').populate('staffId').populate('serviceId');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Update booking
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('clientId').populate('staffId').populate('serviceId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: new Date(),
        cancelledBy: req.user.id
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Confirm booking
exports.confirmBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed' },
      { new: true }
    ).populate('clientId').populate('staffId').populate('serviceId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Complete booking
exports.completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    ).populate('clientId').populate('staffId').populate('serviceId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking completed successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};