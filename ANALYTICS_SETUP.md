# Analytics Persistence Setup Guide

## ✅ What's Been Implemented - Step 2

The application now persists ALL analytics data to the database instead of in-memory storage. This ensures data survives server restarts and provides historical tracking.

### Features:
- ✅ **Persistent email event tracking** - All email events saved to database
- ✅ **Analytics events storage** - General analytics events persisted
- ✅ **Webhook support** - Compatible with SendGrid, Mailgun, Postmark
- ✅ **Daily metrics aggregation** - Automatic rollup of email performance
- ✅ **Historical analysis** - Query any time period
- ✅ **Real-time updates** - Metrics update as events occur

---

## 📊 New Database Tables

### 1. EmailEvent
Tracks individual email events (opens, clicks, bounces, etc.)

**Fields:**
- `messageId` - Email message ID from SMTP
- `jobId` - BullMQ job ID if scheduled
- `eventType` - sent, delivered, opened, clicked, bounced, replied, complained
- `recipient` - Email recipient
- `subject` - Email subject
- `campaignId` - Campaign identifier (optional)
- `segment` - Client segment (enterprise, sme, startup)
- `source` - Source of email (queue, manual, api)
- `userAgent` - Browser/client info (for opens/clicks)
- `ipAddress` - User IP address
- `eventData` - Additional event metadata (JSON)
- `metadata` - Extra context (JSON)

### 2. AnalyticsEvent
Tracks general analytics events (AI interactions, user actions, system events)

**Fields:**
- `eventType` - Type of event (email_generated, email_sent, ai_interaction, etc.)
- `eventCategory` - Category (email, ai, user, system)
- `eventData` - Event-specific data (JSON)
- `userId` - User identifier (optional)
- `sessionId` - Session identifier (optional)
- `metadata` - Additional context (JSON)

### 3. EmailMetric (Updated)
Daily aggregated metrics per segment

**New Fields:**
- `emailsGenerated` - Emails generated (not necessarily sent)
- `bounced` - Bounced emails
- `sentimentPositive/Neutral/Negative` - Sentiment breakdown

**Calculated Fields:**
- `deliveryRate` - Percentage of emails delivered
- `openRate` - Percentage of delivered emails opened
- `clickRate` - Percentage of opened emails clicked
- `responseRate` - Percentage of emails that got replies

---

## 📡 API Endpoints

### GET /api/analytics

#### Get Summary (Last 30 days)
```bash
GET /api/analytics?type=summary&days=30
```

**Response:**
```json
{
  "success": true,
  "metrics": {
    "period": {
      "days": 30,
      "from": "2024-12-18T00:00:00Z",
      "to": "2025-01-17T00:00:00Z"
    },
    "email_metrics": {
      "total_sent": 150,
      "total_delivered": 145,
      "total_opened": 87,
      "total_clicked": 34,
      "total_replied": 12,
      "total_bounced": 5,
      "delivery_rate": 96.67,
      "open_rate": 60.00,
      "click_rate": 39.08,
      "response_rate": 8.00
    },
    "feedback_metrics": {
      "total_feedback": 45,
      "average_quality": 4.2,
      "average_relevance": 4.5,
      "average_tone": 4.3,
      "feedback_rate": "30.00"
    },
    "ai_metrics": {
      "total_interactions": 89
    },
    "segment_breakdown": {
      "enterprise": { "sent": 50, "opened": 32, "clicked": 15, "replied": 6 },
      "sme": { "sent": 75, "opened": 45, "clicked": 15, "replied": 5 },
      "startup": { "sent": 25, "opened": 10, "clicked": 4, "replied": 1 }
    }
  }
}
```

#### Get Recommendations
```bash
GET /api/analytics?type=recommendations&days=30
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "segment": "enterprise",
      "avg_quality": "4.5",
      "avg_relevance": "4.7",
      "sample_size": 20
    }
  ],
  "insights": {
    "best_segment": "enterprise",
    "recommendation": "Focus on enterprise segment for best results"
  }
}
```

