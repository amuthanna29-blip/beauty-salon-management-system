const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Client = require('../models/Client');

// Revenue Report
exports.getRevenueReport = async (req, res, next) => {
  try {
    const { salonId, startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const payments = await Payment.aggregate([
      {
        $match: {
          salonId: require('mongoose').Types.ObjectId(salonId),
          createdAt: { $gte: start, $lte: end },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.total, 0);
    const totalTransactions = payments.reduce((sum, p) => sum + p.count, 0);

    res.json({
      success: true,
      period: { startDate, endDate },
      totalRevenue,
      totalTransactions,
      byPaymentMethod: payments
    });
  } catch (error) {
    next(error);
  }
};

// Bookings Report
exports.getBookingsReport = async (req, res, next) => {
  try {
    const { salonId, startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const bookings = await Booking.aggregate([
      {
        $match: {
          salonId: require('mongoose').Types.ObjectId(salonId),
          startTime: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalBookings = bookings.reduce((sum, b) => sum + b.count, 0);

    res.json({
      success: true,
      period: { startDate, endDate },
      totalBookings,
      byStatus: bookings
    });
  } catch (error) {
    next(error);
  }
};

// Client Statistics
exports.getClientStats = async (req, res, next) => {
  try {
    const { salonId } = req.query;

    const totalClients = await Client.countDocuments({ salonId });
    const newClients = await Client.countDocuments({
      salonId,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    const clientsByMembership = await Client.aggregate([
      { $match: { salonId: require('mongoose').Types.ObjectId(salonId) } },
      { $group: { _id: '$membershipLevel', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      totalClients,
      newClientsThisMonth: newClients,
      byMembership: clientsByMembership
    });
  } catch (error) {
    next(error);
  }
};