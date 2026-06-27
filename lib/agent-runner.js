import { writeFileSync } from 'fs';
import { join } from 'path';
import OpenAI from 'openai';
import { addOrUpdateArticle, invalidateCache } from './blog-store.js';
import { invalidateKbCache } from './kb-service.js';

const KB_DIR = join(process.cwd(), 'templates', 'knowledge-base');

const KB_FILENAME = {
  azure:        'azure-recent-updates.md',
  dynamics:     'dynamics-recent-updates.md',
  'modern-work':'m365-recent-updates.md',
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
    tavilyQuery: 'Microsoft Azure new features cloud services announcement 2026',
  },
  dynamics: {
    domainLabel: 'Dynamics 365',
    category: 'dynamics',
    rssUrls: [
      'https://cloudblogs.microsoft.com/dynamics365/feed/',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=DynamicsSmallAndMediumBusiness',
      'https://techcommunity.microsoft.com/t5/s/gxcuf89792/rss/boardmessages?board.id=DynamicsCRMCustomerEngagement',
    ],
    tavilyQuery: 'Microsoft Dynamics 365 CRM ERP Copilot agent release update 2026',
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
    tavilyQuery: 'Microsoft 365 Teams Copilot modern work productivity announcement 2026',
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
  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  for (const block of blocks.slice(0, 8)) {
    const raw = block[1];
    const getField = (tag) => {
      const cdata = raw.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, 'i'));
      if (cdata) return cdata[1].trim();
      const plain = raw.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`, 'i'));
      return plain ? plain[1].trim() : '';
    };
    const title   = decodeEntities(getField('title')).slice(0, 200);
    const link    = getField('link') || getField('guid');
    const rawDesc = decodeEntities(getField('description'));
    const excerpt = rawDesc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
    const pubDate = getField('pubDate');
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
      title:   r.title?.slice(0, 200) || '',
      excerpt: (r.content || '').slice(0, 400),
      url:     r.url,
      date:    r.published_date ? new Date(r.published_date).toISOString() : new Date().toISOString(),
    }));
  } catch { return []; }
}

// ── GPT-4o generator ──────────────────────────────────────────────────────────

async function generateArticle(newsItems, config) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const today  = new Date().toISOString().split('T')[0];
  const month  = today.slice(0, 7).replace('-', '-');

  const newsText = newsItems
    .slice(0, 12)
    .map((n, i) => `${i + 1}. [${n.date.slice(0, 10)}] ${n.title}\n   ${n.excerpt}`)
    .join('\n\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a Microsoft expert content writer for a B2B sales enablement platform used by Microsoft Account Managers in France. You write authoritative, insightful articles targeted at IT decision-makers (DSI, RSSI, CTO) and Microsoft partners.

Your articles:
- Synthesize recent news into actionable sales insights
- Highlight what changed and why it matters for enterprise customers
- Provide concrete recommendations for Microsoft sellers
- Are written in both French (primary) and English
- Never include specific prices (they change often)
- Focus on value, capabilities, and business impact`,
      },
      {
        role: 'user',
        content: `Based on these recent ${config.domainLabel} news and announcements, write ONE comprehensive expert blog article.

RECENT NEWS:
${newsText}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "slug": "kebab-case-slug-based-on-main-topic-${month}",
  "category": "${config.category}",
  "date": "${today}",
  "readTime": "X min",
  "author": "Nicolas BAYONNE",
  "authorRole": "Microsoft Partner Account Manager",
  "featured": false,
  "fr": {
    "title": "Titre accrocheur en français (max 80 chars)",
    "excerpt": "Résumé de 2-3 phrases en français (max 220 chars)",
    "sections": [
      { "type": "intro", "text": "Paragraphe d'introduction (2-3 phrases)" },
      { "type": "h2", "text": "Titre de section" },
      { "type": "p", "text": "Paragraphe" },
      { "type": "h2", "text": "Titre de section 2" },
      { "type": "list", "items": ["Point 1", "Point 2", "Point 3"] },
      { "type": "h2", "text": "Ce que ça signifie pour vos clients" },
      { "type": "p", "text": "Analyse commerciale et recommandations" },
      { "type": "cta", "text": "Question d'appel à l'action", "action": "Analyser un compte", "href": "/account" }
    ]
  },
  "en": {
    "title": "Catchy English title (max 80 chars)",
    "excerpt": "2-3 sentence English summary (max 220 chars)",
    "sections": [
      { "type": "intro", "text": "Engaging introduction" },
      { "type": "h2", "text": "Section heading" },
      { "type": "p", "text": "Paragraph" },
      { "type": "h2", "text": "Section heading 2" },
      { "type": "list", "items": ["Point 1", "Point 2", "Point 3"] },
      { "type": "h2", "text": "What This Means for Your Customers" },
      { "type": "p", "text": "Commercial analysis and recommendations" },
      { "type": "cta", "text": "Call to action question", "action": "Analyze an account", "href": "/account" }
    ]
  }
}

Rules:
- slug: descriptive + month (e.g. "azure-openai-agents-june-2026")
- readTime: based on word count, typically "5 min" to "8 min"
- 6-8 sections for depth
- NO prices or dollar amounts`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 3000,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('GPT-4o returned empty response');
  return JSON.parse(raw);
}

