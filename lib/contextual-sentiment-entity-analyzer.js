/**
 * Contextual Sentiment-Entity Analyzer
 * Advanced integration of entity recognition with sentiment analysis
 * for deeper understanding of user emotions about specific entities
 */

export class ContextualSentimentEntityAnalyzer {
  constructor() {
    this.initializeEntitySentimentRules();
    this.initializeContextualPatterns();
  }

  initializeEntitySentimentRules() {
    // Entity-specific sentiment indicators
    this.entitySentimentRules = {
      // Microsoft Solutions sentiment
      'TECHNOLOGY': {
        positive: {
          patterns: ['adoré', 'excellent', 'fantastique', 'parfait', 'impressionnant', 'remarquable'],
          context: ['avec', 'utilise', 'experience', 'résultats', 'performance']
        },
        negative: {
          patterns: ['problème', 'bug', 'lent', 'complexe', 'difficile', 'frustrant', 'déçu'],
          context: ['avec', 'utilise', 'experience', 'problèmes', 'issues']
        },
        urgent: {
          patterns: ['urgent', 'critique', 'bloqué', 'immédiat', 'panne', 'down'],
          context: ['avec', 'sur', 'concernant']
        }
      },

      // Person/Contact sentiment
      'PERSON': {
        positive: {
          patterns: ['excellent', 'professionnel', 'compétent', 'aidé', 'sympa', 'efficace'],
          context: ['contact', 'échange', 'collaboration', 'travail']
        },
        negative: {
          patterns: ['difficile', 'non-réactif', 'problématique', 'incompétent'],
          context: ['contact', 'échange', 'collaboration', 'communication']
        },
        urgent: {
          patterns: ['urgent', 'immédiat', 'asap', 'priorité'],
          context: ['contacter', 'joindre', 'répondre']
        }
      },

      // Company sentiment
      'ORGANIZATION': {
        positive: {
          patterns: ['partenaire', 'excellent', 'fiable', 'professionnel', 'recommande'],
          context: ['collaboration', 'partenariat', 'travail', 'experience']
        },
        negative: {
          patterns: ['problèmes', 'difficultés', 'déçu', 'insatisfait', 'changement'],
          context: ['avec', 'chez', 'collaboration', 'contrat']
        },
        competitive: {
          patterns: ['concurrent', 'alternative', 'comparaison', 'vs', 'contre'],
          context: ['par rapport', 'comparé', 'versus']
        }
      }
    };
  }

  initializeContextualPatterns() {
    // Patterns for entity-sentiment relationship detection
    this.contextualPatterns = {
      // "Entity + sentiment" patterns
      entitySentimentProximity: {
        // e.g., "Azure est fantastique", "Jean est difficile à joindre"
        adjacent: /(\w+)\s+(est|était|sera|devient)\s+(\w+)/gi,
        // e.g., "Problème avec Teams", "Excellente expérience Microsoft"
        withPreposition: /(problème|excellent|difficile|fantastique)\s+(avec|sur|concernant|chez)\s+(\w+)/gi,
        // e.g., "Teams fonctionne mal", "Azure marche parfaitement"
        actionBased: /(\w+)\s+(fonctionne|marche|work)\s+(bien|mal|parfaitement|lentement)/gi
      },

      // Sentiment about actions with entities
      actionSentiment: {
        // e.g., "Migration Azure urgente", "Appel Jean immédiat"
        urgentActions: /(migration|appel|email|contact|réunion)\s+(\w+)\s+(urgent|immédiat|prioritaire)/gi,
        // e.g., "Formation Teams nécessaire", "Support Azure requis"
        needBasedActions: /(formation|support|aide|assistance)\s+(\w+)\s+(nécessaire|requis|demandé)/gi
      }
    };
  }

