import express from 'express';
import { ContactService } from '../services/ContactService';
import { validateContactForm } from '../middleware/validation';

const router = express.Router();
const contactService = new ContactService();

// POST /api/contact - Send contact form
router.post('/', validateContactForm, async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    
    const result = await contactService.sendContactEmail({
      name,
      email,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;