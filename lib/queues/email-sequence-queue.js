/**
 * Email Sequence Queue
 * Handles multi-touch email sequence automation
 */

import { Queue } from 'bullmq';
import { defaultQueueOptions } from '../bullmq-config.js';

export const emailSequenceQueue = new Queue('email-sequences', defaultQueueOptions);

/**
 * Enroll a lead in an email sequence
 */
export async function enrollLeadInSequence(leadId, sequenceId) {
  const job = await emailSequenceQueue.add('enroll-lead', {
    leadId,
    sequenceId,
    enrolledAt: new Date().toISOString(),
  });

  return job;
}

/**
 * Process next step in sequence for a lead
 */
export async function processSequenceStep(enrollmentId, stepNumber) {
  const job = await emailSequenceQueue.add('process-step', {
    enrollmentId,
    stepNumber,
  }, {
    priority: 1, // Higher priority for immediate steps
  });

  return job;
}

/**
 * Schedule next step in sequence
 */
export async function scheduleNextStep(enrollmentId, stepNumber, delayMs) {
  const job = await emailSequenceQueue.add('process-step', {
    enrollmentId,
    stepNumber,
  }, {
    delay: delayMs,
  });

  return job;
}

/**
 * Exit a lead from a sequence
 */
export async function exitLeadFromSequence(enrollmentId, reason) {
  const job = await emailSequenceQueue.add('exit-lead', {
    enrollmentId,
    reason,
    exitedAt: new Date().toISOString(),
  }, {
    priority: 2, // High priority to stop sending
  });

  return job;
}

/**
 * Process all due sequence steps (run hourly via cron)
 */
export async function processDueSteps() {
  const job = await emailSequenceQueue.add('process-due-steps', {
    processedAt: new Date().toISOString(),
  });

  return job;
}
