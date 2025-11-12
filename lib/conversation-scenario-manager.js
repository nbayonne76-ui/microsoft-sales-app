/**
 * Conversation Scenario Manager
 *
 * Manages multi-turn conversational flows with anticipatory responses
 * and context collection for email generation.
 */

import { conversationalScenarios } from './conversational-scenarios.js';

export class ConversationScenarioManager {
  constructor() {
    this.activeSessions = new Map(); // sessionId -> session state
  }

  /**
   * Start a new conversation session
   */
  startSession(sessionId, scenarioId) {
    const scenario = conversationalScenarios.getScenario(scenarioId);
    if (!scenario) {
      throw new Error(`Scenario ${scenarioId} not found`);
    }

    const session = {
      sessionId,
      scenarioId,
      currentNode: 'entry',
      conversationPath: [],
      collectedContext: {},
      startTime: new Date(),
      messageCount: 0
    };

    this.activeSessions.set(sessionId, session);

    // Return initial bot message
    return this.generateBotResponse(session, scenario.entry.bot);
  }

  /**
   * Process user message and advance conversation
   */
  processUserMessage(sessionId, userMessage, userResponse = null) {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return {
        error: 'Session not found. Please start a new conversation.',
        shouldRestart: true
      };
    }

    session.messageCount++;

    const scenario = conversationalScenarios.getScenario(session.scenarioId);
    if (!scenario) {
      return {
        error: 'Scenario configuration error',
        shouldRestart: true
      };
    }

    // Handle different types of user responses
    const responseType = this.classifyUserResponse(userMessage, userResponse);

