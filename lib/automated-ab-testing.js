/**
 * Automated A/B Testing System for Email Templates
 * Automatically tests template variations and optimizes performance
 */

import { prisma } from './database.js';

export class AutomatedABTesting {
  constructor() {
    this.testConfigs = {
      minSampleSize: 20,        // Minimum emails per variant
      confidenceLevel: 0.95,    // Statistical significance threshold
      maxTestDuration: 14,      // Days
      minTestDuration: 3,       // Days
      trafficSplit: [50, 50],   // Percentage split for A/B
      metrics: ['open_rate', 'response_rate', 'click_rate', 'conversion_rate']
    };

    this.testStrategies = {
      subject_line: 'Test different subject line approaches',
      opening_paragraph: 'Test email opening variations',
      call_to_action: 'Test different CTA formulations',
      tone: 'Test formal vs friendly tone',
      length: 'Test short vs detailed emails',
      personalization: 'Test personalization levels'
    };
  }

  /**
   * Create A/B test for template variations
   */
  async createABTest(baseTemplate, variations, testConfig = {}) {
    const config = { ...this.testConfigs, ...testConfig };

    try {
      // Create test in database
      const abTest = await prisma.aBTest.create({
        data: {
          name: `${baseTemplate.name}_${Date.now()}`,
          description: `A/B test for ${baseTemplate.category}`,
          testType: testConfig.testType || 'subject_line',
          status: 'active',
          startDate: new Date(),
          endDate: new Date(Date.now() + config.maxTestDuration * 24 * 60 * 60 * 1000),
          trafficSplit: config.trafficSplit,
          minSampleSize: config.minSampleSize,
          confidenceLevel: config.confidenceLevel,
          baseTemplateId: baseTemplate.id
        }
      });

      // Create variants
      const variants = [];
      for (let i = 0; i < variations.length; i++) {
        const variant = await prisma.testVariant.create({
          data: {
            abTestId: abTest.id,
            name: `Variant_${String.fromCharCode(65 + i)}`, // A, B, C...
            subject: variations[i].subject || baseTemplate.subject,
            content: variations[i].content || baseTemplate.content,
            changes: JSON.stringify(variations[i].changes || {}),
            trafficPercentage: config.trafficSplit[i] || Math.floor(100 / variations.length),
            isControl: i === 0
          }
        });
        variants.push(variant);
      }

      console.log(`🧪 A/B Test créé: ${abTest.name} avec ${variants.length} variants`);

      return {
        test: abTest,
        variants: variants,
        status: 'created'
      };

    } catch (error) {
      console.error('❌ Erreur création A/B test:', error);
      throw error;
    }
  }

  /**
   * Automatically generate template variations based on strategy
   */
  async generateTemplateVariations(baseTemplate, strategy = 'subject_line', count = 2) {
    const variations = [];

    switch (strategy) {
      case 'subject_line':
        variations.push(...this.generateSubjectLineVariations(baseTemplate, count));
        break;

      case 'opening_paragraph':
        variations.push(...this.generateOpeningVariations(baseTemplate, count));
        break;

      case 'call_to_action':
        variations.push(...this.generateCTAVariations(baseTemplate, count));
        break;

      case 'tone':
        variations.push(...this.generateToneVariations(baseTemplate, count));
        break;

      case 'length':
        variations.push(...this.generateLengthVariations(baseTemplate, count));
        break;

      default:
        variations.push(...this.generateSubjectLineVariations(baseTemplate, count));
    }

    return variations;
  }

  /**
   * Generate subject line variations
   */
  generateSubjectLineVariations(baseTemplate, count = 2) {
    const variations = [];
    const originalSubject = baseTemplate.subject;

    // Variation strategies for subject lines
    const strategies = [
      {
        name: 'Question_Format',
        transform: (subject) => this.transformToQuestion(subject)
      },
      {
        name: 'Urgency_Added',
        transform: (subject) => `⚡ ${subject} - Action requise`
      },
      {
        name: 'Personalized',
        transform: (subject) => `[PERSONALISÉ] ${subject}`
      },
      {
        name: 'Benefit_Focused',
        transform: (subject) => this.addBenefitToSubject(subject)
      },
      {
        name: 'Shorter_Version',
        transform: (subject) => this.shortenSubject(subject)
      },
      {
        name: 'Emoji_Enhanced',
        transform: (subject) => this.addEmojisToSubject(subject)
      }
    ];

    for (let i = 0; i < Math.min(count, strategies.length); i++) {
      const strategy = strategies[i];
      variations.push({
        subject: strategy.transform(originalSubject),
        content: baseTemplate.content,
        changes: {
          type: 'subject_line',
          strategy: strategy.name,
          original: originalSubject
        }
      });
    }

    return variations;
  }

