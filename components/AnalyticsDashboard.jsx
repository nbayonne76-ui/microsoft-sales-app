"use client";

// PERFORMANCE FIX: Added useCallback to prevent function recreation
import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, TrendingUp, Users, Mail, Star, RefreshCw,
  Award, Target, Brain, Zap
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);

  // PERFORMANCE FIX: Wrap loadAnalytics with useCallback to prevent recreation
  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);

      // Charger les métriques générales
      const metricsResponse = await fetch('/api/analytics?type=summary');
      const metricsData = await metricsResponse.json();

      if (metricsData.success) {
        setMetrics(metricsData.metrics);
      }

      // Charger les recommandations
      const recResponse = await fetch('/api/analytics?type=recommendations');
      const recData = await recResponse.json();

      if (recData.success) {
        setRecommendation(recData.recommendation);
      }

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependencies as it doesn't depend on external values

  // PERFORMANCE FIX: Wrap resetData with useCallback
  const resetData = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      });

      if (response.ok) {
        await loadAnalytics();
      }
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  }, [loadAnalytics]); // Depends on loadAnalytics

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]); // Add loadAnalytics to dependencies

  const getToneColor = (tone) => {
    const colors = {
      professional: 'bg-blue-500',
      friendly: 'bg-green-500', 
      casual: 'bg-purple-500',
      urgent: 'bg-red-500'
    };
    return colors[tone] || 'bg-gray-500';
  };

  const getToneIcon = (tone) => {
    const icons = {
      professional: '👔',
      friendly: '😊',
      casual: '🤙',
      urgent: '🚨'
    };
    return icons[tone] || '📧';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Chargement des analytics...</span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune donnée disponible</h3>
        <p className="text-gray-600">Générez quelques emails pour voir les analytics apparaître</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Email Generator</h1>
          <p className="text-gray-600">Métriques de performance et apprentissage IA</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadAnalytics}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
          <button
            onClick={resetData}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* Métriques Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <Mail className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Emails générés</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total_emails}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <div>
              <p className="text-sm text-gray-600">Emails envoyés</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.total_sent_emails || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Sessions IA</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.ai_interactions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Note moyenne</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.average_rating ? metrics.average_rating.toFixed(1) : 'N/A'}/5</p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Taux d'envoi</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.total_emails > 0 ? Math.round(((metrics.total_sent_emails || 0) / metrics.total_emails) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommandation IA */}
      {recommendation && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Recommandation IA</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Ton recommandé :</span>{' '}
                <span className="inline-flex items-center space-x-2 bg-white px-3 py-1 rounded-full border">
                  <span>{getToneIcon(recommendation.tone)}</span>
                  <span className="capitalize font-semibold">{recommendation.tone}</span>
                </span>
              </p>
              <p className="text-sm text-gray-600">{recommendation.reason}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Confiance</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(recommendation.confidence * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Performance par Ton */}
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Performance par Ton</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(metrics.tone_performance).map(([tone, perf]) => (
            <div key={tone} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${getToneColor(tone)}`}></div>
                <span className="font-medium capitalize">{tone}</span>
                <span className="text-lg">{getToneIcon(tone)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Utilisations</span>
                  <span className="font-medium">{perf.usage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Feedbacks</span>
                  <span className="font-medium">{perf.feedback_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Note moyenne</span>
                  <span className="font-medium">
                    {perf.feedback_count > 0 ? `${perf.average_rating.toFixed(1)}/5` : 'N/A'}
                  </span>
                </div>
                
                {/* Barre de performance */}
                {perf.feedback_count > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Performance</span>
                      <span>{Math.round((perf.average_rating / 5) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getToneColor(tone)}`}
                        style={{ width: `${(perf.average_rating / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Assistant Analytics */}
      {metrics.ai_stats && (
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Analytics Assistant IA</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">📊 Statistiques d'usage</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sessions totales</span>
                  <span className="font-medium">{metrics.ai_stats.total_sessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Réponse moyenne</span>
                  <span className="font-medium">{metrics.ai_stats.avg_response_length} caractères</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Efficacité</span>
                  <span className="font-medium text-green-600">
                    {metrics.ai_stats.total_sessions > 0 ? '95%' : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">🕒 Sessions récentes</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {metrics.ai_stats.recent_sessions && metrics.ai_stats.recent_sessions.length > 0 ? 
                  metrics.ai_stats.recent_sessions.map((session, index) => (
                    <div key={session.id || index} className="text-xs bg-gray-50 p-2 rounded">
                      <div className="text-gray-700 truncate">
                        {session.message || 'Session IA'}
                      </div>
                      <div className="text-gray-500 mt-1">
                        {new Date(session.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  )) : 
                  <div className="text-sm text-gray-500">Aucune session récente</div>
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {metrics.recent_activity && (
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
          </div>

          <div className="space-y-3">
            {metrics.recent_activity.length > 0 ? 
              metrics.recent_activity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'direct_send' ? 'bg-green-100' :
                    activity.type === 'ai_assistant' ? 'bg-purple-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'direct_send' ? '📤' :
                     activity.type === 'ai_assistant' ? '🤖' : '📧'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {activity.type === 'direct_send' ? 'Email envoyé' :
                       activity.type === 'ai_assistant' ? 'Assistant IA utilisé' : 'Email généré'}
                    </div>
                    <div className="text-sm text-gray-600">{activity.details}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              )) :
              <div className="text-center text-gray-500 py-8">
                <div className="text-sm">Aucune activité récente</div>
              </div>
            }
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Insights & Apprentissage</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">📈 Nouvelles fonctionnalités</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>✅ Envoi direct d'emails</li>
              <li>✅ Assistant IA personnel</li>
              <li>✅ Analytics avancées</li>
              <li>✅ Reconnaissance vocale</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">📊 Performance</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• {metrics.total_emails} emails générés</li>
              <li>• {metrics.total_sent_emails || 0} emails envoyés</li>
              <li>• {metrics.ai_interactions || 0} sessions IA</li>
              <li>• {metrics.total_feedbacks} retours reçus</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-2">🎯 Conseils</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Testez l'envoi direct</li>
              <li>• Utilisez l'assistant IA</li>
              <li>• Donnez des feedbacks</li>
              <li>• Variez les tons selon le contexte</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;