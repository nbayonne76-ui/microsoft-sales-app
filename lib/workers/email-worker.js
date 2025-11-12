/**
 * Email Worker - Processes email jobs from the queue
 * Handles: scheduled emails, immediate emails, campaign emails
 */

import { Worker } from 'bullmq';
import Redis from 'ioredis';
import nodemailer from 'nodemailer';
import { prisma } from '../database.js';

// Redis connection
const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send email using Nodemailer
 * @param {Object} emailData - Email details
 * @returns {Promise<Object>}
 */
async function sendEmail(emailData) {
  const { to, subject, content, from, html } = emailData;

  // Format HTML email
  const htmlContent = html || `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${subject}</h2>
          </div>
          <div class="content">
            ${content.replace(/\n/g, '<br>')}
          </div>
          <div class="footer">
            <p>Sent via AI Email Assistant</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: from || process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  const result = await transporter.sendMail(mailOptions);

  return {
    success: true,
    messageId: result.messageId,
    sentAt: new Date(),
    to,
    subject,
  };
}

/**
 * Save email interaction to database and track event
 * @param {Object} emailData - Email data
 * @param {Object} result - Send result
 * @returns {Promise<void>}
 */
async function saveEmailInteraction(emailData, result) {
  try {
    // Find or create client
    let client = await prisma.client.findUnique({
      where: { contactEmail: emailData.to },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          contactEmail: emailData.to,
          company: emailData.company || 'Unknown',
          contactName: emailData.recipientName || emailData.to.split('@')[0],
          segment: emailData.segment || 'sme',
          status: 'active',
        },
      });
    }

    // Create interaction record
    await prisma.clientInteraction.create({
      data: {
        clientId: client.id,
        type: 'email',
        direction: 'outbound',
        status: 'sent',
        subject: emailData.subject,
        content: emailData.content,
        sentiment: 'neutral',
        messageId: result.messageId,
        jobId: emailData.jobId,
      },
    });

    // Create email event for tracking
    await prisma.emailEvent.create({
      data: {
        messageId: result.messageId,
        jobId: emailData.jobId,
        eventType: 'sent',
        recipient: emailData.to,
        subject: emailData.subject,
        campaignId: emailData.campaignId,
        segment: emailData.segment || 'unknown',
        source: 'queue',
        metadata: {
          campaignId: emailData.campaignId,
          sentVia: 'queue',
        },
      },
    });

    // Track in analytics queue
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'email_sent',
        eventCategory: 'email',
        eventData: {
          to: emailData.to,
          subject: emailData.subject,
          messageId: result.messageId,
        },
      },
    });

    console.log(`✅ Email interaction and events saved for ${emailData.to}`);
  } catch (error) {
    console.error('❌ Error saving email interaction:', error);
    // Don't throw - email was sent successfully
  }
}

/**
 * Process email job
 * @param {Job} job - BullMQ job
 * @returns {Promise<Object>}
 */
async function processEmailJob(job) {
  const { data } = job;

  console.log(`📧 Processing email job ${job.id}: ${data.subject} → ${data.to}`);

  // Update progress
  await job.updateProgress(10);

  // Validate email data
  if (!data.to || !data.subject || !data.content) {
    throw new Error('Missing required email fields: to, subject, content');
  }

  // Update progress
  await job.updateProgress(30);

  // Send email
  const result = await sendEmail(data);

  // Update progress
  await job.updateProgress(70);

  // Save to database
  await saveEmailInteraction({ ...data, jobId: job.id }, result);

  // Update progress
  await job.updateProgress(100);

  console.log(`✅ Email sent successfully: ${result.messageId}`);

  return {
    success: true,
    messageId: result.messageId,
    sentAt: result.sentAt,
    jobId: job.id,
  };
}

// Create email worker
const emailWorker = new Worker(
  'email-queue',
  async (job) => {
    try {
      const result = await processEmailJob(job);
      return result;
    } catch (error) {
      console.error(`❌ Error processing email job ${job.id}:`, error);
      throw error; // Will trigger retry
    }
  },
  {
    connection,
    concurrency: 5, // Process up to 5 emails concurrently
    limiter: {
      max: 10, // Maximum 10 jobs
      duration: 1000, // per 1 second (rate limiting)
    },
  }
);

// Worker event listeners
emailWorker.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed:`, result);
});

emailWorker.on('failed', (job, error) => {
  console.error(`❌ Job ${job.id} failed:`, error.message);
});

emailWorker.on('progress', (job, progress) => {
  console.log(`⏳ Job ${job.id} progress: ${progress}%`);
});

emailWorker.on('error', (error) => {
  console.error('❌ Worker error:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📧 Shutting down email worker...');
  await emailWorker.close();
  await connection.quit();
});

console.log('📧 Email worker started and listening for jobs...');

export default emailWorker;