  /**
   * Generate opening paragraph variations
   */
  generateOpeningVariations(baseTemplate, count = 2) {
    const variations = [];
    const content = baseTemplate.content;

    const openingStrategies = [
      {
        name: 'Direct_Approach',
        opening: 'Je vais directement au point :'
      },
      {
        name: 'Question_Opening',
        opening: 'Puis-je vous poser une question rapide ?'
      },
      {
        name: 'Compliment_Opening',
        opening: 'J\'ai été impressionné par votre approche récente...'
      },
      {
        name: 'Problem_Opening',
        opening: 'Beaucoup d\'entreprises comme la vôtre font face à ce défi :'
      }
    ];

    for (let i = 0; i < Math.min(count, openingStrategies.length); i++) {
      const strategy = openingStrategies[i];
      const modifiedContent = this.replaceOpening(content, strategy.opening);

      variations.push({
        subject: baseTemplate.subject,
        content: modifiedContent,
        changes: {
          type: 'opening_paragraph',
          strategy: strategy.name,
          new_opening: strategy.opening
        }
      });
    }

    return variations;
  }

  /**
   * Generate Call-to-Action variations
   */
  generateCTAVariations(baseTemplate, count = 2) {
    const variations = [];
    const content = baseTemplate.content;

    const ctaStrategies = [
      'Planifier un échange de 15 minutes',
      'Découvrir comment nous pouvons vous aider',
      'Voir une démonstration personnalisée',
      'Obtenir une analyse gratuite',
      'Discuter de vos enjeux spécifiques',
      'Planifier une session stratégique'
    ];

    for (let i = 0; i < Math.min(count, ctaStrategies.length); i++) {
      const newCTA = ctaStrategies[i];
      const modifiedContent = this.replaceCTA(content, newCTA);

      variations.push({
        subject: baseTemplate.subject,
        content: modifiedContent,
        changes: {
          type: 'call_to_action',
          new_cta: newCTA
        }
      });
    }

    return variations;
  }

  /**
   * Generate tone variations
   */
  generateToneVariations(baseTemplate, count = 2) {
    const variations = [];

    const toneTransformations = [
      {
        name: 'More_Formal',
        transform: (content) => this.makeToneFormal(content)
      },
      {
        name: 'More_Friendly',
        transform: (content) => this.makeToneFriendly(content)
      },
      {
        name: 'More_Direct',
        transform: (content) => this.makeToneDirect(content)
      }
    ];

    for (let i = 0; i < Math.min(count, toneTransformations.length); i++) {
      const transformation = toneTransformations[i];

      variations.push({
        subject: baseTemplate.subject,
        content: transformation.transform(baseTemplate.content),
        changes: {
          type: 'tone',
          strategy: transformation.name
        }
      });
    }

    return variations;
  }

  /**
   * Generate length variations
   */
  generateLengthVariations(baseTemplate, count = 2) {
    const variations = [];
    const content = baseTemplate.content;

    variations.push({
      subject: baseTemplate.subject,
      content: this.shortenContent(content, 0.7), // 70% of original length
      changes: {
        type: 'length',
        strategy: 'Shorter_Version',
        reduction: '30%'
      }
    });

    if (count > 1) {
      variations.push({
        subject: baseTemplate.subject,
        content: this.expandContent(content), // Add detail
        changes: {
          type: 'length',
          strategy: 'Detailed_Version',
          expansion: 'Added_Details'
        }
      });
    }

    return variations;
  }

