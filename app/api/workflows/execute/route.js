import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';
import {
  startWorkflowExecution,
  pauseWorkflowExecution,
  resumeWorkflowExecution,
  cancelWorkflowExecution,
  getWorkflowExecutionStatus
} from '@/lib/workflow-engine';

/**
 * API pour exécuter et contrôler les workflows
 */

// POST /api/workflows/execute - Start a workflow execution for a lead
export async function POST(request) {
  try {
    const body = await request.json();
    const { workflowId, leadId, context } = body;

    // Validation
    if (!workflowId || !leadId) {
      return NextResponse.json(
        { error: 'workflowId and leadId are required' },
        { status: 400 }
      );
    }

    console.log(`🚀 Starting workflow ${workflowId} for lead ${leadId}`);

    // Start execution
    const execution = await startWorkflowExecution(workflowId, leadId, context || {});

    return NextResponse.json({
      success: true,
      execution: {
        id: execution.id,
        workflowId: execution.workflowId,
        leadId: execution.leadId,
        leadName: execution.leadName,
        status: execution.status,
        startedAt: execution.startedAt
      },
      message: 'Workflow execution started'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error starting workflow execution:', error);
    return NextResponse.json(
      { error: 'Error starting workflow execution', details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/workflows/execute?executionId=xxx - Get execution status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const executionId = searchParams.get('executionId');
    const leadId = searchParams.get('leadId');
    const workflowId = searchParams.get('workflowId');

    // Get specific execution status
    if (executionId) {
      const status = await getWorkflowExecutionStatus(executionId);
      return NextResponse.json({
        success: true,
        execution: status
      });
    }

    // List executions
    const where = {};
    if (leadId) where.leadId = leadId;
    if (workflowId) where.workflowId = workflowId;

    const executions = await prisma.workflowExecution.findMany({
      where,
      include: {
        workflow: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({
      success: true,
      executions
    });

  } catch (error) {
    console.error('❌ Error fetching execution status:', error);
    return NextResponse.json(
      { error: 'Error fetching execution status', details: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/workflows/execute - Control execution (pause, resume, cancel)
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { executionId, action } = body;

    if (!executionId || !action) {
      return NextResponse.json(
        { error: 'executionId and action are required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'pause':
        await pauseWorkflowExecution(executionId);
        result = { message: 'Workflow execution paused' };
        break;

      case 'resume':
        await resumeWorkflowExecution(executionId);
        result = { message: 'Workflow execution resumed' };
        break;

      case 'cancel':
        await cancelWorkflowExecution(executionId);
        result = { message: 'Workflow execution cancelled' };
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    console.log(`✅ Workflow execution ${action}: ${executionId}`);

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('❌ Error controlling workflow execution:', error);
    return NextResponse.json(
      { error: 'Error controlling workflow execution', details: error.message },
      { status: 500 }
    );
  }
}
