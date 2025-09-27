// backend/src/services/ContactService.ts
import sgMail from '@sendgrid/mail';
import { PrismaService } from './PrismaService';
import { ValidationUtils } from '../utils/validation';
import validator from 'validator';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export class ContactService {
  private prisma: PrismaService;
  private readonly MAX_NAME_LENGTH = 100;
  private readonly MAX_MESSAGE_LENGTH = 2000;
  private isInitialized = false;

  constructor() {
    this.prisma = new PrismaService();
    this.initializeSendGrid();
  }

  private initializeSendGrid(): void {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (!apiKey) {
      console.error('❌ SENDGRID_API_KEY is not set in environment variables');
      throw new Error('SendGrid API key is required');
    }

    try {
      sgMail.setApiKey(apiKey);
      this.isInitialized = true;
      
      console.log('✅ SendGrid initialized successfully');
      console.log('📧 SendGrid Configuration:', {
        hasApiKey: !!apiKey,
        apiKeyPreview: apiKey.substring(0, 8) + '...',
        fromEmail: process.env.SENDER_EMAIL || 'Not set',
        toEmail: process.env.RECIPIENT_EMAIL || 'Not set'
      });

      // Vérification non bloquante
      this.verifySendGridConfig().catch(error => {
        console.warn('⚠️ SendGrid verification failed, but service will continue:', error.message);
      });

    } catch (error) {
      console.error('❌ Failed to initialize SendGrid:', error);
      throw new Error('Failed to initialize SendGrid service');
    }
  }

  private async verifySendGridConfig(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('SendGrid is not initialized');
    }

    const requiredEnvVars = {
      SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
      SENDER_EMAIL: process.env.SENDER_EMAIL,
      RECIPIENT_EMAIL: process.env.RECIPIENT_EMAIL
    };

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    console.log('✅ SendGrid configuration is valid');
  }

  private validateContactData(data: ContactFormData): void {
    // Validation du nom
    if (!data.name || !ValidationUtils.validateName(data.name)) {
      throw new Error('Invalid name format');
    }

    // Validation de l'email
    if (!data.email || !validator.isEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validation du message
    if (!data.message || data.message.trim().length < 10) {
      throw new Error('Message must be at least 10 characters long');
    }

    if (data.message.length > this.MAX_MESSAGE_LENGTH) {
      throw new Error(`Message too long (max ${this.MAX_MESSAGE_LENGTH} characters)`);
    }
  }

  private getEmailTemplate(type: 'user' | 'admin', data: { name: string; email: string; message: string }): string {
    const baseTemplate = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuraWeb Email</title>
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
        
        .logo {
            height: 56px;
            width: auto;
            object-fit: contain;
        }
        
        .logo-fallback {
            height: 56px;
            width: 56px;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .logo-fallback span {
            color: #ffffff;
            font-weight: bold;
            font-size: 18px;
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
        
        .highlight-box {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .highlight-box strong {
            color: #1f2937;
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
        }
        
        .signature {
            margin-top: 32px;
            color: #4b5563;
            font-size: 16px;
        }
        
        .email-footer {
            background-color: #111827;
            color: #ffffff;
            padding: 32px 24px;
        }
        
        .footer-content {
            display: table;
            width: 100%;
        }
        
        .footer-section {
            display: table-cell;
            vertical-align: top;
            width: 33.333%;
            padding-right: 20px;
        }
        
        .footer-section:last-child {
            padding-right: 0;
        }
        
        .footer-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #ffffff;
        }
        
        .footer-text {
            font-size: 14px;
            line-height: 1.6;
            color: #9ca3af;
            margin-bottom: 16px;
        }
        
        .contact-info {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .contact-info li {
            margin-bottom: 8px;
            font-size: 14px;
            color: #9ca3af;
            display: flex;
            align-items: center;
        }
        
        .contact-icon {
            margin-right: 8px;
            width: 16px;
            height: 16px;
        }
        
        .services-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .services-list li {
            margin-bottom: 6px;
            font-size: 14px;
            color: #9ca3af;
        }
        
        .footer-bottom {
            text-align: center;
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #374151;
            font-size: 12px;
            color: #6b7280;
        }
        
        .footer-links {
            margin-top: 8px;
        }
        
        .footer-links a {
            color: #9ca3af;
            text-decoration: none;
            margin: 0 8px;
            font-size: 12px;
        }
        
        .footer-links a:hover {
            color: #ffffff;
        }
        
        .admin-info {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 16px;
            margin: 20px 0;
            border-radius: 8px;
        }
        
        .admin-info strong {
            color: #92400e;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                width: 100% !important;
            }
            
            .email-content {
                padding: 20px 16px !important;
            }
            
            .email-footer {
                padding: 20px 16px !important;
            }
            
            .footer-content {
                display: block !important;
            }
            
            .footer-section {
                display: block !important;
                width: 100% !important;
                margin-bottom: 20px;
                padding-right: 0 !important;
            }
            
            .cta-button {
                display: block !important;
                text-align: center;
                margin: 20px 0 !important;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <header class="email-header">
            <div class="logo-container">
                <img src="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/assets/neurawebW.png" alt="NeuraWeb Logo" class="logo" style="display: block;">
                <div class="logo-fallback" style="display: none;">
                    <span>NW</span>
                </div>
            </div>
            <h1 class="company-name">NeuraWeb</h1>
            <p class="company-tagline">Solutions Web & IA sur mesure</p>
        </header>
        
        <main class="email-content">
            ${this.getContentByType(type, data)}
        </main>
        
        <footer class="email-footer">
            <div class="footer-content">
                <div class="footer-section">
                    <h3 class="footer-title">Contact</h3>
                    <ul class="contact-info">
                        <li>
                            <span class="contact-icon">✉</span>
                            ${process.env.CONTACT_EMAIL || 'contact@neuraweb.tech'}
                        </li>
                        <li>
                            <span class="contact-icon">📞</span>
                            ${process.env.CONTACT_PHONE || '+33 1 23 45 67 89'}
                        </li>
                        <li>
                            <span class="contact-icon">📍</span>
                            ${process.env.CONTACT_ADDRESS || 'Paris, France'}
                        </li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3 class="footer-title">Nos Services</h3>
                    <ul class="services-list">
                        <li>Développement Web</li>
                        <li>E-commerce</li>
                        <li>Automatisation</li>
                        <li>Intelligence Artificielle</li>
                        <li>Maintenance & Support</li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3 class="footer-title">À propos</h3>
                    <p class="footer-text">
                        NeuraWeb transforme vos idées en solutions digitales innovantes. Nous combinons expertise technique et créativité pour créer des expériences utilisateur exceptionnelles.
                    </p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>© 2025 NeuraWeb. Tous droits réservés.</p>
                <div class="footer-links">
                    <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/contact">Contact</a>
                    <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/quote">Devis</a>
                    <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/privacy">Confidentialité</a>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>`;

    return baseTemplate;
  }

  private getContentByType(type: 'user' | 'admin', data: { name: string; email: string; message: string }): string {
    if (type === 'user') {
      return `
        <div class="greeting">
            Bonjour ${validator.escape(data.name)},
        </div>
        
        <div class="content-text">
            Nous vous remercions de nous avoir contactés concernant votre projet. Notre équipe a bien reçu votre demande et nous vous répondrons dans les plus brefs délais.
        </div>
        
        <div class="highlight-box">
            <strong>Récapitulatif de votre demande :</strong><br>
            ${validator.escape(data.message)}
        </div>
        
        <div class="content-text">
            Chez NeuraWeb, nous nous spécialisons dans le développement web moderne, l'e-commerce, l'automatisation et l'intégration d'intelligence artificielle. Nous analyserons votre demande avec attention pour vous proposer la meilleure solution adaptée à vos besoins.
        </div>
        
        <div class="content-text">
            <strong>Prochaines étapes :</strong><br>
            • Notre équipe analysera votre demande sous 24h<br>
            • Vous recevrez une réponse personnalisée<br>
            • Nous planifierons un rendez-vous si nécessaire
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/booking" class="cta-button">Planifier un rendez-vous</a>
        </div>
        
        <div class="signature">
            Cordialement,<br>
            <strong>L'équipe NeuraWeb</strong><br>
            <em>Votre partenaire technologique</em>
        </div>`;
    } else {
      return `
        <div class="greeting">
            Nouvelle demande de contact reçue
        </div>
        
        <div class="admin-info">
            <strong>Informations du contact :</strong><br>
            <strong>Nom :</strong> ${validator.escape(data.name)}<br>
            <strong>Email :</strong> ${validator.escape(data.email)}<br>
            <strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}<br>
            <strong>IP :</strong> ${process.env.CLIENT_IP || 'Non disponible'}
        </div>
        
        <div class="highlight-box">
            <strong>Message :</strong><br>
            ${validator.escape(data.message)}
        </div>
        
        <div class="content-text">
            <strong>Actions à effectuer :</strong><br>
            • Répondre au client sous 24h<br>
            • Analyser la demande et préparer une proposition<br>
            • Programmer un suivi si nécessaire
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/admin/contacts" class="cta-button">Voir dans l'admin</a>
        </div>
        
        <div class="signature">
            Système de notification NeuraWeb<br>
            <em>Email automatique - Ne pas répondre</em>
        </div>`;
    }
  }

  async sendContactEmail(data: ContactFormData) {
    try {
      if (!this.isInitialized) {
        throw new Error('SendGrid is not initialized');
      }

      // Validation des données
      this.validateContactData(data);

      // Sanitisation des données
      const sanitizedData = {
        name: ValidationUtils.sanitizeHtml(ValidationUtils.limitStringLength(data.name, this.MAX_NAME_LENGTH)),
        email: ValidationUtils.validateAndSanitizeEmail(data.email),
        message: ValidationUtils.sanitizeHtml(ValidationUtils.limitStringLength(data.message, this.MAX_MESSAGE_LENGTH))
      };

      // Vérification anti-spam basique
      const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'bitcoin', 'crypto'];
      const messageText = sanitizedData.message.toLowerCase();
      if (spamKeywords.some(keyword => messageText.includes(keyword))) {
        throw new Error('Message detected as spam');
      }

      // Save to database avec données sanitisées
      const contact = await this.prisma.contact.create({
        data: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          message: sanitizedData.message,
          status: 'pending',
        },
      });

      const senderEmail = process.env.SENDER_EMAIL;
      const recipientEmail = process.env.RECIPIENT_EMAIL;

      if (!senderEmail || !recipientEmail) {
        throw new Error('Email configuration missing: SENDER_EMAIL or RECIPIENT_EMAIL not set');
      }

      // Préparer les emails avec SendGrid
      const emails = [
        // Email de notification à l'admin
        {
          to: recipientEmail,
          from: {
            email: senderEmail,
            name: process.env.SENDER_NAME || 'NeuraWeb'
          },
          subject: `🔔 Nouveau message de ${sanitizedData.name} - NeuraWeb`,
          html: this.getEmailTemplate('admin', sanitizedData),
          text: `
Nouvelle demande de contact reçue

Nom: ${sanitizedData.name}
Email: ${sanitizedData.email}
Date: ${new Date().toLocaleString('fr-FR')}

Message:
${sanitizedData.message}

---
Système de notification NeuraWeb
          `.trim(),
          // Ajout de métadonnées SendGrid
          customArgs: {
            type: 'admin_notification',
            contact_id: contact.id
          },
          categories: ['contact', 'admin-notification']
        },
        // Email de confirmation à l'utilisateur
        {
          to: sanitizedData.email,
          from: {
            email: senderEmail,
            name: process.env.SENDER_NAME || 'NeuraWeb'
          },
          subject: '✅ Merci de nous avoir contactés - NeuraWeb',
          html: this.getEmailTemplate('user', sanitizedData),
          text: `
Bonjour ${sanitizedData.name},

Nous vous remercions de nous avoir contactés concernant votre projet. Notre équipe a bien reçu votre demande et nous vous répondrons dans les plus brefs délais.

Récapitulatif de votre demande:
${sanitizedData.message}

Prochaines étapes:
• Notre équipe analysera votre demande sous 24h
• Vous recevrez une réponse personnalisée
• Nous planifierons un rendez-vous si nécessaire

Cordialement,
L'équipe NeuraWeb
Votre partenaire technologique

---
NeuraWeb - Solutions Web & IA sur mesure
${process.env.CONTACT_EMAIL || 'contact@neuraweb.tech'}
          `.trim(),
          // Ajout de métadonnées SendGrid
          customArgs: {
            type: 'user_confirmation',
            contact_id: contact.id
          },
          categories: ['contact', 'user-confirmation']
        }
      ];

      // Envoi des emails avec SendGrid
      console.log('📧 Sending emails via SendGrid...');
      
      try {
        // Envoi de l'email admin
        console.log('📧 Sending admin notification email...');
        const adminResponse = await sgMail.send(emails[0]);
        console.log('✅ Admin notification email sent successfully', {
          messageId: adminResponse[0]?.headers?.['x-message-id'],
          statusCode: adminResponse[0]?.statusCode
        });

        // Envoi de l'email utilisateur
        console.log('📧 Sending user confirmation email...');
        const userResponse = await sgMail.send(emails[1]);
        console.log('✅ User confirmation email sent successfully', {
          messageId: userResponse[0]?.headers?.['x-message-id'],
          statusCode: userResponse[0]?.statusCode
        });

      } catch (emailError: any) {
        console.error('❌ SendGrid email error:', emailError);
        
        // Log des détails d'erreur SendGrid
        if (emailError.response) {
          console.error('SendGrid error details:', {
            statusCode: emailError.response.statusCode,
            body: emailError.response.body,
            headers: emailError.response.headers
          });
        }
        
        throw new Error(`Email sending failed: ${emailError.message}`);
      }

      console.log(`✅ Contact form submitted successfully: ${contact.id}`);
      return contact;

    } catch (error) {
      console.error('❌ Contact service error:', error);
      
      if (error instanceof Error) {
        // Log more details for debugging
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          data: {
            name: data.name,
            email: data.email,
            messageLength: data.message?.length || 0
          }
        });
        throw error; // Re-throw validation errors
      }
      
      throw new Error('Failed to process contact form');
    }
  }

  // Méthode utilitaire pour tester la configuration SendGrid
  async testEmailConfiguration(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        console.error('❌ SendGrid is not initialized');
        return false;
      }

      await this.verifySendGridConfig();

      const senderEmail = process.env.SENDER_EMAIL;
      const recipientEmail = process.env.RECIPIENT_EMAIL;

      if (!senderEmail || !recipientEmail) {
        console.error('❌ Missing email configuration');
        return false;
      }

      // Test d'envoi d'un email de test
      const testEmail = {
        to: recipientEmail,
        from: {
          email: senderEmail,
          name: process.env.SENDER_NAME || 'NeuraWeb'
        },
        subject: '🧪 Test de configuration SendGrid - NeuraWeb',
        html: `
          <h2>Test de configuration SendGrid</h2>
          <p>Cet email confirme que la configuration SendGrid fonctionne correctement.</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>API Key:</strong> ${process.env.SENDGRID_API_KEY?.substring(0, 8)}...</p>
          <p><em>Email de test automatique</em></p>
        `,
        text: `
Test de configuration SendGrid

Cet email confirme que la configuration SendGrid fonctionne correctement.
Date: ${new Date().toLocaleString('fr-FR')}
API Key: ${process.env.SENDGRID_API_KEY?.substring(0, 8)}...

Email de test automatique
        `.trim(),
        customArgs: {
          type: 'configuration_test'
        },
        categories: ['test', 'configuration']
      };

      // Décommenter pour envoyer un email de test
      // const response = await sgMail.send(testEmail);
      // console.log('✅ Test email sent successfully:', response[0]?.headers?.['x-message-id']);
      
      console.log('✅ SendGrid configuration test passed');
      return true;
      
    } catch (error: any) {
      console.error('❌ SendGrid configuration test failed:', error);
      
      if (error.response) {
        console.error('SendGrid error details:', {
          statusCode: error.response.statusCode,
          body: error.response.body
        });
      }
      
      return false;
    }
  }

  // Méthode utilitaire pour obtenir les contacts (pour l'admin)
  async getContacts(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [contacts, total] = await Promise.all([
        this.prisma.contact.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        this.prisma.contact.count()
      ]);

      return {
        contacts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw new Error('Failed to fetch contacts');
    }
  }

  // Méthode pour marquer un contact comme lu
  async markContactAsRead(contactId: string) {
    try {
      const contact = await this.prisma.contact.update({
        where: { id: contactId },
        data: { status: 'read' }
      });

      return contact;
    } catch (error) {
      console.error('Error marking contact as read:', error);
      throw new Error('Failed to update contact status');
    }
  }

  // Méthode pour nettoyer les anciens contacts (optionnel)
  async cleanupOldContacts(daysOld: number = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await this.prisma.contact.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          },
          status: 'read' // Ne supprimer que les contacts déjà lus
        }
      });

      console.log(`🧹 Cleaned up ${result.count} old contacts`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up old contacts:', error);
      throw new Error('Failed to cleanup old contacts');
    }
  }

  // Méthode pour obtenir les statistiques d'envoi SendGrid (optionnel)
  async getEmailStats(): Promise<any> {
    try {
      // Cette méthode nécessiterait l'utilisation de l'API SendGrid pour les statistiques
      // Pour l'instant, on retourne les informations de base
      return {
        service: 'SendGrid',
        initialized: this.isInitialized,
        hasApiKey: !!process.env.SENDGRID_API_KEY,
        configuredEmails: {
          sender: process.env.SENDER_EMAIL,
          recipient: process.env.RECIPIENT_EMAIL
        }
      };
    } catch (error) {
      console.error('Error getting email stats:', error);
      throw new Error('Failed to get email statistics');
    }
  }
}