/**
 * Analytics Worker - Processes analytics events and stores them in database
 * Handles: email tracking, user actions, AI interactions
 */

import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '../database.js';

// Redis connection
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

/**
 * Process analytics event
 * @param {Job} job - BullMQ job
 * @returns {Promise<Object>}
 */
async function processAnalyticsJob(job) {
  const { data } = job;

  console.log(`📊 Processing analytics event: ${data.eventType}`);

  const { eventType, eventData, timestamp = new Date() } = data;

  switch (eventType) {
    case 'email_generated':
      await trackEmailGenerated(eventData, timestamp);
      break;

    case 'email_sent':
      await trackEmailSent(eventData, timestamp);
      break;

    case 'email_opened':
      await trackEmailOpened(eventData, timestamp);
      break;

    case 'email_clicked':
      await trackEmailClicked(eventData, timestamp);
      break;

    case 'email_replied':
      await trackEmailReplied(eventData, timestamp);
      break;

    case 'feedback_submitted':
      await trackFeedback(eventData, timestamp);
      break;

    case 'ai_interaction':
      await trackAIInteraction(eventData, timestamp);
      break;

    default:
      console.warn(`⚠️ Unknown event type: ${eventType}`);
  }

  return {
    success: true,
    eventType,
    processedAt: new Date(),
  };
}

/**
 * Track email generation
 */
async function trackEmailGenerated(data, timestamp) {
  // Update daily metrics
  const today = new Date(timestamp);
  today.setHours(0, 0, 0, 0);

  await prisma.emailMetric.upsert({
    where: {
      date_segment: {
        date: today,
        segment: data.segment || 'unknown',
      },
    },
    create: {
      date: today,
      segment: data.segment || 'unknown',
      emailsGenerated: 1,
    },
    update: {
      emailsGenerated: {
        increment: 1,
      },
    },
  });

  console.log(`📊 Tracked email generation for ${data.segment || 'unknown'} segment`);
}

/**
 * Track email sent
 */
async function trackEmailSent(data, timestamp) {
  const today = new Date(timestamp);
  today.setHours(0, 0, 0, 0);

  await prisma.emailMetric.upsert({
    where: {
      date_segment: {
        date: today,
        segment: data.segment || 'unknown',
      },
    },
    create: {
      date: today,
      segment: data.segment || 'unknown',
      emailsSent: 1,
      delivered: 1, // Assume delivered for now
    },
    update: {
      emailsSent: {
        increment: 1,
      },
      delivered: {
        increment: 1,
      },
    },
  });

  // Update interaction record if exists
  if (data.messageId) {
    await prisma.clientInteraction.updateMany({
      where: {
        messageId: data.messageId,
      },
      data: {
        status: 'delivered',
      },
    });
  }

  console.log(`📊 Tracked email sent: ${data.messageId}`);
}

/**
 * Track email opened
 */
async function trackEmailOpened(data, timestamp) {
  const today = new Date(timestamp);
  today.setHours(0, 0, 0, 0);

  await prisma.emailMetric.upsert({
    where: {
      date_segment: {
        date: today,
        segment: data.segment || 'unknown',
      },
    },
    create: {
      date: today,
      segment: data.segment || 'unknown',
      opened: 1,
    },
    update: {
      opened: {
        increment: 1,
      },
    },
  });

  // Update interaction record
  if (data.messageId) {
    await prisma.clientInteraction.updateMany({
      where: {
        messageId: data.messageId,
      },
      data: {
        status: 'opened',
        openedAt: timestamp,
      },
    });
  }

  console.log(`📊 Tracked email opened: ${data.messageId}`);
}

/**
 * Track email clicked
 */
async function trackEmailClicked(data, timestamp) {
  const today = new Date(timestamp);
  today.setHours(0, 0, 0, 0);

  await prisma.emailMetric.upsert({
    where: {
      date_segment: {
        date: today,
        segment: data.segment || 'unknown',
      },
    },
    create: {
      date: today,
      segment: data.segment || 'unknown',
      clicked: 1,
    },
    update: {
      clicked: {
        increment: 1,
      },
    },
  });

  // Update interaction record
  if (data.messageId) {
    await prisma.clientInteraction.updateMany({
      where: {
        messageId: data.messageId,
      },
      data: {
        clickedAt: timestamp,
      },
    });
  }

  console.log(`📊 Tracked email clicked: ${data.messageId}`);
}

/**
 * Track email replied
 */
async function trackEmailReplied(data, timestamp) {
  const today = new Date(timestamp);
  today.setHours(0, 0, 0, 0);

  await prisma.emailMetric.upsert({
    where: {
      date_segment: {
        date: today,
        segment: data.segment || 'unknown',
      },
    },
    create: {
      date: today,
      segment: data.segment || 'unknown',
      replied: 1,
      [data.sentiment || 'sentimentNeutral']: 1,
    },
    update: {
      replied: {
        increment: 1,
      },
      [data.sentiment || 'sentimentNeutral']: {
        increment: 1,
      },
    },
  });

  // Update interaction record
  if (data.messageId) {
    await prisma.clientInteraction.updateMany({
      where: {
        messageId: data.messageId,
      },
      data: {
        status: 'responded',
        respondedAt: timestamp,
        sentiment: data.sentiment || 'neutral',
      },
    });
  }

  console.log(`📊 Tracked email replied: ${data.messageId}`);
}

/**
 * Track feedback
 */
async function trackFeedback(data, timestamp) {
  await prisma.emailFeedback.create({
    data: {
      interactionId: data.interactionId,
      qualityRating: data.qualityRating,
      relevanceRating: data.relevanceRating,
      toneRating: data.toneRating,
      feedback: data.feedback,
      suggestions: data.suggestions,
      feedbackType: data.feedbackType || 'general',
    },
  });

  console.log(`📊 Tracked feedback for interaction: ${data.interactionId}`);
}

/**
 * Track AI interaction
 */
async function trackAIInteraction(data, timestamp) {
  // Could create a separate AIInteraction table if needed
  // For now, just log
  console.log(`📊 Tracked AI interaction: ${data.action}`);
}

// Create analytics worker
const analyticsWorker = new Worker(
  'analytics-queue',
  async (job) => {
    try {
      const result = await processAnalyticsJob(job);
      return result;
    } catch (error) {
      console.error(`❌ Error processing analytics job ${job.id}:`, error);
      throw error; // Will trigger retry
    }
  },
  {
    connection,
    concurrency: 10, // Process many analytics events concurrently
  }
);

// Worker event listeners
analyticsWorker.on('completed', (job, result) => {
  console.log(`✅ Analytics job ${job.id} completed`);
});

analyticsWorker.on('failed', (job, error) => {
  console.error(`❌ Analytics job ${job.id} failed:`, error.message);
});

analyticsWorker.on('error', (error) => {
  console.error('❌ Analytics worker error:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📊 Shutting down analytics worker...');
  await analyticsWorker.close();
  await connection.quit();
});

console.log('📊 Analytics worker started and listening for jobs...');

export default analyticsWorker;
