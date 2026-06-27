/**
 * Update Dynamics 365 solutions from ngenioussolutions.com data
 * - Add 3 new solutions: Product Visualize, Connected Store, Intelligent Order Management
 * - Enrich existing: Sales (Sales Insights features), Finance (Finance Insights features)
 */

const fs   = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/azure-solutions.json');
const data      = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const J         = (arr) => JSON.stringify(arr, null, 0);
const now       = new Date().toISOString();
const newId     = () => 'ngen' + Math.random().toString(36).slice(2, 12);

// ── 1. ENRICH existing solutions ──────────────────────────────────────────────

const UPDATES = {

  'Dynamics 365 Sales': {
    fullDescriptionFr: "Dynamics 365 Sales est le CRM agentique cloud de Microsoft permettant aux équipes commerciales de construire des relations, prioriser les leads et accélérer la conclusion des deals grâce aux insights IA. Il intègre nativement Sales Insights — l'ensemble des capacités IA commerciales : scoring IA des leads et opportunités, évaluation de la santé des relations clients, intelligence conversationnelle (analyse des appels et emails), Sales Accelerator avec guidance de tâches priorisées, et prévisions de revenus prédictives. Quatre agents autonomes travaillent 24h/24 : Sales Qualification Agent, Sales Opportunity Agent, Sales Close Agent, et Sales Research Agent. Intégration native Microsoft 365, Teams, Outlook, et LinkedIn Sales Navigator. Résultats Microsoft : +15,1% de conversion lead-to-opportunity, +9,4% de revenu par vendeur. Leader Gartner Magic Quadrant Sales Force Automation 2025.",
    fullDescription: "Dynamics 365 Sales is Microsoft's cloud agentic CRM enabling sales teams to build relationships, prioritize leads, and close deals faster through AI insights. It natively integrates Sales Insights — the full set of AI sales capabilities: AI-based lead and opportunity scoring, relationship health evaluation, conversation intelligence analyzing calls and emails, Sales Accelerator with prioritized task guidance, and predictive revenue forecasting. Four autonomous agents work 24/7: Sales Qualification Agent, Sales Opportunity Agent, Sales Close Agent, and Sales Research Agent. Native Microsoft 365, Teams, Outlook, and LinkedIn Sales Navigator integration. Microsoft results: +15.1% lead-to-opportunity conversion, +9.4% revenue per seller. Gartner Magic Quadrant Sales Force Automation Leader 2025.",
    updatedAt: now,
  },

  'Dynamics 365 Finance': {
    fullDescriptionFr: "Dynamics 365 Finance est la solution cloud de gestion financière enterprise de Microsoft pour les organisations avec des opérations complexes multi-entités et multi-devises. Elle intègre nativement Finance Insights — l'ensemble des capacités IA financières : prévisions de trésorerie par IA, prédiction des paiements clients (détection des risques de retard), budgétisation automatisée intelligente, workspace Trésorerie avec vue centralisée, et intégration de données externes et internes. L'Account Reconciliation Agent (Production Ready Preview) automatise le rapprochement sous-livre/grand livre en continu. Le Finance Agent dans Microsoft 365 Copilot permet des requêtes financières en langage naturel. Couverture mondiale : 57 pays/régions, 67 langues. Réduction de 80% de la saisie manuelle (données clients). Leader IDC MarketScape ERP Enterprise avec IA 2025.",
    fullDescription: "Dynamics 365 Finance is Microsoft's enterprise cloud financial management solution for organizations with complex multi-entity and multi-currency operations. It natively integrates Finance Insights — the full AI financial capabilities: AI-powered cash flow forecasting, customer payment prediction (late payment risk detection), intelligent automated budgeting, Treasurer Workspace with centralized view, and integration of internal and external data. The Account Reconciliation Agent (Production Ready Preview) automates continuous subledger-to-general ledger reconciliation. Finance Agent in Microsoft 365 Copilot enables natural language financial queries. Global coverage: 57 countries/regions, 67 languages. 80% reduction in manual data entry (customer data). IDC MarketScape AI-Enabled Large Enterprise ERP Leader 2025.",
    updatedAt: now,
  },

  'Dynamics 365 Customer Insights': {
    fullDescriptionFr: "Dynamics 365 Customer Insights est la plateforme de données clients et de parcours client IA de Microsoft. Elle s'articule en deux sous-modules complémentaires : Customer Insights — Data (profils clients unifiés depuis CRM, ERP et autres systèmes, segmentation comportementale et démographique par IA, analyses prédictives churn et probabilité d'achat, recommandations next-best-action, intégration Power BI) et Customer Insights — Journeys (ex-Marketing : orchestration de parcours multicanaux temps réel, personnalisation et déclencheurs d'engagement, lead scoring et nurturing automatisés, création de contenu email et segments par Copilot). Les capacités agentiques engagent proactivement les clients sur email, SMS, push et voix. Forrester Consulting : 324% ROI sur 3 ans, 75% de temps économisé sur les parcours, retour en moins de 6 mois.",
    fullDescription: "Dynamics 365 Customer Insights is Microsoft's AI-powered customer data and journey platform. It comprises two complementary sub-modules: Customer Insights — Data (unified customer profiles from CRM, ERP, and other systems; AI behavioral and demographic segmentation; predictive analytics for churn and purchase likelihood; next-best-action recommendations; Power BI integration) and Customer Insights — Journeys (formerly Marketing: real-time multichannel journey orchestration; personalization and engagement triggers; automated lead scoring and nurturing; Copilot-powered email content and segment creation). Agentic capabilities proactively engage customers across email, SMS, push, and voice. Forrester Consulting: 324% ROI over 3 years, 75% time savings on journey development, less than 6 months to payback.",
    updatedAt: now,
  },

  'Dynamics 365 Supply Chain Management': {
    fullDescriptionFr: "Dynamics 365 Supply Chain Management est une solution ERP cloud connectant les opérations de chaîne d'approvisionnement de bout en bout via IA, IoT et agents autonomes. Fonctionnalités principales : suivi et prévisions des stocks en temps réel, automatisation entrepôt (picking, packing, expédition), maintenance prédictive basée sur l'IoT, planification de production automatisée et allocation des ressources, tableaux de bord supply chain avancés. Le Supplier Communications Agent (Production Ready Preview) automatise les communications fournisseurs pour gérer les risques de livraison. L'intégration IoT permet la surveillance en temps réel des équipements et la maintenance prédictive. Résultats clients : Vera Bradley économise des millions en maintenance ; Orkla +44% de taux de préparation ; Enerjisa -70% de production papier. Leader dans 3 Gartner Magic Quadrant ERP Cloud 2025.",
    fullDescription: "Dynamics 365 Supply Chain Management is a cloud ERP connecting end-to-end supply chain operations through AI, IoT, and autonomous agents. Core capabilities: real-time inventory tracking and forecasting, warehouse automation (picking, packing, shipping), IoT-based predictive maintenance, automated production planning and resource allocation, advanced supply chain dashboards. The Supplier Communications Agent (Production Ready Preview) automates supplier communications for delivery risk management. IoT integration enables real-time equipment monitoring and predictive maintenance. Customer results: Vera Bradley saves millions in maintenance; Orkla +44% line-picking rate; Enerjisa -70% paper output. Leader in 3 Gartner Magic Quadrant Cloud ERP reports 2025.",
    updatedAt: now,
  },

};

