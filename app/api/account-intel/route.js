import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleApiError } from '@/lib/api-error';
import { getFullKb } from '@/lib/kb-service';

export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Tool executors (Happi Brain Phase 7 pattern) ──────────────────────────────

// Jina Reader — fetches any URL and returns clean text (free, no key needed)
async function toolFetchUrl(url) {
  try {
    const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return 'Page not accessible.';
    const text = await res.text();
    return text
      .split('\n')
      .filter(l => l.trim().length > 40)
      .slice(0, 15)
      .join('\n')
      .slice(0, 2000) || 'No content found.';
  } catch {
    return 'Fetch unavailable.';
  }
}

async function toolWebSearch(query) {
  try {
    const res = await fetch(`https://s.jina.ai/${encodeURIComponent(query)}`, {
      headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return 'No results found.';
    const text = await res.text();
    return text
      .split('\n')
      .filter(l => l.trim().length > 60)
      .slice(0, 10)
      .join(' ')
      .slice(0, 1200) || 'No relevant results.';
  } catch {
    return 'Search unavailable.';
  }
}

async function toolExaSearch(query) {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) return 'Exa not configured.';
  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        query, numResults: 5, type: 'neural', useAutoprompt: true,
        highlights: { numSentences: 3, highlightsPerUrl: 2 },
      }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    if (!data?.results?.length) return 'No results.';
    return data.results
      .map(r => `[${r.title}] ${(r.highlights?.join(' ') || r.text?.slice(0, 300) || '')}`)
      .join('\n\n')
      .slice(0, 1500);
  } catch {
    return 'Search unavailable.';
  }
}

async function toolTavilySearch(query) {
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

// ── Tool definitions (OpenAI function-calling = Happi Brain tool_use pattern) ─

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'fetch_url',
      description: 'Fetch a specific URL and return its text content. Use to read company registry pages (pappers.fr, societe.com, infogreffe.fr) for precise employee count, revenue, SIREN, creation date.',
      parameters: {
        type: 'object',
        properties: {
          url: { type: 'string', description: 'Full URL to fetch, e.g. https://www.pappers.fr/recherche?q=company+name' }
        },
        required: ['url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'web_search',
      description: 'Search the web for information about the company. Use for: general info, recent news, digital transformation, cloud strategy, annual reports.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Specific search query in French or English' }
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'exa_search',
      description: 'Neural search for high-quality company intelligence. Use for: DSI/CTO profiles, tech investments, IT recruitment signals, cloud projects.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Neural search query' }
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'tavily_search',
      description: 'AI-optimized search for business and tech news. Use for: M&A news, budget IT, digital strategy announcements, regulatory context.',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Business-focused search query' }
        },
        required: ['query'],
      },
    },
  },
];

async function executeTool(name, args) {
  switch (name) {
    case 'fetch_url':     return toolFetchUrl(args.url);
    case 'web_search':    return toolWebSearch(args.query);
    case 'exa_search':    return toolExaSearch(args.query);
    case 'tavily_search': return toolTavilySearch(args.query);
    default: return 'Unknown tool.';
  }
}

// ── Happi Brain Phase 7 — tool_use loop ───────────────────────────────────────

