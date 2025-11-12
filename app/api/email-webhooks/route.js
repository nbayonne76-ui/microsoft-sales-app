/**
 * Email Webhooks API - Track email events (opens, clicks, bounces, etc.)
 * Compatible with multiple email providers (SendGrid, Mailgun, Nodemailer tracking)
 */

import { prisma } from '@/lib/database';
import { handleEmailEventTrigger } from '@/lib/intelligent-trigger-system';

/**
 * POST /api/email-webhooks
 * Handle email event webhooks from email providers
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const provider = request.headers.get('x-email-provider') || 'generic';

    console.log('📬 Email webhook received from:', provider);

    // Parse event based on provider
    const events = parseWebhookEvent(body, provider);

    // Process each event
    const results = await Promise.all(
      events.map(event => processEmailEvent(event))
    );

    return Response.json({
      success: true,
      processed: results.length,
      events: results,
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return Response.json({
      error: 'Failed to process webhook',
      details: error.message,
    }, { status: 500 });
  }
}

/**
 * GET /api/email-webhooks
 * Get email events for tracking
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('messageId');
    const recipient = searchParams.get('recipient');
    const eventType = searchParams.get('eventType');

    const where = {};

    if (messageId) where.messageId = messageId;
    if (recipient) where.recipient = recipient;
    if (eventType) where.eventType = eventType;

    const events = await prisma.emailEvent.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });

    return Response.json({
      success: true,
      events,
      count: events.length,
    });

  } catch (error) {
    console.error('❌ Get events error:', error);
    return Response.json({
      error: 'Failed to get email events',
      details: error.message,
    }, { status: 500 });
  }
}

/**
 * Parse webhook event based on provider format
 */
function parseWebhookEvent(body, provider) {
  switch (provider.toLowerCase()) {
    case 'sendgrid':
      return parseSendGridEvent(body);

    case 'mailgun':
      return parseMailgunEvent(body);

    case 'postmark':
      return parsePostmarkEvent(body);

    case 'generic':
    default:
      return parseGenericEvent(body);
  }
}

/**
 * Parse SendGrid webhook format
 */
function parseSendGridEvent(body) {
  // SendGrid sends array of events
  const events = Array.isArray(body) ? body : [body];

  return events.map(event => ({
    messageId: event.sg_message_id || event['smtp-id'],
    eventType: mapEventType(event.event),
    recipient: event.email,
    timestamp: new Date(event.timestamp * 1000),
    userAgent: event.useragent,
    ipAddress: event.ip,
    eventData: {
      url: event.url, // For clicks
      reason: event.reason, // For bounces
      status: event.status,
      response: event.response,
    },
  }));
}

/**
 * Parse Mailgun webhook format
 */
function parseMailgunEvent(body) {
  const eventData = body['event-data'] || body;

  return [{
    messageId: eventData['message-id'] || eventData.id,
    eventType: mapEventType(eventData.event),
    recipient: eventData.recipient,
    timestamp: new Date(eventData.timestamp * 1000),
    userAgent: eventData['user-agent'],
    ipAddress: eventData['client-info']?.['client-ip'],
    eventData: {
      url: eventData.url,
      reason: eventData.reason || eventData['delivery-status']?.message,
      tags: eventData.tags,
    },
  }];
}

/**
 * Parse Postmark webhook format
 */
function parsePostmarkEvent(body) {
  return [{
    messageId: body.MessageID,
    eventType: mapEventType(body.RecordType),
    recipient: body.Recipient || body.Email,
    timestamp: new Date(body.ReceivedAt),
    userAgent: body.UserAgent,
    ipAddress: body.Geo?.IP,
    eventData: {
      url: body.OriginalLink,
      reason: body.Description || body.Message,
      bounceType: body.Type,
    },
  }];
}

/**
 * Parse generic event format
 */
function parseGenericEvent(body) {
  return [{
    messageId: body.messageId || body.message_id,
    eventType: body.eventType || body.event,
    recipient: body.recipient || body.to || body.email,
    timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
    userAgent: body.userAgent,
    ipAddress: body.ipAddress || body.ip,
    eventData: body.data || {},
  }];
}

/**
 * Map provider event types to our standard types
 */
function mapEventType(eventType) {
  const eventMap = {
    // SendGrid
    'processed': 'sent',
    'delivered': 'delivered',
    'open': 'opened',
    'click': 'clicked',
    'bounce': 'bounced',
    'dropped': 'bounced',
    'deferred': 'deferred',
    'unsubscribe': 'unsubscribed',
    'spamreport': 'complained',

    // Mailgun
    'accepted': 'sent',
    'rejected': 'bounced',
    'failed': 'bounced',
    'opened': 'opened',
    'clicked': 'clicked',
    'unsubscribed': 'unsubscribed',
    'complained': 'complained',

    // Postmark
    'Delivery': 'delivered',
    'Bounce': 'bounced',
    'Open': 'opened',
    'Click': 'clicked',
    'SpamComplaint': 'complained',

    // Generic
    'sent': 'sent',
    'delivered': 'delivered',
    'opened': 'opened',
    'clicked': 'clicked',
    'bounced': 'bounced',
    'replied': 'replied',
    'complained': 'complained',
    'unsubscribed': 'unsubscribed',
  };

  return eventMap[eventType] || eventType;
}