    switch (responseType.type) {
      case 'quick_reply':
        return this.handleQuickReply(session, scenario, responseType.value, responseType.metadata);

      case 'anticipatory_question':
        return this.handleAnticipatoryQuestion(session, scenario, responseType.value);

      case 'text_input':
        return this.handleTextInput(session, scenario, userMessage);

      case 'back_navigation':
        return this.handleBackNavigation(session, scenario);

      default:
        return this.handleFreeformMessage(session, scenario, userMessage);
    }
  }

  /**
   * Classify the type of user response
   */
  classifyUserResponse(userMessage, userResponse) {
    // If userResponse object is provided (from quick reply buttons)
    if (userResponse && typeof userResponse === 'object') {
      if (userResponse.type === 'question') {
        return {
          type: 'anticipatory_question',
          value: userResponse.value
        };
      }

      if (userResponse.type === 'back') {
        return {
          type: 'back_navigation',
          value: userResponse.value
        };
      }

      if (userResponse.type === 'input') {
        return {
          type: 'input_request',
          value: userResponse.value
        };
      }

      // Regular quick reply with context data
      return {
        type: 'quick_reply',
        value: userResponse.value,
        metadata: userResponse
      };
    }

    // Parse message for text input
    if (userMessage && userMessage.trim().length > 0) {
      return {
        type: 'text_input',
        value: userMessage
      };
    }

    return {
      type: 'unknown'
    };
  }

  /**
   * Handle quick reply button click
   */
  handleQuickReply(session, scenario, replyValue, metadata) {
    // Store context data from quick reply
    if (metadata) {
      Object.keys(metadata).forEach(key => {
        if (key !== 'text' && key !== 'value' && key !== 'type') {
          session.collectedContext[key] = metadata[key];
        }
      });
    }

    // Navigate to the next node based on the scenario structure
    const currentNodeData = this.getCurrentNodeData(scenario, session.currentNode);

    if (!currentNodeData || !currentNodeData.branches) {
      return {
        error: 'Navigation error in conversation flow',
        shouldRestart: true
      };
    }

    const branch = currentNodeData.branches[replyValue];
    if (!branch) {
      return {
        error: 'Invalid navigation path',
        debug: { replyValue, currentNode: session.currentNode },
        shouldRestart: false
      };
    }

    // Update session path
    session.conversationPath.push({
      node: session.currentNode,
      choice: replyValue,
      timestamp: new Date()
    });

    // Check if this branch leads to another node or is final
    if (branch.next) {
      session.currentNode = branch.next;
      const nextNodeData = scenario[branch.next];

      if (nextNodeData && nextNodeData.final && nextNodeData.generateEmail) {
        // Time to generate the email!
        return this.generateFinalEmailResponse(session, nextNodeData);
      }

      // Continue conversation with next node
      return this.generateBotResponse(session, nextNodeData.bot, session.collectedContext);
    }

    // This branch has inline response
    return this.generateBotResponse(session, branch.bot);
  }

  /**
   * Handle anticipatory question click
   */
  handleAnticipatoryQuestion(session, scenario, questionValue) {
    const currentNodeData = this.getCurrentNodeData(scenario, session.currentNode);

    if (!currentNodeData || !currentNodeData.bot || !currentNodeData.bot.anticipatoryQuestions) {
      return {
        error: 'No anticipatory questions available',
        shouldRestart: false
      };
    }

    const questionObj = currentNodeData.bot.anticipatoryQuestions.find(
      q => this.normalizeString(q.question) === this.normalizeString(questionValue) ||
           questionValue === 'why_important' ||
           questionValue === 'find_contact_tip' ||
           questionValue.includes('help') ||
           questionValue.includes('choice') ||
           questionValue.includes('recommendation')
    );

    if (questionObj) {
      return {
        response: `💡 **${questionObj.question}**\n\n${questionObj.answer}`,
        suggestions: currentNodeData.bot.quickReplies ?
          currentNodeData.bot.quickReplies.filter(qr => qr.type !== 'question').map(qr => ({
            text: qr.text,
            value: qr.value,
            metadata: qr
          })) : [],
        metadata: {
          type: 'anticipatory_answer',
          sessionId: session.sessionId,
          messageCount: session.messageCount
        },
        newState: 'conversational_' + session.scenarioId,
        emailData: session.collectedContext
      };
    }

    // Fallback: Generic help based on questionValue
    return this.generateGenericHelp(session, scenario, questionValue);
  }

  /**
   * Handle free-form text input
   */
  handleTextInput(session, scenario, userMessage) {
    const currentNodeData = this.getCurrentNodeData(scenario, session.currentNode);

    // Check if current node expects text input
    const hasInputQuickReply = currentNodeData.bot.quickReplies?.some(qr => qr.type === 'input');

    if (hasInputQuickReply) {
      // Extract structured data from message
      const extractedData = this.extractDataFromMessage(userMessage, session.scenarioId, session.currentNode);

      // Merge extracted data into context
      Object.assign(session.collectedContext, extractedData);

      // Validate if we have enough data
      const validation = this.validateCollectedContext(session);

      if (validation.isComplete) {
        // Move to next phase
        if (currentNodeData.next) {
          session.currentNode = currentNodeData.next;
          const nextNodeData = scenario[currentNodeData.next];
          return this.generateBotResponse(session, nextNodeData.bot, session.collectedContext);
        }
      } else {
        // Request missing information
        return {
          response: `✅ **Informations reçues !**\n\nJ'ai noté : ${this.summarizeContext(extractedData)}\n\n${validation.message}`,
          suggestions: validation.suggestions || currentNodeData.bot.quickReplies?.map(qr => ({
            text: qr.text,
            value: qr.value,
            metadata: qr
          })),
          metadata: {
            type: 'data_collection',
            extracted: extractedData,
            missing: validation.missingFields
          },
          newState: 'conversational_' + session.scenarioId,
          emailData: session.collectedContext
        };
      }
    }

    // Fallback: try to understand freeform message
    return this.handleFreeformMessage(session, scenario, userMessage);
  }

  /**
   * Handle freeform user message (NLU attempt)
   */
  handleFreeformMessage(session, scenario, userMessage) {
    const currentNodeData = this.getCurrentNodeData(scenario, session.currentNode);
    const messageLower = userMessage.toLowerCase();

    // Try to match message to available quick replies
    if (currentNodeData.bot.quickReplies) {
      for (const quickReply of currentNodeData.bot.quickReplies) {
        const replyTextLower = quickReply.text.toLowerCase();
        const keywords = replyTextLower.split(' ').filter(word => word.length > 3);

        const matchCount = keywords.filter(keyword => messageLower.includes(keyword)).length;

        if (matchCount >= Math.ceil(keywords.length * 0.5)) {
          // Match found! Process as quick reply
          return this.handleQuickReply(session, scenario, quickReply.value, quickReply);
        }
      }
    }

    // No match found, provide guidance
    return {
      response: `🤔 **Je n'ai pas bien compris votre réponse.**\n\nVous pouvez utiliser les suggestions ci-dessous pour continuer :`,
      suggestions: currentNodeData.bot.quickReplies?.map(qr => ({
        text: qr.text,
        value: qr.value,
        metadata: qr
      })),
      metadata: {
        type: 'clarification_needed',
        userMessage: userMessage,
        sessionId: session.sessionId
      },
      newState: 'conversational_' + session.scenarioId,
      emailData: session.collectedContext
    };
  }

  /**
   * Extract structured data from user message
   */
  extractDataFromMessage(message, scenarioId, currentNode) {
    const extracted = {};

    // Contact name and company pattern: "Name, Company"
    const contactPattern = /^([A-Za-zÀ-ÿ\s-]+),\s*([A-Za-zÀ-ÿ0-9\s&.-]+)$/i;
    const match = message.match(contactPattern);

    if (match) {
      extracted.contactName = match[1].trim();
      extracted.company = match[2].trim();
    }

    // Email pattern
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const emailMatch = message.match(emailPattern);
    if (emailMatch) {
      extracted.email = emailMatch[1];
    }

    // Partner name (if context is partner referral)
    if (currentNode === 'gather_solution_focus' && message.length > 2) {
      extracted.partnerName = message.trim();
    }

    // Meeting notes / key points (if context is meeting follow-up)
    if (currentNode === 'define_next_steps' && message.length > 10) {
      extracted.meetingNotes = message.trim();
    }

    return extracted;
  }

  /**
   * Validate collected context
   */
  validateCollectedContext(session) {
    const context = session.collectedContext;
    const missing = [];

    // Basic validation for prospection scenario
    if (session.scenarioId === 'prospection_initiale') {
      if (!context.contactName && !context.targetRole) {
        missing.push('nom du contact ou rôle ciblé');
      }
      if (!context.company) {
        missing.push('nom de l\'entreprise');
      }
    }

    if (missing.length === 0) {
      return {
        isComplete: true
      };
    }

    return {
      isComplete: false,
      missingFields: missing,
      message: `❓ **Il me manque encore :** ${missing.join(', ')}\n\nPouvez-vous compléter ces informations ?`,
      suggestions: [
        { text: '📝 Fournir les infos manquantes', value: 'provide_info', type: 'input' },
        { text: '🔄 Recommencer', value: 'restart', type: 'back' }
      ]
    };
  }

  /**
   * Generate bot response with anticipatory questions
   */
  generateBotResponse(session, botConfig, context = {}) {
    if (!botConfig) {
      return {
        error: 'Bot configuration missing',
        shouldRestart: true
      };
    }

    // Generate message (can be function or string)
    let message = typeof botConfig.message === 'function'
      ? botConfig.message(session.collectedContext)
      : botConfig.message;

    // Build suggestions list
    const suggestions = [];

    // Add quick replies
    if (botConfig.quickReplies) {
      botConfig.quickReplies.forEach(qr => {
        suggestions.push({
          text: qr.text,
          value: qr.value,
          type: qr.type || 'quick_reply',
          metadata: qr
        });
      });
    }

    // Add anticipatory questions as suggestions
    if (botConfig.anticipatoryQuestions && botConfig.anticipatoryQuestions.length > 0) {
      // Show max 2-3 anticipatory questions to avoid overwhelming
      const questionsToShow = botConfig.anticipatoryQuestions.slice(0, 2);
      questionsToShow.forEach(aq => {
        suggestions.push({
          text: `❓ ${aq.question}`,
          value: aq.question,
          type: 'question'
        });
      });
    }

    return {
      response: message,
      suggestions: suggestions,
      metadata: {
        type: 'conversational_flow',
        scenarioId: session.scenarioId,
        currentNode: session.currentNode,
        messageCount: session.messageCount,
        hasAnticipatoryQuestions: (botConfig.anticipatoryQuestions?.length || 0) > 0,
        sessionId: session.sessionId
      },
      newState: 'conversational_' + session.scenarioId,
      emailData: session.collectedContext
    };
  }

  /**
   * Generate final email response
   */
  generateFinalEmailResponse(session, nodeData) {
    // Collect tone if specified
    if (nodeData.bot && nodeData.bot.quickReplies) {
      const toneReply = nodeData.bot.quickReplies.find(qr => qr.tone);
      if (toneReply && toneReply.tone) {
        session.collectedContext.tone = toneReply.tone;
      }
    }

    // Build comprehensive email context
    const emailContext = {
      ...session.collectedContext,
      scenarioId: session.scenarioId,
      conversationPath: session.conversationPath,
      messageCount: session.messageCount,
      duration: Date.now() - session.startTime.getTime()
    };

    return {
      response: nodeData.bot.message(session.collectedContext),
      suggestions: nodeData.bot.quickReplies?.map(qr => ({
        text: qr.text,
        value: qr.value,
        metadata: qr
      })),
      metadata: {
        type: 'email_generation_ready',
        scenarioId: session.scenarioId,
        contextQuality: this.assessContextQuality(emailContext),
        readyToGenerate: true
      },
      newState: 'generating',
      emailData: emailContext,
      shouldGenerateEmail: true
    };
  }

  /**
   * Get current node data from scenario
   */
  getCurrentNodeData(scenario, nodeName) {
    if (nodeName === 'entry') {
      return scenario.entry;
    }

    return scenario[nodeName];
  }

  /**
   * Handle back navigation
   */
  handleBackNavigation(session, scenario) {
    if (session.conversationPath.length === 0) {
      return {
        response: '🏠 **Vous êtes déjà au début de la conversation.**\n\nVoulez-vous recommencer avec un autre scénario ?',
        suggestions: conversationalScenarios.getAllScenarios().map(s => ({
          text: `${s.icon} ${s.name}`,
          value: `start_${s.id}`,
          type: 'scenario_selection'
        })),
        newState: 'initial'
      };
    }

    // Go back one step
    const previousStep = session.conversationPath.pop();
    session.currentNode = previousStep.node;

    const currentNodeData = this.getCurrentNodeData(scenario, session.currentNode);
    return this.generateBotResponse(session, currentNodeData.bot);
  }

  /**
   * Generate generic help for anticipatory questions
   */
  generateGenericHelp(session, scenario, questionValue) {
    const helpMessages = {
      'why_important': `💡 **Pourquoi c'est important**\n\nChaque information me permet de personnaliser votre email pour maximiser vos chances de réponse. Plus l'email est personnalisé, plus il est efficace !`,
      'which_solution': `💡 **Quelle solution choisir**\n\nChoisissez la solution qui répond au **plus gros point de douleur** de votre prospect. Un email focalisé sur 1-2 solutions max obtient 3x plus de réponses qu'un catalogue complet.`,
      'best_approach': `💡 **Meilleure approche**\n\nL'approche la plus efficace dépend de votre contexte. En général :\n• Étude de cas = Meilleur si similaire à leur secteur\n• Insight industrie = Bon pour cold email\n• Offre de valeur = Très efficace pour générer des leads`,
      'default': `💡 **Aide contextuelle**\n\nUtilisez les suggestions ci-dessous pour continuer la conversation. Chaque option est optimisée selon les meilleures pratiques de prospection.`
    };

    const message = helpMessages[questionValue] || helpMessages['default'];
    const currentNodeData = this.getCurrentNodeData(scenario, session.currentNode);

    return {
      response: message,
      suggestions: currentNodeData.bot.quickReplies?.map(qr => ({
        text: qr.text,
        value: qr.value,
        metadata: qr
      })),
      metadata: {
        type: 'help_provided',
        questionValue: questionValue
      },
      newState: 'conversational_' + session.scenarioId,
      emailData: session.collectedContext
    };
  }

  /**
   * Assess quality of collected context
   */
  assessContextQuality(context) {
    let score = 0;
    const maxScore = 100;

    // Essential fields
    if (context.contactName || context.targetRole) score += 20;
    if (context.company) score += 20;
    if (context.contextType) score += 15;

    // Nice-to-have fields
    if (context.partnerName) score += 15;
    if (context.solution) score += 10;
    if (context.currentInfra) score += 10;
    if (context.email) score += 10;

    return {
      score: Math.min(score, maxScore),
      hasEssentials: (context.contactName || context.targetRole) && context.company,
      completeness: score / maxScore
    };
  }

  /**
   * Summarize collected context
   */
  summarizeContext(context) {
    const parts = [];
    if (context.contactName) parts.push(`Contact: ${context.contactName}`);
    if (context.company) parts.push(`Entreprise: ${context.company}`);
    if (context.targetRole) parts.push(`Rôle: ${context.targetRole}`);
    if (context.partnerName) parts.push(`Partenaire: ${context.partnerName}`);
    return parts.join(', ') || 'informations reçues';
  }

  /**
   * Normalize string for comparison
   */
  normalizeString(str) {
    return str.toLowerCase().trim().replace(/[^\w\s]/g, '');
  }

  /**
   * Get session info
   */
  getSession(sessionId) {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Clear session
   */
  clearSession(sessionId) {
    this.activeSessions.delete(sessionId);
  }

  /**
   * List all available scenarios
   */
  listScenarios() {
    return conversationalScenarios.getAllScenarios();
  }
}

// Export singleton instance
export const conversationScenarioManager = new ConversationScenarioManager();
