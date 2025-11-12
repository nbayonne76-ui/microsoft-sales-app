/**
 * Improved Intent System based on Microsoft LUIS Best Practices
 * Implements proper intent design, balanced training, and entity separation
 */

export class ImprovedIntentSystem {
  constructor() {
    this.initializeIntents();
    this.initializeEntities();
    this.initializeFeatures();
  }

  initializeIntents() {
    // Well-defined, distinct intents following LUIS best practices
    this.intents = {
      // Primary email creation intent - covers all email creation scenarios
      CreateEmail: {
        description: "User wants to create any type of email",
        examples: [
          "Je veux créer un email",
          "Écrire un message",
          "Envoyer un mail",
          "Rédiger une communication",
          "Composer un email",
          "Faire un email",
          "Créer une correspondance",
          "Nouveau message",
          "Écrire à un client",
          "Contacter par email"
        ],
        features: ["email", "créer", "écrire", "envoyer", "message", "mail"],
        action: "initiate_email_creation"
      },

      // Contact management intent - distinct from email creation
      ManageContact: {
        description: "User wants to add, find, or manage contact information",
        examples: [
          "Ajouter un contact",
          "Chercher Martin Dupont",
          "Qui est le DSI chez Microsoft",
          "Contact de Jean",
          "Informations sur ce client",
          "Retrouver les coordonnées",
          "Nouvelle personne à contacter",
          "Carnet d'adresses",
          "Gestion contacts",
          "Base de contacts"
        ],
        features: ["contact", "ajouter", "chercher", "personne", "coordonnées"],
        action: "manage_contact_info"
      },

      // Template management intent
      ManageTemplate: {
        description: "User wants to create, modify, or organize email templates",
        examples: [
          "Analyser mes templates",
          "Créer un nouveau modèle",
          "Modifier un template",
          "Organiser mes modèles",
          "Template pour prospection",
          "Modèle de suivi",
          "Scanner les templates",
          "Optimiser mes modèles",
          "Nouveau template Azure",
          "Gérer les templates"
        ],
        features: ["template", "modèle", "analyser", "créer", "organiser"],
        action: "manage_templates"
      },

      // Meeting and follow-up intent
      ScheduleFollowUp: {
        description: "User wants to schedule meetings or create follow-up communications",
        examples: [
          "Programmer un suivi",
          "Planifier une réunion",
          "Fixer un rendez-vous",
          "Suite de notre échange",
          "Prochaines étapes",
          "Organiser un meeting",
          "Calendrier disponible",
          "Programmer un call",
          "Rendez-vous client",
          "Suivi commercial"
        ],
        features: ["suivi", "réunion", "rendez-vous", "planifier", "programmer"],
        action: "schedule_activity"
      },

      // Help and guidance intent
      GetHelp: {
        description: "User needs help, guidance, or wants to understand features",
        examples: [
          "Comment ça marche",
          "Besoin d'aide",
          "Guide d'utilisation",
          "Que puis-je faire",
          "Comment créer un email",
          "Aide-moi",
          "Je ne comprends pas",
          "Fonctionnalités disponibles",
          "Mode d'emploi",
          "Support"
        ],
        features: ["aide", "comment", "guide", "help", "expliquer"],
        action: "provide_assistance"
      },

      // System feedback intent
      ProvideFeedback: {
        description: "User wants to give feedback or report issues",
        examples: [
          "Signaler un problème",
          "Ce n'est pas correct",
          "Erreur dans l'email",
          "Feedback sur le résultat",
          "Améliorer le système",
          "Suggestion d'amélioration",
          "Bug report",
          "Commentaire sur l'outil",
          "Évaluation du service",
          "Retour d'expérience"
        ],
        features: ["problème", "erreur", "feedback", "signaler", "améliorer"],
        action: "collect_feedback"
      },

      // Greeting intent - keep simple social interactions
      Greeting: {
        description: "User greets or starts conversation",
        examples: [
          "Bonjour",
          "Salut",
          "Hello",
          "Bonsoir",
          "Bon après-midi",
          "Coucou",
          "Bonne journée",
          "Hi",
          "Hey",
          "Comment allez-vous"
        ],
        features: ["bonjour", "salut", "hello", "bonsoir"],
        action: "respond_greeting"
      },

      // None intent - fallback for out-of-domain requests
      None: {
        description: "Requests outside the email assistant and Microsoft solutions domain",
        examples: [
          // General conversation/social
          "Comment ça va",
          "Tu es qui",
          "C'est cool",
          "Merci beaucoup",
          "Au revoir",
          "À bientôt",
          "Bonne journée",
          "Félicitations",
          "Désolé",
          "Excuse-moi",

          // Personal life/entertainment
          "Recette de cookies",
          "Film au cinéma",
          "Restaurant ouvert",
          "Sortir ce soir",
          "Vacances été",
          "Cadeau anniversaire",
          "Livre à lire",
          "Série télé",
          "Musique préférée",
          "Jeu vidéo",

          // News/current events
          "Météo à Paris",
          "Score du match",
          "Actualités",
          "Politique france",
          "Élections",
          "Covid aujourd'hui",
          "Bourse actions",
          "Prix essence",
          "Grève transport",
          "Manifestations",

          // Transportation/location
          "Comment aller à la gare",
          "Horaires de train",
          "Traffic autoroute",
          "Parking gratuit",
          "Station service",
          "Aéroport navette",
          "Taxi commander",
          "Bus ligne 12",
          "Métro fermé",
          "Vélib disponible",

          // Shopping/commerce
          "Prix du bitcoin",
          "Acheter chaussures",
          "Soldes magasin",
          "Livraison amazon",
          "Code promo",
          "Carte fidélité",
          "Retour produit",
          "Garantie appareil",
          "Comparateur prix",
          "Black friday",

          // Health/medical
          "Mal de tête",
          "Pharmacie garde",
          "Rdv médecin",
          "Ordonnance",
          "Assurance maladie",
          "Mutuelle",
          "Vaccin covid",
          "Test pcr",
          "Dentiste urgence",
          "Kiné recommandé",

          // Technical support (non-Microsoft)
          "Wifi ne marche pas",
          "Téléphone cassé",
          "Ordinateur lent",
          "Antivirus gratuit",
          "Instagram bug",
          "Whatsapp message",
          "Zoom plantage",
          "Netflix erreur",
          "Youtube publicité",
          "Google drive plein",

          // Education/learning
          "Cours d'anglais",
          "Formation excel",
          "Université inscription",
          "Bac résultats",
          "Stage entreprise",
          "CV modèle",
          "Lettre motivation",
          "Entretien préparer",
          "Diplôme équivalence",
          "École commerce",

          // Legal/administrative
          "Impôts déclaration",
          "Carte identité",
          "Passeport demande",
          "Assurance auto",
          "Banque compte",
          "Crédit immobilier",
          "Contrat travail",
          "Congés payés",
          "Chômage allocation",
          "Retraite calcul",

          // Random/nonsensical
          "Bla bla bla",
          "Test test",
          "Rien à dire",
          "Mot de passe oublié",
          "123456",
          "Qwertyuiop",
          "Hahaha",
          "Lorem ipsum",
          "Click here",
          "Download now",

          // Edge cases
          "",
          "...",
          "???",
          "Hein",
          "Quoi",
          "Euh",
          "Hmm",
          "Ok",
          "D'accord",
          "Peut-être",

          // Inappropriate content indicators
          "Spam message",
          "Publicité",
          "Promotion",
          "Offre spéciale",
          "Gagnez argent",
          "Crédit facile",
          "Prêt urgent",
          "Casino en ligne",
          "Rencontre célibataire",
          "Viagra pas cher",

          // Wrong platform confusion
          "Recherche google",
          "Facebook post",
          "Tweet twitter",
          "LinkedIn profil",
          "Snapchat photo",
          "TikTok vidéo",
          "Amazon commande",
          "Uber taxi",
          "Airbnb réservation",
          "Spotify playlist"
        ],
        features: ["recette", "météo", "film", "train", "bitcoin", "pharmacie", "wifi", "impôts", "spam"],
        action: "handle_out_of_domain",
        confidence_threshold: 0.3 // Lower threshold for None intent
      }
    };
  }

