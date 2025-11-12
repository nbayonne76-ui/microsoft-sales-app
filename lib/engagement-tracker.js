/**
 * ENGAGEMENT TRACKING UTILITY
 *
 * Quick Win #2: Real-time engagement scoring for leads
 *
 * Calculates engagement scores based on email interactions and classifies
 * leads as hot/warm/cold for prioritization.
 */

import { prisma } from './database.js';

/**
 * Calculate engagement score for a single lead
 * @param {string} leadId - Hot lead ID
 * @returns {Promise<Object>} Engagement metrics
 */
export async function calculateLeadEngagement(leadId) {
  console.log(`📊 [ENGAGEMENT] Calculating score for lead: ${leadId}`);

  try {
    // Get lead with client relation
    const lead = await prisma.hotLead.findUnique({
      where: { id: leadId },
      include: {
        client: {
          include: {
            interactions: {
              orderBy: { createdAt: 'desc' },
              take: 20 // Last 20 interactions
            }
          }
        }
      }
    });

    if (!lead) {
      console.warn(`⚠️ [ENGAGEMENT] Lead not found: ${leadId}`);
      return null;
    }

    // If no client or interactions, return cold score
    if (!lead.client || !lead.client.interactions || lead.client.interactions.length === 0) {
      return {
        leadId,
        score: 0,
        level: 'cold',
        details: {
          totalInteractions: 0,
          emailsOpened: 0,
          emailsClicked: 0,
          emailsReplied: 0,
          responseRate: 0
        },
        lastInteraction: null,
        daysSinceLastInteraction: null,
        trend: 'new'
      };
    }

    const interactions = lead.client.interactions;

    // Count interaction types
    const emailsOpened = interactions.filter(i =>
      i.status === 'opened' || i.status === 'clicked' || i.responseReceived
    ).length;

    const emailsClicked = interactions.filter(i =>
      i.status === 'clicked' || i.responseReceived
    ).length;

    const emailsReplied = interactions.filter(i =>
      i.responseReceived === true
    ).length;

    // Calculate base score (0-100)
    let score = 0;

    // Points for opens (max 30 points)
    score += Math.min(emailsOpened * 10, 30);

    // Points for clicks (max 40 points)
    score += Math.min(emailsClicked * 20, 40);

    // Points for replies (max 50 points, very valuable)
    score += Math.min(emailsReplied * 50, 50);

    // Time decay: reduce score if last interaction was long ago
    const lastInteraction = interactions[0];
    const daysSinceLastInteraction = lastInteraction
      ? Math.floor((Date.now() - new Date(lastInteraction.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    if (daysSinceLastInteraction !== null) {
      // Reduce score by 2 points per day after 7 days
      if (daysSinceLastInteraction > 7) {
        const decay = (daysSinceLastInteraction - 7) * 2;
        score = Math.max(0, score - decay);
      }
    }

    // Cap at 100
    score = Math.min(Math.round(score), 100);

    // Determine engagement level
    let level = 'cold';
    if (score >= 70) level = 'hot';
    else if (score >= 40) level = 'warm';

    // Calculate trend (improving/declining/stable)
    const trend = calculateTrend(interactions);

    // Calculate response rate
    const totalSent = interactions.filter(i => i.direction === 'outbound').length;
    const responseRate = totalSent > 0
      ? Math.round((emailsReplied / totalSent) * 100)
      : 0;

    const result = {
      leadId,
      score,
      level,
      details: {
        totalInteractions: interactions.length,
        emailsOpened,
        emailsClicked,
        emailsReplied,
        responseRate
      },
      lastInteraction: lastInteraction ? {
        date: lastInteraction.createdAt,
        type: lastInteraction.type,
        status: lastInteraction.status,
        subject: lastInteraction.subject
      } : null,
      daysSinceLastInteraction,
      trend
    };

    console.log(`✅ [ENGAGEMENT] ${lead.companyName}: ${score}/100 (${level}) - Trend: ${trend}`);

    return result;

  } catch (error) {
    console.error('❌ [ENGAGEMENT] Error calculating engagement:', error);
    throw error;
  }
}

/**
 * Calculate engagement trend
 */
function calculateTrend(interactions) {
  if (interactions.length < 3) return 'new';

  // Compare recent interactions (last 5) vs older ones (5-10)
  const recent = interactions.slice(0, 5);
  const older = interactions.slice(5, 10);

  if (older.length === 0) return 'new';

  // Calculate engagement for each period
  const recentEngagement = countEngagement(recent);
  const olderEngagement = countEngagement(older);

  if (recentEngagement > olderEngagement * 1.2) return 'improving';
  if (recentEngagement < olderEngagement * 0.8) return 'declining';
  return 'stable';
}

/**
 * Count engagement points for a set of interactions
 */
function countEngagement(interactions) {
  let points = 0;
  interactions.forEach(i => {
    if (i.status === 'opened') points += 1;
    if (i.status === 'clicked') points += 2;
    if (i.responseReceived) points += 5;
  });
  return points;
}

/**
 * Calculate engagement for all leads
 * @param {Object} options - Filter options
 * @returns {Promise<Array>} Array of engagement scores
 */
export async function calculateAllLeadsEngagement(options = {}) {
  console.log('📊 [ENGAGEMENT] Calculating scores for all leads...');

  const {
    limit = 100,
    offset = 0,
    minScore = null,
    level = null
  } = options;

  try {
    // Get all leads with client relations
    const leads = await prisma.hotLead.findMany({
      where: {
        status: 'active' // Only active leads
      },
      include: {
        client: {
          include: {
            interactions: {
              orderBy: { createdAt: 'desc' },
              take: 20
            }
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' }
    });

    console.log(`🔍 [ENGAGEMENT] Processing ${leads.length} leads...`);

    // Calculate engagement for each lead
    const engagementScores = [];

    for (const lead of leads) {
      const engagement = await calculateLeadEngagement(lead.id);

      if (engagement) {
        // Apply filters
        if (minScore !== null && engagement.score < minScore) continue;
        if (level !== null && engagement.level !== level) continue;

        engagementScores.push({
          ...engagement,
          companyName: lead.companyName,
          priority: lead.priority,
          isOpportunity: lead.isOpportunity
        });
      }
    }

    // Sort by score descending
    engagementScores.sort((a, b) => b.score - a.score);

    console.log(`✅ [ENGAGEMENT] Calculated ${engagementScores.length} engagement scores`);

    // Calculate distribution
    const distribution = {
      hot: engagementScores.filter(e => e.level === 'hot').length,
      warm: engagementScores.filter(e => e.level === 'warm').length,
      cold: engagementScores.filter(e => e.level === 'cold').length
    };

    console.log(`📊 [ENGAGEMENT] Distribution - Hot: ${distribution.hot}, Warm: ${distribution.warm}, Cold: ${distribution.cold}`);

    return {
      scores: engagementScores,
      distribution,
      total: engagementScores.length,
      averageScore: engagementScores.length > 0
        ? Math.round(engagementScores.reduce((sum, e) => sum + e.score, 0) / engagementScores.length)
        : 0
    };

  } catch (error) {
    console.error('❌ [ENGAGEMENT] Error calculating all engagements:', error);
    throw error;
  }
}

/**
 * Get engagement summary statistics
 */
export async function getEngagementSummary() {
  console.log('📊 [ENGAGEMENT] Getting engagement summary...');

  try {
    // Count total leads
    const totalLeads = await prisma.hotLead.count({
      where: { status: 'active' }
    });

    // Get all engagement scores
    const allScores = await calculateAllLeadsEngagement({ limit: 1000 });

    // Calculate additional stats
    const highPriorityHot = allScores.scores.filter(s =>
      s.priority === 'HAUTE' && s.level === 'hot'
    ).length;

    const opportunities = allScores.scores.filter(s => s.isOpportunity).length;

    const trending = {
      improving: allScores.scores.filter(s => s.trend === 'improving').length,
      declining: allScores.scores.filter(s => s.trend === 'declining').length,
      stable: allScores.scores.filter(s => s.trend === 'stable').length,
      new: allScores.scores.filter(s => s.trend === 'new').length
    };

    // Get top 10 hottest leads
    const topLeads = allScores.scores.slice(0, 10);

    // Get leads needing attention (high priority but low engagement)
    const needsAttention = allScores.scores.filter(s =>
      s.priority === 'HAUTE' && s.level === 'cold'
    ).slice(0, 10);

    const summary = {
      overview: {
        totalLeads,
        totalWithEngagement: allScores.total,
        averageScore: allScores.averageScore,
        distribution: allScores.distribution
      },
      segments: {
        highPriorityHot,
        opportunities,
        needsAttention: needsAttention.length
      },
      trending,
      topLeads,
      needsAttention
    };

    console.log(`✅ [ENGAGEMENT] Summary generated`);

    return summary;

  } catch (error) {
    console.error('❌ [ENGAGEMENT] Error getting summary:', error);
    throw error;
  }
}

/**
 * Update engagement score in email webhook handler
 * Call this when email events are received (opens, clicks, replies)
 */
export async function updateEngagementOnEmailEvent(messageId, eventType) {
  console.log(`🔔 [ENGAGEMENT] Email event: ${eventType} for ${messageId}`);

  try {
    // Find interaction by messageId
    const interaction = await prisma.clientInteraction.findFirst({
      where: { messageId },
      include: {
        client: {
          include: {
            hotLead: true
          }
        }
      }
    });

    if (!interaction || !interaction.client || !interaction.client.hotLead) {
      console.warn(`⚠️ [ENGAGEMENT] No lead found for message: ${messageId}`);
      return null;
    }

    const leadId = interaction.client.hotLead.id;

    // Recalculate engagement
    const engagement = await calculateLeadEngagement(leadId);

    console.log(`✅ [ENGAGEMENT] Updated engagement for ${interaction.client.hotLead.companyName}: ${engagement.score}/100`);

    return engagement;

  } catch (error) {
    console.error('❌ [ENGAGEMENT] Error updating engagement on event:', error);
    throw error;
  }
}

/**
 * Get badge emoji for engagement level
 */
export function getEngagementBadge(level) {
  const badges = {
    hot: '🔥',
    warm: '🌡️',
    cold: '❄️'
  };
  return badges[level] || '❓';
}

/**
 * Get color for engagement level
 */
export function getEngagementColor(level) {
  const colors = {
    hot: '#ef4444', // red-500
    warm: '#f59e0b', // amber-500
    cold: '#3b82f6'  // blue-500
  };
  return colors[level] || '#6b7280'; // gray-500
}

/**
 * Get trend emoji
 */
export function getTrendEmoji(trend) {
  const emojis = {
    improving: '📈',
    declining: '📉',
    stable: '➡️',
    new: '🆕'
  };
  return emojis[trend] || '➡️';
}
