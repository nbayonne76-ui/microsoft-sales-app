/**
 * QnA Maker Intelligent - Système de compréhension du langage naturel
 * Analyse les intentions, détecte les erreurs et propose des suggestions contextuelles
 * Intégré avec base de connaissances Microsoft complète
 */

import { qnaKnowledgeBase } from '../lib/qna-knowledge-base.js';

export class QnAMaker {
  constructor() {
    this.intentPatterns = this.initializeIntentPatterns();
    this.contextualHelp = this.initializeContextualHelp();
    this.errorPatterns = this.initializeErrorPatterns();
    this.knowledgeBase = qnaKnowledgeBase;
  }

  // Patterns d'intention pour comprendre ce que veut l'utilisateur
  initializeIntentPatterns() {
    return {
      CREATE_EMAIL: {
        patterns: [
          /(?:je (?:veux|souhaite|dois|voudrais).*(?:cr[eé]er|envoyer|faire|[eé]crire).*(?:email|mail|message))/i,
          /(?:cr[eé]er.*(?:email|mail|message))/i,
          /(?:envoyer.*(?:email|mail|message))/i,
          /(?:nouveau.*(?:email|mail|message))/i,
          /(?:contacter.*(?:client|prospect|personne))/i
        ],
        confidence: 0.9,
        response: {
          type: 'guidance',
          message: `🎯 **Parfait ! Créons votre email.**

**Dites-moi le type d'email :**
• "Contacter un nouveau prospect"
• "Suivi de réunion"  
• "Proposition commerciale"
• "Relance client"

Ou donnez-moi directement les infos : "Martin, TIXTO, martin@tixto.com"`,
          suggestions: [
            '🎯 Nouveau prospect',
            '📧 Suivi réunion',
            '💰 Proposition commerciale',
            '🔄 Relance client'
          ]
        }
      },

      NEED_HELP: {
        patterns: [
          /(?:aide|help|comment|guide|je (?:sais|comprends) pas|pas compris)/i,
          /(?:comment .*(?:faire|utiliser|cr[eé]er))/i,
          /(?:qu'est[- ]ce que|c'est quoi)/i,
          /(?:expliquer|expliquez)/i
        ],
        confidence: 0.8,
        response: {
          type: 'help',
          message: `💡 **Je suis là pour vous aider !**

**Guide rapide :**
1️⃣ Dites-moi votre objectif : "Je veux contacter un prospect"
2️⃣ Donnez les infos : "Martin, TIXTO, martin@tixto.com"
3️⃣ L'email est généré automatiquement !

**Questions fréquentes :** Tapez "FAQ" ou cliquez ❓ en haut`,
          suggestions: [
            '❓ Voir la FAQ',
            '📧 Créer un email',
            '📋 Voir les templates',
            '💡 Guide complet'
          ]
        }
      },

      PROSPECT_CONTACT: {
        patterns: [
          /(?:prospect|prospection|nouveau (?:client|contact))/i,
          /(?:contacter.*(?:prospect|nouveau|client))/i,
          /(?:pr[eé]senter.*(?:solutions|services|offre))/i,
          /(?:d[eé]marcher|approcher)/i
        ],
        confidence: 0.85,
        response: {
          type: 'template_suggestion',
          purpose: 'prospection',
          message: `🎯 **Email de prospection - Nouveau prospect**

📋 **Informations nécessaires :**

**1️⃣ Nom du client :**
• Prénom et nom du contact

**2️⃣ Partenaire :**
• Nom du partenaire impliqué

**3️⃣ Type de contact :**
• S'agit-il d'un premier contact avec ce client ?

**📝 Format attendu :** "Martin Dupont, EFISENS, premier contact"
**📝 Ou :** "Sophie Martin, Be Cloud, suivi existant"`,
          suggestions: [
            '👤 Martin Dupont, EFISENS, premier contact',
            '👤 Sophie Martin, Be Cloud, suivi existant', 
            '👤 Antoine Leclerc, Crayon, premier contact',
            '❓ Comment bien formater ?'
          ]
        }
      },

      MEETING_FOLLOWUP: {
        patterns: [
          /(?:suivi.*(?:r[eé]union|meeting|rendez[- ]vous|appel))/i,
          /(?:apr[eè]s.*(?:r[eé]union|meeting|rendez[- ]vous))/i,
          /(?:compte[- ]rendu|cr|synthèse)/i,
          /(?:prochaines [eé]tapes)/i
        ],
        confidence: 0.85,
        response: {
          type: 'template_suggestion', 
          purpose: 'suivi',
          message: `📝 **Suivi de réunion**

**Parfait ! Donnez-moi les détails :**
"Nom du contact, Entreprise, email@domaine.com"

L'email reprendra les points clés et prochaines étapes.`,
          suggestions: [
            '📝 Résumé des points discutés',
            '📎 Envoi de documentation'
          ]
        }
      },

      COMMERCIAL_OFFER: {
        patterns: [
          /(?:offre|proposition|devis|prix|tarif|co[uû]t)/i,
          /(?:commercial|vente|vendre)/i,
          /(?:proposer.*(?:solution|service|produit))/i,
          /(?:budget|investissement)/i
        ],
        confidence: 0.8,
        response: {
          type: 'template_suggestion',
          purpose: 'offre_commerciale', 
          message: `💰 **Proposition commerciale**

**Donnez-moi les informations du prospect :**
"Nom, Entreprise, email@domaine.com"

Le template s'adaptera pour présenter votre offre de manière professionnelle.`,
          suggestions: [
            '💰 Proposition tarifaire Azure',
            '📋 Devis migration personnalisé',
            '🎁 Offre promotionnelle limitée',
            '📊 ROI et bénéfices'
          ]
        }
      },

      CLIENT_FOLLOWUP: {
        patterns: [
          /(?:relance|relancer|pas de r[eé]ponse|silencieux)/i,
          /(?:rappel|rappeler)/i,
          /(?:sans nouvelles|plus de contact)/i,
          /(?:r[eé]activer|re[- ]contacter)/i
        ],
        confidence: 0.85,
        response: {
          type: 'template_suggestion',
          purpose: 'relance',
          message: `🔄 **Relance client**

**Donnez-moi les détails :**
"Nom du contact, Entreprise, email@domaine.com"

Je vais créer une relance diplomatique et efficace.`,
          suggestions: [
            '🔄 Relance douce avec valeur ajoutée',
            '❓ Vérification de pertinence',
            '⚡ Relance avec urgence',
            '🎁 Nouvelle opportunité'
          ]
        }
      },

      KNOWLEDGE_QUESTION: {
        patterns: [
          /(?:(?:c'est quoi|qu'est[- ]ce que|comment|pourquoi|combien).*(?:azure|microsoft|office|teams|dynamics|power|sécurité))/i,
          /(?:(?:azure|microsoft|office|teams|dynamics|power).*(?:c'est quoi|qu'est[- ]ce que|comment|pourquoi|combien))/i,
          /(?:(?:vs|versus|comparaison|différence).*(?:azure|microsoft|teams|zoom))/i,
          /(?:(?:azure|microsoft|teams|zoom).*(?:vs|versus|comparaison|différence))/i,
          /(?:(?:prix|tarif|coût|sécurité|migration).*(?:azure|microsoft|office))/i,
          /(?:(?:azure|microsoft|office).*(?:prix|tarif|coût|sécurité|migration))/i
        ],
        confidence: 0.8,
        response: {
          type: 'knowledge_search',
          message: `🔍 **Recherche dans la base de connaissances...**

Je vais chercher les informations les plus pertinentes pour répondre à votre question sur les solutions Microsoft.`,
          suggestions: [
            '☁️ Questions Azure',
            '📧 Questions Microsoft 365',
            '🤝 Questions Teams',
            '❓ Voir toutes les catégories'
          ]
        }
      },

      OUT_OF_DOMAIN: {
        patterns: [
          /(?:météo|weather|temps|pluie|soleil)/i,
          /(?:recette|cuisine|restaurant|manger|nourriture)/i,
          /(?:film|cinéma|série|netflix|youtube)/i,
          /(?:sport|match|foot|tennis|score)/i,
          /(?:politique|élection|gouvernement|président)/i,
          /(?:santé|médecin|pharmacie|mal|douleur)/i,
          /(?:transport|train|métro|bus|taxi|uber)/i,
          /(?:bitcoin|crypto|bourse|investissement|trading)/i,
          /(?:shopping|acheter|vendre|prix|soldes)/i,
          /(?:vacation|vacances|voyage|hôtel|avion)/i,
          /(?:musique|chanson|artiste|concert|festival)/i,
          /(?:jeu|gaming|playstation|xbox|nintendo)/i,
          /(?:instagram|facebook|twitter|snapchat|tiktok)/i,
          /(?:google|search|recherche|wikipedia)/i,
          /(?:spam|publicité|promotion|offre|gratuit)/i
        ],
        confidence: 0.9,
        response: {
          type: 'out_of_domain',
          message: `🤖 **Je suis spécialisé dans l'assistance Microsoft et la création d'emails.**

**Je peux vous aider avec :**
• Questions sur Azure, Office 365, Teams, Dynamics...
• Création d'emails professionnels
• Support technique Microsoft
• Conseils sur les solutions Microsoft

**Pour votre demande actuelle, je vous recommande :**
• Utiliser un moteur de recherche comme Google
• Consulter des sites spécialisés
• Contacter le service approprié`,
          suggestions: [
            '📧 Créer un email professionnel',
            '☁️ Questions Microsoft Azure',
            '🤝 En savoir plus sur Teams',
            '❓ Voir l\'aide disponible'
          ]
        }
      }
    };
  }

  // Aide contextuelle selon l'état de la conversation
  initializeContextualHelp() {
    return {
      initial: {
        triggers: ['confusion', 'empty_message', 'unclear'],
        help: `🚀 **Commençons !**

**Exemples pour démarrer :**
• "Je veux contacter un nouveau prospect"
• "Faire le suivi de ma réunion avec Microsoft"
• "Envoyer une proposition commerciale" 
• "Relancer un client silencieux"

**Ou donnez directement :** "Martin, TIXTO, martin@tixto.com"`
      },
      
      gathering_info: {
        triggers: ['incomplete_info', 'format_error'],
        help: `📝 **Format recommandé :**

✅ **Correct :** "Martin Dubois, Microsoft, martin@microsoft.com"
✅ **Minimum :** "Sophie Martin, TechCorp"
✅ **Alternatif :** "M. Dupont chez Azure Solutions"

❌ **À éviter :** Juste un prénom ou juste un email`
      },
      
      review: {
        triggers: ['modification_request', 'dissatisfaction'],
        help: `🎨 **Vous pouvez modifier :**

• **Ton :** "Plus formel" / "Plus amical" / "Plus décontracté"
• **Contenu :** "Plus court" / "Ajouter urgence" / "Plus technique"
• **Approche :** "Plus commercial" / "Plus diplomatique"

**Ou recommencer :** "Créer un autre email"`
      }
    };
  }

