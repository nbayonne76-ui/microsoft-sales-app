/**
 * AI Analysis Queue
 * Processes email responses with AI in the background
 */

import { Queue } from 'bullmq';
import { defaultQueueOptions } from '../bullmq-config.js';

export const aiAnalysisQueue = new Queue('ai-analysis', defaultQueueOptions);

/**
 * Analyze email response with AI
 */
export async function analyzeResponse(trackingId, responseText, context = {}) {
  const job = await aiAnalysisQueue.add('analyze-response', {
    trackingId,
    responseText,
    context,
    createdAt: new Date().toISOString(),
  }, {
    priority: 1, // High priority for responses
  });

  return job;
}

/**
 * Extract patterns from all responses (run weekly)
 */
export async function extractAllPatterns(filters = {}) {
  const job = await aiAnalysisQueue.add('extract-patterns', {
    filters,
    createdAt: new Date().toISOString(),
  });

  return job;
}

/**
 * Generate suggested response for a lead
 */
export async function generateSuggestedResponse(trackingId, analysisId) {
  const job = await aiAnalysisQueue.add('generate-response', {
    trackingId,
    analysisId,
    createdAt: new Date().toISOString(),
  }, {
    priority: 2, // High priority
  });

  return job;
}

/**
 * Batch analyze unprocessed responses (run hourly)
 */
export async function analyzePendingResponses() {
  const job = await aiAnalysisQueue.add('analyze-pending', {
    createdAt: new Date().toISOString(),
  });

  return job;
}
