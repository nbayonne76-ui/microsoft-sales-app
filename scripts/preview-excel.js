const XLSX = require('xlsx');

const filePath = process.argv[2] || 'C:/Users/v-nbayonne/Downloads/Copilot_Campaign_ORGANISE_2025-10-17.xlsx';

console.log('📂 Lecture du fichier:', filePath);

const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log('\n📊 INFORMATIONS DU FICHIER');
console.log('═══════════════════════════════════════════════════════════════');
console.log('📄 Feuille:', sheetName);
console.log('📝 Total lignes:', data.length);
console.log('📊 Total colonnes:', data[0] ? data[0].length : 0);

console.log('\n📋 EN-TÊTES (Première ligne):');
console.log('═══════════════════════════════════════════════════════════════');
if (data[0]) {
  data[0].forEach((header, index) => {
    const letter = String.fromCharCode(65 + index); // A, B, C, etc.
    console.log(`  ${letter}: ${header}`);
  });
}

console.log('\n📋 EXEMPLES DE DONNÉES (3 premières lignes):');
console.log('═══════════════════════════════════════════════════════════════');
for (let i = 1; i <= Math.min(3, data.length - 1); i++) {
  console.log(`\nLigne ${i}:`);
  const row = data[i];
  data[0].forEach((header, index) => {
    if (row[index]) {
      console.log(`  ${header}: ${row[index]}`);
    }
  });
}

console.log('\n═══════════════════════════════════════════════════════════════\n');
