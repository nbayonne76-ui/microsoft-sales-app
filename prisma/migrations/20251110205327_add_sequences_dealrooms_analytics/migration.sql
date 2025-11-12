-- CreateTable
CREATE TABLE "email_sequences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "goal" TEXT NOT NULL,
    "targetIndustry" TEXT,
    "targetCompanySize" TEXT,
    "targetRole" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "enrolledCount" INTEGER NOT NULL DEFAULT 0,
    "completedCount" INTEGER NOT NULL DEFAULT 0,
    "responseRate" REAL NOT NULL DEFAULT 0.0,
    "meetingRate" REAL NOT NULL DEFAULT 0.0,
    "aiInsights" JSONB
);

-- CreateTable
CREATE TABLE "sequence_steps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sequenceId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "delayDays" INTEGER NOT NULL,
    "delayHours" INTEGER NOT NULL DEFAULT 0,
    "subject" TEXT NOT NULL,
    "bodyTemplate" TEXT NOT NULL,
    "emailType" TEXT NOT NULL,
    "sendOnlyIf" JSONB,
    "hasVariants" BOOLEAN NOT NULL DEFAULT false,
    "variants" JSONB,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "openRate" REAL NOT NULL DEFAULT 0.0,
    "replyRate" REAL NOT NULL DEFAULT 0.0,
    CONSTRAINT "sequence_steps_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "email_sequences" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sequence_enrollments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "sequenceId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "exitReason" TEXT,
    "exitedAt" DATETIME,
    "nextStepDueAt" DATETIME,
    "emailsSent" INTEGER NOT NULL DEFAULT 0,
    "emailsOpened" INTEGER NOT NULL DEFAULT 0,
    "emailsClicked" INTEGER NOT NULL DEFAULT 0,
    "responded" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "sequence_enrollments_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "email_sequences" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sequence_enrollments_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "hot_leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "email_tracking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailId" TEXT NOT NULL,
    "leadId" TEXT,
    "subject" TEXT NOT NULL,
    "sentTo" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sequenceId" TEXT,
    "stepNumber" INTEGER,
    "opened" BOOLEAN NOT NULL DEFAULT false,
    "openedAt" DATETIME,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "clickedAt" DATETIME,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "replied" BOOLEAN NOT NULL DEFAULT false,
    "repliedAt" DATETIME,
    "bounced" BOOLEAN NOT NULL DEFAULT false,
    "unsubscribed" BOOLEAN NOT NULL DEFAULT false,
    "responseText" TEXT,
    "sentimentScore" REAL,
    "sentiment" TEXT,
    "intentDetected" TEXT,
    "aiSummary" TEXT,
    "extractedSignals" JSONB,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "email_tracking_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "hot_leads" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "deal_rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "leadId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "executiveSummary" TEXT NOT NULL,
    "proposedSolutions" JSONB NOT NULL,
    "pricingModel" TEXT NOT NULL,
    "totalMonthly" REAL,
    "totalAnnual" REAL,
    "discountPercent" REAL NOT NULL DEFAULT 0.0,
    "roiCalculation" JSONB,
    "implementationTimeline" TEXT,
    "keyMilestones" JSONB,
    "caseStudies" JSONB,
    "testimonials" JSONB,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "lastViewedAt" DATETIME,
    "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0,
    "questionsAsked" JSONB,
    "expiresAt" DATETIME,
    CONSTRAINT "deal_rooms_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "hot_leads" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "roi_calculations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leadId" TEXT,
    "companySize" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "currentCosts" JSONB NOT NULL,
    "solutions" JSONB NOT NULL,
    "monthlySavings" REAL NOT NULL,
    "annualSavings" REAL NOT NULL,
    "paybackMonths" INTEGER NOT NULL,
    "threeYearROI" REAL NOT NULL,
    "costBreakdown" JSONB NOT NULL,
    "savingsBreakdown" JSONB NOT NULL,
    "vsCompetitor" JSONB,
    CONSTRAINT "roi_calculations_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "hot_leads" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "response_intelligence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailTrackingId" TEXT,
    "responseType" TEXT NOT NULL,
    "primaryIntent" TEXT NOT NULL,
    "responseText" TEXT NOT NULL,
    "keyPhrases" JSONB NOT NULL,
    "mentionedCompetitors" JSONB,
    "mentionedBudget" BOOLEAN NOT NULL DEFAULT false,
    "mentionedTimeline" TEXT,
    "sentiment" TEXT NOT NULL,
    "sentimentScore" REAL NOT NULL,
    "urgencyLevel" TEXT NOT NULL,
    "industryPattern" TEXT,
    "rolePattern" TEXT,
    "companySizePattern" TEXT,
    "ledToMeeting" BOOLEAN NOT NULL DEFAULT false,
    "ledToDeal" BOOLEAN NOT NULL DEFAULT false,
    "suggestedResponse" TEXT,
    "suggestedNextStep" TEXT
);

-- CreateIndex
CREATE INDEX "email_sequences_isActive_idx" ON "email_sequences"("isActive");

-- CreateIndex
CREATE INDEX "email_sequences_goal_idx" ON "email_sequences"("goal");

-- CreateIndex
CREATE INDEX "sequence_steps_sequenceId_idx" ON "sequence_steps"("sequenceId");

-- CreateIndex
CREATE INDEX "sequence_steps_stepNumber_idx" ON "sequence_steps"("stepNumber");

-- CreateIndex
CREATE INDEX "sequence_enrollments_sequenceId_idx" ON "sequence_enrollments"("sequenceId");

-- CreateIndex
CREATE INDEX "sequence_enrollments_leadId_idx" ON "sequence_enrollments"("leadId");

-- CreateIndex
CREATE INDEX "sequence_enrollments_status_idx" ON "sequence_enrollments"("status");

-- CreateIndex
CREATE INDEX "sequence_enrollments_nextStepDueAt_idx" ON "sequence_enrollments"("nextStepDueAt");

-- CreateIndex
CREATE UNIQUE INDEX "sequence_enrollments_sequenceId_leadId_key" ON "sequence_enrollments"("sequenceId", "leadId");

-- CreateIndex
CREATE UNIQUE INDEX "email_tracking_emailId_key" ON "email_tracking"("emailId");

-- CreateIndex
CREATE INDEX "email_tracking_leadId_idx" ON "email_tracking"("leadId");

-- CreateIndex
CREATE INDEX "email_tracking_sentAt_idx" ON "email_tracking"("sentAt");

-- CreateIndex
CREATE INDEX "email_tracking_opened_idx" ON "email_tracking"("opened");

-- CreateIndex
CREATE INDEX "email_tracking_replied_idx" ON "email_tracking"("replied");

-- CreateIndex
CREATE INDEX "deal_rooms_leadId_idx" ON "deal_rooms"("leadId");

-- CreateIndex
CREATE INDEX "deal_rooms_status_idx" ON "deal_rooms"("status");

-- CreateIndex
CREATE INDEX "roi_calculations_leadId_idx" ON "roi_calculations"("leadId");

-- CreateIndex
CREATE INDEX "response_intelligence_responseType_idx" ON "response_intelligence"("responseType");

-- CreateIndex
CREATE INDEX "response_intelligence_sentiment_idx" ON "response_intelligence"("sentiment");

-- CreateIndex
CREATE INDEX "response_intelligence_createdAt_idx" ON "response_intelligence"("createdAt");
