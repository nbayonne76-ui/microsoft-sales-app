/**
 * Advanced NLP Engine for Email Chatbot
 * Enhances the existing rule-based system with modern NLP capabilities
 */

export class AdvancedNLPEngine {
  constructor() {
    this.initializeModels();
  }

  initializeModels() {
    // Initialize NLP models and patterns
    this.intentClassifier = new IntentClassifier();
    this.entityExtractor = new EntityExtractor();
    this.sentimentAnalyzer = new SentimentAnalyzer();
    this.contextManager = new ContextManager();
  }

  /**
   * Comprehensive message analysis combining multiple NLP techniques
   */
  async analyzeMessage(message, conversationContext = {}) {
    const analysis = {
      timestamp: new Date().toISOString(),
      originalMessage: message,
      normalizedMessage: this.normalizeText(message),

      // Core NLP Analysis
      intent: null,
      entities: [],
      sentiment: null,
      confidence: 0,

      // Context Analysis
      context: conversationContext,
      conversationFlow: null,

      // Generated Response
      response: null,
      suggestions: [],

      // Metadata
      language: 'fr',
      processingTime: 0
    };

    const startTime = Date.now();

    try {
      // 1. Text Normalization
      analysis.normalizedMessage = this.normalizeText(message);

      // 2. Intent Classification
      analysis.intent = await this.intentClassifier.classify(analysis.normalizedMessage, conversationContext);

      // 3. Entity Extraction
      analysis.entities = await this.entityExtractor.extract(analysis.normalizedMessage);

      // 4. Sentiment Analysis
      analysis.sentiment = await this.sentimentAnalyzer.analyze(analysis.normalizedMessage);

      // 5. Context Integration
      analysis.conversationFlow = this.contextManager.updateContext(
        conversationContext,
        analysis.intent,
        analysis.entities
      );

      // 6. Response Generation
      const responseData = await this.generateResponse(analysis);
      analysis.response = responseData.response;
      analysis.suggestions = responseData.suggestions;
      analysis.confidence = responseData.confidence;

      analysis.processingTime = Date.now() - startTime;

      return analysis;

    } catch (error) {
      console.error('NLP Analysis Error:', error);
      analysis.error = error.message;
      analysis.processingTime = Date.now() - startTime;
      return analysis;
    }
  }

  /**
   * Text normalization and preprocessing
   */
  normalizeText(text) {
    return text
      .toLowerCase()
      .trim()
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Handle French accents consistently
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Remove emojis for processing
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, ' ')
      .trim();
  }

  /**
   * Generate intelligent response based on analysis
   */
  async generateResponse(analysis) {
    const { intent, entities, sentiment, conversationFlow } = analysis;

    // Use existing OpenAI integration if available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
      return await this.generateOpenAIResponse(analysis);
    }

    // Fallback to enhanced rule-based responses
    return this.generateRuleBasedResponse(analysis);
  }

  /**
   * Enhanced OpenAI integration with NLP context
   */
  async generateOpenAIResponse(analysis) {
    // Implementation would integrate with existing OpenAI service
    // but with enhanced context from NLP analysis
    return {
      response: "OpenAI enhanced response based on NLP analysis",
      suggestions: [],
      confidence: 0.9
    };
  }

  /**
   * Enhanced rule-based response generation
   */
  generateRuleBasedResponse(analysis) {
    const { intent, entities, sentiment } = analysis;

    // Enhanced response logic based on comprehensive analysis
    if (intent?.name === 'CREATE_EMAIL' && entities.some(e => e.type === 'CONTACT_INFO')) {
      return {
        response: this.buildEmailCreationResponse(entities, sentiment),
        suggestions: this.generateSmartSuggestions(intent, entities),
        confidence: intent.confidence
      };
    }

    // Default response
    return {
      response: "Je peux vous aider à créer un email personnalisé. Pouvez-vous me donner plus de détails ?",
      suggestions: [
        "🎯 Nouveau prospect",
        "📧 Suivi de réunion",
        "💼 Proposition commerciale"
      ],
      confidence: 0.5
    };
  }

  buildEmailCreationResponse(entities, sentiment) {
    const contactEntity = entities.find(e => e.type === 'CONTACT_INFO');
    const companyEntity = entities.find(e => e.type === 'COMPANY');

    let response = "🎯 **Parfait ! Je vais créer votre email.**\n\n";

    if (contactEntity) {
      response += `📋 **Contact identifié :** ${contactEntity.value}\n`;
    }

    if (companyEntity) {
      response += `🏢 **Entreprise :** ${companyEntity.value}\n`;
    }

    // Adapt tone based on sentiment
    if (sentiment?.score > 0.6) {
      response += "\n😊 Je sens votre enthousiasme ! Créons un email impactant.";
    } else if (sentiment?.score < -0.2) {
      response += "\n🤝 Je vais vous aider à créer un email professionnel et efficace.";
    }

    return response;
  }

  generateSmartSuggestions(intent, entities) {
    const suggestions = ["🎯 Continuer", "✏️ Modifier les infos", "❓ Besoin d'aide"];

    // Add context-specific suggestions based on entities
    if (entities.some(e => e.type === 'COMPANY')) {
      suggestions.unshift("🔍 Analyser l'entreprise");
    }

    if (entities.some(e => e.type === 'CONTACT_ROLE')) {
      suggestions.unshift("👤 Personnaliser par rôle");
    }

    return suggestions;
  }
}

/**
 * Intent Classification using hybrid approach
 */
class IntentClassifier {
  constructor() {
    this.patterns = this.initializePatterns();
  }

