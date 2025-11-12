/**
 * Test AI Response Analysis
 * Demonstrates the AI analyzing email responses
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Example email responses to analyze
const testResponses = [
  {
    company: "TechManufacturing SA",
    role: "DSI",
    industry: "Manufacturing",
    responseText: `Bonjour Nicolas,

Merci pour votre message. Le sujet de la migration cloud est effectivement d'actualité chez nous.

Nous avons actuellement des problèmes de coûts avec notre datacenter actuel et cherchons des alternatives. Le chiffre de 40% de réduction que vous mentionnez est intéressant.

Pouvez-vous m'envoyer plus d'informations sur:
- Les cas clients dans l'industrie manufacturière
- Une estimation budgétaire pour une entreprise de 250 employés
- Les délais de migration

Je serais disponible pour un call rapide la semaine du 18 novembre.

Cordialement,
Jean Dupont
DSI - TechManufacturing SA`,
    expected: {
      sentiment: "positive",
      intent: "request_info",
      buyingSignals: true
    }
  },
  {
    company: "RetailCorp",
    role: "CEO",
    industry: "Retail",
    responseText: `Bonjour,

Merci pour votre proposition concernant Dynamics 365.

Nous venons justement de signer avec SAP il y a 3 mois pour notre ERP. Ce n'est donc pas le bon timing pour nous.

Peut-être dans 2-3 ans lors du renouvellement.

Cordialement,
Marie Martin`,
    expected: {
      sentiment: "negative",
      intent: "not_interested",
      competitorMention: "SAP"
    }
  },
  {
    company: "FinanceServices SAS",
    role: "CFO",
    industry: "Financial Services",
    responseText: `Nicolas,

Intéressé par votre proposition sur Microsoft 365.

Nous avons actuellement Google Workspace mais les fonctionnalités de sécurité et compliance de M365 nous intéressent beaucoup, notamment pour la conformité RGPD.

Budget disponible: environ 30K€/an
Timeline: Q1 2025

Proposez-moi 2-3 créneaux pour une démo cette semaine.

Merci,
Pierre Durand
CFO`,
    expected: {
      sentiment: "positive",
      intent: "book_meeting",
      urgency: "high"
    }
  }
];

async function main() {
  console.log('🧠 Testing AI Response Analysis\n');
  console.log('⚠️  Make sure OPENAI_API_KEY is set in your .env file\n');

  for (let i = 0; i < testResponses.length; i++) {
    const test = testResponses[i];
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Test ${i + 1}: ${test.company}`);
    console.log(`${'='.repeat(80)}\n`);

    // Create a test lead if it doesn't exist
    let lead = await prisma.hotLead.findFirst({
      where: { companyName: test.company }
    });

    if (!lead) {
      lead = await prisma.hotLead.create({
        data: {
          companyName: test.company,
          industry: test.industry,
          managers: {
            create: {
              name: 'Test Contact',
              role: test.role
            }
          }
        }
      });
      console.log(`✅ Created test lead: ${test.company}`);
    }

    // Create email tracking record
    const tracking = await prisma.emailTracking.create({
      data: {
        emailId: `test_${Date.now()}_${i}`,
        leadId: lead.id,
        subject: 'Test Email Subject',
        sentTo: 'test@example.com',
        sentAt: new Date()
      }
    });

    console.log(`📧 Created email tracking: ${tracking.emailId}`);

    // Import the analyzer
    const { analyzeEmailResponse, calculateEngagementScore } = require('../lib/ai/response-analyzer.js');

    // Analyze the response
    console.log('\n🤖 Analyzing with GPT-4...\n');

    const result = await analyzeEmailResponse(test.responseText, {
      leadCompany: test.company,
      leadRole: test.role,
      industry: test.industry,
      sentEmail: {
        subject: 'Test Email Subject'
      }
    });

    if (!result.success) {
      console.error(`❌ Analysis failed: ${result.error}`);
      continue;
    }

    const analysis = result.analysis;

    console.log('📊 Analysis Results:');
    console.log(`   Sentiment: ${analysis.sentiment} (${(analysis.sentimentScore * 100).toFixed(0)}/100)`);
    console.log(`   Intent: ${analysis.primaryIntent}`);
    console.log(`   Urgency: ${analysis.urgencyLevel}`);
    console.log(`   Response Type: ${analysis.responseType}`);

    if (analysis.buyingSignals && analysis.buyingSignals.length > 0) {
      console.log(`   🎯 Buying Signals: ${analysis.buyingSignals.join(', ')}`);
    }

    if (analysis.objections && analysis.objections.length > 0) {
      console.log(`   ⚠️  Objections: ${analysis.objections.join(', ')}`);
    }

    if (analysis.competitorsMentioned && analysis.competitorsMentioned.length > 0) {
      console.log(`   🏢 Competitors: ${analysis.competitorsMentioned.join(', ')}`);
    }

    console.log(`\n💡 AI Summary: ${analysis.aiSummary}`);
    console.log(`\n🎬 Suggested Next Step: ${analysis.suggestedNextStep}`);

    if (analysis.suggestedResponse) {
      console.log(`\n📝 Suggested Response:\n${analysis.suggestedResponse.substring(0, 200)}...`);
    }

    // Calculate engagement score
    const engagementScore = calculateEngagementScore({
      opened: true,
      openCount: 2,
      clicked: true,
      clickCount: 1,
      replied: true,
      sentiment: analysis.sentiment,
      intentDetected: analysis.primaryIntent
    });

    console.log(`\n⭐ Engagement Score: ${engagementScore}/100`);

    // Update tracking with analysis
    await prisma.emailTracking.update({
      where: { id: tracking.id },
      data: {
        responseText: test.responseText,
        replied: true,
        repliedAt: new Date(),
        sentimentScore: analysis.sentimentScore,
        sentiment: analysis.sentiment,
        intentDetected: analysis.primaryIntent,
        aiSummary: analysis.aiSummary,
        extractedSignals: {
          buyingSignals: analysis.buyingSignals || [],
          objections: analysis.objections || [],
          competitors: analysis.competitorsMentioned || []
        },
        engagementScore
      }
    });

    // Create ResponseIntelligence record
    await prisma.responseIntelligence.create({
      data: {
        emailTrackingId: tracking.id,
        responseType: analysis.responseType,
        primaryIntent: analysis.primaryIntent,
        responseText: test.responseText,
        keyPhrases: analysis.keyPhrases || [],
        mentionedCompetitors: analysis.competitorsMentioned || [],
        mentionedBudget: analysis.budgetMentioned || false,
        mentionedTimeline: analysis.timelineMentioned,
        sentiment: analysis.sentiment,
        sentimentScore: analysis.sentimentScore,
        urgencyLevel: analysis.urgencyLevel,
        suggestedResponse: analysis.suggestedResponse,
        suggestedNextStep: analysis.suggestedNextStep,
        industryPattern: test.industry,
        rolePattern: test.role
      }
    });

    console.log('\n✅ Analysis saved to database');
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log('\n🎉 All tests completed!');
  console.log('\n📊 View results at: http://localhost:3003/ai-insights');
  console.log(`${'='.repeat(80)}\n`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
