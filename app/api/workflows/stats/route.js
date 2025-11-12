import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

/**
 * API pour obtenir les statistiques et métriques des workflows
 */

// GET /api/workflows/stats - Get comprehensive workflow statistics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const workflowId = searchParams.get('workflowId');

    const since = new Date();
    since.setDate(since.getDate() - days);

    // Overall workflow statistics
    const totalWorkflows = await prisma.workflow.count();
    const activeWorkflows = await prisma.workflow.count({
      where: { status: 'active' }
    });

    // Execution statistics
    const totalExecutions = await prisma.workflowExecution.count({
      where: {
        createdAt: { gte: since },
        ...(workflowId && { workflowId })
      }
    });

    const activeExecutions = await prisma.workflowExecution.count({
      where: {
        status: 'active',
        createdAt: { gte: since },
        ...(workflowId && { workflowId })
      }
    });

    const completedExecutions = await prisma.workflowExecution.count({
      where: {
        status: 'completed',
        createdAt: { gte: since },
        ...(workflowId && { workflowId })
      }
    });

    const failedExecutions = await prisma.workflowExecution.count({
      where: {
        status: 'failed',
        createdAt: { gte: since },
        ...(workflowId && { workflowId })
      }
    });

    // Email metrics from workflow executions
    const executions = await prisma.workflowExecution.findMany({
      where: {
        createdAt: { gte: since },
        ...(workflowId && { workflowId })
      },
      select: {
        emailsSent: true,
        emailsOpened: true,
        emailsClicked: true,
        emailsReplied: true
      }
    });

    const emailMetrics = executions.reduce((acc, exec) => ({
      sent: acc.sent + exec.emailsSent,
      opened: acc.opened + exec.emailsOpened,
      clicked: acc.clicked + exec.emailsClicked,
      replied: acc.replied + exec.emailsReplied
    }), { sent: 0, opened: 0, clicked: 0, replied: 0 });

    // Calculate rates
    const openRate = emailMetrics.sent > 0
      ? ((emailMetrics.opened / emailMetrics.sent) * 100).toFixed(2)
      : '0.00';
    const clickRate = emailMetrics.opened > 0
      ? ((emailMetrics.clicked / emailMetrics.opened) * 100).toFixed(2)
      : '0.00';
    const replyRate = emailMetrics.sent > 0
      ? ((emailMetrics.replied / emailMetrics.sent) * 100).toFixed(2)
      : '0.00';

    // Top performing workflows
    const topWorkflows = await prisma.workflow.findMany({
      where: {
        totalExecutions: { gt: 0 }
      },
      select: {
        id: true,
        name: true,
        category: true,
        totalExecutions: true,
        completedExecutions: true,
        successRate: true
      },
      orderBy: {
        successRate: 'desc'
      },
      take: 10
    });

    // Recent executions
    const recentExecutions = await prisma.workflowExecution.findMany({
      where: {
        createdAt: { gte: since },
        ...(workflowId && { workflowId })
      },
      include: {
        workflow: {
          select: {
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    // Execution timeline (daily breakdown)
    const timeline = await getExecutionTimeline(since, workflowId);

    // Step performance
    const stepPerformance = await getStepPerformance(since, workflowId);

    return NextResponse.json({
      success: true,
      period: {
        days,
        since: since.toISOString()
      },
      overview: {
        workflows: {
          total: totalWorkflows,
          active: activeWorkflows,
          paused: totalWorkflows - activeWorkflows
        },
        executions: {
          total: totalExecutions,
          active: activeExecutions,
          completed: completedExecutions,
          failed: failedExecutions,
          completionRate: totalExecutions > 0
            ? ((completedExecutions / totalExecutions) * 100).toFixed(2)
            : '0.00'
        },
        emails: {
          sent: emailMetrics.sent,
          opened: emailMetrics.opened,
          clicked: emailMetrics.clicked,
          replied: emailMetrics.replied,
          openRate: `${openRate}%`,
          clickRate: `${clickRate}%`,
          replyRate: `${replyRate}%`
        }
      },
      topWorkflows,
      recentExecutions,
      timeline,
      stepPerformance
    });

  } catch (error) {
    console.error('❌ Error fetching workflow stats:', error);
    return NextResponse.json(
      { error: 'Error fetching workflow stats', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Get execution timeline (daily breakdown)
 */
async function getExecutionTimeline(since, workflowId) {
  const executions = await prisma.workflowExecution.findMany({
    where: {
      createdAt: { gte: since },
      ...(workflowId && { workflowId })
    },
    select: {
      createdAt: true,
      status: true,
      emailsSent: true
    }
  });

  // Group by date
  const timeline = {};
  executions.forEach(exec => {
    const date = exec.createdAt.toISOString().split('T')[0];
    if (!timeline[date]) {
      timeline[date] = {
        date,
        started: 0,
        completed: 0,
        failed: 0,
        emailsSent: 0
      };
    }
    timeline[date].started++;
    if (exec.status === 'completed') timeline[date].completed++;
    if (exec.status === 'failed') timeline[date].failed++;
    timeline[date].emailsSent += exec.emailsSent;
  });

  return Object.values(timeline).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Get step performance metrics
 */
async function getStepPerformance(since, workflowId) {
  const stepExecutions = await prisma.stepExecution.findMany({
    where: {
      createdAt: { gte: since },
      ...(workflowId && {
        execution: { workflowId }
      })
    },
    include: {
      step: {
        select: {
          name: true,
          stepType: true
        }
      }
    }
  });

  // Group by step type
  const performance = {};
  stepExecutions.forEach(se => {
    const type = se.step.stepType;
    if (!performance[type]) {
      performance[type] = {
        type,
        total: 0,
        completed: 0,
        failed: 0,
        avgDuration: 0,
        durations: []
      };
    }
    performance[type].total++;
    if (se.status === 'completed') performance[type].completed++;
    if (se.status === 'failed') performance[type].failed++;

    if (se.startedAt && se.completedAt) {
      const duration = (se.completedAt - se.startedAt) / 1000; // seconds
      performance[type].durations.push(duration);
    }
  });

  // Calculate average durations
  Object.values(performance).forEach(perf => {
    if (perf.durations.length > 0) {
      perf.avgDuration = Math.round(
        perf.durations.reduce((a, b) => a + b, 0) / perf.durations.length
      );
    }
    delete perf.durations; // Remove raw data
    perf.successRate = perf.total > 0
      ? ((perf.completed / perf.total) * 100).toFixed(2)
      : '0.00';
  });

  return Object.values(performance);
}
