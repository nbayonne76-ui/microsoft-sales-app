'use client';

import { useState } from 'react';
import Link from 'next/link';
import { licensingPlans } from '../lib/m365-collaboration-tools';
import { Check, X, Info, ChevronDown, ChevronUp, Search, Filter, LayoutGrid, ArrowRight } from 'lucide-react';

export default function M365PlansComparison() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedPlans, setExpandedPlans] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const allPlans = [];

  // Collect all plans from all categories
  Object.entries(licensingPlans).forEach(([categoryKey, plans]) => {
    Object.entries(plans).forEach(([planName, planDetails]) => {
      allPlans.push({
        name: planName,
        category: categoryKey,
        ...planDetails
      });
    });
  });

  // Filter plans
  const filteredPlans = allPlans.filter(plan => {
    if (selectedCategory !== 'all' && plan.category !== selectedCategory) {
      return false;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return plan.name.toLowerCase().includes(query) ||
             plan.target.toLowerCase().includes(query) ||
             plan.price.toLowerCase().includes(query);
    }

    return true;
  });

  const togglePlanExpansion = (planId) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
    } else {
      newExpanded.add(planId);
    }
    setExpandedPlans(newExpanded);
  };

  const categories = [
    { id: 'all', name: 'Tous les plans', icon: '📦', color: 'gray' },
    { id: 'business', name: 'Business (PME)', icon: '🏢', color: 'blue' },
    { id: 'enterprise', name: 'Enterprise', icon: '🏗️', color: 'indigo' },
    { id: 'frontline', name: 'Frontline Workers', icon: '👷', color: 'emerald' },
    { id: 'education', name: 'Éducation', icon: '🎓', color: 'violet' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 border-blue-300',
      green: 'from-green-500 to-green-600 border-green-300',
      purple: 'from-purple-500 to-purple-600 border-purple-300',
      indigo: 'from-indigo-500 to-indigo-600 border-indigo-300',
      red: 'from-red-500 to-red-600 border-red-300',
      cyan: 'from-cyan-500 to-cyan-600 border-cyan-300',
      emerald: 'from-emerald-500 to-emerald-600 border-emerald-300',
      teal: 'from-teal-500 to-teal-600 border-teal-300',
      sky: 'from-sky-500 to-sky-600 border-sky-300',
      violet: 'from-violet-500 to-violet-600 border-violet-300',
      fuchsia: 'from-fuchsia-500 to-fuchsia-600 border-fuchsia-300',
      rose: 'from-rose-500 to-rose-600 border-rose-300'
    };

    return colors[color] || 'from-gray-500 to-gray-600 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📊 Comparaison Plans Microsoft 365
            </h1>
            <p className="text-gray-600">
              Tous les plans de licence Microsoft 365 détaillés - {filteredPlans.length} plans disponibles
            </p>
          </div>

          {/* Feature Availability CTA */}
          <Link href="/feature-availability" className="flex items-center justify-between gap-3 px-4 py-3 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:border-blue-400 transition-colors group">
            <div className="flex items-center gap-2 text-sm">
              <LayoutGrid className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold text-blue-800">Feature Availability officielle</span>
              <span className="text-blue-600">: Voir la disponibilité par plan pour Teams, Exchange, SharePoint, Copilot, Entra et 8 autres services</span>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un plan (Business, E3, F3, A5...)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  selectedCategory === cat.id
                    ? `bg-${cat.color}-100 text-${cat.color}-700 ring-2 ring-${cat.color}-500`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all"
              style={{ borderColor: `var(--tw-${plan.color}-300, #cbd5e1)` }}
            >
              {/* Plan Header */}
              <div className={`bg-gradient-to-r ${getColorClasses(plan.color)} text-white p-6`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-2xl font-bold flex-1">{plan.name}</h3>
                  {plan.type && (
                    <span className="bg-white bg-opacity-30 px-2 py-1 rounded text-xs font-bold ml-2">
                      {plan.type}
                    </span>
                  )}
                </div>
                {plan.deprecated && (
                  <div className="bg-yellow-500 bg-opacity-90 text-yellow-900 px-3 py-1 rounded-lg text-xs font-bold mb-2">
                    {plan.deprecated}
                  </div>
                )}
                <p className="text-sm opacity-90 mb-4">{plan.target}</p>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <div className="text-3xl font-black">{plan.price}</div>
                  {plan.priceAnnual && (
                    <div className="text-sm opacity-90 mt-1">{plan.priceAnnual} annuel</div>
                  )}
                </div>
                {plan.maxUsers && (
                  <div className="mt-3 text-sm">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      👥 Max: {plan.maxUsers} utilisateurs
                    </span>
                  </div>
                )}
                {plan.prerequisite && (
                  <div className="mt-3 text-xs bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                    ℹ️ {plan.prerequisite}
                  </div>
                )}
                {plan.savings && (
                  <div className="mt-3 text-sm bg-green-400 bg-opacity-30 px-3 py-2 rounded-lg font-bold">
                    💰 {plan.savings}
                  </div>
                )}
                {plan.officialUrl && (
                  <div className="mt-4">
                    <a
                      href={plan.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                    >
                      <span>🔗</span> Page officielle Microsoft
                    </a>
                  </div>
                )}
              </div>

              {/* Plan Content */}
              <div className="p-6">
                {/* Office Apps */}
                {plan.officeApps && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>📝</span> Applications Office
                    </h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(plan.officeApps).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          {value.includes('✅') ? (
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-gray-700">{value.replace(/✅|❌/, '').trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Services Preview */}
                {plan.services && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>☁️</span> Services Cloud (aperçu)
                    </h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(plan.services).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          {value.includes('✅') ? (
                            <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          )}
                          <span className="text-gray-700">{value.replace(/✅|❌/, '').trim()}</span>
                        </div>
                      ))}
                      {Object.keys(plan.services).length > 3 && (
                        <div className="text-blue-600 text-xs font-semibold">
                          +{Object.keys(plan.services).length - 3} autres services
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Features (for add-ons) */}
                {plan.features && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>⭐</span> Fonctionnalités clés
                    </h4>
                    <div className="space-y-1 text-sm">
                      {plan.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      {plan.features.length > 3 && (
                        <div className="text-blue-600 text-xs font-semibold">
                          +{plan.features.length - 3} autres fonctionnalités
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Best For */}
                {plan.bestFor && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>🎯</span> Idéal pour
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.bestFor.slice(0, 2).map((use, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
                        >
                          {use}
                        </span>
                      ))}
                      {plan.bestFor.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                          +{plan.bestFor.length - 2} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Expand Button */}
                <button
                  onClick={() => togglePlanExpansion(plan.id)}
                  className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {expandedPlans.has(plan.id) ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Masquer les détails
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Voir tous les détails
                    </>
                  )}
                </button>

                {/* Expanded Content */}
                {expandedPlans.has(plan.id) && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                    {/* All Services */}
                    {plan.services && Object.keys(plan.services).length > 3 && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Tous les services</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(plan.services).slice(3).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-2">
                              {value.includes('✅') ? (
                                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              )}
                              <span className="text-gray-700">{value.replace(/✅|❌/, '').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Windows */}
                    {plan.windows && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">🪟 Windows</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(plan.windows).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-2">
                              {value.includes('✅') ? (
                                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              )}
                              <span className="text-gray-700">{value.replace(/✅|❌/, '').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Security */}
                    {plan.security && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">🛡️ Sécurité</h4>
                        <div className="grid grid-cols-1 gap-1 text-sm">
                          {Object.entries(plan.security).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-2">
                              {value.includes('✅') ? (
                                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              )}
                              <span className="text-gray-700">{value.replace(/✅|❌/, '').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Compliance */}
                    {plan.compliance && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">📋 Conformité</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(plan.compliance).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-2">
                              {value.includes('✅') ? (
                                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              ) : (
                                <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                              )}
                              <span className="text-gray-700">{value.replace(/✅|❌/, '').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Analytics */}
                    {plan.analytics && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">📊 Analytics</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(plan.analytics).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{value.replace(/✅/, '').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Voice */}
                    {plan.voice && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">📞 Téléphonie</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(plan.voice).map(([key, value]) => (
                            <div key={key} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{value.replace(/✅/, '').trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Limits */}
                    {plan.limits && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">⚙️ Limites</h4>
                        <div className="space-y-1 text-sm">
                          {Object.entries(plan.limits).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600">{key}:</span>
                              <span className="font-medium text-gray-900">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Best For */}
                    {plan.bestFor && plan.bestFor.length > 2 && (
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">🎯 Tous les cas d'usage</h4>
                        <div className="flex flex-wrap gap-2">
                          {plan.bestFor.map((use, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs"
                            >
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Deprecated Warning */}
                    {plan.deprecated && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-sm text-orange-800 font-semibold">{plan.deprecated}</p>
                      </div>
                    )}

                    {/* Eligibility */}
                    {plan.eligibility && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-sm text-purple-800 font-semibold">
                          <Info className="w-4 h-4 inline mr-1" />
                          {plan.eligibility}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
