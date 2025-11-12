# Lead Enrichment System - Complete Guide

## Overview

The Lead Enrichment System automatically enhances lead data by gathering information from multiple sources including government APIs, web scraping, legal databases, and LinkedIn. This system uses a multi-phase approach with confidence scoring to ensure data quality.

## Table of Contents

1. [Architecture](#architecture)
2. [Enrichment Phases](#enrichment-phases)
3. [API Endpoints](#api-endpoints)
4. [Background Processing](#background-processing)
5. [Data Sources](#data-sources)
6. [Configuration](#configuration)
7. [Usage Examples](#usage-examples)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [Production Deployment](#production-deployment)

---

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Lead Import/Creation                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Enrichment Queue (BullMQ + Redis)              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Enrichment Worker Process                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         EnrichmentEngineV2 (6 Phases)                 │  │
│  │  • Phase 1: Government API (SIRET)                    │  │
│  │  • Phase 2: Web Scraping (Company Website)            │  │
│  │  • Phase 3: Legal Data (Pappers/Societe.com)          │  │
│  │  • Phase 4: LinkedIn Company Page                     │  │
│  │  • Phase 5: Cross-source Validation                   │  │
│  │  • Phase 6: Confidence Scoring                        │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Database Update (Prisma + SQLite)              │
│  • HotLead (main company data)                              │
│  • Manager (company managers)                               │
│  • Service (company services)                               │
│  • Specialty (company specialties)                          │
└─────────────────────────────────────────────────────────────┘
```

### Key Files

- **`/lib/enrichment-engine-v2.js`** - Core enrichment logic with 6 phases
- **`/lib/workers/enrichment-worker.js`** - Background worker for processing jobs
- **`/app/api/enrich-lead/route.js`** - REST API for manual enrichment
- **`/app/api/import-campaign-leads/route.js`** - Auto-enrichment on import
- **`/lib/queue.js`** - Queue management utilities

---

## Enrichment Phases

### Phase 1: Government API (Official Data)

**Source:** `https://recherche-entreprises.api.gouv.fr`

**Data Retrieved:**
- SIRET number (unique company ID)
- NAF code (activity code)
- Legal form (SARL, SAS, etc.)
- Official address
- Employee count (range)
- Creation date

**Confidence Weight:** 40% (highest - official government data)

**Example:**
```javascript
{
  siret: "80489589600018",
  nafCode: "6201Z",
  legalForm: "SAS",
  address: "123 Rue Example, 75001 Paris",
  employeeCount: 50,
  creationDate: "2018-01-15"
}
```

### Phase 2: Web Scraping (Company Website)

**Process:**
1. Search DuckDuckGo for company website
2. Extract website URL from search results
3. Scrape company website for additional data

**Data Retrieved:**
- Company website URL
- Contact email
- Phone number
- Full address
- Social media links
- Team members (from about/team pages)

**Confidence Weight:** 20%

**Technologies:**
- Cheerio for HTML parsing
- Custom regex for email/phone extraction

### Phase 3: Legal Data (Pappers/Societe.com)

**Sources:**
- **Pappers API** (requires API key) - Preferred
- **Societe.com** (scraping fallback) - Secondary

**Data Retrieved:**
- Share capital (capital social)
- Annual turnover
- Company directors/managers
- Financial health indicators
- Registered trademarks

**Confidence Weight:** 25%

**Note:** Pappers API requires paid subscription. Set `PAPPERS_API_KEY` in `.env` to enable.

### Phase 4: LinkedIn Company Page

**Process:**
1. Search for company LinkedIn page
2. Extract public profile data
3. Identify key managers/executives

**Data Retrieved:**
- Company description
- Industry sector
- Company size
- Key executives/managers
- Specialties

**Confidence Weight:** 10%

**Note:** LinkedIn has strict rate limits. Disabled by default. Enable with caution.

### Phase 5: Cross-Source Validation

**Process:**
- Compare data from multiple sources
- Flag inconsistencies
- Prioritize official sources (government > legal > web)

**Validation Rules:**
- SIRET must match across all sources (if present)
- Address variations are normalized
- Phone/email verified against multiple sources

### Phase 6: Confidence Scoring

**Calculation:**
```javascript
confidenceScore =
  (governmentData ? 0.40 : 0) +
  (websiteData ? 0.20 : 0) +
  (legalData ? 0.25 : 0) +
  (linkedinData ? 0.10 : 0) +
  (validationPassed ? 0.05 : 0)
```

**Confidence Levels:**
- **0.8 - 1.0** = Excellent (multiple verified sources)
- **0.6 - 0.79** = Good (2-3 sources)
- **0.4 - 0.59** = Fair (1-2 sources)
- **0.0 - 0.39** = Poor (minimal data)

---

## API Endpoints

### POST /api/enrich-lead

Enrich a specific lead with data from all sources.

**Request:**
```json
{
  "leadId": "lead_abc123",
  "companyName": "Microsoft France",
  "forceRefresh": false
}
```

**Parameters:**
- `leadId` (optional) - Existing lead ID to enrich
- `companyName` (required if no leadId) - Company name to search
- `forceRefresh` (optional, default: false) - Re-enrich even if already enriched

**Response:**
```json
{
  "success": true,
  "lead": {
    "id": "lead_abc123",
    "companyName": "Microsoft France",
    "siret": "327733184",
    "address": "39 Quai du Président Roosevelt, 92130 Issy-les-Moulineaux",
    "phone": "+33 1 85 73 25 25",
    "email": "contact@microsoft.fr",
    "website": "https://www.microsoft.com/fr-fr",
    "legalForm": "SAS",
    "employeeCount": 1500,
    "enrichmentStatus": "enriched",
    "enrichedAt": "2025-10-18T10:00:00.000Z",
    "managers": [...],
    "services": [...],
    "specialties": [...]
  },
  "enrichment": {
    "fieldsEnriched": ["siret", "address", "phone", "email", "website", "legalForm"],
    "source": "government-api,web-scraping,legal-data",
    "confidence": 0.85,
    "enrichedAt": "2025-10-18T10:00:00.000Z"
  }
}
```

### GET /api/enrich-lead?company=CompanyName

Preview enrichment data without saving to database.

**Request:**
```
GET /api/enrich-lead?company=Microsoft%20France
```

**Response:**
```json
{
  "success": true,
  "preview": true,
  "companyName": "Microsoft France",
  "enrichedData": {
    "siret": "327733184",
    "address": "39 Quai du Président Roosevelt, 92130 Issy-les-Moulineaux",
    ...
  },
  "fieldsFound": ["siret", "address", "phone", "email"],
  "confidence": 0.85,
  "sources": ["government-api", "web-scraping"]
}
```

### POST /api/import-campaign-leads

Import leads with automatic enrichment.

**Request:**
```json
{
  "leads": [
    {
      "entreprise": "Microsoft France",
      "email": "contact@microsoft.fr",
      "telephone": "+33 1 85 73 25 25",
      "priorite": "HAUTE"
    }
  ],
  "campaignName": "Q1 2025 Campaign",
  "autoEnrich": true
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "total": 1,
    "created": 1,
    "enriched": 1,
    "linked": 1,
    "errors": []
  },
  "message": "1 leads importés, 1 enrichis, 1 liés"
}
```

**Note:** Enrichment happens asynchronously in background. Check `enrichmentStatus` field to see progress.

---

## Background Processing

### Starting the Enrichment Worker

**Development:**
```bash
# Start worker separately
npm run workers

# Or start both dev server and workers
npm run dev:all
```

**Production:**
```bash
# Start worker with PM2
pm2 start lib/workers/start-workers.js --name "enrichment-workers"

# Or use systemd service
sudo systemctl start enrichment-workers
```

### Worker Configuration

Located in `/lib/workers/enrichment-worker.js`:

```javascript
{
  concurrency: 3,        // Process 3 enrichments at once
  limiter: {
    max: 5,             // Maximum 5 jobs
    duration: 1000      // per 1 second (rate limiting)
  }
}
```

### Monitoring Jobs

**Check job status:**
```javascript
import { getEnrichmentJob } from '@/lib/queue';

const job = await getEnrichmentJob(jobId);
console.log(job.progress);  // 0-100
console.log(job.state);     // 'waiting', 'active', 'completed', 'failed'
```

**Using BullBoard (optional):**
```bash
npm install @bull-board/express
```

Then access dashboard at `http://localhost:3002/admin/queues`

---

## Data Sources

### Government API (Free)

**API:** `https://recherche-entreprises.api.gouv.fr`
- **Rate Limit:** None officially, but be respectful
- **Coverage:** All French companies
- **Authentication:** None required
- **Reliability:** Very high (official data)

**Setup:** No configuration needed - works out of the box!

### Pappers API (Paid)

**API:** `https://api.pappers.fr`
- **Rate Limit:** Depends on plan (100-10,000 requests/month)
- **Coverage:** French companies + detailed financials
- **Authentication:** API key required
- **Cost:** €29-299/month

**Setup:**
```bash
# Add to .env.local
PAPPERS_API_KEY=your_api_key_here
```

### Web Scraping (Free)

**Search Engine:** DuckDuckGo
- **Rate Limit:** No strict limit, use delays
- **Reliability:** Medium (depends on website structure)

**Setup:** No configuration needed - uses Cheerio package

**Ethical Considerations:**
- Respects robots.txt
- Adds delays between requests
- Only scrapes publicly available data

### LinkedIn (Use with Caution)

**Disabled by default** due to LinkedIn's strict terms of service.

**To Enable:**
```javascript
const engine = new EnrichmentEngineV2(companyName, {
  enableLinkedIn: true  // Enable at your own risk
});
```

**Warning:** LinkedIn may block your IP or account for scraping.

---

## Configuration

### Environment Variables

Create `.env.local` file:

```bash
# Redis Connection (required for background processing)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Pappers API (optional - for detailed legal data)
PAPPERS_API_KEY=your_api_key_here

# Enrichment Options
ENRICHMENT_TIMEOUT=30000              # 30 seconds per phase
ENRICHMENT_ENABLE_WEB_SCRAPING=true   # Enable web scraping
ENRICHMENT_ENABLE_LEGAL_DATA=true     # Enable legal data scraping
ENRICHMENT_ENABLE_LINKEDIN=false      # Disable LinkedIn (risky)
```

### Customizing Enrichment Phases

Edit `/lib/enrichment-engine-v2.js`:

```javascript
// Disable specific phases
const engine = new EnrichmentEngineV2(companyName, {
  enableWebScraping: false,   // Skip Phase 2
  enableLegalData: false,     // Skip Phase 3
  enableLinkedIn: false,      // Skip Phase 4
  timeout: 10000              // 10 second timeout per phase
});
```

---

## Usage Examples

### Example 1: Manual Enrichment via API

```javascript
// Enrich a specific lead
const response = await fetch('/api/enrich-lead', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    leadId: 'lead_123',
    companyName: 'Airbus',
    forceRefresh: true
  })
});

const result = await response.json();
console.log(`Confidence: ${result.enrichment.confidence * 100}%`);
console.log(`Sources: ${result.enrichment.source}`);
```

### Example 2: Preview Enrichment Data

```javascript
// Preview without saving
const response = await fetch('/api/enrich-lead?company=Airbus');
const preview = await response.json();

console.log('Found data:', preview.fieldsFound);
console.log('Confidence:', preview.confidence);
console.log('SIRET:', preview.enrichedData.siret);
```

### Example 3: Programmatic Queue Job

```javascript
import { enqueueEnrichment } from '@/lib/queue';

// Add enrichment job to queue
const job = await enqueueEnrichment({
  id: 'lead_123',
  companyName: 'Total Energies'
});

console.log('Job queued:', job.id);

// Check job progress
const status = await job.getState();
const progress = await job.progress;
console.log(`Status: ${status}, Progress: ${progress}%`);
```

### Example 4: Bulk Import with Auto-Enrichment

```javascript
const leads = [
  { entreprise: 'Microsoft France', email: 'contact@microsoft.fr' },
  { entreprise: 'Google France', email: 'contact@google.fr' },
  { entreprise: 'Amazon France', email: 'contact@amazon.fr' }
];

const response = await fetch('/api/import-campaign-leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    leads: leads,
    campaignName: 'Tech Giants',
    autoEnrich: true  // Automatically enrich all
  })
});

const result = await response.json();
console.log(`Imported: ${result.results.created}`);
console.log(`Queued for enrichment: ${result.results.enriched}`);
```

---

## Testing

### Unit Tests

Test individual enrichment phases:

```javascript
import { EnrichmentEngineV2 } from '@/lib/enrichment-engine-v2';

// Test Phase 1: Government API
const engine = new EnrichmentEngineV2('Microsoft France');
const govData = await engine.searchPhase1_Government();

expect(govData.siret).toBeTruthy();
expect(govData.legalForm).toBe('SAS');
```

### Integration Tests

Test complete enrichment flow:

```bash
# Create test lead
curl -X POST http://localhost:3002/api/hot-leads \
  -H "Content-Type: application/json" \
  -d '{"companyName": "Airbus", "enrichmentStatus": "pending"}'

# Trigger enrichment
curl -X POST http://localhost:3002/api/enrich-lead \
  -H "Content-Type: application/json" \
  -d '{"leadId": "lead_123", "companyName": "Airbus"}'

# Check result
curl http://localhost:3002/api/hot-leads/lead_123
```

### Manual Testing Checklist

- [ ] Start Redis server (`redis-server`)
- [ ] Start enrichment worker (`npm run workers`)
- [ ] Start dev server (`npm run dev`)
- [ ] Create test lead via API
- [ ] Trigger enrichment
- [ ] Verify data in database
- [ ] Check confidence score
- [ ] Verify managers/services created
- [ ] Test error handling (invalid company)
- [ ] Test rate limiting (bulk enrichment)

---

## Troubleshooting

### Issue: "Redis connection failed"

**Cause:** Redis server not running

**Solution:**
```bash
# Install Redis (if not installed)
# Windows: Download from https://github.com/microsoftarchive/redis/releases
# Mac: brew install redis
# Linux: sudo apt install redis-server

# Start Redis
redis-server

# Verify Redis is running
redis-cli ping  # Should return "PONG"
```

### Issue: "Enrichment job stuck in 'waiting' state"

**Cause:** Enrichment worker not running

**Solution:**
```bash
# Start worker process
npm run workers

# Or check if worker is running
ps aux | grep enrichment-worker
```

### Issue: "No data found for company"

**Possible Causes:**
1. Company name misspelled
2. Company not registered in France
3. Website blocking scrapers
4. API rate limit exceeded

**Solutions:**
```javascript
// Try different company name variations
await enrich("Microsoft");
await enrich("Microsoft France");
await enrich("Microsoft France SARL");

// Check API directly
const response = await fetch(
  'https://recherche-entreprises.api.gouv.fr/search?q=Microsoft'
);
console.log(await response.json());
```

### Issue: "Confidence score always low"

**Cause:** Only using government API (Phase 1)

**Solution:**
```bash
# Enable all enrichment phases
ENRICHMENT_ENABLE_WEB_SCRAPING=true
ENRICHMENT_ENABLE_LEGAL_DATA=true

# Add Pappers API key for better data
PAPPERS_API_KEY=your_key
```

### Issue: "Worker crashing with memory error"

**Cause:** Too many concurrent jobs

**Solution:**
```javascript
// Reduce concurrency in enrichment-worker.js
{
  concurrency: 1,  // Process one at a time
  limiter: {
    max: 3,        // Reduce to 3 jobs/second
    duration: 1000
  }
}
```

---

## Production Deployment

### Prerequisites

```bash
# Install production dependencies
npm install --production

# Set up Redis (production)
# Use managed Redis (AWS ElastiCache, Redis Cloud, etc.)
```

### Environment Setup

Create `.env.production`:

```bash
NODE_ENV=production

# Redis Connection (use managed Redis)
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your_secure_password
REDIS_TLS=true

# Database
DATABASE_URL=file:./production.db

# APIs
PAPPERS_API_KEY=your_production_key

# Security
ENRICHMENT_MAX_CONCURRENT=5
ENRICHMENT_TIMEOUT=30000
```

### Process Management with PM2

```bash
# Install PM2
npm install -g pm2

# Start Next.js app
pm2 start npm --name "my-app" -- start

# Start workers
pm2 start lib/workers/start-workers.js --name "workers"

# Save PM2 config
pm2 save
pm2 startup
```

### Monitoring

```bash
# Monitor all processes
pm2 monit

# View logs
pm2 logs workers
pm2 logs my-app

# View worker metrics
pm2 show workers
```

### Scaling

**Horizontal Scaling:**
```bash
# Run multiple worker instances
pm2 start lib/workers/enrichment-worker.js -i 3  # 3 instances

# All workers share same Redis queue
# Jobs automatically distributed
```

**Vertical Scaling:**
```javascript
// Increase concurrency per worker
{
  concurrency: 10,  // Process 10 jobs at once
  limiter: {
    max: 20,
    duration: 1000
  }
}
```

### Health Checks

Add to your monitoring system:

```javascript
// GET /api/health
export async function GET() {
  // Check Redis connection
  const redis = new Redis(process.env.REDIS_HOST);
  const pong = await redis.ping();

  // Check queue status
  const queue = new Queue('enrichment-queue');
  const waitingCount = await queue.getWaitingCount();

  return Response.json({
    status: 'healthy',
    redis: pong === 'PONG',
    queue: {
      waiting: waitingCount,
      active: await queue.getActiveCount()
    }
  });
}
```

### Backup Strategy

```bash
# Backup Redis (scheduled with cron)
redis-cli --rdb /backup/redis-dump.rdb

# Backup SQLite database
cp production.db /backup/production-$(date +%Y%m%d).db

# Restore if needed
cp /backup/production-20251018.db production.db
```

---

## Performance Metrics

### Expected Performance

- **Phase 1 (Government API):** 500-1000ms
- **Phase 2 (Web Scraping):** 2000-5000ms
- **Phase 3 (Legal Data):** 1000-3000ms
- **Phase 4 (LinkedIn):** 2000-4000ms (disabled by default)
- **Total Average:** 5-10 seconds per lead

### Optimization Tips

1. **Cache Results:** Store enrichment data for 30 days, avoid re-enriching
2. **Batch Processing:** Enrich in batches during off-peak hours
3. **Selective Phases:** Disable expensive phases if not needed
4. **Rate Limiting:** Respect API limits to avoid bans
5. **Timeout Management:** Set appropriate timeouts per phase

---

## Support

### Common Questions

**Q: How much does enrichment cost?**
A: Government API is free. Pappers API costs €29-299/month. Web scraping is free but use responsibly.

**Q: Can I enrich international companies?**
A: Currently optimized for French companies. Government API only works for France.

**Q: Is this legal?**
A: Yes - we only scrape publicly available data and respect robots.txt. Pappers API is official.

**Q: How accurate is the data?**
A: Government data (Phase 1) is 100% official. Other sources vary - use confidence score as guide.

**Q: Can I customize what data is collected?**
A: Yes - edit `enrichment-engine-v2.js` to add/remove fields or entire phases.

### Getting Help

- **Documentation:** This file + inline code comments
- **Logs:** Check `pm2 logs workers` for enrichment errors
- **Queue Dashboard:** Install BullBoard for visual monitoring
- **Support:** Contact development team

---

## Changelog

### Version 2.0 (Current)
- Multi-phase enrichment engine
- Background processing with BullMQ
- Confidence scoring system
- Manager/service/specialty extraction
- Web scraping with Cheerio
- Cross-source validation

### Version 1.0 (Legacy)
- Basic government API lookup
- Synchronous processing
- Limited data fields
- No confidence scoring

---

**Last Updated:** 2025-10-18
**Author:** Claude (AI Assistant)
**Version:** 2.0
