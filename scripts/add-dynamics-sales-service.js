const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const solutions = [
  {
    name: 'dynamics-365-sales',
    officialName: 'Dynamics 365 Sales',
    category: 'business',
    subcategory: 'crm',
    shortDescription: 'CRM ventes intelligent - Pipeline, opportunites, forecasts avec IA Copilot, predictions, conversation intelligence.',
    fullDescription: 'CRM pour equipes commerciales avec IA Copilot generative, conversation intelligence, scoring leads, pipeline management, forecasting predictif. Integration LinkedIn Sales Navigator, Teams, Outlook native.',
    keyFeatures: JSON.stringify(['Copilot Sales IA', 'Lead Scoring IA', 'Conversation Intelligence', 'Sales Forecasting', 'LinkedIn Integration']),
    benefits: JSON.stringify(['Productivite +20%', 'Conversion +15%', 'Forecast precision +30%']),
    useCases: JSON.stringify([{title: 'Ventes B2B', description: 'Pipeline ventes complexes', industries: ['All'], businessImpact: 'Win rate +18%'}]),
    targetIndustries: JSON.stringify(['All']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['Sales Director', 'Sales Manager']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([{tier: 'Professional', pricing: '65 euros/user/mois'}, {tier: 'Enterprise', pricing: '95 euros/user/mois'}, {tier: 'Premium', pricing: '135 euros/user/mois'}]),
    estimatedCost: 'A partir de 65 euros/user/mois',
    implementationTime: '2-6 mois',
    complexity: 'medium',
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['crm', 'sales', 'copilot']),
    tags: JSON.stringify(['crm', 'ai-powered'])
  },
  {
    name: 'dynamics-365-customer-service',
    officialName: 'Dynamics 365 Customer Service',
    category: 'business',
    subcategory: 'crm',
    shortDescription: 'Service client omnicanal - Cases, chat, phone avec IA Copilot suggestions, routing intelligent.',
    fullDescription: 'Service client omnicanal email, chat, phone, SMS. Copilot IA suggere reponses, resumes conversations. Omnichannel contact center avec routing intelligent, knowledge base IA.',
    keyFeatures: JSON.stringify(['Copilot Service IA', 'Omnichannel Contact Center', 'Case Management', 'Knowledge Base IA', 'Routing Intelligent']),
    benefits: JSON.stringify(['Resolution +35%', 'CSAT +25%', 'Temps resolution -40%']),
    useCases: JSON.stringify([{title: 'Contact center', description: 'Support client multi-canal', industries: ['All'], businessImpact: 'Satisfaction +25%'}]),
    targetIndustries: JSON.stringify(['All']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['Customer Service Director']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([{tier: 'Professional', pricing: '50 euros/user/mois'}, {tier: 'Enterprise', pricing: '95 euros/user/mois'}]),
    estimatedCost: 'A partir de 50 euros/user/mois',
    implementationTime: '2-6 mois',
    complexity: 'medium',
    salesPriority: 8,
    isActive: true,
    keywords: JSON.stringify(['customer service', 'contact center', 'copilot']),
    tags: JSON.stringify(['crm', 'ai-powered'])
  }
];

async function add() {
  try {
    for (const sol of solutions) {
      const existing = await prisma.azureSolution.findUnique({ where: { name: sol.name } });
      if (existing) {
        await prisma.azureSolution.update({ where: { name: sol.name }, data: sol });
        console.log('Updated:', sol.officialName);
      } else {
        await prisma.azureSolution.create({ data: sol });
        console.log('Created:', sol.officialName);
      }
    }
    const total = await prisma.azureSolution.count();
    console.log('Total solutions:', total);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
add();
