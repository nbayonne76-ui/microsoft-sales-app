/**
 * Create Workflow from Template API
 * POST /api/workflow-builder/from-template
 */

import { NextResponse } from 'next/server';
import { createWorkflowFromTemplate, getAvailableTemplates } from '@/lib/workflow-builder';

export async function POST(request) {
  try {
    const { templateName, customizations } = await request.json();

    if (!templateName) {
      return NextResponse.json(
        { error: 'templateName is required' },
        { status: 400 }
      );
    }

    const workflow = await createWorkflowFromTemplate(templateName, customizations || {});

    return NextResponse.json({
      success: true,
      workflow
    });

  } catch (error) {
    console.error('Error creating workflow from template:', error);
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
    const templates = getAvailableTemplates();

    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error) {
    console.error('Error getting templates:', error);
    return NextResponse.json(
      {
        error: 'Failed to get templates',
        message: error.message
      },
      { status: 500 }
    );
  }
}
