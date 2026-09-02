const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { validate, validationRules } = require('../middleware/validation');
const authController = require('../controllers/authController');

// Public routes
router.post(
  '/register',
  validationRules.register,
  validate,
  authController.register
);

router.post(
  '/login',
  validationRules.login,
  validate,
  authController.login
);

// Protected routes
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, authController.updateProfile);

module.exports = router;