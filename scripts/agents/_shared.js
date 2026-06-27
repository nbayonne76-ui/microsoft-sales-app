/**
 * Shared utilities for Microsoft blog agents.
 * CommonJS — runs as standalone Node.js scripts.
 */

const fs   = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../../data/blog-articles.json');

// ── Env loader (.env.local) ───────────────────────────────────────────────────

function loadEnv() {
  const candidates = ['.env.local', '.env'];
  const envPath = candidates
    .map(f => path.join(__dirname, '../../', f))
    .find(p => fs.existsSync(p));
  if (!envPath) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
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

async function fetchMultipleRSS(urls) {
  const results = await Promise.allSettled(urls.map(fetchRSS));
  return results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
}

// ── Tavily search ─────────────────────────────────────────────────────────────

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

// ── GPT-4o article generator ──────────────────────────────────────────────────

async function generateArticle(newsItems, config) {
  const { OpenAI } = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const today = new Date().toISOString().split('T')[0];
  const newsText = newsItems
    .slice(0, 12)
    .map((n, i) => `${i + 1}. [${n.date.slice(0, 10)}] ${n.title}\n   ${n.excerpt}`)
    .join('\n\n');

  const systemPrompt = `You are a Microsoft expert content writer for a B2B sales enablement platform used by Microsoft Account Managers in France. You write authoritative, insightful articles targeted at IT decision-makers (DSI, RSSI, CTO) and Microsoft partners.

Your articles:
- Synthesize recent news into actionable sales insights
- Highlight what changed and why it matters for enterprise customers
- Provide concrete recommendations for Microsoft sellers
- Are written in both French (primary) and English
- Never include specific prices (they change often)
- Focus on value, capabilities, and business impact`;

  const userPrompt = `Based on these recent ${config.domainLabel} news and announcements, write ONE comprehensive expert blog article.

RECENT NEWS:
${newsText}

Return ONLY valid JSON matching this EXACT structure (no markdown, no code blocks):
{
  "slug": "kebab-case-unique-slug-based-on-main-topic-${today.slice(0, 7)}",
  "category": "${config.category}",
  "date": "${today}",
  "readTime": "X min",
  "author": "Nicolas BAYONNE",
  "authorRole": "Microsoft Partner Account Manager",
  "featured": false,
  "fr": {
    "title": "Titre accrocheur en français (max 80 chars)",
    "excerpt": "Résumé de 2-3 phrases en français captant l'essentiel (max 220 chars)",
    "sections": [
      { "type": "intro", "text": "Paragraphe d'introduction engageant (2-3 phrases)" },
      { "type": "h2", "text": "Titre de section 1" },
      { "type": "p", "text": "Paragraphe explicatif" },
      { "type": "h2", "text": "Titre de section 2" },
      { "type": "list", "items": ["Point 1", "Point 2", "Point 3"] },
      { "type": "h2", "text": "Ce que ça signifie pour vos clients" },
      { "type": "p", "text": "Analyse commerciale et recommandations" },
      { "type": "cta", "text": "Question d'appel à l'action", "action": "Analyser un compte", "href": "/account" }
    ]
  },
  "en": {
    "title": "Catchy title in English (max 80 chars)",
    "excerpt": "2-3 sentence summary in English (max 220 chars)",
    "sections": [
      { "type": "intro", "text": "Engaging introduction (2-3 sentences)" },
      { "type": "h2", "text": "Section heading 1" },
      { "type": "p", "text": "Explanatory paragraph" },
      { "type": "h2", "text": "Section heading 2" },
      { "type": "list", "items": ["Point 1", "Point 2", "Point 3"] },
      { "type": "h2", "text": "What This Means for Your Customers" },
      { "type": "p", "text": "Commercial analysis and recommendations" },
      { "type": "cta", "text": "Call to action question", "action": "Analyze an account", "href": "/account" }
    ]
  }
}

Rules:
- slug must be unique and descriptive (use main topic + month like "azure-ai-agent-june-2026")
- readTime: calculate based on word count (avg 200 words/min, typically "5 min" to "8 min")
- sections: 6-8 sections for a rich article
- NO prices or specific dollar amounts
- Focus on capabilities, business value, and sales angles`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.4,
    max_tokens: 3000,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('GPT-4o returned empty response');
  return JSON.parse(raw);
}

// ── Article persistence ───────────────────────────────────────────────────────

function saveArticle(article) {
  const articles = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  const idx = articles.findIndex(a => a.slug === article.slug);
  if (idx >= 0) {
    articles[idx] = article;
    console.log(`✏️  Updated existing article: ${article.slug}`);
  } else {
    articles.unshift(article);
    console.log(`✅ Added new article: ${article.slug}`);
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2), 'utf-8');
  console.log(`📦 blog-articles.json now has ${articles.length} articles`);
}

// ── Main runner ───────────────────────────────────────────────────────────────

async function runAgent(config) {
  console.log(`\n🤖 ${config.domainLabel} Agent — ${new Date().toISOString()}`);
  console.log('─'.repeat(50));

  loadEnv();

  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not set — abort');
    process.exit(1);
  }

  console.log('📡 Fetching RSS feeds...');
  const rssItems = await fetchMultipleRSS(config.rssUrls);
  console.log(`   ${rssItems.length} items from RSS`);

  console.log('🔍 Fetching Tavily search...');
  const tavilyItems = await fetchTavily(config.tavilyQuery);
  console.log(`   ${tavilyItems.length} items from Tavily`);

  const allItems = [...rssItems, ...tavilyItems]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 12);

  if (allItems.length === 0) {
    console.warn('⚠️  No news items found — skipping article generation');
    return;
  }

  console.log(`\n✍️  Generating article with GPT-4o (${allItems.length} news items)...`);
  const article = await generateArticle(allItems, config);

  console.log(`\n📄 Article generated: "${article.fr?.title}"`);
  saveArticle(article);
  console.log('\n✅ Done!\n');
}

module.exports = { runAgent };
