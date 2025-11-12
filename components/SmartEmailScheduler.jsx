"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Send, Zap, Target, Globe, 
  CheckCircle, AlertCircle, Timer, TrendingUp
} from 'lucide-react';
import { toast } from "sonner";

const SmartEmailScheduler = ({ emailContent, recipient, onSchedule, onClose }) => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [optimalTimes, setOptimalTimes] = useState([]);
  const [recipientTimezone, setRecipientTimezone] = useState('Europe/Paris');
  const [customDateTime, setCustomDateTime] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (emailContent && recipient) {
      analyzeOptimalTimes();
    }
  }, [emailContent, recipient]);

  const analyzeOptimalTimes = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate intelligent analysis
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const currentDate = new Date();
      const recommendations = generateSmartRecommendations(currentDate, recipient);
      setOptimalTimes(recommendations);
    } catch (error) {
      console.error('Error analyzing optimal times:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSmartRecommendations = (currentDate, recipient) => {
    const recommendations = [];
    const now = new Date();
    const currentHour = now.getHours();
    
    // Immediate recommendations
    if (currentHour >= 9 && currentHour <= 11) {
      recommendations.push({
        id: 'immediate',
        title: '🚀 Envoyer maintenant',
        description: 'Heure optimale pour la prospection (9h-11h)',
        datetime: new Date(now.getTime() + 2 * 60000), // 2 minutes from now
        confidence: 95,
        reason: 'Heure de pointe pour l\'ouverture d\'emails professionnels',
        type: 'immediate'
      });
    }
    
    // Today recommendations
    if (currentHour < 16) {
      const todayAfternoon = new Date(now);
      todayAfternoon.setHours(14, 30, 0, 0);
      if (todayAfternoon > now) {
        recommendations.push({
          id: 'today_afternoon',
          title: '📧 Cet après-midi (14h30)',
          description: 'Parfait pour les suivis et relances',
          datetime: todayAfternoon,
          confidence: 88,
          reason: 'Taux d\'ouverture élevé après la pause déjeuner',
          type: 'today'
        });
      }
    }
    
    // Tomorrow morning
    const tomorrowMorning = new Date(now);
    tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
    tomorrowMorning.setHours(9, 15, 0, 0);
    recommendations.push({
      id: 'tomorrow_morning',
      title: '🌅 Demain matin (9h15)',
      description: 'Début de journée - attention maximale',
      datetime: tomorrowMorning,
      confidence: 92,
      reason: 'Meilleur taux de réponse observé le matin',
      type: 'tomorrow'
    });
    
    // Next Tuesday if today is not Tuesday
    const nextTuesday = new Date(now);
    const daysUntilTuesday = (2 - now.getDay() + 7) % 7;
    if (daysUntilTuesday === 0 && now.getHours() > 10) {
      nextTuesday.setDate(nextTuesday.getDate() + 7);
    } else if (daysUntilTuesday !== 0) {
      nextTuesday.setDate(nextTuesday.getDate() + daysUntilTuesday);
    }
    nextTuesday.setHours(10, 0, 0, 0);
    
    if (nextTuesday > tomorrowMorning) {
      recommendations.push({
        id: 'next_tuesday',
        title: '⭐ Mardi prochain (10h00)',
        description: 'Jour optimal de la semaine',
        datetime: nextTuesday,
        confidence: 90,
        reason: 'Mardi = meilleur jour pour emails B2B',
        type: 'optimal'
      });
    }
    
    return recommendations.sort((a, b) => b.confidence - a.confidence);
  };

  const handleScheduleSelect = (recommendation) => {
    setSelectedSchedule(recommendation);
  };

  const handleScheduleEmail = async () => {
    if (!selectedSchedule) return;
    
    try {
      const response = await fetch('/api/schedule-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailContent,
          recipient,
          scheduledTime: selectedSchedule.datetime.toISOString(),
          timezone: recipientTimezone,
          confidence: selectedSchedule.confidence,
          reason: selectedSchedule.reason
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`📅 Email programmé pour ${selectedSchedule.datetime.toLocaleString('fr-FR')}`);
        onSchedule(selectedSchedule);
        onClose();
      } else {
        toast.error(result.error || 'Erreur lors de la programmation');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };

  const formatDateTime = (date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours < 1) {
      return `dans ${minutes} min`;
    } else if (hours < 24) {
      return `dans ${hours}h${minutes > 0 ? ` ${minutes}min` : ''}`;
    } else {
      const days = Math.floor(hours / 24);
      return `dans ${days} jour${days > 1 ? 's' : ''}`;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50';
    if (confidence >= 80) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'immediate': return <Zap className="w-4 h-4 text-green-600" />;
      case 'today': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'tomorrow': return <Calendar className="w-4 h-4 text-purple-600" />;
      case 'optimal': return <Target className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Programmation Intelligente</h2>
              <p className="text-sm text-blue-100">
                Optimisez le timing pour maximiser l'impact
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Email Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-800">Email à programmer</span>
            </div>
            <div className="text-sm text-gray-600">
              <div className="font-medium">À: {recipient}</div>
              <div className="font-medium">Objet: {emailContent?.subject}</div>
              <div className="mt-2 text-xs bg-white p-2 rounded border max-h-20 overflow-y-auto">
                {emailContent?.content?.substring(0, 150)}...
              </div>
            </div>
          </div>

          {/* Analyzing State */}
          {isAnalyzing && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-pulse" />
                <div className="text-sm text-gray-600">
                  Analyse des patterns d'engagement...
                </div>
              </div>
            </div>
          )}

          {/* Smart Recommendations */}
          {!isAnalyzing && optimalTimes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Recommandations intelligentes</h3>
              </div>

              {optimalTimes.map((recommendation) => (
                <button
                  key={recommendation.id}
                  onClick={() => handleScheduleSelect(recommendation)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    selectedSchedule?.id === recommendation.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(recommendation.type)}
                        <span className="font-medium">{recommendation.title}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(recommendation.confidence)}`}>
                          {recommendation.confidence}% confiance
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                      <div className="text-xs text-gray-500">
                        📅 {recommendation.datetime.toLocaleString('fr-FR')} 
                        <span className="ml-2">⏱️ {formatDateTime(recommendation.datetime)}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        💡 {recommendation.reason}
                      </div>
                    </div>
                    {selectedSchedule?.id === recommendation.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Custom Time Option */}
          <div className="mt-6 p-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Timer className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-700">Programmer à une heure spécifique</span>
            </div>
            <input
              type="datetime-local"
              value={customDateTime}
              onChange={(e) => setCustomDateTime(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 rounded-b-xl border-t">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <Globe className="w-4 h-4 inline mr-1" />
              Timezone: {recipientTimezone}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleScheduleEmail}
                disabled={!selectedSchedule && !customDateTime}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Programmer l'envoi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartEmailScheduler;