/**
 * MEETING BRIEF API
 *
 * Quick Win #4: Automated meeting preparation briefs
 *
 * Endpoints:
 * - POST /api/meeting-brief - Generate meeting brief
 * - GET  /api/meeting-brief?leadId=xxx&format=json|markdown - Get brief
 */

import { generateMeetingBrief, formatBriefAsMarkdown } from '@/lib/meeting-brief-generator';
import { rateLimitMiddleware } from '@/lib/rate-limiter';

export async function POST(request) {
  // Rate limit: 20 requests per minute
  const rateLimitCheck = rateLimitMiddleware(request, 'api');
  if (rateLimitCheck) return rateLimitCheck;

  try {
    const body = await request.json();
    const {
      leadId,
      meetingType = 'discovery', // discovery, demo, proposal, follow_up
      attendees = [],
      duration = 30,
      includeCompetitors = false,
      includeROI = true,
      format = 'json' // json, markdown
    } = body;

    if (!leadId) {
      return Response.json({
        error: 'leadId is required'
      }, { status: 400 });
    }

    console.log(`📋 [API] Generating meeting brief for lead: ${leadId}`);

    // Generate brief
    const result = await generateMeetingBrief({
      leadId,
      meetingType,
      attendees,
      duration,
      includeCompetitors,
      includeROI
    });

    // Format response
    if (format === 'markdown') {
      const markdown = formatBriefAsMarkdown(result.brief);

      return new Response(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="meeting-brief-${result.metadata.company.replace(/\s+/g, '-')}.md"`
        }
      });
    }

    return Response.json({
      ...result,
      download: {
        markdown: `/api/meeting-brief?leadId=${leadId}&meetingType=${meetingType}&format=markdown`,
        json: `/api/meeting-brief?leadId=${leadId}&meetingType=${meetingType}&format=json`
      }
    });

  } catch (error) {
    console.error('❌ [API] Meeting brief error:', error);
    return Response.json({
      error: 'Failed to generate meeting brief',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    }, { status: 500 });
  }
}

/**
 * GET - Retrieve meeting brief
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const meetingType = searchParams.get('meetingType') || 'discovery';
    const format = searchParams.get('format') || 'json';
    const includeROI = searchParams.get('includeROI') !== 'false';
    const includeCompetitors = searchParams.get('includeCompetitors') === 'true';

    if (!leadId) {
      return Response.json({
        error: 'leadId query parameter required',
        usage: {
          endpoint: '/api/meeting-brief',
          method: 'GET',
          params: {
            leadId: 'required',
            meetingType: 'discovery | demo | proposal | follow_up (default: discovery)',
            format: 'json | markdown (default: json)',
            includeROI: 'true | false (default: true)',
            includeCompetitors: 'true | false (default: false)'
          },
          example: '/api/meeting-brief?leadId=xxx&meetingType=demo&format=markdown'
        }
      }, { status: 400 });
    }

    console.log(`📋 [API] Getting meeting brief for lead: ${leadId}`);

    // Generate brief
    const result = await generateMeetingBrief({
      leadId,
      meetingType,
      includeROI,
      includeCompetitors
    });

    // Format response
    if (format === 'markdown') {
      const markdown = formatBriefAsMarkdown(result.brief);

      return new Response(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="meeting-brief-${result.metadata.company.replace(/\s+/g, '-')}.md"`
        }
      });
    }

    return Response.json(result);

  } catch (error) {
    console.error('❌ [API] Meeting brief GET error:', error);
    return Response.json({
      error: 'Failed to retrieve meeting brief',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    }, { status: 500 });
  }
}
