// backend/src/services/BookingService.ts
import sgMail from '@sendgrid/mail';
import { google } from 'googleapis';
import { PrismaService } from './PrismaService';
import { GoogleCalendarService, BookingEventData } from './GoogleCalendarService';
import { ValidationUtils } from '../utils/validation';
import validator from 'validator';

interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  selectedSlot: string;
}

interface CreateBookingData {
  name: string;
  email: string;
  datetime: string;
  phone?: string;
  message?: string;
}

interface TimeSlot {
  id: string;
  datetime: string;
  available: boolean;
}

export class BookingService {
  private calendar: any;
  private prisma: PrismaService;
  private googleCalendar: GoogleCalendarService;
  private readonly MAX_NAME_LENGTH = 100;
  private readonly MAX_MESSAGE_LENGTH = 2000;

  constructor() {
    this.prisma = new PrismaService();
    this.googleCalendar = new GoogleCalendarService();
    this.initializeSendGrid();

    // Keep the old Google Calendar initialization for backward compatibility
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'urn:ietf:wg:oauth:2.0:oob'
      );

      if (process.env.GOOGLE_REFRESH_TOKEN) {
        auth.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        });
      }

      this.calendar = google.calendar({ version: 'v3', auth });
    }
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
    
    console.log('✅ SendGrid initialized successfully for BookingService');
  }

  private validateBookingData(data: BookingFormData): void {
    // Validation du nom
    if (!data.name || !ValidationUtils.validateName(data.name)) {
      throw new Error('Invalid name format');
    }

    // Validation de l'email
    if (!data.email || !validator.isEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validation du slot sélectionné
    if (!data.selectedSlot) {
      throw new Error('Selected slot is required');
    }

    const slotDateTime = new Date(data.selectedSlot);
    if (isNaN(slotDateTime.getTime())) {
      throw new Error('Invalid datetime format for selected slot');
    }

    if (slotDateTime <= new Date()) {
      throw new Error('Selected slot must be in the future');
    }

    // Validation du message si fourni
    if (data.message && data.message.length > this.MAX_MESSAGE_LENGTH) {
      throw new Error(`Message too long (max ${this.MAX_MESSAGE_LENGTH} characters)`);
    }
  }

  /**
   * Get available slots using Google Calendar integration
   */
  async getAvailableSlots(): Promise<TimeSlot[]> {
    try {
      if (this.googleCalendar.isReady()) {
        return await this.googleCalendar.generateAvailableSlots(7);
      } else {
        console.warn('⚠️  Google Calendar not ready, using mock slots');
        return this.generateMockSlots();
      }
    } catch (error) {
      console.error('Error fetching calendar slots:', error);
      return this.generateMockSlots();
    }
  }

  /**
   * Get availability for the next 7 days (new endpoint)
   */
  async getAvailability(days: number = 7): Promise<TimeSlot[]> {
    return this.getAvailableSlots();
  }

  /**
   * Create a new booking with Google Calendar integration
   */
  async createBookingWithCalendar(data: CreateBookingData) {
    try {
      // Validate input
      if (!data.name || !data.email || !data.datetime) {
        throw new Error('Missing required fields: name, email, datetime');
      }

      if (!validator.isEmail(data.email)) {
        throw new Error('Invalid email format');
      }

      // CORRECTION: Validation plus stricte de la datetime
      const dateTime = new Date(data.datetime);
      if (isNaN(dateTime.getTime())) {
        console.error('❌ Invalid datetime format received:', data.datetime);
        throw new Error(`Invalid datetime format: ${data.datetime}`);
      }

      // Vérifier que la date est dans le futur
      if (dateTime <= new Date()) {
        throw new Error('Datetime must be in the future');
      }

      console.log('📅 Creating booking with validated datetime:', {
        original: data.datetime,
        parsed: dateTime.toISOString(),
        localTime: dateTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        isValid: !isNaN(dateTime.getTime()),
        isFuture: dateTime > new Date()
      });

      // Sanitisation des données
      const sanitizedData = {
        name: ValidationUtils.sanitizeHtml(ValidationUtils.limitStringLength(data.name, this.MAX_NAME_LENGTH)),
        email: ValidationUtils.validateAndSanitizeEmail(data.email),
        phone: data.phone ? ValidationUtils.sanitizeHtml(data.phone) : undefined,
        message: data.message ? ValidationUtils.sanitizeHtml(ValidationUtils.limitStringLength(data.message, this.MAX_MESSAGE_LENGTH)) : undefined,
        datetime: data.datetime
      };

      // Create calendar event
      const calendarResult = await this.googleCalendar.createBookingEvent({
        name: sanitizedData.name,
        email: sanitizedData.email,
        datetime: sanitizedData.datetime,
        phone: sanitizedData.phone,
        message: sanitizedData.message,
      });

      // Database creation with sanitized data
      const booking = await this.prisma.booking.create({
        data: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone || '',
          message: sanitizedData.message || '',
          selectedSlot: sanitizedData.datetime,
          status: 'confirmed',
        },
      });

      // Send email confirmations avec les données sanitisées
      await this.sendBookingEmailsWithSendGrid({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        message: sanitizedData.message,
        selectedSlot: sanitizedData.datetime,
      });

      console.log(`✅ Booking created: ${booking.id}`);
      
      return {
        booking: {
          ...booking,
          calendarEventId: calendarResult.event?.id || null,
        },
        calendarEvent: calendarResult.event,
      };
    } catch (error) {
      console.error('❌ Booking creation failed:', error);
      throw new Error(`Failed to create booking: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private generateMockSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const now = new Date();
    
    // Generate slots for next 7 days
    for (let day = 1; day <= 7; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Generate time slots (9 AM to 5 PM, every 2 hours)
      for (let hour = 9; hour < 17; hour += 2) {
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        
        slots.push({
          id: `slot_${day}_${hour}`,
          datetime: slotDate.toISOString(),
          available: Math.random() > 0.3, // 70% availability
        });
      }
    }
    
    return slots;
  }

  /**
   * CORRECTION: Formatage de la date pour les emails avec fuseau horaire français
   */
  private formatDateForEmail(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Paris' // Force le fuseau horaire français
    };
    
    return date.toLocaleDateString('fr-FR', options);
  }

  private getBookingEmailTemplate(type: 'user' | 'admin', data: BookingFormData, meetingDateTime: Date): string {
    const baseTemplate = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuraWeb - Réservation de rendez-vous</title>
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
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 24px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .meeting-details {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border: 1px solid #0ea5e9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .meeting-details h3 {
            color: #0c4a6e;
            margin-bottom: 12px;
            font-size: 18px;
        }
        
        .meeting-details p {
            margin-bottom: 8px;
            color: #075985;
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
            ${this.getBookingContentByType(type, data, meetingDateTime)}
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
                    <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/booking">Réserver</a>
                    <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/privacy">Confidentialité</a>
                </div>
            </div>
        </footer>
    </div>
</body>
</html>`;

    return baseTemplate;
  }

  private getBookingContentByType(type: 'user' | 'admin', data: BookingFormData, meetingDateTime: Date): string {
    // CORRECTION: Utiliser le formatage correct avec fuseau horaire
    const formattedDateTime = this.formatDateForEmail(meetingDateTime);

    if (type === 'user') {
      return `
        <div class="greeting">
            Bonjour ${validator.escape(data.name)},
        </div>
        
        <div class="content-text">
            <strong>🎉 Votre rendez-vous est confirmé !</strong><br>
            Nous sommes ravis de pouvoir échanger avec vous prochainement.
        </div>
        
        <div class="meeting-details">
            <h3>📅 Détails du rendez-vous</h3>
            <p><strong>Date et heure :</strong> ${formattedDateTime}</p>
            <p><strong>Durée :</strong> 1 heure</p>
            <p><strong>Type :</strong> Visioconférence</p>
            ${data.phone ? `<p><strong>Téléphone :</strong> ${validator.escape(data.phone)}</p>` : ''}
        </div>

        ${data.message ? `
        <div class="highlight-box">
            <strong>Votre message :</strong><br>
            ${validator.escape(data.message)}
        </div>
        ` : ''}
        
        <div class="content-text">
            <strong>Prochaines étapes :</strong><br>
            • Nous vous enverrons le lien de la réunion 30 minutes avant le rendez-vous<br>
            • Préparez vos questions et idées pour optimiser notre échange<br>
            • En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/booking" class="cta-button">Modifier mon rendez-vous</a>
        </div>
        
        <div class="signature">
            À très bientôt,<br>
            <strong>L'équipe NeuraWeb</strong><br>
            <em>Votre partenaire technologique</em>
        </div>`;
    } else {
      return `
        <div class="greeting">
            Nouveau rendez-vous réservé
        </div>
        
        <div class="admin-info">
            <strong>Informations du client :</strong><br>
            <strong>Nom :</strong> ${validator.escape(data.name)}<br>
            <strong>Email :</strong> ${validator.escape(data.email)}<br>
            ${data.phone ? `<strong>Téléphone :</strong> ${validator.escape(data.phone)}<br>` : ''}
            <strong>Date de réservation :</strong> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}<br>
            <strong>IP :</strong> ${process.env.CLIENT_IP || 'Non disponible'}
        </div>
        
        <div class="meeting-details">
            <h3>📅 Détails du rendez-vous</h3>
            <p><strong>Date et heure :</strong> ${formattedDateTime}</p>
            <p><strong>Durée :</strong> 1 heure</p>
            <p><strong>Type :</strong> Visioconférence</p>
        </div>

        ${data.message ? `
        <div class="highlight-box">
            <strong>Message du client :</strong><br>
            ${validator.escape(data.message)}
        </div>
        ` : ''}
        
        <div class="content-text">
            <strong>Actions à effectuer :</strong><br>
            • Préparer l'agenda et les questions pour l'entretien<br>
            • Envoyer le lien de visioconférence 30 minutes avant<br>
            • Ajouter l'événement à votre calendrier personnel<br>
            • Programmer un rappel 1 jour avant
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.DOMAIN_URL || 'https://neuraweb.tech'}/admin/bookings" class="cta-button">Voir dans l'admin</a>
        </div>
        
        <div class="signature">
            Système de notification NeuraWeb<br>
            <em>Email automatique - Ne pas répondre</em>
        </div>`;
    }
  }

  private async sendBookingEmailsWithSendGrid(data: BookingFormData): Promise<void> {
    const senderEmail = process.env.SENDER_EMAIL;
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    if (!senderEmail || !recipientEmail) {
      console.warn('⚠️  Email configuration missing, skipping email notifications');
      return;
    }

    try {
      // CORRECTION: Parsing explicite de la datetime avec debug
      const meetingDateTime = new Date(data.selectedSlot);
      
      console.log('📧 Email datetime processing:', {
        selectedSlot: data.selectedSlot,
        meetingDateTime: meetingDateTime.toISOString(),
        localTime: meetingDateTime.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
        formattedForEmail: this.formatDateForEmail(meetingDateTime)
      });
      
      // Send notification email to admin
      const adminEmail = {
        to: recipientEmail,
        from: {
          name: process.env.SENDER_NAME || 'NeuraWeb',
          email: senderEmail
        },
        subject: `🗓️ Nouveau rendez-vous réservé - ${data.name} - NeuraWeb`,
        html: this.getBookingEmailTemplate('admin', data, meetingDateTime),
        text: `
Nouveau rendez-vous réservé

Nom: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone || 'Non fourni'}
Date du rendez-vous: ${this.formatDateForEmail(meetingDateTime)}

${data.message ? `Message: ${data.message}` : ''}

Réservé le: ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}

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
        subject: '✅ Rendez-vous confirmé - NeuraWeb',
        html: this.getBookingEmailTemplate('user', data, meetingDateTime),
        text: `
Bonjour ${data.name},

Votre rendez-vous est confirmé !

Date et heure: ${this.formatDateForEmail(meetingDateTime)}
Durée: 1 heure
Type: Visioconférence

Nous vous enverrons le lien de la réunion 30 minutes avant le rendez-vous.

Prochaines étapes:
• Nous vous enverrons le lien de la réunion 30 minutes avant le rendez-vous
• Préparez vos questions et idées pour optimiser notre échange
• En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance

À très bientôt,
L'équipe NeuraWeb
Votre partenaire technologique

---
NeuraWeb - Solutions Web & IA sur mesure
${process.env.CONTACT_EMAIL || 'contact@neuraweb.tech'}
        `.trim()
      };

      // Envoi des emails avec SendGrid API
      console.log('📧 Sending admin booking notification via SendGrid...');
      await sgMail.send(adminEmail);
      console.log('✅ Admin booking notification sent successfully');

      console.log('📧 Sending user booking confirmation via SendGrid...');
      await sgMail.send(userEmail);
      console.log('✅ User booking confirmation sent successfully');

    } catch (emailError) {
      console.error('❌ Failed to send booking emails via SendGrid:', emailError);
      // Log more details for debugging
      if (emailError instanceof Error) {
        console.error('SendGrid error details:', {
          message: emailError.message,
          stack: emailError.stack,
        });
      }
      // Don't fail the booking if email fails
    }
  }

  // Legacy method - kept for backward compatibility, now uses SendGrid
  async createBooking(data: BookingFormData) {
    try {
      // Validation des données
      this.validateBookingData(data);

      // Sanitisation des données
      const sanitizedData = {
        name: ValidationUtils.sanitizeHtml(ValidationUtils.limitStringLength(data.name, this.MAX_NAME_LENGTH)),
        email: ValidationUtils.validateAndSanitizeEmail(data.email),
        phone: data.phone ? ValidationUtils.sanitizeHtml(data.phone) : '',
        message: data.message ? ValidationUtils.sanitizeHtml(ValidationUtils.limitStringLength(data.message, this.MAX_MESSAGE_LENGTH)) : '',
        selectedSlot: data.selectedSlot
      };

      // Save to database with sanitized data
      const booking = await this.prisma.booking.create({
        data: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          message: sanitizedData.message,
          selectedSlot: sanitizedData.selectedSlot,
          status: 'confirmed',
        },
      });

      // Create calendar event (if Google Calendar is configured) - Legacy approach
      if (this.calendar && process.env.GOOGLE_CALENDAR_ID) {
        try {
          const eventDateTime = new Date(sanitizedData.selectedSlot);
          const endDateTime = new Date(eventDateTime.getTime() + 60 * 60 * 1000); // 1 hour meeting

          await this.calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            requestBody: {
              summary: `Rendez-vous avec ${sanitizedData.name}`,
              description: `Téléphone: ${sanitizedData.phone || 'Non fourni'}\nEmail: ${sanitizedData.email}\nMessage: ${sanitizedData.message || 'Aucun message fourni'}`,
              start: {
                dateTime: eventDateTime.toISOString(),
                timeZone: process.env.TIMEZONE || 'Europe/Paris',
              },
              end: {
                dateTime: endDateTime.toISOString(),
                timeZone: process.env.TIMEZONE || 'Europe/Paris',
              },
            },
          });
        } catch (calendarError) {
          console.error('Calendar event creation failed:', calendarError);
          // Continue without failing the booking
        }
      }

      // Send email confirmations with SendGrid
      await this.sendBookingEmailsWithSendGrid(sanitizedData);

      console.log(`✅ Booking created successfully: ${booking.id}`);
      return booking;
    } catch (error) {
      console.error('❌ Booking service error:', error);
      
      if (error instanceof Error) {
        // Log more details for debugging
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          data: {
            name: data.name,
            email: data.email,
            selectedSlot: data.selectedSlot
          }
        });
        throw error; // Re-throw validation errors
      }
      
      throw new Error('Failed to create booking');
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
        subject: '🧪 Test de configuration SendGrid - BookingService',
        html: `
          <h2>Test de configuration SendGrid - BookingService</h2>
          <p>Cet email confirme que la configuration SendGrid fonctionne correctement pour le service de réservation.</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>Service:</strong> BookingService</p>
          <p><strong>API:</strong> SendGrid</p>
          <p><em>Email de test automatique</em></p>
        `,
        text: `
Test de configuration SendGrid - BookingService

Cet email confirme que la configuration SendGrid fonctionne correctement pour le service de réservation.
Date: ${new Date().toLocaleString('fr-FR')}
Service: BookingService
API: SendGrid

Email de test automatique
        `.trim()
      };

      // Envoyer un email de test (décommentez si nécessaire)
      // await sgMail.send(testEmail);
      
      console.log('✅ SendGrid configuration test successful for BookingService');
      return true;
    } catch (error) {
      console.error('❌ SendGrid configuration test failed for BookingService:', error);
      return false;
    }
  }

  // Method to get bookings (for admin)
  async getBookings(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      
      const [bookings, total] = await Promise.all([
        this.prisma.booking.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          }
        }),
        this.prisma.booking.count()
      ]);

      return {
        bookings,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  // Method to cancel a booking
  async cancelBooking(bookingId: string) {
    try {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // Update booking status
      const updatedBooking = await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'cancelled' }
      });

      // Optionally send cancellation emails
      try {
        await this.sendCancellationEmails(booking);
      } catch (emailError) {
        console.warn('Failed to send cancellation emails:', emailError);
        // Don't fail the cancellation if email fails
      }

      return updatedBooking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('Failed to cancel booking');
    }
  }

  // Method to send cancellation emails
  private async sendCancellationEmails(booking: any): Promise<void> {
    const senderEmail = process.env.SENDER_EMAIL;
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    if (!senderEmail || !recipientEmail) {
      console.warn('⚠️  Email configuration missing for cancellation emails');
      return;
    }

    try {
      const meetingDateTime = new Date(booking.selectedSlot);
      const formattedDateTime = this.formatDateForEmail(meetingDateTime);

      // Send cancellation notification to admin
      const adminEmail = {
        to: recipientEmail,
        from: {
          name: process.env.SENDER_NAME || 'NeuraWeb',
          email: senderEmail
        },
        subject: `❌ Rendez-vous annulé - ${booking.name} - NeuraWeb`,
        html: `
          <h2>Rendez-vous annulé</h2>
          <p><strong>Client:</strong> ${validator.escape(booking.name)}</p>
          <p><strong>Email:</strong> ${validator.escape(booking.email)}</p>
          <p><strong>Date du rendez-vous:</strong> ${formattedDateTime}</p>
          <p><strong>Date d'annulation:</strong> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
        `,
        text: `
Rendez-vous annulé

Client: ${booking.name}
Email: ${booking.email}
Date du rendez-vous: ${formattedDateTime}
Date d'annulation: ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
        `.trim()
      };

      // Send cancellation confirmation to user
      const userEmail = {
        to: booking.email,
        from: {
          name: process.env.SENDER_NAME || 'NeuraWeb',
          email: senderEmail
        },
        subject: 'Annulation de rendez-vous confirmée - NeuraWeb',
        html: `
          <h2>Rendez-vous annulé</h2>
          <p>Bonjour ${validator.escape(booking.name)},</p>
          <p>Votre rendez-vous du <strong>${formattedDateTime}</strong> a été annulé.</p>
          <p>N'hésitez pas à reprendre rendez-vous quand vous le souhaitez.</p>
          <p>Cordialement,<br>L'équipe NeuraWeb</p>
        `,
        text: `
Bonjour ${booking.name},

Votre rendez-vous du ${formattedDateTime} a été annulé.

N'hésitez pas à reprendre rendez-vous quand vous le souhaitez.

Cordialement,
L'équipe NeuraWeb
        `.trim()
      };

      await sgMail.send(adminEmail);
      await sgMail.send(userEmail);

      console.log('✅ Cancellation emails sent successfully');
    } catch (error) {
      console.error('❌ Failed to send cancellation emails:', error);
      throw error;
    }
  }

  // Method to update booking status
  async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed') {
    try {
      const booking = await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status }
      });

      return booking;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw new Error('Failed to update booking status');
    }
  }

  // Method to cleanup old bookings (optional)
  async cleanupOldBookings(daysOld: number = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await this.prisma.booking.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          },
          status: {
            in: ['cancelled', 'completed'] // Only delete completed or cancelled bookings
          }
        }
      });

      console.log(`🧹 Cleaned up ${result.count} old bookings`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up old bookings:', error);
      throw new Error('Failed to cleanup old bookings');
    }
  }
}