# Microsoft Dynamics 365 CRM Integration Guide

**Purpose**: Connect your app to Dynamics 365 to sync leads, contacts, opportunities, and activities
**Complexity**: Medium-High
**Timeline**: 2-4 weeks for full implementation
**Impact**: HIGH - Eliminates manual data entry and creates a single source of truth

---

## 🎯 Why Integrate Dynamics 365?

### Current Pain Points (Without Integration):
- ❌ Manual data entry in two systems
- ❌ Data gets out of sync
- ❌ Sales reps jump between platforms
- ❌ No single source of truth
- ❌ Duplicate work and wasted time

### Benefits After Integration:
- ✅ **Automatic sync**: Leads flow seamlessly between systems
- ✅ **Single source of truth**: CRM remains the master database
- ✅ **Enhanced workflows**: Trigger Dynamics activities from your app
- ✅ **Better reporting**: Combine data from both systems
- ✅ **Sales rep happiness**: Work in one place, data syncs everywhere

---

## 🏗️ Integration Architecture

### Option 1: API-First Integration (Recommended)

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR APP                              │
│  (Hot Leads Manager, Email Generator, Analytics)        │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API Calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Dynamics 365 Web API                        │
│  https://[org].api.crm.dynamics.com/api/data/v9.2/      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Microsoft Dynamics 365 CRM                       │
│  (Leads, Contacts, Accounts, Opportunities)             │
└─────────────────────────────────────────────────────────┘
```

**Data Flow Example**:
```
1. User enriches lead "Lyra" in YOUR APP
   ↓
2. YOUR APP calls Dynamics 365 API
   ↓
3. Creates/updates Lead record in DYNAMICS 365
   ↓
4. Dynamics 365 returns Lead ID
   ↓
5. YOUR APP stores Dynamics Lead ID for future sync
```

---

### Option 2: Power Automate Integration (Low-Code)

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR APP                              │
│  Triggers webhook when lead is enriched                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Webhook POST
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Power Automate Flow                         │
│  - Receives webhook                                      │
│  - Transforms data                                       │
│  - Calls Dynamics 365 API                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Microsoft Dynamics 365 CRM                       │
└─────────────────────────────────────────────────────────┘
```

---

### Option 3: Bidirectional Sync (Advanced)

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR APP                              │
│              (Primary Interface)                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Bidirectional Sync
                     ↕
┌─────────────────────────────────────────────────────────┐
│              Sync Service (Background Job)               │
│  - Polls both systems for changes                       │
│  - Resolves conflicts                                    │
│  - Maintains sync state                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↕
┌─────────────────────────────────────────────────────────┐
│         Microsoft Dynamics 365 CRM                       │
│           (Source of Truth)                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Implementation Guide: API-First Integration

### Phase 1: Authentication Setup (1-2 days)

#### Step 1.1: Register App in Azure AD

```
1. Go to https://portal.azure.com
2. Navigate to "Azure Active Directory"
3. Click "App registrations" → "New registration"
4. Configure:
   - Name: "YourApp-Dynamics365-Integration"
   - Supported account types: "Single tenant"
   - Redirect URI: "https://yourdomain.com/auth/callback"
5. Click "Register"
6. Copy the following (you'll need them):
   - Application (client) ID
   - Directory (tenant) ID
```

#### Step 1.2: Create Client Secret

```
1. In your app registration, go to "Certificates & secrets"
2. Click "New client secret"
3. Description: "Dynamics 365 API Access"
4. Expires: "24 months"
5. Click "Add"
6. Copy the secret VALUE immediately (you can't see it again!)
```

#### Step 1.3: Grant API Permissions

```
1. Go to "API permissions"
2. Click "Add a permission"
3. Select "Dynamics CRM"
4. Select "Delegated permissions"
5. Check "user_impersonation"
6. Click "Add permissions"
7. Click "Grant admin consent for [Your Organization]"
```

#### Step 1.4: Update Environment Variables

Add to your `.env.local`:

