import { prisma } from '@/lib/database';
import { NextResponse } from 'next/server';
import { analyzeResponse, generateSuggestedResponse } from '@/lib/queues/ai-analysis-queue';

// POST - Trigger AI analysis or actions
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'analyze-response') {
      const { trackingId, responseText, context } = body;

      if (!trackingId || !responseText) {
        return NextResponse.json(
          { error: 'trackingId and responseText are required' },
          { status: 400 }
        );
      }

      await analyzeResponse(trackingId, responseText, context);

      return NextResponse.json({
        success: true,
        message: 'Response queued for AI analysis'
      });
    }

    if (action === 'generate-response') {
      const { trackingId } = body;

      if (!trackingId) {
        return NextResponse.json(
          { error: 'trackingId is required' },
          { status: 400 }
        );
      }

      const intelligence = await prisma.responseIntelligence.findFirst({
        where: { emailTrackingId: trackingId },
        orderBy: { createdAt: 'desc' }
      });

      if (!intelligence) {
        return NextResponse.json(
          { error: 'No analysis found for this email' },
          { status: 404 }
        );
      }

      await generateSuggestedResponse(trackingId, intelligence.id);

      return NextResponse.json({
        success: true,
        message: 'Response generation queued'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('AI analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}

// GET - Get AI analysis results
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('trackingId');
    const leadId = searchParams.get('leadId');
    const action = searchParams.get('action');

    if (action === 'insights') {
      if (!leadId) {
        return NextResponse.json(
          { error: 'leadId is required' },
          { status: 400 }
        );
      }

      // OPTIMIZED: Use single query with proper joins
      const responses = await prisma.responseIntelligence.findMany({
        where: {
          emailTracking: {
            leadId
          }
        },
        include: {
          emailTracking: {
            select: {
              subject: true,
              sentAt: true,
              sentTo: true,
              openedAt: true,
              clickedAt: true,
              repliedAt: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Aggregate insights
      const insights = {
        totalResponses: responses.length,
        sentimentBreakdown: {
          positive: responses.filter(r => r.sentiment === 'positive').length,
          neutral: responses.filter(r => r.sentiment === 'neutral').length,
          negative: responses.filter(r => r.sentiment === 'negative').length
        },
        commonIntents: responses.reduce((acc, r) => {
          acc[r.primaryIntent] = (acc[r.primaryIntent] || 0) + 1;
          return acc;
        }, {}),
        avgSentimentScore: responses.length > 0
          ? responses.reduce((sum, r) => sum + r.sentimentScore, 0) / responses.length
          : 0,
        objections: responses.flatMap(r => r.keyPhrases || []).filter(p =>
          p.includes('mais') || p.includes('cependant') || p.includes('problème')
        ),
        buyingSignals: responses.flatMap(r => r.keyPhrases || []).filter(p =>
          p.includes('intéressé') || p.includes('démo') || p.includes('budget')
        ),
        competitorsMentioned: [...new Set(responses.flatMap(r => r.mentionedCompetitors || []))],
        ledToMeeting: responses.some(r => r.ledToMeeting),
        ledToDeal: responses.some(r => r.ledToDeal)
      };

      return NextResponse.json({ insights, responses });
    }

    if (trackingId) {
      // OPTIMIZED: Single query with includes
      const tracking = await prisma.emailTracking.findUnique({
        where: { id: trackingId },
        include: {
          lead: {
            select: {
              id: true,
              companyName: true,
              priority: true,
              status: true,
              managers: {
                select: {
                  name: true,
                  role: true,
                  email: true
                },
                take: 2
              }
            }
          }
        }
      });

      if (!tracking) {
        return NextResponse.json({ error: 'Tracking not found' }, { status: 404 });
      }

      const intelligence = await prisma.responseIntelligence.findFirst({
        where: { emailTrackingId: trackingId },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        tracking,
        analysis: intelligence,
        hasAnalysis: !!intelligence
      });
    }

    // ✅ FIXED N+1 QUERY: Use include instead of separate queries
    const recentAnalyses = await prisma.responseIntelligence.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        emailTracking: {
          select: {
            id: true,
            emailId: true,
            leadId: true,
            subject: true,
            sentTo: true,
            sentAt: true,
            opened: true,
            clicked: true,
            replied: true,
            lead: {
              select: {
                id: true,
                companyName: true,
                priority: true,
                status: true
              }
            }
          }
        }
      }
    });

    // Transform to match expected format (emailTracking already included)
    const analysesWithTracking = recentAnalyses.map(analysis => ({
      ...analysis,
      emailTracking: analysis.emailTracking || null
    }));

    return NextResponse.json({ analyses: analysesWithTracking });
  } catch (error) {
    console.error('AI analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis', details: error.message },
      { status: 500 }
    );
  }
}
