/**
 * Sync Engine - Bidirectional synchronization between app and Dynamics 365
 *
 * Handles:
 * - Lead synchronization (app <-> D365)
 * - Contact synchronization
 * - Activity logging (emails, calls, tasks)
 * - Conflict resolution
 * - Change tracking
 */

import { prisma } from '../database.js';
import Dynamics365Connector, {
  mapHotLeadToDynamics365,
  mapDynamics365ToHotLead
} from './dynamics365.js';

export class SyncEngine {
  constructor(config) {
    this.d365 = new Dynamics365Connector(config);
    this.lastSyncToken = null;
  }

  // ==========================================
  // LEAD SYNC: APP → DYNAMICS 365
  // ==========================================

  /**
   * Sync a single lead from app to Dynamics 365
   * @param {string} leadId - HotLead ID
   * @param {Object} options - Sync options
   * @returns {Promise<Object>} Sync result
   */
  async syncLeadToDynamics365(leadId, options = {}) {
    console.log(`🔄 Syncing lead ${leadId} to Dynamics 365...`);

    try {
      // Get lead from database
      const lead = await prisma.hotLead.findUnique({
        where: { id: leadId },
        include: {
          managers: true,
          services: true,
          specialties: true
        }
      });

      if (!lead) {
        throw new Error(`Lead not found: ${leadId}`);
      }

      // Check if already synced
      const syncRecord = await prisma.integrationSync.findFirst({
        where: {
          localId: leadId,
          externalSystem: 'dynamics365',
          entityType: 'lead'
        }
      });

      let d365Lead;

      if (syncRecord && syncRecord.externalId) {
        // Update existing lead in D365
        console.log(`📝 Updating existing D365 lead: ${syncRecord.externalId}`);

        const updates = mapHotLeadToDynamics365(lead);
        d365Lead = await this.d365.updateLead(syncRecord.externalId, updates);

        // Update sync record
        await prisma.integrationSync.update({
          where: { id: syncRecord.id },
          data: {
            lastSyncedAt: new Date(),
            syncStatus: 'synced',
            lastSyncData: d365Lead
          }
        });

      } else {
        // Create new lead in D365
        console.log(`📝 Creating new D365 lead for: ${lead.companyName}`);

        // Check if lead already exists by email
        if (lead.email) {
          const existing = await this.d365.findLeadByEmail(lead.email);
          if (existing) {
            console.log(`⚠️ Lead already exists in D365 with email ${lead.email}`);
            d365Lead = existing;
          }
        }

        // If not found, create new
        if (!d365Lead) {
          const leadData = mapHotLeadToDynamics365(lead);
          d365Lead = await this.d365.createLead(leadData);
        }

        // Create sync record
        await prisma.integrationSync.create({
          data: {
            localId: leadId,
            externalId: d365Lead.leadid,
            externalSystem: 'dynamics365',
            entityType: 'lead',
            direction: 'outbound',
            syncStatus: 'synced',
            lastSyncedAt: new Date(),
            lastSyncData: d365Lead
          }
        });
      }

      // Sync managers as notes
      if (lead.managers && lead.managers.length > 0 && options.syncManagers !== false) {
        await this.syncManagersAsNotes(d365Lead.leadid, lead.managers);
      }

      console.log(`✅ Lead synced successfully to Dynamics 365`);

      return {
        success: true,
        leadId: lead.id,
        d365LeadId: d365Lead.leadid,
        action: syncRecord ? 'updated' : 'created'
      };

    } catch (error) {
      console.error(`❌ Error syncing lead to Dynamics 365:`, error);

      // Log sync error
      await prisma.integrationSync.upsert({
        where: {
          localId_externalSystem_entityType: {
            localId: leadId,
            externalSystem: 'dynamics365',
            entityType: 'lead'
          }
        },
        create: {
          localId: leadId,
          externalSystem: 'dynamics365',
          entityType: 'lead',
          direction: 'outbound',
          syncStatus: 'failed',
          lastSyncError: error.message,
          lastSyncedAt: new Date()
        },
        update: {
          syncStatus: 'failed',
          lastSyncError: error.message,
          lastSyncedAt: new Date()
        }
      });

      throw error;
    }
  }

  /**
   * Sync managers as notes in Dynamics 365
   */
  async syncManagersAsNotes(d365LeadId, managers) {
    for (const manager of managers) {
      const noteText = `
Manager détecté lors de l'enrichissement:
- Nom: ${manager.name}
- Rôle: ${manager.role}
${manager.email ? `- Email: ${manager.email}` : ''}
${manager.phone ? `- Téléphone: ${manager.phone}` : ''}
      `.trim();

      try {
        await this.d365.createNote({
          leadId: d365LeadId,
          subject: `Manager: ${manager.name}`,
          notetext: noteText
        });
      } catch (error) {
        console.error(`⚠️ Failed to sync manager ${manager.name}:`, error.message);
      }
    }
  }

  // ==========================================
  // LEAD SYNC: DYNAMICS 365 → APP
  // ==========================================

