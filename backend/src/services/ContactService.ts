import { Resend } from 'resend';
import { PrismaService } from './PrismaService';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export class ContactService {
  private resend: Resend;
  private prisma: PrismaService;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.prisma = new PrismaService();
  }
  
  async sendContactEmail(data: ContactFormData) {
    try {
      // Save to database
      const contact = await this.prisma.contact.create({
        data: {
          name: data.name,
          email: data.email,
          message: data.message,
          status: 'pending',
        },
      });
      const senderEmail = process.env.SENDER_EMAIL;
      const recipientEmail = process.env.RECIPIENT_EMAIL;

      // Send email notification
      if (senderEmail && recipientEmail) {
        await this.resend.emails.send({
          from: senderEmail,
          to: [recipientEmail], // Send to admin
          subject: `New Contact Form Submission from ${data.name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
            <hr>
            <p>Received at: ${new Date().toLocaleString()}</p>
          `,
        });

        // Send confirmation email to user
        await this.resend.emails.send({
          from: senderEmail,
          to: [data.email],
          subject: 'Thank you for contacting NeuraWeb',
          html: `
            <h2>Thank you for contacting us!</h2>
            <p>Hi ${data.name},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            <p><strong>Your message:</strong></p>
            <p>${data.message}</p>
            <hr>
            <p>Best regards,<br>The NeuraWeb Team</p>
          `,
        });
      }

      return contact;
    } catch (error) {
      console.error('Contact service error:', error);
      throw new Error('Failed to process contact form');
    }
  }
}