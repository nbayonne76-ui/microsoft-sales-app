/**
 * Quick Workflow Builder API
 * POST /api/workflow-builder/quick
 */

import { NextResponse } from 'next/server';
import { createQuickWorkflow, getQuickWorkflows } from '@/lib/workflow-builder';

export async function POST(request) {
  try {
    const config = await request.json();

    const workflow = await createQuickWorkflow(config);

    return NextResponse.json({
      success: true,
      workflow
    });

  } catch (error) {
    console.error('Error creating quick workflow:', error);
    return NextResponse.json(
      {
        error: 'Failed to create workflow',
        message: error.message
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const quickWorkflows = getQuickWorkflows();

    return NextResponse.json({
      success: true,
      workflows: quickWorkflows
    });

  } catch (error) {
    console.error('Error getting quick workflows:', error);
    return NextResponse.json(
      {
        error: 'Failed to get quick workflows',
        message: error.message
      },
      { status: 500 }
    );
  }
}
