"use client";

import React, { useState, useEffect } from 'react';
import { Lightbulb, MessageSquare, Clock, Zap } from 'lucide-react';

const ProactiveSuggestions = ({ 
  conversationState, 
  emailData, 
  lastMessage, 
  onSuggestionClick,
  isVisible = true 
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    const newSuggestions = generateProactiveSuggestions(conversationState, emailData, lastMessage);
    setSuggestions(newSuggestions);
  }, [conversationState, emailData, lastMessage]);

  const generateProactiveSuggestions = (state, data, message) => {
    const suggestions = [];
    const messageLower = message?.toLowerCase() || '';

    switch (state) {
      case 'initial':
        suggestions.push(
          {
            type: 'example',
            icon: '🎯',
            text: 'Exemple : "Je veux contacter un nouveau prospect Azure"',
            action: 'Je veux contacter un nouveau prospect Azure',
            category: 'Démarrage rapide'
          },
          {
            type: 'template',
            icon: '📝',
            text: 'Voir tous les types d\'emails disponibles',
            action: 'Quels types d\'emails puis-je créer ?',
            category: 'Templates'
          }
        );

        // Suggestions contextuelles basées sur le message
        if (messageLower.includes('aide') || messageLower.includes('comment')) {
          suggestions.unshift({
            type: 'help',
            icon: '💡',
            text: 'Guide rapide : 3 étapes simples',
            action: 'Comment créer un email rapidement ?',
            category: 'Aide',
            priority: true
          });
        }
        break;

      case 'gathering_info':
        // Suggestions basées sur les informations manquantes
        if (!data.recipientName) {
          suggestions.push({
            type: 'format',
            icon: '👤',
            text: 'Exemple : "Martin Dubois, Microsoft"',
            action: 'Martin Dubois, Microsoft, martin@microsoft.com',
            category: 'Format'
          });
        }

        if (!data.company && data.recipientName) {
          suggestions.push({
            type: 'company',
            icon: '🏢',
            text: `${data.recipientName} de quelle entreprise ?`,
            action: `${data.recipientName}, [Nom de l'entreprise]`,
            category: 'Information'
          });
        }

        if (!data.recipient && data.recipientName && data.company) {
          suggestions.push({
            type: 'email',
            icon: '📧',
            text: 'Ajouter l\'adresse email pour envoi direct',
            action: `${data.recipientName}, ${data.company}, ${data.recipientName.toLowerCase().split(' ')[0]}@${data.company.toLowerCase().replace(/\s+/g, '')}.com`,
            category: 'Email'
          });
        }

        // Détection d'erreurs communes
        if (messageLower.length < 5 && messageLower.length > 0) {
          suggestions.unshift({
            type: 'error',
            icon: '⚠️',
            text: 'Message trop court - donnez plus de détails',
            action: 'Comment donner les informations du contact ?',
            category: 'Erreur',
            priority: true
          });
        }

        if (messageLower.includes('@') && !messageLower.includes('.')) {
          suggestions.unshift({
            type: 'error',
            icon: '❌',
            text: 'Format email incorrect - utilisez nom@domaine.com',
            action: 'martin@microsoft.com',
            category: 'Erreur',
            priority: true
          });
        }
        break;

      case 'review':
        suggestions.push(
          {
            type: 'action',
            icon: '✅',
            text: 'Email parfait - envoyer maintenant !',
            action: '✅ Parfait, envoyer !',
            category: 'Action'
          },
          {
            type: 'modify',
            icon: '🎨',
            text: 'Changer le ton (formel, amical, urgent)',
            action: 'Modifier le ton',
            category: 'Personnalisation'
          },
          {
            type: 'content',
            icon: '📝',
            text: 'Ajuster le contenu',
            action: 'Rendre plus court et plus direct',
            category: 'Contenu'
          }
        );

        // Suggestions basées sur le type d'email
        if (data.purpose === 'prospection') {
          suggestions.push({
            type: 'enhancement',
            icon: '🚀',
            text: 'Ajouter un appel à l\'action plus fort',
            action: 'Rendre plus commercial avec urgence',
            category: 'Amélioration'
          });
        }
        break;

      case 'help':
        suggestions.push(
          {
            type: 'faq',
            icon: '❓',
            text: 'Consulter la FAQ complète',
            action: 'faq',
            category: 'Aide'
          },
          {
            type: 'restart',
            icon: '🔄',
            text: 'Recommencer avec un nouvel email',
            action: 'Créer un nouvel email',
            category: 'Navigation'
          }
        );
        break;
    }

    // Suggestions générales toujours disponibles
    if (state !== 'initial') {
      suggestions.push({
        type: 'restart',
        icon: '🏠',
        text: 'Revenir au menu principal',
        action: 'Je veux créer un autre email',
        category: 'Navigation'
      });
    }

    return suggestions.slice(0, 4); // Limiter à 4 suggestions
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.action === 'faq') {
      // Logic to open FAQ would be handled by parent component
      onSuggestionClick({ type: 'faq' });
    } else {
      onSuggestionClick({ 
        type: 'message', 
        content: suggestion.action,
        category: suggestion.category 
      });
    }
  };

  if (!isVisible || suggestions.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Suggestions intelligentes</span>
        </div>
        <button
          onClick={() => setShowTips(!showTips)}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <Zap className="w-3 h-3" />
          {showTips ? 'Masquer' : 'Plus de conseils'}
        </button>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
              suggestion.priority 
                ? 'bg-orange-100 border border-orange-300 hover:bg-orange-200' 
                : 'bg-white border border-gray-200 hover:bg-blue-50 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{suggestion.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  suggestion.priority ? 'text-orange-800' : 'text-gray-800'
                }`}>
                  {suggestion.text}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {suggestion.category}
                </p>
              </div>
              {suggestion.type === 'example' && (
                <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              )}
            </div>
          </button>
        ))}
      </div>

      {showTips && (
        <div className="mt-4 pt-3 border-t border-blue-200">
          <div className="text-xs text-blue-700 space-y-2">
            <div className="flex items-start gap-2">
              <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>Les suggestions s'adaptent automatiquement à votre conversation</span>
            </div>
            <div className="flex items-start gap-2">
              <Zap className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>Cliquez sur une suggestion pour gagner du temps</span>
            </div>
            <div className="flex items-start gap-2">
              <Lightbulb className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>Format recommandé : "Prénom Nom, Entreprise, email@domaine.com"</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProactiveSuggestions;