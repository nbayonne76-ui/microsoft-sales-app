import { prisma } from '@/lib/database';
import { NextResponse } from 'next/server';

// ✅ In-memory cache with TTL (Time To Live)
let solutionsCache = null;
let cacheTimestamp = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper function to check if cache is valid
function isCacheValid() {
  if (!solutionsCache || !cacheTimestamp) return false;
  const now = Date.now();
  return (now - cacheTimestamp) < CACHE_TTL;
}

// Helper function to fetch and cache solutions
async function getCachedSolutions() {
  if (isCacheValid()) {
    console.log('✅ Using cached Azure solutions');
    return solutionsCache;
  }

  console.log('📊 Fetching fresh Azure solutions from database');
  const solutions = await prisma.azureSolution.findMany({
    where: { isActive: true },
    orderBy: [
      { salesPriority: 'desc' },
      { category: 'asc' },
      { name: 'asc' }
    ],
    select: {
      id: true,
      name: true,
      officialName: true,
      category: true,
      subcategory: true,
      shortDescription: true,
      fullDescription: true,
      shortDescriptionFr: true,
      fullDescriptionFr: true,
      keyFeatures: true,
      benefits: true,
      useCases: true,
      targetIndustries: true,
      idealCustomerSize: true,
      targetPersonas: true,
      pricingModel: true,
      pricingTiers: true,
      estimatedCost: true,
      implementationTime: true,
      complexity: true,
      salesPriority: true,
      isActive: true,
      isFeatured: true,
      keywords: true,
      tags: true
    }
  });

  const JSON_FIELDS = ['keyFeatures','benefits','useCases','targetIndustries','targetPersonas','pricingTiers','keywords','tags'];
  const parsed = solutions.map(s => {
    const out = { ...s };
    for (const f of JSON_FIELDS) {
      if (typeof out[f] === 'string') {
        try { out[f] = JSON.parse(out[f]); } catch { out[f] = []; }
      }
    }
    return out;
  });

  // Update cache
  solutionsCache = parsed;
  cacheTimestamp = Date.now();

  return parsed;
}

// Helper function to filter solutions in-memory
function filterSolutions(solutions, category, search) {
  let filtered = [...solutions];

  // Apply category filter
  if (category && category !== 'all') {
    filtered = filtered.filter(s => s.category === category);
  }

  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(s =>
      s.name?.toLowerCase().includes(searchLower) ||
      s.officialName?.toLowerCase().includes(searchLower) ||
      s.shortDescription?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
}

// Apply language-specific descriptions (FR or EN)
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

    // Get cached solutions (or fetch if cache expired)
    const allSolutions = await getCachedSolutions();

    // Apply filters then language
    const solutions = applyLang(filterSolutions(allSolutions, category, search), lang);

    // Add cache headers
    const response = NextResponse.json({
      solutions,
      total: solutions.length,
      cached: isCacheValid(),
      cacheAge: cacheTimestamp ? Math.floor((Date.now() - cacheTimestamp) / 1000) : 0
    });

    // Set cache control headers for browser caching
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');

    return response;
  } catch (error) {
    console.error('Error fetching Azure solutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch solutions', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Invalidate cache (call this when solutions are updated)
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'invalidate-cache') {
      solutionsCache = null;
      cacheTimestamp = null;
      console.log('🗑️ Azure solutions cache invalidated');

      return NextResponse.json({
        success: true,
        message: 'Cache invalidated successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in azure-solutions POST:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
}