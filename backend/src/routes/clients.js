const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validate, validationRules } = require('../middleware/validation');
const clientController = require('../controllers/clientController');

// Get all clients
router.get('/', auth, clientController.getAllClients);

// Get client by ID
router.get('/:id', auth, clientController.getClient);

// Create client
router.post(
  '/',
  auth,
  authorize('admin', 'manager', 'staff'),
  validationRules.createClient,
  validate,
  clientController.createClient
);

// Update client
router.put(
  '/:id',
  auth,
  authorize('admin', 'manager', 'staff'),
  clientController.updateClient
);

// Delete client
router.delete(
  '/:id',
  auth,
  authorize('admin', 'manager'),
  clientController.deleteClient
);

// Get client history
router.get('/:id/history', auth, clientController.getClientHistory);

module.exports = router;