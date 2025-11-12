/**
 * Email Sequence Worker
 * Processes email sequence jobs in the background
 */

import { Worker } from 'bullmq';
import { defaultWorkerOptions } from '../bullmq-config.js';
import { prisma } from '../database.js';

// Email sending logic (placeholder - replace with actual email service)
async function sendSequenceEmail(lead, step, enrollment) {
  // TODO: Integrate with actual email service (SendGrid, Mailgun, etc.)
  console.log(`📧 Sending email to ${lead.email || lead.companyName}`);
  console.log(`   Step ${step.stepNumber}: ${step.subject}`);

  // For now, just log the email
  // In production, this would call your email service API

  return {
    emailId: `email_${Date.now()}`,
    sentAt: new Date(),
  };
}

// Generate email content from template
function generateEmailContent(template, lead, step) {
  let content = step.bodyTemplate;

  // Replace template variables
  content = content.replace(/{{companyName}}/g, lead.companyName || '');
  content = content.replace(/{{contactName}}/g, lead.managers?.[0]?.name || '');
  content = content.replace(/{{industry}}/g, lead.industry || '');

  return content;
}

// Main worker processor
export const emailSequenceWorker = new Worker('email-sequences', async (job) => {
  const { name, data } = job;

  try {
    switch (name) {
      case 'enroll-lead': {
        const { leadId, sequenceId } = data;

        // Get sequence details
        const sequence = await prisma.emailSequence.findUnique({
          where: { id: sequenceId },
          include: { steps: { orderBy: { stepNumber: 'asc' } } }
        });

        if (!sequence || !sequence.isActive) {
          throw new Error('Sequence not found or inactive');
        }

        // Check if lead is already enrolled
        const existing = await prisma.sequenceEnrollment.findFirst({
          where: { leadId, sequenceId, status: 'active' }
        });

        if (existing) {
          return { status: 'already_enrolled' };
        }

        // Create enrollment
        const enrollment = await prisma.sequenceEnrollment.create({
          data: {
            leadId,
            sequenceId,
            status: 'active',
            currentStep: 1,
            nextStepDueAt: new Date(), // First step sends immediately
          }
        });

        // Update sequence stats
        await prisma.emailSequence.update({
          where: { id: sequenceId },
          data: { enrolledCount: { increment: 1 } }
        });

        // Schedule first step
        const firstStep = sequence.steps[0];
        if (firstStep) {
          const delayMs = firstStep.delayDays * 24 * 60 * 60 * 1000 + firstStep.delayHours * 60 * 60 * 1000;

          // Import dynamically to avoid circular dependency
          const { scheduleNextStep } = await import('../queues/email-sequence-queue.js');
          await scheduleNextStep(enrollment.id, 1, delayMs);
        }

        return { status: 'enrolled', enrollmentId: enrollment.id };
      }

      case 'process-step': {
        const { enrollmentId, stepNumber } = data;

        // Get enrollment with lead and sequence data
        const enrollment = await prisma.sequenceEnrollment.findUnique({
          where: { id: enrollmentId },
          include: {
            lead: { include: { managers: true } },
            sequence: { include: { steps: true } }
          }
        });

        if (!enrollment || enrollment.status !== 'active') {
          return { status: 'skipped', reason: 'enrollment_inactive' };
        }

        const step = enrollment.sequence.steps.find(s => s.stepNumber === stepNumber);
        if (!step) {
          return { status: 'completed', reason: 'no_more_steps' };
        }

        // Check conditions (e.g., only send if no previous open)
        if (step.sendOnlyIf) {
          const conditions = step.sendOnlyIf;
          // TODO: Implement condition checking
        }

        // Send email
        const emailResult = await sendSequenceEmail(enrollment.lead, step, enrollment);

        // Create email tracking record
        const tracking = await prisma.emailTracking.create({
          data: {
            emailId: emailResult.emailId,
            leadId: enrollment.leadId,
            subject: step.subject,
            sentTo: enrollment.lead.email || '',
            sentAt: emailResult.sentAt,
            sequenceId: enrollment.sequenceId,
            stepNumber: step.stepNumber,
          }
        });

        // Update enrollment
        await prisma.sequenceEnrollment.update({
          where: { id: enrollmentId },
          data: {
            currentStep: stepNumber,
            emailsSent: { increment: 1 }
          }
        });

        // Update step stats
        await prisma.sequenceStep.update({
          where: { id: step.id },
          data: { sentCount: { increment: 1 } }
        });

        // Schedule next step if exists
        const nextStep = enrollment.sequence.steps.find(s => s.stepNumber === stepNumber + 1);
        if (nextStep) {
          const delayMs = nextStep.delayDays * 24 * 60 * 60 * 1000 + nextStep.delayHours * 60 * 60 * 1000;
          const nextDueAt = new Date(Date.now() + delayMs);

          await prisma.sequenceEnrollment.update({
            where: { id: enrollmentId },
            data: { nextStepDueAt: nextDueAt }
          });

          const { scheduleNextStep } = await import('../queues/email-sequence-queue.js');
          await scheduleNextStep(enrollmentId, stepNumber + 1, delayMs);
        } else {
          // Mark sequence as completed
          await prisma.sequenceEnrollment.update({
            where: { id: enrollmentId },
            data: {
              status: 'completed',
              exitReason: 'sequence_complete',
              exitedAt: new Date()
            }
          });

          await prisma.emailSequence.update({
            where: { id: enrollment.sequenceId },
            data: { completedCount: { increment: 1 } }
          });
        }

        return { status: 'sent', emailId: emailResult.emailId };
      }

      case 'exit-lead': {
        const { enrollmentId, reason } = data;

        await prisma.sequenceEnrollment.update({
          where: { id: enrollmentId },
          data: {
            status: 'exited',
            exitReason: reason,
            exitedAt: new Date(),
          }
        });

        return { status: 'exited' };
      }

      case 'process-due-steps': {
        // Find all enrollments with steps due now
        const dueEnrollments = await prisma.sequenceEnrollment.findMany({
          where: {
            status: 'active',
            nextStepDueAt: {
              lte: new Date()
            }
          },
          take: 100, // Process in batches
        });

        console.log(`⏰ Processing ${dueEnrollments.length} due sequence steps`);

        // Schedule each one
        const { processSequenceStep } = await import('../queues/email-sequence-queue.js');
        for (const enrollment of dueEnrollments) {
          await processSequenceStep(enrollment.id, enrollment.currentStep + 1);
        }

        return { status: 'processed', count: dueEnrollments.length };
      }

      default:
        throw new Error(`Unknown job type: ${name}`);
    }
  } catch (error) {
    console.error(`❌ Email sequence worker error:`, error);
    throw error;
  }
}, defaultWorkerOptions);

emailSequenceWorker.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed:`, job.returnvalue);
});

emailSequenceWorker.on('failed', (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err.message);
});

console.log('🚀 Email Sequence Worker started');
