/**
 * Intelligent Auto-Trigger System
 *
 * Automatically triggers workflows based on lead behavior and engagement patterns.
 * This system monitors lead activities and intelligently starts workflows at optimal times.
 */

import { prisma } from './database.js';
import { startWorkflowExecution } from './workflow-engine.js';
import { getLeadEngagementLevel } from './engagement-tracker.js';

/**
 * Trigger types and their conditions
 */
export const TRIGGER_TYPES = {
  // Existing triggers (from original system)
  LEAD_CREATED: 'lead_created',
  LEAD_ENRICHED: 'lead_enriched',
  EMAIL_OPENED: 'email_opened',
  EMAIL_CLICKED: 'email_clicked',
  NO_RESPONSE: 'no_response',

  // NEW: Intelligent behavioral triggers
  ENGAGEMENT_SPIKE: 'engagement_spike', // Lead suddenly becomes more active
  ENGAGEMENT_DROP: 'engagement_drop', // Lead engagement is declining
  MULTIPLE_OPENS: 'multiple_opens', // Lead opened same email multiple times
  HIGH_ENGAGEMENT: 'high_engagement', // Lead is very engaged (hot lead)
  COLD_LEAD_REACTIVATION: 'cold_lead_reactivation', // Cold lead shows activity
  INACTIVITY_THRESHOLD: 'inactivity_threshold', // No activity for X days
  FIRST_INTERACTION: 'first_interaction', // First email opened/clicked
  LINK_CLICKED: 'link_clicked', // Specific link clicked (case study, pricing, etc.)
  PERFECT_TIMING: 'perfect_timing', // Optimal send time based on past behavior
  COMPETITOR_MENTION: 'competitor_mention', // Competitor mentioned in response
  POSITIVE_SENTIMENT: 'positive_sentiment', // Positive response received
  NEGATIVE_SENTIMENT: 'negative_sentiment', // Negative response - damage control
  MEETING_REQUESTED: 'meeting_requested', // Lead asks for meeting
  PRICING_INTEREST: 'pricing_interest', // Lead shows pricing interest
  COMPANY_SIZE_MILESTONE: 'company_size_milestone', // Company hits growth milestone
};

/**
 * Analyze lead behavior and trigger appropriate workflows
 * @param {string} leadId - Lead ID to analyze
 * @param {string} eventType - Event that triggered this analysis
 * @param {Object} eventData - Additional event data
 * @returns {Promise<Object>} Triggered workflows info
 */
export async function analyzeAndTrigger(leadId, eventType, eventData = {}) {
  console.log(`🔍 Analyzing lead ${leadId} for auto-triggers (event: ${eventType})`);

  const lead = await prisma.hotLead.findUnique({
    where: { id: leadId },
    include: {
      client: {
        include: {
          interactions: {
            orderBy: { createdAt: 'desc' },
            take: 20
          }
        }
      }
    }
  });

  if (!lead) {
    console.log(`⚠️ Lead not found: ${leadId}`);
    return { triggered: [] };
  }

  const triggers = [];

  // Run all trigger checks
  await checkEngagementSpike(lead, triggers);
  await checkEngagementDrop(lead, triggers);
  await checkMultipleOpens(lead, triggers, eventData);
  await checkHighEngagement(lead, triggers);
  await checkColdLeadReactivation(lead, triggers);
  await checkInactivityThreshold(lead, triggers);
  await checkFirstInteraction(lead, triggers);
  await checkLinkClicked(lead, triggers, eventData);
  await checkSentimentTriggers(lead, triggers, eventData);
  await checkInterestSignals(lead, triggers, eventData);

  // Start workflows for matched triggers
  const startedWorkflows = [];
  for (const trigger of triggers) {
    const workflows = await findWorkflowsForTrigger(trigger.type, lead, trigger.context);

    for (const workflow of workflows) {
      try {
        const execution = await startWorkflowExecution(
          workflow.id,
          leadId,
          { ...trigger.context, triggerReason: trigger.reason }
        );
        startedWorkflows.push({
          workflowId: workflow.id,
          workflowName: workflow.name,
          executionId: execution.id,
          triggerType: trigger.type,
          reason: trigger.reason
        });
        console.log(`✅ Auto-triggered workflow: ${workflow.name} (${trigger.type})`);
      } catch (error) {
        console.error(`❌ Failed to trigger workflow ${workflow.name}:`, error.message);
      }
    }
  }

  return {
    leadId,
    triggersDetected: triggers.length,
    workflowsStarted: startedWorkflows.length,
    triggered: startedWorkflows
  };
}

/**
 * Check for sudden engagement spike
 */
