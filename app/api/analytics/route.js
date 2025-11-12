/**
 * Analytics API - Now using database for persistence
 * Replaces in-memory storage with Prisma database
 */

import { prisma } from '@/lib/database';
import { trackAnalyticsEvent } from '@/lib/queue';

// PERFORMANCE FIX: Cache duration for analytics responses (5 minutes)
const CACHE_DURATION = 300; // seconds

/**
 * GET /api/analytics
 * Get analytics summary, recommendations, or raw data
 * PERFORMANCE FIX: Includes Cache-Control headers to cache expensive aggregations
 */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || 'summary';
    const days = parseInt(url.searchParams.get('days') || '30');

    console.log('📊 Analytics GET request:', type, `${days} days`);

    const since = new Date();
    since.setDate(since.getDate() - days);

    if (type === 'summary') {
      // Get metrics summary
      const [
        emailEvents,
        analyticsEvents,
        emailMetrics,
        emailFeedback,
      ] = await Promise.all([
        prisma.emailEvent.findMany({
          where: {
            createdAt: { gte: since },
          },
        }),
        prisma.analyticsEvent.findMany({
          where: {
            createdAt: { gte: since },
          },
        }),
        prisma.emailMetric.findMany({
          where: {
            date: { gte: since },
          },
        }),
        prisma.emailFeedback.findMany({
          where: {
            createdAt: { gte: since },
          },
          include: {
            interaction: true,
          },
        }),
      ]);

      // Calculate aggregate metrics
      const totalEmailsSent = emailEvents.filter(e => e.eventType === 'sent').length;
      const totalOpened = emailEvents.filter(e => e.eventType === 'opened').length;
      const totalClicked = emailEvents.filter(e => e.eventType === 'clicked').length;
      const totalReplied = emailEvents.filter(e => e.eventType === 'replied').length;
      const totalBounced = emailEvents.filter(e => e.eventType === 'bounced').length;

      // Calculate rates
      const deliveryRate = totalEmailsSent > 0
        ? ((totalEmailsSent - totalBounced) / totalEmailsSent * 100).toFixed(2)
        : 0;
      const openRate = (totalEmailsSent - totalBounced) > 0
        ? (totalOpened / (totalEmailsSent - totalBounced) * 100).toFixed(2)
        : 0;
      const clickRate = totalOpened > 0
        ? (totalClicked / totalOpened * 100).toFixed(2)
        : 0;
      const responseRate = totalEmailsSent > 0
        ? (totalReplied / totalEmailsSent * 100).toFixed(2)
        : 0;

      // Feedback metrics
      const avgQualityRating = emailFeedback.length > 0
        ? (emailFeedback.reduce((sum, f) => sum + (f.qualityRating || 0), 0) / emailFeedback.length).toFixed(2)
        : 0;
      const avgRelevanceRating = emailFeedback.length > 0
        ? (emailFeedback.reduce((sum, f) => sum + (f.relevanceRating || 0), 0) / emailFeedback.length).toFixed(2)
        : 0;
      const avgToneRating = emailFeedback.length > 0
        ? (emailFeedback.reduce((sum, f) => sum + (f.toneRating || 0), 0) / emailFeedback.length).toFixed(2)
        : 0;

      // AI interactions
      const aiInteractions = analyticsEvents.filter(e => e.eventCategory === 'ai').length;

      // Recent activity
      const recentActivity = analyticsEvents
        .slice(-10)
        .reverse()
        .map(event => ({
          id: event.id,
          type: event.eventType,
          category: event.eventCategory,
          timestamp: event.createdAt,
          details: event.eventData,
        }));

      // Segment breakdown
      const segmentBreakdown = emailMetrics.reduce((acc, metric) => {
        if (!acc[metric.segment]) {
          acc[metric.segment] = {
            sent: 0,
            opened: 0,
            clicked: 0,
            replied: 0,
          };
        }
        acc[metric.segment].sent += metric.emailsSent;
        acc[metric.segment].opened += metric.opened;
        acc[metric.segment].clicked += metric.clicked;
        acc[metric.segment].replied += metric.replied;
        return acc;
      }, {});

      const metrics = {
        period: {
          days,
          from: since,
          to: new Date(),
        },
        email_metrics: {
          total_sent: totalEmailsSent,
          total_delivered: totalEmailsSent - totalBounced,
          total_opened: totalOpened,
          total_clicked: totalClicked,
          total_replied: totalReplied,
          total_bounced: totalBounced,
          delivery_rate: parseFloat(deliveryRate),
          open_rate: parseFloat(openRate),
          click_rate: parseFloat(clickRate),
          response_rate: parseFloat(responseRate),
        },
        feedback_metrics: {
          total_feedback: emailFeedback.length,
          average_quality: parseFloat(avgQualityRating),
          average_relevance: parseFloat(avgRelevanceRating),
          average_tone: parseFloat(avgToneRating),
          feedback_rate: totalEmailsSent > 0
            ? ((emailFeedback.length / totalEmailsSent) * 100).toFixed(2)
            : 0,
        },
        ai_metrics: {
          total_interactions: aiInteractions,
          recent_activity: recentActivity.filter(a => a.category === 'ai'),
        },
        segment_breakdown: segmentBreakdown,
        recent_activity: recentActivity,
        timestamp: new Date().toISOString(),
      };

      // PERFORMANCE FIX: Add cache headers to reduce database load
      return Response.json(
        { success: true, metrics },
        {
          headers: {
            'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
          }
        }
      );
    }

    if (type === 'recommendations') {
      // Analyze feedback to recommend best practices
      const feedback = await prisma.emailFeedback.findMany({
        where: {
          createdAt: { gte: since },
        },
        include: {
          interaction: true,
        },
      });

      // Find best performing segments
      const segmentPerformance = {};
      feedback.forEach(f => {
        const segment = f.interaction?.context || 'unknown';
        if (!segmentPerformance[segment]) {
          segmentPerformance[segment] = {
            count: 0,
            totalQuality: 0,
            totalRelevance: 0,
          };
        }
        segmentPerformance[segment].count++;
        segmentPerformance[segment].totalQuality += f.qualityRating || 0;
        segmentPerformance[segment].totalRelevance += f.relevanceRating || 0;
      });

      const recommendations = Object.entries(segmentPerformance)
        .map(([segment, data]) => ({
          segment,
          avg_quality: (data.totalQuality / data.count).toFixed(2),
          avg_relevance: (data.totalRelevance / data.count).toFixed(2),
          sample_size: data.count,
        }))
        .sort((a, b) => parseFloat(b.avg_quality) - parseFloat(a.avg_quality));

      // PERFORMANCE FIX: Cache recommendations
      return Response.json(
        {
          success: true,
          recommendations: recommendations.slice(0, 5),
          insights: {
            best_segment: recommendations[0]?.segment || 'N/A',
            recommendation: recommendations[0]
              ? `Focus on ${recommendations[0].segment} segment for best results`
              : 'Not enough data for recommendations',
          },
        },
        {
          headers: {
            'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
          }
        }
      );
    }

    if (type === 'events') {
      // Get raw email events
      const events = await prisma.emailEvent.findMany({
        where: {
          createdAt: { gte: since },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: parseInt(url.searchParams.get('limit') || '100'),
      });

      // PERFORMANCE FIX: Cache events with shorter duration (1 minute)
      return Response.json(
        {
          success: true,
          events,
          count: events.length,
        },
        {
          headers: {
            'Cache-Control': `public, s-maxage=60, stale-while-revalidate=120`,
          }
        }
      );
    }

    if (type === 'metrics') {
      // Get daily metrics
      const metrics = await prisma.emailMetric.findMany({
        where: {
          date: { gte: since },
        },
        orderBy: {
          date: 'asc',
        },
      });

      // PERFORMANCE FIX: Cache metrics
      return Response.json(
        {
          success: true,
          metrics,
          count: metrics.length,
        },
        {
          headers: {
            'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
          }
        }
      );
    }

    return Response.json({ error: 'Unknown type parameter' }, { status: 400 });

  } catch (error) {
    console.error('❌ Analytics GET error:', error);
    return Response.json({
      error: 'Failed to get analytics',
      details: error.message,
    }, { status: 500 });
  }
}

