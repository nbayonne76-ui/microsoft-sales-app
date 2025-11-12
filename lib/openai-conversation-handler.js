/**
 * OpenAI Conversation Handler
 * Handles general conversations using OpenAI GPT-4 capabilities
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

export class OpenAIConversationHandler {
  constructor() {
    this.conversationContext = new Map();
  }

  /**
   * Handle general conversation using OpenAI
   */
  async handleConversation(message, conversationState, conversationHistory = []) {
    try {
      const systemPrompt = this.buildSystemPrompt(conversationState);
      const conversationMessages = this.buildConversationMessages(message, conversationHistory, systemPrompt);

      console.log('🤖 Using OpenAI for conversation handling...');

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: conversationMessages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      });

      const aiResponse = response.choices[0].message.content;

      return {
        success: true,
        response: aiResponse,
        source: 'openai',
        suggestions: this.generateDynamicSuggestions(message, aiResponse),
        metadata: {
          model: 'gpt-4o-mini',
          tokensUsed: response.usage?.total_tokens || 0,
          conversationLength: conversationHistory.length + 1
        }
      };

    } catch (error) {
      console.error('OpenAI conversation error:', error);
      return this.getFallbackResponse(message, conversationState);
    }
  }

  /**
   * Build system prompt based on conversation state
   */
  buildSystemPrompt(conversationState) {
    const basePrompt = `Tu es un assistant IA spécialisé dans les solutions Microsoft et la création d'emails professionnels.

EXPERTISE :
- Solutions Microsoft (Azure, Microsoft 365, Teams, Power Platform, Dynamics 365)
- Création d'emails professionnels personnalisés
- Conseil en transformation digitale
- Support technique et commercial

STYLE DE COMMUNICATION :
- Toujours en français
- Professionnel mais accessible
- Utilise des émojis appropriés
- Propose des actions concrètes
- Adapte le ton selon le contexte

CAPACITÉS :
- Répondre aux questions sur les produits Microsoft
- Aider à créer des emails de prospection
- Expliquer les concepts techniques
- Donner des conseils pratiques
- Gérer les workflows de création d'emails

Tu peux gérer tous types de conversations tout en restant focused sur l'écosystème Microsoft et l'aide professionnelle.`;

    const stateSpecificPrompts = {
      'initial': 'Tu accueilles l\'utilisateur et l\'aides à démarrer. Propose des actions comme créer un email ou poser des questions sur Microsoft.',
      'gathering_info': 'Tu aides l\'utilisateur à rassembler les informations nécessaires pour créer un email professionnel.',
      'gathering_prospect_info': 'Tu collectes les informations sur le prospect pour personnaliser l\'email.',
      'email_generation': 'Tu aides à finaliser et optimiser le contenu d\'un email.',
      'knowledge_query': 'Tu réponds aux questions techniques sur les solutions Microsoft.',
      'help': 'Tu fournis de l\'aide et des explications sur les fonctionnalités disponibles.'
    };

    const statePrompt = stateSpecificPrompts[conversationState] || stateSpecificPrompts['initial'];

    return `${basePrompt}\n\nCONTEXTE ACTUEL: ${statePrompt}`;
  }

  /**
   * Build conversation messages for OpenAI
   */
  buildConversationMessages(currentMessage, conversationHistory, systemPrompt) {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history (last 10 messages to avoid token limits)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: msg.content || msg.message || ''
        });
      }
    });

    // Add current message
    messages.push({
      role: 'user',
      content: currentMessage
    });

    return messages;
  }

  /**
   * Generate dynamic suggestions based on conversation
   */
  generateDynamicSuggestions(userMessage, aiResponse) {
    const messageLower = userMessage.toLowerCase();
    const responseLower = aiResponse.toLowerCase();

    // Context-aware suggestions
    if (messageLower.includes('email') || responseLower.includes('email')) {
      return [
        '📧 Créer un nouvel email',
        '👤 Ajouter un prospect',
        '📋 Voir mes templates',
        '❓ Questions sur Microsoft'
      ];
    }

    if (messageLower.includes('azure') || responseLower.includes('azure')) {
      return [
        '☁️ Migration vers Azure',
        '💰 Tarification Azure',
        '🔐 Sécurité Azure',
        '📧 Email Azure'
      ];
    }

    if (messageLower.includes('microsoft 365') || responseLower.includes('microsoft 365')) {
      return [
        '📊 Plans Microsoft 365',
        '🤝 Fonctionnalités Teams',
        '💼 Administration M365',
        '📧 Email M365'
      ];
    }

    // Default suggestions
    return [
      '📧 Créer un email',
      '❓ Poser une question',
      '🎯 Nouveau prospect',
      '📚 En savoir plus'
    ];
  }

  /**
   * Fallback response when OpenAI fails
   */
  getFallbackResponse(message, conversationState) {
    return {
      success: false,
      response: `🤖 Je comprends votre demande "${message}". Je suis spécialisé dans les solutions Microsoft et la création d'emails professionnels.

**Comment puis-je vous aider ?**

• 📧 **Créer un email** de prospection personnalisé
• ❓ **Répondre aux questions** sur Azure, Microsoft 365, Teams
• 🎯 **Gérer vos prospects** et contacts
• 📋 **Optimiser vos templates** d'email

Que souhaitez-vous faire en priorité ?`,
      source: 'fallback',
      suggestions: [
        '📧 Créer un email',
        '❓ Questions Microsoft',
        '🎯 Nouveau prospect',
        '📋 Mes templates'
      ],
      metadata: {
        fallback: true,
        originalMessage: message,
        conversationState: conversationState
      }
    };
  }

  /**
   * Check if message should use OpenAI
   */
  shouldUseOpenAI(message, intent, confidence) {
    // Use OpenAI for:
    // 1. Low confidence predictions
    if (confidence < 0.6) return true;

    // 2. None intent (out of domain)
    if (intent === 'None') return true;

    // 3. Complex questions
    const complexQuestionKeywords = [
      'comment', 'pourquoi', 'que faire', 'expliquer', 'différence',
      'comparaison', 'avantages', 'inconvénients', 'mieux', 'recommander'
    ];

    const hasComplexKeywords = complexQuestionKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    if (hasComplexKeywords) return true;

    // 4. Conversation-style messages
    const conversationKeywords = [
      'bonjour', 'salut', 'merci', 'au revoir', 'help', 'aide',
      'peux-tu', 'pouvez-vous', 'j\'aimerais', 'je voudrais'
    ];

    const hasConversationKeywords = conversationKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    if (hasConversationKeywords) return true;

    return false;
  }

  /**
   * Get conversation statistics
   */
  getConversationStats() {
    return {
      activeConversations: this.conversationContext.size,
      capabilities: [
        'General conversation handling',
        'Microsoft solutions expertise',
        'Email creation assistance',
        'Technical support',
        'Dynamic suggestions'
      ]
    };
  }
}

export const openaiConversationHandler = new OpenAIConversationHandler();