import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ── HTML entity decoder ───────────────────────────────────────────────────────
function decodeEntities(str = '') {
  return str
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
}

// ── Keyword detection — used ONLY for blogs.microsoft.com (mixed) + DDG ──────
// Order: most specific first, M365 last (broadest catch-all)
const CATEGORY_KEYWORDS = [
  { cat: 'Sécurité',     kw: ['security', 'defender', 'sentinel', 'purview', 'zero trust', 'entra', 'mfa', 'compliance', 'gdpr', 'nis2', 'ransomware', 'phishing', 'threat intel'] },
  { cat: 'Copilot & IA', kw: ['copilot', 'openai', ' gpt', ' llm ', 'generative ai', 'ai agent', 'machine learning', 'artificial intelligence'] },
  { cat: 'Azure & Cloud', kw: ['azure ', 'iaas', 'paas', 'kubernetes', 'aks', 'serverless', 'devops', 'azure synapse', 'azure fabric', 'azure arc', 'azure sql'] },
  { cat: 'Dynamics 365', kw: ['dynamics 365', 'dynamics365', 'business central', 'field service', 'power platform', 'power apps', 'power automate', 'power bi'] },
  { cat: 'Microsoft 365', kw: ['microsoft 365', 'teams', 'outlook', 'sharepoint', 'exchange', 'onedrive', 'office 365', 'viva', 'intune', 'm365'] },
];

function detectCategoryFromText(text = '') {
  const lower = text.toLowerCase();
  for (const { cat, kw } of CATEGORY_KEYWORDS) {
    if (kw.some(k => lower.includes(k))) return cat;
  }
  return 'Microsoft 365';
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 1 — RSS feeds — category is FIXED per feed, no keyword detection
// ─────────────────────────────────────────────────────────────────────────────
const RSS_FEEDS = [
  // category: null → detect from article text (mixed blog)
  { url: 'https://blogs.microsoft.com/feed/',                                                                       source: 'blogs.microsoft.com',       category: null },
  // Explicit categories — every article from these feeds gets the fixed category
  { url: 'https://azure.microsoft.com/en-us/blog/feed/',                                                            source: 'azure.microsoft.com',       category: 'Azure & Cloud'  },
  { url: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',                                                source: 'microsoft.com',             category: 'Microsoft 365'  },
  { url: 'https://cloudblogs.microsoft.com/dynamics365/feed/',                                                      source: 'cloudblogs.microsoft.com',  category: 'Dynamics 365'   },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=microsoft365blog',        source: 'techcommunity.microsoft.com', category: 'Microsoft 365' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=AzureInfrastructureblog', source: 'techcommunity.microsoft.com', category: 'Azure & Cloud' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftSecurityandCompliance', source: 'techcommunity.microsoft.com', category: 'Sécurité' },
  { url: 'https://cloudblogs.microsoft.com/microsoftsecure/feed/',                                                  source: 'cloudblogs.microsoft.com',  category: 'Sécurité'       },
];

function extractXML(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, 'i'));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i'));
  return plain ? plain[1].trim() : '';
}

function parseRSS(xml, defaultSource, forcedCategory) {
  const items = [];
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  for (const block of blocks) {
    const content = block[1];
    const title = decodeEntities(extractXML(content, 'title')).slice(0, 200);
    const link  = extractXML(content, 'link') || extractXML(content, 'guid');
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
      // Use forced category if defined, otherwise detect from text
      category: forcedCategory ?? detectCategoryFromText(`${title} ${description}`),
    });
  }
  return items;
}

async function fetchRSS({ url, source, category }) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 MicrosoftSalesApp/1.0' },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return [];
    return parseRSS((await res.text()).slice(0, 512 * 1024), source, category);
  } catch { return []; }
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 2 — Tavily — category is FIXED per query
// ─────────────────────────────────────────────────────────────────────────────
const TAVILY_QUERIES = [
  { q: 'Microsoft 365 Teams Outlook new features 2026',                category: 'Microsoft 365'  },
  { q: 'Microsoft Copilot AI agent new capabilities 2026',             category: 'Copilot & IA'   },
  { q: 'Microsoft Azure cloud infrastructure release 2026',            category: 'Azure & Cloud'  },
  { q: 'Dynamics 365 Business Central CRM update 2026',                category: 'Dynamics 365'   },
  { q: 'Microsoft Security Defender Sentinel Purview announcement 2026', category: 'Sécurité'     },
];

async function fetchTavily() {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  try {
    const results = await Promise.allSettled(
      TAVILY_QUERIES.map(({ q }) =>
        fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: key, query: q, search_depth: 'basic', max_results: 3, days: 7 }),
          signal: AbortSignal.timeout(5000),
        }).then(r => r.json())
      )
    );
    const items = [];
    results.forEach((r, idx) => {
      if (r.status !== 'fulfilled' || !r.value?.results) return;
      const forcedCategory = TAVILY_QUERIES[idx].category;
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
          category: forcedCategory, // always use the query's category
        });
      }
    });
    return items;
  } catch { return []; }
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 3 — DuckDuckGo via Jina (free, detect from text)
// ─────────────────────────────────────────────────────────────────────────────
const DDG_QUERIES = [
  'Microsoft 365 Copilot news site:techcommunity.microsoft.com OR site:blogs.microsoft.com',
  'Microsoft Azure Copilot AI announcement June 2026',
];

function parseDDGSnippets(text) {
  const items = [];
  const urlPattern = /\[([^\]]{10,150})\]\(https?:\/\/([^\)]+)\)/g;
  let match;
  while ((match = urlPattern.exec(text)) !== null) {
    const title = match[1].trim();
    const rawUrl = match[2];
    if (!title || !rawUrl) continue;
    if (rawUrl.includes('duckduckgo') || rawUrl.includes('uddg=')) continue;
    let url;
    try { url = `https://${rawUrl}`; new URL(url); } catch { continue; }
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
        category: detectCategoryFromText(`${title} ${snippet}`),
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
        items.push(...parseDDGSnippets(await res.text()));
      } catch {}
    })
  );
  return items;
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE
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

    const seen = new Set();
    const news = all
      .filter(item => {
        if (!item.url || seen.has(item.url)) return false;
        seen.add(item.url);
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 60);

    if (news.length === 0) {
      return NextResponse.json({ success: false, error: 'No news available' }, { status: 503 });
    }

    return NextResponse.json(
      { success: true, news, count: news.length, lastUpdated: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
