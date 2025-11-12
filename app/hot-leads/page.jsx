'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Toaster } from "@/components/ui/sonner";
import { PlusCircle, Eye, Briefcase, TrendingUp, Users, RefreshCw } from 'lucide-react';
import HotLeadForm from '@/components/HotLeadForm';
import HotLeadViewer from '@/components/HotLeadViewer';
import { useAutoRefresh } from '@/hooks/useAutoRefresh';

export default function HotLeadsPage() {
  const [view, setView] = useState('list'); // 'list', 'form', 'detail'
  const [selectedLead, setSelectedLead] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    opportunities: 0,
    highPriority: 0
  });

  // Use automatic refresh hook with 30-second polling and multi-tab sync
  const fetchLeadsData = async () => {
    const response = await fetch('/api/hot-leads');
    const data = await response.json();
    if (!response.ok) throw new Error('Failed to fetch leads');
    return data.leads || [];
  };

  const {
    data: leads,
    loading,
    error,
    refresh
  } = useAutoRefresh(fetchLeadsData, {
    interval: 30000, // Refresh every 30 seconds
    enabled: view === 'list', // Only poll when on list view
    cacheKey: 'hot-leads-list',
    multiTabSync: true,
    onSuccess: (leadsData) => {
      // Calculate stats when leads update
      const total = leadsData?.length || 0;
      const opportunities = leadsData?.filter(l => l.isOpportunity).length || 0;
      const highPriority = leadsData?.filter(l => l.priority === 'HAUTE').length || 0;
      setStats({ total, opportunities, highPriority });
    }
  });

  // Expose refresh function globally for HotLeadViewer
  useEffect(() => {
    window.refreshLeadList = refresh;
    return () => {
      delete window.refreshLeadList;
    };
  }, [refresh]);

  const handleLeadCreated = (newLead) => {
    setView('list');
    refresh(); // Refresh using auto-refresh hook
  };

  const handleViewLead = async (leadId) => {
    try {
      const response = await fetch(`/api/hot-leads?id=${leadId}`);
      const data = await response.json();

      if (response.ok) {
        setSelectedLead(data.lead);
        setView('detail');
      }
    } catch (error) {
      console.error('Erreur chargement lead:', error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HAUTE': return 'bg-red-100 text-red-800 border-red-200';
      case 'MOYENNE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'BASSE': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (view === 'form') {
    return (
      <HotLeadForm
        onSuccess={handleLeadCreated}
        onCancel={() => setView('list')}
      />
    );
  }

  if (view === 'detail' && selectedLead) {
    return (
      <>
        <div>
          <div className="mb-4">
            <Button variant="outline" onClick={() => setView('list')}>
              ← Retour à la liste
            </Button>
          </div>
          <HotLeadViewer leadData={selectedLead} />
        </div>
        <Toaster />
      </>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hot Leads Manager</h1>
          <p className="text-gray-600">Gérez vos leads prioritaires Microsoft</p>
          <p className="text-xs text-gray-500 mt-1">
            🔄 Auto-refresh: 30s | Multi-tab sync: Enabled
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refresh} variant="outline" size="lg">
            <RefreshCw className="w-5 h-5 mr-2" />
            Actualiser
          </Button>
          <Button onClick={() => setView('form')} size="lg">
            <PlusCircle className="w-5 h-5 mr-2" />
            Nouveau Hot Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Leads</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Opportunités</p>
              <p className="text-3xl font-bold">{stats.opportunities}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Priorité Haute</p>
              <p className="text-3xl font-bold">{stats.highPriority}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Leads List */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Liste des Hot Leads</h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ⚠️ Erreur de chargement: {error.message}
            <Button onClick={refresh} variant="outline" size="sm" className="ml-2">
              Réessayer
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
            Chargement des leads...
          </div>
        ) : !leads || leads.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">Aucun hot lead pour le moment</p>
            <Button onClick={() => setView('form')}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Créer votre premier lead
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{lead.companyName}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                      {lead.isOpportunity && (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                          🎯 Opportunité
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {lead.description ?
                        (lead.description.length > 150 ? lead.description.substring(0, 150) + '...' : lead.description)
                        : 'Pas de description'
                      }
                    </p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {lead.employeeCount && (
                        <span>👥 {lead.employeeCount} employés</span>
                      )}
                      {lead.phone && (
                        <span>📞 {lead.phone}</span>
                      )}
                      {lead.email && (
                        <span>✉️ {lead.email}</span>
                      )}
                      {lead._count && (
                        <>
                          <span>💬 {lead._count.interactions} interactions</span>
                          <span>📋 {lead._count.actions} actions</span>
                          <span>🎁 {lead._count.solutions} solutions</span>
                        </>
                      )}
                    </div>

                    {lead.managers && lead.managers.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        👤 {lead.managers.map(m => m.name).join(', ')}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewLead(lead.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Voir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
