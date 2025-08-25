import express from 'express';
import { BookingService } from '../services/BookingService';
import { validateBookingForm } from '../middleware/validation';

const router = express.Router();
const bookingService = new BookingService();

// GET /api/booking/slots - Get available time slots
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

// POST /api/booking - Book a meeting
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

export default router;