/**
 * Timing Optimizer
 *
 * Automatically optimizes send times for emails based on:
 * - Historical open/click patterns
 * - Lead behavior analysis
 * - Time-of-day performance
 * - Day-of-week performance
 * - Industry patterns
 */

import { prisma } from './database.js';

/**
 * Get optimal send time for a lead
 * @param {string} leadId - Lead ID
 * @returns {Promise<Object>} Optimal timing recommendation
 */
export async function getOptimalSendTime(leadId) {
  console.log(`⏰ Calculating optimal send time for lead ${leadId}`);

  const lead = await prisma.hotLead.findUnique({
    where: { id: leadId },
    include: {
      client: {
        include: {
          interactions: {
            where: {
              status: { in: ['opened', 'clicked', 'responded'] }
            },
            orderBy: { createdAt: 'desc' },
            take: 50
          }
        }
      }
    }
  });

  if (!lead) {
    throw new Error(`Lead not found: ${leadId}`);
  }

  // Analyze lead's individual patterns
  const personalPatterns = analyzeLeadTimePatterns(lead.client?.interactions || []);

  // Get industry/segment patterns
  const segmentPatterns = await getSegmentTimePatterns(lead.segment, lead.nafCode);

  // Get global best practices
  const globalPatterns = await getGlobalTimePatterns();

  // Combine and weight the patterns
  const optimalTime = calculateOptimalTime(personalPatterns, segmentPatterns, globalPatterns);

  return {
    leadId,
    leadName: lead.companyName,
    optimalTime,
    confidence: optimalTime.confidence,
    reasoning: optimalTime.reasoning,
    alternatives: optimalTime.alternatives
  };
}

/**
 * Analyze individual lead's time patterns
 */
function analyzeLeadTimePatterns(interactions) {
  if (interactions.length === 0) {
    return {
      hasData: false,
      confidence: 0
    };
  }

  const hourCounts = {};
  const dayOfWeekCounts = {};

  interactions.forEach(interaction => {
    const date = new Date(interaction.openedAt || interaction.clickedAt || interaction.createdAt);
    const hour = date.getHours();
    const dayOfWeek = date.getDay(); // 0 = Sunday

    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;
  });

  // Find best hour
  const bestHour = Object.entries(hourCounts)
    .sort(([, a], [, b]) => b - a)[0];

  // Find best day
  const bestDay = Object.entries(dayOfWeekCounts)
    .sort(([, a], [, b]) => b - a)[0];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return {
    hasData: true,
    sampleSize: interactions.length,
    bestHour: bestHour ? parseInt(bestHour[0]) : null,
    bestDay: bestDay ? parseInt(bestDay[0]) : null,
    bestDayName: bestDay ? dayNames[parseInt(bestDay[0])] : null,
    confidence: Math.min(interactions.length / 10, 1) // Max confidence at 10+ interactions
  };
}

/**
 * Get segment-wide time patterns
 */
async function getSegmentTimePatterns(segment, nafCode) {
  try {
    // Get all interactions for leads in this segment
    const leads = await prisma.hotLead.findMany({
      where: {
        OR: [
          { segment },
          { nafCode }
        ]
      },
      select: { id: true }
    });

    const leadIds = leads.map(l => l.id);

    const interactions = await prisma.clientInteraction.findMany({
      where: {
        client: {
          hotLead: {
            id: { in: leadIds }
          }
        },
        status: { in: ['opened', 'clicked', 'responded'] }
      },
      select: {
        openedAt: true,
        clickedAt: true,
        createdAt: true
      },
      take: 1000
    });

    if (interactions.length < 10) {
      return {
        hasData: false,
        confidence: 0
      };
    }

    const hourPerformance = {};
    const dayPerformance = {};

    interactions.forEach(interaction => {
      const date = new Date(interaction.openedAt || interaction.clickedAt || interaction.createdAt);
      const hour = date.getHours();
      const day = date.getDay();

      hourPerformance[hour] = (hourPerformance[hour] || 0) + 1;
      dayPerformance[day] = (dayPerformance[day] || 0) + 1;
    });

    const bestHour = Object.entries(hourPerformance)
      .sort(([, a], [, b]) => b - a)[0];

    const bestDay = Object.entries(dayPerformance)
      .sort(([, a], [, b]) => b - a)[0];

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return {
      hasData: true,
      sampleSize: interactions.length,
      bestHour: bestHour ? parseInt(bestHour[0]) : null,
      bestDay: bestDay ? parseInt(bestDay[0]) : null,
      bestDayName: bestDay ? dayNames[parseInt(bestDay[0])] : null,
      confidence: Math.min(interactions.length / 100, 1)
    };

  } catch (error) {
    console.error('Error getting segment patterns:', error);
    return {
      hasData: false,
      confidence: 0
    };
  }
}

