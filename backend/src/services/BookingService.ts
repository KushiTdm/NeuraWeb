// backend/src/services/BookingService.ts
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { PrismaService } from './PrismaService';
import { GoogleCalendarService, BookingEventData } from './GoogleCalendarService';
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
  private transporter!: nodemailer.Transporter;
  private prisma: PrismaService;
  private googleCalendar: GoogleCalendarService;

  constructor() {
    this.prisma = new PrismaService();
    this.googleCalendar = new GoogleCalendarService();
    this.initializeTransporter();

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

    // Verify the SMTP configuration
    this.verifyTransporter();
  }

  private async verifyTransporter(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP configuration is valid for BookingService');
    } catch (error) {
      console.error('❌ SMTP configuration error in BookingService:', error);
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

      // Create calendar event
      const calendarResult = await this.googleCalendar.createBookingEvent({
        name: data.name,
        email: data.email,
        datetime: data.datetime,
        phone: data.phone,
        message: data.message,
      });

      // Database creation
      const booking = await this.prisma.booking.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          message: data.message || '',
          selectedSlot: data.datetime,
          status: 'confirmed',
        },
      });

      // Send email confirmations avec la datetime correcte
      await this.sendBookingEmails({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        selectedSlot: data.datetime,
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
        .highlight-box { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0; }
        .meeting-details { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .meeting-details h3 { color: #1f2937; margin-bottom: 12px; }
        .meeting-details p { margin-bottom: 8px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 24px 0; }
        .signature { margin-top: 32px; color: #4b5563; font-size: 16px; }
        .email-footer { background-color: #111827; color: #ffffff; padding: 24px; text-align: center; }
        .footer-text { font-size: 14px; color: #9ca3af; margin-bottom: 16px; }
        .admin-info { background-color: #fef3c7; border: 1px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 8px; }
        .admin-info strong { color: #92400e; }
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
            ${this.getBookingContentByType(type, data, meetingDateTime)}
        </main>
        
        <footer class="email-footer">
            <p class="footer-text">© 2025 NeuraWeb. Tous droits réservés.</p>
            <p class="footer-text">
                <a href="${process.env.DOMAIN_URL}/contact" style="color: #9ca3af;">Contact</a> |
                <a href="${process.env.DOMAIN_URL}/booking" style="color: #9ca3af;">Réserver</a>
            </p>
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
            <a href="${process.env.DOMAIN_URL}/contact" class="cta-button">Nous contacter</a>
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
            <strong>Date de réservation :</strong> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
        </div>
        
        <div class="meeting-details">
            <h3>📅 Détails du rendez-vous</h3>
            <p><strong>Date et heure :</strong> ${formattedDateTime}</p>
            <p><strong>Durée :</strong> 1 heure</p>
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
            • Ajouter l'événement à votre calendrier personnel
        </div>
        
        <div style="text-align: center;">
            <a href="${process.env.DOMAIN_URL}/admin/bookings" class="cta-button">Voir dans l'admin</a>
        </div>
        
        <div class="signature">
            Système de notification NeuraWeb<br>
            <em>Email automatique - Ne pas répondre</em>
        </div>`;
    }
  }

  private async sendBookingEmails(data: BookingFormData): Promise<void> {
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
      
      const commonMailOptions = {
        from: {
          name: process.env.SENDER_NAME || 'NeuraWeb',
          address: senderEmail
        }
      };

      // Send notification to admin
      const adminMailOptions = {
        ...commonMailOptions,
        to: recipientEmail,
        subject: `🗓️ Nouveau rendez-vous réservé - ${data.name}`,
        html: this.getBookingEmailTemplate('admin', data, meetingDateTime),
        text: `
Nouveau rendez-vous réservé

Nom: ${data.name}
Email: ${data.email}
Téléphone: ${data.phone || 'Non fourni'}
Date du rendez-vous: ${this.formatDateForEmail(meetingDateTime)}

${data.message ? `Message: ${data.message}` : ''}

Réservé le: ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}
        `.trim()
      };

      // Send confirmation to user
      const userMailOptions = {
        ...commonMailOptions,
        to: data.email,
        subject: '✅ Rendez-vous confirmé - NeuraWeb',
        html: this.getBookingEmailTemplate('user', data, meetingDateTime),
        text: `
Bonjour ${data.name},

Votre rendez-vous est confirmé !

Date et heure: ${this.formatDateForEmail(meetingDateTime)}
Durée: 1 heure

Nous vous enverrons le lien de la réunion 30 minutes avant le rendez-vous.

Cordialement,
L'équipe NeuraWeb
        `.trim()
      };

      // Send emails
      await this.transporter.sendMail(adminMailOptions);
      console.log('✅ Admin booking notification sent');

      await this.transporter.sendMail(userMailOptions);
      console.log('✅ User booking confirmation sent');
    } catch (emailError) {
      console.error('❌ Failed to send booking emails:', emailError);
      // Don't fail the booking if email fails
    }
  }

  // Legacy method - kept for backward compatibility
  async createBooking(data: BookingFormData) {
    try {
      // Save to database
      const booking = await this.prisma.booking.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          message: data.message || '',
          selectedSlot: data.selectedSlot,
          status: 'confirmed',
        },
      });

      // Create calendar event (if Google Calendar is configured) - Legacy approach
      if (this.calendar && process.env.GOOGLE_CALENDAR_ID) {
        try {
          const eventDateTime = new Date(data.selectedSlot);
          const endDateTime = new Date(eventDateTime.getTime() + 60 * 60 * 1000); // 1 hour meeting

          await this.calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            requestBody: {
              summary: `Rendez-vous avec ${data.name}`,
              description: `Téléphone: ${data.phone || 'Non fourni'}\nEmail: ${data.email}\nMessage: ${data.message || 'Aucun message fourni'}`,
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

      // Send email confirmations
      await this.sendBookingEmails(data);

      console.log(`✅ Booking created successfully: ${booking.id}`);
      return booking;
    } catch (error) {
      console.error('❌ Booking service error:', error);
      throw new Error('Failed to create booking');
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

      return updatedBooking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw new Error('Failed to cancel booking');
    }
  }
}