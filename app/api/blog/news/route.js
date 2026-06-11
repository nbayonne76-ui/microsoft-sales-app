import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ── HTML entity decoder ───────────────────────────────────────────────────────
function decodeEntities(str = '') {
  return str
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
}

// ── Category detection ────────────────────────────────────────────────────────
// Order matters: more specific first, M365 last (broadest)
const CATEGORY_KEYWORDS = {
  'Sécurité':     ['security', 'defender', 'sentinel', 'purview', 'zero trust', 'mfa', 'identity', 'entra', 'compliance', 'rgpd', 'gdpr', 'nis2', 'dora', 'ransomware', 'phishing', 'threat'],
  'Copilot & IA': ['copilot', 'openai', 'gpt', ' llm', 'machine learning', 'generative ai', 'ai agent', 'artificial intelligence', 'work iq', 'phi-'],
  'Azure & Cloud':['azure', 'iaas', 'paas', 'kubernetes', 'aks', 'openai service', 'serverless', 'devops', 'fabric', 'synapse', 'azure arc', 'azure sql'],
  'Dynamics 365': ['dynamics', 'crm', 'erp', 'business central', 'sales hub', 'field service', 'customer service', 'supply chain', 'power platform', 'power apps', 'power automate'],
  'Microsoft 365':['microsoft 365', 'teams', 'outlook', 'sharepoint', 'exchange', 'onedrive', 'office 365', 'viva', 'loop', 'm365', 'intune'],
};

// Feed URL → forced category (overrides keyword detection)
const FEED_CATEGORY_MAP = {
  'azure.microsoft.com':                   'Azure & Cloud',
  'dynamics365':                           'Dynamics 365',
  'microsoft-365':                         'Microsoft 365',
  'microsoft365blog':                      'Microsoft 365',
  'AzureInfrastructureblog':               'Azure & Cloud',
  'MicrosoftSecurityandCompliance':        'Sécurité',
  'microsoftsecure':                       'Sécurité',
};

function detectCategory(text = '', feedHint = '') {
  // Try feed-based hint first
  for (const [key, cat] of Object.entries(FEED_CATEGORY_MAP)) {
    if (feedHint.includes(key)) return cat;
  }
  // Fall back to keyword detection (specific → broad)
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return cat;
  }
  return 'Microsoft 365';
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 1 — RSS feeds (8 sources Microsoft officielles)
// ─────────────────────────────────────────────────────────────────────────────
const RSS_FEEDS = [
  { url: 'https://blogs.microsoft.com/feed/',                                                                    source: 'blogs.microsoft.com' },
  { url: 'https://azure.microsoft.com/en-us/blog/feed/',                                                         source: 'azure.microsoft.com' },
  { url: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',                                             source: 'microsoft.com/m365' },
  { url: 'https://cloudblogs.microsoft.com/dynamics365/feed/',                                                   source: 'cloudblogs.microsoft.com' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=microsoft365blog',     source: 'techcommunity.microsoft.com' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=AzureInfrastructureblog', source: 'techcommunity.microsoft.com' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftSecurityandCompliance', source: 'techcommunity.microsoft.com' },
  { url: 'https://cloudblogs.microsoft.com/microsoftsecure/feed/',                                               source: 'cloudblogs.microsoft.com' },
];

function extractXML(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, 'i'));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i'));
  return plain ? plain[1].trim() : '';
}

function parseRSS(xml, defaultSource, feedUrl = '') {
  const items = [];
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  for (const block of blocks) {
    const content = block[1];
    const title = decodeEntities(extractXML(content, 'title')).slice(0, 200);
    const link = extractXML(content, 'link') || extractXML(content, 'guid');
    const rawDesc = decodeEntities(extractXML(content, 'description'));
    const description = rawDesc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 280);
    const pubDate = extractXML(content, 'pubDate');
    if (!title || !link || !link.startsWith('http')) continue;
    let date;
    try { date = new Date(pubDate); if (isNaN(date.getTime())) date = new Date(); } catch { date = new Date(); }
    let source = defaultSource;
    try { source = new URL(link).hostname.replace('www.', ''); } catch {}
    items.push({
      id: `rss-${Buffer.from(link).toString('base64').slice(0, 12)}`,
      title,
      excerpt: description,
      url: link,
      source,
      date: date.toISOString(),
      category: detectCategory(`${title} ${description}`, feedUrl),
    });
  }
  return items;
}

async function fetchRSS({ url, source }) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 MicrosoftSalesApp/1.0' },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return [];
    return parseRSS((await res.text()).slice(0, 512 * 1024), source, url);
  } catch { return []; }
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 2 — Tavily (AI-optimized, has key, real-time)
// ─────────────────────────────────────────────────────────────────────────────
const TAVILY_QUERIES = [
  'Microsoft 365 Copilot new features announcement 2026',
  'Microsoft Azure release update cloud 2026',
  'Dynamics 365 update release 2026',
  'Microsoft Security Defender Sentinel announcement 2026',
  'Microsoft Teams Copilot AI agent new 2026',
];

