/**
 * Shared utilities for Microsoft blog agents.
 * Pipeline :
 *   RSS + Exa → Jina → Tavily fallback (collecte gratuite)
 *   → URL hash dedup (gratuit)
 *   → Keyword scorer (gratuit, 0 API)
 *   → GPT-4o-mini generator (OpenAI, article bilingue JSON + KB)
 *   → blog-articles.json
 *
 * CommonJS : runs as standalone Node.js scripts (GitHub Actions).
 */

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const DATA_PATH = path.join(__dirname, '../../data/blog-articles.json');
const KB_DIR    = path.join(__dirname, '../../templates/knowledge-base');

const KB_FILENAME = {
  azure:         'azure-recent-updates.md',
  dynamics:      'dynamics-recent-updates.md',
  'modern-work': 'm365-recent-updates.md',
  copilot:       'copilot-recent-updates.md',
  securite:      'securite-recent-updates.md',
};

// ── Env loader (.env.local / .env) ────────────────────────────────────────────

function loadEnv() {
  const envPath = ['.env.local', '.env']
    .map(f => path.join(__dirname, '../../', f))
    .find(p => fs.existsSync(p));
  if (!envPath) return;
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

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
  for (const block of [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 10)) {
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
    items.push({ title, excerpt, url: link, date: date.toISOString(), source: 'RSS' });
  }
  return items;
}

async function fetchRSS(url, retry = true) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 MicrosoftSalesApp/BlogAgent' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = parseRSS((await res.text()).slice(0, 400 * 1024));
    // Smart retry — source vide → 1 retry après 5s backoff
    if (items.length === 0 && retry) {
      await new Promise(r => setTimeout(r, 5000));
      return fetchRSS(url, false);
    }
    return items;
  } catch {
    if (retry) {
      await new Promise(r => setTimeout(r, 5000));
      return fetchRSS(url, false);
    }
    return [];
  }
}

async function fetchMultipleRSS(urls) {
  const results = await Promise.allSettled(urls.map(u => fetchRSS(u)));
  return results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
}

// ── Exa neural search ─────────────────────────────────────────────────────────

async function fetchExa(query) {
  const key = process.env.EXA_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key },
      body: JSON.stringify({ query, numResults: 6, type: 'neural', contents: { text: { maxCharacters: 400 } } }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(r => ({
      title:   (r.title || '').slice(0, 200),
      excerpt: (r.text || r.snippet || '').slice(0, 400),
      url:     r.url || '',
      date:    r.publishedDate ? new Date(r.publishedDate).toISOString() : new Date().toISOString(),
      source:  'Exa',
    }));
  } catch { return []; }
}

// ── Jina search — gratuit, sans clé ──────────────────────────────────────────