```env
# Dynamics 365 Integration
DYNAMICS_365_URL=https://[your-org].crm.dynamics.com
DYNAMICS_365_API_VERSION=v9.2
DYNAMICS_365_CLIENT_ID=your-client-id-from-step-1.1
DYNAMICS_365_CLIENT_SECRET=your-client-secret-from-step-1.2
DYNAMICS_365_TENANT_ID=your-tenant-id-from-step-1.1
DYNAMICS_365_SCOPE=https://[your-org].crm.dynamics.com/.default
```

---

### Phase 2: Authentication Code (1 day)

#### Create Authentication Library

Create `lib/dynamics365/auth.js`:

```javascript
import { ClientSecretCredential } from '@azure/identity';

let cachedToken = null;
let tokenExpiry = null;

export async function getDynamics365Token() {
  // Return cached token if still valid
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  // Get new token
  const credential = new ClientSecretCredential(
    process.env.DYNAMICS_365_TENANT_ID,
    process.env.DYNAMICS_365_CLIENT_ID,
    process.env.DYNAMICS_365_CLIENT_SECRET
  );

  const tokenResponse = await credential.getToken(
    process.env.DYNAMICS_365_SCOPE
  );

  // Cache token (expires in 1 hour typically)
  cachedToken = tokenResponse.token;
  tokenExpiry = tokenResponse.expiresOnTimestamp;

  return cachedToken;
}

export function getDynamicsApiUrl() {
  return `${process.env.DYNAMICS_365_URL}/api/data/${process.env.DYNAMICS_365_API_VERSION}`;
}
```

**Install required package**:
```bash
npm install @azure/identity
```

---

### Phase 3: API Client Library (2-3 days)

#### Create Dynamics 365 Client

Create `lib/dynamics365/client.js`:

