import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleApiError } from '@/lib/api-error';
import { getFullKb } from '@/lib/kb-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
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
1. [priorité commerciale concrète liée à une actualité ou tendance Microsoft : ex: Copilot, Intune Suite, GitHub Copilot, Release Wave 1]
2. [priorité avec un angle de prospection spécifique sur un client ou secteur]
3. [priorité avec une action immédiate recommandée et mesurable]

**OPPORTUNITÉ PRODUIT DU JOUR :**
[1 produit de la KB (Intune, Copilot Studio, GitHub Copilot, Teams, Viva…) avec angle commercial concret et profil client cible]

**STAT DU JOUR :**
[1 chiffre percutant tiré de la KB : prix, économies, adoption, ROI]

**QUESTION DE QUALIFICATION À TESTER AUJOURD'HUI :**
[1 question ouverte stratégique pour un RDV de découverte : doit révéler un pain point lié aux solutions KB]

**QUICK WIN :**
[La deal la plus rapide à fermer cette semaine : produit, profil client, argument de closing et deadline]

Sois direct, actionnable, commercial. Maximum 350 mots.`;

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 600,
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
