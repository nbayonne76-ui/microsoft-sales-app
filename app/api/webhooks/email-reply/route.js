/**
 * Email Reply Webhook Handler
 * Receives inbound email replies from email service (SendGrid, Mailgun, etc.)
 */

import { prisma } from '@/lib/database';
import { NextResponse } from 'next/server';
import { analyzeResponse } from '@/lib/queues/ai-analysis-queue';

// POST - Handle incoming email reply webhook
export async function POST(request) {
  try {
    const body = await request.json();

    // Extract data based on email service provider
    // This example handles a generic format - adapt for your provider
    const {
      emailId,      // Our tracking ID
      from,         // Sender email
      subject,      // Email subject
      text,         // Plain text body
      html,         // HTML body
      timestamp,    // When received
      headers       // Email headers
    } = body;

    console.log(`📨 Received email reply from ${from} for email ${emailId}`);

    if (!emailId) {
      // Try to extract from subject or headers
      const extractedEmailId = extractEmailIdFromSubject(subject) ||
                               extractEmailIdFromHeaders(headers);

      if (!extractedEmailId) {
        console.error('Could not extract emailId from webhook');
        return NextResponse.json({ error: 'emailId not found' }, { status: 400 });
      }
    }

    // Find the email tracking record
    const tracking = await prisma.emailTracking.findUnique({
      where: { emailId },
      include: {
        lead: {
          include: { managers: true }
        }
      }
    });

    if (!tracking) {
      console.error(`Email tracking not found for emailId: ${emailId}`);
      return NextResponse.json({ error: 'Email tracking not found' }, { status: 404 });
    }

    // Use text body, fallback to stripped HTML
    const responseText = text || stripHtml(html);

    if (!responseText || responseText.trim().length < 10) {
      return NextResponse.json({ warning: 'Response too short' }, { status: 200 });
    }

    // Update tracking immediately
    await prisma.emailTracking.update({
      where: { emailId },
      data: {
        replied: true,
        repliedAt: new Date(timestamp || Date.now()),
        responseText: responseText
      }
    });

    // Queue for AI analysis (async, don't block webhook)
    analyzeResponse(tracking.id, responseText, {
      leadCompany: tracking.lead?.companyName,
      leadRole: tracking.lead?.managers?.[0]?.role,
      industry: tracking.lead?.industry
    }).catch(err => {
      console.error('Failed to queue AI analysis:', err);
    });

    console.log(`✅ Reply recorded and queued for AI analysis`);

    return NextResponse.json({
      success: true,
      message: 'Reply received and queued for analysis'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}

// Helper: Extract email ID from subject line (if using reference pattern)
function extractEmailIdFromSubject(subject) {
  // Example: Extract from "Re: Your message [ref:email_abc123]"
  const match = subject?.match(/\[ref:([^\]]+)\]/);
  return match ? match[1] : null;
}

// Helper: Extract email ID from headers
function extractEmailIdFromHeaders(headers) {
  // Example: Look for custom X-Email-ID header
  return headers?.['x-email-id'] || headers?.['X-Email-ID'];
}

// Helper: Strip HTML to get plain text
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>.*?<\/style>/gs, '')
    .replace(/<script[^>]*>.*?<\/script>/gs, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

// GET - Test endpoint
export async function GET(request) {
  return NextResponse.json({
    message: 'Email reply webhook endpoint',
    status: 'active',
    instructions: 'Send POST requests with email reply data'
  });
}