```javascript
import { getDynamics365Token, getDynamicsApiUrl } from './auth';
import { logger } from '../logger';

class Dynamics365Client {
  async request(endpoint, options = {}) {
    const token = await getDynamics365Token();
    const baseUrl = getDynamicsApiUrl();
    const url = `${baseUrl}${endpoint}`;

    const headers = {
      'Authorization': `Bearer ${token}`,
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Dynamics 365 API Error: ${error.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Dynamics 365 API request failed', error, { endpoint });
      throw error;
    }
  }

  // LEADS
  async createLead(leadData) {
    const dynamics365Lead = this.transformToD365Lead(leadData);

    const result = await this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(dynamics365Lead)
    });

    logger.info('Lead created in Dynamics 365', { leadId: result.leadid });
    return result;
  }

  async updateLead(leadId, leadData) {
    const dynamics365Lead = this.transformToD365Lead(leadData);

    await this.request(`/leads(${leadId})`, {
      method: 'PATCH',
      body: JSON.stringify(dynamics365Lead)
    });

    logger.info('Lead updated in Dynamics 365', { leadId });
  }

  async getLead(leadId) {
    return await this.request(`/leads(${leadId})`);
  }

  async searchLeads(searchTerm) {
    const filter = `contains(companyname, '${searchTerm}') or contains(subject, '${searchTerm}')`;
    return await this.request(`/leads?$filter=${encodeURIComponent(filter)}&$top=50`);
  }

  // CONTACTS
  async createContact(contactData) {
    const dynamics365Contact = this.transformToD365Contact(contactData);

    const result = await this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify(dynamics365Contact)
    });

    logger.info('Contact created in Dynamics 365', { contactId: result.contactid });
    return result;
  }

  async updateContact(contactId, contactData) {
    const dynamics365Contact = this.transformToD365Contact(contactData);

    await this.request(`/contacts(${contactId})`, {
      method: 'PATCH',
      body: JSON.stringify(dynamics365Contact)
    });

    logger.info('Contact updated in Dynamics 365', { contactId });
  }

  // ACTIVITIES (Tasks, Phone Calls, Emails)
  async createTask(taskData) {
    const task = {
      subject: taskData.subject,
      description: taskData.description,
      scheduledend: taskData.dueDate,
      prioritycode: taskData.priority === 'HAUTE' ? 2 : taskData.priority === 'MOYENNE' ? 1 : 0,
      // Link to lead
      'regardingobjectid_lead@odata.bind': `/leads(${taskData.leadId})`
    };

    const result = await this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    });

    logger.info('Task created in Dynamics 365', { taskId: result.activityid });
    return result;
  }

  async createPhoneCall(phoneCallData) {
    const phoneCall = {
      subject: phoneCallData.subject,
      description: phoneCallData.notes,
      actualdurationminutes: phoneCallData.duration,
      phonenumber: phoneCallData.phoneNumber,
      directioncode: phoneCallData.direction === 'outbound' ? false : true,
      // Link to lead
      'regardingobjectid_lead@odata.bind': `/leads(${phoneCallData.leadId})`
    };

    const result = await this.request('/phonecalls', {
      method: 'POST',
      body: JSON.stringify(phoneCall)
    });

    logger.info('Phone call logged in Dynamics 365', { phoneCallId: result.activityid });
    return result;
  }

  async createEmail(emailData) {
    const email = {
      subject: emailData.subject,
      description: emailData.body,
      directioncode: false, // Outgoing
      // Link to lead
      'regardingobjectid_lead@odata.bind': `/leads(${emailData.leadId})`
    };

    const result = await this.request('/emails', {
      method: 'POST',
      body: JSON.stringify(email)
    });

    logger.info('Email logged in Dynamics 365', { emailId: result.activityid });
    return result;
  }

  // OPPORTUNITIES
  async createOpportunity(opportunityData) {
    const opportunity = {
      name: opportunityData.name,
      description: opportunityData.description,
      estimatedvalue: opportunityData.estimatedValue,
      estimatedclosedate: opportunityData.estimatedCloseDate,
      // Link to account (if exists)
      ...(opportunityData.accountId && {
        'customerid_account@odata.bind': `/accounts(${opportunityData.accountId})`
      })
    };

    const result = await this.request('/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunity)
    });

    logger.info('Opportunity created in Dynamics 365', { opportunityId: result.opportunityid });
    return result;
  }

  // DATA TRANSFORMATION
  transformToD365Lead(leadData) {
    return {
      subject: leadData.companyName || 'New Lead',
      companyname: leadData.companyName,
      description: leadData.description,
      websiteurl: leadData.website,
      telephone1: leadData.phone,
      emailaddress1: leadData.email,
      address1_composite: leadData.address,
      numberofemployees: leadData.employeeCount,
      // Custom fields (if you've added them in Dynamics)
      // 'cr123_siret': leadData.siret,
      // 'cr123_nafcode': leadData.nafCode,
      // Priority mapping
      prioritycode: leadData.priority === 'HAUTE' ? 2 : leadData.priority === 'MOYENNE' ? 1 : 0,
      // Lead source
      leadsourcecode: this.mapLeadSource(leadData.source)
    };
  }

  transformToD365Contact(contactData) {
    return {
      firstname: contactData.name?.split(' ')[0] || '',
      lastname: contactData.name?.split(' ').slice(1).join(' ') || contactData.name || '',
      jobtitle: contactData.role,
      emailaddress1: contactData.email,
      telephone1: contactData.phone,
      mobilephone: contactData.mobile
    };
  }

  mapLeadSource(source) {
    // Map your sources to Dynamics 365 lead source codes
    const sourceMap = {
      'WEBSITE': 1,
      'REFERRAL': 2,
      'CAMPAIGN': 3,
      'EVENT': 4,
      'PARTNER': 5
    };
    return sourceMap[source] || 1;
  }

  // SYNC HELPERS
  async syncLeadToDynamics(yourAppLead) {
    try {
      // Check if lead already exists in Dynamics
      if (yourAppLead.dynamics365LeadId) {
        // Update existing
        await this.updateLead(yourAppLead.dynamics365LeadId, yourAppLead);
        return { action: 'updated', leadId: yourAppLead.dynamics365LeadId };
      } else {
        // Create new
        const result = await this.createLead(yourAppLead);
        return { action: 'created', leadId: result.leadid };
      }
    } catch (error) {
      logger.error('Failed to sync lead to Dynamics', error, { leadId: yourAppLead.id });
      throw error;
    }
  }
}

// Export singleton instance
export const dynamics365Client = new Dynamics365Client();
```