async function checkEngagementSpike(lead, triggers) {
  try {
    const engagement = await getLeadEngagementLevel(lead.id);

    // Check if engagement increased significantly in last 24h
    const recentInteractions = lead.client?.interactions?.filter(i => {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return new Date(i.createdAt) > oneDayAgo;
    }) || [];

    if (recentInteractions.length >= 3 && engagement.level === 'hot') {
      triggers.push({
        type: TRIGGER_TYPES.ENGAGEMENT_SPIKE,
        reason: `Lead activity increased: ${recentInteractions.length} interactions in 24h`,
        context: {
          engagementScore: engagement.score,
          recentActivityCount: recentInteractions.length
        }
      });
    }
  } catch (error) {
    console.error('Error checking engagement spike:', error);
  }
}

/**
 * Check for engagement drop (re-engagement needed)
 */
async function checkEngagementDrop(lead, triggers) {
  try {
    const engagement = await getLeadEngagementLevel(lead.id);

    // Get interactions from last 2 weeks vs previous 2 weeks
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const fourWeeksAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

    const recentCount = lead.client?.interactions?.filter(i => {
      return new Date(i.createdAt) > twoWeeksAgo;
    }).length || 0;

    const previousCount = lead.client?.interactions?.filter(i => {
      const date = new Date(i.createdAt);
      return date > fourWeeksAgo && date <= twoWeeksAgo;
    }).length || 0;

    // If activity dropped by 50% or more and they were previously active
    if (previousCount >= 2 && recentCount <= previousCount * 0.5) {
      triggers.push({
        type: TRIGGER_TYPES.ENGAGEMENT_DROP,
        reason: `Engagement declining: ${previousCount} → ${recentCount} interactions`,
        context: {
          previousActivity: previousCount,
          currentActivity: recentCount,
          dropPercentage: Math.round((1 - recentCount / previousCount) * 100)
        }
      });
    }
  } catch (error) {
    console.error('Error checking engagement drop:', error);
  }
}

/**
 * Check for multiple opens of same email (strong interest)
 */
async function checkMultipleOpens(lead, triggers, eventData) {
  if (eventData.eventType !== 'opened') return;

  try {
    // Count opens for this specific email
    const opens = await prisma.emailEvent.count({
      where: {
        messageId: eventData.messageId,
        eventType: 'opened',
        recipient: lead.email
      }
    });

    if (opens >= 3) {
      triggers.push({
        type: TRIGGER_TYPES.MULTIPLE_OPENS,
        reason: `Email opened ${opens} times - strong interest signal`,
        context: {
          messageId: eventData.messageId,
          openCount: opens,
          subject: eventData.subject
        }
      });
    }
  } catch (error) {
    console.error('Error checking multiple opens:', error);
  }
}

/**
 * Check for high engagement (hot lead)
 */
async function checkHighEngagement(lead, triggers) {
  try {
    const engagement = await getLeadEngagementLevel(lead.id);

    if (engagement.level === 'hot' && engagement.score >= 70) {
      // Check if we haven't already triggered this recently (within 7 days)
      const recentHotTrigger = await prisma.workflowExecution.findFirst({
        where: {
          leadId: lead.id,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          context: { path: '$.triggerType', equals: TRIGGER_TYPES.HIGH_ENGAGEMENT }
        }
      });

      if (!recentHotTrigger) {
        triggers.push({
          type: TRIGGER_TYPES.HIGH_ENGAGEMENT,
          reason: `Hot lead detected with score ${engagement.score}`,
          context: {
            engagementScore: engagement.score,
            engagementLevel: engagement.level,
            stats: engagement.stats
          }
        });
      }
    }
  } catch (error) {
    console.error('Error checking high engagement:', error);
  }
}

/**
 * Check for cold lead reactivation
 */
async function checkColdLeadReactivation(lead, triggers) {
  try {
    // Get last interaction before today
    const lastInteraction = lead.client?.interactions?.[0];
    if (!lastInteraction) return;

    const daysSinceLastInteraction = Math.floor(
      (Date.now() - new Date(lastInteraction.createdAt).getTime()) / (24 * 60 * 60 * 1000)
    );

    // If no activity for 30+ days but they just did something
    if (daysSinceLastInteraction >= 30 && lastInteraction.createdAt) {
      const veryRecentActivity = lead.client?.interactions?.filter(i => {
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return new Date(i.createdAt) > hourAgo;
      }).length > 0;

      if (veryRecentActivity) {
        triggers.push({
          type: TRIGGER_TYPES.COLD_LEAD_REACTIVATION,
          reason: `Cold lead reactivated after ${daysSinceLastInteraction} days`,
          context: {
            daysSinceLastActivity: daysSinceLastInteraction,
            previousPriority: lead.priority
          }
        });
      }
    }
  } catch (error) {
    console.error('Error checking cold lead reactivation:', error);
  }
}

