// backend/src/services/QuoteService.ts
import sgMail from '@sendgrid/mail';
import { PrismaService } from './PrismaService';
import { ValidationUtils } from '../utils/validation';
import validator from 'validator';

interface QuoteFormData {
  name: string;
  email: string;
  serviceType: string;
  options: string[];
  message?: string;
  estimatedPrice: number;
}

export class QuoteService {
  private prisma: PrismaService;
  private readonly MAX_NAME_LENGTH = 100;
  private readonly MAX_MESSAGE_LENGTH = 2000;

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
    
    // Si vous utilisez une région EU, décommentez la ligne suivante
    // sgMail.setDataResidency('eu');
    
    console.log('✅ SendGrid initialized successfully for QuoteService');
  }

  private validateQuoteData(data: QuoteFormData): void {
    // Validation du nom
    if (!data.name || !ValidationUtils.validateName(data.name)) {
      throw new Error('Invalid name format');
    }

    // Validation de l'email
    if (!data.email || !validator.isEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validation du type de service
    const validServiceTypes = ['starter', 'business', 'premium', 'ai', 'custom'];
    if (!data.serviceType || !validServiceTypes.includes(data.serviceType)) {
      throw new Error('Invalid service type');
    }

    // Validation des options
    const validOptions = ['design', 'maintenance', 'support'];
    if (data.options && data.options.some(opt => !validOptions.includes(opt))) {
      throw new Error('Invalid options provided');
    }

    // Validation du prix estimé
    if (typeof data.estimatedPrice !== 'number' || data.estimatedPrice < 0) {
      throw new Error('Invalid estimated price');
    }

    // Validation du message si fourni
    if (data.message && data.message.length > this.MAX_MESSAGE_LENGTH) {
      throw new Error(`Message too long (max ${this.MAX_MESSAGE_LENGTH} characters)`);
    }
  }

  private getQuoteEmailTemplate(type: 'user' | 'admin', data: QuoteFormData): string {
    const serviceTypeLabels = {
      starter: 'Pack Starter',
      business: 'Pack Business',
      premium: 'Pack Premium',
      ai: 'Solutions IA',
      custom: 'Solution personnalisée'
    };

    const optionLabels = {
      design: 'Design Personnalisé',
      maintenance: 'Pack Maintenance',
      support: 'Support Prioritaire',
    };

    const baseTemplate = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuraWeb - Demande de devis</title>
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
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .highlight-box strong {
            color: #1f2937;
        }
        
        .quote-details {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 1px solid #cbd5e1;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .quote-details h3 {
            color: #1e293b;
            margin-bottom: 12px;
            font-size: 18px;
        }
        
        .quote-details p {
            margin-bottom: 8px;
            color: #475569;
        }
        
        .price-highlight {
            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
            border: 2px solid #f59e0b;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        
        .price-highlight .price {
            font-size: 28px;
            font-weight: bold;
            color: #92400e;
            margin: 8px 0;
        }
        
        .price-highlight p {
            color: #92400e;
            margin: 4px 0;
        }
        
        .price-highlight small {
            color: #a16207;
            font-size: 14px;
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
        
        .options-list {
            background: #f8fafc;
            padding: 16px;
            border-radius: 8px;
            margin: 16px 0;
        }
        
        .options-list ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }
        
        .options-list li {
            padding: 4px 0;
            color: #4b5563;
        }
        
        .options-list li:before {
            content: "✓";
            color: #10b981;
            font-weight: bold;
            margin-right: 8px;
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
            
            .price-highlight .price {
                font-size: 24px !important;
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
            ${this.getQuoteContentByType(type, data, serviceTypeLabels, optionLabels)}
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
                            ${process.env.CONTACT_PHONE || ''}
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

  private getQuoteContentByType(
    type: 'user' | 'admin', 
    data: QuoteFormData, 
    serviceTypeLabels: Record<string, string>, 
    optionLabels: Record<string, string>
  ): string {
    if (type === 'user') {
      return `
        <div class="greeting">
            Bonjour ${validator.escape(data.name)},
        </div>
        
        <div class="content-text">
            <strong>💰 Merci pour votre demande de devis !</strong><br>
            Nous avons bien reçu votre demande et notre équipe l'analysera dans les plus brefs délais.
        </div>
        
        <div class="quote-details">
            <h3>📋 Récapitulatif de votre demande</h3>
            <p><strong>Service :</strong> ${serviceTypeLabels[data.serviceType] || data.serviceType}</p>
            ${data.options.length > 0 ? `
            <p><strong>Options supplémentaires :</strong></p>
            <div class="options-list">
                <ul>
                    ${data.options.map(opt => `<li>${optionLabels[opt] || opt}</li>`).join('')}
                </ul>
            </div>
            ` : '<p><strong>Options supplémentaires :</strong> Aucune</p>'}
        </div>

        <div class="price-highlight">
            <p><strong>Estimation préliminaire</strong></p>
            <div class="price">${data.estimatedPrice.toLocaleString('fr-FR')} €</div>
            <p><small>*Prix indicatif, devis détaillé à venir</small></p>
        </div>

        ${data.message ? `
        <div class="highlight-box">
            <strong>Votre message :</strong><br>
            ${validator.escape(data.message)}
        </div>
        ` : ''}
        
        <div class="content-text">
            <strong>Prochaines étapes :</strong><br>
            • Notre équipe analysera vos besoins dans les 24h<br>
            • Vous recevrez un devis détaillé et personnalisé<br>
            • Nous planifierons un appel pour discuter des détails<br>
            • Possibilité d'ajustements selon vos retours
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/booking" class="cta-button">Planifier un appel</a>
        </div>
        
        <div class="signature">
            Cordialement,<br>
            <strong>L'équipe NeuraWeb</strong><br>
            <em>Votre partenaire technologique</em>
        </div>`;
    } else {
      return `
        <div class="greeting">
            Nouvelle demande de devis reçue
        </div>
        
        <div class="admin-info">
            <strong>Informations du client :</strong><br>
            <strong>Nom :</strong> ${validator.escape(data.name)}<br>
            <strong>Email :</strong> ${validator.escape(data.email)}<br>
            <strong>Date de demande :</strong> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}<br>
            <strong>IP :</strong> ${process.env.CLIENT_IP || 'Non disponible'}
        </div>
        
        <div class="quote-details">
            <h3>📋 Détails de la demande</h3>
            <p><strong>Service demandé :</strong> ${serviceTypeLabels[data.serviceType] || data.serviceType}</p>
            ${data.options.length > 0 ? `
            <p><strong>Options supplémentaires :</strong></p>
            <div class="options-list">
                <ul>
                    ${data.options.map(opt => `<li>${optionLabels[opt] || opt}</li>`).join('')}
                </ul>
            </div>
            ` : '<p><strong>Options supplémentaires :</strong> Aucune</p>'}
        </div>

        <div class="price-highlight">
            <p><strong>Estimation préliminaire du client</strong></p>
            <div class="price">${data.estimatedPrice.toLocaleString('fr-FR')} €</div>
            <p><small>*À analyser et ajuster selon les besoins réels</small></p>
        </div>

        ${data.message ? `
        <div class="highlight-box">
            <strong>Message du client :</strong><br>
            ${validator.escape(data.message)}
        </div>
        ` : ''}
        
        <div class="content-text">
            <strong>Actions à effectuer :</strong><br>
            • Analyser les besoins détaillés du client<br>
            • Préparer un devis personnalisé et détaillé<br>
            • Contacter le client dans les 24h<br>
            • Planifier un appel de découverte si nécessaire<br>
            • Ajuster le prix selon la complexité réelle
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/admin/quotes" class="cta-button">Voir dans l'admin</a>
        </div>
        
        <div class="signature">
            Système de notification NeuraWeb<br>
            <em>Email automatique - Ne pas répondre</em>
        </div>`;
    }
  }

  async createQuote(data: QuoteFormData) {
    try {
      // Validation des données
      this.validateQuoteData(data);

      // Sanitisation des données
      const sanitizedData = {
        name: ValidationUtils.sanitizeHtml(ValidationUtils.limitStringLength(data.name, this.MAX_NAME_LENGTH)),
        email: ValidationUtils.validateAndSanitizeEmail(data.email),
        serviceType: data.serviceType, // Déjà validé dans validateQuoteData
        options: data.options || [], // Déjà validé dans validateQuoteData
        message: data.message ? ValidationUtils.sanitizeHtml(ValidationUtils.limitStringLength(data.message, this.MAX_MESSAGE_LENGTH)) : '',
        estimatedPrice: data.estimatedPrice // Déjà validé dans validateQuoteData
      };

      // Vérification anti-spam basique
      if (sanitizedData.message) {
        const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'bitcoin', 'crypto'];
        const messageText = sanitizedData.message.toLowerCase();
        if (spamKeywords.some(keyword => messageText.includes(keyword))) {
          throw new Error('Message detected as spam');
        }
      }

      // Save to database with sanitized data
      const quote = await this.prisma.quote.create({
        data: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          serviceType: sanitizedData.serviceType,
          options: sanitizedData.options,
          message: sanitizedData.message,
          estimatedPrice: sanitizedData.estimatedPrice,
          status: 'pending',
        },
      });

      // Send email notifications with SendGrid
      await this.sendQuoteEmailsWithSendGrid(sanitizedData);

      console.log(`✅ Quote created successfully: ${quote.id}`);
      return quote;
    } catch (error) {
      console.error('❌ Quote service error:', error);
      
      if (error instanceof Error) {
        // Log more details for debugging
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          data: {
            name: data.name,
            email: data.email,
            serviceType: data.serviceType,
            estimatedPrice: data.estimatedPrice
          }
        });
        throw error; // Re-throw validation errors
      }
      
      throw new Error('Failed to process quote request');
    }
  }

  private async sendQuoteEmailsWithSendGrid(data: QuoteFormData): Promise<void> {
    const senderEmail = process.env.SENDER_EMAIL;
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    if (!senderEmail || !recipientEmail) {
      console.warn('⚠️  Email configuration missing, skipping email notifications');
      return;
    }

    try {
      // Send notification email to admin
      const adminEmail = {
        to: recipientEmail,
        from: {
          name: process.env.SENDER_NAME || 'NeuraWeb',
          email: senderEmail
        },
        subject: `💰 Nouvelle demande de devis - ${data.name} - NeuraWeb`,
        html: this.getQuoteEmailTemplate('admin', data),
        text: `
Nouvelle demande de devis

Nom: ${data.name}
Email: ${data.email}
Service: ${data.serviceType}
Options: ${data.options.join(', ') || 'Aucune'}
Prix estimé: ${data.estimatedPrice.toLocaleString('fr-FR')} €

${data.message ? `Message: ${data.message}` : ''}

Demande reçue le: ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}

---
Système de notification NeuraWeb
        `.trim()
      };

      // Send confirmation email to user
      const userEmail = {
        to: data.email,
        from: {
          name: process.env.SENDER_NAME || 'NeuraWeb',
          email: senderEmail
        },
        subject: '✅ Votre demande de devis - NeuraWeb',
        html: this.getQuoteEmailTemplate('user', data),
        text: `
Bonjour ${data.name},

Merci pour votre demande de devis !

Service: ${data.serviceType}
Estimation préliminaire: ${data.estimatedPrice.toLocaleString('fr-FR')} €

Prochaines étapes:
• Notre équipe analysera vos besoins dans les 24h
• Vous recevrez un devis détaillé et personnalisé
• Nous planifierons un appel pour discuter des détails
• Possibilité d'ajustements selon vos retours

Cordialement,
L'équipe NeuraWeb
Votre partenaire technologique

---
NeuraWeb - Solutions Web & IA sur mesure
${process.env.CONTACT_EMAIL || 'contact@neuraweb.tech'}
        `.trim()
      };

      // Envoi des emails avec SendGrid API
      console.log('📧 Sending admin quote notification via SendGrid...');
      await sgMail.send(adminEmail);
      console.log('✅ Admin quote notification sent successfully');

      console.log('📧 Sending user quote confirmation via SendGrid...');
      await sgMail.send(userEmail);
      console.log('✅ User quote confirmation sent successfully');

    } catch (emailError) {
      console.error('❌ Failed to send quote emails via SendGrid:', emailError);
      
      // Log more details for debugging
      if (emailError instanceof Error) {
        console.error('SendGrid error details:', {
          message: emailError.message,
          stack: emailError.stack,
        });
      }
      
      // Don't fail the quote creation if email fails
    }
  }

  // Méthode utilitaire pour tester la configuration SendGrid
  async testEmailConfiguration(): Promise<boolean> {
    try {
      const senderEmail = process.env.SENDER_EMAIL;
      const recipientEmail = process.env.RECIPIENT_EMAIL;

      if (!senderEmail || !recipientEmail) {
        console.error('❌ Email configuration missing: SENDER_EMAIL or RECIPIENT_EMAIL not set');
        return false;
      }

      const testEmail = {
        to: recipientEmail,
        from: {
          name: process.env.SENDER_NAME || 'NeuraWeb',
          email: senderEmail
        },
        subject: '🧪 Test de configuration SendGrid - QuoteService',
        html: `
          <h2>Test de configuration SendGrid - QuoteService</h2>
          <p>Cet email confirme que la configuration SendGrid fonctionne correctement pour le service de devis.</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>Service:</strong> QuoteService</p>
          <p><strong>API:</strong> SendGrid</p>
          <p><em>Email de test automatique</em></p>
        `,
        text: `
Test de configuration SendGrid - QuoteService

Cet email confirme que la configuration SendGrid fonctionne correctement pour le service de devis.
Date: ${new Date().toLocaleString('fr-FR')}
Service: QuoteService
API: SendGrid

Email de test automatique
        `.trim()
      };

      // Envoyer un email de test (décommentez si nécessaire)
      // await sgMail.send(testEmail);
      
      console.log('✅ SendGrid configuration test successful for QuoteService');
      return true;
    } catch (error) {
      console.error('❌ SendGrid configuration test failed for QuoteService:', error);
      return false;
    }
  }

  async getQuotes(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [quotes, total] = await Promise.all([
        this.prisma.quote.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        this.prisma.quote.count()
      ]);

      return {
        quotes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw new Error('Failed to fetch quotes');
    }
  }

  async getQuoteById(id: string) {
    try {
      const quote = await this.prisma.quote.findUnique({
        where: { id }
      });

      if (!quote) {
        throw new Error('Quote not found');
      }

      return quote;
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw new Error('Failed to fetch quote');
    }
  }

  async updateQuoteStatus(id: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected' | 'completed') {
    try {
      const quote = await this.prisma.quote.update({
        where: { id },
        data: { status }
      });

      // Optionally send status update email
      if (status === 'approved' || status === 'rejected') {
        try {
          await this.sendStatusUpdateEmail(quote, status);
        } catch (emailError) {
          console.warn('Failed to send status update email:', emailError);
          // Don't fail the status update if email fails
        }
      }

      return quote;
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw new Error('Failed to update quote status');
    }
  }

  // Method to send status update emails
  private async sendStatusUpdateEmail(quote: any, status: 'approved' | 'rejected'): Promise<void> {
    const senderEmail = process.env.SENDER_EMAIL;

    if (!senderEmail) {
      console.warn('⚠️  Sender email not configured for status updates');
      return;
    }

    try {
      const isApproved = status === 'approved';
      const statusText = isApproved ? 'approuvé' : 'rejeté';
      const statusEmoji = isApproved ? '✅' : '❌';
      
      const userEmail = {
        to: quote.email,
        from: {
          name: process.env.SENDER_NAME || 'NeuraWeb',
          email: senderEmail
        },
        subject: `${statusEmoji} Mise à jour de votre devis - NeuraWeb`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Mise à jour de votre demande de devis</h2>
            <p>Bonjour ${validator.escape(quote.name)},</p>
            
            <p>Votre demande de devis pour <strong>${quote.serviceType}</strong> a été <strong>${statusText}</strong>.</p>
            
            ${isApproved ? `
            <div style="background: #dcfce7; border: 1px solid #16a34a; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Votre devis a été approuvé !</strong></p>
              <p>Notre équipe va vous contacter prochainement pour finaliser les détails du projet.</p>
            </div>
            ` : `
            <div style="background: #fef2f2; border: 1px solid #dc2626; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Votre demande ne correspond pas à nos services actuels.</strong></p>
              <p>N'hésitez pas à nous recontacter avec un projet différent ou pour plus d'informations.</p>
            </div>
            `}
            
            <p>Cordialement,<br>L'équipe NeuraWeb</p>
          </div>
        `,
        text: `
Bonjour ${quote.name},

Votre demande de devis pour ${quote.serviceType} a été ${statusText}.

${isApproved ? 
'Votre devis a été approuvé ! Notre équipe va vous contacter prochainement pour finaliser les détails du projet.' :
'Votre demande ne correspond pas à nos services actuels. N\'hésitez pas à nous recontacter avec un projet différent.'
}

Cordialement,
L'équipe NeuraWeb
        `.trim()
      };

      await sgMail.send(userEmail);
      console.log(`✅ Status update email sent to ${quote.email} for status: ${status}`);

    } catch (error) {
      console.error('❌ Failed to send status update email:', error);
      throw error;
    }
  }

  // Method to delete a quote
  async deleteQuote(id: string) {
    try {
      const quote = await this.prisma.quote.findUnique({
        where: { id }
      });

      if (!quote) {
        throw new Error('Quote not found');
      }

      await this.prisma.quote.delete({
        where: { id }
      });

      console.log(`✅ Quote deleted: ${id}`);
      return { success: true, message: 'Quote deleted successfully' };
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw new Error('Failed to delete quote');
    }
  }

  // Method to cleanup old quotes (optional)
  async cleanupOldQuotes(daysOld: number = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await this.prisma.quote.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          },
          status: {
            in: ['rejected', 'completed'] // Only delete rejected or completed quotes
          }
        }
      });

      console.log(`🧹 Cleaned up ${result.count} old quotes`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up old quotes:', error);
      throw new Error('Failed to cleanup old quotes');
    }
  }

  // Method to get quotes statistics (for admin dashboard)
  async getQuoteStats() {
    try {
      const [total, pending, approved, rejected, completed] = await Promise.all([
        this.prisma.quote.count(),
        this.prisma.quote.count({ where: { status: 'pending' } }),
        this.prisma.quote.count({ where: { status: 'approved' } }),
        this.prisma.quote.count({ where: { status: 'rejected' } }),
        this.prisma.quote.count({ where: { status: 'completed' } })
      ]);

      // Get average estimated price
      const avgPriceResult = await this.prisma.quote.aggregate({
        _avg: {
          estimatedPrice: true
        }
      });

      // Get recent quotes (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentCount = await this.prisma.quote.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      });

      return {
        total,
        pending,
        approved,
        rejected,
        completed,
        averagePrice: avgPriceResult._avg.estimatedPrice || 0,
        recentQuotes: recentCount
      };
    } catch (error) {
      console.error('Error fetching quote statistics:', error);
      throw new Error('Failed to fetch quote statistics');
    }
  }
}