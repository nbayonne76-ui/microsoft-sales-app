/**
 * Enhanced NLP Analyzer - Production-ready integration
 * Enhances existing QnAMaker with advanced NLP capabilities
 */

// import { contextualSentimentEntityAnalyzer } from './contextual-sentiment-entity-analyzer.js';

export class EnhancedNLPAnalyzer {
  constructor() {
    this.initializeAnalyzers();
  }

  initializeAnalyzers() {
    this.intentClassifier = new AdvancedIntentClassifier();
    this.entityExtractor = new SmartEntityExtractor();
    this.sentimentAnalyzer = new FrenchSentimentAnalyzer();
    this.confidenceCalculator = new ConfidenceCalculator();
    this.conversationMemory = new ConversationMemory();
  }

  /**
   * Enhanced analysis method that extends existing QnAMaker
   */
  async analyzeEnhanced(message, conversationState = 'initial', emailData = {}, conversationHistory = []) {
    const startTime = Date.now();

    // Store conversation context
    const sessionId = this.generateSessionId(emailData);
    const context = this.conversationMemory.getContext(sessionId);

    const analysis = {
      // Original QnA structure maintained for compatibility
      intent: null,
      confidence: 0,
      suggestions: [],
      errors: [],
      contextualHelp: null,
      response: null,

      // Enhanced NLP features
      enhancedAnalysis: {
        entities: [],
        sentiment: null,
        contextScore: 0,
        processingTime: 0,
        sessionId: sessionId,
        turnCount: context.turnCount + 1,
        conversationFlow: null
      }
    };

    try {
      // 1. Enhanced Intent Classification
      const intentResult = await this.intentClassifier.classifyAdvanced(
        message,
        conversationState,
        context
      );

      analysis.intent = intentResult.intent;
      analysis.confidence = intentResult.confidence;

      // 2. Smart Entity Extraction
      analysis.enhancedAnalysis.entities = await this.entityExtractor.extractEntities(
        message,
        intentResult.intent
      );

      // 3. Sentiment Analysis
      analysis.enhancedAnalysis.sentiment = await this.sentimentAnalyzer.analyzeFrench(message);

      // 4.5. Contextual Sentiment-Entity Analysis (disabled temporarily)
      // analysis.enhancedAnalysis.entitySentimentAnalysis = await contextualSentimentEntityAnalyzer.analyzeEntitySentiment(
      //   analysis.originalMessage,
      //   analysis.enhancedAnalysis.entities,
      //   analysis.enhancedAnalysis.sentiment
      // );
      analysis.enhancedAnalysis.entitySentimentAnalysis = null;

      // 4. Context Integration
      analysis.enhancedAnalysis.contextScore = this.calculateContextRelevance(
        intentResult,
        conversationState,
        context
      );

      // 5. Enhanced Response Generation
      const responseData = await this.generateEnhancedResponse(
        analysis,
        conversationState,
        emailData
      );

      analysis.response = responseData.response;
      analysis.suggestions = responseData.suggestions;

      // 6. Update conversation memory
      this.conversationMemory.updateContext(sessionId, {
        message,
        intent: analysis.intent,
        entities: analysis.enhancedAnalysis.entities,
        sentiment: analysis.enhancedAnalysis.sentiment,
        timestamp: new Date().toISOString()
      });

      analysis.enhancedAnalysis.processingTime = Date.now() - startTime;

      return analysis;

    } catch (error) {
      console.error('Enhanced NLP Analysis Error:', error);

      // Fallback to basic analysis
      return this.fallbackAnalysis(message, conversationState, emailData);
    }
  }

