/**
 * MEETING BRIEF GENERATOR
 *
 * Quick Win #4: Automated meeting preparation briefs
 *
 * Generates comprehensive meeting prep documents using:
 * - Lead context (company, people, services)
 * - Engagement history
 * - Recommended solutions
 * - Talking points
 * - Questions to ask
 * - Potential objections
 */

import { getLeadContext } from './lead-context-aggregator.js';
import { calculateLeadEngagement } from './engagement-tracker.js';

/**
 * Generate meeting brief for a lead
 */
export async function generateMeetingBrief(options = {}) {
  const {
    leadId,
    meetingType = 'discovery', // discovery, demo, proposal, follow_up
    attendees = [],
    duration = 30, // minutes
    includeCompetitors = false,
    includeROI = true
  } = options;

  console.log(`📋 [BRIEF] Generating meeting brief for lead: ${leadId}`);

  try {
    // Get enriched context
    const context = await getLeadContext(leadId);
    if (!context) {
      throw new Error('Lead not found or context unavailable');
    }

    // Get engagement data
    const engagement = await calculateLeadEngagement(leadId);

    // Generate brief
    const generator = new MeetingBriefGenerator(context, engagement);
    const brief = generator.generate({
      meetingType,
      attendees,
      duration,
      includeCompetitors,
      includeROI
    });

    console.log(`✅ [BRIEF] Generated ${meetingType} brief for ${context.company.name}`);

    return {
      success: true,
      brief,
      metadata: {
        company: context.company.name,
        engagementLevel: engagement?.level,
        dataQuality: context.metadata.dataQuality,
        generatedAt: new Date().toISOString(),
        meetingType
      }
    };

  } catch (error) {
    console.error('❌ [BRIEF] Generation error:', error);
    throw error;
  }
}

/**
 * Meeting Brief Generator Class
 */
class MeetingBriefGenerator {
  constructor(context, engagement) {
    this.context = context;
    this.engagement = engagement;
    this.company = context.company.name;
  }

  /**
   * Main generation method
   */
  generate(options) {
    const { meetingType, attendees, duration, includeCompetitors, includeROI } = options;

    const brief = {
      header: this.generateHeader(meetingType, duration),
      companyOverview: this.generateCompanyOverview(),
      keyPeople: this.generateKeyPeople(),
      engagementSummary: this.generateEngagementSummary(),
      meetingObjectives: this.generateMeetingObjectives(meetingType),
      talkingPoints: this.generateTalkingPoints(meetingType),
      questionsToAsk: this.generateQuestions(meetingType),
      recommendedSolutions: this.generateRecommendedSolutions(),
      potentialObjections: this.generateObjections(),
      nextSteps: this.generateNextSteps(meetingType),
      notes: this.generateNotes()
    };

    // Optional sections
    if (includeROI) {
      brief.roiTalkingPoints = this.generateROIPoints();
    }

    if (includeCompetitors) {
      brief.competitiveIntel = this.generateCompetitiveIntel();
    }

    // Add metadata
    brief.metadata = {
      meetingType,
      duration,
      prepTime: this.estimatePrepTime(),
      confidenceLevel: this.calculateConfidence()
    };

    return brief;
  }

  /**
   * Generate header section
   */
  generateHeader(meetingType, duration) {
    const meetingTypeLabels = {
      discovery: 'Réunion de Découverte',
      demo: 'Démonstration Produit',
      proposal: 'Présentation Commerciale',
      follow_up: 'Réunion de Suivi'
    };

    return {
      title: `Brief Réunion - ${this.company}`,
      subtitle: meetingTypeLabels[meetingType] || 'Réunion',
      duration: `${duration} minutes`,
      company: this.company,
      date: new Date().toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      engagementBadge: this.engagement?.level ? `${this.getEngagementEmoji()} ${this.engagement.level.toUpperCase()}` : 'Nouveau contact'
    };
  }

  /**
   * Generate company overview
   */
  generateCompanyOverview() {
    const company = this.context.company;
    const legal = this.context.legal;

    return {
      summary: this.generateCompanySummary(),
      basics: {
        nom: company.name,
        secteur: legal.nafCode || 'Non spécifié',
        effectif: company.employeeCount ? `${company.employeeCount} collaborateurs` : 'Non spécifié',
        formeJuridique: legal.legalForm || 'Non spécifié',
        chiffreAffaires: legal.turnover || 'Non spécifié',
        siteWeb: company.website || 'Non spécifié'
      },
      description: company.description || 'Pas de description disponible',
      dataQuality: `${this.context.metadata.dataQuality}% complète`
    };
  }