  // Patterns d'erreurs communes
  initializeErrorPatterns() {
    return {
      MISSING_INFO: {
        patterns: [
          /^[a-zA-Z]+$/,  // Juste un prénom
          /^[a-zA-Z]+ [a-zA-Z]+$/,  // Prénom + Nom seulement
          /^\S+@\S+\.\S+$/  // Juste un email
        ],
        error: 'incomplete_info',
        suggestion: `❌ **Information incomplète**

**Il me faut au minimum :**
• Prénom ou nom
• Nom de l'entreprise

**Format idéal :** "Martin Dubois, Microsoft, martin@microsoft.com"`
      },

      UNCLEAR_INTENT: {
        patterns: [
          /^(?:salut|bonjour|hey|hi)$/i,
          /^(?:ok|oui|non)$/i,
          /^.{1,3}$/,  // Messages trop courts
          /^[.!?]+$/   // Juste de la ponctuation
        ],
        error: 'unclear_intent',
        suggestion: `🤔 **Message pas clair**

**Soyez plus spécifique :**
✅ "Je veux envoyer un email à un prospect"
✅ "Faire le suivi de ma réunion"
❌ "Ok" / "Aide" / "..."

**Ou tapez "aide" pour plus d'informations !**`
      },

      INVALID_EMAIL: {
        patterns: [
          /\S+@(?!.*\.\w{2,})/,  // Email sans domaine valide
          /@.*[<>]/,  // Caractères invalides
          /^@/,  // Commence par @
          /@$/   // Finit par @
        ],
        error: 'invalid_email',
        suggestion: `❌ **Format email incorrect**

**Format correct :** nom@entreprise.com
**Exemples valides :**
• martin@microsoft.com
• sophie.martin@techcorp.fr
• contact@entreprise.co.uk`
      }
    };
  }

