'use client';

import { useState, useMemo } from 'react';
import { Search, X, Filter, Grid, List, ChevronDown, ChevronRight, ExternalLink, Check, Star } from 'lucide-react';
import { m365CollaborationTools, getAllCollaborationTools, searchTools, licensingPlans } from '../lib/m365-collaboration-tools';

export default function M365ToolsExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [expandedTools, setExpandedTools] = useState(new Set());

  // Get all tools
  const allTools = useMemo(() => getAllCollaborationTools(), []);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    let tools = allTools;

    // Filter by category
    if (selectedCategory !== 'all') {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      tools = searchTools(searchQuery);
      if (selectedCategory !== 'all') {
        tools = tools.filter(tool => tool.category === selectedCategory);
      }
    }

    return tools;
  }, [allTools, selectedCategory, searchQuery]);

  // Categories
  const categories = [
    { id: 'all', name: 'Tous les outils', icon: '📦', count: allTools.length },
    { id: 'collaboration', name: 'Collaboration', icon: '💬', count: Object.keys(m365CollaborationTools.collaboration || {}).length },
    { id: 'viva', name: 'Microsoft Viva', icon: '🎯', count: Object.keys(m365CollaborationTools.viva || {}).length },
    { id: 'office', name: 'Office & Productivité', icon: '📄', count: Object.keys(m365CollaborationTools.office || {}).length },
    { id: 'planning', name: 'Planification', icon: '📋', count: Object.keys(m365CollaborationTools.planning || {}).length },
    { id: 'media', name: 'Médias & Création', icon: '🎥', count: Object.keys(m365CollaborationTools.media || {}).length }
  ];

  const toggleToolExpansion = (toolId) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📚 Microsoft 365 - Outils de Collaboration
              </h1>
              <p className="text-gray-600">
                Catalogue complet des outils Microsoft 365 - {filteredTools.length} outils disponibles
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un outil (Teams, SharePoint, Viva...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Categories */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Catégories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Licensing Plans */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Plans de licence</h3>
                <div className="space-y-2 text-xs">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-lg">
                    <p className="font-semibold text-blue-900">Business Basic</p>
                    <p className="text-blue-700">4.20€/utilisateur/mois</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-2 rounded-lg">
                    <p className="font-semibold text-green-900">Business Standard</p>
                    <p className="text-green-700">10.50€/utilisateur/mois</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-2 rounded-lg">
                    <p className="font-semibold text-purple-900">E3</p>
                    <p className="text-purple-700">31.20€/utilisateur/mois</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-2 rounded-lg">
                    <p className="font-semibold text-orange-900">E5</p>
                    <p className="text-orange-700">51.00€/utilisateur/mois</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Tools Grid/List */}
          <div className="col-span-12 lg:col-span-9">
            {filteredTools.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun outil trouvé</h3>
                <p className="text-gray-500">Essayez une autre recherche ou catégorie</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                  >
                    {/* Tool Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{tool.icon}</span>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{tool.name}</h3>
                            <p className="text-sm text-gray-500">{tool.category}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleToolExpansion(tool.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          {expandedTools.has(tool.id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>

                      <p className="text-sm text-gray-700 mb-4">{tool.shortDescription}</p>

                      {/* Pricing */}
                      {tool.pricing && (
                        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
                          <p className="text-xs font-semibold text-green-800">💰 {tool.pricing}</p>
                        </div>
                      )}

                      {/* Quick Features (always visible) */}
                      {tool.features && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-700 mb-2">Fonctionnalités principales:</p>
                          <ul className="space-y-1">
                            {tool.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                            {tool.features.length > 3 && !expandedTools.has(tool.id) && (
                              <li className="text-xs text-blue-600 font-semibold">
                                +{tool.features.length - 3} autres fonctionnalités
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Expanded Content */}
                      {expandedTools.has(tool.id) && (
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                          {/* All Features */}
                          {tool.features && tool.features.length > 3 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-2">
                                Toutes les fonctionnalités:
                              </p>
                              <ul className="space-y-1">
                                {tool.features.slice(3).map((feature, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                    <Check className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Business Value */}
                          {tool.businessValue && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-2">💎 Valeur métier:</p>
                              <ul className="space-y-1">
                                {tool.businessValue.map((value, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                    <Star className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <span>{value}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Use Cases */}
                          {tool.useCases && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-2">📌 Cas d'usage:</p>
                              <div className="flex flex-wrap gap-2">
                                {tool.useCases.map((useCase, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
                                  >
                                    {useCase}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Licensing */}
                          {tool.licensing && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-2">📋 Disponibilité par plan:</p>
                              <div className="space-y-1">
                                {Object.entries(tool.licensing).map(([plan, status]) => (
                                  <div key={plan} className="flex items-center justify-between text-xs">
                                    <span className="text-gray-600">{plan}</span>
                                    <span className={status.includes('✓') ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                                      {status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Target Audience */}
                          {tool.targetAudience && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-2">👥 Audience cible:</p>
                              <div className="flex flex-wrap gap-2">
                                {tool.targetAudience.map((audience, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md text-xs"
                                  >
                                    {audience}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Competitors */}
                          {tool.competitors && (
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-2">🔄 Concurrents:</p>
                              <p className="text-xs text-gray-600">{tool.competitors.join(', ')}</p>
                            </div>
                          )}

                          {/* Implementation */}
                          {tool.implementation && (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                              <p className="text-xs font-semibold text-orange-800">
                                ⏱️ Délai d'implémentation: {tool.implementation}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => setSelectedTool(tool)}
                        className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        Voir les détails complets
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tool Detail Modal */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedTool.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTool.name}</h2>
                  <p className="text-gray-600">{selectedTool.shortDescription}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Description détaillée</h3>
                <p className="text-gray-700">{selectedTool.detailedDescription}</p>
              </div>

              {selectedTool.features && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Fonctionnalités</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTool.businessValue && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Valeur métier</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTool.businessValue.map((value, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                        <Star className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTool.licensing && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Plans de licence</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {Object.entries(selectedTool.licensing).map(([plan, status]) => (
                      <div key={plan} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                        <span className="text-sm font-medium text-gray-700">{plan}</span>
                        <span className={status.includes('✓') ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