---

### Phase 4: Database Schema Updates (1 day)

#### Update Prisma Schema

Add to `prisma/schema.prisma`:

```prisma
model HotLead {
  id                  String   @id @default(cuid())
  // ... existing fields ...

  // Dynamics 365 Integration Fields
  dynamics365LeadId   String?  @unique @map("dynamics365_lead_id")
  dynamics365Synced   Boolean  @default(false) @map("dynamics365_synced")
  dynamics365SyncedAt DateTime? @map("dynamics365_synced_at")
  dynamics365SyncError String?  @map("dynamics365_sync_error")

  @@index([dynamics365LeadId])
  @@index([dynamics365Synced])
}

model LeadInteraction {
  id                     String   @id @default(cuid())
  // ... existing fields ...

  // Dynamics 365 Integration
  dynamics365ActivityId  String?  @unique @map("dynamics365_activity_id")
  dynamics365Synced      Boolean  @default(false) @map("dynamics365_synced")

  @@index([dynamics365ActivityId])
}
```

**Run migration**:
```bash
npx prisma migrate dev --name add_dynamics365_fields
npx prisma generate
```

---

### Phase 5: API Endpoints (2-3 days)

#### Create Sync Endpoint

Create `app/api/dynamics365/sync-lead/route.js`:

```javascript
import { dynamics365Client } from '@/lib/dynamics365/client';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request) {
  try {
    const { leadId } = await request.json();

    // Get lead from your database
    const lead = await prisma.hotLead.findUnique({
      where: { id: leadId },
      include: {
        managers: true,
        services: true,
        solutions: true
      }
    });

    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Sync to Dynamics 365
    const result = await dynamics365Client.syncLeadToDynamics(lead);

    // Update your database with Dynamics 365 ID
    await prisma.hotLead.update({
      where: { id: leadId },
      data: {
        dynamics365LeadId: result.leadId,
        dynamics365Synced: true,
        dynamics365SyncedAt: new Date()
      }
    });

    logger.info('Lead synced to Dynamics 365', { leadId, action: result.action });

    return Response.json({
      success: true,
      action: result.action,
      dynamics365LeadId: result.leadId
    });

  } catch (error) {
    logger.error('Failed to sync lead to Dynamics 365', error);

    // Store error in database
    if (request.body?.leadId) {
      await prisma.hotLead.update({
        where: { id: request.body.leadId },
        data: {
          dynamics365SyncError: error.message
        }
      });
    }

    return Response.json({
      error: 'Failed to sync to Dynamics 365',
      details: error.message
    }, { status: 500 });
  }
}
```

#### Create Bulk Sync Endpoint

Create `app/api/dynamics365/sync-all/route.js`:

```javascript
import { dynamics365Client } from '@/lib/dynamics365/client';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request) {
  try {
    // Get all unsynced leads
    const unsyncedLeads = await prisma.hotLead.findMany({
      where: {
        dynamics365Synced: false
      },
      include: {
        managers: true
      }
    });

    logger.info('Starting bulk sync', { count: unsyncedLeads.length });

    const results = {
      total: unsyncedLeads.length,
      synced: 0,
      failed: 0,
      errors: []
    };

    // Sync each lead
    for (const lead of unsyncedLeads) {
      try {
        const result = await dynamics365Client.syncLeadToDynamics(lead);

        await prisma.hotLead.update({
          where: { id: lead.id },
          data: {
            dynamics365LeadId: result.leadId,
            dynamics365Synced: true,
            dynamics365SyncedAt: new Date()
          }
        });

        results.synced++;
      } catch (error) {
        logger.error('Failed to sync lead', error, { leadId: lead.id });
        results.failed++;
        results.errors.push({
          leadId: lead.id,
          companyName: lead.companyName,
          error: error.message
        });

        await prisma.hotLead.update({
          where: { id: lead.id },
          data: {
            dynamics365SyncError: error.message
          }
        });
      }
    }

    return Response.json({
      success: true,
      results
    });

  } catch (error) {
    logger.error('Bulk sync failed', error);
    return Response.json({
      error: 'Bulk sync failed',
      details: error.message
    }, { status: 500 });
  }
}
```

