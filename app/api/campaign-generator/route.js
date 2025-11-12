import * as XLSX from 'xlsx';
import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY || 'demo-key'
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const campaign = formData.get('campaign') || 'Special Offer';
    const product = formData.get('product') || 'Microsoft Copilot';
    const discount = formData.get('discount') || '20%';
    const topLeadsCount = parseInt(formData.get('topLeadsCount') || '50');
    const tone = formData.get('tone') || 'professional';
    const abTesting = formData.get('abTesting') === 'true';

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('📊 Campaign Generator - Processing:', {
      campaign,
      product,
      discount,
      topLeadsCount,
      tone,
      abTesting
    });

    // Step 1: Parse Excel file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    console.log(`📋 Parsed ${jsonData.length} leads from Excel`);

    // Step 2: Score and select top leads
    const scoredLeads = jsonData.map(lead => {
      // Calculate score based on available fields
      let score = 0;

      // Revenue potential (if available)
      if (lead.revenue || lead.potential_revenue) {
        score += parseFloat(lead.revenue || lead.potential_revenue || 0) / 1000;
      }

      // Engagement score
      if (lead.engagement_score || lead.score) {
        score += parseFloat(lead.engagement_score || lead.score || 0);
      }

      // Purchase history
      if (lead.purchase_count || lead.previous_purchases) {
        score += parseFloat(lead.purchase_count || lead.previous_purchases || 0) * 10;
      }

      // Status (active/hot leads get priority)
      if (lead.status) {
        const status = lead.status.toLowerCase();
        if (status.includes('hot') || status.includes('active')) score += 50;
        if (status.includes('warm')) score += 25;
      }

      // Default scoring if no fields found
      if (score === 0) {
        score = Math.random() * 100; // Random score for demo
      }

      return { ...lead, calculated_score: score };
    });

    // Sort by score and get top leads
    const topLeads = scoredLeads
      .sort((a, b) => b.calculated_score - a.calculated_score)
      .slice(0, topLeadsCount);

    console.log(`🎯 Selected top ${topLeads.length} leads`);

    // Step 3: Format leads for Claude
    const formattedLeads = topLeads.map(lead => ({
      name: lead.name || lead.contact_name || lead.full_name || 'Prospect',
      company: lead.company || lead.company_name || lead.organization || '',
      email: lead.email || lead.contact_email || lead.email_address || '',
      industry: lead.industry || lead.sector || '',
      score: Math.round(lead.calculated_score),
      notes: lead.notes || lead.comments || ''
    }));

    // Step 4: Generate emails using Claude
    let generatedEmails;

    if (process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY) {
      generatedEmails = await generateEmailsWithClaude(
        formattedLeads,
        campaign,
        product,
        discount,
        tone,
        abTesting
      );
    } else {
      // Fallback to mock generation
      generatedEmails = generateMockEmails(
        formattedLeads,
        campaign,
        product,
        discount,
        tone,
        abTesting
      );
    }

    console.log(`✅ Generated ${generatedEmails.length} campaign emails`);

    return Response.json({
      success: true,
      totalLeads: jsonData.length,
      topLeadsSelected: topLeads.length,
      emails: generatedEmails,
      metadata: {
        campaign,
        product,
        discount,
        tone,
        abTesting,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Campaign Generator Error:', error);
    return Response.json({
      error: 'Campaign generation failed',
      details: error.message
    }, { status: 500 });
  }
}

// Generate emails using Claude API
async function generateEmailsWithClaude(leads, campaign, product, discount, tone, abTesting) {
  const toneDescriptions = {
    professional: 'professional and polished',
    friendly: 'warm and friendly',
    concise: 'brief and to-the-point',
    formal: 'formal and executive-level'
  };

  const prompt = `You are a professional email marketer specializing in B2B sales campaigns.

CAMPAIGN DETAILS:
- Campaign Name: ${campaign}
- Product: ${product}
- Special Offer: ${discount} discount
- Tone: ${toneDescriptions[tone] || 'professional'}
${abTesting ? '- Generate 2 variations (A/B) per lead for testing' : ''}

TASK:
Generate personalized sales emails for each lead in the following list.
Each email should:
1. Use the lead's name and company for personalization
2. Highlight the ${discount} discount for ${product}
3. Address potential pain points in their industry (if known)
4. Include a clear call-to-action
5. Keep the tone ${toneDescriptions[tone] || 'professional'} but persuasive
6. Be between 150-250 words

LEADS:
${JSON.stringify(leads, null, 2)}

OUTPUT FORMAT:
Return ONLY a valid JSON array with this structure:
[
  {
    "name": "Lead Name",
    "company": "Company Name",
    "email": "email@company.com",
    "email_subject": "Personalized subject line",
    "email_body": "Full email body with proper formatting",
    ${abTesting ? '"email_subject_b": "Alternative subject for A/B testing",\n    "email_body_b": "Alternative body for A/B testing",' : ''}
    "personalization_notes": "Key personalization points used"
  }
]

Generate the emails now:`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8000,
      messages: [{
        role: "user",
        content: prompt
      }]
    });

    const responseText = message.content[0].text;

    // Extract JSON from response (handle potential markdown formatting)
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Claude API Error:', error);
    // Fallback to mock on error
    return generateMockEmails(leads, campaign, product, discount, tone, abTesting);
  }
}