  /**
   * Select winning variant for email assignment
   */
  async selectVariantForEmail(abTestId, userContext = {}) {
    try {
      const test = await prisma.aBTest.findUnique({
        where: { id: abTestId },
        include: { variants: true }
      });

      if (!test || test.status !== 'active') {
        return null;
      }

      // Check if test should end
      if (await this.shouldEndTest(test)) {
        await this.endTest(abTestId);
        return await this.getWinningVariant(abTestId);
      }

      // Random assignment based on traffic split
      const random = Math.random() * 100;
      let cumulative = 0;

      for (const variant of test.variants) {
        cumulative += variant.trafficPercentage;
        if (random <= cumulative) {
          // Record assignment
          await this.recordVariantAssignment(variant.id, userContext);
          return variant;
        }
      }

      // Fallback to first variant
      return test.variants[0];

    } catch (error) {
      console.error('❌ Erreur sélection variant:', error);
      return null;
    }
  }

  /**
   * Record test result (email sent, opened, clicked, etc.)
   */
  async recordTestResult(variantId, metric, value = 1, metadata = {}) {
    try {
      await prisma.testResult.create({
        data: {
          variantId: variantId,
          metric: metric,
          value: value,
          metadata: JSON.stringify(metadata),
          timestamp: new Date()
        }
      });

      // Check if we should analyze results
      await this.checkAndAnalyzeResults(variantId);

    } catch (error) {
      console.error('❌ Erreur enregistrement résultat test:', error);
    }
  }

  /**
   * Analyze A/B test results and determine winner
   */
  async analyzeTestResults(abTestId) {
    try {
      const test = await prisma.aBTest.findUnique({
        where: { id: abTestId },
        include: {
          variants: {
            include: {
              results: true,
              assignments: true
            }
          }
        }
      });

      const analysis = {
        testId: abTestId,
        status: test.status,
        variants: [],
        winner: null,
        confidence: 0,
        recommendations: []
      };

      // Calculate metrics for each variant
      for (const variant of test.variants) {
        const variantMetrics = this.calculateVariantMetrics(variant);
        analysis.variants.push({
          id: variant.id,
          name: variant.name,
          isControl: variant.isControl,
          assignments: variant.assignments.length,
          metrics: variantMetrics
        });
      }

      // Determine statistical significance
      const significance = this.calculateStatisticalSignificance(analysis.variants);
      analysis.confidence = significance.confidence;
      analysis.winner = significance.winner;

      // Generate recommendations
      analysis.recommendations = this.generateTestRecommendations(analysis);

      return analysis;

    } catch (error) {
      console.error('❌ Erreur analyse résultats A/B test:', error);
      throw error;
    }
  }

  /**
   * Calculate metrics for a variant
   */
  calculateVariantMetrics(variant) {
    const totalAssignments = variant.assignments.length;
    const results = variant.results;

    const metrics = {
      total_assigned: totalAssignments,
      total_sent: 0,
      total_opened: 0,
      total_clicked: 0,
      total_responded: 0,
      open_rate: 0,
      click_rate: 0,
      response_rate: 0,
      conversion_rate: 0
    };

    // Count results by metric
    results.forEach(result => {
      switch (result.metric) {
        case 'sent':
          metrics.total_sent += result.value;
          break;
        case 'opened':
          metrics.total_opened += result.value;
          break;
        case 'clicked':
          metrics.total_clicked += result.value;
          break;
        case 'responded':
          metrics.total_responded += result.value;
          break;
      }
    });

    // Calculate rates
    if (metrics.total_sent > 0) {
      metrics.open_rate = (metrics.total_opened / metrics.total_sent) * 100;
      metrics.click_rate = (metrics.total_clicked / metrics.total_sent) * 100;
      metrics.response_rate = (metrics.total_responded / metrics.total_sent) * 100;
      metrics.conversion_rate = metrics.response_rate; // For simplicity
    }

    return metrics;
  }

