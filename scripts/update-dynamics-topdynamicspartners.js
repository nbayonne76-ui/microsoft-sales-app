/**
 * Update Dynamics 365 solutions from topdynamicspartners.com data:
 * - Mark Guides & Remote Assist as end-of-life (EOL Dec 31, 2026)
 * - Add Dynamics 365 Fraud Protection (missing solution)
 */

const fs  = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/azure-solutions.json');
const data      = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const J         = (arr) => JSON.stringify(arr, null, 0);
const now       = new Date().toISOString();
const newId     = () => 'tdp' + Math.random().toString(36).slice(2, 14);

// ── 1. UPDATE existing solutions ──────────────────────────────────────────────

const UPDATES = {

  'Dynamics 365 Guides': {
    shortDescription: "⚠️ END OF SUPPORT December 31, 2026 : New subscriptions unavailable since November 1, 2025. Mixed reality step-by-step AR guides on HoloLens and mobile for manufacturing training and complex assembly.",
    shortDescriptionFr: "⚠️ FIN DE SUPPORT 31 décembre 2026 : Nouvelles souscriptions indisponibles depuis le 1er novembre 2025. Guides AR étape par étape en réalité mixte sur HoloLens et mobile pour la formation industrielle.",
    salesContext: "CRITICAL: End of support December 31, 2026. New subscriptions closed November 1, 2025. Existing customers must migrate before end of 2026. Recommend transitioning to Field Service + Teams for remote collaboration.",
    tags: JSON.stringify(["Mixed Reality", "HoloLens", "Training", "Manufacturing", "EOL-2026"]),
    isActive: false,
    updatedAt: now,
  },

  'Dynamics 365 Remote Assist': {
    shortDescription: "⚠️ END OF SUPPORT December 31, 2026 : New subscriptions unavailable since November 1, 2025. Live video collaboration with AR annotations for remote expert guidance on HoloLens.",
    shortDescriptionFr: "⚠️ FIN DE SUPPORT 31 décembre 2026 : Nouvelles souscriptions indisponibles depuis le 1er novembre 2025. Collaboration vidéo en direct avec annotations AR pour le guidage d'experts à distance sur HoloLens.",
    salesContext: "CRITICAL: End of support December 31, 2026. New subscriptions closed November 1, 2025. Recommend Teams for video collaboration + Field Service for field coordination as replacement.",
    tags: JSON.stringify(["Mixed Reality", "HoloLens", "Remote Support", "Field Service", "EOL-2026"]),
    isActive: false,
    updatedAt: now,
  },

  'Dynamics 365 Business Central': {
    salesContext: "Key migration opportunity: Dynamics GP new licenses closed April 1, 2026 : GP customers must migrate before December 31, 2029. Business Central covers 80%+ of GP functionality with cloud AI. Target: SMBs 50–500 employees. Pitch vs GP: cloud-native, AI agents (Sales Order, Payables, Expense), M365 integration, no server maintenance. TCO Year 1 for 100 users: $170K–$370K. Faster than SAP/Oracle at this size.",
    updatedAt: now,
  },

  'Dynamics 365 Finance': {
    salesContext: "License enforcement started January 2026 : Microsoft now uses telemetry to detect unlicensed usage. Retroactive billing possible. Use this as entry point: offer a license audit. Attach license saves $300K–$500K/year for 100+ users combining Finance+SCM+Sales. Target 150+ users for best ROI. TCO 5-year vs SAP S/4HANA: $7.7M–$8.7M vs $7.5M–$10M : comparable cost with faster implementation (6–12 months vs 12–24 for SAP). January 2026 enforcement is a sales trigger for optimization conversations.",
    updatedAt: now,
  },

  'Dynamics 365 Supply Chain Management': {
    salesContext: "Attach licensing saves massively: Finance+SCM together = $240/user vs $420 separately. For 100 users that's $180K/year saved. License enforcement January 2026 : excellent audit opportunity. 5-year TCO vs SAP S/4HANA: $7.7M–$8.7M vs $7.5M–$10M but with faster implementation. Target: manufacturers, distributors 300+ employees. Key differentiator: Copilot and AI agents natively integrated : no separate AI platform needed.",
    updatedAt: now,
  },

  'Dynamics 365 Sales': {
    salesContext: "Three tiers for different needs: Professional (pipeline basics), Enterprise (omnichannel, AI scoring, call recording), Premium (full AI agents). Attach licensing: Sales+Customer Service = $105+$20 vs $210 separately. Key migration pitch for Salesforce customers: native Teams/Outlook/LinkedIn integration vs third-party connectors. License enforcement January 2026 : use as conversation starter for audit. CRM-only deployments: 2–4 months, $50K–$150K implementation.",
    updatedAt: now,
  },

};

// ── 2. NEW SOLUTIONS ──────────────────────────────────────────────────────────

