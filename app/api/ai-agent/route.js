import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';
import { getFullKb, getKbByTopics, detectTopics } from '@/lib/kb-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Streaming SSE response ─────────────────────────────────────────────────
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messages = [], userMessage } = await request.json();

    if (!userMessage?.trim()) {
      return NextResponse.json({ error: 'userMessage is required' }, { status: 400 });
    }

    // Detect topics from the conversation to load relevant KB sections
    const allText = [userMessage, ...messages.map(m => m.content)].join(' ');
    const detectedTopics = detectTopics(allText);
    const kbContent = detectedTopics.length > 0
      ? getKbByTopics(detectedTopics, 14000)
      : getFullKb(12000);

    const systemPrompt = `Tu es un assistant commercial IA pour Nicolas BAYONNE, Microsoft Partner Account Manager.

Ton rôle : aider Nicolas à préparer ses rendez-vous commerciaux, analyser des entreprises, rédiger des emails, comprendre les solutions Microsoft et construire des stratégies de prospection.

RÈGLES ABSOLUES :
- Tous les prix, plans et fonctionnalités Microsoft doivent venir EXCLUSIVEMENT de la Knowledge Base ci-dessous
- Sois direct, actionnable, commercial — pas académique
- Si tu ne trouves pas l'information dans la KB, dis-le clairement
- Réponds dans la même langue que l'utilisateur (FR ou EN)

COMMANDES RECONNUES (slash commands) :
- /brief [entreprise] → Génère un brief commercial rapide
- /email [entreprise] → Suggère un angle d'email avec accroche
- /pitch [produit] → Génère un pitch 2 min pour ce produit Microsoft
- /swot [entreprise] → Analyse SWOT rapide
- /prix [produit] → Prix et plans depuis la KB
- /compare [produit A] vs [produit B] → Comparaison depuis la KB

DOMAINES KB CHARGÉS : ${detectedTopics.join(', ')}

KNOWLEDGE BASE MICROSOFT :
${kbContent}`;

    // Build messages array for OpenAI
    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: userMessage },
    ];

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: openaiMessages,
      temperature: 0.5,
      max_tokens: 1200,
      stream: true,
    });

    // Stream back as SSE
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || '';
            if (delta) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
            }
          }
          // Send metadata at the end
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            done: true,
            kbTopics: detectedTopics,
          })}\n\n`));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return handleApiError(error, 'AI Agent');
  }
}