  /**
   * Generate session ID for conversation tracking
   */
  generateSessionId(emailData) {
    // Use email data or create session-based ID
    return emailData.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate context relevance score
   */
  calculateContextRelevance(intentResult, conversationState, context) {
    let score = 0;

    // State continuity bonus
    if (this.isValidStateTransition(context.lastIntent, intentResult.intent, conversationState)) {
      score += 0.3;
    }

    // Entity consistency bonus
    if (this.hasConsistentEntities(context.lastEntities, intentResult.entities)) {
      score += 0.2;
    }

    // Conversation flow bonus
    if (this.followsLogicalFlow(context.conversationFlow, intentResult.intent)) {
      score += 0.3;
    }

    // Recent context bonus
    if (context.turnCount > 0 && context.turnCount < 5) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * Enhanced response generation with sentiment and context
   */
  async generateEnhancedResponse(analysis, conversationState, emailData) {
    const { intent, enhancedAnalysis } = analysis;
    const { sentiment, entities, contextScore } = enhancedAnalysis;

    // Sentiment-aware response adjustment
    let responseData = await this.generateBaseResponse(intent, conversationState, emailData);

    // Adjust tone based on sentiment
    if (sentiment) {
      responseData = this.adjustResponseForSentiment(responseData, sentiment);
    }

    // Add entity-specific suggestions
    if (entities.length > 0) {
      responseData.suggestions = this.enhanceSuggestionsWithEntities(responseData.suggestions, entities);
    }

    // Context-aware improvements
    if (contextScore > 0.7) {
      responseData = this.addContextualInsights(responseData, analysis);
    }

    return responseData;
  }

  /**
   * Adjust response tone based on sentiment
   */
  adjustResponseForSentiment(responseData, sentiment) {
    if (sentiment.label === 'positive' && sentiment.confidence > 0.6) {
      // Add enthusiasm for positive sentiment
      responseData.response = responseData.response.replace(/^/, '😊 ');
      responseData.response += '\n\nJ\'apprécie votre enthousiasme !';
    } else if (sentiment.label === 'negative' && sentiment.confidence > 0.6) {
      // Add reassurance for negative sentiment
      responseData.response = responseData.response.replace(/^/, '🤝 ');
      responseData.response += '\n\nJe suis là pour vous aider et simplifier le processus.';
    } else if (sentiment.label === 'urgent') {
      // Add urgency handling
      responseData.response = responseData.response.replace(/^/, '⚡ ');
      responseData.suggestions.unshift('🚀 Traitement prioritaire');
    }

    return responseData;
  }

  /**
   * Fallback to basic analysis if enhanced fails
   */
  fallbackAnalysis(message, conversationState, emailData) {
    return {
      intent: 'UNKNOWN',
      confidence: 0.3,
      suggestions: ['❓ Besoin d\'aide ?', '📧 Créer un email', '🔄 Recommencer'],
      errors: [],
      response: 'Je peux vous aider à créer un email. Pouvez-vous préciser ce que vous souhaitez faire ?',
      enhancedAnalysis: {
        fallback: true,
        processingTime: 0
      }
    };
  }

  // Helper methods
  isValidStateTransition(lastIntent, currentIntent, state) {
    const validTransitions = {
      'CREATE_EMAIL': ['PROSPECT_CONTACT', 'MEETING_FOLLOWUP'],
      'PROSPECT_CONTACT': ['NEED_INFO', 'GENERATE_EMAIL'],
      'NEED_INFO': ['PROVIDE_INFO', 'GENERATE_EMAIL']
    };

    return validTransitions[lastIntent]?.includes(currentIntent) || false;
  }

  hasConsistentEntities(lastEntities = [], currentEntities = []) {
    if (!lastEntities.length || !currentEntities.length) return false;

    return currentEntities.some(curr =>
      lastEntities.some(last =>
        last.type === curr.type &&
        this.similarityScore(last.value, curr.value) > 0.7
      )
    );
  }

  similarityScore(str1, str2) {
    // Simple similarity calculation
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
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

  followsLogicalFlow(conversationFlow, currentIntent) {
    // Implement logical flow checking
    return true; // Simplified for now
  }

  enhanceSuggestionsWithEntities(suggestions, entities) {
    const entitySuggestions = [];

    entities.forEach(entity => {
      switch (entity.type) {
        case 'CONTACT_NAME':
          entitySuggestions.push(`👤 Personnaliser pour ${entity.value}`);
          break;
        case 'COMPANY':
          entitySuggestions.push(`🏢 Analyser ${entity.value}`);
          break;
        case 'EMAIL':
          entitySuggestions.push(`📧 Envoyer à ${entity.value}`);
          break;
      }
    });

    return [...entitySuggestions.slice(0, 2), ...suggestions];
  }

  addContextualInsights(responseData, analysis) {
    const insights = [];

    if (analysis.enhancedAnalysis.turnCount > 3) {
      insights.push('💡 Basé sur notre conversation, je peux personnaliser davantage');
    }

    if (analysis.enhancedAnalysis.entities.length > 2) {
      insights.push('🎯 J\'ai identifié plusieurs éléments clés pour personnaliser votre email');
    }

    if (insights.length > 0) {
      responseData.response += '\n\n' + insights.join('\n');
    }

    return responseData;
  }

  async generateBaseResponse(intent, conversationState, emailData) {
    // Use existing response generation logic as base
    const baseResponses = {
      'CREATE_EMAIL': {
        response: '🎯 **Parfait ! Créons votre email.**\n\nDites-moi le type d\'email souhaité ou donnez-moi directement les informations du contact.',
        suggestions: ['🎯 Nouveau prospect', '📧 Suivi réunion', '💼 Proposition commerciale']
      },
      'PROSPECT_CONTACT': {
        response: '💼 **Nouveau prospect identifié !**\n\nJ\'ai besoin de quelques informations pour personnaliser l\'email.',
        suggestions: ['📝 Donner les infos', '🎯 Type de contact', '❓ Voir des exemples']
      },
      'NEED_HELP': {
        response: '❓ **Je suis là pour vous aider !**\n\nQue souhaitez-vous faire ?',
        suggestions: ['📧 Créer un email', '👥 Contacter un prospect', '📋 Voir mes options']
      }
    };

    return baseResponses[intent] || baseResponses['NEED_HELP'];
  }
}

/**
 * Advanced Intent Classifier with machine learning-like capabilities
 */
class AdvancedIntentClassifier {
  constructor() {
    this.intentPatterns = this.initializeAdvancedPatterns();
    this.contextWeights = this.initializeContextWeights();
  }

  initializeAdvancedPatterns() {
    return {
      CREATE_EMAIL: {
        keywords: {
          primary: ['email', 'mail', 'message', 'écrire', 'envoyer', 'créer'],
          secondary: ['contacter', 'communiquer', 'correspondance'],
          negative: ['ne pas', 'éviter', 'arrêter']
        },
        patterns: [
          { regex: /(?:je (?:veux|souhaite|dois|voudrais).*(?:créer|envoyer|faire|écrire).*(?:email|mail|message))/i, weight: 0.9 },
          { regex: /(?:créer.*(?:email|mail|message))/i, weight: 0.8 },
          { regex: /(?:nouveau.*(?:email|mail|message))/i, weight: 0.7 }
        ],
        contextBoosts: {
          'initial': 0.2,
          'gathering_info': -0.1
        }
      },
      PROSPECT_CONTACT: {
        keywords: {
          primary: ['prospect', 'nouveau client', 'lead', 'contact commercial'],
          secondary: ['démarchage', 'acquisition', 'développement'],
          negative: ['ancien', 'existant', 'connait déjà']
        },
        patterns: [
          { regex: /(?:nouveau.*(?:prospect|client|contact))/i, weight: 0.9 },
          { regex: /(?:contacter.*(?:prospect|client))/i, weight: 0.8 },
          { regex: /(?:démarch.*)/i, weight: 0.7 }
        ],
        contextBoosts: {
          'initial': 0.1,
          'gathering_prospect_info': 0.3
        }
      },
      MEETING_FOLLOWUP: {
        keywords: {
          primary: ['suivi', 'réunion', 'meeting', 'rendez-vous', 'suite'],
          secondary: ['récapitulatif', 'résumé', 'prochaines étapes'],
          negative: ['première fois', 'nouveau', 'jamais vu']
        },
        patterns: [
          { regex: /(?:suivi.*(?:réunion|meeting|rdv))/i, weight: 0.9 },
          { regex: /(?:suite.*(?:échange|discussion))/i, weight: 0.8 },
          { regex: /(?:récap.*(?:réunion|meeting))/i, weight: 0.7 }
        ],
        contextBoosts: {
          'generating': 0.2,
          'review': 0.1
        }
      }
    };
  }

  initializeContextWeights() {
    return {
      conversationTurn: 0.1,
      stateConsistency: 0.2,
      entityPresence: 0.15,
      historicalPattern: 0.1
    };
  }

  async classifyAdvanced(message, conversationState, context) {
    const normalizedMessage = this.normalizeMessage(message);
    const results = [];

    for (const [intentName, config] of Object.entries(this.intentPatterns)) {
      let score = 0;

      // 1. Keyword analysis (weighted)
      const keywordScore = this.calculateAdvancedKeywordScore(normalizedMessage, config.keywords);
      score += keywordScore * 0.4;

      // 2. Pattern matching (weighted by pattern importance)
      const patternScore = this.calculateWeightedPatternScore(normalizedMessage, config.patterns);
      score += patternScore * 0.3;

      // 3. Context boost
      const contextBoost = config.contextBoosts[conversationState] || 0;
      score += contextBoost;

      // 4. Historical context from conversation
      const historyBoost = this.calculateHistoryBoost(intentName, context);
      score += historyBoost * 0.2;

      // 5. Entity consistency boost
      const entityBoost = this.calculateEntityConsistency(normalizedMessage, intentName);
      score += entityBoost * 0.1;

      if (score > 0.3) {
        results.push({
          intent: intentName,
          confidence: Math.min(score, 1.0),
          details: { keywordScore, patternScore, contextBoost, historyBoost, entityBoost }
        });
      }
    }

    // Return highest confidence intent
    results.sort((a, b) => b.confidence - a.confidence);
    return results[0] || { intent: 'UNKNOWN', confidence: 0, details: {} };
  }

  normalizeMessage(message) {
    return message
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ');
  }

  calculateAdvancedKeywordScore(text, keywords) {
    let score = 0;
    const words = text.split(' ');

    // Primary keywords (high weight)
    const primaryMatches = keywords.primary.filter(keyword =>
      words.some(word => word.includes(keyword) || keyword.includes(word))
    );
    score += (primaryMatches.length / keywords.primary.length) * 0.7;

    // Secondary keywords (medium weight)
    const secondaryMatches = keywords.secondary.filter(keyword =>
      words.some(word => word.includes(keyword) || keyword.includes(word))
    );
    score += (secondaryMatches.length / keywords.secondary.length) * 0.3;

    // Negative keywords (penalty)
    const negativeMatches = keywords.negative.filter(keyword =>
      words.some(word => word.includes(keyword) || keyword.includes(word))
    );
    score -= (negativeMatches.length / keywords.negative.length) * 0.4;

    return Math.max(0, score);
  }

  calculateWeightedPatternScore(text, patterns) {
    let totalScore = 0;
    let totalWeight = 0;

    patterns.forEach(patternConfig => {
      if (patternConfig.regex.test(text)) {
        totalScore += patternConfig.weight;
      }
      totalWeight += patternConfig.weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  calculateHistoryBoost(intentName, context) {
    if (!context.conversationHistory) return 0;

    const recentIntents = context.conversationHistory
      .slice(-3)
      .map(turn => turn.intent)
      .filter(intent => intent === intentName);

    // Slight boost for consistent intent patterns
    return recentIntents.length > 0 ? 0.1 : 0;
  }

  calculateEntityConsistency(text, intentName) {
    // Entity patterns that support specific intents
    const entityPatterns = {
      'PROSPECT_CONTACT': [/@\w+\.\w+/, /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/],
      'MEETING_FOLLOWUP': [/\b\d{1,2}\/\d{1,2}\b/, /\bréunion\b/, /\bmeeting\b/],
      'CREATE_EMAIL': [/@/, /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/]
    };

    const patterns = entityPatterns[intentName] || [];
    const matches = patterns.filter(pattern => pattern.test(text));

    return matches.length / (patterns.length || 1) * 0.2;
  }
}

/**
 * Smart Entity Extractor with context awareness
 */
class SmartEntityExtractor {
  constructor() {
    this.entityPatterns = this.initializeEntityPatterns();
  }

  initializeEntityPatterns() {
    return {
      EMAIL: {
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        confidence: 0.95,
        type: 'CONTACT_INFO'
      },
      PHONE_FR: {
        pattern: /(?:\+33|0)[1-9](?:[.\-\s]?\d{2}){4}/g,
        confidence: 0.9,
        type: 'CONTACT_INFO'
      },
      CONTACT_NAME: {
        pattern: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
        confidence: 0.8,
        type: 'PERSON'
      },
      COMPANY_NAME: {
        pattern: /\b[A-Z][A-Za-z&\s]{2,}(?:\s+(?:SAS|SARL|SA|EURL|SNC)|\s+(?:Corp|Inc|Ltd|LLC))?\b/g,
        confidence: 0.75,
        type: 'ORGANIZATION'
      },
      MICROSOFT_SOLUTION: {
        pattern: /\b(?:Azure|Office\s*365|Microsoft\s*365|Teams|Power\s*Platform|Dynamics|SharePoint|Exchange)\b/gi,
        confidence: 0.9,
        type: 'TECHNOLOGY'
      },
      DATE: {
        pattern: /\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/g,
        confidence: 0.8,
        type: 'TEMPORAL'
      }
    };
  }

  async extractEntities(text, intent = null) {
    const entities = [];

    for (const [entityType, config] of Object.entries(this.entityPatterns)) {
      const matches = Array.from(text.matchAll(config.pattern));

      matches.forEach(match => {
        const entity = {
          type: config.type,
          subtype: entityType,
          value: match[0].trim(),
          confidence: this.calculateEntityConfidence(config.confidence, match[0], intent),
          start: match.index,
          end: match.index + match[0].length,
          context: this.extractEntityContext(text, match.index, match[0].length)
        };

        // Validate entity
        if (this.validateEntity(entity, intent)) {
          entities.push(entity);
        }
      });
    }

    // Remove duplicates and low-confidence entities
    return this.cleanupEntities(entities);
  }

  calculateEntityConfidence(baseConfidence, entityValue, intent) {
    let confidence = baseConfidence;

    // Length-based adjustment
    if (entityValue.length < 3) confidence *= 0.7;
    if (entityValue.length > 20) confidence *= 0.9;

    // Intent-based boost
    if (intent) {
      const intentBoosts = {
        'PROSPECT_CONTACT': { 'PERSON': 0.1, 'ORGANIZATION': 0.1, 'CONTACT_INFO': 0.15 },
        'MEETING_FOLLOWUP': { 'TEMPORAL': 0.2, 'PERSON': 0.05 },
        'CREATE_EMAIL': { 'CONTACT_INFO': 0.1, 'PERSON': 0.1 }
      };

      const boost = intentBoosts[intent]?.[entityValue] || 0;
      confidence += boost;
    }

    return Math.min(confidence, 1.0);
  }

  validateEntity(entity, intent) {
    // Basic validation rules
    if (entity.confidence < 0.5) return false;
    if (entity.value.length < 2) return false;

    // Type-specific validation
    switch (entity.subtype) {
      case 'EMAIL':
        return entity.value.includes('@') && entity.value.includes('.');
      case 'CONTACT_NAME':
        return /^[A-Z][a-z]+\s+[A-Z][a-z]+$/.test(entity.value);
      case 'COMPANY_NAME':
        return entity.value.length > 2 && /[A-Z]/.test(entity.value);
      default:
        return true;
    }
  }

  extractEntityContext(text, start, length) {
    const contextStart = Math.max(0, start - 20);
    const contextEnd = Math.min(text.length, start + length + 20);
    return text.slice(contextStart, contextEnd).trim();
  }

  cleanupEntities(entities) {
    // Remove duplicates
    const uniqueEntities = entities.filter((entity, index, arr) =>
      index === arr.findIndex(e =>
        e.type === entity.type &&
        e.value.toLowerCase() === entity.value.toLowerCase()
      )
    );

    // Sort by confidence
    uniqueEntities.sort((a, b) => b.confidence - a.confidence);

    // Remove low-confidence entities if we have high-confidence ones of the same type
    return uniqueEntities.filter(entity =>
      entity.confidence > 0.6 ||
      !uniqueEntities.some(other =>
        other.type === entity.type &&
        other.confidence > entity.confidence + 0.2
      )
    );
  }
}

/**
 * French Sentiment Analyzer optimized for business communication
 */
class FrenchSentimentAnalyzer {
  constructor() {
    this.sentimentDictionary = this.initializeFrenchSentimentDictionary();
  }

  initializeFrenchSentimentDictionary() {
    return {
      positive: {
        high: ['excellent', 'parfait', 'fantastique', 'génial', 'superbe', 'remarquable'],
        medium: ['bien', 'bon', 'intéressant', 'utile', 'pratique', 'efficace'],
        low: ['ok', 'correct', 'acceptable', 'possible']
      },
      negative: {
        high: ['terrible', 'catastrophique', 'inacceptable', 'horrible'],
        medium: ['problème', 'difficile', 'compliqué', 'frustrant', 'ennuyeux'],
        low: ['lent', 'moyen', 'limité']
      },
      urgent: {
        indicators: ['urgent', 'immédiat', 'rapidement', 'vite', 'asap', 'priorité', 'critique']
      },
      professional: {
        formal: ['monsieur', 'madame', 'cordialement', 'respectueusement'],
        casual: ['salut', 'bonjour', 'merci', 'à bientôt']
      }
    };
  }

  async analyzeFrench(text) {
    const normalizedText = text.toLowerCase();
    const words = normalizedText.split(/\s+/);

    let sentiment = {
      score: 0,
      label: 'neutral',
      confidence: 0,
      indicators: [],
      urgency: false,
      formality: 'neutral'
    };

    // Calculate sentiment score
    let positiveScore = this.calculateCategoryScore(words, this.sentimentDictionary.positive);
    let negativeScore = this.calculateCategoryScore(words, this.sentimentDictionary.negative);

    // Check for urgency indicators
    const urgencyIndicators = this.sentimentDictionary.urgent.indicators.filter(indicator =>
      normalizedText.includes(indicator)
    );
    sentiment.urgency = urgencyIndicators.length > 0;

    // Check formality level
    const formalWords = this.sentimentDictionary.professional.formal.filter(word =>
      normalizedText.includes(word)
    );
    const casualWords = this.sentimentDictionary.professional.casual.filter(word =>
      normalizedText.includes(word)
    );

    if (formalWords.length > casualWords.length) {
      sentiment.formality = 'formal';
    } else if (casualWords.length > formalWords.length) {
      sentiment.formality = 'casual';
    }

    // Calculate final sentiment
    const netScore = positiveScore - negativeScore;
    sentiment.score = Math.max(-1, Math.min(1, netScore / words.length * 10));

    // Determine label
    if (sentiment.urgency) {
      sentiment.label = 'urgent';
    } else if (sentiment.score > 0.3) {
      sentiment.label = 'positive';
    } else if (sentiment.score < -0.3) {
      sentiment.label = 'negative';
    } else {
      sentiment.label = 'neutral';
    }

    // Calculate confidence
    sentiment.confidence = Math.min(
      Math.abs(sentiment.score) + (urgencyIndicators.length * 0.2),
      1.0
    );

    return sentiment;
  }

  calculateCategoryScore(words, category) {
    let score = 0;

    Object.entries(category).forEach(([intensity, wordList]) => {
      const matches = words.filter(word =>
        wordList.some(categoryWord =>
          word.includes(categoryWord) || categoryWord.includes(word)
        )
      );

      const multiplier = intensity === 'high' ? 3 : intensity === 'medium' ? 2 : 1;
      score += matches.length * multiplier;
    });

    return score;
  }
}

/**
 * Confidence Calculator for overall analysis confidence
 */
class ConfidenceCalculator {
  calculateOverallConfidence(intentConfidence, entityCount, sentimentConfidence, contextScore) {
    const weights = {
      intent: 0.4,
      entities: 0.2,
      sentiment: 0.2,
      context: 0.2
    };

    const entityScore = Math.min(entityCount / 3, 1.0); // Normalize entity count

    return (
      intentConfidence * weights.intent +
      entityScore * weights.entities +
      sentimentConfidence * weights.sentiment +
      contextScore * weights.context
    );
  }
}

/**
 * Conversation Memory for context tracking
 */
class ConversationMemory {
  constructor() {
    this.sessions = new Map();
    this.maxSessionAge = 30 * 60 * 1000; // 30 minutes
  }

  getContext(sessionId) {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return this.createNewSession(sessionId);
    }

    // Check if session is expired
    if (Date.now() - session.lastActivity > this.maxSessionAge) {
      this.sessions.delete(sessionId);
      return this.createNewSession(sessionId);
    }

    return session;
  }

  createNewSession(sessionId) {
    const newSession = {
      sessionId,
      turnCount: 0,
      conversationHistory: [],
      lastIntent: null,
      lastEntities: [],
      lastSentiment: null,
      conversationFlow: [],
      created: Date.now(),
      lastActivity: Date.now()
    };

    this.sessions.set(sessionId, newSession);
    return newSession;
  }

  updateContext(sessionId, turnData) {
    const session = this.getContext(sessionId);

    session.turnCount++;
    session.lastActivity = Date.now();
    session.lastIntent = turnData.intent;
    session.lastEntities = turnData.entities;
    session.lastSentiment = turnData.sentiment;

    // Keep last 10 turns
    session.conversationHistory.push({
      ...turnData,
      turnNumber: session.turnCount
    });

    if (session.conversationHistory.length > 10) {
      session.conversationHistory = session.conversationHistory.slice(-10);
    }

    // Update conversation flow
    session.conversationFlow.push(turnData.intent);
    if (session.conversationFlow.length > 5) {
      session.conversationFlow = session.conversationFlow.slice(-5);
    }

    this.sessions.set(sessionId, session);
    return session;
  }

  // Cleanup expired sessions periodically
  cleanupExpiredSessions() {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions) {
      if (now - session.lastActivity > this.maxSessionAge) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Export the enhanced analyzer
export const enhancedNLPAnalyzer = new EnhancedNLPAnalyzer();

// Auto-cleanup expired sessions every 10 minutes
setInterval(() => {
  enhancedNLPAnalyzer.conversationMemory.cleanupExpiredSessions();
}, 10 * 60 * 1000);