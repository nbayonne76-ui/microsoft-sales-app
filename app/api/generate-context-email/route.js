/**
 * CONTEXT-AWARE EMAIL GENERATION ENDPOINT
 *
 * Quick Win #1: Generate emails with full lead context enrichment
 *
 * Usage:
 * POST /api/generate-context-email
 * {
 *   "leadId": "lead-id-here",
 *   "purpose": "prospection", // or "suivi", "relance", "offre_commerciale"
 *   "tone": "professional_friendly", // or "formal", "casual_expert"
 *   "customMessage": "optional custom message to include"
 * }
 */

import { prisma } from '@/lib/database';
import { getLeadContext, formatContextForAI } from '@/lib/lead-context-aggregator';
import { smartEmailGenerator } from '@/lib/smart-email-generator';
import { withRateLimit } from '@/lib/with-rate-limit';
import { emailRateLimiter } from '@/lib/rate-limit';

async function handlePOST(request) {

  try {
    const { leadId, purpose = 'prospection', tone = 'professional_friendly', customMessage } = await request.json();

    if (!leadId) {
      return Response.json({
        error: 'leadId is required'
      }, { status: 400 });
    }

    console.log(`📧 [CONTEXT-AWARE] Generating email for lead: ${leadId}`);

    // Step 1: Fetch lead from database
    const lead = await prisma.hotLead.findUnique({
      where: { id: leadId },
      include: {
        managers: true
      }
    });

    if (!lead) {
      return Response.json({
        error: 'Lead not found',
        leadId
      }, { status: 404 });
    }

    // Step 2: Get enriched context
    console.log('📊 [CONTEXT-AWARE] Fetching enriched context...');
    const context = await getLeadContext(leadId);

    if (!context) {
      return Response.json({
        error: 'Failed to load lead context'
      }, { status: 500 });
    }

    console.log(`✅ [CONTEXT-AWARE] Context loaded - Quality: ${context.metadata.dataQuality}%, Engagement: ${context.engagement.level}`);

    // Step 3: Map purpose to email type
    const emailTypeMapping = {
      'prospection': 'prospection',
      'suivi': 'follow_up',
      'relance': 'follow_up',
      'offre_commerciale': 'demo'
    };

    // Step 4: Determine company size
    let companySize = 'sme';
    if (context.company.employeeCount) {
      if (context.company.employeeCount > 250) companySize = 'enterprise';
      else if (context.company.employeeCount < 50) companySize = 'startup';
    }

    // Step 5: Extract recommended solutions and challenges
    const specificNeeds = context.recommendedSolutions.map(s => s.name);
    const currentChallenges = context.pendingActions.map(a => a.action);

    // Step 6: Get primary contact
    const primaryContact = context.people.managers[0] || {};

    // Step 7: Generate email with full context
    console.log('✨ [CONTEXT-AWARE] Generating personalized email...');
    const emailContent = smartEmailGenerator.generatePersonalizedEmail({
      companyName: context.company.name,
      recipientName: primaryContact.name || 'Contact',
      recipientRole: primaryContact.role || 'Directeur',
      companySize,
      industry: context.legal.nafCode || 'retail',
      emailType: emailTypeMapping[purpose],
      specificNeeds,
      currentChallenges,
      // Pass enriched context
      enrichedContext: {
        dataQuality: context.metadata.dataQuality,
        engagementLevel: context.engagement.level,
        engagementScore: context.engagement.score,
        lastInteraction: context.engagement.lastInteraction,
        services: context.capabilities.services.map(s => s.name),
        specialties: context.capabilities.specialties.map(s => s.name),
        recentInteractions: context.interactionHistory.email.slice(0, 3),
        contactStrategy: context.contactStrategy
      }
    });

    // Step 8: Add custom message if provided
    let finalContent = emailContent.body;
    if (customMessage) {
      finalContent += `\n\n${customMessage}`;
    }

    // Step 9: Format response
    const response = {
      success: true,
      email: {
        subject: emailContent.subject,
        body: finalContent,
        to: primaryContact.email || context.company.email,
        toName: primaryContact.name
      },
      context: {
        company: context.company.name,
        dataQuality: context.metadata.dataQuality,
        engagementLevel: context.engagement.level,
        engagementScore: context.engagement.score,
        contactStrategy: context.contactStrategy.approach,
        recommendedTone: context.contactStrategy.tone,
        recommendedUrgency: context.contactStrategy.urgency
      },
      metadata: {
        ...emailContent.metadata,
        contextEnriched: true,
        leadId,
        purpose,
        tone,
        generatedAt: new Date().toISOString()
      },
      insights: {
        recentInteractions: context.interactionHistory.email.slice(0, 3).map(i => ({
          date: i.createdAt,
          subject: i.subject,
          status: i.status,
          responseReceived: i.responseReceived
        })),
        services: context.capabilities.services.slice(0, 5).map(s => s.name),
        recommendedSolutions: context.recommendedSolutions.slice(0, 3).map(s => s.name),
        pendingActions: context.pendingActions.slice(0, 3).map(a => a.action)
      }
    };

    console.log(`✅ [CONTEXT-AWARE] Email generated successfully with ${context.metadata.dataQuality}% context quality`);

    return Response.json(response);

  } catch (error) {
    console.error('❌ [CONTEXT-AWARE] Email generation error:', error);
    return Response.json({
      error: 'Email generation failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    }, { status: 500 });
  }
}

/**
 * GET endpoint - Get context preview without generating email
 */
async function handleGET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return Response.json({
        error: 'leadId query parameter required'
      }, { status: 400 });
    }

    console.log(`👀 [CONTEXT-AWARE] Preview context for lead: ${leadId}`);

    // Fetch context
    const context = await getLeadContext(leadId);

    if (!context) {
      return Response.json({
        error: 'Lead not found or context unavailable'
      }, { status: 404 });
    }

    // Return formatted context preview
    return Response.json({
      success: true,
      leadId,
      context: {
        company: {
          name: context.company.name,
          website: context.company.website,
          employeeCount: context.company.employeeCount,
          description: context.company.description
        },
        keyPeople: context.people.managers.slice(0, 3),
        engagement: context.engagement,
        dataQuality: context.metadata.dataQuality,
        contactStrategy: context.contactStrategy,
        services: context.capabilities.services.slice(0, 5),
        recommendedSolutions: context.recommendedSolutions.slice(0, 3),
        recentInteractions: context.interactionHistory.email.slice(0, 5),
        pendingActions: context.pendingActions.slice(0, 3)
      },
      contextFormatted: formatContextForAI(context),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [CONTEXT-AWARE] Context preview error:', error);
    return Response.json({
      error: 'Context preview failed',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    }, { status: 500 });
  }
}

// Export with rate limiting - 10 requests per minute for email generation
export const POST = withRateLimit(handlePOST, emailRateLimiter)
export const GET = withRateLimit(handleGET, emailRateLimiter)
