const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validate, validationRules } = require('../middleware/validation');
const serviceController = require('../controllers/serviceController');

// Get all services
router.get('/', auth, serviceController.getAllServices);

// Get service by ID
router.get('/:id', auth, serviceController.getService);

// Create service
router.post(
  '/',
  auth,
  authorize('admin', 'manager'),
  validationRules.createService,
  validate,
  serviceController.createService
);

// Update service
router.put(
  '/:id',
  auth,
  authorize('admin', 'manager'),
  serviceController.updateService
);

// Delete service
router.delete(
  '/:id',
  auth,
  authorize('admin', 'manager'),
  serviceController.deleteService
);

// Get services by category
router.get('/category/:category', auth, serviceController.getByCategory);

module.exports = router;