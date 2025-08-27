// backend/src/services/ClientService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaService } from './PrismaService';
import { AdminDashboardService } from './AdminDashboardService';

interface RegisterClientData {
  name: string;
  email: string;
  password: string;
}

interface LoginClientData {
  email: string;
  password: string;
}

export class ClientService {
  private prisma: PrismaService;
  private dashboardService: AdminDashboardService;

  constructor() {
    this.prisma = new PrismaService();
    this.dashboardService = new AdminDashboardService();
  }

  async register(data: RegisterClientData) {
    try {
      // Check if client already exists
      const existingClient = await this.prisma.client.findUnique({
        where: { email: data.email },
      });

      if (existingClient) {
        throw new Error('Client already exists with this email');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 12);

      // Create client
      const client = await this.prisma.client.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          isValidated: false, // Admin needs to validate
        },
        select: {
          id: true,
          name: true,
          email: true,
          isValidated: true,
          createdAt: true,
        },
      });

      return client;
    } catch (error) {
      console.error('Client registration error:', error);
      throw new Error('Failed to register client');
    }
  }

  async login(data: LoginClientData) {
    try {
      // Find client
      const client = await this.prisma.client.findUnique({
        where: { email: data.email },
      });

      if (!client) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isValidPassword = await bcrypt.compare(data.password, client.passwordHash);
      if (!isValidPassword) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          clientId: client.id, 
          email: client.email,
          isValidated: client.isValidated,
          type: 'client'
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      return {
        token,
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          isValidated: client.isValidated,
        },
      };
    } catch (error) {
      console.error('Client login error:', error);
      throw new Error('Login failed');
    }
  }

  async logSession(clientId: string, ipAddress: string, userAgent?: string): Promise<void> {
    await this.dashboardService.logClientSession(clientId, ipAddress, userAgent);
  }
  async getClients() {
    try {
      const clients = await this.prisma.client.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          isValidated: true,
          createdAt: true,
          _count: {
            select: {
              wizardResponses: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return clients;
    } catch (error) {
      console.error('Get clients error:', error);
      throw new Error('Failed to fetch clients');
    }
  }

  async validateClient(clientId: string) {
    try {
      const client = await this.prisma.client.update({
        where: { id: clientId },
        data: { isValidated: true },
        select: {
          id: true,
          name: true,
          email: true,
          isValidated: true,
        },
      });

      return client;
    } catch (error) {
      console.error('Validate client error:', error);
      throw new Error('Failed to validate client');
    }
  }
}