// backend/src/services/PasswordResetService.ts
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import validator from 'validator';
import { PrismaService } from './PrismaService';
import { ValidationUtils } from '../utils/validation';

export class PasswordResetService {
  private prisma: PrismaService;
  private readonly TOKEN_EXPIRY_HOURS = 1; // Token expire après 1 heure
  private readonly TOKEN_LENGTH = 64; // 64 caractères hex (32 bytes)

  constructor() {
    this.prisma = new PrismaService();
    this.initializeSendGrid();
  }

  private initializeSendGrid(): void {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (!apiKey) {
      console.error('❌ SENDGRID_API_KEY not found in environment variables');
      return;
    }

    sgMail.setApiKey(apiKey);
    console.log('✅ SendGrid initialized for password reset');
  }

  /**
   * Génère un token aléatoire sécurisé
   */
  private generateToken(): string {
    return crypto.randomBytes(this.TOKEN_LENGTH / 2).toString('hex');
  }

  /**
   * Calcule la date d'expiration du token
   */
  private getExpiryDate(): Date {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + this.TOKEN_EXPIRY_HOURS);
    return expiryDate;
  }

  /**
   * Template d'email pour la réinitialisation
   */
  private getResetEmailTemplate(name: string, resetLink: string): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe - NeuraWeb</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .email-header {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            padding: 24px;
            text-align: center;
        }
        
        .logo-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 12px;
        }
        
        .company-name {
            color: #ffffff;
            font-size: 24px;
            font-weight: bold;
            margin: 0;
            letter-spacing: 0.05em;
        }
        
        .company-tagline {
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            margin: 8px 0 0 0;
        }
        
        .email-content {
            padding: 32px 24px;
        }
        
        .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .content-text {
            font-size: 16px;
            line-height: 1.8;
            color: #4b5563;
            margin-bottom: 20px;
        }
        
        .warning-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .warning-box strong {
            color: #92400e;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            text-align: center;
            display: block;
        }
        
        .security-info {
            background-color: #f3f4f6;
            padding: 16px;
            margin: 24px 0;
            border-radius: 8px;
            font-size: 14px;
            color: #4b5563;
        }
        
        .signature {
            margin-top: 32px;
            color: #4b5563;
            font-size: 16px;
        }
        
        .email-footer {
            background-color: #111827;
            color: #ffffff;
            padding: 24px;
            text-align: center;
        }
        
        .footer-text {
            font-size: 14px;
            color: #9ca3af;
            margin-bottom: 12px;
        }
        
        .footer-links {
            margin-top: 12px;
        }
        
        .footer-links a {
            color: #9ca3af;
            text-decoration: none;
            margin: 0 8px;
            font-size: 12px;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }
            
            .email-content {
                padding: 20px 16px !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <header class="email-header">
            <div class="logo-container">
                <img src="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/assets/neurawebW.png" alt="NeuraWeb Logo" style="height: 56px; width: auto;">
            </div>
            <h1 class="company-name">NeuraWeb</h1>
            <p class="company-tagline">Réinitialisation de mot de passe</p>
        </header>
        
        <main class="email-content">
            <div class="greeting">
                Bonjour ${validator.escape(name)},
            </div>
            
            <div class="content-text">
                Vous avez demandé la réinitialisation de votre mot de passe pour votre compte NeuraWeb. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
            </div>
            
            <a href="${resetLink}" class="cta-button">Réinitialiser mon mot de passe</a>
            
            <div class="warning-box">
                <strong>⚠️ Important :</strong> Ce lien expire dans ${this.TOKEN_EXPIRY_HOURS} heure(s) pour votre sécurité.
            </div>
            
            <div class="security-info">
                <strong>🔒 Conseils de sécurité :</strong><br>
                • Si vous n'avez pas demandé cette réinitialisation, ignorez cet email<br>
                • Ne partagez jamais ce lien avec qui que ce soit<br>
                • Créez un mot de passe fort avec au moins 8 caractères<br>
                • Utilisez une combinaison de lettres, chiffres et symboles
            </div>
            
            <div class="content-text">
                Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :<br>
                <a href="${resetLink}" style="color: #3b82f6; word-break: break-all;">${resetLink}</a>
            </div>
            
            <div class="signature">
                Cordialement,<br>
                <strong>L'équipe NeuraWeb</strong><br>
                <em>Votre partenaire technologique</em>
            </div>
        </main>
        
        <footer class="email-footer">
            <p class="footer-text">
                © 2025 NeuraWeb. Tous droits réservés.
            </p>
            <div class="footer-links">
                <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/contact">Contact</a>
                <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/privacy">Confidentialité</a>
            </div>
        </footer>
    </div>
</body>
</html>`;
  }

  /**
   * Étape 1 : Demande de réinitialisation de mot de passe
   */
  async requestPasswordReset(email: string, userType: 'client' | 'admin'): Promise<void> {
    try {
      // Validation de l'email
      if (!email || !validator.isEmail(email)) {
        throw new Error('Invalid email format');
      }

      const sanitizedEmail = ValidationUtils.validateAndSanitizeEmail(email);

      // Vérifier si l'utilisateur existe
      let user: any = null;
      let userId: string = '';
      let userName: string = '';

      if (userType === 'client') {
        user = await this.prisma.client.findUnique({
          where: { email: sanitizedEmail },
        });
        if (user) {
          userId = user.id;
          userName = user.name;
        }
      } else if (userType === 'admin') {
        user = await this.prisma.admin.findUnique({
          where: { email: sanitizedEmail },
        });
        if (user) {
          userId = user.id;
          userName = 'Admin';
        }
      }

      // Si l'utilisateur n'existe pas, on fait comme si c'était OK (sécurité)
      // Cela évite de révéler si un email existe dans la base
      if (!user) {
        console.log(`⚠️ Password reset requested for non-existent email: ${sanitizedEmail}`);
        return; // On retourne sans erreur
      }

      // Générer un token unique
      const token = this.generateToken();
      const expiresAt = this.getExpiryDate();

      // Sauvegarder le token dans la base de données
      await this.prisma.passwordReset.create({
        data: {
          token,
          userId,
          userType,
          email: sanitizedEmail,
          expiresAt,
        },
      });

      // Construire le lien de réinitialisation
      const frontendUrl = process.env.FRONTEND_URL || 'https://neuraweb.tech';
      const resetLink = `${frontendUrl}/reset-password?token=${token}`;

      // Préparer l'email
      const senderEmail = process.env.SENDER_EMAIL;
      if (!senderEmail) {
        throw new Error('SENDER_EMAIL not configured');
      }

      const resetEmail = {
        to: sanitizedEmail,
        from: {
          name: process.env.SENDER_NAME || 'NeuraWeb',
          email: senderEmail,
        },
        subject: '🔐 Réinitialisation de votre mot de passe - NeuraWeb',
        html: this.getResetEmailTemplate(userName, resetLink),
        text: `
Bonjour ${userName},

Vous avez demandé la réinitialisation de votre mot de passe pour votre compte NeuraWeb.

Cliquez sur ce lien pour réinitialiser votre mot de passe :
${resetLink}

⚠️ Important : Ce lien expire dans ${this.TOKEN_EXPIRY_HOURS} heure(s) pour votre sécurité.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

Cordialement,
L'équipe NeuraWeb

---
NeuraWeb - Solutions Web & IA sur mesure
${process.env.CONTACT_EMAIL || 'contact@neuraweb.tech'}
        `.trim(),
      };

      // Envoyer l'email
      console.log(`📧 Sending password reset email to ${sanitizedEmail}...`);
      await sgMail.send(resetEmail);
      console.log('✅ Password reset email sent successfully');

    } catch (error) {
      console.error('❌ Password reset request error:', error);
      
      // Ne pas révéler d'informations sensibles dans l'erreur
      if (error instanceof Error && error.message.includes('Invalid email')) {
        throw error;
      }
      
      throw new Error('Failed to process password reset request');
    }
  }

  /**
   * Étape 2 : Vérifier et effectuer la réinitialisation
   */
  async performPasswordReset(token: string, newPassword: string): Promise<void> {
    try {
      // Validation du mot de passe
      if (!newPassword || newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Récupérer le token depuis la base de données
      const resetRecord = await this.prisma.passwordReset.findUnique({
        where: { token },
      });

      // Vérifications de sécurité
      if (!resetRecord) {
        throw new Error('Invalid or expired reset token');
      }

      if (resetRecord.used) {
        throw new Error('This reset link has already been used');
      }

      if (new Date() > resetRecord.expiresAt) {
        throw new Error('This reset link has expired');
      }

      // Hash du nouveau mot de passe
      const bcrypt = require('bcryptjs');
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe selon le type d'utilisateur
      if (resetRecord.userType === 'client') {
        await this.prisma.client.update({
          where: { id: resetRecord.userId },
          data: { passwordHash },
        });
      } else if (resetRecord.userType === 'admin') {
        await this.prisma.admin.update({
          where: { id: resetRecord.userId },
          data: { password: passwordHash },
        });
      }

      // Marquer le token comme utilisé
      await this.prisma.passwordReset.update({
        where: { token },
        data: {
          used: true,
          usedAt: new Date(),
        },
      });

      console.log(`✅ Password reset successful for user: ${resetRecord.userId}`);

    } catch (error) {
      console.error('❌ Password reset perform error:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to reset password');
    }
  }

  /**
   * Nettoyer les tokens expirés (à exécuter périodiquement)
   */
  async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await this.prisma.passwordReset.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { used: true, usedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
          ],
        },
      });

      console.log(`🧹 Cleaned up ${result.count} expired password reset tokens`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
      throw new Error('Failed to cleanup expired tokens');
    }
  }
}