  /**
   * Calculate statistical significance between variants
   */
  calculateStatisticalSignificance(variants) {
    if (variants.length < 2) return { confidence: 0, winner: null };

    // Find control and best performing variant
    const control = variants.find(v => v.isControl) || variants[0];
    const challenger = variants
      .filter(v => !v.isControl)
      .sort((a, b) => b.metrics.response_rate - a.metrics.response_rate)[0];

    if (!challenger) return { confidence: 0, winner: control };

    // Simple statistical significance calculation
    const controlRate = control.metrics.response_rate / 100;
    const challengerRate = challenger.metrics.response_rate / 100;
    const controlSize = control.assignments;
    const challengerSize = challenger.assignments;

    // Z-test for proportions
    const pooledRate = ((control.metrics.total_responded + challenger.metrics.total_responded) /
                       (controlSize + challengerSize));

    const standardError = Math.sqrt(pooledRate * (1 - pooledRate) * (1/controlSize + 1/challengerSize));
    const zScore = Math.abs((challengerRate - controlRate) / standardError);

    // Convert to confidence level (simplified)
    const confidence = Math.min(0.99, Math.max(0, (zScore - 1.645) / (2.576 - 1.645)));

    return {
      confidence: confidence,
      winner: challengerRate > controlRate ? challenger : control,
      improvement: ((challengerRate - controlRate) / controlRate * 100).toFixed(2)
    };
  }

  /**
   * Generate recommendations based on test results
   */
  generateTestRecommendations(analysis) {
    const recommendations = [];

    if (analysis.confidence > 0.95) {
      recommendations.push({
        type: 'winner_found',
        message: `Variant ${analysis.winner.name} is statistically significant winner`,
        action: 'implement_winner'
      });
    } else if (analysis.confidence > 0.8) {
      recommendations.push({
        type: 'trending_winner',
        message: `Variant ${analysis.winner.name} shows promising results but needs more data`,
        action: 'continue_test'
      });
    } else {
      recommendations.push({
        type: 'inconclusive',
        message: 'Results are not yet statistically significant',
        action: 'extend_test_or_increase_traffic'
      });
    }

    // Performance recommendations
    const bestVariant = analysis.variants.sort((a, b) => b.metrics.response_rate - a.metrics.response_rate)[0];
    if (bestVariant.metrics.response_rate > 15) {
      recommendations.push({
        type: 'high_performance',
        message: `Excellent response rate of ${bestVariant.metrics.response_rate.toFixed(1)}%`,
        action: 'scale_successful_approach'
      });
    }

    return recommendations;
  }

  /**
   * Automatically create A/B tests for new templates
   */
  async autoCreateABTestsForTemplate(templateId, strategies = ['subject_line', 'opening_paragraph']) {
    try {
      const template = await this.getTemplateById(templateId);
      if (!template) return null;

      const allTests = [];

      for (const strategy of strategies) {
        const variations = await this.generateTemplateVariations(template, strategy, 2);
        const abTest = await this.createABTest(template, variations, {
          testType: strategy,
          name: `Auto_${strategy}_${template.name}`
        });
        allTests.push(abTest);
      }

      console.log(`🤖 Auto-créé ${allTests.length} A/B tests pour template ${template.name}`);
      return allTests;

    } catch (error) {
      console.error('❌ Erreur auto-création A/B tests:', error);
      return null;
    }
  }

  // Helper methods for content transformation
  transformToQuestion(subject) {
    const questionStarters = [
      'Comment améliorer',
      'Avez-vous pensé à',
      'Que se passerait-il si',
      'Savez-vous que'
    ];
    const starter = questionStarters[Math.floor(Math.random() * questionStarters.length)];
    return `${starter} ${subject.toLowerCase()} ?`;
  }

  addBenefitToSubject(subject) {
    const benefits = [
      'Économisez 30% sur vos coûts IT',
      'Gagnez en productivité',
      'Sécurisez vos données',
      'Modernisez votre infrastructure'
    ];
    const benefit = benefits[Math.floor(Math.random() * benefits.length)];
    return `${benefit} - ${subject}`;
  }

  shortenSubject(subject) {
    const words = subject.split(' ');
    return words.slice(0, Math.max(3, Math.floor(words.length * 0.7))).join(' ');
  }