/**
 * Get global best practices
 */
async function getGlobalTimePatterns() {
  // B2B email best practices based on research
  return {
    hasData: true,
    bestHours: [9, 10, 14, 15], // 9-10 AM, 2-3 PM
    bestDays: [2, 3, 4], // Tuesday, Wednesday, Thursday
    worstHours: [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23],
    worstDays: [0, 6], // Sunday, Saturday
    confidence: 1.0
  };
}

/**
 * Calculate optimal time combining all patterns
 */
function calculateOptimalTime(personal, segment, global) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Priority: Personal > Segment > Global
  let bestHour, bestDay, confidence, reasoning;

  if (personal.hasData && personal.confidence >= 0.5) {
    // Use personal patterns
    bestHour = personal.bestHour;
    bestDay = personal.bestDay;
    confidence = personal.confidence;
    reasoning = `Based on this lead's personal engagement history (${personal.sampleSize} interactions)`;
  } else if (segment.hasData && segment.confidence >= 0.3) {
    // Use segment patterns
    bestHour = segment.bestHour;
    bestDay = segment.bestDay;
    confidence = segment.confidence;
    reasoning = `Based on similar leads in this segment (${segment.sampleSize} interactions)`;
  } else {
    // Use global best practices
    bestHour = global.bestHours[0]; // Default to 9 AM
    bestDay = global.bestDays[0]; // Default to Tuesday
    confidence = 0.7;
    reasoning = 'Based on B2B email best practices (insufficient personal data)';
  }

  // Calculate next optimal send datetime
  const now = new Date();
  let nextSendDate = new Date(now);

  // Adjust to target day of week
  const currentDay = now.getDay();
  let daysUntilTarget = (bestDay - currentDay + 7) % 7;
  if (daysUntilTarget === 0 && now.getHours() >= bestHour) {
    daysUntilTarget = 7; // If today but past the hour, wait until next week
  }

  nextSendDate.setDate(now.getDate() + daysUntilTarget);
  nextSendDate.setHours(bestHour, 0, 0, 0);

  // Alternative times
  const alternatives = [];

  // Add personal best if not primary
  if (personal.hasData && (personal.bestHour !== bestHour || personal.bestDay !== bestDay)) {
    alternatives.push({
      hour: personal.bestHour,
      day: dayNames[personal.bestDay],
      reason: `Personal best time (${personal.sampleSize} interactions)`,
      confidence: personal.confidence
    });
  }

  // Add segment best if not primary
  if (segment.hasData && (segment.bestHour !== bestHour || segment.bestDay !== bestDay)) {
    alternatives.push({
      hour: segment.bestHour,
      day: dayNames[segment.bestDay],
      reason: `Segment average (${segment.sampleSize} interactions)`,
      confidence: segment.confidence
    });
  }

  // Add global best practices
  global.bestHours.slice(0, 2).forEach(hour => {
    if (hour !== bestHour) {
      alternatives.push({
        hour,
        day: dayNames[global.bestDays[0]],
        reason: 'B2B best practice',
        confidence: 0.7
      });
    }
  });

  return {
    hour: bestHour,
    day: dayNames[bestDay],
    dayOfWeek: bestDay,
    nextSendDate: nextSendDate.toISOString(),
    nextSendDateLocal: nextSendDate.toLocaleString('fr-FR'),
    confidence,
    reasoning,
    alternatives: alternatives.slice(0, 3)
  };
}

