import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaService } from './PrismaService';

export class AdminService {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async login(email: string, password: string) {
    try {
      // For demo purposes, use environment variables
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@neuraweb.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

      if (email !== adminEmail || password !== adminPassword) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { email: adminEmail, role: 'admin' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      return { token, email: adminEmail };
    } catch (error) {
      console.error('Admin login error:', error);
      throw new Error('Login failed');
    }
  }

  async getQuotes() {
    try {
      const quotes = await this.prisma.quote.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return quotes;
    } catch (error) {
      console.error('Get quotes error:', error);
      throw new Error('Failed to fetch quotes');
    }
  }

  async getContacts() {
    try {
      const contacts = await this.prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return contacts;
    } catch (error) {
      console.error('Get contacts error:', error);
      throw new Error('Failed to fetch contacts');
    }
  }

  async getBookings() {
    try {
      const bookings = await this.prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return bookings;
    } catch (error) {
      console.error('Get bookings error:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  async updateStatus(type: string, id: string, status: string) {
    try {
      let result;

      switch (type) {
        case 'quotes':
          result = await this.prisma.quote.update({
            where: { id },
            data: { status },
          });
          break;
        case 'contacts':
          result = await this.prisma.contact.update({
            where: { id },
            data: { status },
          });
          break;
        case 'bookings':
          result = await this.prisma.booking.update({
            where: { id },
            data: { status },
          });
          break;
        default:
          throw new Error('Invalid type');
      }

      return result;
    } catch (error) {
      console.error('Update status error:', error);
      throw new Error('Failed to update status');
    }
  }
}