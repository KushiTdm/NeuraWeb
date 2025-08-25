import { google } from 'googleapis';
import { Resend } from 'resend';
import { PrismaService } from './PrismaService';

interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  selectedSlot: string;
}

interface TimeSlot {
  id: string;
  datetime: string;
  available: boolean;
}

export class BookingService {
  private calendar: any;
  private resend: Resend;
  private prisma: PrismaService;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.prisma = new PrismaService();

    // Initialize Google Calendar API
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

  async getAvailableSlots(): Promise<TimeSlot[]> {
    try {
      // For demo purposes, generate mock slots
      // In production, this would fetch from Google Calendar API
      return this.generateMockSlots();
    } catch (error) {
      console.error('Error fetching calendar slots:', error);
      return this.generateMockSlots();
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

      // Create calendar event (if Google Calendar is configured)
      if (this.calendar && process.env.GOOGLE_CALENDAR_ID) {
        try {
          const eventDateTime = new Date(data.selectedSlot);
          const endDateTime = new Date(eventDateTime.getTime() + 60 * 60 * 1000); // 1 hour meeting

          await this.calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID,
            requestBody: {
              summary: `Meeting with ${data.name}`,
              description: `Phone: ${data.phone || 'Not provided'}\nEmail: ${data.email}\nMessage: ${data.message || 'No message provided'}`,
              start: {
                dateTime: eventDateTime.toISOString(),
                timeZone: 'America/Toronto',
              },
              end: {
                dateTime: endDateTime.toISOString(),
                timeZone: 'America/Toronto',
              },
              attendees: [
                { email: data.email },
              ],
            },
          });
        } catch (calendarError) {
          console.error('Calendar event creation failed:', calendarError);
          // Continue without failing the booking
        }
      }

      // Send email confirmations
      if (process.env.RESEND_API_KEY && process.env.FROM_EMAIL) {
        const meetingDateTime = new Date(data.selectedSlot);
        
        // Send notification to admin
        await this.resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: [process.env.FROM_EMAIL],
          subject: `New Meeting Booked - ${data.name}`,
          html: `
            <h2>New Meeting Booking</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
            <p><strong>Meeting Time:</strong> ${meetingDateTime.toLocaleString()}</p>
            ${data.message ? `<p><strong>Message:</strong></p><p>${data.message}</p>` : ''}
            <hr>
            <p>Booked at: ${new Date().toLocaleString()}</p>
          `,
        });

        // Send confirmation to user
        await this.resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: [data.email],
          subject: 'Meeting Confirmation - NeuraWeb',
          html: `
            <h2>Meeting Confirmed!</h2>
            <p>Hi ${data.name},</p>
            <p>Your meeting has been successfully booked.</p>
            
            <h3>Meeting Details:</h3>
            <p><strong>Date & Time:</strong> ${meetingDateTime.toLocaleString()}</p>
            <p><strong>Duration:</strong> 1 hour</p>
            
            <p>We'll send you a meeting link closer to the scheduled time. If you need to reschedule or cancel, please contact us as soon as possible.</p>
            
            <p>Looking forward to speaking with you!</p>
            <hr>
            <p>Best regards,<br>The NeuraWeb Team</p>
          `,
        });
      }

      return booking;
    } catch (error) {
      console.error('Booking service error:', error);
      throw new Error('Failed to create booking');
    }
  }
}