/**
 * Check for inactivity threshold
 */
async function checkInactivityThreshold(lead, triggers) {
  try {
    const lastInteraction = lead.client?.interactions?.[0];
    if (!lastInteraction) {
      // No interactions at all - check when lead was created
      const daysSinceCreation = Math.floor(
        (Date.now() - new Date(lead.createdAt).getTime()) / (24 * 60 * 60 * 1000)
      );

      if (daysSinceCreation >= 7) {
        triggers.push({
          type: TRIGGER_TYPES.INACTIVITY_THRESHOLD,
          reason: `No interactions since lead creation ${daysSinceCreation} days ago`,
          context: {
            daysSinceCreation,
            enrichmentStatus: lead.enrichmentStatus
          }
        });
      }
      return;
    }

    const daysSinceLastInteraction = Math.floor(
      (Date.now() - new Date(lastInteraction.createdAt).getTime()) / (24 * 60 * 60 * 1000)
    );

    // Trigger if inactive for 14+ days
    if (daysSinceLastInteraction >= 14) {
      triggers.push({
        type: TRIGGER_TYPES.INACTIVITY_THRESHOLD,
        reason: `No activity for ${daysSinceLastInteraction} days`,
        context: {
          daysSinceLastActivity: daysSinceLastInteraction,
          lastInteractionType: lastInteraction.type
        }
      });
    }
  } catch (error) {
    console.error('Error checking inactivity:', error);
  }
}

/**
 * Check for first interaction
 */
async function checkFirstInteraction(lead, triggers) {
  try {
    const interactionCount = lead.client?.interactions?.length || 0;

    if (interactionCount === 1) {
      const firstInteraction = lead.client.interactions[0];
      if (firstInteraction.status === 'opened' || firstInteraction.status === 'clicked') {
        triggers.push({
          type: TRIGGER_TYPES.FIRST_INTERACTION,
          reason: `First engagement: ${firstInteraction.status}`,
          context: {
            interactionType: firstInteraction.status,
            subject: firstInteraction.subject
          }
        });
      }
    }
  } catch (error) {
    console.error('Error checking first interaction:', error);
  }
}

/**
 * Check for specific link clicks (pricing, case studies, etc.)
 */
async function checkLinkClicked(lead, triggers, eventData) {
  if (eventData.eventType !== 'clicked') return;

  try {
    const clickedUrl = eventData.eventData?.url || '';

    // Pricing interest
    if (clickedUrl.includes('pricing') || clickedUrl.includes('tarif') || clickedUrl.includes('price')) {
      triggers.push({
        type: TRIGGER_TYPES.PRICING_INTEREST,
        reason: 'Clicked on pricing link',
        context: {
          clickedUrl,
          subject: eventData.subject
        }
      });
    }

    // Case study interest
    if (clickedUrl.includes('case-study') || clickedUrl.includes('customer-story') || clickedUrl.includes('success')) {
      triggers.push({
        type: TRIGGER_TYPES.LINK_CLICKED,
        reason: 'Clicked on case study link',
        context: {
          clickedUrl,
          linkType: 'case_study'
        }
      });
    }

    // Meeting/demo interest
    if (clickedUrl.includes('meeting') || clickedUrl.includes('demo') || clickedUrl.includes('calendar')) {
      triggers.push({
        type: TRIGGER_TYPES.MEETING_REQUESTED,
        reason: 'Clicked on meeting/demo link',
        context: {
          clickedUrl,
          linkType: 'meeting'
        }
      });
    }
  } catch (error) {
    console.error('Error checking link clicks:', error);
  }
}

/**
 * Check sentiment-based triggers
 */
async function checkSentimentTriggers(lead, triggers, eventData) {
  try {
    // Get recent interactions with sentiment
    const recentInteractions = lead.client?.interactions?.filter(i => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      return new Date(i.createdAt) > threeDaysAgo && i.responseReceived;
    }) || [];

    for (const interaction of recentInteractions) {
      if (interaction.responseSentiment === 'positive') {
        triggers.push({
          type: TRIGGER_TYPES.POSITIVE_SENTIMENT,
          reason: 'Positive response received',
          context: {
            interactionId: interaction.id,
            sentiment: interaction.responseSentiment,
            outcome: interaction.outcome
          }
        });
      } else if (interaction.responseSentiment === 'negative') {
        triggers.push({
          type: TRIGGER_TYPES.NEGATIVE_SENTIMENT,
          reason: 'Negative response - needs attention',
          context: {
            interactionId: interaction.id,
            sentiment: interaction.responseSentiment,
            responseContent: interaction.responseContent?.substring(0, 200)
          }
        });
      }
    }
  } catch (error) {
    console.error('Error checking sentiment:', error);
  }
}

