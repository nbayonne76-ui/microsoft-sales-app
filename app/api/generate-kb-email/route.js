import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const KB_FILES = {
  m365: ['m365-pricing-2025.md', 'm365-e3-vs-e5-decision-guide.md', 'microsoft-365-collaboration.md', 'microsoft-licensing-contracts-guide.md', 'csp-vs-mca-decision-guide.md'],
  azure: ['azure-pricing-2025.md', 'azure-migration.md'],
  dynamics: ['dynamics-365-pricing-2025.md'],
  power: ['power-platform-digital.md'],
  security: ['security-compliance.md'],
  bundles: ['solution-bundles-pricing.md'],
};

function readKbFile(filename) {
  try {
    const filePath = path.join(process.cwd(), 'templates', 'knowledge-base', filename);
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return '';
  }
}

function loadKbForSolution(solution) {
  const files = KB_FILES[solution] || [...KB_FILES.m365, ...KB_FILES.azure];
  return files
    .map(f => `=== ${f} ===\n${readKbFile(f)}`)
    .join('\n\n')
    .slice(0, 12000); // keep within token budget
}

export async function POST(request) {
  try {
    const {
      companyName,
      contactName,
      contactRole,
      industry,
      companySize,
      solution,
      challenge,
      emailType = 'prospection',
      tone = 'professional',
    } = await request.json();

    if (!companyName) {
      return NextResponse.json({ error: 'companyName is required' }, { status: 400 });
    }

    const kbContent = loadKbForSolution(solution || 'm365');

    const solutionLabel = {
      m365: 'Microsoft 365',
      azure: 'Microsoft Azure',
      dynamics: 'Dynamics 365',
      power: 'Power Platform',
      security: 'Microsoft Security',
      bundles: 'Microsoft Solution Bundles',
    }[solution] || 'Microsoft solutions';

    const toneGuide = {
      professional: 'Formal, executive-level, data-driven, structured with clear sections.',
      friendly: 'Warm and approachable, use light emojis sparingly, conversational but professional.',
      direct: 'Short, punchy, get straight to value. No fluff. Max 150 words body.',
    }[tone] || 'Professional and clear.';

    const systemPrompt = `You are Nicolas BAYONNE, a Microsoft Partner Account Manager at H'appi.
You write highly personalized B2B sales emails in French.
You MUST ONLY use information, pricing, and data from the KNOWLEDGE BASE provided below.
Never invent pricing or features not found in the knowledge base.
Write a complete email with subject line and body.

TONE: ${toneGuide}

KNOWLEDGE BASE:
${kbContent}`;

    const userPrompt = `Write a ${emailType} email in French for:
- Company: ${companyName}
- Contact: ${contactName || 'the decision maker'}
- Role: ${contactRole || 'Directeur Général'}
- Industry: ${industry || 'not specified'}
- Company size: ${companySize || 'SME'}
- Main challenge: ${challenge || 'digital transformation'}
- Solution to pitch: ${solutionLabel}

Return ONLY a JSON object (no markdown, no code fence) with:
{
  "subject": "the email subject",
  "body": "the full email body with line breaks as \\n",
  "kbSources": ["list of specific KB sections you used, e.g. 'M365 Business Standard pricing'"],
  "recommendedPlan": "the single most relevant plan/product name from the KB",
  "price": "the price of that plan from the KB"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content);

    return NextResponse.json({
      success: true,
      subject: result.subject,
      body: result.body,
      kbSources: result.kbSources || [],
      recommendedPlan: result.recommendedPlan || '',
      price: result.price || '',
      solution: solutionLabel,
      tokensUsed: response.usage?.total_tokens || 0,
    });
  } catch (error) {
    console.error('KB email generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate email', details: error.message },
      { status: 500 }
    );
  }
}
