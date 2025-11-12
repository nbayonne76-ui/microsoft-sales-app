/**
 * AI Response Analyzer
 * Uses GPT-4 to analyze email responses and extract actionable intelligence
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyze an email response using GPT-4
 */
export async function analyzeEmailResponse(responseText, context = {}) {
  try {
    const { leadCompany, leadRole, sentEmail, industry } = context;

    const prompt = `Tu es un expert en analyse de réponses emails pour vendeurs B2B Microsoft.

CONTEXTE:
- Entreprise: ${leadCompany || 'Non spécifié'}
- Rôle du contact: ${leadRole || 'Non spécifié'}
- Industrie: ${industry || 'Non spécifié'}
${sentEmail ? `- Email envoyé: "${sentEmail.subject}"` : ''}

RÉPONSE DU PROSPECT:
"${responseText}"

Analyse cette réponse et retourne un JSON structuré avec:

{
  "sentiment": "positive" | "neutral" | "negative",
  "sentimentScore": -1 to 1 (float),
  "responseType": "interested" | "objection" | "question" | "not_interested" | "out_of_office" | "pricing_inquiry",
  "primaryIntent": "book_meeting" | "request_info" | "pricing_inquiry" | "competitor_mention" | "not_now" | "budget_concern",
  "urgencyLevel": "high" | "medium" | "low",
  "keyPhrases": ["phrase1", "phrase2"],
  "buyingSignals": ["signal1", "signal2"] ou [],
  "objections": ["objection1", "objection2"] ou [],
  "competitorsMentioned": ["competitor1"] ou [],
  "budgetMentioned": true/false,
  "timelineMentioned": "Q2 2024" ou null,
  "suggestedResponse": "Réponse suggérée en français, personnalisée",
  "suggestedNextStep": "schedule_demo" | "send_case_study" | "send_pricing" | "follow_up_later" | "close_opportunity",
  "aiSummary": "Résumé en 1-2 phrases de la réponse et recommandation",
  "confidence": 0.0 to 1.0
}

Sois précis et actionnable. Le vendeur doit savoir exactement quoi faire ensuite.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en analyse de réponses emails B2B. Tu retournes toujours du JSON valide.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const analysis = JSON.parse(completion.choices[0].message.content);

    return {
      success: true,
      analysis,
      tokensUsed: completion.usage.total_tokens
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    return {
      success: false,
      error: error.message,
      analysis: null
    };
  }
}

/**
 * Extract patterns from multiple responses for learning
 */
export async function extractPatterns(responses, context = {}) {
  try {
    const { industry, companySize, role } = context;

    // Aggregate response data
    const responseSummary = responses.map(r => ({
      sentiment: r.sentiment,
      intent: r.primaryIntent,
      outcome: r.ledToMeeting ? 'meeting' : r.ledToDeal ? 'deal' : 'none',
      keyPhrases: r.keyPhrases
    }));

    const prompt = `Tu analyses ${responses.length} réponses emails pour identifier des patterns.

CONTEXTE:
- Industrie: ${industry || 'Multiple'}
- Taille entreprise: ${companySize || 'Multiple'}
- Rôle cible: ${role || 'Multiple'}

DONNÉES:
${JSON.stringify(responseSummary, null, 2)}

Identifie des PATTERNS actionnables:

{
  "patterns": [
    {
      "pattern": "Description du pattern",
      "frequency": 0.0-1.0,
      "impact": "positive" | "negative",
      "recommendation": "Que faire avec ce pattern"
    }
  ],
  "insights": {
    "bestTimeToSend": "Description",
    "mostEffectiveApproach": "Description",
    "commonObjections": ["objection1", "objection2"],
    "winningKeywords": ["mot1", "mot2"],
    "avoidKeywords": ["mot1", "mot2"]
  },
  "recommendations": [
    "Action recommandée 1",
    "Action recommandée 2"
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en analyse de patterns de vente B2B.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const patterns = JSON.parse(completion.choices[0].message.content);

    return {
      success: true,
      patterns,
      tokensUsed: completion.usage.total_tokens
    };
  } catch (error) {
    console.error('Pattern extraction error:', error);
    return {
      success: false,
      error: error.message,
      patterns: null
    };
  }
}

/**
 * Generate optimal response based on analysis
 */
export async function generateResponse(analysis, context = {}) {
  try {
    const { leadCompany, leadRole, originalEmail, yourName = 'Nicolas BAYONNE' } = context;

    const prompt = `Tu es ${yourName}, Account Executive Microsoft.

CONTEXTE:
- Entreprise prospect: ${leadCompany}
- Rôle: ${leadRole}
- Email envoyé: "${originalEmail?.subject}"

ANALYSE DE LEUR RÉPONSE:
- Sentiment: ${analysis.sentiment} (${analysis.sentimentScore})
- Intent: ${analysis.primaryIntent}
- Objections: ${analysis.objections?.join(', ') || 'Aucune'}
- Buying signals: ${analysis.buyingSignals?.join(', ') || 'Aucun'}

GÉNÈRE une réponse email optimale:
- Courte et directe (max 150 mots)
- Répond aux objections subtilement
- Amplifie les buying signals
- Propose une action claire (meeting, call, démo)
- Ton professionnel mais amical
- En français

Format:
{
  "subject": "Sujet de réponse",
  "body": "Corps de l'email",
  "callToAction": "Action demandée",
  "reasoning": "Pourquoi cette approche"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en rédaction d\'emails de vente B2B.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const generatedResponse = JSON.parse(completion.choices[0].message.content);

    return {
      success: true,
      response: generatedResponse,
      tokensUsed: completion.usage.total_tokens
    };
  } catch (error) {
    console.error('Response generation error:', error);
    return {
      success: false,
      error: error.message,
      response: null
    };
  }
}

/**
 * Score lead engagement based on email tracking and responses
 */
export function calculateEngagementScore(tracking) {
  let score = 0;

  // Open behavior (max 30 points)
  if (tracking.opened) {
    score += 10;
    score += Math.min(tracking.openCount * 5, 20); // Up to 4 opens = 20 pts
  }

  // Click behavior (max 20 points)
  if (tracking.clicked) {
    score += 10;
    score += Math.min(tracking.clickCount * 5, 10); // Up to 2 clicks = 10 pts
  }

  // Reply (max 50 points)
  if (tracking.replied) {
    score += 20;

    // Sentiment bonus
    if (tracking.sentiment === 'positive') {
      score += 20;
    } else if (tracking.sentiment === 'neutral') {
      score += 10;
    } else if (tracking.sentiment === 'negative') {
      score += 5; // At least they engaged
    }

    // Intent bonus
    if (tracking.intentDetected === 'interested') {
      score += 10;
    }
  }

  return Math.min(score, 100); // Cap at 100
}