/**
 * Get optimal wait time between workflow steps
 * @param {string} leadId - Lead ID
 * @param {string} lastStepType - Type of last step
 * @returns {Promise<Object>} Optimal wait time
 */
export async function getOptimalWaitTime(leadId, lastStepType) {
  console.log(`⏰ Calculating optimal wait time for lead ${leadId} after ${lastStepType}`);

  // Get lead's response patterns
  const lead = await prisma.hotLead.findUnique({
    where: { id: leadId },
    include: {
      client: {
        include: {
          interactions: {
            where: {
              responseReceived: true
            },
            orderBy: { createdAt: 'desc' },
            take: 20
          }
        }
      }
    }
  });

  if (!lead) {
    throw new Error(`Lead not found: ${leadId}`);
  }

  // Analyze response time patterns
  const responsePatterns = analyzeResponseTimes(lead.client?.interactions || []);

  // Default wait times based on best practices
  const defaultWaitTimes = {
    email: { days: 3, reasoning: 'Standard B2B follow-up interval' },
    wait: { days: 0, reasoning: 'No additional wait needed' },
    action: { days: 0, reasoning: 'Immediate next step' },
    condition: { days: 0, reasoning: 'Immediate evaluation' }
  };

  const baseWait = defaultWaitTimes[lastStepType] || defaultWaitTimes.email;

  // Adjust based on lead's patterns
  let adjustedDays = baseWait.days;
  let reasoning = baseWait.reasoning;

  if (responsePatterns.hasData) {
    // If lead typically responds quickly, shorten wait
    if (responsePatterns.avgResponseDays < 2) {
      adjustedDays = Math.max(1, adjustedDays - 1);
      reasoning = `Lead typically responds within ${responsePatterns.avgResponseDays.toFixed(1)} days - shortened wait time`;
    }
    // If lead responds slowly, lengthen wait
    else if (responsePatterns.avgResponseDays > 5) {
      adjustedDays = Math.min(7, adjustedDays + 2);
      reasoning = `Lead typically takes ${responsePatterns.avgResponseDays.toFixed(1)} days to respond - extended wait time`;
    }
  }

  return {
    leadId,
    lastStepType,
    waitDays: adjustedDays,
    waitHours: adjustedDays * 24,
    reasoning,
    confidence: responsePatterns.confidence,
    nextStepDate: new Date(Date.now() + adjustedDays * 24 * 60 * 60 * 1000).toISOString()
  };
}

/**
 * Analyze response time patterns
 */
function analyzeResponseTimes(interactions) {
  if (interactions.length < 2) {
    return {
      hasData: false,
      confidence: 0
    };
  }

  const responseTimes = [];

  for (let i = 0; i < interactions.length - 1; i++) {
    const current = interactions[i];
    const previous = interactions[i + 1];

    if (current.respondedAt && previous.createdAt) {
      const responseTime = new Date(current.respondedAt) - new Date(previous.createdAt);
      const days = responseTime / (24 * 60 * 60 * 1000);
      if (days > 0 && days < 30) {
        responseTimes.push(days);
      }
    }
  }

  if (responseTimes.length === 0) {
    return {
      hasData: false,
      confidence: 0
    };
  }

  const avgResponseDays = responseTimes.reduce((sum, days) => sum + days, 0) / responseTimes.length;

  return {
    hasData: true,
    sampleSize: responseTimes.length,
    avgResponseDays,
    minResponseDays: Math.min(...responseTimes),
    maxResponseDays: Math.max(...responseTimes),
    confidence: Math.min(responseTimes.length / 5, 1)
  };
}

