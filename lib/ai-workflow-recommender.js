/**
 * AI-Powered Workflow Recommender
 *
 * Uses Claude AI to recommend optimal workflows and next steps based on:
 * - Lead behavior and engagement
 * - Historical performance data
 * - Current workflow effectiveness
 * - Industry best practices
 */

import Anthropic from '@anthropic-ai/sdk';
import { prisma } from './database.js';
import { getLeadEngagementLevel } from './engagement-tracker.js';
import { getLeadContext } from './lead-context-aggregator.js';
import { workflowTemplates } from './workflow-templates.js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
});

/**
 * Get AI-powered workflow recommendations for a lead
 * @param {string} leadId - Lead ID
 * @returns {Promise<Object>} Recommendations
 */
export async function getAIWorkflowRecommendations(leadId) {
  console.log(`🤖 Getting AI recommendations for lead ${leadId}`);

  // Get comprehensive lead context
  const leadContext = await getLeadContext(leadId);
  const engagement = await getLeadEngagementLevel(leadId);

  // Get lead's workflow history
  const workflowHistory = await prisma.workflowExecution.findMany({
    where: { leadId },
    include: {
      workflow: true,
      stepExecutions: {
        include: { step: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  // Get performance metrics for similar leads
  const similarLeadsPerformance = await getSimilarLeadsPerformance(leadContext);

  // Build prompt for Claude
  const prompt = buildRecommendationPrompt(leadContext, engagement, workflowHistory, similarLeadsPerformance);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const recommendation = response.content[0].text;

    // Parse and structure the recommendation
    const structuredRecommendation = parseAIRecommendation(recommendation);

    return {
      leadId,
      leadName: leadContext.lead.companyName,
      engagementLevel: engagement.level,
      engagementScore: engagement.score,
      recommendation: structuredRecommendation,
      rawRecommendation: recommendation,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    throw error;
  }
}

/**
 * Get workflow recommendations based on current execution
 * @param {string} executionId - Workflow execution ID
 * @returns {Promise<Object>} Next step recommendations
 */
export async function getAINextStepRecommendations(executionId) {
  console.log(`🤖 Getting AI next step recommendations for execution ${executionId}`);

  // Get execution with full context
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      workflow: {
        include: { steps: true }
      },
      stepExecutions: {
        include: { step: true },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!execution) {
    throw new Error(`Execution not found: ${executionId}`);
  }

  // Get lead context
  const leadContext = await getLeadContext(execution.leadId);
  const engagement = await getLeadEngagementLevel(execution.leadId);

  // Build prompt
  const prompt = buildNextStepPrompt(execution, leadContext, engagement);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const recommendation = response.content[0].text;

    return {
      executionId,
      currentStep: execution.currentStepOrder,
      totalSteps: execution.totalSteps,
      recommendation,
      generatedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error getting next step recommendations:', error);
    throw error;
  }
}

/**
 * Build prompt for workflow recommendations
 */
function buildRecommendationPrompt(leadContext, engagement, workflowHistory, similarLeadsPerformance) {
  const { lead, managers, interactions, services } = leadContext;

  return `You are an expert in B2B lead nurturing and marketing automation. Analyze this lead and recommend the optimal workflow strategy.

LEAD INFORMATION:
- Company: ${lead.companyName}
- Employees: ${lead.employeeCount || 'Unknown'}
- Industry: ${lead.nafCode || 'Unknown'}
- Priority: ${lead.priority}
- Enrichment Status: ${lead.enrichmentStatus}
- Email: ${lead.email || 'No email'}

ENGAGEMENT DATA:
- Level: ${engagement.level} (${engagement.score}/100)
- Total Interactions: ${interactions.length}
- Email Opens: ${engagement.stats.opens}
- Email Clicks: ${engagement.stats.clicks}
- Responses: ${engagement.stats.replies}
- Last Interaction: ${interactions[0] ? new Date(interactions[0].createdAt).toLocaleDateString() : 'Never'}

WORKFLOW HISTORY:
${workflowHistory.length > 0 ? workflowHistory.map(wf => `
- ${wf.workflow.name}: ${wf.status} (${wf.emailsSent} emails sent, ${wf.emailsOpened} opened, ${wf.emailsReplied} replied)
`).join('') : 'No previous workflows'}

SIMILAR LEADS PERFORMANCE:
${similarLeadsPerformance}

AVAILABLE WORKFLOW TEMPLATES:
${workflowTemplates.map(t => `- ${t.displayName}: ${t.description}`).join('\n')}

Please provide recommendations in the following structure:

PRIMARY RECOMMENDATION:
[Recommend the best workflow template and explain why]

REASONING:
[Explain the key factors that led to this recommendation]

ALTERNATIVE APPROACHES:
[List 2-3 alternative workflows and when they would be better]

TIMING:
[Recommend when to start this workflow - immediately, after enrichment, specific delay, etc.]

CUSTOMIZATION SUGGESTIONS:
[Suggest any customizations to the recommended workflow for this specific lead]

EXPECTED OUTCOMES:
[What results can be expected based on similar leads]

RISK FACTORS:
[Any concerns or risks to watch for with this lead]`;
}

/**
 * Build prompt for next step recommendations
 */
function buildNextStepPrompt(execution, leadContext, engagement) {
  const { lead, interactions } = leadContext;
  const completedSteps = execution.stepExecutions.filter(se => se.status === 'completed');
  const currentResults = {
    emailsSent: execution.emailsSent,
    emailsOpened: execution.emailsOpened,
    emailsClicked: execution.emailsClicked,
    emailsReplied: execution.emailsReplied
  };

  return `You are an expert in optimizing marketing workflows. Analyze this ongoing workflow execution and recommend the best next steps.

WORKFLOW: ${execution.workflow.name}
STATUS: ${execution.status}
PROGRESS: ${execution.completedSteps}/${execution.totalSteps} steps completed

LEAD: ${lead.companyName}
CURRENT ENGAGEMENT: ${engagement.level} (${engagement.score}/100)

EXECUTION RESULTS SO FAR:
- Emails Sent: ${currentResults.emailsSent}
- Opens: ${currentResults.emailsOpened} (${currentResults.emailsSent > 0 ? Math.round(currentResults.emailsOpened / currentResults.emailsSent * 100) : 0}%)
- Clicks: ${currentResults.emailsClicked}
- Replies: ${currentResults.emailsReplied}

COMPLETED STEPS:
${completedSteps.map(se => `
- ${se.step.name} (${se.step.stepType}): ${se.status}
  Result: ${JSON.stringify(se.result)}
`).join('')}

RECENT LEAD ACTIVITY:
${interactions.slice(0, 5).map(i => `
- ${new Date(i.createdAt).toLocaleDateString()}: ${i.type} - ${i.status}
`).join('')}

Please analyze and provide:

1. CONTINUE OR ADJUST?
[Should we continue with the planned workflow or make adjustments?]

2. PERFORMANCE ASSESSMENT:
[How is this workflow performing for this lead? Better/worse than expected?]

3. OPTIMIZATION RECOMMENDATIONS:
[Specific suggestions to improve results - timing, content, approach]

4. NEXT BEST ACTION:
[What should be the immediate next step?]

5. EARLY WARNING SIGNS:
[Any signs that suggest we should pause or change strategy?]`;
}

/**
 * Parse AI recommendation into structured format
 */
function parseAIRecommendation(recommendation) {
  const sections = {
    primaryRecommendation: '',
    reasoning: '',
    alternatives: [],
    timing: '',
    customizations: '',
    expectedOutcomes: '',
    riskFactors: ''
  };

  try {
    // Split by section headers
    const primaryMatch = recommendation.match(/PRIMARY RECOMMENDATION:(.*?)(?=REASONING:|$)/s);
    const reasoningMatch = recommendation.match(/REASONING:(.*?)(?=ALTERNATIVE|$)/s);
    const alternativesMatch = recommendation.match(/ALTERNATIVE APPROACHES?:(.*?)(?=TIMING:|$)/s);
    const timingMatch = recommendation.match(/TIMING:(.*?)(?=CUSTOMIZATION|$)/s);
    const customizationsMatch = recommendation.match(/CUSTOMIZATION SUGGESTIONS?:(.*?)(?=EXPECTED|$)/s);
    const outcomesMatch = recommendation.match(/EXPECTED OUTCOMES?:(.*?)(?=RISK|$)/s);
    const risksMatch = recommendation.match(/RISK FACTORS?:(.*?)$/s);

    if (primaryMatch) sections.primaryRecommendation = primaryMatch[1].trim();
    if (reasoningMatch) sections.reasoning = reasoningMatch[1].trim();
    if (timingMatch) sections.timing = timingMatch[1].trim();
    if (customizationsMatch) sections.customizations = customizationsMatch[1].trim();
    if (outcomesMatch) sections.expectedOutcomes = outcomesMatch[1].trim();
    if (risksMatch) sections.riskFactors = risksMatch[1].trim();

    if (alternativesMatch) {
      const altText = alternativesMatch[1].trim();
      sections.alternatives = altText.split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().substring(1).trim());
    }

  } catch (error) {
    console.error('Error parsing AI recommendation:', error);
  }

  return sections;
}

/**
 * Get performance data from similar leads
 */
async function getSimilarLeadsPerformance(leadContext) {
  try {
    const { lead } = leadContext;

    // Find similar leads (same industry or size)
    const similarLeads = await prisma.hotLead.findMany({
      where: {
        OR: [
          { nafCode: lead.nafCode },
          {
            employeeCount: {
              gte: lead.employeeCount * 0.7,
              lte: lead.employeeCount * 1.3
            }
          }
        ],
        NOT: {
          id: lead.id
        }
      },
      take: 20
    });

    if (similarLeads.length === 0) {
      return 'No similar leads found for comparison';
    }

    // Get their workflow performance
    const executions = await prisma.workflowExecution.findMany({
      where: {
        leadId: { in: similarLeads.map(l => l.id) },
        status: { in: ['completed', 'active'] }
      },
      include: {
        workflow: true
      }
    });

    if (executions.length === 0) {
      return 'Similar leads found but no workflow history available';
    }

    // Calculate average performance
    const avgEmailsSent = executions.reduce((sum, e) => sum + e.emailsSent, 0) / executions.length;
    const avgOpens = executions.reduce((sum, e) => sum + e.emailsOpened, 0) / executions.length;
    const avgClicks = executions.reduce((sum, e) => sum + e.emailsClicked, 0) / executions.length;
    const avgReplies = executions.reduce((sum, e) => sum + e.emailsReplied, 0) / executions.length;

    const openRate = avgEmailsSent > 0 ? (avgOpens / avgEmailsSent * 100).toFixed(1) : 0;
    const replyRate = avgEmailsSent > 0 ? (avgReplies / avgEmailsSent * 100).toFixed(1) : 0;

    // Most successful workflows
    const workflowPerformance = {};
    executions.forEach(e => {
      const name = e.workflow.name;
      if (!workflowPerformance[name]) {
        workflowPerformance[name] = { count: 0, totalReplies: 0, totalSent: 0 };
      }
      workflowPerformance[name].count++;
      workflowPerformance[name].totalReplies += e.emailsReplied;
      workflowPerformance[name].totalSent += e.emailsSent;
    });

    const topWorkflows = Object.entries(workflowPerformance)
      .map(([name, data]) => ({
        name,
        replyRate: data.totalSent > 0 ? (data.totalReplies / data.totalSent * 100).toFixed(1) : 0,
        count: data.count
      }))
      .sort((a, b) => parseFloat(b.replyRate) - parseFloat(a.replyRate))
      .slice(0, 3);

    return `
Based on ${similarLeads.length} similar leads with ${executions.length} workflow executions:
- Average Open Rate: ${openRate}%
- Average Reply Rate: ${replyRate}%
- Top Performing Workflows:
${topWorkflows.map(w => `  * ${w.name}: ${w.replyRate}% reply rate (${w.count} uses)`).join('\n')}
`;

  } catch (error) {
    console.error('Error getting similar leads performance:', error);
    return 'Unable to retrieve similar leads performance data';
  }
}

/**
 * Get batch recommendations for multiple leads
 * @param {Array<string>} leadIds - Array of lead IDs
 * @returns {Promise<Array>} Recommendations for all leads
 */
export async function getBatchAIRecommendations(leadIds) {
  console.log(`🤖 Getting batch AI recommendations for ${leadIds.length} leads`);

  const recommendations = [];

  for (const leadId of leadIds) {
    try {
      const recommendation = await getAIWorkflowRecommendations(leadId);
      recommendations.push(recommendation);
    } catch (error) {
      console.error(`Error getting recommendation for lead ${leadId}:`, error);
      recommendations.push({
        leadId,
        error: error.message
      });
    }
  }

  return recommendations;
}
