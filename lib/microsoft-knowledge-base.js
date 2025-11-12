/**
 * Microsoft Solutions Knowledge Base
 * Comprehensive knowledge base for explaining Microsoft solutions in customer emails
 */

export const microsoftKnowledgeBase = {
  // Core Microsoft Solutions Categories
  categories: {
    cloud: {
      name: "Cloud & Infrastructure",
      icon: "☁️",
      description: "Solutions de migration et infrastructure cloud"
    },
    security: {
      name: "Sécurité & Compliance",
      icon: "🛡️",
      description: "Solutions de sécurité et conformité"
    },
    productivity: {
      name: "Productivité & Collaboration",
      icon: "📊",
      description: "Outils de collaboration et productivité"
    },
    analytics: {
      name: "Données & Analytics",
      icon: "📈",
      description: "Solutions d'analyse et intelligence artificielle"
    },
    development: {
      name: "Développement & DevOps",
      icon: "💻",
      description: "Outils de développement et CI/CD"
    },
    business: {
      name: "Applications Métier",
      icon: "🏢",
      description: "Solutions métier et ERP"
    }
  },

  // Detailed Solutions Database
  solutions: {
    // CLOUD & INFRASTRUCTURE
    "azure-migrate": {
      category: "cloud",
      name: "Azure Migrate",
      shortDescription: "Migration d'infrastructure vers le cloud",
      detailedDescription: "Service de migration complet qui évalue, planifie et exécute la migration de vos serveurs, applications et données vers Azure.",
      businessValue: [
        "Réduction des coûts d'infrastructure jusqu'à 40%",
        "Amélioration des performances et de la disponibilité",
        "Élimination des investissements matériels",
        "Accès à des technologies avancées"
      ],
      useCases: [
        "Modernisation du datacenter",
        "Consolidation d'infrastructures",
        "Préparation à la fermeture de datacenter",
        "Optimisation des coûts IT"
      ],
      targetAudience: ["DSI", "Directeur IT", "Responsable Infrastructure"],
      pricing: "Gratuit pour l'évaluation, coûts variables selon les ressources migrées",
      implementation: "4-12 semaines selon la complexité",
      competitors: ["AWS Migration Hub", "VMware Cloud"]
    },

    "azure-security-center": {
      category: "security",
      name: "Microsoft Defender for Cloud",
      shortDescription: "Protection cloud native unifiée",
      detailedDescription: "Plateforme de sécurité cloud native qui protège vos charges de travail dans Azure, AWS, Google Cloud et on-premises.",
      businessValue: [
        "Réduction de 70% du temps de détection des menaces",
        "Conformité réglementaire simplifiée",
        "Visibilité unifiée sur tous vos environnements",
        "Protection contre les cyberattaques avancées"
      ],
      useCases: [
        "Protection des applications cloud",
        "Conformité RGPD/ISO 27001",
        "Détection et réponse aux incidents",
        "Gestion de la posture de sécurité"
      ],
      targetAudience: ["RSSI", "Responsable Sécurité", "DSI"],
      pricing: "À partir de 15€/serveur/mois",
      implementation: "2-4 semaines",
      competitors: ["AWS Security Hub", "Palo Alto Prisma"]
    },

    "microsoft-365": {
      category: "productivity",
      name: "Microsoft 365",
      shortDescription: "Suite collaborative complète",
      detailedDescription: "Plateforme intégrée combinant Office, Teams, SharePoint et des outils de sécurité avancés pour la collaboration moderne.",
      businessValue: [
        "Augmentation de 25% de la productivité équipe",
        "Réduction de 60% des coûts de communication",
        "Collaboration en temps réel de n'importe où",
        "Sécurité enterprise intégrée"
      ],
      useCases: [
        "Travail hybride et télétravail",
        "Collaboration inter-équipes",
        "Gestion documentaire centralisée",
        "Communication unifiée"
      ],
      targetAudience: ["DRH", "Directeur Général", "DSI"],
      pricing: "À partir de 6€/utilisateur/mois",
      implementation: "2-6 semaines",
      competitors: ["Google Workspace", "Slack + alternatives"]
    },

    "power-platform": {
      category: "development",
      name: "Microsoft Power Platform",
      shortDescription: "Plateforme low-code/no-code",
      detailedDescription: "Suite d'outils permettant à tous de créer des applications, automatiser des processus et analyser des données sans programmation.",
      businessValue: [
        "Développement 5x plus rapide",
        "Démocratisation de la création d'apps",
        "ROI de 188% en 3 ans (étude Forrester)",
        "Intégration native avec Microsoft 365"
      ],
      useCases: [
        "Automatisation de processus métier",
        "Applications mobiles d'entreprise",
        "Tableaux de bord analytiques",
        "Formulaires et workflows"
      ],
      targetAudience: ["Métiers", "IT", "Directeur Opérationnel"],
      pricing: "À partir de 7€/utilisateur/mois",
      implementation: "1-8 semaines selon complexité",
      competitors: ["Salesforce Platform", "OutSystems"]
    },

    "azure-ai": {
      category: "analytics",
      name: "Azure AI Services",
      shortDescription: "Intelligence artificielle clé en main",
      detailedDescription: "Services IA préconstruits pour ajouter des capacités intelligentes à vos applications : vision, langage, recherche, décision.",
      businessValue: [
        "Amélioration de l'expérience client",
        "Automatisation des tâches répétitives",
        "Insights prédictifs sur les données",
        "Innovation sans expertise IA requise"
      ],
      useCases: [
        "Chatbots intelligents",
        "Analyse de documents",
        "Reconnaissance vocale/visuelle",
        "Personnalisation de contenu"
      ],
      targetAudience: ["Directeur Innovation", "DSI", "Directeur Marketing"],
      pricing: "Pay-as-you-use, à partir de quelques centimes par transaction",
      implementation: "2-12 semaines",
      competitors: ["AWS AI Services", "Google AI Platform"]
    },

    "dynamics-365": {
      category: "business",
      name: "Dynamics 365",
      shortDescription: "Suite CRM/ERP moderne",
      detailedDescription: "Applications métier connectées pour les ventes, service client, finance, opérations et resources humaines.",
      businessValue: [
        "Augmentation de 15% des ventes",
        "Réduction de 25% des coûts opérationnels",
        "Vision 360° du client",
        "Processus métier optimisés"
      ],
      useCases: [
        "Gestion de la relation client",
        "Automatisation des ventes",
        "Gestion financière",
        "Planification des ressources"
      ],
      targetAudience: ["Directeur Commercial", "DAF", "Directeur Général"],
      pricing: "À partir de 65€/utilisateur/mois",
      implementation: "3-9 mois selon modules",
      competitors: ["Salesforce", "SAP", "Oracle"]
    }
  },

  // Industry-specific solutions
  industries: {
    retail: {
      name: "Commerce & Retail",
      solutions: ["microsoft-365", "dynamics-365", "azure-ai"],
      specificBenefits: [
        "Expérience client omnicanal",
        "Gestion des stocks optimisée",
        "Personnalisation en temps réel"
      ]
    },
    manufacturing: {
      name: "Industrie & Manufacturing",
      solutions: ["azure-migrate", "azure-ai", "dynamics-365"],
      specificBenefits: [
        "Maintenance prédictive",
        "Optimisation de la chaîne de production",
        "Conformité qualité renforcée"
      ]
    },
    healthcare: {
      name: "Santé",
      solutions: ["azure-security-center", "microsoft-365", "azure-ai"],
      specificBenefits: [
        "Conformité RGPD/HDS",
        "Télémédecine sécurisée",
        "Analyse prédictive des soins"
      ]
    },
    finance: {
      name: "Services Financiers",
      solutions: ["azure-security-center", "dynamics-365", "power-platform"],
      specificBenefits: [
        "Conformité réglementaire",
        "Détection de fraude",
        "Expérience client digitale"
      ]
    }
  },

  // Company size specific approaches
  companyProfiles: {
    startup: {
      name: "Startup (1-50 employés)",
      prioritySolutions: ["microsoft-365", "power-platform", "azure-ai"],
      approach: "Croissance rapide et agilité",
      keyMessages: [
        "Solutions scalables qui grandissent avec vous",
        "Coûts maîtrisés et prévisibles",
        "Mise en place rapide"
      ]
    },
    sme: {
      name: "PME (50-500 employés)",
      prioritySolutions: ["azure-migrate", "microsoft-365", "dynamics-365", "azure-security-center"],
      approach: "Modernisation et efficacité opérationnelle",
      keyMessages: [
        "Transformation digitale accompagnée",
        "ROI mesurable et rapide",
        "Support dédié PME"
      ]
    },
    enterprise: {
      name: "Grande Entreprise (500+ employés)",
      prioritySolutions: ["azure-migrate", "azure-security-center", "dynamics-365", "azure-ai"],
      approach: "Innovation et avantage concurrentiel",
      keyMessages: [
        "Solutions enterprise-grade",
        "Innovation continue",
        "Partenariat stratégique"
      ]
    }
  },

  // Email generation helpers
  emailHelpers: {
    // Generate solution recommendations based on company profile
    getRecommendationsForProfile: (companySize, industry) => {
      const profile = microsoftKnowledgeBase.companyProfiles[companySize];
      const industryData = microsoftKnowledgeBase.industries[industry];

      if (!profile) return [];

      let recommendations = profile.prioritySolutions.map(solutionKey => {
        return microsoftKnowledgeBase.solutions[solutionKey];
      });

      // Add industry-specific solutions
      if (industryData) {
        industryData.solutions.forEach(solutionKey => {
          if (!recommendations.find(r => r.name === microsoftKnowledgeBase.solutions[solutionKey].name)) {
            recommendations.push(microsoftKnowledgeBase.solutions[solutionKey]);
          }
        });
      }

      return recommendations.slice(0, 3); // Top 3 recommendations
    },

    // Generate value proposition for specific audience
    getValueProposition: (solutionKey, targetRole) => {
      const solution = microsoftKnowledgeBase.solutions[solutionKey];
      if (!solution) return "";

      const roleMapping = {
        "DSI": "transformation technologique et réduction des coûts IT",
        "Directeur Général": "croissance business et avantage concurrentiel",
        "DAF": "optimisation financière et ROI mesurable",
        "DRH": "productivité des équipes et bien-être au travail",
        "Directeur Commercial": "augmentation des ventes et satisfaction client"
      };

      const focus = roleMapping[targetRole] || "transformation digitale";
      return `${solution.shortDescription} pour ${focus}`;
    },

    // Generate personalized email content
    generatePersonalizedContent: (companyInfo, targetRole, industryKey) => {
      const recommendations = microsoftKnowledgeBase.emailHelpers.getRecommendationsForProfile(
        companyInfo.size || 'sme',
        industryKey || 'retail'
      );

      const industry = microsoftKnowledgeBase.industries[industryKey];
      const profile = microsoftKnowledgeBase.companyProfiles[companyInfo.size || 'sme'];

      return {
        recommendations,
        industryBenefits: industry?.specificBenefits || [],
        approachMessage: profile?.approach || "transformation digitale",
        keyMessages: profile?.keyMessages || []
      };
    }
  }
};

// Utility functions for email generation
export const generateEmailContext = (companyData, recipientRole, industry) => {
  return microsoftKnowledgeBase.emailHelpers.generatePersonalizedContent(
    companyData,
    recipientRole,
    industry
  );
};

export const getSolutionDetails = (solutionKey) => {
  return microsoftKnowledgeBase.solutions[solutionKey];
};

export const getIndustryInsights = (industryKey) => {
  return microsoftKnowledgeBase.industries[industryKey];
};