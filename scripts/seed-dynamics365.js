const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const solutions = [

  // ─── D365 BUSINESS CENTRAL ──────────────────────────────────────────────────
  {
    name: "d365-business-central",
    officialName: "Dynamics 365 Business Central",
    category: "business",
    subcategory: "erp-smb",
    shortDescription: "ERP tout-en-un pour PME : Finance, Ventes, Achats, Stock, Projets, Fabrication avec Copilot IA intégré.",
    fullDescription: "Business Central est la solution ERP de référence Microsoft pour les PME (5–250 employés). Elle automatise et connecte la finance, les ventes, les achats, l'inventaire, la gestion de projets, la fabrication et les services. Hautement configurable, elle intègre nativement Microsoft 365 (Outlook, Teams, Excel), Power Platform, et embarque Copilot IA pour des gains de productivité immédiats. Déploiement cloud en 4–12 semaines.",
    keyFeatures: JSON.stringify([
      "Finance complète : grand livre, comptabilité fournisseurs/clients, trésorerie, actifs immobilisés",
      "Sales Order Agent IA : automatisation des commandes de vente",
      "Copilot : réconciliation bancaire, suggestions lignes vente, résumés intelligents",
      "Gestion stock & entrepôt multi-sites",
      "Gestion de projets et ressources avec suivi budgétaire",
      "Fabrication & assemblage (MRP, gammes opératoires)",
      "Intégration native Outlook (commandes depuis email), Teams, Excel",
      "Power BI : tableau de bord financier et KPIs temps réel",
      "Marketplace : + de 4 000 extensions AppSource",
      "Déploiement cloud SaaS, on-premises ou hybride"
    ]),
    benefits: JSON.stringify([
      "Implémentation rapide : 4–12 semaines vs 12–18 mois pour SAP/Oracle",
      "Coût total réduit : subscription mensuelle, pas de serveurs à maintenir",
      "Copilot IA natif inclus sans surcoût (ex: réconciliation banque automatique)",
      "Connexion directe à Microsoft 365 : zéro double saisie entre Outlook et le CRM",
      "Scalabilité : de 5 à 500+ utilisateurs sans changement de solution",
      "Conformité fiscale internationale : 170+ pays supportés",
      "30 jours de trial gratuit, migration assistée depuis Sage/QuickBooks/Navision"
    ]),
    useCases: JSON.stringify([
      { title: "Remplacement Sage / QuickBooks", description: "Migration vers un ERP moderne avec Copilot et M365 natif", industries: ["PME tous secteurs"], businessImpact: "Gain de temps 40%, erreurs de saisie -80%" },
      { title: "Distribution & Négoce", description: "Gestion commandes, stock multi-entrepôts, livraisons", industries: ["Distribution", "Logistique"], businessImpact: "Rotation stock +25%, délais livraison -20%" },
      { title: "Entreprise de services professionnels", description: "Suivi projets, temps, facturation et rentabilité", industries: ["Conseil", "IT", "Juridique"], businessImpact: "Facturation +15%, gestion ressources automatisée" },
      { title: "Fabrication légère", description: "MRP, gammes opératoires, gestion nomenclatures", industries: ["Manufacturing", "Agroalimentaire"], businessImpact: "Réduction coûts production 20-30%" }
    ]),
    targetIndustries: JSON.stringify(["Distribution", "Manufacturing", "Services professionnels", "Retail", "Non-profit", "Agroalimentaire"]),
    idealCustomerSize: "PME 5–250 employés",
    targetPersonas: JSON.stringify(["CEO / Dirigeant", "CFO / DAF", "IT Manager", "Directeur Opérations", "Responsable Finance"]),
    pricingModel: "Subscription par utilisateur/mois",
    pricingTiers: JSON.stringify([
      { tier: "Essentials", price: "$70/utilisateur/mois", bestFor: "Finance, ventes, achats, inventaire, projets" },
      { tier: "Premium", price: "$100/utilisateur/mois", bestFor: "Essentials + fabrication + service management" },
      { tier: "Team Member", price: "$8/utilisateur/mois", bestFor: "Lecture seule + tâches légères (approbations)" }
    ]),
    estimatedCost: "À partir de $70/utilisateur/mois (Essentials)",
    implementationTime: "4–12 semaines",
    complexity: "medium",
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(["business central", "ERP", "PME", "finance", "comptabilité", "stock", "fabrication", "Navision", "NAV", "SMB ERP"]),
    tags: JSON.stringify(["ERP", "SMB", "Copilot", "Finance", "M365"])
  },

  // ─── D365 SALES ─────────────────────────────────────────────────────────────
  {
    name: "d365-sales",
    officialName: "Dynamics 365 Sales",
    category: "business",
    subcategory: "crm-sales",
    shortDescription: "CRM IA pour accélérer le pipeline, scorer les leads et conclure plus de deals avec Copilot et Sales Agents autonomes.",
    fullDescription: "Dynamics 365 Sales est le CRM Microsoft pour les équipes commerciales. Il combine la gestion des leads, opportunités, devis et commandes avec une IA avancée : scoring prédictif des leads, Sales Qualification Agent autonome, Relationship Intelligence, Conversation Intelligence (analyse appels), et forecasting premium. Intégré nativement à LinkedIn Sales Navigator, Teams, Outlook et Power BI.",
    keyFeatures: JSON.stringify([
      "Sales Qualification Agent : IA autonome qui qualifie et handoff les leads",
      "Sales Opportunity Agent : recherche et recommandations IA sur les opportunités",
      "Scoring prédictif leads et opportunités (ML models)",
      "Conversation Intelligence : analyse automatique des appels commerciaux",
      "Relationship Analytics : santé de la relation client, prochaines actions",
      "Forecasting premium : prévisions revenu avec IA",
      "LinkedIn Sales Navigator intégré",
      "Sales Accelerator : liste de travail priorisée par IA",
      "Séquences & workflows automatisés (nurturing)",
      "Copilot : résumés d'opportunités, emails suggérés, réponses rapides"
    ]),
    benefits: JSON.stringify([
      "Deals conclus plus vite : pipeline priorisé par IA, moins de temps perdu",
      "Taux conversion leads +25% grâce au scoring prédictif",
      "Visibilité pipeline 360° : toutes les interactions dans un seul endroit",
      "Forecasting précis : réduction écarts prévision/réalité",
      "Coaches commerciaux : conversation intelligence pour onboarding rapide",
      "Zéro saisie manuelle : sync automatique emails/meetings via Exchange"
    ]),
    useCases: JSON.stringify([
      { title: "Inside Sales B2B", description: "Qualification et nurturing de leads entrants avec IA", industries: ["Tech", "SaaS", "Finance"], businessImpact: "Réduction cycle vente 20%, conversion +30%" },
      { title: "Field Sales Enterprise", description: "Gestion comptes stratégiques et pipeline complexe", industries: ["Manufacturing", "Services"], businessImpact: "Visibilité pipeline +100%, prévisions -50% d'écart" },
      { title: "Remplacement Salesforce", description: "Migration CRM avec Copilot natif et intégration M365", industries: ["All"], businessImpact: "TCO -40% vs Salesforce Enterprise" }
    ]),
    targetIndustries: JSON.stringify(["Technology", "Financial Services", "Manufacturing", "Retail", "Professional Services"]),
    idealCustomerSize: "PME à Grande Entreprise (25–5000 employés)",
    targetPersonas: JSON.stringify(["VP Sales", "Sales Manager", "Account Executive", "Business Development", "RevOps"]),
    pricingModel: "Subscription par utilisateur/mois",
    pricingTiers: JSON.stringify([
      { tier: "Professional", price: "$65/utilisateur/mois", bestFor: "Gestion leads/opps, rapports, intégration Office" },
      { tier: "Enterprise", price: "$95/utilisateur/mois", bestFor: "Copilot, forecasting, conversation intelligence, IA scoring" },
      { tier: "Premium", price: "$135/utilisateur/mois", bestFor: "Enterprise + Viva Sales + Sales Insights avancés" }
    ]),
    estimatedCost: "À partir de $65/utilisateur/mois (Professional)",
    implementationTime: "4–8 semaines",
    complexity: "medium",
    salesPriority: 9,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(["CRM", "sales", "ventes", "leads", "pipeline", "forecasting", "Salesforce", "HubSpot", "opportunités"]),
    tags: JSON.stringify(["CRM", "Sales", "Copilot", "AI", "Revenue"])
  },

  // ─── D365 CUSTOMER SERVICE ───────────────────────────────────────────────────
  {
    name: "d365-customer-service",
    officialName: "Dynamics 365 Customer Service",
    category: "business",
    subcategory: "crm-service",
    shortDescription: "Plateforme de service client omnicanale avec Copilot IA, routage intelligent et gestion des SLA.",
    fullDescription: "Dynamics 365 Customer Service permet aux équipes support de gérer les demandes clients sur tous les canaux (voix, chat, email, réseaux sociaux) dans une interface unifiée. Copilot IA assiste les agents en temps réel (résumés, suggestions réponses, actions), le routage unifié attribue les tickets aux bons agents, et l'analytique mesure la satisfaction et la productivité.",
    keyFeatures: JSON.stringify([
      "Copilot Service Workspace : interface multi-sessions avec IA intégrée",
      "Service Agent IA : récupère détails, résume, met à jour les cases",
      "Omnicanal : voix (PSTN), chat, email, Teams, WhatsApp, Facebook",
      "Routage unifié intelligent (compétences, charge, SLA)",
      "Base de connaissances centralisée",
      "SLA et entitlements configurables",
      "Analyse sentiments et satisfaction (CSAT) temps réel",
      "IoT Connected Service : détection anomalies préventive",
      "Planification de services et rendez-vous",
      "Power Virtual Agents : bot IA self-service client"
    ]),
    benefits: JSON.stringify([
      "Résolution first contact +35% grâce aux suggestions IA en temps réel",
      "Temps moyen traitement -25% via résumés automatiques et actions IA",
      "Satisfaction client améliorée : vue 360° historique dans chaque interaction",
      "Réduction coût service : self-service IA + routage optimal",
      "Conformité SLA : alertes et escalades automatiques",
      "Agents plus heureux : moins de travail répétitif, plus de valeur ajoutée"
    ]),
    useCases: JSON.stringify([
      { title: "Centre de contact modernisation", description: "Remplacement solution legacy par omnicanal cloud + IA", industries: ["Telecom", "Retail", "Finance"], businessImpact: "Coût par interaction -30%, CSAT +20pts" },
      { title: "Support B2B", description: "Gestion tickets complexes avec escalades et SLA contractuels", industries: ["Technology", "Manufacturing"], businessImpact: "SLA compliance +40%, résolution +2x rapide" },
      { title: "Service après-vente", description: "Gestion retours, réparations, interventions terrain", industries: ["Manufacturing", "Retail"], businessImpact: "Intégration Field Service, 0 rupture service" }
    ]),
    targetIndustries: JSON.stringify(["Retail", "Financial Services", "Telecom", "Healthcare", "Manufacturing", "Technology"]),
    idealCustomerSize: "PME à Grande Entreprise (20+ agents)",
    targetPersonas: JSON.stringify(["Director Customer Service", "Call Center Manager", "CX Director", "Support Team Lead"]),
    pricingModel: "Subscription par utilisateur/mois",
    pricingTiers: JSON.stringify([
      { tier: "Professional", price: "$50/utilisateur/mois", bestFor: "Gestion cases, email, base connaissance, SLA" },
      { tier: "Enterprise", price: "$95/utilisateur/mois", bestFor: "Omnicanal, routage unifié, IA Copilot, IoT" }
    ]),
    estimatedCost: "À partir de $50/utilisateur/mois (Professional)",
    implementationTime: "6–12 semaines",
    complexity: "medium",
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(["customer service", "support", "helpdesk", "ticketing", "omnicanal", "CSAT", "SLA", "centre contact", "CRM"]),
    tags: JSON.stringify(["Customer Service", "Omnichannel", "Copilot", "CRM", "AI"])
  },

  // ─── D365 FINANCE ───────────────────────────────────────────────────────────
  {
    name: "d365-finance",
    officialName: "Dynamics 365 Finance",
    category: "business",
    subcategory: "erp-enterprise",
    shortDescription: "ERP financier global avec IA : Grand Livre, AP/AR, Trésorerie, Budgets, Conformité, Copilot pour Finance.",
    fullDescription: "Dynamics 365 Finance est la solution ERP Microsoft pour les opérations financières mondiales des moyennes et grandes entreprises. Elle couvre le Grand Livre, la gestion des comptes fournisseurs et clients, la trésorerie, la planification budgétaire, les actifs immobilisés, le leasing d'actifs et la conformité réglementaire internationale. Finance Insights intègre l'IA pour prédire les paiements clients et prévoir les flux de trésorerie. Copilot for Finance réduit le travail manuel de saisie et de réconciliation.",
    keyFeatures: JSON.stringify([
      "Grand Livre : plan comptable flexible, dimensions financières, hiérarchies",
      "Comptes Fournisseurs : capture intelligente factures, matching 3 voies, paiements",
      "Comptes Clients : facturation abonnements, crédit & recouvrement, paiements",
      "Budget : planification, contrôle, position forecasting",
      "Trésorerie : cash flow forecasting IA, réconciliation bancaire avancée",
      "Actifs immobilisés & leasing (IFRS 16, ASC 842)",
      "Finance Insights : prédiction paiements clients (ML)",
      "Copilot for Finance : résumés, recommandations, réduction saisie manuelle",
      "Facturation électronique + calcul TVA international (170+ pays)",
      "Export Azure Data Lake + Power BI financier"
    ]),
    benefits: JSON.stringify([
      "Clôture mensuelle 2–3x plus rapide grâce à l'automatisation",
      "Cash flow forecast précis : Finance Insights ML réduit les écarts",
      "Conformité internationale out-of-the-box (IFRS, US GAAP, 170+ pays)",
      "Réduction fraude fournisseurs : invoice capture + matching IA",
      "Visibilité temps réel sur la performance financière mondiale",
      "Intégration native Power BI pour reporting CFO immédiat"
    ]),
    useCases: JSON.stringify([
      { title: "Modernisation ERP financier", description: "Remplacement SAP ECC / Oracle EBS par solution cloud", industries: ["Manufacturing", "Distribution", "Retail"], businessImpact: "TCO -40%, clôture -50% de temps" },
      { title: "Gestion multi-entités internationales", description: "Consolidation financière groupe multi-pays, multi-devises", industries: ["Holding", "Multinationale"], businessImpact: "Consolidation automatique, conformité locale" },
      { title: "Optimisation cash flow", description: "Prédiction paiements clients, réduction DSO", industries: ["Distribution", "Manufacturing"], businessImpact: "DSO -8 jours, impayés -25%" }
    ]),
    targetIndustries: JSON.stringify(["Manufacturing", "Distribution", "Retail", "Services", "Public Sector", "Holding"]),
    idealCustomerSize: "Moyenne à Grande Entreprise (250+ employés)",
    targetPersonas: JSON.stringify(["CFO / DAF", "Directeur Comptable", "Controller", "Responsable AP/AR", "IT Director"]),
    pricingModel: "Subscription par utilisateur/mois",
    pricingTiers: JSON.stringify([
      { tier: "Finance", price: "$180/utilisateur/mois", bestFor: "ERP financier complet, Copilot, Finance Insights" },
      { tier: "Finance + SCM Bundle", price: "Prix sur devis", bestFor: "Finance + Supply Chain Management" }
    ]),
    estimatedCost: "À partir de $180/utilisateur/mois",
    implementationTime: "12–24 semaines",
    complexity: "high",
    salesPriority: 7,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(["ERP finance", "grand livre", "comptabilité", "AP", "AR", "trésorerie", "budget", "SAP", "Oracle", "clôture"]),
    tags: JSON.stringify(["ERP", "Finance", "Enterprise", "Copilot", "AI", "Global"])
  },

  // ─── D365 SUPPLY CHAIN MANAGEMENT ───────────────────────────────────────────
  {
    name: "d365-supply-chain",
    officialName: "Dynamics 365 Supply Chain Management",
    category: "business",
    subcategory: "erp-scm",
    shortDescription: "Chaîne d'approvisionnement digitale : achats, fabrication, entrepôt, transport et ventes avec insights proactifs IA.",
    fullDescription: "Dynamics 365 Supply Chain Management digitalise toute la chaîne logistique de bout en bout. Le module Sales & Marketing gère devis, commandes de vente, accords commerciaux, campagnes et la facturation (client, pro forma, texte libre). La fabrication couvre MES, MRP et planning. La gestion d'entrepôt et transport optimise les flux physiques. Des insights IA proactifs réduisent les risques de rupture et améliorent la collaboration fournisseurs.",
    keyFeatures: JSON.stringify([
      "Ventes & Marketing : devis, commandes, accords commerciaux, up-sell/cross-sell",
      "Gestion back-orders : suivi par article, client, fournisseur",
      "Facturation : invoice client, pro forma, texte libre",
      "Campagnes marketing : télémarketing, mailing, email",
      "Gestion achats & approvisionnement",
      "Fabrication : MRP, MES, gammes, nomenclatures",
      "Warehouse Management System (WMS) avancé",
      "Transportation Management (TMS)",
      "Intelligent Order Management : orchestration commandes multi-sources",
      "Copilot : prévisions demande IA, alertes rupture proactives"
    ]),
    benefits: JSON.stringify([
      "Délais de livraison réduits grâce aux prévisions proactives IA",
      "Ruptures de stock -35% : anticipation intelligente",
      "Collaboration fournisseurs améliorée : portail self-service",
      "Visibilité end-to-end : du devis client à la livraison",
      "Conformité réglementaire : traçabilité totale lots & numéros série",
      "Optimisation transports : coûts logistiques -15–20%"
    ]),
    useCases: JSON.stringify([
      { title: "Fabricant B2B", description: "De la commande client à la livraison : gestion production + ventes", industries: ["Manufacturing", "Automotive"], businessImpact: "OTD +20%, WIP -30%" },
      { title: "Distributeur", description: "Gestion multi-entrepôts, commandes, réapprovisionnement auto", industries: ["Distribution", "Wholesale"], businessImpact: "Taux de service +15%, coût stock -20%" },
      { title: "Remplacement AX 2012", description: "Migration Dynamics AX vers D365 SCM cloud", industries: ["All"], businessImpact: "Cloud natif, mises à jour continues, TCO -30%" }
    ]),
    targetIndustries: JSON.stringify(["Manufacturing", "Distribution", "Retail", "Automotive", "Agroalimentaire", "Chemical"]),
    idealCustomerSize: "Moyenne à Grande Entreprise",
    targetPersonas: JSON.stringify(["Supply Chain Director", "Operations Manager", "Logistics Manager", "Plant Manager", "Procurement Manager"]),
    pricingModel: "Subscription par utilisateur/mois",
    pricingTiers: JSON.stringify([
      { tier: "Supply Chain Management", price: "$180/utilisateur/mois", bestFor: "SCM complet : achats, fabrication, entrepôt, transport" }
    ]),
    estimatedCost: "À partir de $180/utilisateur/mois",
    implementationTime: "16–36 semaines",
    complexity: "high",
    salesPriority: 7,
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["supply chain", "ERP", "fabrication", "entrepôt", "logistique", "MRP", "WMS", "achats", "AX", "D365FO"]),
    tags: JSON.stringify(["SCM", "ERP", "Manufacturing", "Warehouse", "Enterprise"])
  },

  // ─── D365 CUSTOMER INSIGHTS ──────────────────────────────────────────────────
  {
    name: "d365-customer-insights",
    officialName: "Dynamics 365 Customer Insights",
    category: "business",
    subcategory: "cdp-marketing",
    shortDescription: "CDP + Marketing IA : vision 360° client, segmentation prédictive et orchestration de parcours omnicanaux personnalisés.",
    fullDescription: "Dynamics 365 Customer Insights combine une Customer Data Platform (CDP) et un outil d'automatisation marketing. Il unifie les données transactionnelles, comportementales et observationnelles en un profil client 360°. L'IA suggère des segments, prédit le churn et le lifetime value. Le module Journeys orchestre des campagnes email, SMS, push et temps réel en réponse aux comportements clients.",
    keyFeatures: JSON.stringify([
      "CDP : unification données de toutes les sources (CRM, web, POS, IoT)",
      "Profil client 360° enrichi en temps réel",
      "Segmentation IA : segments prédictifs, churn prediction, CLV",
      "Journeys : orchestration parcours temps réel (email, SMS, push, in-app)",
      "Personnalisation IA : contenu et timing optimisés par ML",
      "Consent management & conformité RGPD",
      "Intégration native D365 Sales & Customer Service",
      "Connecteurs 1000+ sources (Power Platform, Azure Synapse)",
      "A/B testing et analytics parcours",
      "Copilot : création segments en langage naturel"
    ]),
    benefits: JSON.stringify([
      "Churn réduit : détection précoce et actions proactives personnalisées",
      "Revenue incrémental : upsell/cross-sell basé sur comportements réels",
      "Expérience client unifiée : même message cohérent sur tous les canaux",
      "Conformité RGPD native : gestion consentements centralisée",
      "Marketing ROI mesurable : attribution multi-touch IA",
      "Segmentation 10x plus rapide avec Copilot en langage naturel"
    ]),
    useCases: JSON.stringify([
      { title: "Retail / E-commerce", description: "Personnalisation produits, abandons panier, fidélisation", industries: ["Retail", "E-commerce"], businessImpact: "Conversion +25%, panier moyen +18%" },
      { title: "Banking / Insurance", description: "Onboarding, cross-sell produits, rétention clients", industries: ["Financial Services"], businessImpact: "Churn -20%, CLV +30%" },
      { title: "B2B Marketing Automation", description: "Nurturing leads, account-based marketing, alerte ventes", industries: ["Technology", "Manufacturing"], businessImpact: "MQL → SQL 2x plus vite" }
    ]),
    targetIndustries: JSON.stringify(["Retail", "Financial Services", "Healthcare", "Technology", "Telecom", "Hospitality"]),
    idealCustomerSize: "Moyennes à Grandes entreprises (base clients 10k+)",
    targetPersonas: JSON.stringify(["CMO", "Directeur Marketing", "Data Analyst", "Marketing Ops", "CX Director"]),
    pricingModel: "Subscription par tenant/mois + profils",
    pricingTiers: JSON.stringify([
      { tier: "Customer Insights (CDP)", price: "$1 700/tenant/mois (1000 profils inclus)", bestFor: "Unification données + profils 360°" },
      { tier: "Customer Insights + Journeys", price: "Bundle sur devis (selon nb interactions)", bestFor: "CDP + orchestration marketing omnicanal" }
    ]),
    estimatedCost: "À partir de $1 700/tenant/mois",
    implementationTime: "8–16 semaines",
    complexity: "medium",
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(["CDP", "customer data platform", "marketing automation", "journeys", "segmentation", "churn", "personnalisation", "omnicanal"]),
    tags: JSON.stringify(["CDP", "Marketing", "AI", "Personalization", "Omnichannel"])
  },

  // ─── D365 FIELD SERVICE ─────────────────────────────────────────────────────
  {
    name: "d365-field-service",
    officialName: "Dynamics 365 Field Service",
    category: "business",
    subcategory: "crm-field",
    shortDescription: "Gestion des interventions terrain : planification IA, IoT prédictif, application mobile techniciens et réalité mixte.",
    fullDescription: "Dynamics 365 Field Service connecte les équipes terrain avec l'IA, l'IoT et la réalité mixte pour délivrer un service exceptionnel. Le planificateur IA optimise les tournées, l'IoT détecte les anomalies avant les pannes, l'application mobile guide les techniciens avec des étapes de travail et Remote Assist permet aux experts d'intervenir à distance. Les clients peuvent s'autoplanifier en ligne.",
    keyFeatures: JSON.stringify([
      "Gestion ordres de travail et interventions",
      "Planification optimisée IA (Resource Scheduling Optimization)",
      "Application mobile techniciens (iOS & Android) avec mode offline",
      "IoT Connected Service : alertes anomalies, maintenance préventive",
      "Dynamics 365 Guides : instructions AR étape par étape sur HoloLens",
      "Remote Assist : assistance experte à distance en réalité mixte",
      "Self-scheduling clients : portail de rendez-vous en ligne",
      "Gestion pièces détachées et stocks terrain",
      "SLA et entitlements de service",
      "Copilot : résumés interventions, ordres de travail auto-générés depuis IoT"
    ]),
    benefits: JSON.stringify([
      "First-time fix rate +25% : meilleure préparation et pièces adéquates",
      "Déplacements -15% : optimisation IA des tournées",
      "Maintenance préventive : IoT détecte avant la panne client",
      "Techniciens plus efficaces : AR guides + Remote Assist",
      "Satisfaction client +30% : proactivité et self-scheduling",
      "Coût service -20% : résolution à distance avant déplacement"
    ]),
    useCases: JSON.stringify([
      { title: "Maintenance industrielle", description: "Gestion interventions préventives et curatives avec IoT", industries: ["Manufacturing", "Energy", "Utilities"], businessImpact: "MTTR -40%, uptime équipements +15%" },
      { title: "Télécoms & câblodistribution", description: "Optimisation tournées techniciens installation/SAV", industries: ["Telecom"], businessImpact: "Productivité techniciens +30%, coût/visite -20%" },
      { title: "Santé & Médical", description: "Maintenance équipements médicaux, traçabilité FDA", industries: ["Healthcare"], businessImpact: "Conformité 100%, zéro panne équipements critiques" }
    ]),
    targetIndustries: JSON.stringify(["Manufacturing", "Energy & Utilities", "Telecom", "Healthcare", "HVAC", "Elevator & Lift"]),
    idealCustomerSize: "Toute entreprise avec équipes terrain (10+ techniciens)",
    targetPersonas: JSON.stringify(["Service Director", "Field Operations Manager", "Technicien Terrain", "Dispatcher", "CX Director"]),
    pricingModel: "Subscription par utilisateur/mois",
    pricingTiers: JSON.stringify([
      { tier: "Field Service", price: "$95/utilisateur/mois", bestFor: "Gestion complète interventions, planification, mobile, IoT" },
      { tier: "Contractor (accès limité)", price: "$50/utilisateur/mois", bestFor: "Techniciens sous-traitants : accès mobile uniquement" }
    ]),
    estimatedCost: "À partir de $95/utilisateur/mois",
    implementationTime: "6–12 semaines",
    complexity: "medium",
    salesPriority: 7,
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["field service", "intervention", "technicien", "IoT", "maintenance", "planification", "tournées", "AR", "mixed reality"]),
    tags: JSON.stringify(["Field Service", "IoT", "Mobile", "AR", "Maintenance"])
  },

  // ─── D365 PROJECT OPERATIONS ────────────────────────────────────────────────
  {
    name: "d365-project-operations",
    officialName: "Dynamics 365 Project Operations",
    category: "business",
    subcategory: "erp-projects",
    shortDescription: "Connecte ventes, ressources, gestion de projet et finance pour maximiser la rentabilité des projets.",
    fullDescription: "Dynamics 365 Project Operations est la solution bout-en-bout pour les entreprises de services orientées projets. Elle connecte l'avant-vente (devis projet), la planification des ressources, l'exécution (tâches, temps, dépenses) et la facturation dans une seule application. Intégration Microsoft Project, Teams et Finance pour une visibilité complète profitabilité projet.",
    keyFeatures: JSON.stringify([
      "Estimation et devis projet intégrés au CRM Sales",
      "Planification ressources : disponibilité, compétences, utilisation",
      "Suivi temps et dépenses (web + mobile)",
      "Gestion sous-traitants et purchase orders projet",
      "Reconnaissance revenus (IFRS 15 / ASC 606)",
      "Intégration Microsoft Project Online",
      "Facturation temps & matières / prix fixe / jalons",
      "Power BI : dashboard rentabilité et utilisation ressources",
      "Copilot : résumés projet, recommandations ressources",
      "Intégration D365 Finance pour comptabilité analytique projet"
    ]),
    benefits: JSON.stringify([
      "Marge projet +15% : visibilité temps réel coûts vs budget",
      "Utilisation ressources +20% : planification IA vs Excel",
      "Cash flow amélioré : facturation déclenchée automatiquement aux jalons",
      "Propositions commerciales plus rapides : templates et historique projets",
      "Conformité revenue recognition automatique (IFRS 15)"
    ]),
    useCases: JSON.stringify([
      { title: "Cabinet de conseil", description: "De l'avant-vente à la facture en une seule solution", industries: ["Consulting", "IT Services"], businessImpact: "Utilisation ressources facturable +8pts" },
      { title: "ESN / SSII", description: "Gestion portefeuille projets, temps, ressources, contrats", industries: ["IT Services"], businessImpact: "DSO -10 jours, marge +12%" },
      { title: "Engineering & Construction", description: "Projets complexes multi-phases, sous-traitants, jalons", industries: ["Engineering", "Construction"], businessImpact: "Budget overrun -40%, reporting temps réel" }
    ]),
    targetIndustries: JSON.stringify(["Consulting", "IT Services", "Engineering", "Accounting", "Architecture", "Construction"]),
    idealCustomerSize: "PME à Grande Entreprise (project-based)",
    targetPersonas: JSON.stringify(["CEO", "Project Manager", "Resource Manager", "CFO", "Delivery Director"]),
    pricingModel: "Subscription par utilisateur/mois",
    pricingTiers: JSON.stringify([
      { tier: "Project Operations", price: "$120/utilisateur/mois", bestFor: "Full project lifecycle + finance + resources" },
      { tier: "Team Member", price: "$8/utilisateur/mois", bestFor: "Saisie de temps/dépenses uniquement" }
    ]),
    estimatedCost: "À partir de $120/utilisateur/mois",
    implementationTime: "8–16 semaines",
    complexity: "medium",
    salesPriority: 6,
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["project operations", "PSA", "services professionnels", "consulting", "ressources", "rentabilité projet", "time tracking"]),
    tags: JSON.stringify(["Projects", "PSA", "Finance", "Resources", "Consulting"])
  },

  // ─── D365 HUMAN RESOURCES ────────────────────────────────────────────────────
  {
    name: "d365-human-resources",
    officialName: "Dynamics 365 Human Resources",
    category: "business",
    subcategory: "hr",
    shortDescription: "SIRH cloud : gestion RH, avantages sociaux, congés, performance et conformité avec Copilot IA.",
    fullDescription: "Dynamics 365 Human Resources est le SIRH Microsoft pour la gestion des effectifs. Il couvre les avantages sociaux, les congés & absences, la conformité RH, la formation, la gestion des performances, et le recrutement. Il se connecte à D365 Finance pour la paie et à LinkedIn Talent Hub pour le recrutement.",
    keyFeatures: JSON.stringify([
      "Gestion avantages sociaux et rémunération",
      "Congés & absences : politiques configurables, approbation workflow",
      "Gestion des performances et objectifs (OKR)",
      "Formation & développement des compétences",
      "Conformité RH : audit trails, politiques, réglementations",
      "Self-service employé et manager (portail + app mobile)",
      "Intégration D365 Finance : paie et analytique RH",
      "Intégration LinkedIn Talent Hub : recrutement",
      "People Analytics : tableaux de bord turnover, engagement",
      "Copilot : résumés profils, insights analytique RH"
    ]),
    benefits: JSON.stringify([
      "Automatisation processus RH : -60% de tâches administratives",
      "Engagement employés : self-service 24/7, transparence",
      "Conformité : politiques RH et audit trails automatiques",
      "Rétention : People Analytics détecte risques turnover",
      "Recrutement optimisé : connexion LinkedIn Talent"
    ]),
    useCases: JSON.stringify([
      { title: "Modernisation SIRH", description: "Remplacement solution RH legacy ou Excel par cloud", industries: ["All"], businessImpact: "Coût admin RH -40%, satisfaction employés +30%" },
      { title: "Multi-sites internationaux", description: "RH centralisée avec politiques locales par pays", industries: ["Multinationale"], businessImpact: "Conformité 100%, visibilité groupe" }
    ]),
    targetIndustries: JSON.stringify(["All"]),
    idealCustomerSize: "PME à Grande Entreprise (50+ employés)",
    targetPersonas: JSON.stringify(["DRH / HRD", "HR Manager", "HRBP", "Payroll Manager", "IT Director"]),
    pricingModel: "Subscription par utilisateur/mois",
    pricingTiers: JSON.stringify([
      { tier: "Human Resources", price: "$120/utilisateur/mois", bestFor: "SIRH complet + analytics + M365 intégration" }
    ]),
    estimatedCost: "À partir de $120/utilisateur/mois",
    implementationTime: "8–16 semaines",
    complexity: "medium",
    salesPriority: 5,
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["SIRH", "RH", "HR", "paie", "congés", "avantages sociaux", "recrutement", "performance", "employés"]),
    tags: JSON.stringify(["HR", "SIRH", "Employees", "Compliance", "People Analytics"])
  },

  // ─── D365 COMMERCE ──────────────────────────────────────────────────────────
  {
    name: "d365-commerce",
    officialName: "Dynamics 365 Commerce",
    category: "business",
    subcategory: "erp-retail",
    shortDescription: "Commerce omnicanal unifié : e-commerce, point de vente, call center et back-office dans une seule solution.",
    fullDescription: "Dynamics 365 Commerce délivre une expérience d'achat unifiée et personnalisée sur tous les canaux (boutiques physiques, e-commerce, application mobile, call center). Les recommandations produits IA, la gestion de la fidélité, la tarification dynamique et la gestion des stocks en temps réel permettent aux retailers d'améliorer conversion et rentabilité.",
    keyFeatures: JSON.stringify([
      "Point de vente (POS) cloud natif, mode offline",
      "E-commerce headless : storefront configurable",
      "Call center : prise de commandes, promotions, paiements",
      "Back-office retail : achats, stocks, pricing",
      "Recommandations produits IA personnalisées",
      "Programme fidélité multi-canaux",
      "Order Management : Buy Online Pickup In Store (BOPIS)",
      "Personnalisation Copilot : descriptions produits générées IA",
      "Power BI : analytics ventes par canal, SKU, région",
      "Intégration native D365 Finance & Customer Insights"
    ]),
    benefits: JSON.stringify([
      "Expérience client unifiée : même panier, fidélité, historique sur tous canaux",
      "Conversion e-commerce +20% : recommandations IA personnalisées",
      "Stock optimisé : visibilité temps réel omnicanal",
      "BOPIS : réduction abandons panier, trafic magasin",
      "Descriptions produits générées par Copilot : 10x plus vite"
    ]),
    useCases: JSON.stringify([
      { title: "Retail multi-canaux", description: "Unification POS, e-commerce et supply chain retail", industries: ["Retail", "Fashion", "Consumer Goods"], businessImpact: "Ventes online +30%, retours -15%" },
      { title: "Franchise & réseaux", description: "Centralisation offres, prix, promos avec déclinaison locale", industries: ["Franchise", "Food & Beverage"], businessImpact: "Cohérence marque + autonomie locale" }
    ]),
    targetIndustries: JSON.stringify(["Retail", "Fashion", "Food & Beverage", "Consumer Electronics", "Franchise"]),
    idealCustomerSize: "PME à Grande Entreprise (retail 10+ points de vente)",
    targetPersonas: JSON.stringify(["Directeur Commerce", "Directeur Digital", "CTO Retail", "Responsable e-commerce", "CFO"]),
    pricingModel: "Subscription par utilisateur/mois + transactions",
    pricingTiers: JSON.stringify([
      { tier: "Commerce", price: "$180/utilisateur/mois", bestFor: "POS + e-commerce + call center + back-office retail" }
    ]),
    estimatedCost: "À partir de $180/utilisateur/mois",
    implementationTime: "12–24 semaines",
    complexity: "high",
    salesPriority: 5,
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["commerce", "retail", "POS", "e-commerce", "omnicanal", "BOPIS", "fidélité", "caisse", "boutique"]),
    tags: JSON.stringify(["Retail", "Commerce", "Omnichannel", "POS", "E-commerce"])
  },

  // ─── D365 CONTACT CENTER ────────────────────────────────────────────────────
  {
    name: "d365-contact-center",
    officialName: "Dynamics 365 Contact Center",
    category: "business",
    subcategory: "ccaas",
    shortDescription: "CCaaS Microsoft : centre de contact cloud natif avec voix, digital, IA générative et Copilot pour agents.",
    fullDescription: "Dynamics 365 Contact Center est la solution Contact Center as a Service (CCaaS) de Microsoft, conçue pour s'intégrer à n'importe quel CRM. Il combine les canaux voix (PSTN natif), digital (chat, email, réseaux sociaux, WhatsApp), le routage IA, les bots Power Virtual Agents, et Copilot IA pour assister les agents en temps réel avec résumés, suggestions et actions automatiques.",
    keyFeatures: JSON.stringify([
      "Canaux unifiés : voix, chat, email, SMS, WhatsApp, Facebook, Teams",
      "Routage IA : compétences, sentiment, priorité, charge",
      "Copilot agent assist : résumés, suggestions réponses temps réel",
      "Self-service IA : Power Virtual Agents (bots conversationnels)",
      "Analyse sentiments et CSAT en temps réel",
      "Supervision et coaching : listening, whisper, barge",
      "Reporting avancé : Power BI nativement intégré",
      "Transcription et résumé appels automatique",
      "Intégration CRM flexible (D365, Salesforce, ServiceNow)",
      "Infrastructure Azure : 99.99% SLA, sécurité enterprise"
    ]),
    benefits: JSON.stringify([
      "Agents 30% plus productifs : Copilot réduit recherche d'information",
      "AHT (Average Handle Time) -25% via résumés et suggestions IA",
      "Self-service 24/7 : bots IA réduisent volume humain de 40%",
      "Flexible : fonctionne avec CRM existant (pas besoin de D365 Sales)",
      "Coûts telco réduits : PSTN natif Azure, pas besoin opérateur tiers"
    ]),
    useCases: JSON.stringify([
      { title: "Modernisation centre d'appels legacy", description: "Remplacement Avaya/Genesys on-prem par CCaaS cloud", industries: ["All"], businessImpact: "OPEX -35%, déploiement en semaines vs mois" },
      { title: "Support D365 Customer Service", description: "Extension omnicanale native à D365 CS Enterprise", industries: ["All"], businessImpact: "Routing IA + Copilot = expérience unifiée" }
    ]),
    targetIndustries: JSON.stringify(["Financial Services", "Telecom", "Retail", "Healthcare", "Government"]),
    idealCustomerSize: "Entreprises 50+ agents",
    targetPersonas: JSON.stringify(["Contact Center Director", "VP Customer Experience", "IT Director", "Operations Manager"]),
    pricingModel: "Subscription par utilisateur/mois + usage minutes",
    pricingTiers: JSON.stringify([
      { tier: "Digital Only", price: "$80/utilisateur/mois", bestFor: "Chat, email, digital (sans voix)" },
      { tier: "Voice + Digital", price: "$115/utilisateur/mois", bestFor: "Voix + digital + Copilot + IA complète" }
    ]),
    estimatedCost: "À partir de $80/utilisateur/mois",
    implementationTime: "8–16 semaines",
    complexity: "medium",
    salesPriority: 7,
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["contact center", "CCaaS", "centre appels", "omnicanal", "voix", "chat", "PSTN", "Copilot agent", "Genesys", "Avaya"]),
    tags: JSON.stringify(["Contact Center", "CCaaS", "Omnichannel", "Voice", "Copilot"])
  },

  // ─── COPILOT FOR SALES (M365) ────────────────────────────────────────────────
  {
    name: "copilot-for-sales",
    officialName: "Copilot for Sales (Microsoft 365)",
    category: "business",
    subcategory: "ai-sales-assistant",
    shortDescription: "IA commerciale dans Outlook, Teams et Word : capture CRM automatique, préparation réunions et emails de suivi.",
    fullDescription: "Copilot for Sales (anciennement Viva Sales) est un assistant IA commercial qui s'intègre à Microsoft 365 (Outlook, Teams, Word) et se connecte à n'importe quel CRM (D365 Sales, Salesforce). Il capture automatiquement les données CRM depuis les emails, suggère des contenus personnalisés, génère des résumés de réunions et enrichit les opportunités sans que le commercial quitte son email ou Teams.",
    keyFeatures: JSON.stringify([
      "Capture CRM automatique depuis Outlook (leads, contacts, activités)",
      "Résumés de réunions Teams avec actions CRM suggérées",
      "Emails de suivi générés IA basés sur contexte CRM",
      "Préparer des réunions : résumé compte, actualités, prochaines étapes",
      "Suggestions prix, disponibilités produits depuis CRM",
      "Connexion CRM : D365 Sales ET Salesforce natifs",
      "Fonctionne dans Outlook, Teams, Word",
      "Pipeline de vente rapide depuis Teams"
    ]),
    benefits: JSON.stringify([
      "2–3h économisées par commercial par semaine : zéro saisie CRM",
      "Taux adoption CRM x3 : saisie automatique depuis email",
      "Préparation réunions 10x plus rapide",
      "Rétention des données commerciales : tout capturé automatiquement",
      "Fonctionne avec Salesforce : pas besoin de migrer CRM"
    ]),
    useCases: JSON.stringify([
      { title: "Commerciaux en mobilité", description: "Capture emails/meetings dans CRM sans effort", industries: ["All"], businessImpact: "CRM data quality +80%, adoption +200%" },
      { title: "Account Management", description: "Vue 360° compte depuis Outlook avant chaque contact", industries: ["All"], businessImpact: "Préparation réunions -70% de temps" }
    ]),
    targetIndustries: JSON.stringify(["All"]),
    idealCustomerSize: "Toute équipe commerciale avec M365",
    targetPersonas: JSON.stringify(["Account Executive", "Sales Manager", "VP Sales", "Business Development"]),
    pricingModel: "Add-on Microsoft 365",
    pricingTiers: JSON.stringify([
      { tier: "Copilot for Sales", price: "$50/utilisateur/mois", bestFor: "Inclus dans M365 Copilot $30 + Copilot for Sales add-on" }
    ]),
    estimatedCost: "$50/utilisateur/mois (add-on M365)",
    implementationTime: "1–2 semaines",
    complexity: "low",
    salesPriority: 8,
    isActive: true,
    isFeatured: true,
    keywords: JSON.stringify(["copilot sales", "viva sales", "CRM capture", "Outlook CRM", "Teams CRM", "email IA", "commercial IA"]),
    tags: JSON.stringify(["Copilot", "Sales", "M365", "AI", "CRM", "Productivity"])
  }
];

async function main() {
  console.log('🚀 Seeding Dynamics 365 solutions...\n');
  let created = 0, updated = 0;

  for (const sol of solutions) {
    const result = await prisma.azureSolution.upsert({
      where: { name: sol.name },
      update: sol,
      create: sol,
    });
    const isNew = result.createdAt?.getTime() === result.updatedAt?.getTime();
    console.log((isNew ? '✅ Created' : '🔄 Updated') + ': ' + result.officialName);
    isNew ? created++ : updated++;
  }

  console.log(`\n🎉 Done! ${created} created, ${updated} updated.`);
  console.log(`📊 Total D365 solutions: ${solutions.length}`);
}

main()
  .catch(e => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
