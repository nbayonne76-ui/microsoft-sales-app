const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Sample leads data
const sampleLeads = [
  {
    name: 'Marie Dubois',
    company: 'TechCorp France',
    email: 'marie.dubois@techcorp.fr',
    industry: 'Technology',
    status: 'hot',
    score: 95,
    engagement_score: 8.5,
    revenue: 50000,
    purchase_count: 3,
    notes: 'Interested in AI solutions'
  },
  {
    name: 'Jean Martin',
    company: 'RetailPlus',
    email: 'jean.martin@retailplus.com',
    industry: 'Retail',
    status: 'warm',
    score: 78,
    engagement_score: 7.2,
    revenue: 35000,
    purchase_count: 2,
    notes: 'Looking for productivity tools'
  },
  {
    name: 'Sophie Laurent',
    company: 'FinanceGlobal',
    email: 'sophie.laurent@financeglobal.com',
    industry: 'Finance',
    status: 'active',
    score: 88,
    engagement_score: 8.0,
    revenue: 75000,
    purchase_count: 5,
    notes: 'Enterprise client, high potential'
  },
  {
    name: 'Pierre Durand',
    company: 'ConsultPro',
    email: 'pierre.durand@consultpro.fr',
    industry: 'Consulting',
    status: 'hot',
    score: 92,
    engagement_score: 8.8,
    revenue: 45000,
    purchase_count: 4,
    notes: 'Ready to upgrade'
  },
  {
    name: 'Claire Petit',
    company: 'MediaCo',
    email: 'claire.petit@mediaco.com',
    industry: 'Media',
    status: 'warm',
    score: 70,
    engagement_score: 6.5,
    revenue: 28000,
    purchase_count: 1,
    notes: 'New contact, potential'
  },
  {
    name: 'Thomas Bernard',
    company: 'HealthTech Solutions',
    email: 'thomas.bernard@healthtech.com',
    industry: 'Healthcare',
    status: 'active',
    score: 85,
    engagement_score: 7.8,
    revenue: 60000,
    purchase_count: 3,
    notes: 'Interested in secure collaboration'
  },
  {
    name: 'Isabelle Moreau',
    company: 'EduSmart',
    email: 'isabelle.moreau@edusmart.fr',
    industry: 'Education',
    status: 'hot',
    score: 90,
    engagement_score: 8.3,
    revenue: 40000,
    purchase_count: 2,
    notes: 'Education sector leader'
  },
  {
    name: 'Michel Lefevre',
    company: 'LogistiqueExpress',
    email: 'michel.lefevre@logistique.com',
    industry: 'Logistics',
    status: 'warm',
    score: 75,
    engagement_score: 7.0,
    revenue: 32000,
    purchase_count: 2,
    notes: 'Operational efficiency focus'
  },
  {
    name: 'Nathalie Roux',
    company: 'InnovateLab',
    email: 'nathalie.roux@innovatelab.fr',
    industry: 'Research',
    status: 'active',
    score: 82,
    engagement_score: 7.5,
    revenue: 38000,
    purchase_count: 3,
    notes: 'Innovation-focused company'
  },
  {
    name: 'Laurent Simon',
    company: 'GreenEnergy Corp',
    email: 'laurent.simon@greenenergy.com',
    industry: 'Energy',
    status: 'hot',
    score: 94,
    engagement_score: 8.7,
    revenue: 80000,
    purchase_count: 4,
    notes: 'Sustainability-focused, high value'
  },
  // Add more sample leads to reach 50+
  ...Array.from({ length: 40 }, (_, i) => ({
    name: `Contact ${i + 11}`,
    company: `Company ${i + 11}`,
    email: `contact${i + 11}@company${i + 11}.com`,
    industry: ['Technology', 'Finance', 'Retail', 'Healthcare', 'Manufacturing'][i % 5],
    status: ['hot', 'warm', 'active', 'cold'][i % 4],
    score: Math.floor(Math.random() * 40) + 60,
    engagement_score: Math.round((Math.random() * 3 + 5) * 10) / 10,
    revenue: Math.floor(Math.random() * 50000) + 20000,
    purchase_count: Math.floor(Math.random() * 5),
    notes: 'Sample lead for testing'
  }))
];

// Create worksheet
const worksheet = XLSX.utils.json_to_sheet(sampleLeads);

// Create workbook
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

// Auto-size columns
const colWidths = Object.keys(sampleLeads[0]).map(key => ({
  wch: Math.max(
    key.length,
    ...sampleLeads.map(row => String(row[key] || '').length)
  ) + 2
}));
worksheet['!cols'] = colWidths;

// Save file
const outputPath = path.join(__dirname, '..', 'sample_leads.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log('✅ Sample leads Excel file created:', outputPath);
console.log(`📊 Total leads: ${sampleLeads.length}`);
console.log('📁 You can now use this file to test the Campaign Email Generator');
