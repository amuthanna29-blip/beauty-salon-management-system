const Client = require('../models/Client');

// Get all clients
exports.getAllClients = async (req, res, next) => {
  try {
    const { salonId, page = 1, limit = 10, search } = req.query;

    let query = { salonId };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const clients = await Client.find(query)
      .populate('userId')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Client.countDocuments(query);

    res.json({
      success: true,
      count: clients.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      clients
    });
  } catch (error) {
    next(error);
  }
};

// Get single client
exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('userId')
      .populate('preferredStaff')
      .populate('preferences.preferredServices');

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      client
    });
  } catch (error) {
    next(error);
  }
};

// Create client
exports.createClient = async (req, res, next) => {
  try {
    const { salonId, firstName, lastName, email, phone, dateOfBirth, gender } = req.body;

    const existingClient = await Client.findOne({ phone, salonId });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Client with this phone already exists in this salon'
      });
    }

    const client = new Client({
      salonId,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender
    });

    await client.save();

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    next(error);
  }
};

// Update client
exports.updateClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      message: 'Client updated successfully',
      client
    });
  } catch (error) {
    next(error);
  }
};

// Delete client
exports.deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get client history
exports.getClientHistory = async (req, res, next) => {
  try {
    const Booking = require('../models/Booking');
    const bookings = await Booking.find({ clientId: req.params.id })
      .populate('serviceId')
      .populate('staffId', 'firstName lastName')
      .sort({ startTime: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};