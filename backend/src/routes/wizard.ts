import express from 'express';
import { WizardService } from '../services/WizardService';
import { authenticateClient, requireValidatedClient, ClientAuthRequest } from '../middleware/clientAuth';
import { validateWizardStep } from '../middleware/validation';

const router = express.Router();
const wizardService = new WizardService();

// All wizard routes require client authentication
router.use(authenticateClient);
router.use(requireValidatedClient);

// POST /api/wizard/save - Save wizard step
router.post('/save', validateWizardStep, async (req: ClientAuthRequest, res, next) => {
  try {
    const { step, data, isDraft = true } = req.body;
    const clientId = req.client.clientId;
    
    const result = await wizardService.saveWizardStep({
      clientId,
      step,
      data,
      isDraft,
    });

    res.json({
      success: true,
      message: 'Wizard step saved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/wizard/submit - Submit complete wizard
router.post('/submit', async (req: ClientAuthRequest, res, next) => {
  try {
    const clientId = req.client.clientId;
    
    const result = await wizardService.submitWizard(clientId);

    res.json({
      success: true,
      message: 'Wizard submitted successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/wizard/:clientId - Get wizard responses (admin can access any, client can access own)
router.get('/:clientId?', async (req: ClientAuthRequest, res, next) => {
  try {
    const requestedClientId = req.params.clientId || req.client.clientId;
    
    // If client is requesting someone else's data, deny
    if (req.client.clientId !== requestedClientId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const responses = await wizardService.getWizardResponses(requestedClientId);

    res.json({
      success: true,
      data: responses,
    });
  } catch (error) {
    next(error);
  }
});

export default router;