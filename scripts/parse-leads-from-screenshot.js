const XLSX = require('xlsx');

// Données extraites de votre screenshot
const leadsData = [
  {
    company: 'CMAI',
    id: '55097945',
    score: 618,
    cloudType: 'Be Cloud',
    name: 'Nicolas Bayorishoy',
    status: 'Salee',
    category: 'egress for the audit',
    email: ''
  },
  {
    company: 'EXPERTISE C',
    id: '10349771',
    score: 495,
    cloudType: 'novo Softw',
    name: 'Nicolas Bayorishoy',
    status: 'Salee',
    category: 'Sent',
    email: ''
  },
  {
    company: 'TOPTEX.FR',
    id: '50039048',
    score: 359,
    cloudType: '',
    name: 'Nicolas Bayorishoy',
    status: 'Salee',
    category: 'Sent',
    email: ''
  },
  {
    company: 'IMMUNES F',
    id: '10380005',
    score: 385,
    cloudType: 'agram Micr',
    contact: 'herf@ccfg.fr',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'herf@ccfg.fr'
  },
  {
    company: 'HROTRON',
    id: '23657613',
    score: 560,
    cloudType: 'v Electronic VTCP',
    contact: 'alain.buteau@synchrotron-soleil',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'alain.buteau@synchrotron-soleil.fr'
  },
  {
    company: 'SCM',
    id: '39941534',
    score: 538,
    cloudType: 'ALSO',
    contact: 'walexandre@m',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'walexandre@moselec.com'
  },
  {
    company: 'ER HOLDIN',
    id: '7762793',
    score: 1642,
    cloudType: 'ALSO',
    contact: 'nzebedee@',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'nzebedee@gardefeu.fr'
  },
  {
    company: 'PRODEVAL',
    id: '70519514',
    score: 537,
    cloudType: 'Be Cloud',
    contact: 'sebastien@ladosedigitale.fr',
    status: 'Salee',
    category: 'sent',
    email: 'sebastien@ladosedigitale.fr'
  },
  {
    company: 'ON ET DE R',
    id: '96968348',
    score: 348,
    cloudType: 'TD-Synnex',
    contact: 'nzebedee@',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'nzebedee@prene.fr',
    phone: '320554880'
  },
  {
    company: 'INIFOR PRO',
    id: '941797',
    score: 718,
    cloudType: 'Crayon',
    contact: 'herve.ponce',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'herve.ponce1@gravotech.com',
    phone: '+33 (0) 4 7'
  },
  {
    company: 'AYLOT',
    id: '14752748',
    score: 600,
    cloudType: 'Bechtle',
    status: 'Salee',
    category: 'strategic account',
    email: 'repoulain@fedeb9@admr.or',
    highlighted: true
  },
  {
    company: 'ADMR',
    id: '1.07E+08',
    score: 320,
    cloudType: 'ALSO',
    contact: 'pharaon@al',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'pharaon@alphalec.com'
  },
  {
    company: 'DUPE ALTIT',
    id: '87007393',
    score: 323,
    cloudType: 'ISAGRI',
    contact: '',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'other email in the'
  },
  {
    company: 'TECHNITO',
    id: '9523640',
    score: 355,
    cloudType: 'ALSO',
    contact: 'gonthier.m@technitoit.com',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'gonthier.m@technitoit.com'
  },
  {
    company: 'COMPASS',
    id: '14188053',
    score: 300,
    cloudType: 'v Electronic',
    contact: 'sylvain.lejeune@lacompassion.fr',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'sylvain.lejeune@lacompassion.fr'
  },
  {
    company: 'LTPM',
    id: '73191546',
    score: 1730,
    cloudType: 'Crayon',
    contact: 'jean-louis.saurel@ensemble-mo',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'jean-louis.saurel@ensemble-mo'
  },
  {
    company: 'PEP 80',
    id: '44078338',
    score: 306,
    cloudType: 'Be Cloud',
    contact: 'PHILIPPE.PERRIER@PEP80.FR',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'PHILIPPE.PERRIER@PEP80.FR'
  },
  {
    company: 'ECHO',
    id: '30840337',
    score: 950,
    cloudType: 'agram Micr',
    contact: 'fdenis@echo-sante.com',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'fdenis@echo-sante.com'
  },
  {
    company: 'JUSTIFIA',
    id: '1.36E+08',
    score: 485,
    cloudType: 'YUSATA ON',
    status: 'Salee',
    category: 'existing on mx',
    email: '',
    highlighted: true
  },
  {
    company: 'LE MUGL',
    id: '29190070',
    score: 525,
    cloudType: 'ALSO',
    status: 'Salee',
    category: 'existing on mx',
    email: 'informatique.de@salins-de-bregiille.com'
  },
  {
    company: 'NS DE BREC',
    id: '45055021',
    score: 820,
    cloudType: 'v Electronic',
    status: 'Salee',
    category: 'Sent',
    email: '@salinsdebregiille.com',
    contact: 'Axians ICT directiong'
  },
  {
    company: 'ARCO',
    id: '34299521',
    score: 581,
    cloudType: 'agram Micr',
    contact: '@yesaz',
    status: 'Salee',
    category: 'Sent/Audit',
    email: '@yesazf.arco'
  },
  {
    company: 'INOP\'S',
    id: '14881504',
    score: 675,
    cloudType: 'Crayon',
    contact: 'fgestin@',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'fgestin@inops.fr',
    status2: 'BI'
  },
  {
    company: 'OCARMOR',
    id: '7723624',
    score: 308,
    cloudType: 'v Electronic',
    contact: 'mickael.pc ARSYCE',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'mickael.pc@arsyce.com'
  },
  {
    company: 'OUTDOOR',
    id: '21732870',
    score: 461,
    cloudType: 'ania UK Lim',
    contact: 'udit@bo',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'udit@bolterandes.com',
    company2: 'Advania UK Limited'
  },
  {
    company: 'BALAS',
    id: '22025094',
    score: 697,
    cloudType: 'v Electronic',
    contact: 'jphent.v@bal',
    status: 'Salee',
    category: 'cma par rap',
    email: 'jphent.v@balas.net',
    company2: 'Talan'
  },
  {
    company: 'SEA SERVIC',
    id: '44957418',
    score: 858,
    cloudType: 'Be Cloud',
    contact: 'si@geau.to.fr',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'si@geau.to.fr',
    company2: 'MOOVE-SI'
  },
  {
    company: 'ANCE RHOI',
    id: '43329162',
    score: 622,
    cloudType: 'v Electronic',
    contact: 'c.danou@alterance-rhone-alpes.cc',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'c.danou@alterance-rhone-alpes.cc',
    company2: 'ELIT-TECH'
  },
  {
    company: 'AMPERE',
    id: '39505512',
    score: 314,
    cloudType: 'Destiny N',
    contact: 'bmoret@ampere-elec.com',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'bmoret@ampere-elec.com',
    company2: 'SAS DESTINY FRANCE'
  },
  {
    company: 'E CHARITE C',
    id: '',
    score: 575,
    cloudType: 'v Electronic VTCP',
    status: 'Salee',
    category: 'Sent',
    email: 'directiong.e.marion@fondationlacse.org',
    company2: 'ACESI Sàrl'
  },
  {
    company: 'SIGLE',
    id: '94960568',
    score: 850,
    cloudType: 'age S.A. (Gi',
    contact: 'vilabarreix@normanfr.fr',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'vilabarreix@normanfr.fr',
    company2: 'Orange'
  },
  {
    company: 'ONNA SABI',
    id: '5104317',
    score: 361,
    cloudType: 'age S.A. (Gi',
    contact: 'onnasable@',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'onnasable@om',
    company2: 'Orange'
  },
  {
    company: 'sofibrie.fr',
    id: '1.01E+08',
    score: 360,
    cloudType: 'v Electronic',
    contact: 'informatique@',
    status: 'Salee',
    category: 'Sent/Audit',
    email: 'informatique@sofibrie.fr',
    id2: '6950327'
  }
];

