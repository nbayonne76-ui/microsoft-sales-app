/**
 * Start all background workers
 * Run this script separately from the Next.js app
 * Usage: node lib/workers/start-workers.js
 */

import emailWorker from './email-worker.js';
import enrichmentWorker from './enrichment-worker.js';
import analyticsWorker from './analytics-worker.js';
import { workflowStepWorker, workflowTriggerWorker } from './workflow-worker.js';

console.log('🚀 Starting all background workers...');
console.log('📧 Email worker: Running');
console.log('🔍 Enrichment worker: Running');
console.log('📊 Analytics worker: Running');
console.log('⚙️ Workflow step worker: Running');
console.log('🔔 Workflow trigger worker: Running');
console.log('\n✅ All workers started successfully!');
console.log('Press Ctrl+C to stop all workers\n');

// Keep process alive
process.stdin.resume();

// Graceful shutdown on Ctrl+C
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
