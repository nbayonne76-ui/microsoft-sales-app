"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Copy, Mail, UserCheck, Handshake, Calendar, Monitor, MessageCircle, RefreshCw, ArrowRight, CheckCircle,
  Building, Users, Phone, Video, Star, Clock, Settings, Search, Sparkles, Volume2, BarChart3, 
  ThumbsUp, AlertCircle, Mic, MicOff, Brain, Zap, Target, Gauge, AlertTriangle, Gift, Trophy
} from 'lucide-react';
import { toast } from "sonner";
import { DynamicField } from './ui/dynamic-field';
import AIAssistant from './AIAssistant';
import EmailChatbot from './EmailChatbot';
import SmartActionBar from './SmartActionBar';
import ABTestingDashboard from './ABTestingDashboard';
// import IntelligentOnboarding from './IntelligentOnboarding';
// import ContextualHelp from './ContextualHelp';
// import KeyboardShortcuts from './KeyboardShortcuts';
// import { RippleButton, SuccessAnimation, StaggeredList, MicroInteractionStyles } from './MicroInteractions';

// Templates Email selon les Tons
const EMAIL_TEMPLATES_BY_TONE = {
  professional: {
    subject: 'Stratégie de Migration Microsoft Azure - Accompagnement Exécutif',
    content: `Madame, Monsieur,

Dans le cadre de la transformation digitale de votre organisation, nous avons identifié des opportunités significatives d'optimisation via Microsoft Azure.

Notre analyse préliminaire suggère que votre infrastructure actuelle pourrait bénéficier d'une approche de migration structurée, avec un focus sur:

• Optimisation des coûts opérationnels (estimation: 25-40% de réduction)
• Amélioration de la résilience et de la sécurité
• Facilitation de la scalabilité selon vos besoins business

Je propose d'organiser un executive briefing de 45 minutes pour présenter notre méthodologie éprouvée et discuter de vos priorités stratégiques.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`,
    successRate: 78
  },
  friendly: {
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

Est-ce qu'on pourrait se caler un petit call cette semaine ?

Au plaisir d'échanger,

Nicolas 🤝
Votre contact Microsoft`,
    successRate: 82
  },
  casual: {
    subject: '🚀 Ton projet Azure - Let\'s make it happen!',
    content: `Salut !

Alors, cette migration Azure ? J'ai regardé un peu ton contexte et franchement, je pense qu'on peut faire des trucs vraiment cool ensemble ! 😎

Ce que je vois pour toi:
💡 Une migration smart (pas de stress inutile)
💰 Des économies dès le départ (tu vas adorer ça !)
🔧 Une infrastructure qui scale avec tes besoins
⚡ Plus de performance, moins de headaches

Je sais que ça peut paraître un gros chantier, mais crois-moi, on va y aller step by step !

Que dis-tu d'un call décontracté cette semaine ?

Keep it simple,
Nicolas 🤙`,
    successRate: 89
  },
  urgent: {
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
Microsoft Account Manager`,
    successRate: 75
  }
};

// Composant Preview des Templates
const ToneTemplatePreview = ({ selectedTone }) => {
  const [showSendModal, setShowSendModal] = useState(false);
  const [emailData, setEmailData] = useState({ to: '', from: 'nicolas.bayonne@microsoft.com' });
  const [isSending, setIsSending] = useState(false);
  
  const template = EMAIL_TEMPLATES_BY_TONE[selectedTone];
  
  if (!template) return null;

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copié dans le presse-papier !');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const copyFullEmail = () => {
    const fullEmail = `Objet: ${template.subject}

${template.content}`;
    copyToClipboard(fullEmail);
  };

  const sendEmail = async () => {
    if (!emailData.to || !emailData.to.includes('@')) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailData.to,
          from: emailData.from,
          subject: template.subject,
          content: template.content
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Email envoyé avec succès à ${emailData.to} !`);
        setShowSendModal(false);
        setEmailData({ to: '', from: 'nicolas.bayonne@microsoft.com' });
      } else {
        toast.error(result.error || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      toast.error('Erreur de connexion lors de l\'envoi');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mb-3 p-4 bg-white border rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
          <span>📧</span> 
          Preview Template - Taux de succès: <span className="text-green-600">{template.successRate}%</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyFullEmail}
            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
          >
            Copier Email
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            className="text-xs px-2 py-1 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded transition-colors flex items-center gap-1"
          >
            <Mail className="w-3 h-3" />
            Envoyer
          </button>
          <button
            onClick={() => {
              const fullEmail = `Objet: ${template.subject}

${template.content}`;
              // Trigger pour utiliser ce template dans l'app
              if (window.useTemplate) {
                window.useTemplate(fullEmail);
              } else {
                copyToClipboard(fullEmail);
                toast.success('Template prêt à utiliser !');
              }
            }}
            className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
          >
            Utiliser
          </button>
        </div>
      </div>

      {/* Modal d'envoi d'email */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Envoyer l'email
              </h3>
              <button
                onClick={() => setShowSendModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinataire *
                </label>
                <input
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  placeholder="exemple@entreprise.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expéditeur
                </label>
                <input
                  type="email"
                  value={emailData.from}
                  onChange={(e) => setEmailData({ ...emailData, from: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Objet
                </label>
                <div className="px-3 py-2 bg-gray-50 border rounded-md text-sm">
                  {template.subject}
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={sendEmail}
                  disabled={isSending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Envoyer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Sujet */}
      <div className="mb-2">
        <div className="text-xs text-gray-500 mb-1">Objet:</div>
        <div className="text-sm font-medium text-gray-800 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
          {template.subject}
        </div>
      </div>

      {/* Aperçu du contenu (tronqué) */}
      <div>
        <div className="text-xs text-gray-500 mb-1">Aperçu du message:</div>
        <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded max-h-32 overflow-y-auto">
          {template.content.split('\n').slice(0, 8).join('\n')}
          {template.content.split('\n').length > 8 && '\n...'}
        </div>
      </div>
    </div>
  );
};

/**
 * Templates Réels de Nicolas Bayonne - Microsoft Account Manager
 * Application personnalisée avec les vrais templates d'emails + Forecast CRM
 * Following Claude Code Complete Development Framework
 */

const TemplateCard = ({ template, selected, onSelect }) => (
  <label
    className={`block p-3 border-2 rounded-xl cursor-pointer transition-all ${
      selected ? `${template.color} text-white border-transparent shadow-lg` : 'border-gray-200 hover:border-gray-300 bg-gray-50'
    }`}
  >
    <input
      type="radio"
      className="sr-only"
      checked={selected}
      onChange={onSelect}
    />
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${selected ? 'bg-white bg-opacity-20' : template.color}`}>
        {template.icon}
      </div>
      <div>
        <h3 className="font-medium">{template.name}</h3>
        <p className="text-xs opacity-75 mt-1">{template.description}</p>
      </div>
    </div>
  </label>
);

const NicolasEmailGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({});
  const [generatedContent, setGeneratedContent] = useState('');
  const [contentKey, setContentKey] = useState(0);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [transcriptInput, setTranscriptInput] = useState('');
  const [showTranscriptBox, setShowTranscriptBox] = useState(false);
  const [favorites, setFavorites] = useState(new Set(['introduction_nouveau_contact', 'forecast_comments_standard']));
  const [recentTemplates, setRecentTemplates] = useState(['introduction_nouveau_contact', 'demande_creneaux']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [aiTone, setAiTone] = useState('professional');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [emailAnalytics, setEmailAnalytics] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showAnalyticsDashboard, setShowAnalyticsDashboard] = useState(false);
  const [emailHistory, setEmailHistory] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalEmails: 0,
    averageEngagement: 0,
    topPerformingTemplates: [],
    recentActivity: []
  });
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showEmailChatbot, setShowEmailChatbot] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [userBehavior, setUserBehavior] = useState({
    hasVisited: false,
    timeOnPage: 0,
    hasInteracted: false,
    emailsCreated: 0,
    hasGeneratedEmail: false,
    hasScheduled: false,
    currentSection: 'general',
    chatbotOpen: false,
    suggestionsVisible: false,
    isTyping: false
  });

  // Track user behavior for contextual help
  useEffect(() => {
    const startTime = Date.now();
    const timer = setInterval(() => {
      setUserBehavior(prev => ({
        ...prev,
        timeOnPage: Date.now() - startTime
      }));
    }, 5000);
    
    // Check if user is new (show onboarding)
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    
    setUserBehavior(prev => ({ ...prev, hasVisited: true }));
    
    return () => clearInterval(timer);
  }, []);
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowSuccessAnimation(true);
  };
  
  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };
  
  // Enhanced chatbot opening with behavior tracking
  const openChatbot = () => {
    setShowEmailChatbot(true);
    setUserBehavior(prev => ({ ...prev, chatbotOpen: true, hasInteracted: true }));
  };

  // Fonction pour utiliser un template directement
  const useTemplate = useCallback((templateContent) => {
    setGeneratedContent(templateContent);
    toast.success('Template utilisé avec succès !');
  }, []);

  // Exposer la fonction globally pour ToneTemplatePreview
  useEffect(() => {
    window.useTemplate = useTemplate;
    return () => {
      delete window.useTemplate;
    };
  }, [useTemplate]);
  const [isMounted, setIsMounted] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Hydration safety - only run on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track template usage for recents
  const addToRecent = useCallback((templateKey) => {
    setRecentTemplates(prev => {
      const filtered = prev.filter(key => key !== templateKey);
      return [templateKey, ...filtered].slice(0, 5);
    });
  }, []);

  // Toggle favorites
  const toggleFavorite = useCallback((templateKey) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateKey)) {
        newFavorites.delete(templateKey);
      } else {
        newFavorites.add(templateKey);
      }
      return newFavorites;
    });
  }, []);

  // Templates authentiques basés sur vos emails + Forecast CRM
  const templates = {
    introduction_nouveau_contact: {
      name: 'Introduction - Nouveau Contact FY2025',
      category: 'Introduction & Premier Contact',
      icon: <UserCheck className="w-5 h-5" />,
      color: 'bg-blue-600',
      description: 'Présentation comme nouveau point de contact Microsoft',
      fields: [
        { key: 'customer_name', label: 'Nom du client', type: 'text', required: true, placeholder: 'Ex: Monsieur Martin' },
        { key: 'partner_name', label: 'Nom du partenaire', type: 'text', required: false, placeholder: 'Ex: IT Solutions France' }
      ],
      subjectOptions: [
        'Optimisation de Votre Expérience Microsoft : Invitation à une Réunion et Retours',
        'Échange Stratégique sur Microsoft : Planification de Réunion et Vos Retours',
        'Améliorons Ensemble Votre Usage de Microsoft : Échange et Feedback'
      ],
      aiCapable: true,
      templates: {
        professional: (data) => {
          const customerName = data.customer_name || 'Monsieur [Nom]';
          const partnerText = data.partner_name ? ` avec votre partenaire : ${data.partner_name}` : '';
          
          return `Objet : Échange Stratégique sur Microsoft : Planification de Réunion et Vos Retours

${customerName},

Je me présente BAYONNE Nicolas et je serai votre nouveau point de contact Microsoft pour l'année fiscale 2025. Je prends le relai sur votre accompagnement et je suis assisté par une équipe de spécialiste qui nous accompagnera sur les enjeux techniques.

Notre approche consiste dans les points suivants :

• Expertise technique avancée dans tous nos piliers (Une équipe dédiée pour vous accompagner selon vos besoins et projets)
• Accompagnement 360 sur M365, Architecture Cloud Azure, Sécurité, visualisation de données, ERP/CRM ainsi que l'intelligence artificielle.
• Workshop par thématique pour atteindre vos objectives pour l'année fiscale 2025.
• Programme de déploiement & de POC.

Je vous propose de planifier une réunion de lancement. Cet appel nous permettra de vous présenter votre équipe Microsoft et de vous assister au mieux sur votre parcours Microsoft${partnerText}.

Je reste à votre disposition pour convenir d'une date et d'une heure qui vous conviendraient.

Dans l'attente de votre retour, je vous souhaite une excellente semaine.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
        },
        friendly: (data) => {
          const customerName = data.customer_name || 'Bertrand';
          const partnerText = data.partner_name ? ` avec votre partenaire : ${data.partner_name}` : '';
          
          return `Objet : 😊 Votre nouveau contact Microsoft 2025 - Rencontrons-nous !

Bonjour ${customerName},

J'espère que vous allez bien ! 😊

Je me présente avec plaisir, Nicolas BAYONNE, et je suis ravi d'être votre nouveau point de contact Microsoft pour cette année fiscale 2025 ! Je prends le relais avec enthousiasme et je suis accompagné d'une super équipe de spécialistes passionnés.

Voici comment nous aimons travailler ensemble :

• Une expertise technique pointue avec des équipes dédiées et bienveillantes
• Un accompagnement complet et personnalisé sur M365, Azure, Sécurité, BI, ERP/CRM et IA
• Des ateliers collaboratifs adaptés à vos objectifs 2025
• Des programmes sur-mesure avec des POCs motivants

Ce serait fantastique si nous pouvions organiser une rencontre de lancement ! Cette conversation nous permettrait de vous présenter votre équipe Microsoft et de vous accompagner avec plaisir${partnerText}.

Je suis là pour vous, n'hésitez pas à me dire quand vous seriez disponible !

En attendant de vous lire, je vous souhaite une excellente semaine ! ✨

Bien à vous,

Nicolas BAYONNE
Microsoft Account Manager`;
        },
        urgent: (data) => {
          const customerName = data.customer_name || 'Bertrand';
          const partnerText = data.partner_name ? ` avec votre partenaire : ${data.partner_name}` : '';
          
          return `Objet : 🚨 URGENT - Nouveau Contact Microsoft FY2025

${customerName},

**PRIORITÉ ÉLEVÉE - NOUVEAU CONTACT MICROSOFT**

Je me présente BAYONNE Nicolas, votre NOUVEAU point de contact Microsoft pour l'année fiscale 2025. Transition IMMÉDIATE en cours avec mon équipe de spécialistes techniques.

**APPROCHE ACCÉLÉRÉE :**

• Expertise technique AVANCÉE - Équipe dédiée PRIORITAIRE
• Accompagnement 360° URGENT sur M365, Azure, Sécurité, BI, ERP/CRM, IA
• Workshops ACCÉLÉRÉS pour objectifs FY2025 CRITIQUES
• Programmes de déploiement & POC RAPIDES

Je vous propose de planifier une réunion de lancement URGENTE. Cet appel CRITIQUE nous permettra de vous présenter votre équipe Microsoft et d'assurer une continuité SANS INTERRUPTION${partnerText}.

Je reste à votre disposition pour convenir d'une date et d'une heure qui vous conviendraient rapidement.

Dans l'attente de votre retour PRIORITAIRE, je vous souhaite une excellente semaine.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
        },
        casual: (data) => {
          const customerName = data.customer_name || 'Bertrand';
          const partnerText = data.partner_name ? ` avec votre partenaire : ${data.partner_name}` : '';
          
          return `Objet : Hey ! Ton nouveau contact Microsoft 2025 👋

Salut ${customerName} !

Comment ça va ? 😎

Alors moi c'est Nicolas BAYONNE, et je vais être ton nouveau point de contact Microsoft pour cette année 2025 ! Je reprends le flambeau et j'ai avec moi une team de pros vraiment sympas pour les aspects techniques.

Voici comment on aime bosser :

• Une expertise technique de ouf (une équipe dédiée juste pour toi !)
• Un accompagnement complet sur M365, Azure, la sécu, la data, ERP/CRM et l'IA
• Des sessions de travail cool pour tes objectifs 2025
• Des programmes et des POCs qui déchirent

Ça te dit qu'on se fasse un call de lancement ? Ce serait cool pour te présenter ta team Microsoft et qu'on puisse t'accompagner au mieux${partnerText}.

Dis-moi quand ça t'arrange et on cale ça !

Allez, bonne semaine ! 🤙

Nicolas BAYONNE  
Microsoft Account Manager`;
        }
      },
      // Backward compatibility - default template points to professional
      template: function(data) { return this.templates.professional(data); }
    },

    introduction_collaboration_partenaire: {
      name: 'Introduction - Collaboration avec Partenaire',
      category: 'Introduction & Premier Contact',
      icon: <Handshake className="w-5 h-5" />,
      color: 'bg-green-600',
      description: 'Présentation avec emphasis sur la collaboration partenaire',
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Monsieur Dupont' },
        { key: 'partner_name', label: 'Nom du partenaire actuel', required: true, placeholder: 'Ex: TechPartner Solutions' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Monsieur [Nom]';
        const partnerName = data.partner_name || '[Partenaire]';
        
        return `Objet : Échange Stratégique sur Microsoft : Planification de Réunion et Vos Retours

Bonjour ${customerName},

J'espère que vous allez bien.

Je me présente BAYONNE Nicolas, votre point de contact chez Microsoft. J'ai été désigné par Microsoft pour travailler avec vous et avec votre partenaire actuel ${partnerName}, pour assurer que vos besoins en matière de technologie et de services soient satisfaits avec l'excellence et l'efficacité que vous attendez de Microsoft. Mon équipe travaille sur les 3 Piliers (Microsoft M365/sécurité, Azure et Dynamics) et je vais être accompagné par des spécialistes techniques pour chaque solution.

Nous sommes impatients de découvrir votre environnement et de comprendre vos enjeux et vos problématiques. Pour cela, nous vous proposons d'organiser une réunion de lancement dès que possible, afin de mieux vous connaitre.

Pouvez-vous nous partager 3 créneaux de disponibilités, s'il vous plaît ? Afin de pouvoir vous envoyer une invitation pour un échange de 30 minutes sur Teams.

Dans l'attente de votre retour, je vous souhaite une excellente journée.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    forecast_comments_standard: {
      name: 'Forecast Comments - Standard',
      category: 'Forecast CRM',
      icon: <Building className="w-5 h-5" />,
      color: 'bg-slate-600',
      description: 'Template de commentaires forecast CRM complet',
      fields: [
        { 
          key: 'current_solutions', 
          label: 'Solutions Microsoft actuelles', 
          type: 'select',
          required: false, 
          options: [
            { value: 'M365-E3', label: 'Microsoft 365 E3' },
            { value: 'M365-E5', label: 'Microsoft 365 E5' },
            { value: 'M365-Business', label: 'Microsoft 365 Business' },
            { value: 'Azure-AD-Premium', label: 'Azure AD Premium' },
            { value: 'Teams-Premium', label: 'Teams Premium' },
            { value: 'Power-Platform', label: 'Power Platform' },
            { value: 'Dynamics-365', label: 'Dynamics 365' },
            { value: 'Azure-Cloud', label: 'Azure Cloud Services' },
            { value: 'Mixed', label: 'Solutions mixtes' }
          ],
          placeholder: 'Sélectionner les solutions actuelles'
        },
        { 
          key: 'customer_type', 
          label: 'Type de client', 
          type: 'radio',
          required: false, 
          options: [
            { value: 'Enterprise', label: 'Enterprise (500+ employés)' },
            { value: 'SMB', label: 'SMB (50-499 employés)' },
            { value: 'SME', label: 'SME (10-49 employés)' },
            { value: 'Startup', label: 'Startup (<10 employés)' }
          ]
        },
        { key: 'stakeholder', label: 'Décideur autorisé', type: 'text', required: false, placeholder: 'Ex: DSI Jean Martin' },
        { 
          key: 'competition', 
          label: 'Concurrence identifiée', 
          type: 'select',
          required: false, 
          options: [
            { value: 'AWS', label: 'Amazon Web Services (AWS)' },
            { value: 'Google-Workspace', label: 'Google Workspace' },
            { value: 'Salesforce', label: 'Salesforce' },
            { value: 'Slack', label: 'Slack Technologies' },
            { value: 'Zoom', label: 'Zoom Communications' },
            { value: 'Atlassian', label: 'Atlassian (Jira, Confluence)' },
            { value: 'Other', label: 'Autre concurrence' },
            { value: 'None', label: 'Pas de concurrence identifiée' }
          ],
          placeholder: 'Sélectionner la concurrence principale'
        },
        { key: 'business_problem', label: 'Problème business client', type: 'textarea', rows: 2, required: false, placeholder: 'Ex: Manque de collaboration moderne, processus inefficaces...' },
        { key: 'technical_problem', label: 'Problème technique client', type: 'textarea', rows: 2, required: false, placeholder: 'Ex: Infrastructure on-premise obsolète, sécurité insuffisante...' },
        { key: 'customer_pain', label: 'Pain point client', type: 'textarea', rows: 2, required: false, placeholder: 'Ex: Coûts de maintenance élevés, manque de scalabilité...' },
        { key: 'recommended_solution', label: 'Solution recommandée', type: 'textarea', rows: 2, required: false, placeholder: 'Ex: Migration M365 + Azure, implémentation Dynamics...' },
        { 
          key: 'timeframe', 
          label: 'Timeline prévue', 
          type: 'select',
          required: false, 
          options: [
            { value: 'Q1-2025', label: 'Q1 2025 (Jan-Mar)' },
            { value: 'Q2-2025', label: 'Q2 2025 (Apr-Jun)' },
            { value: 'Q3-2025', label: 'Q3 2025 (Jul-Sep)' },
            { value: 'Q4-2025', label: 'Q4 2025 (Oct-Dec)' },
            { value: 'H1-2025', label: 'H1 2025 (Jan-Jun)' },
            { value: 'H2-2025', label: 'H2 2025 (Jul-Dec)' },
            { value: '2025', label: 'Courant 2025' },
            { value: '2026', label: 'Début 2026' }
          ],
          placeholder: 'Sélectionner la timeline'
        },
        { key: 'next_meeting', label: 'Prochain RDV', type: 'date', required: false, minDate: new Date().toISOString().split('T')[0] },
        { 
          key: 'budget', 
          label: 'Budget estimé (€)', 
          type: 'number', 
          required: false, 
          placeholder: 'Ex: 150000',
          min: 0,
          step: 1000
        },
        { key: 'risks_blockers', label: 'Risques/Blockers', type: 'textarea', rows: 2, required: false, placeholder: 'Ex: Résistance au changement utilisateurs, contraintes budgétaires...' },
        { key: 'last_action', label: 'Dernière action effectuée', type: 'text', required: false, placeholder: 'Ex: Envoi proposal technique, demo réalisée...' }
      ],
      template: (data) => {
        const formatCurrency = (amount) => {
          if (!amount) return '[À compléter]';
          return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
          }).format(amount);
        };
        
        const formatDate = (dateStr) => {
          if (!dateStr) return '[À compléter]';
          return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        };

        return `***Forecast comments template:***

* **Customer data:**
   * Current Microsoft solutions: ${data.current_solutions || '[À compléter]'}
   * Customer type: ${data.customer_type || '[À compléter]'}
   * Authorized stakeholder: ${data.stakeholder || '[À compléter]'}

* **Competition:** ${data.competition || '[À compléter]'}

* **Discovery (NEED):**
   * Customer business problem: ${data.business_problem || '[À compléter]'}
   * Customer technical problem: ${data.technical_problem || '[À compléter]'}
   * Customer Pain: ${data.customer_pain || '[À compléter]'}

* **Recommended Solution:** ${data.recommended_solution || '[À compléter]'}

* **Next Steps**
   * **Timeframe:** ${data.timeframe || '[À compléter]'}
   * **Next follow up/meeting (who & when):** ${data.next_meeting ? formatDate(data.next_meeting) : '[À compléter]'}

* **Budget:** ${formatCurrency(data.budget)}

* **Visibility on Risk/Blockers:** ${data.risks_blockers || '[À compléter]'}

* **Last action:** ${data.last_action || '[À compléter]'}`;
      }
    },

    forecast_partner_version: {
      name: 'Forecast - Version Partenaire',
      category: 'Forecast CRM',
      icon: <Handshake className="w-5 h-5" />,
      color: 'bg-emerald-600',
      description: 'Template forecast pour communication partenaire (V-x@microsoft.com)',
      fields: [
        { key: 'current_solutions', label: 'Solutions Microsoft actuelles', required: false, placeholder: 'Ex: M365 E3, Azure AD Premium' },
        { key: 'industry', label: 'Secteur d\'activité', required: false, placeholder: 'Ex: Manufacturing, Finance' },
        { key: 'stakeholder', label: 'Décideur autorisé', required: false, placeholder: 'Ex: CTO Marie Dubois' },
        { key: 'competition', label: 'Concurrence', required: false, placeholder: 'Ex: AWS, Google Cloud' },
        { key: 'business_problem', label: 'Problème business client', required: false, placeholder: 'Ex: Transformation digitale' },
        { key: 'technical_problem', label: 'Problème technique client', required: false, placeholder: 'Ex: Legacy systems' },
        { key: 'recommended_solution', label: 'Solution recommandée', required: false, placeholder: 'Ex: Azure migration + M365' },
        { key: 'budget', label: 'Budget', required: false, placeholder: 'Ex: 200k€' },
        { key: 'timeframe', label: 'Timeline', required: false, placeholder: 'Ex: Q2 2025' },
        { key: 'help_wanted', label: 'Aide demandée au partenaire', required: false, placeholder: 'Ex: Support technique migration' }
      ],
      template: (data) => {
        return `***V-x@microsoft.com***

* **Customer data:**
   * Current Microsoft solutions: ${data.current_solutions || '[À compléter]'}
   * Industry: ${data.industry || '[À compléter]'}
   * Authorized stakeholder: ${data.stakeholder || '[À compléter]'}

* **Competition:** ${data.competition || '[À compléter]'}

* **Discovery (NEED):**
   * Customer business problem: ${data.business_problem || '[À compléter]'}
   * Customer technical problem: ${data.technical_problem || '[À compléter]'}

* **Recommended Solution:** ${data.recommended_solution || '[À compléter]'}

* **Budget:** ${data.budget || '[À compléter]'}

* **Timeframe:** ${data.timeframe || '[À compléter]'}

* **Help wanted from the partner:** ${data.help_wanted || '[À compléter]'}`;
      }
    },

    forecast_copilot_summary: {
      name: 'Copilot Summary - Forecast',
      category: 'Forecast CRM',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-violet-600',
      description: 'Template organisé pour résumé Copilot du forecast',
      fields: [
        { key: 'customer_company', label: 'Entreprise client', required: false, placeholder: 'Ex: TechCorp France' },
        { key: 'current_solutions', label: 'Solutions actuelles', required: false, placeholder: 'Ex: M365 E3' },
        { key: 'industry', label: 'Secteur', required: false, placeholder: 'Ex: Manufacturing' },
        { key: 'stakeholder', label: 'Décideur', required: false, placeholder: 'Ex: DSI Jean Martin' },
        { key: 'main_need', label: 'Besoin principal', required: false, placeholder: 'Ex: Modernisation IT' },
        { key: 'solution', label: 'Solution proposée', required: false, placeholder: 'Ex: Azure + M365 upgrade' },
        { key: 'budget_timeline', label: 'Budget & Timeline', required: false, placeholder: 'Ex: 150k€ - Q1 2025' },
        { key: 'next_action', label: 'Prochaine action', required: false, placeholder: 'Ex: Demo technique prévue' },
        { key: 'risk_level', label: 'Niveau de risque', required: false, placeholder: 'Ex: Faible, Moyen, Élevé' }
      ],
      template: (data) => {
        return `**Copilot Summary:**

**Client:** ${data.customer_company || '[Entreprise]'}
**Secteur:** ${data.industry || '[Secteur]'}
**Solutions actuelles:** ${data.current_solutions || '[Solutions]'}

**Décideur principal:** ${data.stakeholder || '[Décideur]'}

**Enjeu business:** ${data.main_need || '[Besoin principal]'}

**Solution recommandée:** ${data.solution || '[Solution proposée]'}

**Budget & Timeline:** ${data.budget_timeline || '[Budget - Timeline]'}

**Prochaine étape:** ${data.next_action || '[Action suivante]'}

**Niveau de risque:** ${data.risk_level || '[Risque]'}`;
      }
    },

    demande_creneaux: {
      name: 'Demande de Créneaux - Simple',
      category: 'Rendez-vous & Planning',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-orange-600',
      description: 'Demande rapide de disponibilités client',
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Monsieur Garcia' },
        { key: 'meeting_purpose', label: 'Objet de la réunion', required: false, placeholder: 'Ex: point d\'avancement projet Azure' },
        { key: 'duration', label: 'Durée souhaitée', required: false, placeholder: 'Ex: 45 minutes' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Monsieur [Nom]';
        const meetingPurpose = data.meeting_purpose || 'échange de lancement';
        const duration = data.duration || '30 minutes';
        
        return `Objet : Planification Réunion Microsoft - Demande de Créneaux

Bonjour ${customerName},

J'espère que vous allez bien.

Afin d'organiser notre ${meetingPurpose}, pourriez-vous me communiquer 3 créneaux de disponibilités qui vous conviendraient ?

Je vous enverrai ensuite une invitation Teams pour un échange de ${duration}.

Dans l'attente de votre retour, je vous souhaite une excellente journée.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    suivi_meeting: {
      name: 'Suivi Post-Réunion',
      category: 'Suivi & Relations Client',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-purple-600',
      description: 'Email de suivi après une réunion client',
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Monsieur Dubois' },
        { key: 'meeting_date', label: 'Date de la réunion', required: false, placeholder: 'Ex: hier' },
        { key: 'key_topics', label: 'Sujets principaux abordés', required: false, placeholder: 'Ex: migration Azure, sécurité M365' },
        { key: 'next_actions', label: 'Prochaines actions convenues', required: false, placeholder: 'Ex: envoi documentation technique, devis personnalisé' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Monsieur [Nom]';
        const meetingDate = data.meeting_date || 'lors de notre dernière réunion';
        const keyTopicsText = data.key_topics ? `Comme nous en avons discuté, les points principaux concernent : ${data.key_topics}.` : '';
        const nextActionsText = data.next_actions ? `Comme convenu, voici les prochaines étapes : ${data.next_actions}.` : 'Je reviens vers vous rapidement avec les éléments techniques et commerciaux que nous avons évoqués.';
        
        return `Objet : Suivi de notre échange Microsoft - Prochaines étapes

Bonjour ${customerName},

J'espère que vous allez bien.

Je vous remercie pour le temps que vous nous avez accordé ${meetingDate}. Nos échanges ont été très enrichissants et nous ont permis de mieux comprendre vos enjeux et vos problématiques.

${keyTopicsText}

${nextActionsText}

Mon équipe de spécialistes techniques et moi-même restons à votre disposition pour tout complément d'information ou clarification.

Dans l'attente de nos prochains échanges, je vous souhaite une excellente journée.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    relance_polie: {
      name: 'Relance Polie',
      category: 'Suivi & Relations Client',
      icon: <Clock className="w-5 h-5" />,
      color: 'bg-yellow-600',
      description: 'Relance courtoise pour obtenir une réponse',
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Monsieur Martin' },
        { key: 'previous_subject', label: 'Sujet du précédent échange', required: false, placeholder: 'Ex: planification réunion de lancement' },
        { key: 'timeframe', label: 'Délai mentionné', required: false, placeholder: 'Ex: cette semaine' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Monsieur [Nom]';
        const previousSubject = data.previous_subject || 'notre précédent échange';
        const timeframeText = data.timeframe ? `, pour lequel nous avions évoqué un retour ${data.timeframe}` : '';
        
        return `Objet : Suivi de notre échange Microsoft - Votre retour

Bonjour ${customerName},

J'espère que vous allez bien.

Je me permets de revenir vers vous concernant ${previousSubject}${timeframeText}.

Je comprends que vous puissiez être très sollicité, et je reste à votre disposition pour adapter notre approche selon vos disponibilités.

N'hésitez pas à me faire savoir si vous souhaitez reporter notre échange ou si vous avez besoin de précisions complémentaires.

Dans l'attente de votre retour, je vous souhaite une excellente journée.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    // === SOLUTIONS & PROPOSITIONS COMMERCIALES ===
    proposition_azure_migration: {
      name: 'Proposition Azure Migration',
      category: 'Solutions & Propositions Commerciales',
      icon: <Monitor className="w-5 h-5" />,
      color: 'bg-blue-700',
      description: 'Proposition de migration vers Microsoft Azure',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Nom du client', type: 'text', required: true, placeholder: 'Ex: Monsieur Martin' },
        { key: 'company_name', label: 'Entreprise', type: 'text', required: true, placeholder: 'Ex: TechCorp France' },
        { 
          key: 'current_infrastructure', 
          label: 'Infrastructure actuelle', 
          type: 'select',
          required: false, 
          options: [
            { value: 'Serveurs-Physical', label: 'Serveurs physiques on-premise' },
            { value: 'VMware-vSphere', label: 'Environnement VMware vSphere' },
            { value: 'Hyper-V', label: 'Microsoft Hyper-V' },
            { value: 'Mixed-Virtual', label: 'Infrastructure virtualisée mixte' },
            { value: 'Legacy-Systems', label: 'Systèmes legacy' },
            { value: 'Hybrid-Cloud', label: 'Infrastructure hybride existante' },
            { value: 'Other', label: 'Autre infrastructure' }
          ],
          placeholder: 'Sélectionner l\'infrastructure actuelle'
        },
        { 
          key: 'migration_scope', 
          label: 'Périmètre de migration', 
          type: 'checkbox',
          required: false, 
          description: 'Sélectionner si migration complète souhaitée'
        },
        { 
          key: 'business_benefits', 
          label: 'Bénéfices attendus', 
          type: 'select',
          required: false, 
          options: [
            { value: 'Cost-Reduction', label: 'Réduction des coûts opérationnels' },
            { value: 'Scalability', label: 'Amélioration de la scalabilité' },
            { value: 'Performance', label: 'Optimisation des performances' },
            { value: 'Security', label: 'Renforcement de la sécurité' },
            { value: 'Flexibility', label: 'Flexibilité et agilité' },
            { value: 'Disaster-Recovery', label: 'Plan de continuité amélioré' },
            { value: 'Innovation', label: 'Accès aux dernières innovations' }
          ],
          placeholder: 'Sélectionner le bénéfice principal'
        },
        { 
          key: 'timeline', 
          label: 'Timeline proposée', 
          type: 'select',
          required: false, 
          options: [
            { value: '3-months', label: '3 mois (migration express)' },
            { value: '6-months', label: '6 mois (standard)' },
            { value: '9-months', label: '9 mois (complexe)' },
            { value: '12-months', label: '12 mois (très complexe)' },
            { value: 'Q1-2025', label: 'T1 2025' },
            { value: 'Q2-2025', label: 'T2 2025' },
            { value: 'H2-2025', label: '2ème semestre 2025' }
          ],
          placeholder: 'Sélectionner la timeline'
        },
        { key: 'workshop_date', label: 'Date workshop technique', type: 'date', required: false, minDate: new Date().toISOString().split('T')[0] }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Monsieur [Nom]';
        const companyName = data.company_name || '[Entreprise]';
        const currentInfra = data.current_infrastructure ? `Concernant votre infrastructure ${data.current_infrastructure}, ` : '';
        const scope = data.migration_scope || 'vos systèmes';
        const benefits = data.business_benefits || 'une réduction des coûts opérationnels et une meilleure scalabilité';
        const timeline = data.timeline || 'un délai optimal selon vos contraintes';
        
        return `Objet : Proposition Azure Migration - Modernisation IT ${companyName}

Bonjour ${customerName},

Suite à nos discussions concernant la modernisation de votre infrastructure IT, je vous présente une proposition détaillée pour la migration de ${scope} vers Microsoft Azure.

${currentInfra}cette migration vous permettrait d'obtenir ${benefits}.

**Proposition de migration Azure:**
• Assessment complet de votre infrastructure actuelle
• Planification détaillée de la migration par phases
• Migration sécurisée avec zéro downtime
• Optimisation des coûts et des performances
• Formation de vos équipes
• Support post-migration 24/7

**Timeline proposée:** ${timeline}

Je serais ravi de programmer un workshop technique avec nos spécialistes Azure pour approfondir cette proposition et répondre à toutes vos questions.

Êtes-vous disponible cette semaine pour un échange de 45 minutes sur ce sujet ?

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    upsell_m365_premium: {
      name: 'Upsell M365 Premium',
      category: 'Solutions & Propositions Commerciales',
      icon: <ArrowRight className="w-5 h-5" />,
      color: 'bg-orange-600',
      description: 'Proposition d\'upgrade vers Microsoft 365 Premium',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Monsieur Dupont' },
        { key: 'current_license', label: 'Licence actuelle', required: false, placeholder: 'Ex: M365 Business Standard' },
        { key: 'users_count', label: 'Nombre d\'utilisateurs', required: false, placeholder: 'Ex: 150 utilisateurs' },
        { key: 'pain_points', label: 'Points de douleur identifiés', required: false, placeholder: 'Ex: Sécurité, collaboration' },
        { key: 'premium_features', label: 'Fonctionnalités Premium ciblées', required: false, placeholder: 'Ex: Teams Premium, Purview' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Monsieur [Nom]';
        const currentLicense = data.current_license || 'votre licence M365 actuelle';
        const usersCount = data.users_count || 'vos utilisateurs';
        const painPoints = data.pain_points || 'les enjeux de productivité et sécurité';
        const premiumFeatures = data.premium_features || 'des fonctionnalités avancées';
        
        return `Objet : Optimisation M365 - Fonctionnalités Premium pour ${usersCount}

Bonjour ${customerName},

J'espère que vous tirez pleinement parti de ${currentLicense}. Ayant analysé vos besoins concernant ${painPoints}, je souhaite vous présenter les bénéfices d'un upgrade vers Microsoft 365 Premium.

**Fonctionnalités Premium qui répondront à vos enjeux:**
• Teams Premium - Webinaires avancés et intelligence artificielle
• Microsoft Purview - Gouvernance et protection des données
• Advanced Threat Protection - Sécurité renforcée
• Power Platform Premium - Automatisation avancée
• Copilot for Microsoft 365 - Assistant IA intégré

Cette évolution vous permettrait d'accéder à ${premiumFeatures} tout en optimisant votre investissement Microsoft.

**ROI estimé:** Amélioration productivité de 20% et réduction des risques sécurité

Je vous propose de planifier une démonstration personnalisée de 30 minutes pour vous montrer concrètement ces fonctionnalités sur vos cas d'usage.

Quand seriez-vous disponible cette semaine ?

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    presentation_copilot: {
      name: 'Présentation Copilot for M365',
      category: 'Solutions & Propositions Commerciales',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-purple-700',
      description: 'Introduction et démonstration de Copilot',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Madame Rousseau' },
        { key: 'company_name', label: 'Entreprise', required: true, placeholder: 'Ex: InnovateTech' },
        { key: 'user_scenarios', label: 'Scénarios d\'usage identifiés', required: false, placeholder: 'Ex: Rédaction, analyse données, présentations' },
        { key: 'productivity_challenges', label: 'Défis productivité', required: false, placeholder: 'Ex: Temps passé sur tâches répétitives' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Madame/Monsieur [Nom]';
        const companyName = data.company_name || '[Entreprise]';
        const scenarios = data.user_scenarios || 'la rédaction, l\'analyse de données et la création de présentations';
        const challenges = data.productivity_challenges || 'l\'optimisation du temps de travail';
        
        return `Objet : Révolutionnez votre productivité avec Copilot for Microsoft 365

Bonjour ${customerName},

L'intelligence artificielle transforme la façon de travailler. Chez ${companyName}, je suis convaincu que Copilot for Microsoft 365 peut révolutionner votre productivité quotidienne.

**Copilot for Microsoft 365 - L'IA intégrée à vos outils:**
• **Word:** Rédaction assistée, résumés automatiques
• **Excel:** Analyse de données en langage naturel
• **PowerPoint:** Création de présentations en quelques clics
• **Outlook:** Gestion intelligente des emails
• **Teams:** Résumés de réunions et actions automatiques

Pour vos équipes, cela signifie concrètement :
• Gain de temps sur ${scenarios}
• Amélioration de la qualité du travail
• Focus sur les tâches à forte valeur ajoutée
• Solution pour ${challenges}

**ROI moyen constaté chez nos clients : +25% de productivité**

Je vous propose une démonstration personnalisée de 45 minutes avec des cas d'usage spécifiques à votre secteur.

Seriez-vous disponible pour une démonstration cette semaine ? Je peux me déplacer ou organiser une session Teams.

Au plaisir de vous faire découvrir l'avenir du travail !

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    // === ÉVÉNEMENTS & WORKSHOPS ===
    invitation_workshop: {
      name: 'Invitation Workshop Microsoft',
      category: 'Événements & Workshops',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-green-700',
      description: 'Invitation à un workshop technique Microsoft',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Monsieur Bernard' },
        { key: 'workshop_topic', label: 'Sujet du workshop', required: true, placeholder: 'Ex: Azure AI et Machine Learning' },
        { key: 'workshop_date', label: 'Date du workshop', required: true, placeholder: 'Ex: 15 mars 2025' },
        { key: 'workshop_duration', label: 'Durée', required: false, placeholder: 'Ex: Demi-journée (9h-12h)' },
        { key: 'target_audience', label: 'Public cible', required: false, placeholder: 'Ex: DSI, Architectes, Développeurs' },
        { key: 'location', label: 'Lieu', required: false, placeholder: 'Ex: Microsoft France, Teams' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Madame/Monsieur [Nom]';
        const topic = data.workshop_topic || '[Sujet Workshop]';
        const date = data.workshop_date || '[Date]';
        const duration = data.workshop_duration || 'une demi-journée';
        const audience = data.target_audience || 'vos équipes techniques';
        const location = data.location || 'nos locaux ou en visioconférence';
        
        return `Objet : Invitation Workshop "${topic}" - ${date}

Bonjour ${customerName},

J'ai le plaisir de vous inviter à notre workshop technique exclusif sur le thème "${topic}".

📅 **Détails de l'événement:**
• **Date :** ${date}
• **Durée :** ${duration}
• **Lieu :** ${location}
• **Public :** ${audience}

🎯 **Programme du workshop:**
• Présentation des dernières innovations Microsoft
• Démonstrations techniques en live
• Cas d'usage concrets et retours d'expérience
• Session hands-on avec nos experts
• Q&A avec l'équipe technique Microsoft

👥 **Intervenants:**
• Architects Microsoft spécialisés
• Product Managers
• Customer Success Managers

**Cet événement est gratuit** et limité à 20 participants pour garantir la qualité des échanges.

🚀 **Ce que vous repartirez avec:**
• Documentation technique complète
• Templates et outils pratiques
• Accès à notre communauté d'experts
• Roadmap personnalisée pour votre organisation

Pour confirmer votre participation, merci de me faire savoir :
1. Combien de personnes de votre équipe souhaitent participer ?
2. Y a-t-il des sujets spécifiques que vous aimeriez approfondir ?

Les places étant limitées, je vous encourage à réserver rapidement.

Au plaisir de vous accueillir lors de cet événement !

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    // === RENOUVELLEMENT & NÉGOCIATION ===
    rappel_renouvellement: {
      name: 'Rappel Renouvellement Licence',
      category: 'Renouvellement & Négociation',
      icon: <RefreshCw className="w-5 h-5" />,
      color: 'bg-blue-800',
      description: 'Rappel pour le renouvellement des licences',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Madame Vincent' },
        { key: 'company_name', label: 'Entreprise', required: true, placeholder: 'Ex: ModernTech Solutions' },
        { key: 'license_type', label: 'Type de licence', required: true, placeholder: 'Ex: Microsoft 365 E3' },
        { key: 'expiration_date', label: 'Date d\'expiration', required: true, placeholder: 'Ex: 31 mars 2025' },
        { key: 'users_count', label: 'Nombre d\'utilisateurs', required: false, placeholder: 'Ex: 85 utilisateurs' },
        { key: 'optimization_opportunities', label: 'Opportunités d\'optimisation', required: false, placeholder: 'Ex: Migration E5, ajout Copilot' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Madame/Monsieur [Nom]';
        const companyName = data.company_name || '[Entreprise]';
        const licenseType = data.license_type || '[Type de licence]';
        const expirationDate = data.expiration_date || '[Date d\'expiration]';
        const usersCount = data.users_count ? ` pour ${data.users_count}` : '';
        const optimizations = data.optimization_opportunities || 'des opportunités d\'optimisation de votre investissement Microsoft';
        
        return `Objet : Renouvellement ${licenseType} ${companyName} - Échéance ${expirationDate}

Bonjour ${customerName},

J'espère que vous tirez pleinement parti de vos solutions Microsoft. Je me permets de vous contacter concernant le renouvellement de votre licence ${licenseType}${usersCount}, qui arrive à échéance le ${expirationDate}.

📅 **Échéancier de renouvellement :**
• **Date d'expiration :** ${expirationDate}
• **Délai recommandé :** 30 jours avant expiration
• **Status actuel :** Renouvellement à planifier

💡 **Optimisations disponibles pour 2025 :**
• Analyse de votre usage actuel
• ${optimizations}
• Négociation des tarifs préférentiels
• Consolidation et rationalisation des licences

🎯 **Bénéfices du renouvellement anticipé :**
• Continuité de service garantie
• Tarifs préférentiels early-bird
• Accès aux dernières fonctionnalités
• Support technique prioritaire
• Flexibilité sur les termes contractuels

**Proposition de planning :**
1. **Cette semaine :** Audit de votre utilisation actuelle
2. **Semaine prochaine :** Présentation des optimisations possibles
3. **Dans 15 jours :** Finalisation de la proposition commerciale
4. **Avant fin du mois :** Signature du renouvellement

Cette approche nous permettra d'anticiper sereinement votre renouvellement tout en optimisant votre investissement.

Seriez-vous disponible cette semaine pour un point de 30 minutes sur votre renouvellement ?

Je reste à votre entière disposition pour préparer au mieux cette échéance.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    // === GESTION DE PROBLÈMES & SUPPORT ===
    escalade_support: {
      name: 'Escalade Support Technique',
      category: 'Gestion de Problèmes & Support',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'bg-red-600',
      description: 'Escalade d\'un problème technique vers le support',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Monsieur Lefevre' },
        { key: 'company_name', label: 'Entreprise', required: true, placeholder: 'Ex: InnovateTech' },
        { key: 'incident_description', label: 'Description du problème', required: true, placeholder: 'Ex: Problème authentification Azure AD' },
        { key: 'impact_level', label: 'Impact business', required: true, placeholder: 'Ex: Critique - 200 utilisateurs bloqués' },
        { key: 'ticket_number', label: 'Numéro de ticket', required: false, placeholder: 'Ex: INC-2025-001234' },
        { key: 'urgency_level', label: 'Niveau d\'urgence', required: true, placeholder: 'Ex: P1 - Critique, P2 - Élevé, P3 - Moyen' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Monsieur/Madame [Nom]';
        const companyName = data.company_name || '[Entreprise]';
        const incidentDesc = data.incident_description || '[Description du problème]';
        const impactLevel = data.impact_level || '[Impact business]';
        const ticketNumber = data.ticket_number ? ` (Ticket: ${data.ticket_number})` : '';
        const urgencyLevel = data.urgency_level || '[Niveau d\'urgence]';
        
        return `Objet : ESCALADE SUPPORT ${urgencyLevel} - ${companyName}${ticketNumber}

Bonjour ${customerName},

Suite à notre échange téléphonique de ce jour, je prends en charge personnellement l'escalade de votre problème technique.

🚨 **Résumé de l'incident :**
• **Problème :** ${incidentDesc}
• **Impact :** ${impactLevel}
• **Urgence :** ${urgencyLevel}
• **Client :** ${companyName}${ticketNumber}

⚡ **Actions immédiates engagées :**
• Escalade vers l'équipe de support de niveau 3
• Attribution d'un ingénieur spécialisé dédié
• Suivi en temps réel avec notre équipe technique
• Communication régulière jusqu'à résolution

📞 **Contacts d'urgence activés :**
• **Support technique direct :** +33 1 XX XX XX XX
• **Escalation Manager :** [Nom] - [Email]
• **Mon numéro direct :** [Votre numéro]

🎯 **Engagement de service :**
• **Première analyse :** Dans les 2 heures
• **Point de situation :** Toutes les 4 heures
• **Résolution cible :** Selon SLA ${urgencyLevel}
• **Communication :** Email + appel si nécessaire

Je reste personnellement mobilisé sur ce dossier et vous tiendrai informé de chaque avancée.

N'hésitez pas à me contacter directement pour tout complément d'information.

Nous mettons tout en œuvre pour résoudre cette situation dans les meilleurs délais.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    resolution_incident: {
      name: 'Résolution d\'Incident',
      category: 'Gestion de Problèmes & Support',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-green-600',
      description: 'Confirmation de résolution d\'un incident technique',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Madame Dubois' },
        { key: 'company_name', label: 'Entreprise', required: true, placeholder: 'Ex: SecureTech Solutions' },
        { key: 'incident_summary', label: 'Résumé de l\'incident', required: true, placeholder: 'Ex: Panne Azure AD bloquant l\'accès M365' },
        { key: 'resolution_details', label: 'Détails de la résolution', required: true, placeholder: 'Ex: Reconfiguration des paramètres SSO' },
        { key: 'resolution_time', label: 'Temps de résolution', required: false, placeholder: 'Ex: 4 heures' },
        { key: 'preventive_measures', label: 'Mesures préventives', required: false, placeholder: 'Ex: Monitoring renforcé, documentation mise à jour' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Madame/Monsieur [Nom]';
        const companyName = data.company_name || '[Entreprise]';
        const incidentSummary = data.incident_summary || '[Résumé de l\'incident]';
        const resolutionDetails = data.resolution_details || '[Détails de la résolution]';
        const resolutionTime = data.resolution_time ? ` en ${data.resolution_time}` : '';
        const preventiveMeasures = data.preventive_measures || 'une revue complète de vos configurations pour éviter tout incident similaire';
        
        return `Objet : ✅ RÉSOLU - Incident technique ${companyName} - Retour à la normale

Bonjour ${customerName},

J'ai le plaisir de vous confirmer la résolution complète de l'incident technique qui affectait ${companyName}.

✅ **Résolution confirmée :**
• **Problème :** ${incidentSummary}
• **Solution appliquée :** ${resolutionDetails}
• **Temps de résolution :**${resolutionTime}
• **Status :** ✅ Complètement résolu

🔍 **Actions de résolution effectuées :**
• Diagnostic complet de la cause racine
• Application des correctifs nécessaires
• Tests de fonctionnement sur l'ensemble du périmètre
• Validation du retour à la normale avec nos équipes techniques

🛡️ **Mesures préventives mises en place :**
• ${preventiveMeasures}
• Renforcement de la surveillance proactive
• Documentation des procédures de résolution
• Plan de contingence mis à jour

📊 **Bilan de l'intervention :**
• **Cause identifiée :** Résolue définitivement
• **Impact évalué :** Maîtrisé et corrigé
• **Qualité de service :** Restaurée à 100%
• **Leçons apprises :** Intégrées dans nos processus

🎯 **Suivi post-résolution :**
• Monitoring renforcé pendant 48h
• Point de contrôle dans une semaine
• Disponibilité totale de l'équipe support si besoin
• Retour d'expérience programmé si souhaité

Nous restons vigilants et à votre disposition pour tout complément d'information ou nouvelle demande.

Merci pour votre patience et votre collaboration durant cette intervention.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    geste_commercial: {
      name: 'Geste Commercial Suite Incident',
      category: 'Gestion de Problèmes & Support',
      icon: <Gift className="w-5 h-5" />,
      color: 'bg-purple-600',
      description: 'Proposition de geste commercial après un incident',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Nom du client', required: true, placeholder: 'Ex: Monsieur Rodriguez' },
        { key: 'company_name', label: 'Entreprise', required: true, placeholder: 'Ex: BusinessFlow Corp' },
        { key: 'incident_impact', label: 'Impact de l\'incident', required: true, placeholder: 'Ex: Indisponibilité 6h, 150 utilisateurs impactés' },
        { key: 'commercial_gesture', label: 'Geste proposé', required: true, placeholder: 'Ex: Crédit de 15% sur prochaine facture' },
        { key: 'additional_benefits', label: 'Avantages additionnels', required: false, placeholder: 'Ex: Formation gratuite, support premium 3 mois' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Monsieur/Madame [Nom]';
        const companyName = data.company_name || '[Entreprise]';
        const incidentImpact = data.incident_impact || '[Impact de l\'incident]';
        const commercialGesture = data.commercial_gesture || '[Geste commercial proposé]';
        const additionalBenefits = data.additional_benefits || 'un suivi renforcé de nos équipes support';
        
        return `Objet : Geste Commercial Microsoft - Suite à l'incident technique ${companyName}

Bonjour ${customerName},

Suite à l'incident technique récent qui a affecté vos services (${incidentImpact}), je tenais à vous présenter personnellement nos excuses pour les désagréments occasionnés.

Bien que la situation soit désormais totalement résolue, nous souhaitons témoigner de notre engagement envers ${companyName} par un geste commercial adapté.

🎁 **Geste commercial Microsoft :**
• **Compensation principale :** ${commercialGesture}
• **Bénéfices additionnels :** ${additionalBenefits}
• **Support prioritaire :** Accès direct à nos équipes expertes
• **Monitoring renforcé :** Surveillance proactive pendant 3 mois

💡 **Valeur ajoutée pour ${companyName} :**
• Renforcement de la relation de confiance
• Amélioration continue de notre qualité de service
• Investissement dans votre réussite digitale
• Engagement long terme de Microsoft

🤝 **Notre commitment :**
Cette situation nous a permis d'identifier des axes d'amélioration que nous mettons immédiatement en œuvre :
• Processus de monitoring enrichi
• Procédures d'escalation optimisées
• Formation complémentaire des équipes
• Communication proactive renforcée

📅 **Mise en œuvre :**
• **Immédiat :** Application du geste commercial
• **Cette semaine :** Activation des bénéfices additionnels
• **Suivi mensuel :** Points réguliers sur la qualité de service
• **Évaluation trimestrielle :** Bilan de satisfaction

Nous savons que la confiance se gagne au quotidien et nous sommes déterminés à faire de cette expérience malheureuse une opportunité de renforcer notre partenariat.

Je reste personnellement à votre disposition pour discuter de ce geste commercial et de toute autre préoccupation.

Merci pour votre compréhension et votre fidélité.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    // === SUCCÈS CLIENT & TÉMOIGNAGES ===
    demande_testimonial: {
      name: 'Demande de Témoignage Client',
      category: 'Succès Client & Témoignages',
      icon: <Star className="w-5 h-5" />,
      color: 'bg-yellow-500',
      description: 'Demande de témoignage après un succès projet',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Nom du contact', required: true, placeholder: 'Ex: Madame Thompson' },
        { key: 'company_name', label: 'Entreprise', required: true, placeholder: 'Ex: InnovateNow Ltd' },
        { key: 'project_success', label: 'Succès du projet', required: true, placeholder: 'Ex: Migration Azure réussie, 40% coûts en moins' },
        { key: 'key_benefits', label: 'Bénéfices clés obtenus', required: true, placeholder: 'Ex: Performance améliorée, sécurité renforcée' },
        { key: 'testimonial_use', label: 'Usage du témoignage', required: false, placeholder: 'Ex: Case study, présentation prospects' },
        { key: 'timeline_project', label: 'Durée du projet', required: false, placeholder: 'Ex: 4 mois' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Madame/Monsieur [Nom]';
        const companyName = data.company_name || '[Entreprise]';
        const projectSuccess = data.project_success || '[Succès du projet]';
        const keyBenefits = data.key_benefits || '[Bénéfices clés obtenus]';
        const testimonialUse = data.testimonial_use || 'nos présentations et case studies';
        const timelineProject = data.timeline_project ? ` en ${data.timeline_project}` : '';
        
        return `Objet : Témoignage Client Microsoft - Partage de votre success story ${companyName}

Bonjour ${customerName},

J'espère que vous continuez à tirer pleinement parti des solutions Microsoft déployées chez ${companyName}.

Le succès de votre projet (${projectSuccess}${timelineProject}) constitue un excellent exemple de transformation digitale réussie, et je serais ravi de pouvoir valoriser cette réussite.

🏆 **Votre success story en bref :**
• **Réalisation :** ${projectSuccess}
• **Bénéfices obtenus :** ${keyBenefits}
• **Impact transformation :** Visible et mesurable
• **Retour sur investissement :** Démontré

💫 **Opportunité de témoignage :**
Votre expérience pourrait inspirer d'autres organisations dans leur transformation digitale. Accepteriez-vous de partager votre retour d'expérience sous forme de témoignage ?

📝 **Format proposé (au choix) :**
• **Témoignage écrit :** Quelques paragraphes sur votre expérience
• **Interview courte :** 15 minutes d'échange enregistré
• **Case study détaillé :** Analyse complète avec métriques
• **Participation événement :** Présentation lors d'un webinaire Microsoft

🎯 **Utilisation prévue :**
• ${testimonialUse}
• Communications Microsoft (avec votre validation préalable)
• Inspiration pour d'autres clients dans votre secteur
• Valorisation de votre expertise et innovation

✨ **Avantages pour ${companyName} :**
• Reconnaissance de votre leadership digital
• Visibilité auprès de l'écosystème Microsoft
• Networking avec d'autres innovateurs
• Positionnement comme référence secteur

🤝 **Process simple et respectueux :**
1. **Échange préalable :** Discussion sur le format souhaité
2. **Rédaction collaborative :** Vous gardez le contrôle total
3. **Validation finale :** Votre approbation avant toute diffusion
4. **Usage ciblé :** Respect de vos souhaits d'utilisation

Aucune obligation bien sûr ! Si cette opportunité vous intéresse, nous pourrions en discuter lors d'un bref échange téléphonique.

Seriez-vous disponible cette semaine pour en parler ?

Merci d'avance pour votre considération.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    success_story: {
      name: 'Présentation Success Story',
      category: 'Succès Client & Témoignages',
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-gold-600',
      description: 'Présentation d\'une success story client',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Contact destinataire', required: true, placeholder: 'Ex: Monsieur Chen' },
        { key: 'reference_company', label: 'Entreprise de référence', required: true, placeholder: 'Ex: TechLeader Corp' },
        { key: 'sector', label: 'Secteur d\'activité', required: true, placeholder: 'Ex: Manufacturing, Healthcare' },
        { key: 'challenge_solved', label: 'Défi résolu', required: true, placeholder: 'Ex: Modernisation infrastructure IT' },
        { key: 'results_achieved', label: 'Résultats obtenus', required: true, placeholder: 'Ex: 50% réduction coûts, 99.9% uptime' },
        { key: 'similar_context', label: 'Contexte similaire', required: false, placeholder: 'Ex: Même taille entreprise, même secteur' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Monsieur/Madame [Nom]';
        const referenceCompany = data.reference_company || '[Entreprise de référence]';
        const sector = data.sector || '[Secteur]';
        const challengeSolved = data.challenge_solved || '[Défi résolu]';
        const resultsAchieved = data.results_achieved || '[Résultats obtenus]';
        const similarContext = data.similar_context || 'un contexte d\'entreprise similaire au vôtre';
        
        return `Objet : Success Story Microsoft - Comment ${referenceCompany} a transformé son IT

Bonjour ${customerName},

Suite à nos échanges sur vos projets de transformation digitale, je tenais à partager avec vous une success story particulièrement inspirante dans le secteur ${sector}.

🏆 **Case Study : ${referenceCompany}**

**Le défi :**
${referenceCompany} faisait face au même défi que beaucoup d'entreprises : ${challengeSolved}.

**La solution Microsoft :**
• Architecture Azure moderne et évolutive
• Migration progressive et sécurisée
• Accompagnement par nos équipes expertes
• Formation des équipes internes
• Support continu post-déploiement

📈 **Résultats impressionnants :**
• ${resultsAchieved}
• Amélioration significative de la productivité
• Sécurité et compliance renforcées
• Évolutivité garantie pour la croissance future
• ROI positif dès la première année

💡 **Points clés de succès :**
• **Approche progressive :** Migration par phases pour minimiser les risques
• **Change management :** Accompagnement des utilisateurs dans l'adoption
• **Expertise technique :** Équipe dédiée Microsoft + partenaires certifiés
• **Monitoring continu :** Optimisation permanente des performances

🎯 **Parallèles avec votre contexte :**
Cette success story est particulièrement pertinente car ${referenceCompany} partage ${similarContext} :
• Enjeux similaires de transformation
• Contraintes opérationnelles comparables
• Objectifs de performance et coûts alignés
• Secteur ${sector} avec ses spécificités

📊 **Éléments de ROI concrets :**
• **Coûts IT :** Optimisation significative
• **Productivité :** Gain de temps utilisateur mesurable
• **Sécurité :** Conformité et protection renforcées
• **Évolutivité :** Capacité d'adaptation future

🤝 **Comment nous pouvons reproduire ce succès :**
Fort de cette expérience et d'autres réussites similaires, nous sommes prêts à vous accompagner dans une démarche comparable, adaptée à vos spécificités.

**Prochaines étapes suggérées :**
1. **Évaluation personnalisée :** Audit de votre environnement actuel
2. **Stratégie adaptée :** Plan de transformation sur mesure
3. **Proof of Concept :** Démonstration sur un périmètre pilote
4. **Roadmap détaillée :** Planning et budget précis

Cette success story vous inspire-t-elle ? Souhaiteriez-vous que nous analysions comment appliquer cette approche à votre contexte ?

Je reste à votre disposition pour approfondir cette discussion.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    reference_client: {
      name: 'Mise en Relation Référence Client',
      category: 'Succès Client & Témoignages',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-indigo-600',
      description: 'Proposition de mise en relation avec un client référence',
      aiCapable: true,
      fields: [
        { key: 'customer_name', label: 'Nom du prospect', required: true, placeholder: 'Ex: Madame Silva' },
        { key: 'prospect_company', label: 'Entreprise prospect', required: true, placeholder: 'Ex: NextGen Solutions' },
        { key: 'reference_contact', label: 'Contact référence', required: true, placeholder: 'Ex: M. Pierre Moreau, CTO' },
        { key: 'reference_company', label: 'Entreprise référence', required: true, placeholder: 'Ex: InnovateTech France' },
        { key: 'common_context', label: 'Contexte commun', required: true, placeholder: 'Ex: Migration Office 365, même secteur' },
        { key: 'reference_results', label: 'Résultats de la référence', required: true, placeholder: 'Ex: 30% économies, adoption 95%' }
      ],
      template: (data) => {
        const customerName = data.customer_name || 'Madame/Monsieur [Nom]';
        const prospectCompany = data.prospect_company || '[Entreprise prospect]';
        const referenceContact = data.reference_contact || '[Contact référence]';
        const referenceCompany = data.reference_company || '[Entreprise référence]';
        const commonContext = data.common_context || '[Contexte commun]';
        const referenceResults = data.reference_results || '[Résultats obtenus]';
        
        return `Objet : Mise en relation avec ${referenceCompany} - Retour d'expérience Microsoft

Bonjour ${customerName},

Suite à nos discussions sur votre projet de transformation digitale chez ${prospectCompany}, j'ai pensé qu'il serait très enrichissant pour vous d'échanger avec l'un de nos clients qui a mené un projet similaire.

🤝 **Proposition de mise en relation :**

**Client référence :** ${referenceCompany}
**Contact :** ${referenceContact}
**Projet réalisé :** ${commonContext}
**Résultats obtenus :** ${referenceResults}

🎯 **Pourquoi cette référence est pertinente :**
• **Contexte similaire :** Projets et enjeux comparables
• **Secteur d'activité :** Défis business similaires
• **Taille d'organisation :** Échelle et complexité équivalentes
• **Timeline récente :** Expérience fraîche et applicable

💡 **Ce que vous pourrez découvrir :**
• **Retour d'expérience authentique :** Vision utilisateur réelle
• **Leçons apprises :** Points d'attention et bonnes pratiques
• **Bénéfices concrets :** Impact mesurable sur l'activité
• **Processus de déploiement :** Méthodologie et planning réels
• **Accompagnement Microsoft :** Qualité du support et services

📞 **Format d'échange suggéré :**
• **Appel tripartite :** Moi-même + vous + référence client
• **Durée :** 30-45 minutes maximum
• **Focus :** Questions pratiques et opérationnelles
• **Confidentialité :** Respect mutuel des informations sensibles

✅ **Avantages pour ${prospectCompany} :**
• **Éclairage indépendant :** Avis client non orienté commercial
• **Anticipation des défis :** Préparation aux difficultés potentielles
• **Optimisation du projet :** Bénéfice des apprentissages antérieurs
• **Réduction des risques :** Validation de l'approche envisagée
• **Networking :** Création de liens avec des pairs du secteur

🗓️ **Mise en œuvre :**
Si cette opportunité vous intéresse, je peux :
1. **Contacter la référence :** Vérifier sa disponibilité
2. **Organiser l'échange :** Planifier selon vos agendas
3. **Préparer la session :** Structurer les sujets à aborder
4. **Faciliter la discussion :** Animation de la conversation

Notre client référence a accepté par le passé de partager son expérience car il considère que l'entraide entre entreprises fait partie de l'écosystème Microsoft.

Cette mise en relation ne vous engage à rien et peut vous apporter des éléments précieux pour affiner votre réflexion.

Souhaiteriez-vous que j'organise cet échange ?

Je reste à votre disposition pour toute question.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    },

    // === DEMO TEMPLATE - SHOWCASE ALL FIELD TYPES ===
    demo_all_fields: {
      name: 'Demo - Tous Types de Champs',
      category: 'Demo & Test',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-indigo-600',
      description: 'Template démo pour tester tous les types de champs',
      fields: [
        { key: 'text_field', label: 'Champ Texte', type: 'text', required: true, placeholder: 'Ex: Votre nom' },
        { key: 'email_field', label: 'Email', type: 'email', required: false, placeholder: 'Ex: example@domain.com' },
        { 
          key: 'select_field', 
          label: 'Liste Déroulante', 
          type: 'select',
          required: false, 
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
          ],
          placeholder: 'Choisir une option'
        },
        { 
          key: 'radio_field', 
          label: 'Choix Radio', 
          type: 'radio',
          required: false, 
          options: [
            { value: 'urgent', label: 'Urgent' },
            { value: 'normal', label: 'Normal' },
            { value: 'low', label: 'Faible priorité' }
          ]
        },
        { key: 'textarea_field', label: 'Zone de Texte', type: 'textarea', rows: 3, required: false, placeholder: 'Votre message détaillé...' },
        { key: 'date_field', label: 'Date', type: 'date', required: false, minDate: new Date().toISOString().split('T')[0] },
        { key: 'number_field', label: 'Nombre', type: 'number', required: false, placeholder: 'Ex: 1000', min: 0, step: 100 },
        { key: 'checkbox_field', label: 'Case à Cocher', type: 'checkbox', required: false, description: 'Cocher pour confirmer' },
        { key: 'tel_field', label: 'Téléphone', type: 'tel', required: false, placeholder: 'Ex: +33 1 23 45 67 89' },
        { key: 'url_field', label: 'URL', type: 'url', required: false, placeholder: 'Ex: https://www.example.com' }
      ],
      template: (data) => {
        const formatDate = (dateStr) => {
          if (!dateStr) return '[Date non sélectionnée]';
          return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        };

        return `Objet : Demo Template - Tous Types de Champs

Bonjour,

Voici un récapitulatif de tous les champs saisis :

**Informations de base:**
- Nom: ${data.text_field || '[Non renseigné]'}
- Email: ${data.email_field || '[Non renseigné]'}
- Téléphone: ${data.tel_field || '[Non renseigné]'}
- Site web: ${data.url_field || '[Non renseigné]'}

**Sélections:**
- Liste déroulante: ${data.select_field || '[Non sélectionné]'}
- Choix radio: ${data.radio_field || '[Non sélectionné]'}
- Case à cocher: ${data.checkbox_field ? 'Confirmé ✓' : 'Non confirmé'}

**Données numériques et dates:**
- Nombre: ${data.number_field || '[Non renseigné]'}
- Date sélectionnée: ${formatDate(data.date_field)}

**Message détaillé:**
${data.textarea_field || '[Aucun message saisi]'}

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`;
      }
    }
  };

  // Filter templates by search
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return templates;
    
    const query = searchQuery.toLowerCase();
    return Object.fromEntries(
      Object.entries(templates).filter(([key, template]) =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
      )
    );
  }, [searchQuery]);

  // Get categories
  const categories = useMemo(() => {
    const cats = [...new Set(Object.values(templates).map(t => t.category))];
    return cats.sort();
  }, []);

  // Simple helper functions
  const getEmailStats = () => {
    if (!generatedContent) return { words: 0, chars: 0, lines: 0 };
    
    const words = generatedContent.trim().split(/\s+/).filter(word => word.length > 0).length;
    const chars = generatedContent.length;
    const lines = generatedContent.split('\n').length;
    
    return { words, chars, lines };
  };

  const getSubjectLine = () => {
    if (!generatedContent) return '';
    
    const lines = generatedContent.split('\n');
    const subjectLine = lines.find(line => line.toLowerCase().startsWith('objet'));
    return subjectLine ? subjectLine.replace(/^objet\s*:\s*/i, '').trim() : '';
  };

  // Déclarer currentTemplate en premier pour éviter l'erreur d'initialisation
  const currentTemplate = useMemo(
    () => selectedTemplate ? templates[selectedTemplate] : null,
    [selectedTemplate]
  );

  const getEmailBody = () => {
    if (!generatedContent) return '';
    
    const lines = generatedContent.split('\n');
    const subjectIndex = lines.findIndex(line => line.toLowerCase().startsWith('objet'));
    if (subjectIndex === -1) return generatedContent;
    
    return lines.slice(subjectIndex + 1).join('\n').trim();
  };

  // Generate live preview of email content
  const generateLivePreview = useCallback(() => {
    if (!selectedTemplate || !templates[selectedTemplate] || !templates[selectedTemplate].template) return '';
    
    try {
      return templates[selectedTemplate].template(formData);
    } catch (error) {
      console.error('Error generating preview:', error);
      return 'Erreur lors de la génération de l\'aperçu...';
    }
  }, [selectedTemplate, formData]);

  // Check if form has any data
  const hasFormData = useMemo(() => {
    return Object.keys(formData).some(key => formData[key] && formData[key].toString().trim().length > 0);
  }, [formData]);

  // Real-time preview content
  const livePreviewContent = useMemo(() => {
    return generateLivePreview();
  }, [generateLivePreview]);

  const handleInputChange = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetAll = useCallback(() => {
    setFormData({});
    setGeneratedContent('');
    setSelectedTemplate('');
  }, []);

  
  // Update analytics data
  const updateAnalyticsData = useCallback((newEmailRecord) => {
    setAnalyticsData(prev => {
      const newHistory = [newEmailRecord, ...prev.recentActivity.slice(0, 9)];
      const totalEmails = prev.totalEmails + 1;
      
      // Calculate average engagement from recent emails with analytics
      const emailsWithAnalytics = newHistory.filter(email => email.analytics?.engagementScore);
      const averageEngagement = emailsWithAnalytics.length > 0 
        ? emailsWithAnalytics.reduce((sum, email) => sum + email.analytics.engagementScore, 0) / emailsWithAnalytics.length
        : prev.averageEngagement;
      
      // Update top performing templates
      const templateStats = {};
      newHistory.forEach(email => {
        if (!templateStats[email.template]) {
          templateStats[email.template] = { count: 0, totalEngagement: 0 };
        }
        templateStats[email.template].count++;
        if (email.analytics?.engagementScore) {
          templateStats[email.template].totalEngagement += email.analytics.engagementScore;
        }
      });
      
      const topPerformingTemplates = Object.entries(templateStats)
        .map(([template, stats]) => ({
          template,
          count: stats.count,
          avgEngagement: stats.totalEngagement / stats.count || 0
        }))
        .sort((a, b) => b.avgEngagement - a.avgEngagement)
        .slice(0, 5);
      
      return {
        totalEmails,
        averageEngagement,
        topPerformingTemplates,
        recentActivity: newHistory
      };
    });
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 2000);
      toast.success("Email copié dans le presse-papiers!");
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error("Veuillez copier manuellement le contenu.");
    }
  }, [generatedContent]);

  // Copy functions for different parts
  const copySubject = useCallback(async () => {
    const subject = getSubjectLine();
    if (!subject) {
      toast.error("Le template généré n'a pas encore de sujet.");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(subject);
      toast.success("Sujet copié!");
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error("Impossible de copier le sujet automatiquement.");
    }
  }, []);

  const copyBody = useCallback(async () => {
    const body = getEmailBody();
    if (!body) {
      toast.error("Aucun corps d'email à copier.");
      return;
    }
    
    try {
      await navigator.clipboard.writeText(body);
      toast.success("Corps de l'email copié!");
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error("Impossible de copier le contenu automatiquement.");
    }
  }, []);

  // Create mailto link for Outlook
  const openInOutlook = useCallback(() => {
    if (!generatedContent) {
      toast.error("Générez d'abord un email avant de l'ouvrir dans Outlook.");
      return;
    }
    
    const subject = encodeURIComponent(getSubjectLine());
    const body = encodeURIComponent(getEmailBody());
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    
    if (mailtoLink.length > 2048) {
      toast.error("Email trop long pour mailto. Utilisez le bouton 'Copier' à la place.");
      return;
    }
    
    window.open(mailtoLink, '_self');
    toast.success("Email prêt à être envoyé via votre client email.");
  }, [generatedContent]);

  // Basic transcript analysis (fallback)
  const analyzeTranscript = useCallback((transcript) => {
    if (!transcript.trim()) return {};
    
    const extractedData = {};
    const lines = transcript.toLowerCase().split('\n');
    
    const patterns = {
      current_solutions: /(?:solutions? microsoft actuelles?|current microsoft solutions?)[:\s]+(.*)/i,
      customer_type: /(?:type de client|customer type)[:\s]+(.*)/i,
      stakeholder: /(?:décideur autorisé|authorized stakeholder|décideur)[:\s]+(.*)/i,
      competition: /(?:concurrence|competition)[:\s]+(.*)/i,
      business_problem: /(?:problème business|customer business problem|business problem)[:\s]+(.*)/i,
      technical_problem: /(?:problème technique|customer technical problem|technical problem)[:\s]+(.*)/i,
      customer_pain: /(?:customer pain|pain point|problème)[:\s]+(.*)/i,
      recommended_solution: /(?:solution recommandée|recommended solution)[:\s]+(.*)/i,
      budget: /(?:budget)[:\s]+(.*)/i,
      timeframe: /(?:timeline|timeframe|délai)[:\s]+(.*)/i,
      industry: /(?:secteur|industry)[:\s]+(.*)/i,
      help_wanted: /(?:aide demandée|help wanted)[:\s]+(.*)/i
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      for (const line of lines) {
        const match = line.match(pattern);
        if (match && match[1] && match[1].trim()) {
          extractedData[key] = match[1].trim();
          break;
        }
      }
    });

    const text = transcript.toLowerCase();
    const companyPatterns = [
      /microsoft 365|m365|office 365/i,
      /azure/i,
      /dynamics/i,
      /aws|amazon web services/i,
      /google workspace|google cloud/i,
      /salesforce/i
    ];
    
    companyPatterns.forEach(pattern => {
      const match = transcript.match(pattern);
      if (match && !extractedData.current_solutions) {
        extractedData.current_solutions = match[0];
      }
    });

    return extractedData;
  }, []);

  // AI Tone Adjustment
  const toneOptions = {
    professional: { label: 'Professionnel', icon: <Building className="w-4 h-4" />, color: 'bg-blue-600' },
    friendly: { label: 'Amical', icon: <ThumbsUp className="w-4 h-4" />, color: 'bg-green-600' },
    urgent: { label: 'Urgent', icon: <AlertCircle className="w-4 h-4" />, color: 'bg-red-600' },
    casual: { label: 'Décontracté', icon: <Users className="w-4 h-4" />, color: 'bg-purple-600' }
  };

  // Template selection with auto-tone detection
  const handleTemplateSelect = useCallback((key) => {
    try {
      const template = templates[key];
      const defaults = {};
      
      template.fields.forEach(f => {
        if (f.default) defaults[f.key] = f.default;
      });
      
      setFormData(prev => ({ ...prev, ...defaults }));
      setSelectedTemplate(key);
      setGeneratedContent('');
      addToRecent(key);
      
      // Auto-detect and set appropriate tone
      let recommendedTone = 'professional';
      if (template) {
        const name = template.name.toLowerCase();
        const description = template.description?.toLowerCase() || '';
        
        // Urgent contexts
        if (name.includes('urgent') || name.includes('escalade') || name.includes('critique') ||
            description.includes('urgent') || description.includes('escalade') || 
            name.includes('incident') || name.includes('problème')) {
          recommendedTone = 'urgent';
        }
        // Friendly contexts  
        else if (name.includes('introduction') || name.includes('nouveau contact') || 
            name.includes('témoignage') || name.includes('success') ||
            description.includes('présentation') || description.includes('démonstration')) {
          recommendedTone = 'friendly';
        }
        // Casual contexts
        else if (name.includes('demo') || name.includes('workshop') || name.includes('invitation') ||
            description.includes('workshop') || description.includes('collaboration')) {
          recommendedTone = 'casual';
        }
      }
      
      setAiTone(recommendedTone);
      
      // Show toast with recommended tone
      if (template?.aiCapable) {
        toast(`Ton "${toneOptions[recommendedTone].label}" auto-sélectionné pour ce template`, {
          duration: 3000,
          icon: toneOptions[recommendedTone].icon
        });
      }
      
    } catch (error) {
      console.error('Error selecting template:', error);
    }
  }, [addToRecent, toneOptions]);


  // AI-powered email optimization
  const optimizeEmailWithAI = useCallback(async (content, tone = 'professional') => {
    console.log('🚨 DEBUG: optimizeEmailWithAI called with tone:', tone);
    console.log('🚨 DEBUG: Content length:', content.length);
    console.log('🚨 DEBUG: Stack trace:', new Error().stack);
    console.log('🚨 DEBUG: Current aiTone state:', aiTone);
    console.log('🚨 DEBUG: generatedContent exists:', !!generatedContent);
    
    if (!content.trim()) return content;
    
    try {
      setIsOptimizing(true);
      toast("Optimisation IA en cours...", { duration: 2000 });
      
      const response = await fetch('/api/optimize-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tone, language: 'french' })
      });
      
      if (!response.ok) throw new Error('Optimization failed');
      
      const result = await response.json();
      
      if (result.optimizedContent) {
        toast.success("Email optimisé avec succès!");
        return result.optimizedContent;
      }
      
      return content;
      
    } catch (error) {
      console.error('AI optimization failed:', error);
      toast.error("Erreur d'optimisation. Utilisation du contenu original.");
      return content;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  // AI Subject Line Generation
  const generateAISubjectLines = useCallback(async (content) => {
    if (!content.trim()) return [];
    
    try {
      const response = await fetch('/api/generate-subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tone: aiTone, count: 5 })
      });
      
      if (!response.ok) throw new Error('Subject generation failed');
      
      const result = await response.json();
      return result.subjects || [];
      
    } catch (error) {
      console.error('Subject generation failed:', error);
      return [];
    }
  }, [aiTone]);

  // Voice-to-Email functionality
  const startVoiceRecording = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Reconnaissance vocale non supportée dans ce navigateur.");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'fr-FR';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsRecording(true);
      toast("Enregistrement en cours... Parlez maintenant!", { duration: 3000 });
    };
    
    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setTranscriptInput(transcript);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      toast.error("Erreur de reconnaissance vocale: " + event.error);
      setIsRecording(false);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      toast.success("Enregistrement terminé!");
    };
    
    recognition.start();
    
    // Stop after 30 seconds
    setTimeout(() => {
      if (isRecording) {
        recognition.stop();
      }
    }, 30000);
  }, [isRecording]);

  // Email Analytics
  const analyzeEmailSentiment = useCallback(async (content) => {
    if (!content.trim()) return null;
    
    try {
      const response = await fetch('/api/analyze-sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      if (!response.ok) throw new Error('Sentiment analysis failed');
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('Sentiment analysis failed:', error);
      return null;
    }
  }, []);

  // AI-powered transcript analysis
  const analyzeTranscriptWithAI = useCallback(async (transcript) => {
    if (!transcript.trim()) return {};
    
    try {
      setIsAnalyzing(true);
      toast("Analyse du transcript en cours...", { duration: 2000 });
      
      const response = await fetch('/api/analyze-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          templateFields: currentTemplate?.fields || []
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze transcript');
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      const { recommended_template, confidence_score, extraction_notes, ...extractedFields } = result;
      
      const filledFields = Object.keys(extractedFields).filter(key => extractedFields[key]);
      toast.success(`Analyse terminée! ${filledFields.length} champs remplis automatiquement`);
      
      if (confidence_score && confidence_score < 0.7) {
        toast("Confiance modérée - vérifiez les données extraites", { duration: 4000 });
      }
      
      if (recommended_template && templates[recommended_template] && recommended_template !== selectedTemplate) {
        toast(`Template "${templates[recommended_template].name}" pourrait être plus adapté`, {
          duration: 6000,
          action: {
            label: "Changer",
            onClick: () => handleTemplateSelect(recommended_template)
          }
        });
      }
      
      return extractedFields;
      
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast.error(`Erreur d'analyse: ${error.message}`);
      return analyzeTranscript(transcript);
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentTemplate, selectedTemplate, handleTemplateSelect, templates]);

  // Enhanced content generation with AI
  const generateContent = useCallback(async (useAI = false) => {
    console.log('🚀 Generate Content Debug:', { 
      useAI, 
      currentTone: aiTone, 
      templateName: currentTemplate?.name 
    });
    
    if (!currentTemplate) {
      toast.error("Veuillez d'abord sélectionner un template.");
      return;
    }

    try {
      const missingFields = currentTemplate.fields
        .filter(f => f.required && !formData[f.key])
        .map(f => f.label);

      if (missingFields.length > 0) {
        toast.error(`Champs obligatoires manquants: ${missingFields.join(", ")}`);
        return;
      }

      let content;
      
      // FORCE DIRECT TEMPLATES FOR introduction_nouveau_contact - MODIFIED
      console.log("🔍 DEBUG selectedTemplate value:", selectedTemplate);
      console.log("🔍 DEBUG useAI value:", useAI);
      
      // Always use default template + AI optimization for better randomization
      if (currentTemplate.template) {
        // Use default template
        content = currentTemplate.template(formData);
      } else if (currentTemplate.templates && currentTemplate.templates.professional) {
        // Fallback to professional tone template if no default template
        content = currentTemplate.templates.professional(formData);
      } else {
        console.error('No template found for:', currentTemplate.name);
        return;
      }
      
      // DISABLED: Automatic AI optimization on generation
      // Users must manually click "Optimiser" button to apply tone changes
      // This prevents automatic optimization when tone changes
      if (useAI && currentTemplate.aiCapable) {
        console.log('⚠️ AI optimization disabled - use manual "Optimiser" button');
        console.log('📝 Content generated without tone optimization:', content.length);
        // Note: content stays as-is, no automatic optimization
      }

      if (useAI && currentTemplate.aiCapable) {
        // Generate AI subject suggestions
        const subjects = await generateAISubjectLines(content);
        if (subjects.length > 0) {
          setAiSuggestions(subjects);
        }
        
        // Analyze sentiment
        const analytics = await analyzeEmailSentiment(content);
        if (analytics) {
          setEmailAnalytics(analytics);
        }
        
        setIsGeneratingAI(false);
      }
      
      console.log('📝 Setting generated content in state, length:', content.length);
      console.log('📝 Content preview:', content.substring(0, 100) + '...');
      
      // TEST: Force alert to see if the content is different
      alert(`TONE: ${aiTone}\nLENGTH: ${content.length}\nSTART: ${content.substring(0, 50)}...`);
      
      // FORCE React update by clearing first, then setting + unique key
      setGeneratedContent('');
      setContentKey(prev => prev + 1); // Force re-render with new key
      setTimeout(() => {
        setGeneratedContent(content);
      }, 10);
      
      // Track email generation for analytics
      const emailRecord = {
        id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        template: currentTemplate.name,
        tone: useAI ? aiTone : 'standard',
        timestamp: new Date().toISOString(),
        wordCount: content.split(/\s+/).length,
        analytics: emailAnalytics,
        aiEnhanced: useAI
      };
      
      setEmailHistory(prev => [emailRecord, ...prev.slice(0, 49)]); // Keep last 50
      updateAnalyticsData(emailRecord);
      
      toast.success(useAI ? "Email généré et optimisé par IA!" : "Contenu généré avec succès!");
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error("La génération du contenu a échoué. Réessayez.");
      setIsGeneratingAI(false);
    }
  }, [currentTemplate, formData, aiTone, optimizeEmailWithAI, generateAISubjectLines, analyzeEmailSentiment]);

  const stats = getEmailStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Templates Microsoft - Nicolas BAYONNE
          </h1>
          <p className="text-gray-600">
            Templates authentiques pour Account Manager + Forecast CRM
          </p>
          
          {/* Navigation */}
          <div className="mt-4 flex justify-center gap-4">
            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
              📝 Templates (Mode actuel)
            </div>
            <a 
              href="/ai-agent"
              className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm hover:bg-purple-200 transition-colors"
            >
              🧠 Vrai AI Agent (Nouveau !)
            </a>
          </div>
        </div>


        {/* Analytics Dashboard Toggle */}
        <div className="mb-6 text-center">
          <button
            onClick={() => setShowAnalyticsDashboard(!showAnalyticsDashboard)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            <BarChart3 className="w-4 h-4" />
            {showAnalyticsDashboard ? 'Masquer' : 'Voir'} Analytics
          </button>
        </div>
        
        {/* Analytics Dashboard */}
        {showAnalyticsDashboard && isMounted && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Dashboard Analytics
            </h2>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analyticsData.totalEmails}</div>
                <div className="text-sm text-blue-800">Emails Générés</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(analyticsData.averageEngagement * 100)}%
                </div>
                <div className="text-sm text-green-800">Engagement Moyen</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {emailHistory.filter(e => e.aiEnhanced).length}
                </div>
                <div className="text-sm text-purple-800">Optimisés IA</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {analyticsData.topPerformingTemplates[0]?.template ? 
                    analyticsData.topPerformingTemplates[0].template.split(' ')[0] : 'N/A'
                  }
                </div>
                <div className="text-sm text-orange-800">Template Top</div>
              </div>
            </div>
            
            {/* Recent Activity & Top Templates */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Activité Récente
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analyticsData.recentActivity.slice(0, 10).map((email) => (
                    <div key={email.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {email.template}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>{isMounted ? new Date(email.timestamp).toLocaleTimeString('fr-FR') : email.timestamp}</span>
                          {email.aiEnhanced && <Sparkles className="w-3 h-3 text-purple-500" />}
                          <span>{email.tone}</span>
                        </div>
                      </div>
                      {email.analytics?.engagementScore && (
                        <div className={`text-xs px-2 py-1 rounded ${
                          email.analytics.engagementScore > 0.7 ? 'bg-green-100 text-green-700' :
                          email.analytics.engagementScore > 0.5 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {Math.round(email.analytics.engagementScore * 100)}%
                        </div>
                      )}
                    </div>
                  ))}
                  {analyticsData.recentActivity.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Aucune activité récente</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Top Performing Templates */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Templates Performants
                </h3>
                <div className="space-y-2">
                  {analyticsData.topPerformingTemplates.map((template, index) => (
                    <div key={template.template} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-200 text-yellow-800' :
                          index === 1 ? 'bg-gray-200 text-gray-800' :
                          index === 2 ? 'bg-orange-200 text-orange-800' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {template.template.length > 25 ? 
                              template.template.substring(0, 25) + '...' : 
                              template.template
                            }
                          </div>
                          <div className="text-xs text-gray-500">
                            {template.count} utilisations
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {Math.round(template.avgEngagement * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>
                  ))}
                  {analyticsData.topPerformingTemplates.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Pas encore de données</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Usage Tips */}
            {analyticsData.totalEmails > 5 && isMounted && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Recommandations IA
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  {analyticsData.averageEngagement < 0.6 && (
                    <p>• Essayez d'utiliser plus souvent la génération IA pour améliorer l'engagement</p>
                  )}
                  {emailHistory.filter(e => e.aiEnhanced).length / analyticsData.totalEmails < 0.3 && (
                    <p>• Vous n'utilisez l'IA que dans {Math.round((emailHistory.filter(e => e.aiEnhanced).length / analyticsData.totalEmails) * 100)}% des cas</p>
                  )}
                  {analyticsData.topPerformingTemplates.length > 0 && (
                    <p>• Votre template le plus performant: "{analyticsData.topPerformingTemplates[0].template}"</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - Template Selection */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Templates</h2>
                <button
                  onClick={resetAll}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un template..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Recent Templates */}
              {recentTemplates.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Récemment utilisés
                  </h3>
                  <div className="space-y-2">
                    {recentTemplates.slice(0, 3).map(templateKey => {
                      if (!templates[templateKey]) return null;
                      const template = templates[templateKey];
                      return (
                        <button
                          key={templateKey}
                          onClick={() => handleTemplateSelect(templateKey)}
                          className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded ${template.color}`}>
                              {React.cloneElement(template.icon, { className: "w-3 h-3 text-white" })}
                            </div>
                            <span className="truncate">{template.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Section Templates par Ton */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Templates par Ton
                </h3>
                <div className="space-y-3">
                  {Object.entries(EMAIL_TEMPLATES_BY_TONE).map(([toneKey, template]) => (
                    <div key={toneKey} className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">{
                            toneKey === 'professional' ? '💼 Formel' :
                            toneKey === 'friendly' ? '😊 Amical' : 
                            toneKey === 'casual' ? '🤙 Décontracté' :
                            toneKey === 'urgent' ? '⚠️ Urgent' : toneKey
                          }</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {template.successRate}%
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              const fullEmail = `Objet: ${template.subject}

${template.content}`;
                              navigator.clipboard.writeText(fullEmail);
                              toast.success('Template copié !');
                            }}
                            className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
                          >
                            Copier
                          </button>
                          <button
                            onClick={() => {
                              const fullEmail = `Objet: ${template.subject}

${template.content}`;
                              setGeneratedContent(fullEmail);
                              toast.success('Template utilisé !');
                            }}
                            className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded transition-colors"
                          >
                            Utiliser
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        <strong>Objet:</strong> {template.subject.substring(0, 35)}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Templates by Category */}
              <div className="space-y-4">
                {categories.map(category => {
                  const categoryTemplates = Object.entries(filteredTemplates)
                    .filter(([_, template]) => template.category === category);
                  
                  if (categoryTemplates.length === 0) return null;
                  
                  return (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {categoryTemplates.map(([key, template]) => (
                          <div key={key} className="flex items-center gap-2">
                            <TemplateCard
                              template={template}
                              selected={selectedTemplate === key}
                              onSelect={() => handleTemplateSelect(key)}
                            />
                            <button
                              onClick={() => toggleFavorite(key)}
                              className={`p-1 rounded transition-colors ${
                                favorites.has(key) 
                                  ? 'text-yellow-500 hover:text-yellow-600' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              <Star className={`w-4 h-4 ${favorites.has(key) ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Middle Panel - Form */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Configuration
              </h2>
              
              {currentTemplate ? (
                <div className="space-y-4">
                  <div className={`p-3 rounded-lg ${currentTemplate.color} text-white`}>
                    <div className="flex items-center gap-2 mb-2">
                      {currentTemplate.icon}
                      <h3 className="font-medium">{currentTemplate.name}</h3>
                    </div>
                    <p className="text-sm opacity-90">{currentTemplate.description}</p>
                  </div>

                  {/* Enhanced AI transcript analysis */}
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => setShowTranscriptBox(!showTranscriptBox)}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        disabled={isAnalyzing}
                      >
                        <MessageCircle className="w-4 h-4" />
                        {isAnalyzing ? 'Analyse en cours...' : 'Analyse IA du transcript'}
                        {isAnalyzing && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                      </button>
                      
                      {analysisHistory.length > 0 && (
                        <button
                          onClick={() => setAnalysisHistory([])}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Effacer historique ({analysisHistory.length})
                        </button>
                      )}
                    </div>
                    
                    {showTranscriptBox && (
                      <div className="space-y-3">
                        <div className="relative">
                          <textarea
                            placeholder="Collez ici le transcript de votre réunion. L'IA va automatiquement extraire les informations pertinentes pour remplir le template..."
                            className="w-full h-32 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={transcriptInput}
                            onChange={(e) => setTranscriptInput(e.target.value)}
                            disabled={isAnalyzing}
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {transcriptInput.length} caractères
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={async () => {
                              const extracted = await analyzeTranscriptWithAI(transcriptInput);
                              if (Object.keys(extracted).length > 0) {
                                setFormData(prev => ({ ...prev, ...extracted }));
                                setAnalysisHistory(prev => [...prev, { 
                                  id: `analysis-${Date.now()}`,
                                  timestamp: isMounted ? new Date().toLocaleTimeString() : new Date().toISOString(), 
                                  extracted,
                                  transcript: transcriptInput.slice(0, 100) + '...'
                                }]);
                                setTranscriptInput('');
                                setShowTranscriptBox(false);
                              }
                            }}
                            disabled={!transcriptInput.trim() || isAnalyzing}
                            className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="w-4 h-4 flex items-center justify-center">
                              {isAnalyzing ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                "✨"
                              )}
                            </div>
                            {isAnalyzing ? 'Analyse...' : 'Analyse IA'}
                          </button>
                          
                          <button
                            onClick={() => {
                              const extracted = analyzeTranscript(transcriptInput);
                              setFormData(prev => ({ ...prev, ...extracted }));
                              toast.success(`${Object.keys(extracted).length} champs remplis (analyse basique)`);
                              setTranscriptInput('');
                              setShowTranscriptBox(false);
                            }}
                            disabled={!transcriptInput.trim() || isAnalyzing}
                            className="text-sm px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                          >
                            Analyse rapide
                          </button>
                        </div>
                        
                        {/* Analysis History */}
                        {analysisHistory.length > 0 && (
                          <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                            <div className="font-medium text-gray-700 mb-1">Historique des analyses:</div>
                            {analysisHistory.slice(-3).map((analysis, index) => (
                              <div key={index} className="flex justify-between items-center py-1">
                                <span className="text-gray-600 truncate">{analysis.transcript}</span>
                                <span className="text-gray-500">{analysis.timestamp}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  {currentTemplate.fields.map((field) => (
                    <DynamicField
                      key={field.key}
                      field={{
                        ...field,
                        type: field.type || 'text' // Default to text if no type specified
                      }}
                      value={formData[field.key]}
                      onChange={handleInputChange}
                    />
                  ))}

                  {/* AI Tone Selection */}
                  {currentTemplate?.aiCapable && (
                    <div className="border rounded-lg p-3 bg-gradient-to-r from-purple-50 to-blue-50">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Tone IA</span>
                        <button
                          onClick={() => setShowAIPanel(!showAIPanel)}
                          className="ml-auto text-xs text-blue-600 hover:text-blue-700"
                        >
                          {showAIPanel ? 'Masquer' : 'Voir plus'}
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {Object.entries(toneOptions).map(([key, tone]) => (
                          <button
                            key={key}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('🚨 Tone selector clicked:', key);
                              setAiTone(key);
                              // Show preview toast instead of auto-generating
                              toast(`Ton "${tone.label}" sélectionné - Cliquez "Optimiser" pour appliquer`, {
                                duration: 4000,
                                icon: tone.icon
                              });
                            }}
                            className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${
                              aiTone === key 
                                ? `${tone.color} text-white` 
                                : 'bg-white border border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {tone.icon}
                            {tone.label}
                          </button>
                        ))}
                      </div>
                      
                      {/* Templates Preview selon le ton */}
                      <ToneTemplatePreview selectedTone={aiTone} />
                      
                      {showAIPanel && (
                        <div className="space-y-2">
                          <button
                            onClick={startVoiceRecording}
                            disabled={isRecording}
                            className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs transition-all ${
                              isRecording 
                                ? 'bg-red-100 text-red-700' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            {isRecording ? 'Arrêter enregistrement...' : 'Dictée vocale'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Generation Button */}
                  <div className="space-y-2">
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Sélectionnez un template pour commencer</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Live Preview & Generated Content */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {showLivePreview ? 'Aperçu en temps réel' : 'Email généré'}
                  </h2>
                  {currentTemplate && (
                    <button
                      onClick={() => setShowLivePreview(!showLivePreview)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        showLivePreview 
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {showLivePreview ? '👁️ Aperçu' : '📧 Généré'}
                    </button>
                  )}
                </div>
                {generatedContent && isMounted && (
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">
                      {stats.words} mots • {stats.chars} caractères
                    </div>
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showPreview ? 'Code' : 'Aperçu'}
                    </button>
                  </div>
                )}
              </div>

              {generatedContent ? (
                <div className="space-y-4">
                  {/* AI Suggestions Panel */}
                  {aiSuggestions.length > 0 && (
                    <div className="border rounded-lg p-3 bg-gradient-to-r from-purple-50 to-pink-50">
                      <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Suggestions de sujets IA
                      </h4>
                      <div className="space-y-1">
                        {aiSuggestions.slice(0, 3).map((subject, index) => (
                          <button
                            key={index}
                            onClick={async () => {
                              await navigator.clipboard.writeText(subject);
                              toast.success("Sujet copié!");
                            }}
                            className="w-full text-left p-2 text-xs bg-white rounded hover:bg-purple-50 transition-colors border border-purple-200"
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Email Analytics */}
                  {emailAnalytics && (
                    <div className="border rounded-lg p-3 bg-gradient-to-r from-green-50 to-blue-50">
                      <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <BarChart3 className="w-4 h-4 text-green-600" />
                        Analyse IA
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white p-2 rounded border">
                          <div className="text-gray-600">Sentiment</div>
                          <div className={`font-medium ${
                            emailAnalytics.sentiment === 'positive' ? 'text-green-600' :
                            emailAnalytics.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {emailAnalytics.sentiment === 'positive' ? 'Positif' :
                             emailAnalytics.sentiment === 'negative' ? 'Négatif' : 'Neutre'}
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded border">
                          <div className="text-gray-600">Score engagement</div>
                          <div className="font-medium text-blue-600">
                            {emailAnalytics.engagementScore ? `${Math.round(emailAnalytics.engagementScore * 100)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={copyToClipboard}
                      className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-all ${
                        showCopyFeedback 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {showCopyFeedback ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {showCopyFeedback ? 'Copié!' : 'Copier tout'}
                    </button>
                    
                    <button
                      onClick={copySubject}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Sujet
                    </button>
                    
                    <button
                      onClick={copyBody}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Corps
                    </button>
                    
                    <button
                      onClick={openInOutlook}
                      className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg text-sm transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Outlook
                    </button>
                    
                    {currentTemplate?.aiCapable && generatedContent && (
                      <button
                        onClick={async () => {
                          console.log('🚨 MANUEL: Bouton optimisation cliqué avec ton:', aiTone);
                          const optimized = await optimizeEmailWithAI(generatedContent, aiTone);
                          setGeneratedContent(optimized);
                        }}
                        disabled={isOptimizing}
                        className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg text-sm transition-colors disabled:opacity-50"
                      >
                        {isOptimizing ? (
                          <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        {isOptimizing ? 'Optimisation...' : 'Optimiser IA'}
                      </button>
                    )}
                  </div>

                  {/* Content Display */}
                  {showLivePreview ? (
                    /* Live Preview */
                    currentTemplate ? (
                      <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-blue-700">APERÇU EN TEMPS RÉEL</span>
                        </div>
                        {livePreviewContent && hasFormData ? (
                          <div className="space-y-3">
                            {livePreviewContent.split('\n').filter(line => line.toLowerCase().startsWith('objet')).map((line, index) => (
                              <div key={index}>
                                <div className="text-xs font-medium text-gray-500 mb-1">OBJET</div>
                                <div className="font-medium text-gray-900">{line.replace(/^objet\s*:\s*/i, '')}</div>
                              </div>
                            ))}
                            <div>
                              <div className="text-xs font-medium text-gray-500 mb-1">CONTENU</div>
                              <div className="whitespace-pre-wrap text-gray-800 text-sm">
                                {livePreviewContent.split('\n').filter(line => !line.toLowerCase().startsWith('objet')).join('\n').trim()}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">✏️</div>
                            <div className="text-sm">Commencez à remplir les champs pour voir l'aperçu</div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4 bg-gray-50 text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📧</div>
                        <div className="text-sm">Sélectionnez un template pour voir l'aperçu</div>
                      </div>
                    )
                  ) : showPreview ? (
                    /* Generated Content Preview */
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="space-y-3">
                        {getSubjectLine() && (
                          <div>
                            <div className="text-xs font-medium text-gray-500 mb-1">OBJET</div>
                            <div className="font-medium text-gray-900">{getSubjectLine()}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">MESSAGE</div>
                          <div className="whitespace-pre-wrap text-gray-800">{getEmailBody()}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <textarea
                      key={contentKey}
                      readOnly
                      value={generatedContent}
                      className="w-full h-96 p-4 font-mono text-sm border border-gray-200 rounded-lg resize-none bg-gray-50 focus:outline-none"
                    />
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>L'email apparaîtra ici après génération</p>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
      
      {/* Fixed Assistant Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Main Email Chatbot Button */}
        <button
          onClick={openChatbot}
          data-help="ai-button"
          className={`relative p-4 rounded-full shadow-lg transition-all duration-300 ${
            showEmailChatbot 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
          }`}
          title="Assistant Email Intelligent - Création automatisée"
        >
          <MessageCircle className="w-6 h-6" />
          {!showEmailChatbot && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              ✨
            </div>
          )}
        </button>

        {/* Secondary AI Assistant Button */}
        <button
          onClick={() => setShowAIAssistant(!showAIAssistant)}
          className={`p-3 rounded-full shadow-md transition-all duration-300 ${
            showAIAssistant 
              ? 'bg-purple-600 text-white' 
              : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
          }`}
          title="Assistant IA General"
        >
          <Brain className="w-5 h-5" />
        </button>
      </div>

      {/* Smart Action Bar */}
      <SmartActionBar 
        onOpenChatbot={() => setShowEmailChatbot(true)}
        onOpenAnalytics={() => setShowAnalyticsDashboard(true)}
      />

      {/* Email Chatbot Component */}
      <EmailChatbot 
        isOpen={showEmailChatbot} 
        onToggle={() => setShowEmailChatbot(!showEmailChatbot)} 
      />

      {/* AI Assistant Component */}
      <AIAssistant 
        isOpen={showAIAssistant} 
        onToggle={() => setShowAIAssistant(!showAIAssistant)} 
      />
      
      {/* UX Enhancement Components - Temporarily disabled for debugging */}
      {/*
      <IntelligentOnboarding 
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
      
      <ContextualHelp 
        context={userBehavior.currentSection}
        userBehavior={userBehavior}
        onShowTip={(tipId) => console.log('Showing tip:', tipId)}
        onHideTip={(tipId) => console.log('Hiding tip:', tipId)}
      />
      
      <KeyboardShortcuts 
        onOpenChatbot={openChatbot}
        onOpenScheduler={() => {}}
        onOpenContacts={() => {}}
        onOpenSequences={() => {}}
        onSaveEmail={() => {}}
        onNewEmail={() => window.location.reload()}
      />
      
      <SuccessAnimation 
        isVisible={showSuccessAnimation}
        onComplete={() => setShowSuccessAnimation(false)}
        message="Bienvenue ! Vous maîtrisez maintenant tous les outils."
      />
      
      <MicroInteractionStyles />
      */}
    </div>
  );
};

export default NicolasEmailGenerator;