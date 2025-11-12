const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const solutions = [
  {
    name: 'dynamics-365-field-service',
    officialName: 'Dynamics 365 Field Service',
    category: 'business',
    subcategory: 'field-service',
    shortDescription: 'Gestion interventions terrain - Planning techniciens, work orders, IoT predictive maintenance, Connected Field Service.',
    fullDescription: 'Solution complete gestion interventions terrain avec planning intelligent techniciens, work orders, IoT Connected Field Service, maintenance predictive, optimisation tournees, mobile app techniciens. Integration Dynamics 365 Sales, Customer Service, Supply Chain.',
    keyFeatures: JSON.stringify([
      'Copilot Field Service - Assistance IA planification, diagnostics',
      'IoT Connected Field Service - Maintenance predictive equipements',
      'Smart Scheduling - Optimisation planning tournees techniciens',
      'Mobile App Techniciens - Acces offline work orders, historique',
      'Asset Management - Gestion parc equipements clients',
      'Inventory Management - Stock pieces detachees techniciens',
      'Remote Assist Integration - Video assistance temps reel',
      'Customer Portal - Self-service portail clients',
      'SLA Management - Gestion contrats maintenance',
      'Integration Dynamics 365 - Sales, Customer Service, Supply Chain'
    ]),
    benefits: JSON.stringify([
      'First-Time Fix Rate +25% via diagnostics IA predictifs',
      'Couts deplacement -30% optimisation tournees intelligente',
      'Satisfaction client +20% interventions rapides predictives',
      'Downtime equipements -40% maintenance preventive IoT',
      'Productivite techniciens +35% mobile app, knowledge base'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Maintenance Industrielle',
        description: 'Maintenance preventive predictive equipements industriels IoT',
        industries: ['Manufacturing', 'Energy'],
        businessImpact: 'Downtime -45%, couts maintenance -30%'
      },
      {
        title: 'Services IT Terrain',
        description: 'Interventions techniciens IT infrastructure reseaux',
        industries: ['IT Services', 'Telecom'],
        businessImpact: 'SLA respect +30%, interventions/jour +40%'
      }
    ]),
    targetIndustries: JSON.stringify(['Manufacturing', 'Energy', 'Utilities', 'IT Services', 'Telecom', 'Healthcare']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['Operations Director', 'Service Manager', 'Field Service Manager']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Field Service', description: 'Core field service', pricing: '95 euros/user/mois' },
      { tier: 'Field Service + IoT', description: 'Avec Connected Field Service IoT', pricing: 'Custom pricing' }
    ]),
    estimatedCost: 'A partir de 95 euros/user/mois',
    implementationTime: '3-6 mois',
    complexity: 'medium-high',
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['field service', 'iot', 'maintenance', 'copilot']),
    tags: JSON.stringify(['field-service', 'iot', 'ai-powered'])
  },
  {
    name: 'dynamics-365-marketing',
    officialName: 'Dynamics 365 Marketing',
    category: 'business',
    subcategory: 'marketing-automation',
    shortDescription: 'Marketing automation IA - Customer journeys, lead nurturing, Copilot content generation, events, analytics.',
    fullDescription: 'Plateforme marketing automation avec IA Copilot generation contenus, orchestration customer journeys multicanaux, lead scoring predictif, event management, email marketing, landing pages, analytics marketing ROI. Integration Dynamics 365 Sales native.',
    keyFeatures: JSON.stringify([
      'Copilot Marketing - Generation contenus emails, landing pages IA',
      'Customer Journey Orchestration - Parcours clients multicanaux automatises',
      'Lead Scoring IA - Scoring leads predictif comportements',
      'Email Marketing - Campagnes emails personnalisees',
      'Event Management - Gestion evenements webinars conferences',
      'Landing Pages Builder - Creation pages atterrissage drag-drop',
      'Marketing Analytics - Tableaux bord ROI attribution',
      'LinkedIn Integration - Campagnes LinkedIn Lead Gen Forms',
      'A/B Testing - Tests multivariances campagnes',
      'Integration Dynamics 365 Sales - Synchro leads CRM automatique'
    ]),
    benefits: JSON.stringify([
      'Productivite marketing +40% generation contenus Copilot IA',
      'Conversion leads +25% scoring predictif nurturing intelligent',
      'ROI campagnes +30% analytics attribution multicanal',
      'Time-to-market -50% automation journeys templates',
      'Leads qualifies +35% integration Sales scoring IA'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Marketing B2B',
        description: 'Lead generation nurturing B2B integration Sales',
        industries: ['Technology', 'Professional Services', 'Manufacturing'],
        businessImpact: 'Pipeline +40%, conversion +28%'
      },
      {
        title: 'Event Marketing',
        description: 'Gestion evenements conferences webinars pre/post event',
        industries: ['All'],
        businessImpact: 'Attendees +50%, leads events +45%'
      }
    ]),
    targetIndustries: JSON.stringify(['Technology', 'Professional Services', 'Manufacturing', 'Financial Services', 'Healthcare']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['CMO', 'Marketing Director', 'Demand Gen Manager']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Marketing', description: 'Core marketing automation', pricing: '1500 euros/tenant/mois + contacts' },
      { tier: 'Marketing + Events', description: 'Avec event management', pricing: 'Custom pricing' }
    ]),
    estimatedCost: 'A partir de 1500 euros/tenant/mois',
    implementationTime: '2-5 mois',
    complexity: 'medium',
    salesPriority: 7,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['marketing', 'automation', 'copilot', 'lead generation']),
    tags: JSON.stringify(['marketing-automation', 'ai-powered'])
  },
  {
    name: 'dynamics-365-commerce',
    officialName: 'Dynamics 365 Commerce',
    category: 'business',
    subcategory: 'retail-commerce',
    shortDescription: 'Commerce omnicanal - E-commerce, POS magasins, call center, IA recommendations produits, inventory unifie.',
    fullDescription: 'Plateforme commerce omnicanal unifiee e-commerce, point de vente magasins, call center, mobile commerce. IA recommendations produits personnalisees, inventory management unifie, clienteling, order management, pricing promotions dynamiques. Integration Dynamics 365 Supply Chain, Finance.',
    keyFeatures: JSON.stringify([
      'E-Commerce Platform - Storefront e-commerce responsive personnalisable',
      'POS Cloud - Point vente magasins cloud modern POS',
      'IA Product Recommendations - Recommandations produits personnalisees',
      'Unified Inventory - Visibilite stock temps reel omnicanal',
      'Clienteling - Outils vendeurs relation client enrichie',
      'Order Management - Gestion commandes omnicanal ship-from-store',
      'Call Center - Interface centre appels telemarketing',
      'Pricing & Promotions - Pricing dynamique promotions ciblees',
      'B2B Commerce - Portail e-commerce B2B catalogues personnalises',
      'Integration Supply Chain Finance - Synchro ERP temps reel'
    ]),
    benefits: JSON.stringify([
      'Revenue online +30% recommendations IA personnalisees',
      'Customer retention +25% clienteling experience omnicanal',
      'Inventory accuracy +40% visibilite stock unified temps reel',
      'Conversion rate +20% checkout optimise personnalisation',
      'Store efficiency +35% POS moderne unified commerce'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Retail Omnicanal',
        description: 'Magasins physiques + e-commerce experience client unifiee',
        industries: ['Retail', 'Fashion', 'Consumer Goods'],
        businessImpact: 'Sales +35%, customer lifetime value +40%'
      },
      {
        title: 'B2B Commerce',
        description: 'Portail e-commerce B2B catalogues pricing personnalises',
        industries: ['Distribution', 'Manufacturing'],
        businessImpact: 'Online orders +60%, service costs -30%'
      }
    ]),
    targetIndustries: JSON.stringify(['Retail', 'Fashion', 'Consumer Goods', 'Distribution', 'Manufacturing']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['Retail Director', 'E-Commerce Director', 'Omnichannel Manager']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Commerce', description: 'E-commerce + POS omnicanal', pricing: 'Custom pricing based on GMV' },
      { tier: 'Commerce Scale Unit', description: 'High availability infrastructure', pricing: 'Custom pricing' }
    ]),
    estimatedCost: 'Custom pricing selon GMV',
    implementationTime: '6-12 mois',
    complexity: 'high',
    salesPriority: 7,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['commerce', 'retail', 'e-commerce', 'pos', 'omnichannel']),
    tags: JSON.stringify(['retail', 'omnichannel', 'ai-powered'])
  },
  {
    name: 'dynamics-365-customer-insights',
    officialName: 'Dynamics 365 Customer Insights',
    category: 'business',
    subcategory: 'customer-data-platform',
    shortDescription: 'Customer Data Platform IA - Vue 360 client, segmentation IA, insights predictifs, activation audiences.',
    fullDescription: 'Customer Data Platform (CDP) unifiant donnees clients multisources pour vue 360 complete. IA segmentation audiences predictive, customer lifetime value prediction, churn prediction, next best action recommendations. Real-time data ingestion, activation audiences marketing sales service.',
    keyFeatures: JSON.stringify([
      'Unified Customer Profile - Vue 360 client unifiee multisources',
      'IA Segmentation - Segmentation audiences predictive comportementale',
      'Customer Insights IA - CLV prediction, churn prediction, affinites',
      'Real-Time Data Ingestion - Ingestion donnees temps reel streaming',
      'Activation Audiences - Activation segments marketing sales service',
      'Enrichment Data - Enrichissement profils donnees tierces',
      'Privacy Compliance - Gestion consentement RGPD privacy',
      'Analytics & Dashboards - Tableaux bord insights KPIs clients',
      'Integration Dynamics 365 - Synchro Sales Marketing Service native',
      'Power BI Integration - Reporting avance Power BI'
    ]),
    benefits: JSON.stringify([
      'Customer understanding +50% vue 360 unifiee insights IA',
      'Marketing ROI +35% segmentation predictive hyper-ciblage',
      'Customer retention +30% churn prediction actions preventives',
      'Personalization +40% next best action recommendations temps reel',
      'Time to insights -60% vs data warehouses traditionnels'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Marketing Personnalise',
        description: 'Hyper-personnalisation campagnes segmentation IA predictive',
        industries: ['Retail', 'Financial Services', 'Telecom'],
        businessImpact: 'Conversion +45%, ROAS +40%'
      },
      {
        title: 'Customer Retention',
        description: 'Churn prediction actions retention preventives',
        industries: ['Telecom', 'SaaS', 'Financial Services'],
        businessImpact: 'Churn -25%, retention revenue +30%'
      }
    ]),
    targetIndustries: JSON.stringify(['Retail', 'Financial Services', 'Telecom', 'Healthcare', 'Technology']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['CMO', 'CDO', 'Marketing Director', 'CX Director']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Customer Insights', description: 'CDP core platform', pricing: 'A partir de 1500 euros/tenant/mois' },
      { tier: 'Customer Insights + AI', description: 'Avec IA predictions avancees', pricing: 'Custom pricing' }
    ]),
    estimatedCost: 'A partir de 1500 euros/tenant/mois',
    implementationTime: '3-6 mois',
    complexity: 'medium-high',
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['cdp', 'customer data platform', 'ai', 'segmentation', 'personalization']),
    tags: JSON.stringify(['cdp', 'ai-powered', 'analytics'])
  },
  {
    name: 'dynamics-365-fraud-protection',
    officialName: 'Dynamics 365 Fraud Protection',
    category: 'security',
    subcategory: 'fraud-detection',
    shortDescription: 'Protection fraude IA - Detection fraude temps reel paiements, comptes, returns, bot protection.',
    fullDescription: 'Solution IA protection fraude e-commerce utilisant Microsoft AI Graph billions transactions. Detection temps reel fraude paiements, creation comptes frauduleux, abuse returns, bot attacks. Machine learning adaptatif, device fingerprinting, network analysis, rules engine personnalisable.',
    keyFeatures: JSON.stringify([
      'IA Fraud Detection - Detection fraude temps reel Microsoft AI Graph',
      'Purchase Protection - Protection paiements transactions frauduleuses',
      'Account Protection - Detection creation comptes bots frauduleux',
      'Loss Prevention - Prevention abuse returns fraude magasins',
      'Bot Protection - Detection mitigation attaques bots',
      'Device Fingerprinting - Identification devices comportements',
      'Network Analysis - Analyse reseaux fraude organisee',
      'Rules Engine - Moteur regles personnalisables metier',
      'Case Management - Gestion investigation cas fraude',
      'Reporting & Analytics - Tableaux bord fraude KPIs trends'
    ]),
    benefits: JSON.stringify([
      'Fraude paiements -70% detection IA temps reel precision',
      'False positives -50% vs regles traditionnelles machine learning',
      'Revenue protection +25% reduction chargebacks fraude',
      'Customer experience amelioree -60% friction legitimate customers',
      'Investigation efficiency +40% case management automated'
    ]),
    useCases: JSON.stringify([
      {
        title: 'E-Commerce Fraud',
        description: 'Protection fraude paiements e-commerce temps reel',
        industries: ['Retail', 'E-Commerce'],
        businessImpact: 'Fraude -65%, false positives -45%'
      },
      {
        title: 'Account Takeover Prevention',
        description: 'Detection prevention piratage comptes clients',
        industries: ['Financial Services', 'Gaming', 'Streaming'],
        businessImpact: 'Account takeover -80%, customer trust +30%'
      }
    ]),
    targetIndustries: JSON.stringify(['Retail', 'E-Commerce', 'Financial Services', 'Gaming', 'Digital Services']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['Risk Manager', 'Fraud Manager', 'CFO', 'E-Commerce Director']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Fraud Protection', description: 'Purchase + Account protection', pricing: 'Custom pricing based on transactions' },
      { tier: 'Fraud Protection Premium', description: 'Full suite + Loss Prevention', pricing: 'Custom pricing' }
    ]),
    estimatedCost: 'Custom pricing selon volume transactions',
    implementationTime: '2-4 mois',
    complexity: 'medium',
    salesPriority: 7,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['fraud', 'fraud detection', 'ai', 'security', 'risk management']),
    tags: JSON.stringify(['fraud-protection', 'ai-powered', 'security'])
  }
];

async function main() {
  console.log('Adding 5 Dynamics 365 solutions to knowledge base...\n');

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