#### Create Pull/Import Endpoint

Create `app/api/dynamics365/import-leads/route.js`:

```javascript
import { dynamics365Client } from '@/lib/dynamics365/client';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(request) {
  try {
    const { filter, maxRecords = 100 } = await request.json();

    // Fetch leads from Dynamics 365
    const d365Filter = filter || "statecode eq 0"; // Active leads only
    const endpoint = `/leads?$filter=${encodeURIComponent(d365Filter)}&$top=${maxRecords}`;

    const response = await dynamics365Client.request(endpoint);
    const d365Leads = response.value || [];

    logger.info('Fetched leads from Dynamics 365', { count: d365Leads.length });

    const results = {
      total: d365Leads.length,
      imported: 0,
      updated: 0,
      skipped: 0
    };

    // Import each lead
    for (const d365Lead of d365Leads) {
      try {
        // Check if lead already exists
        const existingLead = await prisma.hotLead.findUnique({
          where: { dynamics365LeadId: d365Lead.leadid }
        });

        const leadData = {
          companyName: d365Lead.companyname || d365Lead.subject,
          description: d365Lead.description,
          email: d365Lead.emailaddress1,
          phone: d365Lead.telephone1,
          website: d365Lead.websiteurl,
          address: d365Lead.address1_composite,
          employeeCount: d365Lead.numberofemployees,
          priority: d365Lead.prioritycode === 2 ? 'HAUTE' : d365Lead.prioritycode === 1 ? 'MOYENNE' : 'BASSE',
          dynamics365LeadId: d365Lead.leadid,
          dynamics365Synced: true,
          dynamics365SyncedAt: new Date()
        };

        if (existingLead) {
          // Update existing
          await prisma.hotLead.update({
            where: { id: existingLead.id },
            data: leadData
          });
          results.updated++;
        } else {
          // Create new
          await prisma.hotLead.create({
            data: leadData
          });
          results.imported++;
        }

      } catch (error) {
        logger.error('Failed to import lead', error, { leadId: d365Lead.leadid });
        results.skipped++;
      }
    }

    return Response.json({
      success: true,
      results
    });

  } catch (error) {
    logger.error('Import failed', error);
    return Response.json({
      error: 'Import failed',
      details: error.message
    }, { status: 500 });
  }
}
```

---

### Phase 6: UI Integration (2-3 days)

#### Add Sync Button to Hot Leads Page

Update `app/hot-leads/page.jsx`:

