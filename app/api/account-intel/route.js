import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleApiError } from '@/lib/api-error';
import { getFullKb } from '@/lib/kb-service';

export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Employee count ranges (French gov tranche codes) ─────────────────────────
const TRANCHE_LABELS = {
  '00': '0 salarié', '01': '1-2', '02': '3-5', '03': '6-9', '11': '10-19',
  '12': '20-49', '21': '50-99', '22': '100-199', '31': '200-249', '32': '250-499',
  '41': '500-999', '42': '1 000-1 999', '51': '2 000-4 999', '52': '5 000-9 999',
  '53': '10 000+',
};

// ── Source 1 : French Gov API (free, no key, always works) ───────────────────
async function fetchFrenchGovData(companyName) {
  try {
    const res = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(companyName)}&page=1&per_page=3`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const results = data.results || [];
    if (!results.length) return null;

    const c = results[0];
    const tranche = c.tranche_effectif_salarie;
    return {
      siren: c.siren,
      name: c.nom_complet,
      employees: tranche ? (TRANCHE_LABELS[tranche] || tranche) : null,
      created: c.date_creation,
      activity: c.activite_principale,
      city: c.siege?.commune,
      postalCode: c.siege?.code_postal,
      naf: c.activite_principale_registre_metiers,
    };
  } catch {
    return null;
  }
}

// ── Source 2 : DuckDuckGo via Jina Reader (free, no key) ─────────────────────
async function searchDDG(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return 'No results.';
    const text = await res.text();
    // Extract only result snippets (lines with real content, no nav/footer)
    return text
      .split('\n')
      .filter(l => l.trim().length > 80 && !l.includes('duckduckgo.com') && !l.includes('uddg='))
      .slice(0, 8)
      .join(' ')
      .slice(0, 1200) || 'No results.';
  } catch {
    return 'Search unavailable.';
  }
}

// ── Source 3 : Tavily (AI-optimized, requires key) ───────────────────────────
async function searchTavily(query) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return 'Tavily not configured.';
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, query, search_depth: 'basic', max_results: 4 }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    if (!data?.results?.length) return 'No results.';
    return data.results
      .map(r => `[${r.title}] ${r.content?.slice(0, 300) || ''}`)
      .join('\n\n')
      .slice(0, 1500);
  } catch {
    return 'Search unavailable.';
  }
}

// ── Source 4 : Jina Reader — fetch specific URL ───────────────────────────────
async function fetchUrl(url) {
  try {
    const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return 'Page not accessible.';
    return (await res.text())
      .split('\n')
      .filter(l => l.trim().length > 50)
      .slice(0, 15)
      .join('\n')
      .slice(0, 1500) || 'No content.';
  } catch {
    return 'Fetch unavailable.';
  }
}

// ── Source 5 : Exa neural search ─────────────────────────────────────────────
async function searchExa(query) {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) return 'Exa not configured.';
  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ query, numResults: 5, type: 'neural', useAutoprompt: true,
        highlights: { numSentences: 3, highlightsPerUrl: 2 } }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    if (!data?.results?.length) return 'No results.';
    return data.results
      .map(r => `[${r.title}] ${r.highlights?.join(' ') || r.text?.slice(0, 300) || ''}`)
      .join('\n\n').slice(0, 1500);
  } catch {
    return 'Search unavailable.';
  }
}

// ── Tools (Happi Brain Phase 7 — function calling) ───────────────────────────
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'Search the web via DuckDuckGo. Use for: company news, digital strategy, IT investments, press releases, tech projects.',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'tavily_search',
      description: 'AI-optimized search for business intelligence. Use for: recent news, M&A, cloud strategy, IT budget announcements.',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'fetch_url',
      description: 'Fetch a specific URL for detailed company data. Use for: company website (technology clues), LinkedIn jobs page, tech blog.',
      parameters: {
        type: 'object',
        properties: { url: { type: 'string', description: 'Full URL to fetch' } },
        required: ['url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'exa_search',
      description: 'Neural search for high-quality signals. Use for: DSI/CTO profiles, IT recruitment signals, cloud projects.',
      parameters: {
        type: 'object',
        properties: { query: { type: 'string' } },
        required: ['query'],
      },
    },
  },
];

async function executeTool(name, args) {
  switch (name) {
    case 'web_search':    return searchDDG(args.query);
    case 'tavily_search': return searchTavily(args.query);
    case 'fetch_url':     return fetchUrl(args.url);
    case 'exa_search':    return searchExa(args.query);
    default: return 'Unknown tool.';
  }
}

// ── Main analysis (Happi Brain Phase 7 — tool_use loop) ──────────────────────
async function gatherAndAnalyze(accountName, kbContent) {

  // Phase 1 — Always fetch French gov data first (free, instant, reliable)
  const govData = await fetchFrenchGovData(accountName);

  const govContext = govData
    ? `DONNÉES OFFICIELLES (API Entreprises - gouv.fr) :
- Nom officiel : ${govData.name}
- SIREN : ${govData.siren}
- Effectif : ${govData.employees || 'non disponible'}
- Date de création : ${govData.created || 'nc'}
- Code NAF / activité : ${govData.activity || 'nc'}
- Ville : ${govData.city || 'nc'} ${govData.postalCode || ''}
`
    : 'Données officielles non trouvées (entreprise hors France ou nom inexact).';

  const systemPrompt = `Tu es un expert en intelligence commerciale pour Nicolas BAYONNE, Microsoft Partner Account Manager.

${govContext}

KNOWLEDGE BASE MICROSOFT (prix/solutions — utilise EXCLUSIVEMENT ces données pour les recommandations) :
${kbContent}

INSTRUCTIONS DE RECHERCHE :
- Les données officielles ci-dessus sont fiables — utilise-les directement
- Lance 3 à 4 recherches ciblées pour les SIGNAUX DIGITAUX et ACTUALITÉS
- Cible spécifiquement : transformation digitale, projets cloud/IT, recrutements tech, actualités récentes
- Ne refais pas de recherches pour l'effectif ou la date si déjà fournis`;

  const messages = [
    {
      role: 'user',
      content: `Analyse "${accountName}" et génère le dossier commercial complet.

Retourne UNIQUEMENT ce JSON (sans markdown) :
{
  "company": {
    "name": "nom officiel", "industry": "secteur", "size": "startup|sme|enterprise",
    "estimatedRevenue": "fourchette CA", "headquarters": "ville, pays",
    "description": "2 phrases", "website": "domaine.com", "employees": "effectif précis ou fourchette"
  },
  "digitalSignals": [
    "Signal concret 1 — avec source",
    "Signal concret 2 — avec source",
    "Signal concret 3 — avec source"
  ],
  "swot": {
    "strengths": ["F1 — impact Microsoft", "F2", "F3"],
    "weaknesses": ["F1 — angle commercial", "F2", "F3"],
    "opportunities": ["O1 — comment Microsoft répond", "O2", "O3"],
    "threats": ["M1 — comment Microsoft atténue", "M2", "M3"]
  },
  "pestel": {
    "political": "...", "economic": "...", "social": "...",
    "technological": "...", "environmental": "...", "legal": "..."
  },
  "microsoftFit": {
    "score": 75,
    "rationale": "2-3 phrases liées au contexte réel",
    "urgencyLevel": "high|medium|low",
    "buyingSignals": ["Signal d'achat 1", "Signal d'achat 2"]
  },
  "decisionMakers": [
    {"role": "DSI / CTO", "painPoints": "problèmes réels IT", "microsoftAngle": "solution Microsoft adaptée"},
    {"role": "DG / CEO", "painPoints": "enjeux business", "microsoftAngle": "valeur business Microsoft"},
    {"role": "CFO / DAF", "painPoints": "enjeux financiers", "microsoftAngle": "argument TCO/ROI"}
  ],
  "topSolutions": [
    {"product": "produit KB", "plan": "plan KB", "price": "prix KB", "whyFit": "lié au contexte réel", "roi": "ROI KB", "category": "m365|azure|dynamics|power|security", "priority": "must-have|high|medium"},
    {"product": "...", "plan": "...", "price": "...", "whyFit": "...", "roi": "...", "category": "...", "priority": "..."},
    {"product": "...", "plan": "...", "price": "...", "whyFit": "...", "roi": "...", "category": "...", "priority": "..."}
  ],
  "emailAngles": [
    {"angle": "titre court", "hook": "1ère phrase basée sur fait réel", "solution": "produit Microsoft", "persona": "DSI|DG|CFO"},
    {"angle": "...", "hook": "...", "solution": "...", "persona": "..."},
    {"angle": "...", "hook": "...", "solution": "...", "persona": "..."}
  ],
  "keyQuestions": ["Q découverte SWOT", "Q PESTEL", "Q budget/timeline", "Q compétiteurs internes"],
  "competitorRisk": "AWS|Google|SAP|Salesforce — justification",
  "quickWin": "deal rapide — pourquoi maintenant — interlocuteur"
}`,
    },
  ];

  const sourcesUsed = { gov: !!govData, web: false, tavily: false, exa: false, url: false };
  const snippets = [];
  let iterations = 0;
  const MAX_ITERATIONS = 4;

  while (iterations < MAX_ITERATIONS) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      tools: TOOLS,
      tool_choice: 'auto',
      temperature: 0.2,
      max_tokens: 4096,
    });

    iterations++;
    const choice = response.choices[0];
    messages.push(choice.message);

    if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls?.length) {
      const results = await Promise.all(
        choice.message.tool_calls.map(async (call) => {
          const args = JSON.parse(call.function.arguments || '{}');
          const result = await executeTool(call.function.name, args);

          if (call.function.name === 'web_search')    sourcesUsed.web = true;
          if (call.function.name === 'tavily_search') sourcesUsed.tavily = true;
          if (call.function.name === 'exa_search')    sourcesUsed.exa = true;
          if (call.function.name === 'fetch_url')     sourcesUsed.url = true;
          snippets.push(result.slice(0, 150));

          return { role: 'tool', tool_call_id: call.id, content: String(result) };
        })
      );
      messages.push(...results);
    } else {
      const raw = choice.message.content || '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('GPT did not return valid JSON');
      const intel = JSON.parse(jsonMatch[0]);
      return { intel, sourcesUsed, snippetCount: snippets.length, govData };
    }
  }

  // Force final response if max iterations reached
  const final = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt }, ...messages,
      { role: 'user', content: 'Generate the final JSON dossier now based on all gathered data.' },
    ],
    temperature: 0.2, max_tokens: 4096,
  });
  const raw = final.choices[0].message.content || '';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not generate JSON');
  return { intel: JSON.parse(jsonMatch[0]), sourcesUsed, snippetCount: snippets.length, govData };
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { accountName } = await request.json();
    if (!accountName?.trim()) {
      return NextResponse.json({ error: 'accountName is required' }, { status: 400 });
    }

    const kbContent = getFullKb(10000);
    const { intel, sourcesUsed, snippetCount, govData } = await gatherAndAnalyze(accountName.trim(), kbContent);

    // Inject gov data directly into the response (ensures accuracy)
    if (govData) {
      if (govData.employees && intel.company) {
        intel.company.employees = govData.employees;
      }
      if (govData.city && intel.company && (!intel.company.headquarters || intel.company.headquarters === 'Unknown')) {
        intel.company.headquarters = `${govData.city}, France`;
      }
    }

    return NextResponse.json({
      success: true,
      intel,
      webDataUsed: Object.values(sourcesUsed).some(Boolean),
      sourcesUsed,
      snippetCount,
      tokensUsed: 0,
    });
  } catch (error) {
    return handleApiError(error, 'Account Intel');
  }
}
