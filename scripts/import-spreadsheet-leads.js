// Script intelligent pour importer les leads depuis le spreadsheet
// Ce script analyse, catégorise et organise les leads de manière intelligente

const leads = [
  // LEADS HOT - Haute priorité avec contacts existants
  {
    name: "Contact Principal",
    company: "L'OREAL LUXE FRANCE COMMERCE SAINT-CLOUD",
    email: "digital.lorealluxe@loreal.com",
    phone: "N/A",
    position: "Digital Manager",
    industry: "Cosmétiques & Luxe",
    company_size: "1000+",
    location: "Saint-Cloud, France",
    website: "https://www.loreal.com",
    status: "hot",
    priority: "high",
    engagement_score: 9,
    revenue_potential: 500000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365", "Teams", "Azure"],
    pain_points: ["Productivité faible", "Collaboration difficile"],
    decision_timeline: "Q1 2025",
    budget_range: "100k-500k€",
    decision_makers: "Direction Digitale",
    copilot_interest_level: 9,
    copilot_use_cases: ["Rédaction emails/documents", "Création présentations", "Automatisation tâches"],
    copilot_blockers: ["Budget", "Adoption utilisateurs"],
    notes: "Entreprise de luxe avec fort potentiel. Audit en cours.",
    last_contact: "",
    next_action: "Organiser démo exécutive"
  },
  {
    name: "Bruno ROULLEAU",
    company: "SOCIETE DE PROTECTION ET DE REPARTITION DU NORD",
    email: "broulleau@sprnord.fr",
    phone: "7-7WYRJT4K",
    position: "Directeur",
    industry: "Services de Protection",
    company_size: "51-200",
    location: "Nord, France",
    website: "",
    status: "hot",
    priority: "high",
    engagement_score: 8,
    revenue_potential: 75000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365"],
    pain_points: ["Sécurité", "Collaboration difficile"],
    decision_timeline: "Q4 2024",
    budget_range: "50k-100k€",
    decision_makers: "Bruno ROULLEAU - Directeur",
    copilot_interest_level: 8,
    copilot_use_cases: ["Rédaction emails/documents", "Automatisation tâches"],
    copilot_blockers: ["ROI incertain"],
    notes: "Contact direct établi. Intérêt fort pour Copilot.",
    last_contact: "",
    next_action: "Appel de suivi"
  },
  {
    name: "Contact Commercial",
    company: "SALINS DE BREGILLE",
    email: "informatique.dsi@salinsdebreg" + "ille.com",
    phone: "N/A",
    position: "DSI",
    industry: "Industrie Chimique",
    company_size: "51-200",
    location: "Besançon, France",
    website: "",
    status: "hot",
    priority: "high",
    engagement_score: 8,
    revenue_potential: 65000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365"],
    pain_points: ["Infrastructure legacy", "Sécurité"],
    decision_timeline: "Q1 2025",
    budget_range: "50k-100k€",
    decision_makers: "DSI",
    copilot_interest_level: 7,
    copilot_use_cases: ["Analyse données Excel", "Automatisation tâches"],
    copilot_blockers: ["Intégration existante"],
    notes: "Sent every way possible - Aviana CTB.V.",
    last_contact: "",
    next_action: "Démo technique"
  },

  // LEADS WARM - Potentiel élevé, besoin de nurturing
  {
    name: "Contact Commercial",
    company: "GROUPE ALTITUDE",
    email: "gisserot@altnet.com",
    phone: "N/A",
    position: "Responsable Commercial",
    industry: "Télécommunications",
    company_size: "201-1000",
    location: "France",
    website: "",
    status: "warm",
    priority: "high",
    engagement_score: 7,
    revenue_potential: 150000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365", "Azure"],
    pain_points: ["Productivité faible", "Coûts élevés"],
    decision_timeline: "Q2 2025",
    budget_range: "100k-250k€",
    decision_makers: "Direction Commerciale",
    copilot_interest_level: 7,
    copilot_use_cases: ["Rédaction emails/documents", "Analyse données Excel", "Création présentations"],
    copilot_blockers: ["Budget", "Formation"],
    notes: "Groupe avec fort potentiel. Plusieurs sites.",
    last_contact: "",
    next_action: "Présentation solution"
  },
  {
    name: "Contact Technique",
    company: "TECHNIFOT",
    email: "pierre.houdre@" + "technifot.com",
    phone: "N/A",
    position: "Responsable IT",
    industry: "Services Techniques",
    company_size: "51-200",
    location: "France",
    website: "",
    status: "warm",
    priority: "medium",
    engagement_score: 6,
    revenue_potential: 45000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365"],
    pain_points: ["Adoption technologie", "Formation utilisateurs"],
    decision_timeline: "Q2 2025",
    budget_range: "25k-75k€",
    decision_makers: "DSI",
    copilot_interest_level: 6,
    copilot_use_cases: ["Automatisation tâches", "Recherche information"],
    copilot_blockers: ["Adoption utilisateurs", "Formation"],
    notes: "En phase d'évaluation.",
    last_contact: "",
    next_action: "Webinar"
  },

  // LEADS PARTENAIRES - Microsoft Partners
  {
    name: "Contact Partenaire",
    company: "Be Cloud",
    email: "contact@becloud.fr",
    phone: "N/A",
    position: "Partner Manager",
    industry: "Cloud Services",
    company_size: "51-200",
    location: "France",
    website: "https://becloud.fr",
    status: "active",
    priority: "high",
    engagement_score: 9,
    revenue_potential: 200000,
    purchase_count: 5,
    current_microsoft_products: ["Microsoft 365", "Azure", "Dynamics 365"],
    pain_points: [],
    decision_timeline: "Ongoing",
    budget_range: "100k+€",
    decision_makers: "Direction",
    copilot_interest_level: 10,
    copilot_use_cases: ["Rédaction emails/documents", "Analyse données Excel", "Création présentations", "Coding assistance"],
    copilot_blockers: [],
    notes: "Partner Microsoft - Relation établie",
    last_contact: "",
    next_action: "Co-selling opportunity"
  },
  {
    name: "Loic MOREAU",
    company: "Ingram Micro",
    email: "loic.moreau@ingrammicro.com",
    phone: "N/A",
    position: "Account Manager",
    industry: "Distribution IT",
    company_size: "1000+",
    location: "France",
    website: "https://ingrammicro.com",
    status: "active",
    priority: "high",
    engagement_score: 10,
    revenue_potential: 500000,
    purchase_count: 10,
    current_microsoft_products: ["Microsoft 365", "Azure", "Dynamics 365", "Power Platform"],
    pain_points: [],
    decision_timeline: "Ongoing",
    budget_range: "500k+€",
    decision_makers: "Loic MOREAU",
    copilot_interest_level: 10,
    copilot_use_cases: ["Rédaction emails/documents", "Analyse données Excel", "Création présentations", "Automatisation tâches"],
    copilot_blockers: [],
    notes: "Distributeur Microsoft - Partner stratégique",
    last_contact: "",
    next_action: "Quarterly business review"
  },
  {
    name: "Contact Orange",
    company: "Orange S.A. (Global)",
    email: "business@orange.com",
    phone: "N/A",
    position: "Enterprise Sales",
    industry: "Télécommunications",
    company_size: "1000+",
    location: "France",
    website: "https://orange.com",
    status: "active",
    priority: "high",
    engagement_score: 9,
    revenue_potential: 1000000,
    purchase_count: 8,
    current_microsoft_products: ["Microsoft 365", "Azure", "Teams"],
    pain_points: [],
    decision_timeline: "Ongoing",
    budget_range: "1M+€",
    decision_makers: "Direction Enterprise",
    copilot_interest_level: 9,
    copilot_use_cases: ["Rédaction emails/documents", "Analyse données Excel", "Automatisation tâches", "Réunions/Teams"],
    copilot_blockers: [],
    notes: "Client majeur - Relation stratégique",
    last_contact: "",
    next_action: "Executive briefing"
  },

  // LEADS COLD - À qualifier
  {
    name: "Contact Direction",
    company: "COSMAGIC-LASER ESTHETIQUE GUILBERT",
    email: "contact@cosmagic-laser.com",
    phone: "N/A",
    position: "Directeur",
    industry: "Esthétique & Santé",
    company_size: "1-50",
    location: "France",
    website: "",
    status: "cold",
    priority: "medium",
    engagement_score: 3,
    revenue_potential: 15000,
    purchase_count: 0,
    current_microsoft_products: [],
    pain_points: ["Productivité faible"],
    decision_timeline: "À déterminer",
    budget_range: "10k-25k€",
    decision_makers: "Direction",
    copilot_interest_level: 4,
    copilot_use_cases: ["Rédaction emails/documents"],
    copilot_blockers: ["Budget", "ROI incertain"],
    notes: "Nouveau copilot campaign - À qualifier",
    last_contact: "",
    next_action: "Premier contact"
  },
  {
    name: "Michael POCHAT",
    company: "LOCARMOR",
    email: "michael.pochat@locarmor.com",
    phone: "N/A",
    position: "Responsable",
    industry: "Location & Services",
    company_size: "51-200",
    location: "France",
    website: "",
    status: "cold",
    priority: "medium",
    engagement_score: 4,
    revenue_potential: 35000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365"],
    pain_points: ["Collaboration difficile"],
    decision_timeline: "Q2 2025",
    budget_range: "25k-50k€",
    decision_makers: "Michael POCHAT",
    copilot_interest_level: 5,
    copilot_use_cases: ["Automatisation tâches"],
    copilot_blockers: ["Adoption utilisateurs"],
    notes: "ARSYCE - Sent view/Audit",
    last_contact: "",
    next_action: "Envoi documentation"
  },
  {
    name: "Stéphane BAUDOIN",
    company: "BUSHINESS EASY PRODUCTS",
    email: "stephane@" + "bushinesseasy.com",
    phone: "N/A",
    position: "CEO",
    industry: "Services B2B",
    company_size: "1-50",
    location: "France",
    website: "",
    status: "cold",
    priority: "medium",
    engagement_score: 5,
    revenue_potential: 25000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365"],
    pain_points: ["Productivité faible", "Coûts élevés"],
    decision_timeline: "Q3 2025",
    budget_range: "15k-35k€",
    decision_makers: "Stéphane BAUDOIN",
    copilot_interest_level: 6,
    copilot_use_cases: ["Rédaction emails/documents", "Automatisation tâches"],
    copilot_blockers: ["Budget"],
    notes: "Arkema EIT Limited - Sent view/Audit",
    last_contact: "",
    next_action: "Qualification call"
  },

  // LEADS CAMPAGNE - Nouveaux leads campagne
  {
    name: "Jean-Louis CHANTELOUT",
    company: "LA COMPAGNIE MTM",
    email: "jean-louis.ch@" + "reversible-mountolive.org",
    phone: "N/A",
    position: "Directeur",
    industry: "Services",
    company_size: "1-50",
    location: "France",
    website: "",
    status: "cold",
    priority: "low",
    engagement_score: 2,
    revenue_potential: 12000,
    purchase_count: 0,
    current_microsoft_products: [],
    pain_points: [],
    decision_timeline: "À déterminer",
    budget_range: "10k-20k€",
    decision_makers: "Jean-Louis CHANTELOUT",
    copilot_interest_level: 3,
    copilot_use_cases: [],
    copilot_blockers: ["Budget", "ROI incertain"],
    notes: "New copilot campaign - IN'GARDE",
    last_contact: "",
    next_action: "Outreach email"
  },
  {
    name: "Contact Direction",
    company: "ECHO",
    email: "fabrice@echo-sa" + "ntic.com",
    phone: "N/A",
    position: "Directeur",
    industry: "Technologie",
    company_size: "1-50",
    location: "France",
    website: "",
    status: "cold",
    priority: "low",
    engagement_score: 2,
    revenue_potential: 18000,
    purchase_count: 0,
    current_microsoft_products: [],
    pain_points: [],
    decision_timeline: "À déterminer",
    budget_range: "15k-30k€",
    decision_makers: "Direction",
    copilot_interest_level: 4,
    copilot_use_cases: [],
    copilot_blockers: [],
    notes: "New copilot campaign",
    last_contact: "",
    next_action: "Outreach email"
  },

  // LEADS À NE PAS CONTACTER - Statut spécial
  {
    name: "Yvan NONIS",
    company: "PANO",
    email: "yvan.nonis@pano.fr",
    phone: "N/A",
    position: "Directeur",
    industry: "Services",
    company_size: "1-50",
    location: "France",
    website: "",
    status: "cold",
    priority: "low",
    engagement_score: 1,
    revenue_potential: 5000,
    purchase_count: 0,
    current_microsoft_products: [],
    pain_points: [],
    decision_timeline: "N/A",
    budget_range: "N/A",
    decision_makers: "Yvan NONIS",
    copilot_interest_level: 1,
    copilot_use_cases: [],
    copilot_blockers: ["Sécurité données", "ROI incertain"],
    notes: "DATAVENT Logiciels - Sent zero - DO NOT CONTACT",
    last_contact: "",
    next_action: "Aucune action"
  },

  // LEADS ORGANISMES PUBLICS
  {
    name: "Contact GIRONDE SOLIS CLAIR",
    company: "GROUPE SOLIS CLAIR",
    email: "contact@" + "groupesolis" + "clair.com",
    phone: "N/A",
    position: "Responsable",
    industry: "Services Publics",
    company_size: "51-200",
    location: "Gironde, France",
    website: "",
    status: "warm",
    priority: "medium",
    engagement_score: 6,
    revenue_potential: 85000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365"],
    pain_points: ["Sécurité", "Collaboration difficile"],
    decision_timeline: "Q2 2025",
    budget_range: "50k-100k€",
    decision_makers: "Direction",
    copilot_interest_level: 6,
    copilot_use_cases: ["Rédaction emails/documents", "Automatisation tâches"],
    copilot_blockers: ["Sécurité données", "Budget"],
    notes: "Sent every way possible - EXA",
    last_contact: "",
    next_action: "Présentation sécurité"
  },

  // LEADS DISTRIBUTION & TECH
  {
    name: "Contact Technique",
    company: "ALSO",
    email: "sales@also.com",
    phone: "N/A",
    position: "Sales Manager",
    industry: "Distribution IT",
    company_size: "1000+",
    location: "France",
    website: "https://also.com",
    status: "active",
    priority: "high",
    engagement_score: 9,
    revenue_potential: 350000,
    purchase_count: 7,
    current_microsoft_products: ["Microsoft 365", "Azure", "Dynamics 365"],
    pain_points: [],
    decision_timeline: "Ongoing",
    budget_range: "250k+€",
    decision_makers: "Direction Commerciale",
    copilot_interest_level: 9,
    copilot_use_cases: ["Rédaction emails/documents", "Analyse données Excel", "Automatisation tâches"],
    copilot_blockers: [],
    notes: "Distributeur majeur - Partner tier 2",
    last_contact: "",
    next_action: "Partner review"
  },
  {
    name: "Contact Business",
    company: "DICKSON",
    email: "hdicksonlabs.fr",
    phone: "N/A",
    position: "Business Manager",
    industry: "Services",
    company_size: "51-200",
    location: "France",
    website: "",
    status: "warm",
    priority: "medium",
    engagement_score: 5,
    revenue_potential: 42000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365"],
    pain_points: ["Productivité faible"],
    decision_timeline: "Q1 2025",
    budget_range: "30k-60k€",
    decision_makers: "Direction",
    copilot_interest_level: 6,
    copilot_use_cases: ["Rédaction emails/documents"],
    copilot_blockers: ["ROI incertain"],
    notes: "Sent view/Audit",
    last_contact: "",
    next_action: "Demo scheduling"
  },

  // LEADS SECTEUR OFFICE & SERVICES
  {
    name: "Christine MARCANDELLA",
    company: "OE OFFICE EQUIPEMENT DIDOT-ODES",
    email: "christine.marcandella@oeoffice.com",
    phone: "N/A",
    position: "Responsable",
    industry: "Équipement de Bureau",
    company_size: "51-200",
    location: "France",
    website: "",
    status: "warm",
    priority: "medium",
    engagement_score: 6,
    revenue_potential: 55000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365", "Teams"],
    pain_points: ["Collaboration difficile", "Adoption technologie"],
    decision_timeline: "Q1 2025",
    budget_range: "40k-80k€",
    decision_makers: "Christine MARCANDELLA",
    copilot_interest_level: 7,
    copilot_use_cases: ["Rédaction emails/documents", "Automatisation tâches"],
    copilot_blockers: ["Adoption utilisateurs"],
    notes: "Sent every way possible - Minotes",
    last_contact: "",
    next_action: "Workshop utilisateurs"
  },

  // LEADS VERTICALS SPÉCIFIQUES
  {
    name: "Samuel DAPREY",
    company: "AMPERE",
    email: "samuel.daprey@ampere.com",
    phone: "N/A",
    position: "Directeur Technique",
    industry: "Technologie & Innovation",
    company_size: "201-1000",
    location: "France",
    website: "",
    status: "warm",
    priority: "high",
    engagement_score: 7,
    revenue_potential: 125000,
    purchase_count: 0,
    current_microsoft_products: ["Azure", "Microsoft 365"],
    pain_points: ["Infrastructure legacy", "Intégration système"],
    decision_timeline: "Q1 2025",
    budget_range: "100k-200k€",
    decision_makers: "Samuel DAPREY",
    copilot_interest_level: 8,
    copilot_use_cases: ["Coding assistance", "Analyse données Excel", "Automatisation tâches"],
    copilot_blockers: ["Intégration existante"],
    notes: "SAS DESTINY FRANCE ENTERPRISES - Sent every way possible",
    last_contact: "",
    next_action: "Technical deep dive"
  },

  // LEADS ASSOCIATIONS & FEDERATIONS
  {
    name: "Aurore GUEDON",
    company: "FEDERATION DE CURLING CARITAS A LA PLACE ISOLE",
    email: "aguedon@" + "curlades" + "hatraaux-place.org",
    phone: "N/A",
    position: "Responsable",
    industry: "Association Sportive",
    company_size: "1-50",
    location: "France",
    website: "",
    status: "cold",
    priority: "low",
    engagement_score: 3,
    revenue_potential: 8000,
    purchase_count: 0,
    current_microsoft_products: [],
    pain_points: ["Collaboration difficile", "Formation utilisateurs"],
    decision_timeline: "Q3 2025",
    budget_range: "5k-15k€",
    decision_makers: "Bureau de l'association",
    copilot_interest_level: 3,
    copilot_use_cases: ["Rédaction emails/documents"],
    copilot_blockers: ["Budget", "Formation"],
    notes: "ACEIS Sari - Sent every way possible",
    last_contact: "",
    next_action: "Non-profit offering"
  },

  // LEADS RETAIL & COMMERCE
  {
    name: "Jean-Paul FONTAINE",
    company: "PLAY-FIVE",
    email: "jp.fontaine@" + "play-five.com / not the best person / benoit@alsanet.com",
    phone: "N/A",
    position: "Directeur",
    industry: "Commerce & Retail",
    company_size: "51-200",
    location: "France",
    website: "",
    status: "cold",
    priority: "medium",
    engagement_score: 4,
    revenue_potential: 32000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365"],
    pain_points: ["Productivité faible"],
    decision_timeline: "Q2 2025",
    budget_range: "20k-50k€",
    decision_makers: "Benoit (meilleur contact)",
    copilot_interest_level: 5,
    copilot_use_cases: ["Rédaction emails/documents", "Automatisation tâches"],
    copilot_blockers: ["Adoption utilisateurs"],
    notes: "ELIT TECHNOLOGY - Contact alternatif: benoit@alsanet.com",
    last_contact: "",
    next_action: "Contacter Benoit"
  },

  // LEADS SECTEUR AUTO & TRANSPORTS
  {
    name: "Audile",
    company: "AUTOMOBILES & L'OUEST",
    email: "h.andloga@" + "encalabs.com",
    phone: "N/A",
    position: "Responsable",
    industry: "Automobile",
    company_size: "51-200",
    location: "Ouest, France",
    website: "",
    status: "cold",
    priority: "medium",
    engagement_score: 4,
    revenue_potential: 48000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365"],
    pain_points: ["Collaboration difficile", "Infrastructure legacy"],
    decision_timeline: "Q2 2025",
    budget_range: "30k-70k€",
    decision_makers: "Direction",
    copilot_interest_level: 5,
    copilot_use_cases: ["Automatisation tâches"],
    copilot_blockers: ["Budget", "Intégration existante"],
    notes: "Sent view/Audit - Nanoste",
    last_contact: "",
    next_action: "Industry use case"
  },

  // LEADS INTERNATIONAL
  {
    name: "Gogand",
    company: "Goyard",
    email: "c@" + "goyard.com",
    phone: "N/A",
    position: "IT Manager",
    industry: "Luxe & Mode",
    company_size: "201-1000",
    location: "France",
    website: "https://goyard.com",
    status: "warm",
    priority: "high",
    engagement_score: 7,
    revenue_potential: 180000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365", "Azure"],
    pain_points: ["Sécurité", "Collaboration difficile"],
    decision_timeline: "Q1 2025",
    budget_range: "100k-250k€",
    decision_makers: "Direction IT",
    copilot_interest_level: 8,
    copilot_use_cases: ["Rédaction emails/documents", "Création présentations", "Automatisation tâches"],
    copilot_blockers: ["Sécurité données"],
    notes: "Marque de luxe - Potentiel élevé - 1H5 (#1)",
    last_contact: "",
    next_action: "Executive presentation"
  },

  // LEADS SERVICE PROVIDERS
  {
    name: "Pascal DE VICHY",
    company: "RELAIS & CHATEAU RESERVATION",
    email: "it.services@" + "relais" + "chateau.com",
    phone: "N/A",
    position: "IT Services Manager",
    industry: "Hôtellerie de Luxe",
    company_size: "201-1000",
    location: "France",
    website: "",
    status: "warm",
    priority: "high",
    engagement_score: 7,
    revenue_potential: 95000,
    purchase_count: 0,
    current_microsoft_products: ["Microsoft 365", "Teams"],
    pain_points: ["Collaboration difficile", "Productivité faible"],
    decision_timeline: "Q1 2025",
    budget_range: "75k-150k€",
    decision_makers: "Pascal DE VICHY",
    copilot_interest_level: 7,
    copilot_use_cases: ["Rédaction emails/documents", "Réunions/Teams", "Automatisation tâches"],
    copilot_blockers: ["Adoption utilisateurs"],
    notes: "Sent intro - No Partner tier 2",
    last_contact: "",
    next_action: "Hospitality use cases"
  }
];

