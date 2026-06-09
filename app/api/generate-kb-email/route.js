import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { handleApiError } from '@/lib/api-error';
import { getKbByTopic, getKbFiles } from '@/lib/kb-service';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    const toneGuide = TONE_GUIDES[tone] || TONE_GUIDES.professional;

    const TYPE_GUIDES = {
      prospection: 'Premier contact froid. Ouvre avec un hook contextuel lié à leur secteur. Identifie une douleur probable. Propose une valeur immédiate.',
      relance:     'Relance après silence. Référence le premier contact. Apporte un élément nouveau (statistique, cas client, offre limitée).',
      demo:        'Invitation à une démo de 30 min. Met en avant 2-3 bénéfices concrets. Propose 2 créneaux précis. Urgence douce.',
      proposal:    'Proposition formelle après découverte. Structure : contexte → solution → ROI → prochaines étapes. Inclut les prix KB.',
    };
    const typeGuide = TYPE_GUIDES[emailType] || TYPE_GUIDES.prospection;

    const systemPrompt = `Tu es Nicolas BAYONNE, Account Manager Microsoft expert avec 10 ans d'expérience en vente consultative B2B.

RÈGLE ABSOLUE : utilise EXCLUSIVEMENT les données, prix et fonctionnalités présents dans la KNOWLEDGE BASE.
N'invente JAMAIS un prix ou une fonctionnalité absente de la KB.

STYLE D'EMAIL : ${toneGuide}
TYPE D'EMAIL : ${typeGuide}

STRUCTURE OBLIGATOIRE :
1. OBJET : accrocheur, personnalisé, <60 caractères
2. SALUTATION : avec prénom si disponible
3. HOOK (1 phrase) : fait sectoriel ou question provocante lié à ${industry || 'leur secteur'}
4. PROBLÈME : reformuler leur défi principal "${challenge || 'transformation digitale'}" avec empathie
5. SOLUTION : présenter ${solutionLabel} avec données EXACTES de la KB
6. ROI / PREUVE SOCIALE : chiffre concret tiré de la KB
7. CTA : une seule action claire et facile
8. SIGNATURE : Nicolas BAYONNE | Microsoft Partner Account Manager

KNOWLEDGE BASE — ${solutionLabel}
Fichiers : ${kbFiles.join(', ')}
${kbContent}`;

    const userPrompt = `Rédige un email de ${emailType} en FRANÇAIS pour :
Entreprise : ${companyName}
Contact : ${contactName || 'le décideur'}
Poste : ${contactRole || 'Directeur Général / DSI'}
Secteur : ${industry || 'non précisé'}
Taille : ${companySize === 'enterprise' ? 'Grand compte' : companySize === 'startup' ? 'Startup' : 'PME'}
Défi : ${challenge || 'transformation digitale'}
Solution : ${solutionLabel}

Retourne UNIQUEMENT un objet JSON valide :
{"subject":"...","body":"...avec \\n pour sauts de ligne...","kbSources":["..."],"recommendedPlan":"...","price":"..."}`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1400,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const raw = response.content[0].text;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : raw);

    return NextResponse.json({
      success: true,
      subject:         result.subject         || '',
      body:            result.body            || '',
      kbSources:       result.kbSources       || [],
      recommendedPlan: result.recommendedPlan || '',
      price:           result.price           || '',
      solution:        solutionLabel,
      kbFiles,
      tokensUsed:      response.usage?.output_tokens || 0,
    });
  } catch (error) {
    return handleApiError(error, 'KB Email');
  }
}
