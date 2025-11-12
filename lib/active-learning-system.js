/**
 * Active Learning System for AI Chatbot
 * Continuously improves the chatbot through user feedback and performance monitoring
 */

import { semanticKnowledgeMiner } from './semantic-knowledge-miner.js';
import { automatedContentGenerator } from './automated-content-generator.js';
import { automaticThresholdTuner } from './automatic-threshold-tuner.js';

export class ActiveLearningSystem {
  constructor() {
    // Use dynamic thresholds from the threshold tuner
    this.getConfidenceThresholds = () => automaticThresholdTuner.getCurrentThresholds().confidence;

    this.learningData = {
      uncertainSamples: [],
      feedbackHistory: [],
      performanceMetrics: {},
      retraining_queue: []
    };

    this.initializeMetrics();
  }

  initializeMetrics() {
    this.performanceMetrics = {
      intent_classification: {
        accuracy: 0.85,
        precision: { CREATE_EMAIL: 0.90, KNOWLEDGE_QUESTION: 0.82, OUT_OF_DOMAIN: 0.88 },
        recall: { CREATE_EMAIL: 0.88, KNOWLEDGE_QUESTION: 0.85, OUT_OF_DOMAIN: 0.90 },
        f1_score: { CREATE_EMAIL: 0.89, KNOWLEDGE_QUESTION: 0.83, OUT_OF_DOMAIN: 0.89 }
      },
      knowledge_base: {
        answer_relevance: 0.87,
        user_satisfaction: 0.83,
        coverage_gaps: []
      },
      email_generation: {
        user_approval_rate: 0.79,
        modification_frequency: 0.42,
        common_improvements: []
      }
    };
  }

  /**
   * Analyze interaction for learning opportunities
   */
  analyzeInteraction(interaction) {
    const {
      userMessage,
      botResponse,
      intent,
      confidence,
      knowledgeResults,
      userFeedback,
      sessionId,
      timestamp = new Date()
    } = interaction;

    const analysis = {
      needs_feedback: false,
      uncertainty_level: this.calculateUncertaintyLevel(confidence, intent),
      learning_opportunity: null,
      suggested_actions: []
    };

    // 1. Low confidence predictions - prime candidates for active learning
    const thresholds = this.getConfidenceThresholds();
    if (confidence < thresholds.medium) {
      analysis.needs_feedback = true;
      analysis.learning_opportunity = 'low_confidence_prediction';
      analysis.suggested_actions.push('request_user_confirmation');

      this.addUncertainSample({
        message: userMessage,
        predicted_intent: intent,
        confidence: confidence,
        session_id: sessionId,
        timestamp
      });
    }

    // 2. Conflicting predictions between different systems
    if (this.detectConflictingPredictions(interaction)) {
      analysis.needs_feedback = true;
      analysis.learning_opportunity = 'conflicting_predictions';
      analysis.suggested_actions.push('clarify_user_intent');
    }

    // 3. Knowledge base gaps
    if (intent === 'KNOWLEDGE_QUESTION' && (!knowledgeResults || knowledgeResults.length === 0)) {
      analysis.learning_opportunity = 'knowledge_gap';
      analysis.suggested_actions.push('suggest_knowledge_addition');

      this.trackKnowledgeGap(userMessage);
    }

    // 4. User corrections/negative feedback
    if (userFeedback && userFeedback.type === 'correction') {
      analysis.learning_opportunity = 'user_correction';
      analysis.suggested_actions.push('update_training_data');

      this.processUserCorrection(userMessage, intent, userFeedback.corrected_intent);
    }

    return analysis;
  }

