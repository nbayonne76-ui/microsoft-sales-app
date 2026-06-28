/**
 * Shared utilities for Microsoft blog agents.
 * Pipeline (happi_brain pattern v2) :
 *   RSS + Exa → Jina fallback → Tavily fallback
 *   → URL hash dedup
 *   → Claude Haiku 4.5 scorer (keep ≥ 6)
 *   → Claude Sonnet 4.6 generator (article bilingue JSON + KB update)
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

// ── Anthropic client ──────────────────────────────────────────────────────────

function getAnthropicClient() {
  const pkg = require('@anthropic-ai/sdk');
  const Anthropic = pkg.default ?? pkg.Anthropic ?? pkg;
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
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

async function fetchMultipleRSS(urls) {
  const results = await Promise.allSettled(urls.map(fetchRSS));
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

// ── Jina search — gratuit, sans clé (fallback Exa) ────────────────────────────

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

// ── Chaîne de recherche : Exa → Jina → Tavily (pattern happi_brain) ──────────

async function fetchSearch(query) {
  let items = await fetchExa(query);
  if (items.length === 0) {
    console.log('   Exa empty → trying Jina (free)...');
    items = await fetchJina(query);
  }
  if (items.length === 0) {
    console.log('   Jina empty → trying Tavily...');
    items = await fetchTavily(query);
  }
  return items;
}

// ── URL hash dedup (pattern happi_brain #5) ───────────────────────────────────

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

// ── Claude Haiku 4.5 scorer (pattern happi_brain #4) ─────────────────────────

function keywordScore(item) {
  const text = (item.title + ' ' + item.excerpt).toLowerCase();
  const kw = ['microsoft', 'dynamics', 'copilot', 'azure', 'business central',
               'ai agent', 'cloud erp', 'm365', 'teams', 'security', 'rgpd',
               'nis2', 'entra', 'power platform', 'copilot studio'];
  return Math.min(10, Math.max(1, kw.filter(k => text.includes(k)).length * 2));
}

async function scoreItems(items, domainLabel) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('   No ANTHROPIC_API_KEY → keyword scorer fallback');
    return items.map(item => ({ ...item, score: keywordScore(item) }));
  }

  const client = getAnthropicClient();
  const newsText = items.map((n, i) => `[${i}] ${n.title}`).join('\n');

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Score each article 1-10 for relevance to "${domainLabel}" sales for B2B Microsoft Account Managers in France.
10 = directly actionable for a Microsoft seller, 1 = irrelevant.
Return ONLY a JSON array of integers, one per article, no explanation.

${newsText}`,
      }],
    });

    const raw = msg.content[0]?.text || '[]';
    const match = raw.match(/\[\s*[\d\s,]+\]/);
    const scores = match ? JSON.parse(match[0]) : [];
    return items.map((item, i) => ({ ...item, score: typeof scores[i] === 'number' ? scores[i] : keywordScore(item) }));
  } catch (e) {
    console.warn('   Haiku scorer error:', e.message, '→ keyword fallback');
    return items.map(item => ({ ...item, score: keywordScore(item) }));
  }
}

// ── Claude Sonnet 4.6 — générateur d'articles bilingues ──────────────────────

async function generateArticle(newsItems, config) {
  const client = getAnthropicClient();
  const today  = new Date().toISOString().split('T')[0];
  const month  = today.slice(0, 7);

  const newsText = newsItems
    .slice(0, 10)
    .map((n, i) => `${i + 1}. [score:${n.score}] [${n.date.slice(0, 10)}] ${n.title}\n   ${n.excerpt}`)
    .join('\n\n');

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 3500,
    system: `You are a Microsoft expert content writer for a B2B sales enablement platform used by Microsoft Account Managers in France. Write authoritative articles for IT decision-makers (DSI, RSSI, CTO) and Microsoft partners.
Your articles: synthesize recent news into actionable sales insights, highlight business impact, give concrete recommendations for Microsoft sellers, are bilingual FR (primary) + EN. Never include specific prices.`,
    messages: [
      {
        role: 'user',
        content: `Based on these recent ${config.domainLabel} news (sorted by relevance), write ONE expert blog article.

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
    // Extract JSON if Claude added trailing text
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Claude Sonnet returned invalid JSON for article');
  }
}

// ── Claude Sonnet 4.6 — mise à jour KB ───────────────────────────────────────

async function generateKbUpdate(newsItems, config) {
  const client = getAnthropicClient();
  const today  = new Date().toISOString().split('T')[0];

  const newsText = newsItems
    .slice(0, 10)
    .map((n, i) => `${i + 1}. [${n.date.slice(0, 10)}] ${n.title}\n   ${n.excerpt}`)
    .join('\n\n');

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: `Tu es un expert Microsoft qui crée des mises à jour de base de connaissances pour les Account Managers Microsoft en France. Ton contenu est utilisé directement par des outils IA (Account Intel, Email Generator) pour préparer des rendez-vous clients. Format : markdown structuré, factuel, actionnable.`,
    messages: [{
      role: 'user',
      content: `Basé sur ces actualités ${config.domainLabel}, crée une mise à jour KB pour les Account Managers.

ACTUALITÉS (${today}) :
${newsText}

Génère un document markdown avec ces sections EXACTES :

# ${config.domainLabel} : Mise à jour KB (${today})

## Dernières annonces
(bullet points : feature → impact business concis)

## Ce qui change pour vos clients
(impact pratique DSI, RSSI, CTO)

## Arguments de vente clés
(3-5 points percutants)

## Profil client cible
(secteur, taille, rôle à contacter)

## Questions clients fréquentes
(2-3 Q&A sur les nouveautés)

## Angle concurrentiel
(différenciation vs AWS, Salesforce, Google...)

Rédige en français, termes techniques en anglais.`,
    }],
  });

  return msg.content[0]?.text || '';
}

// ── Persistence KB ────────────────────────────────────────────────────────────

function saveKbFile(category, content) {
  const filename = KB_FILENAME[category] || KB_FILENAME[category === 'm365' ? 'modern-work' : category];
  if (!filename || !content) return;
  const kbPath = path.join(KB_DIR, filename);
  if (fs.existsSync(KB_DIR)) {
    fs.writeFileSync(kbPath, content, 'utf-8');
    console.log(`📚 KB updated: ${filename}`);
  }
}

// ── Persistence article ───────────────────────────────────────────────────────

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

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set — abort');
    process.exit(1);
  }

  // 1. Sources RSS en parallèle
  console.log('📡 Fetching RSS feeds...');
  const rssItems = await fetchMultipleRSS(config.rssUrls);
  console.log(`   ${rssItems.length} items from ${config.rssUrls.length} RSS feeds`);

  // 2. Chaîne Exa → Jina → Tavily
  console.log('🔍 Search chain: Exa → Jina → Tavily...');
  const searchItems = await fetchSearch(config.searchQuery);
  console.log(`   ${searchItems.length} items from search (${searchItems[0]?.source || 'none'})`);

  // 3. Merge + dedup URL hash
  const raw = dedupItems([...rssItems, ...searchItems]);
  const allItems = raw.sort((a, b) => new Date(b.date) - new Date(a.date));
  console.log(`   ${allItems.length} unique items after URL dedup`);

  if (allItems.length === 0) {
    console.warn('⚠️  No items found — skipping');
    return;
  }

  // 4. Scorer Claude Haiku 4.5
  console.log('🎯 Scoring with Claude Haiku 4.5...');
  const scored = await scoreItems(allItems, config.domainLabel);
  const relevant = scored.filter(i => i.score >= 6).sort((a, b) => b.score - a.score);
  console.log(`   ${relevant.length}/${scored.length} items score ≥ 6`);

  const toGenerate = relevant.length >= 3 ? relevant : scored.sort((a, b) => b.score - a.score).slice(0, 8);

  // 5. Claude Sonnet 4.6 — article + KB en parallèle
  console.log(`\n✍️  Generating article + KB with Claude Sonnet 4.6 (${toGenerate.length} items)...`);
  const [article, kbContent] = await Promise.all([
    generateArticle(toGenerate, config),
    generateKbUpdate(toGenerate, config),
  ]);

  console.log(`\n📄 Article: "${article.fr?.title}"`);
  console.log(`   Slug: ${article.slug}`);

  // 6. Save
  saveArticle(article);
  saveKbFile(config.category, kbContent);
  console.log('\n✅ Done!\n');
}

module.exports = { runAgent };
