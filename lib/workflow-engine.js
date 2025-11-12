/**
 * Workflow Execution Engine
 *
 * Handles the execution of multi-step automated workflows for lead nurturing.
 * Supports email sequences, conditional branching, delays, and actions.
 */

import { prisma } from './database.js';
import { scheduleEmail, sendEmailNow } from './queue.js';
import { enrichLeadWithGovernmentData } from './enrichment-engine-v2.js';

/**
 * Start a workflow execution for a lead
 * @param {string} workflowId - Workflow ID
 * @param {string} leadId - Lead ID
 * @param {Object} initialContext - Initial context data
 * @returns {Promise<Object>} Workflow execution
 */
export async function startWorkflowExecution(workflowId, leadId, initialContext = {}) {
  console.log(`🚀 Starting workflow ${workflowId} for lead ${leadId}`);

  // Get workflow with steps
  const workflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    include: { steps: { orderBy: { stepOrder: 'asc' } } }
  });

  if (!workflow) {
    throw new Error(`Workflow not found: ${workflowId}`);
  }

  if (workflow.status !== 'active') {
    throw new Error(`Workflow is not active: ${workflow.status}`);
  }

  // Get lead info
  const lead = await prisma.hotLead.findUnique({
    where: { id: leadId }
  });

  if (!lead) {
    throw new Error(`Lead not found: ${leadId}`);
  }

  // Check if workflow already running for this lead
  const existingExecution = await prisma.workflowExecution.findFirst({
    where: {
      workflowId,
      leadId,
      status: { in: ['active', 'paused'] }
    }
  });

  if (existingExecution) {
    console.log(`⚠️ Workflow already running for lead ${leadId}`);
    return existingExecution;
  }

  // Create workflow execution
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      leadId,
      leadName: lead.companyName,
      status: 'active',
      totalSteps: workflow.steps.length,
      currentStepOrder: 0,
      context: initialContext
    }
  });

  // Update workflow stats
  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      totalExecutions: { increment: 1 },
      activeExecutions: { increment: 1 }
    }
  });

  // Create step executions for all steps
  for (const step of workflow.steps) {
    await prisma.stepExecution.create({
      data: {
        executionId: execution.id,
        stepId: step.id,
        status: step.stepOrder === 0 ? 'pending' : 'pending'
      }
    });
  }

  // Execute first step immediately
  await executeNextStep(execution.id);

  console.log(`✅ Workflow execution started: ${execution.id}`);

  return execution;
}

/**
 * Execute the next step in a workflow
 * @param {string} executionId - Execution ID
 * @returns {Promise<boolean>} True if step executed, false if workflow complete
 */
export async function executeNextStep(executionId) {
  console.log(`⏭️ Executing next step for execution ${executionId}`);

  // Get execution with current step
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      workflow: {
        include: { steps: { orderBy: { stepOrder: 'asc' } } }
      },
      stepExecutions: {
        include: { step: true },
        orderBy: { step: { stepOrder: 'asc' } }
      }
    }
  });

  if (!execution) {
    throw new Error(`Execution not found: ${executionId}`);
  }

  if (execution.status !== 'active') {
    console.log(`⚠️ Execution not active: ${execution.status}`);
    return false;
  }

  // Find next pending step
  const nextStepExecution = execution.stepExecutions.find(
    se => se.status === 'pending' && se.step.stepOrder === execution.currentStepOrder
  );

  if (!nextStepExecution) {
    // No more pending steps - workflow complete
    await completeWorkflow(executionId);
    return false;
  }

  // Execute the step
  await executeStep(nextStepExecution.id);

  return true;
}

/**
 * Execute a specific step
 * @param {string} stepExecutionId - Step execution ID
 */