  /**
   * Generate 2-3 sentence company summary
   */
  generateCompanySummary() {
    const company = this.context.company;
    const services = this.context.capabilities.services.slice(0, 3);
    const specialties = this.context.capabilities.specialties.slice(0, 2);

    let summary = `${company.name} est une entreprise`;

    if (company.employeeCount) {
      if (company.employeeCount > 250) {
        summary += ` de grande taille (${company.employeeCount}+ collaborateurs)`;
      } else if (company.employeeCount > 50) {
        summary += ` de taille moyenne (${company.employeeCount} collaborateurs)`;
      } else {
        summary += ` de taille PME (${company.employeeCount} collaborateurs)`;
      }
    }

    if (services.length > 0) {
      summary += ` spécialisée en ${services.map(s => s.name).join(', ')}`;
    }

    if (specialties.length > 0) {
      summary += `. Expertises clés : ${specialties.map(s => s.name).join(', ')}`;
    }

    return summary + '.';
  }

  /**
   * Generate key people section
   */
  generateKeyPeople() {
    const managers = this.context.people.managers.slice(0, 5);
    const teamMembers = this.context.people.teamMembers.slice(0, 3);

    return {
      decisionMakers: managers.map(m => ({
        nom: m.name,
        role: m.role,
        email: m.email || 'Non disponible',
        phone: m.phone || 'Non disponible',
        importance: this.assessImportance(m.role)
      })),
      keyContacts: teamMembers.map(t => ({
        nom: t.name,
        role: t.role,
        expertise: t.expertise || 'Non spécifiée'
      })),
      notes: this.generatePeopleNotes(managers)
    };
  }

  /**
   * Assess importance of a role
   */
  assessImportance(role) {
    const highPriority = ['CEO', 'CTO', 'DSI', 'Directeur', 'President', 'VP'];
    const mediumPriority = ['Manager', 'Responsable', 'Chef'];

    const roleUpper = role.toUpperCase();

    if (highPriority.some(p => roleUpper.includes(p.toUpperCase()))) {
      return '🔴 Décideur clé';
    } else if (mediumPriority.some(p => roleUpper.includes(p.toUpperCase()))) {
      return '🟡 Influenceur';
    }
    return '🟢 Contact';
  }

  /**
   * Generate notes about people
   */
  generatePeopleNotes(managers) {
    const notes = [];

    if (managers.length === 0) {
      notes.push('⚠️ Aucun décideur identifié - À clarifier en réunion');
    } else if (managers.length === 1) {
      notes.push(`✅ Contact principal identifié : ${managers[0].name} (${managers[0].role})`);
    } else {
      notes.push(`✅ ${managers.length} décideurs identifiés - Processus de décision collégial possible`);
    }

    return notes;
  }

  /**
   * Generate engagement summary
   */
  generateEngagementSummary() {
    if (!this.engagement) {
      return {
        status: 'Nouveau prospect',
        score: 0,
        level: 'cold',
        details: 'Aucune interaction précédente'
      };
    }

    const recentInteractions = this.context.interactionHistory.email.slice(0, 3);

    return {
      status: `Lead ${this.engagement.level.toUpperCase()}`,
      score: `${this.engagement.score}/100`,
      level: this.engagement.level,
      details: {
        totalInteractions: this.engagement.details.totalInteractions,
        emailsOuverts: this.engagement.details.emailsOpened,
        emailsCliques: this.engagement.details.emailsClicked,
        reponses: this.engagement.details.emailsReplied,
        tauxReponse: `${this.engagement.details.responseRate}%`
      },
      recentActivity: recentInteractions.map(i => ({
        date: new Date(i.createdAt).toLocaleDateString('fr-FR'),
        action: i.subject,
        status: i.status
      })),
      lastContact: this.engagement.lastInteraction
        ? `${this.engagement.daysSinceLastInteraction} jours`
        : 'Jamais',
      trend: `${this.getTrendEmoji()} ${this.engagement.trend}`,
      recommendation: this.getEngagementRecommendation()
    };
  }

  /**
   * Get engagement-based recommendation
   */
  getEngagementRecommendation() {
    if (!this.engagement) {
      return 'Approche douce et éducative - Premier contact';
    }

    switch (this.engagement.level) {
      case 'hot':
        return '🔥 Lead très engagé - Proposition commerciale directe recommandée';
      case 'warm':
        return '🌡️ Lead intéressé - Démonstration de valeur et cas clients';
      case 'cold':
        return '❄️ Lead froid - Focus sur la découverte et l\'éducation';
      default:
        return 'Évaluer l\'intérêt pendant la réunion';
    }
  }

