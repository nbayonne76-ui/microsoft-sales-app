/**
 * OPTIMIZED LEAD CONTEXT AGGREGATOR
 *
 * Enhanced version with:
 * - Knowledge base caching
 * - Rich knowledge base integration
 * - Intelligent context enhancement
 * - Performance optimizations
 */

import { prisma } from './database.js';
import { microsoftKnowledgeBase } from './microsoft-knowledge-base.js';

// ✅ IN-MEMORY CACHE for knowledge base lookups
const KB_CACHE = {
  solutions: null,
  categories: null,
  industryProfiles: null,
  roleProfiles: null,
  lastUpdate: null,
  TTL: 60 * 60 * 1000 // 1 hour
};

/**
 * Initialize and cache knowledge base data
 */
function initializeKnowledgeBaseCache() {
  const now = Date.now();

  // Check if cache is still valid
  if (KB_CACHE.lastUpdate && (now - KB_CACHE.lastUpdate) < KB_CACHE.TTL) {
    return; // Cache is fresh
  }

  console.log('🔄 Initializing knowledge base cache...');

  // Cache all solutions
  KB_CACHE.solutions = microsoftKnowledgeBase.solutions;
  KB_CACHE.categories = microsoftKnowledgeBase.categories;

  // Pre-compute industry profiles for fast lookup
  KB_CACHE.industryProfiles = {};
  Object.entries(microsoftKnowledgeBase.industryProfiles).forEach(([industry, profile]) => {
    KB_CACHE.industryProfiles[industry.toLowerCase()] = profile;
  });

  // Pre-compute role-based value propositions
  KB_CACHE.roleProfiles = {};
  const roles = ['DSI', 'Directeur Général', 'DAF', 'DRH', 'Directeur Commercial', 'RSSI'];
  roles.forEach(role => {
    KB_CACHE.roleProfiles[role] = {
      priorities: getRole Priorities(role),
      valueProps: getRoleValuePropositions(role)
    };
  });

  KB_CACHE.lastUpdate = now;
  console.log(`✅ Knowledge base cached: ${Object.keys(KB_CACHE.solutions).length} solutions, ${Object.keys(KB_CACHE.industryProfiles).length} industries`);
}

/**
 * Get role priorities from knowledge base
 */
function getRolePriorities(role) {
  const priorityMap = {
    'DSI': ['Azure Migration', 'Security', 'Cloud Infrastructure', 'DevOps'],
    'Directeur Général': ['Business Growth', 'Digital Transformation', 'Cost Optimization', 'Innovation'],
    'DAF': ['Cost Control', 'Financial Reporting', 'Compliance', 'Budget Optimization'],
    'DRH': ['Talent Management', 'Employee Experience', 'Collaboration', 'Learning'],
    'Directeur Commercial': ['Sales Productivity', 'CRM', 'Analytics', 'Customer Engagement'],
    'RSSI': ['Security', 'Compliance', 'Risk Management', 'Identity Protection']
  };
  return priorityMap[role] || [];
}

/**
 * Get role-specific value propositions
 */
function getRoleValuePropositions(role) {
  const valueProps = {
    'DSI': [
      'Modernisez votre infrastructure IT avec Azure',
      'Réduisez les coûts d\'exploitation jusqu\'à 40%',
      'Accélérez la transformation digitale',
      'Sécurisez vos données avec Microsoft Security'
    ],
    'Directeur Général': [
      'Boostez la productivité de 30% avec Microsoft 365',
      'Innovation rapide avec low-code Power Platform',
      'Croissance avec Dynamics 365 CRM/ERP',
      'Avantage concurrentiel par l\'IA'
    ],
    'DAF': [
      'Visibilité financière en temps réel',
      'Automatisation des processus comptables',
      'Conformité et reporting simplifiés',
      'ROI mesurable sur investissements IT'
    ],
    'DRH': [
      'Amélioration de l\'expérience collaborateur',
      'Communication unifiée avec Teams',
      'Formation et développement des talents',
      'Culture d\'innovation et télétravail'
    ],
    'Directeur Commercial': [
      'Augmentation des ventes de 25% avec Dynamics 365',
      'Intelligence commerciale en temps réel',
      'Automatisation du cycle de vente',
      'Customer 360° avec CRM unifié'
    ],
    'RSSI': [
      'Protection contre les menaces avancées',
      'Conformité RGPD et ISO 27001',
      'Zero Trust Security Architecture',
      'Détection et réponse aux incidents'
    ]
  };
  return valueProps[role] || [];
}