// Convertir en format structuré pour l'application
const structuredLeads = leadsData.map(lead => {
  // Calculer le statut basé sur le score
  let status = 'cold';
  if (lead.score >= 800) status = 'hot';
  else if (lead.score >= 600) status = 'warm';
  else if (lead.score >= 400) status = 'active';

  // Calculer la priorité
  let priority = 'low';
  if (lead.score >= 700) priority = 'high';
  else if (lead.score >= 500) priority = 'medium';

  // Déterminer l'industrie basée sur le nom de l'entreprise
  const companyLower = lead.company.toLowerCase();
  let industry = '';
  if (companyLower.includes('tech') || companyLower.includes('soft')) industry = 'Technology';
  else if (companyLower.includes('health') || companyLower.includes('sante')) industry = 'Healthcare';
  else if (companyLower.includes('finance') || companyLower.includes('bank')) industry = 'Finance';
  else if (companyLower.includes('outdoor') || companyLower.includes('sport')) industry = 'Retail';
  else industry = 'Services';

  // Déterminer les produits Microsoft basés sur cloudType
  const microsoftProducts = [];
  if (lead.cloudType) {
    if (lead.cloudType.toLowerCase().includes('cloud')) microsoftProducts.push('Azure', 'Microsoft 365');
    if (lead.cloudType.toLowerCase().includes('electronic')) microsoftProducts.push('Dynamics 365');
  }

  // Engagement score basé sur le score global
  const engagement_score = Math.min(Math.round(lead.score / 100), 10);

  // Potentiel revenus estimé
  const revenue_potential = Math.round(lead.score * 50);

  return {
    name: lead.contact || lead.name || 'Contact Principal',
    company: lead.company,
    email: lead.email || `contact@${lead.company.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: lead.phone || '',
    position: 'Decision Maker',

    industry: industry,
    company_size: lead.score > 700 ? '201-1000' : lead.score > 500 ? '51-200' : '1-50',
    location: 'France',
    website: '',

    status: status,
    priority: priority,
    engagement_score: engagement_score,
    revenue_potential: revenue_potential,
    purchase_count: lead.category?.includes('Sent') ? 1 : 0,

    current_microsoft_products: microsoftProducts.length > 0 ? microsoftProducts.join(', ') : 'Microsoft 365',
    pain_points: lead.score > 600 ? 'Productivité faible, Collaboration difficile' : 'Coûts élevés',
    decision_timeline: 'Q2 2025',
    budget_range: lead.score > 700 ? '50-100k€' : lead.score > 500 ? '20-50k€' : '10-20k€',
    decision_makers: lead.contact || '',

    notes: `Source: ${lead.cloudType || 'N/A'} | Category: ${lead.category || 'N/A'} | ID: ${lead.id}`,
    last_contact: '',
    next_action: 'Campagne Copilot 20%',

    copilot_interest_level: engagement_score,
    copilot_use_cases: lead.score > 600 ? 'Rédaction emails/documents, Analyse données Excel, Automatisation tâches' : 'Rédaction emails/documents',
    copilot_blockers: lead.score < 500 ? 'Budget, ROI incertain' : 'Formation',

    score: lead.score,
    calculated_score: Math.round(
      (status === 'hot' ? 30 : status === 'warm' ? 20 : status === 'active' ? 15 : 5) +
      (priority === 'high' ? 20 : priority === 'medium' ? 10 : 5) +
      engagement_score +
      Math.min(revenue_potential / 5000, 20) +
      (lead.category?.includes('Sent') ? 3 : 0) +
      engagement_score +
      (microsoftProducts.length * 2)
    )
  };
});

// Créer le fichier Excel
const worksheet = XLSX.utils.json_to_sheet(structuredLeads);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Structurés');

// Auto-size columns
const maxWidth = 50;
const colWidths = Object.keys(structuredLeads[0] || {}).map(key => ({
  wch: Math.min(
    Math.max(
      key.length,
      ...structuredLeads.map(row => String(row[key] || '').length)
    ),
    maxWidth
  )
}));
worksheet['!cols'] = colWidths;

// Sauvegarder
const outputPath = require('path').join(__dirname, '..', 'leads_copilot_structured.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log('✅ Leads structurés créés!');
console.log(`📊 Total: ${structuredLeads.length} leads`);
console.log(`🔥 HOT leads: ${structuredLeads.filter(l => l.status === 'hot').length}`);
console.log(`📈 Score moyen: ${Math.round(structuredLeads.reduce((sum, l) => sum + l.calculated_score, 0) / structuredLeads.length)}`);
console.log(`📁 Fichier: ${outputPath}`);
console.log('\n🎯 Prochaines étapes:');
console.log('1. Allez sur http://localhost:3000/lead-builder');
console.log('2. Cliquez sur "Import Excel"');
console.log('3. Sélectionnez: leads_copilot_structured.xlsx');
console.log('4. Vos leads seront importés automatiquement!');
