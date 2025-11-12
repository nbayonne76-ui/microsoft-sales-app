const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const solutions = [
  {
    name: 'dynamics-365-customer-voice',
    officialName: 'Dynamics 365 Customer Voice',
    category: 'business',
    subcategory: 'customer-experience',
    shortDescription: 'Plateforme feedback client - Surveys NPS CSAT, IA sentiment analysis, real-time insights, integration Dynamics 365.',
    fullDescription: 'Solution enterprise feedback management avec creation surveys professionnels (NPS, CSAT, CES), IA sentiment analysis, real-time alerts, closed-loop feedback workflows. Integration native Dynamics 365 Sales Service Marketing pour customer journey feedback. Analytics dashboards insights experience client.',
    keyFeatures: JSON.stringify([
      'Survey Builder - Creation surveys NPS CSAT CES professionnels',
      'IA Sentiment Analysis - Analyse sentiments feedbacks verbatims',
      'Multi-Channel Distribution - Email SMS web mobile QR codes',
      'Real-Time Alerts - Alertes temps reel feedbacks negatifs',
      'Closed-Loop Workflows - Workflows actions feedbacks automatises',
      'Integration Dynamics 365 - Native Sales Service Marketing triggers',
      'Analytics & Dashboards - Tableaux bord NPS trends satisfaction',
      'Multilingual Surveys - Enquetes multilingues traduction auto',
      'Response Management - Gestion reponses assignation suivi',
      'Power BI Integration - Reporting avance analytics BI'
    ]),
    benefits: JSON.stringify([
      'Customer satisfaction visibility +60% feedback systematique',
      'Response rates +40% vs surveys traditionnels multi-channel',
      'Issue resolution -50% closed-loop workflows real-time alerts',
      'NPS score +15 points actions insights predictive',
      'Survey creation time -70% templates IA suggestions'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Post-Purchase Feedback',
        description: 'Feedback automatique post-achat NPS CSAT integration CRM',
        industries: ['Retail', 'E-Commerce', 'B2B'],
        businessImpact: 'Response rate 35%, retention +18%'
      },
      {
        title: 'Employee Engagement',
        description: 'Enquetes engagement employes pulse surveys eNPS',
        industries: ['All'],
        businessImpact: 'Participation 75%, turnover -20%'
      }
    ]),
    targetIndustries: JSON.stringify(['Retail', 'Services', 'Healthcare', 'Financial Services', 'All']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['CX Director', 'Customer Success Manager', 'Marketing Director', 'HR Director']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Customer Voice', description: 'Core survey platform', pricing: '200 euros/tenant/mois (2000 responses)' },
      { tier: 'Additional Responses', description: 'Extra survey responses', pricing: '100 euros/1000 responses' }
    ]),
    estimatedCost: 'A partir de 200 euros/tenant/mois',
    implementationTime: '1-2 mois',
    complexity: 'low',
    salesPriority: 6,
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(['survey', 'feedback', 'nps', 'csat', 'customer experience', 'sentiment analysis']),
    tags: JSON.stringify(['cx', 'feedback', 'ai-powered'])
  },
  {
    name: 'dynamics-365-guides',
    officialName: 'Dynamics 365 Guides',
    category: 'business',
    subcategory: 'mixed-reality',
    shortDescription: 'Formation Mixed Reality - Guides procedures HoloLens AR, formation terrain hands-free, instructions holographiques.',
    fullDescription: 'Solution formation assistance Mixed Reality HoloLens permettant creation guides procedures holographiques step-by-step. Operateurs terrains suivent instructions 3D AR hands-free pour assemblage maintenance formation. Reduction erreurs acceleration apprentissage vs manuels papier videos.',
    keyFeatures: JSON.stringify([
      'HoloLens AR Guides - Instructions holographiques 3D superposees',
      'No-Code Authoring - Creation guides procedures drag-drop no-code',
      'Hands-Free Operation - Suivi instructions voix gestes hands-free',
      '3D Models Integration - Import modeles 3D CAD procedures',
      'Step-by-Step Instructions - Guidage sequentiel holographique',
      'Analytics & Insights - Metriques completion temps erreurs',
      'Offline Mode - Fonctionnement sans connexion terrain',
      'Multi-Language - Guides multilingues traduction',
      'Integration Dynamics 365 - Field Service Supply Chain integration',
      'Remote Assist Integration - Escalade expert remote collaboration'
    ]),
    benefits: JSON.stringify([
      'Training time -40% vs manuels traditionnels formation acceleree',
      'Error rates -50% instructions visuelles 3D contextuelles',
      'Productivity nouveaux -30% onboarding hands-on immersif',
      'Knowledge retention +75% apprentissage AR vs lectures',
      'Safety incidents -35% procedures securite holographiques'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Manufacturing Assembly',
        description: 'Assemblage production procedures holographiques operateurs',
        industries: ['Manufacturing', 'Automotive', 'Aerospace'],
        businessImpact: 'Assembly time -35%, defects -60%'
      },
      {
        title: 'Equipment Maintenance',
        description: 'Maintenance reparations equipements guides AR techniciens',
        industries: ['Manufacturing', 'Energy', 'Utilities'],
        businessImpact: 'MTTR -40%, first-time fix +45%'
      }
    ]),
    targetIndustries: JSON.stringify(['Manufacturing', 'Automotive', 'Aerospace', 'Energy', 'Healthcare']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['Operations Director', 'Manufacturing Manager', 'Training Manager', 'Safety Manager']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Dynamics 365 Guides', description: 'Per user license', pricing: '65 euros/user/mois' },
      { tier: 'HoloLens 2', description: 'Hardware device required', pricing: '3500 euros/device one-time' }
    ]),
    estimatedCost: '65 euros/user/mois + HoloLens hardware',
    implementationTime: '2-4 mois',
    complexity: 'medium',
    salesPriority: 6,
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(['mixed reality', 'ar', 'hololens', 'training', 'manufacturing', 'maintenance']),
    tags: JSON.stringify(['mixed-reality', 'ar', 'training'])
  },
  {
    name: 'dynamics-365-remote-assist',
    officialName: 'Dynamics 365 Remote Assist',
    category: 'business',
    subcategory: 'mixed-reality',
    shortDescription: 'Collaboration AR temps reel - Video AR HoloLens/mobile, annotations 3D, expertise remote hands-free.',
    fullDescription: 'Solution collaboration remote Mixed Reality permettant techniciens terrains recevoir assistance experts distants via video AR. Annotations 3D holographiques partagees, partage ecran, integration Teams. Expert voit point-de-vue technicien HoloLens/mobile et guide visuellement. Reduction deplacements experts acceleration resolutions.',
    keyFeatures: JSON.stringify([
      'AR Video Calling - Appels video AR HoloLens mobile Teams',
      '3D Annotations - Annotations holographiques 3D partagees spatial',
      'Hands-Free Communication - Communication voix gestes hands-free',
      'Screen Sharing - Partage ecrans documents photos',
      'Expert POV Sharing - Expert voit point-de-vue technicien first-person',
      'Recording & Snapshots - Enregistrement sessions snapshots documentation',
      'Integration Microsoft Teams - Appels Teams utilisateurs mobiles desktop',
      'Low-Bandwidth Support - Fonctionnement connexions faibles debit',
      'Integration Dynamics 365 - Field Service work orders context',
      'Asset Identification - Reconnaissance equipements context automatique'
    ]),
    benefits: JSON.stringify([
      'Expert travel costs -90% assistance remote vs deplacements',
      'Mean time to repair -50% expertise immediate remote',
      'First-time fix rate +40% guidage expert temps reel',
      'Customer downtime -60% resolutions rapides remote',
      'Knowledge transfer +50% sessions recorded best practices'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Remote Technical Support',
        description: 'Support technique distance clients equipements complexes',
        industries: ['Manufacturing', 'Medical Devices', 'Industrial Equipment'],
        businessImpact: 'Travel costs -85%, resolution time -55%'
      },
      {
        title: 'Field Service Escalation',
        description: 'Escalade techniciens terrain vers experts remote',
        industries: ['Utilities', 'Telecom', 'Energy'],
        businessImpact: 'Expert utilization +60%, MTTR -45%'
      }
    ]),
    targetIndustries: JSON.stringify(['Manufacturing', 'Energy', 'Utilities', 'Healthcare', 'Industrial Equipment']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['Service Director', 'Field Service Manager', 'Technical Support Manager']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Remote Assist', description: 'Per user license', pricing: '65 euros/user/mois' },
      { tier: 'Remote Assist + HoloLens', description: 'With HoloLens device', pricing: '65 euros/user/mois + hardware' }
    ]),
    estimatedCost: '65 euros/user/mois',
    implementationTime: '1-3 mois',
    complexity: 'low-medium',
    salesPriority: 6,
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(['mixed reality', 'ar', 'remote assist', 'collaboration', 'field service', 'hololens']),
    tags: JSON.stringify(['mixed-reality', 'ar', 'collaboration'])
  },
  {
    name: 'power-bi',
    officialName: 'Microsoft Power BI',
    category: 'analytics',
    subcategory: 'business-intelligence',
    shortDescription: 'Business Intelligence - Tableaux bord interactifs, rapports self-service, IA insights, embedded analytics.',
    fullDescription: 'Plateforme Business Intelligence leader permettant utilisateurs metiers creer tableaux bord rapports interactifs self-service sans IT. Connexion 100+ sources donnees, modelisation donnees, visualisations interactives, IA insights anomalies detection. Embedded analytics applications, mobile apps, collaboration workspace.',
    keyFeatures: JSON.stringify([
      'Self-Service BI - Creation rapports tableaux bord drag-drop metiers',
      '100+ Data Connectors - Connexion toutes sources donnees cloud on-prem',
      'Interactive Visualizations - Visualisations interactives modernes',
      'IA Insights - Anomalies detection explainability Q&A natural language',
      'Data Modeling - Modelisation donnees DAX calculations',
      'Embedded Analytics - Integration rapports applications white-label',
      'Mobile Apps - Applications mobiles iOS Android offline',
      'Collaboration Workspaces - Partage collaboration gouvernance',
      'Real-Time Dashboards - Tableaux bord temps reel streaming',
      'Integration Microsoft 365 - Teams Excel SharePoint embedding'
    ]),
    benefits: JSON.stringify([
      'Time to insights -80% vs BI traditionnelle IT-dependent',
      'Data-driven decisions +60% democratisation donnees metiers',
      'Report development -70% self-service vs IT requests',
      'Analytics adoption +50% visualisations intuitives mobiles',
      'BI costs -40% vs solutions BI traditionnelles'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Executive Dashboards',
        description: 'Tableaux bord executives KPIs real-time toutes fonctions',
        industries: ['All'],
        businessImpact: 'Decision speed +45%, visibility +60%'
      },
      {
        title: 'Operational Analytics',
        description: 'Analytics operationnelles ventes operations finance terrains',
        industries: ['All'],
        businessImpact: 'Operational efficiency +30%, issues detection 10x faster'
      },
      {
        title: 'Embedded Customer Analytics',
        description: 'Analytics embeddes applications SaaS clients white-label',
        industries: ['Software', 'SaaS'],
        businessImpact: 'Product differentiation, revenue per customer +25%'
      }
    ]),
    targetIndustries: JSON.stringify(['All']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['All Roles', 'Analysts', 'Data Teams', 'Executives']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Power BI Free', description: 'Individual use only', pricing: 'Gratuit' },
      { tier: 'Power BI Pro', description: 'Collaboration sharing', pricing: '10 euros/user/mois' },
      { tier: 'Power BI Premium', description: 'Enterprise capacities embedded', pricing: 'A partir de 5000 euros/capacity/mois' }
    ]),
    estimatedCost: 'A partir de 10 euros/user/mois',
    implementationTime: '1-4 semaines',
    complexity: 'low-medium',
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['bi', 'business intelligence', 'analytics', 'dashboards', 'reports', 'visualization']),
    tags: JSON.stringify(['bi', 'analytics', 'ai-powered'])
  },
  {
    name: 'power-apps',
    officialName: 'Microsoft Power Apps',
    category: 'development',
    subcategory: 'low-code',
    shortDescription: 'Low-code app development - Creation applications metiers rapide drag-drop, web mobile, integration donnees.',
    fullDescription: 'Plateforme low-code permettant utilisateurs metiers IT creer applications professionnelles web mobile sans programmation traditionnelle. Drag-drop interface builder, connexion toutes sources donnees, IA Builder vision forms, offline mobile apps, integration Microsoft 365 Dynamics 365. Governance IT security enterprise.',
    keyFeatures: JSON.stringify([
      'Low-Code Builder - Creation apps drag-drop canvas model-driven',
      'Mobile & Web Apps - Applications responsive web iOS Android',
      'Data Integration - Connexion 600+ sources donnees APIs',
      'IA Builder - IA vision forms prediction object detection',
      'Offline Mobile - Applications mobiles offline sync',
      'Component Libraries - Composants reutilisables templates',
      'Integration Microsoft 365 - SharePoint Teams embedding native',
      'Power Automate Integration - Workflows automation integres',
      'Enterprise Governance - ALM DevOps security DLP policies',
      'Dataverse Database - Base donnees relationnelle cloud integree'
    ]),
    benefits: JSON.stringify([
      'App development 10x faster vs code traditionnel',
      'IT backlog -60% citizen developers metiers apps simples',
      'Time to market -70% prototypes production rapide',
      'Development costs -50% vs developpement custom outsource',
      'Business agility +80% apps metiers custom rapides'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Mobile Field Apps',
        description: 'Applications mobiles terrains inspections inventaires offline',
        industries: ['Manufacturing', 'Retail', 'Field Service'],
        businessImpact: 'Paper elimination, productivity +40%'
      },
      {
        title: 'Internal Process Apps',
        description: 'Applications processus internes approvals requests workflows',
        industries: ['All'],
        businessImpact: 'Process time -50%, errors -70%'
      },
      {
        title: 'Customer Portals',
        description: 'Portails clients self-service orders tracking support',
        industries: ['All'],
        businessImpact: 'Support costs -35%, satisfaction +25%'
      }
    ]),
    targetIndustries: JSON.stringify(['All']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['IT Director', 'Business Analysts', 'Citizen Developers', 'Line of Business']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Power Apps per User', description: 'Unlimited apps usage', pricing: '20 euros/user/mois' },
      { tier: 'Power Apps per App', description: 'Single app + portal', pricing: '10 euros/user/app/mois' },
      { tier: 'Power Apps Pay-as-you-go', description: 'Azure consumption based', pricing: 'Variable' }
    ]),
    estimatedCost: 'A partir de 10 euros/user/mois',
    implementationTime: '1-12 semaines selon complexite',
    complexity: 'low-medium',
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['low-code', 'app development', 'mobile apps', 'citizen developer', 'power platform']),
    tags: JSON.stringify(['low-code', 'development', 'ai-powered'])
  },
  {
    name: 'power-automate',
    officialName: 'Microsoft Power Automate',
    category: 'development',
    subcategory: 'automation',
    shortDescription: 'Automation workflows - RPA, processus metiers, integration APIs, IA automation, desktop cloud flows.',
    fullDescription: 'Plateforme automation workflows permettant automatisation processus metiers sans code. Cloud flows integration 600+ services APIs, desktop flows RPA automatisation legacy applications, process mining decouverte processus, IA Builder automation intelligente. Approbations, notifications, data collection automatises.',
    keyFeatures: JSON.stringify([
      'Cloud Flows - Workflows cloud integration APIs 600+ connecteurs',
      'Desktop Flows RPA - RPA automatisation applications legacy desktop',
      'Process Mining - Decouverte analyse processus optimization',
      'IA Builder Automation - Automation intelligente IA vision forms',
      'Approval Workflows - Workflows approbations multi-niveaux',
      'Scheduled Flows - Flows planifies batch processing',
      'Integration Microsoft 365 - Automation Teams SharePoint Outlook',
      'Error Handling - Gestion erreurs retry policies notifications',
      'Integration Power Apps - Declenchement flows depuis apps',
      'Analytics & Monitoring - Monitoring flows performances errors'
    ]),
    benefits: JSON.stringify([
      'Manual tasks automation -80% processes repetitifs',
      'Process efficiency +60% vs processus manuels',
      'Error rates -70% automation vs saisies manuelles',
      'Employee productivity +40% focus high-value tasks',
      'IT development -50% automation low-code vs code custom'
    ]),
    useCases: JSON.stringify([
      {
        title: 'Approval Processes',
        description: 'Automatisation approbations achats conges expenses multi-level',
        industries: ['All'],
        businessImpact: 'Approval time -65%, visibility +50%'
      },
      {
        title: 'Data Integration',
        description: 'Synchronisation donnees entre systemes CRM ERP legacy',
        industries: ['All'],
        businessImpact: 'Manual data entry elimination, accuracy +95%'
      },
      {
        title: 'RPA Legacy Systems',
        description: 'Automatisation interactions applications legacy desktop',
        industries: ['Finance', 'Insurance', 'Healthcare'],
        businessImpact: 'Processing time -75%, headcount savings'
      }
    ]),
    targetIndustries: JSON.stringify(['All']),
    idealCustomerSize: 'SME, Enterprise',
    targetPersonas: JSON.stringify(['IT Director', 'Operations Manager', 'Process Excellence', 'Business Analysts']),
    pricingModel: 'subscription',
    pricingTiers: JSON.stringify([
      { tier: 'Power Automate per User', description: 'Unlimited flows', pricing: '15 euros/user/mois' },
      { tier: 'Power Automate per Flow', description: 'Single flow unlimited users', pricing: '100 euros/flow/mois' },
      { tier: 'Power Automate RPA', description: 'Unattended RPA bots', pricing: '150 euros/bot/mois' }
    ]),
    estimatedCost: 'A partir de 15 euros/user/mois',
    implementationTime: '1-8 semaines selon complexite',
    complexity: 'low-medium',
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(['automation', 'rpa', 'workflows', 'integration', 'power platform', 'process mining']),
    tags: JSON.stringify(['automation', 'rpa', 'low-code', 'ai-powered'])
  }
];

async function main() {
  console.log('Adding 6 specialized solutions (MR, Power Platform, CX) to knowledge base...\n');

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
