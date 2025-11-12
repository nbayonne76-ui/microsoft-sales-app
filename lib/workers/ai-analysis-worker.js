/**
 * AI Analysis Worker
 * Processes AI analysis jobs in the background
 */

import { Worker } from 'bullmq';
import { defaultWorkerOptions } from '../bullmq-config.js';
import { prisma } from '../database.js';
import {
  analyzeEmailResponse,
  extractPatterns,
  generateResponse,
  calculateEngagementScore
} from '../ai/response-analyzer.js';

// Main worker processor
export const aiAnalysisWorker = new Worker('ai-analysis', async (job) => {
  const { name, data } = job;

  try {
    switch (name) {
      case 'analyze-response': {
        const { trackingId, responseText, context } = data;

        console.log(`🧠 Analyzing response for tracking ${trackingId}`);

        // Get email tracking record
        const tracking = await prisma.emailTracking.findUnique({
          where: { id: trackingId },
          include: {
            lead: {
              include: { managers: true }
            }
          }
        });

        if (!tracking) {
          throw new Error('Email tracking not found');
        }

        // Build context for AI
        const aiContext = {
          leadCompany: tracking.lead?.companyName,
          leadRole: tracking.lead?.managers?.[0]?.role,
          industry: tracking.lead?.industry,
          sentEmail: {
            subject: tracking.subject,
            sentAt: tracking.sentAt
          },
          ...context
        };

        // Analyze with GPT-4
        const result = await analyzeEmailResponse(responseText, aiContext);

        if (!result.success) {
          throw new Error(`AI analysis failed: ${result.error}`);
        }

        const analysis = result.analysis;

        // Calculate engagement score
        const engagementScore = calculateEngagementScore({
          ...tracking,
          replied: true,
          sentiment: analysis.sentiment,
          intentDetected: analysis.primaryIntent
        });

        // Update email tracking with AI analysis
        await prisma.emailTracking.update({
          where: { id: trackingId },
          data: {
            responseText: responseText,
            replied: true,
            repliedAt: new Date(),
            sentimentScore: analysis.sentimentScore,
            sentiment: analysis.sentiment,
            intentDetected: analysis.primaryIntent,
            aiSummary: analysis.aiSummary,
            extractedSignals: {
              buyingSignals: analysis.buyingSignals || [],
              objections: analysis.objections || [],
              competitorsMentioned: analysis.competitorsMentioned || [],
              timeline: analysis.timelineMentioned
            },
            engagementScore
          }
        });

        // Create ResponseIntelligence record
        const intelligence = await prisma.responseIntelligence.create({
          data: {
            emailTrackingId: trackingId,
            responseType: analysis.responseType,
            primaryIntent: analysis.primaryIntent,
            responseText: responseText,
            keyPhrases: analysis.keyPhrases || [],
            mentionedCompetitors: analysis.competitorsMentioned || [],
            mentionedBudget: analysis.budgetMentioned || false,
            mentionedTimeline: analysis.timelineMentioned,
            sentiment: analysis.sentiment,
            sentimentScore: analysis.sentimentScore,
            urgencyLevel: analysis.urgencyLevel,
            suggestedResponse: analysis.suggestedResponse,
            suggestedNextStep: analysis.suggestedNextStep,
            // Pattern matching (can be enhanced with more data)
            industryPattern: tracking.lead?.industry,
            rolePattern: tracking.lead?.managers?.[0]?.role,
            companySizePattern: tracking.lead?.employeeCount ?
              (tracking.lead.employeeCount < 50 ? 'startup' :
               tracking.lead.employeeCount < 500 ? 'sme' : 'enterprise') : null
          }
        });

        // If positive response, exit from any active sequences
        if (analysis.primaryIntent === 'book_meeting' || analysis.sentiment === 'positive') {
          const activeEnrollments = await prisma.sequenceEnrollment.findMany({
            where: {
              leadId: tracking.leadId,
              status: 'active'
            }
          });

          for (const enrollment of activeEnrollments) {
            await prisma.sequenceEnrollment.update({
              where: { id: enrollment.id },
              data: {
                status: 'exited',
                exitReason: 'responded_positive',
                exitedAt: new Date(),
                responded: true
              }
            });
          }

          console.log(`✅ Exited ${activeEnrollments.length} active sequences due to positive response`);
        }

        return {
          status: 'analyzed',
          intelligenceId: intelligence.id,
          sentiment: analysis.sentiment,
          intent: analysis.primaryIntent,
          engagementScore,
          suggestedAction: analysis.suggestedNextStep
        };
      }

      case 'extract-patterns': {
        const { filters } = data;

        console.log(`📊 Extracting patterns from responses`);

        // Get recent responses (last 30 days)
        const responses = await prisma.responseIntelligence.findMany({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            },
            ...filters
          },
          take: 100
        });

        if (responses.length < 5) {
          return { status: 'skipped', reason: 'insufficient_data' };
        }

        // Extract patterns with AI
        const result = await extractPatterns(responses, filters);

        if (!result.success) {
          throw new Error(`Pattern extraction failed: ${result.error}`);
        }

        // Store insights (you could create a new model for this)
        console.log(`✨ Extracted patterns:`, result.patterns);

        // TODO: Store patterns in LearningPattern model or similar
        // For now, just log them

        return {
          status: 'extracted',
          patternsCount: result.patterns.patterns?.length || 0,
          insights: result.patterns.insights
        };
      }

      case 'generate-response': {
        const { trackingId, analysisId } = data;

        console.log(`✍️ Generating suggested response`);

        const intelligence = await prisma.responseIntelligence.findUnique({
          where: { id: analysisId },
          include: {
            emailTracking: {
              include: {
                lead: {
                  include: { managers: true }
                }
              }
            }
          }
        });

        if (!intelligence) {
          throw new Error('Response intelligence not found');
        }

        const tracking = intelligence.emailTracking;

        // Generate optimal response
        const result = await generateResponse({
          sentiment: intelligence.sentiment,
          sentimentScore: intelligence.sentimentScore,
          primaryIntent: intelligence.primaryIntent,
          objections: intelligence.keyPhrases.filter(p => p.includes('mais') || p.includes('cependant')),
          buyingSignals: intelligence.keyPhrases.filter(p => p.includes('intéressé') || p.includes('démo'))
        }, {
          leadCompany: tracking.lead?.companyName,
          leadRole: tracking.lead?.managers?.[0]?.role,
          originalEmail: {
            subject: tracking.subject
          }
        });

        if (!result.success) {
          throw new Error(`Response generation failed: ${result.error}`);
        }

        // Update intelligence with generated response
        await prisma.responseIntelligence.update({
          where: { id: analysisId },
          data: {
            suggestedResponse: result.response.body
          }
        });

        return {
          status: 'generated',
          response: result.response
        };
      }

      case 'analyze-pending': {
        console.log(`🔄 Analyzing pending responses`);

        // Find tracking records with replies but no AI analysis
        const pendingTracking = await prisma.emailTracking.findMany({
          where: {
            replied: true,
            sentiment: null, // Not yet analyzed
            responseText: { not: null }
          },
          take: 50
        });

        console.log(`Found ${pendingTracking.length} pending responses to analyze`);

        // Queue each for analysis
        const { analyzeResponse } = await import('../queues/ai-analysis-queue.js');
        for (const tracking of pendingTracking) {
          await analyzeResponse(tracking.id, tracking.responseText);
        }

        return {
          status: 'queued',
          count: pendingTracking.length
        };
      }

      default:
        throw new Error(`Unknown job type: ${name}`);
    }
  } catch (error) {
    console.error(`❌ AI analysis worker error:`, error);
    throw error;
  }
}, defaultWorkerOptions);

aiAnalysisWorker.on('completed', (job) => {
  console.log(`✅ AI Job ${job.id} completed:`, job.returnvalue);
});

aiAnalysisWorker.on('failed', (job, err) => {
  console.error(`❌ AI Job ${job?.id} failed:`, err.message);
});

console.log('🧠 AI Analysis Worker started');
