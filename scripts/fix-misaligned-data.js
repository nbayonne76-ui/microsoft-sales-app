/**
 * Script pour corriger les données désalignées dans le fichier Excel
 * Détecte automatiquement si les données sont dans les mauvaises colonnes
 */

const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const prisma = new PrismaClient();

/**
 * Détecter si une chaîne ressemble à un email
 */
function looksLikeEmail(str) {
  if (!str) return false;
  return String(str).includes('@') && String(str).includes('.');
}

/**
 * Détecter si une chaîne ressemble à un téléphone
 */
function looksLikePhone(str) {
  if (!str) return false;
  const phonePattern = /[\d\s\+\-\(\)\/]{10,}/;
  return phonePattern.test(String(str));
}

/**
 * Nettoyer téléphone
 */
function cleanPhone(phone) {
  if (!phone) return null;
  return String(phone).replace(/[^\d\s\+\-\(\)\/]/g, '').trim() || null;
}

/**
 * Nettoyer email
 */
function cleanEmail(email) {
  if (!email) return null;
  const cleaned = String(email).trim().toLowerCase();
  return cleaned.includes('@') && cleaned.includes('.') ? cleaned : null;
}

/**
 * Extraire l'email et le téléphone de n'importe quelle colonne
 */
function extractContactInfo(row) {
  let phone = null;
  let email = null;

  // Scanner toutes les colonnes pour trouver email et téléphone
  for (let i = 0; i < row.length; i++) {
    const cell = row[i];
    if (!cell) continue;

    if (!email && looksLikeEmail(cell)) {
      email = cleanEmail(cell);
    }

    if (!phone && looksLikePhone(cell)) {
      phone = cleanPhone(cell);
    }
  }

  return { phone, email };
}

/**
 * Corriger les données désalignées
 */
async function fixMisalignedData(filePath) {
  console.log('📂 Lecture du fichier Excel:', filePath);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log(`📊 Trouvé ${rawData.length} lignes\n`);

  const dataRows = rawData.slice(1); // Skip header

  let stats = {
    total: 0,
    updated: 0,
    notFound: 0,
    noData: 0,
    errors: 0
  };

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    stats.total++;

    const entreprise = row[1]; // Colonne B

    if (!entreprise || entreprise === '' || entreprise === 'Entreprise') {
      continue;
    }

    try {
      // Extraire intelligemment les contacts depuis toutes les colonnes
      const { phone, email } = extractContactInfo(row);

      if (!phone && !email) {
        console.log(`⏭️  [${i + 1}/${dataRows.length}] Pas de contact: ${entreprise}`);
        stats.noData++;
        continue;
      }

      // Chercher le lead
      const existingLead = await prisma.hotLead.findFirst({
        where: { companyName: entreprise }
      });

      if (!existingLead) {
        console.log(`❌ [${i + 1}/${dataRows.length}] Non trouvé: ${entreprise}`);
        stats.notFound++;
        continue;
      }

      const updateData = {};
      const changes = [];

      // Mettre à jour le téléphone
      if (phone && phone !== existingLead.phone) {
        updateData.phone = phone;
        changes.push(`📞 ${existingLead.phone || 'vide'} → ${phone}`);
      }

      // Mettre à jour l'email
      if (email && email !== existingLead.email) {
        updateData.email = email;
        changes.push(`📧 ${existingLead.email || 'vide'} → ${email}`);
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.hotLead.update({
          where: { id: existingLead.id },
          data: updateData
        });
        console.log(`✅ [${i + 1}/${dataRows.length}] Corrigé: ${entreprise}`);
        changes.forEach(change => console.log(`   ${change}`));
        stats.updated++;
      } else {
        console.log(`⏭️  [${i + 1}/${dataRows.length}] Déjà correct: ${entreprise}`);
      }

    } catch (error) {
      console.error(`❌ [${i + 1}/${dataRows.length}] Erreur ${entreprise}:`, error.message);
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
  console.log('   CORRECTION DES DONNÉES DÉSALIGNÉES (DÉTECTION AUTO)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const defaultPath = 'C:/Users/v-nbayonne/Downloads/Copilot_Campaign_ORGANISE_2025-10-17.xlsx';
  const excelPath = process.argv[2] || defaultPath;

  try {
    const stats = await fixMisalignedData(excelPath);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                 RÉSULTATS DE LA CORRECTION');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📊 Total traité:        ${stats.total}`);
    console.log(`✅ Corrigés:            ${stats.updated}`);
    console.log(`⏭️  Pas de données:      ${stats.noData}`);
    console.log(`❌ Non trouvés:         ${stats.notFound}`);
    console.log(`❌ Erreurs:             ${stats.errors}`);
    console.log('═══════════════════════════════════════════════════════════════');

    if (stats.updated > 0) {
      console.log(`\n✅ ${stats.updated} lead(s) corrigé(s)!`);
      console.log(`\n💡 Rechargez: http://localhost:3004/hot-leads\n`);
    }

  } catch (error) {
    console.error('\n❌ Erreur fatale:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