/**
 * Check for interest signals
 */
async function checkInterestSignals(lead, triggers, eventData) {
  try {
    // Check for company growth milestones
    if (lead.employeeCount && lead.employeeCount >= 50 && lead.employeeCount % 50 === 0) {
      triggers.push({
        type: TRIGGER_TYPES.COMPANY_SIZE_MILESTONE,
        reason: `Company reached ${lead.employeeCount} employees`,
        context: {
          employeeCount: lead.employeeCount,
          milestone: Math.floor(lead.employeeCount / 50) * 50
        }
      });
    }
  } catch (error) {
    console.error('Error checking interest signals:', error);
  }
}

/**
 * Find workflows that match a specific trigger
 * @param {string} triggerType - Type of trigger
 * @param {Object} lead - Lead object
 * @param {Object} context - Trigger context
 * @returns {Promise<Array>} Matching workflows
 */
async function findWorkflowsForTrigger(triggerType, lead, context = {}) {
  const workflows = await prisma.workflow.findMany({
    where: {
      status: 'active',
      triggerType: triggerType
    }
  });

  // Filter by segment and priority if specified
  const matchingWorkflows = workflows.filter(workflow => {
    // Check segment match
    if (workflow.targetSegment &&
        workflow.targetSegment !== 'all' &&
        workflow.targetSegment !== lead.segment) {
      return false;
    }

    // Check priority match
    if (workflow.targetPriority &&
        workflow.targetPriority !== 'all' &&
        workflow.targetPriority !== lead.priority) {
      return false;
    }

    // Check if auto-start is enabled
    const triggerConfig = workflow.triggerConfig || {};
    if (triggerConfig.autoStart === false) {
      return false;
    }

    // Check if workflow already running for this lead
    // (This will be checked again in startWorkflowExecution, but good to filter early)
    return true;
  });

  return matchingWorkflows;
}

/**
 * Schedule periodic analysis for all active leads
 * Run this via cron job or scheduled task
 */
export async function runPeriodicTriggerAnalysis() {
  console.log('🔄 Running periodic trigger analysis for all leads...');

  const activeLeads = await prisma.hotLead.findMany({
    where: {
      status: { not: 'converted' }
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
    }
  });

  console.log(`📊 Analyzing ${activeLeads.length} active leads...`);

  const results = [];
  for (const lead of activeLeads) {
    try {
      const result = await analyzeAndTrigger(lead.id, 'periodic_check', {});
      if (result.workflowsStarted > 0) {
        results.push(result);
      }
    } catch (error) {
      console.error(`Error analyzing lead ${lead.id}:`, error);
    }
  }

  console.log(`✅ Periodic analysis complete. Triggered ${results.length} workflows.`);
  return results;
}

/**
 * Hook into email events to trigger analysis
 * Call this from your email webhook handler
 */
export async function handleEmailEventTrigger(emailEvent) {
  const { eventType, recipient, messageId, eventData } = emailEvent;

  // Find lead by email
  const lead = await prisma.hotLead.findFirst({
    where: { email: recipient }
  });

  if (!lead) {
    console.log(`⚠️ No lead found for email: ${recipient}`);
    return null;
  }

  // Analyze and trigger workflows based on email event
  return await analyzeAndTrigger(lead.id, eventType, {
    eventType,
    messageId,
    subject: emailEvent.subject,
    eventData
  });
}

/**
 * Get trigger statistics
 */
export async function getTriggerStatistics(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const executions = await prisma.workflowExecution.findMany({
    where: {
      createdAt: { gte: since }
    },
    include: {
      workflow: true
    }
  });

  const stats = {
    totalTriggered: executions.length,
    byTriggerType: {},
    byWorkflow: {},
    successRate: 0
  };

  executions.forEach(exec => {
    const triggerType = exec.context?.triggerType || exec.workflow.triggerType;
    stats.byTriggerType[triggerType] = (stats.byTriggerType[triggerType] || 0) + 1;
    stats.byWorkflow[exec.workflow.name] = (stats.byWorkflow[exec.workflow.name] || 0) + 1;
  });

  const completed = executions.filter(e => e.status === 'completed').length;
  stats.successRate = executions.length > 0 ? (completed / executions.length * 100).toFixed(2) : 0;

  return stats;
}