  /**
   * Analyze sentiment in context of specific entities
   */
  async analyzeEntitySentiment(text, entities, globalSentiment) {
    const results = {
      entitySentiments: [],
      contextualInsights: [],
      priorityEntities: [],
      actionableInsights: []
    };

    // For each detected entity, analyze sentiment in its context
    for (const entity of entities) {
      const entitySentiment = await this.analyzeSentimentForEntity(text, entity, globalSentiment);
      if (entitySentiment) {
        results.entitySentiments.push(entitySentiment);
      }
    }

    // Generate contextual insights
    results.contextualInsights = await this.generateContextualInsights(results.entitySentiments, globalSentiment);

    // Identify priority entities (negative sentiment = higher priority)
    results.priorityEntities = this.identifyPriorityEntities(results.entitySentiments);

    // Generate actionable insights
    results.actionableInsights = this.generateActionableInsights(results.entitySentiments, entities);

    return results;
  }

  /**
   * Analyze sentiment for a specific entity
   */
  async analyzeSentimentForEntity(text, entity, globalSentiment) {
    const entityValue = entity.value.toLowerCase();
    const entityType = entity.type;

    // Extract context window around the entity
    const contextWindow = this.extractEntityContext(text, entity, 50); // 50 chars before/after

    // Check entity-specific sentiment rules
    const entityRules = this.entitySentimentRules[entityType];
    if (!entityRules) return null;

    let detectedSentiment = { label: 'neutral', confidence: 0, indicators: [] };

    // Check each sentiment category for this entity type
    for (const [sentimentType, rules] of Object.entries(entityRules)) {
      const sentimentScore = this.calculateEntitySentimentScore(contextWindow, rules, entityValue);

      if (sentimentScore.score > detectedSentiment.confidence) {
        detectedSentiment = {
          label: sentimentType,
          confidence: sentimentScore.score,
          indicators: sentimentScore.indicators,
          contextMatches: sentimentScore.contextMatches
        };
      }
    }

    // Check contextual patterns
    const contextualMatches = this.findContextualPatterns(text, entity);

    return {
      entity: entity,
      sentiment: detectedSentiment,
      contextualMatches: contextualMatches,
      priority: this.calculateEntityPriority(detectedSentiment, globalSentiment),
      actionRequired: this.determineActionRequired(detectedSentiment, entity)
    };
  }

  /**
   * Calculate sentiment score for entity based on rules
   */
  calculateEntitySentimentScore(contextWindow, rules, entityValue) {
    let score = 0;
    const indicators = [];
    const contextMatches = [];

    // Check sentiment patterns
    rules.patterns.forEach(pattern => {
      if (contextWindow.toLowerCase().includes(pattern)) {
        score += 0.3;
        indicators.push(pattern);
      }
    });

    // Check context patterns
    rules.context.forEach(contextWord => {
      if (contextWindow.toLowerCase().includes(contextWord)) {
        score += 0.2;
        contextMatches.push(contextWord);
      }
    });

    // Proximity bonus - closer to entity = higher score
    const entityPosition = contextWindow.toLowerCase().indexOf(entityValue);
    if (entityPosition !== -1) {
      const proximityBonus = Math.max(0, (50 - Math.abs(entityPosition - contextWindow.length/2)) / 50) * 0.3;
      score += proximityBonus;
    }

    return {
      score: Math.min(score, 1.0),
      indicators,
      contextMatches
    };
  }

  /**
   * Extract context around entity
   */
  extractEntityContext(text, entity, windowSize) {
    const start = Math.max(0, entity.start - windowSize);
    const end = Math.min(text.length, entity.end + windowSize);
    return text.slice(start, end);
  }

  /**
   * Find contextual patterns linking entities and sentiment
   */
  findContextualPatterns(text, entity) {
    const matches = [];

    for (const [patternType, patterns] of Object.entries(this.contextualPatterns)) {
      if (typeof patterns === 'object' && !patterns.exec) {
        // Handle nested pattern groups
        for (const [subType, pattern] of Object.entries(patterns)) {
          const patternMatches = Array.from(text.matchAll(pattern));
          patternMatches.forEach(match => {
            if (match[0].toLowerCase().includes(entity.value.toLowerCase())) {
              matches.push({
                type: `${patternType}.${subType}`,
                match: match[0],
                groups: match.slice(1),
                position: match.index
              });
            }
          });
        }
      }
    }

    return matches;
  }

