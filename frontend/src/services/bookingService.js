import api from './api';

export const bookingService = {
  // Get all bookings
  getAllBookings: (salonId, params = {}) => 
    api.get(`/bookings?salonId=${salonId}`, { params }),

  // Get single booking
  getBooking: (bookingId) => 
    api.get(`/bookings/${bookingId}`),

  // Create new booking
  createBooking: (data) => 
    api.post('/bookings', data),

  // Update booking
  updateBooking: (bookingId, data) => 
    api.put(`/bookings/${bookingId}`, data),

  // Cancel booking
  cancelBooking: (bookingId, reason) => 
    api.delete(`/bookings/${bookingId}`, { data: { reason } }),

  // Get staff bookings
  getStaffBookings: (staffId, date) => 
    api.get(`/bookings/staff/${staffId}?date=${date}`),

  // Get client bookings
  getClientBookings: (clientId) => 
    api.get(`/bookings/client/${clientId}`),

  // Confirm booking
  confirmBooking: (bookingId) => 
    api.post(`/bookings/${bookingId}/confirm`),

  // Complete booking
  completeBooking: (bookingId) => 
    api.post(`/bookings/${bookingId}/complete`),

  // Check availability
  checkAvailability: (staffId, serviceId, date) => 
    api.get(`/bookings/availability?staffId=${staffId}&serviceId=${serviceId}&date=${date}`),
};
