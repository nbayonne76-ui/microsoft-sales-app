"use client";

import React, { useState } from 'react';
import { Copy, Mail, Building, Users, AlertCircle, ThumbsUp } from 'lucide-react';
import { toast } from "sonner";

/**
 * Générateur Simple - Affiche les 4 templates selon le ton sélectionné
 */

// Templates stockés directement (tirés de populate-templates.js)
const EMAIL_TEMPLATES = {
  formal: {
    name: 'Migration Azure Enterprise Formel',
    subject: 'Stratégie de Migration Microsoft Azure - Accompagnement Exécutif',
    content: `Madame, Monsieur,

Dans le cadre de la transformation digitale de votre organisation, nous avons identifié des opportunités significatives d'optimisation via Microsoft Azure.

Notre analyse préliminaire suggère que votre infrastructure actuelle pourrait bénéficier d'une approche de migration structurée, avec un focus sur:

• Optimisation des coûts opérationnels (estimation: 25-40% de réduction)
• Amélioration de la résilience et de la sécurité
• Facilitation de la scalabilité selon vos besoins business

Cette migration nécessite une attention prioritaire compte tenu des enjeux stratégiques.

Je propose d'organiser un executive briefing de 45 minutes pour présenter notre méthodologie éprouvée et discuter de vos priorités stratégiques.

Je demeure à votre disposition pour organiser cette discussion dans les meilleurs délais.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`,
    successRate: 78
  },

  professional_friendly: {
    name: 'Migration Azure PME Accessible', 
    subject: '🚀 Votre projet Azure - Accompagnement personnalisé',
    content: `Bonjour,

J'espère que vous allez bien ! 😊

Je reviens vers vous concernant votre projet de migration Azure. Après avoir analysé votre contexte, je pense qu'on peut vraiment vous aider à simplifier cette transition.

Ce que je vous propose:
✨ Un accompagnement étape par étape (pas de stress !)
💰 Une optimisation des coûts dès le départ
🛡️ Une sécurité renforcée pour vos données
📈 Une infrastructure qui grandit avec vous

J'adorerais qu'on puisse en discuter de vive voix - ça serait plus simple pour répondre à toutes vos questions !

Est-ce qu'on pourrait se caler un petit call cette semaine ? Je m'adapte complètement à votre agenda !

Au plaisir d'échanger,

Nicolas 🤝
Votre contact Microsoft`,
    successRate: 82
  },

  casual_expert: {
    name: 'Migration Azure Startup Dynamique',
    subject: '🚀 Ton projet Azure - Let\'s make it happen!',
    content: `Salut !

Alors, cette migration Azure ? J'ai regardé un peu ton contexte et franchement, je pense qu'on peut faire des trucs vraiment cool ensemble ! 😎

Ce que je vois pour toi:
💡 Une migration smart (pas de stress inutile)
💰 Des économies dès le départ (tu vas adorer ça !)
🔧 Une infrastructure qui scale avec tes besoins
⚡ Plus de performance, moins de headaches

Je sais que ça peut paraître un gros chantier, mais crois-moi, on va y aller step by step !

Que dis-tu d'un call décontracté cette semaine ? On pourrait brainstormer sur ton setup idéal !

Keep it simple,
Nicolas 🤙`,
    successRate: 89
  },

  urgent: {
    name: 'Migration Azure Urgent',
    subject: '🚨 URGENT - Opportunité Microsoft Azure limitée dans le temps',
    content: `Madame, Monsieur,

URGENT - Cette opportunité nécessite une action rapide de votre part.

Microsoft propose actuellement des conditions exceptionnelles pour les migrations Azure qui expirent fin de trimestre.

BÉNÉFICES IMMÉDIATS :
⚠️ Réduction coûts jusqu'à 45% (offre limitée)
⚠️ Migration gratuite (valeur 50K€)
⚠️ Support premium inclus 6 mois
⚠️ Crédits Azure bonus

DEADLINE : Cette proposition expire dans 15 jours.

Action requise : Confirmer votre intérêt avant vendredi pour sécuriser ces avantages.

Contact prioritaire nécessaire.

Urgence commerciale,
Nicolas BAYONNE
Microsoft Account Manager
📞 Direct : [PHONE]`,
    successRate: 75
  }
};

const TONE_OPTIONS = {
  formal: { 
    label: 'Formel', 
    icon: <Building className="w-4 h-4" />, 
    color: 'bg-blue-600',
    description: 'Style professionnel pour grandes entreprises'
  },
  professional_friendly: { 
    label: 'Professionnel Amical', 
    icon: <ThumbsUp className="w-4 h-4" />, 
    color: 'bg-green-600',
    description: 'Approche chaleureuse pour PME'
  },
  urgent: { 
    label: 'Urgent', 
    icon: <AlertCircle className="w-4 h-4" />, 
    color: 'bg-red-600',
    description: 'Communication prioritaire et directe'
  },
  casual_expert: { 
    label: 'Décontracté', 
    icon: <Users className="w-4 h-4" />, 
    color: 'bg-purple-600',
    description: 'Style moderne pour startups'
  }
};

const SimpleEmailViewer = () => {
  const [selectedTone, setSelectedTone] = useState('professional_friendly');
  
  const currentTemplate = EMAIL_TEMPLATES[selectedTone];
  const currentToneInfo = TONE_OPTIONS[selectedTone];

  // Copier dans le presse-papier
  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Email copié dans le presse-papier !');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  // Copier l'email complet
  const copyFullEmail = () => {
    const fullEmail = `Objet: ${currentTemplate.subject}

${currentTemplate.content}`;
    copyToClipboard(fullEmail);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-3">
          <Mail className="w-8 h-8" />
          Templates Email par Ton
        </h1>
        <p className="mt-2 opacity-90">4 templates pré-enregistrés selon le ton choisi</p>
      </div>

      {/* Sélecteur de Ton */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Choisissez votre ton</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(TONE_OPTIONS).map(([key, tone]) => (
            <button
              key={key}
              onClick={() => setSelectedTone(key)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
                selectedTone === key 
                  ? `${tone.color} text-white` 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {tone.icon}
              <span className="font-medium text-sm">{tone.label}</span>
            </button>
          ))}
        </div>

        {/* Description du ton sélectionné */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📝</span>
            <span><strong>{currentToneInfo.label}:</strong> {currentToneInfo.description}</span>
            <span className="ml-auto bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
              {currentTemplate.successRate}% succès
            </span>
          </div>
        </div>
      </div>

      {/* Email Template */}
      <div className="bg-white rounded-xl p-6 border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {currentTemplate.name}
          </h2>
          
          <button
            onClick={copyFullEmail}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copier Email
          </button>
        </div>

        {/* Sujet */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Objet:</label>
            <button
              onClick={() => copyToClipboard(currentTemplate.subject)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Copier sujet
            </button>
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="text-gray-800">{currentTemplate.subject}</span>
          </div>
        </div>

        {/* Contenu */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Message:</label>
            <button
              onClick={() => copyToClipboard(currentTemplate.content)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Copier message
            </button>
          </div>
          <div className="p-4 bg-gray-50 border rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
              {currentTemplate.content}
            </pre>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(EMAIL_TEMPLATES).map(([key, template]) => (
          <div key={key} className={`p-3 rounded-lg text-center ${
            selectedTone === key ? 'bg-blue-100 border-2 border-blue-300' : 'bg-gray-100'
          }`}>
            <div className="text-lg font-bold text-gray-800">{template.successRate}%</div>
            <div className="text-xs text-gray-600">{TONE_OPTIONS[key].label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleEmailViewer;