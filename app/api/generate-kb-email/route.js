import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { handleApiError } from '@/lib/api-error';
import { getKbByTopic, getKbFiles } from '@/lib/kb-service';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      companyName, contactName, contactRole,
      industry, companySize, solution, challenge,
      emailType = 'prospection', tone = 'professional',
    } = await request.json();

    if (!companyName?.trim()) {
      return NextResponse.json({ error: 'companyName is required' }, { status: 400 });
    }

    // Map granular sub-solution IDs → parent KB topic
    const KB_TOPIC_MAP = {
      dy_sales: 'dynamics', dy_cs: 'dynamics', dy_field: 'dynamics',
      dy_bc: 'dynamics', dy_finance: 'dynamics',
      m365_business: 'm365', m365_e3: 'm365', m365_e5: 'm365', m365_copilot: 'm365',
      azure_migration: 'azure', azure_ai: 'azure', azure_infra: 'azure', azure_data: 'azure',
      power_bi: 'power', power_apps: 'power', power_automate: 'power',
      security_defender: 'security', security_sentinel: 'security', security_purview: 'security',
    };
    const kbTopic    = KB_TOPIC_MAP[solution] || solution || 'm365';
    const kbContent  = getKbByTopic(kbTopic);
    const kbFiles    = getKbFiles(kbTopic);

    const SOLUTION_LABELS = {
      // Legacy
      m365: 'Microsoft 365', azure: 'Microsoft Azure',
      dynamics: 'Dynamics 365', power: 'Power Platform',
      security: 'Microsoft Security & Compliance', bundles: 'Microsoft Solution Bundles',
      // Dynamics 365 sub-solutions
      dy_sales:   'Dynamics 365 Sales',
      dy_cs:      'Dynamics 365 Customer Service',
      dy_field:   'Dynamics 365 Field Service',
      dy_bc:      'Dynamics 365 Business Central',
      dy_finance: 'Dynamics 365 Finance & Supply Chain',
      // Microsoft 365 sub-solutions
      m365_business: 'Microsoft 365 Business',
      m365_e3:       'Microsoft 365 Enterprise E3',
      m365_e5:       'Microsoft 365 Enterprise E5',
      m365_copilot:  'Microsoft 365 Copilot',
      // Azure sub-solutions
      azure_migration: 'Azure Cloud Migration',
      azure_ai:        'Azure AI & OpenAI Service',
      azure_infra:     'Azure Infrastructure',
      azure_data:      'Azure Data & Analytics',
      // Power Platform sub-solutions
      power_bi:       'Power BI',
      power_apps:     'Power Apps',
      power_automate: 'Power Automate',
      // Security sub-solutions
      security_defender: 'Microsoft Defender',
      security_sentinel: 'Microsoft Sentinel',
      security_purview:  'Microsoft Purview',
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

# RÈGLE ABSOLUE
Tu dois EXCLUSIVEMENT utiliser les données, prix et fonctionnalités présents dans la KNOWLEDGE BASE ci-dessous.
N'invente JAMAIS un prix ou une fonctionnalité absente de la KB.

# STYLE D'EMAIL
${toneGuide}

# TYPE D'EMAIL
${typeGuide}

# STRUCTURE OBLIGATOIRE
1. OBJET : accrocheur, personnalisé, <60 caractères
2. SALUTATION : avec prénom si disponible
3. HOOK (1 phrase) : fait sectoriel ou question provocante lié à ${industry || 'leur secteur'}
4. PROBLÈME : reformuler leur défi principal "${challenge || 'transformation digitale'}" avec empathie
5. SOLUTION : présenter ${solutionLabel} avec données EXACTES de la KB (fonctionnalités + prix)
6. ROI / PREUVE SOCIALE : chiffre concret tiré de la KB (ex: -40% coûts, 99.99% SLA)
7. CTA : une seule action claire et facile (15 min d'appel, demo, PDF)
8. SIGNATURE : Nicolas BAYONNE | Microsoft Partner Account Manager

# KNOWLEDGE BASE — ${solutionLabel}
Fichiers consultés : ${kbFiles.join(', ')}
${kbContent}`;

    const userPrompt = `Rédige un email de ${emailType} en FRANÇAIS pour :

**Entreprise :** ${companyName}
**Contact :** ${contactName || 'le décideur'}
**Poste :** ${contactRole || 'Directeur Général / DSI'}
**Secteur :** ${industry || 'non précisé'}
**Taille :** ${companySize === 'enterprise' ? 'Grand compte (300+ employés)' : companySize === 'startup' ? 'Startup (<50)' : 'PME (50-300 employés)'}
**Défi principal :** ${challenge || 'transformation digitale et optimisation IT'}
**Solution à pitcher :** ${solutionLabel}

Retourne UNIQUEMENT un objet JSON valide (pas de markdown, pas de code fence) :
{
  "subject": "objet de l'email",
  "body": "corps complet de l'email avec sauts de ligne \\n",
  "kbSources": ["source KB utilisée 1", "source KB utilisée 2"],
  "recommendedPlan": "nom exact du plan recommandé depuis la KB",
  "price": "prix exact depuis la KB"
}`;

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
