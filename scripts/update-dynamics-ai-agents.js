/**
 * Update Dynamics 365 solutions with complete AI agents from Microsoft Learn
 * + Add new solutions: Finance Agent, Copilot for Sales, Copilot for Service,
 *   Microsoft Sustainability Manager, Intelligent Order Management
 */

const fs   = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/azure-solutions.json');
const data      = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const J         = (arr) => JSON.stringify(arr, null, 0);

// ── 1. UPDATES to existing solutions ─────────────────────────────────────────

const UPDATES = {

  'Dynamics 365 Sales': {
    keyFeaturesEn: J([
      "Sales Qualification Agent: researches leads, evaluates fit, sends outreach, engages leads autonomously 24/7",
      "Sales Opportunity Agent: researches opportunities, surfaces emerging risks, highlights promising deals",
      "Sales Close Agent: manages end-to-end sales cycle autonomously : engagement, recommendations, objections, closure",
      "Sales Research Agent: solves complex business questions through natural language dialog with sales data",
      "Recommended Actions Agent: prioritized actions to help sellers focus on the most effective tasks",
      "Sales agent in Microsoft 365 Copilot: conversational agent in M365 Copilot for searching and acting on sales data",
      "AI-powered Data Enrichment: enriches opportunity data from email interactions automatically",
      "Copilot: record summarization, meeting prep, email drafts, news updates, recent changes",
      "Native M365 integration: Teams, Outlook, SharePoint content recommendations, LinkedIn Sales Navigator",
      "Pipeline management, AI lead scoring, opportunity tracking and forecasting"
    ]),
    keyFeatures: J([
      "Sales Qualification Agent : recherche, évaluation et engagement autonome des leads 24h/24",
      "Sales Opportunity Agent : analyse des opportunités, détection des risques, mise en avant des deals prometteurs",
      "Sales Close Agent : gestion autonome du cycle de vente de bout en bout",
      "Sales Research Agent : résolution de questions business complexes par dialogue en langage naturel",
      "Recommended Actions Agent : actions prioritaires pour les vendeurs",
      "Sales agent dans Microsoft 365 Copilot : agent conversationnel pour les données de vente dans M365",
      "AI-powered Data Enrichment : enrichissement automatique des opportunités depuis les emails",
      "Copilot : résumés, préparation réunions, emails, actualités, changements récents",
      "Intégration native M365 : Teams, Outlook, SharePoint, LinkedIn Sales Navigator",
      "Pipeline, scoring IA des leads, suivi des opportunités et prévisions"
    ]),
  },

  'Dynamics 365 Customer Service': {
    keyFeaturesEn: J([
      "Case Management Agent: automates full case lifecycle : create, update, resolve, close (GA)",
      "Customer Knowledge Management Agent: extracts knowledge from cases, maintains articles in real time (GA)",
      "Quality Evaluation Agent: autonomous assessment of customer interactions using supervisor-defined framework (GA)",
      "Customer Intent Agent: identifies most common intents from conversations across all channels (GA)",
      "Customer Intent Agent for Voice: discovers intents autonomously for voice channel scenarios (GA)",
      "Intent-driven routing: routes interactions based on detected intent to the most suitable agent (GA)",
      "Rollout manager: phased, guided, controlled adoption of autonomous AI agents (GA)",
      "Agent insights dashboard: real-time visibility into AI agent KPIs and operational trends (GA)",
      "Copilot: ask a question, auto/proactive prompts, conversation summaries, email drafts, resolution notes",
      "Omnichannel: email, chat, social, voice, SMS with 360-degree customer view"
    ]),
    keyFeatures: J([
      "Case Management Agent : automatise le cycle de vie complet des cas (GA)",
      "Customer Knowledge Management Agent : extrait la connaissance des cas, maintient les articles en temps réel (GA)",
      "Quality Evaluation Agent : évaluation autonome des interactions selon le framework superviseur (GA)",
      "Customer Intent Agent : identification des intentions les plus fréquentes (GA)",
      "Customer Intent Agent for Voice : découverte autonome des intentions pour le canal voix (GA)",
      "Intent-driven routing : routage basé sur les intentions détectées (GA)",
      "Rollout manager : adoption guidée et contrôlée des agents IA en phases (GA)",
      "Agent insights dashboard : visibilité temps réel sur les KPIs des agents IA (GA)",
      "Copilot : questions, prompts proactifs, résumés conversations, emails, notes de résolution",
      "Omnicanal : email, chat, social, voix, SMS avec vue client 360°"
    ]),
  },

  'Dynamics 365 Contact Center': {
    keyFeaturesEn: J([
      "Customer Assist Agent: autonomous self-service with real-time human agent handoff for routine issues",
      "Quality Assurance Agent: real-time quality, compliance, and coaching insights",
      "Service Operations Agent: configuration and governance : reduces specialized IT expertise needed",
      "Customer Intent Agent: discovers intents from conversations across all channels",
      "Customer Intent Agent for Voice: discovers intents autonomously for voice contact center",
      "Customer Knowledge Management Agent: auto-maintains knowledge articles from case insights",
      "Intent-driven routing: routes each interaction to the most suitable agent based on detected intent",
      "Rollout manager: phased, guided adoption of AI agents with control and visibility",
      "Agent insights dashboard: real-time supervisor visibility into AI agent performance",
      "Custom AI Agents via Copilot Studio for workflow-specific automation",
      "Copilot: suggested responses, conversation summaries, universal knowledge interface",
      "Multichannel: voice, SMS, web, mobile, email, social",
      "Works with existing CRMs via connectors : no CRM replacement required",
      "Microsoft Dataverse as single source of truth for all interactions"
    ]),
    keyFeatures: J([
      "Customer Assist Agent : libre-service autonome avec handoff humain en temps réel",
      "Quality Assurance Agent : qualité, conformité et coaching en temps réel",
      "Service Operations Agent : configuration et gouvernance : réduit la dépendance IT",
      "Customer Intent Agent : découverte des intentions sur tous les canaux",
      "Customer Intent Agent for Voice : découverte autonome des intentions pour la voix",
      "Customer Knowledge Management Agent : maintenance automatique des articles de connaissance",
      "Intent-driven routing : routage basé sur les intentions détectées",
      "Rollout manager : adoption guidée et contrôlée des agents IA",
      "Agent insights dashboard : visibilité superviseur en temps réel sur les agents IA",
      "Agents IA personnalisés via Copilot Studio",
      "Copilot : réponses suggérées, résumés, accès universel à la connaissance",
      "Multicanal : voix, SMS, web, mobile, email, réseaux sociaux",
      "Compatible avec les CRM existants via connecteurs",
      "Microsoft Dataverse comme source unique de vérité"
    ]),
  },

  'Dynamics 365 Project Operations': {
    keyFeaturesEn: J([
      "Time Entry Agent: auto-generates draft time entries from project assignments, bookings, and history (Production Ready Preview)",
      "Expense Agent: extracts receipt data, generates expense entries, groups by trip or project (Production Ready Preview)",
      "Approvals Agent: reviews time/expense/material against policy : marks 'Ready for approval' or 'Needs review' (Production Ready Preview)",
      "Copilot in time entry: simplified weekly time capture workflow",
      "Copilot for project: generates preliminary WBS from project name and description",
      "Form fill assistance, find data in view, visualize data, row summaries, timeline highlights",
      "Agent feed: supervision of AI agents directly in the app",
      "Project planning, resource management, collaboration, and visibility"
    ]),
    keyFeatures: J([
      "Time Entry Agent : génération automatique de brouillons de saisies de temps (Production Ready Preview)",
      "Expense Agent : extraction des reçus, création des entrées de frais, groupement par voyage/projet (Production Ready Preview)",
      "Approvals Agent : revue des temps/frais/matériaux contre les politiques : Prêt ou À réviser (Production Ready Preview)",
      "Copilot pour la saisie de temps : flux simplifié de capture hebdomadaire",
      "Copilot pour projet : génération de WBS préliminaire depuis nom et description",
      "Form fill assistance, recherche en langage naturel, visualisation données, résumés",
      "Agent feed : supervision des agents IA directement dans l'app",
      "Planification, gestion des ressources, collaboration et visibilité projet"
    ]),
    benefitsEn: J([
      "Eliminated manual time entry bottlenecks with AI-generated drafts",
      "Accelerated invoicing cycles by ensuring timely, accurate submissions",
      "Reduced approval time with AI pre-screening against policy",
      "Freed consultants to focus on billable, high-value work",
      "Consistent policy compliance across all time, expense, and material entries",
      "Mobile receipt capture via app or email forwarding to Expense Agent"
    ]),
    benefits: J([
      "Élimination des goulots d'étranglement de saisie manuelle avec les brouillons IA",
      "Accélération des cycles de facturation par des soumissions précises et ponctuelles",
      "Réduction du temps d'approbation avec le pré-filtrage IA contre les politiques",
      "Consultants libérés pour se concentrer sur le travail à haute valeur ajoutée",
      "Conformité politique cohérente pour tous les temps, frais et matériaux",
      "Capture de reçus mobile via app ou transfert email vers l'Expense Agent"
    ]),
  },

  'Dynamics 365 Supply Chain Management': {
    keyFeaturesEn: J([
      "Supplier Communications Agent: automates supplier communications for delivery risk management based on user-defined rules (Production Ready Preview)",
      "Copilot AI summaries: quick overview of key page information personalized for the current user",
      "Analyze demand plans with Copilot: natural language analysis : trends, anomalies, accuracy with visualizations",
      "Workload insights with Copilot: insights on warehouse work and workforce in the mobile app",
      "AI-powered demand forecasting with explainable models : complete MRP in minutes",
      "DDMRP dynamic stock buffers to eliminate stockouts",
      "Copilot-assisted sourcing decisions and supply risk assessment",
      "Procurement: automated approvals, vendor performance tracking with Power BI",
      "Manufacturing: discrete, process, and lean with IoT integration",
      "Warehouse management: robotic integration, mobile apps, process mining, OTIF",
      "Asset management: predictive, corrective, condition-based maintenance, OEE optimization",
      "MCP Server for ERP: agents interact with SCM data and business logic without custom code"
    ]),
    keyFeatures: J([
      "Supplier Communications Agent : automatisation des communications fournisseurs (Production Ready Preview)",
      "Résumés IA Copilot : aperçu rapide des informations clés de la page",
      "Analyse des plans de demande Copilot : tendances, anomalies, précision avec visualisations",
      "Workload insights Copilot : insights sur le travail entrepôt dans l'app mobile",
      "Prévisions de la demande par IA, cycles MRP complets en quelques minutes",
      "Tampons de stock dynamiques DDMRP pour éliminer les ruptures",
      "Décisions de sourcing assistées par Copilot et évaluation des risques fournisseurs",
      "Achats : approbations automatisées, suivi performances fournisseurs (Power BI)",
      "Production : discrète, process et lean avec intégration IoT",
      "Gestion entrepôt : robotique, apps mobiles, process mining, optimisation OTIF",
      "Gestion actifs : maintenance préventive, corrective, conditionnelle, OEE",
      "MCP Server ERP : agents interagissent avec les données SCM sans code personnalisé"
    ]),
  },

  'Dynamics 365 Finance': {
    keyFeaturesEn: J([
      "Account Reconciliation Agent: proactive continuous subledger-to-general ledger reconciliation : resolves differences autonomously (Production Ready Preview)",
      "Finance Agent in Microsoft 365 Copilot: natural language financial queries from M365 (Preview)",
      "Copilot-assisted invoice capture, workflows and collections automation",
      "Collections coordinator summary: AI-generated summary and reminder letters",
      "Customer page summary: AI summary at top of customer record on opening",
      "Agent management: discovery, configuration and management of autonomous agents",
      "Immersive Home: AI-centered workspace for finance users (Production Ready Preview)",
      "MCP Server for Finance & Operations: agents interact with finance data and business logic",
      "General ledger, automated close, accounts receivable/payable",
      "Cash flow forecasting, tax management: 57 countries/regions, 67 languages"
    ]),
    keyFeatures: J([
      "Account Reconciliation Agent : rapprochement continu et proactif sous-livre/grand livre (Production Ready Preview)",
      "Finance Agent dans Microsoft 365 Copilot : requêtes financières en langage naturel (Preview)",
      "Workflows de facturation et relances automatisés par Copilot",
      "Collections coordinator summary : résumé IA et lettres de relance générées",
      "Customer page summary : résumé IA en haut de la fiche client",
      "Agent management : découverte, configuration et gestion des agents autonomes",
      "Immersive Home : espace de travail IA centré pour les utilisateurs finance (Production Ready Preview)",
      "MCP Server F&O : agents interagissent avec les données finance et la logique métier",
      "Comptabilité générale, clôture automatisée, comptes clients/fournisseurs",
      "Prévisions de trésorerie, gestion fiscale : 57 pays/régions, 67 langues"
    ]),
  },

};

