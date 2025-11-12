/**
 * API endpoint to manually trigger intelligent workflow analysis
 * POST /api/intelligent-triggers/analyze
 */

import { NextResponse } from 'next/server';
import { analyzeAndTrigger } from '@/lib/intelligent-trigger-system';

export async function POST(request) {
  try {
    const body = await request.json();
    const { leadId, eventType, eventData } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: 'leadId is required' },
        { status: 400 }
      );
    }

    const result = await analyzeAndTrigger(
      leadId,
      eventType || 'manual_trigger',
      eventData || {}
    );

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Error in intelligent trigger analysis:', error);
    return NextResponse.json(
      {
        error: 'Failed to analyze triggers',
        message: error.message
      },
      { status: 500 }
    );
  }
}