  // Fonction principale d'analyse
  analyze(message, conversationState = 'initial', emailData = {}) {
    const analysis = {
      intent: null,
      confidence: 0,
      suggestions: [],
      errors: [],
      contextualHelp: null,
      response: null,
      knowledgeResults: null
    };

    // 1. Vérifier les erreurs communes
    const errorCheck = this.detectErrors(message);
    if (errorCheck) {
      analysis.errors.push(errorCheck);
      analysis.response = errorCheck.suggestion;
      return analysis;
    }

    // 2. Analyser l'intention
    const intentAnalysis = this.analyzeIntent(message);
    if (intentAnalysis) {
      analysis.intent = intentAnalysis.intent;
      analysis.confidence = intentAnalysis.confidence;

      // Si c'est une question de connaissance, chercher dans la base
      if (intentAnalysis.intent === 'KNOWLEDGE_QUESTION') {
        const knowledgeResults = this.searchKnowledgeBase(message);
        if (knowledgeResults.length > 0) {
          analysis.knowledgeResults = knowledgeResults;
          analysis.response = this.formatKnowledgeResponse(knowledgeResults[0]);
          analysis.suggestions = this.generateKnowledgeSuggestions(knowledgeResults);
        } else {
          analysis.response = intentAnalysis.response.message;
          analysis.suggestions = intentAnalysis.response.suggestions;
        }
      } else {
        analysis.response = intentAnalysis.response.message;
        analysis.suggestions = intentAnalysis.response.suggestions;
      }

      return analysis;
    }

    // 3. Recherche automatique dans la base de connaissances si pas d'intention claire
    const knowledgeResults = this.searchKnowledgeBase(message);
    if (knowledgeResults.length > 0 && knowledgeResults[0].relevanceScore > 0.7) {
      analysis.intent = 'KNOWLEDGE_QUESTION';
      analysis.confidence = knowledgeResults[0].relevanceScore;
      analysis.knowledgeResults = knowledgeResults;
      analysis.response = this.formatKnowledgeResponse(knowledgeResults[0]);
      analysis.suggestions = this.generateKnowledgeSuggestions(knowledgeResults);
      return analysis;
    }

    // 4. Aide contextuelle si pas d'intention claire
    const contextHelp = this.getContextualHelp(conversationState, message);
    if (contextHelp) {
      analysis.contextualHelp = contextHelp;
      analysis.response = contextHelp.help;
    }

    // 5. Suggestions proactives
    analysis.suggestions = this.generateProactiveSuggestions(message, conversationState, emailData);

    return analysis;
  }

  // Détection des erreurs communes
  detectErrors(message) {
    const trimmed = message.trim();
    
    for (const [errorType, config] of Object.entries(this.errorPatterns)) {
      for (const pattern of config.patterns) {
        if (pattern.test(trimmed)) {
          return {
            type: config.error,
            suggestion: config.suggestion
          };
        }
      }
    }
    
    return null;
  }

