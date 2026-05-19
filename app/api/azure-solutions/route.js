import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load solutions from static JSON — no DB dependency, works on Vercel/Railway
let _cache = null;

function loadSolutions() {
  if (_cache) return _cache;
  const raw = readFileSync(join(process.cwd(), 'data', 'azure-solutions.json'), 'utf-8');
  const solutions = JSON.parse(raw);

  const JSON_FIELDS = ['keyFeatures','benefits','useCases','targetIndustries','targetPersonas','pricingTiers','keywords','tags'];
  _cache = solutions.map(s => {
    const out = { ...s };
    for (const f of JSON_FIELDS) {
      if (typeof out[f] === 'string') {
        try { out[f] = JSON.parse(out[f]); } catch { out[f] = []; }
      }
    }
    return out;
  });
  return _cache;
}

function applyLang(solutions, lang) {
  if (lang !== 'fr') return solutions;
  return solutions.map(s => ({
    ...s,
    shortDescription: s.shortDescriptionFr || s.shortDescription,
    fullDescription:  s.fullDescriptionFr  || s.fullDescription,
  }));
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search   = searchParams.get('search');
    const lang     = searchParams.get('lang') || 'en';

    let solutions = loadSolutions().filter(s => s.isActive !== false);

    if (category && category !== 'all') {
      solutions = solutions.filter(s => s.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      solutions = solutions.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.officialName?.toLowerCase().includes(q) ||
        s.shortDescription?.toLowerCase().includes(q)
      );
    }

    solutions = applyLang(solutions, lang);

    const response = NextResponse.json({ solutions, total: solutions.length });
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
    return response;
  } catch (error) {
    console.error('azure-solutions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const { action } = await request.json();
  if (action === 'invalidate-cache') {
    _cache = null;
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