  /**
   * Generate meeting objectives
   */
  generateMeetingObjectives(meetingType) {
    const objectives = {
      discovery: [
        'Comprendre les défis actuels de l\'entreprise',
        'Identifier les opportunités de transformation digitale',
        'Évaluer la maturité Microsoft existante',
        'Qualifier le besoin et le budget',
        'Identifier les décideurs et le processus d\'achat'
      ],
      demo: [
        'Démontrer la valeur des solutions Microsoft',
        'Répondre aux questions techniques',
        'Montrer des cas d\'usage concrets',
        'Obtenir un engagement pour les prochaines étapes',
        'Identifier les objections et les lever'
      ],
      proposal: [
        'Présenter la proposition commerciale',
        'Justifier le ROI et le business case',
        'Négocier les termes et conditions',
        'Obtenir un accord de principe',
        'Définir le planning de mise en œuvre'
      ],
      follow_up: [
        'Faire le point sur les actions précédentes',
        'Répondre aux nouvelles questions',
        'Faire avancer le processus de décision',
        'Planifier les prochaines étapes',
        'Maintenir l\'engagement'
      ]
    };

    return {
      primary: objectives[meetingType] || objectives.discovery,
      success: this.defineSuccessCriteria(meetingType)
    };
  }

  /**
   * Define success criteria
   */
  defineSuccessCriteria(meetingType) {
    const criteria = {
      discovery: 'Obtenir un second rendez-vous (démo ou workshop)',
      demo: 'Recevoir une demande de proposition commerciale',
      proposal: 'Obtenir un engagement pour avancer (PO, contrat)',
      follow_up: 'Débloquer une situation ou clarifier un point'
    };

    return criteria[meetingType] || 'Faire avancer la relation commerciale';
  }

  /**
   * Generate talking points
   */
  generateTalkingPoints(meetingType) {
    const points = [];

    // Company-specific points
    if (this.context.capabilities.services.length > 0) {
      const mainService = this.context.capabilities.services[0];
      points.push({
        topic: `Synergie avec ${mainService.name}`,
        content: `Microsoft offre des solutions complémentaires pour optimiser ${mainService.name}`,
        priority: 'high'
      });
    }

    // Employee count specific
    if (this.context.company.employeeCount) {
      if (this.context.company.employeeCount > 250) {
        points.push({
          topic: 'Solutions Enterprise',
          content: `Avec ${this.context.company.employeeCount}+ collaborateurs, vous bénéficiez de tarifs Enterprise et d'un support premium`,
          priority: 'high'
        });
      } else {
        points.push({
          topic: 'Solutions adaptées aux PME',
          content: `Pour une équipe de ${this.context.company.employeeCount}, nous recommandons une approche progressive et scalable`,
          priority: 'medium'
        });
      }
    }

    // Recommended solutions
    if (this.context.recommendedSolutions.length > 0) {
      this.context.recommendedSolutions.slice(0, 2).forEach(solution => {
        points.push({
          topic: solution.name,
          content: `Solution prioritaire identifiée - ${solution.benefits?.[0] || 'Bénéfices à discuter'}`,
          priority: solution.priority === 'HAUTE' ? 'high' : 'medium'
        });
      });
    }

    // Engagement-based points
    if (this.engagement?.level === 'hot') {
      points.push({
        topic: 'Momentum commercial',
        content: 'Le prospect est très engagé - Proposer un closing rapide',
        priority: 'high'
      });
    }

    // Generic best practices
    points.push({
      topic: 'Références clients',
      content: 'Préparer 2-3 cas clients similaires dans le même secteur',
      priority: 'medium'
    });

    points.push({
      topic: 'Roadmap Microsoft',
      content: 'Partager la vision produit et les innovations à venir',
      priority: 'low'
    });

    return points.sort((a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });
  }

