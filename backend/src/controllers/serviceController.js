const Service = require('../models/Service');

// Get all services
exports.getAllServices = async (req, res, next) => {
  try {
    const { salonId, category, page = 1, limit = 10 } = req.query;

    let query = { salonId };
    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;
    const services = await Service.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Service.countDocuments(query);

    res.json({
      success: true,
      count: services.length,
      total,
      page: parseInt(page),
      services
    });
  } catch (error) {
    next(error);
  }
};

// Get single service
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// Create service
exports.createService = async (req, res, next) => {
  try {
    const service = new Service(req.body);
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    next(error);
  }
};

// Update service
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    next(error);
  }
};

// Delete service
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get services by category
exports.getByCategory = async (req, res, next) => {
  try {
    const { salonId } = req.query;
    const services = await Service.find({
      salonId,
      category: req.params.category
    });

    res.json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};