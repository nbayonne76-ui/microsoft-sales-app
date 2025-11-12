import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * API pour gérer les templates de workflows prédéfinis
 */

// GET /api/workflows/templates - List all workflow templates
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = {};
    if (category) where.category = category;

    const templates = await prisma.workflowTemplate.findMany({
      where,
      orderBy: { timesUsed: 'desc' }
    });

    return NextResponse.json({
      success: true,
      templates
    });

  } catch (error) {
    console.error('❌ Error fetching workflow templates:', error);
    return NextResponse.json(
      { error: 'Error fetching workflow templates', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/workflows/templates - Create workflow from template
export async function POST(request) {
  try {
    const body = await request.json();
    const { templateName, customizations } = body;

    if (!templateName) {
      return NextResponse.json(
        { error: 'templateName is required' },
        { status: 400 }
      );
    }

    // Get template
    const template = await prisma.workflowTemplate.findUnique({
      where: { name: templateName }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Create workflow from template
    const templateData = template.templateData;
    const workflowData = {
      ...templateData,
      ...customizations,
      isTemplate: false
    };

    // Create the workflow
    const workflow = await prisma.workflow.create({
      data: {
        name: workflowData.name,
        description: workflowData.description,
        category: workflowData.category,
        status: 'active',
        triggerType: workflowData.triggerType,
        triggerConfig: workflowData.triggerConfig || {},
        targetSegment: workflowData.targetSegment,
        targetPriority: workflowData.targetPriority,
        steps: {
          create: workflowData.steps.map((step, index) => ({
            stepOrder: index,
            name: step.name,
            description: step.description,
            stepType: step.stepType,
            config: step.config || {},
            executeIf: step.executeIf || null
          }))
        }
      },
      include: {
        steps: {
          orderBy: { stepOrder: 'asc' }
        }
      }
    });

    // Update template usage stats
    await prisma.workflowTemplate.update({
      where: { name: templateName },
      data: {
        timesUsed: { increment: 1 }
      }
    });

    console.log(`✅ Workflow created from template: ${template.displayName}`);

    return NextResponse.json({
      success: true,
      workflow,
      message: 'Workflow created from template'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating workflow from template:', error);
    return NextResponse.json(
      { error: 'Error creating workflow from template', details: error.message },
      { status: 500 }
    );
  }
}
