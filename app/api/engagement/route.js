/**
 * ENGAGEMENT TRACKING API
 *
 * Quick Win #2: Real-time engagement scoring and tracking
 *
 * Endpoints:
 * - GET  /api/engagement?leadId=xyz  - Get engagement for specific lead
 * - GET  /api/engagement?all=true    - Get all leads engagement
 * - GET  /api/engagement?summary=true - Get engagement summary
 * - GET  /api/engagement?level=hot   - Filter by engagement level
 * - POST /api/engagement/recalculate - Recalculate all scores
 */

import {
  calculateLeadEngagement,
  calculateAllLeadsEngagement,
  getEngagementSummary,
  getEngagementBadge,
  getEngagementColor,
  getTrendEmoji
} from '@/lib/engagement-tracker';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');
    const all = searchParams.get('all') === 'true';
    const summary = searchParams.get('summary') === 'true';
    const level = searchParams.get('level'); // hot, warm, cold
    const minScore = searchParams.get('minScore');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 1. Get engagement for specific lead
    if (leadId) {
      console.log(`📊 [API] Getting engagement for lead: ${leadId}`);

      const engagement = await calculateLeadEngagement(leadId);

      if (!engagement) {
        return Response.json({
          error: 'Lead not found'
        }, { status: 404 });
      }

      return Response.json({
        success: true,
        engagement: {
          ...engagement,
          badge: getEngagementBadge(engagement.level),
          color: getEngagementColor(engagement.level),
          trendEmoji: getTrendEmoji(engagement.trend)
        }
      });
    }

    // 2. Get engagement summary
    if (summary) {
      console.log('📊 [API] Getting engagement summary');

      const summaryData = await getEngagementSummary();

      return Response.json({
        success: true,
        summary: summaryData,
        timestamp: new Date().toISOString()
      });
    }

    // 3. Get all leads engagement (with filters)
    if (all || level || minScore) {
      console.log(`📊 [API] Getting all engagements (level: ${level}, minScore: ${minScore})`);

      const options = {
        limit,
        offset,
        level: level || null,
        minScore: minScore ? parseInt(minScore) : null
      };

      const result = await calculateAllLeadsEngagement(options);

      // Add UI helpers to each score
      const scoresWithUI = result.scores.map(s => ({
        ...s,
        badge: getEngagementBadge(s.level),
        color: getEngagementColor(s.level),
        trendEmoji: getTrendEmoji(s.trend)
      }));

      return Response.json({
        success: true,
        scores: scoresWithUI,
        distribution: result.distribution,
        total: result.total,
        averageScore: result.averageScore,
        pagination: {
          limit,
          offset,
          hasMore: result.total > (offset + limit)
        }
      });
    }

    // No parameters - return usage info
    return Response.json({
      error: 'Missing parameters',
      usage: {
        byLead: '/api/engagement?leadId=xyz',
        all: '/api/engagement?all=true',
        summary: '/api/engagement?summary=true',
        filtered: '/api/engagement?level=hot',
        withMinScore: '/api/engagement?minScore=50',
        paginated: '/api/engagement?all=true&limit=50&offset=0'
      }
    }, { status: 400 });

  } catch (error) {
    console.error('❌ [API] Engagement endpoint error:', error);
    return Response.json({
      error: 'Failed to calculate engagement',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    }, { status: 500 });
  }
}

/**
 * POST - Recalculate engagement scores
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, leadId } = body;

    if (action === 'recalculate') {
      console.log('🔄 [API] Recalculating engagement scores...');

      if (leadId) {
        // Recalculate for specific lead
        const engagement = await calculateLeadEngagement(leadId);

        return Response.json({
          success: true,
          message: 'Engagement recalculated for lead',
          engagement
        });
      } else {
        // Recalculate for all leads
        const result = await calculateAllLeadsEngagement({ limit: 1000 });

        return Response.json({
          success: true,
          message: 'Engagement recalculated for all leads',
          total: result.total,
          distribution: result.distribution,
          averageScore: result.averageScore
        });
      }
    }

    return Response.json({
      error: 'Unknown action',
      validActions: ['recalculate']
    }, { status: 400 });

  } catch (error) {
    console.error('❌ [API] Engagement POST error:', error);
    return Response.json({
      error: 'Failed to process request',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    }, { status: 500 });
  }
}
