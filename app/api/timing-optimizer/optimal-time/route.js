/**
 * Optimal Send Time API
 * POST /api/timing-optimizer/optimal-time
 */

import { NextResponse } from 'next/server';
import { getOptimalSendTime, getOptimalWaitTime } from '@/lib/timing-optimizer';

export async function POST(request) {
  try {
    const { leadId, lastStepType } = await request.json();

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId is required' },
        { status: 400 }
      );
    }

    // Get optimal send time
    const sendTime = await getOptimalSendTime(leadId);

    // Also get optimal wait time if lastStepType provided
    let waitTime = null;
    if (lastStepType) {
      waitTime = await getOptimalWaitTime(leadId, lastStepType);
    }

    return NextResponse.json({
      success: true,
      sendTime,
      waitTime
    });

  } catch (error) {
    console.error('Error getting optimal time:', error);
    return NextResponse.json(
      {
        error: 'Failed to calculate optimal time',
        message: error.message
      },
      { status: 500 }
    );
  }
}
