/**
 * Schedule Email API - Now using BullMQ for persistent scheduling
 * Replaces setTimeout with reliable job queue
 */

import { scheduleEmail, sendEmailNow, getScheduledEmails, cancelJob, getJobStatus } from '@/lib/queue';

/**
 * POST /api/schedule-email
 * Schedule an email to be sent at a specific time
 */
export async function POST(request) {
  try {
    const { emailContent, recipient, scheduledTime, timezone, confidence, reason, sendNow } = await request.json();

    console.log('📅 Schedule email request:', { recipient, scheduledTime, confidence, sendNow });

    if (!emailContent || !recipient) {
      return Response.json({
        error: 'Email content and recipient are required'
      }, { status: 400 });
    }

    // Prepare email data
    const emailData = {
      to: recipient,
      subject: emailContent.subject,
      content: emailContent.content,
      html: emailContent.html,
      from: emailContent.from,
      timezone: timezone || 'Europe/Paris',
      confidence,
      reason,
      metadata: {
        scheduledVia: 'api',
        originalScheduledTime: scheduledTime,
      },
    };

    let job;

    // Send immediately or schedule for later
    if (sendNow || !scheduledTime) {
      job = await sendEmailNow(emailData);
      console.log(`📤 Email queued for immediate sending: ${job.id}`);
    } else {
      const sendAt = new Date(scheduledTime);

      // Validate future time
      if (sendAt <= new Date()) {
        return Response.json({
          error: 'Scheduled time must be in the future'
        }, { status: 400 });
      }

      job = await scheduleEmail(emailData, sendAt);
      console.log(`⏰ Email scheduled for ${sendAt}: ${job.id}`);
    }

    return Response.json({
      success: true,
      scheduledEmail: {
        id: job.id,
        jobId: job.id,
        recipient,
        subject: emailContent.subject,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : 'immediate',
        status: 'scheduled',
        confidence,
        reason,
        queuePosition: await job.getState(),
      }
    });

  } catch (error) {
    console.error('❌ Schedule email error:', error);
    return Response.json({
      error: error.message || 'Erreur lors de la programmation de l\'email'
    }, { status: 500 });
  }
}

/**
 * GET /api/schedule-email
 * Get all scheduled emails or check status of specific job
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    // Get specific job status
    if (jobId) {
      const status = await getJobStatus(jobId);

      if (status.status === 'not_found') {
        return Response.json({
          error: 'Job not found'
        }, { status: 404 });
      }

      return Response.json({
        success: true,
        job: {
          id: jobId,
          ...status,
        },
      });
    }

    // Get all scheduled emails
    const scheduledEmails = await getScheduledEmails();

    return Response.json({
      success: true,
      count: scheduledEmails.length,
      scheduledEmails: scheduledEmails.map(email => ({
        id: email.id,
        recipient: email.to,
        subject: email.subject,
        scheduledTime: email.scheduledFor,
        status: email.status,
        attemptsMade: email.attemptsMade,
      })),
    });

  } catch (error) {
    console.error('❌ Get scheduled emails error:', error);
    return Response.json({
      error: 'Erreur lors de la récupération des emails programmés'
    }, { status: 500 });
  }
}

/**
 * DELETE /api/schedule-email
 * Cancel a scheduled email
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return Response.json({
        error: 'Job ID is required'
      }, { status: 400 });
    }

    const cancelled = await cancelJob(jobId);

    if (!cancelled) {
      return Response.json({
        error: 'Cannot cancel job - it may have already been processed or does not exist'
      }, { status: 400 });
    }

    console.log(`🗑️ Cancelled scheduled email: ${jobId}`);

    return Response.json({
      success: true,
      message: 'Scheduled email cancelled successfully',
      jobId,
    });

  } catch (error) {
    console.error('❌ Cancel scheduled email error:', error);
    return Response.json({
      error: 'Erreur lors de l\'annulation de l\'email programmé'
    }, { status: 500 });
  }
}

/**
 * PUT /api/schedule-email
 * Reschedule an email
 */
export async function PUT(request) {
  try {
    const { jobId, newScheduledTime } = await request.json();

    if (!jobId || !newScheduledTime) {
      return Response.json({
        error: 'Job ID and new scheduled time are required'
      }, { status: 400 });
    }

    // Get current job data
    const currentJob = await getJobStatus(jobId);

    if (currentJob.status === 'not_found') {
      return Response.json({
        error: 'Job not found'
      }, { status: 404 });
    }

    // Cancel current job
    const cancelled = await cancelJob(jobId);

    if (!cancelled) {
      return Response.json({
        error: 'Cannot reschedule - job may have already been processed'
      }, { status: 400 });
    }

    // Create new scheduled job
    const sendAt = new Date(newScheduledTime);
    const newJob = await scheduleEmail(currentJob.data, sendAt);

    console.log(`🔄 Rescheduled email ${jobId} → ${newJob.id} for ${sendAt}`);

    return Response.json({
      success: true,
      message: 'Email rescheduled successfully',
      oldJobId: jobId,
      newJobId: newJob.id,
      newScheduledTime: sendAt,
    });

  } catch (error) {
    console.error('❌ Reschedule email error:', error);
    return Response.json({
      error: 'Erreur lors de la reprogrammation de l\'email'
    }, { status: 500 });
  }
}