// ── KB update generator ───────────────────────────────────────────────────────

async function generateKbUpdate(newsItems, config) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const today  = new Date().toISOString().split('T')[0];

  const newsText = newsItems
    .slice(0, 12)
    .map((n, i) => `${i + 1}. [${n.date.slice(0, 10)}] ${n.title}\n   ${n.excerpt}`)
    .join('\n\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Tu es un expert Microsoft qui crée des mises à jour de base de connaissances pour les Account Managers Microsoft en France. Ton contenu est utilisé directement par des outils IA (Account Intel, Email Generator, Agent IA) pour aider les commerciaux à préparer leurs rendez-vous clients.

Format : markdown structuré, factuel, actionnable. Pas de marketing. Focus sur :
- Ce qui est nouveau et ce que ça signifie concrètement pour les clients
- Les arguments de vente pour les Account Managers
- Les angles concurrentiels
- Les questions typiques des clients sur ces nouveautés
- Le profil des clients à cibler`,
      },
      {
        role: 'user',
        content: `En te basant sur ces dernières actualités ${config.domainLabel}, crée une mise à jour structurée de la base de connaissances pour les Account Managers Microsoft.

ACTUALITÉS RÉCENTES (14 derniers jours) :
${newsText}

Génère un document markdown avec ces sections EXACTES :

# ${config.domainLabel} : Mise à jour KB (${today})

## Dernières annonces
(bullet points : nom de la feature → impact business concis)

## Ce qui change pour vos clients
(impact pratique pour les DSI, RSSI, CTO)

## Arguments de vente clés
(3-5 points percutants pour les Account Managers)

## Profil client cible
(qui contacter suite à ces annonces : secteur, taille, rôle)

## Questions clients fréquentes
(2-3 Q&A sur les nouveautés : questions réelles que posent les clients)

## Angle concurrentiel
(comment Microsoft se différencie sur ces points vs AWS, Salesforce, Google...)

Rédige en français avec les termes techniques en anglais quand c'est l'usage standard.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  });

  return completion.choices[0]?.message?.content || '';
}

function saveKbFile(topic, content) {
  const filename = KB_FILENAME[topic];
  if (!filename || !content) return;
  writeFileSync(join(KB_DIR, filename), content, 'utf-8');
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Runs one agent by topic key ('azure' | 'dynamics' | 'modern-work').
 * Returns the saved article.
 */
export async function runAgent(topic) {
  const config = AGENT_CONFIGS[topic];
  if (!config) throw new Error(`Unknown topic: ${topic}. Valid: ${Object.keys(AGENT_CONFIGS).join(', ')}`);

  const [rssItems, tavilyItems] = await Promise.all([
    Promise.allSettled(config.rssUrls.map(fetchRSS)).then(r =>
      r.flatMap(x => x.status === 'fulfilled' ? x.value : [])
    ),
    fetchTavily(config.tavilyQuery),
  ]);

  const allItems = [...rssItems, ...tavilyItems]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 12);

  if (allItems.length === 0) throw new Error(`No news items found for topic: ${topic}`);

  // Generate blog article + KB update in parallel
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
    stats: { rssItems: rssItems.length, tavilyItems: tavilyItems.length, total: allItems.length },
  };
}
