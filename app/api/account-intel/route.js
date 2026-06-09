import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleApiError } from '@/lib/api-error';
import { getFullKb } from '@/lib/kb-service';

export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Source 1 : Exa.ai ─────────────────────────────────────────────────────────
async function searchExa(companyName) {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) return [];
  try {
    const results = await Promise.allSettled(
      [
        `${companyName} digital transformation cloud Microsoft stratégie IT 2024 2025`,
        `${companyName} DSI directeur informatique CTO recrutement technologie`,
        `${companyName} rapport annuel résultats financiers actualité`,
      ].map(query =>
        fetch('https://api.exa.ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
          body: JSON.stringify({ query, numResults: 4, type: 'neural', useAutoprompt: true, highlights: { numSentences: 3, highlightsPerUrl: 2 } }),
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
  } catch { return []; }
}

// ── Source 2 : Jina ───────────────────────────────────────────────────────────
async function searchJina(companyName) {
  try {
    const results = await Promise.allSettled(
      [
        `${companyName} stratégie numérique cloud innovation Microsoft`,
        `${companyName} actualité entreprise technologie 2024 2025`,
      ].map(q =>
        fetch(`https://s.jina.ai/${encodeURIComponent(q)}`, {
          headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
          signal: AbortSignal.timeout(4000),
        }).then(r => r.text())
      )
    );
    const snippets = [];
    for (const r of results) {
      if (r.status === 'fulfilled' && r.value?.length > 100) {
        const lines = r.value.split('\n').filter(l => l.trim().length > 60).slice(0, 8).join(' ');
        if (lines) snippets.push(`[Jina Web] ${lines.slice(0, 800)}`);
      }
    }
    return snippets;
  } catch { return []; }
}

// ── Source 3 : Tavily ─────────────────────────────────────────────────────────
async function searchTavily(companyName) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];
  try {
    const results = await Promise.allSettled(
      [
        `${companyName} projet cloud Microsoft Azure transformation numérique`,
        `${companyName} recrutement DSI architecte cloud sécurité informatique`,
        `${companyName} budget IT investissement technologie 2024 2025`,
      ].map(q =>
        fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: apiKey, query: q, search_depth: 'basic', max_results: 3, include_answer: true }),
        }).then(r => r.json())
      )
    );
    const snippets = [];
    for (const r of results) {
      if (r.status !== 'fulfilled' || !r.value?.results) continue;
      for (const item of r.value.results) {
        if (item.content) snippets.push(`[Tavily — ${item.title}] ${item.content.slice(0, 400)}`);
      }
    }
    return snippets;
  } catch { return []; }
}

