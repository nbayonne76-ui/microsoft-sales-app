import { NextResponse } from 'next/server';
import { automaticThresholdTuner } from '../../../lib/automatic-threshold-tuner.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'current':
        const currentThresholds = automaticThresholdTuner.getCurrentThresholds();
        return NextResponse.json({
          success: true,
          thresholds: currentThresholds
        });

      case 'evaluate':
        const days = parseInt(searchParams.get('days')) || 7;
        const evaluation = await automaticThresholdTuner.evaluateThresholdPerformance(days);
        return NextResponse.json({
          success: true,
          evaluation
        });

      case 'recommendation':
        const performanceData = await automaticThresholdTuner.collectPerformanceData();
        const recommendation = await automaticThresholdTuner.getThresholdRecommendation(performanceData);
        return NextResponse.json({
          success: true,
          recommendation
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error in threshold tuning API:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'tune':
        const tuningResult = await automaticThresholdTuner.performThresholdTuning();
        return NextResponse.json({
          success: true,
          message: tuningResult ? 'Thresholds tuned successfully' : 'No tuning needed',
          result: tuningResult
        });

      case 'set_manual':
        const { thresholds, reason } = data;
        const newThresholds = await automaticThresholdTuner.setThresholds(thresholds, reason);
        return NextResponse.json({
          success: true,
          message: 'Thresholds updated manually',
          thresholds: newThresholds
        });

      case 'schedule':
        const { intervalHours } = data;
        const scheduleResult = automaticThresholdTuner.scheduleAutoTuning(intervalHours || 24);
        return NextResponse.json({
          success: true,
          message: scheduleResult
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Error in threshold tuning POST:', error);
    return NextResponse.json({
      error: 'Failed to process threshold tuning request',
      details: error.message
    }, { status: 500 });
  }
}