"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, Lightbulb } from 'lucide-react';

const TypingFeedback = ({ 
  currentInput, 
  conversationState, 
  emailData, 
  onSuggestionClick 
}) => {
  const [feedback, setFeedback] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (conversationState === 'gathering_info' && currentInput.length > 0) {
      const newFeedback = generateTypingFeedback(currentInput, emailData);
      setFeedback(newFeedback);
      setShowSuggestions(true);
    } else {
      setFeedback(null);
      setShowSuggestions(false);
    }
  }, [currentInput, conversationState, emailData]);

  const generateTypingFeedback = (input, emailData) => {
    const trimmed = input.trim();
    const feedback = {
      type: 'info',
      message: '',
      suggestions: [],
      confidence: 0,
      isValid: false
    };

    if (trimmed.length < 2) {
      return null; // Pas assez de contenu pour analyser
    }

    // Pattern attendu : "Prénom Nom, Entreprise, email@domaine.com"
    const parts = trimmed.split(',').map(p => p.trim());
    
    if (parts.length === 1) {
      // Juste un nom ou début de saisie
      const singlePart = parts[0];
      
      if (singlePart.includes('@')) {
        // L'utilisateur a commencé par l'email
        feedback.type = 'warning';
        feedback.message = '📧 Email détecté. Commencez plutôt par le nom : "Martin Dupont, ..."';
        feedback.suggestions = [
          'Martin Dupont, Microsoft, ' + singlePart,
          'Sophie Martin, TechCorp, ' + singlePart
        ];
        feedback.confidence = 0.6;
      } else if (singlePart.length > 15) {
        // Phrase longue - probablement une demande
        feedback.type = 'info';
        feedback.message = '💭 Je vois une phrase. Pour les infos contact, utilisez : "Nom, Entreprise"';
        feedback.suggestions = [
          'Martin Dubois, Microsoft',
          'Sophie Martin, TechCorp'
        ];
        feedback.confidence = 0.4;
      } else {
        // Nom simple
        const nameWords = singlePart.split(' ');
        if (nameWords.length >= 2) {
          feedback.type = 'success';
          feedback.message = '👤 Nom complet détecté. Ajoutez l\'entreprise : ", [Entreprise]"';
          feedback.suggestions = [
            `${singlePart}, Microsoft`,
            `${singlePart}, TechCorp`,
            `${singlePart}, Azure Solutions`
          ];
          feedback.confidence = 0.7;
        } else {
          feedback.type = 'info';
          feedback.message = '👤 Prénom détecté. Ajoutez nom et entreprise : "Martin Dupont, Microsoft"';
          feedback.suggestions = [
            `${singlePart} Dupont, Microsoft`,
            `${singlePart} Martin, TechCorp`
          ];
          feedback.confidence = 0.5;
        }
      }
    } else if (parts.length === 2) {
      // Nom + Entreprise
      const name = parts[0];
      const company = parts[1];
      
      if (name.length < 2) {
        feedback.type = 'warning';
        feedback.message = '❌ Nom trop court. Ex: "Martin Dupont"';
        feedback.confidence = 0.3;
      } else if (company.length < 2) {
        feedback.type = 'warning';
        feedback.message = '🏢 Nom d\'entreprise trop court. Ex: "Microsoft"';
        feedback.confidence = 0.3;
      } else {
        feedback.type = 'success';
        feedback.message = '✅ Nom et entreprise OK ! Ajoutez email (optionnel) : ", email@domaine.com"';
        
        // Générer suggestions d'email basées sur le nom et l'entreprise
        const firstName = name.split(' ')[0].toLowerCase();
        const companyShort = company.toLowerCase().replace(/[^a-z]/g, '');
        feedback.suggestions = [
          `${trimmed}, ${firstName}@${companyShort}.com`,
          `${trimmed}, ${firstName}@${companyShort}.fr`,
          '✅ Continuer sans email'
        ];
        feedback.confidence = 0.9;
        feedback.isValid = true;
      }
    } else if (parts.length === 3) {
      // Format complet : Nom, Entreprise, Email
      const name = parts[0];
      const company = parts[1];
      const email = parts[2];
      
      const emailPattern = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
      
      if (!emailPattern.test(email)) {
        feedback.type = 'error';
        feedback.message = '❌ Format email incorrect. Utilisez : nom@domaine.com';
        feedback.suggestions = [
          `${name}, ${company}, ${email.split('@')[0] || 'nom'}@exemple.com`
        ];
        feedback.confidence = 0.4;
      } else {
        feedback.type = 'success';
        feedback.message = '🎉 Format parfait ! Appuyez sur Entrée pour continuer';
        feedback.confidence = 1.0;
        feedback.isValid = true;
      }
    } else {
      // Trop de parties
      feedback.type = 'warning';
      feedback.message = '⚠️ Trop d\'éléments. Format attendu : "Nom, Entreprise, Email"';
      feedback.confidence = 0.2;
    }

    return feedback;
  };

  const getFeedbackIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getFeedbackStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  if (!feedback || !showSuggestions) return null;

  return (
    <div className={`border rounded-lg p-3 mb-2 transition-all duration-300 ${getFeedbackStyles(feedback.type)}`}>
      <div className="flex items-start gap-2">
        {getFeedbackIcon(feedback.type)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-2">{feedback.message}</p>
          
          {feedback.suggestions.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 mb-1">
                <Lightbulb className="w-3 h-3" />
                <span className="text-xs font-medium">Suggestions :</span>
              </div>
              {feedback.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="block w-full text-left text-xs p-2 bg-white/70 hover:bg-white rounded border transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          {feedback.confidence > 0 && (
            <div className="mt-2 text-xs opacity-75">
              Confiance : {Math.round(feedback.confidence * 100)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingFeedback;