// Script pour exporter les leads en format Excel
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Importer les leads du script d'import
const { leads } = require('./import-spreadsheet-leads');

// Préparer les données pour Excel
const excelData = leads.map(lead => ({
  'Nom': lead.name,
  'Entreprise': lead.company,
  'Email': lead.email,
  'Téléphone': lead.phone,
  'Position': lead.position,
  'Industrie': lead.industry,
  'Taille entreprise': lead.company_size,
  'Localisation': lead.location,
  'Site web': lead.website,
  'Statut': lead.status,
  'Priorité': lead.priority,
  'Score engagement': lead.engagement_score,
  'Potentiel revenus': lead.revenue_potential,
  'Achats précédents': lead.purchase_count,
  'Produits Microsoft': lead.current_microsoft_products?.join(', '),
  'Pain points': lead.pain_points?.join(', '),
  'Timeline décision': lead.decision_timeline,
  'Budget': lead.budget_range,
  'Décideurs': lead.decision_makers,
  'Intérêt Copilot': lead.copilot_interest_level,
  'Use cases Copilot': lead.copilot_use_cases?.join(', '),
  'Blockers Copilot': lead.copilot_blockers?.join(', '),
  'Notes': lead.notes,
  'Dernier contact': lead.last_contact,
  'Prochaine action': lead.next_action,
  'Score calculé': lead.calculated_score
}));

// Créer le workbook et la feuille
const worksheet = XLSX.utils.json_to_sheet(excelData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Structurés');

// Sauvegarder le fichier
const fileName = path.join(__dirname, '..', `Copilot_Leads_Structured_${new Date().toISOString().split('T')[0]}.xlsx`);
XLSX.writeFile(workbook, fileName);

console.log(`\n✅ Fichier Excel créé: ${fileName}`);
console.log(`\n${leads.length} leads exportés avec succès!`);