// Fonction pour calculer le score automatiquement
function calculateLeadScore(lead) {
  let score = 0;
  const statusScores = { hot: 30, warm: 20, active: 15, cold: 5 };
  const priorityScores = { high: 20, medium: 10, low: 5 };

  score += statusScores[lead.status] || 0;
  score += priorityScores[lead.priority] || 0;
  score += lead.engagement_score || 0;
  score += Math.min((lead.revenue_potential || 0) / 5000, 20);
  score += Math.min((lead.purchase_count || 0) * 3, 15);
  score += lead.copilot_interest_level || 0;
  score += Math.min((lead.current_microsoft_products?.length || 0) * 2, 10);
  score += Math.min((lead.copilot_use_cases?.length || 0), 5);

  return Math.round(score);
}

// Calculer les scores pour tous les leads
const leadsWithScores = leads.map(lead => ({
  ...lead,
  calculated_score: calculateLeadScore(lead)
}));

// Statistiques
console.log('=== STATISTIQUES DES LEADS IMPORTÉS ===\n');
console.log(`Total leads: ${leadsWithScores.length}`);
console.log(`Leads HOT: ${leadsWithScores.filter(l => l.status === 'hot').length}`);
console.log(`Leads WARM: ${leadsWithScores.filter(l => l.status === 'warm').length}`);
console.log(`Leads ACTIVE: ${leadsWithScores.filter(l => l.status === 'active').length}`);
console.log(`Leads COLD: ${leadsWithScores.filter(l => l.status === 'cold').length}`);
console.log(`\nHaute priorité: ${leadsWithScores.filter(l => l.priority === 'high').length}`);
console.log(`Moyenne priorité: ${leadsWithScores.filter(l => l.priority === 'medium').length}`);
console.log(`Basse priorité: ${leadsWithScores.filter(l => l.priority === 'low').length}`);

