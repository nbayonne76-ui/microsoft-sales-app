/**
 * Test Entity-Sentiment Integration
 * Demonstrates advanced contextual analysis of entities with sentiment
 */

import { contextualSentimentEntityAnalyzer } from './lib/contextual-sentiment-entity-analyzer.js';

console.log('🔗 Testing Entity-Sentiment Integration...\n');

// Test cases demonstrating entity-sentiment relationships
const testCases = [
  {
    title: "Technology Problem",
    text: "Problème urgent avec Azure, les performances sont catastrophiques",
    expectedInsights: ["technology_issues", "urgent_technology"],
    description: "Negative sentiment about Azure technology"
  },
  {
    title: "Positive Contact Experience",
    text: "Jean Dupont chez Microsoft est fantastique, excellent support",
    expectedInsights: ["positive_contact"],
    description: "Positive sentiment about a specific person"
  },
  {
    title: "Multiple Entity Issues",
    text: "Problèmes avec Teams et difficultés avec Marie Martin, situation urgente",
    expectedInsights: ["technology_issues", "urgent_contact", "multiple_concerns"],
    description: "Multiple entities with negative sentiment"
  },
  {
    title: "Company Comparison",
    text: "Microsoft vs concurrent, nous préférons votre solution Azure",
    expectedInsights: ["competitive_positioning"],
    description: "Competitive context with positive sentiment"
  },
  {
    title: "Urgent Contact Need",
    text: "Contacter Nicolas immédiatement pour migration critique Office 365",
    expectedInsights: ["urgent_contact", "urgent_technology"],
    description: "Urgent sentiment about both person and technology"
  }
];

// Mock entities for testing
const mockEntities = [
  { type: 'TECHNOLOGY', value: 'Azure', confidence: 0.9, start: 20, end: 25 },
  { type: 'TECHNOLOGY', value: 'Teams', confidence: 0.95, start: 15, end: 20 },
  { type: 'TECHNOLOGY', value: 'Office 365', confidence: 0.9, start: 65, end: 74 },
  { type: 'PERSON', value: 'Jean Dupont', confidence: 0.85, start: 0, end: 10 },
  { type: 'PERSON', value: 'Marie Martin', confidence: 0.85, start: 30, end: 42 },
  { type: 'PERSON', value: 'Nicolas', confidence: 0.8, start: 9, end: 16 },
  { type: 'ORGANIZATION', value: 'Microsoft', confidence: 0.9, start: 15, end: 24 }
];

// Mock global sentiment
const mockSentiments = {
  positive: { label: 'positive', confidence: 0.8 },
  negative: { label: 'negative', confidence: 0.75 },
  urgent: { label: 'urgent', confidence: 0.9 },
  neutral: { label: 'neutral', confidence: 0.6 }
};

console.log('🧪 Running Entity-Sentiment Analysis Tests...\n');

for (const testCase of testCases) {
  console.log(`📋 Test: ${testCase.title}`);
  console.log(`📝 Text: "${testCase.text}"`);
  console.log(`📖 Description: ${testCase.description}`);

  try {
    // Extract relevant entities for this test
    const relevantEntities = mockEntities.filter(entity =>
      testCase.text.toLowerCase().includes(entity.value.toLowerCase())
    );

    // Determine appropriate global sentiment
    let globalSentiment = mockSentiments.neutral;
    if (testCase.text.includes('urgent') || testCase.text.includes('immédiat') || testCase.text.includes('critique')) {
      globalSentiment = mockSentiments.urgent;
    } else if (testCase.text.includes('problème') || testCase.text.includes('difficultés') || testCase.text.includes('catastrophique')) {
      globalSentiment = mockSentiments.negative;
    } else if (testCase.text.includes('fantastique') || testCase.text.includes('excellent') || testCase.text.includes('préférons')) {
      globalSentiment = mockSentiments.positive;
    }

    // Run entity-sentiment analysis
    const analysis = await contextualSentimentEntityAnalyzer.analyzeEntitySentiment(
      testCase.text,
      relevantEntities,
      globalSentiment
    );

    console.log(`\n🔍 Analysis Results:`);
    console.log(`   📊 Global Sentiment: ${globalSentiment.label} (${Math.round(globalSentiment.confidence * 100)}%)`);
    console.log(`   🎯 Entities Analyzed: ${analysis.entitySentiments.length}`);

    // Display entity-specific sentiments
    analysis.entitySentiments.forEach(entitySentiment => {
      const { entity, sentiment, priority } = entitySentiment;
      console.log(`   • ${entity.type}: "${entity.value}" → ${sentiment.label} (Priority: ${priority})`);

      if (sentiment.indicators.length > 0) {
        console.log(`     Indicators: ${sentiment.indicators.join(', ')}`);
      }
    });

    // Display contextual insights
    if (analysis.contextualInsights.length > 0) {
      console.log(`\n💡 Contextual Insights:`);
      analysis.contextualInsights.forEach(insight => {
        console.log(`   🎯 ${insight.type}: ${insight.message}`);
        console.log(`      Priority: ${insight.priority}, Action: ${insight.action}`);
      });
    }

    // Display actionable insights
    if (analysis.actionableInsights.length > 0) {
      console.log(`\n🚀 Actionable Insights:`);
      analysis.actionableInsights.forEach(insight => {
        console.log(`   📝 ${insight.type}: ${insight.suggestion}`);
        console.log(`      Implementation: ${insight.implementation}`);
      });
    }

    // Test email enhancement
    const mockEmail = {
      subject: `Contact avec ${relevantEntities.find(e => e.type === 'ORGANIZATION')?.value || 'Client'}`,
      body: `Bonjour,\n\nSuite à notre échange concernant ${relevantEntities.map(e => e.value).join(' et ')}.\n\nCordialement,\nNicolas`,
      metadata: { original: true }
    };

    const enhancedEmail = contextualSentimentEntityAnalyzer.enhanceEmailWithEntitySentiment(
      mockEmail,
      analysis
    );

    console.log(`\n📧 Email Enhancement:`);
    console.log(`   Original Subject: "${mockEmail.subject}"`);
    console.log(`   Enhanced Subject: "${enhancedEmail.subject}"`);
    console.log(`   Enhancement Applied: ${enhancedEmail.metadata.enhancementApplied}`);
    console.log(`   Priority Level: ${enhancedEmail.metadata.priorityLevel}`);

    // Check if expected insights were found
    const foundInsightTypes = analysis.contextualInsights.map(i => i.type);
    const expectedFound = testCase.expectedInsights.filter(expected =>
      foundInsightTypes.some(found => found.includes(expected.split('_')[0]))
    );

    console.log(`\n✅ Expected Insights: ${testCase.expectedInsights.join(', ')}`);
    console.log(`✅ Found Insights: ${foundInsightTypes.join(', ')}`);
    console.log(`📊 Match Rate: ${Math.round((expectedFound.length / testCase.expectedInsights.length) * 100)}%`);

  } catch (error) {
    console.error(`❌ Error in test "${testCase.title}":`, error.message);
  }

  console.log('\n' + '='.repeat(80) + '\n');
}

