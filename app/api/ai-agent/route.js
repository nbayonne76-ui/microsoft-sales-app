import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleApiError } from '@/lib/api-error';
import { getFullKb, getKbByTopics, detectTopics } from '@/lib/kb-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
- Réponds dans la même langue que l'utilisateur (FR ou EN)

COMMANDES RECONNUES :
- /brief [entreprise] → Brief commercial rapide
- /email [entreprise] → Angle d'email avec accroche
- /pitch [produit] → Pitch 2 min pour ce produit Microsoft
- /swot [entreprise] → Analyse SWOT rapide
- /prix [produit] → Prix et plans depuis la KB
- /compare [A] vs [B] → Comparaison depuis la KB
- /feature [service] → Disponibilité des features par plan M365 (Teams, Exchange, SharePoint, OneDrive, Copilot, Entra…)
- /compare-plans [E3] vs [E5] → Comparatif détaillé de deux plans M365 avec tableau features
- /intune → Résumé Intune Plan 1 vs Plan 2 vs Suite + cas d'usage vendeur
- /copilot-studio → Récap licences Copilot Studio (Teams vs Standalone) + pricing
- /github-copilot → Plans GitHub Copilot Business vs Enterprise + ROI

DOMAINES KB CHARGÉS : ${detectedTopics.join(', ') || 'tous'}

KNOWLEDGE BASE MICROSOFT :
${kbContent}`;

    const openaiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10),
      { role: 'user', content: userMessage },
    ];

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: openaiMessages,
      temperature: 0.5,
      max_tokens: 1200,
      stream: true,
    });

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