  // Analyse de l'intention
  analyzeIntent(message) {
    let bestMatch = null;
    let highestConfidence = 0;

    for (const [intentName, config] of Object.entries(this.intentPatterns)) {
      for (const pattern of config.patterns) {
        if (pattern.test(message)) {
          if (config.confidence > highestConfidence) {
            highestConfidence = config.confidence;
            bestMatch = {
              intent: intentName,
              confidence: config.confidence,
              response: config.response
            };
          }
        }
      }
    }

    return bestMatch;
  }

  // Aide contextuelle
  getContextualHelp(conversationState, message) {
    const contextConfig = this.contextualHelp[conversationState];
    if (!contextConfig) return null;

    // Vérifier si le message déclenche l'aide contextuelle
    const isConfused = message.length < 5 || 
                      message.includes('?') ||
                      message.includes('comment') ||
                      message.includes('aide');

    if (isConfused) {
      return contextConfig;
    }

    return null;
  }

  // Suggestions proactives basées sur le contexte
  generateProactiveSuggestions(message, conversationState, emailData) {
    const suggestions = [];

    // Suggestions basées sur l'état de conversation
    switch (conversationState) {
      case 'initial':
        suggestions.push(
          '🎯 Nouveau prospect à contacter',
          '📧 Suivi de réunion',
          '💰 Proposition commerciale',
          '🔄 Relance client'
        );
        break;
        
      case 'gathering_info':
        if (!emailData.recipientName) {
          suggestions.push('👤 Martin Dubois, Microsoft');
        }
        if (!emailData.company) {
          suggestions.push('🏢 , TechCorp');
        }
        if (!emailData.recipient) {
          suggestions.push('📧 , martin@techcorp.com');
        }
        suggestions.push('✅ Générer sans email');
        break;
        
      case 'review':
        suggestions.push(
          '✏️ Modifier le ton',
          '📝 Ajuster le contenu', 
          '🔄 Créer un autre email',
          '✅ Parfait, envoyer !'
        );
        break;
    }

    // Suggestions basées sur le contenu du message
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('azure')) {
      suggestions.push('☁️ Template Azure migration');
    }
    if (messageLower.includes('microsoft')) {
      suggestions.push('🏢 Template solutions Microsoft');
    }
    if (messageLower.includes('urgent')) {
      suggestions.push('🚨 Style urgent');
    }

