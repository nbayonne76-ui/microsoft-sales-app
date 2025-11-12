'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Plus, Trash2, Save, Download, Upload, Star,
  Building2, Mail, Phone, MapPin, TrendingUp, Target,
  Users, Calendar, DollarSign, Briefcase, Award
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function StructuredLeadBuilder() {
  const [leads, setLeads] = useState([]);
  const [currentLead, setCurrentLead] = useState(getEmptyLead());
  const [editingIndex, setEditingIndex] = useState(null);
  const [filter, setFilter] = useState('all');

  function getEmptyLead() {
    return {
      // === CRM Lead Data (from Excel export) ===
      lead_id: '',
      topic: '',
      account_name: '',

      // Contact Info
      name: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      position: '',

      // Company/Account Info
      company: '',
      industry: '',
      company_size: '',
      location: '',
      address: '',
      website: '',

      // === Lead Scoring & Status ===
      lead_score: 0,
      lead_age: 0,
      status: 'cold',
      status_reason: '',
      rating: '',
      priority: 'medium',
      engagement_score: 5,

      // === Sales Info ===
      active_sales_stage: '',
      primary_product: '',
      est_value: 0,
      est_quantity: 0,
      est_close_date: '',
      revenue_potential: 0,
      annual_revenue: '',

      // === Activity Tracking ===
      number_of_dials: 0,
      last_dialed_at: '',
      last_contact: '',
      next_action: '',
      created_on: '',

      // === Source & Campaign ===
      lead_source: '',
      source_sub_type: '',
      source_campaign: '',
      promotion_code: '',

      // === Competition ===
      primary_competitor: '',
      other_competitor: '',
      compete_threat_level: '',

      // === Partner Info ===
      partner_tier1: '',
      partner_tier2: '',
      tpid: '',
      allocated_tpid: '',
      assignment: '',

      // === Microsoft Ecosystem ===
      current_microsoft_products: [],
      pain_points: [],
      decision_timeline: '',
      budget_range: '',
      decision_makers: '',
      purchase_count: 0,
      territory: '',

      // === Copilot Specific ===
      copilot_interest_level: 5,
      copilot_use_cases: [],
      copilot_blockers: [],
      action: '',

      // === Notes & Follow-up ===
      notes: '',
      comments: '',
      owner: '',

      // === Calculated ===
      calculated_score: 0
    };
  }

  const microsoftProducts = [
    'Microsoft 365', 'Azure', 'Dynamics 365', 'Power Platform',
    'Teams', 'SharePoint', 'OneDrive', 'Exchange', 'Intune'
  ];

  const painPoints = [
    'Productivité faible', 'Collaboration difficile', 'Coûts élevés',
    'Sécurité', 'Intégration système', 'Formation utilisateurs',
    'Adoption technologie', 'Infrastructure legacy'
  ];

  const copilotUseCases = [
    'Rédaction emails/documents', 'Analyse données Excel',
    'Création présentations', 'Recherche information',
    'Automatisation tâches', 'Coding assistance', 'Réunions/Teams'
  ];

  const copilotBlockers = [
    'Budget', 'Adoption utilisateurs', 'Sécurité données',
    'Intégration existante', 'Formation', 'ROI incertain'
  ];

  // Calcul automatique du score
  useEffect(() => {
    calculateScore();
  }, [
    currentLead.status,
    currentLead.priority,
    currentLead.engagement_score,
    currentLead.revenue_potential,
    currentLead.purchase_count,
    currentLead.copilot_interest_level,
    currentLead.current_microsoft_products,
    currentLead.copilot_use_cases
  ]);

  function calculateScore() {
    let score = 0;

    // Status (0-30 points)
    const statusScores = { hot: 30, warm: 20, active: 15, cold: 5 };
    score += statusScores[currentLead.status] || 0;

    // Priority (0-20 points)
    const priorityScores = { high: 20, medium: 10, low: 5 };
    score += priorityScores[currentLead.priority] || 0;

    // Engagement (0-10 points)
    score += currentLead.engagement_score || 0;

    // Revenue potential (0-20 points)
    score += Math.min((currentLead.revenue_potential || 0) / 5000, 20);

    // Purchase history (0-15 points)
    score += Math.min((currentLead.purchase_count || 0) * 3, 15);

    // Copilot interest (0-10 points)
    score += (currentLead.copilot_interest_level || 0);

    // Microsoft ecosystem (0-10 points)
    score += Math.min((currentLead.current_microsoft_products?.length || 0) * 2, 10);

    // Use cases identified (0-5 points)
    score += Math.min((currentLead.copilot_use_cases?.length || 0), 5);

    setCurrentLead(prev => ({ ...prev, calculated_score: Math.round(score) }));
  }

  function addOrUpdateLead() {
    if (!currentLead.name || !currentLead.company || !currentLead.email) {
      alert('Veuillez remplir au minimum: Nom, Entreprise et Email');
      return;
    }

    if (editingIndex !== null) {
      const updatedLeads = [...leads];
      updatedLeads[editingIndex] = { ...currentLead };
      setLeads(updatedLeads);
      setEditingIndex(null);
    } else {
      setLeads([...leads, { ...currentLead }]);
    }

    setCurrentLead(getEmptyLead());
  }

  function editLead(index) {
    setCurrentLead({ ...leads[index] });
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteLead(index) {
    if (confirm('Supprimer ce lead?')) {
      setLeads(leads.filter((_, i) => i !== index));
    }
  }

  function clearForm() {
    setCurrentLead(getEmptyLead());
    setEditingIndex(null);
  }

  function exportToExcel() {
    if (leads.length === 0) {
      alert('Aucun lead à exporter');
      return;
    }

    const exportData = leads.map(lead => ({
      // CRM & Identification
      'Lead Id': lead.lead_id,
      'Topic': lead.topic,
      'Account Name': lead.account_name || lead.company,

      // Contact Info
      'Name': lead.name,
      'First Name': lead.first_name,
      'Last Name': lead.last_name,
      'Email': lead.email,
      'Phone': lead.phone,
      'Position': lead.position,

      // Company Info
      'Company': lead.company,
      'Industry': lead.industry,
      'Company Size': lead.company_size,
      'Location': lead.location,
      'Address': lead.address,
      'Website': lead.website,

      // Lead Scoring & Status
      'Lead Score': lead.lead_score,
      'Lead Age': lead.lead_age,
      'Status': lead.status,
      'Status Reason': lead.status_reason,
      'Rating': lead.rating,
      'Priority': lead.priority,
      'Engagement Score': lead.engagement_score,
      'Calculated Score': lead.calculated_score,

      // Sales Info
      'Active Sales Stage': lead.active_sales_stage,
      'Primary Product': lead.primary_product,
      'Est. Value': lead.est_value,
      'Est. Quantity': lead.est_quantity,
      'Est. Close Date': lead.est_close_date,
      'Revenue Potential': lead.revenue_potential,
      'Annual Revenue': lead.annual_revenue,

      // Activity Tracking
      'Number of Dials': lead.number_of_dials,
      'Last Dialed At': lead.last_dialed_at,
      'Last Contact': lead.last_contact,
      'Next Action': lead.next_action,
      'Created On': lead.created_on,

      // Source & Campaign
      'Lead Source': lead.lead_source,
      'Source Sub-Type': lead.source_sub_type,
      'Source Campaign': lead.source_campaign,
      'Promotion Code': lead.promotion_code,

      // Competition
      'Primary Competitor': lead.primary_competitor,
      'Other Competitor': lead.other_competitor,
      'Compete Threat Level': lead.compete_threat_level,

      // Partner Info
      'Partner Tier1': lead.partner_tier1,
      'Partner Tier 2': lead.partner_tier2,
      'TPID': lead.tpid,
      'Allocated TPID': lead.allocated_tpid,
      'Assignment': lead.assignment,

      // Microsoft Ecosystem
      'Current Microsoft Products': lead.current_microsoft_products?.join(', '),
      'Pain Points': lead.pain_points?.join(', '),
      'Decision Timeline': lead.decision_timeline,
      'Budget Range': lead.budget_range,
      'Decision Makers': lead.decision_makers,
      'Purchase Count': lead.purchase_count,
      'Territory': lead.territory,

      // Copilot Specific
      'Copilot Interest Level': lead.copilot_interest_level,
      'Copilot Use Cases': lead.copilot_use_cases?.join(', '),
      'Copilot Blockers': lead.copilot_blockers?.join(', '),
      'Action': lead.action,

      // Notes & Follow-up
      'Notes': lead.notes,
      'Comments': lead.comments,
      'Owner': lead.owner
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads Copilot');

    const fileName = `Copilot_Leads_Structured_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  // Smart column mapping for various Excel formats
  function mapExcelRowToLead(row) {
    const getField = (...keys) => {
      for (const key of keys) {
        if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
          return row[key];
        }
      }
      return '';
    };

    const getArrayField = (...keys) => {
      const value = getField(...keys);
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') {
        return value.split(',').map(p => p.trim()).filter(Boolean);
      }
      return [];
    };

    const getNumberField = (defaultVal, ...keys) => {
      const value = getField(...keys);
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultVal : parsed;
    };

    const getIntField = (defaultVal, ...keys) => {
      const value = getField(...keys);
      const parsed = parseInt(value);
      return isNaN(parsed) ? defaultVal : parsed;
    };

    // Build full name from parts if needed
    let fullName = getField(' Name', 'Name', 'Nom', 'name');
    const firstName = getField('First Name', 'first_name', 'Prénom');
    const lastName = getField('Last Name', 'last_name', 'Nom de famille');
    if (!fullName && (firstName || lastName)) {
      fullName = `${firstName} ${lastName}`.trim();
    }

    return {
      // CRM Lead Data
      lead_id: getField('Lead Id', 'lead_id', 'ID Lead'),
      topic: getField('Topic', 'topic', 'Sujet'),
      account_name: getField('Account Name (Parent Account for lead) (Account)', 'Account Name', 'Account', 'account_name', 'Nom du compte'),

      // Contact Info
      name: fullName,
      first_name: firstName,
      last_name: lastName,
      email: getField('Email', 'email', 'Email Address'),
      phone: getField('Phone', 'Téléphone', 'phone', 'Business Phone'),
      position: getField('Position', 'position', 'Job Title', 'Title'),

      // Company/Account Info
      company: getField('Company', 'Entreprise', 'company', 'Account Name', 'Account'),
      industry: getField('Industry', 'Industrie', 'industry'),
      company_size: getField('Company Size', 'Taille entreprise', 'company_size', 'No. of Employees'),
      location: getField('Location', 'Localisation', 'location', 'City', 'Address 1'),
      address: getField('Address 1', 'Address', 'address', 'Adresse'),
      website: getField('Website', 'Site web', 'website', 'Company Website'),

      // Lead Scoring & Status
      lead_score: getNumberField(0, 'Lead Score', 'lead_score', 'Score'),
      lead_age: getIntField(0, 'Lead Age', 'lead_age', 'Age'),
      status: getField('Status', 'Statut', 'status') || 'cold',
      status_reason: getField('Status Reason', 'status_reason', 'Raison du statut'),
      rating: getField('Rating', 'rating', 'Notation'),
      priority: getField('Priority', 'Priorité', 'priority') || 'medium',
      engagement_score: getNumberField(5, 'Engagement Score', 'Score engagement', 'engagement_score'),

      // Sales Info
      active_sales_stage: getField('Active Sales Stage', 'active_sales_stage', 'Sales Stage', 'Étape de vente'),
      primary_product: getField('Primary Product', 'primary_product', 'Product', 'Produit principal'),
      est_value: getNumberField(0, 'Est. Value', 'est_value', 'Estimated Value', 'Est Value'),
      est_quantity: getNumberField(0, 'Est. Quantity', 'est_quantity', 'Est Quantity'),
      est_close_date: getField('Est. Close Date', 'est_close_date', 'Estimated Close Date', 'Close Date'),
      revenue_potential: getNumberField(0, 'Revenue Potential', 'Potentiel revenus', 'revenue_potential', 'Est. Value'),
      annual_revenue: getField('Annual revenue', 'Annual Revenue', 'annual_revenue', 'Revenus annuels'),

      // Activity Tracking
      number_of_dials: getIntField(0, 'Number of Dials', 'number_of_dials', 'Dials'),
      last_dialed_at: getField('Last Dialed At', 'last_dialed_at', 'Last Dial Date'),
      last_contact: getField('Last Contact', 'Dernier contact', 'last_contact', 'Last Contact Date'),
      next_action: getField('Next Action', 'Prochaine action', 'next_action', 'Next Step'),
      created_on: getField('Created On', 'created_on', 'Date de création', 'Create Date'),

      // Source & Campaign
      lead_source: getField('Lead Source', 'lead_source', 'Source', 'Source du lead'),
      source_sub_type: getField('Source Sub-Type', 'source_sub_type', 'Sub Type'),
      source_campaign: getField('Source Campaign', 'source_campaign', 'Campaign'),
      promotion_code: getField('Promotion Code (Source Campaign) (Campaign)', 'Promotion Code', 'promotion_code', 'Code promo'),

      // Competition
      primary_competitor: getField('Primary Competitor', 'primary_competitor', 'Concurrent principal'),
      other_competitor: getField('Other Competitor', 'other_competitor', 'Autres concurrents'),
      compete_threat_level: getField('Compete Threat Level', 'compete_threat_level', 'Niveau de menace'),

      // Partner Info
      partner_tier1: getField('Partner Tier1', 'Partner Tier 1', 'partner_tier1'),
      partner_tier2: getField('Partner tier 2', 'Partner Tier 2', 'partner_tier2'),
      tpid: getField('TPID', 'tpid', 'Partner ID'),
      allocated_tpid: getField('Allocated TPID', 'allocated_tpid'),
      assignment: getField('Assignment ', 'Assignment', 'assignment', 'Assign'),

      // Microsoft Ecosystem
      current_microsoft_products: getArrayField('Current Microsoft Products', 'Produits Microsoft', 'current_microsoft_products', 'Microsoft Products'),
      pain_points: getArrayField('Pain Points', 'Pain points', 'pain_points'),
      decision_timeline: getField('Decision Timeline', 'Timeline décision', 'decision_timeline', 'Timeline'),
      budget_range: getField('Budget Range', 'Budget', 'budget_range'),
      decision_makers: getField('Decision Makers', 'Décideurs', 'decision_makers', 'Key Decision Makers'),
      purchase_count: getIntField(0, 'Purchase Count', 'Achats précédents', 'purchase_count', 'Previous Purchases'),
      territory: getField('Territory (Parent Account for lead) (Account)', 'Territory', 'territory', 'Territoire'),

      // Copilot Specific
      copilot_interest_level: getIntField(5, 'Copilot Interest Level', 'Intérêt Copilot', 'copilot_interest_level'),
      copilot_use_cases: getArrayField('Copilot Use Cases', 'Use cases Copilot', 'copilot_use_cases'),
      copilot_blockers: getArrayField('Copilot Blockers', 'Blockers Copilot', 'copilot_blockers'),
      action: getField('Action', 'action'),

      // Notes & Follow-up
      notes: getField('Notes', 'notes', 'Note', 'Description'),
      comments: getField('Comments', 'comments', 'Commentaires'),
      owner: getField('Owner', 'owner', 'Propriétaire', 'Assigned To'),

      // Calculated
      calculated_score: getIntField(0, 'Calculated Score', 'Score calculé', 'calculated_score')
    };
  }

  function importFromExcel(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Importing from Excel - Found columns:', Object.keys(jsonData[0] || {}));

        const importedLeads = jsonData.map(row => mapExcelRowToLead(row));

        setLeads(importedLeads);
        alert(`${importedLeads.length} leads importés avec succès!\n\nChamps détectés: ${Object.keys(jsonData[0] || {}).length} colonnes`);
      } catch (error) {
        console.error('Import error:', error);
        alert('Erreur lors de l\'import: ' + error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function saveToLocalStorage() {
    localStorage.setItem('copilot_leads', JSON.stringify(leads));
    alert('Leads sauvegardés localement!');
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('copilot_leads');
    if (saved) {
      setLeads(JSON.parse(saved));
      alert('Leads chargés!');
    } else {
      alert('Aucune sauvegarde trouvée');
    }
  }

  const filteredLeads = leads.filter(lead => {
    if (filter === 'all') return true;
    if (filter === 'hot') return lead.status === 'hot';
    if (filter === 'high-score') return lead.calculated_score >= 80;
    if (filter === 'high-priority') return lead.priority === 'high';
    return true;
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => b.calculated_score - a.calculated_score);

  const toggleArrayItem = (field, item) => {
    const current = currentLead[field] || [];
    if (current.includes(item)) {
      setCurrentLead({ ...currentLead, [field]: current.filter(i => i !== item) });
    } else {
      setCurrentLead({ ...currentLead, [field]: [...current, item] });
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusBadge = (status) => {
    const colors = {
      hot: 'bg-red-100 text-red-700',
      warm: 'bg-orange-100 text-orange-700',
      active: 'bg-blue-100 text-blue-700',
      cold: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || colors.cold;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Constructeur de Leads Structuré
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Créez et gérez vos top leads pour la campagne Microsoft Copilot
          </p>
        </div>

        {/* Actions rapides */}
        <div className="flex gap-3 mb-6 flex-wrap justify-center">
          <Button onClick={saveToLocalStorage} variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
          <Button onClick={loadFromLocalStorage} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Charger
          </Button>
          <Button onClick={exportToExcel} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <label className="cursor-pointer">
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import Excel
              </span>
            </Button>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={importFromExcel}
              className="hidden"
            />
          </label>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total Leads</div>
                <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
              </div>
              <Users className="w-8 h-8 text-blue-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Leads HOT</div>
                <div className="text-2xl font-bold text-red-600">
                  {leads.filter(l => l.status === 'hot').length}
                </div>
              </div>
              <Star className="w-8 h-8 text-red-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Score Moyen</div>
                <div className="text-2xl font-bold text-green-600">
                  {leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.calculated_score, 0) / leads.length) : 0}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 opacity-50" />
            </div>
          </Card>

          <Card className="p-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Priorité Haute</div>
                <div className="text-2xl font-bold text-purple-600">
                  {leads.filter(l => l.priority === 'high').length}
                </div>
              </div>
              <Award className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire de création */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingIndex !== null ? 'Modifier le Lead' : 'Nouveau Lead'}
                </h2>
                {editingIndex !== null && (
                  <Button variant="outline" size="sm" onClick={clearForm}>
                    Annuler
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {/* Informations de base */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Informations de Contact
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Nom complet *"
                      value={currentLead.name}
                      onChange={(e) => setCurrentLead({ ...currentLead, name: e.target.value })}
                    />
                    <Input
                      placeholder="Position"
                      value={currentLead.position}
                      onChange={(e) => setCurrentLead({ ...currentLead, position: e.target.value })}
                    />
                    <Input
                      placeholder="Email *"
                      type="email"
                      value={currentLead.email}
                      onChange={(e) => setCurrentLead({ ...currentLead, email: e.target.value })}
                    />
                    <Input
                      placeholder="Téléphone"
                      value={currentLead.phone}
                      onChange={(e) => setCurrentLead({ ...currentLead, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Informations entreprise */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Entreprise
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Nom entreprise *"
                      value={currentLead.company}
                      onChange={(e) => setCurrentLead({ ...currentLead, company: e.target.value })}
                    />
                    <Input
                      placeholder="Industrie"
                      value={currentLead.industry}
                      onChange={(e) => setCurrentLead({ ...currentLead, industry: e.target.value })}
                    />
                    <select
                      className="p-2 border rounded-md"
                      value={currentLead.company_size}
                      onChange={(e) => setCurrentLead({ ...currentLead, company_size: e.target.value })}
                    >
                      <option value="">Taille entreprise</option>
                      <option value="1-50">1-50 employés</option>
                      <option value="51-200">51-200 employés</option>
                      <option value="201-1000">201-1000 employés</option>
                      <option value="1000+">1000+ employés</option>
                    </select>
                    <Input
                      placeholder="Localisation"
                      value={currentLead.location}
                      onChange={(e) => setCurrentLead({ ...currentLead, location: e.target.value })}
                    />
                    <Input
                      placeholder="Site web"
                      className="col-span-2"
                      value={currentLead.website}
                      onChange={(e) => setCurrentLead({ ...currentLead, website: e.target.value })}
                    />
                  </div>
                </div>

                {/* Scoring */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Scoring et Priorité
                  </h3>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Statut</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={currentLead.status}
                        onChange={(e) => setCurrentLead({ ...currentLead, status: e.target.value })}
                      >
                        <option value="cold">Cold</option>
                        <option value="warm">Warm</option>
                        <option value="active">Active</option>
                        <option value="hot">Hot</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Priorité</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={currentLead.priority}
                        onChange={(e) => setCurrentLead({ ...currentLead, priority: e.target.value })}
                      >
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Engagement (0-10)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        value={currentLead.engagement_score}
                        onChange={(e) => setCurrentLead({ ...currentLead, engagement_score: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Potentiel revenus (€)
                      </label>
                      <Input
                        type="number"
                        placeholder="Ex: 50000"
                        value={currentLead.revenue_potential}
                        onChange={(e) => setCurrentLead({ ...currentLead, revenue_potential: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">
                        Achats précédents
                      </label>
                      <Input
                        type="number"
                        placeholder="Nombre"
                        value={currentLead.purchase_count}
                        onChange={(e) => setCurrentLead({ ...currentLead, purchase_count: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Produits Microsoft */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Produits Microsoft actuels
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {microsoftProducts.map(product => (
                      <button
                        key={product}
                        onClick={() => toggleArrayItem('current_microsoft_products', product)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          currentLead.current_microsoft_products?.includes(product)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {product}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pain Points */}
                <div>
                  <h3 className="font-semibold mb-2">Pain Points identifiés</h3>
                  <div className="flex flex-wrap gap-2">
                    {painPoints.map(point => (
                      <button
                        key={point}
                        onClick={() => toggleArrayItem('pain_points', point)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          currentLead.pain_points?.includes(point)
                            ? 'bg-orange-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {point}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Copilot spécifique */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Microsoft Copilot - Spécifique
                  </h3>

                  <div className="mb-3">
                    <label className="text-xs text-gray-600 block mb-1">
                      Niveau d'intérêt Copilot (0-10)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      value={currentLead.copilot_interest_level}
                      onChange={(e) => setCurrentLead({ ...currentLead, copilot_interest_level: parseInt(e.target.value) || 5 })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="text-xs text-gray-600 block mb-2">Use Cases Copilot</label>
                    <div className="flex flex-wrap gap-2">
                      {copilotUseCases.map(usecase => (
                        <button
                          key={usecase}
                          onClick={() => toggleArrayItem('copilot_use_cases', usecase)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            currentLead.copilot_use_cases?.includes(usecase)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {usecase}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600 block mb-2">Blockers potentiels</label>
                    <div className="flex flex-wrap gap-2">
                      {copilotBlockers.map(blocker => (
                        <button
                          key={blocker}
                          onClick={() => toggleArrayItem('copilot_blockers', blocker)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            currentLead.copilot_blockers?.includes(blocker)
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {blocker}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contexte commercial */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Contexte Commercial
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input
                      placeholder="Timeline décision (ex: Q1 2025)"
                      value={currentLead.decision_timeline}
                      onChange={(e) => setCurrentLead({ ...currentLead, decision_timeline: e.target.value })}
                    />
                    <Input
                      placeholder="Budget (ex: 10-50k€)"
                      value={currentLead.budget_range}
                      onChange={(e) => setCurrentLead({ ...currentLead, budget_range: e.target.value })}
                    />
                  </div>
                  <Input
                    placeholder="Décideurs clés"
                    className="mb-3"
                    value={currentLead.decision_makers}
                    onChange={(e) => setCurrentLead({ ...currentLead, decision_makers: e.target.value })}
                  />
                </div>

                {/* Notes et actions */}
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Suivi
                  </h3>
                  <textarea
                    placeholder="Notes générales..."
                    className="w-full p-2 border rounded-md mb-3 min-h-[80px]"
                    value={currentLead.notes}
                    onChange={(e) => setCurrentLead({ ...currentLead, notes: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="date"
                      placeholder="Dernier contact"
                      value={currentLead.last_contact}
                      onChange={(e) => setCurrentLead({ ...currentLead, last_contact: e.target.value })}
                    />
                    <Input
                      placeholder="Prochaine action"
                      value={currentLead.next_action}
                      onChange={(e) => setCurrentLead({ ...currentLead, next_action: e.target.value })}
                    />
                  </div>
                </div>

                {/* Score calculé */}
                <div className={`p-4 rounded-lg ${getScoreColor(currentLead.calculated_score)}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Score Calculé Automatiquement:</span>
                    <span className="text-3xl font-bold">{currentLead.calculated_score}</span>
                  </div>
                  <div className="text-xs mt-2 opacity-75">
                    Basé sur: statut, priorité, engagement, revenus, historique, intérêt Copilot, écosystème Microsoft
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3">
                  <Button
                    onClick={addOrUpdateLead}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {editingIndex !== null ? 'Mettre à Jour' : 'Ajouter Lead'}
                  </Button>
                  {editingIndex !== null && (
                    <Button variant="outline" onClick={clearForm}>
                      Annuler
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Liste des leads */}
          <div>
            <Card className="p-6 bg-white sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Leads ({sortedLeads.length})</h2>
                <select
                  className="p-2 border rounded-md text-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Tous</option>
                  <option value="hot">HOT uniquement</option>
                  <option value="high-score">Score ≥ 80</option>
                  <option value="high-priority">Priorité haute</option>
                </select>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
                {sortedLeads.map((lead, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => editLead(leads.indexOf(lead))}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{lead.name}</h3>
                        <p className="text-xs text-gray-600">{lead.company}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getScoreColor(lead.calculated_score)}`}>
                          {lead.calculated_score}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteLead(leads.indexOf(lead));
                          }}
                          className="text-red-600 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusBadge(lead.status)}`}>
                        {lead.status.toUpperCase()}
                      </span>
                      {lead.copilot_interest_level >= 7 && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
                          Copilot 🎯
                        </span>
                      )}
                      {lead.priority === 'high' && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700">
                          Priorité haute
                        </span>
                      )}
                    </div>
                    {lead.copilot_use_cases?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        {lead.copilot_use_cases.length} use case(s)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
