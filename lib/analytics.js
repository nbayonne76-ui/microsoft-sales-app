import { prisma } from './database.js';

// Service de métriques et analytics
export class MetricsService {
  
  // Mettre à jour les métriques quotidiennes
  static async updateDailyMetrics(date = new Date()) {
    try {
      const today = new Date(date);
      today.setHours(0, 0, 0, 0);

      // Récupérer ou créer l'enregistrement du jour
      let metrics = await prisma.emailMetric.findUnique({
        where: { date: today }
      });

      if (!metrics) {
        metrics = await prisma.emailMetric.create({
          data: { date: today }
        });
      }

      // Calculer les métriques depuis les interactions
      const interactions = await prisma.clientInteraction.findMany({
        where: {
          createdAt: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          },
          type: 'email'
        },
        include: {
          client: true
        }
      });

      // Compter les métriques
      const emailsSent = interactions.length;
      const emailsDelivered = interactions.filter(i => 
        ['delivered', 'opened', 'clicked', 'responded'].includes(i.status)
      ).length;
      const emailsOpened = interactions.filter(i => i.openedAt).length;
      const emailsClicked = interactions.filter(i => i.clickedAt).length;
      const emailsReplied = interactions.filter(i => i.responseReceived).length;

      // Sentiment analysis
      const positiveResponses = interactions.filter(i => 
        i.responseSentiment === 'positive'
      ).length;
      const neutralResponses = interactions.filter(i => 
        i.responseSentiment === 'neutral'
      ).length;
      const negativeResponses = interactions.filter(i => 
        i.responseSentiment === 'negative'
      ).length;

      // Métriques par segment
      const enterpriseEmails = interactions.filter(i => 
        i.client.segment === 'enterprise'
      ).length;
      const smeEmails = interactions.filter(i => 
        i.client.segment === 'sme'
      ).length;
      const startupEmails = interactions.filter(i => 
        i.client.segment === 'startup'
      ).length;

      // Calculer les taux
      const deliveryRate = emailsSent > 0 ? (emailsDelivered / emailsSent) * 100 : 0;
      const openRate = emailsDelivered > 0 ? (emailsOpened / emailsDelivered) * 100 : 0;
      const clickRate = emailsOpened > 0 ? (emailsClicked / emailsOpened) * 100 : 0;
      const responseRate = emailsDelivered > 0 ? (emailsReplied / emailsDelivered) * 100 : 0;

      // Mettre à jour
      const updatedMetrics = await prisma.emailMetric.update({
        where: { id: metrics.id },
        data: {
          emailsSent,
          emailsDelivered,
          emailsOpened,
          emailsClicked,
          emailsReplied,
          positiveResponses,
          neutralResponses,
          negativeResponses,
          enterpriseEmails,
          smeEmails,
          startupEmails,
          deliveryRate: Math.round(deliveryRate * 100) / 100,
          openRate: Math.round(openRate * 100) / 100,
          clickRate: Math.round(clickRate * 100) / 100,
          responseRate: Math.round(responseRate * 100) / 100
        }
      });

      console.log(`📊 Métriques mises à jour pour ${today.toISOString().split('T')[0]}:`, {
        sent: emailsSent,
        responseRate: `${updatedMetrics.responseRate}%`
      });

      return updatedMetrics;
    } catch (error) {
      console.error('❌ Erreur MetricsService.updateDailyMetrics:', error);
      throw error;
    }
  }

  // Récupérer les métriques sur une période
  static async getMetricsRange(startDate, endDate = new Date()) {
    try {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const metrics = await prisma.emailMetric.findMany({
        where: {
          date: {
            gte: start,
            lte: end
          }
        },
        orderBy: { date: 'asc' }
      });

      // Calculer les totaux
      const totals = metrics.reduce((acc, m) => ({
        emailsSent: acc.emailsSent + m.emailsSent,
        emailsDelivered: acc.emailsDelivered + m.emailsDelivered,
        emailsOpened: acc.emailsOpened + m.emailsOpened,
        emailsReplied: acc.emailsReplied + m.emailsReplied,
        positiveResponses: acc.positiveResponses + m.positiveResponses,
        neutralResponses: acc.neutralResponses + m.neutralResponses,
        negativeResponses: acc.negativeResponses + m.negativeResponses
      }), {
        emailsSent: 0,
        emailsDelivered: 0,
        emailsOpened: 0,
        emailsReplied: 0,
        positiveResponses: 0,
        neutralResponses: 0,
        negativeResponses: 0
      });

      // Calculer les moyennes
      const averages = {
        deliveryRate: totals.emailsSent > 0 ? 
          Math.round((totals.emailsDelivered / totals.emailsSent) * 10000) / 100 : 0,
        openRate: totals.emailsDelivered > 0 ? 
          Math.round((totals.emailsOpened / totals.emailsDelivered) * 10000) / 100 : 0,
        responseRate: totals.emailsDelivered > 0 ? 
          Math.round((totals.emailsReplied / totals.emailsDelivered) * 10000) / 100 : 0
      };

      return {
        metrics,
        totals,
        averages,
        period: { start, end },
        days: metrics.length
      };
    } catch (error) {
      console.error('❌ Erreur MetricsService.getMetricsRange:', error);
      throw error;
    }
  }

  // Analyser les performances par segment
  static async getSegmentPerformance(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const interactions = await prisma.clientInteraction.findMany({
        where: {
          createdAt: { gte: startDate },
          type: 'email'
        },
        include: { client: true }
      });

      const segmentStats = {};

      ['enterprise', 'sme', 'startup'].forEach(segment => {
        const segmentEmails = interactions.filter(i => i.client.segment === segment);
        const responded = segmentEmails.filter(i => i.responseReceived);
        const positive = segmentEmails.filter(i => i.responseSentiment === 'positive');

        segmentStats[segment] = {
          totalEmails: segmentEmails.length,
          responses: responded.length,
          positiveResponses: positive.length,
          responseRate: segmentEmails.length > 0 ? 
            Math.round((responded.length / segmentEmails.length) * 10000) / 100 : 0,
          positivityRate: responded.length > 0 ? 
            Math.round((positive.length / responded.length) * 10000) / 100 : 0
        };
      });

      return segmentStats;
    } catch (error) {
      console.error('❌ Erreur MetricsService.getSegmentPerformance:', error);
      throw error;
    }
  }

  // Identifier les templates les plus performants
  static async getBestPerformingTemplates(limit = 10) {
    try {
      // Analyser les interactions récentes pour identifier les patterns gagnants
      const recentInteractions = await prisma.clientInteraction.findMany({
        where: {
          type: 'email',
          responseReceived: true,
          responseSentiment: 'positive'
        },
        include: { client: true },
        orderBy: { createdAt: 'desc' },
        take: 100
      });

      // Regrouper par contexte/sujet similaire
      const templateStats = {};

      recentInteractions.forEach(interaction => {
        if (!interaction.subject) return;

        // Simplifier le sujet pour grouper des templates similaires
        const normalizedSubject = this.normalizeSubject(interaction.subject);
        
        if (!templateStats[normalizedSubject]) {
          templateStats[normalizedSubject] = {
            subject: interaction.subject,
            category: this.categorizeEmail(interaction.subject, interaction.context),
            segment: interaction.client.segment,
            count: 0,
            positiveResponses: 0,
            totalInteractions: 0
          };
        }

        templateStats[normalizedSubject].count++;
        templateStats[normalizedSubject].totalInteractions++;
        if (interaction.responseSentiment === 'positive') {
          templateStats[normalizedSubject].positiveResponses++;
        }
      });

      // Convertir en array et calculer le score
      const templates = Object.values(templateStats)
        .map(template => ({
          ...template,
          successRate: template.totalInteractions > 0 ? 
            Math.round((template.positiveResponses / template.totalInteractions) * 10000) / 100 : 0
        }))
        .sort((a, b) => {
          // Trier par taux de succès puis par volume
          if (a.successRate === b.successRate) {
            return b.count - a.count;
          }
          return b.successRate - a.successRate;
        })
        .slice(0, limit);

      return templates;
    } catch (error) {
      console.error('❌ Erreur MetricsService.getBestPerformingTemplates:', error);
      throw error;
    }
  }

  // Utilitaires
  static normalizeSubject(subject) {
    return subject
      .toLowerCase()
      .replace(/[🔥💰🚀⚡✨]/g, '') // Retirer emojis
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 50);
  }

  static categorizeEmail(subject, context) {
    if (!subject && !context) return 'general';
    
    const content = `${subject || ''} ${context || ''}`.toLowerCase();
    
    if (content.includes('migration') || content.includes('azure')) return 'migration';
    if (content.includes('budget') || content.includes('coût') || content.includes('économie')) return 'budget';
    if (content.includes('formation') || content.includes('équipe') || content.includes('changement')) return 'change_management';
    if (content.includes('demo') || content.includes('présentation')) return 'demo';
    
    return 'follow_up';
  }
}

