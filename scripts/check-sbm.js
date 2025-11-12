const XLSX = require('xlsx');
const wb = XLSX.readFile('C:/Users/v-nbayonne/Downloads/Copilot_Campaign_ORGANISE_2025-10-17.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, {header: 1});

console.log('\n🔍 Recherche de SBM dans le fichier Excel...\n');

for (let i = 0; i < data.length; i++) {
  if (data[i][1] && String(data[i][1]).toUpperCase().includes('SBM')) {
    console.log('═══════════════════════════════════════════');
    console.log(`LIGNE ${i}: ${data[i][1]}`);
    console.log('═══════════════════════════════════════════');
    console.log('A - Priorité:', data[i][0] || '(vide)');
    console.log('B - Entreprise:', data[i][1] || '(vide)');
    console.log('C - Statut:', data[i][2] || '(vide)');
    console.log('D - Distributeur:', data[i][3] || '(vide)');
    console.log('E - Commercial 1:', data[i][4] || '(vide)');
    console.log('F - Commercial 2:', data[i][5] || '(vide)');
    console.log('G - Email Contact:', data[i][6] || '(vide)');
    console.log('H - Téléphone:', data[i][7] || '(vide)');
    console.log('I - ID Client:', data[i][8] || '(vide)');
    console.log('J - Code Opp:', data[i][9] || '(vide)');
    console.log('K - Notes:', data[i][10] || '(vide)');
    console.log('═══════════════════════════════════════════\n');
  }
}