const avgScore = leadsWithScores.reduce((sum, l) => sum + l.calculated_score, 0) / leadsWithScores.length;
console.log(`\nScore moyen: ${Math.round(avgScore)}`);
console.log(`Leads score ≥80: ${leadsWithScores.filter(l => l.calculated_score >= 80).length}`);
console.log(`Leads score 60-79: ${leadsWithScores.filter(l => l.calculated_score >= 60 && l.calculated_score < 80).length}`);
console.log(`Leads score <60: ${leadsWithScores.filter(l => l.calculated_score < 60).length}`);

const totalRevenue = leadsWithScores.reduce((sum, l) => sum + (l.revenue_potential || 0), 0);
console.log(`\nPotentiel revenus total: ${(totalRevenue / 1000).toFixed(0)}k€`);

// Top 10 leads par score
console.log('\n=== TOP 10 LEADS PAR SCORE ===\n');
const top10 = [...leadsWithScores]
  .sort((a, b) => b.calculated_score - a.calculated_score)
  .slice(0, 10);

top10.forEach((lead, index) => {
  console.log(`${index + 1}. ${lead.company} - ${lead.name}`);
  console.log(`   Score: ${lead.calculated_score} | Status: ${lead.status.toUpperCase()} | Revenus: ${(lead.revenue_potential / 1000).toFixed(0)}k€`);
  console.log(`   Email: ${lead.email}`);
  console.log('');
});

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { leads: leadsWithScores, calculateLeadScore };
}

// Export JSON pour import direct
const fs = require('fs');
const path = require('path');

const exportPath = path.join(__dirname, '..', 'structured-leads-export.json');
fs.writeFileSync(exportPath, JSON.stringify(leadsWithScores, null, 2));
console.log(`\n✅ Leads exportés vers: ${exportPath}`);
console.log(`\nPour importer dans le Lead Builder:`);
console.log(`1. Ouvrez http://localhost:3000/structured-leads`);
console.log(`2. Cliquez sur "Import Excel"`);
console.log(`3. Sélectionnez le fichier structured-leads-export.json`);
