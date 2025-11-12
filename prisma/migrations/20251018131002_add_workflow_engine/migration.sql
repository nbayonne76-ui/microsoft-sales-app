-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "company" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "industry" TEXT,
    "employeeCount" INTEGER,
    "currentChallenges" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactRole" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'active',
    "assignedManager" TEXT NOT NULL DEFAULT 'Nicolas BAYONNE'
);

-- CreateTable
CREATE TABLE "client_interactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT,
    "context" TEXT,
    "intent" TEXT,
    "messageId" TEXT,
    "jobId" TEXT,
    "sentiment" TEXT NOT NULL DEFAULT 'neutral',
    "responseReceived" BOOLEAN NOT NULL DEFAULT false,
    "responseContent" TEXT,
    "responseSentiment" TEXT,
    "nextAction" TEXT,
    "nextActionDate" DATETIME,
    "outcome" TEXT,
    "openedAt" DATETIME,
    "clickedAt" DATETIME,
    "respondedAt" DATETIME,
    CONSTRAINT "client_interactions_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "segment" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "reasoning" TEXT,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" REAL NOT NULL DEFAULT 0.0
);

-- CreateTable
CREATE TABLE "email_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "date" DATETIME NOT NULL,
    "segment" TEXT NOT NULL,
    "emailsGenerated" INTEGER NOT NULL DEFAULT 0,
    "emailsSent" INTEGER NOT NULL DEFAULT 0,
    "delivered" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "clicked" INTEGER NOT NULL DEFAULT 0,
    "replied" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "sentimentPositive" INTEGER NOT NULL DEFAULT 0,
    "sentimentNeutral" INTEGER NOT NULL DEFAULT 0,
    "sentimentNegative" INTEGER NOT NULL DEFAULT 0,
    "deliveryRate" REAL NOT NULL DEFAULT 0.0,
    "openRate" REAL NOT NULL DEFAULT 0.0,
    "clickRate" REAL NOT NULL DEFAULT 0.0,
    "responseRate" REAL NOT NULL DEFAULT 0.0
);

-- CreateTable
CREATE TABLE "email_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "messageId" TEXT NOT NULL,
    "jobId" TEXT,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "campaignId" TEXT,
    "segment" TEXT,
    "source" TEXT NOT NULL DEFAULT 'queue',
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventType" TEXT NOT NULL,
    "eventCategory" TEXT NOT NULL,
    "eventData" JSONB NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "metadata" JSONB
);

-- CreateTable
CREATE TABLE "email_feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "interactionId" TEXT NOT NULL,
    "qualityRating" INTEGER,
    "relevanceRating" INTEGER,
    "toneRating" INTEGER,
    "feedbackText" TEXT,
    "suggestedImprovement" TEXT,
    "feedbackSource" TEXT NOT NULL DEFAULT 'manual',
    "feedbackType" TEXT NOT NULL,
    "wasUsedForTraining" BOOLEAN NOT NULL DEFAULT false,
    "improvedVersion" TEXT,
    CONSTRAINT "email_feedback_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "client_interactions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "learning_patterns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "patternType" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "segment" TEXT,
    "pattern" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "occurrences" INTEGER NOT NULL DEFAULT 1,
    "successRate" REAL NOT NULL DEFAULT 0.0,
    "confidenceScore" REAL NOT NULL DEFAULT 0.0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsed" DATETIME
);

-- CreateTable
CREATE TABLE "ab_tests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "testType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "trafficSplit" JSONB NOT NULL,
    "minSampleSize" INTEGER NOT NULL DEFAULT 20,
    "confidenceLevel" REAL NOT NULL DEFAULT 0.95,
    "baseTemplateId" TEXT,
    "winningVariantId" TEXT,
    "confidence" REAL NOT NULL DEFAULT 0.0
);

