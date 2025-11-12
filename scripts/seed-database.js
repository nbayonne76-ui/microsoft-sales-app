import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    console.log('🌱 Seed de la base de données...');

    // Nettoyage des données existantes
    await prisma.clientInteraction.deleteMany();
    await prisma.client.deleteMany();
    await prisma.emailTemplate.deleteMany();

    console.log('🧹 Données existantes supprimées');

    // Création de clients de démonstration
    const clients = await Promise.all([
      prisma.client.create({
        data: {
          company: 'Contoso Corporation',
          segment: 'enterprise',
          industry: 'Finance',
          employeeCount: 2500,
          currentChallenges: 'Migration vers le cloud, sécurité des données',
          contactName: 'Marie Dubois',
          contactEmail: 'marie.dubois@contoso.com',
          contactRole: 'CTO',
          priority: 'high',
          status: 'active'
        }
      }),
      prisma.client.create({
        data: {
          company: 'TechStart Innovation',
          segment: 'startup',
          industry: 'SaaS',
          employeeCount: 25,
          currentChallenges: 'Scalabilité, adoption Copilot',
          contactName: 'Thomas Martin',
          contactEmail: 'thomas@techstart.io',
          contactRole: 'CEO',
          priority: 'medium',
          status: 'active'
        }
      }),
      prisma.client.create({
        data: {
          company: 'PME Services Plus',
          segment: 'sme',
          industry: 'Services',
          employeeCount: 150,
          currentChallenges: 'Productivité équipes, coûts IT',
          contactName: 'Sophie Lefebvre',
          contactEmail: 'sophie.lefebvre@pmeservices.fr',
          contactRole: 'Directrice IT',
          priority: 'medium',
          status: 'active'
        }
      })
    ]);

    console.log(`✅ ${clients.length} clients créés`);

    // Création d'interactions historiques
    const interactions = [];

    // Interactions pour Contoso (Enterprise)
    interactions.push(
      await prisma.clientInteraction.create({
        data: {
          clientId: clients[0].id,
          type: 'email',
          direction: 'outbound',
          status: 'responded',
          subject: 'Stratégie migration Azure - ROI et sécurité',
          content: 'Email formel sur migration Azure...',
          context: 'Client évalue migration infrastructure critique',
          intent: 'Présenter business case migration Azure',
          sentiment: 'neutral',
          responseReceived: true,
          responseContent: 'Intéressant, organisons une réunion',
          responseSentiment: 'positive',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // il y a 7 jours
          respondedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        }
      }),
      await prisma.clientInteraction.create({
        data: {
          clientId: clients[0].id,
          type: 'meeting',
          direction: 'outbound',
          status: 'completed',
          subject: 'Demo Azure Security',
          content: 'Démonstration sécurité Zero Trust',
          context: 'Suite à l\'email précédent',
          intent: 'Démontrer capacités sécurité Azure',
          sentiment: 'neutral',
          responseReceived: true,
          responseSentiment: 'positive',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // il y a 3 jours
          outcome: 'interested'
        }
      })
    );

    // Interactions pour TechStart (Startup)
    interactions.push(
      await prisma.clientInteraction.create({
        data: {
          clientId: clients[1].id,
          type: 'email',
          direction: 'outbound',
          status: 'opened',
          subject: '🚀 Copilot pour startups - Programme spécial',
          content: 'Email casual sur Copilot...',
          context: 'Startup recherche outils productivité',
          intent: 'Présenter Microsoft for Startups',
          sentiment: 'neutral',
          responseReceived: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // il y a 2 jours
        }
      })
    );

    // Interactions pour PME Services (SME)
    interactions.push(
      await prisma.clientInteraction.create({
        data: {
          clientId: clients[2].id,
          type: 'call',
          direction: 'inbound',
          status: 'completed',
          subject: 'Question sur coûts M365',
          content: 'Appel entrant sur tarification',
          context: 'PME veut optimiser coûts Microsoft',
          intent: 'Répondre questions budgétaires',
          sentiment: 'neutral',
          responseReceived: true,
          responseSentiment: 'neutral',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // il y a 5 jours
          outcome: 'needs_follow_up'
        }
      }),
      await prisma.clientInteraction.create({
        data: {
          clientId: clients[2].id,
          type: 'email',
          direction: 'outbound',
          status: 'sent',
          subject: 'Optimisation budget Microsoft - Opportunités identifiées',
          content: 'Email professionnel sur optimisation coûts...',
          context: 'Suite à l\'appel sur les coûts',
          intent: 'Proposer audit gratuit et optimisations',
          sentiment: 'neutral',
          responseReceived: false,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // il y a 1 jour
        }
      })
    );

    console.log(`✅ ${interactions.length} interactions créées`);

    // Création de quelques templates d'exemple
    const templates = await Promise.all([
      prisma.emailTemplate.create({
        data: {
          name: 'Migration Azure Enterprise',
          category: 'migration',
          segment: 'enterprise',
          tone: 'formal',
          subject: 'Stratégie de Migration Microsoft Azure - Accompagnement Exécutif',
          content: 'Email formel pour migration Azure...',
          reasoning: 'Template optimisé pour grandes entreprises',
          useCount: 5,
          successRate: 0.8
        }
      }),
      prisma.emailTemplate.create({
        data: {
          name: 'Budget PME Optimisation',
          category: 'budget',
          segment: 'sme',
          tone: 'professional_friendly',
          subject: '💰 Optimisation budget Microsoft - Économies garanties',
          content: 'Email accessible sur optimisation coûts...',
          reasoning: 'Template performant pour PME sensibles au budget',
          useCount: 12,
          successRate: 0.75
        }
      })
    ]);

    console.log(`✅ ${templates.length} templates créés`);

    // Statistiques finales
    const stats = {
      clients: await prisma.client.count(),
      interactions: await prisma.clientInteraction.count(),
      templates: await prisma.emailTemplate.count()
    };

    console.log('📊 Base de données seedée avec succès:', stats);
    
    return stats;

  } catch (error) {
    console.error('❌ Erreur seed database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution du seed
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then((stats) => {
      console.log('🎉 Seed terminé:', stats);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;