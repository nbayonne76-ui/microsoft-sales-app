import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// ISR : revalidate every hour automatically on Vercel
export const revalidate = 3600;

// ── Microsoft news queries ────────────────────────────────────────────────────
const MICROSOFT_QUERIES = [
  'Microsoft 365 Copilot new features announcement 2025 2026',
  'Microsoft Azure cloud release update announcement',
  'Dynamics 365 new features update release',
  'Microsoft Teams new features update',
  'Microsoft Defender Sentinel Purview security news',
  'Microsoft AI artificial intelligence announcement',
  'Microsoft 365 E7 Frontier Worker Suite Agent 365',
  'Microsoft Windows 11 enterprise update',
];

const CATEGORY_KEYWORDS = {
  'Microsoft 365': ['m365', 'microsoft 365', 'teams', 'outlook', 'sharepoint', 'exchange', 'onedrive', 'copilot', 'e3', 'e5', 'e7', 'office 365'],
  'Azure & Cloud': ['azure', 'cloud', 'iaas', 'paas', 'kubernetes', 'aks', 'openai service', 'migration', 'serverless', 'devops'],
  'Copilot & IA': ['copilot', 'ai', 'artificial intelligence', 'openai', 'gpt', 'agent', 'llm', 'machine learning', 'generative'],
  'Dynamics 365': ['dynamics', 'crm', 'erp', 'business central', 'sales', 'field service', 'customer service', 'finance', 'supply chain'],
  'Sécurité': ['security', 'defender', 'sentinel', 'purview', 'zero trust', 'mfa', 'identity', 'entra', 'compliance', 'rgpd', 'gdpr', 'nis2'],
};

function detectCategory(title = '', content = '') {
  const text = `${title} ${content}`.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) return cat;
  }
  return 'Microsoft 365';
}

function cleanText(text = '') {
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, 280);
}

// ── Source 1 : Exa.ai neural search ──────────────────────────────────────────
async function fetchExa() {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) return [];

  try {
    const results = await Promise.allSettled(
      MICROSOFT_QUERIES.slice(0, 5).map(query =>
        fetch('https://api.exa.ai/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
          body: JSON.stringify({
            query,
            numResults: 3,
            type: 'neural',
            useAutoprompt: true,
            startPublishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            highlights: { numSentences: 2 },
          }),
        }).then(r => r.json())
      )
    );

    const items = [];
    for (const r of results) {
      if (r.status !== 'fulfilled' || !r.value?.results) continue;
      for (const item of r.value.results) {
        if (!item.title || !item.url) continue;
        const excerpt = item.highlights?.join(' ') || item.text?.slice(0, 280) || '';
        items.push({
          id: `exa-${Buffer.from(item.url).toString('base64').slice(0, 12)}`,
          title: item.title,
          excerpt: cleanText(excerpt),
          url: item.url,
          source: new URL(item.url).hostname.replace('www.', ''),
          date: item.publishedDate || new Date().toISOString(),
          category: detectCategory(item.title, excerpt),
          sourceType: 'exa',
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

// ── Source 2 : Tavily ─────────────────────────────────────────────────────────
async function fetchTavily() {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  try {
    const results = await Promise.allSettled(
      MICROSOFT_QUERIES.slice(0, 4).map(query =>
        fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: apiKey,
            query,
            search_depth: 'basic',
            max_results: 3,
            include_answer: false,
            days: 7,
          }),
        }).then(r => r.json())
      )
    );

    const items = [];
    for (const r of results) {
      if (r.status !== 'fulfilled' || !r.value?.results) continue;
      for (const item of r.value.results) {
        if (!item.title || !item.url) continue;
        items.push({
          id: `tv-${Buffer.from(item.url).toString('base64').slice(0, 12)}`,
          title: item.title,
          excerpt: cleanText(item.content || ''),
          url: item.url,
          source: new URL(item.url).hostname.replace('www.', ''),
          date: item.published_date || new Date().toISOString(),
          category: detectCategory(item.title, item.content),
          sourceType: 'tavily',
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

// ── Source 3 : Jina (free, no key) ───────────────────────────────────────────
async function fetchJina() {
  const queries = [
    'Microsoft Azure AI announcement 2026',
    'Microsoft 365 Copilot update enterprise',
  ];

  try {
    const results = await Promise.allSettled(
      queries.map(q =>
        fetch(`https://s.jina.ai/${encodeURIComponent(q)}`, {
          headers: { Accept: 'application/json', 'X-Return-Format': 'json' },
          signal: AbortSignal.timeout(8000),
        }).then(r => r.json()).catch(() => null)
      )
    );

    const items = [];
    for (const r of results) {
      if (r.status !== 'fulfilled' || !r.value) continue;
      const data = r.value;
      if (data?.title && data?.url) {
        items.push({
          id: `jn-${Buffer.from(data.url).toString('base64').slice(0, 12)}`,
          title: data.title,
          excerpt: cleanText(data.description || data.content?.slice(0, 280) || ''),
          url: data.url,
          source: new URL(data.url).hostname.replace('www.', ''),
          date: new Date().toISOString(),
          category: detectCategory(data.title, data.description),
          sourceType: 'jina',
        });
      }
    }
    return items;
  } catch {
    return [];
  }
}

// ── Dedup + sort by date ──────────────────────────────────────────────────────
function dedup(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = item.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [exaItems, tavilyItems, jinaItems] = await Promise.allSettled([
      fetchExa(),
      fetchTavily(),
      fetchJina(),
    ]);

    const all = [
      ...(exaItems.status   === 'fulfilled' ? exaItems.value   : []),
      ...(tavilyItems.status === 'fulfilled' ? tavilyItems.value : []),
      ...(jinaItems.status  === 'fulfilled' ? jinaItems.value  : []),
    ];

    const news = dedup(all)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);

    return NextResponse.json({
      success: true,
      news,
      count: news.length,
      lastUpdated: new Date().toISOString(),
      sources: {
        exa:    exaItems.status   === 'fulfilled' && exaItems.value.length   > 0,
        tavily: tavilyItems.status === 'fulfilled' && tavilyItems.value.length > 0,
        jina:   jinaItems.status  === 'fulfilled' && jinaItems.value.length  > 0,
      },
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