  /**
   * Generate questions to ask
   */
  generateQuestions(meetingType) {
    const questions = {
      discovery: [
        {
          category: 'Contexte',
          questions: [
            'Quels sont vos principaux défis business actuellement ?',
            'Quelles sont vos priorités pour les 6-12 prochains mois ?',
            'Quelle est votre stack technologique actuelle ?'
          ]
        },
        {
          category: 'Microsoft',
          questions: [
            'Quelles solutions Microsoft utilisez-vous déjà ?',
            'Quel est votre niveau de satisfaction actuel ?',
            'Avez-vous des projets de migration ou modernisation ?'
          ]
        },
        {
          category: 'Décision',
          questions: [
            'Qui est impliqué dans les décisions technologiques ?',
            'Quel est votre processus de décision habituel ?',
            'Avez-vous un budget alloué pour cette initiative ?'
          ]
        }
      ],
      demo: [
        {
          category: 'Besoins',
          questions: [
            'Quels sont vos cas d\'usage prioritaires ?',
            'Quelles fonctionnalités sont critiques pour vous ?',
            'Quels sont vos critères de succès ?'
          ]
        },
        {
          category: 'Technique',
          questions: [
            'Quelles sont vos contraintes techniques ?',
            'Avez-vous des exigences de sécurité spécifiques ?',
            'Quel est votre timeline de déploiement ?'
          ]
        }
      ],
      proposal: [
        {
          category: 'Commercial',
          questions: [
            'Le budget proposé correspond-il à vos attentes ?',
            'Avez-vous des questions sur la proposition ?',
            'Quels sont les freins éventuels ?'
          ]
        },
        {
          category: 'Prochaines étapes',
          questions: [
            'Quand pouvez-vous prendre une décision ?',
            'Qui doit valider la proposition ?',
            'Y a-t-il d\'autres alternatives évaluées ?'
          ]
        }
      ],
      follow_up: [
        {
          category: 'Avancement',
          questions: [
            'Où en êtes-vous dans votre réflexion ?',
            'Avez-vous pu partager en interne ?',
            'Quels retours avez-vous eus ?'
          ]
        },
        {
          category: 'Blocages',
          questions: [
            'Y a-t-il des points de blocage ?',
            'Comment puis-je vous aider à avancer ?',
            'Avez-vous besoin d\'informations complémentaires ?'
          ]
        }
      ]
    };

    return questions[meetingType] || questions.discovery;
  }

  /**
   * Generate recommended solutions
   */
  generateRecommendedSolutions() {
    const solutions = this.context.recommendedSolutions.slice(0, 3);

    if (solutions.length === 0) {
      return {
        solutions: [],
        note: 'Aucune solution pré-identifiée - À définir pendant la réunion'
      };
    }

    return {
      solutions: solutions.map(s => ({
        nom: s.name,
        priorite: s.priority,
        benefices: s.benefits || [],
        casUsage: s.useCases || [],
        prix: s.price || 'À déterminer'
      })),
      note: `${solutions.length} solution(s) identifiée(s) comme prioritaires`
    };
  }

  /**
   * Generate potential objections and responses
   */
  generateObjections() {
    const objections = [
      {
        objection: '"C\'est trop cher"',
        response: 'Focus sur le ROI et TCO - Montrer les économies à long terme',
        preparation: 'Préparer un business case avec chiffres concrets'
      },
      {
        objection: '"On est déjà équipé"',
        response: 'Comprendre la stack actuelle - Identifier les gaps et opportunités d\'amélioration',
        preparation: 'Comparer avec solutions concurrentes objectivement'
      },
      {
        objection: '"Pas le bon moment"',
        response: 'Qualifier le timing - Proposer un pilote ou POC à petite échelle',
        preparation: 'Avoir des références de déploiements rapides'
      },
      {
        objection: '"Trop complexe à déployer"',
        response: 'Rassurer sur l\'accompagnement - Montrer le support et la documentation',
        preparation: 'Préparer un plan de déploiement simplifié'
      }
    ];

    // Add company-specific objections
    if (this.context.company.employeeCount && this.context.company.employeeCount < 50) {
      objections.push({
        objection: '"Trop complexe pour une petite structure"',
        response: 'Montrer des success stories PME - Versions simplifiées disponibles',
        preparation: 'Cas clients de taille similaire'
      });
    }

    return objections;
  }

  /**
   * Generate next steps
   */
  generateNextSteps(meetingType) {
    const nextSteps = {
      discovery: [
        'Envoyer un email de remerciement sous 24h',
        'Partager des ressources pertinentes (cas clients, whitepapers)',
        'Planifier une démo ou workshop',
        'Identifier les prochains interlocuteurs à impliquer'
      ],
      demo: [
        'Envoyer un récapitulatif de la démo',
        'Partager une version d\'essai si possible',
        'Préparer une proposition commerciale',
        'Planifier une réunion de décision'
      ],
      proposal: [
        'Envoyer la proposition formelle',
        'Répondre aux questions par écrit',
        'Planifier une réunion de négociation',
        'Préparer les documents contractuels'
      ],
      follow_up: [
        'Résumer les points discutés par email',
        'Envoyer les informations demandées',
        'Planifier le prochain point',
        'Relancer si nécessaire'
      ]
    };

    return nextSteps[meetingType] || nextSteps.discovery;
  }

