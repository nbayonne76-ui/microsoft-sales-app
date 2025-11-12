/**
 * AI Workflow Recommendations API
 * POST /api/ai-recommendations/workflow
 */

import { NextResponse } from 'next/server';
import { getAIWorkflowRecommendations, getBatchAIRecommendations } from '@/lib/ai-workflow-recommender';

export async function POST(request) {
  try {
    const { leadId, leadIds } = await request.json();

    // Batch mode
    if (leadIds && Array.isArray(leadIds)) {
      const recommendations = await getBatchAIRecommendations(leadIds);
      return NextResponse.json({
        success: true,
        count: recommendations.length,
        recommendations
      });
    }

    // Single lead mode
    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId or leadIds is required' },
        { status: 400 }
      );
    }

    const recommendation = await getAIWorkflowRecommendations(leadId);

    return NextResponse.json({
      success: true,
      ...recommendation
    });

  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return NextResponse.json(
      {
        error: 'Failed to get recommendations',
        message: error.message
      },
      { status: 500 }
    );
  }
}
