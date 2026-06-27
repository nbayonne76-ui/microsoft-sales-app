'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Book, Brain, Shield, Database, Server, LineChart, Cog, Network, Search, Eye, Building2, Cloud } from 'lucide-react';

const azureCategoryConfig = {
  'ai': { name: 'AI & Machine Learning', icon: Brain, color: 'from-purple-500 to-purple-600' },
  'development': { name: 'Development & Low-Code', icon: Cog, color: 'from-violet-500 to-violet-600' },
  'security': { name: 'Security', icon: Shield, color: 'from-red-500 to-red-600' },
  'analytics': { name: 'Analytics & Data', icon: LineChart, color: 'from-blue-500 to-blue-600' },
  'storage': { name: 'Storage', icon: Database, color: 'from-green-500 to-green-600' },
  'compute': { name: 'Compute', icon: Server, color: 'from-orange-500 to-orange-600' },
  'networking': { name: 'Networking', icon: Network, color: 'from-cyan-500 to-cyan-600' },
  'integration': { name: 'Integration', icon: Cog, color: 'from-yellow-500 to-yellow-600' },
  'management': { name: 'Management & Governance', icon: Cog, color: 'from-indigo-500 to-indigo-600' },
  'iot': { name: 'IoT', icon: Network, color: 'from-teal-500 to-teal-600' }
};