  /**
   * Generate notes section
   */
  generateNotes() {
    const notes = [];

    // Data quality note
    if (this.context.metadata.dataQuality < 70) {
      notes.push(`⚠️ Qualité des données: ${this.context.metadata.dataQuality}% - Compléter le profil pendant la réunion`);
    }

    // Engagement note
    if (this.engagement) {
      if (this.engagement.level === 'hot') {
        notes.push('🔥 Lead très chaud - Opportunité de closing rapide');
      } else if (this.engagement.level === 'cold' && this.engagement.details.totalInteractions > 5) {
        notes.push('❄️ Nombreuses interactions mais peu d\'engagement - Revoir l\'approche');
      }
    }

    // Pending actions
    if (this.context.pendingActions.length > 0) {
      notes.push(`📋 ${this.context.pendingActions.length} action(s) en attente - À valider en réunion`);
    }

    return notes;
  }

  /**
   * Generate ROI talking points
   */
  generateROIPoints() {
    return {
      productivityGains: [
        'Collaboration: +25% de productivité avec Microsoft 365',
        'Mobilité: Accès 24/7 depuis n\'importe quel device',
        'Automatisation: Réduction des tâches répétitives avec Power Automate'
      ],
      costSavings: [
        'Réduction coûts infrastructure avec Azure',
        'Consolidation des outils et licences',
        'Économies maintenance et support'
      ],
      timeToValue: [
        'Déploiement rapide: 30-90 jours selon solution',
        'ROI visible sous 6-12 mois',
        'Support et formation inclus'
      ]
    };
  }

  /**
   * Generate competitive intel
   */
  generateCompetitiveIntel() {
    return {
      note: 'À compléter selon les concurrents identifiés',
      commonCompetitors: [
        {
          name: 'AWS',
          strengths: 'Leader cloud infrastructure',
          weaknesses: 'Moins fort sur productivité et collaboration',
          counter: 'Solution complète Microsoft: Cloud + Productivité + IA'
        },
        {
          name: 'Google Workspace',
          strengths: 'Simple, bon marché',
          weaknesses: 'Limité enterprise, sécurité moindre',
          counter: 'Sécurité enterprise, compliance, intégration profonde'
        }
      ]
    };
  }

  /**
   * Estimate prep time saved
   */
  estimatePrepTime() {
    // Manual prep would take 30-45 min
    // Automated brief: 2-3 min
    return 'Brief généré en 2 min (vs 30-45 min manuellement)';
  }

  /**
   * Calculate confidence level
   */
  calculateConfidence() {
    const dataQuality = this.context.metadata.dataQuality;
    const hasEngagement = this.engagement && this.engagement.details.totalInteractions > 0;
    const hasRecommendations = this.context.recommendedSolutions.length > 0;

    let confidence = 50; // Base

    if (dataQuality > 80) confidence += 30;
    else if (dataQuality > 60) confidence += 20;
    else confidence += 10;

    if (hasEngagement) confidence += 10;
    if (hasRecommendations) confidence += 10;

    return `${Math.min(confidence, 100)}% de confiance dans les informations`;
  }

  /**
   * Helper: Get engagement emoji
   */
  getEngagementEmoji() {
    const emojis = {
      hot: '🔥',
      warm: '🌡️',
      cold: '❄️'
    };
    return emojis[this.engagement?.level] || '📊';
  }

  /**
   * Helper: Get trend emoji
   */
  getTrendEmoji() {
    const emojis = {
      improving: '📈',
      declining: '📉',
      stable: '➡️',
      new: '🆕'
    };
    return emojis[this.engagement?.trend] || '➡️';
  }
}

/**
 * Format brief as markdown
 */
