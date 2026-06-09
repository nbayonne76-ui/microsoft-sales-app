import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { handleApiError } from '@/lib/api-error';
import { getFullKb } from '@/lib/kb-service';

export const maxDuration = 60;

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Source 1 : Exa.ai — neural search (meilleure qualité) ────────────────────
async function searchExa(companyName) {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) return [];

  const queries = [
    `${companyName} digital transformation cloud Microsoft stratégie IT 2024 2025`,
    `${companyName} DSI directeur informatique CTO recrutement technologie`,
    `${companyName} rapport annuel résultats financiers actualité`,
  ];

  try {
    const results = await Promise.allSettled(
      queries.map(query =>
        fetch('https://api.exa.ai/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
          body: JSON.stringify({
            query,
            numResults: 4,
            type: 'neural',
            useAutoprompt: true,
            highlights: { numSentences: 3, highlightsPerUrl: 2 },
          }),
        }).then(r => r.json())
      )
    );

    const snippets = [];
    for (const r of results) {
      if (r.status !== 'fulfilled' || !r.value?.results) continue;
      for (const item of r.value.results) {
        const text = item.highlights?.join(' ') || item.text?.slice(0, 500) || '';
        if (text) snippets.push(`[Exa — ${item.title}] ${text}`);
      }
    }
    return snippets;
  } catch {
    return [];
  }
}

// ── Source 2 : Jina Search — gratuit, sans clé, toujours disponible ──────────
async function searchJina(companyName) {
  const queries = [
    `${companyName} stratégie numérique cloud innovation Microsoft`,
    `${companyName} actualité entreprise technologie 2024 2025`,
  ];

  try {
    const results = await Promise.allSettled(
      queries.map(q =>
        fetch(`https://s.jina.ai/${encodeURIComponent(q)}`, {
          headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
          signal: AbortSignal.timeout(4000),
        }).then(r => r.text())
      )
    );

    const snippets = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value && r.value.length > 100) {
        // Extract meaningful chunks (skip nav/footer noise)
        const lines = r.value
          .split('\n')
          .filter(l => l.trim().length > 60)
          .slice(0, 8)
          .join(' ');
        if (lines) snippets.push(`[Jina Web] ${lines.slice(0, 800)}`);
      }
    }
    return snippets;
  } catch {
    return [];
  }
}

// ── Source 3 : Tavily — IA-native search (existing) ──────────────────────────
async function searchTavily(companyName) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  const queries = [
    `${companyName} projet cloud Microsoft Azure transformation numérique`,
    `${companyName} recrutement DSI architecte cloud sécurité informatique`,
    `${companyName} budget IT investissement technologie 2024 2025`,
  ];

  try {
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
      if (r.status !== 'fulfilled' || !r.value?.results) continue;
      for (const item of r.value.results) {
        if (item.content) {
          snippets.push(`[Tavily — ${item.title}] ${item.content.slice(0, 400)}`);
        }
      }
    }
    return snippets;
  } catch {
    return [];
  }
}

// ── Contact Finder — Exa neural → décideurs DSI/CTO (pattern ERP Scraper) ────
async function findDecisionMakers(companyName) {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        query: `${companyName} DSI directeur informatique CTO CIO site:linkedin.com OR responsable IT`,
        numResults: 5,
        type: 'neural',
        useAutoprompt: true,
        highlights: { numSentences: 2, highlightsPerUrl: 1 },
      }),
    });
    const data = await res.json();
    if (!data?.results?.length) return null;

    const hits = data.results
      .map(r => `${r.title}: ${r.url}`)
      .slice(0, 4)
      .join('\n');
    return hits;
  } catch {
    return null;
  }
}

