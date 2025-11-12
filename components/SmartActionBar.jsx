"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, TrendingUp, Clock, Target, Star, ArrowRight, 
  Mail, Brain, BarChart3, X, RefreshCw, CheckCircle
} from 'lucide-react';
import { toast } from "sonner";

const SmartActionBar = ({ onOpenChatbot, onOpenAnalytics }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadSmartSuggestions();
    
    // Update time every minute for time-based suggestions
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Show the bar after a short delay
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(showTimer);
    };
  }, []);

  const loadSmartSuggestions = async () => {
    try {
      setIsLoading(true);
      
      // Get analytics data
      const response = await fetch('/api/analytics?type=summary');
      const result = await response.json();
      
      if (result.success) {
        const smartSuggestions = generateSmartSuggestions(result.metrics, currentTime);
        setSuggestions(smartSuggestions);
      } else {
        // Default suggestions if no analytics data
        setSuggestions(getDefaultSuggestions(currentTime));
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestions(getDefaultSuggestions(currentTime));
    } finally {
      setIsLoading(false);
    }
  };

  const generateSmartSuggestions = (metrics, currentTime) => {
    const suggestions = [];
    const hour = currentTime.getHours();
    const dayOfWeek = currentTime.getDay();
    
    // Time-based suggestions
    if (hour >= 9 && hour <= 11) {
      suggestions.push({
        id: 'morning_prospecting',
        icon: '🌅',
        title: 'Prospection matinale',
        description: 'Moment idéal pour contacter de nouveaux prospects',
        action: 'create_prospecting_email',
        priority: 'high',
        type: 'time_based'
      });
    }
    
    if (hour >= 14 && hour <= 16) {
      suggestions.push({
        id: 'afternoon_followup',
        icon: '📞',
        title: 'Suivi après-midi',
        description: 'Parfait pour les relances et suivis',
        action: 'create_followup_email',
        priority: 'medium',
        type: 'time_based'
      });
    }

    // Analytics-based suggestions
    if (metrics.total_emails > 0) {
      const emailsSentRatio = (metrics.total_sent_emails || 0) / metrics.total_emails;
      
      if (emailsSentRatio < 0.3) {
        suggestions.push({
          id: 'send_more_emails',
          icon: '📤',
          title: 'Envoyez plus d\'emails',
          description: `Seulement ${Math.round(emailsSentRatio * 100)}% de vos emails sont envoyés`,
          action: 'review_drafts',
          priority: 'high',
          type: 'performance'
        });
      }
      
      if (metrics.ai_interactions === 0) {
        suggestions.push({
          id: 'try_ai_assistant',
          icon: '🤖',
          title: 'Essayez l\'IA',
          description: 'Créez des emails plus efficaces avec l\'assistant IA',
          action: 'open_chatbot',
          priority: 'medium',
          type: 'feature'
        });
      }
    }

    // Performance-based suggestions
    if (metrics.tone_performance) {
      const bestTone = Object.entries(metrics.tone_performance)
        .filter(([_, perf]) => perf.usage > 0)
        .sort(([_, a], [__, b]) => b.average_rating - a.average_rating)[0];
      
      if (bestTone && bestTone[1].average_rating > 4) {
        suggestions.push({
          id: 'use_best_tone',
          icon: '⭐',
          title: `Ton ${bestTone[0]} performe bien`,
          description: `Note moyenne: ${bestTone[1].average_rating.toFixed(1)}/5`,
          action: `use_tone_${bestTone[0]}`,
          priority: 'medium',
          type: 'optimization'
        });
      }
    }

    // Week-based suggestions
    if (dayOfWeek === 1) { // Monday
      suggestions.push({
        id: 'monday_planning',
        icon: '📋',
        title: 'Planning semaine',
        description: 'Planifiez vos emails de la semaine',
        action: 'weekly_planning',
        priority: 'medium',
        type: 'planning'
      });
    }

    // Default suggestion if none generated
    if (suggestions.length === 0) {
      suggestions.push({
        id: 'create_email',
        icon: '✨',
        title: 'Créer un email',
        description: 'Laissez l\'IA vous guider',
        action: 'open_chatbot',
        priority: 'high',
        type: 'action'
      });
    }

    return suggestions.slice(0, 3); // Max 3 suggestions
  };

  const getDefaultSuggestions = (currentTime) => {
    return [
      {
        id: 'first_email',
        icon: '🚀',
        title: 'Créer votre premier email',
        description: 'Commencez avec l\'assistant intelligent',
        action: 'open_chatbot',
        priority: 'high',
        type: 'getting_started'
      },
      {
        id: 'explore_features',
        icon: '🔍',
        title: 'Explorer les fonctionnalités',
        description: 'Découvrez l\'envoi direct et l\'IA',
        action: 'feature_tour',
        priority: 'medium',
        type: 'discovery'
      }
    ];
  };

  const handleSuggestionClick = async (suggestion) => {
    switch (suggestion.action) {
      case 'open_chatbot':
      case 'create_prospecting_email':
      case 'create_followup_email':
        onOpenChatbot();
        toast.success('Assistant email ouvert !');
        break;
      
      case 'review_drafts':
        toast.info('Consultez vos emails générés et envoyez-les !');
        break;
        
      case 'open_analytics':
        onOpenAnalytics();
        break;
        
      case 'weekly_planning':
        toast.info('Fonctionnalité de planification bientôt disponible !');
        break;
        
      default:
        onOpenChatbot();
    }

    // Track suggestion click
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_suggestion_click',
          data: {
            suggestionId: suggestion.id,
            suggestionType: suggestion.type,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.warn('Failed to track suggestion click:', error);
    }
  };

  const dismissBar = () => {
    setIsVisible(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default: return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Zap className="w-4 h-4 text-red-600" />;
      case 'medium': return <Star className="w-4 h-4 text-yellow-600" />;
      default: return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 max-w-4xl w-full px-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 animate-slide-down">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Actions Intelligentes</h3>
              <p className="text-xs text-gray-600">Suggestions basées sur vos données</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadSmartSuggestions}
              disabled={isLoading}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Actualiser les suggestions"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={dismissBar}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Masquer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`text-left p-3 rounded-lg border transition-all hover:shadow-md hover:scale-105 ${getPriorityColor(suggestion.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-lg">{suggestion.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    {getPriorityIcon(suggestion.priority)}
                  </div>
                  <p className="text-xs opacity-80">{suggestion.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs font-medium">
                    <span>Action</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div>
            {currentTime.toLocaleString('fr-FR', { 
              weekday: 'long', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
          <div className="flex items-center gap-4">
            <span>📊 Analytics: actives</span>
            <span>🤖 IA: disponible</span>
            <span>📧 Envoi: configuré</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartActionBar;