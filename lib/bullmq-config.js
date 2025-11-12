/**
 * BullMQ Configuration
 * Connects to Upstash Redis for background job processing
 */

import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

// Redis connection for BullMQ (using Upstash Redis)
const connection = new IORedis(process.env.UPSTASH_REDIS_REST_URL || '', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  family: 6, // Force IPv6
  tls: {
    rejectUnauthorized: false
  }
});

connection.on('error', (err) => {
  console.error('BullMQ Redis connection error:', err);
});

connection.on('connect', () => {
  console.log('✅ BullMQ connected to Redis');
});

// Default queue options
export const defaultQueueOptions = {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // Keep failed jobs for 7 days
    },
  },
};

// Default worker options
export const defaultWorkerOptions = {
  connection,
  concurrency: 5,
  removeOnComplete: { count: 1000 },
  removeOnFail: { count: 5000 },
};

export { connection };
