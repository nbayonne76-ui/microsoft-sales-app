/**
 * Automatic Threshold Tuning System
 * Dynamically adjusts confidence thresholds based on user feedback and performance metrics
 */

import { prisma } from './database.js';

export class AutomaticThresholdTuner {
  constructor() {
    this.thresholds = {
      confidence: {
        high: 0.8,      // Auto-accept predictions
        medium: 0.6,    // Request user feedback
        low: 0.4,       // Suggest alternatives
        min: 0.2        // Minimum viable confidence
      },
      performance: {
        accuracy_target: 0.85,          // Target system accuracy
        user_satisfaction_target: 0.8,  // Target user satisfaction
        response_rate_target: 0.15      // Target email response rate
      },
      tuning: {
        learning_rate: 0.05,            // How fast to adjust thresholds
        evaluation_window: 100,         // Number of samples to evaluate
        min_feedback_samples: 20,       // Minimum feedback needed for tuning
        stability_threshold: 0.02       // Minimum change to apply adjustment
      }
    };

    this.performanceHistory = [];
    this.lastTuningDate = new Date();
    this.tuningLog = [];
  }

  /**
   * Main tuning method - analyzes feedback and adjusts thresholds
   */
  async performThresholdTuning() {
    try {
      console.log('🎯 Starting automatic threshold tuning...');

      // 1. Collect recent performance data
      const performanceData = await this.collectPerformanceData();

      if (performanceData.totalFeedbacks < this.thresholds.tuning.min_feedback_samples) {
        console.log(`⏳ Insufficient feedback data (${performanceData.totalFeedbacks}/${this.thresholds.tuning.min_feedback_samples})`);
        return null;
      }

      // 2. Analyze current threshold effectiveness
      const thresholdAnalysis = await this.analyzeThresholdEffectiveness(performanceData);

      // 3. Calculate optimal threshold adjustments
      const adjustments = this.calculateOptimalAdjustments(thresholdAnalysis);

      // 4. Apply adjustments if significant enough
      if (adjustments.shouldApply) {
        await this.applyThresholdAdjustments(adjustments);

        // 5. Log tuning results
        await this.logTuningResults(adjustments, performanceData);

        console.log('✅ Threshold tuning completed successfully');
        return adjustments;
      } else {
        console.log('📊 Thresholds are already optimal - no changes needed');
        return null;
      }

    } catch (error) {
      console.error('❌ Error in automatic threshold tuning:', error);
      throw error;
    }
  }

