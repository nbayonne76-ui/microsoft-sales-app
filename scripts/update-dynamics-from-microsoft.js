/**
 * Update Dynamics 365 solutions in azure-solutions.json
 * with official data scraped from microsoft.com/en-us/dynamics-365
 */

const fs   = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/azure-solutions.json');
const data      = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

const J = (arr) => JSON.stringify(arr, null, 0);

// ── UPDATES par solution ──────────────────────────────────────────────────────

const UPDATES = {

  'Dynamics 365 Sales': {
    shortDescription: "Close deals faster and improve team productivity with a trusted agentic CRM solution — powered by 4 autonomous AI Sales Agents and Microsoft Copilot.",
    shortDescriptionFr: "Concluez des contrats plus rapidement et améliorez la productivité commerciale grâce à un CRM agentique de confiance — propulsé par 4 agents IA autonomes et Microsoft Copilot.",
    fullDescription: "Dynamics 365 Sales is Microsoft's cloud-based agentic CRM designed to transform sales from a system of record into a system of action. The platform embeds four autonomous AI agents: the Sales Qualification Agent (autonomously prioritizes and engages leads 24/7), the Sales Opportunity Agent (continuously researches deals and surfaces risks), the Sales Research Agent (delivers real-time decision-ready insights), and the Sales Close Agent (analyzes deals to equip sellers with winning strategies). Native Copilot integration generates meeting prep notes, email drafts, call summaries, and opportunity summaries in natural language. A unified AI-ready data layer connects Dynamics 365, Microsoft 365, and LinkedIn Sales Navigator. Customer results: Lenovo reports $1.3B potential annual sales increase; Sandvik Coromant saved 123 hours qualifying 99 leads; First West achieved 100% team adoption in 7 weeks. Microsoft's own sales team using Copilot achieved +15.1% lead-to-opportunity conversion and +9.4% higher revenue per seller. Ranked Leader in Gartner Magic Quadrant for Sales Force Automation Platforms (July 2025).",
    fullDescriptionFr: "Dynamics 365 Sales est le CRM agentique cloud de Microsoft, conçu pour transformer la vente d'un système d'enregistrement en un système d'action. La plateforme intègre quatre agents IA autonomes : le Sales Qualification Agent (qualification et engagement des leads 24h/24), le Sales Opportunity Agent (analyse continue des deals et détection des risques), le Sales Research Agent (insights décisionnels en temps réel), et le Sales Close Agent (stratégies gagnantes pour conclure les deals). L'intégration native de Copilot génère des notes de préparation de réunion, des brouillons d'emails, des résumés d'appels et d'opportunités en langage naturel. Une couche de données unifiée connecte Dynamics 365, Microsoft 365 et LinkedIn Sales Navigator. Résultats clients : Lenovo signale 1,3 Md$ de ventes potentielles supplémentaires ; Sandvik Coromant a économisé 123 heures en qualifiant 99 leads ; First West a atteint 100% d'adoption en 7 semaines. Leader Gartner Magic Quadrant Sales Force Automation 2025.",
    keyFeaturesEn: J([
      "Sales Qualification Agent: autonomously prioritizes and engages leads 24/7",
      "Sales Opportunity Agent: continuously surfaces deal risks and missing actions",
      "Sales Research Agent: real-time decision-ready insights on complex sales questions",
      "Sales Close Agent: analyzes deals to equip sellers with winning strategies (preview)",
      "Custom AI Agents via Copilot Studio for tailored sales workflows",
      "Copilot: meeting prep notes, email drafts, call summaries in natural language",
      "Autonomous CRM data enrichment — keeps records always up to date",
      "Pipeline management, lead scoring, opportunity tracking and AI forecasting",
      "Native integration with Microsoft 365, Teams, Outlook, LinkedIn Sales Navigator",
      "Power Platform integration for custom apps and automated workflows"
    ]),
    keyFeatures: J([
      "Sales Qualification Agent : qualification et engagement autonome des leads 24h/24",
      "Sales Opportunity Agent : détection continue des risques sur les deals",
      "Sales Research Agent : insights décisionnels en temps réel",
      "Sales Close Agent : stratégies gagnantes pour conclure les contrats (preview)",
      "Agents IA personnalisés via Copilot Studio",
      "Copilot : notes de réunion, emails, résumés d'appels en langage naturel",
      "Enrichissement autonome des données CRM",
      "Pipeline, scoring des leads, prévisions IA",
      "Intégration native M365, Teams, Outlook, LinkedIn Sales Navigator",
      "Intégration Power Platform pour apps et workflows personnalisés"
    ]),
    benefitsEn: J([
      "Accelerated deal closure and revenue growth through AI automation",
      "Consistent sales processes scaled across teams with agent-driven execution",
      "Reduced manual CRM data entry — agents maintain record hygiene automatically",
      "Improved lead conversion rates through always-on qualification",
      "Data-driven forecasting for accurate pipeline visibility",
      "+15.1% lead-to-opportunity conversion (Microsoft internal data)",
      "+9.4% higher revenue per seller (Microsoft internal data)",
      "Faster ramp for new sellers with AI-guided best practices"
    ]),
    benefits: J([
      "Accélération des cycles de vente et croissance du chiffre d'affaires par l'IA",
      "Processus commerciaux cohérents et scalables grâce aux agents autonomes",
      "Réduction de la saisie manuelle — les agents maintiennent la qualité des données",
      "Amélioration des taux de conversion grâce à la qualification 24h/24",
      "Prévisions précises du pipeline commercial",
      "+15,1% de conversion lead-to-opportunity (données internes Microsoft)",
      "+9,4% de revenu par vendeur (données internes Microsoft)",
      "Montée en compétences rapide des nouveaux commerciaux avec l'IA"
    ]),
  },

  'Dynamics 365 Customer Service': {
    shortDescription: "Empower service representatives to resolve issues quickly using AI agents, Copilot, and omnichannel capabilities — from email to voice to social.",
    shortDescriptionFr: "Permettez à vos agents de résoudre les problèmes rapidement grâce aux agents IA, Copilot et aux capacités omnicanales — de l'email à la voix en passant par les réseaux sociaux.",
    fullDescription: "Dynamics 365 Customer Service is a cloud-based AI-powered customer support solution that enables faster issue resolution through five specialized autonomous agents: the Case Management Agent (shadow mode, auto-creates and resolves cases), the Knowledge Management Agent (auto-updates knowledge articles from case notes), the Customer Intent Agent (discovers and maps customer intents from conversations), the Quality Evaluation Agent (real-time coaching and compliance scoring), and fully custom agents via Copilot Studio. Copilot assistance provides AI-recommended knowledge articles, real-time sentiment analysis, translations, and transcription. Intelligent routing matches customers with the right agent based on skills, sentiment, and case history. Omnichannel support spans email, chat, social, phone, and text. Customer results: Lenovo achieved 20% reduction in handling time; Hype achieved 90% first-call resolution; customers report 70% reduction in human agent intervention. Current promotion: 40% discount through June 30, 2026.",
    fullDescriptionFr: "Dynamics 365 Customer Service est une solution cloud de support client alimentée par l'IA qui accélère la résolution des problèmes grâce à cinq agents autonomes spécialisés : l'Agent Case Management (crée et résout les cas automatiquement), l'Agent Knowledge Management (met à jour les articles de connaissance depuis les notes de cas), l'Agent Customer Intent (cartographie les intentions des clients), l'Agent Quality Evaluation (coaching en temps réel), et des agents personnalisés via Copilot Studio. Copilot recommande des articles de connaissance, analyse les sentiments en temps réel, traduit et transcrit les conversations. Le routage intelligent associe chaque client à l'agent le plus qualifié. Support omnicanal : email, chat, social, téléphone, SMS. Résultats : Lenovo -20% de temps de traitement ; Hype 90% de résolution au premier appel ; 70% de réduction des interventions humaines.",
    keyFeaturesEn: J([
      "Case Management Agent: auto-creates and resolves cases in shadow mode (GA May 2026)",
      "Knowledge Management Agent: auto-updates knowledge articles from case insights",
      "Customer Intent Agent: discovers intents from conversations across channels",
      "Quality Evaluation Agent: real-time quality, compliance, and coaching scoring",
      "Custom AI Agents via Copilot Studio for workflow-specific automation",
      "Copilot: AI-recommended knowledge articles, response drafts, call summaries",
      "Omnichannel support: email, chat, social, voice, SMS",
      "Intelligent routing: skills-based, sentiment-aware, AI-powered matching",
      "360-degree customer view with interaction history and sentiment tracking",
      "Supervisor dashboards: real-time analytics, KPIs, workforce forecasting",
      "1,000+ prebuilt automation flows for operational efficiency"
    ]),
    keyFeatures: J([
      "Agent Case Management : création et résolution automatiques des cas (GA mai 2026)",
      "Agent Knowledge Management : mise à jour automatique des articles de connaissance",
      "Agent Customer Intent : cartographie des intentions clients depuis les conversations",
      "Agent Quality Evaluation : coaching et conformité en temps réel",
      "Agents IA personnalisés via Copilot Studio",
      "Copilot : articles recommandés, brouillons de réponses, résumés d'appels",
      "Support omnicanal : email, chat, social, voix, SMS",
      "Routage intelligent basé sur les compétences, le sentiment et l'historique",
      "Vue client 360° avec historique des interactions et analyse des sentiments",
      "Tableaux de bord superviseur : analytics temps réel, KPIs, prévisions",
      "1 000+ workflows d'automatisation prêts à l'emploi"
    ]),
    benefitsEn: J([
      "Faster issue resolution: Lenovo achieved 20% reduction in handling time",
      "Higher first-contact resolution: Hype achieved 90% FCR rate",
      "Reduced human intervention: 70% reduction in agent escalations reported",
      "Lower operational costs through automation and self-service",
      "Consistent service quality at scale through AI quality evaluation",
      "Improved agent satisfaction by eliminating repetitive manual tasks",
      "Real-time knowledge base maintenance — always-current information for agents"
    ]),
    benefits: J([
      "Résolution plus rapide : Lenovo -20% de temps de traitement",
      "Meilleure résolution au premier contact : Hype 90% de FCR",
      "Moins d'interventions humaines : -70% d'escalades signalées",
      "Réduction des coûts opérationnels par l'automatisation",
      "Qualité de service cohérente à grande échelle via l'évaluation IA",
      "Meilleure satisfaction des agents en éliminant les tâches répétitives",
      "Base de connaissances maintenue en temps réel — toujours à jour"
    ]),
  },

  'Dynamics 365 Finance': {
    shortDescription: "Improve financial agility, control, and insight with AI-powered financial management covering 57 countries/regions in 67 languages — powered by Microsoft Copilot and agents.",
    shortDescriptionFr: "Améliorez l'agilité, le contrôle et les insights financiers avec une gestion financière propulsée par l'IA, couvrant 57 pays/régions en 67 langues.",
    fullDescription: "Dynamics 365 Finance is a cloud-based financial management solution helping organizations modernize financial operations through AI automation and intelligent insights. Core capabilities include general ledger management, automated accounting close, accounts receivable/payable processing, cash flow forecasting, and tax management across 57 countries/regions in 67 languages. The Account Reconciliation Agent (preview) automates subledger matching. The Finance Agent in Microsoft 365 Copilot (preview) enables natural language financial queries. Copilot-assisted invoice workflows reduce manual processing by up to 80%. Business performance management delivers self-service dashboards with dynamic forecasting and scenario modeling. Quote-to-cash, subscription billing, and predictive customer payment analytics complete the suite. Customer results: 80% drop in manual data entry; accelerated financial close cycles; Named Leader in IDC MarketScape for AI-Enabled Large Enterprise ERP Applications 2025.",
    fullDescriptionFr: "Dynamics 365 Finance est une solution cloud de gestion financière qui aide les organisations à moderniser leurs opérations financières grâce à l'automatisation IA et aux insights intelligents. Fonctionnalités clés : gestion de la comptabilité générale, clôture comptable automatisée, gestion des comptes clients/fournisseurs, prévisions de trésorerie, et gestion fiscale dans 57 pays/régions en 67 langues. L'Account Reconciliation Agent (preview) automatise le rapprochement des sous-livres. Le Finance Agent dans Microsoft 365 Copilot (preview) permet des requêtes financières en langage naturel. Les workflows de facturation assistés par Copilot réduisent le traitement manuel jusqu'à 80%. Résultats clients : -80% de saisie manuelle ; accélération des cycles de clôture. Leader IDC MarketScape pour les ERP Enterprise avec IA 2025.",
    keyFeaturesEn: J([
      "Account Reconciliation Agent (preview): automates subledger matching",
      "Finance Agent in Microsoft 365 Copilot (preview): natural language financial queries",
      "Copilot-assisted invoice capture, workflows and collections automation",
      "General ledger management and automated accounting close",
      "Cash flow forecasting and liquidity management",
      "Accounts receivable/payable with predictive payment analytics",
      "Tax management: 57 countries/regions, 67 languages",
      "Quote-to-cash and subscription billing capabilities",
      "Business performance management with self-service dashboards",
      "Dynamic forecasting and cross-functional scenario modeling",
      "Custom AI Agents via Copilot Studio"
    ]),
    keyFeatures: J([
      "Account Reconciliation Agent (preview) : rapprochement automatique des sous-livres",
      "Finance Agent dans Microsoft 365 Copilot (preview) : requêtes financières en langage naturel",
      "Workflows de facturation et relances automatisés par Copilot",
      "Gestion de la comptabilité générale et clôture automatisée",
      "Prévisions de trésorerie et gestion des liquidités",
      "Comptes clients/fournisseurs avec analyses prédictives des paiements",
      "Gestion fiscale : 57 pays/régions, 67 langues",
      "Quote-to-cash et facturation par abonnement",
      "Gestion des performances avec tableaux de bord en libre-service",
      "Prévisions dynamiques et modélisation de scénarios",
      "Agents IA personnalisés via Copilot Studio"
    ]),
    benefitsEn: J([
      "80% reduction in manual data entry (customer-reported)",
      "Accelerated financial close cycles with automated reconciliation",
      "Improved cash flow visibility and payment prediction accuracy",
      "Global compliance in 57 countries without custom development",
      "Cost savings by eliminating manual customizations",
      "Enhanced workforce productivity through AI-assisted workflows",
      "Leader IDC MarketScape AI-Enabled Large Enterprise ERP 2025"
    ]),
    benefits: J([
      "-80% de saisie manuelle (données clients)",
      "Accélération des cycles de clôture comptable",
      "Meilleure visibilité sur la trésorerie et prévision des paiements",
      "Conformité mondiale dans 57 pays sans développement spécifique",
      "Économies en supprimant les personnalisations manuelles",
      "Productivité accrue des équipes via les workflows assistés par IA",
      "Leader IDC MarketScape ERP Enterprise avec IA 2025"
    ]),
  },

  'Dynamics 365 Business Central': {
    shortDescription: "All-in-one AI-powered cloud ERP for SMBs connecting finance, sales, service, and operations — named best ERP system of 2024 by Forbes Advisor.",
    shortDescriptionFr: "ERP cloud tout-en-un propulsé par l'IA pour les PME connectant finance, ventes, service et opérations — élu meilleur ERP 2024 par Forbes Advisor.",
    fullDescription: "Dynamics 365 Business Central is an AI-powered cloud ERP designed for small and midsize businesses (10 to 5,000+ employees). It unifies financial management, sales, service, project management, supply chain, inventory, warehouse, and manufacturing in a single platform. Four autonomous AI agents are available: the Sales Order Agent (converts emails to quotes/orders automatically), the Payables Agent (automates invoice capture, matching, and approval routing), the Expense Agent (streamlines receipt capture and expense approvals), and custom agents via Copilot Studio. Native integration with Microsoft 365 (Outlook, Excel, Teams), Power BI, Power Automate, and Shopify. Supports 47 languages across 242+ countries. Customer results: 50% time savings for finance employees; 60% reduction in month-end close time; 400% faster close processes; 25% reduction in stock shortages; 20% reduction in administrative costs; 98% improved recording accuracy. Sold exclusively through Microsoft's global partner network. 30-day free trial available.",
    fullDescriptionFr: "Dynamics 365 Business Central est un ERP cloud IA conçu pour les PME (10 à 5 000+ employés). Il unifie la gestion financière, les ventes, le service, la gestion de projets, la chaîne d'approvisionnement, les stocks, l'entrepôt et la production dans une seule plateforme. Quatre agents IA autonomes : le Sales Order Agent (convertit les emails en devis/commandes automatiquement), le Payables Agent (automatise la capture et la validation des factures), l'Expense Agent (simplifie la capture des reçus et les notes de frais), et des agents personnalisés via Copilot Studio. Intégration native avec Microsoft 365 (Outlook, Excel, Teams), Power BI, Power Automate et Shopify. Support de 47 langues dans 242+ pays. Résultats clients : -50% de temps pour les équipes finance ; -60% de temps de clôture mensuelle ; -25% de ruptures de stock ; -20% de coûts administratifs. Essai gratuit 30 jours.",
    keyFeaturesEn: J([
      "Sales Order Agent: converts emails to quotes and sales orders automatically",
      "Payables Agent: automates invoice capture, matching, and approval routing",
      "Expense Agent: streamlines receipt capture and expense report approvals",
      "Custom AI Agents via Copilot Studio for organization-specific workflows",
      "Copilot: bank reconciliation, ad-hoc analysis, month-end close acceleration",
      "Financial management: automated invoicing, cash flow forecasting, multi-entity",
      "Supply chain, inventory management, and warehouse operations",
      "Manufacturing: bills of materials, production orders, batch traceability",
      "Native M365 integration: Outlook, Excel, Teams, Power BI, Power Automate",
      "Shopify connector for e-commerce integration",
      "Support for 47 languages, 242+ countries, multi-currency"
    ]),
    keyFeatures: J([
      "Sales Order Agent : conversion automatique des emails en devis/commandes",
      "Payables Agent : capture, rapprochement et validation automatiques des factures",
      "Expense Agent : simplification de la capture des reçus et notes de frais",
      "Agents IA personnalisés via Copilot Studio",
      "Copilot : rapprochement bancaire, analyse ad-hoc, accélération de la clôture",
      "Gestion financière : facturation automatisée, prévisions de trésorerie, multi-entité",
      "Chaîne d'approvisionnement, gestion des stocks et des entrepôts",
      "Production : nomenclatures, ordres de fabrication, traçabilité des lots",
      "Intégration native M365 : Outlook, Excel, Teams, Power BI, Power Automate",
      "Connecteur Shopify pour l'e-commerce",
      "47 langues, 242+ pays, multi-devises"
    ]),
    benefitsEn: J([
      "50% time savings for finance employees (customer-reported)",
      "60% reduction in month-end close time",
      "400% faster close processes reported by customers",
      "25% reduction in stock shortages",
      "20% reduction in administrative costs",
      "98% improved recording accuracy",
      "80% reduction in reporting time",
      "90% faster financial consolidation",
      "Rapid implementation: weeks, not months",
      "Named best ERP system of 2024 by Forbes Advisor"
    ]),
    benefits: J([
      "-50% de temps pour les équipes finance (données clients)",
      "-60% du temps de clôture mensuelle",
      "Processus de clôture 400x plus rapides selon certains clients",
      "-25% de ruptures de stock",
      "-20% de coûts administratifs",
      "98% de précision d'enregistrement améliorée",
      "-80% de temps de reporting",
      "-90% du temps de consolidation financière",
      "Implémentation rapide : semaines, pas des mois",
      "Élu meilleur ERP 2024 par Forbes Advisor"
    ]),
  },

  'Dynamics 365 Supply Chain Management': {
    shortDescription: "Respond faster and operate smarter with AI agents and Copilot to connect your supply chain from demand to delivery — across planning, procurement, manufacturing, warehouse, and logistics.",
    shortDescriptionFr: "Répondez plus vite et opérez plus intelligemment avec les agents IA et Copilot pour connecter votre chaîne d'approvisionnement de la demande à la livraison.",
    fullDescription: "Dynamics 365 Supply Chain Management is a cloud ERP solution connecting end-to-end supply chain operations through AI and autonomous agents. The Procurement Agent (preview) autonomously communicates with suppliers to address delivery risks and disruptions. AI-powered demand forecasting with explainable models runs complete MRP cycles in minutes. DDMRP dynamic stock buffers eliminate stockouts. Procurement includes Copilot-assisted sourcing decisions, supply risk assessment, automated approvals, and vendor performance tracking with embedded Power BI. Manufacturing supports discrete, process, and lean production with IoT and mixed reality integration. Warehouse management includes robotic material handling, mobile guidance apps, and process mining. Asset management covers predictive, corrective, and condition-based maintenance with OEE optimization. Customer results: Vera Bradley saves millions annually in maintenance costs; Orkla +44% line-picking rate; Enerjisa -70% paper output. Named Leader in three Gartner Magic Quadrant reports for Cloud ERP 2025. Leader IDC MarketScape AI-Enabled Large Enterprise ERP 2025.",
    fullDescriptionFr: "Dynamics 365 Supply Chain Management est une solution ERP cloud connectant les opérations de chaîne d'approvisionnement de bout en bout grâce à l'IA et aux agents autonomes. Le Procurement Agent (preview) communique de manière autonome avec les fournisseurs pour gérer les risques et perturbations de livraison. Les prévisions de la demande par IA avec modèles explicables exécutent des cycles MRP complets en quelques minutes. Les tampons de stock dynamiques DDMRP éliminent les ruptures. La gestion des achats inclut des décisions de sourcing assistées par Copilot, l'évaluation des risques fournisseurs, et le suivi des performances. La production supporte les modes discret, process et lean avec intégration IoT. La gestion d'entrepôt inclut la robotique, les apps mobiles et le process mining. Résultats : Vera Bradley économise des millions en maintenance ; Orkla +44% de taux de préparation ; Enerjisa -70% de production papier. Leader 3 Gartner Magic Quadrant ERP Cloud 2025.",
    keyFeaturesEn: J([
      "Procurement Agent (preview): autonomous supplier communications for delivery risk management",
      "AI-powered demand forecasting with explainable models, complete MRP in minutes",
      "DDMRP dynamic stock buffers to eliminate stockouts",
      "Copilot-assisted sourcing decisions and supply risk assessment",
      "Automated procurement approvals and vendor performance tracking (Power BI)",
      "Discrete, process, and lean manufacturing support",
      "IoT and mixed reality integration for production acceleration",
      "Warehouse management: robotic integration, mobile apps, process mining, OTIF optimization",
      "Asset management: predictive, corrective, condition-based maintenance, OEE optimization",
      "Carrier integration (FedEx) for accurate delivery promises and returns management",
      "Custom AI Agents via Copilot Studio"
    ]),
    keyFeatures: J([
      "Procurement Agent (preview) : communications autonomes avec les fournisseurs",
      "Prévisions de la demande par IA, cycles MRP complets en quelques minutes",
      "Tampons de stock dynamiques DDMRP pour éliminer les ruptures",
      "Décisions de sourcing assistées par Copilot et évaluation des risques fournisseurs",
      "Approbations automatisées et suivi des performances fournisseurs (Power BI)",
      "Support de la production discrète, process et lean",
      "Intégration IoT et réalité mixte pour la production",
      "Gestion d'entrepôt : robotique, apps mobiles, process mining, optimisation OTIF",
      "Gestion des actifs : maintenance préventive, corrective, conditionnelle, OEE",
      "Intégration transporteurs (FedEx) pour des promesses de livraison précises",
      "Agents IA personnalisés via Copilot Studio"
    ]),
    benefitsEn: J([
      "Millions in annual maintenance and software cost savings (Vera Bradley)",
      "44% improvement in line-picking rate (Orkla)",
      "70% reduction in paper output / 50K USD savings (Enerjisa Üretim)",
      "25% reduction in live agent chat escalations (Vera Bradley)",
      "Standardized processes across 22 production locations (Taylor Farms)",
      "99.9% uptime SLA with enterprise-grade security",
      "Leader in 3 Gartner Magic Quadrant reports for Cloud ERP 2025",
      "Leader IDC MarketScape AI-Enabled Large Enterprise ERP 2025"
    ]),
    benefits: J([
      "Économies de plusieurs millions en coûts de maintenance (Vera Bradley)",
      "+44% de taux de préparation des lignes (Orkla)",
      "-70% de production papier / 50K USD économisés (Enerjisa Üretim)",
      "-25% d'escalades vers les agents humains (Vera Bradley)",
      "Standardisation des processus sur 22 sites de production (Taylor Farms)",
      "SLA de 99,9% de disponibilité avec sécurité de niveau entreprise",
      "Leader dans 3 Gartner Magic Quadrant ERP Cloud 2025",
      "Leader IDC MarketScape ERP Enterprise avec IA 2025"
    ]),
  },

  'Dynamics 365 Customer Insights': {
    shortDescription: "Bring data and engagement together to power end-to-end agentic customer experiences across sales, marketing, and service — with 324% ROI in 3 years.",
    shortDescriptionFr: "Unifiez données et engagement pour créer des expériences clients agentiques de bout en bout sur les ventes, le marketing et le service — avec 324% de ROI en 3 ans.",
    fullDescription: "Dynamics 365 Customer Insights is Microsoft's AI-powered customer data and journey platform that unifies customer profiles from disconnected CRM sources and delivers real-time, personalized experiences at scale. Unified customer profiles consolidate data from all sources with real-time refresh for consent and privacy compliance. AI-powered segments, predictive analytics, and profile enrichment with proprietary intelligence enable hyper-personalization. Agentic capabilities proactively engage customers across digital channels: email, SMS, push notifications, and conversational voice. Copilot creates automated audience segments, generates email content and images, and builds intelligent customer journeys from natural language descriptions. A/B testing optimization and automated lead scoring facilitate sales handoff. Forrester Consulting research reports: 324% ROI over 3 years; 75% time savings on journey development; less than 6 months to payback period; 15% conversion rate improvement per journey. Pricing: $1,700/month includes 4 environments, 100,000 unified profiles, and 10,000 interacted people.",
    fullDescriptionFr: "Dynamics 365 Customer Insights est la plateforme de données clients et de parcours client IA de Microsoft. Elle unifie les profils clients depuis des sources CRM disparates et délivre des expériences personnalisées en temps réel à grande échelle. Les profils unifiés consolident les données avec rafraîchissement en temps réel pour la conformité RGPD. Les segments IA, l'analytique prédictive et l'enrichissement des profils permettent l'hyperpersonnalisation. Les capacités agentiques engagent proactivement les clients sur tous les canaux : email, SMS, push, voix. Copilot crée des segments d'audience, génère du contenu email et des images, et construit des parcours clients intelligents depuis des descriptions en langage naturel. Recherche Forrester Consulting : 324% de ROI sur 3 ans ; -75% de temps sur le développement de parcours ; moins de 6 mois de retour sur investissement ; +15% de taux de conversion par parcours.",
    keyFeaturesEn: J([
      "Unified customer profiles from all CRM sources with real-time consent refresh",
      "AI-recommended segments with continuous updates and predictive analytics",
      "Agentic capabilities: proactive customer engagement across all channels",
      "Real-time omnichannel journeys: email, SMS, push notifications, conversational voice",
      "Copilot: AI-generated content (emails, headlines, images), audience creation in natural language",
      "Intelligent journey builder from business goal descriptions",
      "A/B testing and experimentation for journey optimization",
      "Automated lead scoring and qualification for sales handoff",
      "Profile enrichment with proprietary Microsoft intelligence",
      "Prebuilt analytics dashboards for pipeline and campaign tracking",
      "GDPR-compliant consent management and real-time data refresh"
    ]),
    keyFeatures: J([
      "Profils clients unifiés depuis toutes les sources CRM avec rafraîchissement temps réel",
      "Segments recommandés par IA avec mise à jour continue et analytique prédictive",
      "Capacités agentiques : engagement proactif des clients sur tous les canaux",
      "Parcours omnicanaux en temps réel : email, SMS, push, voix conversationnelle",
      "Copilot : génération de contenu IA (emails, titres, images), création de segments en langage naturel",
      "Constructeur de parcours intelligents depuis des descriptions d'objectifs business",
      "Tests A/B et expérimentation pour optimiser les parcours",
      "Scoring automatique des leads et qualification pour le handoff commercial",
      "Enrichissement des profils avec l'intelligence propriétaire Microsoft",
      "Tableaux de bord analytiques prêts à l'emploi",
      "Gestion du consentement RGPD et rafraîchissement des données en temps réel"
    ]),
    benefitsEn: J([
      "324% ROI over 3 years (Forrester Consulting research)",
      "75% time savings on customer journey development",
      "Less than 6 months to payback period",
      "15% conversion rate improvement per journey",
      "Hyper-personalization at scale without manual segmentation",
      "Proactive customer engagement replacing reactive service models",
      "Unified view eliminating data silos across sales, marketing, and service"
    ]),
    benefits: J([
      "324% de ROI sur 3 ans (recherche Forrester Consulting)",
      "-75% de temps sur le développement des parcours clients",
      "Retour sur investissement en moins de 6 mois",
      "+15% de taux de conversion par parcours",
      "Hyperpersonnalisation à grande échelle sans segmentation manuelle",
      "Engagement proactif des clients remplaçant les modèles réactifs",
      "Vue unifiée éliminant les silos de données entre ventes, marketing et service"
    ]),
  },

  'Dynamics 365 Field Service': {
    shortDescription: "Transform field service operations with an agentic solution that optimizes scheduling, empowers technicians with Copilot, and delivers proactive on-site service.",
    shortDescriptionFr: "Transformez vos opérations de service terrain avec une solution agentique qui optimise la planification, outille les techniciens avec Copilot et délivre un service proactif sur site.",
    fullDescription: "Dynamics 365 Field Service is an agentic field service management solution that transforms how organizations deliver on-site service. The Scheduling Operations Agent (preview) autonomously optimizes technician schedules in real time as conditions change throughout the day. Self-service scheduling portals built on Power Apps give customers real-time appointment visibility and booking control. Technicians access Copilot for natural language queries about product manuals, work orders, and issue resolution — with Microsoft Teams integration providing work order details in chat. Copilot generates post-engagement customer responses summarizing work orders. Automated communication keeps customers informed via email and text reminders. Native integration with Dynamics 365 Business Central unifies financial and inventory data. Forrester Consulting independent study: 346% ROI; $42.65M in benefits over three years; less than 6-month payback. Customer results: G&J Pepsi exceeded service expectations while maximizing revenue; Dyno-Rod reduced operational friction and improved outcomes.",
    fullDescriptionFr: "Dynamics 365 Field Service est une solution agentique de gestion du service terrain qui transforme la façon dont les organisations délivrent le service sur site. Le Scheduling Operations Agent (preview) optimise de manière autonome les plannings des techniciens en temps réel au fil des changements de la journée. Des portails de planification en libre-service construits sur Power Apps donnent aux clients une visibilité en temps réel sur leurs rendez-vous. Les techniciens accèdent à Copilot pour des requêtes en langage naturel sur les manuels produits, les ordres de travail et la résolution de problèmes — avec l'intégration Microsoft Teams. Copilot génère des réponses clients post-intervention résumant les ordres de travail. Communication automatisée par email et SMS. Intégration native avec Dynamics 365 Business Central. Étude Forrester Consulting : 346% de ROI ; 42,65 M$ de bénéfices sur 3 ans ; retour en moins de 6 mois.",
    keyFeaturesEn: J([
      "Scheduling Operations Agent (preview): autonomously optimizes technician schedules in real time",
      "Self-service scheduling portal (Power Apps) with real-time appointment visibility",
      "Copilot: natural language queries on product manuals, work orders, issue resolution",
      "Microsoft Teams integration: work order details auto-expand in chat",
      "Copilot-generated customer response emails summarizing work orders",
      "Automated customer communication: email and SMS reminders",
      "Post-engagement surveys for customer insight collection",
      "Native integration with Dynamics 365 Business Central (finance and inventory)",
      "Custom AI Agents via Copilot Studio for workflow automation",
      "External contractor management with Field Service Contractor licenses"
    ]),
    keyFeatures: J([
      "Scheduling Operations Agent (preview) : optimisation autonome des plannings en temps réel",
      "Portail de planification en libre-service (Power Apps) avec visibilité temps réel",
      "Copilot : requêtes en langage naturel sur les manuels, ordres de travail, résolution de problèmes",
      "Intégration Microsoft Teams : détails des ordres de travail dans le chat",
      "Génération de réponses clients par Copilot résumant les interventions",
      "Communication client automatisée : email et SMS",
      "Enquêtes post-intervention pour collecter les feedbacks clients",
      "Intégration native avec Dynamics 365 Business Central (finance et stocks)",
      "Agents IA personnalisés via Copilot Studio",
      "Gestion des sous-traitants avec licences Field Service Contractor"
    ]),
    benefitsEn: J([
      "346% ROI (Forrester Consulting independent study)",
      "$42.65M in benefits over three years",
      "Less than 6-month payback period",
      "Optimized technician utilization through AI-driven scheduling",
      "Higher first-time fix rates with Copilot-assisted diagnostics",
      "Improved customer satisfaction through self-service and proactive communication",
      "Reduced dispatcher workload with autonomous schedule optimization"
    ]),
    benefits: J([
      "346% de ROI (étude indépendante Forrester Consulting)",
      "42,65 M$ de bénéfices sur 3 ans",
      "Retour sur investissement en moins de 6 mois",
      "Meilleure utilisation des techniciens grâce à la planification par IA",
      "Taux de résolution au premier passage amélioré avec Copilot",
      "Satisfaction client améliorée via le libre-service et la communication proactive",
      "Charge de travail des répartiteurs réduite grâce à l'optimisation autonome"
    ]),
  },

  'Dynamics 365 Commerce': {
    shortDescription: "Deliver unified, personalized, and seamless omnichannel buying experiences for customers and partners — across physical stores, digital storefronts, and B2B portals.",
    shortDescriptionFr: "Délivrez des expériences d'achat unifiées, personnalisées et fluides sur tous les canaux — magasins physiques, vitrines numériques et portails B2B.",
    fullDescription: "Dynamics 365 Commerce is Microsoft's unified omnichannel retail platform connecting physical stores, digital commerce, and B2B partner portals in a single solution. The platform delivers a 360-degree customer view across all channels with intelligent product recommendations, real-time inventory management, and loyalty scheme management. Point of sale supports both cloud and edge deployment. Headless, API-first composable commerce framework enables flexible digital storefronts with drag-and-drop content authoring. Distributed order management with rules-based orchestration and endless aisles allows fulfillment from any location. Azure AI Search powers contextual product discovery. Customer Insights integration enables AI-powered personalization. Microsoft Copilot generates product content to enrich catalog descriptions. AI-powered chatbots via Copilot Studio provide 24/7 customer support. Adyen payment gateway integration for global transactions. Customer results: Columbia Sportswear gained business flexibility; Michael Hill optimized inventory and boosted sales; Dr. Martens implemented virtual warehouses for cross-channel inventory visibility.",
    fullDescriptionFr: "Dynamics 365 Commerce est la plateforme de commerce omnicanal unifiée de Microsoft connectant les magasins physiques, le commerce numérique et les portails partenaires B2B dans une seule solution. La plateforme offre une vue client 360° sur tous les canaux avec des recommandations produits intelligentes, une gestion des stocks en temps réel et des programmes de fidélité. Le point de vente supporte les déploiements cloud et edge. Le framework de commerce composable headless et API-first permet des vitrines numériques flexibles. La gestion des commandes distribuées avec orchestration basée sur des règles et les rayons infinis permettent la livraison depuis n'importe quel emplacement. Azure AI Search alimente la découverte de produits. Copilot génère du contenu produit. Des chatbots IA via Copilot Studio assurent le support 24h/24. Résultats : Columbia Sportswear, Michael Hill, Dr. Martens.",
    keyFeaturesEn: J([
      "Point of sale: cloud and edge deployment for physical stores",
      "Headless, API-first composable commerce framework",
      "Distributed order management with rules-based orchestration",
      "Real-time inventory management across all channels",
      "Endless aisles: fulfill orders from any warehouse or store location",
      "360-degree customer view with loyalty schemes and personalization",
      "Intelligent product recommendations (upsell/cross-sell)",
      "Azure AI Search: contextual product discovery",
      "Copilot: product content generation for catalog enrichment",
      "AI-powered chatbots via Copilot Studio for 24/7 support",
      "B2B self-service portal capabilities",
      "Adyen payment gateway for global transactions",
      "Customer Insights integration for AI-powered personalization"
    ]),
    keyFeatures: J([
      "Point de vente : déploiement cloud et edge pour les magasins physiques",
      "Framework de commerce composable headless et API-first",
      "Gestion des commandes distribuées avec orchestration basée sur des règles",
      "Gestion des stocks en temps réel sur tous les canaux",
      "Rayons infinis : livraison depuis n'importe quel entrepôt ou magasin",
      "Vue client 360° avec programmes de fidélité et personnalisation",
      "Recommandations produits intelligentes (upsell/cross-sell)",
      "Azure AI Search : découverte de produits contextuelle",
      "Copilot : génération de contenu produit pour l'enrichissement du catalogue",
      "Chatbots IA via Copilot Studio pour le support 24h/24",
      "Portail en libre-service B2B",
      "Intégration paiement Adyen pour les transactions mondiales",
      "Intégration Customer Insights pour la personnalisation IA"
    ]),
    benefitsEn: J([
      "Unified channel management reducing operational complexity",
      "Improved conversion rates through AI-powered personalization",
      "Real-time inventory visibility for accurate fulfillment promises",
      "Reduced stockouts with cross-channel inventory optimization",
      "Flexible deployment (cloud, on-premises, edge) for any store format",
      "Native CRM integration for consistent customer experience across touchpoints",
      "Faster time-to-market with composable, API-first architecture"
    ]),
    benefits: J([
      "Gestion unifiée des canaux réduisant la complexité opérationnelle",
      "Taux de conversion améliorés grâce à la personnalisation IA",
      "Visibilité des stocks en temps réel pour des promesses de livraison précises",
      "Réduction des ruptures de stock avec l'optimisation cross-canal",
      "Déploiement flexible (cloud, on-premises, edge) pour tout type de magasin",
      "Intégration CRM native pour une expérience client cohérente",
      "Mise sur le marché plus rapide grâce à l'architecture composable API-first"
    ]),
  },

  'Dynamics 365 Contact Center': {
    shortDescription: "Cloud-based agentic contact center delivering intelligence and automation across all channels — works with your existing CRM. 6 autonomous AI agents included.",
    shortDescriptionFr: "Centre de contact cloud agentique délivrant intelligence et automatisation sur tous les canaux — fonctionne avec votre CRM existant. 6 agents IA autonomes inclus.",
    fullDescription: "Dynamics 365 Contact Center is a cloud-native, AI-first contact center solution that works with any existing CRM through connectors. Six autonomous AI agents handle end-to-end workflows: the Customer Assist Agent (autonomous self-service with real-time support for routine issues), the Quality Assurance Agent (real-time quality, compliance, and coaching insights), the Service Operations Agent (configuration and governance reducing IT dependency), the Customer Intent Agent (discovers intents from conversations across channels), the Customer Knowledge Management Agent (maintains current knowledge articles from case insights), and fully custom agents via Copilot Studio. Copilot integration provides suggested responses during interactions, conversation summaries, and universal knowledge access. Unified intelligent routing assigns requests across voice, SMS, web, mobile, email, and social to the optimal agent based on skills and sentiment. 360-degree customer view with full interaction history. Supervisor dashboards with real-time visibility. Microsoft Dataverse as single source of truth. Customer results: Lenovo -20% handling time; Riverty deployed a modern AI-ready contact center in 68 days.",
    fullDescriptionFr: "Dynamics 365 Contact Center est une solution de centre de contact cloud natif et IA-first qui fonctionne avec n'importe quel CRM existant via des connecteurs. Six agents IA autonomes gèrent les workflows de bout en bout : Customer Assist Agent (libre-service autonome), Quality Assurance Agent (qualité et conformité en temps réel), Service Operations Agent (configuration et gouvernance), Customer Intent Agent (découverte des intentions), Customer Knowledge Management Agent (maintenance des articles de connaissance), et des agents personnalisés via Copilot Studio. Copilot fournit des réponses suggérées, des résumés de conversations et un accès universel à la connaissance. Le routage intelligent unifié distribue les demandes sur voix, SMS, web, mobile, email et réseaux sociaux. Résultats : Lenovo -20% de temps de traitement ; Riverty a déployé un centre de contact IA moderne en 68 jours.",
    keyFeaturesEn: J([
      "Customer Assist Agent: autonomous self-service with real-time human agent support",
      "Quality Assurance Agent: real-time quality, compliance, and coaching insights",
      "Service Operations Agent: configuration and governance reducing IT expertise needed",
      "Customer Intent Agent: discovers intents from conversations across all channels",
      "Customer Knowledge Management Agent: auto-maintains knowledge articles",
      "Custom AI Agents via Copilot Studio",
      "Copilot: suggested responses, conversation summaries, universal knowledge interface",
      "Unified intelligent routing: voice, SMS, web, mobile, email, social",
      "360-degree customer view with sentiment analysis and interaction history",
      "Supervisor dashboards: real-time visibility, performance metrics, intervention tools",
      "Works with existing CRMs via connectors (not locked to Dynamics 365)",
      "Microsoft Dataverse as single source of truth for all interactions"
    ]),
    keyFeatures: J([
      "Customer Assist Agent : libre-service autonome avec support humain en temps réel",
      "Quality Assurance Agent : qualité, conformité et coaching en temps réel",
      "Service Operations Agent : configuration et gouvernance réduisant la dépendance IT",
      "Customer Intent Agent : découverte des intentions depuis toutes les conversations",
      "Customer Knowledge Management Agent : maintenance automatique des articles de connaissance",
      "Agents IA personnalisés via Copilot Studio",
      "Copilot : réponses suggérées, résumés de conversations, accès universel à la connaissance",
      "Routage intelligent unifié : voix, SMS, web, mobile, email, réseaux sociaux",
      "Vue client 360° avec analyse des sentiments et historique des interactions",
      "Tableaux de bord superviseur : visibilité temps réel, métriques, outils d'intervention",
      "Compatible avec les CRM existants via connecteurs",
      "Microsoft Dataverse comme source unique de vérité"
    ]),
    benefitsEn: J([
      "20% reduction in handling time (Lenovo with Copilot)",
      "Modern AI-ready contact center deployed in 68 days (Riverty)",
      "Reduced specialized IT expertise through Service Operations Agent",
      "Works with existing CRM investments — no rip-and-replace required",
      "Consistent quality and compliance across all interactions",
      "Always-current knowledge base maintained automatically by AI agents",
      "Scalable, reliable, secure cloud infrastructure (99.9% SLA)"
    ]),
    benefits: J([
      "-20% de temps de traitement (Lenovo avec Copilot)",
      "Centre de contact IA moderne déployé en 68 jours (Riverty)",
      "Réduction de l'expertise IT nécessaire grâce au Service Operations Agent",
      "Compatible avec les investissements CRM existants — pas de remplacement total",
      "Qualité et conformité cohérentes sur toutes les interactions",
      "Base de connaissances toujours à jour maintenue automatiquement par les agents IA",
      "Infrastructure cloud scalable, fiable, sécurisée (SLA 99,9%)"
    ]),
  },
};

// ── Apply updates ─────────────────────────────────────────────────────────────

let updated = 0;
for (const item of data) {
  const patch = UPDATES[item.officialName];
  if (!patch) continue;
  Object.assign(item, patch);
  item.updatedAt = new Date().toISOString();
  updated++;
  console.log(`✅ Updated: ${item.officialName}`);
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
console.log(`\n✅ Done — ${updated}/${Object.keys(UPDATES).length} solutions updated in azure-solutions.json`);