#### Get Raw Events
```bash
GET /api/analytics?type=events&limit=100
```

#### Get Daily Metrics
```bash
GET /api/analytics?type=metrics
```

---

### POST /api/analytics

Track new analytics event (queued for async processing)

```bash
POST /api/analytics
Content-Type: application/json

{
  "action": "email_generated",
  "data": {
    "tone": "professional",
    "subject": "Meeting Request",
    "segment": "enterprise"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Event queued for processing",
  "action": "email_generated"
}
```

---

### DELETE /api/analytics

Clear all analytics data (development only)

```bash
DELETE /api/analytics?confirm=yes
```

---

## 📬 Email Webhooks API

### POST /api/email-webhooks

Handle email event webhooks from providers

#### SendGrid Example
```bash
POST /api/email-webhooks
X-Email-Provider: sendgrid
Content-Type: application/json

[
  {
    "email": "user@example.com",
    "event": "open",
    "sg_message_id": "abc123",
    "timestamp": 1705423200,
    "useragent": "Mozilla/5.0...",
    "ip": "192.168.1.1"
  }
]
```

#### Mailgun Example
```bash
POST /api/email-webhooks
X-Email-Provider: mailgun
Content-Type: application/json

{
  "event-data": {
    "event": "opened",
    "recipient": "user@example.com",
    "message-id": "<abc123@example.com>",
    "timestamp": 1705423200
  }
}
```

#### Generic Format
```bash
POST /api/email-webhooks
Content-Type: application/json

{
  "messageId": "abc123",
  "eventType": "opened",
  "recipient": "user@example.com",
  "timestamp": "2025-01-17T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "processed": 1,
  "events": [
    {
      "success": true,
      "eventId": "clx123...",
      "eventType": "opened"
    }
  ]
}
```

---

### GET /api/email-webhooks

Get email events

```bash
# Get all events for a message
GET /api/email-webhooks?messageId=abc123

# Get events for a recipient
GET /api/email-webhooks?recipient=user@example.com

# Get specific event type
GET /api/email-webhooks?eventType=opened
```

---

## 🔧 Supported Event Types

| Event Type | Description | Triggers |
|-----------|-------------|----------|
| `sent` | Email sent from server | When worker sends email |
| `delivered` | Email delivered to recipient | Email provider webhook |
| `opened` | Email opened by recipient | Tracking pixel loaded |
| `clicked` | Link clicked in email | Link click tracked |
| `bounced` | Email bounced (hard/soft) | Email provider webhook |
| `replied` | Recipient replied to email | Manual tracking or email parsing |
| `complained` | Spam complaint | Email provider webhook |
| `unsubscribed` | Recipient unsubscribed | Unsubscribe link clicked |

---

## 🚀 Migration from Old System

### Before (In-Memory)
```javascript
// Lost on server restart
let serverAnalytics = {
  emails: [],
  feedback: [],
  stats: { totalEmails: 0 }
};
```

### After (Database)
```javascript
// Persisted forever
await prisma.analyticsEvent.create({
  data: {
    eventType: 'email_sent',
    eventCategory: 'email',
    eventData: { ... }
  }
});
```

---

## 📈 Benefits Over Old System

| Feature | Old (Memory) | New (Database) |
|---------|-------------|----------------|
| **Persistence** | ❌ Lost on restart | ✅ Permanent |
| **Historical Data** | ❌ Limited to session | ✅ Unlimited history |
| **Email Tracking** | ❌ Not supported | ✅ Full tracking |
| **Webhooks** | ❌ Not supported | ✅ Multi-provider |
| **Daily Metrics** | ❌ Manual calculation | ✅ Auto-aggregated |
| **Segment Analysis** | ❌ Basic | ✅ Comprehensive |
| **Query Flexibility** | ❌ Limited | ✅ Unlimited |

---

## 🧪 Testing

### 1. Track an Email Generation
```bash
curl -X POST http://localhost:3001/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "action": "email_generated",
    "data": {
      "tone": "professional",
      "subject": "Test Email",
      "segment": "enterprise"
    }
  }'
```