async function fetchJina(query) {
  try {
    const res = await fetch(`https://s.jina.ai/${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'application/json',
        'X-Return-Format': 'json',
        'User-Agent': 'MicrosoftSalesApp/BlogAgent',
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).slice(0, 5).map(r => ({
      title:   (r.title || '').slice(0, 200),
      excerpt: (r.content || r.description || '').replace(/<[^>]+>/g, ' ').trim().slice(0, 400),
      url:     r.url || '',
      date:    new Date().toISOString(),
      source:  'Jina',
    }));
  } catch { return []; }
}

// ── Linkup deep research — fallback (linkup.so) ───────────────────────────────

async function fetchLinkup(query) {
  const key = process.env.LINKUP_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch('https://api.linkup.so/v1/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ q: query, depth: 'standard', outputType: 'sourcedAnswer', includeImages: false }),
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.sources || []).slice(0, 5).map(r => ({
      title:   (r.name || r.title || '').slice(0, 200),
      excerpt: (r.snippet || r.content || '').slice(0, 400),
      url:     r.url || '',
      date:    new Date().toISOString(),
      source:  'Linkup',
    }));
  } catch { return []; }
}

// ── Tavily search — fallback (1000/mois gratuit) ──────────────────────────────

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
      source:  'Tavily',
    }));
  } catch { return []; }
}

// ── Chaîne : Exa → Jina → Linkup → Tavily ───────────────────────────────────

async function fetchSearch(query) {
  let items = await fetchExa(query);
  if (items.length === 0) {
    console.log('   Exa empty → trying Jina (free)...');
    items = await fetchJina(query);
  }
  if (items.length === 0 && process.env.LINKUP_API_KEY) {
    console.log('   Jina empty → trying Linkup...');
    items = await fetchLinkup(query);
  }
  if (items.length === 0) {
    console.log('   → trying Tavily...');
    items = await fetchTavily(query);
  }
  return items;
}

// ── URL hash dedup — gratuit ──────────────────────────────────────────────────

function urlHash(url, title) {
  const raw = url ? url.trim() : title.trim().toLowerCase().slice(0, 120);
  return crypto.createHash('md5').update(raw).digest('hex');
}

function dedupItems(items) {
  const seen = new Set();
  return items.filter(item => {
    const h = urlHash(item.url, item.title);
    if (seen.has(h)) return false;
    seen.add(h);
    return true;
  });
}

// ── Keyword scorer — gratuit, 0 API ──────────────────────────────────────────

const KEYWORDS = [
  'microsoft', 'dynamics', 'copilot', 'azure', 'business central',
  'ai agent', 'cloud erp', 'm365', 'teams', 'security', 'rgpd',
  'nis2', 'entra', 'power platform', 'copilot studio', 'erp', 'crm',
];

function keywordScore(item) {
  const text = (item.title + ' ' + item.excerpt).toLowerCase();
  return Math.min(10, Math.max(1, KEYWORDS.filter(k => text.includes(k)).length * 2));
}

function scoreItems(items) {
  return items
    .map(item => ({ ...item, score: keywordScore(item) }))
    .filter(item => item.score >= 4)
    .sort((a, b) => b.score - a.score);
}

// ── GPT-4o-mini — générateur article bilingue ─────────────────────────────────

async function generateArticle(newsItems, config) {
  const { OpenAI } = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const today  = new Date().toISOString().split('T')[0];
  const month  = today.slice(0, 7);

  const newsText = newsItems
    .slice(0, 10)
    .map((n, i) => `${i + 1}. [score:${n.score}] [${n.date.slice(0, 10)}] ${n.title}\n   ${n.excerpt}`)
    .join('\n\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a Microsoft expert content writer for a B2B sales enablement platform used by Microsoft Account Managers in France. Write authoritative articles for IT decision-makers (DSI, RSSI, CTO) and Microsoft partners. Bilingual FR (primary) + EN. Never include specific prices.`,
      },
      {
        role: 'user',
        content: `Based on these recent ${config.domainLabel} news (sorted by relevance), write ONE expert blog article.

RECENT NEWS:
${newsText}

Return ONLY valid JSON (no markdown):
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
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 3000,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('GPT-4o-mini returned empty response');
  return JSON.parse(raw);
}

// ── GPT-4o-mini — mise à jour KB ──────────────────────────────────────────────

async function generateKbUpdate(newsItems, config) {
  const { OpenAI } = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const today  = new Date().toISOString().split('T')[0];

  const newsText = newsItems
    .slice(0, 10)
    .map((n, i) => `${i + 1}. [${n.date.slice(0, 10)}] ${n.title}\n   ${n.excerpt}`)
    .join('\n\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Tu es un expert Microsoft qui crée des mises à jour de base de connaissances pour les Account Managers en France. Format : markdown structuré, factuel, actionnable.`,
      },
      {
        role: 'user',
        content: `Basé sur ces actualités ${config.domainLabel} (${today}), crée une mise à jour KB.

ACTUALITÉS :
${newsText}

# ${config.domainLabel} : Mise à jour KB (${today})

## Dernières annonces
## Ce qui change pour vos clients
## Arguments de vente clés
## Profil client cible
## Questions clients fréquentes
## Angle concurrentiel

Rédige en français, termes techniques en anglais.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  });

  return completion.choices[0]?.message?.content || '';
}

// ── Webhook alert (Slack / Make.com / n8n) ────────────────────────────────────

async function sendWebhook(article) {
  const url = process.env.WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `📰 Nouvel article blog généré`,
        title: article.fr?.title,
        slug: article.slug,
        category: article.category,
        date: article.date,
        url: `https://microsoft-sales-app.vercel.app/blog/${article.slug}`,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch { /* webhook non critique */ }
}

// ── Persistence ───────────────────────────────────────────────────────────────

function saveKbFile(category, content) {
  const filename = KB_FILENAME[category];
  if (!filename || !content) return;
  const kbPath = path.join(KB_DIR, filename);
  if (fs.existsSync(KB_DIR)) {
    fs.writeFileSync(kbPath, content, 'utf-8');
    console.log(`📚 KB updated: ${filename}`);
  }
}

function saveArticle(article) {
  const articles = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const idx = articles.findIndex(a => a.slug === article.slug);
  if (idx >= 0) {
    articles[idx] = article;
    console.log(`✏️  Updated: ${article.slug}`);
  } else {
    articles.unshift(article);
    console.log(`✅ Added: ${article.slug}`);
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2), 'utf-8');
  console.log(`📦 blog-articles.json → ${articles.length} articles`);
}

// ── Main runner ───────────────────────────────────────────────────────────────

async function runAgent(config) {
  console.log(`\n🤖 ${config.domainLabel} Agent — ${new Date().toISOString()}`);
  console.log('─'.repeat(55));

  loadEnv();

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not set — abort');
    process.exit(1);
  }

  // 1. RSS en parallèle
  console.log('📡 Fetching RSS feeds...');
  const rssItems = await fetchMultipleRSS(config.rssUrls);
  console.log(`   ${rssItems.length} items from ${config.rssUrls.length} RSS feeds`);

  // 2. Exa → Jina → Tavily
  console.log('🔍 Search chain: Exa → Jina → Tavily...');
  const searchItems = await fetchSearch(config.searchQuery);
  console.log(`   ${searchItems.length} items from search (${searchItems[0]?.source || 'none'})`);

  // 3. Merge + dedup URL hash (gratuit)
  const allItems = dedupItems([...rssItems, ...searchItems])
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  console.log(`   ${allItems.length} unique items after dedup`);

  if (allItems.length === 0) {
    console.warn('⚠️  No items found — skipping');
    return;
  }

  // 4. Keyword scorer — gratuit, 0 API
  console.log('🎯 Keyword scoring (free)...');
  const scored = scoreItems(allItems);
  console.log(`   ${scored.length} relevant items (score ≥ 4)`);

  const toGenerate = scored.length >= 3 ? scored : allItems.slice(0, 8);

  // 5. GPT-4o-mini — article + KB en parallèle
  console.log(`\n✍️  Generating with GPT-4o-mini (${toGenerate.length} items)...`);
  const [article, kbContent] = await Promise.all([
    generateArticle(toGenerate, config),
    generateKbUpdate(toGenerate, config),
  ]);

  console.log(`\n📄 Article: "${article.fr?.title}"`);
  console.log(`   Slug: ${article.slug}`);

  // 6. Save + webhook
  saveArticle(article);
  saveKbFile(config.category, kbContent);
  await sendWebhook(article);
  console.log('\n✅ Done!\n');
}

module.exports = { runAgent };
