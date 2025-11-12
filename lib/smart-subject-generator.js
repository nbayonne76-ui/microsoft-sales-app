/**
 * SMART SUBJECT LINE GENERATOR
 *
 * Quick Win #3: Context-aware email subject generation
 *
 * Generates personalized, high-performing email subject lines using:
 * - Lead context (company, industry, size, tech stack)
 * - Engagement level (hot/warm/cold)
 * - Recent interactions
 * - Proven subject line patterns
 * - A/B testing insights
 */

import { getLeadContext } from './lead-context-aggregator.js';
import { calculateLeadEngagement } from './engagement-tracker.js';

/**
 * Generate context-aware subject lines for a lead
 */
export async function generateSmartSubjectLines(options = {}) {
  const {
    leadId,
    purpose = 'prospection', // prospection, follow_up, demo, proposal
    count = 5,
    includeEmojis = false,
    maxLength = 60
  } = options;

  console.log(`📧 [SUBJECT] Generating smart subjects for lead: ${leadId}`);

  try {
    // Get enriched context
    const context = leadId ? await getLeadContext(leadId) : null;
    const engagement = leadId ? await calculateLeadEngagement(leadId) : null;

    // Build subject line generator
    const generator = new SubjectLineGenerator(context, engagement);

    // Generate subjects
    const subjects = generator.generate({
      purpose,
      count,
      includeEmojis,
      maxLength
    });

    console.log(`✅ [SUBJECT] Generated ${subjects.length} subjects`);

    return {
      success: true,
      subjects,
      context: {
        company: context?.company.name,
        engagementLevel: engagement?.level,
        dataQuality: context?.metadata.dataQuality
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        purpose,
        contextUsed: !!context
      }
    };

  } catch (error) {
    console.error('❌ [SUBJECT] Generation error:', error);
    throw error;
  }
}

/**
 * Subject Line Generator Class
 */
class SubjectLineGenerator {
  constructor(context, engagement) {
    this.context = context;
    this.engagement = engagement;
    this.company = context?.company.name || '[Company]';
    this.employeeCount = context?.company.employeeCount;
    this.services = context?.capabilities.services || [];
    this.solutions = context?.recommendedSolutions || [];
    this.engagementLevel = engagement?.level || 'cold';
    this.lastInteraction = engagement?.lastInteraction;
  }

  /**
   * Main generation method
   */
  generate(options) {
    const { purpose, count, includeEmojis, maxLength } = options;

    let subjects = [];

    // Generate based on purpose
    switch (purpose) {
      case 'prospection':
        subjects = this.generateProspectionSubjects();
        break;
      case 'follow_up':
        subjects = this.generateFollowUpSubjects();
        break;
      case 'demo':
        subjects = this.generateDemoSubjects();
        break;
      case 'proposal':
        subjects = this.generateProposalSubjects();
        break;
      default:
        subjects = this.generateProspectionSubjects();
    }

    // Add context-specific subjects
    subjects.push(...this.generateContextSpecificSubjects());

    // Add engagement-based subjects
    subjects.push(...this.generateEngagementBasedSubjects());

    // Remove duplicates
    subjects = [...new Set(subjects)];

    // Filter by max length
    subjects = subjects.filter(s => s.length <= maxLength);

    // Add emojis if requested
    if (includeEmojis) {
      subjects = subjects.map(s => this.addEmoji(s, purpose));
    }

    // Score and rank subjects
    const scored = subjects.map(subject => ({
      subject,
      score: this.scoreSubject(subject, purpose),
      estimatedOpenRate: this.estimateOpenRate(subject)
    }));

    // Sort by score
    scored.sort((a, b) => b.score - a.score);

    // Return top N
    return scored.slice(0, count);
  }

