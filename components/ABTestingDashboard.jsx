"use client";

import React, { useState, useEffect } from 'react';
import {
  FlaskConical, TrendingUp, Users, Target, CheckCircle,
  Clock, BarChart3, RefreshCw, Plus, Eye, Settings,
  Trophy, AlertTriangle, Zap, Brain, Play, Pause, Square
} from 'lucide-react';
import { toast } from "sonner";

const ABTestingDashboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadABTests();
  }, []);

  const loadABTests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ab-testing?action=list');
      const data = await response.json();

      if (data.success) {
        setTests(data.tests || []);
      }
    } catch (error) {
      console.error('Erreur chargement A/B tests:', error);
      toast.error('Erreur lors du chargement des tests');
    } finally {
      setLoading(false);
    }
  };

  const createAutoTest = async (templateId, strategies) => {
    try {
      const response = await fetch('/api/ab-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auto_create',
          templateId,
          strategies
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        await loadABTests();
      } else {
        toast.error(data.error || 'Erreur création A/B tests');
      }
    } catch (error) {
      console.error('Erreur création auto A/B test:', error);
      toast.error('Erreur lors de la création automatique');
    }
  };

  const generateVariations = async (template, strategy, count = 2) => {
    try {
      const response = await fetch('/api/ab-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_variations',
          template,
          strategy,
          count
        })
      });

      const data = await response.json();

      if (data.success) {
        return data.variations;
      }
    } catch (error) {
      console.error('Erreur génération variations:', error);
    }
    return [];
  };

  const viewTestResults = async (testId) => {
    try {
      const response = await fetch(`/api/ab-testing?action=results&testId=${testId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedTest(data.results);
      }
    } catch (error) {
      console.error('Erreur chargement résultats:', error);
      toast.error('Erreur lors du chargement des résultats');
    }
  };

  const endTest = async (testId) => {
    try {
      const response = await fetch('/api/ab-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'end_test',
          testId
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Test terminé avec succès');
        await loadABTests();
        if (data.results) {
          setSelectedTest(data.results);
        }
      }
    } catch (error) {
      console.error('Erreur fin de test:', error);
      toast.error('Erreur lors de la fin du test');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'completed': return 'text-blue-600 bg-blue-50';
      case 'paused': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.95) return 'text-green-600';
    if (confidence >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Chargement des A/B tests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FlaskConical className="w-7 h-7 text-purple-600" />
            <span>A/B Testing Automatisé</span>
          </h1>
          <p className="text-gray-600">Optimisation automatique des templates email</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Test</span>
          </button>
          <button
            onClick={loadABTests}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-orange-500" />
          <span>Actions Rapides</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => createAutoTest('template_1', ['subject_line'])}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <Brain className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <div className="font-medium text-gray-900">Test Sujet Automatique</div>
              <div className="text-sm text-gray-600">Génère et teste 2 variants de sujet</div>
            </div>
          </button>

          <button
            onClick={() => createAutoTest('template_1', ['opening_paragraph'])}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <Target className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <div className="font-medium text-gray-900">Test Ouverture</div>
              <div className="text-sm text-gray-600">Teste différentes approches d'ouverture</div>
            </div>
          </button>

          <button
            onClick={() => createAutoTest('template_1', ['call_to_action'])}
            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <Trophy className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <div className="font-medium text-gray-900">Test Call-to-Action</div>
              <div className="text-sm text-gray-600">Optimise les appels à l'action</div>
            </div>
          </button>
        </div>
      </div>

      {/* Tests List */}
      <div className="bg-white border rounded-xl">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            <span>Tests A/B Actifs</span>
          </h2>
        </div>

        {tests.length === 0 ? (
          <div className="p-8 text-center">
            <FlaskConical className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun test A/B actif</h3>
            <p className="text-gray-600 mb-4">Créez votre premier test automatique pour optimiser vos templates</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Créer un test
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {tests.map((test, index) => (
              <div key={test.id || index} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{test.name || `Test ${index + 1}`}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status || 'active')}`}>
                          {test.status || 'Actif'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Type: {test.testType || 'subject_line'} • Variants: {test.variants?.length || 2}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {test.confidence && (
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getConfidenceColor(test.confidence)}`}>
                          {Math.round(test.confidence * 100)}% confiance
                        </div>
                        {test.winner && (
                          <div className="text-xs text-gray-600">Gagnant: Variant {test.winner.name}</div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => viewTestResults(test.id)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                      title="Voir les résultats"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {test.status === 'active' && (
                      <button
                        onClick={() => endTest(test.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        title="Terminer le test"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Test Stats Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Emails envoyés</div>
                    <div className="font-medium">{test.totalSent || 0}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Taux d'ouverture</div>
                    <div className="font-medium">{test.openRate ? `${test.openRate.toFixed(1)}%` : 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Taux de réponse</div>
                    <div className="font-medium">{test.responseRate ? `${test.responseRate.toFixed(1)}%` : 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Durée</div>
                    <div className="font-medium">
                      {test.startDate ? Math.floor((new Date() - new Date(test.startDate)) / (1000 * 60 * 60 * 24)) : 0} jours
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Results Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Résultats du Test A/B</h2>
                <button
                  onClick={() => setSelectedTest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Winner Announcement */}
              {selectedTest.winner && selectedTest.confidence > 0.95 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">
                        Gagnant Statistiquement Significatif !
                      </h3>
                      <p className="text-green-700">
                        Le variant {selectedTest.winner.name} surperforme avec {selectedTest.confidence * 100}% de confiance
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Variants Performance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Performance des Variants</h3>

                {selectedTest.variants?.map((variant, index) => (
                  <div key={variant.id || index} className={`border rounded-lg p-4 ${
                    variant.id === selectedTest.winner?.id ? 'border-green-300 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">Variant {variant.name}</h4>
                        {variant.isControl && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">Contrôle</span>
                        )}
                        {variant.id === selectedTest.winner?.id && (
                          <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded">Gagnant</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {variant.assignments} assignations
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Taux d'ouverture</div>
                        <div className="font-medium text-lg">
                          {variant.metrics?.open_rate ? `${variant.metrics.open_rate.toFixed(1)}%` : '0%'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Taux de clic</div>
                        <div className="font-medium text-lg">
                          {variant.metrics?.click_rate ? `${variant.metrics.click_rate.toFixed(1)}%` : '0%'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Taux de réponse</div>
                        <div className="font-medium text-lg">
                          {variant.metrics?.response_rate ? `${variant.metrics.response_rate.toFixed(1)}%` : '0%'}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600">Conversion</div>
                        <div className="font-medium text-lg">
                          {variant.metrics?.conversion_rate ? `${variant.metrics.conversion_rate.toFixed(1)}%` : '0%'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {selectedTest.recommendations && selectedTest.recommendations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommandations</h3>
                  <div className="space-y-2">
                    {selectedTest.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <div className="font-medium text-blue-900">{rec.message}</div>
                          <div className="text-sm text-blue-700">Action: {rec.action}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Test Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Créer un Test A/B</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de test
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="subject_line">Ligne de sujet</option>
                    <option value="opening_paragraph">Paragraphe d'ouverture</option>
                    <option value="call_to_action">Call-to-Action</option>
                    <option value="tone">Ton du message</option>
                    <option value="length">Longueur du contenu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template de base
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option value="template_1">Template Azure Migration</option>
                    <option value="template_2">Template M365 Upgrade</option>
                    <option value="template_3">Template Security Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de variants
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="4"
                    defaultValue="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    createAutoTest('template_1', ['subject_line']);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Créer le test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ABTestingDashboard;