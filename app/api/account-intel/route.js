import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';
import { getFullKb } from '@/lib/kb-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Tavily web search (optional — graceful fallback if no key) ────────────────
async function webSearch(companyName) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;

  try {
    const queries = [
      `${companyName} projet digital transformation numérique 2024 2025`,
      `${companyName} cloud IA innovation technologie actualité`,
      `${companyName} recrutement DSI informatique`,
    ];

    const results = await Promise.allSettled(
      queries.map(q =>
        fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: apiKey,
            query: q,
            search_depth: 'basic',
            max_results: 3,
            include_answer: true,
          }),
        }).then(r => r.json())
      )
    );

    const snippets = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value?.results) {
        for (const item of r.value.results) {
          if (item.content) {
            snippets.push(`[${item.title}] ${item.content.slice(0, 400)}`);
          }
        }
      }
    }
    return snippets.length ? snippets.join('\n\n') : null;
  } catch {
    return null;
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { accountName } = await request.json();

    if (!accountName?.trim()) {
      return NextResponse.json({ error: 'accountName is required' }, { status: 400 });
    }

    // Run KB read + web search in parallel
    const [kbContent, webData] = await Promise.all([
      Promise.resolve(getFullKb(14000)),
      webSearch(accountName),
    ]);

    const webSection = webData
      ? `\n\n## DONNÉES WEB EN TEMPS RÉEL (scraping)\n${webData}`
      : '\n\n## DONNÉES WEB : non disponibles (clé Tavily non configurée — utilise tes connaissances)';

    const systemPrompt = `Tu es un expert en intelligence commerciale et stratégie d'entreprise pour un Account Manager Microsoft.
Ton rôle : produire un dossier de prospection complet et structuré sur une entreprise cible.

RÈGLES :
- Toutes les recommandations de solutions/prix doivent venir EXCLUSIVEMENT de la KNOWLEDGE BASE ci-dessous
- Pour le SWOT et PESTEL : raisonne à partir des données web ET de ta connaissance générale de l'entreprise/secteur
- Sois factuel, précis, commercial — évite le remplissage

KNOWLEDGE BASE MICROSOFT :
${kbContent}
${webSection}`;

    const userPrompt = `Entreprise à analyser : "${accountName}"

Retourne UNIQUEMENT un objet JSON valide (pas de markdown, pas de code fence) avec cette structure exacte :

{
  "company": {
    "name": "nom officiel",
    "industry": "secteur précis",
    "size": "startup | sme | enterprise",
    "estimatedRevenue": "fourchette estimée ex: 50–200M€",
    "headquarters": "ville, pays",
    "description": "2 phrases sur ce que fait l'entreprise",
    "website": "domaine probable ex: airbus.com",
    "employees": "fourchette estimée ex: 5 000–10 000"
  },
  "digitalSignals": [
    "Signal concret trouvé sur internet ou connu — ex: Déploiement SAP S/4HANA annoncé Q1 2025",
    "Ex: 12 postes d'ingénieur cloud ouverts sur LinkedIn",
    "Ex: Budget IT augmenté de 15% selon rapport annuel 2024"
  ],
  "swot": {
    "strengths": [
      "Force 1 — avec impact sur l'adoption Microsoft",
      "Force 2",
      "Force 3"
    ],
    "weaknesses": [
      "Faiblesse 1 — angle d'attaque pour le commercial",
      "Faiblesse 2",
      "Faiblesse 3"
    ],
    "opportunities": [
      "Opportunité 1 — comment Microsoft peut y répondre",
      "Opportunité 2",
      "Opportunité 3"
    ],
    "threats": [
      "Menace 1 — et comment Microsoft atténue ce risque",
      "Menace 2",
      "Menace 3"
    ]
  },
  "pestel": {
    "political": "Facteurs politiques/réglementaires impactant leur stratégie IT (ex: directives NIS2, souveraineté cloud)",
    "economic": "Contexte économique — pression sur les coûts IT, investissement numérique prévu",
    "social": "Facteurs sociaux — télétravail, recrutement tech, culture digitale",
    "technological": "Maturité technologique actuelle + enjeux de modernisation",
    "environmental": "Enjeux RSE/Green IT — engagement Net Zéro, reporting carbone",
    "legal": "Contraintes légales — RGPD, conformité sectorielle, audit"
  },
  "microsoftFit": {
    "score": 85,
    "rationale": "2-3 phrases expliquant pourquoi Microsoft est pertinent pour cette entreprise maintenant",
    "urgencyLevel": "high | medium | low",
    "buyingSignals": [
      "Signal 1 qui indique une fenêtre d'opportunité",
      "Signal 2"
    ]
  },
  "decisionMakers": [
    {
      "role": "DSI / CTO",
      "painPoints": "Ses problèmes principaux",
      "microsoftAngle": "Comment l'adresser avec Microsoft"
    },
    {
      "role": "DG / CEO",
      "painPoints": "Vision ROI et croissance",
      "microsoftAngle": "Angle business value"
    },
    {
      "role": "CFO / DAF",
      "painPoints": "Réduction des coûts, prévisibilité",
      "microsoftAngle": "Argument TCO et licences"
    }
  ],
  "topSolutions": [
    {
      "product": "nom produit depuis KB",
      "plan": "plan spécifique depuis KB",
      "price": "prix exact depuis KB",
      "whyFit": "1 phrase liée au contexte SWOT/PESTEL de cette entreprise",
      "roi": "ROI ou économie estimée depuis KB",
      "category": "m365 | azure | dynamics | power | security",
      "priority": "must-have | high | medium"
    }
  ],
  "emailAngles": [
    {
      "angle": "titre court",
      "hook": "1ère phrase d'accroche basée sur un fait PESTEL ou signal digital trouvé",
      "solution": "produit Microsoft à pitcher",
      "persona": "DSI | DG | CFO"
    }
  ],
  "keyQuestions": [
    "Question de découverte liée au SWOT",
    "Question liée au PESTEL",
    "Question sur le budget/timeline",
    "Question sur les concurrents internes au projet"
  ],
  "competitorRisk": "AWS | Google Workspace | SAP | Salesforce | autre — avec justification",
  "quickWin": "Deal le plus rapide à fermer, pourquoi maintenant, quel interlocuteur cibler"
}

Fournis 3 digitalSignals, 3 éléments dans chaque branche SWOT, 3 topSolutions (triées par priorité), 3 emailAngles, 4 keyQuestions.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 2500,
      response_format: { type: 'json_object' },
    });

    let intel;
    try {
      intel = JSON.parse(response.choices[0].message.content);
    } catch {
      throw new Error('OpenAI returned malformed JSON — retrying may help');
    }

    return NextResponse.json({
      success: true,
      intel,
      webDataUsed: !!webData,
      tokensUsed: response.usage?.total_tokens || 0,
    });
  } catch (error) {
    return handleApiError(error, 'Account Intel');
  }
}
