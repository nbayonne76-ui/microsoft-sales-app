/**
 * Job Queue System using BullMQ
 * Persistent, reliable job scheduling with retry logic
 */

import { Queue, Worker, QueueEvents } from 'bullmq';
import Redis from 'ioredis';

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Required for BullMQ
  enableReadyCheck: false,
};

// Create Redis connection
const connection = new Redis(redisConfig);

// Email Queue for scheduled and batch emails
export const emailQueue = new Queue('email-queue', {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times
    backoff: {
      type: 'exponential',
      delay: 5000, // Start with 5 seconds, doubles each retry
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000, // Keep last 1000 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
});

// Lead Enrichment Queue
export const enrichmentQueue = new Queue('enrichment-queue', {
  connection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 10000, // 10 seconds between retries
    },
  },
});

// Analytics Processing Queue
export const analyticsQueue = new Queue('analytics-queue', {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Queue Events for monitoring
export const emailQueueEvents = new QueueEvents('email-queue', { connection });
export const enrichmentQueueEvents = new QueueEvents('enrichment-queue', { connection });
export const analyticsQueueEvents = new QueueEvents('analytics-queue', { connection });

/**
 * Schedule an email to be sent at a specific time
 * @param {Object} emailData - Email details
 * @param {Date} sendAt - When to send the email
 * @returns {Promise<Job>}
 */
export async function scheduleEmail(emailData, sendAt) {
  const delay = sendAt.getTime() - Date.now();

  if (delay < 0) {
    throw new Error('Cannot schedule email in the past');
  }

  return await emailQueue.add(
    'send-scheduled-email',
    emailData,
    {
      delay,
      jobId: `email-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    }
  );
}

/**
 * Send an email immediately (with retry logic)
 * @param {Object} emailData - Email details
 * @returns {Promise<Job>}
 */
export async function sendEmailNow(emailData) {
  return await emailQueue.add('send-email-now', emailData, {
    priority: 1, // High priority for immediate sends
  });
}

/**
 * Schedule batch email campaign
 * @param {Array} emails - Array of email data
 * @param {Object} options - Campaign options
 * @returns {Promise<Job[]>}
 */
export async function scheduleCampaign(emails, options = {}) {
  const jobs = emails.map((emailData, index) => ({
    name: 'send-campaign-email',
    data: {
      ...emailData,
      campaignId: options.campaignId,
      batchIndex: index,
    },
    opts: {
      delay: options.delayBetweenEmails ? index * options.delayBetweenEmails : 0,
      priority: 2, // Medium priority
    },
  }));

  return await emailQueue.addBulk(jobs);
}

/**
 * Enrich a lead with external data
 * @param {Object} leadData - Lead information
 * @returns {Promise<Job>}
 */
export async function enrichLead(leadData) {
  return await enrichmentQueue.add('enrich-lead', leadData, {
    jobId: `enrich-${leadData.id || leadData.email}`,
  });
}

/**
 * Batch enrich multiple leads
 * @param {Array} leads - Array of lead data
 * @returns {Promise<Job[]>}
 */
export async function batchEnrichLeads(leads) {
  const jobs = leads.map((lead, index) => ({
    name: 'enrich-lead',
    data: lead,
    opts: {
      delay: index * 1000, // 1 second between enrichment calls to avoid rate limiting
      jobId: `enrich-${lead.id || lead.email}`,
    },
  }));

  return await enrichmentQueue.addBulk(jobs);
}

/**
 * Track analytics event
 * @param {Object} eventData - Analytics event data
 * @returns {Promise<Job>}
 */
export async function trackAnalyticsEvent(eventData) {
  return await analyticsQueue.add('track-event', eventData, {
    priority: 3, // Low priority
  });
}

/**
 * Get job status by ID
 * @param {string} jobId - Job ID
 * @param {Queue} queue - Queue instance (default: emailQueue)
 * @returns {Promise<Object>}
 */
export async function getJobStatus(jobId, queue = emailQueue) {
  const job = await queue.getJob(jobId);

  if (!job) {
    return { status: 'not_found' };
  }

  const state = await job.getState();
  const progress = job.progress;

  return {
    status: state,
    progress,
    data: job.data,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason,
    finishedOn: job.finishedOn,
    processedOn: job.processedOn,
  };
}

/**
 * Cancel a scheduled job
 * @param {string} jobId - Job ID to cancel
 * @param {Queue} queue - Queue instance
 * @returns {Promise<boolean>}
 */
export async function cancelJob(jobId, queue = emailQueue) {
  const job = await queue.getJob(jobId);

  if (!job) {
    return false;
  }

  const state = await job.getState();

  // Can only cancel jobs that are waiting or delayed
  if (state === 'waiting' || state === 'delayed') {
    await job.remove();
    return true;
  }

  return false;
}

/**
 * Get queue statistics
 * @param {Queue} queue - Queue instance
 * @returns {Promise<Object>}
 */
export async function getQueueStats(queue = emailQueue) {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  };
}

/**
 * Clean old jobs from queue
 * @param {Queue} queue - Queue instance
 * @param {number} grace - Grace period in milliseconds
 * @returns {Promise<void>}
 */
export async function cleanQueue(queue = emailQueue, grace = 24 * 3600 * 1000) {
  await queue.clean(grace, 100, 'completed');
  await queue.clean(grace * 7, 50, 'failed'); // Keep failed jobs longer
}

/**
 * Pause queue processing
 * @param {Queue} queue - Queue instance
 * @returns {Promise<void>}
 */
export async function pauseQueue(queue = emailQueue) {
  await queue.pause();
}

/**
 * Resume queue processing
 * @param {Queue} queue - Queue instance
 * @returns {Promise<void>}
 */
export async function resumeQueue(queue = emailQueue) {
  await queue.resume();
}

/**
 * Get all scheduled emails
 * @returns {Promise<Array>}
 */
export async function getScheduledEmails() {
  const delayedJobs = await emailQueue.getDelayed();

  return delayedJobs.map(job => ({
    id: job.id,
    to: job.data.to,
    subject: job.data.subject,
    scheduledFor: new Date(job.timestamp + job.opts.delay),
    status: 'scheduled',
    attemptsMade: job.attemptsMade,
  }));
}

/**
 * Get failed jobs for retry
 * @param {Queue} queue - Queue instance
 * @param {number} limit - Maximum number of jobs to retrieve
 * @returns {Promise<Array>}
 */
export async function getFailedJobs(queue = emailQueue, limit = 50) {
  const failedJobs = await queue.getFailed(0, limit);

  return failedJobs.map(job => ({
    id: job.id,
    data: job.data,
    failedReason: job.failedReason,
    attemptsMade: job.attemptsMade,
    failedAt: job.failedOn,
  }));
}

/**
 * Retry a failed job
 * @param {string} jobId - Job ID to retry
 * @param {Queue} queue - Queue instance
 * @returns {Promise<boolean>}
 */
export async function retryFailedJob(jobId, queue = emailQueue) {
  const job = await queue.getJob(jobId);

  if (!job) {
    return false;
  }

  const state = await job.getState();

  if (state === 'failed') {
    await job.retry();
    return true;
  }

  return false;
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await emailQueue.close();
  await enrichmentQueue.close();
  await analyticsQueue.close();
  await connection.quit();
});

export default {
  emailQueue,
  enrichmentQueue,
  analyticsQueue,
  scheduleEmail,
  sendEmailNow,
  scheduleCampaign,
  enrichLead,
  batchEnrichLeads,
  trackAnalyticsEvent,
  getJobStatus,
  cancelJob,
  getQueueStats,
  cleanQueue,
  pauseQueue,
  resumeQueue,
  getScheduledEmails,
  getFailedJobs,
  retryFailedJob,
};
