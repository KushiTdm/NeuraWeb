// backend/src/routes/booking.ts
import express from 'express';
import { BookingService } from '../services/BookingService';
import { validateBookingForm } from '../middleware/validation';
import validator from 'validator';

const router = express.Router();
const bookingService = new BookingService();

// Validation middleware for new booking endpoint
const validateCreateBooking = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { name, email, datetime } = req.body;

  // Validate required fields
  if (!name || !email || !datetime) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: name, email, datetime'
    });
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid email format'
    });
  }

  // Validate datetime format
  const dateTime = new Date(datetime);
  if (isNaN(dateTime.getTime())) {
    return res.status(400).json({
      success: false,
      error: 'Invalid datetime format'
    });
  }

  // Check if datetime is in the future
  if (dateTime <= new Date()) {
    return res.status(400).json({
      success: false,
      error: 'Datetime must be in the future'
    });
  }

  // Validate optional phone field
  if (req.body.phone && req.body.phone.length > 20) {
    return res.status(400).json({
      success: false,
      error: 'Phone number is too long'
    });
  }

  // Validate optional message field
  if (req.body.message && req.body.message.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Message is too long (max 1000 characters)'
    });
  }

  next();
};

// GET /api/booking/slots - Get available time slots (legacy endpoint)
router.get('/slots', async (req, res, next) => {
  try {
    const slots = await bookingService.getAvailableSlots();
    
    res.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/booking/availability - Get available slots for the next 7 days
router.get('/availability', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    
    // Validate days parameter
    if (days < 1 || days > 30) {
      return res.status(400).json({
        success: false,
        error: 'Days must be between 1 and 30'
      });
    }

    const slots = await bookingService.getAvailability(days);
    
    res.json({
      success: true,
      data: {
        slots,
        days,
        totalSlots: slots.length,
        availableSlots: slots.filter(slot => slot.available).length,
        bookedSlots: slots.filter(slot => !slot.available).length
      }
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    next(error);
  }
});

// POST /api/booking/create - Create a new booking with Google Calendar integration
router.post('/create', validateCreateBooking, async (req, res, next) => {
  try {
    const { name, email, datetime, phone, message } = req.body;

    const result = await bookingService.createBookingWithCalendar({
      name: validator.escape(name.trim()),
      email: email.toLowerCase().trim(),
      datetime,
      phone: phone ? validator.escape(phone.trim()) : undefined,
      message: message ? validator.escape(message.trim()) : undefined,
    });

    const response = {
      success: true,
      message: 'Booking created successfully',
      data: {
        id: result.booking.id,
        name: result.booking.name,
        email: result.booking.email,
        datetime: result.booking.selectedSlot,
        status: result.booking.status,
        calendarEventCreated: !!result.calendarEvent,
        calendarEventId: result.calendarEvent?.id
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Booking creation error:', error);
    
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    } else {
      next(error);
    }
  }
});

// POST /api/booking - Book a meeting (legacy endpoint)
router.post('/', validateBookingForm, async (req, res, next) => {
  try {
    const bookingData = req.body;
    
    const result = await bookingService.createBooking(bookingData);

    res.status(201).json({
      success: true,
      message: 'Meeting booked successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/booking/list - Get all bookings (admin endpoint)
router.get('/list', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pagination parameters'
      });
    }

    const result = await bookingService.getBookings(page, limit);
    
    res.json({
      success: true,
      data: result.bookings,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/booking/:id/cancel - Cancel a booking
router.put('/:id/cancel', async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    const booking = await bookingService.cancelBooking(bookingId);
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Booking not found') {
      res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    } else {
      next(error);
    }
  }
});

// GET /api/booking/stats - Get booking statistics (admin endpoint)
router.get('/stats', async (req, res, next) => {
  try {
    const { bookings } = await bookingService.getBookings(1, 1000); // Get all for stats
    
    const stats = {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      thisMonth: bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        const now = new Date();
        return bookingDate.getMonth() === now.getMonth() && 
               bookingDate.getFullYear() === now.getFullYear();
      }).length,
      thisWeek: bookings.filter(b => {
        const bookingDate = new Date(b.createdAt);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return bookingDate >= weekAgo;
      }).length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Booking route error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

export default router;