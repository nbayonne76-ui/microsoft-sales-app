/**
 * API endpoint to get intelligent trigger statistics
 * GET /api/intelligent-triggers/stats?days=30
 */

import { NextResponse } from 'next/server';
import { getTriggerStatistics } from '@/lib/intelligent-trigger-system';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    const stats = await getTriggerStatistics(days);

    return NextResponse.json({
      success: true,
      period: `Last ${days} days`,
      ...stats
    });

  } catch (error) {
    console.error('Error getting trigger statistics:', error);
    return NextResponse.json(
      {
        error: 'Failed to get statistics',
        message: error.message
      },
      { status: 500 }
    );
  }
}
