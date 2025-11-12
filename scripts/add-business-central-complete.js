const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const businessCentralSolution = {
  name: 'dynamics-365-business-central',
  officialName: 'Microsoft Dynamics 365 Business Central',
  category: 'business',
  subcategory: 'erp-platform',
  shortDescription: 'Cloud ERP complet PME - Finances, Supply Chain, Manufacturing, CRM, Projets avec IA Copilot integree.',
  fullDescription: 'Microsoft Dynamics 365 Business Central est une solution ERP cloud complete pour PME qui unifie finances, ventes, services, operations et supply chain. Gestion comptabilite, achats, ventes, inventory, projets, manufacturing, service management avec IA integree (Copilot, predictions cash flow, retards paiement, forecast stock). Integration native Microsoft 365, Outlook, Teams, Power Platform. Deux editions: Essentials (finance, ventes, achats, inventory, projets) et Premium (+ manufacturing, service management). Support multi-societes, multi-devises, conformite 40+ pays. Deploiement cloud SaaS, extensible avec Power Apps, AL extensions.',
  keyFeatures: JSON.stringify([
    'Financial Management - General Ledger, Bank Reconciliation, Cash Flow Forecast, Consolidation, Budgets',
    'AI Copilot in Business Central - Assistant IA analyses, insights, automatisation',
    'AI Cash Flow Forecast - Prediction tresorerie Azure Machine Learning',
    'AI Late Payment Prediction - Prediction retards paiements clients',
    'AI Inventory Forecast - Prediction demande stock optimale',
    'Supply Chain Management - Purchase Orders, Sales Orders, Inventory, Requisitions',
    'Manufacturing (Premium) - Production Orders, BOM, Finite Loading, MRP',
    'Service Management (Premium) - Service Orders, Contracts, Field Service',
    'Project Management - Job Quotes, Time Sheets, Resource Planning',
    'CRM - Contact Management, Opportunities, Campaign Management, Dynamics 365 Sales Integration',
    'Microsoft 365 Integration - Outlook, Teams, Excel native',
    'Power Platform Integration - Power Apps, Automate, BI',
    'Multi-company Support - Gestion multi-societes, consolidation inter-co',
    'Mobile Access - iOS, Android apps + responsive web'
  ]),
  benefits: JSON.stringify([
    'ERP Tout-en-un PME vs multiples logiciels disparates',
    'IA Integree Copilot + Azure AI vs analyses manuelles',
    'Deployment Rapide 4-8 semaines vs 6-12 mois ERP traditionnel',
    'Cout PME 70 euros/user/mois vs 200-500 euros concurrents',
    'Microsoft Ecosystem natif Office 365, Teams vs integrations custom',
    'Scalable Essentials vers Premium sans migration'
  ]),
  useCases: JSON.stringify([
    { title: 'PME Distribution', description: 'Ventes, achats, inventory, comptabilite, CRM unifie', industries: ['Retail', 'Distribution'], businessImpact: 'Couts IT -40%, stock optimise -30%' },
    { title: 'Manufacturing PME', description: 'Production MRP, supply chain, comptabilite analytique', industries: ['Manufacturing'], businessImpact: 'Lead time -25%, couts production -15%' }
  ]),
  targetIndustries: JSON.stringify(['All', 'Retail', 'Distribution', 'Manufacturing', 'Services', 'E-commerce']),
  idealCustomerSize: 'SME',
  targetPersonas: JSON.stringify(['CFO', 'CEO', 'COO', 'Directeur Financier', 'Directeur Operations']),
  pricingModel: 'subscription',
  pricingTiers: JSON.stringify([
    { tier: 'Essentials', description: 'Finance, ventes, achats, inventory, projets', pricing: '70 euros/user/mois' },
    { tier: 'Premium', description: 'Essentials + Manufacturing + Service Management', pricing: '100 euros/user/mois' },
    { tier: 'Team Members', description: 'Acces lecture seule, approbations basiques', pricing: '8 euros/user/mois' }
  ]),
  estimatedCost: 'A partir de 70 euros/user/mois',
  implementationTime: '4-12 semaines',
  complexity: 'medium',
  salesPriority: 9,
  isActive: true,
  isFeatured: true,
  keywords: JSON.stringify(['erp', 'business central', 'dynamics 365', 'accounting', 'finance', 'supply chain', 'manufacturing', 'crm', 'copilot']),
  tags: JSON.stringify(['erp', 'financial', 'supply-chain', 'manufacturing', 'ai-powered', 'sme'])
};

async function addBusinessCentral() {
  try {
    console.log('Adding Dynamics 365 Business Central...');
    const existing = await prisma.azureSolution.findUnique({
      where: { name: businessCentralSolution.name }
    });
    if (existing) {
      await prisma.azureSolution.update({
        where: { name: businessCentralSolution.name },
        data: businessCentralSolution
      });
      console.log('Updated Business Central');
    } else {
      await prisma.azureSolution.create({ data: businessCentralSolution });
      console.log('Created Business Central');
    }
    const total = await prisma.azureSolution.count();
    console.log('Total solutions:', total);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addBusinessCentral();
