/**
 * Script d'import pour corriger les informations des Hot Leads
 * Utilise les vraies données du fichier Excel
 */

import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

/**
 * Mapping des colonnes Excel vers les champs de la base de données
 */
const COLUMN_MAPPING = {
  companyName: 'A',      // Nom de l'entreprise
  siret: 'B',            // SIRET
  partner: 'C',          // Partenaire
  phone: 'D',            // Téléphone
  assigned: 'E',         // Assign
  employeeCount: 'F',    // Effectif
  status: 'G',           // Statut de progression
  email: 'H',            // Email
  partnerTier2: 'I',     // Partenaire tier 2
  comments: 'J'          // Commentaires
};

/**
 * Parse la valeur d'effectif (ex: "24k" -> 24000, "311 (H)" -> 311)
 */
function parseEmployeeCount(value) {
  if (!value || value === 'NA') return null;

  // Remove parentheses content
  let cleaned = String(value).replace(/\(.*?\)/g, '').trim();

  // Handle "k" suffix (thousands)
  if (cleaned.endsWith('k')) {
    return parseInt(cleaned.replace('k', '')) * 1000;
  }

  // Handle numeric values
  const num = parseInt(cleaned.replace(/[^\d]/g, ''));
  return isNaN(num) ? null : num;
}

/**
 * Nettoyer et formater le numéro de téléphone
 */
function cleanPhone(phone) {
  if (!phone) return null;
  // Garder uniquement les chiffres et certains caractères
  return String(phone).replace(/[^\d\s\+\-\(\)]/g, '').trim() || null;
}

/**
 * Nettoyer le SIRET
 */
function cleanSIRET(siret) {
  if (!siret) return null;
  const cleaned = String(siret).replace(/[^\d]/g, '');
  return cleaned.length === 14 ? cleaned : null;
}

/**
 * Mapper le statut de progression
 */
function mapStatus(excelStatus) {
  const statusMap = {
    'Sent/Intro': 'contacted',
    'Sent/Audit': 'contacted',
    'SentAudit': 'contacted',
    'Sent every way possible': 'contacted',
    'New capital campaign / Audit': 'new',
    'New capital campaign': 'new',
    'Sent Intro': 'contacted',
    'Audit': 'contacted',
    'Not Assign': 'active',
    'Assign': 'active'
  };

  return statusMap[excelStatus] || 'active';
}

/**
 * Importer les leads depuis le fichier Excel
 */
async function importLeadsFromExcel(filePath) {
  console.log('📂 Lecture du fichier Excel:', filePath);

  // Vérifier que le fichier existe
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

    // Extraire les données selon le mapping des colonnes
    const companyName = row[0]; // Colonne A
    const siret = row[1];        // Colonne B
    const partner = row[2];      // Colonne C
    const phone = row[3];        // Colonne D
    const assigned = row[4];     // Colonne E
    const employeeCount = row[5]; // Colonne F
    const progressStatus = row[6]; // Colonne G
    const email = row[7];        // Colonne H
    const partnerTier2 = row[8]; // Colonne I
    const comments = row[9];     // Colonne J

    // Valider que nous avons au moins un nom d'entreprise
    if (!companyName || companyName === '') {
      stats.skipped++;
      continue;
    }

    try {
      console.log(`\n🔄 Traitement [${i + 1}/${dataRows.length}]: ${companyName}`);

      // Préparer les données nettoyées
      const leadData = {
        companyName: String(companyName).trim(),
        siret: cleanSIRET(siret),
        phone: cleanPhone(phone),
        email: email && email !== '' ? String(email).trim() : null,
        employeeCount: parseEmployeeCount(employeeCount),
        status: mapStatus(progressStatus),
        source: 'excel_import',
        enrichmentStatus: siret ? 'enriched' : 'pending'
      };

      // Chercher si le lead existe déjà (par nom d'entreprise ou SIRET)
      let existingLead = null;

      if (leadData.siret) {
        existingLead = await prisma.hotLead.findFirst({
          where: { siret: leadData.siret }
        });
      }

      if (!existingLead) {
        existingLead = await prisma.hotLead.findFirst({
          where: {
            companyName: {
              equals: leadData.companyName,
              mode: 'insensitive'
            }
          }
        });
      }

      if (existingLead) {
        // Mettre à jour le lead existant (seulement si les nouvelles données sont meilleures)
        const updateData = {};

        if (leadData.siret && !existingLead.siret) updateData.siret = leadData.siret;
        if (leadData.phone && !existingLead.phone) updateData.phone = leadData.phone;
        if (leadData.email && !existingLead.email) updateData.email = leadData.email;
        if (leadData.employeeCount && !existingLead.employeeCount) updateData.employeeCount = leadData.employeeCount;
        if (leadData.status !== 'active') updateData.status = leadData.status;

        if (Object.keys(updateData).length > 0) {
          await prisma.hotLead.update({
            where: { id: existingLead.id },
            data: updateData
          });
          console.log(`  ✅ Mis à jour: ${companyName}`);
          stats.updated++;
        } else {
          console.log(`  ⏭️  Déjà à jour: ${companyName}`);
          stats.skipped++;
        }
      } else {
        // Créer un nouveau lead
        await prisma.hotLead.create({
          data: {
            ...leadData,
            priority: 'MOYENNE',
            isOpportunity: false
          }
        });
        console.log(`  ✨ Créé: ${companyName}`);
        stats.created++;
      }

    } catch (error) {
      console.error(`  ❌ Erreur pour ${companyName}:`, error.message);
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
  console.log('    IMPORT DES VRAIES DONNÉES DEPUIS EXCEL');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Chercher le fichier Excel dans le dossier courant
  const possiblePaths = [
    path.join(process.cwd(), 'leads.xlsx'),
    path.join(process.cwd(), 'data', 'leads.xlsx'),
    path.join(process.cwd(), '..', 'leads.xlsx'),
    path.join(process.cwd(), '..', 'Downloads', 'leads.xlsx'),
  ];

  let excelPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      excelPath = p;
      break;
    }
  }

  if (!excelPath) {
    console.error('❌ Fichier Excel introuvable. Chemins vérifiés:');
    possiblePaths.forEach(p => console.log(`   - ${p}`));
    console.log('\n💡 Usage: node import-correct-leads.js <chemin-vers-fichier.xlsx>');
    process.exit(1);
  }

  // Permettre de passer le chemin en argument
  if (process.argv[2]) {
    excelPath = process.argv[2];
  }

  try {
    const stats = await importLeadsFromExcel(excelPath);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                     RÉSULTATS DE L\'IMPORT');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📊 Total traité:     ${stats.total}`);
    console.log(`✅ Mis à jour:       ${stats.updated}`);
    console.log(`✨ Créés:            ${stats.created}`);
    console.log(`⏭️  Ignorés:          ${stats.skipped}`);
    console.log(`❌ Erreurs:          ${stats.errors}`);
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
