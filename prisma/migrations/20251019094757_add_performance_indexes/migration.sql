-- CreateIndex
CREATE INDEX "client_interactions_clientId_idx" ON "client_interactions"("clientId");

-- CreateIndex
CREATE INDEX "client_interactions_type_idx" ON "client_interactions"("type");

-- CreateIndex
CREATE INDEX "client_interactions_status_idx" ON "client_interactions"("status");

-- CreateIndex
CREATE INDEX "client_interactions_createdAt_idx" ON "client_interactions"("createdAt");

-- CreateIndex
CREATE INDEX "clients_company_idx" ON "clients"("company");

-- CreateIndex
CREATE INDEX "clients_segment_idx" ON "clients"("segment");

-- CreateIndex
CREATE INDEX "clients_status_idx" ON "clients"("status");

-- CreateIndex
CREATE INDEX "clients_priority_idx" ON "clients"("priority");

-- CreateIndex
CREATE INDEX "clients_contactEmail_idx" ON "clients"("contactEmail");

-- CreateIndex
CREATE INDEX "email_templates_category_idx" ON "email_templates"("category");

-- CreateIndex
CREATE INDEX "email_templates_segment_idx" ON "email_templates"("segment");

-- CreateIndex
CREATE INDEX "email_templates_tone_idx" ON "email_templates"("tone");

-- CreateIndex
CREATE INDEX "hot_leads_companyName_idx" ON "hot_leads"("companyName");

-- CreateIndex
CREATE INDEX "hot_leads_status_idx" ON "hot_leads"("status");

-- CreateIndex
CREATE INDEX "hot_leads_priority_idx" ON "hot_leads"("priority");

-- CreateIndex
CREATE INDEX "hot_leads_enrichmentStatus_idx" ON "hot_leads"("enrichmentStatus");

-- CreateIndex
CREATE INDEX "hot_leads_siret_idx" ON "hot_leads"("siret");

-- CreateIndex
CREATE INDEX "hot_leads_createdAt_idx" ON "hot_leads"("createdAt");

-- CreateIndex
CREATE INDEX "workflow_steps_workflowId_idx" ON "workflow_steps"("workflowId");

-- CreateIndex
CREATE INDEX "workflow_steps_stepOrder_idx" ON "workflow_steps"("stepOrder");

-- CreateIndex
CREATE INDEX "workflows_status_idx" ON "workflows"("status");

-- CreateIndex
CREATE INDEX "workflows_category_idx" ON "workflows"("category");

-- CreateIndex
CREATE INDEX "workflows_triggerType_idx" ON "workflows"("triggerType");