  /**
   * Calculate uncertainty level of a prediction
   */
  calculateUncertaintyLevel(confidence, intent) {
    const thresholds = this.getConfidenceThresholds();
    if (confidence >= thresholds.high) {
      return 'low';
    } else if (confidence >= thresholds.medium) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  /**
   * Detect when different AI systems give conflicting predictions
   */
  detectConflictingPredictions(interaction) {
    const { luisIntent, qnaIntent, enhancedNLPIntent, confidences } = interaction;

    if (!luisIntent || !qnaIntent) return false;

    // Check if top intents are different
    const intents = [luisIntent, qnaIntent, enhancedNLPIntent].filter(Boolean);
    const uniqueIntents = [...new Set(intents)];

    // If we have multiple different high-confidence predictions, it's conflicting
    if (uniqueIntents.length > 1) {
      const highConfidencePredictions = Object.entries(confidences || {})
        .filter(([intent, conf]) => conf > this.confidenceThresholds.medium)
        .length;

      return highConfidencePredictions > 1;
    }

    return false;
  }

  /**
   * Add uncertain sample for potential retraining
   */
  addUncertainSample(sample) {
    this.learningData.uncertainSamples.push({
      ...sample,
      id: this.generateSampleId(),
      status: 'pending_review',
      priority: this.calculateSamplePriority(sample)
    });

    // Keep only the most recent/important uncertain samples
    if (this.learningData.uncertainSamples.length > 1000) {
      this.learningData.uncertainSamples = this.learningData.uncertainSamples
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 800);
    }
  }

  /**
   * Calculate priority for uncertain samples
   */
  calculateSamplePriority(sample) {
    let priority = 0;

    // Lower confidence = higher priority
    priority += (1 - sample.confidence) * 50;

    // Frequency of similar queries
    const similarCount = this.learningData.uncertainSamples.filter(s =>
      this.calculateMessageSimilarity(s.message, sample.message) > 0.7
    ).length;
    priority += similarCount * 10;

    // Recent samples get slight priority boost
    const hoursSinceCreation = (Date.now() - sample.timestamp.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation < 24) priority += 5;

    return priority;
  }

  /**
   * Track knowledge base gaps
   */
  trackKnowledgeGap(userMessage) {
    const existingGap = this.performanceMetrics.knowledge_base.coverage_gaps
      .find(gap => this.calculateMessageSimilarity(gap.query, userMessage) > 0.8);

    if (existingGap) {
      existingGap.frequency++;
      existingGap.last_seen = new Date();
    } else {
      this.performanceMetrics.knowledge_base.coverage_gaps.push({
        query: userMessage,
        frequency: 1,
        first_seen: new Date(),
        last_seen: new Date(),
        suggested_category: this.suggestKnowledgeCategory(userMessage)
      });
    }
  }

  /**
   * Process user corrections for training data improvement
   */
  processUserCorrection(userMessage, predictedIntent, correctedIntent) {
    const correction = {
      id: this.generateSampleId(),
      user_message: userMessage,
      predicted_intent: predictedIntent,
      corrected_intent: correctedIntent,
      timestamp: new Date(),
      status: 'validated',
      impact_score: this.calculateCorrectionImpact(predictedIntent, correctedIntent)
    };

    this.learningData.retraining_queue.push(correction);
    this.learningData.feedbackHistory.push(correction);

    // Update performance metrics
    this.updatePerformanceMetrics('user_correction', correction);
  }

  /**
   * Calculate impact score of a user correction
   */
  calculateCorrectionImpact(predicted, corrected) {
    // Major misclassifications have higher impact
    const impactMatrix = {
      'CREATE_EMAIL->OUT_OF_DOMAIN': 0.9,
      'KNOWLEDGE_QUESTION->OUT_OF_DOMAIN': 0.8,
      'OUT_OF_DOMAIN->CREATE_EMAIL': 0.9,
      'OUT_OF_DOMAIN->KNOWLEDGE_QUESTION': 0.8
    };

    const key = `${predicted}->${corrected}`;
    return impactMatrix[key] || 0.5;
  }

