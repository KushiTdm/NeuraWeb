// backend/src/routes/quotes.ts
import express from 'express';
import { QuoteService } from '../services/QuoteService';
import { validateQuoteForm } from '../middleware/validation';

const router = express.Router();
const quoteService = new QuoteService();

// POST /api/quotes - Submit quote request
router.post('/', validateQuoteForm, async (req, res, next) => {
  try {
    const quoteData = req.body;
    
    const result = await quoteService.createQuote(quoteData);

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;