import { PrismaService } from './PrismaService';

interface ClientWithStats {
  id: string;
  name: string;
  email: string;
  isValidated: boolean;
  createdAt: Date;
  lastConnection?: Date;
  wizardProgress: number;
  totalSessions: number;
}

interface PlatformStats {
  totalClients: number;
  validatedClients: number;
  pendingClients: number;
  totalSessions: number;
  wizardCompletionRate: number;
  recentRegistrations: number;
  activeClientsToday: number;
}

interface ClientSession {
  id: string;
  ipAddress: string;
  userAgent: string | null; // Changed from string | undefined to string | null
  loggedAt: Date;
  client: {
    name: string;
    email: string;
  };
}

export class AdminDashboardService {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async getClientsWithStats(): Promise<ClientWithStats[]> {
    try {
      const clients = await this.prisma.client.findMany({
        include: {
          wizardResponses: true,
          sessions: {
            orderBy: { loggedAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              sessions: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return clients.map((client) => {
        // Calculate wizard progress (9 total steps)
        const completedSteps = client.wizardResponses.filter(r => !r.isDraft).length;
        const wizardProgress = Math.round((completedSteps / 9) * 100);

        return {
          id: client.id,
          name: client.name,
          email: client.email,
          isValidated: client.isValidated,
          createdAt: client.createdAt,
          lastConnection: client.sessions[0]?.loggedAt,
          wizardProgress,
          totalSessions: client._count.sessions,
        };
      });
    } catch (error) {
      console.error('Get clients with stats error:', error);
      throw new Error('Failed to fetch clients with stats');
    }
  }

  async validateClient(clientId: string): Promise<void> {
    try {
      await this.prisma.client.update({
        where: { id: clientId },
        data: { isValidated: true },
      });
    } catch (error) {
      console.error('Validate client error:', error);
      throw new Error('Failed to validate client');
    }
  }

  async deleteClient(clientId: string): Promise<void> {
    try {
      // Cascade delete will handle related records
      await this.prisma.client.delete({
        where: { id: clientId },
      });
    } catch (error) {
      console.error('Delete client error:', error);
      throw new Error('Failed to delete client');
    }
  }

  async getClientSessions(clientId?: string): Promise<ClientSession[]> {
    try {
      const sessions = await this.prisma.clientSession.findMany({
        where: clientId ? { clientId } : undefined,
        include: {
          client: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { loggedAt: 'desc' },
        take: 100, // Limit to recent 100 sessions
      });

      return sessions;
    } catch (error) {
      console.error('Get client sessions error:', error);
      throw new Error('Failed to fetch client sessions');
    }
  }

  async getPlatformStats(): Promise<PlatformStats> {
    try {
      const [
        totalClients,
        validatedClients,
        totalSessions,
        wizardResponses,
        recentRegistrations,
        activeClientsToday,
      ] = await Promise.all([
        this.prisma.client.count(),
        this.prisma.client.count({ where: { isValidated: true } }),
        this.prisma.clientSession.count(),
        this.prisma.wizardResponse.findMany({
          select: { clientId: true, isDraft: true },
        }),
        this.prisma.client.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        }),
        this.prisma.clientSession.count({
          where: {
            loggedAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        }),
      ]);

      // Calculate wizard completion rate
      const clientsWithWizardData = new Set(wizardResponses.map(r => r.clientId));
      const completedWizards = wizardResponses
        .reduce((acc, response) => {
          if (!acc[response.clientId]) {
            acc[response.clientId] = { total: 0, completed: 0 };
          }
          acc[response.clientId].total++;
          if (!response.isDraft) {
            acc[response.clientId].completed++;
          }
          return acc;
        }, {} as Record<string, { total: number; completed: number }>);

      const fullyCompletedWizards = Object.values(completedWizards).filter(
        wizard => wizard.completed === 9
      ).length;

      const wizardCompletionRate = clientsWithWizardData.size > 0 
        ? Math.round((fullyCompletedWizards / clientsWithWizardData.size) * 100)
        : 0;

      return {
        totalClients,
        validatedClients,
        pendingClients: totalClients - validatedClients,
        totalSessions,
        wizardCompletionRate,
        recentRegistrations,
        activeClientsToday,
      };
    } catch (error) {
      console.error('Get platform stats error:', error);
      throw new Error('Failed to fetch platform stats');
    }
  }

  async logClientSession(clientId: string, ipAddress: string, userAgent?: string): Promise<void> {
    try {
      await this.prisma.clientSession.create({
        data: {
          clientId,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      console.error('Log client session error:', error);
      // Don't throw error for session logging to avoid breaking login
    }
  }
}