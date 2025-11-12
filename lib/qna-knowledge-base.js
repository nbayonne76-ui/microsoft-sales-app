/**
 * QnA Knowledge Base - Microsoft Solutions
 * Comprehensive question-and-answer support for Microsoft products and services
 * Integrated with Azure Cognitive Services QnA Maker patterns
 */

export class QnAKnowledgeBase {
  constructor() {
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.searchIndex = this.buildSearchIndex();
  }

  initializeKnowledgeBase() {
    return {
      // Azure Cloud Solutions
      azure: {
        category: "Azure Cloud Solutions",
        icon: "☁️",
        qaList: [
          {
            id: "azure_migration_001",
            question: "Comment migrer vers Azure ?",
            alternateQuestions: [
              "Migration vers Azure",
              "Étapes migration cloud Azure",
              "Comment passer au cloud Azure",
              "Processus migration Azure"
            ],
            answer: `**Migration vers Azure - Guide complet**

🎯 **Étapes principales :**
1. **Évaluation** - Audit de votre infrastructure existante
2. **Planification** - Stratégie de migration adaptée
3. **Migration** - Transfert progressif ou complet
4. **Optimisation** - Performance et coûts

☁️ **Services clés :**
• **Azure Migrate** - Outils d'évaluation et migration
• **Azure Site Recovery** - Réplication et basculement
• **Azure Database Migration** - Bases de données
• **Azure App Service** - Applications web

💡 **Approches recommandées :**
• **Lift-and-shift** - Migration rapide sans modification
• **Re-platforming** - Optimisation cloud native
• **Refactoring** - Modernisation complète

📞 **Support disponible** - Accompagnement personnalisé gratuit`,
            confidence: 0.95,
            context: ["migration", "cloud", "infrastructure"],
            category: "azure",
            tags: ["migration", "cloud", "infrastructure", "azure migrate"]
          },
          {
            id: "azure_costs_001",
            question: "Combien coûte Azure ?",
            alternateQuestions: [
              "Prix Azure",
              "Tarifs Azure",
              "Coût migration Azure",
              "Budget Azure",
              "Azure pricing"
            ],
            answer: `**Tarification Azure - Transparent et flexible**

💰 **Modèle Pay-as-you-use :**
• Vous payez uniquement ce que vous consommez
• Pas d'engagement minimum
• Arrêt de facturation à l'arrêt des services

🎯 **Optimisation des coûts :**
• **Reserved Instances** - Jusqu'à 72% d'économies
• **Azure Hybrid Benefit** - Valorisation licences existantes
• **Spot VMs** - Jusqu'à 90% moins cher
• **Auto-scaling** - Ajustement automatique

📊 **Outils de gestion :**
• **Azure Cost Management** - Suivi en temps réel
• **Budgets et alertes** - Contrôle proactif
• **Azure Advisor** - Recommandations d'optimisation

💡 **Calcul personnalisé :**
Calculateur en ligne gratuit pour estimation précise selon vos besoins

🎁 **Crédit de démarrage** - 200€ offerts pour tester`,
            confidence: 0.92,
            context: ["coût", "prix", "tarif", "budget"],
            category: "azure",
            tags: ["pricing", "cost", "budget", "economics"]
          },
          {
            id: "azure_security_001",
            question: "Azure est-il sécurisé ?",
            alternateQuestions: [
              "Sécurité Azure",
              "Azure secure",
              "Protection données Azure",
              "Conformité Azure",
              "Sécurité cloud Azure"
            ],
            answer: `**Sécurité Azure - Excellence mondiale**

🛡️ **Protection multicouche :**
• **Chiffrement** - Données en transit et au repos
• **Authentification** - Multi-facteurs et identité
• **Réseau** - Firewall et protection DDoS
• **Surveillance** - Détection d'intrusion 24/7

🏆 **Certifications :**
• **ISO 27001, 27018** - Standards internationaux
• **SOC 1, 2, 3** - Auditabilité
• **RGPD** - Conformité européenne
• **HDS** - Hébergement données de santé

🌍 **Centres de données :**
• Plus de 60 régions mondiales
• Redondance géographique
• Souveraineté des données garantie

🔐 **Services de sécurité intégrés :**
• **Azure Security Center** - Monitoring unifié
• **Azure Sentinel** - SIEM intelligent
• **Key Vault** - Gestion des secrets
• **Azure AD** - Gestion d'identité

✅ **Conformité réglementaire automatique**`,
            confidence: 0.93,
            context: ["sécurité", "protection", "conformité"],
            category: "azure",
            tags: ["security", "compliance", "protection", "certification"]
          }
        ]
      },

      // Microsoft 365
      microsoft365: {
        category: "Microsoft 365",
        icon: "📧",
        qaList: [
          {
            id: "m365_features_001",
            question: "Qu'est-ce que Microsoft 365 ?",
            alternateQuestions: [
              "Microsoft 365 c'est quoi",
              "Office 365 vs Microsoft 365",
              "Contenu Microsoft 365",
              "Services Microsoft 365"
            ],
            answer: `**Microsoft 365 - Suite complète de productivité**

🎯 **Contenu principal :**
• **Applications Office** - Word, Excel, PowerPoint, Outlook
• **Teams** - Collaboration et visioconférence
• **OneDrive** - Stockage cloud sécurisé
• **SharePoint** - Partage et collaboration
• **Exchange Online** - Messagerie professionnelle

☁️ **Avantages cloud :**
• Accès depuis n'importe où
• Mises à jour automatiques
• Synchronisation multi-appareils
• Sauvegardes automatiques

🛡️ **Sécurité intégrée :**
• Protection anti-malware
• Chiffrement avancé
• Authentification multi-facteurs
• Conformité réglementaire

📱 **Multi-plateforme :**
• Windows, Mac, iOS, Android
• Applications mobiles natives
• Interface web complète

💼 **Formules adaptées :**
Business Basic, Standard, Premium selon vos besoins`,
            confidence: 0.95,
            context: ["microsoft 365", "office", "productivité"],
            category: "microsoft365",
            tags: ["office", "productivity", "collaboration", "cloud"]
          },
          {
            id: "m365_migration_001",
            question: "Comment migrer vers Microsoft 365 ?",
            alternateQuestions: [
              "Migration Office 365",
              "Passer à Microsoft 365",
              "Migration Exchange vers Office 365",
              "Migrer messagerie Office 365"
            ],
            answer: `**Migration Microsoft 365 - Processus simplifié**

📋 **Étapes de migration :**
1. **Audit** - Évaluation infrastructure actuelle
2. **Planification** - Stratégie de migration
3. **Préparation** - Configuration domaines et DNS
4. **Migration** - Transfert progressif des données
5. **Formation** - Accompagnement utilisateurs

📧 **Migration messagerie :**
• **IMAP** - Depuis tout système de messagerie
• **Exchange hybride** - Coexistence temporaire
• **PST Import** - Fichiers locaux Outlook
• **G Suite** - Migration depuis Google

🔄 **Types de migration :**
• **Cutover** - Migration complète rapide (<150 users)
• **Staged** - Migration par étapes (>150 users)
• **Hybrid** - Coexistence Exchange/Office 365

⚡ **Services inclus :**
• Migration des emails et calendriers
• Configuration automatique Outlook
• Formation utilisateurs
• Support post-migration

🎯 **Zéro interruption de service garantie**`,
            confidence: 0.94,
            context: ["migration", "office 365", "messagerie"],
            category: "microsoft365",
            tags: ["migration", "exchange", "email", "implementation"]
          }
        ]
      },

      // Microsoft Teams
      teams: {
        category: "Microsoft Teams",
        icon: "🤝",
        qaList: [
          {
            id: "teams_features_001",
            question: "Quelles sont les fonctionnalités de Teams ?",
            alternateQuestions: [
              "Teams fonctionnalités",
              "Que peut faire Teams",
              "Microsoft Teams capacités",
              "Teams vs Skype"
            ],
            answer: `**Microsoft Teams - Hub de collaboration moderne**

💬 **Communication :**
• **Chat** - Messages instantanés et groupes
• **Appels** - Audio/vidéo HD
• **Réunions** - Jusqu'à 1000 participants
• **Webinaires** - Événements en direct

📁 **Collaboration :**
• **Partage de fichiers** - OneDrive et SharePoint intégrés
• **Co-édition** - Travail simultané sur documents
• **Tableaux blancs** - Brainstorming interactif
• **Applications** - Plus de 700 intégrations

🎯 **Organisation :**
• **Équipes et canaux** - Structure claire
• **Planificateur** - Gestion de tâches
• **OneNote** - Prise de notes partagée
• **Wiki** - Base de connaissances

🔐 **Sécurité :**
• Chiffrement bout en bout
• Conformité réglementaire
• Gestion des permissions
• Audit et rapports

📱 **Disponibilité :**
Desktop, mobile, web - synchronisation parfaite`,
            confidence: 0.96,
            context: ["teams", "collaboration", "communication"],
            category: "teams",
            tags: ["collaboration", "communication", "meetings", "chat"]
          },
          {
            id: "teams_vs_zoom_001",
            question: "Teams vs Zoom, quelle différence ?",
            alternateQuestions: [
              "Teams ou Zoom",
              "Comparaison Teams Zoom",
              "Avantages Teams vs Zoom",
              "Teams better than Zoom"
            ],
            answer: `**Teams vs Zoom - Comparaison détaillée**

🏆 **Avantages Microsoft Teams :**

💼 **Intégration complète :**
• Suite Office 365 native
• SharePoint et OneDrive intégrés
• Une seule connexion (SSO)
• Facturation unifiée

🔐 **Sécurité enterprise :**
• Conformité réglementaire avancée
• Chiffrement Microsoft-grade
• Gestion identité Azure AD
• Contrôles administrateur étendus

💰 **Coût total :**
• Inclus dans Microsoft 365
• Pas de surcoût fonctionnalités
• Stockage illimité
• Support Microsoft

⚡ **Fonctionnalités avancées :**
• Chat persistant par projet
• Co-édition temps réel
• Applications tierces intégrées
• Téléphonie d'entreprise

🎯 **Zoom - Points forts :**
• Interface plus simple
• Qualité vidéo excellent
• Adoption rapide

💡 **Recommandation :** Teams pour écosystème Microsoft`,
            confidence: 0.91,
            context: ["teams", "zoom", "comparaison"],
            category: "teams",
            tags: ["comparison", "zoom", "collaboration", "meetings"]
          }
        ]
      },

      // Power Platform
      power: {
        category: "Power Platform",
        icon: "⚡",
        qaList: [
          {
            id: "power_platform_001",
            question: "Qu'est-ce que Power Platform ?",
            alternateQuestions: [
              "Power Platform Microsoft",
              "PowerApps PowerBI",
              "Low code Microsoft",
              "Automation Microsoft"
            ],
            answer: `**Power Platform - Plateforme low-code Microsoft**

🎯 **4 composants principaux :**

⚡ **Power Apps** - Applications métier
• Création d'apps sans code
• Interface drag-and-drop
• Connexion données multiples
• Mobile et desktop natif

📊 **Power BI** - Business Intelligence
• Tableaux de bord interactifs
• Analyse de données avancée
• Rapports automatisés
• Intelligence artificielle intégrée

🔄 **Power Automate** - Automatisation
• Workflows entre applications
• 400+ connecteurs disponibles
• Déclencheurs intelligents
• RPA (Robotic Process Automation)

🤖 **Power Virtual Agents** - Chatbots
• Création de bots conversationnels
• IA intégrée
• Intégration Teams native
• Analytics avancées

💡 **Avantages business :**
• Réduction délais développement
• Démocratisation de l'IT
• ROI rapide et mesurable
• Gouvernance centralisée`,
            confidence: 0.94,
            context: ["power platform", "low-code", "automation"],
            category: "power",
            tags: ["low-code", "automation", "powerbi", "powerapps"]
          }
        ]
      },

      // Dynamics 365
      dynamics: {
        category: "Dynamics 365",
        icon: "💼",
        qaList: [
          {
            id: "dynamics_crm_001",
            question: "Qu'est-ce que Dynamics 365 ?",
            alternateQuestions: [
              "Dynamics 365 CRM",
              "Microsoft CRM",
              "Dynamics 365 ERP",
              "Solution gestion client Microsoft"
            ],
            answer: `**Dynamics 365 - CRM/ERP intelligent**

🎯 **Applications métier intégrées :**

💼 **Sales** - Gestion commerciale
• Pipeline et opportunités
• Prévisions IA
• Automatisation ventes
• Mobile first

🤝 **Customer Service** - Service client
• Gestion des cas
• Base de connaissances
• Chat et téléphonie
• Self-service portals

📈 **Marketing** - Marketing automation
• Campagnes multi-canaux
• Lead scoring intelligent
• Personnalisation IA
• Analytics ROI

💰 **Finance & Operations** - ERP
• Comptabilité et finance
• Supply chain
• Manufacturing
• Gestion de projet

🔗 **Intégration native :**
• Office 365 et Teams
• Power Platform
• Azure AI services
• Connecteurs 300+

☁️ **Cloud-first avec IA intégrée**`,
            confidence: 0.93,
            context: ["dynamics", "crm", "erp"],
            category: "dynamics",
            tags: ["crm", "erp", "sales", "customer-service"]
          }
        ]
      },

      // Security & Compliance
      security: {
        category: "Sécurité & Conformité",
        icon: "🔐",
        qaList: [
          {
            id: "security_overview_001",
            question: "Comment Microsoft protège mes données ?",
            alternateQuestions: [
              "Sécurité Microsoft",
              "Protection données Microsoft",
              "RGPD Microsoft",
              "Conformité Microsoft"
            ],
            answer: `**Sécurité Microsoft - Protection de niveau enterprise**

🛡️ **Architecture Zero Trust :**
• Vérification continue identité
• Accès conditionnel intelligent
• Principe du moindre privilège
• Surveillance comportementale

🔐 **Protection des données :**
• **Chiffrement** - AES 256 bits minimum
• **Classification** - Étiquetage automatique
• **DLP** - Prévention perte de données
• **Rights Management** - Contrôle d'accès

📋 **Conformité réglementaire :**
• **RGPD** - Conformité européenne
• **ISO 27001/27018** - Standards internationaux
• **SOC 1/2/3** - Audits de sécurité
• **HDS** - Données de santé France

🌍 **Résidence des données :**
• Centres de données européens
• Souveraineté garantie
• Pas de transfert hors UE
• Contrôle géolocalisation

🎯 **Services de sécurité :**
• Azure AD - Gestion identité
• Defender 365 - Protection avancée
• Sentinel - SIEM intelligent
• Information Protection - Classification

✅ **Investissement : 1 milliard $/an en sécurité**`,
            confidence: 0.96,
            context: ["sécurité", "protection", "rgpd"],
            category: "security",
            tags: ["security", "compliance", "gdpr", "protection"]
          }
        ]
      },

      // General FAQ
      general: {
        category: "Questions Générales",
        icon: "❓",
        qaList: [
          {
            id: "support_001",
            question: "Quel support Microsoft propose-t-il ?",
            alternateQuestions: [
              "Support Microsoft",
              "Aide Microsoft",
              "Formation Microsoft",
              "Support technique Microsoft"
            ],
            answer: `**Support Microsoft - Accompagnement complet**

🎯 **Niveaux de support :**

📞 **Support technique :**
• **Basic** - Documentation et communauté
• **Professional** - Support par incident
• **Premier** - Support proactif 24/7
• **Unified** - Support unifié tous produits

📚 **Formation et certification :**
• **Microsoft Learn** - Parcours gratuits
• **Certifications** - Reconnaissance expertise
• **Workshops** - Formation pratique
• **Virtual Training Days** - Sessions gratuites

🤝 **Accompagnement projet :**
• **FastTrack** - Migration assistée gratuite
• **Solution Architects** - Expertise technique
• **Customer Success** - Suivi ROI
• **Partner ecosystem** - Réseau certifié

💡 **Ressources disponibles :**
• Centre d'administration unifié
• Outils de diagnostic automatique
• Base de connaissances étendue
• Communauté d'experts actifs

🚀 **Support spécialisé par industrie**`,
            confidence: 0.92,
            context: ["support", "formation", "aide"],
            category: "general",
            tags: ["support", "training", "help", "assistance"]
          },
          {
            id: "licensing_001",
            question: "Comment fonctionnent les licences Microsoft ?",
            alternateQuestions: [
              "Licences Microsoft",
              "Licensing Microsoft",
              "Types licences Microsoft",
              "CSP Microsoft"
            ],
            answer: `**Licencing Microsoft - Modèles flexibles**

💼 **Types de licences :**

☁️ **Cloud (recommandé) :**
• **CSP** - Cloud Solution Provider
• **EA** - Enterprise Agreement
• **SPLA** - Service Provider License
• **Pay-as-you-go** - Paiement à l'usage

🏢 **On-premises :**
• **Volume Licensing** - Entreprises
• **OEM** - Avec nouveau matériel
• **Retail** - Achat unitaire

🔄 **Hybrid Rights :**
• **Azure Hybrid Benefit** - Valorisation licences
• **SQL Server** - Portabilité cloud
• **Windows Server** - Usage dual

📊 **Avantages CSP :**
• Facturation unifiée mensuelle
• Gestion centralisée admin
• Support partenaire dédié
• Flexibilité montée/descente

💡 **Optimisation licensing :**
• Audit gratuit utilisation
• Recommandations personnalisées
• Consolidation possible
• ROI measurement

🎯 **Un seul interlocuteur pour tout**`,
            confidence: 0.89,
            context: ["licence", "licensing", "csp"],
            category: "general",
            tags: ["licensing", "csp", "enterprise", "pricing"]
          }
        ]
      }
    };
  }

