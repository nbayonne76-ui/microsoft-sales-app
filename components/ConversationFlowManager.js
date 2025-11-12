/**
 * Gestionnaire de flux de conversation intelligent
 * Améliore l'expérience utilisateur avec des transitions fluides et un contexte maintenu
 */

export class ConversationFlowManager {
  constructor() {
    this.conversationMemory = new Map();
    this.userPatterns = new Map();
    this.sessionStartTime = new Date();
  }

  // Messages d'accueil contextuels selon l'heure
  generateWelcomeMessage() {
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

    return {
      content: `${emoji} ${greeting} Nicolas !

Je suis votre assistant email intelligent. ${timeContext}

🎯 **Qu'allons-nous créer aujourd'hui ?**
• Email de prospection pour Azure
• Suivi de réunion client  
• Proposition commerciale
• Relance diplomatique

💡 **Ou dites-moi directement :** "Martin, TIXTO, martin@tixto.com"`,
      suggestions: [
        '🎯 Nouveau prospect Azure',
        '📧 Suivi de réunion',
        '💰 Proposition commerciale', 
        '🔄 Relance client'
      ],
      metadata: {
        timeOfDay: hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening',
        isWeekend,
        personalizedGreeting: true
      }
    };
  }

  // Gestion de la continuité de conversation
  maintainConversationContext(userId, message, conversationState, emailData) {
    const contextKey = userId || 'anonymous';
    
    // Récupérer le contexte précédent
    let context = this.conversationMemory.get(contextKey) || {
      previousEmails: [],
      preferences: {},
      commonPatterns: [],
      interruptionCount: 0,
      lastActivity: new Date()
    };

    // Détecter les interruptions/changements de cap
    const interruption = this.detectConversationInterruption(message, conversationState, context);
    
    if (interruption.isInterruption) {
      context.interruptionCount++;
      return this.handleConversationInterruption(interruption, context);
    }

    // Maintenir le contexte
    this.updateContext(context, message, conversationState, emailData);
    this.conversationMemory.set(contextKey, context);

    return null; // Pas d'interruption, continuer normalement
  }

  // Détection des interruptions de conversation
  detectConversationInterruption(message, currentState, context) {
    const messageLower = message.toLowerCase();
    
    // Mots-clés d'interruption
    const interruptionKeywords = [
      'stop', 'arrêt', 'attends', 'wait', 'non', 'plutôt', 'finalement',
      'en fait', 'actually', 'instead', 'change', 'autre', 'different'
    ];

    // Nouveaux démarrages en cours de conversation
    const restartKeywords = [
      'nouveau', 'autre', 'different', 'recommencer', 'restart', 'fresh'
    ];

    // Changements de type d'email
    const emailTypeChange = [
      'prospection', 'suivi', 'offre', 'relance', 'commercial'
    ];

    let interruptionType = null;
    let confidence = 0;

    // Détecter le type d'interruption - mais seulement si on n'est pas dans l'état initial
    if (currentState === 'initial') {
      // Dans l'état initial, ne pas déclencher d'interruptions - c'est normal de dire "nouveau"
      return {
        isInterruption: false,
        type: null,
        confidence: 0,
        originalMessage: message
      };
    }

    // Messages qui contiennent des informations de contact ne sont pas des interruptions
    const hasContactInfo = /[a-zA-Z].*[a-zA-Z].*,/.test(messageLower) || /@/.test(messageLower);
    if (hasContactInfo) {
      return {
        isInterruption: false,
        type: null,
        confidence: 0,
        originalMessage: message
      };
    }

    if (restartKeywords.some(keyword => messageLower.includes(keyword))) {
      interruptionType = 'restart';
      confidence = 0.8;
    } else if (interruptionKeywords.some(keyword => messageLower.includes(keyword))) {
      interruptionType = 'correction';
      confidence = 0.7;
    } else if (emailTypeChange.some(keyword => messageLower.includes(keyword)) && currentState !== 'initial') {
      interruptionType = 'type_change';
      confidence = 0.6;
    }

    // Vérifier si l'utilisateur donne de nouvelles infos complètes (format email complet)
    const emailPattern = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)?,\s*[a-zA-Z\s]+,\s*[\w.-]+@[\w.-]+\.\w+$/;
    if (emailPattern.test(message.trim()) && currentState !== 'initial') {
      interruptionType = 'new_email';
      confidence = 0.9;
    }

