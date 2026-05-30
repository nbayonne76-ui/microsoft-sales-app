import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Called daily at 06:00 UTC by Vercel cron — warms the ISR cache for /api/blog/news
export async function GET() {
  try {
    revalidatePath('/api/blog/news');

    // Fetch the route so Vercel pre-builds the new cached response
    const base = process.env.NEXTAUTH_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const res = await fetch(`${base}/api/blog/news`, {
      cache: 'no-store',
      headers: { 'x-cron-refresh': '1' },
    });

    const data = await res.json();

    return NextResponse.json({
      success: true,
      refreshedAt: new Date().toISOString(),
      newsCount: data.count ?? 0,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
