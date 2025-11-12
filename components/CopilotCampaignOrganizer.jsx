'use client';

import { useState } from 'react';
import { Download, TrendingUp, Users, AlertCircle, Upload, Edit2, Save, X, Sparkles, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';

export default function CopilotCampaignOrganizer() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [importing, setImporting] = useState(false);
  const [enriching, setEnriching] = useState(false);

  const getPriorite = (statut) => {
    if (statut.includes('Audit')) return 'HAUTE';
    if (statut === 'Sent') return 'MOYENNE';
    if (statut === 'Strategic account') return 'HAUTE';
    if (statut.includes('Nothing')) return 'BASSE';
    return 'À DÉFINIR';
  };

  const getAction = (statut) => {
    if (statut.includes('Audit')) return 'Relance après audit';
    if (statut === 'Sent') return 'Relance + Offre réduction';
    if (statut === 'Strategic account') return 'Appel personnalisé';
    if (statut.includes('Need to send')) return 'Envoyer audit + offre';
    if (statut.includes('Nothing')) return 'Qualification + offre';
    return 'À qualifier';
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setLoading(true);

    try {
      const data = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      const dataRows = allRows.slice(1);

      const organizedLeads = dataRows
        .filter(row => row[0]) // Filtrer les lignes vides
        .map(row => ({
          priorite: getPriorite(row[9] || ''),
          entreprise: row[0] || '',
          statut: row[9] || '',
          distributeur: row[4] || 'Non assigné',
          commercial1: row[7] || '',
          commercial2: row[8] || '',
          email: row[10] || '',
          telephone: row[11] || '',
          idClient: row[1] || '',
          code: row[5] || '',
          notes: row[12] || '',
          action: getAction(row[9] || ''),
          dateContact: '',
          reduction: '20%'
        }));

      // Trier par priorité
      const priorityOrder = { 'HAUTE': 1, 'MOYENNE': 2, 'BASSE': 3, 'À DÉFINIR': 4 };
      organizedLeads.sort((a, b) =>
        (priorityOrder[a.priorite] || 5) - (priorityOrder[b.priorite] || 5)
      );

      // Calculer les statistiques
      const statsData = {
        total: organizedLeads.length,
        haute: organizedLeads.filter(l => l.priorite === 'HAUTE').length,
        moyenne: organizedLeads.filter(l => l.priorite === 'MOYENNE').length,
        basse: organizedLeads.filter(l => l.priorite === 'BASSE').length,
        aDefinir: organizedLeads.filter(l => l.priorite === 'À DÉFINIR').length
      };

      setLeads(organizedLeads);
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      alert('Erreur lors du chargement du fichier: ' + error.message);
      setLoading(false);
    }
  };

  const updateLead = (index, field, value) => {
    const updatedLeads = [...leads];
    updatedLeads[index][field] = value;

    // Recalculer les stats si la priorité change
    if (field === 'priorite') {
      const statsData = {
        total: updatedLeads.length,
        haute: updatedLeads.filter(l => l.priorite === 'HAUTE').length,
        moyenne: updatedLeads.filter(l => l.priorite === 'MOYENNE').length,
        basse: updatedLeads.filter(l => l.priorite === 'BASSE').length,
        aDefinir: updatedLeads.filter(l => l.priorite === 'À DÉFINIR').length
      };
      setStats(statsData);
    }

    setLeads(updatedLeads);
  };

  // Importer vers Hot Leads avec enrichissement
  const importToHotLeads = async () => {
    if (leads.length === 0) {
      alert('Aucun lead à importer');
      return;
    }

    const confirm = window.confirm(
      `Importer ${leads.length} leads vers Hot Leads avec enrichissement automatique ?`
    );

    if (!confirm) return;

    setImporting(true);

    try {
      const response = await fetch('/api/import-campaign-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leads,
          campaignName: 'Copilot Campaign ' + new Date().toLocaleDateString(),
          autoEnrich: true
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(
          `✅ Import terminé!\n\n` +
          `${result.results.created} leads créés\n` +
          `${result.results.enriched} leads enrichis\n` +
          `${result.results.linked} leads liés aux clients`
        );
      } else {
        alert('❌ Erreur: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur import:', error);
      alert('Erreur lors de l\'import');
    } finally {
      setImporting(false);
    }
  };

  // Enrichir un lead spécifique
  const enrichSingleLead = async (index) => {
    const lead = leads[index];
    setEnriching(true);

    try {
      const response = await fetch('/api/enrich-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: lead.entreprise
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ "${lead.entreprise}" enrichi!\n\nChamps trouvés: ${result.enrichment.fieldsEnriched.join(', ')}`);
      } else {
        alert('❌ Erreur: ' + result.error);
      }
    } catch (error) {
      console.error('Erreur enrichissement:', error);
      alert('Erreur lors de l\'enrichissement');
    } finally {
      setEnriching(false);
    }
  };

  const downloadOrganizedFile = () => {
    if (leads.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    const data = [
      [
        'Priorité', 'Entreprise', 'Statut Campagne', 'Distributeur',
        'Commercial 1', 'Commercial 2', 'Email Contact', 'Téléphone',
        'ID Client', 'Code Opportunity', 'Notes', 'Action à Faire',
        'Date Contact', '% Réduction Proposée'
      ]
    ];

    leads.forEach(lead => {
      data.push([
        lead.priorite,
        lead.entreprise,
        lead.statut,
        lead.distributeur,
        lead.commercial1,
        lead.commercial2,
        lead.email,
        lead.telephone,
        lead.idClient,
        lead.code,
        lead.notes,
        lead.action,
        lead.dateContact,
        lead.reduction
      ]);
    });

    // Créer le workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Largeur des colonnes
    ws['!cols'] = [
      { wch: 12 }, { wch: 40 }, { wch: 20 }, { wch: 25 },
      { wch: 18 }, { wch: 18 }, { wch: 30 }, { wch: 15 },
      { wch: 12 }, { wch: 18 }, { wch: 30 }, { wch: 25 },
      { wch: 15 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Campagne Copilot');

    // Feuille statistiques
    const statsSheet = [
      ['TABLEAU DE BORD - CAMPAGNE RÉDUCTION COPILOT'],
      [''],
      ['Statistiques par Priorité'],
      ['Priorité', 'Nombre de Leads', 'Pourcentage'],
      ['HAUTE', stats.haute, `${Math.round(stats.haute / stats.total * 100)}%`],
      ['MOYENNE', stats.moyenne, `${Math.round(stats.moyenne / stats.total * 100)}%`],
      ['BASSE', stats.basse, `${Math.round(stats.basse / stats.total * 100)}%`],
      ['À DÉFINIR', stats.aDefinir, `${Math.round(stats.aDefinir / stats.total * 100)}%`],
      [''],
      ['Total Leads', stats.total, '100%']
    ];

    const wsStats = XLSX.utils.aoa_to_sheet(statsSheet);
    wsStats['!cols'] = [{ wch: 35 }, { wch: 18 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, wsStats, 'Tableau de Bord');

    // Télécharger
    XLSX.writeFile(wb, `Copilot_Campaign_ORGANISE_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'HAUTE': return 'bg-red-100 text-red-800 border-red-300';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'BASSE': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement et organisation des données...</p>
        </div>
      </div>
    );
  }

  // Vue initiale - Upload
  if (leads.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              🚀 Campagne Réduction Copilot
            </h1>
            <p className="text-gray-600 text-lg">
              Organisez automatiquement vos leads par priorité
            </p>
          </div>

          <Card className="p-8 bg-white shadow-xl">
            <div className="text-center">
              <div className="mb-6">
                <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Importez votre fichier Excel
                </h2>
                <p className="text-gray-600">
                  Le système organisera automatiquement vos leads par priorité
                </p>
              </div>

              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <p className="text-blue-600 font-semibold mb-2">
                    Cliquez pour sélectionner votre fichier
                  </p>
                  <p className="text-sm text-gray-500">
                    Format attendu: copilot campaign Top lead.xlsx
                  </p>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">
                  ✨ Fonctionnalités automatiques:
                </h3>
                <ul className="text-left space-y-2 text-gray-700">
                  <li>• <strong>Priorisation intelligente</strong> basée sur le statut</li>
                  <li>• <strong>Édition en ligne</strong> de tous les champs</li>
                  <li>• <strong>Actions recommandées</strong> pour chaque lead</li>
                  <li>• <strong>Statistiques en temps réel</strong></li>
                  <li>• <strong>Export Excel enrichi</strong> avec tableau de bord</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Vue principale - Données chargées
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Campagne Réduction Copilot 🚀
              </h1>
              <p className="text-gray-600">
                Gestion optimisée de vos {stats.total} leads prioritaires
              </p>
            </div>
            <div className="flex gap-3">
              <label className="cursor-pointer">
                <Button variant="outline">
                  <Upload size={20} className="mr-2" />
                  Nouveau fichier
                </Button>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <Button
                onClick={importToHotLeads}
                disabled={importing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Import en cours...
                  </>
                ) : (
                  <>
                    <Database size={20} className="mr-2" />
                    Importer vers Hot Leads
                  </>
                )}
              </Button>
              <Button
                onClick={downloadOrganizedFile}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download size={20} className="mr-2" />
                Télécharger Excel
              </Button>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Priorité HAUTE</p>
                  <p className="text-2xl font-bold text-red-700">{stats.haute}</p>
                </div>
                <AlertCircle className="text-red-500" size={32} />
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Priorité MOYENNE</p>
                  <p className="text-2xl font-bold text-yellow-700">{stats.moyenne}</p>
                </div>
                <TrendingUp className="text-yellow-500" size={32} />
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Priorité BASSE</p>
                  <p className="text-2xl font-bold text-green-700">{stats.basse}</p>
                </div>
                <Users className="text-green-500" size={32} />
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">À Définir</p>
                  <p className="text-2xl font-bold text-gray-700">{stats.aDefinir}</p>
                </div>
                <AlertCircle className="text-gray-500" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Table des leads - ÉDITABLE */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Priorité</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Entreprise</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Distributeur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Téléphone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leads.map((lead, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    {/* Boutons d'action */}
                    <td className="px-4 py-3">
                      {editingIndex === idx ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="text-green-600 hover:text-green-800"
                            title="Sauvegarder"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Annuler"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingIndex(idx)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Modifier"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                    </td>

                    {/* Priorité */}
                    <td className="px-4 py-3">
                      {editingIndex === idx ? (
                        <select
                          value={lead.priorite}
                          onChange={(e) => updateLead(idx, 'priorite', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          <option value="HAUTE">HAUTE</option>
                          <option value="MOYENNE">MOYENNE</option>
                          <option value="BASSE">BASSE</option>
                          <option value="À DÉFINIR">À DÉFINIR</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(lead.priorite)}`}>
                          {lead.priorite}
                        </span>
                      )}
                    </td>

                    {/* Entreprise */}
                    <td className="px-4 py-3">
                      {editingIndex === idx ? (
                        <Input
                          value={lead.entreprise}
                          onChange={(e) => updateLead(idx, 'entreprise', e.target.value)}
                          className="text-sm"
                        />
                      ) : (
                        <div>
                          <div className="font-medium text-gray-900">{lead.entreprise}</div>
                          <div className="text-xs text-gray-500">{lead.code}</div>
                        </div>
                      )}
                    </td>

                    {/* Statut */}
                    <td className="px-4 py-3">
                      {editingIndex === idx ? (
                        <Input
                          value={lead.statut}
                          onChange={(e) => updateLead(idx, 'statut', e.target.value)}
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-700">{lead.statut}</span>
                      )}
                    </td>

                    {/* Distributeur */}
                    <td className="px-4 py-3">
                      {editingIndex === idx ? (
                        <Input
                          value={lead.distributeur}
                          onChange={(e) => updateLead(idx, 'distributeur', e.target.value)}
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-700">{lead.distributeur}</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      {editingIndex === idx ? (
                        <select
                          value={lead.action}
                          onChange={(e) => updateLead(idx, 'action', e.target.value)}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          <option value="Relance après audit">Relance après audit</option>
                          <option value="Relance + Offre réduction">Relance + Offre réduction</option>
                          <option value="Appel personnalisé">Appel personnalisé</option>
                          <option value="Envoyer audit + offre">Envoyer audit + offre</option>
                          <option value="Qualification + offre">Qualification + offre</option>
                          <option value="À qualifier">À qualifier</option>
                        </select>
                      ) : (
                        <span className="text-sm font-medium text-blue-600">{lead.action}</span>
                      )}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      {editingIndex === idx ? (
                        <Input
                          type="email"
                          value={lead.email}
                          onChange={(e) => updateLead(idx, 'email', e.target.value)}
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{lead.email || '-'}</span>
                      )}
                    </td>

                    {/* Téléphone */}
                    <td className="px-4 py-3">
                      {editingIndex === idx ? (
                        <Input
                          type="tel"
                          value={lead.telephone}
                          onChange={(e) => updateLead(idx, 'telephone', e.target.value)}
                          placeholder="+33 X XX XX XX XX"
                          className="text-sm"
                        />
                      ) : (
                        <span className="text-sm text-gray-600">{lead.telephone || '-'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Légende */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📋 Guide des Actions</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="font-medium">Relance après audit:</span> Client ayant reçu un audit, prêt pour l'offre</div>
            <div><span className="font-medium">Relance + Offre réduction:</span> Email envoyé, besoin de follow-up</div>
            <div><span className="font-medium">Appel personnalisé:</span> Compte stratégique, contact direct nécessaire</div>
            <div><span className="font-medium">Qualification + offre:</span> Lead à qualifier avant proposition</div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Astuce:</strong> Cliquez sur l'icône <Edit2 size={14} className="inline" /> pour modifier n'importe quel lead.
              Les modifications sont automatiquement prises en compte dans l'export Excel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
