import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { handleApiError } from '@/lib/api-error';
import { getFullKb, getKbByTopics, detectTopics } from '@/lib/kb-service';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  try {
    const { messages = [], userMessage } = await request.json();

    if (!userMessage?.trim()) {
      return NextResponse.json({ error: 'userMessage is required' }, { status: 400 });
    }

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

COMMANDES RECONNUES :
- /brief [entreprise] → Brief commercial rapide
- /email [entreprise] → Angle d'email avec accroche
- /pitch [produit] → Pitch 2 min pour ce produit Microsoft
- /swot [entreprise] → Analyse SWOT rapide
- /prix [produit] → Prix et plans depuis la KB
- /compare [A] vs [B] → Comparaison depuis la KB

DOMAINES KB CHARGÉS : ${detectedTopics.join(', ') || 'tous'}

KNOWLEDGE BASE MICROSOFT :
${kbContent}`;

    const claudeMessages = [
      ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ];

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = anthropic.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 1200,
            system: systemPrompt,
            messages: claudeMessages,
          });

          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: event.delta.text })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, kbTopics: detectedTopics })}\n\n`));
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
