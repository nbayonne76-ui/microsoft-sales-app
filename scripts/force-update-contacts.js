/**
 * Script pour FORCER la mise à jour des contacts
 * Écrase les anciennes données avec les vraies données du fichier Excel
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
  return String(phone).replace(/[^\d\s\+\-\(\)\/]/g, '').trim() || null;
}

/**
 * Nettoyer l'email
 */
function cleanEmail(email) {
  if (!email) return null;
  const cleaned = String(email).trim().toLowerCase();
  return cleaned.includes('@') && cleaned.includes('.') ? cleaned : null;
}

/**
 * Forcer la mise à jour des contacts depuis le fichier Excel
 */
async function forceUpdateContacts(filePath) {
  console.log('📂 Lecture du fichier Excel:', filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Fichier introuvable: ${filePath}`);
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  console.log(`📊 Trouvé ${rawData.length} lignes dans le fichier\n`);

  const dataRows = rawData.slice(1); // Skip header

  let stats = {
    total: 0,
    updated: 0,
    notFound: 0,
    noChanges: 0,
    errors: 0
  };

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    stats.total++;

    const entreprise = row[1];       // B: Entreprise
    const emailContact = row[6];     // G: Email Contact
    const telephone = row[7];        // H: Téléphone

    if (!entreprise || entreprise === '' || entreprise === 'Entreprise') {
      continue;
    }

    try {
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

      // FORCER la mise à jour du téléphone si différent
      const newPhone = cleanPhone(telephone);
      if (newPhone && newPhone !== existingLead.phone) {
        updateData.phone = newPhone;
        changes.push(`📞 ${existingLead.phone || 'vide'} → ${newPhone}`);
      }

      // FORCER la mise à jour de l'email si différent
      const newEmail = cleanEmail(emailContact);
      if (newEmail && newEmail !== existingLead.email) {
        updateData.email = newEmail;
        changes.push(`📧 ${existingLead.email || 'vide'} → ${newEmail}`);
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.hotLead.update({
          where: { id: existingLead.id },
          data: updateData
        });
        console.log(`✅ [${i + 1}/${dataRows.length}] Mis à jour: ${entreprise}`);
        changes.forEach(change => console.log(`   ${change}`));
        stats.updated++;
      } else {
        console.log(`⏭️  [${i + 1}/${dataRows.length}] Déjà correct: ${entreprise}`);
        stats.noChanges++;
      }

    } catch (error) {
      console.error(`❌ [${i + 1}/${dataRows.length}] Erreur pour ${entreprise}:`, error.message);
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
  console.log('     CORRECTION FORCÉE DES CONTACTS (TÉLÉPHONE + EMAIL)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const defaultPath = 'C:/Users/v-nbayonne/Downloads/Copilot_Campaign_ORGANISE_2025-10-17.xlsx';
  const excelPath = process.argv[2] || defaultPath;

  try {
    const stats = await forceUpdateContacts(excelPath);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                   RÉSULTATS DE LA CORRECTION');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📊 Total traité:        ${stats.total}`);
    console.log(`✅ Mis à jour:          ${stats.updated}`);
    console.log(`⏭️  Déjà corrects:       ${stats.noChanges}`);
    console.log(`❌ Non trouvés:         ${stats.notFound}`);
    console.log(`❌ Erreurs:             ${stats.errors}`);
    console.log('═══════════════════════════════════════════════════════════════');

    if (stats.updated > 0) {
      console.log(`\n✅ ${stats.updated} lead(s) corrigé(s) avec succès!`);
      console.log(`\n💡 Rechargez la page pour voir les changements: http://localhost:3004/hot-leads\n`);
    } else {
      console.log(`\n✓ Tous les contacts sont déjà corrects!\n`);
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