/**
 * POST /api/analytics
 * Track analytics events (queued for async processing)
 */
export async function POST(request) {
  try {
    const { action, data } = await request.json();

    console.log('📊 Analytics POST:', action);

    // Queue the analytics event for async processing
    await trackAnalyticsEvent({
      eventType: action,
      eventCategory: determineCategory(action),
      eventData: data,
      userId: data.userId,
      sessionId: data.sessionId,
      metadata: data.metadata,
    });

    return Response.json({
      success: true,
      message: 'Event queued for processing',
      action,
    });

  } catch (error) {
    console.error('❌ Analytics POST error:', error);
    return Response.json({
      error: 'Failed to process analytics',
      details: error.message,
    }, { status: 500 });
  }
}

/**
 * DELETE /api/analytics
 * Clear analytics data (development only)
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get('confirm');

    if (confirm !== 'yes') {
      return Response.json({
        error: 'Confirmation required. Add ?confirm=yes to the URL',
      }, { status: 400 });
    }

    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return Response.json({
        error: 'Cannot delete analytics in production',
      }, { status: 403 });
    }

    // Delete all analytics data
    await prisma.$transaction([
      prisma.emailEvent.deleteMany(),
      prisma.analyticsEvent.deleteMany(),
      prisma.emailMetric.deleteMany(),
    ]);

    console.log('🧹 Analytics data cleared');

    return Response.json({
      success: true,
      message: 'All analytics data cleared',
    });

  } catch (error) {
    console.error('❌ Analytics DELETE error:', error);
    return Response.json({
      error: 'Failed to clear analytics',
      details: error.message,
    }, { status: 500 });
  }
}

/**
 * Helper to determine event category
 */
function determineCategory(action) {
  if (action.includes('email')) return 'email';
  if (action.includes('ai') || action.includes('assistant')) return 'ai';
  if (action.includes('feedback')) return 'user';
  return 'system';
}