const NEW_SOLUTIONS = [
  {
    id: newId(),
    createdAt: now,
    updatedAt: now,
    name: 'd365-fraud-protection',
    officialName: 'Dynamics 365 Fraud Protection',
    category: 'business',
    subcategory: 'security-fraud',
    shortDescription: "Real-time AI-powered fraud prevention for e-commerce, retail, and financial services : transaction risk scoring, account fraud detection, and payment fraud prevention using machine learning.",
    shortDescriptionFr: "Prévention des fraudes en temps réel par IA pour l'e-commerce, le retail et les services financiers : scoring du risque transactionnel, détection des fraudes compte et prévention des fraudes de paiement par machine learning.",
    fullDescription: "Dynamics 365 Fraud Protection is a consumption-based AI fraud prevention solution targeting e-commerce, retail, financial services, and payment processors. It provides real-time transaction risk assessment using machine learning models that can be customized to each organization's fraud patterns. Core capabilities include: purchase protection (real-time scoring of e-commerce transactions for fraud indicators), account protection (detection of account takeover attempts, fake account creation, and suspicious login patterns), and loss prevention (in-store return fraud, employee misconduct, inventory theft detection). Device fingerprinting identifies suspicious devices across networks. The solution uses a global network of fraud intelligence across Microsoft's customer base to improve detection rates. Consumption-based pricing ($500–$2,000+/month depending on transaction volume) makes it accessible to mid-market companies without enterprise budgets. Key differentiator: leverages Microsoft's massive e-commerce and payments network for superior fraud signal accuracy.",
    fullDescriptionFr: "Dynamics 365 Fraud Protection est une solution de prévention des fraudes par IA à la consommation ciblant l'e-commerce, le retail, les services financiers et les processeurs de paiement. Elle fournit une évaluation du risque transactionnel en temps réel via des modèles de machine learning personnalisables. Capacités principales : protection des achats (scoring en temps réel des transactions e-commerce), protection des comptes (détection des tentatives de prise de contrôle, création de faux comptes, patterns de connexion suspects), et prévention des pertes (fraude au retour en magasin, actes malveillants des employés, vol de stocks). Le fingerprinting des appareils identifie les devices suspects. La tarification à la consommation ($500–$2 000+/mois selon le volume) la rend accessible aux ETI. Différenciateur clé : exploite le réseau de fraude mondial de Microsoft pour une précision de détection supérieure.",
    keyFeaturesEn: J([
      "Purchase protection: real-time AI scoring of e-commerce transactions for fraud indicators",
      "Account protection: detection of account takeover, fake account creation, suspicious logins",
      "Loss prevention: in-store return fraud, employee misconduct, inventory theft detection",
      "Device fingerprinting: identifies suspicious devices across transaction networks",
      "Machine learning customization: adapt models to organization-specific fraud patterns",
      "Global fraud intelligence network: leverages Microsoft's cross-customer fraud signals",
      "Real-time API integration: embeds into checkout flows and account management systems",
      "Consumption-based pricing: scales with transaction volume without per-user costs",
      "Reporting and analytics: fraud trends, false positive rates, rule performance"
    ]),
    keyFeatures: J([
      "Protection des achats : scoring IA en temps réel des transactions e-commerce",
      "Protection des comptes : détection de prise de contrôle, faux comptes, connexions suspectes",
      "Prévention des pertes : fraude au retour, malveillance employés, vol de stocks",
      "Fingerprinting des appareils : identification des devices suspects",
      "Personnalisation ML : adaptation des modèles aux patterns de fraude spécifiques",
      "Réseau d'intelligence fraude mondial : signaux cross-clients Microsoft",
      "Intégration API temps réel : s'embarque dans les flux de paiement et gestion de comptes",
      "Tarification à la consommation : évolue avec le volume sans coûts par utilisateur",
      "Reporting et analytique : tendances fraude, taux de faux positifs, performances des règles"
    ]),
    benefitsEn: J([
      "Reduced fraud losses without adding friction to legitimate customer purchases",
      "Lower false positive rates vs rule-based systems : fewer blocked good customers",
      "Real-time scoring keeps pace with transaction velocity at peak times",
      "Customizable ML models adapt to evolving fraud patterns",
      "Consumption-based pricing aligns cost with transaction volume",
      "Leverages Microsoft's global fraud network for superior detection accuracy",
      "Protects multiple fraud vectors: transactions, accounts, in-store losses"
    ]),
    benefits: J([
      "Réduction des pertes de fraude sans friction sur les achats légitimes",
      "Moins de faux positifs vs les systèmes basés sur des règles",
      "Scoring temps réel adapté aux pics de transactions",
      "Modèles ML personnalisables pour s'adapter aux nouvelles fraudes",
      "Tarification à la consommation alignée sur le volume",
      "Réseau mondial Microsoft pour une détection supérieure",
      "Protection multi-vecteurs : transactions, comptes, pertes en magasin"
    ]),
    targetIndustries: JSON.stringify(["E-Commerce", "Retail", "Financial Services", "Payment Processors", "Gaming", "Digital Goods"]),
    idealCustomerSize: "ETI et Grands Comptes avec volume transactionnel significatif",
    idealCustomerSizeEn: "Mid-market to enterprise with significant transaction volumes",
    targetPersonas: JSON.stringify(["CFO", "CISO", "E-Commerce Director", "Risk Manager", "Payment Operations"]),
    pricingModel: "Consommation : basé sur le volume de transactions",
    estimatedCost: "Variable selon le volume transactionnel : contacter Microsoft",
    estimatedCostEn: "Consumption-based : varies by transaction volume : contact Microsoft",
    implementationTime: "2–6 semaines (intégration API)",
    implementationTimeEn: "2–6 weeks (API integration)",
    complexity: "Medium",
    prerequisites: JSON.stringify(["Azure subscription", "E-commerce or payment processing platform"]),
    integrations: JSON.stringify(["Dynamics 365 Commerce", "Dynamics 365 Customer Service", "Azure", "Third-party e-commerce platforms", "Payment gateways"]),
    competitorComparison: "Competing with Signifyd, Forter, Kount (Equifax), and Stripe Radar. D365 Fraud Protection differentiates through Microsoft's global transaction network size, native integration with Dynamics 365 Commerce, and ML customization. Pricing is consumption-based like Signifyd but with broader account and in-store protection.",
    salesPriority: "Medium",
    isActive: true,
    isFeatured: false,
    keywords: JSON.stringify(["fraud", "fraude", "fraud protection", "transaction risk", "account protection", "chargeback", "e-commerce security"]),
    tags: JSON.stringify(["Fraud Prevention", "AI", "Machine Learning", "E-Commerce", "Security", "Payments"]),
    relatedSolutions: JSON.stringify(["Dynamics 365 Commerce", "Dynamics 365 Customer Service", "Microsoft Defender"]),
    technicalSpecs: JSON.stringify({ api: "REST API", deployment: "Cloud", integration: "API-first" }),
    securityFeatures: JSON.stringify(["Real-time ML scoring", "Device fingerprinting", "Network fraud intelligence", "ISO 27001"]),
    complianceCerts: JSON.stringify(["PCI DSS", "ISO 27001", "SOC 2", "GDPR"]),
    documentationUrl: "https://learn.microsoft.com/en-us/dynamics365/fraud-protection/",
    pricingUrl: "https://www.microsoft.com/en-us/dynamics-365/products/fraud-protection",
    demoUrl: "",
    caseStudyUrls: JSON.stringify([]),
    competitors: JSON.stringify(["Signifyd", "Forter", "Kount (Equifax)", "Stripe Radar", "Riskified"]),
    customerCases: JSON.stringify([]),
    marketPosition: "Microsoft-native fraud prevention leveraging global transaction network across all Microsoft e-commerce customers",
    salesContext: "Target e-commerce and retail customers with Dynamics 365 Commerce : natural upsell for fraud protection. Also pitch to any organization processing online payments facing chargeback problems. Consumption-based pricing = low barrier to entry. Key pitch: Microsoft's global fraud network gives superior detection accuracy because it sees fraud patterns across thousands of e-commerce sites simultaneously.",
    sellingScenarios: JSON.stringify([
      "E-commerce retailer losing revenue to chargebacks : real-time scoring stops fraud before it happens",
      "Financial services firm facing account takeover attacks : Account Protection detects suspicious logins",
      "Retailer with high in-store return fraud : Loss Prevention module identifies abuse patterns"
    ]),
    useCases: JSON.stringify(["Prévention des chargebacks e-commerce", "Protection contre la prise de contrôle de comptes", "Détection de la fraude au retour en magasin", "Scoring de risque transactionnel temps réel"]),
    useCasesEn: JSON.stringify(["E-commerce chargeback prevention", "Account takeover protection", "In-store return fraud detection", "Real-time transaction risk scoring"]),
    marketPosition: "Microsoft-native fraud prevention with global cross-customer fraud intelligence network",
  },
];

// ── Apply updates ─────────────────────────────────────────────────────────────

let updated = 0;
for (const item of data) {
  const patch = UPDATES[item.officialName];
  if (!patch) continue;
  Object.assign(item, patch);
  updated++;
  console.log(`✅ Updated: ${item.officialName}`);
}

let added = 0;
for (const sol of NEW_SOLUTIONS) {
  const existingIdx = data.findIndex(d => d.officialName === sol.officialName);
  if (existingIdx >= 0) {
    // Enrich existing with new fields from topdynamicspartners
    Object.assign(data[existingIdx], {
      competitors: sol.competitors,
      salesContext: sol.salesContext,
      sellingScenarios: sol.sellingScenarios,
      competitorComparison: sol.competitorComparison,
      updatedAt: now,
    });
    console.log(`✏️  Enriched: ${sol.officialName}`);
    updated++;
    continue;
  }
  data.push(sol);
  added++;
  console.log(`➕ Added: ${sol.officialName}`);
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
console.log(`\n✅ Done : ${updated} updated, ${added} added. Total: ${data.length} solutions.`);