export async function executeStep(stepExecutionId) {
  console.log(`▶️ Executing step ${stepExecutionId}`);

  const stepExecution = await prisma.stepExecution.findUnique({
    where: { id: stepExecutionId },
    include: {
      step: true,
      execution: {
        include: { workflow: true }
      }
    }
  });

  if (!stepExecution) {
    throw new Error(`Step execution not found: ${stepExecutionId}`);
  }

  try {
    // Mark as running
    await prisma.stepExecution.update({
      where: { id: stepExecutionId },
      data: {
        status: 'running',
        startedAt: new Date()
      }
    });

    // Execute based on step type
    let result;
    switch (stepExecution.step.stepType) {
      case 'email':
        result = await executeEmailStep(stepExecution);
        break;
      case 'wait':
        result = await executeWaitStep(stepExecution);
        break;
      case 'condition':
        result = await executeConditionStep(stepExecution);
        break;
      case 'action':
        result = await executeActionStep(stepExecution);
        break;
      default:
        throw new Error(`Unknown step type: ${stepExecution.step.stepType}`);
    }

    // Mark step as completed
    await prisma.stepExecution.update({
      where: { id: stepExecutionId },
      data: {
        status: 'completed',
        completedAt: new Date(),
        result
      }
    });

    // Update execution progress
    await prisma.workflowExecution.update({
      where: { id: stepExecution.executionId },
      data: {
        completedSteps: { increment: 1 },
        currentStepOrder: { increment: 1 }
      }
    });

    console.log(`✅ Step completed: ${stepExecution.step.name}`);

    // If not a wait step, execute next step immediately
    if (stepExecution.step.stepType !== 'wait') {
      setImmediate(() => executeNextStep(stepExecution.executionId));
    }

  } catch (error) {
    console.error(`❌ Step execution failed:`, error);

    // Check retry count
    if (stepExecution.retryCount < stepExecution.maxRetries) {
      await prisma.stepExecution.update({
        where: { id: stepExecutionId },
        data: {
          status: 'pending',
          retryCount: { increment: 1 },
          error: error.message
        }
      });

      console.log(`🔄 Retrying step (attempt ${stepExecution.retryCount + 1}/${stepExecution.maxRetries})`);

      // Retry after a delay
      setTimeout(() => executeStep(stepExecutionId), 5000);
    } else {
      // Max retries reached - mark as failed
      await prisma.stepExecution.update({
        where: { id: stepExecutionId },
        data: {
          status: 'failed',
          error: error.message,
          completedAt: new Date()
        }
      });

      await prisma.workflowExecution.update({
        where: { id: stepExecution.executionId },
        data: {
          failedSteps: { increment: 1 }
        }
      });

      // Continue to next step despite failure
      setImmediate(() => executeNextStep(stepExecution.executionId));
    }
  }
}

/**
 * Execute an email step
 * @param {Object} stepExecution - Step execution with relations
 * @returns {Promise<Object>} Result
 */
async function executeEmailStep(stepExecution) {
  console.log(`📧 Executing email step: ${stepExecution.step.name}`);

  const config = stepExecution.step.config;
  const execution = stepExecution.execution;

  // Get lead info
  const lead = await prisma.hotLead.findUnique({
    where: { id: execution.leadId }
  });

  if (!lead.email) {
    throw new Error('Lead has no email address');
  }

  // Prepare email data
  const emailData = {
    to: lead.email,
    subject: interpolateTemplate(config.subject, { lead, execution }),
    html: interpolateTemplate(config.content, { lead, execution }),
    leadId: lead.id,
    leadName: lead.companyName,
    campaignId: execution.workflowId,
    segment: lead.source || 'workflow'
  };

  // Send email (or schedule if specified)
  let job;
  if (config.sendAt) {
    const sendAt = new Date(config.sendAt);
    job = await scheduleEmail(emailData, sendAt);
  } else {
    job = await sendEmailNow(emailData);
  }

  // Update execution metrics
  await prisma.workflowExecution.update({
    where: { id: execution.id },
    data: {
      emailsSent: { increment: 1 }
    }
  });

  return {
    jobId: job.id,
    emailTo: lead.email,
    subject: emailData.subject,
    sentAt: new Date().toISOString()
  };
}

/**
 * Execute a wait step
 * @param {Object} stepExecution - Step execution with relations
 * @returns {Promise<Object>} Result
 */
async function executeWaitStep(stepExecution) {
  console.log(`⏱️ Executing wait step: ${stepExecution.step.name}`);

  const config = stepExecution.step.config;
  const { delay, unit } = config;

  // Calculate wait time in milliseconds
  let waitMs;
  switch (unit) {
    case 'minutes':
      waitMs = delay * 60 * 1000;
      break;
    case 'hours':
      waitMs = delay * 60 * 60 * 1000;
      break;
    case 'days':
      waitMs = delay * 24 * 60 * 60 * 1000;
      break;
    case 'weeks':
      waitMs = delay * 7 * 24 * 60 * 60 * 1000;
      break;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }

  const scheduledFor = new Date(Date.now() + waitMs);

  // Schedule next step execution
  await prisma.stepExecution.update({
    where: { id: stepExecution.id },
    data: {
      scheduledFor
    }
  });

  // Schedule execution of next step (in production, use BullMQ delayed job)
  setTimeout(() => {
    executeNextStep(stepExecution.executionId);
  }, waitMs);

  return {
    delayMs: waitMs,
    scheduledFor: scheduledFor.toISOString(),
    message: `Waiting ${delay} ${unit}`
  };
}

