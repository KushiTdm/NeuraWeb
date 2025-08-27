// backend/src/services/ContactService.ts
import { Resend } from 'resend';
import { PrismaService } from './PrismaService';
import { ValidationUtils } from '../utils/validation';
import validator from 'validator';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export class ContactService {
  private resend: Resend;
  private prisma: PrismaService;
  private readonly MAX_NAME_LENGTH = 100;
  private readonly MAX_MESSAGE_LENGTH = 2000;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.prisma = new PrismaService();
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

  async sendContactEmail(data: ContactFormData) {
    try {
      // Validation des données
      this.validateContactData(data);

      // Sanitisation des données
      const sanitizedData = {
        name: ValidationUtils.sanitizeHtml(ValidationUtils.limitStringLength(data.name, this.MAX_NAME_LENGTH)),
        email: ValidationUtils.validateAndSanitizeEmail(data.email),
        message: ValidationUtils.sanitizeHtml(ValidationUtils.limitStringLength(data.message, this.MAX_MESSAGE_LENGTH))
      };

      // Vérification anti-spam basique
      const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations'];
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

      // Send email notification avec données sanitisées
      if (senderEmail && recipientEmail) {
        await this.resend.emails.send({
          from: senderEmail,
          to: [recipientEmail],
          subject: `New Contact Form Submission from ${sanitizedData.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${validator.escape(sanitizedData.name)}</p>
            <p><strong>Email:</strong> ${validator.escape(sanitizedData.email)}</p>
            <p><strong>Message:</strong></p>
            <p>${validator.escape(sanitizedData.message)}</p>
            <hr>
            <p>Received at: ${new Date().toLocaleString()}</p>
          `,
        });

        // Send confirmation email to user
        await this.resend.emails.send({
          from: senderEmail,
          to: [sanitizedData.email],
          subject: 'Thank you for contacting NeuraWeb',
          html: `
            <h2>Thank you for contacting us!</h2>
            <p>Hi ${validator.escape(sanitizedData.name)},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            <p><strong>Your message:</strong></p>
            <p>${validator.escape(sanitizedData.message)}</p>
            <hr>
            <p>Best regards,<br>The NeuraWeb Team</p>
          `,
        });
      }

      return contact;
    } catch (error) {
      console.error('Contact service error:', error);
      if (error instanceof Error) {
        throw error; // Re-throw validation errors
      }
      throw new Error('Failed to process contact form');
    }
  }
}