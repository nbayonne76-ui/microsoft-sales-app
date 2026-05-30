import { NextResponse } from 'next/server';
import { prisma } from '@/lib/database';

export const revalidate = 3600;

export async function GET() {
  try {
    const rows = await prisma.microsoftNews.findMany({
      orderBy: { date: 'desc' },
      take: 30,
    });

    // If DB is empty trigger a live refresh from RSS feeds
    if (rows.length === 0) {
      const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      try {
        await fetch(`${base}/api/cron/refresh-news`, { method: 'GET' });
        const fresh = await prisma.microsoftNews.findMany({
          orderBy: { date: 'desc' },
          take: 30,
        });
        return buildResponse(fresh);
      } catch {
        return NextResponse.json({ success: false, error: 'No news available' }, { status: 503 });
      }
    }

    return buildResponse(rows);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function buildResponse(rows) {
  const news = rows.map(r => ({
    id: r.id,
    title: r.title,
    excerpt: r.excerpt,
    url: r.url,
    source: r.source,
    date: r.date.toISOString(),
    category: r.category,
  }));

  return NextResponse.json(
    { success: true, news, count: news.length, lastUpdated: new Date().toISOString() },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200' } }
  );
}
