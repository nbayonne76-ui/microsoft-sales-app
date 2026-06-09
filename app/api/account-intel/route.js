import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleApiError } from '@/lib/api-error';
import { getFullKb } from '@/lib/kb-service';

export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Tool executors (Happi Brain Phase 7 pattern) ──────────────────────────────

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

PROCESSUS :
1. Lance 3 à 5 recherches ciblées via les outils disponibles (web, exa, tavily)
2. Analyse les données récupérées
3. Génère le JSON final en utilisant EXCLUSIVEMENT les prix/solutions de la KNOWLEDGE BASE pour les recommandations

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

  const sourcesUsed = { web: false, exa: false, tavily: false };
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
    messages.push({ role: 'assistant', content: choice.message.content, tool_calls: choice.message.tool_calls });

    if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls?.length) {
      // Execute all tool calls in parallel
      const results = await Promise.all(
        choice.message.tool_calls.map(async (call) => {
          const args = JSON.parse(call.function.arguments || '{}');
          const result = await executeTool(call.function.name, args);

          // Track sources
          if (call.function.name === 'web_search') sourcesUsed.web = true;
          if (call.function.name === 'exa_search') sourcesUsed.exa = true;
          if (call.function.name === 'tavily_search') sourcesUsed.tavily = true;
          snippets.push(`[${call.function.name}:${args.query}] ${result.slice(0, 200)}`);

          return { role: 'tool', tool_call_id: call.id, content: result };
        })
      );
      messages.push(...results);

    } else {
      // Final response — extract JSON
      const raw = choice.message.content || '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in final response');
      const intel = JSON.parse(jsonMatch[0]);
      return { intel, sourcesUsed, snippetCount: snippets.length };
    }
  }

  throw new Error('Max iterations reached without final response');
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