  /**
   * Generate contextual insights from entity sentiments
   */
  async generateContextualInsights(entitySentiments, globalSentiment) {
    const insights = [];

    // Technology sentiment insights
    const techEntities = entitySentiments.filter(es => es.entity.type === 'TECHNOLOGY');
    if (techEntities.length > 0) {
      const negativeTech = techEntities.filter(es => es.sentiment.label === 'negative');
      const urgentTech = techEntities.filter(es => es.sentiment.label === 'urgent');

      if (negativeTech.length > 0) {
        insights.push({
          type: 'technology_issues',
          message: `Problèmes détectés avec ${negativeTech.map(t => t.entity.value).join(', ')}`,
          priority: 'high',
          action: 'provide_technical_support'
        });
      }

      if (urgentTech.length > 0) {
        insights.push({
          type: 'urgent_technology',
          message: `Demande urgente concernant ${urgentTech.map(t => t.entity.value).join(', ')}`,
          priority: 'critical',
          action: 'immediate_response'
        });
      }
    }

    // Contact sentiment insights
    const personEntities = entitySentiments.filter(es => es.entity.type === 'PERSON');
    if (personEntities.length > 0) {
      const urgentContacts = personEntities.filter(es => es.sentiment.label === 'urgent');

      if (urgentContacts.length > 0) {
        insights.push({
          type: 'urgent_contact',
          message: `Contact urgent requis avec ${urgentContacts.map(p => p.entity.value).join(', ')}`,
          priority: 'high',
          action: 'prioritize_communication'
        });
      }
    }

    // Cross-entity insights
    if (globalSentiment.label === 'negative' && entitySentiments.length > 1) {
      insights.push({
        type: 'multiple_concerns',
        message: 'Plusieurs préoccupations détectées nécessitant une attention coordonnée',
        priority: 'medium',
        action: 'comprehensive_support'
      });
    }

    return insights;
  }

