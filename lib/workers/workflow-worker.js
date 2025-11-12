/**
 * Workflow Worker - Processes scheduled workflow steps
 * Handles: step execution, delays, retries, and error handling
 */

import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '../database.js';
import { executeNextStep } from '../workflow-engine.js';

// Redis connection
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

/**
 * Process workflow step execution job
 * @param {Job} job - BullMQ job
 * @returns {Promise<Object>}
 */
async function processWorkflowStepJob(job) {
  const { data } = job;

  console.log(`⚙️ Processing workflow step job ${job.id} for execution: ${data.executionId}`);

  // Update progress
  await job.updateProgress(10);

  // Get the step execution
  const stepExecution = await prisma.stepExecution.findUnique({
    where: { id: data.stepExecutionId },
    include: {
      step: true,
      execution: {
        include: { workflow: true }
      }
    }
  });

  if (!stepExecution) {
    throw new Error(`Step execution not found: ${data.stepExecutionId}`);
  }

  // Check if step is scheduled for future
  if (stepExecution.scheduledFor && stepExecution.scheduledFor > new Date()) {
    console.log(`⏳ Step scheduled for ${stepExecution.scheduledFor}, skipping for now`);
    return {
      success: true,
      scheduled: true,
      scheduledFor: stepExecution.scheduledFor
    };
  }

  // Update progress
  await job.updateProgress(50);

  // Execute the next step in the workflow
  const hasMoreSteps = await executeNextStep(stepExecution.executionId);

  // Update progress
  await job.updateProgress(100);

  return {
    success: true,
    executionId: stepExecution.executionId,
    stepId: stepExecution.stepId,
    hasMoreSteps,
    message: hasMoreSteps ? 'Step executed, more steps pending' : 'Workflow completed'
  };
}

/**
 * Process workflow trigger job (auto-start workflows)
 * @param {Job} job - BullMQ job
 * @returns {Promise<Object>}
 */
async function processWorkflowTriggerJob(job) {
  const { data } = job;

  console.log(`🔔 Processing workflow trigger job ${job.id} for event: ${data.triggerType}`);

  const { triggerType, leadId, eventData } = data;

  // Find workflows that match this trigger
  const workflows = await prisma.workflow.findMany({
    where: {
      status: 'active',
      triggerType: triggerType,
      OR: [
        { targetSegment: eventData.segment },
        { targetSegment: 'all' },
        { targetSegment: null }
      ]
    }
  });

  console.log(`Found ${workflows.length} workflows matching trigger: ${triggerType}`);

  const startedExecutions = [];

  for (const workflow of workflows) {
    // Check if workflow already running for this lead
    const existingExecution = await prisma.workflowExecution.findFirst({
      where: {
        workflowId: workflow.id,
        leadId: leadId,
        status: { in: ['active', 'paused'] }
      }
    });

    if (existingExecution) {
      console.log(`⚠️ Workflow ${workflow.name} already running for lead ${leadId}`);
      continue;
    }

    // Check trigger conditions
    const triggerConfig = workflow.triggerConfig || {};
    if (triggerConfig.autoStart === false) {
      console.log(`⚠️ Workflow ${workflow.name} requires manual start`);
      continue;
    }

    // Start the workflow
    try {
      const { startWorkflowExecution } = await import('../workflow-engine.js');
      const execution = await startWorkflowExecution(workflow.id, leadId, eventData);
      startedExecutions.push(execution.id);
      console.log(`✅ Started workflow: ${workflow.name} for lead ${leadId}`);
    } catch (error) {
      console.error(`❌ Failed to start workflow ${workflow.name}:`, error);
    }
  }

  return {
    success: true,
    triggerType,
    leadId,
    workflowsMatched: workflows.length,
    executionsStarted: startedExecutions.length,
    executionIds: startedExecutions
  };
}

// Create workflow step worker
const workflowStepWorker = new Worker(
  'workflow-step-queue',
  async (job) => {
    try {
      const result = await processWorkflowStepJob(job);
      return result;
    } catch (error) {
      console.error(`❌ Error processing workflow step job ${job.id}:`, error);
      throw error; // Will trigger retry
    }
  },
  {
    connection,
    concurrency: 5, // Process up to 5 workflow steps concurrently
    limiter: {
      max: 10, // Maximum 10 jobs
      duration: 1000, // per 1 second
    },
  }
);

// Create workflow trigger worker
const workflowTriggerWorker = new Worker(
  'workflow-trigger-queue',
  async (job) => {
    try {
      const result = await processWorkflowTriggerJob(job);
      return result;
    } catch (error) {
      console.error(`❌ Error processing workflow trigger job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection,
    concurrency: 3, // Process up to 3 triggers concurrently
  }
);

// Worker event listeners - Step Worker
workflowStepWorker.on('completed', (job, result) => {
  console.log(`✅ Workflow step job ${job.id} completed:`, result);
});

workflowStepWorker.on('failed', (job, error) => {
  console.error(`❌ Workflow step job ${job.id} failed:`, error.message);
});

workflowStepWorker.on('progress', (job, progress) => {
  console.log(`⏳ Workflow step job ${job.id} progress: ${progress}%`);
});

workflowStepWorker.on('error', (error) => {
  console.error('❌ Workflow step worker error:', error);
});

// Worker event listeners - Trigger Worker
workflowTriggerWorker.on('completed', (job, result) => {
  console.log(`✅ Workflow trigger job ${job.id} completed:`, result);
});

workflowTriggerWorker.on('failed', (job, error) => {
  console.error(`❌ Workflow trigger job ${job.id} failed:`, error.message);
});

workflowTriggerWorker.on('error', (error) => {
  console.error('❌ Workflow trigger worker error:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('⚙️ Shutting down workflow workers...');
  await workflowStepWorker.close();
  await workflowTriggerWorker.close();
  await connection.quit();
});

console.log('⚙️ Workflow workers started and listening for jobs...');

export { workflowStepWorker, workflowTriggerWorker };
