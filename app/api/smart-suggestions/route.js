/**
 * Smart Step Suggestions API
 * POST /api/smart-suggestions
 */

import { NextResponse } from 'next/server';
import {
  getSmartStepSuggestions,
  getRecommendedNextSteps,
  getPerformanceBenchmarks
} from '@/lib/smart-step-suggester';

export async function POST(request) {
  try {
    const { executionId, category, currentStepType } = await request.json();

    // Get smart suggestions for execution
    if (executionId) {
      const suggestions = await getSmartStepSuggestions(executionId);
      return NextResponse.json({
        success: true,
        ...suggestions
      });
    }

    // Get recommended next steps by category
    if (category && currentStepType) {
      const recommendations = getRecommendedNextSteps(category, currentStepType);
      return NextResponse.json({
        success: true,
        category,
        currentStepType,
        recommendations
      });
    }

    return NextResponse.json(
      { error: 'executionId or (category + currentStepType) required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error getting smart suggestions:', error);
    return NextResponse.json(
      {
        error: 'Failed to get suggestions',
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return NextResponse.json(
        { error: 'category parameter required' },
        { status: 400 }
      );
    }

    const benchmarks = await getPerformanceBenchmarks(category);

    return NextResponse.json({
      success: true,
      ...benchmarks
    });

  } catch (error) {
    console.error('Error getting benchmarks:', error);
    return NextResponse.json(
      {
        error: 'Failed to get benchmarks',
        message: error.message
      },
      { status: 500 }
    );
  }
}