```javascript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function HotLeadsPage() {
  const [syncing, setSyncing] = useState(false);

  const syncToDynamics365 = async (leadId) => {
    setSyncing(true);
    try {
      const response = await fetch('/api/dynamics365/sync-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.action === 'created'
            ? 'Lead créé dans Dynamics 365!'
            : 'Lead mis à jour dans Dynamics 365!',
          {
            description: `ID Dynamics: ${data.dynamics365LeadId.substring(0, 8)}...`
          }
        );
        refresh(); // Refresh the list
      } else {
        toast.error('Erreur de synchronisation', {
          description: data.details
        });
      }
    } catch (error) {
      toast.error('Erreur de synchronisation', {
        description: error.message
      });
    } finally {
      setSyncing(false);
    }
  };

  const bulkSyncToDynamics365 = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/dynamics365/sync-all', {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Synchronisation terminée!', {
          description: `${data.results.synced} leads synchronisés, ${data.results.failed} erreurs`
        });
        refresh();
      } else {
        toast.error('Erreur de synchronisation');
      }
    } catch (error) {
      toast.error('Erreur de synchronisation');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      {/* Header with sync buttons */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hot Leads Manager</h1>
          <p className="text-gray-600">Gérez vos leads prioritaires Microsoft</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={bulkSyncToDynamics365}
            variant="outline"
            size="lg"
            disabled={syncing}
          >
            <Cloud className="w-5 h-5 mr-2" />
            {syncing ? 'Synchronisation...' : 'Sync Dynamics 365'}
          </Button>
          <Button onClick={refresh} variant="outline" size="lg">
            <RefreshCw className="w-5 h-5 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Lead cards */}
      {leads.map(lead => (
        <div key={lead.id} className="border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{lead.companyName}</h3>
              {lead.dynamics365Synced && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  Synchronisé avec Dynamics 365
                </span>
              )}
              {!lead.dynamics365Synced && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <CloudOff className="w-3 h-3" />
                  Non synchronisé
                </span>
              )}
            </div>
            <Button
              onClick={() => syncToDynamics365(lead.id)}
              variant="outline"
              size="sm"
              disabled={syncing}
            >
              <Cloud className="w-4 h-4 mr-1" />
              Sync D365
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### Phase 7: Automated Sync (Background Jobs) (2-3 days)

#### Create Background Sync Job

Create `lib/jobs/dynamics365-sync.js`:

```javascript
import { Queue, Worker } from 'bullmq';
import { redis } from '@/lib/redis';
import { dynamics365Client } from '@/lib/dynamics365/client';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

// Create sync queue
export const dynamics365SyncQueue = redis
  ? new Queue('dynamics365-sync', { connection: redis })
  : null;

// Enqueue sync job
export async function enqueueDynamics365Sync(leadId, priority = 'normal') {
  if (!dynamics365SyncQueue) {
    logger.warn('Redis not available, syncing immediately');
    return await syncLeadNow(leadId);
  }

  const job = await dynamics365SyncQueue.add(
    'sync-lead',
    { leadId },
    {
      priority: priority === 'high' ? 1 : 10,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    }
  );

  return { jobId: job.id, status: 'queued' };
}

// Immediate sync (fallback)
async function syncLeadNow(leadId) {
  const lead = await prisma.hotLead.findUnique({
    where: { id: leadId },
    include: { managers: true }
  });

  const result = await dynamics365Client.syncLeadToDynamics(lead);

  await prisma.hotLead.update({
    where: { id: leadId },
    data: {
      dynamics365LeadId: result.leadId,
      dynamics365Synced: true,
      dynamics365SyncedAt: new Date()
    }
  });

  return result;
}

// Worker to process sync jobs
if (dynamics365SyncQueue) {
  new Worker(
    'dynamics365-sync',
    async (job) => {
      const { leadId } = job.data;
      logger.info('Processing Dynamics 365 sync job', { leadId, jobId: job.id });

      return await syncLeadNow(leadId);
    },
    {
      connection: redis,
      concurrency: 5 // Process 5 syncs concurrently
    }
  );
}

// Schedule periodic sync (every 5 minutes)
export async function schedulePeriodic Sync() {
  if (!dynamics365SyncQueue) return;

  await dynamics365SyncQueue.add(
    'periodic-sync',
    {},
    {
      repeat: {
        pattern: '*/5 * * * *' // Every 5 minutes
      }
    }
  );

  logger.info('Periodic Dynamics 365 sync scheduled');
}
```

#### Auto-Sync on Lead Enrichment

Update `app/api/enrich-lead/route.js`:

```javascript
import { enqueueDynamics365Sync } from '@/lib/jobs/dynamics365-sync';

