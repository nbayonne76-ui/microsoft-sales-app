"use client";

import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Mail, Building, Users, Sparkles, Target, Trophy } from 'lucide-react';
import { toast } from "sonner";

/**
 * Générateur d'emails connecté à Prisma Studio
 * Utilise les templates réels de la base de données
 */

const PrismaEmailGenerator = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    segment: '',
    tone: ''
  });
  const [clientProfile, setClientProfile] = useState({
    company: '',
    segment: 'sme',
    industry: '',
    currentChallenges: ''
  });

  // Charger les templates depuis Prisma
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.segment) params.append('segment', filters.segment);
      if (filters.tone) params.append('tone', filters.tone);

      const response = await fetch(`/api/templates?${params}`);
      const data = await response.json();
      
      setTemplates(data.templates || []);
      console.log('✅ Templates chargés:', data.count);
      
    } catch (error) {
      console.error('❌ Erreur chargement templates:', error);
      toast.error('Erreur lors du chargement des templates');
    } finally {
      setLoading(false);
    }
  };

  // Générer email à partir du template sélectionné
  const generateFromTemplate = async () => {
    if (!selectedTemplate) {
      toast.error('Veuillez sélectionner un template');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          clientProfile,
          context: clientProfile.currentChallenges
        })
      });

      const data = await response.json();
      
      if (data.template) {
        setGeneratedContent(`Objet: ${data.template.subject}

${data.template.content}

---
📊 Taux de succès: ${Math.round(data.template.successRate * 100)}%
🎯 Segment: ${data.template.segment.toUpperCase()}
💡 Raisonnement: ${data.reasoning}`);
        toast.success('Email généré depuis Prisma Studio !');
      }
      
    } catch (error) {
      console.error('❌ Erreur génération:', error);
      toast.error('Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  // Copier dans le presse-papier
  const copyToClipboard = async () => {
    if (!generatedContent) return;
    
    try {
      await navigator.clipboard.writeText(generatedContent);
      toast.success('Email copié dans le presse-papier !');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-3">
          <Mail className="w-8 h-8" />
          Générateur Email Prisma Studio
        </h1>
        <p className="mt-2 opacity-90">Templates réels stockés en base de données</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Section Configuration */}
        <div className="space-y-6">
          {/* Profil Client */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Profil Client
            </h2>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom de l'entreprise"
                value={clientProfile.company}
                onChange={(e) => setClientProfile(prev => ({ ...prev, company: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <select
                value={clientProfile.segment}
                onChange={(e) => setClientProfile(prev => ({ ...prev, segment: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="enterprise">Enterprise (1000+ employés)</option>
                <option value="sme">PME (50-1000 employés)</option>
                <option value="startup">Startup (moins de 50 employés)</option>
              </select>
              
              <input
                type="text"
                placeholder="Secteur d'activité"
                value={clientProfile.industry}
                onChange={(e) => setClientProfile(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <textarea
                placeholder="Défis actuels du client"
                value={clientProfile.currentChallenges}
                onChange={(e) => setClientProfile(prev => ({ ...prev, currentChallenges: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
              />
            </div>
          </div>

          {/* Filtres Templates */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Filtres Templates
            </h2>
            
            <div className="grid grid-cols-3 gap-3">
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="p-2 border rounded-lg text-sm"
              >
                <option value="">Toutes catégories</option>
                <option value="migration">Migration</option>
                <option value="budget">Budget</option>
                <option value="change_management">Change Management</option>
                <option value="follow_up">Suivi</option>
              </select>
              
              <select
                value={filters.segment}
                onChange={(e) => setFilters(prev => ({ ...prev, segment: e.target.value }))}
                className="p-2 border rounded-lg text-sm"
              >
                <option value="">Tous segments</option>
                <option value="enterprise">Enterprise</option>
                <option value="sme">PME</option>
                <option value="startup">Startup</option>
              </select>
              
              <select
                value={filters.tone}
                onChange={(e) => setFilters(prev => ({ ...prev, tone: e.target.value }))}
                className="p-2 border rounded-lg text-sm"
              >
                <option value="">Tous tons</option>
                <option value="formal">Formel</option>
                <option value="professional_friendly">Professionnel</option>
                <option value="casual_expert">Décontracté</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section Templates */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Templates Disponibles ({templates.length})
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="ml-2">Chargement...</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedTemplate?.id === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {template.category} • {template.segment} • {template.tone}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-1 text-green-600">
                          <Trophy className="w-3 h-3" />
                          {Math.round(template.successRate * 100)}%
                        </div>
                        <div className="text-gray-500">{template.useCount} utilisations</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={generateFromTemplate}
          disabled={loading || !selectedTemplate}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          Générer Email
        </button>
        
        <button
          onClick={copyToClipboard}
          disabled={!generatedContent}
          className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Copy className="w-5 h-5" />
          Copier
        </button>
      </div>

      {/* Email Généré */}
      {generatedContent && (
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Généré
          </h2>
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm font-mono border">
            {generatedContent}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PrismaEmailGenerator;