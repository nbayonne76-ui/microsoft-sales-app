const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const solutions = [
  {
    name: 'dynamics-365-finance',
    officialName: 'Dynamics 365 Finance',
    category: 'business',
    subcategory: 'erp-finance',
    shortDescription: 'ERP Financier Enterprise - Comptabilite generale, consolidation multi-entites, reporting financier, IA insights.',
    fullDescription: 'Solution ERP financier enterprise avec comptabilite generale avancee, consolidation multi-entites internationales, reporting financier reglementaire, budgets previsions, cash flow management, compliance audit. IA insights anomalies detection, cash flow prediction. Integration Dynamics 365 Supply Chain, Commerce, Business Central.',
    keyFeatures: JSON.stringify([
      'General Ledger Avance - Comptabilite generale multi-devises multi-entites',
      'Consolidation Financiere - Consolidation comptes groupes internationaux',
      'Reporting Reglementaire - Etats financiers IFRS GAAP conformes',
      'Budgeting & Forecasting - Budgets previsions scenarios what-if',
      'Cash Flow Management - Gestion tresorerie previsions cash flow IA',
      'Fixed Assets - Gestion immobilisations amortissements',
      'Accounts Payable/Receivable - Fournisseurs clients aging collections',
      'Tax Compliance - Conformite fiscale declarations taxes internationales',
      'IA Financial Insights - Anomalies detection variance analysis predictive',
      'Audit & Compliance - Trails audit controles internes SOX compliance'
    ]),
    benefits: JSON.stringify([
      'Consolidation financiere temps reel vs processus manuels semaines',
      'Compliance risques -60% automation controles trails audit',
      'Cash flow visibility +50% predictions IA tresorerie',
      'Close financier -40% automation reconciliations reporting',
      'Decision making +35% insights IA real-time financial analytics'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Groupe International',
        description: 'Consolidation financiere multi-entites multi-devises multi-GAAP',
        industries: ['All Enterprise'],
        businessImpact: 'Close time -50%, compliance +40%'
      },
      {
        title: 'Upgrade from Business Central',
        description: 'Evolution PME vers ERP enterprise multi-entites complexe',
        industries: ['All'],
        businessImpact: 'Scalability unlimited, processes standardises'
      }
    ]),
    targetIndustries: JSON.stringify(['Manufacturing', 'Distribution', 'Retail', 'Professional Services', 'All Enterprise']),
    idealCustomerSize: 'Enterprise',
    targetPersonas: JSON.stringify(['CFO', 'Finance Director', 'Controller', 'Treasury Manager']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Dynamics 365 Finance', description: 'Full finance ERP', pricing: '180 euros/user/mois' },
      { tier: 'Operations Activity', description: 'Acces limite operations', pricing: '35 euros/user/mois' }
    ]),
    estimatedCost: 'A partir de 180 euros/user/mois',
    implementationTime: '6-18 mois',
    complexity: 'high',
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['erp', 'finance', 'accounting', 'consolidation', 'compliance']),
    tags: JSON.stringify(['erp', 'finance', 'enterprise', 'ai-powered'])
  },
  {
    name: 'dynamics-365-supply-chain',
    officialName: 'Dynamics 365 Supply Chain Management',
    category: 'business',
    subcategory: 'erp-supply-chain',
    shortDescription: 'ERP Supply Chain - MRP, production, warehouse WMS, transport, IoT Supply Chain Insights IA predictive.',
    fullDescription: 'Solution ERP supply chain complete avec MRP planning production, warehouse management WMS avance, transport logistics TMS, procurement purchasing, inventory optimization. IoT Supply Chain Insights maintenance predictive. IA demand forecasting, inventory optimization, supply planning. Integration Dynamics 365 Finance, Commerce.',
    keyFeatures: JSON.stringify([
      'Master Planning MRP - Planning besoins matieres MRP/MPS',
      'Production Control - Gestion production manufacturing discrete process',
      'Warehouse Management WMS - WMS avance mobile picking putaway',
      'Transportation Management TMS - Planification transport routing freight',
      'Procurement & Sourcing - Achats approvisionnements RFQ vendor management',
      'Inventory Optimization IA - Optimisation stocks niveaux service IA',
      'IoT Supply Chain Insights - Maintenance predictive equipements production',
      'Demand Forecasting IA - Previsions demande machine learning',
      'Quality Management - Controle qualite non-conformites',
      'Product Information Management - Gestion donnees produits PLM integration'
    ]),
    benefits: JSON.stringify([
      'Inventory costs -25% optimisation stocks niveaux service IA',
      'On-time delivery +30% planning MRP optimisation production',
      'Forecast accuracy +40% demand forecasting machine learning',
      'Warehouse productivity +35% WMS mobile automation',
      'Downtime production -45% maintenance predictive IoT'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Manufacturing Complexe',
        description: 'Production manufacturing MRP multi-sites supply chain',
        industries: ['Manufacturing', 'Automotive', 'Electronics'],
        businessImpact: 'Lead time -30%, inventory -25%'
      },
      {
        title: 'Distribution Logistics',
        description: 'Warehouse management transport logistics multi-entrepots',
        industries: ['Distribution', 'Retail', '3PL'],
        businessImpact: 'Warehouse efficiency +40%, transport costs -20%'
      }
    ]),
    targetIndustries: JSON.stringify(['Manufacturing', 'Distribution', 'Automotive', 'Electronics', 'Consumer Goods', '3PL']),
    idealCustomerSize: 'Enterprise',
    targetPersonas: JSON.stringify(['COO', 'Supply Chain Director', 'Operations Director', 'Manufacturing Director']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Supply Chain Management', description: 'Full SCM ERP', pricing: '180 euros/user/mois' },
      { tier: 'Operations Activity', description: 'Acces limite operations', pricing: '35 euros/user/mois' }
    ]),
    estimatedCost: 'A partir de 180 euros/user/mois',
    implementationTime: '9-24 mois',
    complexity: 'high',
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['erp', 'supply chain', 'manufacturing', 'warehouse', 'mrp', 'iot']),
    tags: JSON.stringify(['erp', 'supply-chain', 'enterprise', 'iot', 'ai-powered'])
  },
  {
    name: 'dynamics-365-human-resources',
    officialName: 'Dynamics 365 Human Resources',
    category: 'business',
    subcategory: 'hr-management',
    shortDescription: 'SIRH complet - Gestion talents, onboarding, formation, performance, benefits, employee self-service.',
    fullDescription: 'Solution SIRH (HCM) complete gestion capital humain avec recruiting ATS, onboarding, formation learning management, performance reviews, compensation benefits, employee self-service ESS, HR analytics. Integration Dynamics 365 Finance payroll, LinkedIn Talent Solutions.',
    keyFeatures: JSON.stringify([
      'Recruiting & ATS - Applicant tracking system recrutement',
      'Onboarding - Processus integration nouveaux employes',
      'Learning Management - Formation LMS cours certifications',
      'Performance Management - Evaluations performances objectifs feedbacks',
      'Compensation & Benefits - Remuneration avantages sociaux',
      'Employee Self-Service - Portail employes conges absences profil',
      'Leave & Absence - Gestion conges absences politiques',
      'HR Analytics - Tableaux bord RH turnover analytics insights',
      'Organization Management - Organigrammes positions hierarchies',
      'Integration LinkedIn - LinkedIn Talent Solutions recruiting'
    ]),
    benefits: JSON.stringify([
      'Time to hire -35% ATS recruiting automation',
      'Employee engagement +25% onboarding formation self-service',
      'HR admin time -40% automation workflows self-service',
      'Retention +20% performance management employee experience',
      'Compliance risques -50% trails audit processes standardises'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Talent Management',
        description: 'Recrutement onboarding formation performance end-to-end',
        industries: ['All'],
        businessImpact: 'Time to productivity -30%, retention +22%'
      },
      {
        title: 'Employee Experience',
        description: 'Self-service portail employes engagement satisfaction',
        industries: ['All'],
        businessImpact: 'HR tickets -50%, employee NPS +25%'
      }
    ]),
    targetIndustries: JSON.stringify(['All']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['CHRO', 'HR Director', 'Talent Manager', 'HR Business Partner']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Human Resources', description: 'Core HR management', pricing: 'Custom pricing' },
      { tier: 'HR + Talent', description: 'Avec recruiting performance learning', pricing: 'Custom pricing' }
    ]),
    estimatedCost: 'Custom pricing',
    implementationTime: '3-9 mois',
    complexity: 'medium',
    salesPriority: 7,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['hr', 'human resources', 'talent', 'recruiting', 'performance']),
    tags: JSON.stringify(['hr', 'talent-management'])
  },
  {
    name: 'dynamics-365-project-operations',
    officialName: 'Dynamics 365 Project Operations',
    category: 'business',
    subcategory: 'project-management',
    shortDescription: 'PSA complet - Project management, resource planning, time/expense, billing, project accounting, IA insights.',
    fullDescription: 'Solution PSA (Professional Services Automation) complete pour societes projet avec project planning scheduling, resource capacity planning, time expense tracking, project billing invoicing, project accounting profitability, collaboration Teams. IA project insights risk prediction, resource optimization.',
    keyFeatures: JSON.stringify([
      'Project Planning - Planning projets tasks Gantt scheduling',
      'Resource Management - Planification capacite ressources skills matching',
      'Time & Expense - Saisie temps frais mobile approbations',
      'Project Billing - Facturation projets time/materials fixed-price',
      'Project Accounting - Comptabilite analytique projets profitabilite',
      'IA Project Insights - Predictions risques delays budget overruns',
      'Collaboration Teams - Integration Microsoft Teams projects',
      'Contract Management - Gestion contrats projets change orders',
      'Analytics & Reporting - Tableaux bord projets utilization profitability',
      'Integration Dynamics 365 - Sales CRM Finance ERP native'
    ]),
    benefits: JSON.stringify([
      'Project profitability +25% visibility real-time costs revenue',
      'Resource utilization +30% capacity planning optimization IA',
      'Project delivery on-time +35% insights IA risk prediction',
      'Billing accuracy +40% time tracking automated invoicing',
      'Sales to delivery -50% integration CRM PSA seamless'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Professional Services',
        description: 'Societes conseil ESN projects billables resources',
        industries: ['Professional Services', 'Consulting', 'IT Services'],
        businessImpact: 'Utilization +28%, margins +22%'
      },
      {
        title: 'Project-Based Manufacturing',
        description: 'Manufacturing engineer-to-order projets complexes',
        industries: ['Manufacturing', 'Construction', 'Engineering'],
        businessImpact: 'Project margins +20%, delays -35%'
      }
    ]),
    targetIndustries: JSON.stringify(['Professional Services', 'Consulting', 'IT Services', 'Engineering', 'Construction', 'Architecture']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['COO', 'Services Director', 'PMO Director', 'CFO']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Project Operations', description: 'Full PSA platform', pricing: 'Custom pricing' },
      { tier: 'Team Member', description: 'Time/expense submission only', pricing: 'Custom pricing' }
    ]),
    estimatedCost: 'Custom pricing',
    implementationTime: '4-9 mois',
    complexity: 'medium-high',
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['psa', 'project management', 'professional services', 'resource planning', 'billing']),
    tags: JSON.stringify(['psa', 'project-management', 'ai-powered'])
  }
];

async function main() {
  console.log('Adding 4 core Dynamics 365 ERP solutions to knowledge base...\n');

  for (const solution of solutions) {
    try {
      const result = await prisma.azureSolution.create({
        data: solution
      });
      console.log(`✅ Added: ${result.officialName}`);
    } catch (error) {
      console.error(`❌ Error adding ${solution.officialName}:`, error.message);
    }
  }

  const total = await prisma.azureSolution.count();
  console.log(`\n✅ Total solutions in database: ${total}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
