import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import { startWorkflowExecution } from '@/lib/workflow-engine';

/**
 * API pour gérer les workflows
 */

// GET /api/workflows - List all workflows
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // active, paused, archived
    const category = searchParams.get('category');

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const workflows = await prisma.workflow.findMany({
      where,
      include: {
        steps: {
          orderBy: { stepOrder: 'asc' }
        },
        _count: {
          select: {
            executions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      workflows
    });

  } catch (error) {
    console.error('❌ Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Error fetching workflows', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/workflows - Create a new workflow
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      category,
      triggerType,
      triggerConfig,
      targetSegment,
      targetPriority,
      steps
    } = body;

    // Validation
    if (!name || !category || !triggerType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, triggerType' },
        { status: 400 }
      );
    }

    if (!steps || steps.length === 0) {
      return NextResponse.json(
        { error: 'Workflow must have at least one step' },
        { status: 400 }
      );
    }

    // Create workflow with steps
    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        category,
        status: 'active',
        triggerType,
        triggerConfig: triggerConfig || {},
        targetSegment,
        targetPriority,
        steps: {
          create: steps.map((step, index) => ({
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

    console.log(`✅ Workflow created: ${workflow.name} with ${steps.length} steps`);

    return NextResponse.json({
      success: true,
      workflow,
      message: 'Workflow created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Error creating workflow', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/workflows - Update a workflow
export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      status,
      triggerConfig,
      targetSegment,
      targetPriority
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID required' },
        { status: 400 }
      );
    }

    const workflow = await prisma.workflow.update({
      where: { id },
      data: {
        name,
        description,
        status,
        triggerConfig,
        targetSegment,
        targetPriority
      },
      include: {
        steps: {
          orderBy: { stepOrder: 'asc' }
        }
      }
    });

    console.log(`✅ Workflow updated: ${workflow.name}`);

    return NextResponse.json({
      success: true,
      workflow,
      message: 'Workflow updated successfully'
    });

  } catch (error) {
    console.error('❌ Error updating workflow:', error);
    return NextResponse.json(
      { error: 'Error updating workflow', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/workflows?id=xxx - Delete a workflow
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Workflow ID required' },
        { status: 400 }
      );
    }

    await prisma.workflow.delete({
      where: { id }
    });

    console.log(`✅ Workflow deleted: ${id}`);

    return NextResponse.json({
      success: true,
      message: 'Workflow deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting workflow:', error);
    return NextResponse.json(
      { error: 'Error deleting workflow', details: error.message },
      { status: 500 }
    );
  }
}
