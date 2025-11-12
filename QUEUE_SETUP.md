# Job Queue System Setup Guide

## ✅ What's Been Implemented

The application now uses **BullMQ** with **Redis** for persistent, reliable job scheduling. This replaces the old `setTimeout` approach which lost jobs on server restart.

### Features:
- ✅ **Persistent scheduling** - Jobs survive server restarts
- ✅ **Automatic retry** - Failed jobs retry with exponential backoff
- ✅ **Concurrent processing** - Multiple jobs processed simultaneously
- ✅ **Rate limiting** - Prevents API overload
- ✅ **Job monitoring** - Track status, progress, and errors
- ✅ **Database integration** - All events saved to SQLite

---

## 📋 Prerequisites

### 1. Install Redis

**Windows:**
```bash
# Using Chocolatey
choco install redis-64

# Or download from: https://github.com/tporadowski/redis/releases
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Docker (All platforms):**
```bash
docker run -d --name redis -p 6379:6379 redis:latest
```

### 2. Verify Redis is Running

```bash
redis-cli ping
# Should return: PONG
```

---

## 🚀 Running the Application

You need to run **TWO separate processes**:

### Terminal 1: Next.js Application
```bash
npm run dev
```

### Terminal 2: Background Workers
```bash
node lib/workers/start-workers.js
```

**Important:** The workers MUST be running for jobs to be processed!

---

## 📊 Available Queues

### 1. Email Queue
- **Purpose:** Send scheduled and immediate emails
- **Concurrency:** 5 emails at once
- **Rate Limit:** 10 emails per second
- **Retry:** 3 attempts with exponential backoff

### 2. Enrichment Queue
- **Purpose:** Enrich leads with external data
- **Concurrency:** 3 enrichments at once
- **Rate Limit:** 5 requests per second
- **Retry:** 2 attempts with 10-second delay

### 3. Analytics Queue
- **Purpose:** Track events and save to database
- **Concurrency:** 10 events at once
- **Retry:** 5 attempts with exponential backoff

---

## 🔧 Configuration

Add to your `.env.local`:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 📡 API Usage

### Schedule an Email

**POST** `/api/schedule-email`
```json
{
  "emailContent": {
    "subject": "Meeting Tomorrow",
    "content": "Let's discuss the project..."
  },
  "recipient": "client@company.com",
  "scheduledTime": "2025-01-20T14:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "scheduledEmail": {
    "id": "email-1234567890-abc123",
    "jobId": "email-1234567890-abc123",
    "recipient": "client@company.com",
    "subject": "Meeting Tomorrow",
    "scheduledTime": "2025-01-20T14:00:00.000Z",
    "status": "scheduled"
  }
}
```

### Get Scheduled Emails

**GET** `/api/schedule-email`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "scheduledEmails": [
    {
      "id": "email-1234567890-abc123",
      "recipient": "client@company.com",
      "subject": "Meeting Tomorrow",
      "scheduledTime": "2025-01-20T14:00:00.000Z",
      "status": "scheduled",
      "attemptsMade": 0
    }
  ]
}
```

### Check Job Status

**GET** `/api/schedule-email?jobId=email-1234567890-abc123`

**Response:**
```json
{
  "success": true,
  "job": {
    "id": "email-1234567890-abc123",
    "status": "delayed",
    "progress": 0,
    "attemptsMade": 0,
    "data": { "to": "client@company.com", "subject": "..." }
  }
}
```

### Cancel Scheduled Email

**DELETE** `/api/schedule-email?jobId=email-1234567890-abc123`

**Response:**
```json
{
  "success": true,
  "message": "Scheduled email cancelled successfully",
  "jobId": "email-1234567890-abc123"
}
```

### Reschedule Email

**PUT** `/api/schedule-email`
```json
{
  "jobId": "email-1234567890-abc123",
  "newScheduledTime": "2025-01-21T10:00:00Z"
}
```

---

## 🧪 Testing

### 1. Schedule a Test Email (5 minutes from now)
```bash
curl -X POST http://localhost:3001/api/schedule-email \
  -H "Content-Type: application/json" \
  -d '{
    "emailContent": {
      "subject": "Test Email",
      "content": "This is a test scheduled email"
    },
    "recipient": "test@example.com",
    "scheduledTime": "'$(date -u -d '+5 minutes' +%Y-%m-%dT%H:%M:%SZ)'"
  }'
```

