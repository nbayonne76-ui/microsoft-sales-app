'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import {
  Building2, Mail, Phone, MapPin, Globe, Calendar,
  TrendingUp, Users, FileText, CheckCircle2, Clock,
  ArrowRight, DollarSign, Target, MessageSquare,
  Briefcase, Award, AlertCircle, Plus, Edit2, Save, X, RefreshCw, Sparkles
} from 'lucide-react';

export default function HotLeadViewer({ leadData }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isOpportunity, setIsOpportunity] = useState(leadData?.isOpportunity || false);
  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState('');
  const [enriching, setEnriching] = useState(false);
  const [enrichmentProgress, setEnrichmentProgress] = useState('');

  // Charger les données depuis leadData (de la base de données) ou utiliser des valeurs par défaut
  const [companyData, setCompanyData] = useState({
    // Informations générales
    name: leadData?.companyName || leadData?.name || 'KARUM Actions Nature',
    description: leadData?.description || 'Bureau d\'études spécialisé en environnement créé il y a plus de 25 ans, réunissant une équipe de 22 personnes motivées par l\'intégration environnementale des projets d\'aménagement.',

    // Contact
    address: leadData?.address || '350, route de La Bétaz, 73390 Chamoux-sur-Gelon',
    phone: leadData?.phone || '+33 (0)4 79 84 34 88',
    email: leadData?.email || 'karum@karum.fr',
    website: leadData?.website || 'www.karum.fr',

    // Informations juridiques
    legalForm: leadData?.legalForm || 'SARL',
    creationDate: leadData?.creationDate || '10 avril 1996',
    capital: leadData?.capitalSocial || '100 000 €',
    siren: leadData?.siret?.substring(0, 9) || '404 867 251',
    siret: leadData?.siret || '40486725100047',
    naf: leadData?.nafCode || 'Ingénierie, études techniques',
    tvaNumber: leadData?.tvaNumber || '',
    closingDate: leadData?.closingDate || '',

    // Données financières
    turnover: leadData?.turnover || '861 155 €',
    employees: leadData?.employeeCount || 22,

    // Dirigeants (depuis la base de données)
    managers: leadData?.managers || [
      { name: 'M. Alain HALSKA', position: 'Gérant' },
      { name: 'M. Philippe SEAUVE', position: 'Gérant' }
    ],

    // Équipe et expertises (depuis la base de données)
    team: leadData?.teamMembers || [
      { name: 'Écologues naturalistes', role: 'faunistes et botanistes' },
      { name: 'Généralistes de l\'environnement', role: 'Études techniques' },
      { name: 'Paysagistes', role: 'Aménagement' },
      { name: 'Juriste', role: 'Droit de l\'environnement' }
    ],

    // Domaines d'intervention (depuis la base de données)
    services: leadData?.services || [
      { name: 'Expertises et faisabilités' },
      { name: 'Études réglementaires' },
      { name: 'Études et projets d\'aménagement' },
      { name: 'Maîtrise d\'œuvre' },
      { name: 'Observatoires et suivis' }
    ],

    specialties: leadData?.specialties || [
      { name: 'Écologie de montagne', domain: 'environnement' },
      { name: 'Zones humides', domain: 'environnement' },
      { name: 'Intégration paysagère', domain: 'paysage' },
      { name: 'Biodiversité', domain: 'écologie' },
      { name: 'Mesures compensatoires', domain: 'réglementaire' }
    ]
  });

  // Solutions Microsoft recommandées (depuis la base de données)
  const [microsoftSolutions, setMicrosoftSolutions] = useState(leadData?.solutions || [
    {
      name: 'Microsoft 365 Business Premium',
      priority: 'HAUTE',
      price: '~20€/utilisateur/mois',
      totalMonthly: '440€/mois (22 utilisateurs)',
      benefits: [
        'Collaboration terrain-bureau avec Teams',
        'Gestion documentaire SharePoint',
        'Synchronisation données OneDrive',
        'Sécurité des données projets'
      ],
      useCases: [
        'Partage photos/observations en temps réel',
        'Organisation études réglementaires',
        'Communication professionnelle',
        'Travail mobile pour inventaires'
      ]
    },
    {
      name: 'Microsoft Power BI',
      priority: 'HAUTE',
      price: '~10€/utilisateur/mois',
      totalMonthly: '50-100€/mois (5-10 utilisateurs)',
      benefits: [
        'Tableaux de bord écologiques',
        'Visualisation données biodiversité',
        'Suivi d\'observatoires',
        'Rapports clients dynamiques'
      ]
    },
    {
      name: 'Power Apps + Power Automate',
      priority: 'MOYENNE',
      price: '~40€/utilisateur/mois',
      benefits: [
        'Applications mobiles inventaires terrain',
        'Formulaires standardisés',
        'Automatisation workflows',
        'Géolocalisation observations'
      ]
    },
    {
      name: 'Azure Cloud + SQL Database',
      priority: 'MOYENNE',
      price: 'Variable selon usage',
      benefits: [
        'Hébergement Karnet eKo.Monitoring',
        'Base données observations',
        'Stockage cartographies SIG',
        'Backup sécurisé'
      ]
    }
  ]);

  // Timeline des interactions (depuis la base de données ou données par défaut)
  const [interactions, setInteractions] = useState(leadData?.interactions && leadData.interactions.length > 0 ? leadData.interactions : [
    {
      date: '2025-01-15',
      type: 'call',
      title: 'Premier appel - Découverte besoins',
      notes: `Meeting notes détaillées:

1. Clarification Rôle Nicolas:
   - Accompagnement financé par Microsoft (non facturé)
   - Aide gratuite aux projets Microsoft

2. Problème Technique Principal:
   - Déploiement API sur Azure bloqué
   - Fonctionne en local mais erreurs en production
   - Support standard insuffisant
   → Action: RDV avec spécialiste Azure jeudi/vendredi

3. Audit Sécurité:
   - Structure éligible audit sécurité Microsoft (gratuit)
   - Sécurité actuelle: Firewall + VPN propriétaire
   - Manque: Defender
   → Planification dans 2 semaines

4. Licences F3:
   - Présentées pour utilisateurs terrain
   - Usage terrain: Tablettes Android (SIG)
   - Usage bureau: Postes fixes`,
      contact: 'Stéphane',
      outcome: 'positive',
      nextActions: [
        'Organiser RDV spécialiste Azure jeudi/vendredi',
        'Audit sécurité dans 2 semaines',
        'Transmettre compte-rendu'
      ]
    }
  ]);

  // Actions depuis la base de données
  const [actions, setActions] = useState(leadData?.actions || [
    {
      action: 'Organiser RDV spécialiste Azure',
      priority: 'HAUTE',
      deadline: 'Cette semaine',
      status: 'pending'
    }
  ]);

  const convertToOpportunity = () => {
    setIsOpportunity(true);
    const newEvent = {
      date: new Date().toISOString().split('T')[0],
      type: 'conversion',
      title: 'Converti en Opportunité',
      notes: 'Lead qualifié converti en opportunité active',
      outcome: 'positive'
    };
    setInteractions([...interactions, newEvent]);
  };

  const addNote = () => {
    if (!notes.trim()) return;

    const newInteraction = {
      date: new Date().toISOString().split('T')[0],
      type: 'note',
      title: 'Note ajoutée',
      notes: notes,
      contact: 'Nicolas BAYONNE'
    };

    setInteractions([newInteraction, ...interactions]);
    setNotes('');
  };

  const calculateBudget = () => {
    let total = 0;
    microsoftSolutions.forEach(sol => {
      if (sol.totalMonthly) {
        const match = sol.totalMonthly.match(/(\d+)/);
        if (match) total += parseInt(match[1]);
      }
    });
    return total;
  };

  // Enrichir le lead avec les données d'internet
  const enrichLead = async () => {
    if (!leadData?.id) {
      toast.error('Impossible d\'enrichir: ID du lead manquant');
      return;
    }

    setEnriching(true);
    setEnrichmentProgress('🔍 Démarrage de l\'enrichissement...');
    toast.loading('Enrichissement en cours...', { id: 'enrichment' });

    try {
      console.log('🚀 Enrichissement du lead:', leadData.companyName);

      const response = await fetch('/api/enrich-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: leadData.id,
          companyName: leadData.companyName,
          forceRefresh: true
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Erreur lors de l\'enrichissement');
      }

      const result = await response.json();

      if (result.success) {
        const enrichedLead = result.lead;

        // Mettre à jour les données affichées
        setCompanyData(prev => ({
          ...prev,
          description: enrichedLead.description || prev.description,
          address: enrichedLead.address || prev.address,
          phone: enrichedLead.phone || prev.phone,
          email: enrichedLead.email || prev.email,
          website: enrichedLead.website || prev.website,
          employees: enrichedLead.employeeCount || prev.employees,
          legalForm: enrichedLead.legalForm || prev.legalForm,
          siret: enrichedLead.siret || prev.siret,
          naf: enrichedLead.nafCode || prev.naf,
          turnover: enrichedLead.turnover || prev.turnover,
          creationDate: enrichedLead.creationDate || prev.creationDate,
          managers: enrichedLead.managers && enrichedLead.managers.length > 0 ? enrichedLead.managers : prev.managers,
          services: enrichedLead.services && enrichedLead.services.length > 0 ? enrichedLead.services : prev.services,
          specialties: enrichedLead.specialties && enrichedLead.specialties.length > 0 ? enrichedLead.specialties : prev.specialties
        }));

        const fieldsEnriched = result.enrichment?.fieldsEnriched || [];
        const confidence = result.enrichment?.confidence || 0;

        setEnrichmentProgress(`✅ Enrichissement terminé! ${fieldsEnriched.length} champs enrichis`);

        toast.success(`Lead enrichi avec succès! ${fieldsEnriched.length} champs mis à jour (Confiance: ${confidence}%)`, {
          id: 'enrichment',
          duration: 5000
        });

        // Refresh lead data from server instead of full page reload
        setTimeout(async () => {
          try {
            const refreshResponse = await fetch(`/api/hot-leads?id=${leadData.id}`);
            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              if (refreshData.lead) {
                setCompanyData(refreshData.lead);
                // Trigger parent refresh if callback provided
                if (typeof window.refreshLeadList === 'function') {
                  window.refreshLeadList();
                }
              }
            }
          } catch (error) {
            console.error('Error refreshing lead data:', error);
          }
        }, 2000);
      }

    } catch (error) {
      console.error('❌ Erreur enrichissement:', error);
      setEnrichmentProgress(`❌ Erreur: ${error.message}`);
      toast.error(`Erreur lors de l'enrichissement: ${error.message}`, { id: 'enrichment' });
    } finally {
      setTimeout(() => {
        setEnriching(false);
        setEnrichmentProgress('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec statut */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                {companyData.name?.substring(0, 1) || 'K'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{companyData.name || 'Nom non disponible'}</h1>
                <p className="text-gray-600 mt-1">{companyData.tagline}</p>
                <div className="flex gap-2 mt-3">
                  {isOpportunity ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Target size={14} />
                      Opportunité Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold flex items-center gap-1">
                      <TrendingUp size={14} />
                      Hot Lead
                    </span>
                  )}
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {companyData.employees} employés
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                    Budget estimé: {calculateBudget()}€/mois
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={enrichLead}
                disabled={enriching}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {enriching ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Enrichissement...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" />
                    Enrichir depuis Internet
                  </>
                )}
              </Button>
              {!isOpportunity && (
                <Button onClick={convertToOpportunity} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <ArrowRight size={18} className="mr-2" />
                  Convertir en Opportunité
                </Button>
              )}
              <Button variant="outline">
                <Edit2 size={18} className="mr-2" />
                Éditer
              </Button>
            </div>
          </div>

          {/* Progress de l'enrichissement */}
          {enrichmentProgress && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium">{enrichmentProgress}</p>
            </div>
          )}
        </div>

        {/* Onglets de navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-semibold flex items-center gap-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              <Building2 size={18} />
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('solutions')}
              className={`px-6 py-4 font-semibold flex items-center gap-2 ${activeTab === 'solutions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              <Briefcase size={18} />
              Solutions Microsoft
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-4 font-semibold flex items-center gap-2 ${activeTab === 'timeline' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              <Clock size={18} />
              Historique ({interactions.length})
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-6 py-4 font-semibold flex items-center gap-2 ${activeTab === 'actions' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              <CheckCircle2 size={18} />
              Actions à suivre
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Colonne gauche - Informations entreprise */}
            <div className="col-span-2 space-y-6">
              {/* Informations générales */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Building2 className="text-blue-600" />
                  Informations Générales
                </h2>
                <p className="text-gray-700 mb-4">{companyData.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Adresse</p>
                      <p className="text-sm text-gray-600">{companyData.address}</p>
                      <p className="text-sm text-gray-600">{companyData.region}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Contact</p>
                      <p className="text-sm text-gray-600">{companyData.phone}</p>
                      <p className="text-sm text-gray-600">{companyData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Web</p>
                      <a href={`http://${companyData.website}`} className="text-sm text-blue-600 hover:underline">{companyData.website}</a>
                      <a href={companyData.linkedin} className="text-sm text-blue-600 hover:underline block">LinkedIn</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="text-gray-400 mt-1" size={18} />
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Effectif</p>
                      <p className="text-sm text-gray-600">{companyData.employees} employés</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Informations juridiques */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="text-blue-600" />
                  Informations Juridiques & Financières
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Forme juridique</p>
                    <p className="text-sm text-gray-600">{companyData.legalForm}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Date création</p>
                    <p className="text-sm text-gray-600">{companyData.creationDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Capital social</p>
                    <p className="text-sm text-gray-600">{companyData.capital}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">SIREN</p>
                    <p className="text-sm text-gray-600">{companyData.siren}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">SIRET</p>
                    <p className="text-sm text-gray-600">{companyData.siret}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">CA 2015</p>
                    <p className="text-sm text-gray-600">{companyData.revenue2015}</p>
                  </div>
                </div>

                {companyData.managers && companyData.managers.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Dirigeants</p>
                    {companyData.managers.map((manager, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {manager.name} - {manager.position}
                      </p>
                    ))}
                  </div>
                )}
              </Card>

              {/* Expertises et domaines */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="text-blue-600" />
                  Expertises & Domaines d'Intervention
                </h2>

                {companyData.team && companyData.team.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Équipe spécialisée</p>
                    <div className="flex flex-wrap gap-2">
                      {companyData.team.map((member, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {typeof member === 'string' ? member : `${member.name} - ${member.role}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {companyData.services && companyData.services.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Services proposés</p>
                    <div className="grid grid-cols-2 gap-2">
                      {companyData.services.map((service, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-green-600" />
                          <span className="text-sm text-gray-600">{typeof service === 'string' ? service : service.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {companyData.specialties && companyData.specialties.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Spécialités</p>
                    <div className="flex flex-wrap gap-2">
                      {companyData.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                          {typeof specialty === 'string' ? specialty : specialty.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Colonne droite - Contact principal et quick actions */}
            <div className="space-y-6">
              {/* Contact principal */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Users className="text-blue-600" />
                  Contact Principal
                </h2>
                {companyData.managers && companyData.managers.length > 0 && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{companyData.managers[0].name}</p>
                      <p className="text-sm text-gray-600">{companyData.managers[0].role || companyData.managers[0].position}</p>
                    </div>
                    {companyData.managers[0].email && (
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <a href={`mailto:${companyData.managers[0].email}`} className="text-sm text-blue-600 hover:underline">
                          {companyData.managers[0].email}
                        </a>
                      </div>
                    )}
                    {companyData.managers[0].phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">{companyData.managers[0].phone}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-4 border-t space-y-2">
                  <Button className="w-full" variant="outline">
                    <Mail size={16} className="mr-2" />
                    Envoyer Email
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Calendar size={16} className="mr-2" />
                    Planifier RDV
                  </Button>
                </div>
              </Card>

              {/* Quick stats */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Statistiques</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Score Lead</span>
                      <span className="text-sm font-bold text-green-600">95/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Interactions</p>
                    <p className="text-2xl font-bold text-gray-900">{interactions.length}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Dernier contact</p>
                    <p className="text-sm font-semibold text-gray-900">{interactions[0]?.date}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Budget estimé/mois</p>
                    <p className="text-2xl font-bold text-blue-600">{calculateBudget()}€</p>
                  </div>
                </div>
              </Card>

              {/* Historique rapide */}
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Historique Entreprise</h2>
                <div className="space-y-3">
                  {(companyData.history || []).map((event, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="text-sm font-bold text-blue-600 w-12">{event.year}</div>
                      <p className="text-sm text-gray-600 flex-1">{event.event}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Solutions Microsoft Recommandées</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Budget total estimé</p>
                  <p className="text-3xl font-bold text-blue-600">{calculateBudget()}€/mois</p>
                  <p className="text-sm text-gray-500">~{calculateBudget() * 12}€/an</p>
                </div>
              </div>

              <div className="grid gap-4">
                {microsoftSolutions.map((solution, idx) => (
                  <Card key={idx} className="p-6 border-l-4 border-l-blue-600">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{solution.name}</h3>
                        <div className="flex gap-2 mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            solution.priority === 'HAUTE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            Priorité: {solution.priority}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                            {solution.price}
                          </span>
                        </div>
                      </div>
                      {solution.totalMonthly && (
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{solution.totalMonthly}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Bénéfices</p>
                        <ul className="space-y-1">
                          {solution.benefits.map((benefit, bidx) => (
                            <li key={bidx} className="text-sm text-gray-600 flex items-start gap-2">
                              <CheckCircle2 size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {solution.useCases && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 mb-2">Cas d'usage KARUM</p>
                          <ul className="space-y-1">
                            {solution.useCases.map((useCase, uidx) => (
                              <li key={uidx} className="text-sm text-gray-600 flex items-start gap-2">
                                <Target size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                <span>{useCase}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            {/* Ajouter une note */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Ajouter une note / interaction</h2>
              <div className="flex gap-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes de l'interaction, compte-rendu de réunion..."
                  className="flex-1 p-3 border rounded-lg min-h-[100px]"
                />
                <Button onClick={addNote} className="h-12">
                  <Plus size={18} className="mr-2" />
                  Ajouter
                </Button>
              </div>
            </Card>

            {/* Timeline */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Historique des Interactions</h2>
              <div className="relative">
                {/* Ligne verticale */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-6">
                  {interactions.map((interaction, idx) => (
                    <div key={idx} className="relative pl-12">
                      {/* Point sur la timeline */}
                      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        interaction.type === 'call' ? 'bg-blue-600' :
                        interaction.type === 'conversion' ? 'bg-green-600' :
                        'bg-gray-600'
                      }`}>
                        {interaction.type === 'call' ? <Phone size={16} className="text-white" /> :
                         interaction.type === 'conversion' ? <Target size={16} className="text-white" /> :
                         <MessageSquare size={16} className="text-white" />}
                      </div>

                      <Card className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900">{interaction.title}</h3>
                            <p className="text-sm text-gray-500">{interaction.date} {interaction.contact && `• ${interaction.contact}`}</p>
                          </div>
                          {interaction.outcome && (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              interaction.outcome === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {interaction.outcome === 'positive' ? 'Positif' : 'Négatif'}
                            </span>
                          )}
                        </div>

                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans mb-3">
                          {interaction.notes}
                        </pre>

                        {interaction.nextActions && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Actions à suivre:</p>
                            <ul className="space-y-1">
                              {interaction.nextActions.map((action, aidx) => (
                                <li key={aidx} className="text-sm text-gray-600 flex items-start gap-2">
                                  <AlertCircle size={14} className="text-orange-600 mt-0.5" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Actions à Suivre</h2>

              <div className="space-y-4">
                <Card className="p-4 border-l-4 border-l-red-600">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-red-600 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-900">Organiser RDV spécialiste Azure</h3>
                        <p className="text-sm text-gray-600 mt-1">Problème déploiement API - Jeudi ou Vendredi cette semaine</p>
                        <p className="text-xs text-gray-500 mt-2">Deadline: Cette semaine</p>
                      </div>
                    </div>
                    <Button size="sm">
                      <Calendar size={16} className="mr-2" />
                      Planifier
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-orange-600">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Clock className="text-orange-600 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-900">Audit de sécurité Microsoft</h3>
                        <p className="text-sm text-gray-600 mt-1">Audit sécurité gratuit incluant Defender</p>
                        <p className="text-xs text-gray-500 mt-2">Deadline: Dans 2 semaines</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Calendar size={16} className="mr-2" />
                      Planifier
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-blue-600">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Mail className="text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-900">Transmettre compte-rendu</h3>
                        <p className="text-sm text-gray-600 mt-1">Envoyer CR de réunion à Stéphane</p>
                        <p className="text-xs text-gray-500 mt-2">Deadline: Aujourd'hui</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Mail size={16} className="mr-2" />
                      Envoyer
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-l-green-600">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="text-green-600 mt-1" />
                      <div>
                        <h3 className="font-bold text-gray-900">Proposition commerciale Microsoft 365</h3>
                        <p className="text-sm text-gray-600 mt-1">Préparer offre 22 licences + Power BI</p>
                        <p className="text-xs text-gray-500 mt-2">Deadline: Semaine prochaine</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <FileText size={16} className="mr-2" />
                      Créer
                    </Button>
                  </div>
                </Card>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
