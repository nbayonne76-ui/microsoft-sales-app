"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, ArrowRight, ArrowLeft, X, Play, 
  MessageCircle, Calendar, GitBranch, Users, FileText,
  Zap, Target, CheckCircle, BookOpen, Lightbulb
} from 'lucide-react';

const IntelligentOnboarding = ({ isOpen, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [userProgress, setUserProgress] = useState({
    hasGeneratedEmail: false,
    hasUsedChatbot: false,
    hasScheduledEmail: false,
    hasUsedSequences: false
  });

  const onboardingSteps = [
    {
      id: 'welcome',
      title: '🚀 Bienvenue dans votre Assistant Email IA',
      subtitle: 'Transformez votre communication professionnelle',
      content: 'Découvrez comment créer des emails parfaits en quelques clics avec notre IA avancée et nos outils d\'automatisation intelligents.',
      action: 'Commencer le tour guidé',
      highlight: null,
      type: 'intro'
    },
    {
      id: 'chatbot',
      title: '🤖 Assistant Conversationnel Intelligent',
      subtitle: 'Votre guide personnel pour créer des emails parfaits',
      content: 'Notre IA conversationnelle vous guide étape par étape. Elle comprend votre contexte, suggère le bon ton et génère des emails personnalisés.',
      features: [
        '✨ Suggestions intelligentes en temps réel',
        '🎯 Adaptation automatique au contexte',
        '📝 Auto-complétion et texte prédictif',
        '💾 Sauvegarde automatique'
      ],
      action: 'Essayer l\'assistant',
      highlight: '#chatbot-button',
      type: 'feature'
    },
    {
      id: 'scheduling',
      title: '📅 Planification Intelligente',
      subtitle: 'Envoyez au moment optimal pour maximiser l\'impact',
      content: 'Notre système d\'IA analyse les patterns d\'engagement pour suggérer les meilleurs créneaux d\'envoi selon votre audience.',
      features: [
        '🕐 Analyse des heures optimales',
        '🌍 Gestion des fuseaux horaires',
        '📊 Scoring de confiance intelligent',
        '⚡ Programmation en un clic'
      ],
      action: 'Voir la planification',
      highlight: '#scheduler-demo',
      type: 'feature'
    },
    {
      id: 'automation',
      title: '🔄 Séquences Automatisées',
      subtitle: 'Automatisez vos suivis et relances intelligemment',
      content: 'Créez des séquences de suivi qui s\'adaptent aux réactions de vos contacts. Fini les opportunités manquées !',
      features: [
        '📋 Templates pré-construits',
        '🎯 Triggers intelligents',
        '📈 Suivi des performances',
        '⏱️ Timing automatique'
      ],
      action: 'Explorer l\'automation',
      highlight: '#sequences-button',
      type: 'feature'
    },
    {
      id: 'contacts',
      title: '👥 Suggestions de Contacts Intelligentes',
      subtitle: 'Trouvez le bon destinataire au bon moment',
      content: 'Notre IA analyse votre historique pour suggérer les contacts les plus pertinents selon le type d\'email que vous créez.',
      features: [
        '🤝 Scoring de compatibilité',
        '📊 Historique d\'interactions',
        '🔍 Recherche contextuelle',
        '⭐ Taux de réponse prédictifs'
      ],
      action: 'Voir les suggestions',
      highlight: '#contacts-button',
      type: 'feature'
    },
    {
      id: 'ready',
      title: '🎉 Vous êtes prêt à exceller !',
      subtitle: 'Votre arsenal d\'email marketing intelligent est configuré',
      content: 'Vous maîtrisez maintenant tous les outils pour créer, planifier et automatiser vos emails comme un pro.',
      achievements: [
        { icon: '🤖', text: 'Assistant IA configuré' },
        { icon: '📅', text: 'Planification activée' },
        { icon: '🔄', text: 'Automation disponible' },
        { icon: '👥', text: 'Contacts intelligents prêts' }
      ],
      action: 'Créer mon premier email',
      type: 'completion'
    }
  ];

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 200);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const skipOnboarding = () => {
    onSkip();
  };

  const handleStepAction = (step) => {
    switch (step.id) {
      case 'chatbot':
        // Highlight chatbot button
        document.getElementById('chatbot-button')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'scheduling':
        // Demo scheduling feature
        break;
      case 'automation':
        // Show automation preview
        break;
      case 'contacts':
        // Show contacts feature
        break;
      case 'ready':
        onComplete();
        break;
      default:
        nextStep();
    }
  };

  const currentStepData = onboardingSteps[currentStep];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Background particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className={`card-glass w-full max-w-4xl max-h-[90vh] overflow-hidden transition-all duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="absolute top-4 right-4">
            <button
              onClick={skipOnboarding}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
              data-tooltip="Passer le tutoriel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{currentStepData.title}</h1>
              <p className="text-blue-100 text-sm">{currentStepData.subtitle}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
            />
          </div>
          <div className="text-xs text-blue-100">
            Étape {currentStep + 1} sur {onboardingSteps.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="animate-fade-scale">
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {currentStepData.content}
            </p>

            {/* Features list */}
            {currentStepData.features && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {currentStepData.features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-blue-600">
                      {feature.split(' ')[0]}
                    </div>
                    <span className="text-sm text-gray-700">
                      {feature.substring(feature.indexOf(' ') + 1)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Achievements (for completion step) */}
            {currentStepData.achievements && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {currentStepData.achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200 animate-bounce-subtle"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="text-sm font-medium text-green-800">
                      {achievement.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive demo area */}
            {currentStepData.type === 'feature' && (
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 border-2 border-dashed border-gray-300">
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
                      {currentStepData.id === 'chatbot' && <MessageCircle className="w-8 h-8 text-blue-600" />}
                      {currentStepData.id === 'scheduling' && <Calendar className="w-8 h-8 text-blue-600" />}
                      {currentStepData.id === 'automation' && <GitBranch className="w-8 h-8 text-blue-600" />}
                      {currentStepData.id === 'contacts' && <Users className="w-8 h-8 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-600">
                      Fonctionnalité interactive disponible après le tutoriel
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="btn-ghost flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Précédent
              </button>
            )}
            <button
              onClick={skipOnboarding}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Passer le tutoriel
            </button>
          </div>

          <button
            onClick={() => handleStepAction(currentStepData)}
            className="btn-primary flex items-center gap-2 animate-bounce-subtle"
          >
            <span>{currentStepData.action}</span>
            {currentStep < onboardingSteps.length - 1 ? (
              <ArrowRight className="w-4 h-4" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="px-8 pb-4">
          <div className="text-xs text-gray-400 text-center">
            Utilisez les flèches ← → ou Échap pour naviguer
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentOnboarding;