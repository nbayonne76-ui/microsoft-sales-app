"use client";

import React, { useState, useEffect } from 'react';
import {
  Settings, TrendingUp, Target, Gauge, RefreshCw, CheckCircle,
  AlertTriangle, BarChart3, Brain, Zap, Clock, Play, Sliders,
  ChevronUp, ChevronDown, Activity, Award
} from 'lucide-react';
import { toast } from "sonner";

const ThresholdTuningDashboard = () => {
  const [thresholds, setThresholds] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tuning, setTuning] = useState(false);
  const [showManualEdit, setShowManualEdit] = useState(false);

  useEffect(() => {
    loadThresholdData();
  }, []);

  const loadThresholdData = async () => {
    try {
      setLoading(true);

      // Load current thresholds
      const thresholdsResponse = await fetch('/api/threshold-tuning?action=current');
      const thresholdsData = await thresholdsResponse.json();

      // Load performance evaluation
      const evaluationResponse = await fetch('/api/threshold-tuning?action=evaluate&days=7');
      const evaluationData = await evaluationResponse.json();

      // Load recommendations
      const recommendationResponse = await fetch('/api/threshold-tuning?action=recommendation');
      const recommendationData = await recommendationResponse.json();

      if (thresholdsData.success) setThresholds(thresholdsData.thresholds);
      if (evaluationData.success) setEvaluation(evaluationData.evaluation);
      if (recommendationData.success) setRecommendation(recommendationData.recommendation);

    } catch (error) {
      console.error('Error loading threshold data:', error);
      toast.error('Erreur lors du chargement des seuils');
    } finally {
      setLoading(false);
    }
  };

  const performAutoTuning = async () => {
    try {
      setTuning(true);
      const response = await fetch('/api/threshold-tuning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tune' })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        if (data.result) {
          toast.success(`${data.result.reasoning.length} ajustements appliqués`);
        }
        await loadThresholdData();
      } else {
        toast.error(data.error || 'Erreur lors du tuning');
      }
    } catch (error) {
      console.error('Error performing auto tuning:', error);
      toast.error('Erreur lors du tuning automatique');
    } finally {
      setTuning(false);
    }
  };

  const scheduleAutoTuning = async (intervalHours = 24) => {
    try {
      const response = await fetch('/api/threshold-tuning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'schedule',
          intervalHours
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error scheduling auto tuning:', error);
      toast.error('Erreur lors de la planification');
    }
  };

  const updateManualThreshold = async (newThresholds, reason) => {
    try {
      const response = await fetch('/api/threshold-tuning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'set_manual',
          thresholds: newThresholds,
          reason
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Seuils mis à jour manuellement');
        await loadThresholdData();
        setShowManualEdit(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error updating manual threshold:', error);
      toast.error('Erreur lors de la mise à jour manuelle');
    }
  };

  const getPerformanceColor = (value, target) => {
    if (value >= target) return 'text-green-600';
    if (value >= target * 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getThresholdRecommendationIcon = (needsTuning) => {
    return needsTuning ? (
      <AlertTriangle className="w-5 h-5 text-yellow-500" />
    ) : (
      <CheckCircle className="w-5 h-5 text-green-500" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Chargement des seuils...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="w-7 h-7 text-blue-600" />
            <span>Tuning Automatique des Seuils</span>
          </h1>
          <p className="text-gray-600">Optimisation dynamique basée sur les performances</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={performAutoTuning}
            disabled={tuning}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {tuning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>Tuning Auto</span>
          </button>
          <button
            onClick={loadThresholdData}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      {evaluation && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <span>Performance Actuelle (7 jours)</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                <span className={getPerformanceColor(evaluation.metrics.accuracy, 0.85)}>
                  {(evaluation.metrics.accuracy * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-gray-600">Précision</div>
              <div className="text-xs text-gray-500">Cible: 85%</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                <span className={getPerformanceColor(evaluation.metrics.satisfaction, 0.8)}>
                  {(evaluation.metrics.satisfaction * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-gray-600">Satisfaction</div>
              <div className="text-xs text-gray-500">Cible: 80%</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold mb-1">
                <span className={getPerformanceColor(evaluation.metrics.responseRate, 0.15)}>
                  {(evaluation.metrics.responseRate * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-sm text-gray-600">Taux de Réponse</div>
              <div className="text-xs text-gray-500">Cible: 15%</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold mb-1 text-blue-600">
                {evaluation.metrics.totalFeedbacks}
              </div>
              <div className="text-sm text-gray-600">Feedbacks</div>
              <div className="text-xs text-gray-500">Derniers 7 jours</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Alert */}
      {recommendation && (
        <div className={`border rounded-xl p-6 ${
          recommendation.needsTuning
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-start space-x-3">
            {getThresholdRecommendationIcon(recommendation.needsTuning)}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                {recommendation.needsTuning
                  ? 'Ajustement des Seuils Recommandé'
                  : 'Seuils Optimaux'}
              </h3>
              {recommendation.needsTuning ? (
                <div className="space-y-2">
                  <p className="text-gray-700">
                    Le système recommande des ajustements pour améliorer les performances :
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {recommendation.reasoning.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                  {recommendation.expectedImpact && Object.keys(recommendation.expectedImpact).length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700">Impact attendu :</p>
                      <div className="flex space-x-4 mt-1">
                        {Object.entries(recommendation.expectedImpact).map(([metric, impact]) => (
                          <span key={metric} className="text-sm text-green-600">
                            {metric}: {impact}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-700">
                  Les seuils actuels sont optimaux pour les performances observées.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Thresholds */}
      {thresholds && (
        <div className="bg-white border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-500" />
              <span>Seuils de Confiance Actuels</span>
            </h2>
            <button
              onClick={() => setShowManualEdit(!showManualEdit)}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
            >
              <Sliders className="w-4 h-4" />
              <span>Ajustement Manuel</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(thresholds.confidence).map(([level, value]) => (
              <div key={level} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 capitalize">{level}</h3>
                  <div className="text-2xl font-bold text-blue-600">
                    {(value * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {level === 'high' && 'Auto-acceptation des prédictions'}
                  {level === 'medium' && 'Demande de feedback utilisateur'}
                  {level === 'low' && 'Suggestion d\'alternatives'}
                  {level === 'min' && 'Confiance minimale viable'}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${value * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Manual Threshold Adjustment */}
          {showManualEdit && (
            <div className="mt-6 border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Ajustement Manuel</h3>
              <ManualThresholdEditor
                currentThresholds={thresholds.confidence}
                onUpdate={updateManualThreshold}
                onCancel={() => setShowManualEdit(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* Tuning History */}
      {thresholds?.tuningHistory && thresholds.tuningHistory.length > 0 && (
        <div className="bg-white border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <span>Historique des Ajustements</span>
          </h2>

          <div className="space-y-4">
            {thresholds.tuningHistory.slice(0, 5).map((entry, index) => (
              <div key={index} className="border-l-4 border-blue-300 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">
                      {new Date(entry.timestamp).toLocaleDateString('fr-FR')} à{' '}
                      {new Date(entry.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {entry.reasoning.join(' • ')}
                    </div>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    {entry.expectedImpact && Object.entries(entry.expectedImpact).map(([metric, impact]) => (
                      <span key={metric} className="text-green-600">
                        {metric}: {impact}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Auto-Scheduling */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <span>Tuning Automatique Programmé</span>
        </h2>

        <p className="text-gray-600 mb-4">
          Le système peut ajuster automatiquement les seuils selon une fréquence définie.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={() => scheduleAutoTuning(24)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Quotidien (24h)
          </button>
          <button
            onClick={() => scheduleAutoTuning(168)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Hebdomadaire (7j)
          </button>
          <button
            onClick={() => scheduleAutoTuning(720)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Mensuel (30j)
          </button>
        </div>
      </div>

      {/* Performance Targets */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Award className="w-5 h-5 text-gold-500" />
          <span>Cibles de Performance</span>
        </h2>

        {thresholds?.performance && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {(thresholds.performance.accuracy_target * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Précision Cible</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {(thresholds.performance.user_satisfaction_target * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Satisfaction Cible</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-semibold text-gray-900">
                {(thresholds.performance.response_rate_target * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Taux de Réponse Cible</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Manual Threshold Editor Component
const ManualThresholdEditor = ({ currentThresholds, onUpdate, onCancel }) => {
  const [editedThresholds, setEditedThresholds] = useState({ ...currentThresholds });
  const [reason, setReason] = useState('');

  const handleThresholdChange = (level, value) => {
    setEditedThresholds(prev => ({
      ...prev,
      [level]: parseFloat(value) / 100
    }));
  };

  const handleSave = () => {
    if (!reason.trim()) {
      toast.error('Veuillez fournir une raison pour cet ajustement');
      return;
    }

    onUpdate(editedThresholds, reason);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(editedThresholds).map(([level, value]) => (
          <div key={level}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {level} ({(value * 100).toFixed(1)}%)
            </label>
            <input
              type="range"
              min="10"
              max="95"
              step="1"
              value={value * 100}
              onChange={(e) => handleThresholdChange(level, e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span>95%</span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Raison de l'ajustement
        </label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ex: Ajustement pour améliorer la précision"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Sauvegarder
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default ThresholdTuningDashboard;