/**
 * Execute a condition step (branching logic)
 * @param {Object} stepExecution - Step execution with relations
 * @returns {Promise<Object>} Result
 */
async function executeConditionStep(stepExecution) {
  console.log(`🔀 Executing condition step: ${stepExecution.step.name}`);

  const config = stepExecution.step.config;
  const execution = stepExecution.execution;

  // Get lead info
  const lead = await prisma.hotLead.findUnique({
    where: { id: execution.leadId },
    include: {
      managers: true,
      services: true,
      specialties: true
    }
  });

  // Evaluate condition
  const conditionMet = evaluateCondition(config, { lead, execution });

  console.log(`Condition "${config.field} ${config.operator} ${config.value}": ${conditionMet ? 'TRUE' : 'FALSE'}`);

  // Update context with condition result
  await prisma.workflowExecution.update({
    where: { id: execution.id },
    data: {
      context: {
        ...(execution.context || {}),
        [`condition_${stepExecution.step.id}`]: conditionMet
      }
    }
  });

  return {
    conditionMet,
    field: config.field,
    operator: config.operator,
    value: config.value
  };
}

/**
 * Execute an action step
 * @param {Object} stepExecution - Step execution with relations
 * @returns {Promise<Object>} Result
 */
async function executeActionStep(stepExecution) {
  console.log(`⚡ Executing action step: ${stepExecution.step.name}`);

  const config = stepExecution.step.config;
  const execution = stepExecution.execution;

  let result;

  switch (config.actionType) {
    case 'enrich_lead':
      result = await enrichLeadAction(execution.leadId);
      break;
    case 'update_priority':
      result = await updateLeadPriority(execution.leadId, config.priority);
      break;
    case 'add_tag':
      result = await addLeadTag(execution.leadId, config.tag);
      break;
    case 'create_task':
      result = await createLeadTask(execution.leadId, config.task);
      break;
    default:
      throw new Error(`Unknown action type: ${config.actionType}`);
  }

  return result;
}

/**
 * Enrich lead action
 */
async function enrichLeadAction(leadId) {
  const lead = await prisma.hotLead.findUnique({ where: { id: leadId } });

  if (lead.enrichmentStatus === 'enriched') {
    return { message: 'Lead already enriched', skipped: true };
  }

  const enrichmentResult = await enrichLeadWithGovernmentData({ id: leadId, companyName: lead.companyName });

  return {
    enriched: enrichmentResult.success,
    confidence: enrichmentResult.confidence,
    sources: enrichmentResult.sources
  };
}

/**
 * Update lead priority action
 */
async function updateLeadPriority(leadId, priority) {
  await prisma.hotLead.update({
    where: { id: leadId },
    data: { priority }
  });

  return { priority, updated: true };
}

/**
 * Add tag to lead (stored in context for now)
 */
async function addLeadTag(leadId, tag) {
  // In a full implementation, you'd have a tags table
  return { tag, added: true };
}

/**
 * Create task for lead
 */
async function createLeadTask(leadId, taskConfig) {
  await prisma.leadAction.create({
    data: {
      hotLeadId: leadId,
      action: taskConfig.action,
      priority: taskConfig.priority || 'MOYENNE',
      deadline: taskConfig.deadline,
      status: 'pending',
      assignedTo: taskConfig.assignedTo || 'Nicolas BAYONNE'
    }
  });

  return { task: taskConfig.action, created: true };
}

/**
 * Evaluate a condition
 * @param {Object} config - Condition configuration
 * @param {Object} context - Evaluation context
 * @returns {boolean} Condition result
 */
