-- CreateIndex
CREATE INDEX "clients_updatedAt_idx" ON "clients"("updatedAt");

-- CreateIndex
CREATE INDEX "clients_status_priority_idx" ON "clients"("status", "priority");

-- CreateIndex
CREATE INDEX "clients_createdAt_idx" ON "clients"("createdAt");
