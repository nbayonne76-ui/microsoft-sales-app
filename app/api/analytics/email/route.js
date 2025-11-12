import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database'; // ✅ Use singleton instead of new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Calculate date range
    const now = new Date();
    let startDate;

    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Beginning of time
    }

    // Fetch email tracking data
    const emailTracking = await prisma.emailTracking.findMany({
      where: {
        sentAt: {
          gte: startDate
        }
      }
    });

    // Calculate basic metrics
    const totalSent = emailTracking.length;
    const totalOpened = emailTracking.filter(e => e.opened).length;
    const totalClicked = emailTracking.filter(e => e.clicked).length;
    const totalReplied = emailTracking.filter(e => e.replied).length;
    const totalBounced = emailTracking.filter(e => e.bounced).length;

    const totalDelivered = totalSent - totalBounced;
    const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : 0;
    const openRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : 0;
    const clickRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : 0;
    const replyRate = totalDelivered > 0 ? ((totalReplied / totalDelivered) * 100).toFixed(1) : 0;

    // Fetch sentiment data
    const responseIntelligence = await prisma.responseIntelligence.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    });

    const totalResponses = responseIntelligence.length;
    const sentimentPositive = responseIntelligence.filter(r => r.sentiment === 'positive').length;
    const sentimentNeutral = responseIntelligence.filter(r => r.sentiment === 'neutral').length;
    const sentimentNegative = responseIntelligence.filter(r => r.sentiment === 'negative').length;

    const sentimentPositivePercent = totalResponses > 0 ? Math.round((sentimentPositive / totalResponses) * 100) : 0;
    const sentimentNeutralPercent = totalResponses > 0 ? Math.round((sentimentNeutral / totalResponses) * 100) : 0;
    const sentimentNegativePercent = totalResponses > 0 ? Math.round((sentimentNegative / totalResponses) * 100) : 0;

    // Calculate average engagement score
    const avgEngagementScore = emailTracking.length > 0
      ? Math.round(emailTracking.reduce((sum, e) => sum + (e.engagementScore || 0), 0) / emailTracking.length)
      : 0;

    // Fetch sequences data
    const sequences = await prisma.emailSequence.findMany({
      include: {
        enrollments: {
          where: {
            createdAt: {
              gte: startDate
            }
          }
        }
      }
    });

    const sequencesData = sequences.map(seq => {
      const enrollments = seq.enrollments || [];
      const completedCount = enrollments.filter(e => e.status === 'completed').length;
      const respondedCount = enrollments.filter(e => e.responded).length;
      const emailsSent = enrollments.reduce((sum, e) => sum + (e.emailsSent || 0), 0);

      const responseRate = enrollments.length > 0
        ? ((respondedCount / enrollments.length) * 100).toFixed(1)
        : 0;

      // Meeting rate estimation (based on positive responses)
      const meetingRate = responseRate > 0 ? (parseFloat(responseRate) * 0.6).toFixed(1) : 0;

      // Determine performance
      let performance = 'average';
      if (parseFloat(responseRate) >= 15) performance = 'excellent';
      else if (parseFloat(responseRate) >= 12) performance = 'good';
      else if (parseFloat(responseRate) < 8) performance = 'needs_improvement';

      return {
        id: seq.id,
        name: seq.name,
        enrolledCount: enrollments.length,
        completedCount,
        responseRate: parseFloat(responseRate),
        meetingRate: parseFloat(meetingRate),
        status: seq.isActive ? 'active' : 'paused',
        performance
      };
    });

    // Get top performing emails (by subject)
    const emailsBySubject = emailTracking.reduce((acc, email) => {
      if (!email.subject) return acc;

      if (!acc[email.subject]) {
        acc[email.subject] = {
          subject: email.subject,
          sent: 0,
          opened: 0,
          clicked: 0,
          replied: 0
        };
      }

      acc[email.subject].sent++;
      if (email.opened) acc[email.subject].opened++;
      if (email.clicked) acc[email.subject].clicked++;
      if (email.replied) acc[email.subject].replied++;

      return acc;
    }, {});

    const topPerformers = Object.values(emailsBySubject)
      .filter(e => e.sent >= 10) // Only emails sent to at least 10 people
      .map(e => ({
        subject: e.subject,
        sent: e.sent,
        openRate: e.sent > 0 ? ((e.opened / e.sent) * 100).toFixed(1) : 0,
        clickRate: e.opened > 0 ? ((e.clicked / e.opened) * 100).toFixed(1) : 0,
        replyRate: e.sent > 0 ? ((e.replied / e.sent) * 100).toFixed(1) : 0
      }))
      .sort((a, b) => parseFloat(b.openRate) - parseFloat(a.openRate))
      .slice(0, 5);

    // Build response
    const metrics = {
      totalSent,
      totalDelivered,
      totalOpened,
      totalClicked,
      totalReplied,
      deliveryRate: parseFloat(deliveryRate),
      openRate: parseFloat(openRate),
      clickRate: parseFloat(clickRate),
      replyRate: parseFloat(replyRate),
      sentimentPositive: sentimentPositivePercent,
      sentimentNeutral: sentimentNeutralPercent,
      sentimentNegative: sentimentNegativePercent,
      avgEngagementScore,
      topPerformingSequence: sequencesData.length > 0
        ? sequencesData.sort((a, b) => b.responseRate - a.responseRate)[0].name
        : 'N/A'
    };

    return NextResponse.json({
      success: true,
      metrics,
      sequences: sequencesData,
      topPerformers,
      recentActivity: [] // Can be implemented later
    });

  } catch (error) {
    console.error('Error fetching email analytics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics',
        details: error.message
      },
      { status: 500 }
    );
  }
  // ✅ No need for $disconnect() with singleton pattern
}
