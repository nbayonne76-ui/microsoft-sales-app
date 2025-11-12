const fs = require('fs');
const path = require('path');
const readline = require('readline');

async function restoreDatabase() {
  const backupDir = path.join(__dirname, '../backups');
  const targetDb = path.join(__dirname, '../prisma/dev.db');

  console.log('\n🔄 RESTAURATION BASE DE DONNÉES\n');
  console.log('='.repeat(80));

  // Check if backups directory exists
  if (!fs.existsSync(backupDir)) {
    console.error('❌ ERREUR: Aucun dossier backups trouvé!');
    console.error('   Créez d\'abord un backup avec: node scripts/backup-database.js');
    process.exit(1);
  }

  // List available backups
  const backups = fs.readdirSync(backupDir)
    .filter(f => f.startsWith('dev-backup-') && f.endsWith('.db'))
    .map(f => {
      const filePath = path.join(backupDir, f);
      const stats = fs.statSync(filePath);
      return {
        name: f,
        date: stats.mtime,
        size: (stats.size / 1024).toFixed(2),
        path: filePath
      };
    })
    .sort((a, b) => b.date - a.date);

  if (backups.length === 0) {
    console.error('❌ ERREUR: Aucun backup disponible!');
    console.error('   Créez d\'abord un backup avec: node scripts/backup-database.js');
    process.exit(1);
  }

  console.log(`📂 BACKUPS DISPONIBLES (${backups.length}):\n`);
  backups.forEach((backup, idx) => {
    console.log(`  ${idx + 1}. ${backup.name}`);
    console.log(`     Date: ${backup.date.toLocaleString('fr-FR')}`);
    console.log(`     Taille: ${backup.size} KB\n`);
  });

  // Get the most recent backup (index 0)
  const latestBackup = backups[0];

  console.log('='.repeat(80));
  console.log(`\n⚠️  ATTENTION: Cette action va remplacer votre base actuelle!`);
  console.log(`\n📦 Backup à restaurer: ${latestBackup.name}`);
  console.log(`   Date: ${latestBackup.date.toLocaleString('fr-FR')}`);
  console.log(`   Taille: ${latestBackup.size} KB\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Voulez-vous continuer? (oui/non): ', (answer) => {
    if (answer.toLowerCase() === 'oui' || answer.toLowerCase() === 'o') {
      try {
        // Create backup of current database before restore
        if (fs.existsSync(targetDb)) {
          const currentBackup = path.join(backupDir, `dev-before-restore-${new Date().toISOString().replace(/[:.]/g, '-')}.db`);
          fs.copyFileSync(targetDb, currentBackup);
          console.log(`\n✅ Sauvegarde actuelle créée: ${path.basename(currentBackup)}`);
        }

        // Restore from backup
        fs.copyFileSync(latestBackup.path, targetDb);
        console.log(`\n✅ BASE RESTAURÉE AVEC SUCCÈS!`);
        console.log(`   Depuis: ${latestBackup.name}`);
        console.log(`   Vers: prisma/dev.db`);
        console.log('\n' + '='.repeat(80));
        console.log('✅ RESTAURATION TERMINÉE!\n');
      } catch (error) {
        console.error('❌ ERREUR lors de la restauration:', error.message);
        process.exit(1);
      }
    } else {
      console.log('\n❌ Restauration annulée.\n');
    }
    rl.close();
  });
}

restoreDatabase()
  .catch(console.error);