  /**
   * Generate feedback request for uncertain predictions
   */
  generateFeedbackRequest(interaction) {
    const { userMessage, intent, confidence, knowledgeResults } = interaction;

    if (confidence < this.confidenceThresholds.low) {
      return {
        type: 'intent_clarification',
        message: "🤔 Je ne suis pas sûr d'avoir bien compris votre demande. Pouvez-vous préciser ?",
        options: [
          '📧 Créer un email',
          '❓ Question sur Microsoft',
          '🔍 Autre chose',
          '❌ Hors sujet'
        ],
        context: { userMessage, predictedIntent: intent, confidence }
      };
    }

    if (confidence < this.confidenceThresholds.medium) {
      return {
        type: 'confidence_verification',
        message: `✋ J'ai interprété votre message comme "${this.getIntentDescription(intent)}". Est-ce correct ?`,
        options: ['✅ Oui, correct', '❌ Non, ce n\'est pas ça'],
        context: { userMessage, predictedIntent: intent, confidence }
      };
    }

    if (intent === 'KNOWLEDGE_QUESTION' && (!knowledgeResults || knowledgeResults.length === 0)) {
      return {
        type: 'knowledge_gap',
        message: "🔍 Je n'ai pas trouvé d'information spécifique sur ce sujet. Cette question vous aiderait-elle si elle était ajoutée à ma base de connaissances ?",
        options: ['✅ Oui, très utile', '❓ Moyennement utile', '❌ Pas nécessaire'],
        context: { userMessage, category: this.suggestKnowledgeCategory(userMessage) }
      };
    }

    return null;
  }

  /**
   * Get human-readable intent description
   */
  getIntentDescription(intent) {
    const descriptions = {
      CREATE_EMAIL: 'une demande de création d\'email',
      KNOWLEDGE_QUESTION: 'une question sur les solutions Microsoft',
      PROSPECT_CONTACT: 'un contact avec un prospect',
      MEETING_FOLLOWUP: 'un suivi de réunion',
      CLIENT_FOLLOWUP: 'une relance client',
      OUT_OF_DOMAIN: 'une demande hors du domaine Microsoft/email',
      NEED_HELP: 'une demande d\'aide'
    };
    return descriptions[intent] || intent;
  }

  /**
   * Suggest knowledge base category for new content
   */
  suggestKnowledgeCategory(userMessage) {
    const message = userMessage.toLowerCase();

    if (message.includes('azure') || message.includes('cloud')) return 'azure';
    if (message.includes('office') || message.includes('365')) return 'microsoft365';
    if (message.includes('teams')) return 'teams';
    if (message.includes('power') || message.includes('powerbi')) return 'power';
    if (message.includes('dynamics')) return 'dynamics';
    if (message.includes('sécurité') || message.includes('security')) return 'security';

    return 'general';
  }

  /**
   * Get priority samples for human review
   */
  getPrioritySamplesForReview(limit = 10) {
    return this.learningData.uncertainSamples
      .filter(sample => sample.status === 'pending_review')
      .sort((a, b) => b.priority - a.priority)
      .slice(0, limit)
      .map(sample => ({
        id: sample.id,
        message: sample.message,
        predicted_intent: sample.predicted_intent,
        confidence: sample.confidence,
        priority: sample.priority,
        timestamp: sample.timestamp
      }));
  }

