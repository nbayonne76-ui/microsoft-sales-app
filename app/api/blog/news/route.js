import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ── HTML entity decoder ───────────────────────────────────────────────────────
function decodeEntities(str = '') {
  return str
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n));
}

// ── Category detection — 3 levels ─────────────────────────────────────────────
// Level 1 : forced by feed definition (most feeds)
// Level 2 : URL path hints (blogs.microsoft.com)
// Level 3 : keyword detection in title+excerpt (last resort)

function detectFromUrl(url = '') {
  const u = url.toLowerCase();
  if (u.includes('/security') || u.includes('/defender') || u.includes('/sentinel') || u.includes('/purview') || u.includes('/threat')) return 'Sécurité';
  if (u.includes('/copilot') || u.includes('/openai') || u.includes('/ai/') || u.includes('/artificial-intelligence')) return 'Copilot & IA';
  if (u.includes('/azure') || u.includes('/cloud')) return 'Azure & Cloud';
  if (u.includes('/dynamics') || u.includes('/business-central') || u.includes('/power-platform') || u.includes('/power-apps')) return 'Dynamics 365';
  if (u.includes('/microsoft-365') || u.includes('/teams') || u.includes('/office-365') || u.includes('/sharepoint') || u.includes('/outlook')) return 'Microsoft 365';
  return null;
}

// Most specific keywords first — avoid false positives on generic terms
const KEYWORD_RULES = [
  { cat: 'Sécurité',     words: ['zero trust', 'ransomware', 'phishing', 'entra id', 'sentinel', 'purview', 'microsoft defender', 'nis2', 'dora', 'gdpr compliance', 'mfa', 'identity protection'] },
  { cat: 'Copilot & IA', words: ['microsoft copilot', 'copilot studio', 'azure openai', 'openai gpt', 'generative ai', 'ai agent', 'large language model', ' llm ', 'machine learning model'] },
  { cat: 'Azure & Cloud', words: ['azure kubernetes', 'azure arc', 'azure sql', 'azure synapse', 'azure fabric', 'azure devops', 'azure migration', 'azure virtual', 'azure container'] },
  { cat: 'Dynamics 365', words: ['dynamics 365', 'business central', 'power platform', 'power apps', 'power automate', 'power bi', 'field service', 'sales hub', 'customer insights'] },
  { cat: 'Microsoft 365', words: ['microsoft 365', 'microsoft teams', 'sharepoint', 'exchange server', 'onedrive', 'office 365', 'viva engage', 'microsoft intune', 'loop workspace'] },
  // Broad fallbacks — only if nothing above matched
  { cat: 'Sécurité',     words: ['defender', 'security update', 'vulnerability', 'cyber'] },
  { cat: 'Copilot & IA', words: ['copilot', 'artificial intelligence', 'openai'] },
  { cat: 'Azure & Cloud', words: ['azure '] },
  { cat: 'Dynamics 365', words: ['dynamics', 'crm ', 'erp '] },
];

function detectFromText(title = '', excerpt = '') {
  const text = `${title} ${excerpt}`.toLowerCase();
  for (const { cat, words } of KEYWORD_RULES) {
    if (words.some(w => text.includes(w))) return cat;
  }
  return 'Microsoft 365'; // final catch-all
}

// Main dispatcher — forcedCategory wins, then URL, then text
function getCategory(forcedCategory, url, title, excerpt) {
  if (forcedCategory != null) return forcedCategory;
  return detectFromUrl(url) ?? detectFromText(title, excerpt);
}

// ─────────────────────────────────────────────────────────────────────────────
// RSS FEEDS — category is FIXED per feed; null = auto-detect
// ─────────────────────────────────────────────────────────────────────────────
const RSS_FEEDS = [
  { url: 'https://blogs.microsoft.com/feed/',                                                                       source: 'blogs.microsoft.com',         category: null,             type: 'rss' },
  { url: 'https://azure.microsoft.com/en-us/blog/feed/',                                                            source: 'azure.microsoft.com',         category: 'Azure & Cloud',  type: 'rss' },
  { url: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',                                                source: 'microsoft.com',               category: 'Microsoft 365',  type: 'rss' },
  { url: 'https://cloudblogs.microsoft.com/dynamics365/feed/',                                                      source: 'cloudblogs.microsoft.com',    category: 'Dynamics 365',   type: 'rss' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=microsoft365blog',        source: 'techcommunity.microsoft.com', category: 'Microsoft 365',  type: 'rss' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=AzureInfrastructureblog', source: 'techcommunity.microsoft.com', category: 'Azure & Cloud',  type: 'rss' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftSecurityandCompliance', source: 'techcommunity.microsoft.com', category: 'Sécurité', type: 'rss' },
  { url: 'https://cloudblogs.microsoft.com/microsoftsecure/feed/',                                                  source: 'cloudblogs.microsoft.com',    category: 'Sécurité',       type: 'rss' },
];

function extractXML(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, 'i'));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i'));
  return plain ? plain[1].trim() : '';
}

