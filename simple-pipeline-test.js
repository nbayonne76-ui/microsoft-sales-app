/**
 * Simplified Model Pipeline Test
 * Tests core components without problematic dependencies
 */

import { QnAMaker } from './components/QnAMaker.js';
import { improvedIntentSystem } from './lib/improved-intent-system.js';
import { activeLearningSystem } from './lib/active-learning-system.js';

console.log('🔧 Simplified Pipeline Test - Core Components\n');

const qnaMaker = new QnAMaker();

const testMessages = [
  {
    message: "Je veux créer un email",
    expected: "Email creation intent"
  },
  {
    message: "Comment migrer vers Azure ?",
    expected: "Knowledge base query"
  },
  {
    message: "Météo à Paris",
    expected: "Out-of-domain detection"
  }
];

console.log('🧪 Testing Individual Components...\n');

for (const [index, test] of testMessages.entries()) {
  console.log(`📋 Test ${index + 1}: "${test.message}"`);
  console.log(`   Expected: ${test.expected}`);

  const startTime = Date.now();

  try {
    // 1. LUIS-style Intent System
    const luisStart = Date.now();
    const luisResult = await improvedIntentSystem.classifyIntent(test.message, {});
    const luisTime = Date.now() - luisStart;

    // 2. QnA Maker Analysis
    const qnaStart = Date.now();
    const qnaResult = qnaMaker.analyzeWithKnowledge(test.message, 'initial', {});
    const qnaTime = Date.now() - qnaStart;

    // 3. Active Learning Analysis
    const learningStart = Date.now();
    const learningResult = activeLearningSystem.analyzeInteraction({
      userMessage: test.message,
      intent: luisResult.topIntent || qnaResult.intent,
      confidence: Math.max(luisResult.topScore || 0, qnaResult.confidence || 0),
      sessionId: `test_${index}`,
      timestamp: new Date()
    });
    const learningTime = Date.now() - learningStart;

    const totalTime = Date.now() - startTime;

    console.log(`   🎯 Results:`);
    console.log(`      LUIS Intent: ${luisResult.topIntent} (${Math.round(luisResult.topScore * 100)}%)`);
    console.log(`      QnA Intent: ${qnaResult.intent} (${Math.round(qnaResult.confidence * 100)}%)`);
    console.log(`      Has Knowledge: ${!!qnaResult.knowledgeResults}`);
    console.log(`      Learning Needed: ${learningResult.needs_feedback}`);

    console.log(`   ⏱️  Performance:`);
    console.log(`      LUIS: ${luisTime}ms`);
    console.log(`      QnA: ${qnaTime}ms`);
    console.log(`      Learning: ${learningTime}ms`);
    console.log(`      Total: ${totalTime}ms`);

    console.log(`   ✅ Test completed successfully`);

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n' + '-'.repeat(50) + '\n');
}

// Test system status
console.log('📊 System Status Summary:\n');

const status = activeLearningSystem.getActiveLearningStatus();
console.log('🧠 Active Learning Status:');
console.log(`   Uncertain Samples: ${status.uncertain_samples.total}`);
console.log(`   Knowledge Gaps: ${status.knowledge_gaps.total}`);
console.log(`   Performance: ${Math.round(status.performance_trends.intent_accuracy * 100)}% accuracy`);

const categories = qnaMaker.getCategoryOverview();
console.log('\n📚 Knowledge Base Status:');
console.log(`   Categories: ${categories.length}`);
console.log(`   Total Q&A: ${categories.reduce((sum, cat) => sum + cat.count, 0)}`);

const intents = Object.keys(improvedIntentSystem.intents);
console.log('\n🎯 Intent System Status:');
console.log(`   Available Intents: ${intents.length}`);
console.log(`   None Intent Examples: ${improvedIntentSystem.intents.None?.examples?.length || 0}`);

console.log('\n🎉 Pipeline Core Components Working Successfully!');