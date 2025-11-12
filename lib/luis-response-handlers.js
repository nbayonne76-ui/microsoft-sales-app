/**
 * LUIS-style Response Handlers
 * Intent-specific response generation following Microsoft LUIS best practices
 */

// LUIS-style response generation based on intent and entities
export async function generateLuisStyleResponse(luisAnalysis, conversationState, emailData) {
  const { topIntent, entities, allIntents } = luisAnalysis;

  console.log(`📋 Generating LUIS response for intent: ${topIntent}`);

  switch (topIntent) {
    case "CreateEmail":
      return await handleCreateEmailIntent(entities, conversationState, emailData);

    case "ManageContact":
      return await handleManageContactIntent(entities, conversationState, emailData);

    case "ManageTemplate":
      return await handleManageTemplateIntent(entities, conversationState, emailData);

    case "ScheduleFollowUp":
      return await handleScheduleFollowUpIntent(entities, conversationState, emailData);

    case "GetHelp":
      return await handleGetHelpIntent(entities, conversationState, emailData);

    case "ProvideFeedback":
      return await handleProvideFeedbackIntent(entities, conversationState, emailData);

    case "Greeting":
      return await handleGreetingIntent(entities, conversationState, emailData);

    case "None":
    default:
      return await handleNoneIntent(entities, conversationState, emailData, allIntents);
  }
}

// Intent-specific handlers following LUIS best practices

async function handleCreateEmailIntent(entities, conversationState, emailData) {
  // Extract relevant entities
  const personName = entities.find(e => e.entity === "PersonName")?.value;
  const companyName = entities.find(e => e.entity === "CompanyName")?.value;
  const emailAddress = entities.find(e => e.entity === "EmailAddress")?.value;
  const emailType = entities.find(e => e.entity === "EmailType")?.value;
  const microsoftSolution = entities.find(e => e.entity === "MicrosoftSolution")?.value;
  const priority = entities.find(e => e.entity === "Priority")?.value;

  let response = "🎯 **Création d'email en cours !**\n\n";
  let newState = "gathering_info";
  let suggestions = [];

  // Build response based on extracted entities
  if (personName || companyName || emailAddress) {
    response += "📋 **Informations détectées :**\n";
    if (personName) response += `👤 Contact : ${personName}\n`;
    if (companyName) response += `🏢 Entreprise : ${companyName}\n`;
    if (emailAddress) response += `📧 Email : ${emailAddress}\n`;

    if (emailType) {
      response += `\n🎯 **Type d'email :** ${emailType}`;
      newState = "generating";
    }

    suggestions = ["✅ Générer l'email", "✏️ Modifier les infos", "🎨 Choisir le ton"];
  } else {
    response += "Pour créer un email personnalisé, j'ai besoin de quelques informations :\n\n";
    response += "💡 **Format recommandé :** \"Nom Prénom, Entreprise, email@domaine.com\"\n";
    response += "📝 **Ou dites-moi :** \"Email de prospection pour Jean Dupont\"";

    suggestions = [
      "👤 Martin Dupont, TechCorp",
      "📧 Nouveau prospect Azure",
      "🔄 Suivi réunion Microsoft",
      "❓ Voir des exemples"
    ];
  }

  // Add priority handling
  if (priority === "urgent") {
    response = "⚡ **EMAIL URGENT** - " + response;
    suggestions.unshift("🚀 Traitement prioritaire");
  }

  // Add Microsoft solution context
  if (microsoftSolution) {
    response += `\n\n🎯 **Solution mentionnée :** ${microsoftSolution}`;
    suggestions.push(`💡 Template ${microsoftSolution}`);
  }

  return {
    response,
    suggestions,
    newState,
    extractedEntities: entities
  };
}

async function handleManageContactIntent(entities, conversationState, emailData) {
  const personName = entities.find(e => e.entity === "PersonName")?.value;
  const companyName = entities.find(e => e.entity === "CompanyName")?.value;
  const businessRole = entities.find(e => e.entity === "BusinessRole")?.value;

  let response = "👥 **Gestion des contacts**\n\n";

  if (personName) {
    response += `🔍 Recherche d'informations sur : **${personName}**\n\n`;

    if (companyName) {
      response += `🏢 Entreprise : ${companyName}\n`;
    }

    if (businessRole) {
      response += `💼 Rôle détecté : ${businessRole}\n`;
    }

    response += "\nQue souhaitez-vous faire ?";

    return {
      response,
      suggestions: [
        `📧 Créer email pour ${personName}`,
        "📋 Voir le profil complet",
        "✏️ Modifier les informations",
        "🔄 Historique des échanges"
      ],
      newState: "contact_management"
    };
  } else {
    response += "Comment puis-je vous aider avec vos contacts ?";

    return {
      response,
      suggestions: [
        "👤 Ajouter un nouveau contact",
        "🔍 Rechercher un contact",
        "📋 Voir tous les contacts",
        "📊 Statistiques contacts"
      ],
      newState: "contact_management"
    };
  }
}

