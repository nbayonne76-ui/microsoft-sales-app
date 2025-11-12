"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, Send, User, Bot, RefreshCw, Copy, Mail, 
  Zap, Target, Clock, Star, ArrowRight, CheckCircle, X, Calendar,
  FileText, Save, Users, GitBranch, HelpCircle, FileImage, BarChart3
} from 'lucide-react';
import { toast } from "sonner";
import SmartEmailScheduler from './SmartEmailScheduler';
import DraftManager from './DraftManager';
import SmartRecipientSuggestions from './SmartRecipientSuggestions';
import AutoFollowUpManager from './AutoFollowUpManager';
import EmailChatbotFAQ from './EmailChatbotFAQ';
import TypingFeedback from './TypingFeedback';
import EnhancedChatInterface from './EnhancedChatInterface';
import ConversationStatusCard from './ConversationStatusCard';
import FuturisticPartnerDisplay from './FuturisticPartnerDisplay';
import OCRUploader from './OCRUploader';
import DataQualityIndicator from './DataQualityIndicator';

const EmailChatbot = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState(() => {
    // Generate contextual welcome message
    const hour = new Date().getHours();
    const isWeekend = [0, 6].includes(new Date().getDay());
    
    let greeting, emoji, timeContext;
    
    if (hour >= 5 && hour < 12) {
      greeting = "Bonjour";
      emoji = "🌅";
      timeContext = isWeekend ? "Bon week-end !" : "Bonne journée !";
    } else if (hour >= 12 && hour < 17) {
      greeting = "Bon après-midi";  
      emoji = "☀️";
      timeContext = "L'après-midi est parfait pour les emails !";
    } else if (hour >= 17 && hour < 21) {
      greeting = "Bonsoir";
      emoji = "🌆";
      timeContext = isWeekend ? "Bonne soirée !" : "Fin de journée productive !";
    } else {
      greeting = "Bonsoir";
      emoji = "🌙";
      timeContext = "Travail tardif ? Je suis là pour vous aider !";
    }

    return [
      {
        id: 1,
        type: 'bot',
        content: `${emoji} ${greeting} Nicolas !

Je suis votre assistant email intelligent. ${timeContext}

🎯 **Qu'allons-nous créer aujourd'hui ?**
• Contacter un nouveau prospect
• Faire un suivi de réunion  
• Relancer un client

💡 **Ou dites-moi directement :** "Martin, TIXTO, martin@tixto.com"`,
        timestamp: new Date(),
        suggestions: [
          '🎯 Nouveau prospect',
          '📧 Suivi de réunion',
          '🔄 Relancer un client'
        ]
      }
    ];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState('initial');
  const [emailData, setEmailData] = useState({});
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [predictiveText, setPredictiveText] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showDraftManager, setShowDraftManager] = useState(false);
  // PERFORMANCE FIX: Use useRef to prevent stale closures and memory leaks
  const autoSaveTimerRef = useRef(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [showRecipientSuggestions, setShowRecipientSuggestions] = useState(false);
  const [showFollowUpManager, setShowFollowUpManager] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [showPartnerCard, setShowPartnerCard] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showFuturisticPartners, setShowFuturisticPartners] = useState(false);
  const [futuristicPartnersData, setFuturisticPartnersData] = useState(null);
  const [showOCR, setShowOCR] = useState(false);
  const [lastPreprocessingData, setLastPreprocessingData] = useState(null);
  const [showDataQuality, setShowDataQuality] = useState(false);
  
  const messagesEndRef = useRef(null);
  const chatStates = {
    initial: 'Découverte du contexte',
    gathering_info: 'Collecte d\'informations',
    analyzing: 'Analyse et suggestions',
    generating: 'Génération de l\'email',
    review: 'Révision et finalisation',
    ready: 'Prêt à envoyer'
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // PERFORMANCE FIX: Auto-save effect with proper cleanup using useRef
  // Prevents memory leaks from stale closure by using useRef for timer reference
  useEffect(() => {
    if (conversationState !== 'initial' && messages.length > 2) {
      // Clear existing timer using ref
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new auto-save timer (5 seconds after last activity)
      autoSaveTimerRef.current = setTimeout(() => {
        autoSaveDraft();
      }, 5000);
    }

    // Cleanup function properly clears the ref-based timer
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [messages, conversationState, emailData, generatedEmail]);

  const addMessage = (content, type = 'user', suggestions = null, emailContent = null, metadata = null) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
      suggestions,
      emailContent,
      metadata
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleOCRTextExtracted = async (extractedText) => {
    if (!extractedText.trim()) return;
    
    const ocrMessage = `📷 Texte extrait de l'image:\n\n${extractedText}`;
    await sendMessage(ocrMessage);
    setShowOCR(false);
  };

  const sendMessage = async (message = inputMessage, userResponse = null) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    addMessage(message, 'user');
    setInputMessage('');
    setIsLoading(true);

    // Preprocess message for better understanding
    let preprocessedMessage = message;
    let preprocessingData = null;
    
    try {
      const preprocessResponse = await fetch('/api/preprocess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message,
          options: {
            type: 'email_generation',
            normalizeWhitespace: true,
            extractStructuredData: true
          }
        })
      });

      if (preprocessResponse.ok) {
        preprocessingData = await preprocessResponse.json();
        preprocessedMessage = preprocessingData.processedText;
        
        // Store preprocessing data for quality display
        setLastPreprocessingData(preprocessingData);
        
        // Auto-populate emailData if structured data is found
        if (preprocessingData.structuredData) {
          const { emails, companies, names, phones } = preprocessingData.structuredData;
          
          if (emails.length > 0 && !emailData.recipient) {
            setEmailData(prev => ({ ...prev, recipient: emails[0] }));
          }
          if (companies.length > 0 && !emailData.company) {
            setEmailData(prev => ({ ...prev, company: companies[0] }));
          }
          if (names.length > 0 && !emailData.recipientName) {
            setEmailData(prev => ({ ...prev, recipientName: names[0] }));
          }
          if (phones.length > 0 && !emailData.phone) {
            setEmailData(prev => ({ ...prev, phone: phones[0] }));
          }
        }

        // Show data quality indicator for low quality data
        if (preprocessingData.quality?.score < 70 && 
            Object.keys(preprocessingData.structuredData).some(key => 
              preprocessingData.structuredData[key]?.length > 0)) {
          setShowDataQuality(true);
        }

        // Show preprocessing suggestions if quality is low
        if (preprocessingData.quality?.score < 60) {
          setTimeout(() => {
            const suggestions = preprocessingData.chatbotEnhancements?.qualityImprovements || [];
            if (suggestions.length > 0) {
              addMessage(
                `💡 **Suggestion d'amélioration**\n\n${suggestions[0].message}\n\nSuggestions:\n${suggestions[0].suggestions.map(s => `• ${s}`).join('\n')}`,
                'assistant',
                { suggestions: ['✅ Continuer quand même', '✏️ Améliorer le message'] }
              );
            }
          }, 1000);
        }
      }
    } catch (error) {
      console.warn('Preprocessing failed, continuing with original message:', error);
    }

    // Skip partner detection if we're in prospect gathering mode
    const skipPartnerDetection = conversationState === 'gathering_prospect_info';
    
    // Check if message contains a partner ID or partner-related keywords
    const foundPartnerId = skipPartnerDetection ? false : await detectPartnerIdInMessage(message);
    const isPartnerQuery = skipPartnerDetection ? false : detectPartnerKeywords(message);
    
    if (!foundPartnerId && !isPartnerQuery) {
      // Continue with normal chatbot flow if no partner content detected
      try {
        const response = await fetch('/api/email-chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: preprocessedMessage,
            originalMessage: message,
            preprocessingData,
            conversationState,
            emailData: {
              ...emailData,
              userResponse: userResponse  // Include userResponse metadata for conversational system
            },
            partnerData,  // Include partner data in context
            conversationHistory: messages
          })
        });

        const result = await response.json();

        if (response.ok) {
          // Handle state transitions with smooth messages
          const oldState = conversationState;
          const newState = result.newState;
          
          if (oldState !== newState && newState) {
            // Add transition message for better flow
            const transitionMessage = getTransitionMessage(oldState, newState, result.emailData || emailData);
            if (transitionMessage) {
              addMessage(transitionMessage, 'bot', [], null, { isTransition: true });
              
              // Small delay before main response for better UX
              setTimeout(() => {
                addMessage(
                  result.response, 
                  'bot', 
                  result.suggestions,
                  result.emailContent
                );
              }, 800);
            } else {
              addMessage(
                result.response, 
                'bot', 
                result.suggestions,
                result.emailContent
              );
            }
          } else {
            addMessage(
              result.response, 
              'bot', 
              result.suggestions,
              result.emailContent
            );
          }
          
          // Update conversation state
          if (result.newState) {
            setConversationState(result.newState);
          }
          
          // Update email data
          if (result.emailData) {
            setEmailData(prev => ({ ...prev, ...result.emailData }));
          }

          // Store generated email if provided
          if (result.emailContent) {
            setGeneratedEmail(result.emailContent);
          }
        } else {
          addMessage('Désolé, j\'ai rencontré un problème. Pouvez-vous reformuler ?', 'bot');
        }
      } catch (error) {
        addMessage('Erreur de connexion. Veuillez réessayer.', 'bot');
      } finally {
        setIsLoading(false);
      }
    }
    // Note: if partner ID was found, setIsLoading(false) is handled in lookupPartner
  };

  // Transform API partner data to futuristic interface format
  const transformPartnersToFuturisticFormat = (partnersData, category) => {
    const parseCapabilities = (capabilityText) => {
      const specializations = [];
      if (capabilityText.includes('Security')) specializations.push('Security');
      if (capabilityText.includes('Cloud Endpoints')) specializations.push('Cloud Endpoints');
      if (capabilityText.includes('Modernize with Surface')) specializations.push('Modernize with Surface');
      if (capabilityText.includes('Secure Productivity')) specializations.push('Secure Productivity');
      if (capabilityText.includes('Converged Communications')) specializations.push('Converged Communications');
      return specializations;
    };

    const getScoreFromCapabilities = (capabilities) => {
      if (capabilities.includes('All 5')) return 5;
      if (capabilities.includes('4 out of 5')) return 4;
      const specializations = parseCapabilities(capabilities);
      return specializations.length;
    };

    const getTierFromScore = (score) => {
      if (score === 5) return 'Elite';
      if (score >= 4) return 'Premium';
      return 'Standard';
    };

    const partners = partnersData.map(partner => ({
      name: partner.partnerOneName,
      id: partner.partnerOneId,
      specializations: parseCapabilities(partner.capabilities),
      score: getScoreFromCapabilities(partner.capabilities),
      maxScore: 5,
      tier: getTierFromScore(getScoreFromCapabilities(partner.capabilities))
    }));

    return {
      category: category,
      totalCount: partnersData.length,
      partners: partners.sort((a, b) => b.score - a.score) // Sort by score descending
    };
  };

  const handleSuggestionClick = async (suggestion) => {
    // Parse suggestion - it can be a string or an object with metadata
    let suggestionText = suggestion;
    let suggestionMetadata = null;

    if (typeof suggestion === 'object' && suggestion.text) {
      suggestionText = suggestion.text;
      suggestionMetadata = suggestion.metadata || suggestion;
    }

    // Handle special partner-related suggestions
    if (suggestionText === '📊 Voir tous les partenaires QRP') {
      setIsLoading(true);
      try {
        const response = await fetch('/api/partners?qrp=true');
        const result = await response.json();
        
        if (result.success && result.qrp) {
          // Merge all partners from all pillars for futuristic display
          const allPartners = [];
          Object.entries(result.qrp).forEach(([pillar, partners]) => {
            allPartners.push(...partners);
          });

          if (allPartners.length > 0) {
            const futuristicData = transformPartnersToFuturisticFormat(allPartners, 'QRP - TOUS PILIERS');
            setFuturisticPartnersData(futuristicData);
            setShowFuturisticPartners(true);
            
            addMessage(
              `🚀 **Interface futuriste QRP activée !**\n\nExplorez ${allPartners.length} partenaires de tous les piliers dans une expérience immersive.`, 
              'bot', 
              ['🏢 Voir partenaires Modern Work', '🔍 Rechercher un partenaire spécifique', '🏠 Fermer l\'interface']
            );
          }
        }
      } catch (error) {
        addMessage('❌ Erreur lors de la récupération des partenaires QRP', 'bot');
      } finally {
        setIsLoading(false);
      }
      return;
    }
    
    if (suggestion === '🏢 Voir partenaires Modern Work') {
      setIsLoading(true);
      try {
        const response = await fetch('/api/partners?pillar=modernwork');
        const result = await response.json();
        
        if (result.success && result.partners) {
          // Transform API data to futuristic interface format
          const futuristicData = transformPartnersToFuturisticFormat(result.partners, 'MODERNWORK');
          setFuturisticPartnersData(futuristicData);
          setShowFuturisticPartners(true);
          
          addMessage(
            `🚀 **Interface futuriste activée !**\n\nDécouvrez ${result.partners.length} partenaires Modern Work dans une expérience visuelle immersive.`, 
            'bot', 
            ['🔍 Rechercher un partenaire spécifique', '📊 Voir tous les partenaires QRP', '🏠 Fermer l\'interface']
          );
        }
      } catch (error) {
        addMessage('❌ Erreur lors de la récupération des partenaires Modern Work', 'bot');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (suggestion === '🏠 Fermer l\'interface') {
      setShowFuturisticPartners(false);
      setFuturisticPartnersData(null);
      addMessage('✅ Interface futuriste fermée. Comment puis-je vous aider ?', 'bot', [
        '🏢 Voir partenaires Modern Work',
        '📊 Voir tous les partenaires QRP',
        '🔍 Rechercher un partenaire spécifique'
      ]);
      return;
    }
    
    if (suggestion === '❓ Comment ça marche ?') {
      const helpInfo = `❓ **COMMENT UTILISER LE SYSTÈME PARTENAIRES**\n\n` +
        `🔍 **Rechercher un partenaire:**\n` +
        `• Tapez directement l'ID du partenaire (ex: 3519836)\n` +
        `• Ou tapez le nom du partenaire\n\n` +
        `🏢 **Types de partenaires:**\n` +
        `• **QRP (Qualified Referral Partners)** - Partenaires de référence avec spécialisations\n` +
        `• **Standard** - Partenaires classiques\n\n` +
        `📋 **Spécialisations Modern Work:**\n` +
        `• 🔐 Security - Sécurité\n` +
        `• ☁️ Cloud Endpoints - Points de terminaison cloud\n` +
        `• 💬 Converged Communications - Communications convergées\n` +
        `• 💻 Modernize with Surface - Modernisation avec Surface\n` +
        `• 🛡️ Secure Productivity - Productivité sécurisée`;
      
      addMessage(helpInfo, 'bot', ['🔍 Rechercher un partenaire', '📊 Voir tous les partenaires QRP']);
      return;
    }
    
    if (suggestion.includes('🔍 Rechercher') || suggestion === '🔍 Rechercher un autre partenaire' || suggestion === '🔍 Rechercher un partenaire spécifique') {
      const searchInfo = `🔍 **RECHERCHER UN PARTENAIRE**\n\n` +
        `Pour rechercher un partenaire, tapez simplement son ID :\n\n` +
        `**Exemples d'IDs à tester :**\n` +
        `• **3519836** → Be Cloud (toutes capacités)\n` +
        `• **1977957** → EFISENS (toutes capacités)\n` +
        `• **1019430** → Adista (4/5 capacités)\n` +
        `• **1129016** → Crayon (spécialisé)\n` +
        `• **3278383** → COSMO CONSULT (Productivity)\n\n` +
        `💡 **Astuce :** Tapez juste le numéro (ex: 3519836) et appuyez sur Entrée`;
      
      addMessage(searchInfo, 'bot', ['📊 Voir tous les partenaires QRP', '🏢 Voir partenaires Modern Work', '❓ Comment ça marche ?']);
      return;
    }
    
    if (suggestion === '💼 Voir template co-sell') {
      const coSellTemplate = `💼 **TEMPLATE CO-SELL PARTENAIRE**\n\n` +
        `**Objet :** Collaboration Microsoft - Optimisons notre partenariat\n\n` +
        `**Corps du message :**\n\n` +
        `Bonjour [NOM_CONTACT],\n\n` +
        `Merci d'avoir accepté mon invitation.\n\n` +
        `Je me présente, BAYONNE Nicolas, en charge de l'accompagnement des PME chez Microsoft. J'ai souhaité vous contacter car nous avons des clients en commun, notamment [CLIENTS_COMMUNS], et je pense qu'il serait bénéfique d'échanger afin d'optimiser notre collaboration.\n\n` +
        `Notre mission est d'accompagner les entreprises dans leur transformation numérique en travaillant main dans la main avec nos partenaires. Nous privilégions les contrats CSP et veillons à soutenir nos clients sans jamais leur proposer de changement de partenaire.\n\n` +
        `J'aimerais voir comment nous pourrions nous aligner pour maximiser la valeur que nous leur apportons ensemble. Nous pourrions organiser un échange avec notre PCM (Partner Connection Manager) pour discuter des synergies possibles et des opportunités de collaboration.\n\n` +
        `Seriez-vous disponible pour un appel dans les prochains jours ?\n` +
        `Dans l'attente de votre retour,\n\n` +
        `Cordialement,\n` +
        `Nicolas BAYONNE\n` +
        `Microsoft - Accompagnement PME\n\n` +
        `📝 **Variables à personnaliser :**\n` +
        `• [NOM_CONTACT] - Nom du contact partenaire\n` +
        `• [CLIENTS_COMMUNS] - Liste des clients en commun\n\n` +
        `🏢 **Contexte :** Contrats CSP, PCM, transformation numérique`;
      
      addMessage(coSellTemplate, 'bot', ['🔍 Rechercher un autre partenaire', '📊 Voir tous les partenaires QRP', '📋 Copier le template']);
      return;
    }
    
    if (suggestion === '📋 Copier le template') {
      const templateText = `Bonjour [NOM_CONTACT],

Merci d'avoir accepté mon invitation.

Je me présente, BAYONNE Nicolas, en charge de l'accompagnement des PME chez Microsoft. J'ai souhaité vous contacter car nous avons des clients en commun, notamment [CLIENTS_COMMUNS], et je pense qu'il serait bénéfique d'échanger afin d'optimiser notre collaboration.

Notre mission est d'accompagner les entreprises dans leur transformation numérique en travaillant main dans la main avec nos partenaires. Nous privilégions les contrats CSP et veillons à soutenir nos clients sans jamais leur proposer de changement de partenaire.

J'aimerais voir comment nous pourrions nous aligner pour maximiser la valeur que nous leur apportons ensemble. Nous pourrions organiser un échange avec notre PCM (Partner Connection Manager) pour discuter des synergies possibles et des opportunités de collaboration.

Seriez-vous disponible pour un appel dans les prochains jours ?
Dans l'attente de votre retour,

Cordialement,
Nicolas BAYONNE
Microsoft - Accompagnement PME`;

      try {
        await navigator.clipboard.writeText(templateText);
        addMessage('✅ **Template copié !** Le template co-sell a été copié dans votre presse-papiers.', 'bot', ['🔍 Rechercher un autre partenaire', '💼 Voir template co-sell']);
      } catch (error) {
        addMessage('❌ Impossible de copier le template. Veuillez le sélectionner manuellement.', 'bot', ['💼 Voir template co-sell']);
      }
      return;
    }
    
    // Handle email validation and sending
    if (suggestion === '✅ Parfait, envoyer !' || suggestion === '✅ Valider l\'email' || suggestion === '✅ Email parfait, envoyer !') {
      console.log('🔍 Debug validation:', { 
        hasGeneratedEmail: !!generatedEmail, 
        hasRecipient: !!emailData.recipient,
        hasRecipientName: !!emailData.recipientName,
        emailData: emailData,
        conversationState: conversationState
      });
      
      // Check if we're in review state (email should be generated)
      if (conversationState !== 'review') {
        addMessage('⚠️ Veuillez d\'abord générer un email avant de le valider.', 'bot', [
          '🎯 Nouveau prospect',
          '📧 Suivi de réunion',
          '🔄 Relancer un client'
        ]);
        return;
      }
      
      // If no generatedEmail but we have basic data, try to find email content in messages
      let emailContent = generatedEmail;
      if (!emailContent) {
        const lastMessageWithEmail = messages.slice().reverse().find(msg => msg.emailContent);
        emailContent = lastMessageWithEmail?.emailContent;
      }
      
      if (!emailContent) {
        addMessage('❌ Aucun email généré à envoyer. Le contenu semble avoir été perdu.', 'bot', [
          '🔄 Régénérer l\'email',
          '🎯 Créer un nouvel email'
        ]);
        return;
      }
      
      const recipient = emailData.recipient || emailData.recipientName;
      if (!recipient) {
        addMessage('❌ Aucun destinataire spécifié. Veuillez d\'abord indiquer le destinataire.', 'bot', [
          '📧 Spécifier le destinataire',
          '🔄 Recommencer'
        ]);
        return;
      }
      
      // Show email sending options
      addMessage(
        `🚀 **Email prêt à envoyer !**\n\n` +
        `📧 **Destinataire :** ${recipient}\n` +
        `👤 **Contact :** ${emailData.recipientName || 'Non spécifié'}\n` +
        `🏢 **Entreprise :** ${emailData.company || 'Non spécifiée'}\n\n` +
        `**Comment souhaitez-vous procéder ?**`,
        'bot',
        [
          '📤 Envoyer maintenant',
          '📋 Copier l\'email',
          '👀 Prévisualiser'
        ]
      );
      return;
    }
    
    // Handle direct email sending
    if (suggestion === '📤 Envoyer maintenant') {
      sendDirectEmail();
      return;
    }
    
    // Handle email scheduling
    if (suggestion === '📅 Programmer l\'envoi') {
      openScheduler();
      return;
    }
    
    // Handle email copying
    if (suggestion === '📋 Copier l\'email') {
      copyEmail();
      return;
    }
    
    // Handle email preview
    if (suggestion === '👀 Prévisualiser') {
      // Try to find email content from various sources
      let emailContent = generatedEmail;
      if (!emailContent) {
        const lastMessageWithEmail = messages.slice().reverse().find(msg => msg.emailContent);
        emailContent = lastMessageWithEmail?.emailContent;
      }
      
      if (emailContent && (emailContent.content || emailContent.subject)) {
        const subject = emailContent.subject || 'Pas de sujet';
        const content = emailContent.content || emailContent || 'Pas de contenu';
        
        addMessage(
          `👀 **APERÇU DE L'EMAIL**\n\n` +
          `📧 **Sujet :** ${subject}\n\n` +
          `📝 **Contenu :**\n${content}`,
          'bot', 
          [
            '📤 Envoyer maintenant',
            '📋 Copier l\'email',
            '✏️ Modifier l\'email'
          ]
        );
      } else {
        addMessage('❌ Impossible d\'afficher l\'aperçu. Le contenu de l\'email semble avoir été perdu.', 'bot', [
          '🔄 Régénérer l\'email',
          '🎯 Créer un nouvel email'
        ]);
      }
      return;
    }
    
    // Handle copy email
    if (suggestion === '📋 Copier l\'email') {
      copyEmail();
      return;
    }
    
    // Handle email modification  
    if (suggestion === '✏️ Modifier l\'email') {
      addMessage('✏️ **Modification de l\'email**\n\nQue souhaitez-vous modifier ?', 'bot', [
        '🎨 Changer le ton',
        '📝 Modifier le contenu',
        '📧 Changer le destinataire',
        '🔄 Recommencer complètement'
      ]);
      return;
    }
    
    // Fallback - Default behavior for other suggestions
    // Pass metadata to backend for conversational system
    try {
      sendMessage(suggestionText, suggestionMetadata);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      addMessage('❌ Une erreur s\'est produite. Voulez-vous recommencer ?', 'bot', [
        '🔄 Recommencer',
        '🎯 Nouveau prospect',
        '📧 Suivi de réunion'
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyEmail = async () => {
    if (!generatedEmail) return;
    
    try {
      await navigator.clipboard.writeText(generatedEmail.content);
      toast.success('Email copié dans le presse-papier !');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const sendDirectEmail = async () => {
    if (!generatedEmail || !emailData.recipient) return;

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailData.recipient,
          subject: generatedEmail.subject,
          content: generatedEmail.content
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(`Email envoyé avec succès à ${emailData.recipient} !`);
        addMessage('✅ Email envoyé avec succès ! Souhaitez-vous créer un autre email ?', 'bot', [
          '🎯 Créer un nouvel email',
          '📊 Voir les analytics',
          '🔄 Programmer un suivi'
        ]);
      } else {
        toast.error(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast.error('Erreur de connexion lors de l\'envoi');
    }
  };
  
  const openScheduler = () => {
    if (!generatedEmail) {
      toast.error('Aucun email généré à programmer');
      return;
    }
    setShowScheduler(true);
  };
  
  const handleScheduleEmail = (scheduleInfo) => {
    addMessage(`📅 Email programmé pour ${scheduleInfo.datetime.toLocaleString('fr-FR')} !\n\n✨ Envoi optimisé avec ${scheduleInfo.confidence}% de confiance`, 'bot', [
      '🎯 Créer un autre email',
      '📊 Voir les emails programmés',
      '🔄 Programmer un suivi'
    ]);
  };
  
  const autoSaveDraft = async () => {
    try {
      const draftData = {
        conversationState,
        emailData,
        generatedEmail,
        messages,
        autoSaved: true
      };
      
      await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          draftData
        })
      });
      
      setLastSaved(new Date());
    } catch (error) {
      console.warn('Auto-save failed:', error);
    }
  };

  // Partner lookup function
  const lookupPartner = async (partnerId) => {
    if (!partnerId?.trim()) return;
    
    setIsLoading(true);
    try {
      // First try regular partners
      let response = await fetch(`/api/partners?id=${encodeURIComponent(partnerId)}`);
      let result = await response.json();
      
      // If not found in regular partners, try QRP partners
      if (!result.success || !result.partner) {
        response = await fetch(`/api/partners?qrp=true&id=${encodeURIComponent(partnerId)}`);
        result = await response.json();
      }
      
      if (result.success && result.partner) {
        setPartnerData(result.partner);
        setShowPartnerCard(true);
        
        // Add partner info to email data
        setEmailData(prev => ({
          ...prev,
          partner: result.partner
        }));
        
        // Enhanced bot response with QRP info - Information display only
        let partnerInfo = `🎯 **INFORMATIONS PARTENAIRE**\n\n`;
        partnerInfo += `**${result.partner.displayName || result.partner.partnerOneName}**\n`;
        partnerInfo += `🆔 **ID:** ${result.partner.partnerOneId}\n\n`;
        
        // Add QRP-specific information
        if (result.type === 'QRP') {
          partnerInfo += `🏢 **Type:** Partenaire QRP (Qualified Referral Partner)\n`;
          partnerInfo += `📋 **Pilier:** ${result.partner.pillar}\n\n`;
          
          if (result.partner.capabilities) {
            partnerInfo += `⚡ **Niveau de capacité:**\n${result.partner.capabilities}\n\n`;
          }
          
          if (result.partner.specializations) {
            partnerInfo += `🔧 **SPÉCIALISATIONS:**\n`;
            const specs = Object.entries(result.partner.specializations)
              .map(([key, value]) => {
                const specNames = {
                  security: '🔐 Security',
                  cloudEndpoints: '☁️ Cloud Endpoints',
                  convergedCommunications: '💬 Converged Communications', 
                  modernizeWithSurface: '💻 Modernize with Surface',
                  secureProductivity: '🛡️ Secure Productivity'
                };
                const status = value ? '✅' : '❌';
                return `${status} ${specNames[key] || key}`;
              });
            partnerInfo += specs.join('\n') + '\n\n';
          }
          
          if (result.partner.userRequirements && result.partner.userRequirements !== 'Standard requirements') {
            partnerInfo += `👥 **Exigences utilisateur:**\n${result.partner.userRequirements}\n\n`;
          }
          
          if (result.partner.coverage && result.partner.coverage !== 'Regional coverage') {
            partnerInfo += `🌍 **Couverture:**\n${result.partner.coverage}\n\n`;
          }
        } else {
          partnerInfo += `🏢 **Type:** Partenaire Standard\n\n`;
          if (result.partner.aliases?.length > 1) {
            partnerInfo += `🔗 **Autres IDs associés:**\n${result.partner.aliases.slice(0, 5).join(', ')}${result.partner.aliases.length > 5 ? '...' : ''}\n\n`;
          }
        }
        
        partnerInfo += `ℹ️ Vous pouvez rechercher d'autres partenaires en tapant leur ID ou nom.`;
        
        addMessage(
          partnerInfo,
          'bot',
          [
            '💼 Voir template co-sell',
            '🔍 Rechercher un autre partenaire',
            '📊 Voir tous les partenaires QRP',
            '🏢 Voir partenaires Modern Work'
          ]
        );
      } else {
        addMessage(
          `❌ **Partenaire non trouvé** pour l'ID "${partnerId}"\n\n` +
          (result.suggestions?.length ? 
            `**Suggestions:**\n${result.suggestions.map(s => `• ${s.name} (${s.id})`).join('\n')}` : 
            'Vérifiez l\'ID et réessayez ou tapez le nom du partenaire.'
          ),
          'bot',
          ['🔍 Essayer un autre ID', '📝 Continuer sans partenaire']
        );
      }
    } catch (error) {
      addMessage('❌ Erreur lors de la recherche du partenaire. Veuillez réessayer.', 'bot');
    } finally {
      setIsLoading(false);
    }
  };

  // Detect partner ID in message
  const detectPartnerIdInMessage = async (message) => {
    console.log('🔍 Checking message for partner ID:', message);
    
    // Enhanced patterns for partner IDs
    const patterns = [
      /(?:^|\s)(\d{7,8})(?:\s|$)/i,  // 7-8 digit IDs
      /(?:^|\s)(\d{6})(?:\s|$)/i,    // 6 digit IDs
      /(?:^|\s)(\d{4,8})(?:\s|$)/i,  // 4-8 digit IDs (broader range)
      /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i // UUID pattern
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        const potentialId = match[1];
        console.log('🎯 Found potential partner ID:', potentialId);
        await lookupPartner(potentialId);
        return true;
      }
    }
    
    // Also check if message is purely numeric (user just typed an ID)
    if (/^\d{4,8}$/.test(message.trim())) {
      console.log('🎯 Message is pure numeric ID:', message.trim());
      await lookupPartner(message.trim());
      return true;
    }
    
    console.log('❌ No partner ID pattern found');
    return false;
  };

  // Detect partner-related keywords for automatic routing
  const detectPartnerKeywords = (message) => {
    console.log('🔍 Checking message for partner keywords:', message);
    
    const messageLower = message.toLowerCase();
    
    // Exclude messages that are clearly about email creation or solutions
    const emailIndicators = [
      'envoyer', 'email', 'mail', 'présenter', 'solutions', 'prospect', 'client',
      'offre', 'devis', 'réunion', 'contact', 'premier', 'nouveau'
    ];
    
    const hasEmailContext = emailIndicators.some(indicator => messageLower.includes(indicator));
    
    if (hasEmailContext) {
      console.log('🚫 Email context detected, skipping partner detection');
      return false;
    }
    
    // Only detect explicit partner queries
    const explicitPartnerKeywords = [
      // Core partner terms - must be explicit
      'qrp', 'partner', 'partenaire', 'partenaires',
      // Partner actions
      'co-sell', 'cosell', 'collaboration partenaire', 'referral',
      // Partner queries - explicit only
      'voir tous les partenaires', 'liste partenaires', 'rechercher partenaire', 'trouver partenaire',
      // Partner names (common ones)
      'be cloud', 'efisens', 'adista', 'crayon', 'cosmo'
    ];
    
    // Specific partner query patterns
    const partnerPatterns = [
      /qui sont les partenaires/i,
      /quels partenaires/i,
      /liste des partenaires/i,
      /partenaires qrp/i,
      /partenaires modern work/i,
      /informations partenaires/i,
      /cherche partenaire/i
    ];
    
    // Check explicit keywords
    for (const keyword of explicitPartnerKeywords) {
      if (messageLower.includes(keyword)) {
        console.log('🎯 Found explicit partner keyword:', keyword);
        
        // Handle specific partner queries automatically
        if (messageLower.includes('qrp') || messageLower.includes('voir tous') || messageLower.includes('liste partenaires')) {
          handleSuggestionClick('📊 Voir tous les partenaires QRP');
          return true;
        }
        
        if (messageLower.includes('modern work partenaires')) {
          handleSuggestionClick('🏢 Voir partenaires Modern Work');
          return true;
        }
        
        if (messageLower.includes('rechercher partenaire') || messageLower.includes('trouver partenaire')) {
          handleSuggestionClick('🔍 Rechercher un partenaire spécifique');
          return true;
        }
        
        if (messageLower.includes('template') || messageLower.includes('co-sell') || messageLower.includes('cosell')) {
          handleSuggestionClick('💼 Voir template co-sell');
          return true;
        }
        
        // Generic partner query - show help
        addMessage(
          `🤖 **Détection automatique : Requête partenaires**\n\n` +
          `J'ai détecté que vous cherchez des informations sur les partenaires. Voici les options disponibles :`,
          'bot',
          [
            '📊 Voir tous les partenaires QRP',
            '🏢 Voir partenaires Modern Work',
            '🔍 Rechercher un partenaire spécifique',
            '❓ Comment ça marche ?'
          ]
        );
        setIsLoading(false);
        return true;
      }
    }
    
    // Check partner patterns
    for (const pattern of partnerPatterns) {
      if (pattern.test(message)) {
        console.log('🎯 Found partner pattern:', pattern);
        handleSuggestionClick('📊 Voir tous les partenaires QRP');
        return true;
      }
    }
    
    console.log('❌ No explicit partner keywords found');
    return false;
  };
  
  const manualSaveDraft = async () => {
    try {
      const draftData = {
        conversationState,
        emailData,
        generatedEmail,
        messages,
        autoSaved: false
      };
      
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save',
          draftData
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setLastSaved(new Date());
        toast.success('Brouillon sauvegardé !');
      } else {
        toast.error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      toast.error('Erreur de connexion');
    }
  };
  
  const handleRecoverDraft = (draftData) => {
    setConversationState(draftData.conversationState);
    setEmailData(draftData.emailData);
    setGeneratedEmail(draftData.generatedEmail);
    setMessages(draftData.messages);
    toast.success('Conversation restaurée !');
  };
  
  const handleSelectSmartRecipient = (recipientData) => {
    setEmailData(prev => ({ ...prev, ...recipientData }));
    setShowRecipientSuggestions(false);
    
    // Add confirmation message
    addMessage(`✓ Contact sélectionné : **${recipientData.recipientName}** (${recipientData.company})\n\n📧 Email: ${recipientData.recipient}\n\nPuis-je générer l'email maintenant ?`, 'bot', [
      '✅ Générer l\'email maintenant',
      '✏️ Modifier les informations',
      '📊 Voir l\'historique de ce contact'
    ]);
  };

  const getTransitionMessage = (fromState, toState, emailData) => {
    const transitions = {
      'initial_to_gathering_info': `🎯 **Objectif identifié !**

🔍 **Passage en mode collecte d'informations...**`,
      
      'gathering_info_to_generating': `✅ **Informations collectées !**

⚡ **Génération de l'email personnalisé en cours...**
• Adaptation pour ${emailData.recipientName || 'votre contact'}
• Contexte ${emailData.company || 'entreprise'}
• Ton ${emailData.purpose || 'approprié'}

✨ *Quelques instants...*`,
      
      'generating_to_review': `🎉 **Email créé !**

📧 **Prêt pour validation et envoi**`,
      
      'review_to_ready': `🚀 **Email finalisé !**

✅ **Prêt pour l'envoi**`,
      
      'any_to_help': `💡 **Mode assistance activé**

🤖 **Je suis là pour vous aider !**`
    };

    const transitionKey = `${fromState}_to_${toState}`;
    const anyTransitionKey = `any_to_${toState}`;
    
    return transitions[transitionKey] || transitions[anyTransitionKey] || null;
  };

  const resetConversation = () => {
    setMessages([{
      id: 1,
      type: 'bot',
      content: '🔄 Parfait ! Créons un nouvel email. De quoi avez-vous besoin cette fois ?',
      timestamp: new Date(),
      suggestions: [
        '🎯 Nouveau prospect à contacter',
        '📧 Suivi de réunion', 
        '💰 Proposition commerciale',
        '🔄 Relance client'
      ]
    }]);
    setConversationState('initial');
    setEmailData({});
    setGeneratedEmail(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Assistant Email Intelligent</h2>
              <p className="text-sm text-green-100">
                État: {chatStates[conversationState]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFollowUpManager(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Séquences automatiques"
            >
              <GitBranch className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowRecipientSuggestions(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Suggestions de contacts"
            >
              <Users className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDraftManager(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Brouillons"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowFAQ(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="FAQ et Guide d'utilisation"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowOCR(true)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Extraire du texte d'une image (OCR)"
            >
              <FileImage className="w-4 h-4" />
            </button>
            {lastPreprocessingData && (
              <button
                onClick={() => setShowDataQuality(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors relative"
                title="Qualité des données"
              >
                <BarChart3 className="w-4 h-4" />
                {lastPreprocessingData.quality?.score < 70 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                )}
              </button>
            )}
            <button
              onClick={manualSaveDraft}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Sauvegarder"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={resetConversation}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Nouveau chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onToggle}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversation Status Card - Only show for review state to avoid clutter */}
        {conversationState === 'review' && (
          <div className="p-4 bg-white border-b">
            <ConversationStatusCard 
              conversationState={conversationState}
              emailData={emailData}
              onAction={(action) => {
                if (action === 'preview') {
                  // Handle preview
                  console.log('Preview requested');
                } else if (action === 'send') {
                  handleSuggestionClick('✅ Parfait, envoyer !');
                }
              }}
            />
          </div>
        )}

        {/* Enhanced Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <EnhancedChatInterface 
            messages={messages.map(msg => ({
              ...msg,
              sender: msg.type === 'user' ? 'user' : 'assistant',
              emailContent: msg.emailContent
            }))}
            onSendMessage={(message) => {
              sendMessage(message);
            }}
            conversationState={conversationState}
            emailData={{
              ...emailData,
              generatedEmail: generatedEmail?.content || generatedEmail
            }}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* Smart Email Scheduler */}
      {showScheduler && (
        <SmartEmailScheduler
          emailContent={generatedEmail}
          recipient={emailData.recipient || 'Destinataire'}
          onSchedule={handleScheduleEmail}
          onClose={() => setShowScheduler(false)}
        />
      )}
      
      {/* Draft Manager */}
      {showDraftManager && (
        <DraftManager
          isOpen={showDraftManager}
          onClose={() => setShowDraftManager(false)}
          onRecoverDraft={handleRecoverDraft}
        />
      )}
      
      {/* Smart Recipient Suggestions */}
      {showRecipientSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Choisir un destinataire</h2>
              <button
                onClick={() => setShowRecipientSuggestions(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <SmartRecipientSuggestions
                currentEmailData={emailData}
                onSelectRecipient={handleSelectSmartRecipient}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Auto Follow-Up Manager */}
      {showFollowUpManager && (
        <AutoFollowUpManager
          isOpen={showFollowUpManager}
          onClose={() => setShowFollowUpManager(false)}
          initialRecipient={emailData.recipient}
        />
      )}
      
      {/* Partner Information Card */}
      {showPartnerCard && partnerData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Informations Partenaire</h2>
              </div>
              <button
                onClick={() => setShowPartnerCard(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {partnerData.displayName}
                </h3>
                <div className="text-sm text-gray-600">
                  ID Principal: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{partnerData.canonicalId}</span>
                </div>
              </div>
              
              {partnerData.aliases && partnerData.aliases.length > 1 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Autres IDs associés:</div>
                  <div className="flex flex-wrap gap-1">
                    {partnerData.aliases.slice(0, 5).map((alias, idx) => (
                      <span key={idx} className="text-xs bg-white px-2 py-1 rounded border font-mono">
                        {alias}
                      </span>
                    ))}
                    {partnerData.aliases.length > 5 && (
                      <span className="text-xs text-gray-500">+{partnerData.aliases.length - 5} autres</span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPartnerCard(false);
                    handleSuggestionClick('📧 Email de prospection partenaire');
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Prospection
                </button>
                
                <button
                  onClick={() => {
                    setShowPartnerCard(false);
                    handleSuggestionClick('📋 Email de suivi partenaire');
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                >
                  <Clock className="w-4 h-4" />
                  Suivi
                </button>
                
                <button
                  onClick={() => {
                    setShowPartnerCard(false);
                    handleSuggestionClick('💼 Proposition de co-sell');
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                >
                  <Target className="w-4 h-4" />
                  Co-sell
                </button>
                
                <button
                  onClick={() => {
                    setShowPartnerCard(false);
                    handleSuggestionClick('📊 Rapport d\'activité partenaire');
                  }}
                  className="flex items-center gap-2 px-4 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Rapport
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => setShowPartnerCard(false)}
                  className="w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                >
                  Fermer et continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* FAQ Component */}
      {showFAQ && (
        <EmailChatbotFAQ
          isOpen={showFAQ}
          onClose={() => setShowFAQ(false)}
        />
      )}

      {/* Futuristic Partner Display */}
      {showFuturisticPartners && futuristicPartnersData && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4">
          <div className="w-full max-w-7xl max-h-[95vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => {
                  setShowFuturisticPartners(false);
                  setFuturisticPartnersData(null);
                }}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-red-500/20 hover:bg-red-500/30 border border-red-400/50 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <FuturisticPartnerDisplay partnersData={futuristicPartnersData} />
            </div>
          </div>
        </div>
      )}

      {/* OCR Modal */}
      {showOCR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Extraire du texte d'une image</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Uploadez une image pour extraire automatiquement le texte qu'elle contient
                </p>
              </div>
              <button
                onClick={() => setShowOCR(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <OCRUploader 
                onTextExtracted={handleOCRTextExtracted}
                className=""
              />
            </div>
          </div>
        </div>
      )}

      {/* Data Quality Modal */}
      {showDataQuality && lastPreprocessingData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Analyse de la qualité des données
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Évaluation détaillée des informations extraites et suggestions d'amélioration
                </p>
              </div>
              <button
                onClick={() => setShowDataQuality(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <DataQualityIndicator preprocessingData={lastPreprocessingData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailChatbot;