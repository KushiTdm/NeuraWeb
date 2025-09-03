// backend/src/services/GoogleCalendarService.ts
import { google } from 'googleapis';

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
}

export interface BookingEventData {
  name: string;
  email: string;
  datetime: string;
  phone?: string;
  message?: string;
}

export interface TimeSlot {
  id: string;
  datetime: string;
  available: boolean;
}

// Type for Google API errors
interface GoogleApiError {
  name?: string;
  message?: string;
  code?: number | string;
  status?: number;
  statusText?: string;
  details?: any;
}

export class GoogleCalendarService {
  private calendar: any;
  private auth: any;
  private isConfigured: boolean = false;

  constructor() {
    this.initializeGoogleCalendar();
  }

  private initializeGoogleCalendar(): void {
    console.log('🔧 Initializing Google Calendar service...');
    
    try {
      // Debug: Log environment variables (safely)
      console.log('📋 Environment check:');
      console.log('  - GOOGLE_CLIENT_EMAIL:', process.env.GOOGLE_CLIENT_EMAIL ? '✅ Present' : '❌ Missing');
      console.log('  - GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? '✅ Present' : '❌ Missing');
      console.log('  - GOOGLE_CALENDAR_ID:', process.env.GOOGLE_CALENDAR_ID ? '✅ Present' : '❌ Missing');
      
      // Check if all required environment variables are present
      const requiredEnvVars = [
        'GOOGLE_CLIENT_EMAIL',
        'GOOGLE_PRIVATE_KEY',
        'GOOGLE_CALENDAR_ID'
      ];

      const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missingVars.length > 0) {
        console.warn(`⚠️  Google Calendar not configured. Missing environment variables: ${missingVars.join(', ')}`);
        return;
      }

      // Debug: Validate email format
      const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
      if (!clientEmail?.includes('@') || !clientEmail?.includes('.iam.gserviceaccount.com')) {
        console.error('❌ GOOGLE_CLIENT_EMAIL format invalid. Should be: service-account@project-id.iam.gserviceaccount.com');
        return;
      }

      // Debug: Validate private key format
      const privateKey = process.env.GOOGLE_PRIVATE_KEY;
      if (!privateKey?.includes('BEGIN PRIVATE KEY') || !privateKey?.includes('END PRIVATE KEY')) {
        console.error('❌ GOOGLE_PRIVATE_KEY format invalid. Should start with -----BEGIN PRIVATE KEY-----');
        return;
      }

      // Debug: Clean and validate private key
      const cleanPrivateKey = privateKey.replace(/\\n/g, '\n').trim();
      console.log('🔑 Private key cleaning:');
      console.log('  - Original contains \\n:', privateKey.includes('\\n') ? '✅ Yes' : '❌ No');
      console.log('  - Cleaned contains \\n:', cleanPrivateKey.includes('\n') ? '✅ Yes' : '❌ No');
      console.log('  - Starts with BEGIN:', cleanPrivateKey.startsWith('-----BEGIN PRIVATE KEY-----') ? '✅ Yes' : '❌ No');
      console.log('  - Ends with END:', cleanPrivateKey.endsWith('-----END PRIVATE KEY-----') ? '✅ Yes' : '❌ No');

      // Initialize Google Auth with Service Account
      console.log('🔐 Creating Google Auth...');
      this.auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: clientEmail,
          private_key: cleanPrivateKey,
        },
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      console.log('📅 Creating Calendar client...');
      this.calendar = google.calendar({ version: 'v3', auth: this.auth });
      
      // Test the connection
      this.testConnection();
      
      this.isConfigured = true;
      console.log('✅ Google Calendar service initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Google Calendar service:', error);
      const apiError = error as GoogleApiError;
      console.error('Error details:', {
        name: apiError?.name,
        message: apiError?.message,
        code: apiError?.code
      });
      this.isConfigured = false;
    }
  }

  /**
   * Test the Google Calendar connection
   */
  private async testConnection(): Promise<void> {
    if (!this.calendar) {
      console.error('❌ Calendar client not initialized');
      return;
    }

    try {
      console.log('🧪 Testing Google Calendar connection...');
      
      // Test 1: Get calendar info
      console.log('📋 Test 1: Getting calendar info...');
      const calendarInfo = await this.calendar.calendars.get({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
      });
      
      console.log('✅ Calendar info retrieved:', {
        summary: calendarInfo.data.summary,
        timeZone: calendarInfo.data.timeZone,
        accessRole: calendarInfo.data
      });

      // Test 2: List recent events
      console.log('📋 Test 2: Listing recent events...');
      const eventsResponse = await this.calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: new Date().toISOString(),
        maxResults: 5,
        singleEvents: true,
        orderBy: 'startTime',
      });

      console.log('✅ Events retrieved:', {
        count: eventsResponse.data.items?.length || 0,
        nextSyncToken: eventsResponse.data.nextSyncToken ? 'Present' : 'Not present'
      });

      console.log('🎉 Google Calendar connection test successful!');
      
    } catch (error) {
      console.error('❌ Google Calendar connection test failed:', error);
      const apiError = error as GoogleApiError;
      console.error('Error details:', {
        name: apiError?.name,
        message: apiError?.message,
        code: apiError?.code,
        status: apiError?.status,
        statusText: apiError?.statusText
      });

      // Specific error handling
      if (apiError?.code === 403) {
        console.error('🚫 Permission denied. Check that:');
        console.error('  1. Service account has access to the calendar');
        console.error('  2. Calendar ID is correct');
        console.error('  3. Service account email is added to calendar sharing');
      } else if (apiError?.code === 404) {
        console.error('🔍 Calendar not found. Check that:');
        console.error('  1. GOOGLE_CALENDAR_ID is correct');
        console.error('  2. Calendar exists and is accessible');
      } else if (apiError?.code === 401) {
        console.error('🔑 Authentication failed. Check that:');
        console.error('  1. Service account credentials are correct');
        console.error('  2. Private key is properly formatted');
        console.error('  3. Service account is enabled');
      }
      
      this.isConfigured = false;
    }
  }

  /**
   * Check if Google Calendar is properly configured and tested
   */
  isReady(): boolean {
    const ready = this.isConfigured && !!this.calendar;
    if (!ready) {
      console.log('⚠️  Google Calendar not ready:', {
        isConfigured: this.isConfigured,
        hasCalendarClient: !!this.calendar
      });
    }
    return ready;
  }

  /**
   * Create a calendar event
   */
  async createBookingEvent(eventData: BookingEventData): Promise<{
    event: CalendarEvent | null;
    booking: BookingEventData;
  }> {
    console.log('📝 Creating booking event for:', eventData.name);
    console.log('📅 Received datetime:', eventData.datetime);
    
    if (!this.isReady()) {
      console.warn('⚠️  Google Calendar not configured, skipping event creation');
      return {
        event: null,
        booking: eventData,
      };
    }

    try {
      // VALIDATION DE LA DATE
      const startDateTime = new Date(eventData.datetime);
      
      // Vérifier si la date est valide
      if (isNaN(startDateTime.getTime())) {
        console.error('❌ Invalid datetime received:', eventData.datetime);
        throw new Error(`Invalid datetime format: ${eventData.datetime}`);
      }

      // Vérifier si la date est dans le futur
      if (startDateTime <= new Date()) {
        console.error('❌ Datetime is in the past:', startDateTime.toISOString());
        throw new Error('Cannot create events in the past');
      }

      console.log('✅ Parsed datetime:', startDateTime.toISOString());

      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration
      const eventSummary = `Meeting with ${eventData.name}`;

      console.log('📅 Event details:', {
        summary: eventSummary,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        timeZone: process.env.TIMEZONE || 'Europe/Paris',
        attendee: eventData.email,
        calendarId: process.env.GOOGLE_CALENDAR_ID
      });

      const eventPayload = {
        summary: eventSummary,
        description: this.buildEventDescription(eventData),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'Europe/Paris',
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'Europe/Paris',
        },
        attendees: [
          {
            email: eventData.email,
            displayName: eventData.name,
            responseStatus: 'needsAction'
          }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'popup', minutes: 30 }       // 30 minutes before
          ]
        }
      };

      console.log('🔄 Event payload to send:', JSON.stringify(eventPayload, null, 2));

      const response = await this.calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        requestBody: eventPayload,
        sendUpdates: 'all' // Send email notifications
      });

      console.log('✅ Calendar event created successfully:', {
        eventId: response.data.id,
        status: response.data.status,
        htmlLink: response.data.htmlLink,
        start: response.data.start,
        end: response.data.end
      });

      return {
        event: response.data,
        booking: eventData,
      };
    } catch (error) {
      console.error('❌ Failed to create calendar event:', error);
      const apiError = error as GoogleApiError;
      console.error('Error details:', {
        name: apiError?.name,
        message: apiError?.message,
        code: apiError?.code,
        status: apiError?.status,
        details: apiError?.details
      });
      
      throw new Error(`Failed to create calendar event: ${apiError?.message || 'Unknown error'}`);
    }
  }

  /**
   * Build event description based on booking data
   */
  private buildEventDescription(bookingData: BookingEventData): string {
    let description = `📧 Email: ${bookingData.email}\n`;
    
    if (bookingData.phone) {
      description += `📞 Phone: ${bookingData.phone}\n`;
    }
    if (bookingData.message) {
      description += `💬 Message: ${bookingData.message}\n`;
    }

    description += `\n⏰ Booked on: ${new Date().toLocaleString('fr-FR')}`;
    description += `\n🌐 Meeting Duration: 1 hour`;
    
    return description;
  }

  /**
   * Get events from Google Calendar for a specific date range
   */
  async getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    if (!this.isReady()) {
      console.warn('⚠️  Google Calendar not configured, returning empty events list');
      return [];
    }

    try {
      console.log('📋 Fetching calendar events:', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      const response = await this.calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items || [];
      console.log(`✅ Retrieved ${events.length} calendar events`);

      return events;
    } catch (error) {
      console.error('❌ Failed to fetch calendar events:', error);
      return [];
    }
  }

  /**
   * Check if a specific time slot is available in Google Calendar
   */
  async isSlotAvailable(datetime: string): Promise<boolean> {
    if (!this.isReady()) {
      return true; // If calendar not configured, assume all slots are available
    }

    try {
      const startTime = new Date(datetime);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration

      const events = await this.getCalendarEvents(startTime, endTime);
      
      // Check if there are any overlapping events
      const isAvailable = events.length === 0;
      console.log(`🔍 Slot availability check for ${datetime}: ${isAvailable ? 'Available' : 'Booked'}`);
      
      return isAvailable;
    } catch (error) {
      console.error('❌ Failed to check slot availability:', error);
      return true; // On error, assume slot is available
    }
  }

  /**
   * Get all booked time slots for the next N days
   */
  async getBookedSlots(days: number = 7): Promise<string[]> {
    if (!this.isReady()) {
      return [];
    }

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const events = await this.getCalendarEvents(startDate, endDate);
      
      const bookedSlots = events
        .filter(event => event.start?.dateTime)
        .map(event => event.start.dateTime);
        
      console.log(`📅 Found ${bookedSlots.length} booked slots in next ${days} days`);
      return bookedSlots;
    } catch (error) {
      console.error('❌ Failed to fetch booked slots:', error);
      return [];
    }
  }

  /**
   * Cancel/delete a calendar event
   */
  async cancelEvent(eventId: string): Promise<boolean> {
    if (!this.isReady()) {
      console.warn('⚠️  Google Calendar not configured, cannot cancel event');
      return false;
    }

    try {
      console.log('🗑️ Cancelling calendar event:', eventId);
      
      await this.calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        eventId,
        sendUpdates: 'all' // Send cancellation notifications
      });

      console.log(`✅ Calendar event cancelled: ${eventId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to cancel calendar event:', error);
      return false;
    }
  }

  /**
   * Update a calendar event
   */
  async updateEvent(eventId: string, updates: Partial<BookingEventData>): Promise<CalendarEvent | null> {
    if (!this.isReady()) {
      console.warn('⚠️  Google Calendar not configured, cannot update event');
      return null;
    }

    try {
      console.log('📝 Updating calendar event:', eventId, updates);
      
      // Get current event
      const currentEvent = await this.calendar.events.get({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        eventId
      });

      // Prepare updated event data
      const updatedEvent = {
        ...currentEvent.data,
        summary: updates.name ? `Meeting with ${updates.name}` : currentEvent.data.summary,
        description: updates.message ? this.buildEventDescription({
          name: updates.name || 'Updated Client',
          email: updates.email || 'updated@example.com',
          datetime: updates.datetime || currentEvent.data.start.dateTime,
          phone: updates.phone,
          message: updates.message
        }) : currentEvent.data.description
      };

      if (updates.datetime) {
        const startDateTime = new Date(updates.datetime);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
        
        updatedEvent.start = {
          dateTime: startDateTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'Europe/Paris'
        };
        updatedEvent.end = {
          dateTime: endDateTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'Europe/Paris'
        };
      }

      const response = await this.calendar.events.update({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        eventId,
        requestBody: updatedEvent,
        sendUpdates: 'all'
      });

      console.log(`✅ Calendar event updated: ${eventId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update calendar event:', error);
      return null;
    }
  }

  /**
   * Generate available time slots excluding booked ones
   */
  async generateAvailableSlots(days: number = 7): Promise<TimeSlot[]> {
    console.log(`🕒 Generating available slots for next ${days} days...`);
    
    const bookedSlots = await this.getBookedSlots(days);
    const bookedTimes = new Set(bookedSlots.map(slot => new Date(slot).getTime()));

    const slots: TimeSlot[] = [];
    const now = new Date();

    for (let day = 1; day <= days; day++) {
      const date = new Date(now);
      date.setDate(date.getDate() + day);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // Morning slots (9 AM, 11 AM)
      const morningSlots = [9, 11];
      // Afternoon slots (2 PM, 4 PM)
      const afternoonSlots = [14, 16];

      [...morningSlots, ...afternoonSlots].forEach(hour => {
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);

        // Skip slots in the past
        if (slotDate <= now) return;

        const slotTime = slotDate.getTime();
        const isBooked = bookedTimes.has(slotTime);

        slots.push({
          id: `slot_${day}_${hour}`,
          datetime: slotDate.toISOString(),
          available: !isBooked,
        });
      });
    }

    console.log(`✅ Generated ${slots.length} slots (${slots.filter(s => s.available).length} available, ${slots.filter(s => !s.available).length} booked)`);
    return slots;
  }

  /**
   * Get upcoming events for a specific number of days
   */
  async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return this.getCalendarEvents(startDate, endDate);
  }

  /**
   * Search events by attendee email
   */
  async findEventsByEmail(email: string, days: number = 30): Promise<CalendarEvent[]> {
    if (!this.isReady()) {
      return [];
    }

    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);

      const events = await this.getCalendarEvents(startDate, endDate);
      
      return events.filter(event => 
        event.description?.includes(email)
      );
    } catch (error) {
      console.error('❌ Failed to search events by email:', error);
      return [];
    }
  }
}