// ── Enrichissement multi-source parallèle (pattern ERP Scraper enricher.py) ──
async function enrichCompany(companyName) {
  const [exaResults, jinaResults, tavilyResults, contactHints] = await Promise.allSettled([
    searchExa(companyName),
    searchJina(companyName),
    searchTavily(companyName),
    findDecisionMakers(companyName),
  ]);

  const snippets = [
    ...(exaResults.status === 'fulfilled'    ? exaResults.value    : []),
    ...(jinaResults.status === 'fulfilled'   ? jinaResults.value   : []),
    ...(tavilyResults.status === 'fulfilled' ? tavilyResults.value : []),
  ];

  const contacts = contactHints.status === 'fulfilled' ? contactHints.value : null;

  const sourcesUsed = {
    exa:    exaResults.status === 'fulfilled'    && exaResults.value.length > 0,
    jina:   jinaResults.status === 'fulfilled'   && jinaResults.value.length > 0,
    tavily: tavilyResults.status === 'fulfilled' && tavilyResults.value.length > 0,
  };

  return { snippets, contacts, sourcesUsed };
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { accountName } = await request.json();

    if (!accountName?.trim()) {
      return NextResponse.json({ error: 'accountName is required' }, { status: 400 });
    }

    // ── Parallel: KB + multi-source web enrichment ──────────────────────────
    const enrichTimeout = new Promise(resolve =>
      setTimeout(() => resolve({ snippets: [], contacts: null, sourcesUsed: { exa: false, jina: false, tavily: false } }), 6000)
    );

    const [kbContent, enriched] = await Promise.all([
      Promise.resolve(getFullKb(10000)),
      Promise.race([enrichCompany(accountName), enrichTimeout]),
    ]);

    const { snippets, contacts, sourcesUsed } = enriched;
    const webDataUsed = snippets.length > 0;

    // Build web section with source attribution
    let webSection;
    if (webDataUsed) {
      const sourceLabels = Object.entries(sourcesUsed)
        .filter(([, used]) => used)
        .map(([src]) => src.charAt(0).toUpperCase() + src.slice(1))
        .join(' + ');

      webSection = `\n\n## DONNÉES WEB EN TEMPS RÉEL (sources : ${sourceLabels})\n${snippets.join('\n\n')}`;

      if (contacts) {
        webSection += `\n\n## DÉCIDEURS POTENTIELS DÉTECTÉS\n${contacts}`;
      }
    } else {
      webSection = '\n\n## DONNÉES WEB : non disponibles — utilise tes connaissances générales sur cette entreprise.';
    }

    const systemPrompt = `Tu es un expert en intelligence commerciale et stratégie d'entreprise pour un Account Manager Microsoft.
Ton rôle : produire un dossier de prospection complet et structuré sur une entreprise cible.

RÈGLES :
- Toutes les recommandations de solutions/prix doivent venir EXCLUSIVEMENT de la KNOWLEDGE BASE ci-dessous
- Pour le SWOT et PESTEL : raisonne à partir des données web ET de ta connaissance générale de l'entreprise/secteur
- Si des décideurs potentiels ont été détectés dans les données web, enrichis la section decisionMakers avec leurs noms/titres réels
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
    "strengths": ["Force 1 — avec impact sur l'adoption Microsoft", "Force 2", "Force 3"],
    "weaknesses": ["Faiblesse 1 — angle d'attaque pour le commercial", "Faiblesse 2", "Faiblesse 3"],
    "opportunities": ["Opportunité 1 — comment Microsoft peut y répondre", "Opportunité 2", "Opportunité 3"],
    "threats": ["Menace 1 — et comment Microsoft atténue ce risque", "Menace 2", "Menace 3"]
  },
  "pestel": {
    "political": "Facteurs politiques/réglementaires impactant leur stratégie IT",
    "economic": "Contexte économique — pression sur les coûts IT, investissement numérique",
    "social": "Facteurs sociaux — télétravail, recrutement tech, culture digitale",
    "technological": "Maturité technologique actuelle + enjeux de modernisation",
    "environmental": "Enjeux RSE/Green IT — engagement Net Zéro, reporting carbone",
    "legal": "Contraintes légales — RGPD, conformité sectorielle, audit"
  },
  "microsoftFit": {
    "score": 85,
    "rationale": "2-3 phrases expliquant pourquoi Microsoft est pertinent pour cette entreprise maintenant",
    "urgencyLevel": "high | medium | low",
    "buyingSignals": ["Signal 1 qui indique une fenêtre d'opportunité", "Signal 2"]
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

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    let intel;
    try {
      const raw = response.content[0].text;
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('no JSON found');
      intel = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr.message);
      return NextResponse.json(
        { error: 'La génération a échoué — réessaie dans quelques secondes.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      intel,
      webDataUsed,
      sourcesUsed,
      snippetCount: snippets.length,
      tokensUsed: response.usage?.output_tokens || 0,
    });
  } catch (error) {
    return handleApiError(error, 'Account Intel');
  }
}
