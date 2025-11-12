/**
 * SMART SUBJECT LINES API
 *
 * Quick Win #3: Context-aware email subject generation
 *
 * Endpoints:
 * - POST /api/smart-subjects - Generate smart subjects with context
 *
 * Body:
 * {
 *   "leadId": "xxx",              // Required: Lead to generate subjects for
 *   "purpose": "prospection",      // prospection, follow_up, demo, proposal
 *   "count": 5,                    // Number of subjects to generate
 *   "includeEmojis": false,        // Add emojis to subjects
 *   "maxLength": 60,               // Maximum subject length
 *   "createABTest": false          // Create A/B test variants
 * }
 */

import { generateSmartSubjectLines, createSubjectABTest } from '@/lib/smart-subject-generator';
import { rateLimitMiddleware } from '@/lib/rate-limiter';

export async function POST(request) {
  // Rate limit: 20 requests per minute
  const rateLimitCheck = rateLimitMiddleware(request, 'api');
  if (rateLimitCheck) return rateLimitCheck;

  try {
    const body = await request.json();
    const {
      leadId,
      purpose = 'prospection',
      count = 5,
      includeEmojis = false,
      maxLength = 60,
      createABTest = false
    } = body;

    if (!leadId) {
      return Response.json({
        error: 'leadId is required'
      }, { status: 400 });
    }

    console.log(`📧 [API] Generating smart subjects for lead: ${leadId}`);

    // Generate smart subjects
    const result = await generateSmartSubjectLines({
      leadId,
      purpose,
      count,
      includeEmojis,
      maxLength
    });

    // Optionally create A/B test
    let abTest = null;
    if (createABTest && result.subjects.length >= 2) {
      abTest = createSubjectABTest(
        result.subjects.slice(0, Math.min(3, result.subjects.length)),
        `${result.context.company} - Subject Test`
      );
    }

    return Response.json({
      ...result,
      abTest,
      recommendations: {
        best: result.subjects[0],
        alternative: result.subjects[1] || null,
        insights: {
          avgScore: Math.round(
            result.subjects.reduce((sum, s) => sum + s.score, 0) / result.subjects.length
          ),
          avgEstimatedOpenRate: Math.round(
            result.subjects.reduce((sum, s) => sum + s.estimatedOpenRate, 0) / result.subjects.length
          ),
          contextQuality: result.context.dataQuality || 0
        }
      }
    });

  } catch (error) {
    console.error('❌ [API] Smart subjects error:', error);
    return Response.json({
      error: 'Failed to generate smart subjects',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    }, { status: 500 });
  }
}

/**
 * GET endpoint - Get best performing subjects from history
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const purpose = searchParams.get('purpose');
    const limit = parseInt(searchParams.get('limit') || '10');

    // This would query historical performance data
    // For now, return usage info

    return Response.json({
      message: 'Use POST to generate smart subjects',
      usage: {
        endpoint: '/api/smart-subjects',
        method: 'POST',
        body: {
          leadId: 'required',
          purpose: 'prospection | follow_up | demo | proposal',
          count: '5 (default)',
          includeEmojis: 'false (default)',
          maxLength: '60 (default)',
          createABTest: 'false (default)'
        },
        example: {
          leadId: 'cmgwcsro90002r258njjj8ljg',
          purpose: 'prospection',
          count: 5,
          createABTest: true
        }
      }
    });

  } catch (error) {
    console.error('❌ [API] Smart subjects GET error:', error);
    return Response.json({
      error: 'Failed to retrieve subjects'
    }, { status: 500 });
  }
}