/**
 * Schedule workflow step at optimal time
 * @param {string} executionId - Workflow execution ID
 * @param {string} stepId - Step ID to schedule
 * @returns {Promise<Object>} Scheduled time
 */
export async function scheduleStepAtOptimalTime(executionId, stepId) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      stepExecutions: {
        where: { stepId },
        include: { step: true }
      }
    }
  });

  if (!execution) {
    throw new Error(`Execution not found: ${executionId}`);
  }

  const stepExecution = execution.stepExecutions[0];
  if (!stepExecution) {
    throw new Error(`Step execution not found: ${stepId}`);
  }

  // Only optimize timing for email steps
  if (stepExecution.step.stepType !== 'email') {
    return {
      optimized: false,
      reason: 'Only email steps are optimized for timing'
    };
  }

  // Get optimal send time
  const optimalTime = await getOptimalSendTime(execution.leadId);

  // Update step execution with scheduled time
  await prisma.stepExecution.update({
    where: { id: stepExecution.id },
    data: {
      scheduledFor: new Date(optimalTime.optimalTime.nextSendDate)
    }
  });

  console.log(`✅ Scheduled step at optimal time: ${optimalTime.optimalTime.nextSendDateLocal}`);

  return {
    optimized: true,
    scheduledFor: optimalTime.optimalTime.nextSendDate,
    scheduledForLocal: optimalTime.optimalTime.nextSendDateLocal,
    reasoning: optimalTime.optimalTime.reasoning,
    confidence: optimalTime.confidence
  };
}

/**
 * Get timing analytics
 * @returns {Promise<Object>} Timing performance analytics
 */
export async function getTimingAnalytics() {
  try {
    const emailEvents = await prisma.emailEvent.findMany({
      where: {
        eventType: { in: ['opened', 'clicked'] },
        createdAt: {
          gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
        }
      },
      select: {
        createdAt: true,
        eventType: true
      }
    });

    const hourPerformance = {};
    const dayPerformance = {};

    emailEvents.forEach(event => {
      const date = new Date(event.createdAt);
      const hour = date.getHours();
      const day = date.getDay();

      if (!hourPerformance[hour]) hourPerformance[hour] = { opens: 0, clicks: 0 };
      if (!dayPerformance[day]) dayPerformance[day] = { opens: 0, clicks: 0 };

      if (event.eventType === 'opened') {
        hourPerformance[hour].opens++;
        dayPerformance[day].opens++;
      } else if (event.eventType === 'clicked') {
        hourPerformance[hour].clicks++;
        dayPerformance[day].clicks++;
      }
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return {
      period: 'Last 90 days',
      totalEvents: emailEvents.length,
      byHour: Object.entries(hourPerformance).map(([hour, data]) => ({
        hour: parseInt(hour),
        opens: data.opens,
        clicks: data.clicks,
        total: data.opens + data.clicks
      })).sort((a, b) => a.hour - b.hour),
      byDay: Object.entries(dayPerformance).map(([day, data]) => ({
        day: parseInt(day),
        dayName: dayNames[parseInt(day)],
        opens: data.opens,
        clicks: data.clicks,
        total: data.opens + data.clicks
      })).sort((a, b) => a.day - b.day),
      bestHours: Object.entries(hourPerformance)
        .sort(([, a], [, b]) => (b.opens + b.clicks) - (a.opens + a.clicks))
        .slice(0, 3)
        .map(([hour]) => parseInt(hour)),
      bestDays: Object.entries(dayPerformance)
        .sort(([, a], [, b]) => (b.opens + b.clicks) - (a.opens + a.clicks))
        .slice(0, 3)
        .map(([day]) => dayNames[parseInt(day)])
    };

  } catch (error) {
    console.error('Error getting timing analytics:', error);
    throw error;
  }
}
