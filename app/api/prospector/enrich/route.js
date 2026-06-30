import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleApiError } from '@/lib/api-error';

export const maxDuration = 45;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Taille entreprise (tranches INSEE) ───────────────────────────────────────
const TRANCHE = {
  '00':'0 salarié','01':'1-2','02':'3-5','03':'6-9','11':'10-19',
  '12':'20-49','21':'50-99','22':'100-199','31':'200-249','32':'250-499',
  '41':'500-999','42':'1 000-1 999','51':'2 000-4 999','52':'5 000-9 999','53':'10 000+',
};

// ── 1. Gov API — infos entreprise (gratuit) ───────────────────────────────────
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
      siren:     c.siren,
      name:      c.nom_complet,
      employees: TRANCHE[c.tranche_effectif_salarie] || null,
      naf:       c.activite_principale,
      city:      c.siege?.commune,
      address:   c.siege?.adresse,
      created:   c.date_creation,
    };
  } catch { return null; }
}

// ── 2. DDG via Jina Reader — recherche web gratuite ───────────────────────────
async function ddgSearch(query) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(`https://r.jina.ai/${encodeURIComponent(url)}`, {
      headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
      signal: AbortSignal.timeout(7000),
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.split('\n')
      .filter(l => l.trim().length > 60 && !l.includes('duckduckgo') && !l.includes('uddg='))
      .slice(0, 5).join(' ').slice(0, 800) || null;
  } catch { return null; }
}

// ── 3. Exa — neural search pour contacts LinkedIn (si clé) ───────────────────
async function fetchExaContact(company) {
  const key = process.env.EXA_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key },
      body: JSON.stringify({
        query: `DSI OR "directeur informatique" OR CIO OR "IT director" "${company}" site:linkedin.com`,
        numResults: 3,
        type: 'neural',
        contents: { text: { maxCharacters: 300 } },
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const hits = (data.results || []).filter(r => r.url?.includes('linkedin.com/in/'));
    if (!hits.length) return null;
    return hits.map(h => `${h.title || ''}: ${h.text || ''}`).join(' | ').slice(0, 600);
  } catch { return null; }
}

