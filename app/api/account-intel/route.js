import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleApiError } from '@/lib/api-error';
import { getFullKb } from '@/lib/kb-service';

export const maxDuration = 60;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Employee tranche labels (French gov) ──────────────────────────────────────
const TRANCHE = {
  '00':'0 salarié','01':'1-2','02':'3-5','03':'6-9','11':'10-19',
  '12':'20-49','21':'50-99','22':'100-199','31':'200-249','32':'250-499',
  '41':'500-999','42':'1 000-1 999','51':'2 000-4 999','52':'5 000-9 999','53':'10 000+',
};

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 1 — French Gov API (free, no key, reliable)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchGovData(name) {
  try {
    const res = await fetch(
      `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(name)}&page=1&per_page=3`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const c = data.results?.[0];
    if (!c) return null;
    return {
      siren: c.siren,
      name: c.nom_complet,
      employees: TRANCHE[c.tranche_effectif_salarie] || null,
      created: c.date_creation,
      naf: c.activite_principale,
      city: c.siege?.commune,
      postalCode: c.siege?.code_postal,
      address: c.siege?.adresse,
    };
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 2 — DuckDuckGo via Jina Reader (free, no key)
// ─────────────────────────────────────────────────────────────────────────────
async function ddgSearch(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    const lines = text.split('\n')
      .filter(l => l.trim().length > 80 && !l.includes('duckduckgo') && !l.includes('uddg=') && !l.includes('##'))
      .slice(0, 6)
      .join(' ');
    return lines.slice(0, 900) || null;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 3 — Jina Reader: fetch company website (free, no key)
// ─────────────────────────────────────────────────────────────────────────────
async function fetchWebsite(url) {
  try {
    const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.split('\n')
      .filter(l => l.trim().length > 40 && !l.startsWith('!') && !l.startsWith('['))
      .slice(0, 20)
      .join('\n')
      .slice(0, 1200) || null;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE 4 — Tavily (has key, AI-optimized)
// ─────────────────────────────────────────────────────────────────────────────
async function tavilySearch(query) {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, query, search_depth: 'basic', max_results: 4 }),
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return data.results?.map(r => `[${r.title}] ${r.content?.slice(0, 250)}`).join('\n').slice(0, 1200) || null;
  } catch { return null; }
}

// ─────────────────────────────────────────────────────────────────────────────
// PIPELINE — 6 fixed searches always run in parallel (no AI randomness)
// ─────────────────────────────────────────────────────────────────────────────
async function runSearchPipeline(companyName) {
  const enc = encodeURIComponent;

  // Run all 6 searches in parallel
  const [govData, newsResults, itSignals, jobSignals, websiteSearch, tavilyNews] = await Promise.allSettled([

    // 1. Gov registry — employees, SIREN, city, NAF (always first)
    fetchGovData(companyName),

    // 2. DDG — recent news & press
    ddgSearch(`"${companyName}" actualités 2024 2025`),

    // 3. DDG — digital/cloud/IT signals
    ddgSearch(`"${companyName}" transformation digitale cloud Microsoft Azure informatique`),

    // 4. DDG — IT job postings (signals investment)
    ddgSearch(`"${companyName}" recrutement DSI architecte cloud développeur informatique`),

    // 5. DDG — find official website then fetch it
    ddgSearch(`"${companyName}" site officiel`).then(async (snippet) => {
      // Extract first URL from snippet if found
      if (!snippet) return null;
      const urlMatch = snippet.match(/https?:\/\/[^\s"]+\.[a-z]{2,4}(?:\/[^\s]*)?/);
      if (urlMatch && !urlMatch[0].includes('duckduckgo')) {
        return fetchWebsite(urlMatch[0]);
      }
      return snippet;
    }),

    // 6. Tavily — deep news & business intelligence
    tavilySearch(`${companyName} stratégie IT budget numérique investissement technologie`),
  ]);

  const get = (r) => r.status === 'fulfilled' ? r.value : null;

  return {
    gov:     get(govData),
    news:    get(newsResults),
    it:      get(itSignals),
    jobs:    get(jobSignals),
    website: get(websiteSearch),
    tavily:  get(tavilyNews),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ANALYSIS — single GPT call with all gathered data
// ─────────────────────────────────────────────────────────────────────────────
async function analyze(companyName, pipeline, kbContent) {
  const { gov, news, it, jobs, website, tavily } = pipeline;

  // Build rich context block from all pipeline results
  const context = [
    gov ? `## REGISTRE OFFICIEL (api.gouv.fr)
- Nom : ${gov.name}
- SIREN : ${gov.siren}
- Effectif : ${gov.employees || 'non disponible'}
- Date de création : ${gov.created || 'nc'}
- Activité NAF : ${gov.naf || 'nc'}
- Ville : ${gov.city || 'nc'} ${gov.postalCode || ''}` : '## REGISTRE : entreprise non trouvée dans le registre français',

    website ? `## SITE WEB OFFICIEL\n${website}` : null,
    it      ? `## SIGNAUX DIGITAUX & CLOUD\n${it}` : null,
    jobs    ? `## SIGNAUX RECRUTEMENT IT\n${jobs}` : null,
    news    ? `## ACTUALITÉS RÉCENTES\n${news}` : null,
    tavily  ? `## INTELLIGENCE BUSINESS (Tavily)\n${tavily}` : null,
  ].filter(Boolean).join('\n\n');

  const sourcesUsed = {
    gov:     !!gov,
    website: !!website,
    it:      !!it,
    jobs:    !!jobs,
    news:    !!news,
    tavily:  !!tavily,
  };

  const prompt = `Tu es un expert en intelligence commerciale pour Nicolas BAYONNE, Microsoft Partner Account Manager.

DONNÉES COLLECTÉES SUR "${companyName}" :
${context}

KNOWLEDGE BASE MICROSOFT (utilise EXCLUSIVEMENT ces prix/solutions pour les recommandations) :
${kbContent}

Génère le dossier commercial complet. Retourne UNIQUEMENT ce JSON valide (sans markdown) :
{
  "company": {
    "name": "nom officiel exact",
    "industry": "secteur précis",
    "size": "startup|sme|enterprise",
    "estimatedRevenue": "fourchette CA si disponible, sinon estimation selon secteur+effectif",
    "headquarters": "ville, pays",
    "description": "2 phrases précises sur ce que fait l'entreprise",
    "website": "domaine.com",
    "employees": "effectif exact ou fourchette"
  },
  "digitalSignals": [
    "Signal 1 concret avec source (ex: 3 postes DSI ouverts sur LinkedIn = investissement cloud)",
    "Signal 2 basé sur données collectées",
    "Signal 3 basé sur données collectées"
  ],
  "swot": {
    "strengths": ["Force 1 liée à Microsoft", "Force 2", "Force 3"],
    "weaknesses": ["Faiblesse 1 = angle commercial Microsoft", "Faiblesse 2", "Faiblesse 3"],
    "opportunities": ["Opportunité 1 que Microsoft peut adresser", "Op2", "Op3"],
    "threats": ["Menace 1 atténuée par Microsoft", "M2", "M3"]
  },
  "pestel": {
    "political": "contexte réglementaire impactant leur IT",
    "economic": "pression coûts IT, budget numérique",
    "social": "télétravail, recrutement tech, culture digitale",
    "technological": "maturité tech actuelle + enjeux modernisation",
    "environmental": "Green IT, Net Zéro, reporting carbone",
    "legal": "RGPD, conformité sectorielle, audit"
  },
  "microsoftFit": {
    "score": 75,
    "rationale": "2-3 phrases liées au contexte RÉEL collecté",
    "urgencyLevel": "high|medium|low",
    "buyingSignals": ["Signal d'achat 1 basé sur données", "Signal 2"]
  },
  "decisionMakers": [
    {"role": "DSI / CTO", "painPoints": "problèmes IT réels identifiés", "microsoftAngle": "solution Microsoft adaptée"},
    {"role": "DG / CEO", "painPoints": "enjeux business réels", "microsoftAngle": "valeur business Microsoft"},
    {"role": "CFO / DAF", "painPoints": "enjeux financiers", "microsoftAngle": "argument TCO/ROI KB"}
  ],
  "topSolutions": [
    {"product": "produit KB (ex: M365 E5, Copilot Studio, GitHub Copilot, Intune Suite, D365 Sales…)", "plan": "plan KB exact", "price": "prix KB exact", "whyFit": "lié au contexte RÉEL collecté", "roi": "ROI KB chiffré", "category": "m365|azure|dynamics|power|security|devtools", "priority": "must-have|high|medium"},
    {"product": "...", "plan": "...", "price": "...", "whyFit": "...", "roi": "...", "category": "...", "priority": "..."},
    {"product": "...", "plan": "...", "price": "...", "whyFit": "...", "roi": "...", "category": "...", "priority": "..."},
    {"product": "...", "plan": "...", "price": "...", "whyFit": "...", "roi": "...", "category": "...", "priority": "..."}
  ],
  "emailAngles": [
    {"angle": "titre court", "hook": "1ère phrase basée sur fait réel collecté", "solution": "produit Microsoft", "persona": "DSI|DG|CFO"},
    {"angle": "...", "hook": "...", "solution": "...", "persona": "..."},
    {"angle": "...", "hook": "...", "solution": "...", "persona": "..."}
  ],
  "keyQuestions": ["Q découverte SWOT", "Q PESTEL", "Q budget/timeline", "Q concurrents internes"],
  "competitorRisk": "AWS|Google|SAP|Salesforce — justification basée sur secteur",
  "quickWin": "deal rapide — pourquoi maintenant — interlocuteur"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 4096,
  });

  const raw = response.choices[0].message.content || '';
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('GPT response contained no JSON block');
  let intel;
  try {
    intel = JSON.parse(jsonMatch[0]);
  } catch {
    // GPT occasionally emits trailing commas or NaN — strip and retry
    const cleaned = jsonMatch[0]
      .replace(/,\s*([}\]])/g, '$1')   // trailing commas
      .replace(/:\s*NaN/g, ': null')    // NaN values
      .replace(/:\s*undefined/g, ': null');
    intel = JSON.parse(cleaned);        // throws naturally if still malformed
  }

  // Always override with trusted gov data
  if (gov) {
    if (gov.employees) intel.company.employees = gov.employees;
    if (gov.city && intel.company.headquarters === 'Unknown') {
      intel.company.headquarters = `${gov.city}, France`;
    }
    if (gov.name) intel.company.name = gov.name;
  }

  return { intel, sourcesUsed };
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { accountName } = await request.json();
    if (!accountName?.trim()) {
      return NextResponse.json({ error: 'accountName is required' }, { status: 400 });
    }

    const [kbContent, pipeline] = await Promise.all([
      Promise.resolve(getFullKb(10000)),
      runSearchPipeline(accountName.trim()),
    ]);

    const { intel, sourcesUsed } = await analyze(accountName.trim(), pipeline, kbContent);
    const snippetCount = Object.values(sourcesUsed).filter(Boolean).length;

    return NextResponse.json({
      success: true,
      intel,
      webDataUsed: Object.values(sourcesUsed).some(Boolean),
      sourcesUsed,
      snippetCount,
      tokensUsed: 0,
    });
  } catch (error) {
    return handleApiError(error, 'Account Intel');
  }
}