  initializePatterns() {
    return {
      CREATE_EMAIL: {
        keywords: ['email', 'mail', 'message', 'écrire', 'envoyer', 'créer', 'contacter'],
        patterns: [
          /(?:je (?:veux|souhaite|dois|voudrais).*(?:créer|envoyer|faire|écrire).*(?:email|mail|message))/i,
          /(?:créer.*(?:email|mail|message))/i,
          /(?:nouveau.*(?:email|mail|message))/i
        ],
        weight: 1.0
      },
      PROSPECT_CONTACT: {
        keywords: ['prospect', 'nouveau client', 'lead', 'contact', 'démarchage'],
        patterns: [
          /(?:nouveau.*(?:prospect|client|contact))/i,
          /(?:contacter.*(?:prospect|client))/i,
          /(?:démarch.*)/i
        ],
        weight: 0.9
      },
      MEETING_FOLLOWUP: {
        keywords: ['suivi', 'réunion', 'meeting', 'rendez-vous', 'suite'],
        patterns: [
          /(?:suivi.*(?:réunion|meeting|rdv))/i,
          /(?:suite.*(?:échange|discussion))/i
        ],
        weight: 0.9
      },
      NEED_HELP: {
        keywords: ['aide', 'help', 'comment', 'guide', 'expliquer'],
        patterns: [
          /(?:aide|help|comment|guide)/i,
          /(?:comment.*(?:faire|utiliser))/i
        ],
        weight: 0.8
      }
    };
  }

  async classify(text, context = {}) {
    const results = [];

    for (const [intentName, config] of Object.entries(this.patterns)) {
      let score = 0;

      // Keyword matching
      const keywordScore = this.calculateKeywordScore(text, config.keywords);

      // Pattern matching
      const patternScore = this.calculatePatternScore(text, config.patterns);

      // Context bonus
      const contextScore = this.calculateContextScore(intentName, context);

      // Combined score
      score = (keywordScore * 0.4 + patternScore * 0.5 + contextScore * 0.1) * config.weight;

      if (score > 0.3) {
        results.push({
          name: intentName,
          confidence: Math.min(score, 1.0),
          details: { keywordScore, patternScore, contextScore }
        });
      }
    }

    // Return highest confidence intent
    results.sort((a, b) => b.confidence - a.confidence);
    return results[0] || { name: 'UNKNOWN', confidence: 0 };
  }

  calculateKeywordScore(text, keywords) {
    const matches = keywords.filter(keyword => text.includes(keyword));
    return matches.length / keywords.length;
  }

  calculatePatternScore(text, patterns) {
    const matches = patterns.filter(pattern => pattern.test(text));
    return matches.length > 0 ? 1 : 0;
  }

  calculateContextScore(intentName, context) {
    // Add context-based scoring logic
    if (context.conversationState === 'initial' && intentName === 'CREATE_EMAIL') {
      return 0.2;
    }
    return 0;
  }
}

/**
 * Entity Extraction for contact info, companies, etc.
 */
class EntityExtractor {
  constructor() {
    this.patterns = this.initializeEntityPatterns();
  }

  initializeEntityPatterns() {
    return {
      EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      PHONE: /(?:\+33|0)[1-9](?:[.\-\s]?\d{2}){4}/g,
      CONTACT_NAME: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
      COMPANY: /\b[A-Z][A-Za-z]+(?:\s+[A-Z][A-Za-z]+)*\b/g
    };
  }

  async extract(text) {
    const entities = [];

    for (const [type, pattern] of Object.entries(this.patterns)) {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          entities.push({
            type,
            value: match,
            confidence: 0.8,
            start: text.indexOf(match),
            end: text.indexOf(match) + match.length
          });
        });
      }
    }

    return entities;
  }
}

/**
 * Sentiment Analysis for emotional context
 */
class SentimentAnalyzer {
  constructor() {
    this.positiveWords = ['excellent', 'parfait', 'super', 'génial', 'fantastique', 'merci'];
    this.negativeWords = ['problème', 'erreur', 'difficile', 'compliqué', 'frustrant'];
  }

  async analyze(text) {
    const words = text.split(/\s+/);
    let score = 0;

    words.forEach(word => {
      if (this.positiveWords.includes(word)) score += 1;
      if (this.negativeWords.includes(word)) score -= 1;
    });

    // Normalize score to -1 to 1 range
    const normalizedScore = Math.max(-1, Math.min(1, score / words.length * 10));

    return {
      score: normalizedScore,
      label: normalizedScore > 0.2 ? 'positive' : normalizedScore < -0.2 ? 'negative' : 'neutral',
      confidence: Math.abs(normalizedScore)
    };
  }
}

/**
 * Context Management for conversation flow
 */
class ContextManager {
  constructor() {
    this.conversationHistory = new Map();
  }

  updateContext(currentContext, intent, entities) {
    const updatedContext = {
      ...currentContext,
      lastIntent: intent,
      lastEntities: entities,
      timestamp: new Date().toISOString(),
      turnCount: (currentContext.turnCount || 0) + 1
    };

    return updatedContext;
  }

  getConversationFlow(context) {
    // Determine next best action based on context
    if (!context.lastIntent) {
      return 'initial_greeting';
    }

    if (context.lastIntent.name === 'CREATE_EMAIL' && !context.lastEntities?.length) {
      return 'gather_contact_info';
    }

    return 'continue_conversation';
  }
}

// Export the main NLP engine
export const advancedNLPEngine = new AdvancedNLPEngine();