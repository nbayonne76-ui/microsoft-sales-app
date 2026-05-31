import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const RSS_FEEDS = [
  { url: 'https://blogs.microsoft.com/feed/', source: 'blogs.microsoft.com' },
  { url: 'https://azure.microsoft.com/en-us/blog/feed/', source: 'azure.microsoft.com' },
  { url: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/', source: 'microsoft.com/m365' },
  { url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftSecurityandCompliance', source: 'techcommunity.microsoft.com' },
];

const CATEGORY_KEYWORDS = {
  'Microsoft 365': ['m365', 'microsoft 365', 'teams', 'outlook', 'sharepoint', 'exchange', 'onedrive', 'copilot', 'e3', 'e5', 'e7', 'office 365'],
  'Azure & Cloud': ['azure', 'cloud', 'iaas', 'paas', 'kubernetes', 'aks', 'openai service', 'migration', 'serverless', 'devops'],
  'Copilot & IA': ['copilot', 'ai', 'artificial intelligence', 'openai', 'gpt', 'agent', 'llm', 'machine learning', 'generative'],
  'Dynamics 365': ['dynamics', 'crm', 'erp', 'business central', 'sales', 'field service', 'customer service', 'finance', 'supply chain'],
  'Sécurité': ['security', 'defender', 'sentinel', 'purview', 'zero trust', 'mfa', 'identity', 'entra', 'compliance', 'rgpd', 'gdpr', 'nis2'],
};

function detectCategory(text = '') {
  const lower = text.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return cat;
  }
  return 'Microsoft 365';
}

function extractXML(block, tag) {
  const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, 'i'));
  if (cdata) return cdata[1].trim();
  const plain = block.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i'));
  return plain ? plain[1].trim() : '';
}

function parseRSS(xml, defaultSource) {
  const items = [];
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  for (const block of blocks) {
    const content = block[1];
    const title = extractXML(content, 'title').slice(0, 200);
    const link = extractXML(content, 'link') || extractXML(content, 'guid');
    const description = extractXML(content, 'description')
      .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 280);
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
      category: detectCategory(`${title} ${description}`),
    });
  }
  return items;
}

async function fetchFeed({ url, source }) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 MicrosoftSalesApp/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    // Cap at 512 KB to prevent ReDoS on malformed/malicious RSS
    const text = (await res.text()).slice(0, 512 * 1024);
    return parseRSS(text, source);
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const results = await Promise.allSettled(RSS_FEEDS.map(fetchFeed));
    const all = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

    const seen = new Set();
    const news = all
      .filter(item => { if (seen.has(item.url)) return false; seen.add(item.url); return true; })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);

    if (news.length === 0) {
      return NextResponse.json({ success: false, error: 'No news available' }, { status: 503 });
    }

    return NextResponse.json(
      { success: true, news, count: news.length, lastUpdated: new Date().toISOString() },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