  /**
   * Collect recent performance data from database
   */
  async collectPerformanceData() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    try {
      // Get feedback data
      const feedbacks = await prisma.emailFeedback.findMany({
        where: {
          createdAt: { gte: thirtyDaysAgo }
        },
        include: {
          interaction: {
            include: {
              client: true
            }
          }
        }
      });

      // Get email metrics
      const emailMetrics = await prisma.emailMetric.findMany({
        where: {
          date: { gte: thirtyDaysAgo }
        }
      });

      // Calculate aggregated performance
      const performanceData = {
        totalFeedbacks: feedbacks.length,
        avgQualityRating: this.calculateAverageRating(feedbacks, 'qualityRating'),
        avgRelevanceRating: this.calculateAverageRating(feedbacks, 'relevanceRating'),
        avgToneRating: this.calculateAverageRating(feedbacks, 'toneRating'),

        // Email performance
        totalEmailsSent: emailMetrics.reduce((sum, m) => sum + m.emailsSent, 0),
        totalEmailsOpened: emailMetrics.reduce((sum, m) => sum + m.emailsOpened, 0),
        totalEmailsReplied: emailMetrics.reduce((sum, m) => sum + m.emailsReplied, 0),

        // Feedback distribution
        positiveCount: feedbacks.filter(f => f.feedbackType === 'positive').length,
        negativeCount: feedbacks.filter(f => f.feedbackType === 'negative').length,
        suggestionCount: feedbacks.filter(f => f.suggestedImprovement).length,

        // Performance by confidence level
        confidenceBuckets: this.analyzePerformanceByConfidence(feedbacks),

        rawFeedbacks: feedbacks,
        rawMetrics: emailMetrics,
        evaluationPeriod: {
          start: thirtyDaysAgo,
          end: new Date(),
          days: 30
        }
      };

      // Calculate derived metrics
      performanceData.openRate = performanceData.totalEmailsSent > 0
        ? performanceData.totalEmailsOpened / performanceData.totalEmailsSent
        : 0;

      performanceData.responseRate = performanceData.totalEmailsSent > 0
        ? performanceData.totalEmailsReplied / performanceData.totalEmailsSent
        : 0;

      performanceData.userSatisfaction = performanceData.totalFeedbacks > 0
        ? (performanceData.avgQualityRating + performanceData.avgRelevanceRating + performanceData.avgToneRating) / 15 // Max is 5+5+5=15
        : 0;

      return performanceData;

    } catch (error) {
      console.error('Error collecting performance data:', error);
      return {
        totalFeedbacks: 0,
        avgQualityRating: 0,
        avgRelevanceRating: 0,
        avgToneRating: 0,
        totalEmailsSent: 0,
        totalEmailsOpened: 0,
        totalEmailsReplied: 0,
        openRate: 0,
        responseRate: 0,
        userSatisfaction: 0,
        confidenceBuckets: {}
      };
    }
  }

  /**
   * Analyze how well current thresholds are performing
   */
  async analyzeThresholdEffectiveness(performanceData) {
    const analysis = {
      currentThresholds: { ...this.thresholds.confidence },
      performance: {
        overall_accuracy: 0,
        user_satisfaction: performanceData.userSatisfaction,
        response_rate: performanceData.responseRate,
        open_rate: performanceData.openRate
      },
      problems: [],
      opportunities: []
    };

    // Calculate overall system accuracy based on feedback
    if (performanceData.totalFeedbacks > 0) {
      const accurateResponses = performanceData.positiveCount;
      analysis.performance.overall_accuracy = accurateResponses / performanceData.totalFeedbacks;
    }

    // Identify performance issues
    if (analysis.performance.overall_accuracy < this.thresholds.performance.accuracy_target) {
      analysis.problems.push({
        type: 'low_accuracy',
        current: analysis.performance.overall_accuracy,
        target: this.thresholds.performance.accuracy_target,
        severity: 'high'
      });
    }

    if (analysis.performance.user_satisfaction < this.thresholds.performance.user_satisfaction_target) {
      analysis.problems.push({
        type: 'low_satisfaction',
        current: analysis.performance.user_satisfaction,
        target: this.thresholds.performance.user_satisfaction_target,
        severity: 'medium'
      });
    }

    if (analysis.performance.response_rate < this.thresholds.performance.response_rate_target) {
      analysis.problems.push({
        type: 'low_response_rate',
        current: analysis.performance.response_rate,
        target: this.thresholds.performance.response_rate_target,
        severity: 'medium'
      });
    }

    // Analyze confidence bucket performance
    analysis.confidenceAnalysis = this.analyzeConfidenceBuckets(performanceData.confidenceBuckets);

    return analysis;
  }

  /**
   * Calculate optimal threshold adjustments
   */
  calculateOptimalAdjustments(analysis) {
    const adjustments = {
      shouldApply: false,
      changes: {},
      reasoning: [],
      expectedImpact: {}
    };

    const currentThresholds = analysis.currentThresholds;
    let proposedThresholds = { ...currentThresholds };

    // Adjust based on accuracy issues
    if (analysis.problems.find(p => p.type === 'low_accuracy')) {
      // Lower high confidence threshold to be more selective
      const accuracyGap = this.thresholds.performance.accuracy_target - analysis.performance.overall_accuracy;
      const adjustment = accuracyGap * this.thresholds.tuning.learning_rate;

      proposedThresholds.high = Math.max(0.85, currentThresholds.high + adjustment);
      proposedThresholds.medium = Math.max(0.65, currentThresholds.medium + adjustment * 0.7);

      adjustments.reasoning.push(`Increased confidence thresholds by ${adjustment.toFixed(3)} to improve accuracy`);
      adjustments.expectedImpact.accuracy = `+${(adjustment * 0.5).toFixed(2)}`;
    }

    // Adjust based on user satisfaction
    if (analysis.problems.find(p => p.type === 'low_satisfaction')) {
      const satisfactionGap = this.thresholds.performance.user_satisfaction_target - analysis.performance.user_satisfaction;

      if (satisfactionGap > 0.1) {
        // Lower medium threshold to request more feedback for borderline cases
        proposedThresholds.medium = Math.max(0.5, currentThresholds.medium - 0.05);
        adjustments.reasoning.push('Lowered medium threshold to collect more user feedback');
        adjustments.expectedImpact.satisfaction = '+0.05';
      }
    }

    // Adjust based on response rate performance
    if (analysis.problems.find(p => p.type === 'low_response_rate')) {
      const responseGap = this.thresholds.performance.response_rate_target - analysis.performance.response_rate;

      if (responseGap > 0.03) {
        // Slightly lower high threshold to be more conservative with email generation
        proposedThresholds.high = Math.max(0.75, currentThresholds.high - 0.03);
        adjustments.reasoning.push('Lowered high threshold to generate higher quality emails');
        adjustments.expectedImpact.response_rate = '+0.02';
      }
    }

    // Analyze confidence bucket performance for fine-tuning
    const confidenceOptimizations = this.optimizeConfidenceBuckets(analysis.confidenceAnalysis);
    if (confidenceOptimizations.hasOptimizations) {
      Object.assign(proposedThresholds, confidenceOptimizations.adjustments);
      adjustments.reasoning.push(...confidenceOptimizations.reasoning);
    }

    // Check if changes are significant enough to apply
    const significantChange = Object.keys(proposedThresholds).some(key => {
      return Math.abs(proposedThresholds[key] - currentThresholds[key]) >= this.thresholds.tuning.stability_threshold;
    });

    if (significantChange) {
      adjustments.shouldApply = true;
      adjustments.changes = {
        from: currentThresholds,
        to: proposedThresholds,
        deltas: {}
      };

      // Calculate deltas
      Object.keys(proposedThresholds).forEach(key => {
        adjustments.changes.deltas[key] = proposedThresholds[key] - currentThresholds[key];
      });
    }

    return adjustments;
  }

  /**
   * Apply calculated threshold adjustments
   */
  async applyThresholdAdjustments(adjustments) {
    const newThresholds = adjustments.changes.to;

    // Update internal thresholds
    this.thresholds.confidence = { ...newThresholds };

    // Store in database for persistence
    await this.saveThresholdConfiguration(newThresholds, adjustments);

    console.log('🔧 Applied threshold adjustments:');
    Object.keys(adjustments.changes.deltas).forEach(key => {
      const delta = adjustments.changes.deltas[key];
      if (Math.abs(delta) > 0.001) {
        console.log(`   ${key}: ${adjustments.changes.from[key].toFixed(3)} → ${newThresholds[key].toFixed(3)} (${delta >= 0 ? '+' : ''}${delta.toFixed(3)})`);
      }
    });
  }

  /**
   * Log tuning results for analysis and monitoring
   */
  async logTuningResults(adjustments, performanceData) {
    const tuningResult = {
      timestamp: new Date(),
      performanceData: {
        accuracy: performanceData.userSatisfaction,
        satisfaction: performanceData.userSatisfaction,
        responseRate: performanceData.responseRate,
        totalFeedbacks: performanceData.totalFeedbacks
      },
      thresholdChanges: adjustments.changes,
      reasoning: adjustments.reasoning,
      expectedImpact: adjustments.expectedImpact
    };

    this.tuningLog.push(tuningResult);

    // Store in database
    try {
      await prisma.learningPattern.create({
        data: {
          patternType: 'threshold_tuning',
          context: 'automatic_optimization',
          pattern: JSON.stringify(tuningResult),
          description: `Automatic threshold tuning: ${adjustments.reasoning.join('; ')}`,
          occurrences: 1,
          successRate: 0.0, // Will be updated later based on subsequent performance
          confidenceScore: 0.8
        }
      });
    } catch (error) {
      console.error('Error logging tuning results:', error);
    }
  }

  /**
   * Analyze performance by confidence buckets
   */
  analyzePerformanceByConfidence(feedbacks) {
    const buckets = {
      high: { feedbacks: [], avgRating: 0, count: 0 },
      medium: { feedbacks: [], avgRating: 0, count: 0 },
      low: { feedbacks: [], avgRating: 0, count: 0 }
    };

    feedbacks.forEach(feedback => {
      // Simulate confidence level based on feedback quality (in real system, this would come from the prediction)
      const estimatedConfidence = this.estimateConfidenceFromFeedback(feedback);

      let bucket;
      if (estimatedConfidence >= this.thresholds.confidence.high) {
        bucket = 'high';
      } else if (estimatedConfidence >= this.thresholds.confidence.medium) {
        bucket = 'medium';
      } else {
        bucket = 'low';
      }

      buckets[bucket].feedbacks.push(feedback);
      buckets[bucket].count++;
    });

    // Calculate average ratings for each bucket
    Object.keys(buckets).forEach(bucketName => {
      const bucket = buckets[bucketName];
      if (bucket.count > 0) {
        bucket.avgRating = bucket.feedbacks.reduce((sum, f) => {
          return sum + (f.qualityRating || 3) + (f.relevanceRating || 3) + (f.toneRating || 3);
        }, 0) / (bucket.count * 3); // Average of 3 ratings, normalized to 0-5
      }
    });

    return buckets;
  }

  /**
   * Optimize confidence buckets based on performance
   */
  optimizeConfidenceBuckets(confidenceAnalysis) {
    const optimizations = {
      hasOptimizations: false,
      adjustments: {},
      reasoning: []
    };

    // If high confidence bucket has low performance, raise the threshold
    if (confidenceAnalysis.high.count > 5 && confidenceAnalysis.high.avgRating < 3.5) {
      optimizations.adjustments.high = Math.min(0.9, this.thresholds.confidence.high + 0.05);
      optimizations.reasoning.push('Raised high threshold due to poor high-confidence performance');
      optimizations.hasOptimizations = true;
    }

    // If medium confidence bucket performs well, we can be less conservative
    if (confidenceAnalysis.medium.count > 10 && confidenceAnalysis.medium.avgRating > 4.0) {
      optimizations.adjustments.medium = Math.max(0.5, this.thresholds.confidence.medium - 0.03);
      optimizations.reasoning.push('Lowered medium threshold due to good medium-confidence performance');
      optimizations.hasOptimizations = true;
    }

    return optimizations;
  }

  /**
   * Get current threshold configuration
   */
  getCurrentThresholds() {
    return {
      confidence: { ...this.thresholds.confidence },
      performance: { ...this.thresholds.performance },
      tuning: { ...this.thresholds.tuning },
      lastTuningDate: this.lastTuningDate,
      tuningHistory: this.tuningLog.slice(-10) // Last 10 tuning sessions
    };
  }

  /**
   * Manual threshold override for testing
   */
  async setThresholds(newThresholds, reason = 'Manual override') {
    const oldThresholds = { ...this.thresholds.confidence };

    Object.assign(this.thresholds.confidence, newThresholds);

    await this.saveThresholdConfiguration(this.thresholds.confidence, {
      changes: { from: oldThresholds, to: this.thresholds.confidence },
      reasoning: [reason],
      manual: true
    });

    console.log(`🔧 Manual threshold update: ${reason}`);
    return this.thresholds.confidence;
  }

  /**
   * Evaluate threshold performance over time
   */
  async evaluateThresholdPerformance(days = 7) {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const performanceData = await this.collectPerformanceData();

    return {
      period: { days, startDate, endDate: new Date() },
      metrics: {
        accuracy: performanceData.userSatisfaction,
        satisfaction: performanceData.userSatisfaction,
        responseRate: performanceData.responseRate,
        totalFeedbacks: performanceData.totalFeedbacks
      },
      currentThresholds: this.thresholds.confidence,
      recommendation: await this.getThresholdRecommendation(performanceData)
    };
  }

  /**
   * Get threshold recommendations without applying changes
   */
  async getThresholdRecommendation(performanceData) {
    const analysis = await this.analyzeThresholdEffectiveness(performanceData);
    const adjustments = this.calculateOptimalAdjustments(analysis);

    return {
      needsTuning: adjustments.shouldApply,
      currentPerformance: analysis.performance,
      proposedChanges: adjustments.shouldApply ? adjustments.changes : null,
      reasoning: adjustments.reasoning,
      expectedImpact: adjustments.expectedImpact
    };
  }

  // Helper methods
  calculateAverageRating(feedbacks, ratingField) {
    const ratingsWithValues = feedbacks.filter(f => f[ratingField] !== null && f[ratingField] !== undefined);
    if (ratingsWithValues.length === 0) return 3; // Default neutral rating

    return ratingsWithValues.reduce((sum, f) => sum + f[ratingField], 0) / ratingsWithValues.length;
  }

  estimateConfidenceFromFeedback(feedback) {
    // Estimate confidence based on feedback ratings
    const avgRating = ((feedback.qualityRating || 3) + (feedback.relevanceRating || 3) + (feedback.toneRating || 3)) / 3;
    return Math.max(0.1, Math.min(0.95, avgRating / 5.0)); // Convert 1-5 rating to 0.2-1.0 confidence
  }

  async saveThresholdConfiguration(thresholds, context) {
    try {
      await prisma.learningPattern.create({
        data: {
          patternType: 'threshold_configuration',
          context: context.manual ? 'manual_adjustment' : 'automatic_tuning',
          pattern: JSON.stringify({
            thresholds,
            timestamp: new Date(),
            context
          }),
          description: `Threshold configuration: ${context.reasoning?.join('; ') || 'Updated'}`,
          occurrences: 1,
          successRate: 1.0,
          confidenceScore: context.manual ? 1.0 : 0.8
        }
      });
    } catch (error) {
      console.error('Error saving threshold configuration:', error);
    }
  }

  /**
   * Schedule automatic tuning to run periodically
   */
  scheduleAutoTuning(intervalHours = 24) {
    console.log(`📅 Scheduling automatic threshold tuning every ${intervalHours} hours`);

    const intervalMs = intervalHours * 60 * 60 * 1000;

    setInterval(async () => {
      try {
        console.log('🔄 Running scheduled threshold tuning...');
        const result = await this.performThresholdTuning();

        if (result) {
          console.log(`✅ Scheduled tuning completed with ${result.reasoning.length} adjustments`);
        } else {
          console.log('📊 Scheduled tuning: no changes needed');
        }
      } catch (error) {
        console.error('❌ Scheduled tuning failed:', error);
      }
    }, intervalMs);

    return `Automatic tuning scheduled every ${intervalHours} hours`;
  }
}

// Export singleton instance
export const automaticThresholdTuner = new AutomaticThresholdTuner();