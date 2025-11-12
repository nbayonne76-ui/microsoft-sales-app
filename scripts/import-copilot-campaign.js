/**
 * Script d'import pour la campagne Copilot
 * Import des vraies données depuis le fichier Excel
 */

const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const fs = require('fs');

const prisma = new PrismaClient();

/**
 * Nettoyer et formater le numéro de téléphone
 */
function cleanPhone(phone) {
  if (!phone) return null;
  return String(phone).replace(/[^\d\s\+\-\(\)]/g, '').trim() || null;
}

/**
 * Nettoyer l'email
 */
function cleanEmail(email) {
  if (!email) return null;
  const cleaned = String(email).trim().toLowerCase();
  // Vérifier format email basique
  return cleaned.includes('@') && cleaned.includes('.') ? cleaned : null;
}

/**
 * Mapper la priorité
 */
function mapPriority(priority) {
  const priorityMap = {
    'HAUTE': 'HAUTE',
    'MOYENNE': 'MOYENNE',
    'BASSE': 'BASSE',
    'À DÉFINIR': 'MOYENNE'
  };
  return priorityMap[priority] || 'MOYENNE';
}

/**
 * Mapper le statut de campagne
 */
function mapCampaignStatus(status) {
  if (!status) return 'active';

  const statusLower = String(status).toLowerCase();

  if (statusLower.includes('audit') || statusLower.includes('en cours')) {
    return 'contacted';
  }
  if (statusLower.includes('lost') || statusLower.includes('perdu')) {
    return 'lost';
  }
  if (statusLower.includes('won') || statusLower.includes('gagné')) {
    return 'won';
  }
  if (statusLower.includes('send') || statusLower.includes('sent')) {
    return 'contacted';
  }

  return 'active';
}

/**
 * Extraire le montant de l'opportunité
 */
function parseOpportunityAmount(codeOpp) {
  if (!codeOpp) return null;

  const match = String(codeOpp).match(/(\d+)[kK]\$/);
  if (match) {
    return parseInt(match[1]) * 1000;
  }

  const numMatch = String(codeOpp).match(/(\d+)/);
  if (numMatch) {
    return parseInt(numMatch[1]);
  }

  return null;
}

/**
 * Importer les leads depuis le fichier Excel Copilot Campaign
 */
