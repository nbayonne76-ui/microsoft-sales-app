import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { handleApiError } from '@/lib/api-error';
import { getKbByTopic, getKbFiles } from '@/lib/kb-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
  try {
    const {
      companyName, contactName, contactRole,
      industry, companySize, solution, challenge,
      emailType = 'prospection', tone = 'professional',
    } = await request.json();

    if (!companyName?.trim()) {
      return NextResponse.json({ error: 'companyName is required' }, { status: 400 });
    }

    const KB_TOPIC_MAP = {
      dy_sales: 'dynamics', dy_cs: 'dynamics', dy_field: 'dynamics',
      dy_bc: 'dynamics', dy_finance: 'dynamics',
      m365_business: 'm365', m365_e3: 'm365', m365_e5: 'm365', m365_copilot: 'm365',
      azure_migration: 'azure', azure_ai: 'azure', azure_infra: 'azure', azure_data: 'azure',
      power_bi: 'power', power_apps: 'power', power_automate: 'power',
      security_defender: 'security', security_sentinel: 'security', security_purview: 'security',
    };
    const kbTopic   = KB_TOPIC_MAP[solution] || solution || 'm365';
    const kbContent = getKbByTopic(kbTopic);
    const kbFiles   = getKbFiles(kbTopic);

    const SOLUTION_LABELS = {
      m365: 'Microsoft 365', azure: 'Microsoft Azure',
      dynamics: 'Dynamics 365', power: 'Power Platform',
      security: 'Microsoft Security & Compliance', bundles: 'Microsoft Solution Bundles',
      dy_sales: 'Dynamics 365 Sales', dy_cs: 'Dynamics 365 Customer Service',
      dy_field: 'Dynamics 365 Field Service', dy_bc: 'Dynamics 365 Business Central',
      dy_finance: 'Dynamics 365 Finance & Supply Chain',
      m365_business: 'Microsoft 365 Business', m365_e3: 'Microsoft 365 Enterprise E3',
      m365_e5: 'Microsoft 365 Enterprise E5', m365_copilot: 'Microsoft 365 Copilot',
      azure_migration: 'Azure Cloud Migration', azure_ai: 'Azure AI & OpenAI Service',
      azure_infra: 'Azure Infrastructure', azure_data: 'Azure Data & Analytics',
      power_bi: 'Power BI', power_apps: 'Power Apps', power_automate: 'Power Automate',
      security_defender: 'Microsoft Defender', security_sentinel: 'Microsoft Sentinel',
      security_purview: 'Microsoft Purview',
    };
    const solutionLabel = SOLUTION_LABELS[solution] || 'Microsoft solutions';

    const TONE_GUIDES = {
      professional: 'Formel, niveau exécutif. Structuré avec des sections claires. Données chiffrées obligatoires. Longueur : 200-280 mots.',
      friendly:     'Chaleureux et accessible. Conversationnel mais professionnel. 1-2 emojis max. Longueur : 180-250 mots.',
      direct:       'Court, percutant, aller droit au but. Zéro remplissage. Maximum 150 mots dans le corps.',
    };

    const TYPE_GUIDES = {
      prospection: 'Premier contact froid. Ouvre avec un hook contextuel lié à leur secteur.',
      relance:     'Relance après silence. Référence le premier contact. Apporte un élément nouveau.',
      demo:        'Invitation à une démo de 30 min. Propose 2 créneaux précis.',
      proposal:    'Proposition formelle. Structure : contexte → solution → ROI → prochaines étapes.',
    };

    const systemPrompt = `Tu es Nicolas BAYONNE, Account Manager Microsoft expert avec 10 ans d'expérience en vente consultative B2B.
RÈGLE ABSOLUE : utilise EXCLUSIVEMENT les données, prix et fonctionnalités de la KNOWLEDGE BASE.

STYLE : ${TONE_GUIDES[tone] || TONE_GUIDES.professional}
TYPE : ${TYPE_GUIDES[emailType] || TYPE_GUIDES.prospection}

STRUCTURE : OBJET (<60 chars) · SALUTATION · HOOK · PROBLÈME · SOLUTION (données KB) · ROI · CTA · SIGNATURE Nicolas BAYONNE

KNOWLEDGE BASE — ${solutionLabel} (${kbFiles.join(', ')}) :
${kbContent}`;

    const userPrompt = `Email de ${emailType} pour :
Entreprise : ${companyName} | Contact : ${contactName || 'le décideur'} | Poste : ${contactRole || 'DSI/DG'}
Secteur : ${industry || 'n/a'} | Taille : ${companySize === 'enterprise' ? 'Grand compte' : companySize === 'startup' ? 'Startup' : 'PME'}
Défi : ${challenge || 'transformation digitale'} | Solution : ${solutionLabel}

JSON : {"subject":"...","body":"...\\n...","kbSources":["..."],"recommendedPlan":"...","price":"..."}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.65,
      max_tokens: 1400,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);

    return NextResponse.json({
      success: true,
      subject:         result.subject         || '',
      body:            result.body            || '',
      kbSources:       result.kbSources       || [],
      recommendedPlan: result.recommendedPlan || '',
      price:           result.price           || '',
      solution:        solutionLabel,
      kbFiles,
      tokensUsed:      response.usage?.total_tokens || 0,
    });
  } catch (error) {
    return handleApiError(error, 'KB Email');
  }
}