async function fetchTavily() {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  try {
    const results = await Promise.allSettled(
      TAVILY_QUERIES.map(q =>
        fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: key, query: q, search_depth: 'basic', max_results: 3, days: 7 }),
          signal: AbortSignal.timeout(5000),
        }).then(r => r.json())
      )
    );
    const items = [];
    for (const r of results) {
      if (r.status !== 'fulfilled' || !r.value?.results) continue;
      for (const item of r.value.results) {
        if (!item.title || !item.url) continue;
        let date;
        try { date = new Date(item.published_date); if (isNaN(date.getTime())) date = new Date(); } catch { date = new Date(); }
        items.push({
          id: `tv-${Buffer.from(item.url).toString('base64').slice(0, 12)}`,
          title: item.title.slice(0, 200),
          excerpt: (item.content || '').slice(0, 280),
          url: item.url,
          source: (() => { try { return new URL(item.url).hostname.replace('www.', ''); } catch { return 'web'; } })(),
          date: date.toISOString(),
          category: detectCategory(`${item.title} ${item.content || ''}`),
        });
      }
    }
    return items;
  } catch { return []; }
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 3 — DuckDuckGo via Jina Reader (free, no key, real-time)
// ─────────────────────────────────────────────────────────────────────────────
const DDG_QUERIES = [
  'Microsoft 365 Copilot news site:techcommunity.microsoft.com OR site:blogs.microsoft.com',
  'Microsoft Azure Copilot AI announcement June 2026',
];

function parseDDGSnippets(text, query) {
  const items = [];
  const lines = text.split('\n').filter(l => l.trim().length > 80);

  // Extract titles and URLs from DDG HTML response
  const urlPattern = /\[([^\]]{10,150})\]\(https?:\/\/([^\)]+)\)/g;
  let match;
  while ((match = urlPattern.exec(text)) !== null) {
    const title = match[1].trim();
    const rawUrl = match[2];
    if (!title || !rawUrl) continue;
    if (rawUrl.includes('duckduckgo') || rawUrl.includes('uddg=')) continue;

    let url;
    try { url = `https://${rawUrl}`; new URL(url); } catch { continue; }

    // Find snippet after this URL
    const idx = text.indexOf(match[0]);
    const snippet = text.slice(idx + match[0].length, idx + match[0].length + 300)
      .replace(/\[.*?\]\(.*?\)/g, ' ').replace(/\n/g, ' ').trim().slice(0, 280);

    if (!items.find(i => i.url === url)) {
      items.push({
        id: `ddg-${Buffer.from(url).toString('base64').slice(0, 12)}`,
        title: title.slice(0, 200),
        excerpt: snippet || title,
        url,
        source: (() => { try { return new URL(url).hostname.replace('www.', ''); } catch { return 'web'; } })(),
        date: new Date().toISOString(),
        category: detectCategory(`${title} ${snippet}`),
      });
    }
    if (items.length >= 4) break;
  }
  return items;
}

async function fetchDDG() {
  const items = [];
  await Promise.allSettled(
    DDG_QUERIES.map(async (q) => {
      try {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
        const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
          headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
          signal: AbortSignal.timeout(6000),
        });
        if (!res.ok) return;
        const text = await res.text();
        items.push(...parseDDGSnippets(text, q));
      } catch {}
    })
  );
  return items;
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE — all 3 sources in parallel
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const [rssResults, tavilyItems, ddgItems] = await Promise.allSettled([
      Promise.all(RSS_FEEDS.map(fetchRSS)).then(r => r.flat()),
      fetchTavily(),
      fetchDDG(),
    ]);

    const all = [
      ...(rssResults.status  === 'fulfilled' ? rssResults.value  : []),
      ...(tavilyItems.status === 'fulfilled' ? tavilyItems.value : []),
      ...(ddgItems.status    === 'fulfilled' ? ddgItems.value    : []),
    ];

    // Dedup by URL, sort newest first, cap at 40
    const seen = new Set();
    const news = all
      .filter(item => {
        if (!item.url || seen.has(item.url)) return false;
        seen.add(item.url);
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 40);

    if (news.length === 0) {
      return NextResponse.json({ success: false, error: 'No news available' }, { status: 503 });
    }

    return NextResponse.json(
      {
        success: true,
        news,
        count: news.length,
        lastUpdated: new Date().toISOString(),
        sources: {
          rss:    rssResults.status  === 'fulfilled' && rssResults.value.length   > 0,
          tavily: tavilyItems.status === 'fulfilled' && tavilyItems.value.length  > 0,
          ddg:    ddgItems.status    === 'fulfilled' && ddgItems.value.length     > 0,
        },
      },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
