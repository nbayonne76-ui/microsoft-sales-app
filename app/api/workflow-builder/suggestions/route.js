/**
 * Workflow Suggestions API
 * POST /api/workflow-builder/suggestions
 */

import { NextResponse } from 'next/server';
import { suggestWorkflows } from '@/lib/workflow-builder';
import { prisma } from '@/lib/database';
import { getLeadEngagementLevel } from '@/lib/engagement-tracker';

export async function POST(request) {
  try {
    const { leadId } = await request.json();

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId is required' },
        { status: 400 }
      );
    }

    // Get lead data
    const lead = await prisma.hotLead.findUnique({
      where: { id: leadId },
      include: {
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
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Get engagement level
    const engagement = await getLeadEngagementLevel(leadId);

    // Calculate days since last contact
    const lastInteraction = lead.client?.interactions?.[0];
    const daysSinceLastContact = lastInteraction
      ? Math.floor((Date.now() - new Date(lastInteraction.createdAt).getTime()) / (24 * 60 * 60 * 1000))
      : 999;

    // Check if lead has responded
    const hasResponded = lead.client?.interactions?.some(i => i.responseReceived) || false;

    // Prepare context
    const leadContext = {
      priority: lead.priority,
      engagementLevel: engagement.level,
      daysSinceLastContact,
      hasResponded,
      isEnriched: lead.enrichmentStatus === 'enriched'
    };

    // Get suggestions
    const suggestions = suggestWorkflows(leadContext);

    return NextResponse.json({
      success: true,
      leadContext,
      suggestions
    });

  } catch (error) {
    console.error('Error getting workflow suggestions:', error);
    return NextResponse.json(
      {
        error: 'Failed to get suggestions',
        message: error.message
      },
      { status: 500 }
    );
  }
}