// ── 2. NEW SOLUTIONS ──────────────────────────────────────────────────────────

const newId = () => 'agent' + Math.random().toString(36).slice(2, 14);
const now   = new Date().toISOString();

const NEW_SOLUTIONS = [

  {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    name: 'copilot-for-sales',
    officialName: 'Sales in Microsoft 365 Copilot',
    category: 'business',
    subcategory: 'crm-sales',
    shortDescription: "Brings Dynamics 365 Sales data and AI insights directly into Microsoft 365 : enriching Outlook, Teams, and M365 Copilot with CRM context for every seller interaction.",
    shortDescriptionFr: "Intègre les données Dynamics 365 Sales et les insights IA directement dans Microsoft 365 : enrichissant Outlook, Teams et M365 Copilot avec le contexte CRM pour chaque interaction commerciale.",
    fullDescription: "Sales in Microsoft 365 Copilot (formerly Copilot for Sales) is a Microsoft 365 extension that brings CRM data and AI sales intelligence into the tools sellers already use daily. In Outlook: email summaries enriched with CRM insights, AI-drafted email responses with sales context, opportunity summaries, chronological view of customer interactions, and opportunity risk/action insights. In Teams: meeting preparation cards with real-time opportunity data, daily digest of next 5 sales meetings, sales insights in Teams meeting recaps, Planner task creation from conversations. Cross-app: the Sales agent enables Lead Research and Outreach with comprehensive lead company research, recent news, and tailored outreach strategy. Works with Dynamics 365 Sales and third-party CRMs.",
    fullDescriptionFr: "Sales in Microsoft 365 Copilot (anciennement Copilot for Sales) est une extension M365 qui apporte les données CRM et l'intelligence commerciale IA dans les outils que les vendeurs utilisent déjà au quotidien. Dans Outlook : résumés d'emails enrichis d'insights CRM, réponses email rédigées par IA avec contexte de vente, résumés d'opportunités, vue chronologique des interactions client, insights risques/actions sur les opportunités. Dans Teams : meeting prep cards avec données d'opportunité en temps réel, digest quotidien des 5 prochaines réunions, insights de vente dans les récapitulatifs de réunion Teams, création de tâches Planner. Cross-app : l'agent Sales permet le Lead Research and Outreach avec recherche complète sur les leads.",
    keyFeaturesEn: J([
      "Outlook: email summaries enriched with CRM sales insights",
      "Outlook: AI-drafted email responses with sales context from CRM",
      "Outlook: opportunity summary : customer questions, concerns, notes",
      "Outlook: chronological view of all customer interactions",
      "Outlook: opportunity insights : risks and upcoming actions",
      "Teams: meeting preparation card with real-time opportunity data",
      "Teams: daily digest of next 5 upcoming sales meetings",
      "Teams: sales insights in Teams meeting recap",
      "Teams: Planner task creation from meeting conversations",
      "Sales agent: Lead Research and Outreach with company research and news",
      "Works with Dynamics 365 Sales and third-party CRMs"
    ]),
    keyFeatures: J([
      "Outlook : résumés d'emails enrichis d'insights CRM",
      "Outlook : réponses email rédigées par IA avec contexte de vente",
      "Outlook : résumé d'opportunité : questions, préoccupations, notes client",
      "Outlook : vue chronologique de toutes les interactions client",
      "Outlook : insights d'opportunité : risques et actions à venir",
      "Teams : meeting preparation card avec données d'opportunité en temps réel",
      "Teams : digest quotidien des 5 prochaines réunions commerciales",
      "Teams : insights de vente dans les récapitulatifs de réunion",
      "Teams : création de tâches Planner depuis les conversations",
      "Sales agent : Lead Research and Outreach avec recherche entreprise et actualités",
      "Compatible avec Dynamics 365 Sales et CRM tiers"
    ]),
    benefits: J([
      "Préparation des réunions client sans quitter Teams ou Outlook",
      "Réduction du temps de saisie CRM : l'IA enrichit les données automatiquement",
      "Contexte commercial complet à portée de main dans chaque email",
      "Cohérence des informations entre CRM et communications quotidiennes",
      "Onboarding accéléré des nouveaux vendeurs avec les insights IA guidés"
    ]),
    benefitsEn: J([
      "Customer meeting prep without leaving Teams or Outlook",
      "Reduced CRM data entry time : AI enriches data automatically",
      "Full commercial context in every email without switching apps",
      "Consistent information between CRM and daily communications",
      "Faster new seller onboarding with AI-guided insights"
    ]),
    targetIndustries: JSON.stringify(["All industries"]),
    idealCustomerSize: "Any size with sales teams using Microsoft 365",
    idealCustomerSizeEn: "Any size with sales teams using Microsoft 365",
    targetPersonas: JSON.stringify(["Sales Representatives", "Account Managers", "Sales Managers"]),
    pricingModel: "Add-on to Microsoft 365 Copilot",
    estimatedCost: "Inclus dans Microsoft 365 Copilot ou disponible en add-on",
    estimatedCostEn: "Included with Microsoft 365 Copilot or available as add-on",
    implementationTime: "Jours (configuration simple)",
    implementationTimeEn: "Days (simple configuration)",
    complexity: "Low",
    prerequisites: JSON.stringify(["Microsoft 365", "Dynamics 365 Sales or compatible CRM"]),
    integrations: JSON.stringify(["Microsoft Outlook", "Microsoft Teams", "Microsoft 365 Copilot", "Dynamics 365 Sales", "Third-party CRMs"]),
    competitorComparison: "Salesforce has Einstein for Outlook but lacks the depth of M365 integration. Dynamics 365 + Sales in M365 Copilot is the only solution natively embedded across the full Microsoft 365 suite without third-party connectors.",
    salesPriority: "High",
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["copilot for sales", "sales copilot", "outlook CRM", "teams sales", "microsoft 365 copilot sales"]),
    tags: JSON.stringify(["AI", "Copilot", "Microsoft 365", "Sales", "Outlook", "Teams"]),
    relatedSolutions: JSON.stringify(["Dynamics 365 Sales", "Microsoft 365 Copilot"]),
    technicalSpecs: JSON.stringify({}),
    securityFeatures: JSON.stringify(["Microsoft 365 security model", "CRM data access controls"]),
    complianceCerts: JSON.stringify(["ISO 27001", "SOC 2", "GDPR"]),
    documentationUrl: "https://learn.microsoft.com/en-us/microsoft-sales-copilot/",
    pricingUrl: "https://www.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot",
    demoUrl: "",
    caseStudyUrls: JSON.stringify([]),
    competitors: JSON.stringify(["Salesforce Einstein for Outlook", "Clari", "Gong"]),
    customerCases: JSON.stringify([]),
    marketPosition: "Native Microsoft 365 CRM extension : no third-party connector required",
    salesContext: "Target sellers who spend time switching between Outlook/Teams and their CRM. ROI pitch: sellers gain 30+ minutes/day by accessing CRM context directly in M365.",
    sellingScenarios: JSON.stringify([
      "Seller preparing for a key customer meeting : gets full opportunity context in Teams",
      "Sales manager reviewing team pipeline : gets AI-prioritized action recommendations",
      "New seller onboarding : guided by AI insights in familiar M365 tools"
    ]),
    useCases: JSON.stringify(["Préparation de réunion client", "Réponse email contextuelle", "Qualification et recherche de leads", "Suivi des opportunités depuis Outlook"]),
    useCasesEn: JSON.stringify(["Customer meeting preparation", "Contextual email response", "Lead qualification and research", "Opportunity tracking from Outlook"]),
  },

  {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    name: 'copilot-for-service',
    officialName: 'Service in Microsoft 365 Copilot',
    category: 'business',
    subcategory: 'crm-service',
    shortDescription: "Brings customer service CRM data and AI capabilities directly into Microsoft 365 : enriching Outlook and Teams with case summaries, resolution notes, and knowledge for service agents.",
    shortDescriptionFr: "Intègre les données CRM de service client et les capacités IA directement dans Microsoft 365 : enrichissant Outlook et Teams avec des résumés de cas, notes de résolution et connaissances pour les agents.",
    fullDescription: "Service in Microsoft 365 Copilot (formerly Copilot for Service) extends Microsoft 365 with AI-powered customer service capabilities. In Outlook: AI-generated case summaries for quick context understanding, suggested replies enriched with case and conversation details from CRM, email and meeting saving to CRM. In Teams: AI case summary directly in Teams, chat with service data in M365 Copilot, view and update CRM records without leaving Teams. Cross-app capabilities: ask questions and get answers without manual searching, auto-generate case summaries, generate resolution notes from case details and emails, generate conversation summaries for calls and chats, write context-aware email drafts. Works with Dynamics 365 Customer Service and third-party CRMs.",
    fullDescriptionFr: "Service in Microsoft 365 Copilot (anciennement Copilot for Service) étend Microsoft 365 avec des capacités de service client IA. Dans Outlook : résumés de cas IA pour comprendre rapidement le contexte, réponses suggérées enrichies des détails du cas CRM, sauvegarde des emails/réunions dans le CRM. Dans Teams : résumé de cas IA dans Teams, chat avec les données de service dans M365 Copilot, vue et mise à jour des enregistrements CRM sans quitter Teams. Capacités cross-app : questions/réponses sans recherche manuelle, génération automatique de résumés de cas, notes de résolution, résumés de conversations, rédaction d'emails contextuels. Compatible avec Dynamics 365 Customer Service et CRM tiers.",
    keyFeaturesEn: J([
      "Outlook: AI-generated case summary for quick context understanding",
      "Outlook: suggested replies enriched with case and conversation CRM details",
      "Outlook: save emails and meetings directly to CRM",
      "Teams: AI case summary directly in Teams",
      "Teams: chat with service data in Microsoft 365 Copilot (preview)",
      "Teams: view and update CRM records without leaving Teams",
      "Cross-app: Ask a question : fast answers without manual search",
      "Cross-app: Auto-generate case summaries",
      "Cross-app: Generate resolution notes from case details and emails",
      "Cross-app: Generate conversation summaries for calls and chats",
      "Cross-app: Write context-aware customer email drafts",
      "Works with Dynamics 365 Customer Service and third-party CRMs"
    ]),
    keyFeatures: J([
      "Outlook : résumé de cas IA pour comprendre rapidement le contexte",
      "Outlook : réponses suggérées enrichies des détails du cas CRM",
      "Outlook : sauvegarde des emails et réunions dans le CRM",
      "Teams : résumé de cas IA directement dans Teams",
      "Teams : chat avec les données de service dans M365 Copilot (preview)",
      "Teams : vue et mise à jour des enregistrements CRM sans quitter Teams",
      "Cross-app : questions/réponses rapides sans recherche manuelle",
      "Cross-app : génération automatique de résumés de cas",
      "Cross-app : notes de résolution depuis les détails du cas et emails",
      "Cross-app : résumés de conversations pour les appels et chats",
      "Cross-app : rédaction d'emails client contextuels",
      "Compatible avec Dynamics 365 Customer Service et CRM tiers"
    ]),
    benefits: J([
      "Résolution plus rapide des cas grâce au contexte IA immédiat",
      "Réduction du temps de saisie CRM : emails et réunions sauvegardés automatiquement",
      "Cohérence des réponses client grâce aux suggestions IA contextuelles",
      "Accès au CRM sans quitter Teams ou Outlook",
      "Meilleure conformité grâce aux notes de résolution générées automatiquement"
    ]),
    benefitsEn: J([
      "Faster case resolution with immediate AI context",
      "Reduced CRM data entry : emails and meetings saved automatically",
      "Consistent customer responses through contextual AI suggestions",
      "CRM access without leaving Teams or Outlook",
      "Better compliance with automatically generated resolution notes"
    ]),
    targetIndustries: JSON.stringify(["All industries with customer service operations"]),
    idealCustomerSize: "Any size with customer service teams using Microsoft 365",
    idealCustomerSizeEn: "Any size with customer service teams using Microsoft 365",
    targetPersonas: JSON.stringify(["Customer Service Agents", "Service Managers", "Contact Center Supervisors"]),
    pricingModel: "Add-on to Microsoft 365 Copilot",
    estimatedCost: "Inclus dans Microsoft 365 Copilot ou disponible en add-on",
    estimatedCostEn: "Included with Microsoft 365 Copilot or available as add-on",
    implementationTime: "Jours (configuration simple)",
    implementationTimeEn: "Days (simple configuration)",
    complexity: "Low",
    prerequisites: JSON.stringify(["Microsoft 365", "Dynamics 365 Customer Service or compatible CRM"]),
    integrations: JSON.stringify(["Microsoft Outlook", "Microsoft Teams", "Microsoft 365 Copilot", "Dynamics 365 Customer Service", "Third-party CRMs"]),
    competitorComparison: "Salesforce Service Cloud lacks native M365 integration depth. Service in M365 Copilot is the only solution natively embedded across Outlook and Teams without third-party connectors, giving agents full CRM context in their daily tools.",
    salesPriority: "High",
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["copilot for service", "service copilot", "outlook case management", "teams customer service"]),
    tags: JSON.stringify(["AI", "Copilot", "Microsoft 365", "Customer Service", "Outlook", "Teams"]),
    relatedSolutions: JSON.stringify(["Dynamics 365 Customer Service", "Dynamics 365 Contact Center"]),
    technicalSpecs: JSON.stringify({}),
    securityFeatures: JSON.stringify(["Microsoft 365 security model", "CRM data access controls"]),
    complianceCerts: JSON.stringify(["ISO 27001", "SOC 2", "GDPR"]),
    documentationUrl: "https://learn.microsoft.com/en-us/microsoft-copilot-service/",
    pricingUrl: "https://www.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot",
    demoUrl: "",
    caseStudyUrls: JSON.stringify([]),
    competitors: JSON.stringify(["Salesforce Einstein for Service", "Zendesk AI"]),
    customerCases: JSON.stringify([]),
    marketPosition: "Native Microsoft 365 customer service extension : no third-party connector required",
    salesContext: "Target service organizations where agents spend time switching between Outlook/Teams and their CRM. ROI: agents save 20-30 minutes/day accessing case context directly in M365.",
    sellingScenarios: JSON.stringify([
      "Service agent receiving a customer email : gets instant case context in Outlook without switching to CRM",
      "Service manager tracking team performance : reviews case summaries in Teams",
      "Agent closing a case : auto-generates resolution notes and knowledge article draft"
    ]),
    useCases: JSON.stringify(["Résolution de cas depuis Outlook", "Préparation aux interactions client dans Teams", "Génération de notes de résolution", "Mise à jour CRM depuis M365"]),
    useCasesEn: JSON.stringify(["Case resolution from Outlook", "Customer interaction prep in Teams", "Resolution note generation", "CRM update from M365"]),
  },

  {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    name: 'finance-agent',
    officialName: 'Finance Agent',
    category: 'business',
    subcategory: 'erp-finance',
    shortDescription: "Standalone AI agent that brings Dynamics 365 Finance data and financial intelligence directly into Microsoft 365 Copilot : natural language queries on financial data without leaving M365.",
    shortDescriptionFr: "Agent IA autonome qui apporte les données Dynamics 365 Finance et l'intelligence financière directement dans Microsoft 365 Copilot : requêtes financières en langage naturel sans quitter M365.",
    fullDescription: "Finance Agent is a distinct product from Dynamics 365 Finance, available within Microsoft 365 Copilot. It enables finance professionals to query financial data, get reports, and take actions using natural language directly in M365 Copilot : without switching to the Finance application. Users can ask questions like 'What are our overdue invoices this month?' or 'Show me cash flow for Q3' and get AI-generated answers grounded in their Dynamics 365 Finance data. The Finance Agent bridges the gap between finance decision-making and the everyday M365 productivity environment, making financial insights accessible to executives, controllers, and finance managers without requiring navigation through the Finance app.",
    fullDescriptionFr: "Finance Agent est un produit distinct de Dynamics 365 Finance, disponible dans Microsoft 365 Copilot. Il permet aux professionnels de la finance d'interroger les données financières, d'obtenir des rapports et d'agir en langage naturel directement dans M365 Copilot : sans basculer vers l'application Finance. Les utilisateurs peuvent poser des questions comme 'Quelles sont nos factures en retard ce mois-ci ?' ou 'Montrez-moi les flux de trésorerie du T3' et obtenir des réponses IA ancrées dans leurs données Dynamics 365 Finance. Le Finance Agent comble le fossé entre la prise de décision financière et l'environnement de productivité M365 quotidien, rendant les insights financiers accessibles aux dirigeants, contrôleurs et responsables financiers.",
    keyFeaturesEn: J([
      "Natural language queries on Dynamics 365 Finance data from M365 Copilot",
      "Financial reports and summaries without navigating to the Finance application",
      "Cash flow, overdue invoices, vendor balances : queried in plain language",
      "Bridges finance decision-making with everyday M365 productivity tools",
      "Available to executives, controllers, and finance managers without Finance app access",
      "Grounded in real-time Dynamics 365 Finance data"
    ]),
    keyFeatures: J([
      "Requêtes en langage naturel sur les données Dynamics 365 Finance depuis M365 Copilot",
      "Rapports et résumés financiers sans naviguer vers l'application Finance",
      "Flux de trésorerie, factures en retard, soldes fournisseurs : interrogés en langage naturel",
      "Lien entre la prise de décision financière et les outils M365 quotidiens",
      "Accessible aux dirigeants, contrôleurs et responsables sans accès à l'app Finance",
      "Ancré dans les données Dynamics 365 Finance en temps réel"
    ]),
    benefits: J([
      "Insights financiers accessibles aux dirigeants sans formation à l'app Finance",
      "Décisions plus rapides grâce aux données financières en temps réel dans M365",
      "Réduction des requêtes ad-hoc vers les équipes finance",
      "Contexte financier complet lors des réunions et communications"
    ]),
    benefitsEn: J([
      "Financial insights accessible to executives without Finance app training",
      "Faster decisions with real-time financial data in M365",
      "Reduction of ad-hoc requests to finance teams",
      "Complete financial context during meetings and communications"
    ]),
    targetIndustries: JSON.stringify(["All industries"]),
    idealCustomerSize: "Entreprises avec Dynamics 365 Finance et Microsoft 365 Copilot",
    idealCustomerSizeEn: "Organizations with Dynamics 365 Finance and Microsoft 365 Copilot",
    targetPersonas: JSON.stringify(["CFO", "Finance Director", "Controller", "Finance Manager", "Executive"]),
    pricingModel: "Inclus avec Microsoft 365 Copilot + Dynamics 365 Finance",
    estimatedCost: "Requiert Microsoft 365 Copilot et Dynamics 365 Finance",
    estimatedCostEn: "Requires Microsoft 365 Copilot and Dynamics 365 Finance",
    implementationTime: "Jours",
    implementationTimeEn: "Days",
    complexity: "Low",
    prerequisites: JSON.stringify(["Microsoft 365 Copilot", "Dynamics 365 Finance"]),
    integrations: JSON.stringify(["Microsoft 365 Copilot", "Dynamics 365 Finance", "Microsoft Teams", "Microsoft Outlook"]),
    competitorComparison: "SAP Joule and Oracle Digital Assistant require switching to ERP. Finance Agent brings financial intelligence directly into M365 : where executives already work.",
    salesPriority: "Medium",
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["finance agent", "copilot finance", "financial queries m365", "dynamics finance copilot"]),
    tags: JSON.stringify(["AI", "Finance", "Copilot", "Microsoft 365", "ERP"]),
    relatedSolutions: JSON.stringify(["Dynamics 365 Finance", "Sales in Microsoft 365 Copilot"]),
    technicalSpecs: JSON.stringify({}),
    securityFeatures: JSON.stringify(["Microsoft 365 security", "Dynamics 365 Finance role-based access"]),
    complianceCerts: JSON.stringify(["ISO 27001", "SOC 2"]),
    documentationUrl: "https://learn.microsoft.com/en-us/copilot/finance/",
    pricingUrl: "https://www.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot",
    demoUrl: "",
    caseStudyUrls: JSON.stringify([]),
    competitors: JSON.stringify(["SAP Joule", "Oracle Digital Assistant", "Workday AI"]),
    customerCases: JSON.stringify([]),
    marketPosition: "First financial AI agent natively embedded in M365 Copilot with live ERP data",
    salesContext: "Pitch to CFOs and finance leaders who want financial insights in Teams/Outlook without training on D365 Finance. Complement to D365 Finance deals.",
    sellingScenarios: JSON.stringify([
      "CFO in a board meeting wants real-time cash flow data : queries Finance Agent in Teams",
      "Controller reviewing month-end close : asks Finance Agent about outstanding reconciliations",
      "Finance manager receiving an email : queries overdue AR status without opening Finance app"
    ]),
    useCases: JSON.stringify(["Requêtes financières depuis Teams/Outlook", "Rapports de trésorerie en temps réel", "Suivi des factures en retard", "Préparation aux réunions du COMEX"]),
    useCasesEn: JSON.stringify(["Financial queries from Teams/Outlook", "Real-time cash flow reports", "Overdue invoice tracking", "Executive meeting preparation"]),
  },

  {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    name: 'sustainability-manager',
    officialName: 'Microsoft Sustainability Manager',
    category: 'business',
    subcategory: 'sustainability-esg',
    shortDescription: "AI-powered ESG and sustainability management solution : tracks emissions, automates CSRD reporting, and uses Copilot to analyze ESG documents and generate regulatory disclosures.",
    shortDescriptionFr: "Solution IA de gestion ESG et développement durable : suivi des émissions, automatisation du reporting CSRD, et utilisation de Copilot pour analyser les documents ESG et générer les divulgations réglementaires.",
    fullDescription: "Microsoft Sustainability Manager is an industry solution built on Dynamics 365 and Power Platform that helps organizations measure, track, and report on their environmental, social, and governance (ESG) performance. It enables organizations to comply with mandatory reporting frameworks including CSRD (Corporate Sustainability Reporting Directive), GHG Protocol, and other global standards. AI capabilities include: Copilot for document analysis (upload ESG documents and ask questions), calculation model creation from natural language descriptions, automated report generation for emissions and CSRD, natural language data queries (assessments, metrics, organizational unit revenue), and fact-finding for qualitative ESG disclosures. The platform integrates with Microsoft 365, Power BI, and Azure for comprehensive sustainability intelligence. Particularly relevant for EU organizations subject to CSRD mandatory reporting requirements starting 2024-2027 depending on company size.",
    fullDescriptionFr: "Microsoft Sustainability Manager est une solution sectorielle construite sur Dynamics 365 et Power Platform qui aide les organisations à mesurer, suivre et reporter leurs performances ESG (Environnement, Social, Gouvernance). Elle permet de se conformer aux cadres de reporting obligatoires incluant la CSRD (Corporate Sustainability Reporting Directive), le Protocole GHG et d'autres standards mondiaux. Les capacités IA incluent : Copilot pour l'analyse de documents ESG (upload et questions en langage naturel), création de modèles de calcul par description en langage naturel, génération automatique de rapports d'émissions et CSRD, requêtes de données en langage naturel, et identification de faits pour les divulgations ESG qualitatives. Particulièrement pertinent pour les entreprises européennes soumises à la CSRD depuis 2024-2027 selon la taille de l'entreprise.",
    keyFeaturesEn: J([
      "Analyze documents with Copilot: upload ESG documents and ask natural language questions (Preview)",
      "Create calculation models with Copilot: describe the model, Copilot generates it (Preview)",
      "Generate reports with Copilot: emissions reports and CSRD regulatory reports (Preview)",
      "Query data with Copilot: natural language queries on ESG metrics and organizational data (Preview)",
      "Find facts with Copilot: draft qualitative and quantitative ESG disclosure responses (Preview)",
      "Emissions tracking: Scope 1, 2, 3 emissions management",
      "CSRD compliance: Corporate Sustainability Reporting Directive automation",
      "Power BI integration for sustainability dashboards and analytics",
      "Integration with Microsoft 365 and Azure for comprehensive ESG intelligence",
      "Industry solution: built on Dynamics 365 + Power Platform"
    ]),
    keyFeatures: J([
      "Analyse de documents Copilot : upload de documents ESG et questions en langage naturel (Preview)",
      "Création de modèles de calcul Copilot : description en langage naturel, Copilot génère le modèle (Preview)",
      "Génération de rapports Copilot : rapports d'émissions et CSRD (Preview)",
      "Requêtes de données Copilot : questions en langage naturel sur les métriques ESG (Preview)",
      "Identification de faits Copilot : rédaction des réponses de divulgation ESG (Preview)",
      "Suivi des émissions : gestion des Scopes 1, 2, 3",
      "Conformité CSRD : automatisation du reporting Corporate Sustainability Reporting Directive",
      "Intégration Power BI pour les tableaux de bord durabilité",
      "Intégration Microsoft 365 et Azure pour l'intelligence ESG complète",
      "Solution sectorielle : construite sur Dynamics 365 + Power Platform"
    ]),
    benefits: J([
      "Conformité CSRD automatisée : obligatoire pour les grandes entreprises européennes",
      "Réduction du temps de préparation des rapports ESG",
      "Données ESG fiables et auditables pour les investisseurs et régulateurs",
      "Intelligence ESG accessible en langage naturel sans expertise technique",
      "Intégration avec les systèmes Microsoft existants : pas de silo de données ESG"
    ]),
    benefitsEn: J([
      "Automated CSRD compliance : mandatory for large European companies",
      "Reduced ESG report preparation time",
      "Reliable, auditable ESG data for investors and regulators",
      "ESG intelligence accessible in natural language without technical expertise",
      "Integration with existing Microsoft systems : no ESG data silo"
    ]),
    targetIndustries: JSON.stringify(["Manufacturing", "Financial Services", "Retail", "Energy", "All industries subject to CSRD"]),
    idealCustomerSize: "Grandes entreprises européennes soumises à la CSRD (+250 employés)",
    idealCustomerSizeEn: "Large European companies subject to CSRD (250+ employees)",
    targetPersonas: JSON.stringify(["CSO (Chief Sustainability Officer)", "CFO", "Compliance Officer", "ESG Manager", "Board Members"]),
    pricingModel: "Licence mensuelle par solution",
    estimatedCost: "Nous consulter : solution sectorielle Dynamics 365",
    estimatedCostEn: "Contact Microsoft : Dynamics 365 industry solution",
    implementationTime: "2-4 mois",
    implementationTimeEn: "2-4 months",
    complexity: "Medium",
    prerequisites: JSON.stringify(["Microsoft 365", "Power Platform recommended"]),
    integrations: JSON.stringify(["Microsoft 365", "Power BI", "Azure", "Dynamics 365", "Power Platform"]),
    competitorComparison: "SAP Sustainability and IBM Envizi are the main competitors. Microsoft Sustainability Manager differentiates through native M365/Copilot integration, AI-powered document analysis, and CSRD-specific automation : at a lower TCO than standalone ESG platforms.",
    salesPriority: "High",
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["sustainability", "ESG", "CSRD", "emissions", "carbon footprint", "green", "durabilité"]),
    tags: JSON.stringify(["ESG", "Sustainability", "CSRD", "Compliance", "AI", "Copilot"]),
    relatedSolutions: JSON.stringify(["Dynamics 365 Finance", "Power Platform"]),
    technicalSpecs: JSON.stringify({}),
    securityFeatures: JSON.stringify(["ISO 27001", "SOC 2", "GDPR"]),
    complianceCerts: JSON.stringify(["GHG Protocol", "CSRD", "ISO 14001"]),
    documentationUrl: "https://learn.microsoft.com/en-us/industry/sustainability/",
    pricingUrl: "https://www.microsoft.com/en-us/sustainability",
    demoUrl: "",
    caseStudyUrls: JSON.stringify([]),
    competitors: JSON.stringify(["SAP Sustainability", "IBM Envizi", "Watershed", "Persefoni"]),
    customerCases: JSON.stringify([]),
    marketPosition: "Only ESG solution natively integrated with M365 and Copilot for automated CSRD compliance",
    salesContext: "CSRD compliance is mandatory for EU companies +250 employees (2024 for large companies, 2025 for listed SMEs). This is a regulatory pressure sale : the question is not 'if' but 'how' they comply. Microsoft Sustainability Manager is the only solution that integrates with their existing Microsoft stack.",
    sellingScenarios: JSON.stringify([
      "CFO facing CSRD compliance deadline : needs automated reporting",
      "CSO building ESG strategy : needs data collection and Scope 3 tracking",
      "Board requiring ESG KPI dashboard for investor reporting"
    ]),
    useCases: JSON.stringify(["Reporting CSRD automatisé", "Suivi des émissions Scope 1-2-3", "Tableaux de bord ESG pour investisseurs", "Conformité réglementaire NIS2 + CSRD"]),
    useCasesEn: JSON.stringify(["Automated CSRD reporting", "Scope 1-2-3 emissions tracking", "ESG dashboards for investors", "Regulatory compliance NIS2 + CSRD"]),
  },

];

// ── Apply updates ─────────────────────────────────────────────────────────────

let updated = 0;
for (const item of data) {
  const patch = UPDATES[item.officialName];
  if (!patch) continue;
  Object.assign(item, patch);
  item.updatedAt = now;
  updated++;
  console.log(`✅ Updated: ${item.officialName}`);
}

// Add new solutions (skip if already exists)
let added = 0;
for (const sol of NEW_SOLUTIONS) {
  const exists = data.some(d => d.officialName === sol.officialName);
  if (exists) {
    console.log(`⏭️  Already exists: ${sol.officialName}`);
    continue;
  }
  data.push(sol);
  added++;
  console.log(`➕ Added: ${sol.officialName}`);
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
console.log(`\n✅ Done : ${updated} updated, ${added} added. Total: ${data.length} solutions.`);
