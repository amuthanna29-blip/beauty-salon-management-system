const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // References
    salonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    
    // Booking Details
    bookingCode: {
      type: String,
      unique: true,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      description: 'Duration in minutes'
    },
    
    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
      default: 'pending'
    },
    
    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0
    },
    discountApplied: {
      type: Number,
      default: 0,
      min: 0
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    
    // Payment
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'partial'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'transfer', 'online'],
      default: null
    },
    
    // Notes and Preferences
    notes: {
      type: String,
      maxlength: 500
    },
    specialRequests: {
      type: String,
      maxlength: 500
    },
    
    // Cancellation
    cancellationReason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    // Reminder
    reminderSent: {
      type: Boolean,
      default: false
    },
    reminderSentAt: Date,
    
    // Feedback
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      maxlength: 500
    },
    reviewedAt: Date,
    
    // Audit
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Generate unique booking code before saving
bookingSchema.pre('save', async function(next) {
  if (this.isNew) {
    this.bookingCode = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

// Calculate end time based on duration
bookingSchema.pre('save', function(next) {
  if (this.isModified('startTime') || this.isModified('duration')) {
    this.endTime = new Date(this.startTime.getTime() + this.duration * 60000);
  }
  next();
});

// Index for frequently queried fields
bookingSchema.index({ salonId: 1 });
bookingSchema.index({ clientId: 1 });
bookingSchema.index({ staffId: 1 });
bookingSchema.index({ startTime: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ salonId: 1, startTime: 1 });
bookingSchema.index({ staffId: 1, startTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
