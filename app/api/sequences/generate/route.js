import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getKbByTopic } from '@/lib/kb-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SOLUTION_LABELS = {
  m365:     'Microsoft 365',
  azure:    'Microsoft Azure',
  dynamics: 'Dynamics 365',
  power:    'Power Platform',
  security: 'Microsoft Security & Compliance',
  bundles:  'Microsoft Solution Bundles',
};

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { company, solution = 'm365', persona = 'DSI', industry, companySize = 'sme' } = await request.json();

    if (!company?.trim()) {
      return NextResponse.json({ error: 'company is required' }, { status: 400 });
    }

    const kbContent = getKbByTopic(solution, 10000);
    const solutionLabel = SOLUTION_LABELS[solution] || solution;
    const sizeLabel = companySize === 'enterprise' ? 'Grand compte (300+ employés)' : companySize === 'startup' ? 'Startup (<50)' : 'PME (50-300 employés)';

    const systemPrompt = `Tu es Nicolas BAYONNE, Account Manager Microsoft expert chez H'appi.
Tu dois créer un plan de séquence de prospection en 3 phases et 7 touches pour une cible commerciale précise.

RÈGLE ABSOLUE : tous les prix, fonctionnalités et plans doivent venir EXCLUSIVEMENT de la Knowledge Base.

KNOWLEDGE BASE — ${solutionLabel} :
${kbContent}`;

    const userPrompt = `Crée une séquence de prospection complète pour :
- Entreprise cible : "${company}"
- Secteur : ${industry || 'non précisé'}
- Taille : ${sizeLabel}
- Interlocuteur cible : ${persona}
- Solution à pitcher : ${solutionLabel}

Retourne UNIQUEMENT un objet JSON valide :
{
  "sequenceName": "nom court de la séquence",
  "objective": "objectif en 1 phrase",
  "phases": [
    {
      "phase": 1,
      "name": "Découverte",
      "color": "blue",
      "description": "Première prise de contact et établissement de la relation",
      "touches": [
        {
          "touch": 1,
          "day": 0,
          "type": "email",
          "channel": "Email",
          "subject": "objet de l'email <60 chars",
          "body": "corps complet de l'email avec \\n pour les sauts de ligne. Utilise les données KB (prix, fonctionnalités).",
          "kbSources": ["source KB utilisée"],
          "tip": "conseil tactique en 1 phrase pour cet envoi"
        }
      ]
    },
    {
      "phase": 2,
      "name": "Qualification",
      "color": "orange",
      "description": "Présentation de la valeur et qualification du besoin",
      "touches": [...]
    },
    {
      "phase": 3,
      "name": "Closing",
      "color": "green",
      "description": "Proposition formelle et prise de décision",
      "touches": [...]
    }
  ]
}

Structure des touches :
- Phase 1 — Découverte : 3 touches (J0 email froid, J3 relance LinkedIn ou email, J7 email nouvelle accroche)
- Phase 2 — Qualification : 2 touches (J14 invitation démo 30 min, J21 email proposition de valeur ciblée avec prix KB)
- Phase 3 — Closing : 2 touches (J30 proposition formelle avec ROI KB, J45 dernier contact urgence douce)

Pour chaque email : inclure des données concrètes de la KB (prix, fonctionnalités, ROI).`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);

    return NextResponse.json({
      success: true,
      company,
      solution: solutionLabel,
      solutionId: solution,
      persona,
      industry,
      companySize,
      sequenceName: result.sequenceName || `Séquence ${company}`,
      objective: result.objective || '',
      phases: result.phases || [],
      tokensUsed: response.usage?.total_tokens || 0,
    });
  } catch (error) {
    console.error('Sequence generate error:', error);
    return NextResponse.json(
      { error: 'Échec de la génération', details: error.message },
      { status: 500 }
    );
  }
}