  /**
   * Import a lead from Dynamics 365 to app
   * @param {string} d365LeadId - Dynamics 365 Lead ID
   * @returns {Promise<Object>} Imported lead
   */
  async importLeadFromDynamics365(d365LeadId) {
    console.log(`🔄 Importing lead from Dynamics 365: ${d365LeadId}`);

    try {
      // Get lead from D365
      const d365Lead = await this.d365.getLead(d365LeadId);

      // Check if already imported
      const syncRecord = await prisma.integrationSync.findFirst({
        where: {
          externalId: d365LeadId,
          externalSystem: 'dynamics365',
          entityType: 'lead'
        }
      });

      let hotLead;

      if (syncRecord && syncRecord.localId) {
        // Update existing lead
        console.log(`📝 Updating existing lead: ${syncRecord.localId}`);

        const updates = mapDynamics365ToHotLead(d365Lead);
        hotLead = await prisma.hotLead.update({
          where: { id: syncRecord.localId },
          data: updates
        });

        // Update sync record
        await prisma.integrationSync.update({
          where: { id: syncRecord.id },
          data: {
            lastSyncedAt: new Date(),
            syncStatus: 'synced',
            lastSyncData: d365Lead
          }
        });

      } else {
        // Create new lead
        console.log(`📝 Creating new lead from D365 data`);

        const leadData = mapDynamics365ToHotLead(d365Lead);
        hotLead = await prisma.hotLead.create({
          data: leadData
        });

        // Create sync record
        await prisma.integrationSync.create({
          data: {
            localId: hotLead.id,
            externalId: d365LeadId,
            externalSystem: 'dynamics365',
            entityType: 'lead',
            direction: 'inbound',
            syncStatus: 'synced',
            lastSyncedAt: new Date(),
            lastSyncData: d365Lead
          }
        });
      }

      console.log(`✅ Lead imported successfully from Dynamics 365`);

      return {
        success: true,
        leadId: hotLead.id,
        d365LeadId,
        action: syncRecord ? 'updated' : 'created'
      };

    } catch (error) {
      console.error(`❌ Error importing lead from Dynamics 365:`, error);
      throw error;
    }
  }

  // ==========================================
  // BIDIRECTIONAL SYNC
  // ==========================================

  /**
   * Sync all leads bidirectionally
   * @param {Object} options - Sync options
   */
  async syncAllLeads(options = {}) {
    console.log(`🔄 Starting bidirectional lead sync...`);

    const results = {
      toD365: { success: 0, failed: 0, errors: [] },
      fromD365: { success: 0, failed: 0, errors: [] }
    };

    try {
      // 1. Sync local leads to D365
      if (options.direction === 'bidirectional' || options.direction === 'to_d365') {
        console.log(`📤 Syncing local leads to Dynamics 365...`);

        const leadsToSync = await prisma.hotLead.findMany({
          where: {
            email: { not: null }, // Only sync leads with email
            ...(options.onlyEnriched && { enrichmentStatus: 'enriched' }),
            ...(options.priority && { priority: options.priority })
          },
          take: options.limit || 100
        });

        console.log(`Found ${leadsToSync.length} leads to sync to D365`);

        for (const lead of leadsToSync) {
          try {
            await this.syncLeadToDynamics365(lead.id);
            results.toD365.success++;
          } catch (error) {
            results.toD365.failed++;
            results.toD365.errors.push({
              leadId: lead.id,
              error: error.message
            });
          }
        }
      }

      // 2. Import D365 leads (using change tracking)
      if (options.direction === 'bidirectional' || options.direction === 'from_d365') {
        console.log(`📥 Importing leads from Dynamics 365...`);

        // Get changes from D365
        const changes = await this.d365.getChanges('leads', this.lastSyncToken);

        console.log(`Found ${changes.changes.length} changed leads in D365`);

        for (const d365Lead of changes.changes) {
          try {
            await this.importLeadFromDynamics365(d365Lead.leadid);
            results.fromD365.success++;
          } catch (error) {
            results.fromD365.failed++;
            results.fromD365.errors.push({
              d365LeadId: d365Lead.leadid,
              error: error.message
            });
          }
        }

        // Update sync token
        this.lastSyncToken = changes.deltaToken;
      }

      console.log(`✅ Bidirectional sync completed`);
      console.log(`To D365: ${results.toD365.success} success, ${results.toD365.failed} failed`);
      console.log(`From D365: ${results.fromD365.success} success, ${results.fromD365.failed} failed`);

      return results;

    } catch (error) {
      console.error(`❌ Error during bidirectional sync:`, error);
      throw error;
    }
  }

  // ==========================================
  // ACTIVITY SYNC
  // ==========================================

