/**
 * Enrichment Worker - Processes lead enrichment jobs
 * Handles: government API lookups, web scraping, legal data
 */

import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '../database.js';
import { enrichLeadWithGovernmentData } from '../enrichment-engine-v2.js';

// Redis connection
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

/**
 * Process lead enrichment job
 * @param {Job} job - BullMQ job
 * @returns {Promise<Object>}
 */
async function processEnrichmentJob(job) {
  const { data } = job;

  console.log(`🔍 Processing enrichment job ${job.id} for lead: ${data.companyName || data.id}`);

  // Update progress
  await job.updateProgress(10);

  // Get lead from database if ID provided
  let lead = data;
  if (data.id) {
    const dbLead = await prisma.hotLead.findUnique({
      where: { id: data.id },
    });

    if (!dbLead) {
      throw new Error(`Lead not found: ${data.id}`);
    }

    lead = { ...dbLead, ...data };
  }

  // Update progress
  await job.updateProgress(30);

  // Enrich lead using V2 engine (government API + web scraping + legal data)
  const enrichmentResult = await enrichLeadWithGovernmentData(lead);

  // Update progress
  await job.updateProgress(70);

  // Save enrichment results to database
  if (lead.id && enrichmentResult.enrichedData) {
    const enrichedData = enrichmentResult.enrichedData;

    // Update main lead fields
    await prisma.hotLead.update({
      where: { id: lead.id },
      data: {
        description: enrichedData.description,
        address: enrichedData.address,
        phone: enrichedData.phone,
        email: enrichedData.email,
        website: enrichedData.website,
        employeeCount: enrichedData.employeeCount,
        legalForm: enrichedData.legalForm,
        siret: enrichedData.siret,
        nafCode: enrichedData.nafCode,
        turnover: enrichedData.turnover,
        capitalSocial: enrichedData.capitalSocial,
        creationDate: enrichedData.creationDate,
        enrichmentStatus: 'enriched',
        enrichedAt: new Date(),
        enrichmentSource: enrichmentResult.sources?.join(', ') || 'v2-engine',
      },
    });

    // Add managers if found
    if (enrichedData.managers && enrichedData.managers.length > 0) {
      await prisma.manager.createMany({
        data: enrichedData.managers.map(m => ({
          hotLeadId: lead.id,
          name: m.name,
          role: m.role,
          email: m.email || null,
          phone: m.phone || null,
        })),
        skipDuplicates: true,
      });
    }

    // Add services if found
    if (enrichedData.services && enrichedData.services.length > 0) {
      await prisma.service.createMany({
        data: enrichedData.services.map(s => ({
          hotLeadId: lead.id,
          name: s.name,
          description: s.description || null,
        })),
        skipDuplicates: true,
      });
    }

    // Add specialties if found
    if (enrichedData.specialties && enrichedData.specialties.length > 0) {
      await prisma.specialty.createMany({
        data: enrichedData.specialties.map(s => ({
          hotLeadId: lead.id,
          name: s.name,
          domain: s.domain || null,
        })),
        skipDuplicates: true,
      });
    }

    console.log(`✅ Lead ${lead.id} enriched successfully with ${enrichmentResult.sources?.length || 0} sources`);
  }

  // Update progress
  await job.updateProgress(100);

  return {
    success: true,
    leadId: lead.id,
    enrichedFields: Object.keys(enrichmentResult.enrichedData || {}),
    confidenceScore: enrichmentResult.confidence,
    sources: enrichmentResult.sources,
  };
}

// Create enrichment worker
const enrichmentWorker = new Worker(
  'enrichment-queue',
  async (job) => {
    try {
      const result = await processEnrichmentJob(job);
      return result;
    } catch (error) {
      console.error(`❌ Error processing enrichment job ${job.id}:`, error);
      throw error; // Will trigger retry
    }
  },
  {
    connection,
    concurrency: 3, // Process up to 3 enrichments concurrently
    limiter: {
      max: 5, // Maximum 5 jobs
      duration: 1000, // per 1 second (rate limiting for API)
    },
  }
);

// Worker event listeners
enrichmentWorker.on('completed', (job, result) => {
  console.log(`✅ Enrichment job ${job.id} completed:`, result);
});

enrichmentWorker.on('failed', (job, error) => {
  console.error(`❌ Enrichment job ${job.id} failed:`, error.message);

  // Update lead status to failed if possible
  if (job.data.id) {
    prisma.hotLead.update({
      where: { id: job.data.id },
      data: {
        enrichmentStatus: 'failed',
        lastEnrichmentError: error.message,
      },
    }).catch(err => console.error('Error updating lead status:', err));
  }
});

enrichmentWorker.on('progress', (job, progress) => {
  console.log(`⏳ Enrichment job ${job.id} progress: ${progress}%`);
});

enrichmentWorker.on('error', (error) => {
  console.error('❌ Enrichment worker error:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔍 Shutting down enrichment worker...');
  await enrichmentWorker.close();
  await connection.quit();
});

console.log('🔍 Enrichment worker started and listening for jobs...');

export default enrichmentWorker;
