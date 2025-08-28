// backend/src/services/QuoteService.ts
import { Resend } from 'resend';
import { PrismaService } from './PrismaService';

interface QuoteFormData {
  name: string;
  email: string;
  serviceType: string;
  options: string[];
  message?: string;
  estimatedPrice: number;
}

export class QuoteService {
  private resend: Resend;
  private prisma: PrismaService;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.prisma = new PrismaService();
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

      // Send email notifications
      if (process.env.RESEND_API_KEY && process.env.FROM_EMAIL) {
        const serviceTypeLabels = {
          showcase: 'Showcase Website',
          ecommerce: 'E-commerce Platform',
          automation: 'Automation Bot',
          ai: 'AI Integration',
        };

        const optionLabels = {
          design: 'Custom Design',
          maintenance: 'Maintenance Package',
          support: 'Priority Support',
        };

        // Send notification to admin
        await this.resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: [process.env.FROM_EMAIL],
          subject: `New Quote Request from ${data.name}`,
          html: `
            <h2>New Quote Request</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Service Type:</strong> ${serviceTypeLabels[data.serviceType as keyof typeof serviceTypeLabels]}</p>
            <p><strong>Additional Options:</strong> ${data.options.map(opt => optionLabels[opt as keyof typeof optionLabels]).join(', ') || 'None'}</p>
            <p><strong>Estimated Price:</strong> $${data.estimatedPrice.toLocaleString()}</p>
            ${data.message ? `<p><strong>Message:</strong></p><p>${data.message}</p>` : ''}
            <hr>
            <p>Received at: ${new Date().toLocaleString()}</p>
          `,
        });

        // Send confirmation to user
        await this.resend.emails.send({
          from: process.env.FROM_EMAIL,
          to: [data.email],
          subject: 'Your Quote Request - NeuraWeb',
          html: `
            <h2>Thank you for your quote request!</h2>
            <p>Hi ${data.name},</p>
            <p>We've received your quote request and will provide you with a detailed proposal within 24 hours.</p>
            
            <h3>Your Request Details:</h3>
            <p><strong>Service:</strong> ${serviceTypeLabels[data.serviceType as keyof typeof serviceTypeLabels]}</p>
            <p><strong>Additional Options:</strong> ${data.options.map(opt => optionLabels[opt as keyof typeof optionLabels]).join(', ') || 'None'}</p>
            <p><strong>Estimated Price:</strong> $${data.estimatedPrice.toLocaleString()}</p>
            
            <p>Our team will review your requirements and get back to you with a comprehensive proposal.</p>
            <hr>
            <p>Best regards,<br>The NeuraWeb Team</p>
          `,
        });
      }

      return quote;
    } catch (error) {
      console.error('Quote service error:', error);
      throw new Error('Failed to process quote request');
    }
  }
}