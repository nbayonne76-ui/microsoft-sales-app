"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  HelpCircle, Lightbulb, Info, ArrowRight, X, 
  Zap, Target, Clock, Users, BookOpen, Sparkles
} from 'lucide-react';

const ContextualHelp = ({ 
  context = 'general', 
  userBehavior = {},
  onShowTip,
  onHideTip 
}) => {
  const [activeTips, setActiveTips] = useState([]);
  const [shownTips, setShownTips] = useState(new Set());
  const [isHelpMode, setIsHelpMode] = useState(false);

  const helpContexts = {
    // Main interface tips
    general: {
      tips: [
        {
          id: 'quick_start',
          trigger: 'first_visit',
          title: 'Démarrage rapide',
          content: 'Cliquez sur le bouton IA pour créer votre premier email intelligent en quelques secondes.',
          position: 'bottom',
          priority: 'high',
          icon: <Zap className="w-4 h-4" />,
          action: 'show_chatbot'
        },
        {
          id: 'tone_selector',
          trigger: 'viewing_tones',
          title: 'Adaptation du ton',
          content: 'Changez le ton pour adapter automatiquement votre email à votre audience (formel, amical, etc.).',
          position: 'top',
          priority: 'medium',
          icon: <Target className="w-4 h-4" />
        }
      ]
    },
    
    // Chatbot specific tips
    chatbot: {
      tips: [
        {
          id: 'conversation_flow',
          trigger: 'chatbot_opened',
          title: 'Assistant conversationnel',
          content: 'Décrivez simplement votre situation. L\'IA comprendra le contexte et vous guidera.',
          position: 'top-left',
          priority: 'high',
          icon: <Lightbulb className="w-4 h-4" />
        },
        {
          id: 'smart_suggestions',
          trigger: 'suggestions_shown',
          title: 'Suggestions intelligentes',
          content: 'Cliquez sur les suggestions pour accélérer la conversation et obtenir des réponses précises.',
          position: 'bottom',
          priority: 'medium',
          icon: <Sparkles className="w-4 h-4" />
        },
        {
          id: 'auto_save',
          trigger: 'typing_detected',
          title: 'Sauvegarde automatique',
          content: 'Votre conversation est sauvegardée automatiquement. Vous pouvez la retrouver à tout moment.',
          position: 'top-right',
          priority: 'low',
          icon: <BookOpen className="w-4 h-4" />
        }
      ]
    },

    // Scheduling tips
    scheduling: {
      tips: [
        {
          id: 'optimal_timing',
          trigger: 'scheduler_opened',
          title: 'Timing intelligent',
          content: 'Les créneaux recommandés sont calculés selon les patterns d\'engagement de votre audience.',
          position: 'left',
          priority: 'high',
          icon: <Clock className="w-4 h-4" />
        },
        {
          id: 'confidence_score',
          trigger: 'viewing_recommendations',
          title: 'Score de confiance',
          content: 'Plus le pourcentage est élevé, plus la probabilité d\'engagement est forte.',
          position: 'right',
          priority: 'medium',
          icon: <Target className="w-4 h-4" />
        }
      ]
    },

    // Contact suggestions tips
    contacts: {
      tips: [
        {
          id: 'smart_matching',
          trigger: 'contacts_opened',
          title: 'Correspondance intelligente',
          content: 'Les contacts sont classés selon leur pertinence pour votre type d\'email.',
          position: 'top',
          priority: 'high',
          icon: <Users className="w-4 h-4" />
        },
        {
          id: 'response_rates',
          trigger: 'viewing_contact_stats',
          title: 'Taux de réponse',
          content: 'Utilisez ces métriques pour choisir les contacts les plus engagés.',
          position: 'bottom',
          priority: 'medium',
          icon: <Target className="w-4 h-4" />
        }
      ]
    }
  };

  const smartTips = {
    // Behavioral triggers
    stuck_user: {
      condition: (behavior) => behavior.timeOnPage > 30000 && !behavior.hasInteracted,
      tip: {
        title: 'Besoin d\'aide ?',
        content: 'Essayez de cliquer sur l\'assistant IA pour créer votre premier email en quelques minutes.',
        action: 'show_help',
        priority: 'urgent'
      }
    },
    
    power_user: {
      condition: (behavior) => behavior.emailsCreated > 5,
      tip: {
        title: 'Fonctionnalité avancée',
        content: 'Découvrez les séquences automatiques pour optimiser vos suivis commerciaux.',
        action: 'show_automation',
        priority: 'medium'
      }
    },

    scheduling_opportunity: {
      condition: (behavior) => behavior.hasGeneratedEmail && !behavior.hasScheduled,
      tip: {
        title: 'Optimisez l\'impact',
        content: 'Programmez cet email au moment optimal pour maximiser l\'ouverture.',
        action: 'show_scheduler',
        priority: 'high'
      }
    }
  };

  useEffect(() => {
    checkForSmartTips();
  }, [userBehavior, context]);

  const checkForSmartTips = () => {
    const contextTips = helpContexts[context]?.tips || [];
    const triggeredTips = [];

    // Check context-based tips
    contextTips.forEach(tip => {
      if (shouldShowTip(tip)) {
        triggeredTips.push(tip);
      }
    });

    // Check smart behavioral tips
    Object.entries(smartTips).forEach(([key, smartTip]) => {
      if (smartTip.condition(userBehavior) && !shownTips.has(key)) {
        triggeredTips.push({
          id: key,
          ...smartTip.tip,
          type: 'smart'
        });
      }
    });

    // Sort by priority and show top tip
    const prioritizedTips = triggeredTips.sort((a, b) => {
      const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });

    if (prioritizedTips.length > 0 && activeTips.length === 0) {
      setActiveTips([prioritizedTips[0]]);
    }
  };

  const shouldShowTip = (tip) => {
    if (shownTips.has(tip.id)) return false;
    
    switch (tip.trigger) {
      case 'first_visit':
        return !userBehavior.hasVisited;
      case 'viewing_tones':
        return userBehavior.currentSection === 'tones';
      case 'chatbot_opened':
        return userBehavior.chatbotOpen;
      case 'suggestions_shown':
        return userBehavior.suggestionsVisible;
      case 'typing_detected':
        return userBehavior.isTyping;
      case 'scheduler_opened':
        return userBehavior.schedulerOpen;
      case 'contacts_opened':
        return userBehavior.contactsOpen;
      default:
        return true;
    }
  };

  const dismissTip = (tipId) => {
    setActiveTips(prev => prev.filter(tip => tip.id !== tipId));
    setShownTips(prev => new Set([...prev, tipId]));
    onHideTip?.(tipId);
  };

  const handleTipAction = (tip) => {
    switch (tip.action) {
      case 'show_chatbot':
        // Trigger chatbot opening
        break;
      case 'show_help':
        setIsHelpMode(true);
        break;
      case 'show_automation':
        // Show automation features
        break;
      case 'show_scheduler':
        // Show scheduler
        break;
    }
    dismissTip(tip.id);
  };

  const toggleHelpMode = () => {
    setIsHelpMode(!isHelpMode);
  };

  return (
    <>
      {/* Help Mode Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleHelpMode}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            isHelpMode 
              ? 'bg-blue-600 text-white scale-110' 
              : 'bg-white text-blue-600 hover:bg-blue-50'
          }`}
          data-tooltip="Mode aide interactif"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Active Tips */}
      {activeTips.map((tip) => (
        <SmartTooltip
          key={tip.id}
          tip={tip}
          onDismiss={() => dismissTip(tip.id)}
          onAction={() => handleTipAction(tip)}
        />
      ))}

      {/* Help Mode Overlay */}
      {isHelpMode && (
        <HelpModeOverlay onClose={() => setIsHelpMode(false)} />
      )}
    </>
  );
};

// Individual Smart Tooltip Component
const SmartTooltip = ({ tip, onDismiss, onAction }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-red-200 text-red-800 animate-pulse';
      case 'high':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={`fixed z-40 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
         style={{
           bottom: tip.type === 'smart' ? '120px' : 'auto',
           right: tip.type === 'smart' ? '24px' : 'auto',
           maxWidth: '320px'
         }}>
      <div className={`card-interactive p-4 ${getPriorityStyles(tip.priority)}`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {tip.icon || <Info className="w-4 h-4" />}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
            <p className="text-xs leading-relaxed mb-3">{tip.content}</p>
            
            <div className="flex items-center justify-between">
              {tip.action && (
                <button
                  onClick={onAction}
                  className="text-xs bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg transition-colors duration-200 flex items-center gap-1"
                >
                  <span>Essayer</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
              
              <button
                onClick={onDismiss}
                className="text-xs opacity-60 hover:opacity-100 p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Help Mode Overlay with interactive hotspots
const HelpModeOverlay = ({ onClose }) => {
  const hotspots = [
    {
      id: 'ai-button',
      selector: '[data-help="ai-button"]',
      title: 'Assistant IA',
      description: 'Créez des emails personnalisés en conversant avec l\'IA'
    },
    {
      id: 'tone-selector',
      selector: '[data-help="tone-selector"]',
      title: 'Sélecteur de ton',
      description: 'Adaptez automatiquement le style selon votre audience'
    },
    {
      id: 'templates',
      selector: '[data-help="templates"]',
      title: 'Templates intelligents',
      description: 'Utilisez des modèles pré-optimisés selon le contexte'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 m-4 max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Mode aide interactive</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Les éléments interactifs sont maintenant mis en évidence avec des bulles d'aide contextuelle.
        </p>

        <div className="space-y-2 mb-4">
          {hotspots.map((hotspot) => (
            <div key={hotspot.id} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="font-medium">{hotspot.title}:</span>
              <span className="text-gray-600">{hotspot.description}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="btn-primary w-full"
        >
          Compris !
        </button>
      </div>
    </div>
  );
};

export default ContextualHelp;