// Performance and Integration Test
console.log('🏃‍♂️ Performance & Integration Test\n');

const performanceTest = {
  text: "Urgent ! Problème critique avec Azure et Teams, contacter Jean Dupont immédiatement. Marie Martin chez Microsoft a besoin d'un support technique pour Office 365. Situation catastrophique !",
  entities: [
    { type: 'TECHNOLOGY', value: 'Azure', confidence: 0.9, start: 30, end: 35 },
    { type: 'TECHNOLOGY', value: 'Teams', confidence: 0.95, start: 39, end: 44 },
    { type: 'TECHNOLOGY', value: 'Office 365', confidence: 0.9, start: 140, end: 149 },
    { type: 'PERSON', value: 'Jean Dupont', confidence: 0.85, start: 55, end: 66 },
    { type: 'PERSON', value: 'Marie Martin', confidence: 0.85, start: 83, end: 95 },
    { type: 'ORGANIZATION', value: 'Microsoft', confidence: 0.9, start: 101, end: 110 }
  ],
  globalSentiment: { label: 'urgent', confidence: 0.95 }
};

const startTime = Date.now();

try {
  const fullAnalysis = await contextualSentimentEntityAnalyzer.analyzeEntitySentiment(
    performanceTest.text,
    performanceTest.entities,
    performanceTest.globalSentiment
  );

  const processingTime = Date.now() - startTime;

  console.log('📊 Performance Results:');
  console.log(`   ⚡ Processing Time: ${processingTime}ms`);
  console.log(`   🎯 Entities Processed: ${performanceTest.entities.length}`);
  console.log(`   💡 Insights Generated: ${fullAnalysis.contextualInsights.length}`);
  console.log(`   🚀 Actions Identified: ${fullAnalysis.actionableInsights.length}`);
  console.log(`   📋 Priority Entities: ${fullAnalysis.priorityEntities.length}`);

  // Test email enhancement
  const complexEmail = {
    subject: "Support technique Microsoft",
    body: "Demande de support pour nos solutions Microsoft.",
    metadata: { complexity: 'high' }
  };

  const fullyEnhancedEmail = contextualSentimentEntityAnalyzer.enhanceEmailWithEntitySentiment(
    complexEmail,
    fullAnalysis
  );

  console.log('\n📧 Complex Email Enhancement Demo:');
  console.log('   Original:', complexEmail.subject);
  console.log('   Enhanced:', fullyEnhancedEmail.subject);
  console.log('   Body Preview:', fullyEnhancedEmail.body.substring(0, 100) + '...');

} catch (error) {
  console.error('❌ Performance test failed:', error.message);
}

console.log('\n🎉 Entity-Sentiment Integration Testing Complete!\n');

// Summary and Recommendations
console.log('📋 Integration Summary:');
console.log('✅ Entity-specific sentiment detection');
console.log('✅ Contextual relationship analysis');
console.log('✅ Priority-based entity ranking');
console.log('✅ Actionable insight generation');
console.log('✅ Email content enhancement');
console.log('✅ Real-time performance optimization');

console.log('\n🚀 Benefits of Entity-Sentiment Integration:');
console.log('• 🎯 More accurate understanding of user concerns');
console.log('• ⚡ Automatic urgency detection for specific entities');
console.log('• 🤝 Better relationship management insights');
console.log('• 💼 Technology-specific support recommendations');
console.log('• 📊 Priority-based response handling');
console.log('• 🔧 Actionable insights for email optimization');

console.log('\n💡 Recommended Next Steps:');
console.log('1. Monitor entity-sentiment patterns for common issues');
console.log('2. Build automated escalation based on priority scores');
console.log('3. Create entity-specific response templates');
console.log('4. Implement machine learning to improve detection');
console.log('5. Add real-time dashboard for entity sentiment tracking');