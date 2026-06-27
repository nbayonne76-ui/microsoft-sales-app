import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleApiError } from '@/lib/api-error';
import { getKbByTopic } from '@/lib/kb-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SOLUTION_LABELS = {
  m365:           'Microsoft 365',
  azure:          'Microsoft Azure',
  dynamics:       'Dynamics 365',
  power:          'Power Platform',
  copilot_studio: 'Microsoft Copilot Studio',
  security:       'Microsoft Security & Compliance',
  intune:         'Microsoft Intune',
  github_copilot: 'GitHub Copilot',
  bundles:        'Microsoft Solution Bundles',
};

const KB_TOPIC_MAP = {
  copilot_studio: 'power',
  intune:         'security',
  github_copilot: 'devtools',
};

export async function POST(request) {
  try {
    const { company, solution = 'm365', persona = 'DSI', industry, companySize = 'sme' } = await request.json();

    if (!company?.trim()) {
      return NextResponse.json({ error: 'company is required' }, { status: 400 });
    }

    const kbTopic = KB_TOPIC_MAP[solution] || solution;
    const kbContent = getKbByTopic(kbTopic, 10000);
    const solutionLabel = SOLUTION_LABELS[solution] || solution;
    const sizeLabel = companySize === 'enterprise' ? 'Grand compte (300+ employés)' : companySize === 'startup' ? 'Startup (<50)' : 'PME (50-300 employés)';

    const systemPrompt = `Tu es Nicolas BAYONNE, Microsoft Partner Account Manager expert en vente consultative B2B.
Tu dois créer un plan de séquence de prospection en 3 phases et 7 touches pour une cible commerciale précise.
RÈGLE ABSOLUE : tous les prix, fonctionnalités et plans doivent venir EXCLUSIVEMENT de la Knowledge Base.

KNOWLEDGE BASE : ${solutionLabel} :
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
      "phase": 1, "name": "Découverte", "color": "blue",
      "description": "Première prise de contact",
      "touches": [{ "touch": 1, "day": 0, "type": "email", "channel": "Email", "subject": "...", "body": "...", "kbSources": ["..."], "tip": "..." }]
    },
    { "phase": 2, "name": "Qualification", "color": "orange", "description": "Qualification du besoin", "touches": [] },
    { "phase": 3, "name": "Closing", "color": "green", "description": "Proposition formelle", "touches": [] }
  ]
}
Structure : Phase 1 : 3 touches (J0, J3, J7) · Phase 2 : 2 touches (J14, J21) · Phase 3 : 2 touches (J30, J45).`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 4000,
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
    return handleApiError(error, 'Sequence Generate');
  }
}