// ── 2. NEW SOLUTIONS ──────────────────────────────────────────────────────────

const NEW_SOLUTIONS = [

  {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    name: 'd365-intelligent-order-management',
    officialName: 'Dynamics 365 Intelligent Order Management',
    category: 'business',
    subcategory: 'erp-commerce',
    shortDescription: "AI-driven order fulfillment orchestration that automates order processing, optimizes fulfillment rules, and provides end-to-end order and inventory visibility across all channels.",
    shortDescriptionFr: "Orchestration du fulfillment des commandes pilotée par IA : automatise le traitement des commandes, optimise les règles de fulfillment et fournit une visibilité complète des commandes et stocks sur tous les canaux.",
    fullDescription: "Dynamics 365 Intelligent Order Management streamlines order fulfillment through automation and AI-driven optimization across retail, e-commerce, and omnichannel environments. Core capabilities include order orchestration and automated processing, end-to-end order tracking with real-time inventory visibility, AI-driven demand forecasting, and configurable fulfillment rules optimization. The solution integrates across multiple sales channels (e-commerce platforms, marketplaces, physical stores) to unify order management in a single system. AI models optimize fulfillment decisions — routing orders to the best fulfillment location based on inventory, cost, and delivery time. Native integration with Dynamics 365 Commerce, Supply Chain Management, and third-party logistics providers. Target: retailers and e-commerce businesses managing high order volumes across multiple channels.",
    fullDescriptionFr: "Dynamics 365 Intelligent Order Management rationalise le fulfillment des commandes via l'automatisation et l'optimisation pilotée par l'IA dans les environnements retail, e-commerce et omnicanaux. Capacités principales : orchestration des commandes et traitement automatisé, suivi de bout en bout avec visibilité des stocks en temps réel, prévisions de la demande par IA, et optimisation des règles de fulfillment configurables. La solution intègre plusieurs canaux de vente (e-commerce, marketplaces, magasins physiques) pour unifier la gestion des commandes. Les modèles IA optimisent les décisions de fulfillment en routant les commandes vers le meilleur emplacement. Intégration native avec Dynamics 365 Commerce, Supply Chain Management et les prestataires logistiques tiers.",
    keyFeaturesEn: J([
      "Order orchestration: automated processing and intelligent routing across all channels",
      "End-to-end order tracking with real-time inventory visibility",
      "AI-driven demand forecasting for proactive inventory management",
      "Configurable fulfillment rules: route by inventory, cost, delivery time, or custom rules",
      "Multi-channel integration: e-commerce platforms, marketplaces, physical stores",
      "Native integration with Dynamics 365 Commerce and Supply Chain Management",
      "Third-party logistics (3PL) provider integration",
      "Real-time order status visibility for customers and operations teams",
      "Exception management: automated handling of fulfillment issues"
    ]),
    keyFeatures: J([
      "Orchestration des commandes : traitement automatisé et routage intelligent sur tous les canaux",
      "Suivi de bout en bout avec visibilité des stocks en temps réel",
      "Prévisions de la demande par IA pour la gestion proactive des stocks",
      "Règles de fulfillment configurables : routage par stock, coût, délai ou règles personnalisées",
      "Intégration multicanale : e-commerce, marketplaces, magasins physiques",
      "Intégration native avec Dynamics 365 Commerce et Supply Chain Management",
      "Intégration prestataires logistiques tiers (3PL)",
      "Visibilité en temps réel du statut des commandes pour clients et opérations",
      "Gestion des exceptions : traitement automatisé des problèmes de fulfillment"
    ]),
    benefitsEn: J([
      "Accelerated order fulfillment through automation and intelligent routing",
      "Improved order accuracy with AI-optimized fulfillment decisions",
      "Reduced fulfillment costs through optimal location and carrier selection",
      "Enhanced customer experience with real-time order visibility",
      "Eliminated channel silos — unified order management across all touchpoints",
      "Scalable to handle peak volumes without operational bottlenecks"
    ]),
    benefits: J([
      "Accélération du fulfillment par l'automatisation et le routage intelligent",
      "Amélioration de la précision des commandes avec les décisions IA optimisées",
      "Réduction des coûts de fulfillment par sélection optimale de l'emplacement et du transporteur",
      "Expérience client améliorée avec visibilité temps réel des commandes",
      "Silos de canaux éliminés — gestion unifiée des commandes sur tous les points de contact",
      "Scalable pour gérer les pics de volume sans goulots d'étranglement"
    ]),
    targetIndustries: JSON.stringify(["Retail", "E-Commerce", "Distribution", "Consumer Goods", "Manufacturing"]),
    idealCustomerSize: "ETI et Grands Comptes avec volumes de commandes élevés sur canaux multiples",
    idealCustomerSizeEn: "Mid-market to enterprise with high order volumes across multiple channels",
    targetPersonas: JSON.stringify(["Supply Chain Director", "E-Commerce Director", "Operations Manager", "CIO", "Logistics Manager"]),
    pricingModel: "Licence mensuelle par module",
    estimatedCost: "Contacter Microsoft — inclus ou en add-on avec Dynamics 365 Commerce/SCM",
    estimatedCostEn: "Contact Microsoft — included or add-on with Dynamics 365 Commerce/SCM",
    implementationTime: "3–6 mois",
    implementationTimeEn: "3–6 months",
    complexity: "Medium",
    prerequisites: JSON.stringify(["Dynamics 365 Commerce or Supply Chain Management recommended"]),
    integrations: JSON.stringify(["Dynamics 365 Commerce", "Dynamics 365 Supply Chain Management", "Third-party e-commerce platforms", "Marketplace APIs", "3PL providers", "Azure Logic Apps"]),
    competitorComparison: "Competing with Manhattan Associates OMS, IBM Sterling OMS, and Salesforce Order Management. D365 IOM differentiates through native integration with Dynamics 365 Commerce and SCM, Microsoft AI capabilities, and lower TCO for Microsoft-stack customers.",
    salesPriority: "Medium",
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["order management", "fulfillment", "OMS", "omnichannel", "intelligent order"]),
    tags: JSON.stringify(["Order Management", "Fulfillment", "AI", "E-Commerce", "Omnichannel"]),
    relatedSolutions: JSON.stringify(["Dynamics 365 Commerce", "Dynamics 365 Supply Chain Management", "Dynamics 365 Customer Insights"]),
    technicalSpecs: JSON.stringify({ deployment: "Cloud (Azure)", api: "REST API", integration: "Connectors + Logic Apps" }),
    securityFeatures: JSON.stringify(["Azure security", "Role-based access", "ISO 27001"]),
    complianceCerts: JSON.stringify(["ISO 27001", "SOC 2", "GDPR"]),
    documentationUrl: "https://learn.microsoft.com/en-us/dynamics365/intelligent-order-management",
    pricingUrl: "https://www.microsoft.com/en-us/dynamics-365",
    demoUrl: "",
    caseStudyUrls: JSON.stringify([]),
    competitors: JSON.stringify(["Manhattan Associates OMS", "IBM Sterling OMS", "Salesforce Order Management", "Oracle OMS"]),
    customerCases: JSON.stringify([]),
    marketPosition: "Native Microsoft omnichannel OMS with AI-powered fulfillment optimization integrated across the full Dynamics 365 stack",
    salesContext: "Pitch to retailers and e-commerce companies managing orders across multiple channels. Natural add-on to Dynamics 365 Commerce. Key pitch: eliminates the need for a standalone OMS by integrating fulfillment intelligence directly into the Dynamics 365 ecosystem.",
    sellingScenarios: JSON.stringify([
      "Multi-channel retailer with order routing complexity — IOM optimizes fulfillment location automatically",
      "E-commerce company with high return rates — better fulfillment accuracy reduces returns",
      "Distribution company struggling with inventory visibility across warehouses — real-time unified view"
    ]),
    useCases: JSON.stringify(["Routage intelligent des commandes multicanales", "Optimisation du fulfillment omnicanal", "Visibilité stocks temps réel", "Gestion des exceptions de commandes"]),
    useCasesEn: JSON.stringify(["Intelligent multichannel order routing", "Omnichannel fulfillment optimization", "Real-time inventory visibility", "Order exception management"]),
  },

  {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    name: 'd365-connected-store',
    officialName: 'Dynamics 365 Connected Store',
    category: 'business',
    subcategory: 'retail-iot',
    shortDescription: "IoT sensors and camera-based retail intelligence solution monitoring store activity to deliver operational insights on foot traffic, inventory, and staff allocation.",
    shortDescriptionFr: "Solution d'intelligence retail basée sur capteurs IoT et caméras — surveille l'activité en magasin pour fournir des insights opérationnels sur le trafic piéton, les stocks et l'allocation du personnel.",
    fullDescription: "Dynamics 365 Connected Store uses IoT sensors, cameras, and computer vision to monitor physical store activity and transform it into actionable operational intelligence. The solution analyzes foot traffic patterns to identify peak hours and optimize queue management, tracks inventory levels to surface stockout risks and replenishment needs, and correlates staffing levels with traffic data for optimal workforce allocation. Real-time operational dashboards give store managers immediate visibility into store performance. Integration with Dynamics 365 Commerce connects physical store intelligence with omnichannel operations. The platform helps retailers bridge the gap between online analytics sophistication and physical store visibility, enabling data-driven decisions previously only possible for e-commerce. Target: physical retail operators seeking to optimize in-store operations through data.",
    fullDescriptionFr: "Dynamics 365 Connected Store utilise des capteurs IoT, des caméras et la vision par ordinateur pour surveiller l'activité des magasins physiques et la transformer en intelligence opérationnelle actionnable. La solution analyse les patterns de trafic piéton pour identifier les heures de pointe et optimiser la gestion des files d'attente, suit les niveaux de stocks pour détecter les risques de rupture, et corrèle les effectifs avec les données de trafic pour une allocation optimale du personnel. Des tableaux de bord opérationnels temps réel donnent aux directeurs de magasin une visibilité immédiate sur les performances. L'intégration avec Dynamics 365 Commerce connecte l'intelligence des magasins physiques avec les opérations omnicanales.",
    keyFeaturesEn: J([
      "Foot traffic analysis: peak hour identification, queue monitoring, zone heatmaps",
      "Inventory optimization insights: stockout risk detection, replenishment signals",
      "Staff allocation based on real-time traffic data",
      "Computer vision and IoT sensor integration (cameras, shelf sensors)",
      "Real-time operational dashboards for store managers",
      "Native integration with Dynamics 365 Commerce",
      "Customer journey mapping within physical store",
      "Dwell time analysis by product zone",
      "Conversion rate analytics (store visitors vs. transactions)"
    ]),
    keyFeatures: J([
      "Analyse du trafic piéton : identification des heures de pointe, files d'attente, cartes thermiques de zones",
      "Insights d'optimisation des stocks : détection des risques de rupture, signaux de réapprovisionnement",
      "Allocation du personnel basée sur les données de trafic en temps réel",
      "Intégration vision par ordinateur et capteurs IoT (caméras, capteurs de rayons)",
      "Tableaux de bord opérationnels temps réel pour les directeurs de magasin",
      "Intégration native avec Dynamics 365 Commerce",
      "Cartographie du parcours client dans le magasin physique",
      "Analyse du temps de présence par zone produit",
      "Analytique du taux de conversion (visiteurs vs transactions)"
    ]),
    benefitsEn: J([
      "Improved store efficiency through data-driven staff and inventory decisions",
      "Enhanced customer experience by eliminating queues and stockouts",
      "Reduced operational costs through optimized workforce allocation",
      "Physical-digital parity: same analytics richness for in-store as online",
      "Faster management decisions with real-time operational dashboards",
      "Integrated with Dynamics 365 Commerce for unified omnichannel analytics"
    ]),
    benefits: J([
      "Efficacité améliorée par des décisions data-driven sur le personnel et les stocks",
      "Expérience client améliorée en éliminant les files d'attente et les ruptures",
      "Réduction des coûts opérationnels par une allocation du personnel optimisée",
      "Parité physique-digitale : même richesse analytique en magasin que sur e-commerce",
      "Décisions de gestion plus rapides avec des tableaux de bord temps réel",
      "Intégré avec Dynamics 365 Commerce pour des analytics omnicanales unifiées"
    ]),
    targetIndustries: JSON.stringify(["Retail", "Grocery", "Fashion", "Electronics", "Convenience Stores"]),
    idealCustomerSize: "Retailers avec magasins physiques cherchant à digitaliser leurs opérations",
    idealCustomerSizeEn: "Retailers with physical stores looking to digitize their operations",
    targetPersonas: JSON.stringify(["Store Manager", "Retail Operations Director", "CIO", "Loss Prevention Manager"]),
    pricingModel: "Abonnement + coût infrastructure IoT",
    estimatedCost: "Variable selon le nombre de magasins et capteurs — contacter Microsoft",
    estimatedCostEn: "Variable by number of stores and sensors — contact Microsoft",
    implementationTime: "1–3 mois (par magasin pilote)",
    implementationTimeEn: "1–3 months (per pilot store)",
    complexity: "Medium",
    prerequisites: JSON.stringify(["Dynamics 365 Commerce recommended", "IoT infrastructure (cameras, sensors)", "Azure IoT Hub"]),
    integrations: JSON.stringify(["Dynamics 365 Commerce", "Azure IoT Hub", "Azure Computer Vision", "Power BI", "Azure Stream Analytics"]),
    competitorComparison: "Competing with RetailNext, Sensormatic, and Zebra Technologies for in-store analytics. D365 Connected Store differentiates through native Dynamics 365 Commerce integration, Microsoft AI capabilities, and unified data platform with the rest of the retail stack.",
    salesPriority: "Medium",
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["connected store", "retail IoT", "foot traffic", "store analytics", "in-store intelligence"]),
    tags: JSON.stringify(["IoT", "Retail", "Analytics", "Computer Vision", "Azure"]),
    relatedSolutions: JSON.stringify(["Dynamics 365 Commerce", "Dynamics 365 Customer Insights", "Dynamics 365 Fraud Protection"]),
    technicalSpecs: JSON.stringify({ iot: "Azure IoT Hub", vision: "Azure Computer Vision", analytics: "Azure Stream Analytics" }),
    securityFeatures: JSON.stringify(["Azure security", "Data anonymization for GDPR", "ISO 27001"]),
    complianceCerts: JSON.stringify(["ISO 27001", "SOC 2", "GDPR"]),
    documentationUrl: "https://learn.microsoft.com/en-us/dynamics365/",
    pricingUrl: "https://www.microsoft.com/en-us/dynamics-365",
    demoUrl: "",
    caseStudyUrls: JSON.stringify([]),
    competitors: JSON.stringify(["RetailNext", "Sensormatic", "Zebra Technologies", "Quividi"]),
    customerCases: JSON.stringify([]),
    marketPosition: "Native Microsoft IoT retail intelligence integrated with Dynamics 365 Commerce for unified omnichannel operations",
    salesContext: "Target retailers with significant physical store presence who want the same analytics sophistication as e-commerce. Natural add-on to Dynamics 365 Commerce deals. Key pitch: retailers using D365 Commerce can unify online and offline analytics in a single platform without a separate analytics vendor.",
    sellingScenarios: JSON.stringify([
      "Fashion retailer with poor conversion rate — foot traffic analysis identifies bottlenecks",
      "Grocery chain with recurring stockouts — shelf sensors trigger replenishment before stockout",
      "Department store overstaffing during off-peak hours — traffic data optimizes staff scheduling"
    ]),
    useCases: JSON.stringify(["Analyse du trafic client en magasin", "Optimisation de l'agencement et des stocks", "Allocation intelligente du personnel", "Détection des pertes et vols"]),
    useCasesEn: JSON.stringify(["In-store customer traffic analysis", "Layout and inventory optimization", "Intelligent staff allocation", "Shrinkage and theft detection"]),
  },

  {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    name: 'd365-product-visualize',
    officialName: 'Dynamics 365 Product Visualize',
    category: 'business',
    subcategory: 'sales-ar',
    shortDescription: "AR mobile app allowing sales teams to showcase interactive 3D product models in real-world customer environments — accelerating sales cycles and building customer confidence.",
    shortDescriptionFr: "App mobile AR permettant aux équipes commerciales de présenter des modèles 3D interactifs de produits dans les environnements réels des clients — accélère les cycles de vente et renforce la confiance client.",
    fullDescription: "Dynamics 365 Product Visualize is an augmented reality (AR) mobile application that enables sales teams to place and interact with 3D product models in real-world customer environments using a smartphone or tablet. Sales representatives can show customers exactly how a product will look and fit in their space — a machine on a factory floor, a piece of furniture in an office, or industrial equipment in a facility. Interactive 3D models support rotation, scaling, and placement in the real environment. Annotation and feedback capabilities allow customers to mark up models during sales conversations. Integration with Dynamics 365 Sales connects product visualization with CRM data and opportunity management. The solution reduces the need for physical product demos, shortens sales cycles for complex or large products, and builds customer confidence through immersive visualization. Target: sales teams selling large, complex, or configurable products where physical demos are impractical.",
    fullDescriptionFr: "Dynamics 365 Product Visualize est une application mobile de réalité augmentée (AR) permettant aux équipes commerciales de placer et d'interagir avec des modèles 3D de produits dans les environnements réels des clients via smartphone ou tablette. Les commerciaux peuvent montrer aux clients exactement comment un produit s'intégrera dans leur espace — une machine sur un atelier, un meuble dans un bureau, ou un équipement industriel dans une installation. Les modèles 3D interactifs supportent la rotation, le redimensionnement et le placement dans l'environnement réel. Les capacités d'annotation permettent aux clients de marquer les modèles pendant les conversations commerciales. Intégration avec Dynamics 365 Sales pour connecter la visualisation produit aux données CRM.",
    keyFeaturesEn: J([
      "Interactive 3D product models viewable in real-world customer environments via AR",
      "Rotation, scaling, and placement of product models in the customer's space",
      "Annotation and feedback: customers can mark up models during sales conversations",
      "Mobile device compatibility (iOS and Android smartphones and tablets)",
      "Integration with Dynamics 365 Sales for CRM-connected product visualization",
      "Offline capability for demonstrations in environments without connectivity",
      "Multi-product comparison in the same AR environment",
      "Customer collaboration: share AR view with stakeholders remotely"
    ]),
    keyFeatures: J([
      "Modèles produits 3D interactifs dans les environnements réels des clients via AR",
      "Rotation, redimensionnement et placement des modèles dans l'espace du client",
      "Annotations : les clients peuvent marquer les modèles pendant les conversations",
      "Compatibilité mobile (smartphones et tablettes iOS et Android)",
      "Intégration avec Dynamics 365 Sales pour une visualisation produit connectée au CRM",
      "Capacité hors ligne pour les démonstrations sans connectivité",
      "Comparaison multi-produits dans le même environnement AR",
      "Collaboration client : partage de la vue AR avec les parties prenantes à distance"
    ]),
    benefitsEn: J([
      "Accelerated sales cycles: customers can visualize products without physical samples",
      "Reduced travel and demo costs for large or complex equipment sales",
      "Higher customer confidence through immersive real-world visualization",
      "Lower return rates: customers see exactly what they're buying before purchase",
      "Differentiated sales experience vs competitors without AR capabilities",
      "Connected to Dynamics 365 Sales for seamless CRM integration"
    ]),
    benefits: J([
      "Cycles de vente accélérés : les clients visualisent sans échantillons physiques",
      "Réduction des coûts de déplacement et de démonstration",
      "Confiance client accrue grâce à la visualisation immersive",
      "Taux de retour réduits : les clients voient exactement ce qu'ils achètent",
      "Expérience commerciale différenciante vs concurrents sans AR",
      "Connecté à Dynamics 365 Sales pour une intégration CRM transparente"
    ]),
    targetIndustries: JSON.stringify(["Manufacturing", "Industrial Equipment", "Furniture & Interior Design", "Construction", "Automotive", "Healthcare Equipment"]),
    idealCustomerSize: "Entreprises vendant des produits larges, complexes ou configurables",
    idealCustomerSizeEn: "Organizations selling large, complex, or configurable products",
    targetPersonas: JSON.stringify(["Sales Representatives", "Account Managers", "Pre-Sales Engineers", "Sales Managers"]),
    pricingModel: "Inclus ou add-on avec Dynamics 365 Sales",
    estimatedCost: "Contacter Microsoft — disponibilité et tarification à confirmer",
    estimatedCostEn: "Contact Microsoft — availability and pricing to confirm",
    implementationTime: "Semaines (configuration 3D models requise)",
    implementationTimeEn: "Weeks (3D model configuration required)",
    complexity: "Low",
    prerequisites: JSON.stringify(["Dynamics 365 Sales", "3D product models (GLB/glTF format)", "iOS or Android mobile devices"]),
    integrations: JSON.stringify(["Dynamics 365 Sales", "SharePoint (3D model storage)", "Microsoft Teams"]),
    competitorComparison: "Competing with Augment, Scope AR, and custom AR apps. D365 Product Visualize differentiates through native Dynamics 365 Sales integration, Microsoft support, and no custom development required for standard use cases.",
    salesPriority: "Low",
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["product visualize", "AR sales", "augmented reality", "3D product", "sales demo"]),
    tags: JSON.stringify(["AR", "Augmented Reality", "Sales", "3D", "Mobile"]),
    relatedSolutions: JSON.stringify(["Dynamics 365 Sales", "Dynamics 365 Guides", "Sales in Microsoft 365 Copilot"]),
    technicalSpecs: JSON.stringify({ ar: "ARKit (iOS) / ARCore (Android)", formats: "GLB, glTF" }),
    securityFeatures: JSON.stringify(["Microsoft 365 security model", "Azure Active Directory"]),
    complianceCerts: JSON.stringify(["ISO 27001", "SOC 2"]),
    documentationUrl: "https://learn.microsoft.com/en-us/dynamics365/",
    pricingUrl: "https://www.microsoft.com/en-us/dynamics-365",
    demoUrl: "",
    caseStudyUrls: JSON.stringify([]),
    competitors: JSON.stringify(["Augment", "Scope AR", "Vuforia", "Custom AR development"]),
    customerCases: JSON.stringify([]),
    marketPosition: "Microsoft-native AR product visualization integrated with Dynamics 365 Sales for CRM-connected immersive demos",
    salesContext: "Target sales organizations selling products where physical demos are expensive or impractical — large machinery, furniture, industrial equipment, medical devices. Upsell to D365 Sales Enterprise/Premium customers. Key pitch: reduces demo costs while improving close rates through immersive visualization.",
    sellingScenarios: JSON.stringify([
      "Industrial equipment manufacturer — shows machine placement in customer's factory before purchase",
      "Furniture company — lets interior designers visualize products in actual rooms",
      "Medical device sales — demonstrates equipment size and placement in clinical settings"
    ]),
    useCases: JSON.stringify(["Démonstration produit en AR sur site client", "Visualisation d'équipements industriels avant achat", "Présentation de mobilier dans l'espace réel", "Configuration et comparaison de produits en temps réel"]),
    useCasesEn: JSON.stringify(["On-site AR product demonstration", "Industrial equipment pre-purchase visualization", "Furniture presentation in real space", "Real-time product configuration and comparison"]),
  },

];

// ── Apply updates ─────────────────────────────────────────────────────────────

let updated = 0;
for (const item of data) {
  const patch = UPDATES[item.officialName];
  if (!patch) continue;
  Object.assign(item, patch);
  updated++;
  console.log(`✅ Enriched: ${item.officialName}`);
}

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
console.log(`\n✅ Done — ${updated} enriched, ${added} added. Total: ${data.length} solutions.`);
