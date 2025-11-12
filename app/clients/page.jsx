'use client';

import { useState, useEffect } from 'react';
import { Users, Building, Calendar, TrendingUp, MessageCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientHistory, setClientHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/clients');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setClients(result.data);
        }
      }
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadClientHistory = async (clientId) => {
    try {
      setLoadingHistory(true);
      const response = await fetch(`/api/interactions?clientId=${clientId}&limit=50`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setClientHistory(result.data);
        }
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const selectClient = (client) => {
    setSelectedClient(client);
    loadClientHistory(client.id);
  };

  const getSegmentBadge = (segment) => {
    const styles = {
      enterprise: 'bg-purple-100 text-purple-800',
      sme: 'bg-blue-100 text-blue-800',
      startup: 'bg-green-100 text-green-800'
    };
    return styles[segment] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      converted: 'bg-yellow-100 text-yellow-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return styles[priority] || 'bg-gray-100 text-gray-800';
  };

  if (selectedClient) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSelectedClient(null);
                    setClientHistory(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedClient.company}
                  </h1>
                  <p className="text-gray-600">
                    {selectedClient.industry} • {selectedClient.employeeCount || 'N/A'} employés
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSegmentBadge(selectedClient.segment)}`}>
                  {selectedClient.segment}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(selectedClient.status)}`}>
                  {selectedClient.status}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityBadge(selectedClient.priority)}`}>
                  {selectedClient.priority}
                </span>
              </div>
            </div>
            
            {selectedClient.currentChallenges && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Défis identifiés :</h3>
                <p className="text-blue-800">{selectedClient.currentChallenges}</p>
              </div>
            )}
          </div>

          {/* Historique des interactions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">Historique des interactions</h2>
              {loadingHistory && (
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {clientHistory && clientHistory.patterns && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {clientHistory.patterns.totalInteractions}
                  </div>
                  <div className="text-sm text-blue-800">Total interactions</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {clientHistory.patterns.responseRate}%
                  </div>
                  <div className="text-sm text-green-800">Taux de réponse</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {clientHistory.patterns.sentimentDistribution.positive || 0}
                  </div>
                  <div className="text-sm text-purple-800">Réponses positives</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {clientHistory.patterns.lastInteraction?.daysSince || 'N/A'}
                  </div>
                  <div className="text-sm text-yellow-800">Jours depuis dernière</div>
                </div>
              </div>
            )}

            {clientHistory && clientHistory.interactions ? (
              <div className="space-y-4">
                {clientHistory.interactions.map((interaction) => (
                  <div key={interaction.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          interaction.type === 'email' ? 'bg-blue-100 text-blue-800' :
                          interaction.type === 'call' ? 'bg-green-100 text-green-800' :
                          interaction.type === 'meeting' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {interaction.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          interaction.status === 'responded' ? 'bg-green-100 text-green-800' :
                          interaction.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                          interaction.status === 'opened' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {interaction.status}
                        </span>
                        {interaction.responseSentiment && (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            interaction.responseSentiment === 'positive' ? 'bg-green-100 text-green-800' :
                            interaction.responseSentiment === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {interaction.responseSentiment}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(interaction.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    
                    {interaction.subject && (
                      <h4 className="font-medium text-gray-900 mb-2">{interaction.subject}</h4>
                    )}
                    
                    {interaction.context && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Contexte :</span> {interaction.context}
                      </p>
                    )}
                    
                    {interaction.intent && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Intention :</span> {interaction.intent}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Aucune interaction trouvée pour ce client
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion Clients</h1>
              <p className="text-gray-600">Base de données des clients et historique des interactions</p>
            </div>
            <Link 
              href="/ai-agent"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Retour AI Agent
            </Link>
          </div>
        </div>

        {/* Statistiques */}
        {clients.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{clients.length}</div>
                  <div className="text-gray-600">Clients total</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {clients.filter(c => c.status === 'active').length}
                  </div>
                  <div className="text-gray-600">Actifs</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {clients.filter(c => c.priority === 'high').length}
                  </div>
                  <div className="text-gray-600">Priorité haute</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <MessageCircle className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {clients.reduce((sum, c) => sum + (c._count?.interactions || 0), 0)}
                  </div>
                  <div className="text-gray-600">Interactions</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Liste des clients */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Clients</h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : clients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Aucun client dans la base de données</p>
                <p className="text-sm text-gray-400">
                  Les clients seront créés automatiquement lors de l'utilisation de l'AI Agent
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {clients.map((client) => (
                  <div 
                    key={client.id}
                    onClick={() => selectClient(client)}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{client.company}</h3>
                        <p className="text-sm text-gray-600">{client.industry}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getSegmentBadge(client.segment)}`}>
                        {client.segment}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(client.status)}`}>
                          {client.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityBadge(client.priority)}`}>
                          {client.priority}
                        </span>
                      </div>
                      <span className="text-gray-500">
                        {client._count?.interactions || 0} interactions
                      </span>
                    </div>
                    
                    {client.currentChallenges && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        {client.currentChallenges.substring(0, 100)}
                        {client.currentChallenges.length > 100 && '...'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}