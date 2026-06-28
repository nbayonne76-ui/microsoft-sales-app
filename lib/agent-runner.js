import { writeFileSync } from 'fs';
import { join } from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { addOrUpdateArticle, invalidateCache } from './blog-store.js';
import { invalidateKbCache } from './kb-service.js';

const KB_DIR = join(process.cwd(), 'templates', 'knowledge-base');

const KB_FILENAME = {
  azure:         'azure-recent-updates.md',
  dynamics:      'dynamics-recent-updates.md',
  'modern-work': 'm365-recent-updates.md',
  copilot:       'copilot-recent-updates.md',
  securite:      'securite-recent-updates.md',
};

// ── Domain configs ────────────────────────────────────────────────────────────

export const AGENT_CONFIGS = {
  azure: {
    domainLabel: 'Azure & Cloud',
    category: 'azure',
    rssUrls: [
      'https://azure.microsoft.com/en-us/blog/feed/',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=AzureInfrastructureblog',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=AzureDevCommunityBlog',
    ],
    searchQuery: 'Microsoft Azure new features AI cloud services announcement 2026',
  },
  dynamics: {
    domainLabel: 'Dynamics 365',
    category: 'dynamics',
    rssUrls: [
      'https://cloudblogs.microsoft.com/dynamics365/feed/',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=DynamicsSmallAndMediumBusiness',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=DynamicsCRMCustomerEngagement',
      'https://dynamics360.net/feed/',
      'https://www.calsoft.com/category/dynamics-365/feed/',
    ],
    searchQuery: 'Microsoft Dynamics 365 Business Central Copilot AI agent ERP CRM release update 2026',
  },
  'modern-work': {
    domainLabel: 'Microsoft 365 / Modern Work',
    category: 'm365',
    rssUrls: [
      'https://www.microsoft.com/en-us/microsoft-365/blog/feed/',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=microsoft365blog',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftTeamsBlog',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=Microsoft365CopilotBlog',
    ],
    searchQuery: 'Microsoft 365 Teams Copilot modern work productivity announcement 2026',
  },
  copilot: {
    domainLabel: 'Microsoft Copilot & IA',
    category: 'copilot',
    rssUrls: [
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=Microsoft365CopilotBlog',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=AzureAIServicesBlog',
      'https://blogs.microsoft.com/feed/',
      'https://dynamics360.net/feed/',
    ],
    searchQuery: 'Microsoft Copilot Studio AI agent Power Platform automation enterprise 2026',
  },
  securite: {
    domainLabel: 'Sécurité & Conformité Microsoft',
    category: 'securite',
    rssUrls: [
      'https://www.microsoft.com/en-us/security/blog/feed/',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftSecurityandCompliance',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftDefenderATPBlog',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=MicrosoftPurviewBlog',
    ],
    searchQuery: 'Microsoft Security Defender Purview Entra NIS2 RGPD conformité entreprise 2026',
  },
};

// ── RSS fetcher ───────────────────────────────────────────────────────────────

function decodeEntities(str = '') {
  return str
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function parseRSS(xml) {
  const items = [];
  for (const block of [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 8)) {
    const raw = block[1];
    const get = tag => {
      const cd = raw.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, 'i'));
      if (cd) return cd[1].trim();
      const pl = raw.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i'));
      return pl ? pl[1].trim() : '';
    };
    const title   = decodeEntities(get('title')).slice(0, 200);
    const link    = get('link') || get('guid');
    const excerpt = decodeEntities(get('description')).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
    const pubDate = get('pubDate');
    if (!title || !link) continue;
    let date = new Date(pubDate);
    if (isNaN(date.getTime())) date = new Date();
    items.push({ title, excerpt, url: link, date: date.toISOString() });
  }
  return items;
}

async function fetchRSS(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 MicrosoftSalesApp/BlogAgent' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    return parseRSS((await res.text()).slice(0, 400 * 1024));
  } catch { return []; }
}

// ── Exa neural search ─────────────────────────────────────────────────────────

async function fetchExa(query) {
  const key = process.env.EXA_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key },
      body: JSON.stringify({ query, numResults: 5, type: 'neural', contents: { text: { maxCharacters: 400 } } }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(r => ({
      title:   (r.title || '').slice(0, 200),
      excerpt: (r.text || r.snippet || '').slice(0, 400),
      url:     r.url || '',
      date:    r.publishedDate ? new Date(r.publishedDate).toISOString() : new Date().toISOString(),
    }));
  } catch { return []; }
}

// ── Tavily fallback ───────────────────────────────────────────────────────────

async function fetchTavily(query) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, query, search_depth: 'basic', max_results: 5, days: 14 }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    return (data.results || []).map(r => ({
      title:   (r.title || '').slice(0, 200),
      excerpt: (r.content || '').slice(0, 400),
      url:     r.url || '',
      date:    r.published_date ? new Date(r.published_date).toISOString() : new Date().toISOString(),
    }));
  } catch { return []; }
}

// ── Claude Sonnet 4.6 — générateur article bilingue ──────────────────────────

