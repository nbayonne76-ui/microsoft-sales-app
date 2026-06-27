import { NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-error';
import { runAgent, AGENT_CONFIGS } from '@/lib/agent-runner';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const VALID_TOPICS = Object.keys(AGENT_CONFIGS);

function isAuthorized(request) {
  const secret = process.env.REFRESH_SECRET;
  if (!secret) return false;
  const header = request.headers.get('x-refresh-secret');
  const param  = new URL(request.url).searchParams.get('secret');
  return header === secret || param === secret;
}

export async function POST(request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { topic } = await request.json().catch(() => ({}));

    if (!topic || !VALID_TOPICS.includes(topic)) {
      return NextResponse.json(
        { error: `Invalid topic. Valid values: ${VALID_TOPICS.join(', ')}` },
        { status: 400 }
      );
    }

    console.log(`[refresh-blog] Starting agent: ${topic}`);
    const startedAt = Date.now();

    const result = await runAgent(topic);

    const durationMs = Date.now() - startedAt;
    console.log(`[refresh-blog] Done in ${durationMs}ms — ${result.article.slug}`);

    return NextResponse.json({
      success: true,
      topic,
      durationMs,
      article: {
        slug:     result.article.slug,
        category: result.article.category,
        date:     result.article.date,
        titleFr:  result.article.fr?.title,
        titleEn:  result.article.en?.title,
      },
      stats: result.stats,
    });
  } catch (error) {
    return handleApiError(error, 'refresh-blog');
  }
}

// GET — status + available topics (no auth required)
export async function GET() {
  const configured = !!process.env.REFRESH_SECRET && !!process.env.OPENAI_API_KEY;
  return NextResponse.json({
    status: configured ? 'ready' : 'misconfigured',
    topics: VALID_TOPICS,
    requiredEnv: ['OPENAI_API_KEY', 'REFRESH_SECRET'],
    missingEnv: [
      !process.env.OPENAI_API_KEY && 'OPENAI_API_KEY',
      !process.env.REFRESH_SECRET && 'REFRESH_SECRET',
    ].filter(Boolean),
  });
}
