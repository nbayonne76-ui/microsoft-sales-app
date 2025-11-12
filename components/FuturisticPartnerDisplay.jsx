"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  Shield, 
  Cloud, 
  Smartphone, 
  Monitor, 
  MessageSquare,
  Star,
  Zap,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
  Filter
} from 'lucide-react';

const FuturisticPartnerDisplay = ({ partnersData }) => {
  const [expandedPartner, setExpandedPartner] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Définition des spécialisations avec icônes et couleurs
  const specializations = {
    'Security': {
      icon: Shield,
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800'
    },
    'Cloud Endpoints': {
      icon: Cloud,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800'
    },
    'Modernize with Surface': {
      icon: Monitor,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800'
    },
    'Secure Productivity': {
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800'
    },
    'Converged Communications': {
      icon: MessageSquare,
      color: 'from-orange-500 to-yellow-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800'
    }
  };

  // Données exemple (à remplacer par les vraies données)
  const mockPartnersData = {
    category: 'MODERNWORK',
    totalCount: 20,
    partners: [
      {
        name: 'Adista',
        id: '1019430',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity'],
        score: 4,
        maxScore: 5,
        tier: 'Premium'
      },
      {
        name: 'Be Cloud',
        id: '3519836',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity', 'Converged Communications'],
        score: 5,
        maxScore: 5,
        tier: 'Elite'
      },
      {
        name: 'EFISENS',
        id: '1977957',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity', 'Converged Communications'],
        score: 5,
        maxScore: 5,
        tier: 'Elite'
      },
      {
        name: 'Exakis Nelite',
        id: '1162046',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity'],
        score: 4,
        maxScore: 5,
        tier: 'Premium'
      },
      {
        name: 'Projetlys',
        id: '1507756',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity'],
        score: 4,
        maxScore: 5,
        tier: 'Premium'
      },
      {
        name: 'SCRIBA',
        id: '1105053',
        specializations: ['Security', 'Cloud Endpoints', 'Modernize with Surface', 'Secure Productivity'],
        score: 4,
        maxScore: 5,
        tier: 'Premium'
      }
    ]
  };

  const data = partnersData || mockPartnersData;

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Elite':
        return 'from-yellow-400 to-yellow-600 text-yellow-900';
      case 'Premium':
        return 'from-blue-400 to-blue-600 text-blue-900';
      case 'Standard':
        return 'from-gray-400 to-gray-600 text-gray-900';
      default:
        return 'from-gray-400 to-gray-600 text-gray-900';
    }
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage === 100) return 'from-green-400 to-green-600';
    if (percentage >= 80) return 'from-blue-400 to-blue-600';
    if (percentage >= 60) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const filteredPartners = data.partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.id.includes(searchTerm);
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'elite' && partner.tier === 'Elite') ||
                         (filterBy === 'premium' && partner.tier === 'Premium');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 rounded-2xl shadow-2xl border border-cyan-500/30">
      {/* Header futuriste */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-xl"></div>
        <div className="relative bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {data.category}
                </h1>
                <p className="text-cyan-300 text-lg">
                  {data.totalCount} partenaires actifs
                </p>
              </div>
            </div>
            
            {/* Statistiques rapides */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-400/30">
                <div className="text-green-400 text-sm">Elite</div>
                <div className="text-white text-xl font-bold">
                  {data.partners.filter(p => p.tier === 'Elite').length}
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg p-3 border border-blue-400/30">
                <div className="text-blue-400 text-sm">Premium</div>
                <div className="text-white text-xl font-bold">
                  {data.partners.filter(p => p.tier === 'Premium').length}
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg p-3 border border-purple-400/30">
                <div className="text-purple-400 text-sm">Moyenne</div>
                <div className="text-white text-xl font-bold">
                  {(data.partners.reduce((acc, p) => acc + p.score, 0) / data.partners.length).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contrôles de filtrage */}
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un partenaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/30 border border-cyan-500/30 rounded-xl text-white placeholder-cyan-400/60 focus:outline-none focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/30"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-4 h-4" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="pl-10 pr-8 py-3 bg-black/30 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400/80 appearance-none"
          >
            <option value="all">Tous</option>
            <option value="elite">Elite</option>
            <option value="premium">Premium</option>
          </select>
        </div>
      </div>

      {/* Grille des partenaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPartners.map((partner, index) => (
          <div
            key={partner.id}
            className={`group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] ${
              expandedPartner === partner.id ? 'lg:col-span-2' : ''
            }`}
          >
            {/* Effet de glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            
            <div className="relative bg-black/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/60 transition-all duration-300">
              {/* Header du partenaire */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTierColor(partner.tier)}`}>
                      {partner.tier}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-300/80">
                    <code className="bg-black/30 px-2 py-1 rounded text-xs">ID: {partner.id}</code>
                  </div>
                </div>
                
                {/* Score visuel */}
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getScoreColor(partner.score, partner.maxScore)} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">{partner.score}/{partner.maxScore}</span>
                  </div>
                  <div className="text-xs text-cyan-400 mt-1">Score</div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-cyan-300 mb-2">
                  <span>Spécialisations</span>
                  <span>{partner.score}/{partner.maxScore}</span>
                </div>
                <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getScoreColor(partner.score, partner.maxScore)} transition-all duration-1000 relative overflow-hidden`}
                    style={{ width: `${(partner.score / partner.maxScore) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Spécialisations */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {partner.specializations.slice(0, expandedPartner === partner.id ? undefined : 3).map((spec, idx) => {
                    const SpecIcon = specializations[spec]?.icon || Award;
                    const specInfo = specializations[spec] || {};
                    
                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${specInfo.bgColor || 'bg-gray-50'} ${specInfo.borderColor || 'border-gray-200'}`}
                      >
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${specInfo.color || 'from-gray-400 to-gray-600'} flex items-center justify-center`}>
                          <SpecIcon className="w-3 h-3 text-white" />
                        </div>
                        <span className={`text-xs font-medium ${specInfo.textColor || 'text-gray-800'}`}>
                          {spec}
                        </span>
                      </div>
                    );
                  })}
                  
                  {partner.specializations.length > 3 && expandedPartner !== partner.id && (
                    <div className="flex items-center px-3 py-2 text-cyan-400 text-xs">
                      +{partner.specializations.length - 3} autres
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton d'expansion */}
              <button
                onClick={() => setExpandedPartner(expandedPartner === partner.id ? null : partner.id)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 rounded-lg border border-cyan-500/30 text-cyan-300 transition-all duration-300"
              >
                {expandedPartner === partner.id ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    <span>Réduire</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    <span>Détails</span>
                  </>
                )}
              </button>

              {/* Contenu étendu */}
              {expandedPartner === partner.id && (
                <div className="mt-4 pt-4 border-t border-cyan-500/30">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-cyan-400 font-semibold mb-2">Informations détaillées</h4>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div>• Tier: <span className="text-white">{partner.tier}</span></div>
                        <div>• Score: <span className="text-white">{partner.score}/{partner.maxScore}</span></div>
                        <div>• Spécialisations: <span className="text-white">{partner.specializations.length}</span></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-cyan-400 font-semibold mb-2">Actions rapides</h4>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 px-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-400 text-xs transition-colors">
                          Contacter
                        </button>
                        <button className="flex-1 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 text-xs transition-colors">
                          Profil
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer avec légende */}
      <div className="mt-8 bg-black/30 rounded-xl p-4 border border-cyan-500/20">
        <h4 className="text-cyan-400 font-semibold mb-3">Légende des spécialisations</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(specializations).map(([name, info]) => {
            const IconComponent = info.icon;
            return (
              <div key={name} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${info.color} flex items-center justify-center`}>
                  <IconComponent className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs text-gray-300">{name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FuturisticPartnerDisplay;