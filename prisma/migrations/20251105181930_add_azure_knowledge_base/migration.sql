-- CreateTable
CREATE TABLE "azure_solutions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "officialName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "shortDescription" TEXT NOT NULL,
    "fullDescription" TEXT NOT NULL,
    "keyFeatures" JSONB NOT NULL,
    "benefits" JSONB NOT NULL,
    "useCases" JSONB NOT NULL,
    "targetIndustries" JSONB NOT NULL,
    "idealCustomerSize" TEXT NOT NULL,
    "targetPersonas" JSONB NOT NULL,
    "pricingModel" TEXT NOT NULL,
    "pricingTiers" JSONB NOT NULL,
    "estimatedCost" TEXT,
    "implementationTime" TEXT,
    "complexity" TEXT NOT NULL,
    "prerequisites" JSONB,
    "integrations" JSONB,
    "competitorComparison" JSONB,
    "salesPriority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "keywords" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "relatedSolutions" JSONB,
    "technicalSpecs" JSONB,
    "securityFeatures" JSONB,
    "complianceCerts" JSONB,
    "documentationUrl" TEXT,
    "pricingUrl" TEXT,
    "demoUrl" TEXT,
    "caseStudyUrls" JSONB
);

-- CreateTable
CREATE TABLE "azure_pitches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "solutionId" TEXT NOT NULL,
    "pitchType" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "hook" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "solutionText" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "socialProof" TEXT,
    "callToAction" TEXT NOT NULL,
    "commonObjections" JSONB NOT NULL,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" REAL NOT NULL DEFAULT 0.0,
    CONSTRAINT "azure_pitches_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "azure_solutions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "battle_cards" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "solutionId" TEXT NOT NULL,
    "competitorName" TEXT NOT NULL,
    "competitorSolution" TEXT NOT NULL,
    "ourStrengths" JSONB NOT NULL,
    "theirWeaknesses" JSONB NOT NULL,
    "keyDifferentiators" JSONB NOT NULL,
    "pricingComparison" TEXT NOT NULL,
    "trapQuestions" JSONB NOT NULL,
    "landmines" JSONB NOT NULL,
    "winStories" JSONB,
    CONSTRAINT "battle_cards_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "azure_solutions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "solution_recommendations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leadId" TEXT NOT NULL,
    "leadName" TEXT NOT NULL,
    "solutionId" TEXT NOT NULL,
    "solutionName" TEXT NOT NULL,
    "matchScore" REAL NOT NULL,
    "reasoning" JSONB NOT NULL,
    "confidence" REAL NOT NULL,
    "leadContext" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "feedback" TEXT,
    "converted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "azure_solutions_name_key" ON "azure_solutions"("name");

-- CreateIndex
CREATE INDEX "azure_solutions_category_idx" ON "azure_solutions"("category");

-- CreateIndex
CREATE INDEX "azure_solutions_salesPriority_idx" ON "azure_solutions"("salesPriority");

-- CreateIndex
CREATE INDEX "azure_solutions_isActive_idx" ON "azure_solutions"("isActive");

-- CreateIndex
CREATE INDEX "azure_pitches_solutionId_idx" ON "azure_pitches"("solutionId");

-- CreateIndex
CREATE INDEX "azure_pitches_pitchType_idx" ON "azure_pitches"("pitchType");

-- CreateIndex
CREATE INDEX "battle_cards_solutionId_idx" ON "battle_cards"("solutionId");

-- CreateIndex
CREATE INDEX "battle_cards_competitorName_idx" ON "battle_cards"("competitorName");

-- CreateIndex
CREATE INDEX "solution_recommendations_leadId_idx" ON "solution_recommendations"("leadId");

-- CreateIndex
CREATE INDEX "solution_recommendations_solutionId_idx" ON "solution_recommendations"("solutionId");

-- CreateIndex
CREATE INDEX "solution_recommendations_status_idx" ON "solution_recommendations"("status");