export async function POST(request) {
  // ... existing enrichment code ...

  // After successful enrichment
  const enrichedLead = await enrichLead(leadId);

  // Auto-sync to Dynamics 365
  try {
    await enqueueDynamics365Sync(leadId, 'high');
    logger.info('Lead queued for Dynamics 365 sync', { leadId });
  } catch (error) {
    logger.error('Failed to queue Dynamics 365 sync', error, { leadId });
    // Don't fail enrichment if sync fails
  }

  return Response.json({ success: true, lead: enrichedLead });
}
```

---

## 🔄 Data Mapping Guide

### Your App → Dynamics 365

| Your App Field | Dynamics 365 Field | Notes |
|----------------|-------------------|-------|
| companyName | companyname, subject | subject is lead title |
| description | description | Full description |
| email | emailaddress1 | Primary email |
| phone | telephone1 | Primary phone |
| website | websiteurl | Company website |
| address | address1_composite | Full address |
| employeeCount | numberofemployees | Integer |
| priority (HAUTE) | prioritycode (2) | High |
| priority (MOYENNE) | prioritycode (1) | Normal |
| priority (BASSE) | prioritycode (0) | Low |
| isOpportunity | qualifyingopportunity | Boolean |

### Custom Fields (Optional)

If you want to sync SIRET, NAF Code, etc., you need to create custom fields in Dynamics 365:

```
1. Go to Dynamics 365 Settings → Customizations
2. Navigate to Lead entity
3. Create custom fields:
   - cr123_siret (Text, 14 characters)
   - cr123_nafcode (Text, 10 characters)
   - cr123_enrichmentscore (Decimal)
4. Publish customizations
5. Update your code to include these fields
```

---

## 🎯 Integration Scenarios

### Scenario 1: One-Way Sync (Your App → Dynamics)

**Use Case**: Your app is the enrichment tool, Dynamics is the CRM

**Flow**:
```
1. Sales rep uses YOUR APP to enrich lead
2. YOUR APP calls Dynamics 365 API to create/update lead
3. Sales rep manages lead in DYNAMICS 365
4. YOUR APP is read-only for that lead going forward
```

**Pros**: Simple, no conflicts
**Cons**: Can't update lead info from Dynamics

---

### Scenario 2: Bidirectional Sync

**Use Case**: Sales reps work in both systems

**Flow**:
```
1. Change in YOUR APP → Sync to Dynamics 365
2. Change in DYNAMICS 365 → Webhook → Sync to YOUR APP
3. Conflict resolution: Last write wins (with timestamp)
```

**Pros**: Flexibility
**Cons**: Complex, potential conflicts

**Implementation**:
```javascript
// Add to your sync logic
async function resolveConflict(yourAppLead, d365Lead) {
  // Compare timestamps
  const yourAppUpdated = new Date(yourAppLead.updatedAt);
  const d365Updated = new Date(d365Lead.modifiedon);

  if (yourAppUpdated > d365Updated) {
    // Your app wins - sync to D365
    await dynamics365Client.updateLead(d365Lead.leadid, yourAppLead);
    return 'your_app_wins';
  } else {
    // D365 wins - update your app
    await prisma.hotLead.update({
      where: { id: yourAppLead.id },
      data: transformFromD365(d365Lead)
    });
    return 'd365_wins';
  }
}
```

---

### Scenario 3: Activity Logging

**Use Case**: Log all interactions back to Dynamics 365

**Implementation**:

```javascript
// When email is sent
await dynamics365Client.createEmail({
  leadId: lead.dynamics365LeadId,
  subject: emailSubject,
  body: emailBody
});

// When call is made
await dynamics365Client.createPhoneCall({
  leadId: lead.dynamics365LeadId,
  subject: 'Follow-up call',
  notes: callNotes,
  duration: 15,
  phoneNumber: lead.phone,
  direction: 'outbound'
});