function evaluateCondition(config, context) {
  const { field, operator, value } = config;
  const { lead, execution } = context;

  // Get field value from lead or execution context
  let fieldValue;
  if (field.startsWith('lead.')) {
    const fieldPath = field.replace('lead.', '').split('.');
    fieldValue = fieldPath.reduce((obj, key) => obj?.[key], lead);
  } else if (field.startsWith('context.')) {
    const fieldPath = field.replace('context.', '').split('.');
    fieldValue = fieldPath.reduce((obj, key) => obj?.[key], execution.context);
  } else {
    fieldValue = lead[field];
  }

  // Evaluate based on operator
  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'contains':
      return String(fieldValue).includes(value);
    case 'not_contains':
      return !String(fieldValue).includes(value);
    case 'greater_than':
      return Number(fieldValue) > Number(value);
    case 'less_than':
      return Number(fieldValue) < Number(value);
    case 'is_empty':
      return !fieldValue || fieldValue === '';
    case 'is_not_empty':
      return !!fieldValue && fieldValue !== '';
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue);
    case 'not_in':
      return Array.isArray(value) && !value.includes(fieldValue);
    default:
      console.warn(`Unknown operator: ${operator}`);
      return false;
  }
}

/**
 * Interpolate template variables
 * @param {string} template - Template string with {{variables}}
 * @param {Object} context - Context data
 * @returns {string} Interpolated string
 */
function interpolateTemplate(template, context) {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const keys = path.trim().split('.');
    let value = context;

    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }

    return value !== undefined ? value : match;
  });
}

/**
 * Complete a workflow execution
 * @param {string} executionId - Execution ID
 */
async function completeWorkflow(executionId) {
  console.log(`🏁 Completing workflow execution ${executionId}`);

  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true }
  });

  // Update execution status
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: 'completed',
      completedAt: new Date()
    }
  });

  // Update workflow stats
  await prisma.workflow.update({
    where: { id: execution.workflowId },
    data: {
      activeExecutions: { decrement: 1 },
      completedExecutions: { increment: 1 }
    }
  });

  console.log(`✅ Workflow completed: ${execution.workflow.name}`);
}

/**
 * Pause a workflow execution
 * @param {string} executionId - Execution ID
 */
export async function pauseWorkflowExecution(executionId) {
  console.log(`⏸️ Pausing workflow execution ${executionId}`);

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: 'paused',
      pausedAt: new Date()
    }
  });
}

/**
 * Resume a paused workflow execution
 * @param {string} executionId - Execution ID
 */
export async function resumeWorkflowExecution(executionId) {
  console.log(`▶️ Resuming workflow execution ${executionId}`);

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: 'active',
      pausedAt: null
    }
  });

  // Resume execution
  await executeNextStep(executionId);
}

/**
 * Cancel a workflow execution
 * @param {string} executionId - Execution ID
 */
export async function cancelWorkflowExecution(executionId) {
  console.log(`🛑 Cancelling workflow execution ${executionId}`);

  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId }
  });

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: 'cancelled',
      completedAt: new Date()
    }
  });

  // Update workflow stats
  await prisma.workflow.update({
    where: { id: execution.workflowId },
    data: {
      activeExecutions: { decrement: 1 }
    }
  });
}

/**
 * Get workflow execution status
 * @param {string} executionId - Execution ID
 * @returns {Promise<Object>} Execution status
 */
export async function getWorkflowExecutionStatus(executionId) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      workflow: true,
      stepExecutions: {
        include: { step: true },
        orderBy: { step: { stepOrder: 'asc' } }
      }
    }
  });

  if (!execution) {
    throw new Error(`Execution not found: ${executionId}`);
  }

  return {
    id: execution.id,
    workflow: execution.workflow.name,
    lead: execution.leadName,
    status: execution.status,
    progress: {
      total: execution.totalSteps,
      completed: execution.completedSteps,
      failed: execution.failedSteps,
      percentage: Math.round((execution.completedSteps / execution.totalSteps) * 100)
    },
    metrics: {
      emailsSent: execution.emailsSent,
      emailsOpened: execution.emailsOpened,
      emailsClicked: execution.emailsClicked,
      emailsReplied: execution.emailsReplied
    },
    timing: {
      startedAt: execution.startedAt,
      completedAt: execution.completedAt,
      duration: execution.completedAt
        ? Math.round((execution.completedAt - execution.startedAt) / 1000)
        : Math.round((Date.now() - execution.startedAt) / 1000)
    },
    steps: execution.stepExecutions.map(se => ({
      name: se.step.name,
      type: se.step.stepType,
      status: se.status,
      result: se.result,
      error: se.error
    }))
  };
}
