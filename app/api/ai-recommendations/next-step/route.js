/**
 * AI Next Step Recommendations API
 * POST /api/ai-recommendations/next-step
 */

import { NextResponse } from 'next/server';
import { getAINextStepRecommendations } from '@/lib/ai-workflow-recommender';

export async function POST(request) {
  try {
    const { executionId } = await request.json();

    if (!executionId) {
      return NextResponse.json(
        { error: 'executionId is required' },
        { status: 400 }
      );
    }

    const recommendation = await getAINextStepRecommendations(executionId);

    return NextResponse.json({
      success: true,
      ...recommendation
    });

  } catch (error) {
    console.error('Error getting next step recommendations:', error);
    return NextResponse.json(
      {
        error: 'Failed to get recommendations',
        message: error.message
      },
      { status: 500 }
    );
  }
}
