// backend/src/services/WizardService.ts
import { PrismaService } from './PrismaService';

interface SaveWizardStepData {
  clientId: string;
  step: number;
  data: any;
  isDraft?: boolean;
}

export class WizardService {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async saveWizardStep(data: SaveWizardStepData) {
    try {
      const wizardResponse = await this.prisma.wizardResponse.upsert({
        where: {
          clientId_step: {
            clientId: data.clientId,
            step: data.step,
          },
        },
        update: {
          data: data.data,
          isDraft: data.isDraft ?? true,
          updatedAt: new Date(),
        },
        create: {
          clientId: data.clientId,
          step: data.step,
          data: data.data,
          isDraft: data.isDraft ?? true,
        },
      });

      return wizardResponse;
    } catch (error) {
      console.error('Save wizard step error:', error);
      throw new Error('Failed to save wizard step');
    }
  }

  async submitWizard(clientId: string) {
    try {
      // Update all draft responses to submitted
      const updatedResponses = await this.prisma.wizardResponse.updateMany({
        where: {
          clientId,
          isDraft: true,
        },
        data: {
          isDraft: false,
          updatedAt: new Date(),
        },
      });

      // Get all responses for this client
      const allResponses = await this.prisma.wizardResponse.findMany({
        where: { clientId },
        orderBy: { step: 'asc' },
      });

      return {
        updatedCount: updatedResponses.count,
        responses: allResponses,
      };
    } catch (error) {
      console.error('Submit wizard error:', error);
      throw new Error('Failed to submit wizard');
    }
  }

  async getWizardResponses(clientId: string) {
    try {
      const responses = await this.prisma.wizardResponse.findMany({
        where: { clientId },
        orderBy: { step: 'asc' },
      });

      return responses;
    } catch (error) {
      console.error('Get wizard responses error:', error);
      throw new Error('Failed to fetch wizard responses');
    }
  }

  async getAllClientWizards() {
    try {
      const wizards = await this.prisma.wizardResponse.findMany({
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              isValidated: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      // Group by client
      const groupedWizards = wizards.reduce((acc, response) => {
        const clientId = response.clientId;
        if (!acc[clientId]) {
          acc[clientId] = {
            client: response.client,
            responses: [],
            isCompleted: false,
            lastUpdated: response.updatedAt,
          };
        }
        acc[clientId].responses.push(response);
        
        // Check if wizard is completed (has responses for all 9 steps and none are drafts)
      const completedSteps = acc[clientId].responses.filter((r: any) => !r.isDraft);
        acc[clientId].isCompleted = completedSteps.length === 9;
        
        return acc;
      }, {} as any);

      return Object.values(groupedWizards);
    } catch (error) {
      console.error('Get all client wizards error:', error);
      throw new Error('Failed to fetch client wizards');
    }
  }
}