async function generateArticle(newsItems, config) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const today  = new Date().toISOString().split('T')[0];
  const month  = today.slice(0, 7);

  const newsText = newsItems
    .slice(0, 12)
    .map((n, i) => `${i + 1}. [${n.date.slice(0, 10)}] ${n.title}\n   ${n.excerpt}`)
    .join('\n\n');

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3500,
    system: `You are a Microsoft expert content writer for a B2B sales enablement platform used by Microsoft Account Managers in France. Write authoritative articles for IT decision-makers (DSI, RSSI, CTO) and Microsoft partners. Articles: synthesize recent news into actionable sales insights, highlight business impact, give concrete recommendations. Bilingual FR (primary) + EN. Never include specific prices.`,
    messages: [
      {
        role: 'user',
        content: `Based on these recent ${config.domainLabel} news, write ONE expert blog article.

RECENT NEWS:
${newsText}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "slug": "descriptive-kebab-slug-${month}",
  "category": "${config.category}",
  "date": "${today}",
  "readTime": "X min",
  "author": "Nicolas BAYONNE",
  "authorRole": "Microsoft Partner Account Manager",
  "featured": false,
  "fr": {
    "title": "Titre accrocheur FR (max 80 chars)",
    "excerpt": "Résumé 2-3 phrases FR (max 220 chars)",
    "sections": [
      { "type": "intro", "text": "..." },
      { "type": "h2", "text": "..." },
      { "type": "p", "text": "..." },
      { "type": "h2", "text": "..." },
      { "type": "list", "items": ["...", "...", "..."] },
      { "type": "h2", "text": "Ce que ça signifie pour vos clients" },
      { "type": "p", "text": "..." },
      { "type": "cta", "text": "Question CTA", "action": "Analyser un compte", "href": "/account" }
    ]
  },
  "en": {
    "title": "Catchy EN title (max 80 chars)",
    "excerpt": "2-3 sentence EN summary (max 220 chars)",
    "sections": [
      { "type": "intro", "text": "..." },
      { "type": "h2", "text": "..." },
      { "type": "p", "text": "..." },
      { "type": "h2", "text": "..." },
      { "type": "list", "items": ["...", "...", "..."] },
      { "type": "h2", "text": "What This Means for Your Customers" },
      { "type": "p", "text": "..." },
      { "type": "cta", "text": "CTA question", "action": "Analyze an account", "href": "/account" }
    ]
  }
}
Rules: slug = topic + month (e.g. "dynamics-copilot-agents-june-2026"), 6-8 sections, NO prices.`,
      },
      { role: 'assistant', content: '{' },
    ],
  });

  const raw = '{' + (msg.content[0]?.text || '');
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Claude Sonnet returned invalid JSON');
  }
}

// ── Claude Sonnet 4.6 — mise à jour KB ───────────────────────────────────────

async function generateKbUpdate(newsItems, config) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const today  = new Date().toISOString().split('T')[0];

  const newsText = newsItems
    .slice(0, 12)
    .map((n, i) => `${i + 1}. [${n.date.slice(0, 10)}] ${n.title}\n   ${n.excerpt}`)
    .join('\n\n');

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: `Tu es un expert Microsoft qui crée des mises à jour de base de connaissances pour les Account Managers Microsoft en France. Utilisé directement par des outils IA pour préparer des RDV clients. Format : markdown structuré, factuel, actionnable.`,
    messages: [{
      role: 'user',
      content: `Basé sur ces actualités ${config.domainLabel} (${today}), crée une mise à jour KB pour les Account Managers.

ACTUALITÉS :
${newsText}

Génère le document avec ces sections EXACTES :

# ${config.domainLabel} : Mise à jour KB (${today})

## Dernières annonces
## Ce qui change pour vos clients
## Arguments de vente clés
## Profil client cible
## Questions clients fréquentes
## Angle concurrentiel

Rédige en français, termes techniques en anglais.`,
    }],
  });

  return msg.content[0]?.text || '';
}

function saveKbFile(topic, content) {
  const filename = KB_FILENAME[topic];
  if (!filename || !content) return;
  try {
    writeFileSync(join(KB_DIR, filename), content, 'utf-8');
  } catch { /* KB dir may not exist in some environments */ }
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function runAgent(topic) {
  const config = AGENT_CONFIGS[topic];
  if (!config) throw new Error(`Unknown topic: ${topic}. Valid: ${Object.keys(AGENT_CONFIGS).join(', ')}`);

  const [rssItems, searchItems] = await Promise.all([
    Promise.allSettled(config.rssUrls.map(fetchRSS)).then(r =>
      r.flatMap(x => x.status === 'fulfilled' ? x.value : [])
    ),
    fetchExa(config.searchQuery).then(r => r.length ? r : fetchTavily(config.searchQuery)),
  ]);

  const allItems = [...rssItems, ...searchItems]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 12);

  if (allItems.length === 0) throw new Error(`No news items found for topic: ${topic}`);

  const [article, kbContent] = await Promise.all([
    generateArticle(allItems, config),
    generateKbUpdate(allItems, config),
  ]);

  addOrUpdateArticle(article);
  saveKbFile(topic, kbContent);
  invalidateCache();
  invalidateKbCache();

  return {
    article,
    kbFile: KB_FILENAME[topic],
    stats: { rssItems: rssItems.length, searchItems: searchItems.length, total: allItems.length },
  };
}