// ── 4. Apollo API — contact vérifié (si clé) ─────────────────────────────────
async function fetchApolloContact(company, govData) {
  const key = process.env.APOLLO_API_KEY;
  if (!key) return null;
  try {
    // Cherche DSI/CIO/IT Director dans la société
    const res = await fetch('https://api.apollo.io/v1/people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify({
        api_key: key,
        q_organization_name: govData?.name || company,
        person_titles: [
          'DSI', 'Directeur des Systèmes d\'Information',
          'CIO', 'Chief Information Officer',
          'IT Director', 'VP IT', 'Directeur IT',
          'Directeur Informatique', 'Responsable IT',
        ],
        page: 1,
        per_page: 1,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const person = data.people?.[0];
    if (!person) return null;
    return {
      name:          person.name,
      firstName:     person.first_name,
      lastName:      person.last_name,
      title:         person.title,
      email:         person.email,
      emailStatus:   person.email_status,   // verified / likely_to_engage / etc.
      phone:         person.phone_numbers?.[0]?.sanitized_number || null,
      linkedinUrl:   person.linkedin_url,
      source:        'apollo',
    };
  } catch { return null; }
}

// ── 5. GPT-4o-mini — synthèse + scoring Microsoft ────────────────────────────
async function synthesize(company, govData, webSignals, exaContact, apolloContact) {
  const today = new Date().toISOString().split('T')[0];

  const context = [
    govData ? `Données légales: ${JSON.stringify(govData)}` : '',
    webSignals ? `Signaux web: ${webSignals.slice(0, 600)}` : '',
    exaContact ? `LinkedIn trouvé: ${exaContact}` : '',
    apolloContact ? `Contact Apollo: ${JSON.stringify(apolloContact)}` : '',
  ].filter(Boolean).join('\n\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'user',
      content: `Tu es un expert Microsoft Partner Account Manager en France.
Analyse ce prospect pour qualifier son potentiel Microsoft (M365, Azure, Dynamics 365, Copilot, Security).

Entreprise : "${company}"
Date : ${today}
Contexte :
${context || 'Aucune donnée disponible — base-toi sur ton knowledge général.'}

Retourne UNIQUEMENT un JSON valide :
{
  "companyName": "nom officiel",
  "city": "ville principale ou null",
  "sector": "secteur d'activité (ex: Industrie, Finance, Retail)",
  "size": "taille estimée (ex: 500-1000 salariés)",
  "website": "domaine probable (ex: totalenergies.com) ou null",

  "contact": {
    "name": "Prénom Nom ou null",
    "title": "titre exact (ex: DSI, Directeur IT) ou null",
    "email": "email ou null",
    "emailPattern": "pattern estimé (ex: prenom.nom@domain.fr) ou null",
    "phone": "téléphone ou null",
    "linkedinUrl": "URL LinkedIn ou null",
    "confidence": "high|medium|low"
  },

  "microsoft": {
    "fitScore": 8,
    "priority": "P0",
    "solution": "dynamics",
    "solutionLabel": "Dynamics 365 Business Central",
    "signals": ["Signal clé 1", "Signal clé 2", "Signal clé 3"],
    "hook": "1 phrase d'accroche commerciale personnalisée pour Touch #1"
  }
}

Règles :
- fitScore 1-10 (probabilité d'achat Microsoft dans 12 mois)
- priority: P0 (score ≥8, opportunité immédiate), P1 (6-7), P2 (≤5)
- solution: 'm365' | 'azure' | 'dynamics' | 'copilot_studio' | 'security' | 'bundles'
- signals: 3 max, factuel, concis (< 80 chars chacun)
- hook: 1 phrase personnalisée qui accroche le DSI/DG sur leur contexte spécifique
- Si contact Apollo présent → utilise ces données en priorité absolue`,
    }],
    response_format: { type: 'json_object' },
    temperature: 0.2,
    max_tokens: 600,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error('GPT-4o-mini returned empty response');
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('GPT-4o-mini returned invalid JSON');
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const { company } = await request.json();
    if (!company?.trim()) {
      return NextResponse.json({ error: 'company is required' }, { status: 400 });
    }

    const hasApollo = !!process.env.APOLLO_API_KEY;

    // Collecte en parallèle (toutes sources sauf Apollo qui peut être lourd)
    const [govResult, webResult, exaResult] = await Promise.allSettled([
      fetchGovData(company),
      ddgSearch(`"${company}" DSI directeur informatique cloud Microsoft transformation digitale recrutement IT 2024 2025`),
      fetchExaContact(company),
    ]);

    const govData    = govResult.status    === 'fulfilled' ? govResult.value    : null;
    const webSignals = webResult.status    === 'fulfilled' ? webResult.value    : null;
    const exaContact = exaResult.status    === 'fulfilled' ? exaResult.value    : null;

    // Apollo en séquentiel après (pour éviter timeout si les autres sont lents)
    const apolloContact = hasApollo ? await fetchApolloContact(company, govData) : null;

    // Synthèse GPT-4o-mini
    const result = await synthesize(company, govData, webSignals, exaContact, apolloContact);

    // Enrichit le contact avec les données Apollo vérifiées si disponibles
    if (apolloContact) {
      result.contact = {
        name:        apolloContact.name        || result.contact?.name,
        title:       apolloContact.title       || result.contact?.title,
        email:       apolloContact.email       || result.contact?.email,
        emailPattern: result.contact?.emailPattern,
        phone:       apolloContact.phone       || result.contact?.phone,
        linkedinUrl: apolloContact.linkedinUrl || result.contact?.linkedinUrl,
        confidence:  apolloContact.emailStatus === 'verified' ? 'high' : 'medium',
      };
    }

    return NextResponse.json({
      success:      true,
      company,
      hasApollo,
      govFound:     !!govData,
      exaFound:     !!exaContact,
      apolloFound:  !!apolloContact,
      ...result,
    });
  } catch (error) {
    return handleApiError(error, 'prospector/enrich');
  }
}
