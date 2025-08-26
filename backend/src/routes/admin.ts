import express from 'express';
import { AdminService } from '../services/AdminService';
import { ClientService } from '../services/ClientService';
import { WizardService } from '../services/WizardService';
import { AdminDashboardService } from '../services/AdminDashboardService';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();
const adminService = new AdminService();
const clientService = new ClientService();
const wizardService = new WizardService();
const dashboardService = new AdminDashboardService();

// POST /api/admin/login - Admin login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const result = await adminService.login(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/quotes - Get all quote requests
router.get('/quotes', authenticateAdmin, async (req, res, next) => {
  try {
    const quotes = await adminService.getQuotes();
    
    res.json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/contacts - Get all contact messages
router.get('/contacts', authenticateAdmin, async (req, res, next) => {
  try {
    const contacts = await adminService.getContacts();
    
    res.json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/bookings - Get all bookings
router.get('/bookings', authenticateAdmin, async (req, res, next) => {
  try {
    const bookings = await adminService.getBookings();
    
    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/dashboard/clients - Get all clients with stats
router.get('/dashboard/clients', authenticateAdmin, async (req, res, next) => {
  try {
    const clients = await dashboardService.getClientsWithStats();
    
    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/dashboard/clients/:id/validate - Validate client
router.patch('/dashboard/clients/:id/validate', authenticateAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await dashboardService.validateClient(id);

    res.json({
      success: true,
      message: 'Client validated successfully',
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/dashboard/clients/:id - Delete client
router.delete('/dashboard/clients/:id', authenticateAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await dashboardService.deleteClient(id);

    res.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/dashboard/sessions - Get all client sessions
router.get('/dashboard/sessions', authenticateAdmin, async (req, res, next) => {
  try {
    const { clientId } = req.query;
    const sessions = await dashboardService.getClientSessions(clientId as string);
    
    res.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/dashboard/stats - Get platform statistics
router.get('/dashboard/stats', authenticateAdmin, async (req, res, next) => {
  try {
    const stats = await dashboardService.getPlatformStats();
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/clients - Get all clients
router.get('/clients', authenticateAdmin, async (req, res, next) => {
  try {
    const clients = await clientService.getClients();
    
    res.json({
      success: true,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/clients/:id/validate - Validate client
router.patch('/clients/:id/validate', authenticateAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await clientService.validateClient(id);

    res.json({
      success: true,
      message: 'Client validated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/admin/wizards - Get all wizard responses
router.get('/wizards', authenticateAdmin, async (req, res, next) => {
  try {
    const wizards = await wizardService.getAllClientWizards();
    
    res.json({
      success: true,
      data: wizards,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/:type/:id/status - Update status
router.patch('/:type/:id/status', authenticateAdmin, async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { status } = req.body;
    
    const result = await adminService.updateStatus(type, id, status);

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;