async function importCopilotCampaign(filePath) {
  console.log('📂 Lecture du fichier Excel:', filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier introuvable: ${filePath}`);
  }

  // Lire le fichier Excel
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convertir en JSON (avec header row)
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log(`📊 Trouvé ${rawData.length} lignes dans le fichier`);
  console.log(`📄 Feuille: ${sheetName}`);

  // Skip header row (première ligne)
  const dataRows = rawData.slice(1);

  let stats = {
    total: 0,
    updated: 0,
    created: 0,
    skipped: 0,
    errors: 0
  };

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    stats.total++;

    // Extraire les données selon la structure réelle
    const priorite = row[0];         // A: Priorité
    const entreprise = row[1];       // B: Entreprise
    const statutCampagne = row[2];   // C: Statut Campagne
    const distributeur = row[3];     // D: Distributeur
    const commercial1 = row[4];      // E: Commercial 1
    const commercial2 = row[5];      // F: Commercial 2
    const emailContact = row[6];     // G: Email Contact
    const telephone = row[7];        // H: Téléphone
    const idClient = row[8];         // I: ID Client
    const codeOpportunity = row[9];  // J: Code Opportunity
    const notes = row[10];           // K: Notes
    const actionAFaire = row[11];    // L: Action à Faire
    const dateContact = row[12];     // M: Date Contact
    const reductionProposee = row[13]; // N: % Réduction Proposée

    // Valider que nous avons au moins un nom d'entreprise
    if (!entreprise || entreprise === '' || entreprise === 'Entreprise') {
      stats.skipped++;
      continue;
    }

    try {
      console.log(`\n🔄 Traitement [${i + 1}/${dataRows.length}]: ${entreprise}`);

      // Préparer les données nettoyées
      const leadData = {
        companyName: String(entreprise).trim(),
        phone: cleanPhone(telephone),
        email: cleanEmail(emailContact),
        priority: mapPriority(priorite),
        status: mapCampaignStatus(statutCampagne),
        source: 'copilot_campaign',
        campaignName: 'Campagne Copilot 2025',
        enrichmentStatus: 'pending'
      };

      // Ajouter la description avec les notes
      const descriptionParts = [];
      if (statutCampagne) descriptionParts.push(`Statut: ${statutCampagne}`);
      if (notes) descriptionParts.push(`Notes: ${notes}`);
      if (actionAFaire) descriptionParts.push(`Action: ${actionAFaire}`);
      if (codeOpportunity) {
        const amount = parseOpportunityAmount(codeOpportunity);
        if (amount) {
          descriptionParts.push(`Opportunité: $${amount.toLocaleString()}`);
          leadData.isOpportunity = true;
        }
      }
      if (reductionProposee) descriptionParts.push(`Réduction: ${reductionProposee}`);

      if (descriptionParts.length > 0) {
        leadData.description = descriptionParts.join(' | ');
      }

      // Chercher si le lead existe déjà
      let existingLead = null;

      // 1. Chercher par ID client si disponible
      if (idClient) {
        existingLead = await prisma.hotLead.findFirst({
          where: { description: { contains: String(idClient) } }
        });
      }

      // 2. Chercher par nom d'entreprise
      if (!existingLead) {
        existingLead = await prisma.hotLead.findFirst({
          where: {
            companyName: leadData.companyName
          }
        });
      }

      if (existingLead) {
        // Mettre à jour le lead existant
        const updateData = {};

        // Ne mettre à jour que si les nouvelles données sont meilleures
        if (leadData.phone && !existingLead.phone) updateData.phone = leadData.phone;
        if (leadData.email && !existingLead.email) updateData.email = leadData.email;
        if (leadData.priority !== 'MOYENNE') updateData.priority = leadData.priority;
        if (leadData.description) updateData.description = leadData.description;
        if (leadData.status) updateData.status = leadData.status;
        if (leadData.campaignName) updateData.campaignName = leadData.campaignName;
        if (leadData.isOpportunity) updateData.isOpportunity = true;

        if (Object.keys(updateData).length > 0) {
          await prisma.hotLead.update({
            where: { id: existingLead.id },
            data: updateData
          });
          console.log(`  ✅ Mis à jour: ${entreprise}`);
          console.log(`     - Champs mis à jour: ${Object.keys(updateData).join(', ')}`);
          stats.updated++;
        } else {
          console.log(`  ⏭️  Déjà à jour: ${entreprise}`);
          stats.skipped++;
        }
      } else {
        // Créer un nouveau lead
        const newLead = await prisma.hotLead.create({
          data: {
            ...leadData,
            isOpportunity: leadData.isOpportunity || false
          }
        });
        console.log(`  ✨ Créé: ${entreprise} (ID: ${newLead.id})`);
        stats.created++;
      }

    } catch (error) {
      console.error(`  ❌ Erreur pour ${entreprise}:`, error.message);
      stats.errors++;
    }
  }

  return stats;
}

/**
 * Main
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('       IMPORT CAMPAGNE COPILOT 2025');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const defaultPath = 'C:/Users/v-nbayonne/Downloads/Copilot_Campaign_ORGANISE_2025-10-17.xlsx';
  const excelPath = process.argv[2] || defaultPath;

  try {
    const stats = await importCopilotCampaign(excelPath);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                RÉSULTATS DE L\'IMPORT');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📊 Total traité:     ${stats.total}`);
    console.log(`✅ Mis à jour:       ${stats.updated}`);
    console.log(`✨ Créés:            ${stats.created}`);
    console.log(`⏭️  Ignorés:          ${stats.skipped}`);
    console.log(`❌ Erreurs:          ${stats.errors}`);
    console.log('═══════════════════════════════════════════════════════════════');

    const successRate = ((stats.updated + stats.created) / stats.total * 100).toFixed(1);
    console.log(`\n🎯 Taux de succès: ${successRate}%`);
    console.log(`\n✅ Import terminé avec succès!\n`);

  } catch (error) {
    console.error('\n❌ Erreur fatale:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