  /**
   * Generate prospection subjects
   */
  generateProspectionSubjects() {
    const subjects = [];

    // Company-specific
    subjects.push(`Solutions Microsoft pour ${this.company}`);
    subjects.push(`${this.company} : Optimisons votre infrastructure Microsoft`);

    // Employee count specific
    if (this.employeeCount) {
      if (this.employeeCount > 250) {
        subjects.push(`Azure Enterprise pour ${this.company} (${this.employeeCount}+ collaborateurs)`);
        subjects.push(`Transformation digitale : ${this.company} & Microsoft`);
      } else if (this.employeeCount > 50) {
        subjects.push(`Microsoft 365 pour votre équipe de ${this.employeeCount}`);
        subjects.push(`${this.company} : Boostez la productivité de vos ${this.employeeCount} collaborateurs`);
      } else {
        subjects.push(`Solutions Microsoft adaptées aux équipes de ${this.employeeCount}`);
        subjects.push(`${this.company} : Microsoft pour startups et PME`);
      }
    }

    // Service-specific
    if (this.services.length > 0) {
      const mainService = this.services[0].name;
      subjects.push(`Microsoft & ${mainService} : Synergie pour ${this.company}`);
      subjects.push(`Optimisez ${mainService} avec Microsoft Azure`);
    }

    // Solution-specific
    if (this.solutions.length > 0) {
      const topSolution = this.solutions[0].name;
      subjects.push(`${topSolution} : Solution prioritaire pour ${this.company}`);
      subjects.push(`${this.company} : Découvrez ${topSolution}`);
    }

    // Generic but personalized
    subjects.push(`${this.company} x Microsoft : Planifions votre succès`);
    subjects.push(`Nouveau contact Microsoft pour ${this.company}`);
    subjects.push(`${this.company} : Échange stratégique Microsoft`);

    return subjects;
  }

