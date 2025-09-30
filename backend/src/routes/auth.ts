// backend/src/routes/auth.ts
import express from 'express';
import { body, validationResult } from 'express-validator';
import { PasswordResetService } from '../services/PasswordResetService';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const passwordResetService = new PasswordResetService();

// Rate limiting pour les demandes de réinitialisation (protection contre le spam)
const resetRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 demandes max par IP
  message: {
    error: 'Too many password reset requests. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting pour la réinitialisation effective
const resetPerformLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives max par IP
  message: {
    error: 'Too many password reset attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /api/auth/request-reset
 * Demande de réinitialisation de mot de passe
 */
router.post(
  '/request-reset',
  resetRequestLimiter,
  [
    body('email')
      .isEmail()
      .withMessage('Invalid email format')
      .normalizeEmail(),
    body('userType')
      .isIn(['client', 'admin'])
      .withMessage('Invalid user type'),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      // Validation des entrées
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation error',
          details: errors.array(),
        });
      }

      const { email, userType } = req.body;

      console.log(`🔐 Password reset requested for: ${email} (${userType})`);

      // Traiter la demande de réinitialisation
      await passwordResetService.requestPasswordReset(email, userType);

      // Réponse générique pour la sécurité (ne pas révéler si l'email existe)
      res.status(200).json({
        success: true,
        message: 'If this email exists, a password reset link has been sent.',
      });

    } catch (error: any) {
      console.error('❌ Request reset error:', error);
      
      // Gestion des erreurs sans révéler d'informations sensibles
      if (error.message === 'Invalid email format') {
        return res.status(400).json({
          error: 'Invalid email format',
        });
      }

      // Réponse générique pour toutes les autres erreurs
      res.status(200).json({
        success: true,
        message: 'If this email exists, a password reset link has been sent.',
      });
    }
  }
);

/**
 * POST /api/auth/perform-reset
 * Effectuer la réinitialisation du mot de passe
 */
router.post(
  '/perform-reset',
  resetPerformLimiter,
  [
    body('token')
      .isString()
      .trim()
      .isLength({ min: 64, max: 64 })
      .withMessage('Invalid token format'),
    body('newPassword')
      .isString()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      // Validation des entrées
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation error',
          details: errors.array(),
        });
      }

      const { token, newPassword } = req.body;

      console.log(`🔐 Performing password reset with token: ${token.substring(0, 10)}...`);

      // Effectuer la réinitialisation
      await passwordResetService.performPasswordReset(token, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successful. You can now login with your new password.',
      });

    } catch (error: any) {
      console.error('❌ Perform reset error:', error);
      
      // Retourner des messages d'erreur spécifiques
      if (error.message.includes('Invalid or expired')) {
        return res.status(400).json({
          error: 'Invalid or expired reset token',
        });
      }

      if (error.message.includes('already been used')) {
        return res.status(400).json({
          error: 'This reset link has already been used',
        });
      }

      if (error.message.includes('expired')) {
        return res.status(400).json({
          error: 'This reset link has expired. Please request a new one.',
        });
      }

      if (error.message.includes('Password must be')) {
        return res.status(400).json({
          error: error.message,
        });
      }

      res.status(500).json({
        error: 'Failed to reset password. Please try again.',
      });
    }
  }
);

/**
 * POST /api/auth/cleanup-tokens (route admin optionnelle)
 * Nettoyer les tokens expirés
 */
router.post('/cleanup-tokens', async (req, res) => {
  try {
    // TODO: Ajouter une authentification admin ici si nécessaire
    
    const count = await passwordResetService.cleanupExpiredTokens();

    res.status(200).json({
      success: true,
      message: `Cleaned up ${count} expired tokens`,
      count,
    });

  } catch (error: any) {
    console.error('❌ Cleanup tokens error:', error);
    res.status(500).json({
      error: 'Failed to cleanup tokens',
    });
  }
});

export default router;