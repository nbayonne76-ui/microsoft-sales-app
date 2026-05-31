import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';
import { getFullKb } from '@/lib/kb-service';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const kbContent = getFullKb(12000);
    const today = new Date().toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

    const systemPrompt = `Tu es un assistant commercial pour Nicolas BAYONNE, Microsoft Partner Account Manager.
Aujourd'hui c'est le ${today}.

KNOWLEDGE BASE MICROSOFT (prix et solutions actuels) :
${kbContent}`;

    const userPrompt = `Génère le brief commercial du jour pour Nicolas. Structure :

**3 PRIORITÉS DU JOUR :**
1. [priorité commerciale concrète liée à une actualité ou tendance Microsoft]
2. [priorité avec un angle de prospection spécifique]
3. [priorité avec une action immédiate recommandée]

**STAT DU JOUR :**
[1 chiffre percutant tiré de la KB]

**QUESTION DE QUALIFICATION À TESTER AUJOURD'HUI :**
[1 question ouverte stratégique pour un RDV de découverte]

**QUICK WIN :**
[La deal la plus rapide à fermer cette semaine — pourquoi maintenant et qui contacter]

Sois direct, actionnable, commercial. Maximum 300 mots.`;

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = anthropic.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 600,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
          });

          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: event.delta.text })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
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
    return handleApiError(error, 'Dashboard Brief');
  }
}