  initializeEntities() {
    // Entities represent parameters for actions, not actions themselves
    this.entities = {
      // Contact entities
      PersonName: {
        type: "simple",
        patterns: [/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/],
        examples: ["Jean Dupont", "Marie Martin", "Nicolas Bayonne"]
      },

      CompanyName: {
        type: "simple",
        patterns: [/\b[A-Z][A-Za-z\s&]{2,}(?:\s+(?:SAS|SARL|SA|EURL))?\b/],
        examples: ["Microsoft", "TechCorp", "Digital Solutions SAS"]
      },

      EmailAddress: {
        type: "regex",
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
        examples: ["jean@microsoft.com", "contact@techcorp.fr"]
      },

      // Email type entities
      EmailType: {
        type: "list",
        values: {
          "prospection": ["nouveau client", "prospect", "démarchage", "acquisition"],
          "suivi": ["follow-up", "suite", "après réunion", "récapitulatif"],
          "commercial": ["proposition", "devis", "offre", "tarifs"],
          "technique": ["démonstration", "poc", "architecture", "intégration"]
        }
      },

      // Microsoft solution entities
      MicrosoftSolution: {
        type: "list",
        values: {
          "azure": ["Azure", "cloud", "migration", "infrastructure"],
          "office365": ["Office 365", "Microsoft 365", "M365", "Teams"],
          "dynamics": ["Dynamics 365", "CRM", "ERP"],
          "powerplatform": ["Power Platform", "Power BI", "Power Apps", "Power Automate"],
          "security": ["Defender", "sécurité", "compliance", "Zero Trust"]
        }
      },

      // Business role entities
      BusinessRole: {
        type: "list",
        values: {
          "decision_maker": ["CEO", "PDG", "Directeur Général", "DG"],
          "technical": ["DSI", "CTO", "Directeur Technique", "IT Manager"],
          "financial": ["DAF", "CFO", "Directeur Financier"],
          "hr": ["DRH", "Directeur RH", "HR Director"],
          "sales": ["Directeur Commercial", "Sales Director"]
        }
      },

      // Temporal entities
      TimeFrame: {
        type: "builtin",
        patterns: [/\b(?:aujourd'hui|demain|la semaine prochaine|le mois prochain)\b/i],
        examples: ["aujourd'hui", "demain", "la semaine prochaine", "dans 2 jours"]
      },

      // Priority/Urgency entities
      Priority: {
        type: "list",
        values: {
          "urgent": ["urgent", "immédiat", "prioritaire", "critique", "asap"],
          "normal": ["normal", "standard", "habituel"],
          "low": ["pas pressé", "quand possible", "pas urgent"]
        }
      }
    };
  }

  initializeFeatures() {
    // Features help distinguish intents - phrase lists and patterns
    this.features = {
      emailCreationPhrases: [
        "créer", "écrire", "composer", "rédiger", "envoyer", "faire",
        "email", "mail", "message", "correspondance", "communication"
      ],

      contactManagementPhrases: [
        "contact", "personne", "client", "prospect", "coordonnées",
        "ajouter", "chercher", "trouver", "gérer", "carnet"
      ],

      templatePhrases: [
        "template", "modèle", "analyser", "scanner", "organiser",
        "créer", "modifier", "optimiser", "gérer"
      ],

      meetingPhrases: [
        "réunion", "meeting", "rendez-vous", "suivi", "planifier",
        "programmer", "organiser", "calendrier", "disponible"
      ],

      helpPhrases: [
        "aide", "help", "comment", "guide", "expliquer",
        "comprendre", "fonctionnalités", "utilisation"
      ],

      microsoftSolutionsPhrases: [
        "Azure", "Office 365", "Microsoft 365", "Teams", "Dynamics",
        "Power Platform", "Power BI", "SharePoint", "Exchange"
      ]
    };
  }

  /**
   * Improved intent classification using LUIS best practices
   */
  async classifyIntent(utterance, context = {}) {
    const normalizedUtterance = this.normalizeUtterance(utterance);
    const intentScores = {};

    // Calculate scores for each intent
    for (const [intentName, intentConfig] of Object.entries(this.intents)) {
      intentScores[intentName] = await this.calculateIntentScore(
        normalizedUtterance,
        intentConfig,
        context
      );
    }

    // Return all intent scores (LUIS best practice)
    const sortedIntents = Object.entries(intentScores)
      .map(([intent, score]) => ({ intent, score }))
      .sort((a, b) => b.score - a.score);

    // Extract entities for the top intent
    const topIntent = sortedIntents[0];
    const entities = await this.extractEntities(normalizedUtterance, topIntent.intent);

    return {
      topIntent: topIntent.intent,
      topScore: topIntent.score,
      allIntents: sortedIntents,
      entities: entities,
      isConfident: topIntent.score > 0.7,
      isAmbiguous: sortedIntents.length > 1 && (sortedIntents[0].score - sortedIntents[1].score) < 0.2
    };
  }

  /**
   * Calculate intent score using multiple factors
   */
  async calculateIntentScore(utterance, intentConfig, context) {
    let score = 0;

    // 1. Example utterance similarity (main scoring mechanism)
    const exampleScore = this.calculateExampleSimilarity(utterance, intentConfig.examples);
    score += exampleScore * 0.6;

    // 2. Feature matching (phrase lists)
    const featureScore = this.calculateFeatureScore(utterance, intentConfig.features);
    score += featureScore * 0.3;

    // 3. Context relevance
    const contextScore = this.calculateContextRelevance(intentConfig, context);
    score += contextScore * 0.1;

    return Math.min(score, 1.0);
  }

  /**
   * Calculate similarity with example utterances
   */
  calculateExampleSimilarity(utterance, examples) {
    let maxSimilarity = 0;

    for (const example of examples) {
      const similarity = this.calculateStringSimilarity(utterance, example.toLowerCase());
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }

    return maxSimilarity;
  }

  /**
   * Calculate feature/phrase list matching score
   */
  calculateFeatureScore(utterance, features) {
    if (!features || features.length === 0) return 0;

    const words = utterance.split(/\s+/);
    const matchedFeatures = features.filter(feature =>
      words.some(word => word.includes(feature) || feature.includes(word))
    );

    return matchedFeatures.length / features.length;
  }

  /**
   * Calculate context relevance (conversation state, history)
   */
  calculateContextRelevance(intentConfig, context) {
    let score = 0;

    // Conversation state relevance
    const stateRelevance = {
      'CreateEmail': { 'initial': 0.2, 'gathering_info': 0.1 },
      'ManageContact': { 'gathering_info': 0.3, 'gathering_prospect_info': 0.4 },
      'ManageTemplate': { 'initial': 0.1, 'review': 0.2 },
      'GetHelp': { '*': 0.1 } // Always slightly relevant
    };

    const relevance = stateRelevance[intentConfig.action];
    if (relevance) {
      score += relevance[context.conversationState] || relevance['*'] || 0;
    }

    return score;
  }

  /**
   * Enhanced entity extraction based on intent
   */
  async extractEntities(utterance, intentName) {
    const extractedEntities = [];

    for (const [entityName, entityConfig] of Object.entries(this.entities)) {
      const entities = await this.extractEntityType(utterance, entityName, entityConfig, intentName);
      extractedEntities.push(...entities);
    }

    return this.cleanupEntities(extractedEntities);
  }

  /**
   * Extract specific entity type
   */
  async extractEntityType(utterance, entityName, entityConfig, intentName) {
    const entities = [];

    switch (entityConfig.type) {
      case 'regex':
        const regexMatches = Array.from(utterance.matchAll(new RegExp(entityConfig.pattern, 'gi')));
        regexMatches.forEach(match => {
          entities.push({
            entity: entityName,
            value: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            confidence: 0.95,
            source: 'regex'
          });
        });
        break;

      case 'simple':
        if (entityConfig.patterns) {
          entityConfig.patterns.forEach(pattern => {
            // Ensure pattern is global for matchAll
            const globalPattern = pattern.global ? pattern : new RegExp(pattern.source, pattern.flags + 'g');
            const matches = Array.from(utterance.matchAll(globalPattern));
            matches.forEach(match => {
              entities.push({
                entity: entityName,
                value: match[0],
                startIndex: match.index,
                endIndex: match.index + match[0].length,
                confidence: 0.8,
                source: 'pattern'
              });
            });
          });
        }
        break;

      case 'list':
        for (const [canonicalValue, synonyms] of Object.entries(entityConfig.values)) {
          const allValues = [canonicalValue, ...synonyms];
          for (const value of allValues) {
            if (utterance.toLowerCase().includes(value.toLowerCase())) {
              entities.push({
                entity: entityName,
                value: canonicalValue,
                text: value,
                startIndex: utterance.toLowerCase().indexOf(value.toLowerCase()),
                endIndex: utterance.toLowerCase().indexOf(value.toLowerCase()) + value.length,
                confidence: 0.9,
                source: 'list'
              });
            }
          }
        }
        break;
    }

    return entities;
  }

  /**
   * String similarity calculation (Jaccard similarity)
   */
  calculateStringSimilarity(str1, str2) {
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Normalize utterance for processing
   */
  normalizeUtterance(utterance) {
    return utterance
      .toLowerCase()
      .trim()
      .replace(/[^\w\s@.-]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  /**
   * Cleanup and validate extracted entities
   */
  cleanupEntities(entities) {
    // Remove duplicates and low-confidence entities
    const uniqueEntities = entities.filter((entity, index, arr) =>
      index === arr.findIndex(e =>
        e.entity === entity.entity &&
        e.value.toLowerCase() === entity.value.toLowerCase()
      )
    );

    // Sort by confidence
    uniqueEntities.sort((a, b) => b.confidence - a.confidence);

    // Remove entities with very low confidence
    return uniqueEntities.filter(entity => entity.confidence > 0.5);
  }

  /**
   * Get intent balance statistics (for monitoring)
   */
  getIntentBalance() {
    const intentStats = {};

    for (const [intentName, intentConfig] of Object.entries(this.intents)) {
      intentStats[intentName] = {
        exampleCount: intentConfig.examples.length,
        featureCount: intentConfig.features.length,
        description: intentConfig.description
      };
    }

    return intentStats;
  }

  /**
   * Validate intent system health
   */
  validateIntentSystem() {
    const issues = [];
    const intentNames = Object.keys(this.intents);

    // Check for balanced examples (LUIS best practice)
    const exampleCounts = intentNames.map(name => this.intents[name].examples.length);
    const maxExamples = Math.max(...exampleCounts);
    const minExamples = Math.min(...exampleCounts.filter(count => count > 0));

    if (maxExamples / minExamples > 5) {
      issues.push('Intent examples are unbalanced - some intents have 5x more examples than others');
    }

    // Check for None intent (required)
    if (!this.intents.None) {
      issues.push('None intent is missing - this is required for fallback scenarios');
    }

    // Check for similar intents that might be confusing
    for (let i = 0; i < intentNames.length; i++) {
      for (let j = i + 1; j < intentNames.length; j++) {
        const intent1 = this.intents[intentNames[i]];
        const intent2 = this.intents[intentNames[j]];

        const featureOverlap = this.calculateFeatureOverlap(intent1.features, intent2.features);
        if (featureOverlap > 0.7) {
          issues.push(`Intents '${intentNames[i]}' and '${intentNames[j]}' have high feature overlap (${Math.round(featureOverlap * 100)}%)`);
        }
      }
    }

    return {
      isHealthy: issues.length === 0,
      issues: issues,
      stats: this.getIntentBalance()
    };
  }

  calculateFeatureOverlap(features1, features2) {
    if (!features1?.length || !features2?.length) return 0;

    const set1 = new Set(features1.map(f => f.toLowerCase()));
    const set2 = new Set(features2.map(f => f.toLowerCase()));

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }
}

// Export the improved intent system
export const improvedIntentSystem = new ImprovedIntentSystem();