export function formatBriefAsMarkdown(brief) {
  const md = [];

  // Header
  md.push(`# ${brief.header.title}`);
  md.push(`## ${brief.header.subtitle}`);
  md.push(`**Date**: ${brief.header.date}`);
  md.push(`**Durée**: ${brief.header.duration}`);
  md.push(`**Engagement**: ${brief.header.engagementBadge}`);
  md.push('');
  md.push('---');
  md.push('');

  // Company Overview
  md.push('## 🏢 Vue d\'ensemble de l\'entreprise');
  md.push('');
  md.push(brief.companyOverview.summary);
  md.push('');
  md.push('**Informations clés:**');
  Object.entries(brief.companyOverview.basics).forEach(([key, value]) => {
    md.push(`- **${key}**: ${value}`);
  });
  md.push(`- **Qualité données**: ${brief.companyOverview.dataQuality}`);
  md.push('');

  // Key People
  md.push('## 👥 Personnes clés');
  md.push('');
  brief.keyPeople.decisionMakers.forEach(person => {
    md.push(`### ${person.nom} - ${person.role}`);
    md.push(`- **Email**: ${person.email}`);
    md.push(`- **Téléphone**: ${person.phone}`);
    md.push(`- **Importance**: ${person.importance}`);
    md.push('');
  });

  if (brief.keyPeople.notes.length > 0) {
    md.push('**Notes:**');
    brief.keyPeople.notes.forEach(note => md.push(`- ${note}`));
    md.push('');
  }

  // Engagement
  md.push('## 📊 Engagement et historique');
  md.push('');
  md.push(`**Statut**: ${brief.engagementSummary.status}`);
  md.push(`**Score**: ${brief.engagementSummary.score}`);
  md.push(`**Dernier contact**: ${brief.engagementSummary.lastContact}`);
  md.push(`**Tendance**: ${brief.engagementSummary.trend}`);
  md.push('');
  md.push(`**Recommandation**: ${brief.engagementSummary.recommendation}`);
  md.push('');

  // Objectives
  md.push('## 🎯 Objectifs de la réunion');
  md.push('');
  brief.meetingObjectives.primary.forEach((obj, i) => {
    md.push(`${i + 1}. ${obj}`);
  });
  md.push('');
  md.push(`**Critère de succès**: ${brief.meetingObjectives.success}`);
  md.push('');

  // Talking Points
  md.push('## 💡 Points de discussion');
  md.push('');
  brief.talkingPoints.forEach(point => {
    const priority = point.priority === 'high' ? '🔴' : point.priority === 'medium' ? '🟡' : '🟢';
    md.push(`### ${priority} ${point.topic}`);
    md.push(point.content);
    md.push('');
  });

  // Questions
  md.push('## ❓ Questions à poser');
  md.push('');
  brief.questionsToAsk.forEach(category => {
    md.push(`### ${category.category}`);
    category.questions.forEach(q => md.push(`- ${q}`));
    md.push('');
  });

  // Solutions
  if (brief.recommendedSolutions.solutions.length > 0) {
    md.push('## 🚀 Solutions recommandées');
    md.push('');
    brief.recommendedSolutions.solutions.forEach(sol => {
      md.push(`### ${sol.nom} (Priorité: ${sol.priorite})`);
      if (sol.benefices.length > 0) {
        md.push('**Bénéfices:**');
        sol.benefices.forEach(b => md.push(`- ${b}`));
      }
      md.push('');
    });
  }

  // Objections
  md.push('## 🛡️ Objections potentielles');
  md.push('');
  brief.potentialObjections.forEach(obj => {
    md.push(`### ${obj.objection}`);
    md.push(`**Réponse**: ${obj.response}`);
    md.push(`**Préparation**: ${obj.preparation}`);
    md.push('');
  });

  // Next Steps
  md.push('## ➡️ Prochaines étapes');
  md.push('');
  brief.nextSteps.forEach((step, i) => {
    md.push(`${i + 1}. ${step}`);
  });
  md.push('');

  // Notes
  if (brief.notes.length > 0) {
    md.push('## 📝 Notes importantes');
    md.push('');
    brief.notes.forEach(note => md.push(`${note}`));
    md.push('');
  }

  // ROI
  if (brief.roiTalkingPoints) {
    md.push('## 💰 Points ROI');
    md.push('');
    md.push('### Gains de productivité');
    brief.roiTalkingPoints.productivityGains.forEach(g => md.push(`- ${g}`));
    md.push('');
    md.push('### Économies');
    brief.roiTalkingPoints.costSavings.forEach(c => md.push(`- ${c}`));
    md.push('');
  }

  // Footer
  md.push('---');
  md.push('');
  md.push(`*${brief.metadata.prepTime}*`);
  md.push(`*${brief.metadata.confidenceLevel}*`);

  return md.join('\n');
}