  /**
   * Generate follow-up subjects
   */
  generateFollowUpSubjects() {
    const subjects = [];

    // Based on last interaction
    if (this.lastInteraction) {
      const daysSince = Math.floor(
        (Date.now() - new Date(this.lastInteraction.date).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSince <= 3) {
        subjects.push(`${this.company} : Suite à notre échange d'hier`);
        subjects.push(`Re: ${this.lastInteraction.subject || 'Notre discussion'}`);
      } else if (daysSince <= 7) {
        subjects.push(`${this.company} : Avez-vous eu le temps d'y réfléchir?`);
        subjects.push(`Point d'étape : ${this.company} & Microsoft`);
      } else {
        subjects.push(`${this.company} : Relançons notre projet Microsoft`);
        subjects.push(`Toujours intéressé? Discutons de ${this.company}`);
      }
    }

    // Generic follow-ups
    subjects.push(`${this.company} : Prochaines étapes Microsoft`);
    subjects.push(`Suite à votre intérêt : Proposition Microsoft pour ${this.company}`);
    subjects.push(`${this.company} : Réponse à vos questions Microsoft`);
    subjects.push(`${this.company} : Planning de mise en œuvre Microsoft`);

    return subjects;
  }

  /**
   * Generate demo subjects
   */
  generateDemoSubjects() {
    const subjects = [];

    if (this.solutions.length > 0) {
      const solution = this.solutions[0].name;
      subjects.push(`Démonstration ${solution} pour ${this.company}`);
      subjects.push(`${this.company} : Votre démo ${solution} personnalisée`);
      subjects.push(`${solution} en action : Démo exclusive pour ${this.company}`);
    }

    subjects.push(`Démonstration Microsoft personnalisée - ${this.company}`);
    subjects.push(`${this.company} : Découvrez vos solutions en action`);
    subjects.push(`Workshop Microsoft : ${this.company} (Date à confirmer)`);
    subjects.push(`${this.company} : Créneaux disponibles pour votre démo`);

    return subjects;
  }

  /**
   * Generate proposal subjects
   */
  generateProposalSubjects() {
    const subjects = [];

    subjects.push(`Proposition commerciale Microsoft - ${this.company}`);
    subjects.push(`${this.company} : Votre devis Microsoft personnalisé`);
    subjects.push(`Offre exclusive : Solutions Microsoft pour ${this.company}`);
    subjects.push(`${this.company} : ROI et tarification Microsoft`);
    subjects.push(`${this.company} : Proposition de valeur Microsoft`);

    if (this.employeeCount) {
      subjects.push(`Tarification Microsoft pour ${this.employeeCount} utilisateurs - ${this.company}`);
    }

    return subjects;
  }

  /**
   * Generate context-specific subjects
   */
  generateContextSpecificSubjects() {
    const subjects = [];

    // Based on data quality
    if (this.context?.metadata.dataQuality > 80) {
      // High quality data = very specific subjects
      const services = this.services.slice(0, 2).map(s => s.name).join(' + ');
      if (services) {
        subjects.push(`${this.company} : Microsoft pour ${services}`);
      }
    }

    // Recent news (future enhancement)
    // if (this.context?.newsEvents?.length > 0) {
    //   subjects.push(`${this.company} : Microsoft et votre expansion`);
    // }

    return subjects;
  }

  /**
   * Generate engagement-based subjects
   */
  generateEngagementBasedSubjects() {
    const subjects = [];

    switch (this.engagementLevel) {
      case 'hot':
        // Urgent, direct CTAs
        subjects.push(`${this.company} : Finalisons votre projet Microsoft`);
        subjects.push(`URGENT : ${this.company} - Créneaux limités disponibles`);
        subjects.push(`${this.company} : Passons à l'action avec Microsoft`);
        break;

      case 'warm':
        // Value-focused, nurturing
        subjects.push(`${this.company} : Comment Microsoft peut vous aider`);
        subjects.push(`${this.company} : Cas clients similaires Microsoft`);
        subjects.push(`${this.company} : Les avantages que vous attendez`);
        break;

      case 'cold':
        // Educational, soft approach
        subjects.push(`${this.company} : Présentation Microsoft en 5 minutes`);
        subjects.push(`${this.company} : Découvrez Microsoft sans engagement`);
        subjects.push(`${this.company} : Une simple question sur vos besoins`);
        break;
    }

    return subjects;
  }

  /**
   * Add emoji to subject line
   */
  addEmoji(subject, purpose) {
    const emojis = {
      prospection: ['💼', '🚀', '💡', '🎯'],
      follow_up: ['👋', '📧', '⏰', '🔔'],
      demo: ['🎥', '👀', '🖥️', '✨'],
      proposal: ['📊', '💰', '📈', '🎁']
    };

    const purposeEmojis = emojis[purpose] || emojis.prospection;
    const emoji = purposeEmojis[Math.floor(Math.random() * purposeEmojis.length)];

    // Add emoji at the beginning
    return `${emoji} ${subject}`;
  }

  /**
   * Score subject line quality
   */
  scoreSubject(subject, purpose) {
    let score = 50; // Base score

    // Length (optimal: 40-60 chars)
    const length = subject.length;
    if (length >= 40 && length <= 60) score += 20;
    else if (length < 40) score += 10;
    else if (length > 70) score -= 10;

    // Personalization
    if (subject.includes(this.company)) score += 15;
    if (this.employeeCount && subject.includes(this.employeeCount.toString())) score += 10;

    // Specificity
    if (this.services.length > 0 && this.services.some(s => subject.includes(s.name))) score += 10;
    if (this.solutions.length > 0 && this.solutions.some(s => subject.includes(s.name))) score += 10;

    // Urgency words (good for hot leads)
    if (this.engagementLevel === 'hot') {
      if (subject.match(/urgent|important|action|limité/i)) score += 10;
    }

    // Numbers (increase credibility)
    if (subject.match(/\d+/)) score += 5;

    // Question marks (curiosity)
    if (subject.includes('?')) score += 5;

    // Avoid spam words
    if (subject.match(/gratuit|free|cliquez|promo/i)) score -= 20;

    // Caps lock (avoid except for specific cases)
    const capsCount = (subject.match(/[A-Z]/g) || []).length;
    if (capsCount > subject.length * 0.3) score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Estimate open rate based on subject line characteristics
   */
  estimateOpenRate(subject) {
    const score = this.scoreSubject(subject);

    // Base open rate by engagement level
    const baseRates = {
      hot: 45,
      warm: 30,
      cold: 18
    };

    const baseRate = baseRates[this.engagementLevel] || 20;

    // Adjust based on score
    const adjustment = (score - 50) * 0.3; // ±15% max

    const estimated = baseRate + adjustment;

    return Math.round(Math.max(5, Math.min(80, estimated)));
  }
}

/**
 * Test subject lines (A/B testing)
 */
export function createSubjectABTest(subjects, testName = 'Subject Line Test') {
  return {
    testName,
    variants: subjects.map((subjectData, index) => ({
      variant: String.fromCharCode(65 + index), // A, B, C...
      subject: subjectData.subject,
      score: subjectData.score,
      estimatedOpenRate: subjectData.estimatedOpenRate,
      trafficPercentage: Math.round(100 / subjects.length)
    })),
    recommendation: subjects[0].subject, // Highest scoring
    createdAt: new Date().toISOString()
  };
}

/**
 * Get best subject line from history
 */
export async function getBestPerformingSubjects(options = {}) {
  const { limit = 10, purpose = null, minOpenRate = 25 } = options;

  // In a real implementation, this would query the database
  // for historical subject line performance

  // For now, return placeholder structure
  return {
    subjects: [],
    insights: {
      averageLength: 48,
      topWords: ['Microsoft', 'Solutions', 'votre'],
      bestTimeToSend: '10:00-11:00',
      bestDayToSend: 'Mardi'
    }
  };
}
