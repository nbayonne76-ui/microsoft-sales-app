/**
 * LEAD CONTEXT AGGREGATOR
 *
 * Quick Win #1: Context-Aware Email Generation
 *
 * Aggregates all available information about a lead from the database
 * to provide rich context for AI email generation.
 */

import { prisma } from './database.js';

/**
 * Get comprehensive context for a lead
 * @param {string} leadId - Hot lead ID
 * @returns {Promise<Object>} Aggregated context
 */
export async function getLeadContext(leadId) {
  console.log(`📊 Aggregating context for lead: ${leadId}`);

  try {
    // Get full lead profile with all relations
    const lead = await prisma.hotLead.findUnique({
      where: { id: leadId },
      include: {
        managers: true,
        teamMembers: true,
        services: true,
        specialties: true,
        solutions: true,
        interactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        actions: {
          where: { status: 'pending' },
          orderBy: { createdAt: 'desc' }
        },
        client: {
          include: {
            interactions: {
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        }
      }
    });

    if (!lead) {
      console.warn(`⚠️ Lead not found: ${leadId}`);
      return null;
    }

    // Build enriched context object
    const context = {
      // Basic company info
      company: {
        name: lead.companyName,
        description: lead.description,
        website: lead.website,
        phone: lead.phone,
        email: lead.email,
        address: lead.address,
        employeeCount: lead.employeeCount
      },

      // Legal and financial info
      legal: {
        legalForm: lead.legalForm,
        capitalSocial: lead.capitalSocial,
        siret: lead.siret,
        tvaNumber: lead.tvaNumber,
        nafCode: lead.nafCode,
        creationDate: lead.creationDate,
        turnover: lead.turnover
      },

      // Lead status and priority
      status: {
        isOpportunity: lead.isOpportunity,
        priority: lead.priority,
        status: lead.status,
        enrichmentStatus: lead.enrichmentStatus,
        enrichedAt: lead.enrichedAt
      },

      // Key people
      people: {
        managers: lead.managers.map(m => ({
          name: m.name,
          role: m.role,
          email: m.email,
          phone: m.phone
        })),
        teamMembers: lead.teamMembers.map(t => ({
          name: t.name,
          role: t.role,
          expertise: t.expertise
        }))
      },

      // Company capabilities
      capabilities: {
        services: lead.services.map(s => ({
          name: s.name,
          description: s.description
        })),
        specialties: lead.specialties.map(s => ({
          name: s.name,
          domain: s.domain
        }))
      },

      // Recommended Microsoft solutions
      recommendedSolutions: lead.solutions.map(s => ({
        name: s.name,
        priority: s.priority,
        price: s.price,
        benefits: s.benefits,
        useCases: s.useCases
      })),

      // Recent interactions history
      interactionHistory: {
        lead: lead.interactions.map(i => ({
          date: i.date,
          type: i.type,
          title: i.title,
          notes: i.notes,
          participants: i.participants
        })),
        email: lead.client?.interactions.map(i => ({
          createdAt: i.createdAt,
          type: i.type,
          direction: i.direction,
          status: i.status,
          subject: i.subject,
          sentiment: i.sentiment,
          responseReceived: i.responseReceived,
          outcome: i.outcome
        })) || []
      },

      // Pending actions
      pendingActions: lead.actions.map(a => ({
        action: a.action,
        priority: a.priority,
        deadline: a.deadline,
        assignedTo: a.assignedTo
      })),

      // Engagement metrics (calculated)
      engagement: calculateEngagementMetrics(lead),

      // Best contact approach
      contactStrategy: determineContactStrategy(lead),

      // Metadata
      metadata: {
        dataQuality: calculateDataQuality(lead),
        lastUpdated: lead.updatedAt,
        source: lead.source,
        campaignName: lead.campaignName
      }
    };

    console.log(`✅ Context aggregated - Quality: ${context.metadata.dataQuality}%`);

    return context;

  } catch (error) {
    console.error('❌ Error aggregating lead context:', error);
    throw error;
  }
}

/**
 * Calculate engagement metrics based on interaction history
 */
function calculateEngagementMetrics(lead) {
  if (!lead.client?.interactions || lead.client.interactions.length === 0) {
    return {
      level: 'cold',
      score: 0,
      lastInteraction: null,
      totalInteractions: 0,
      emailsOpened: 0,
      emailsClicked: 0,
      emailsReplied: 0
    };
  }

  const interactions = lead.client.interactions;
  const emailsOpened = interactions.filter(i => i.status === 'opened').length;
  const emailsClicked = interactions.filter(i => i.status === 'clicked').length;
  const emailsReplied = interactions.filter(i => i.responseReceived).length;

  // Calculate engagement score (0-100)
  let score = 0;
  score += emailsOpened * 10;
  score += emailsClicked * 25;
  score += emailsReplied * 50;

  // Cap at 100
  score = Math.min(score, 100);

  // Determine engagement level
  let level = 'cold';
  if (score >= 70) level = 'hot';
  else if (score >= 40) level = 'warm';

  return {
    level,
    score,
    lastInteraction: interactions[0]?.createdAt,
    totalInteractions: interactions.length,
    emailsOpened,
    emailsClicked,
    emailsReplied,
    responseRate: interactions.length > 0
      ? Math.round((emailsReplied / interactions.length) * 100)
      : 0
  };
}

/**
 * Determine best contact strategy based on lead data
 */
function determineContactStrategy(lead) {
  const engagement = calculateEngagementMetrics(lead);
  const hasPrimaryContact = lead.managers.length > 0;
  const hasRecentInteraction = engagement.lastInteraction &&
    (Date.now() - new Date(engagement.lastInteraction).getTime()) < 7 * 24 * 60 * 60 * 1000; // 7 days

  let strategy = {
    approach: 'cold_outreach',
    tone: 'professional_formal',
    urgency: 'low',
    recommendedChannel: 'email',
    reasoning: ''
  };

  // Hot lead - responded recently
  if (engagement.level === 'hot' && hasRecentInteraction) {
    strategy = {
      approach: 'follow_up',
      tone: 'professional_friendly',
      urgency: 'high',
      recommendedChannel: 'email_then_call',
      reasoning: 'Lead is actively engaged, follow up quickly'
    };
  }
  // Warm lead - opened emails but no response
  else if (engagement.level === 'warm') {
    strategy = {
      approach: 'value_nurture',
      tone: 'professional_friendly',
      urgency: 'medium',
      recommendedChannel: 'email',
      reasoning: 'Lead is interested but needs more value demonstration'
    };
  }
  // Cold lead - no engagement
  else if (engagement.level === 'cold') {
    strategy = {
      approach: 'cold_outreach',
      tone: 'professional_formal',
      urgency: 'low',
      recommendedChannel: 'email',
      reasoning: 'First contact or no recent engagement'
    };
  }

  // High priority leads get upgraded urgency
  if (lead.priority === 'HAUTE') {
    strategy.urgency = 'high';
    strategy.reasoning += ' - High priority account';
  }

  return strategy;
}

/**
 * Calculate data quality score (0-100)
 */
function calculateDataQuality(lead) {
  let score = 0;
  const weights = {
    companyName: 10,
    siret: 15,
    website: 10,
    email: 10,
    phone: 5,
    address: 5,
    employeeCount: 5,
    turnover: 5,
    managers: 15,
    services: 10,
    enrichedAt: 10
  };

  // Check each field
  if (lead.companyName) score += weights.companyName;
  if (lead.siret) score += weights.siret;
  if (lead.website) score += weights.website;
  if (lead.email) score += weights.email;
  if (lead.phone) score += weights.phone;
  if (lead.address) score += weights.address;
  if (lead.employeeCount) score += weights.employeeCount;
  if (lead.turnover) score += weights.turnover;
  if (lead.managers && lead.managers.length > 0) score += weights.managers;
  if (lead.services && lead.services.length > 0) score += weights.services;
  if (lead.enrichedAt) score += weights.enrichedAt;

  return Math.round(score);
}

/**
 * Format context for AI prompt
 * @param {Object} context - Lead context object
 * @returns {string} Formatted context string for AI
 */
export function formatContextForAI(context) {
  if (!context) return '';

  let formatted = `## CONTEXTE ENTREPRISE\n\n`;

  // Company basics
  formatted += `**Entreprise**: ${context.company.name}\n`;
  if (context.company.description) {
    formatted += `**Description**: ${context.company.description}\n`;
  }
  if (context.company.website) {
    formatted += `**Site web**: ${context.company.website}\n`;
  }
  if (context.company.employeeCount) {
    formatted += `**Effectif**: ${context.company.employeeCount} employés\n`;
  }

  // Legal info
  if (context.legal.nafCode) {
    formatted += `**Code NAF**: ${context.legal.nafCode}\n`;
  }
  if (context.legal.turnover) {
    formatted += `**Chiffre d'affaires**: ${context.legal.turnover}\n`;
  }
  if (context.legal.legalForm) {
    formatted += `**Forme juridique**: ${context.legal.legalForm}\n`;
  }

  // Key people
  if (context.people.managers.length > 0) {
    formatted += `\n### DIRIGEANTS\n`;
    context.people.managers.forEach(m => {
      formatted += `- ${m.name} (${m.role})`;
      if (m.email) formatted += ` - ${m.email}`;
      formatted += `\n`;
    });
  }

  // Services and specialties
  if (context.capabilities.services.length > 0) {
    formatted += `\n### SERVICES\n`;
    context.capabilities.services.forEach(s => {
      formatted += `- ${s.name}`;
      if (s.description) formatted += `: ${s.description}`;
      formatted += `\n`;
    });
  }

  if (context.capabilities.specialties.length > 0) {
    formatted += `\n### SPÉCIALITÉS\n`;
    context.capabilities.specialties.forEach(s => {
      formatted += `- ${s.name}`;
      if (s.domain) formatted += ` (${s.domain})`;
      formatted += `\n`;
    });
  }

  // Interaction history
  if (context.interactionHistory.email.length > 0) {
    formatted += `\n### HISTORIQUE DES INTERACTIONS\n`;
    const recentInteractions = context.interactionHistory.email.slice(0, 3);
    recentInteractions.forEach(i => {
      const daysAgo = Math.floor((Date.now() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      formatted += `- Il y a ${daysAgo} jours: ${i.subject} (${i.status})`;
      if (i.responseReceived) formatted += ` ✅ Réponse reçue`;
      formatted += `\n`;
    });
  }

  // Engagement level
  formatted += `\n### NIVEAU D'ENGAGEMENT\n`;
  formatted += `**Score**: ${context.engagement.score}/100 (${context.engagement.level})\n`;
  formatted += `**Emails ouverts**: ${context.engagement.emailsOpened}\n`;
  formatted += `**Emails cliqués**: ${context.engagement.emailsClicked}\n`;
  formatted += `**Réponses**: ${context.engagement.emailsReplied}\n`;

  // Contact strategy
  formatted += `\n### STRATÉGIE DE CONTACT RECOMMANDÉE\n`;
  formatted += `**Approche**: ${context.contactStrategy.approach}\n`;
  formatted += `**Ton**: ${context.contactStrategy.tone}\n`;
  formatted += `**Urgence**: ${context.contactStrategy.urgency}\n`;
  formatted += `**Raison**: ${context.contactStrategy.reasoning}\n`;

  // Recommended solutions
  if (context.recommendedSolutions.length > 0) {
    formatted += `\n### SOLUTIONS MICROSOFT RECOMMANDÉES\n`;
    context.recommendedSolutions.forEach(s => {
      formatted += `- **${s.name}** (Priorité: ${s.priority})\n`;
      if (s.benefits && Array.isArray(s.benefits)) {
        s.benefits.slice(0, 2).forEach(b => {
          formatted += `  - ${b}\n`;
        });
      }
    });
  }

  // Pending actions
  if (context.pendingActions.length > 0) {
    formatted += `\n### ACTIONS EN ATTENTE\n`;
    context.pendingActions.slice(0, 3).forEach(a => {
      formatted += `- ${a.action} (${a.priority})`;
      if (a.deadline) formatted += ` - Deadline: ${a.deadline}`;
      formatted += `\n`;
    });
  }

  formatted += `\n---\n**Qualité des données**: ${context.metadata.dataQuality}%\n`;

  return formatted;
}

/**
 * Get lightweight context (for quick operations)
 */
export async function getLeadContextLight(leadId) {
  const lead = await prisma.hotLead.findUnique({
    where: { id: leadId },
    include: {
      managers: true,
      client: {
        include: {
          interactions: {
            orderBy: { createdAt: 'desc' },
            take: 3
          }
        }
      }
    }
  });

  if (!lead) return null;

  return {
    company: {
      name: lead.companyName,
      website: lead.website,
      employeeCount: lead.employeeCount
    },
    primaryContact: lead.managers[0] || null,
    recentInteractions: lead.client?.interactions || [],
    priority: lead.priority,
    enrichmentStatus: lead.enrichmentStatus
  };
}
