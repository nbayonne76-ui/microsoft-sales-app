import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function readAllKb() {
  const dir = path.join(process.cwd(), 'templates', 'knowledge-base');
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .map(f => {
      const content = fs.readFileSync(path.join(dir, f), 'utf-8');
      return `=== ${f} ===\n${content.slice(0, 2000)}`; // cap per file
    })
    .join('\n\n')
    .slice(0, 15000);
}

export async function POST(request) {
  try {
    const { accountName } = await request.json();

    if (!accountName?.trim()) {
      return NextResponse.json({ error: 'accountName is required' }, { status: 400 });
    }

    const kbContent = readAllKb();

    const systemPrompt = `You are an expert Microsoft Partner sales advisor at H'appi.
Given a company name, provide a structured account intelligence brief.
Base ALL product recommendations, pricing, and features ONLY on the knowledge base provided.
Return a valid JSON object only — no markdown, no code fences.

KNOWLEDGE BASE:
${kbContent}`;

    const userPrompt = `Company to analyse: "${accountName}"

Return ONLY a JSON object with this exact structure:
{
  "company": {
    "name": "company name",
    "likelyIndustry": "educated guess based on name",
    "likelySize": "startup | sme | enterprise",
    "likelySegment": "short description of what this company probably does"
  },
  "microsoftFit": {
    "score": 85,
    "rationale": "2-3 sentence explanation of why Microsoft solutions fit this company"
  },
  "topSolutions": [
    {
      "product": "product name from KB",
      "plan": "specific plan/tier from KB",
      "price": "exact price from KB",
      "whyFit": "1 sentence specific to this company",
      "roi": "estimated ROI or saving from KB data",
      "category": "m365 | azure | dynamics | power | security"
    }
  ],
  "emailAngles": [
    {
      "angle": "short angle title",
      "hook": "1-sentence hook you would open the email with",
      "solution": "which Microsoft product to pitch"
    }
  ],
  "keyQuestions": ["Question to ask the prospect in a discovery call"],
  "competitorRisk": "AWS | Google Workspace | SAP | other — most likely competitor to watch",
  "quickWin": "The single fastest/easiest deal to close with this account and why"
}

Provide 3 topSolutions, 3 emailAngles, 4 keyQuestions.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
    });

    const intel = JSON.parse(response.choices[0].message.content);

    return NextResponse.json({
      success: true,
      intel,
      tokensUsed: response.usage?.total_tokens || 0,
    });
  } catch (error) {
    console.error('Account intel error:', error);
    return NextResponse.json(
      { error: 'Failed to generate account intelligence', details: error.message },
      { status: 500 }
    );
  }
}