### 2. Simulate Email Open
```bash
curl -X POST http://localhost:3001/api/email-webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "messageId": "test-123",
    "eventType": "opened",
    "recipient": "test@example.com",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'
```

### 3. Get Analytics Summary
```bash
curl http://localhost:3001/api/analytics?type=summary&days=7
```

### 4. Get Email Events
```bash
curl "http://localhost:3001/api/email-webhooks?messageId=test-123"
```

---

## 🔍 Monitoring

### Check Database
```bash
# Open Prisma Studio
npx prisma studio
```

Then navigate to:
- `EmailEvent` table - See all email events
- `AnalyticsEvent` table - See all analytics events
- `EmailMetric` table - See daily metrics

### Query Examples

**Get today's metrics:**
```javascript
const today = new Date();
today.setHours(0, 0, 0, 0);

const metrics = await prisma.emailMetric.findMany({
  where: {
    date: today,
  },
});
```

**Get all opens for a campaign:**
```javascript
const opens = await prisma.emailEvent.findMany({
  where: {
    eventType: 'opened',
    campaignId: 'campaign-123',
  },
});
```

**Get feedback for last week:**
```javascript
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);

const feedback = await prisma.emailFeedback.findMany({
  where: {
    createdAt: {
      gte: weekAgo,
    },
  },
  include: {
    interaction: true,
  },
});
```

---

## 🛠️ Configuration

### Email Provider Webhooks

**SendGrid:**
1. Go to Settings > Mail Settings > Event Webhook
2. Set URL: `https://your-domain.com/api/email-webhooks`
3. Add header: `X-Email-Provider: sendgrid`
4. Select events: Delivered, Opened, Clicked, Bounced, Spam Report

**Mailgun:**
1. Go to Webhooks section
2. Create webhook: `https://your-domain.com/api/email-webhooks`
3. Add header: `X-Email-Provider: mailgun`
4. Select events: delivered, opened, clicked, permanent_fail, complained

**Postmark:**
1. Go to Servers > Your Server > Webhooks
2. Add webhook: `https://your-domain.com/api/email-webhooks`
3. Add header: `X-Email-Provider: postmark`
4. Enable: Open tracking, Click tracking, Bounce

---

## 📊 Data Retention

By default, all data is kept forever. To clean up old data:

```javascript
// Delete events older than 90 days
const ninetyDaysAgo = new Date();
ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

await prisma.emailEvent.deleteMany({
  where: {
    createdAt: {
      lt: ninetyDaysAgo,
    },
  },
});

// Keep daily metrics forever for historical analysis
// Only delete if absolutely necessary
```

---

## 🆘 Troubleshooting

### Events Not Being Tracked

**Problem:** Email events not appearing in database
**Solution:**
1. Check worker is running: `npm run workers`
2. Verify Prisma client generated: `npx prisma generate`
3. Check database: `npx prisma studio`
4. Review worker logs

### Webhooks Not Working

**Problem:** Webhooks returning errors
**Solution:**
1. Verify webhook URL is publicly accessible
2. Check `X-Email-Provider` header is set
3. Test with curl to verify format
4. Check API logs for errors

### Metrics Not Updating

**Problem:** Daily metrics not calculating
**Solution:**
1. Verify EmailEvent records are being created
2. Check `updateDailyMetrics` function is being called
3. Manually trigger rate calculation
4. Review database unique constraints

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [SendGrid Webhooks](https://docs.sendgrid.com/for-developers/tracking-events/event)
- [Mailgun Webhooks](https://documentation.mailgun.com/en/latest/api-webhooks.html)
- [Email Tracking Best Practices](https://www.litmus.com/blog/email-tracking-best-practices/)

---

## ✅ Step 2 Complete!

Analytics are now fully persisted in the database! 🎉

Next steps:
- Step 3: Complete lead enrichment
- Step 4: Build workflow engine
- Step 5: Add CRM integrations