  /**
   * Identify priority entities based on sentiment
   */
  identifyPriorityEntities(entitySentiments) {
    return entitySentiments
      .filter(es => es.sentiment.label === 'urgent' || es.sentiment.label === 'negative')
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3); // Top 3 priority entities
  }

  /**
   * Calculate priority score for entity
   */
  calculateEntityPriority(entitySentiment, globalSentiment) {
    let priority = 0;

    // Sentiment-based priority
    switch (entitySentiment.label) {
      case 'urgent': priority += 80; break;
      case 'negative': priority += 60; break;
      case 'positive': priority += 20; break;
      default: priority += 10;
    }

    // Confidence boost
    priority += entitySentiment.confidence * 20;

    // Global sentiment influence
    if (globalSentiment.label === 'negative') priority += 10;

    return Math.min(priority, 100);
  }

  /**
   * Determine action required based on entity sentiment
   */
  determineActionRequired(entitySentiment, entity) {
    const actions = [];

    switch (entitySentiment.label) {
      case 'urgent':
        actions.push({
          type: 'immediate_response',
          message: `Réponse immédiate requise concernant ${entity.value}`,
          timeline: 'immediate'
        });
        break;

      case 'negative':
        if (entity.type === 'TECHNOLOGY') {
          actions.push({
            type: 'technical_support',
            message: `Support technique pour ${entity.value}`,
            timeline: 'within_24h'
          });
        } else if (entity.type === 'PERSON') {
          actions.push({
            type: 'relationship_management',
            message: `Gestion de la relation avec ${entity.value}`,
            timeline: 'within_48h'
          });
        }
        break;

      case 'positive':
        actions.push({
          type: 'leverage_satisfaction',
          message: `Capitaliser sur la satisfaction avec ${entity.value}`,
          timeline: 'when_appropriate'
        });
        break;
    }

    return actions;
  }

  /**
   * Generate actionable insights for email generation
   */
  generateActionableInsights(entitySentiments, allEntities) {
    const insights = [];

    // Priority-based email suggestions
    const urgentEntities = entitySentiments.filter(es => es.sentiment.label === 'urgent');
    if (urgentEntities.length > 0) {
      insights.push({
        type: 'email_urgency',
        suggestion: 'Utiliser un ton urgent et proposer une action immédiate',
        entities: urgentEntities.map(e => e.entity.value),
        implementation: 'Add urgency indicators and immediate action items'
      });
    }

    // Technology-specific insights
    const techProblems = entitySentiments.filter(es =>
      es.entity.type === 'TECHNOLOGY' && es.sentiment.label === 'negative'
    );
    if (techProblems.length > 0) {
      insights.push({
        type: 'technical_support_focus',
        suggestion: 'Inclure des ressources de support technique et escalation',
        entities: techProblems.map(e => e.entity.value),
        implementation: 'Include technical support links and escalation contacts'
      });
    }

    // Relationship insights
    const personSentiments = entitySentiments.filter(es => es.entity.type === 'PERSON');
    if (personSentiments.length > 0) {
      const avgSentiment = personSentiments.reduce((sum, es) => {
        const score = es.sentiment.label === 'positive' ? 1 :
                     es.sentiment.label === 'negative' ? -1 : 0;
        return sum + score;
      }, 0) / personSentiments.length;

      if (avgSentiment < 0) {
        insights.push({
          type: 'relationship_repair',
          suggestion: 'Adopter un ton conciliant et proposer des solutions',
          entities: personSentiments.map(e => e.entity.value),
          implementation: 'Use apologetic tone and solution-focused content'
        });
      }
    }

    return insights;
  }

  /**
   * Enhance email generation with entity-sentiment insights
   */
  enhanceEmailWithEntitySentiment(emailContent, entitySentimentAnalysis) {
    const { entitySentiments, contextualInsights, actionableInsights } = entitySentimentAnalysis;

    // Modify email tone based on entity sentiments
    let enhancedContent = { ...emailContent };

    // Urgency adjustments
    const urgentEntities = entitySentiments.filter(es => es.sentiment.label === 'urgent');
    if (urgentEntities.length > 0) {
      enhancedContent.subject = '🚨 URGENT - ' + enhancedContent.subject;
      enhancedContent.body = enhancedContent.body.replace(
        /^/,
        '⚡ **DEMANDE URGENTE** - Réponse requise rapidement\n\n'
      );
    }

    // Technology problem handling
    const techProblems = entitySentiments.filter(es =>
      es.entity.type === 'TECHNOLOGY' && es.sentiment.label === 'negative'
    );
    if (techProblems.length > 0) {
      enhancedContent.body += '\n\n🔧 **Support technique disponible :**\n';
      enhancedContent.body += '• Escalation vers nos experts\n';
      enhancedContent.body += '• Documentation détaillée\n';
      enhancedContent.body += '• Session de résolution guidée';
    }

    // Relationship management
    const negativePersonSentiments = entitySentiments.filter(es =>
      es.entity.type === 'PERSON' && es.sentiment.label === 'negative'
    );
    if (negativePersonSentiments.length > 0) {
      enhancedContent.body = enhancedContent.body.replace(
        /^/,
        '🤝 Je comprends vos préoccupations et souhaite m\'assurer de vous apporter la meilleure solution.\n\n'
      );
    }

    // Add metadata for tracking
    enhancedContent.metadata = {
      ...enhancedContent.metadata,
      entitySentimentAnalysis,
      enhancementApplied: true,
      priorityLevel: Math.max(...entitySentiments.map(es => es.priority))
    };

    return enhancedContent;
  }
}

// Export the analyzer
export const contextualSentimentEntityAnalyzer = new ContextualSentimentEntityAnalyzer();