/**
 * Process and store email event
 */
async function processEmailEvent(event) {
  try {
    // Create email event record
    const emailEvent = await prisma.emailEvent.create({
      data: {
        messageId: event.messageId,
        eventType: event.eventType,
        recipient: event.recipient,
        userAgent: event.userAgent,
        ipAddress: event.ipAddress,
        eventData: event.eventData,
        createdAt: event.timestamp || new Date(),
      },
    });

    // Update client interaction if exists
    await updateClientInteraction(event);

    // Update daily metrics
    await updateDailyMetrics(event);

    // 🔥 NEW: Trigger intelligent workflow analysis based on email behavior
    try {
      const triggerResult = await handleEmailEventTrigger({
        eventType: event.eventType,
        recipient: event.recipient,
        messageId: event.messageId,
        subject: emailEvent.subject,
        eventData: event.eventData
      });

      if (triggerResult && triggerResult.workflowsStarted > 0) {
        console.log(`🚀 Auto-triggered ${triggerResult.workflowsStarted} workflows for ${event.recipient}`);
      }
    } catch (triggerError) {
      // Don't fail the webhook if trigger analysis fails
      console.error('⚠️ Error in trigger analysis (non-blocking):', triggerError.message);
    }

    console.log(`✅ Processed ${event.eventType} event for ${event.recipient}`);

    return {
      success: true,
      eventId: emailEvent.id,
      eventType: event.eventType,
    };

  } catch (error) {
    console.error('❌ Error processing event:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Update client interaction based on email event
 */
async function updateClientInteraction(event) {
  try {
    const updates = {};

    switch (event.eventType) {
      case 'delivered':
        updates.status = 'delivered';
        break;
      case 'opened':
        updates.status = 'opened';
        updates.openedAt = event.timestamp || new Date();
        break;
      case 'clicked':
        updates.clickedAt = event.timestamp || new Date();
        break;
      case 'replied':
        updates.status = 'responded';
        updates.respondedAt = event.timestamp || new Date();
        updates.responseReceived = true;
        break;
      case 'bounced':
        updates.status = 'bounced';
        break;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.clientInteraction.updateMany({
        where: {
          messageId: event.messageId,
        },
        data: updates,
      });
    }

  } catch (error) {
    console.error('Error updating client interaction:', error);
  }
}

/**
 * Update daily email metrics
 */
async function updateDailyMetrics(event) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const segment = event.eventData?.segment || 'unknown';

    const incrementField = {};

    switch (event.eventType) {
      case 'sent':
        incrementField.emailsSent = 1;
        break;
      case 'delivered':
        incrementField.delivered = 1;
        break;
      case 'opened':
        incrementField.opened = 1;
        break;
      case 'clicked':
        incrementField.clicked = 1;
        break;
      case 'replied':
        incrementField.replied = 1;
        break;
      case 'bounced':
        incrementField.bounced = 1;
        break;
    }

    if (Object.keys(incrementField).length > 0) {
      await prisma.emailMetric.upsert({
        where: {
          date_segment: {
            date: today,
            segment,
          },
        },
        create: {
          date: today,
          segment,
          ...Object.fromEntries(
            Object.entries(incrementField).map(([key, value]) => [key, value])
          ),
        },
        update: Object.fromEntries(
          Object.entries(incrementField).map(([key]) => [key, { increment: 1 }])
        ),
      });

      // Update calculated rates
      await updateMetricRates(today, segment);
    }

  } catch (error) {
    console.error('Error updating daily metrics:', error);
  }
}

/**
 * Update calculated rates for metrics
 */
async function updateMetricRates(date, segment) {
  try {
    const metric = await prisma.emailMetric.findUnique({
      where: {
        date_segment: { date, segment },
      },
    });

    if (!metric) return;

    const deliveryRate = metric.emailsSent > 0
      ? (metric.delivered / metric.emailsSent)
      : 0;

    const openRate = metric.delivered > 0
      ? (metric.opened / metric.delivered)
      : 0;

    const clickRate = metric.opened > 0
      ? (metric.clicked / metric.opened)
      : 0;

    const responseRate = metric.emailsSent > 0
      ? (metric.replied / metric.emailsSent)
      : 0;

    await prisma.emailMetric.update({
      where: {
        date_segment: { date, segment },
      },
      data: {
        deliveryRate,
        openRate,
        clickRate,
        responseRate,
      },
    });

  } catch (error) {
    console.error('Error updating metric rates:', error);
  }
}