async function handleManageTemplateIntent(entities, conversationState, emailData) {
  return {
    response: `📋 **Gestion des templates**

Que souhaitez-vous faire avec vos templates d'email ?

🔍 **Actions disponibles :**
• Analyser les templates existants
• Créer un nouveau template
• Optimiser les templates actuels
• Organiser la bibliothèque`,
    suggestions: [
      "🔍 Analyser mes templates",
      "➕ Créer nouveau template",
      "⚡ Optimiser templates",
      "📁 Organiser bibliothèque"
    ],
    newState: "template_management"
  };
}

async function handleScheduleFollowUpIntent(entities, conversationState, emailData) {
  const timeFrame = entities.find(e => e.entity === "TimeFrame")?.value;
  const personName = entities.find(e => e.entity === "PersonName")?.value;

  let response = "📅 **Planification de suivi**\n\n";

  if (personName) {
    response += `👤 Contact : ${personName}\n`;
  }

  if (timeFrame) {
    response += `⏰ Délai : ${timeFrame}\n\n`;
  }

  response += "Type de suivi souhaité ?";

  return {
    response,
    suggestions: [
      "📧 Email de suivi",
      "📞 Appel téléphonique",
      "🤝 Réunion en personne",
      "💻 Visioconférence Teams",
      "📋 Récapitulatif écrit"
    ],
    newState: "scheduling"
  };
}

async function handleGetHelpIntent(entities, conversationState, emailData) {
  return {
    response: `❓ **Assistance disponible**

Je peux vous aider avec :

🎯 **Création d'emails** - Templates personnalisés et intelligents
📋 **Gestion de contacts** - Organisation et suivi des prospects
📝 **Templates** - Création et optimisation de modèles
📅 **Planification** - Suivi et réunions
🔧 **Fonctionnalités** - Guide d'utilisation complet

Que souhaitez-vous apprendre ?`,
    suggestions: [
      "📧 Comment créer un email",
      "🎯 Personnaliser mes messages",
      "📋 Gérer mes contacts",
      "📝 Utiliser les templates",
      "🔧 Toutes les fonctionnalités"
    ],
    newState: "help"
  };
}

async function handleProvideFeedbackIntent(entities, conversationState, emailData) {
  return {
    response: `💬 **Vos retours sont précieux !**

Merci de partager votre expérience. Votre feedback nous aide à améliorer l'outil.

📝 **Types de retours :**
• Suggestion d'amélioration
• Signalement de problème
• Évaluation de fonctionnalité
• Demande de nouvelle fonctionnalité`,
    suggestions: [
      "💡 Suggérer une amélioration",
      "🐛 Signaler un problème",
      "⭐ Évaluer une fonctionnalité",
      "🆕 Demander une nouveauté"
    ],
    newState: "feedback"
  };
}

async function handleGreetingIntent(entities, conversationState, emailData) {
  const hour = new Date().getHours();
  let timeGreeting = hour < 12 ? "Bonjour" : hour < 17 ? "Bon après-midi" : "Bonsoir";

  return {
    response: `${timeGreeting} ! 👋

Je suis votre assistant intelligent pour la création d'emails Microsoft personnalisés.

🎯 **Que puis-je faire pour vous aujourd'hui ?**`,
    suggestions: [
      "📧 Créer un nouveau email",
      "👥 Gérer mes contacts",
      "📋 Voir mes templates",
      "❓ Découvrir les fonctionnalités"
    ],
    newState: "initial"
  };
}

async function handleNoneIntent(entities, conversationState, emailData, allIntents) {
  // Show alternative intents if user request was unclear
  const alternativeIntents = allIntents
    .filter(intent => intent.intent !== "None" && intent.score > 0.3)
    .slice(0, 3);

  let response = `🤔 **Je n'ai pas bien compris votre demande.**\n\n`;

  if (alternativeIntents.length > 0) {
    response += "Peut-être vouliez-vous dire :\n";
    alternativeIntents.forEach(intent => {
      const intentLabels = {
        "CreateEmail": "📧 Créer un email",
        "ManageContact": "👥 Gérer les contacts",
        "ManageTemplate": "📋 Gérer les templates",
        "GetHelp": "❓ Obtenir de l'aide"
      };
      response += `• ${intentLabels[intent.intent] || intent.intent}\n`;
    });
  } else {
    response += `Je suis spécialisé dans la création d'emails Microsoft. Voici ce que je peux faire :`;
  }

  return {
    response,
    suggestions: [
      "📧 Créer un email",
      "👥 Gérer contacts",
      "📋 Templates",
      "❓ Aide"
    ],
    newState: "clarification"
  };
}