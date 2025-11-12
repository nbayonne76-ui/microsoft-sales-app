import { PrismaClient } from '@prisma/client';

// Instance globale Prisma pour éviter la reconnexion
const globalForPrisma = globalThis;

// PERFORMANCE FIX: Disable query logging in production to reduce overhead
// Logging all queries can cause significant performance degradation in production
const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };

// Service de gestion des clients
export class ClientService {
  
  // PERFORMANCE FIX: Added optional includeInteractions parameter to prevent N+1 queries
  // When only client data is needed, set includeInteractions to false
  static async findOrCreateClient({ company, segment, industry, currentChallenges, contactEmail, contactName, includeInteractions = false }) {
    try {
      // Build include clause conditionally to avoid loading unnecessary data
      const includeClause = includeInteractions ? {
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      } : undefined;

      // Rechercher client existant
      let client = await prisma.client.findFirst({
        where: { company },
        ...(includeClause && { include: includeClause })
      });

      if (!client) {
        // Créer nouveau client
        client = await prisma.client.create({
          data: {
            company,
            segment: segment || 'sme',
            industry,
            currentChallenges,
            contactEmail,
            contactName
          },
          ...(includeClause && { include: includeClause })
        });

        console.log('🆕 Nouveau client créé:', company);
      } else {
        // Mettre à jour les infos si nécessaire
        if (industry || currentChallenges || contactEmail || contactName) {
          client = await prisma.client.update({
            where: { id: client.id },
            data: {
              ...(industry && { industry }),
              ...(currentChallenges && { currentChallenges }),
              ...(contactEmail && { contactEmail }),
              ...(contactName && { contactName }),
            },
            ...(includeClause && { include: includeClause })
          });
        }

        console.log('📋 Client existant récupéré:', company);
      }

      return client;
    } catch (error) {
      console.error('❌ Erreur ClientService.findOrCreateClient:', error);
      throw error;
    }
  }

  // Récupérer tous les clients avec stats
  static async getAllClients() {
    try {
      const clients = await prisma.client.findMany({
        include: {
          interactions: {
            orderBy: { createdAt: 'desc' },
            take: 5
          },
          _count: {
            select: { interactions: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return clients;
    } catch (error) {
      console.error('❌ Erreur ClientService.getAllClients:', error);
      throw error;
    }
  }

  // Mettre à jour le statut client
  static async updateClientStatus(clientId, status, priority = null) {
    try {
      const client = await prisma.client.update({
        where: { id: clientId },
        data: {
          status,
          ...(priority && { priority })
        }
      });

      console.log(`📊 Client ${client.company} - Statut: ${status}`);
      return client;
    } catch (error) {
      console.error('❌ Erreur ClientService.updateClientStatus:', error);
      throw error;
    }
  }
}

// Service de gestion des interactions
export class InteractionService {
  
  // Créer une nouvelle interaction
  static async createInteraction({
    clientId,
    type = 'email',
    direction = 'outbound',
    subject,
    content,
    context,
    intent,
    status = 'sent'
  }) {
    try {
      const interaction = await prisma.clientInteraction.create({
        data: {
          clientId,
          type,
          direction,
          subject,
          content,
          context,
          intent,
          status
        },
        include: {
          client: true
        }
      });

      console.log('📧 Nouvelle interaction créée:', { 
        client: interaction.client.company, 
        type, 
        subject: subject?.substring(0, 50) + '...' 
      });

      return interaction;
    } catch (error) {
      console.error('❌ Erreur InteractionService.createInteraction:', error);
      throw error;
    }
  }

  // Récupérer l'historique d'un client
  static async getClientHistory(clientId, limit = 20) {
    try {
      const interactions = await prisma.clientInteraction.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: {
          client: {
            select: {
              company: true,
              segment: true
            }
          }
        }
      });

      return interactions;
    } catch (error) {
      console.error('❌ Erreur InteractionService.getClientHistory:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'une interaction
  static async updateInteractionStatus(interactionId, status, responseContent = null, sentiment = null) {
    try {
      const interaction = await prisma.clientInteraction.update({
        where: { id: interactionId },
        data: {
          status,
          ...(responseContent && { 
            responseReceived: true, 
            responseContent,
            respondedAt: new Date()
          }),
          ...(sentiment && { responseSentiment: sentiment })
        }
      });

      console.log(`📊 Interaction mise à jour: ${status}`, {
        id: interaction.id,
        hasResponse: !!responseContent
      });

      return interaction;
    } catch (error) {
      console.error('❌ Erreur InteractionService.updateInteractionStatus:', error);
      throw error;
    }
  }

  // Analyser les patterns d'interaction d'un client
  static async analyzeClientPatterns(clientId) {
    try {
      const interactions = await prisma.clientInteraction.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        take: 50
      });

      // Calcul des métriques
      const totalInteractions = interactions.length;
      const responses = interactions.filter(i => i.responseReceived);
      const responseRate = responses.length / totalInteractions;
      
      const sentimentCounts = interactions.reduce((acc, i) => {
        acc[i.responseSentiment || 'unknown']++;
        return acc;
      }, { positive: 0, neutral: 0, negative: 0, unknown: 0 });

      const recentInteractions = interactions.slice(0, 5);
      const lastInteraction = interactions[0];

      return {
        totalInteractions,
        responseRate: Math.round(responseRate * 100),
        sentimentDistribution: sentimentCounts,
        recentInteractions: recentInteractions.map(i => ({
          type: i.type,
          status: i.status,
          sentiment: i.responseSentiment,
          createdAt: i.createdAt,
          responseReceived: i.responseReceived
        })),
        lastInteraction: lastInteraction ? {
          type: lastInteraction.type,
          status: lastInteraction.status,
          sentiment: lastInteraction.responseSentiment,
          createdAt: lastInteraction.createdAt,
          daysSince: Math.floor((new Date() - lastInteraction.createdAt) / (1000 * 60 * 60 * 24))
        } : null
      };
    } catch (error) {
      console.error('❌ Erreur InteractionService.analyzeClientPatterns:', error);
      throw error;
    }
  }
}

// Service pour les templates d'emails
export class TemplateService {
  
  // Sauvegarder un email généré
  static async saveTemplate({
    name,
    category,
    segment,
    tone,
    subject,
    content,
    reasoning
  }) {
    try {
      const template = await prisma.emailTemplate.create({
        data: {
          name,
          category,
          segment,
          tone,
          subject,
          content,
          reasoning
        }
      });

      console.log('📝 Template sauvegardé:', { name, category, segment });
      return template;
    } catch (error) {
      console.error('❌ Erreur TemplateService.saveTemplate:', error);
      throw error;
    }
  }

  // Récupérer les meilleurs templates par catégorie
  static async getBestTemplates(category, segment = null, limit = 5) {
    try {
      const templates = await prisma.emailTemplate.findMany({
        where: {
          category,
          ...(segment && { segment })
        },
        orderBy: [
          { successRate: 'desc' },
          { useCount: 'desc' }
        ],
        take: limit
      });

      return templates;
    } catch (error) {
      console.error('❌ Erreur TemplateService.getBestTemplates:', error);
      throw error;
    }
  }

  // Incrémenter l'utilisation d'un template
  static async incrementUsage(templateId) {
    try {
      const template = await prisma.emailTemplate.update({
        where: { id: templateId },
        data: {
          useCount: { increment: 1 }
        }
      });

      return template;
    } catch (error) {
      console.error('❌ Erreur TemplateService.incrementUsage:', error);
      throw error;
    }
  }
}