  /**
   * Log email activity in Dynamics 365
   * @param {Object} emailData - Email data from ClientInteraction
   */
  async logEmailInDynamics365(emailData) {
    console.log(`📧 Logging email activity in Dynamics 365`);

    try {
      // Find D365 lead ID from sync record
      const syncRecord = await prisma.integrationSync.findFirst({
        where: {
          localId: emailData.leadId,
          externalSystem: 'dynamics365',
          entityType: 'lead'
        }
      });

      if (!syncRecord) {
        console.log(`⚠️ Lead not synced to D365, skipping email log`);
        return null;
      }

      // Log email in D365
      const d365Email = await this.d365.logEmail({
        subject: emailData.subject,
        description: emailData.content,
        to: emailData.to,
        from: process.env.SMTP_FROM || 'nicolas.bayonne@kaelio.fr',
        regardingLeadId: syncRecord.externalId,
        directioncode: false // Outgoing
      });

      console.log(`✅ Email logged in Dynamics 365`);

      return d365Email;

    } catch (error) {
      console.error(`❌ Error logging email in Dynamics 365:`, error);
      // Don't throw - email logging is not critical
      return null;
    }
  }

  /**
   * Create task in Dynamics 365
   */
  async createTaskInDynamics365(taskData) {
    console.log(`📝 Creating task in Dynamics 365`);

    try {
      // Find D365 lead ID
      const syncRecord = await prisma.integrationSync.findFirst({
        where: {
          localId: taskData.leadId,
          externalSystem: 'dynamics365',
          entityType: 'lead'
        }
      });

      if (!syncRecord) {
        console.log(`⚠️ Lead not synced to D365, skipping task creation`);
        return null;
      }

      // Create task in D365
      const d365Task = await this.d365.createTask({
        subject: taskData.action,
        description: taskData.notes || null,
        scheduledend: taskData.deadline,
        prioritycode: taskData.priority === 'HAUTE' ? 2 : taskData.priority === 'MOYENNE' ? 1 : 0,
        regardingLeadId: syncRecord.externalId
      });

      console.log(`✅ Task created in Dynamics 365`);

      return d365Task;

    } catch (error) {
      console.error(`❌ Error creating task in Dynamics 365:`, error);
      return null;
    }
  }

  // ==========================================
  // ENRICHMENT SYNC
  // ==========================================

  /**
   * Update D365 lead with enrichment data
   * @param {string} leadId - HotLead ID
   * @param {Object} enrichmentData - Enrichment data
   */
  async syncEnrichmentToDynamics365(leadId, enrichmentData) {
    console.log(`🔍 Syncing enrichment data to Dynamics 365 for lead ${leadId}`);

    try {
      // Find D365 lead
      const syncRecord = await prisma.integrationSync.findFirst({
        where: {
          localId: leadId,
          externalSystem: 'dynamics365',
          entityType: 'lead'
        }
      });

      if (!syncRecord) {
        console.log(`⚠️ Lead not synced to D365, cannot update enrichment`);
        return null;
      }

      // Update D365 lead with enrichment data
      const updates = {
        new_siret: enrichmentData.siret,
        new_nafcode: enrichmentData.nafCode,
        new_employeecount: enrichmentData.employeeCount,
        new_turnover: enrichmentData.turnover,
        new_legalform: enrichmentData.legalForm,

        // Update description with enrichment info
        description: `
Lead enrichi automatiquement le ${new Date().toLocaleDateString('fr-FR')}:
- SIRET: ${enrichmentData.siret || 'N/A'}
- Code NAF: ${enrichmentData.nafCode || 'N/A'}
- Forme juridique: ${enrichmentData.legalForm || 'N/A'}
- Effectif: ${enrichmentData.employeeCount || 'N/A'}
- Chiffre d'affaires: ${enrichmentData.turnover || 'N/A'}
- Score de confiance: ${(enrichmentData.confidence * 100).toFixed(0)}%
- Sources: ${enrichmentData.sources?.join(', ') || 'N/A'}
        `.trim()
      };

      await this.d365.updateLead(syncRecord.externalId, updates);

      // Add note with detailed enrichment
      if (enrichmentData.managers && enrichmentData.managers.length > 0) {
        await this.syncManagersAsNotes(syncRecord.externalId, enrichmentData.managers);
      }

      console.log(`✅ Enrichment data synced to Dynamics 365`);

      return true;

    } catch (error) {
      console.error(`❌ Error syncing enrichment to Dynamics 365:`, error);
      return null;
    }
  }

  // ==========================================
  // QUALIFICATION / CONVERSION
  // ==========================================

  /**
   * Qualify lead in D365 when converted locally
   * @param {string} leadId - HotLead ID
   */
  async qualifyLeadInDynamics365(leadId) {
    console.log(`🎯 Qualifying lead in Dynamics 365: ${leadId}`);

    try {
      const syncRecord = await prisma.integrationSync.findFirst({
        where: {
          localId: leadId,
          externalSystem: 'dynamics365',
          entityType: 'lead'
        }
      });

      if (!syncRecord) {
        throw new Error('Lead not synced to D365');
      }

      // Qualify the lead (converts to Account, Contact, Opportunity)
      const result = await this.d365.qualifyLead(
        syncRecord.externalId,
        true,  // Create Account
        true,  // Create Contact
        true   // Create Opportunity
      );

      console.log(`✅ Lead qualified in Dynamics 365`);

      return result;

    } catch (error) {
      console.error(`❌ Error qualifying lead in Dynamics 365:`, error);
      throw error;
    }
  }
}

export default SyncEngine;