/**
 * Enhanced context aggregation with knowledge base integration
 * @param {string} leadId - Hot lead ID
 * @returns {Promise<Object>} Enriched context with knowledge base insights
 */
export async function getLeadContext(leadId) {
  console.log(`📊 Aggregating enhanced context for lead: ${leadId}`);

  // Initialize KB cache if needed
  initializeKnowledgeBaseCache();

  try {
    // ✅ OPTIMIZED: Single query with all includes (no N+1)
    const lead = await prisma.hotLead.findUnique({
      where: { id: leadId },
      include: {
        managers: {
          select: {
            id: true,
            name: true,
            role: true,
            email: true,
            phone: true
          }
        },
        teamMembers: {
          select: {
            id: true,
            name: true,
            role: true,
            expertise: true
          }
        },
        services: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        specialties: {
          select: {
            id: true,
            name: true,
            domain: true
          }
        },
        solutions: {
          select: {
            id: true,
            name: true,
            priority: true,
            price: true,
            benefits: true,
            useCases: true
          },
          orderBy: { priority: 'desc' },
          take: 5
        },
        interactions: {
          select: {
            id: true,
            date: true,
            type: true,
            title: true,
            notes: true,
            participants: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        actions: {
          where: { status: 'pending' },
          select: {
            id: true,
            action: true,
            priority: true,
            deadline: true,
            assignedTo: true
          },
          orderBy: { createdAt: 'desc' }
        },
        client: {
          include: {
            interactions: {
              select: {
                id: true,
                createdAt: true,
                type: true,
                direction: true,
                status: true,
                subject: true,
                sentiment: true,
                responseReceived: true,
                outcome: true
              },
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

    // ✅ KNOWLEDGE BASE ENRICHMENT
    const kbEnrichment = enrichWithKnowledgeBase(lead);

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
        managers: lead.managers,
        teamMembers: lead.teamMembers
      },

      // Company capabilities
      capabilities: {
        services: lead.services,
        specialties: lead.specialties
      },

      // ✅ ENHANCED: Knowledge base recommendations
      recommendedSolutions: lead.solutions,

      // ✅ NEW: Knowledge base insights
      knowledgeBase: kbEnrichment,

      // Recent interactions history
      interactionHistory: {
        lead: lead.interactions,
        email: lead.client?.interactions || []
      },

      // Pending actions
      pendingActions: lead.actions,

      // Engagement metrics (calculated)
      engagement: calculateEngagementMetrics(lead),

      // Best contact approach
      contactStrategy: determineContactStrategy(lead, kbEnrichment),

      // Metadata
      metadata: {
        dataQuality: calculateDataQuality(lead),
        lastUpdated: lead.updatedAt,
        source: lead.source,
        campaignName: lead.campaignName,
        kbEnrichmentQuality: kbEnrichment.quality
      }
    };

    console.log(`✅ Enhanced context aggregated - Data: ${context.metadata.dataQuality}%, KB: ${kbEnrichment.quality}%`);

    return context;

  } catch (error) {
    console.error('❌ Error aggregating lead context:', error);
    throw error;
  }
}

/**
 * ✅ NEW: Enrich lead with knowledge base insights
 */
function enrichWithKnowledgeBase(lead) {
  const enrichment = {
    quality: 0,
    industryInsights: null,
    recommendedSolutions: [],
    roleMappings: {},
    businessChallenges: [],
    relevantUseCases: [],
    competitorComparisons: [],
    estimatedBudget: null,
    implementationTimeline: null
  };

  let qualityScore = 0;

  // 1. Industry-specific insights
  if (lead.nafCode || lead.description) {
    const industry = detectIndustry(lead);
    if (industry && KB_CACHE.industryProfiles[industry]) {
      enrichment.industryInsights = KB_CACHE.industryProfiles[industry];
      qualityScore += 20;
    }
  }

  // 2. Role-based recommendations for each manager
  if (lead.managers && lead.managers.length > 0) {
    lead.managers.forEach(manager => {
      const roleProfile = KB_CACHE.roleProfiles[manager.role];
      if (roleProfile) {
        enrichment.roleMappings[manager.role] = roleProfile;
        qualityScore += 15;
      }
    });
  }

  // 3. Solution recommendations based on company size
  const companySize = categorizeCompanySize(lead.employeeCount);
  if (companySize && KB_CACHE.solutions) {
    const relevantSolutions = Object.values(KB_CACHE.solutions)
      .filter(sol => sol.targetAudience?.includes(companySize))
      .slice(0, 5);

    enrichment.recommendedSolutions = relevantSolutions.map(sol => ({
      name: sol.name,
      category: sol.category,
      priority: sol.salesPriority || 'medium',
      businessValue: sol.businessValue,
      useCases: sol.useCases?.slice(0, 3) || [],
      estimatedPrice: sol.pricing,
      implementationTime: sol.implementation?.timeline
    }));

    if (relevantSolutions.length > 0) qualityScore += 25;
  }

  // 4. Business challenges from knowledge base
  if (enrichment.industryInsights) {
    enrichment.businessChallenges = enrichment.industryInsights.commonChallenges || [];
    qualityScore += 10;
  }

  // 5. Relevant use cases
  if (enrichment.recommendedSolutions.length > 0) {
    enrichment.relevantUseCases = enrichment.recommendedSolutions
      .flatMap(sol => sol.useCases)
      .slice(0, 5);
    qualityScore += 10;
  }

  // 6. Budget estimation
  if (lead.turnover && enrichment.recommendedSolutions.length > 0) {
    enrichment.estimatedBudget = estimateITBudget(lead.turnover, companySize);
    qualityScore += 10;
  }

  // 7. Implementation timeline
  if (enrichment.recommendedSolutions.length > 0) {
    const avgTimeline = enrichment.recommendedSolutions
      .map(sol => parseImplementationTime(sol.implementationTime))
      .filter(t => t > 0)
      .reduce((sum, t, _, arr) => sum + t / arr.length, 0);

    enrichment.implementationTimeline = {
      estimatedWeeks: Math.round(avgTimeline),
      phases: ['Discovery', 'Pilot', 'Deployment', 'Training', 'Optimization']
    };
    qualityScore += 10;
  }

  enrichment.quality = Math.min(qualityScore, 100);

  return enrichment;
}

/**
 * Detect industry from NAF code or description
 */
function detectIndustry(lead) {
  // NAF code mapping (simplified)
  const nafMapping = {
    '62': 'technology',
    '63': 'technology',
    '64': 'finance',
    '65': 'finance',
    '66': 'finance',
    '47': 'retail',
    '45': 'retail',
    '46': 'retail',
    '86': 'healthcare',
    '87': 'healthcare',
    '88': 'healthcare',
    '29': 'manufacturing',
    '28': 'manufacturing',
    '27': 'manufacturing'
  };

  if (lead.nafCode) {
    const nafPrefix = lead.nafCode.substring(0, 2);
    const industry = nafMapping[nafPrefix];
    if (industry) return industry;
  }

  // Fallback: keyword detection in description
  if (lead.description) {
    const desc = lead.description.toLowerCase();
    if (desc.includes('tech') || desc.includes('software') || desc.includes('digital')) return 'technology';
    if (desc.includes('banque') || desc.includes('finance') || desc.includes('assurance')) return 'finance';
    if (desc.includes('santé') || desc.includes('médical') || desc.includes('hôpital')) return 'healthcare';
    if (desc.includes('retail') || desc.includes('commerce') || desc.includes('vente')) return 'retail';
    if (desc.includes('industrie') || desc.includes('manufacture') || desc.includes('production')) return 'manufacturing';
  }

  return null;
}

/**
 * Categorize company by employee count
 */
function categorizeCompanySize(employeeCount) {
  if (!employeeCount) return 'sme';
  if (employeeCount < 50) return 'startup';
  if (employeeCount < 500) return 'sme';
  return 'enterprise';
}

/**
 * Estimate IT budget based on turnover
 */
function estimateITBudget(turnover, companySize) {
  if (!turnover) return null;

  // IT budget typically 3-7% of turnover
  const percentageMap = {
    'startup': 0.07, // 7% - higher for digital-first
    'sme': 0.05,     // 5%
    'enterprise': 0.03 // 3% - economies of scale
  };

  const percentage = percentageMap[companySize] || 0.05;
  const budget = parseInt(turnover.replace(/[^0-9]/g, '')) * percentage;

  return {
    estimated: `${Math.round(budget).toLocaleString('fr-FR')} €`,
    percentage: `${percentage * 100}%`,
    breakdown: {
      infrastructure: Math.round(budget * 0.4),
      software: Math.round(budget * 0.3),
      services: Math.round(budget * 0.2),
      training: Math.round(budget * 0.1)
    }
  };
}

/**
 * Parse implementation time string to weeks
 */
function parseImplementationTime(timeStr) {
  if (!timeStr) return 0;

  const str = timeStr.toLowerCase();
  if (str.includes('semaine')) {
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }
  if (str.includes('mois')) {
    const match = str.match(/(\d+)/);
    return match ? parseInt(match[1]) * 4 : 0;
  }
  return 0;
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
 * Enhanced contact strategy with knowledge base insights
 */
function determineContactStrategy(lead, kbEnrichment) {
  const engagement = calculateEngagementMetrics(lead);
  const hasPrimaryContact = lead.managers.length > 0;
  const hasRecentInteraction = engagement.lastInteraction &&
    (Date.now() - new Date(engagement.lastInteraction).getTime()) < 7 * 24 * 60 * 60 * 1000; // 7 days

  let strategy = {
    approach: 'cold_outreach',
    tone: 'professional_formal',
    urgency: 'low',
    recommendedChannel: 'email',
    reasoning: '',
    // ✅ NEW: KB-powered suggestions
    suggestedTopics: [],
    valuePropositions: []
  };

  // Hot lead - responded recently
  if (engagement.level === 'hot' && hasRecentInteraction) {
    strategy = {
      approach: 'follow_up',
      tone: 'professional_friendly',
      urgency: 'high',
      recommendedChannel: 'email_then_call',
      reasoning: 'Lead is actively engaged, follow up quickly',
      suggestedTopics: kbEnrichment.relevantUseCases.slice(0, 2),
      valuePropositions: []
    };
  }
  // Warm lead - opened emails but no response
  else if (engagement.level === 'warm') {
    strategy = {
      approach: 'value_nurture',
      tone: 'professional_friendly',
      urgency: 'medium',
      recommendedChannel: 'email',
      reasoning: 'Lead is interested but needs more value demonstration',
      suggestedTopics: kbEnrichment.businessChallenges.slice(0, 3),
      valuePropositions: []
    };
  }
  // Cold lead - no engagement
  else if (engagement.level === 'cold') {
    strategy = {
      approach: 'cold_outreach',
      tone: 'professional_formal',
      urgency: 'low',
      recommendedChannel: 'email',
      reasoning: 'First contact or no recent engagement',
      suggestedTopics: kbEnrichment.relevantUseCases.slice(0, 2),
      valuePropositions: []
    };
  }

  // Add role-specific value propositions
  if (hasPrimaryContact && lead.managers[0]) {
    const primaryRole = lead.managers[0].role;
    const roleProfile = kbEnrichment.roleMappings[primaryRole];
    if (roleProfile) {
      strategy.valuePropositions = roleProfile.valueProps.slice(0, 3);
    }
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
 * ✅ ENHANCED: Format context for AI with knowledge base insights
 */
export function formatContextForAI(context) {
  if (!context) return '';

  let formatted = `## CONTEXTE ENTREPRISE ENRICHI\n\n`;

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

  // ✅ NEW: Industry insights from knowledge base
  if (context.knowledgeBase.industryInsights) {
    formatted += `\n### INSIGHTS SECTEUR (BASE DE CONNAISSANCES)\n`;
    formatted += `**Secteur**: ${context.knowledgeBase.industryInsights.name || 'Détecté'}\n`;
    if (context.knowledgeBase.businessChallenges.length > 0) {
      formatted += `**Défis communs**:\n`;
      context.knowledgeBase.businessChallenges.slice(0, 3).forEach(challenge => {
        formatted += `- ${challenge}\n`;
      });
    }
  }

  // ✅ NEW: Budget estimation
  if (context.knowledgeBase.estimatedBudget) {
    formatted += `\n### BUDGET IT ESTIMÉ\n`;
    formatted += `**Budget**: ${context.knowledgeBase.estimatedBudget.estimated}\n`;
    formatted += `**% CA**: ${context.knowledgeBase.estimatedBudget.percentage}\n`;
  }

  // Key people with role-specific value props
  if (context.people.managers.length > 0) {
    formatted += `\n### DIRIGEANTS & PROPOSITIONS DE VALEUR\n`;
    context.people.managers.forEach(m => {
      formatted += `- **${m.name}** (${m.role})`;
      if (m.email) formatted += ` - ${m.email}`;
      formatted += `\n`;

      // ✅ NEW: Role-specific value propositions
      const roleProfile = context.knowledgeBase.roleMappings[m.role];
      if (roleProfile && roleProfile.valueProps) {
        formatted += `  💡 Propositions pour ${m.role}:\n`;
        roleProfile.valueProps.slice(0, 2).forEach(vp => {
          formatted += `     - ${vp}\n`;
        });
      }
    });
  }

  // ✅ NEW: Knowledge base recommended solutions
  if (context.knowledgeBase.recommendedSolutions.length > 0) {
    formatted += `\n### SOLUTIONS MICROSOFT RECOMMANDÉES (BASE DE CONNAISSANCES)\n`;
    context.knowledgeBase.recommendedSolutions.slice(0, 3).forEach(sol => {
      formatted += `- **${sol.name}** (${sol.category}) - Priorité: ${sol.priority}\n`;
      if (sol.businessValue) {
        formatted += `  💰 Valeur: ${sol.businessValue.join(', ')}\n`;
      }
      if (sol.useCases.length > 0) {
        formatted += `  📋 Use case: ${sol.useCases[0]}\n`;
      }
    });
  }

  // ✅ NEW: Relevant use cases
  if (context.knowledgeBase.relevantUseCases.length > 0) {
    formatted += `\n### CAS D'USAGE PERTINENTS\n`;
    context.knowledgeBase.relevantUseCases.slice(0, 3).forEach(useCase => {
      formatted += `- ${useCase}\n`;
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

  // ✅ ENHANCED: Contact strategy with KB suggestions
  formatted += `\n### STRATÉGIE DE CONTACT RECOMMANDÉE\n`;
  formatted += `**Approche**: ${context.contactStrategy.approach}\n`;
  formatted += `**Ton**: ${context.contactStrategy.tone}\n`;
  formatted += `**Urgence**: ${context.contactStrategy.urgency}\n`;
  formatted += `**Raison**: ${context.contactStrategy.reasoning}\n`;

  if (context.contactStrategy.suggestedTopics.length > 0) {
    formatted += `**Sujets suggérés**: ${context.contactStrategy.suggestedTopics.join(', ')}\n`;
  }

  // ✅ NEW: Implementation timeline
  if (context.knowledgeBase.implementationTimeline) {
    formatted += `\n### TIMELINE IMPLÉMENTATION ESTIMÉE\n`;
    formatted += `**Durée**: ${context.knowledgeBase.implementationTimeline.estimatedWeeks} semaines\n`;
    formatted += `**Phases**: ${context.knowledgeBase.implementationTimeline.phases.join(' → ')}\n`;
  }

  formatted += `\n---\n`;
  formatted += `**Qualité des données**: ${context.metadata.dataQuality}%\n`;
  formatted += `**Enrichissement KB**: ${context.metadata.kbEnrichmentQuality}%\n`;

  return formatted;
}

/**
 * Get lightweight context (for quick operations)
 */
export async function getLeadContextLight(leadId) {
  const lead = await prisma.hotLead.findUnique({
    where: { id: leadId },
    select: {
      companyName: true,
      website: true,
      employeeCount: true,
      priority: true,
      enrichmentStatus: true,
      managers: {
        select: {
          id: true,
          name: true,
          role: true,
          email: true
        },
        take: 1
      },
      client: {
        select: {
          interactions: {
            select: {
              id: true,
              createdAt: true,
              subject: true,
              status: true,
              responseReceived: true
            },
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

/**
 * ✅ NEW: Clear knowledge base cache (for updates)
 */
export function clearKnowledgeBaseCache() {
  KB_CACHE.solutions = null;
  KB_CACHE.categories = null;
  KB_CACHE.industryProfiles = null;
  KB_CACHE.roleProfiles = null;
  KB_CACHE.lastUpdate = null;
  console.log('🗑️ Knowledge base cache cleared');
}
