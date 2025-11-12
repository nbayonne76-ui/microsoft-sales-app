const fs = require('fs');
const path = require('path');

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sourceDb = path.join(__dirname, '../prisma/dev.db');
  const backupDir = path.join(__dirname, '../backups');
  const backupDb = path.join(backupDir, `dev-backup-${timestamp}.db`);

  console.log('\n💾 BACKUP BASE DE DONNÉES\n');
  console.log('='.repeat(80));

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('✅ Dossier backups créé');
  }

  // Check if source database exists
  if (!fs.existsSync(sourceDb)) {
    console.error('❌ ERREUR: Base de données source introuvable!');
    console.error(`   Chemin: ${sourceDb}`);
    process.exit(1);
  }

  // Copy database file
  try {
    fs.copyFileSync(sourceDb, backupDb);
    const stats = fs.statSync(backupDb);
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log(`\n✅ BACKUP CRÉÉ AVEC SUCCÈS!`);
    console.log(`   Fichier: ${path.basename(backupDb)}`);
    console.log(`   Taille: ${sizeKB} KB`);
    console.log(`   Chemin: ${backupDb}`);

    // List all backups
    const backups = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('dev-backup-') && f.endsWith('.db'))
      .map(f => {
        const filePath = path.join(backupDir, f);
        const stats = fs.statSync(filePath);
        return {
          name: f,
          date: stats.mtime,
          size: (stats.size / 1024).toFixed(2)
        };
      })
      .sort((a, b) => b.date - a.date);

    console.log(`\n📂 TOUS LES BACKUPS (${backups.length}):`);
    console.log('-'.repeat(80));
    backups.forEach((backup, idx) => {
      console.log(`  ${idx + 1}. ${backup.name}`);
      console.log(`     Date: ${backup.date.toLocaleString('fr-FR')}`);
      console.log(`     Taille: ${backup.size} KB\n`);
    });

    // Clean old backups (keep last 10)
    if (backups.length > 10) {
      const toDelete = backups.slice(10);
      console.log(`\n🗑️  Suppression des anciens backups (> 10):`);
      toDelete.forEach(backup => {
        const filePath = path.join(backupDir, backup.name);
        fs.unlinkSync(filePath);
        console.log(`   ✅ Supprimé: ${backup.name}`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ BACKUP TERMINÉ!\n');
  } catch (error) {
    console.error('❌ ERREUR lors du backup:', error.message);
    process.exit(1);
  }
}

backupDatabase()
  .catch(console.error);