// Service de feedback et apprentissage
export class FeedbackService {
  
  // Enregistrer un feedback sur un email
  static async recordFeedback({
    interactionId,
    qualityRating,
    relevanceRating,
    toneRating,
    feedbackText,
    suggestedImprovement,
    feedbackType = 'manual',
    feedbackSource = 'manual'
  }) {
    try {
      const feedback = await prisma.emailFeedback.create({
        data: {
          interactionId,
          qualityRating,
          relevanceRating,
          toneRating,
          feedbackText,
          suggestedImprovement,
          feedbackType,
          feedbackSource
        },
        include: {
          interaction: {
            include: { client: true }
          }
        }
      });

      console.log('📝 Feedback enregistré:', {
        client: feedback.interaction.client.company,
        quality: qualityRating,
        type: feedbackType
      });

      // Déclencher l'apprentissage automatique si feedback significatif
      if (feedbackType === 'negative' || suggestedImprovement) {
        await this.triggerLearning(feedback);
      }

      return feedback;
    } catch (error) {
      console.error('❌ Erreur FeedbackService.recordFeedback:', error);
      throw error;
    }
  }

  // Récupérer les feedbacks d'une période
  static async getFeedbackSummary(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const feedbacks = await prisma.emailFeedback.findMany({
        where: {
          createdAt: { gte: startDate }
        },
        include: {
          interaction: {
            include: { client: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Calculer les statistiques
      const totalFeedbacks = feedbacks.length;
      const avgQuality = feedbacks
        .filter(f => f.qualityRating)
        .reduce((sum, f) => sum + f.qualityRating, 0) / 
        feedbacks.filter(f => f.qualityRating).length || 0;

      const avgRelevance = feedbacks
        .filter(f => f.relevanceRating)
        .reduce((sum, f) => sum + f.relevanceRating, 0) / 
        feedbacks.filter(f => f.relevanceRating).length || 0;

      const avgTone = feedbacks
        .filter(f => f.toneRating)
        .reduce((sum, f) => sum + f.toneRating, 0) / 
        feedbacks.filter(f => f.toneRating).length || 0;

      const feedbackTypes = feedbacks.reduce((acc, f) => {
        acc[f.feedbackType] = (acc[f.feedbackType] || 0) + 1;
        return acc;
      }, {});

      return {
        totalFeedbacks,
        averageRatings: {
          quality: Math.round(avgQuality * 100) / 100,
          relevance: Math.round(avgRelevance * 100) / 100,
          tone: Math.round(avgTone * 100) / 100
        },
        feedbackTypes,
        recentFeedbacks: feedbacks.slice(0, 10)
      };
    } catch (error) {
      console.error('❌ Erreur FeedbackService.getFeedbackSummary:', error);
      throw error;
    }
  }

  // Déclencher l'apprentissage automatique
  static async triggerLearning(feedback) {
    try {
      if (!feedback.suggestedImprovement) return;

      // Analyser la suggestion pour identifier des patterns
      const patterns = await this.extractLearningPatterns(feedback);
      
      for (const pattern of patterns) {
        await this.recordLearningPattern(pattern);
      }

      console.log(`🧠 ${patterns.length} patterns d'apprentissage extraits du feedback`);
    } catch (error) {
      console.error('❌ Erreur FeedbackService.triggerLearning:', error);
    }
  }

  // Extraire des patterns d'apprentissage du feedback
  static async extractLearningPatterns(feedback) {
    const patterns = [];
    const suggestion = feedback.suggestedImprovement.toLowerCase();
    const interaction = feedback.interaction;

    // Pattern: Amélioration du sujet
    if (suggestion.includes('sujet') || suggestion.includes('objet')) {
      patterns.push({
        patternType: 'subject_line',
        context: `${interaction.context || ''} segment:${interaction.client.segment}`,
        segment: interaction.client.segment,
        pattern: suggestion,
        description: `Amélioration suggérée pour le sujet: ${suggestion.substring(0, 100)}`
      });
    }

    // Pattern: Amélioration du ton
    if (suggestion.includes('ton') || suggestion.includes('style')) {
      patterns.push({
        patternType: 'tone_adaptation',
        context: `segment:${interaction.client.segment}`,
        segment: interaction.client.segment,
        pattern: suggestion,
        description: `Adaptation de ton suggérée: ${suggestion.substring(0, 100)}`
      });
    }

    // Pattern: Call-to-action
    if (suggestion.includes('action') || suggestion.includes('call') || suggestion.includes('rdv')) {
      patterns.push({
        patternType: 'call_to_action',
        context: interaction.intent || 'follow_up',
        segment: interaction.client.segment,
        pattern: suggestion,
        description: `Amélioration CTA suggérée: ${suggestion.substring(0, 100)}`
      });
    }

    return patterns;
  }

  // Enregistrer un pattern d'apprentissage
  static async recordLearningPattern(patternData) {
    try {
      // Vérifier si le pattern existe déjà
      const existing = await prisma.learningPattern.findFirst({
        where: {
          patternType: patternData.patternType,
          context: patternData.context,
          pattern: patternData.pattern
        }
      });

      if (existing) {
        // Incrémenter les occurrences
        await prisma.learningPattern.update({
          where: { id: existing.id },
          data: { 
            occurrences: existing.occurrences + 1,
            lastUsed: new Date()
          }
        });
      } else {
        // Créer nouveau pattern
        await prisma.learningPattern.create({
          data: {
            ...patternData,
            confidenceScore: 0.1 // Faible confiance initiale
          }
        });
      }
    } catch (error) {
      console.error('❌ Erreur FeedbackService.recordLearningPattern:', error);
    }
  }

  // Récupérer les patterns d'apprentissage pour l'IA
  static async getLearningPatterns(context, segment) {
    try {
      const patterns = await prisma.learningPattern.findMany({
        where: {
          isActive: true,
          confidenceScore: { gte: 0.3 }, // Seuil de confiance minimum
          ...(context && { context: { contains: context } }),
          ...(segment && { segment })
        },
        orderBy: [
          { confidenceScore: 'desc' },
          { occurrences: 'desc' }
        ],
        take: 10
      });

      return patterns;
    } catch (error) {
      console.error('❌ Erreur FeedbackService.getLearningPatterns:', error);
      return [];
    }
  }
}