-- CreateTable
CREATE TABLE "test_variants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "abTestId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isControl" BOOLEAN NOT NULL DEFAULT false,
    "trafficPercentage" INTEGER NOT NULL DEFAULT 50,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "changes" JSONB NOT NULL,
    "totalAssigned" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "test_variants_abTestId_fkey" FOREIGN KEY ("abTestId") REFERENCES "ab_tests" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "variant_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "variantId" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "timestamp" DATETIME NOT NULL,
    "metadata" JSONB,
    CONSTRAINT "variant_assignments_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "test_variants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "test_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "variantId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" REAL NOT NULL DEFAULT 1.0,
    "timestamp" DATETIME NOT NULL,
    "metadata" JSONB,
    CONSTRAINT "test_results_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "test_variants" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "hot_leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "companyName" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "employeeCount" INTEGER,
    "legalForm" TEXT,
    "capitalSocial" TEXT,
    "siret" TEXT,
    "tvaNumber" TEXT,
    "nafCode" TEXT,
    "creationDate" TEXT,
    "closingDate" TEXT,
    "turnover" TEXT,
    "isOpportunity" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL DEFAULT 'MOYENNE',
    "status" TEXT NOT NULL DEFAULT 'active',
    "source" TEXT,
    "campaignName" TEXT,
    "enrichmentStatus" TEXT NOT NULL DEFAULT 'pending',
    "enrichedAt" DATETIME,
    "enrichmentSource" TEXT,
    "clientId" TEXT,
    CONSTRAINT "hot_leads_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "managers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hotLeadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    CONSTRAINT "managers_hotLeadId_fkey" FOREIGN KEY ("hotLeadId") REFERENCES "hot_leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hotLeadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "expertise" TEXT,
    CONSTRAINT "team_members_hotLeadId_fkey" FOREIGN KEY ("hotLeadId") REFERENCES "hot_leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hotLeadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "services_hotLeadId_fkey" FOREIGN KEY ("hotLeadId") REFERENCES "hot_leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hotLeadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    CONSTRAINT "specialties_hotLeadId_fkey" FOREIGN KEY ("hotLeadId") REFERENCES "hot_leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "microsoft_solutions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "hotLeadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "price" TEXT,
    "benefits" JSONB NOT NULL,
    "useCases" JSONB NOT NULL,
    "implementation" TEXT,
    CONSTRAINT "microsoft_solutions_hotLeadId_fkey" FOREIGN KEY ("hotLeadId") REFERENCES "hot_leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lead_interactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hotLeadId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "participants" TEXT,
    CONSTRAINT "lead_interactions_hotLeadId_fkey" FOREIGN KEY ("hotLeadId") REFERENCES "hot_leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "lead_actions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hotLeadId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "deadline" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "assignedTo" TEXT,
    CONSTRAINT "lead_actions_hotLeadId_fkey" FOREIGN KEY ("hotLeadId") REFERENCES "hot_leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "triggerType" TEXT NOT NULL,
    "triggerConfig" JSONB,
    "targetSegment" TEXT,
    "targetPriority" TEXT,
    "totalExecutions" INTEGER NOT NULL DEFAULT 0,
    "activeExecutions" INTEGER NOT NULL DEFAULT 0,
    "completedExecutions" INTEGER NOT NULL DEFAULT 0,
    "successRate" REAL NOT NULL DEFAULT 0.0
);

-- CreateTable
CREATE TABLE "workflow_steps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workflowId" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "stepType" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "executeIf" JSONB,
    CONSTRAINT "workflow_steps_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workflow_executions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "workflowId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "leadName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentStepOrder" INTEGER NOT NULL DEFAULT 0,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "pausedAt" DATETIME,
    "totalSteps" INTEGER NOT NULL DEFAULT 0,
    "completedSteps" INTEGER NOT NULL DEFAULT 0,
    "failedSteps" INTEGER NOT NULL DEFAULT 0,
    "emailsSent" INTEGER NOT NULL DEFAULT 0,
    "emailsOpened" INTEGER NOT NULL DEFAULT 0,
    "emailsClicked" INTEGER NOT NULL DEFAULT 0,
    "emailsReplied" INTEGER NOT NULL DEFAULT 0,
    "context" JSONB,
    CONSTRAINT "workflow_executions_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "workflows" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "step_executions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "executionId" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "scheduledFor" DATETIME,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "result" JSONB,
    "error" TEXT,
    "jobId" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    CONSTRAINT "step_executions_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "workflow_executions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "step_executions_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "workflow_steps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "workflow_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "templateData" JSONB NOT NULL,
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "averageSuccessRate" REAL NOT NULL DEFAULT 0.0,
    "recommendedFor" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_contactEmail_key" ON "clients"("contactEmail");

-- CreateIndex
CREATE INDEX "client_interactions_messageId_idx" ON "client_interactions"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "email_metrics_date_segment_key" ON "email_metrics"("date", "segment");

-- CreateIndex
CREATE INDEX "email_events_messageId_idx" ON "email_events"("messageId");

-- CreateIndex
CREATE INDEX "email_events_eventType_idx" ON "email_events"("eventType");

-- CreateIndex
CREATE INDEX "email_events_recipient_idx" ON "email_events"("recipient");

-- CreateIndex
CREATE INDEX "email_events_createdAt_idx" ON "email_events"("createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_eventType_idx" ON "analytics_events"("eventType");

-- CreateIndex
CREATE INDEX "analytics_events_eventCategory_idx" ON "analytics_events"("eventCategory");

-- CreateIndex
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "hot_leads_clientId_key" ON "hot_leads"("clientId");

-- CreateIndex
CREATE INDEX "workflow_executions_leadId_idx" ON "workflow_executions"("leadId");

-- CreateIndex
CREATE INDEX "workflow_executions_status_idx" ON "workflow_executions"("status");

-- CreateIndex
CREATE INDEX "step_executions_status_idx" ON "step_executions"("status");

-- CreateIndex
CREATE INDEX "step_executions_scheduledFor_idx" ON "step_executions"("scheduledFor");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_templates_name_key" ON "workflow_templates"("name");