### 2. Check Scheduled Emails
```bash
curl http://localhost:3001/api/schedule-email
```

### 3. Monitor Worker Logs
Watch Terminal 2 for worker output:
```
📧 Email worker started and listening for jobs...
🔍 Enrichment worker started and listening for jobs...
📊 Analytics worker started and listening for jobs...
```

When job processes:
```
📧 Processing email job email-123: Test Email → test@example.com
⏳ Job email-123 progress: 10%
⏳ Job email-123 progress: 30%
⏳ Job email-123 progress: 70%
✅ Email sent successfully: <message-id>
✅ Job email-123 completed
```

---

## 🔍 Monitoring

### Redis CLI
```bash
redis-cli

# List all keys
KEYS *

# Check queue length
LLEN bull:email-queue:wait
LLEN bull:email-queue:delayed
LLEN bull:email-queue:active

# Get job details
HGETALL bull:email-queue:email-1234567890-abc123
```

### BullBoard (Optional Dashboard)
Install BullBoard for a web UI:

```bash
npm install @bull-board/api @bull-board/express
```

Then add to your Next.js app (see BullBoard docs).

---

## 🛠️ Troubleshooting

### Workers Not Processing Jobs

**Problem:** Jobs stuck in "waiting" or "delayed" state
**Solution:**
1. Check if workers are running: `ps aux | grep start-workers`
2. Restart workers: `node lib/workers/start-workers.js`
3. Check Redis: `redis-cli ping`

### Redis Connection Error

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:6379`
**Solution:**
1. Start Redis: `redis-server` (Windows) or `brew services start redis` (macOS)
2. Check `.env.local` for correct `REDIS_HOST` and `REDIS_PORT`

### Jobs Failing Repeatedly

**Problem:** Jobs in "failed" state
**Solution:**
1. Check worker logs in Terminal 2
2. Verify email credentials in `.env.local`
3. Check job data: `GET /api/schedule-email?jobId=<job-id>`

### Email Not Sending

**Problem:** Jobs complete but email not received
**Solution:**
1. Verify `EMAIL_USER` and `EMAIL_PASS` in `.env.local`
2. For Gmail: Use [App Password](https://support.google.com/accounts/answer/185833), not regular password
3. Check spam folder
4. Review worker logs for errors

---

## 🚀 Production Deployment

### Recommended Setup:

1. **Use managed Redis:**
   - AWS ElastiCache
   - Redis Cloud
   - Upstash (serverless)

2. **Run workers as separate service:**
   - Separate container/dyno for workers
   - Use process manager (PM2, Docker, systemd)
   - Auto-restart on failure

3. **Environment variables:**
   ```env
   REDIS_HOST=your-redis-host.com
   REDIS_PORT=6379
   REDIS_PASSWORD=your-secure-password
   EMAIL_USER=your-email@company.com
   EMAIL_PASS=your-app-password
   ```

4. **Monitoring:**
   - Install BullBoard for dashboard
   - Set up alerts for failed jobs
   - Monitor queue lengths

### PM2 Example:
```json
{
  "apps": [
    {
      "name": "workers",
      "script": "lib/workers/start-workers.js",
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
```

Start with: `pm2 start ecosystem.config.json`

---

## 📈 Benefits Over Old System

| Feature | Old (setTimeout) | New (BullMQ) |
|---------|-----------------|--------------|
| Persistence | ❌ Lost on restart | ✅ Survives restart |
| Retry | ❌ None | ✅ Automatic with backoff |
| Monitoring | ❌ No visibility | ✅ Full job tracking |
| Scaling | ❌ Single process | ✅ Multiple workers |
| Database | ❌ Not saved | ✅ Saved to DB |
| Rate Limiting | ❌ None | ✅ Built-in |
| Max Schedule | ❌ 24 hours | ✅ Unlimited |

---

## 📚 Additional Resources

- [BullMQ Documentation](https://docs.bullmq.io/)
- [Redis Documentation](https://redis.io/documentation)
- [Job Queue Best Practices](https://docs.bullmq.io/patterns/working-with-batches)

---

## 🆘 Support

For issues or questions:
1. Check worker logs
2. Check Redis status
3. Review this guide
4. Check BullMQ documentation