    return suggestions.slice(0, 4); // Limiter à 4 suggestions
  }

  // Amélioration du message de l'utilisateur
  enhanceUserMessage(message, conversationState) {
    const analysis = this.analyze(message, conversationState);
    
    return {
      originalMessage: message,
      enhancedMessage: this.generateEnhancedMessage(message, analysis),
      suggestions: analysis.suggestions,
      intent: analysis.intent,
      confidence: analysis.confidence
    };
  }

  // Génération d'un message amélioré
  generateEnhancedMessage(message, analysis) {
    if (analysis.intent === 'CREATE_EMAIL' && message.length < 20) {
      return `${message} - Je veux créer un email professionnel`;
    }

    if (analysis.intent === 'PROSPECT_CONTACT') {
      return `${message} - Prospection commerciale Azure/Microsoft`;
    }

    return message;
  }

  // ====== KNOWLEDGE BASE INTEGRATION ======

  /**
   * Search in the Microsoft knowledge base
   */
  searchKnowledgeBase(query) {
    try {
      return this.knowledgeBase.findAnswers(query, 3);
    } catch (error) {
      console.error('Knowledge base search error:', error);
      return [];
    }
  }

  /**
   * Format knowledge base response for display
   */
  formatKnowledgeResponse(result) {
    if (!result) return null;

    const categoryIcon = this.getCategoryIcon(result.category);

    return `${categoryIcon} **${result.question}**

${result.answer}

📊 **Pertinence:** ${Math.round(result.relevanceScore * 100)}%`;
  }

  /**
   * Generate suggestions based on knowledge results
   */
  generateKnowledgeSuggestions(results) {
    const suggestions = [];

    // Add related questions from results
    results.slice(1, 3).forEach(result => {
      suggestions.push(`❓ ${result.question}`);
    });

    // Add category suggestions
    const categories = [...new Set(results.map(r => r.category))];
    categories.slice(0, 2).forEach(category => {
      const icon = this.getCategoryIcon(category);
      suggestions.push(`${icon} Plus sur ${category}`);
    });

    // Add generic suggestions if few results
    if (suggestions.length < 3) {
      suggestions.push('🔍 Voir toutes les catégories');
      suggestions.push('💡 Questions fréquentes');
    }

    return suggestions.slice(0, 4);
  }

  /**
   * Get icon for category
   */
  getCategoryIcon(category) {
    const iconMap = {
      azure: '☁️',
      microsoft365: '📧',
      teams: '🤝',
      power: '⚡',
      dynamics: '💼',
      security: '🔐',
      general: '❓'
    };
    return iconMap[category] || '📋';
  }

  /**
   * Get category overview
   */
  getCategoryOverview() {
    return this.knowledgeBase.getCategories();
  }

  /**
   * Get random suggestions from knowledge base
   */
  getRandomKnowledgeSuggestions(count = 4) {
    return this.knowledgeBase.getRandomSuggestions(count);
  }

  /**
   * Enhanced analysis with knowledge base fallback
   */
  analyzeWithKnowledge(message, conversationState = 'initial', emailData = {}) {
    // First check if it's clearly an action intent (email creation, etc.)
    const actionIntents = ['CREATE_EMAIL', 'PROSPECT_CONTACT', 'MEETING_FOLLOWUP', 'CLIENT_FOLLOWUP'];

    const analysis = this.analyze(message, conversationState, emailData);

    // If we got a strong action intent, keep it
    if (analysis.intent && actionIntents.includes(analysis.intent) && analysis.confidence > 0.8) {
      return analysis;
    }

    // For other cases, check knowledge base and potentially override
    const knowledgeResults = this.searchKnowledgeBase(message);

    // If knowledge base has very high confidence, use it even if we have other intent
    if (knowledgeResults.length > 0 && knowledgeResults[0].relevanceScore > 0.85) {
      analysis.intent = 'KNOWLEDGE_QUESTION';
      analysis.confidence = knowledgeResults[0].relevanceScore;
      analysis.knowledgeResults = knowledgeResults;
      analysis.response = this.formatKnowledgeResponse(knowledgeResults[0]);
      analysis.suggestions = this.generateKnowledgeSuggestions(knowledgeResults);
      return analysis;
    }

    // If we have an intent but also good knowledge results, compare confidence
    if (analysis.intent && knowledgeResults.length > 0) {
      const knowledgeScore = knowledgeResults[0].relevanceScore;

      // Use knowledge base if it's significantly better
      if (knowledgeScore > analysis.confidence + 0.1 && knowledgeScore > 0.7) {
        analysis.intent = 'KNOWLEDGE_QUESTION';
        analysis.confidence = knowledgeScore;
        analysis.knowledgeResults = knowledgeResults;
        analysis.response = this.formatKnowledgeResponse(knowledgeResults[0]);
        analysis.suggestions = this.generateKnowledgeSuggestions(knowledgeResults);
        return analysis;
      }
    }

    // If no clear intent found, try knowledge base
    if (!analysis.intent && !analysis.response) {
      if (knowledgeResults.length > 0 && knowledgeResults[0].relevanceScore > 0.6) {
        analysis.intent = 'KNOWLEDGE_QUESTION';
        analysis.confidence = knowledgeResults[0].relevanceScore;
        analysis.knowledgeResults = knowledgeResults;
        analysis.response = this.formatKnowledgeResponse(knowledgeResults[0]);
        analysis.suggestions = this.generateKnowledgeSuggestions(knowledgeResults);
      } else {
        // Provide helpful fallback
        analysis.response = `🤔 **Je n'ai pas bien compris votre question.**

**Vous pouvez essayer :**
• Poser une question sur Microsoft Azure, Office 365, Teams...
• Demander "Je veux créer un email"
• Parcourir les catégories disponibles

**Ou tapez "aide" pour plus d'informations.**`;

        analysis.suggestions = this.getRandomKnowledgeSuggestions();
      }
    }

    return analysis;
  }
}

export default QnAMaker;