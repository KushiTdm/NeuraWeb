import express from 'express';
import { ClientService } from '../services/ClientService';
import { validateClientRegistration, validateClientLogin } from '../middleware/validation';

const router = express.Router();
const clientService = new ClientService();

// POST /api/client/register - Client registration
router.post('/register', validateClientRegistration, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const result = await clientService.register({ name, email, password });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please wait for admin validation.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/client/login - Client login
router.post('/login', validateClientLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const result = await clientService.login({ email, password });

    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;