    return {
      isInterruption: confidence > 0.5,
      type: interruptionType,
      confidence,
      originalMessage: message
    };
  }

  // Gestion des interruptions avec élégance
  handleConversationInterruption(interruption, context) {
    const responses = {
      restart: {
        message: `🔄 **Pas de problème !** 

Je comprends que vous voulez recommencer. Votre progression précédente est sauvegardée au cas où.

🎯 **Nouveau projet d'email :**`,
        suggestions: [
          '🎯 Nouveau prospect',
          '📧 Suivi réunion',
          '💰 Proposition commerciale',
          '↩️ Revenir au précédent'
        ],
        action: 'reset_to_initial'
      },
      
      correction: {
        message: `✋ **Un instant !**

Je vois que vous voulez corriger quelque chose. Que souhaitez-vous modifier ?`,
        suggestions: [
          '👤 Changer le destinataire', 
          '🏢 Changer l\'entreprise',
          '📧 Changer le type d\'email',
          '🔄 Tout recommencer'
        ],
        action: 'wait_for_correction'
      },
      
      type_change: {
        message: `💡 **Changement de type d'email détecté !**

Voulez-vous changer le type d'email en cours ou créer un nouveau projet ?`,
        suggestions: [
          '🔄 Changer le type actuel',
          '➕ Nouveau projet',
          '↩️ Continuer l\'actuel',
          '💾 Sauvegarder et nouveau'
        ],
        action: 'handle_type_change'
      },
      
      new_email: {
        message: `🎯 **Nouvelles informations détectées !**

Je vois que vous voulez créer un email pour : "${interruption.originalMessage}"

Dois-je remplacer l'email en cours ou créer un nouveau projet ?`,
        suggestions: [
          '✅ Utiliser ces nouvelles infos',
          '➕ Nouveau projet séparé', 
          '📋 Conserver les deux',
          '↩️ Revenir au précédent'
        ],
        action: 'handle_new_email_data'
      }
    };

    const response = responses[interruption.type];
    
    return {
      response: response.message,
      suggestions: response.suggestions,
      metadata: {
        interruption: true,
        interruptionType: interruption.type,
        confidence: interruption.confidence,
        action: response.action,
        originalMessage: interruption.originalMessage
      }
    };
  }

  // Messages de transition fluides entre les étapes
  generateTransitionMessage(fromState, toState, emailData) {
    const transitions = {
      'initial_to_gathering': {
        message: `✅ **Parfait ! Direction comprise.**

🔍 **Collecte des informations en cours...**

Pour créer l'email parfait, donnez-moi :`,
        suggestions: this.generateContextualSuggestions('gathering_info', emailData)
      },
      
      'gathering_to_generating': {
        message: `🎯 **Informations collectées !**

⚡ **Génération de l'email en cours...**
• Personnalisation pour ${emailData.recipientName || 'votre contact'}
• Adaptation au contexte ${emailData.company || 'entreprise'}  
• Optimisation du ton et du message

✨ *Quelques secondes...*`,
        showProgress: true
      },
      
      'generating_to_review': {
        message: `🎉 **Email créé avec succès !**

📧 **Prêt pour ${emailData.recipientName || 'votre contact'}**
${emailData.company ? `🏢 Contexte: ${emailData.company}` : ''}

🎨 Vous pouvez maintenant :`,
        suggestions: [
          '✅ Parfait, envoyer !',
          '✏️ Modifier le ton',
          '📝 Ajuster le contenu',
          '🔄 Créer un autre'
        ]
      }
    };

    const transitionKey = `${fromState}_to_${toState}`;
    return transitions[transitionKey] || null;
  }

  // Messages de confirmation interactifs
  generateConfirmationMessage(action, emailData) {
    const confirmations = {
      send_email: {
        message: `📤 **Confirmation d'envoi**

📧 **Destinataire :** ${emailData.recipientName} (${emailData.company})
📮 **Email :** ${emailData.recipient}
📋 **Type :** ${emailData.purpose}

🚀 **Envoyer maintenant ?**`,
        suggestions: [
          '✅ Envoyer maintenant',
          '⏰ Programmer envoi',
          '✏️ Modifier avant envoi',
          '❌ Annuler'
        ],
        requiresConfirmation: true
      },
      
      change_tone: {
        message: `🎨 **Modification du ton**

📝 **Email actuel :** ${emailData.purpose}
🎭 **Ton actuel :** ${this.getToneLabel(emailData.tone)}

**Quel nouveau ton voulez-vous ?**`,
        suggestions: [
          '👔 Plus formel',
          '😊 Plus amical',
          '🚨 Plus urgent',
          '🤙 Plus décontracté'
        ]
      },
      
      restart_conversation: {
        message: `🔄 **Recommencer la conversation**

⚠️ **Attention :** Votre email en cours sera perdu (sauf si sauvegardé)

Voulez-vous vraiment recommencer ?`,
        suggestions: [
          '💾 Sauvegarder et recommencer',
          '🔄 Recommencer sans sauvegarder', 
          '↩️ Continuer l\'actuel',
          '📋 Voir mes brouillons'
        ],
        requiresConfirmation: true
      }
    };

    return confirmations[action] || null;
  }

  // Suggestions contextuelles intelligentes
  generateContextualSuggestions(state, emailData) {
    const suggestions = [];
    
    switch (state) {
      case 'gathering_info':
        if (!emailData.recipientName) {
          suggestions.push('👤 "Martin Dupont"', '👤 "Sophie Martin"');
        }
        if (!emailData.company) {
          suggestions.push('🏢 "Microsoft France"', '🏢 "TechCorp"');
        }
        if (!emailData.recipient && emailData.recipientName) {
          const firstName = emailData.recipientName.split(' ')[0].toLowerCase();
          suggestions.push(`📧 "${firstName}@exemple.com"`);
        }
        break;
        
      case 'review':
        suggestions.push(
          '✅ Parfait !',
          '🎨 Changer le ton',
          '📝 Plus court',
          '🔄 Nouveau'
        );
        break;
    }
    
    return suggestions;
  }

  // Feedback en temps réel pendant la saisie
  generateTypingFeedback(currentInput, expectedFormat, state) {
    if (state !== 'gathering_info') return null;

    const input = currentInput.trim();
    const feedback = {
      isValid: false,
      suggestions: [],
      helpText: '',
      confidence: 0
    };

    // Pattern de format attendu : "Prénom Nom, Entreprise, email@domaine.com"
    const parts = input.split(',').map(p => p.trim());
    
    if (parts.length === 1 && parts[0].length > 2) {
      // Juste un nom
      feedback.helpText = '👤 Nom détecté. Ajoutez ", Entreprise"';
      feedback.suggestions = [`${parts[0]}, Microsoft`, `${parts[0]}, TechCorp`];
      feedback.confidence = 0.3;
    } else if (parts.length === 2) {
      // Nom + Entreprise
      feedback.helpText = '🏢 Nom et entreprise OK. Ajoutez ", email@domaine.com" (optionnel)';
      const firstName = parts[0].split(' ')[0].toLowerCase();
      const company = parts[1].toLowerCase().replace(/\s+/g, '');
      feedback.suggestions = [`${input}, ${firstName}@${company}.com`];
      feedback.confidence = 0.7;
      feedback.isValid = true;
    } else if (parts.length === 3) {
      // Format complet
      const emailPattern = /^[\w.-]+@[\w.-]+\.\w+$/;
      if (emailPattern.test(parts[2])) {
        feedback.helpText = '✅ Format complet et valide !';
        feedback.confidence = 1.0;
        feedback.isValid = true;
      } else {
        feedback.helpText = '❌ Format email incorrect. Ex: nom@domaine.com';
        feedback.confidence = 0.5;
      }
    }

    return feedback;
  }

  // Mise à jour du contexte utilisateur
  updateContext(context, message, state, emailData) {
    context.lastActivity = new Date();
    context.messageCount = (context.messageCount || 0) + 1;
    
    // Analyser les patterns de l'utilisateur
    if (message.length < 10) {
      context.prefersShortMessages = (context.prefersShortMessages || 0) + 1;
    }
    
    if (emailData.purpose) {
      context.commonPurposes = context.commonPurposes || {};
      context.commonPurposes[emailData.purpose] = (context.commonPurposes[emailData.purpose] || 0) + 1;
    }

    // Garder un historique des emails créés
    if (state === 'review' && emailData.recipientName) {
      context.previousEmails.push({
        recipient: emailData.recipientName,
        company: emailData.company,
        purpose: emailData.purpose,
        timestamp: new Date()
      });
      
      // Limiter l'historique à 10 emails
      if (context.previousEmails.length > 10) {
        context.previousEmails = context.previousEmails.slice(-10);
      }
    }
  }

  // Labels des tons
  getToneLabel(tone) {
    const labels = {
      formal: 'Professionnel formel',
      professional_friendly: 'Professionnel amical',
      casual_expert: 'Décontracté expert', 
      urgent: 'Urgent',
      introduction_fy25: 'Introduction FY25/26'
    };
    return labels[tone] || tone;
  }

  // Nettoyage de la mémoire (à appeler périodiquement)
  cleanupMemory() {
    const oneHour = 60 * 60 * 1000;
    const now = new Date();
    
    for (const [key, context] of this.conversationMemory.entries()) {
      if (now - context.lastActivity > oneHour) {
        this.conversationMemory.delete(key);
      }
    }
  }
}

export default ConversationFlowManager;