  addEmojisToSubject(subject) {
    const emojis = ['🚀', '💡', '⚡', '🎯', '📈', '🔧'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    return `${emoji} ${subject}`;
  }

  replaceOpening(content, newOpening) {
    const lines = content.split('\n');
    lines[2] = newOpening; // Assuming third line is opening
    return lines.join('\n');
  }

  replaceCTA(content, newCTA) {
    // Find and replace common CTA patterns
    return content.replace(
      /(Contactez-moi|Planifiez un|Découvrez|Réservez)[^.!?]*/g,
      newCTA
    );
  }

  makeToneFormal(content) {
    return content
      .replace(/bonjour/gi, 'Madame, Monsieur')
      .replace(/merci/gi, 'Je vous remercie')
      .replace(/à bientôt/gi, 'Cordialement');
  }

  makeToneFriendly(content) {
    return content
      .replace(/Madame, Monsieur/gi, 'Bonjour')
      .replace(/Cordialement/gi, 'À bientôt !')
      .replace(/Je vous remercie/gi, 'Merci');
  }

  makeToneDirect(content) {
    return content
      .replace(/Je me permets de/gi, 'Je')
      .replace(/J'aimerais vous proposer/gi, 'Je vous propose')
      .replace(/Il serait intéressant de/gi, 'Nous devons');
  }

  shortenContent(content, factor = 0.7) {
    const sentences = content.split(/[.!?]+/);
    const targetLength = Math.floor(sentences.length * factor);
    return sentences.slice(0, targetLength).join('.') + '.';
  }

  expandContent(content) {
    // Add common expansion phrases
    const expansions = [
      '\n\nDe plus, cette approche vous permettra de bénéficier d\'une expertise reconnue.',
      '\n\nNous avons déjà accompagné des entreprises similaires avec succès.',
      '\n\nJe serais ravi de vous présenter des cas concrets lors de notre échange.'
    ];
    return content + expansions[Math.floor(Math.random() * expansions.length)];
  }

  // Additional helper methods
  async shouldEndTest(test) {
    const now = new Date();
    const testDuration = (now - test.startDate) / (1000 * 60 * 60 * 24);

    // End if past max duration
    if (testDuration > this.testConfigs.maxTestDuration) return true;

    // End if minimum duration reached and we have statistical significance
    if (testDuration >= this.testConfigs.minTestDuration) {
      const analysis = await this.analyzeTestResults(test.id);
      return analysis.confidence > 0.95;
    }

    return false;
  }

  async endTest(abTestId) {
    await prisma.aBTest.update({
      where: { id: abTestId },
      data: {
        status: 'completed',
        endDate: new Date()
      }
    });
  }

  async getWinningVariant(abTestId) {
    const analysis = await this.analyzeTestResults(abTestId);
    return analysis.winner;
  }

  async recordVariantAssignment(variantId, userContext) {
    await prisma.variantAssignment.create({
      data: {
        variantId: variantId,
        userId: userContext.userId || 'anonymous',
        sessionId: userContext.sessionId || null,
        timestamp: new Date()
      }
    });
  }

  async checkAndAnalyzeResults(variantId) {
    // Check if this variant's test has enough data for analysis
    const variant = await prisma.testVariant.findUnique({
      where: { id: variantId },
      include: { abTest: true, assignments: true }
    });

    if (variant.assignments.length >= this.testConfigs.minSampleSize) {
      const analysis = await this.analyzeTestResults(variant.abTest.id);

      if (analysis.confidence > 0.95) {
        console.log(`🏆 A/B Test ${variant.abTest.name} has a statistical winner!`);
        await this.endTest(variant.abTest.id);
      }
    }
  }

  async getTemplateById(templateId) {
    // Mock implementation - replace with actual template retrieval
    return {
      id: templateId,
      name: 'Azure Migration Template',
      subject: 'Optimisez votre infrastructure avec Azure',
      content: `Bonjour,

Je me permets de vous contacter concernant l'optimisation de votre infrastructure IT.

Azure peut vous aider à réduire vos coûts tout en améliorant vos performances.

Souhaitez-vous que nous discutions de vos enjeux spécifiques ?

Cordialement,
Nicolas BAYONNE`,
      category: 'migration'
    };
  }
}

export const automatedABTesting = new AutomatedABTesting();