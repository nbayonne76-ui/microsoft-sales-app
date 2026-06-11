import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ── HTML entity decoder ───────────────────────────────────────────────────────
function decodeEntities(str = '') {
  return str
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

// ─────────────────────────────────────────────────────────────────────────────
// RSS FEEDS — chaque feed a une catégorie FIXE et explicite.
// Aucune détection textuelle pour ces sources : la source est la vérité.
// ─────────────────────────────────────────────────────────────────────────────
const RSS_FEEDS = [
  // ── Microsoft 365 ──────────────────────────────────────────────────────────
  { url: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',                                                               category: 'Microsoft 365',  source: 'microsoft.com/m365'    },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=microsoft365blog',                        category: 'Microsoft 365',  source: 'techcommunity.microsoft.com' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftTeamsBlog',                      category: 'Microsoft 365',  source: 'techcommunity.microsoft.com' },

  // ── Azure & Cloud ──────────────────────────────────────────────────────────
  { url: 'https://azure.microsoft.com/en-us/blog/feed/',                                                                           category: 'Azure & Cloud',  source: 'azure.microsoft.com'   },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=AzureInfrastructureblog',                 category: 'Azure & Cloud',  source: 'techcommunity.microsoft.com' },

  // ── Dynamics 365 ──────────────────────────────────────────────────────────
  { url: 'https://cloudblogs.microsoft.com/dynamics365/feed/',                                                                     category: 'Dynamics 365',   source: 'cloudblogs.microsoft.com' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=DynamicsSmallAndMediumBusiness',          category: 'Dynamics 365',   source: 'techcommunity.microsoft.com' },

  // ── Sécurité ───────────────────────────────────────────────────────────────
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftSecurityandCompliance',          category: 'Sécurité',       source: 'techcommunity.microsoft.com' },
  { url: 'https://cloudblogs.microsoft.com/microsoftsecure/feed/',                                                                 category: 'Sécurité',       source: 'cloudblogs.microsoft.com' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftDefenderATP',                   category: 'Sécurité',       source: 'techcommunity.microsoft.com' },

  // ── Copilot & IA ───────────────────────────────────────────────────────────
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=Microsoft365CopilotBlog',                category: 'Copilot & IA',   source: 'techcommunity.microsoft.com' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftCopilot',                       category: 'Copilot & IA',   source: 'techcommunity.microsoft.com' },
];

// ── RSS parser ────────────────────────────────────────────────────────────────
function extractXML(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, 'i'));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i'));
  return plain ? plain[1].trim() : '';
}

function parseRSS(xml, source, category) {
  const items = [];
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  for (const block of blocks) {
    const raw  = block[1];
    const title  = decodeEntities(extractXML(raw, 'title')).slice(0, 200);
    const link   = extractXML(raw, 'link') || extractXML(raw, 'guid');
    const rawDesc = decodeEntities(extractXML(raw, 'description'));
    const excerpt = rawDesc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 280);
    const pubDate = extractXML(raw, 'pubDate');
    if (!title || !link || !link.startsWith('http')) continue;
    let date;
    try { date = new Date(pubDate); if (isNaN(date.getTime())) date = new Date(); } catch { date = new Date(); }
    let itemSource = source;
    try { itemSource = new URL(link).hostname.replace('www.', ''); } catch {}
    items.push({
      id:         `rss-${Buffer.from(link).toString('base64').slice(0, 12)}`,
      title,
      excerpt,
      url:        link,
      source:     itemSource,
      sourceType: 'rss',
      date:       date.toISOString(),
      category,   // catégorie FIXE du feed — jamais calculée
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
// TAVILY — catégorie FIXE par requête
// ─────────────────────────────────────────────────────────────────────────────
const TAVILY_QUERIES = [
  { q: 'Microsoft 365 Teams Outlook SharePoint update announcement 2026', category: 'Microsoft 365'  },
  { q: 'Microsoft Copilot AI Studio agent new features 2026',             category: 'Copilot & IA'   },
  { q: 'Microsoft Azure cloud infrastructure release update 2026',        category: 'Azure & Cloud'  },
  { q: 'Dynamics 365 Business Central CRM ERP release 2026',             category: 'Dynamics 365'   },
  { q: 'Microsoft Defender Sentinel Purview security threat 2026',        category: 'Sécurité'        },
];

async function fetchTavily() {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  try {
    const settled = await Promise.allSettled(
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
    settled.forEach((r, idx) => {
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
          category,   // catégorie FIXE de la requête — jamais calculée
        });
      }
    });
    return items;
  } catch { return []; }
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const [rssResults, tavilyItems] = await Promise.allSettled([
      Promise.all(RSS_FEEDS.map(fetchRSS)).then(r => r.flat()),
      fetchTavily(),
    ]);

    const all = [
      ...(rssResults.status  === 'fulfilled' ? rssResults.value  : []),
      ...(tavilyItems.status === 'fulfilled' ? tavilyItems.value : []),
    ];

    const VALID_CATEGORIES = new Set(['Microsoft 365', 'Azure & Cloud', 'Copilot & IA', 'Dynamics 365', 'Sécurité']);
    const seen = new Set();
    const news = all
      .filter(item => {
        if (!item.url || !item.title) return false;
        if (!VALID_CATEGORIES.has(item.category)) return false; // rejette toute catégorie inconnue
        if (seen.has(item.url)) return false;
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
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
