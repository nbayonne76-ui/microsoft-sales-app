import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

// Microsoft RSS feeds — free, no API key needed
const RSS_FEEDS = [
  {
    url: 'https://blogs.microsoft.com/feed/',
    source: 'blogs.microsoft.com',
  },
  {
    url: 'https://azure.microsoft.com/en-us/blog/feed/',
    source: 'azure.microsoft.com',
  },
  {
    url: 'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',
    source: 'microsoft.com/m365',
  },
  {
    url: 'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftSecurityandCompliance',
    source: 'techcommunity.microsoft.com',
  },
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
    const description = extractXML(content, 'description').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 280);
    const pubDate = extractXML(content, 'pubDate');

    if (!title || !link || !link.startsWith('http')) continue;

    let date;
    try { date = new Date(pubDate); } catch { date = new Date(); }
    if (isNaN(date.getTime())) date = new Date();

    let source = defaultSource;
    try { source = new URL(link).hostname.replace('www.', ''); } catch {}

    items.push({
      title,
      excerpt: description,
      url: link,
      source,
      date,
      category: detectCategory(`${title} ${description}`),
    });
  }
  return items;
}

async function fetchFeed({ url, source }) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 MicrosoftSalesApp/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml, source);
  } catch {
    return [];
  }
}

export async function GET(request) {
  // Allow Vercel cron (no Authorization header) or requests with CRON_SECRET
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const results = await Promise.allSettled(RSS_FEEDS.map(fetchFeed));
    const all = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);

    // Deduplicate by URL
    const seen = new Set();
    const unique = all.filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });

    if (unique.length === 0) {
      return NextResponse.json({ success: false, error: 'No news fetched from RSS feeds' }, { status: 502 });
    }

    // Upsert all items
    let saved = 0;
    for (const item of unique) {
      try {
        await prisma.microsoftNews.upsert({
          where: { url: item.url },
          update: {
            title: item.title,
            excerpt: item.excerpt,
            source: item.source,
            date: item.date,
            category: item.category,
          },
          create: item,
        });
        saved++;
      } catch {}
    }

    // Keep only the 60 most recent articles
    const old = await prisma.microsoftNews.findMany({
      orderBy: { date: 'desc' },
      skip: 60,
      select: { id: true },
    });
    if (old.length > 0) {
      await prisma.microsoftNews.deleteMany({ where: { id: { in: old.map(o => o.id) } } });
    }

    return NextResponse.json({
      success: true,
      saved,
      total: unique.length,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
