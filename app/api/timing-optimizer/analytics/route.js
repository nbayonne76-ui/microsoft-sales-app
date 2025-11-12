/**
 * Timing Analytics API
 * GET /api/timing-optimizer/analytics
 */

import { NextResponse } from 'next/server';
import { getTimingAnalytics } from '@/lib/timing-optimizer';

export async function GET() {
  try {
    const analytics = await getTimingAnalytics();

    return NextResponse.json({
      success: true,
      ...analytics
    });

  } catch (error) {
    console.error('Error getting timing analytics:', error);
    return NextResponse.json(
      {
        error: 'Failed to get timing analytics',
        message: error.message
      },
      { status: 500 }
    );
  }
}
