// backend/src/services/QuoteService.ts
import nodemailer from 'nodemailer';
import { PrismaService } from './PrismaService';
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
  private transporter!: nodemailer.Transporter;
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
    this.initializeTransporter();
  }

  private initializeTransporter(): void {
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      }
    };

    this.transporter = nodemailer.createTransport(smtpConfig);

    // Vérifier la configuration SMTP
    this.verifyTransporter();
  }

  private async verifyTransporter(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP configuration is valid for QuoteService');
    } catch (error) {
      console.error('❌ SMTP configuration error in QuoteService:', error);
    }
  }

  private getQuoteEmailTemplate(type: 'user' | 'admin', data: QuoteFormData): string {
    const serviceTypeLabels = {
      showcase: 'Site Vitrine',
      ecommerce: 'Plateforme E-commerce',
      automation: 'Bot d\'Automatisation',
      ai: 'Intégration IA',
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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .email-header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 24px; text-align: center; }
        .logo { height: 56px; width: auto; object-fit: contain; }
        .company-name { color: #ffffff; font-size: 24px; font-weight: bold; margin: 12px 0 0 0; }
        .company-tagline { color: rgba(255, 255, 255, 0.8); font-size: 14px; margin: 8px 0 0 0; }
        .email-content { padding: 32px 24px; }
        .greeting { font-size: 18px; color: #1f2937; margin-bottom: 20px; font-weight: 500; }
        .content-text { font-size: 16px; line-height: 1.8; color: #4b5563; margin-bottom: 20px; }
        .highlight-box { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-left: 4px solid #10b981; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0; }
        .quote-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .quote-details h3 { color: #1f2937; margin-bottom: 12px; }
        .quote-details p { margin-bottom: 8px; }
        .price-highlight { background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); border: 2px solid #f59e0b; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .price-highlight .price { font-size: 24px; font-weight: bold; color: #92400e; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; }
        .signature { margin-top: 32px; color: #4b5563; font-size: 16px; }
        .email-footer { background-color: #111827; color: #ffffff; padding: 24px; text-align: center; }
        .footer-text { font-size: 14px; color: #9ca3af; margin-bottom: 16px; }
        .admin-info { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 8px; }
        .admin-info strong { color: #92400e; }
        .options-list { background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0; }
        .options-list ul { list-style-type: none; }
        .options-list li { padding: 4px 0; color: #4b5563; }
        .options-list li:before { content: "✓"; color: #10b981; font-weight: bold; margin-right: 8px; }
    </style>
</head>
<body>
    <div class="email-container">
        <header class="email-header">
            <img src="${process.env.DOMAIN_URL || 'https://votre-domaine.fr'}/assets/neurawebW.png" alt="NeuraWeb Logo" class="logo">
            <h1 class="company-name">NeuraWeb</h1>
            <p class="company-tagline">Solutions Web & IA sur mesure</p>
        </header>
        
        <main class="email-content">
            ${this.getQuoteContentByType(type, data, serviceTypeLabels, optionLabels)}
        </main>
        
        <footer class="email-footer">
            <p class="footer-text">© 2025 NeuraWeb. Tous droits réservés.</p>
            <p class="footer-text">
                <a href="${process.env.DOMAIN_URL}/contact" style="color: #9ca3af;">Contact</a> |
                <a href="${process.env.DOMAIN_URL}/quote" style="color: #9ca3af;">Devis</a>
            </p>
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
            <a href="${process.env.DOMAIN_URL}/booking" class="cta-button">Planifier un appel</a>
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
            <strong>Date de demande :</strong> ${new Date().toLocaleString('fr-FR')}
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
            <p><small>*À analyser et ajuster selon les besoins</small></p>
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
            • Préparer un devis personnalisé<br>
            • Contacter le client dans les 24h<br>
            • Planifier un appel de découverte
        </div>
        
        <div class="signature">
            Système de notification NeuraWeb<br>
            <small>${new Date().toLocaleString('fr-FR')}</small>
        </div>`;
    }
  }

  async createQuote(data: QuoteFormData) {
    try {
      // Save to database
      const quote = await this.prisma.quote.create({
        data: {
          name: data.name,
          email: data.email,
          serviceType: data.serviceType,
          options: data.options,
          message: data.message || '',
          estimatedPrice: data.estimatedPrice,
          status: 'pending',
        },
      });

      // Send email notifications if SMTP is configured
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.FROM_EMAIL) {
        try {
          // Send notification to admin
          await this.transporter.sendMail({
            from: `"NeuraWeb" <${process.env.FROM_EMAIL}>`,
            to: process.env.FROM_EMAIL,
            subject: `Nouvelle demande de devis - ${data.name}`,
            html: this.getQuoteEmailTemplate('admin', data),
          });

          // Send confirmation to user
          await this.transporter.sendMail({
            from: `"NeuraWeb" <${process.env.FROM_EMAIL}>`,
            to: data.email,
            subject: 'Votre demande de devis - NeuraWeb',
            html: this.getQuoteEmailTemplate('user', data),
          });

          console.log('✅ Quote emails sent successfully');
        } catch (emailError) {
          console.error('❌ Failed to send quote emails:', emailError);
          // Continue without throwing error - quote is still saved
        }
      } else {
        console.warn('⚠️ SMTP not configured, emails not sent');
      }

      return quote;
    } catch (error) {
      console.error('Quote service error:', error);
      throw new Error('Failed to process quote request');
    }
  }

  async getQuotes() {
    try {
      return await this.prisma.quote.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching quotes:', error);
      throw new Error('Failed to fetch quotes');
    }
  }

  async getQuoteById(id: string) {
    try {
      return await this.prisma.quote.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw new Error('Failed to fetch quote');
    }
  }

  async updateQuoteStatus(id: string, status: string) {
    try {
      return await this.prisma.quote.update({
        where: { id },
        data: { status }
      });
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw new Error('Failed to update quote status');
    }
  }
}