  /**
   * Get knowledge gaps sorted by frequency
   */
  getKnowledgeGaps(limit = 10) {
    return this.performanceMetrics.knowledge_base.coverage_gaps
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  /**
   * Enhanced knowledge mining with semantic analysis
   */
  async performSemanticKnowledgeMining() {
    try {
      const knowledgeGaps = this.getKnowledgeGaps(50); // Get more gaps for analysis

      if (knowledgeGaps.length === 0) {
        return {
          success: true,
          patterns: [],
          generatedContent: [],
          message: 'No knowledge gaps found for mining'
        };
      }

      // 1. Mine semantic patterns from knowledge gaps
      const semanticPatterns = await semanticKnowledgeMiner.mineSemanticPatterns(knowledgeGaps);

      // 2. Generate content from high-value patterns
      const contentGeneration = await automatedContentGenerator.processKnowledgeGaps(
        knowledgeGaps,
        semanticPatterns
      );

      // 3. Update metrics with mining results
      this.updateMiningMetrics(semanticPatterns, contentGeneration);

      return {
        success: true,
        patterns: semanticPatterns,
        generatedContent: contentGeneration.generated || [],
        stats: {
          totalGapsAnalyzed: knowledgeGaps.length,
          patternsFound: semanticPatterns.length,
          contentGenerated: contentGeneration.generated?.length || 0,
          highValuePatterns: semanticPatterns.filter(p => p.estimatedValue > 50).length
        }
      };
    } catch (error) {
      console.error('Semantic knowledge mining error:', error);
      return {
        success: false,
        error: error.message,
        patterns: [],
        generatedContent: []
      };
    }
  }

  /**
   * Update mining metrics with results
   */
  updateMiningMetrics(patterns, contentGeneration) {
    if (!this.performanceMetrics.semantic_mining) {
      this.performanceMetrics.semantic_mining = {
        totalPatterns: 0,
        contentGenerated: 0,
        lastMiningDate: null,
        successRate: 0
      };
    }

    this.performanceMetrics.semantic_mining.totalPatterns += patterns.length;
    this.performanceMetrics.semantic_mining.contentGenerated += contentGeneration.generated?.length || 0;
    this.performanceMetrics.semantic_mining.lastMiningDate = new Date();

    // Calculate success rate (patterns that led to content generation)
    const successfulPatterns = patterns.filter(p => p.needsContent).length;
    const totalPatterns = this.performanceMetrics.semantic_mining.totalPatterns;
    this.performanceMetrics.semantic_mining.successRate = totalPatterns > 0 ? successfulPatterns / totalPatterns : 0;
  }

  /**
   * Get enhanced learning status including semantic mining
   */
  getEnhancedLearningStatus() {
    const basicStatus = this.getActiveLearningStatus();

    return {
      ...basicStatus,
      semantic_mining: {
        status: this.performanceMetrics.semantic_mining || {
          totalPatterns: 0,
          contentGenerated: 0,
          lastMiningDate: null,
          successRate: 0
        },
        capabilities: [
          'Semantic similarity detection',
          'Query clustering',
          'Automated content generation',
          'Pattern-based insights'
        ]
      },
      knowledge_enhancement: {
        gaps_tracked: this.performanceMetrics.knowledge_base.coverage_gaps.length,
        high_frequency_gaps: this.performanceMetrics.knowledge_base.coverage_gaps.filter(g => g.frequency >= 5).length,
        categories_needed: [...new Set(this.performanceMetrics.knowledge_base.coverage_gaps.map(g => g.suggested_category))].length
      }
    };
  }

  /**
   * Process human feedback on uncertain samples
   */
  processHumanFeedback(sampleId, humanLabel, confidence = 1.0) {
    const sample = this.learningData.uncertainSamples.find(s => s.id === sampleId);

    if (!sample) {
      throw new Error(`Sample ${sampleId} not found`);
    }

    sample.human_label = humanLabel;
    sample.human_confidence = confidence;
    sample.status = 'human_labeled';
    sample.review_timestamp = new Date();

    // Add to retraining queue if label differs from prediction
    if (sample.predicted_intent !== humanLabel) {
      this.learningData.retraining_queue.push({
        id: this.generateSampleId(),
        user_message: sample.message,
        predicted_intent: sample.predicted_intent,
        corrected_intent: humanLabel,
        source: 'human_review',
        timestamp: new Date(),
        confidence_improvement: confidence - sample.confidence
      });
    }

    return {
      success: true,
      message: 'Feedback processed successfully',
      impact: sample.predicted_intent !== humanLabel ? 'training_data_updated' : 'confidence_validated'
    };
  }

  /**
   * Generate training recommendations
   */
  generateTrainingRecommendations() {
    const recommendations = [];

    // 1. Intent classification improvements
    const lowPerformanceIntents = Object.entries(this.performanceMetrics.intent_classification.f1_score)
      .filter(([intent, score]) => score < 0.8)
      .map(([intent]) => intent);

    if (lowPerformanceIntents.length > 0) {
      recommendations.push({
        type: 'intent_improvement',
        priority: 'high',
        title: 'Améliorer la classification d\'intentions',
        description: `Les intentions ${lowPerformanceIntents.join(', ')} ont des performances faibles`,
        action: 'Ajouter plus d\'exemples d\'entraînement pour ces intentions',
        affected_intents: lowPerformanceIntents
      });
    }

    // 2. Knowledge base gaps
    const frequentGaps = this.getKnowledgeGaps(5);
    if (frequentGaps.length > 0) {
      recommendations.push({
        type: 'knowledge_expansion',
        priority: 'medium',
        title: 'Étendre la base de connaissances',
        description: `${frequentGaps.length} lacunes fréquentes détectées`,
        action: 'Ajouter du contenu pour les questions non couvertes',
        knowledge_gaps: frequentGaps
      });
    }

    // 3. Uncertain samples requiring review
    const pendingReviews = this.learningData.uncertainSamples
      .filter(s => s.status === 'pending_review').length;

    if (pendingReviews > 50) {
      recommendations.push({
        type: 'human_review_needed',
        priority: 'medium',
        title: 'Révision humaine nécessaire',
        description: `${pendingReviews} échantillons incertains en attente`,
        action: 'Réviser et labelliser les échantillons prioritaires'
      });
    }

    return recommendations;
  }

  /**
   * Calculate message similarity (simple implementation)
   */
  calculateMessageSimilarity(msg1, msg2) {
    const words1 = msg1.toLowerCase().split(/\s+/);
    const words2 = msg2.toLowerCase().split(/\s+/);

    const intersection = words1.filter(word => words2.includes(word)).length;
    const union = new Set([...words1, ...words2]).size;

    return intersection / union; // Jaccard similarity
  }

  /**
   * Generate unique sample ID
   */
  generateSampleId() {
    return `sample_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update performance metrics
   */
  updatePerformanceMetrics(eventType, data) {
    const now = new Date();

    switch (eventType) {
      case 'user_correction':
        // Track correction patterns
        break;
      case 'knowledge_gap':
        // Track frequent gaps
        break;
      case 'successful_interaction':
        // Track positive outcomes
        break;
    }

    // Store metrics update timestamp
    this.performanceMetrics.last_updated = now;
  }

  /**
   * Get active learning status summary
   */
  getActiveLearningStatus() {
    return {
      uncertain_samples: {
        total: this.learningData.uncertainSamples.length,
        pending_review: this.learningData.uncertainSamples.filter(s => s.status === 'pending_review').length,
        human_labeled: this.learningData.uncertainSamples.filter(s => s.status === 'human_labeled').length
      },
      knowledge_gaps: {
        total: this.performanceMetrics.knowledge_base.coverage_gaps.length,
        high_frequency: this.performanceMetrics.knowledge_base.coverage_gaps.filter(g => g.frequency >= 5).length
      },
      retraining_queue: {
        total: this.learningData.retraining_queue.length,
        ready_for_training: this.learningData.retraining_queue.filter(r => r.status !== 'processed').length
      },
      performance_trends: {
        intent_accuracy: this.performanceMetrics.intent_classification.accuracy,
        knowledge_relevance: this.performanceMetrics.knowledge_base.answer_relevance,
        user_satisfaction: this.performanceMetrics.knowledge_base.user_satisfaction
      }
    };
  }
}

// Export singleton instance
export const activeLearningSystem = new ActiveLearningSystem();