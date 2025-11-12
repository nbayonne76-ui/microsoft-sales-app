// Système d'analytics simple sans base de données
// Stockage en mémoire pour le développement

class SimpleAnalytics {
  constructor() {
    // Storage en mémoire pour les métriques
    this.emailMetrics = new Map();
    this.feedbackData = [];
    this.usageStats = {
      totalEmails: 0,
      toneUsage: {
        professional: 0,
        friendly: 0,
        casual: 0,
        urgent: 0
      },
      templatePerformance: new Map()
    };
    
    // Essayons de récupérer depuis localStorage
    this.loadFromStorage();
  }

  // Sauvegarder en localStorage
  saveToStorage() {
    try {
      const data = {
        emailMetrics: Array.from(this.emailMetrics.entries()),
        feedbackData: this.feedbackData,
        usageStats: {
          ...this.usageStats,
          templatePerformance: Array.from(this.usageStats.templatePerformance.entries())
        }
      };
      localStorage.setItem('emailAnalytics', JSON.stringify(data));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
  }

  // Charger depuis localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('emailAnalytics');
      if (stored) {
        const data = JSON.parse(stored);
        this.emailMetrics = new Map(data.emailMetrics || []);
        this.feedbackData = data.feedbackData || [];
        if (data.usageStats) {
          this.usageStats = {
            ...data.usageStats,
            templatePerformance: new Map(data.usageStats.templatePerformance || [])
          };
        }
      }
    } catch (error) {
      console.warn('Could not load from localStorage:', error);
    }
  }

  // Enregistrer la génération d'un email
  trackEmailGeneration(emailData) {
    const id = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const timestamp = new Date();
    
    const emailRecord = {
      id,
      timestamp,
      tone: emailData.tone,
      templateUsed: emailData.templateIndex || 0,
      contentLength: emailData.contentLength || 0,
      subject: emailData.subject || '',
      status: 'generated'
    };

    this.emailMetrics.set(id, emailRecord);
    this.usageStats.totalEmails++;
    this.usageStats.toneUsage[emailData.tone]++;
    
    this.saveToStorage();
    console.log('📊 Email tracked:', id, emailData.tone);
    
    return id;
  }

  // Enregistrer un feedback
  recordFeedback(emailId, feedback) {
    const feedbackRecord = {
      emailId,
      timestamp: new Date(),
      rating: feedback.rating, // 1-5
      effectiveness: feedback.effectiveness, // 1-5
      tone_match: feedback.tone_match, // 1-5
      comments: feedback.comments || '',
      would_use_again: feedback.would_use_again || false
    };

    this.feedbackData.push(feedbackRecord);
    
    // Mettre à jour les métriques de l'email
    if (this.emailMetrics.has(emailId)) {
      const emailRecord = this.emailMetrics.get(emailId);
      emailRecord.feedback = feedbackRecord;
      emailRecord.status = 'rated';
      this.emailMetrics.set(emailId, emailRecord);
    }

    // Mettre à jour les performances des templates
    const email = this.emailMetrics.get(emailId);
    if (email) {
      const templateKey = `${email.tone}_${email.templateUsed}`;
      const current = this.usageStats.templatePerformance.get(templateKey) || {
        usage: 0,
        totalRating: 0,
        feedbackCount: 0,
        averageRating: 0
      };

      current.usage++;
      current.totalRating += feedback.rating;
      current.feedbackCount++;
      current.averageRating = current.totalRating / current.feedbackCount;

      this.usageStats.templatePerformance.set(templateKey, current);
    }
    
    this.saveToStorage();
    console.log('📈 Feedback recorded:', emailId, feedback.rating);
    
    return feedbackRecord;
  }

  // Obtenir les métriques globales
  getOverallMetrics() {
    const totalFeedbacks = this.feedbackData.length;
    const averageRating = totalFeedbacks > 0 
      ? this.feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks 
      : 0;

    const tonePerformance = {};
    Object.keys(this.usageStats.toneUsage).forEach(tone => {
      const toneFeedbacks = this.feedbackData.filter(f => {
        const email = this.emailMetrics.get(f.emailId);
        return email && email.tone === tone;
      });
      
      tonePerformance[tone] = {
        usage: this.usageStats.toneUsage[tone],
        feedback_count: toneFeedbacks.length,
        average_rating: toneFeedbacks.length > 0 
          ? toneFeedbacks.reduce((sum, f) => sum + f.rating, 0) / toneFeedbacks.length 
          : 0,
        effectiveness: toneFeedbacks.length > 0 
          ? toneFeedbacks.reduce((sum, f) => sum + f.effectiveness, 0) / toneFeedbacks.length 
          : 0
      };
    });

    return {
      total_emails: this.usageStats.totalEmails,
      total_feedbacks: totalFeedbacks,
      average_rating: Math.round(averageRating * 100) / 100,
      tone_performance: tonePerformance,
      feedback_rate: this.usageStats.totalEmails > 0 
        ? Math.round((totalFeedbacks / this.usageStats.totalEmails) * 100) 
        : 0
    };
  }

  // Obtenir les templates les plus performants
  getTopPerformingTemplates() {
    const templates = Array.from(this.usageStats.templatePerformance.entries())
      .map(([key, data]) => ({
        template: key,
        ...data,
        success_rate: data.averageRating >= 4 ? Math.round((data.averageRating / 5) * 100) : 0
      }))
      .filter(t => t.feedbackCount > 0)
      .sort((a, b) => b.averageRating - a.averageRating);

    return templates.slice(0, 5); // Top 5
  }

  // Recommandation intelligente de ton
  getRecommendedTone(context = '') {
    const metrics = this.getOverallMetrics();
    
    // Trouver le ton avec la meilleure performance
    let bestTone = 'professional'; // default
    let bestScore = 0;

    Object.entries(metrics.tone_performance).forEach(([tone, perf]) => {
      if (perf.feedback_count > 0) {
        // Score basé sur rating et effectiveness
        const score = (perf.average_rating * 0.6) + (perf.effectiveness * 0.4);
        if (score > bestScore) {
          bestScore = score;
          bestTone = tone;
        }
      }
    });

    return {
      recommended_tone: bestTone,
      confidence: bestScore / 5,
      reason: `Meilleur performance: ${Math.round(bestScore * 100)/100}/5 basé sur ${metrics.tone_performance[bestTone]?.feedback_count || 0} retours`
    };
  }

  // Reset des données (pour tests)
  reset() {
    this.emailMetrics.clear();
    this.feedbackData = [];
    this.usageStats = {
      totalEmails: 0,
      toneUsage: {
        professional: 0,
        friendly: 0,
        casual: 0,
        urgent: 0
      },
      templatePerformance: new Map()
    };
    localStorage.removeItem('emailAnalytics');
    console.log('🧹 Analytics data reset');
  }
}

// Instance globale
const analytics = new SimpleAnalytics();

export default analytics;