// Fallback mock email generation
function generateMockEmails(leads, campaign, product, discount, tone, abTesting) {
  return leads.map(lead => {
    const firstName = lead.name.split(' ')[0];
    const companyText = lead.company ? ` at ${lead.company}` : '';

    const toneVariations = {
      professional: {
        greeting: 'Bonjour',
        closing: 'Cordialement'
      },
      friendly: {
        greeting: 'Salut',
        closing: 'À bientôt'
      },
      concise: {
        greeting: 'Bonjour',
        closing: 'Bien à vous'
      },
      formal: {
        greeting: 'Madame, Monsieur',
        closing: 'Respectueusement'
      }
    };

    const selected = toneVariations[tone] || toneVariations.professional;

    const emailA = {
      name: lead.name,
      company: lead.company,
      email: lead.email,
      email_subject: `${firstName}, profitez de ${discount} de réduction sur ${product}`,
      email_body: `${selected.greeting} ${firstName},

Je me permets de vous contacter concernant une opportunité exclusive pour ${lead.company || 'votre entreprise'}.

Dans le cadre de notre campagne "${campaign}", nous offrons une réduction de ${discount} sur ${product} - une solution qui transforme la productivité des équipes${lead.industry ? ` dans le secteur ${lead.industry}` : ''}.

Pourquoi ${product} ?
• Augmentation de 30% de la productivité
• Intégration transparente avec vos outils existants
• ROI mesurable dès le premier mois

Cette offre est limitée dans le temps. Seriez-vous disponible pour un échange de 15 minutes cette semaine ?

${selected.closing},

Nicolas BAYONNE
Microsoft Account Manager
nicolas.bayonne@microsoft.com`,
      personalization_notes: `Personalized with name, company${lead.industry ? ', industry' : ''}`
    };

    if (abTesting) {
      emailA.email_subject_b = `Opportunité exclusive ${product} pour ${lead.company || firstName}`;
      emailA.email_body_b = `${selected.greeting} ${firstName},

Opportunité spéciale pour ${lead.company || 'votre entreprise'} : ${discount} de réduction sur ${product}.

En tant que leader${lead.industry ? ` du secteur ${lead.industry}` : ''}, vous méritez les meilleurs outils pour propulser votre équipe.

${product} vous permet de :
✓ Automatiser les tâches répétitives
✓ Améliorer la collaboration
✓ Réduire les coûts opérationnels

Cette offre "${campaign}" expire bientôt. Parlons-en cette semaine ?

Je reste à votre disposition.

${selected.closing},

Nicolas BAYONNE
Microsoft Account Manager`;
    }

    return emailA;
  });
}