// When task is created
await dynamics365Client.createTask({
  leadId: lead.dynamics365LeadId,
  subject: 'Send proposal',
  description: 'Send Microsoft 365 proposal',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  priority: 'HAUTE'
});
```

---

## 🎯 Testing Your Integration

### Test Checklist:

```bash
# 1. Test authentication
curl -X GET "https://[your-org].crm.dynamics.com/api/data/v9.2/WhoAmI" \
  -H "Authorization: Bearer [your-token]"

# Should return your user info

# 2. Test create lead
curl -X POST "https://[your-org].crm.dynamics.com/api/data/v9.2/leads" \
  -H "Authorization: Bearer [your-token]" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test Lead",
    "companyname": "Test Company"
  }'

# Should return 201 Created with leadid

# 3. Test update lead
curl -X PATCH "https://[your-org].crm.dynamics.com/api/data/v9.2/leads([leadid])" \
  -H "Authorization: Bearer [your-token]" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated description"
  }'

# Should return 204 No Content

# 4. Test get lead
curl -X GET "https://[your-org].crm.dynamics.com/api/data/v9.2/leads([leadid])" \
  -H "Authorization: Bearer [your-token]"

# Should return lead data
```

---

## 🚀 Deployment Checklist

### Before Production:

- [ ] Azure AD app registered
- [ ] API permissions granted
- [ ] Client secret secured in environment variables
- [ ] Authentication tested
- [ ] CRUD operations tested
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Rate limiting considered (Dynamics has limits)
- [ ] Background sync workers running
- [ ] Database schema updated
- [ ] UI updated with sync indicators
- [ ] User documentation created

---

## 📊 Monitoring & Maintenance

### Key Metrics to Track:

```javascript
// Track sync success rate
const syncMetrics = {
  totalSyncs: 0,
  successfulSyncs: 0,
  failedSyncs: 0,
  averageSyncTime: 0
};

// Log to analytics
await prisma.analyticsEvent.create({
  data: {
    eventType: 'dynamics365_sync',
    eventData: {
      action: 'sync_lead',
      duration: syncDuration,
      success: true
    }
  }
});
```

### Common Issues:

1. **Token expiration**: Tokens expire after 1 hour - handle refresh
2. **Rate limits**: Dynamics 365 has API rate limits - implement backoff
3. **Field mapping**: Keep mappings updated as schemas change
4. **Conflict resolution**: Handle concurrent updates gracefully

---

## 💰 Cost Considerations

### Dynamics 365 API Limits:

- **API calls per user per day**: 100,000 (includes reading, creating, updating)
- **Concurrent requests**: 52 per user
- **Request size**: 16 MB max

### Optimization Tips:

1. **Batch operations** where possible
2. **Cache frequently accessed data**
3. **Use webhooks** instead of polling for changes
4. **Implement smart sync** (only sync changed fields)

---

## 🎉 Summary

### What You'll Have After Integration:

- ✅ **Seamless sync** between your app and Dynamics 365
- ✅ **Single source of truth** (Dynamics 365 as master)
- ✅ **Automatic updates** (background jobs)
- ✅ **Activity logging** (all interactions tracked)
- ✅ **Conflict resolution** (smart sync logic)
- ✅ **Error handling** (robust retry logic)
- ✅ **Real-time status** (sync indicators in UI)

### Timeline:
- **Phase 1-2** (Authentication): 2-3 days
- **Phase 3** (API Client): 2-3 days
- **Phase 4-5** (Database & Endpoints): 2-3 days
- **Phase 6** (UI Integration): 2-3 days
- **Phase 7** (Background Jobs): 2-3 days
- **Testing & Polish**: 2-3 days

**Total**: 2-4 weeks for full implementation

---

## 📚 Additional Resources

- [Dynamics 365 Web API Documentation](https://docs.microsoft.com/en-us/powerapps/developer/data-platform/webapi/overview)
- [Azure AD Authentication](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Power Automate Connectors](https://docs.microsoft.com/en-us/power-automate/)

---

**Your app + Dynamics 365 = Unstoppable sales machine!** 🚀