  buildSearchIndex() {
    const index = new Map();

    for (const [categoryKey, category] of Object.entries(this.knowledgeBase)) {
      for (const qa of category.qaList) {
        // Index by question
        this.addToIndex(index, qa.question, qa);

        // Index by alternate questions
        qa.alternateQuestions.forEach(altQ => {
          this.addToIndex(index, altQ, qa);
        });

        // Index by tags
        qa.tags.forEach(tag => {
          this.addToIndex(index, tag, qa);
        });

        // Index by context keywords
        qa.context.forEach(keyword => {
          this.addToIndex(index, keyword, qa);
        });
      }
    }

    return index;
  }

  addToIndex(index, key, qa) {
    const normalizedKey = key.toLowerCase().trim();
    if (!index.has(normalizedKey)) {
      index.set(normalizedKey, []);
    }
    index.get(normalizedKey).push(qa);
  }

  /**
   * Find answers using advanced search
   */
  findAnswers(query, maxResults = 5) {
    const normalizedQuery = query.toLowerCase().trim();
    const words = normalizedQuery.split(/\s+/);
    const results = new Map();

    // 1. Exact phrase matching (highest score)
    for (const [key, qaList] of this.searchIndex.entries()) {
      if (key.includes(normalizedQuery)) {
        qaList.forEach(qa => {
          const score = this.calculateRelevanceScore(qa, normalizedQuery, 1.0);
          this.addResult(results, qa, score);
        });
      }
    }

    // 2. Individual word matching
    words.forEach(word => {
      if (word.length > 2) { // Skip very short words
        for (const [key, qaList] of this.searchIndex.entries()) {
          if (key.includes(word)) {
            qaList.forEach(qa => {
              const score = this.calculateRelevanceScore(qa, word, 0.7);
              this.addResult(results, qa, score);
            });
          }
        }
      }
    });

    // 3. Fuzzy matching for typos
    if (results.size < 3) {
      for (const [key, qaList] of this.searchIndex.entries()) {
        const similarity = this.calculateStringSimilarity(normalizedQuery, key);
        if (similarity > 0.6) {
          qaList.forEach(qa => {
            const score = this.calculateRelevanceScore(qa, normalizedQuery, similarity * 0.5);
            this.addResult(results, qa, score);
          });
        }
      }
    }

    // Convert to array and sort by relevance
    return Array.from(results.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  addResult(results, qa, score) {
    if (results.has(qa.id)) {
      // Boost existing result
      results.get(qa.id).relevanceScore = Math.max(results.get(qa.id).relevanceScore, score);
    } else {
      results.set(qa.id, { ...qa, relevanceScore: score });
    }
  }

  calculateRelevanceScore(qa, query, baseScore) {
    let score = baseScore;

    // Boost based on confidence
    score *= qa.confidence;

    // Boost if query matches category
    if (query.includes(qa.category)) {
      score *= 1.2;
    }

    // Boost popular/important topics
    const importantTopics = ['azure', 'migration', 'sécurité', 'teams', 'office'];
    if (importantTopics.some(topic => query.includes(topic))) {
      score *= 1.1;
    }

    return Math.min(score, 1.0);
  }

  calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Get random FAQ suggestions
   */
  getRandomSuggestions(count = 4) {
    const allQAs = [];

    for (const category of Object.values(this.knowledgeBase)) {
      allQAs.push(...category.qaList);
    }

    const shuffled = allQAs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(qa => ({
      question: qa.question,
      category: qa.category,
      icon: this.knowledgeBase[qa.category]?.icon || "❓"
    }));
  }

  /**
   * Get category-specific suggestions
   */
  getCategorySuggestions(categoryKey, count = 3) {
    const category = this.knowledgeBase[categoryKey];
    if (!category) return [];

    return category.qaList.slice(0, count).map(qa => ({
      question: qa.question,
      answer: qa.answer.substring(0, 200) + "...",
      confidence: qa.confidence
    }));
  }

  /**
   * Get all categories for navigation
   */
  getCategories() {
    return Object.entries(this.knowledgeBase).map(([key, category]) => ({
      key,
      name: category.category,
      icon: category.icon,
      count: category.qaList.length
    }));
  }

  /**
   * Analyze query and suggest related topics
   */
  getRelatedTopics(query) {
    const results = this.findAnswers(query, 10);
    const relatedCategories = new Set();
    const relatedTags = new Set();

    results.forEach(result => {
      relatedCategories.add(result.category);
      result.tags.forEach(tag => relatedTags.add(tag));
    });

    return {
      categories: Array.from(relatedCategories),
      tags: Array.from(relatedTags).slice(0, 8),
      suggestedQuestions: results.slice(0, 3).map(r => r.question)
    };
  }
}

// Export singleton instance
export const qnaKnowledgeBase = new QnAKnowledgeBase();