export default function KnowledgeBasePage() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [topView, setTopView] = useState('solutions'); // 'solutions' or 'documents'
  const [mainView, setMainView] = useState('azure'); // 'azure' or 'dynamics'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSolution, setSelectedSolution] = useState(null);

  useEffect(() => {
    async function fetchSolutions() {
      try {
        const response = await fetch('/api/azure-solutions');
        const data = await response.json();
        setSolutions(data.solutions || []);
      } catch (error) {
        console.error('Error fetching solutions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSolutions();
  }, []);

  // Séparer Azure et Dynamics 365 (+ Power Platform)
  const azureSolutions = solutions.filter(s => s.category !== 'business' && s.category !== 'development');
  const dynamicsSolutions = solutions.filter(s => s.category === 'business' || s.category === 'development');

  // Filtrage
  const currentSolutions = mainView === 'azure' ? azureSolutions : dynamicsSolutions;

  const filtered = currentSolutions.filter(sol => {
    const matchCat = selectedCategory === 'all' || sol.category === selectedCategory;
    const matchSearch = !searchTerm ||
      sol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sol.officialName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sol.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const categoryGroups = filtered.reduce((acc, sol) => {
    const cat = sol.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sol);
    return acc;
  }, {});

  const stats = {
    azure: azureSolutions.length,
    dynamics: dynamicsSolutions.length,
    total: solutions.length,
    ai: solutions.filter(s => s.category === 'ai').length,
    security: solutions.filter(s => s.category === 'security').length,
    development: solutions.filter(s => s.category === 'development').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Knowledge Base...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Book className="w-10 h-10 text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Knowledge Base
              </h1>
              <p className="text-gray-600">Solutions, Sales Library, Templates & Documentation</p>
            </div>
          </div>
        </div>

        {/* Top Level Tabs */}
        <div className="flex gap-3 mb-8 bg-white p-2 rounded-xl shadow-md">
          <button
            onClick={() => setTopView('solutions')}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              topView === 'solutions'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Cloud className="w-5 h-5" />
            Solutions Catalog
            <span className={`text-sm ${topView === 'solutions' ? 'text-white/80' : 'text-gray-500'}`}>
              (62 solutions)
            </span>
          </button>
          <button
            onClick={() => setTopView('documents')}
            className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              topView === 'documents'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Book className="w-5 h-5" />
            Documents & Guides
            <span className={`text-sm ${topView === 'documents' ? 'text-white/80' : 'text-gray-500'}`}>
              (Pricing, Templates, Docs)
            </span>
          </button>
        </div>

        {topView === 'solutions' ? (
          /* Solutions View */
          <>
        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-sm opacity-90">Total Solutions</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
            <div className="text-sm opacity-90">Azure</div>
            <div className="text-3xl font-bold">{stats.azure}</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <div className="text-sm opacity-90">Dynamics & Power</div>
            <div className="text-3xl font-bold">{stats.dynamics}</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-sm opacity-90">AI & ML</div>
            <div className="text-3xl font-bold">{stats.ai}</div>
          </Card>
          <Card className="p-6 bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="text-sm opacity-90">Security</div>
            <div className="text-3xl font-bold">{stats.security}</div>
          </Card>
        </div>

        {/* Main View Tabs - AZURE vs DYNAMICS 365 */}
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => {
              setMainView('azure');
              setSelectedCategory('all');
            }}
            variant={mainView === 'azure' ? 'default' : 'outline'}
            className={`flex-1 py-6 text-lg ${mainView === 'azure' ? 'bg-cyan-600 hover:bg-cyan-700' : ''}`}
          >
            <Cloud className="w-5 h-5 mr-2" />
            Azure Solutions ({stats.azure})
          </Button>
          <Button
            onClick={() => {
              setMainView('dynamics');
              setSelectedCategory('all');
            }}
            variant={mainView === 'dynamics' ? 'default' : 'outline'}
            className={`flex-1 py-6 text-lg ${mainView === 'dynamics' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
          >
            <Building2 className="w-5 h-5 mr-2" />
            Dynamics 365 & Power Platform ({stats.dynamics})
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder={`Search ${mainView === 'azure' ? 'Azure' : 'Dynamics 365'} solutions...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6"
            />
          </div>
        </div>

        {/* Category Filters - Only for Azure */}
        {mainView === 'azure' && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              onClick={() => setSelectedCategory('all')}
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              className={selectedCategory === 'all' ? 'bg-cyan-600' : ''}
            >
              All Azure Solutions
            </Button>
            {Object.entries(azureCategoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              const count = azureSolutions.filter(s => s.category === key).length;
              if (count === 0) return null;
              return (
                <Button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  variant={selectedCategory === key ? 'default' : 'outline'}
                  size="sm"
                  className={selectedCategory === key ? 'bg-cyan-600' : ''}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {config.name} ({count})
                </Button>
              );
            })}
          </div>
        )}

        {/* Dynamics 365 & Power Platform Section */}
        {mainView === 'dynamics' && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-8 h-8 text-pink-600" />
              <div>
                <h2 className="text-3xl font-bold">Dynamics 365 & Power Platform</h2>
                <p className="text-sm text-gray-600">Business Applications + Low-Code Tools</p>
              </div>
              <span className="text-gray-500 text-lg">({dynamicsSolutions.length})</span>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {filtered.map(solution => {
                const isPowerPlatform = solution.category === 'development';
                return (
                  <Card
                    key={solution.id}
                    className={`p-6 hover:shadow-xl transition-all cursor-pointer border-2 ${isPowerPlatform ? 'hover:border-violet-500' : 'hover:border-pink-500'}`}
                    onClick={() => setSelectedSolution(solution)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      {isPowerPlatform ? (
                        <Cog className="w-8 h-8 text-violet-600" />
                      ) : (
                        <Building2 className="w-8 h-8 text-pink-600" />
                      )}
                      <span className={`text-xs px-2 py-1 rounded font-medium ${isPowerPlatform ? 'bg-violet-100 text-violet-700' : 'bg-pink-100 text-pink-700'}`}>
                        {isPowerPlatform ? 'Power Platform' : 'Dynamics 365'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{solution.officialName || solution.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{solution.shortDescription}</p>
                    <Button size="sm" variant="outline" className={`w-full ${isPowerPlatform ? 'hover:bg-violet-50' : 'hover:bg-pink-50'}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Azure Solutions Section */}
        {mainView === 'azure' && selectedCategory === 'all' ? (
          Object.entries(categoryGroups).map(([category, sols]) => {
            const config = azureCategoryConfig[category];
            if (!config) return null;
            const Icon = config.icon;

            return (
              <div key={category} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-6 h-6 text-cyan-600" />
                  <h2 className="text-2xl font-bold">{config.name}</h2>
                  <span className="text-gray-500">({sols.length})</span>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {sols.map(solution => (
                    <Card
                      key={solution.id}
                      className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-500"
                      onClick={() => setSelectedSolution(solution)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Icon className="w-8 h-8 text-cyan-600" />
                        <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded">{category}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{solution.officialName || solution.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{solution.shortDescription}</p>
                      <Button size="sm" variant="outline" className="w-full hover:bg-cyan-50">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        ) : mainView === 'azure' ? (
          <div className="grid grid-cols-3 gap-6">
            {filtered.map(solution => {
              const config = azureCategoryConfig[solution.category];
              const Icon = config?.icon || Server;
              return (
                <Card
                  key={solution.id}
                  className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-500"
                  onClick={() => setSelectedSolution(solution)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{solution.officialName || solution.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{solution.shortDescription}</p>
                </Card>
              );
            })}
          </div>
        ) : null}

        {/* Solution Detail Modal */}
        {selectedSolution && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSolution(null)}
          >
            <Card
              className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedSolution.category === 'business' ? (
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">Dynamics 365</span>
                    ) : selectedSolution.category === 'development' ? (
                      <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">Power Platform</span>
                    ) : (
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">Azure</span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{selectedSolution.officialName || selectedSolution.name}</h2>
                  <p className="text-gray-600">{selectedSolution.shortDescription}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedSolution(null)}>Close</Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Description</h3>
                  <p className="text-gray-700">{selectedSolution.fullDescription}</p>
                </div>

                {selectedSolution.keyFeatures && selectedSolution.keyFeatures.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">Key Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedSolution.keyFeatures.slice(0, 8).map((feature, idx) => (
                        <div key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-blue-500 mt-1">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSolution.benefits && selectedSolution.benefits.length > 0 && (
                  <div>
                    <h3 className="font-bold text-lg mb-2">Benefits</h3>
                    <div className="space-y-2">
                      {selectedSolution.benefits.slice(0, 5).map((benefit, idx) => (
                        <div key={idx} className="text-sm flex items-start gap-2 bg-green-50 p-3 rounded">
                          <span className="text-green-600 font-bold">→</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
          </>
        ) : (
          /* Documents View */
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Book className="w-16 h-16 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Documents & Guides</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Accédez à nos guides de pricing, templates d'emails, documentation technique et plus encore
              </p>
              <Button
                size="lg"
                onClick={() => window.location.href = '/knowledge-base'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Book className="w-5 h-5 mr-2" />
                Voir tous les documents
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">💼</div>
                <h3 className="font-bold mb-2">Sales Library</h3>
                <p className="text-sm text-gray-600">M365, Azure, Dynamics 365</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="font-bold mb-2">Email Templates</h3>
                <p className="text-sm text-gray-600">Prêts à l'emploi</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="font-bold mb-2">Licensing Guides</h3>
                <p className="text-sm text-gray-600">CSP, MCA, EA, NCE</p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