// ── Contact finder ────────────────────────────────────────────────────────────
async function findDecisionMakers(companyName) {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        query: `${companyName} DSI directeur informatique CTO site:linkedin.com`,
        numResults: 5, type: 'neural', useAutoprompt: true,
        highlights: { numSentences: 2, highlightsPerUrl: 1 },
      }),
    });
    const data = await res.json();
    if (!data?.results?.length) return null;
    return data.results.map(r => `${r.title}: ${r.url}`).slice(0, 4).join('\n');
  } catch { return null; }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { accountName } = await request.json();
    if (!accountName?.trim()) {
      return NextResponse.json({ error: 'accountName is required' }, { status: 400 });
    }

    const enrichTimeout = new Promise(resolve =>
      setTimeout(() => resolve({ snippets: [], contacts: null, sourcesUsed: { exa: false, jina: false, tavily: false } }), 6000)
    );

    const [kbContent, enriched] = await Promise.all([
      Promise.resolve(getFullKb(10000)),
      Promise.race([
        (async () => {
          const [exaR, jinaR, tavilyR, contactsR] = await Promise.allSettled([
            searchExa(accountName), searchJina(accountName), searchTavily(accountName), findDecisionMakers(accountName),
          ]);
          const snippets = [
            ...(exaR.status === 'fulfilled' ? exaR.value : []),
            ...(jinaR.status === 'fulfilled' ? jinaR.value : []),
            ...(tavilyR.status === 'fulfilled' ? tavilyR.value : []),
          ];
          return {
            snippets,
            contacts: contactsR.status === 'fulfilled' ? contactsR.value : null,
            sourcesUsed: {
              exa:    exaR.status === 'fulfilled' && exaR.value.length > 0,
              jina:   jinaR.status === 'fulfilled' && jinaR.value.length > 0,
              tavily: tavilyR.status === 'fulfilled' && tavilyR.value.length > 0,
            },
          };
        })(),
        enrichTimeout,
      ]),
    ]);

    const { snippets, contacts, sourcesUsed } = enriched;
    const webDataUsed = snippets.length > 0;

    const sourceLabels = Object.entries(sourcesUsed).filter(([, v]) => v).map(([k]) => k.charAt(0).toUpperCase() + k.slice(1)).join(' + ');
    let webSection = webDataUsed
      ? `\n\n## DONNÉES WEB (${sourceLabels})\n${snippets.join('\n\n')}${contacts ? `\n\n## DÉCIDEURS DÉTECTÉS\n${contacts}` : ''}`
      : '\n\n## DONNÉES WEB : non disponibles — utilise ta connaissance générale de cette entreprise.';

    const systemPrompt = `Tu es un expert en intelligence commerciale pour un Account Manager Microsoft.
Produis un dossier de prospection complet et structuré.
RÈGLES : solutions/prix uniquement depuis la KNOWLEDGE BASE · SWOT et PESTEL basés sur données web + connaissance générale · sois factuel et commercial.

KNOWLEDGE BASE MICROSOFT :
${kbContent}
${webSection}`;

    const userPrompt = `Entreprise : "${accountName}"

Retourne UNIQUEMENT un JSON valide (pas de markdown) :
{
  "company": { "name":"...","industry":"...","size":"startup|sme|enterprise","estimatedRevenue":"...","headquarters":"...","description":"...","website":"...","employees":"..." },
  "digitalSignals": ["Signal 1","Signal 2","Signal 3"],
  "swot": { "strengths":["...","...","..."],"weaknesses":["...","...","..."],"opportunities":["...","...","..."],"threats":["...","...","..."] },
  "pestel": { "political":"...","economic":"...","social":"...","technological":"...","environmental":"...","legal":"..." },
  "microsoftFit": { "score":85,"rationale":"...","urgencyLevel":"high|medium|low","buyingSignals":["...","..."] },
  "decisionMakers": [
    {"role":"DSI / CTO","painPoints":"...","microsoftAngle":"..."},
    {"role":"DG / CEO","painPoints":"...","microsoftAngle":"..."},
    {"role":"CFO / DAF","painPoints":"...","microsoftAngle":"..."}
  ],
  "topSolutions": [
    {"product":"...","plan":"...","price":"...","whyFit":"...","roi":"...","category":"m365|azure|dynamics|power|security","priority":"must-have|high|medium"},
    {"product":"...","plan":"...","price":"...","whyFit":"...","roi":"...","category":"...","priority":"..."},
    {"product":"...","plan":"...","price":"...","whyFit":"...","roi":"...","category":"...","priority":"..."}
  ],
  "emailAngles": [
    {"angle":"...","hook":"...","solution":"...","persona":"DSI|DG|CFO"},
    {"angle":"...","hook":"...","solution":"...","persona":"..."},
    {"angle":"...","hook":"...","solution":"...","persona":"..."}
  ],
  "keyQuestions": ["Question 1","Question 2","Question 3","Question 4"],
  "competitorRisk": "...",
  "quickWin": "..."
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.4,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    let intel;
    try {
      intel = JSON.parse(response.choices[0].message.content);
    } catch {
      return NextResponse.json({ error: 'La génération a échoué — réessaie dans quelques secondes.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      intel,
      webDataUsed,
      sourcesUsed,
      snippetCount: snippets.length,
      tokensUsed: response.usage?.total_tokens || 0,
    });
  } catch (error) {
    return handleApiError(error, 'Account Intel');
  }
}
