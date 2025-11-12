export async function POST(request) {
  try {
    const { message, context = 'email_marketing_assistant' } = await request.json();
    
    console.log('🤖 AI Assistant request:', { message, context });
    
    if (!message || !message.trim()) {
      return Response.json({ 
        error: 'Message is required' 
      }, { status: 400 });
    }

    // Check if we have OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'demo-key') {
      // Fallback to smart rule-based responses
      const response = await generateSmartResponse(message, context);
      
      return Response.json({
        response,
        mode: 'smart_fallback',
        timestamp: new Date().toISOString()
      });
    }

    // Use OpenAI API if available
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant IA expert en email marketing pour Nicolas Bayonne, Microsoft Account Manager. Tu aides avec:

            - Optimisation d'emails commerciaux
            - Amélioration du ton et du contenu
            - Conseils stratégiques email marketing
            - Analyse de performance des messages
            - Suggestions de sujets accrocheurs
            - Adaptation aux segments (Enterprise, PME, Startup)
            - Gestion des relances et follow-ups

            Réponds de manière concise, professionnelle et actionnable. Utilise des exemples concrets quand c'est pertinent.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!openAIResponse.ok) {
      throw new Error('OpenAI API error');
    }

    const openAIResult = await openAIResponse.json();
    const response = openAIResult.choices[0].message.content;

    // Track AI assistant usage
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_ai_assistant',
          data: {
            message: message.substring(0, 100), // First 100 chars for privacy
            responseLength: response.length,
            context,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (trackError) {
      console.warn('⚠️ Analytics tracking failed:', trackError.message);
    }

    return Response.json({
      response,
      mode: 'openai',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI Assistant error:', error);
    
    // Fallback to smart response even on error
    try {
      const { message, context } = await request.json();
      const fallbackResponse = await generateSmartResponse(message, context);
      
      return Response.json({
        response: fallbackResponse,
        mode: 'error_fallback',
        timestamp: new Date().toISOString()
      });
    } catch (fallbackError) {
      return Response.json({ 
        error: 'Assistant IA temporairement indisponible',
        details: error.message 
      }, { status: 500 });
    }
  }
}

// Smart rule-based response system
async function generateSmartResponse(message, context) {
  const messageLower = message.toLowerCase();
  
  // Email optimization requests
  if (messageLower.includes('optimiser') || messageLower.includes('améliorer') || messageLower.includes('optimize')) {
    return `Pour optimiser votre email, je recommande :

📧 **Structure** : Sujet accrocheur + introduction personnalisée + valeur claire + call-to-action
🎯 **Tone** : Adaptez le ton à votre audience (professionnel pour Enterprise, amical pour PME, décontracté pour startups)
💰 **Valeur** : Mettez en avant les bénéfices concrets (économies, performance, sécurité)
🔥 **Urgence** : Créez un sentiment d'urgence sans être pushy

Partagez votre email et je peux vous donner des conseils plus précis !`;
  }

  // Subject line help
  if (messageLower.includes('sujet') || messageLower.includes('subject') || messageLower.includes('objet')) {
    return `🎯 **Conseils pour un sujet efficace :**

✅ **DO** :
• Personnalisez avec le nom/entreprise
• Créez de la curiosité (pas tout révéler)
• Utilisez des chiffres (25% d'économies)
• Emojis avec modération 🚀

❌ **DON'T** :
• Mots spam (URGENT, GRATUIT, !!!)
• Promesses irréalistes
• Trop long (>50 caractères)

**Exemples performants** :
• "Réduction 30% infrastructure Azure - [Nom client]"
• "🚀 Migration Azure simplifiée pour [Entreprise]"`;
  }

  // Tone adaptation
  if (messageLower.includes('ton') || messageLower.includes('tone') || messageLower.includes('style')) {
    return `🎨 **Guide des tons selon l'audience :**

🏢 **Enterprise** (Formel)
• Langage professionnel et structuré
• Focus ROI et stratégie business
• Vouvoiement systématique

🏪 **PME** (Professionnel Amical)  
• Ton chaleureux mais pro
• Emojis modérés 😊
• Rassurer et simplifier

🚀 **Startup** (Décontracté Expert)
• Langage moderne et direct
• Tutoiement OK
• Focus innovation et agilité

**Astuce** : Regardez leur site web/LinkedIn pour adapter votre ton !`;
  }

  // Follow-up strategies
  if (messageLower.includes('relance') || messageLower.includes('follow') || messageLower.includes('suivi')) {
    return `📞 **Stratégie de relance efficace :**

**Email 1** : Proposition initiale
**Email 2** (1 semaine) : Valeur ajoutée + nouveau bénéfice
**Email 3** (2 semaines) : Social proof + urgence douce
**Email 4** (1 mois) : "Permission de vous enlever de ma liste ?"

🎯 **Tips de relance** :
• Changez l'angle, pas juste "Je relance"
• Apportez toujours une valeur nouvelle
• Testez différents jours/heures
• Maximum 4 relances

**Subject** : "Dernière tentative - [Sujet original]"`;
  }

  // Performance and metrics
  if (messageLower.includes('performance') || messageLower.includes('métrique') || messageLower.includes('taux')) {
    return `📊 **Métriques Email Marketing :**

📈 **Taux moyens secteur IT/B2B** :
• Ouverture : 20-25%
• Clic : 3-5% 
• Réponse : 1-3%

🎯 **Comment améliorer** :
• **Ouverture** : Sujet + expéditeur reconnu
• **Clic** : CTA clair + valeur évidente  
• **Réponse** : Question ou proposition concrète

💡 **A/B Test** : Testez sujets, horaires, tons
📱 **Mobile** : 60% des emails lus sur mobile
🕐 **Timing** : Mardi-Jeudi 9h-11h ou 14h-16h`;
  }

  // Azure/Microsoft specific
  if (messageLower.includes('azure') || messageLower.includes('microsoft') || messageLower.includes('migration')) {
    return `☁️ **Messaging Azure qui convertit :**

💰 **Angles qui marchent** :
• Réduction coûts 25-40%
• Sécurité enterprise-grade
• Scalabilité automatique
• Moins de maintenance IT

🎯 **Pain points à adresser** :
• Peur de la complexité technique
• Coût de migration
• Temps d'arrêt
• Formation équipes

📝 **Structure gagnante** :
1. Contexte client spécifique
2. Bénéfice immédiat chiffré
3. Preuve sociale (success story)
4. Next step simple (call 30 min)`;
  }

  // General email tips
  if (messageLower.includes('conseil') || messageLower.includes('help') || messageLower.includes('aide')) {
    return `💡 **Best practices email commercial :**

✅ **Structure gagnante** :
• Hook personnalisé (recherche LinkedIn/site)
• Problème identifié
• Solution + bénéfice chiffré
• Social proof
• CTA simple et clair

🎯 **Personnalisation** :
• Prénom + nom entreprise
• Référence actualité secteur
• Mention projet/challenge spécifique

📱 **Format** :
• Mobile-friendly (phrases courtes)
• Paragraphes de 2-3 lignes max
• Emojis pour aérer le texte

**Règle d'or** : Apportez de la valeur avant de demander !`;
  }

  // Default helpful response
  return `🤖 **Assistant IA Email Marketing à votre service !**

Je peux vous aider avec :

📧 **Optimisation d'emails** - Analysez vos messages
🎯 **Sujets accrocheurs** - Améliorez vos open rates  
🎨 **Adaptation du ton** - Enterprise/PME/Startup
📞 **Stratégies de relance** - Follow-up efficaces
📊 **Métriques & performance** - KPIs email marketing
☁️ **Messaging Azure/Microsoft** - Arguments qui convertissent

**Question spécifique ?** Décrivez votre challenge et je vous donne des conseils actionnables !

💡 *Tip du jour : Personnalisez toujours vos 2 premières phrases !*`;
}