-- CreateTable
CREATE TABLE "integration_syncs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "localId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalSystem" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "syncStatus" TEXT NOT NULL DEFAULT 'pending',
    "lastSyncedAt" DATETIME,
    "lastSyncError" TEXT,
    "lastSyncData" JSONB,
    "syncConfig" JSONB
);

-- CreateTable
CREATE TABLE "integration_configs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "system" TEXT NOT NULL,
    "credentials" JSONB NOT NULL,
    "config" JSONB NOT NULL,
    "fieldMapping" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" DATETIME
);

-- CreateIndex
CREATE INDEX "integration_syncs_externalId_idx" ON "integration_syncs"("externalId");

-- CreateIndex
CREATE INDEX "integration_syncs_externalSystem_idx" ON "integration_syncs"("externalSystem");

-- CreateIndex
CREATE INDEX "integration_syncs_syncStatus_idx" ON "integration_syncs"("syncStatus");

-- CreateIndex
CREATE UNIQUE INDEX "integration_syncs_localId_externalSystem_entityType_key" ON "integration_syncs"("localId", "externalSystem", "entityType");

-- CreateIndex
CREATE UNIQUE INDEX "integration_configs_system_key" ON "integration_configs"("system");