async function gatherAndAnalyze(accountName, kbContent) {
  const systemPrompt = `Tu es un expert en intelligence commerciale pour Nicolas BAYONNE, Microsoft Partner Account Manager.

MISSION : Analyser l'entreprise "${accountName}" et générer un dossier de prospection complet.

PROCESSUS OBLIGATOIRE :
1. Commence TOUJOURS par fetch_url sur https://www.pappers.fr/recherche?q={NOM_ENTREPRISE} pour obtenir effectif, CA, SIREN
2. Si pappers ne donne pas de résultat, tente fetch_url sur https://www.societe.com/cgi-bin/search?champs={NOM_ENTREPRISE}
3. Lance 2-3 recherches web_search ou tavily_search pour les signaux digitaux, actualités, stratégie IT
4. Génère le JSON final en utilisant EXCLUSIVEMENT les prix/solutions de la KNOWLEDGE BASE pour les recommandations
5. Ne mets JAMAIS "Unknown" si tu as trouvé l'info — cherche jusqu'à l'avoir

KNOWLEDGE BASE MICROSOFT :
${kbContent}`;

  const messages = [
    {
      role: 'user',
      content: `Analyse l'entreprise "${accountName}" et génère un dossier commercial complet.

Après tes recherches, retourne UNIQUEMENT ce JSON valide (sans markdown) :
{
  "company": {
    "name": "...", "industry": "...", "size": "startup|sme|enterprise",
    "estimatedRevenue": "...", "headquarters": "...", "description": "...",
    "website": "...", "employees": "..."
  },
  "digitalSignals": ["Signal 1", "Signal 2", "Signal 3"],
  "swot": {
    "strengths": ["...","...","..."],
    "weaknesses": ["...","...","..."],
    "opportunities": ["...","...","..."],
    "threats": ["...","...","..."]
  },
  "pestel": {
    "political": "...", "economic": "...", "social": "...",
    "technological": "...", "environmental": "...", "legal": "..."
  },
  "microsoftFit": {
    "score": 85,
    "rationale": "...",
    "urgencyLevel": "high|medium|low",
    "buyingSignals": ["...", "..."]
  },
  "decisionMakers": [
    {"role": "DSI / CTO", "painPoints": "...", "microsoftAngle": "..."},
    {"role": "DG / CEO", "painPoints": "...", "microsoftAngle": "..."},
    {"role": "CFO / DAF", "painPoints": "...", "microsoftAngle": "..."}
  ],
  "topSolutions": [
    {"product": "...", "plan": "...", "price": "...", "whyFit": "...", "roi": "...", "category": "m365|azure|dynamics|power|security", "priority": "must-have|high|medium"},
    {"product": "...", "plan": "...", "price": "...", "whyFit": "...", "roi": "...", "category": "...", "priority": "..."},
    {"product": "...", "plan": "...", "price": "...", "whyFit": "...", "roi": "...", "category": "...", "priority": "..."}
  ],
  "emailAngles": [
    {"angle": "...", "hook": "...", "solution": "...", "persona": "DSI|DG|CFO"},
    {"angle": "...", "hook": "...", "solution": "...", "persona": "..."},
    {"angle": "...", "hook": "...", "solution": "...", "persona": "..."}
  ],
  "keyQuestions": ["Q1", "Q2", "Q3", "Q4"],
  "competitorRisk": "...",
  "quickWin": "..."
}`,
    },
  ];

  const sourcesUsed = { registry: false, web: false, exa: false, tavily: false };
  const snippets = [];
  let iterations = 0;
  const MAX_ITERATIONS = 4;

  // ── Tool-use loop (Happi Brain Phase 7 pattern) ───────────────────────────
  while (iterations < MAX_ITERATIONS) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      tools: TOOLS,
      tool_choice: 'auto',
      temperature: 0.3,
      max_tokens: 4096,
    });

    iterations++;
    const choice = response.choices[0];

    // Push the raw message object — never reconstruct it (content may be null when tool_calls present)
    messages.push(choice.message);

    if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls?.length) {
      // Execute all tool calls in parallel
      const results = await Promise.all(
        choice.message.tool_calls.map(async (call) => {
          const args = JSON.parse(call.function.arguments || '{}');
          const result = await executeTool(call.function.name, args);

          if (call.function.name === 'fetch_url')     sourcesUsed.registry = true;
          if (call.function.name === 'web_search')    sourcesUsed.web = true;
          if (call.function.name === 'exa_search')    sourcesUsed.exa = true;
          if (call.function.name === 'tavily_search') sourcesUsed.tavily = true;
          snippets.push(result.slice(0, 200));

          return { role: 'tool', tool_call_id: call.id, content: String(result) };
        })
      );
      messages.push(...results);

    } else {
      // Final response — extract JSON
      const raw = choice.message.content || '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('GPT did not return valid JSON');
      const intel = JSON.parse(jsonMatch[0]);
      return { intel, sourcesUsed, snippetCount: snippets.length };
    }
  }

  // Max iterations — force a final JSON response without tools
  const final = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'system', content: systemPrompt }, ...messages, {
      role: 'user',
      content: 'Based on all the research above, generate the final JSON dossier now. Return ONLY the JSON object.',
    }],
    temperature: 0.3,
    max_tokens: 4096,
  });
  const raw = final.choices[0].message.content || '';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not generate JSON dossier');
  return { intel: JSON.parse(jsonMatch[0]), sourcesUsed, snippetCount: snippets.length };
}

// ── Main handler ──────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const { accountName } = await request.json();
    if (!accountName?.trim()) {
      return NextResponse.json({ error: 'accountName is required' }, { status: 400 });
    }

    const kbContent = getFullKb(10000);
    const { intel, sourcesUsed, snippetCount } = await gatherAndAnalyze(accountName.trim(), kbContent);

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