function parseRSS(xml, defaultSource, forcedCategory, sourceType = 'rss') {
  const items = [];
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  for (const block of blocks) {
    const content = block[1];
    const title   = decodeEntities(extractXML(content, 'title')).slice(0, 200);
    const link    = extractXML(content, 'link') || extractXML(content, 'guid');
    const rawDesc = decodeEntities(extractXML(content, 'description'));
    const excerpt = rawDesc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 280);
    const pubDate = extractXML(content, 'pubDate');
    if (!title || !link || !link.startsWith('http')) continue;
    let date;
    try { date = new Date(pubDate); if (isNaN(date.getTime())) date = new Date(); } catch { date = new Date(); }
    let source = defaultSource;
    try { source = new URL(link).hostname.replace('www.', ''); } catch {}
    items.push({
      id:         `rss-${Buffer.from(link).toString('base64').slice(0, 12)}`,
      title,
      excerpt,
      url:        link,
      source,
      sourceType,
      date:       date.toISOString(),
      category:   getCategory(forcedCategory, link, title, excerpt),
    });
  }
  return items;
}

async function fetchRSS({ url, source, category, type }) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 MicrosoftSalesApp/1.0' },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return [];
    return parseRSS((await res.text()).slice(0, 512 * 1024), source, category, type);
  } catch { return []; }
}

// ─────────────────────────────────────────────────────────────────────────────
// TAVILY — category FIXED per query
// ─────────────────────────────────────────────────────────────────────────────
const TAVILY_QUERIES = [
  { q: 'Microsoft 365 Teams Outlook SharePoint new features update 2026', category: 'Microsoft 365'  },
  { q: 'Microsoft Copilot AI agent Studio update 2026',                   category: 'Copilot & IA'   },
  { q: 'Microsoft Azure infrastructure cloud release 2026',               category: 'Azure & Cloud'  },
  { q: 'Dynamics 365 Business Central CRM ERP update 2026',              category: 'Dynamics 365'   },
  { q: 'Microsoft Defender Sentinel Purview security 2026',              category: 'Sécurité'        },
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
      const { category } = TAVILY_QUERIES[idx];
      for (const item of r.value.results) {
        if (!item.title || !item.url) continue;
        let date;
        try { date = new Date(item.published_date); if (isNaN(date.getTime())) date = new Date(); } catch { date = new Date(); }
        items.push({
          id:         `tv-${Buffer.from(item.url).toString('base64').slice(0, 12)}`,
          title:      item.title.slice(0, 200),
          excerpt:    (item.content || '').slice(0, 280),
          url:        item.url,
          source:     (() => { try { return new URL(item.url).hostname.replace('www.', ''); } catch { return 'web'; } })(),
          sourceType: 'tavily',
          date:       date.toISOString(),
          category,   // always the query's category — no guessing
        });
      }
    });
    return items;
  } catch { return []; }
}

// ─────────────────────────────────────────────────────────────────────────────
// DDG via Jina — detect from URL then text
// ─────────────────────────────────────────────────────────────────────────────
const DDG_QUERIES = [
  'Microsoft 365 Teams Copilot news site:techcommunity.microsoft.com OR site:blogs.microsoft.com',
  'Microsoft Azure security Dynamics news 2026 site:techcommunity.microsoft.com',
];

function parseDDGSnippets(text) {
  const items = [];
  const urlPattern = /\[([^\]]{10,150})\]\(https?:\/\/([^\)]+)\)/g;
  let match;
  while ((match = urlPattern.exec(text)) !== null) {
    const title  = match[1].trim();
    const rawUrl = match[2];
    if (!title || !rawUrl) continue;
    if (rawUrl.includes('duckduckgo') || rawUrl.includes('uddg=')) continue;
    let url;
    try { url = `https://${rawUrl}`; new URL(url); } catch { continue; }
    const idx     = text.indexOf(match[0]);
    const snippet = text.slice(idx + match[0].length, idx + match[0].length + 300)
      .replace(/\[.*?\]\(.*?\)/g, ' ').replace(/\n/g, ' ').trim().slice(0, 280);
    if (!items.find(i => i.url === url)) {
      items.push({
        id:         `ddg-${Buffer.from(url).toString('base64').slice(0, 12)}`,
        title:      title.slice(0, 200),
        excerpt:    snippet || title,
        url,
        source:     (() => { try { return new URL(url).hostname.replace('www.', ''); } catch { return 'web'; } })(),
        sourceType: 'jina',
        date:       new Date().toISOString(),
        category:   getCategory(null, url, title, snippet),
      });
    }
    if (items.length >= 6) break;
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
      // Court cache : 5 minutes sur le CDN, revalidation en arrière-plan
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
