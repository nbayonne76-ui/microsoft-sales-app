/**
 * Model Pipeline Testing & Benchmarking
 * Tests the complete AI model pipeline performance and integration
 */

import { QnAMaker } from './components/QnAMaker.js';
import { enhancedNLPAnalyzer } from './lib/enhanced-nlp-analyzer.js';
import { improvedIntentSystem } from './lib/improved-intent-system.js';
import { activeLearningSystem } from './lib/active-learning-system.js';

console.log('🔧 Testing AI Model Pipeline...\n');

// Test scenarios covering different pipeline paths
const testScenarios = [
  {
    id: 1,
    title: "High Confidence LUIS Classification",
    message: "Je veux créer un email pour contacter un nouveau prospect",
    expectedRoute: "LUIS-style",
    expectedIntent: "CREATE_EMAIL",
    expectedConfidence: "> 0.8"
  },
  {
    id: 2,
    title: "Knowledge Base Query",
    message: "Comment migrer vers Azure ?",
    expectedRoute: "QnA Knowledge Base",
    expectedIntent: "KNOWLEDGE_QUESTION",
    expectedConfidence: "> 0.8"
  },
  {
    id: 3,
    title: "Enhanced NLP Processing",
    message: "Problème urgent avec notre infrastructure Teams",
    expectedRoute: "Enhanced NLP",
    expectedIntent: "Various",
    expectedConfidence: "0.6-0.8"
  },
  {
    id: 4,
    title: "Out-of-Domain Detection",
    message: "Météo à Paris demain",
    expectedRoute: "Any (OUT_OF_DOMAIN)",
    expectedIntent: "OUT_OF_DOMAIN",
    expectedConfidence: "> 0.8"
  },
  {
    id: 5,
    title: "Low Confidence - Active Learning",
    message: "Support technique",
    expectedRoute: "Fallback + Learning",
    expectedIntent: "Uncertain",
    expectedConfidence: "< 0.6"
  },
  {
    id: 6,
    title: "Conflicting Predictions Test",
    message: "Migrer données client Azure",
    expectedRoute: "Conflict Detection",
    expectedIntent: "Multiple options",
    expectedConfidence: "Conflicting"
  }
];

console.log('🧪 Running Pipeline Performance Tests...\n');

// Initialize all models
const qnaMaker = new QnAMaker();

let totalTests = 0;
let pipelineResults = [];
let performanceMetrics = {
  totalTime: 0,
  averageTime: 0,
  luisCount: 0,
  qnaCount: 0,
  enhancedNLPCount: 0,
  activeLearningCount: 0
};

for (const scenario of testScenarios) {
  totalTests++;
  console.log(`📋 Test ${scenario.id}: ${scenario.title}`);
  console.log(`   Input: "${scenario.message}"`);
  console.log(`   Expected: ${scenario.expectedRoute} → ${scenario.expectedIntent}`);

  const startTime = Date.now();

  try {
    // Simulate the complete pipeline as in route.js
    console.log('   🔄 Running parallel analysis...');

    // 1. Enhanced NLP Analysis
    const enhancedStartTime = Date.now();
    const enhancedAnalysis = await enhancedNLPAnalyzer.analyzeEnhanced(
      scenario.message,
      'initial',
      {},
      []
    );
    const enhancedTime = Date.now() - enhancedStartTime;

    // 2. LUIS-style Intent Classification
    const luisStartTime = Date.now();
    const luisAnalysis = await improvedIntentSystem.classifyIntent(
      scenario.message,
      { conversationState: 'initial' }
    );
    const luisTime = Date.now() - luisStartTime;

    // 3. QnA Maker with Knowledge Base
    const qnaStartTime = Date.now();
    const qnaAnalysis = qnaMaker.analyzeWithKnowledge(
      scenario.message,
      'initial',
      {}
    );
    const qnaTime = Date.now() - qnaStartTime;

    const analysisTime = Date.now() - startTime;

    // 4. Selection Logic (simulate route.js logic)
    let selectedRoute = 'fallback';
    let selectedResponse = null;
    let selectedConfidence = 0;

    if (luisAnalysis.isConfident && luisAnalysis.topScore > Math.max(enhancedAnalysis.confidence, qnaAnalysis.confidence)) {
      selectedRoute = 'LUIS-style';
      selectedResponse = luisAnalysis;
      selectedConfidence = luisAnalysis.topScore;
      performanceMetrics.luisCount++;
    } else if (enhancedAnalysis.confidence > qnaAnalysis.confidence && enhancedAnalysis.confidence > 0.6) {
      selectedRoute = 'Enhanced NLP';
      selectedResponse = enhancedAnalysis;
      selectedConfidence = enhancedAnalysis.confidence;
      performanceMetrics.enhancedNLPCount++;
    } else if (qnaAnalysis.response && qnaAnalysis.confidence > 0.6) {
      selectedRoute = 'QnA Knowledge Base';
      selectedResponse = qnaAnalysis;
      selectedConfidence = qnaAnalysis.confidence;
      performanceMetrics.qnaCount++;
    }

    // 5. Active Learning Analysis
    const learningStartTime = Date.now();
    const learningAnalysis = activeLearningSystem.analyzeInteraction({
      userMessage: scenario.message,
      intent: selectedResponse?.intent || luisAnalysis.topIntent,
      confidence: selectedConfidence,
      knowledgeResults: qnaAnalysis?.knowledgeResults,
      luisIntent: luisAnalysis?.topIntent,
      qnaIntent: qnaAnalysis?.intent,
      enhancedNLPIntent: enhancedAnalysis?.intent,
      confidences: {
        luis: luisAnalysis?.topScore || 0,
        qna: qnaAnalysis?.confidence || 0,
        enhanced: enhancedAnalysis?.confidence || 0
      },
      sessionId: `test_${scenario.id}`,
      timestamp: new Date()
    });
    const learningTime = Date.now() - learningStartTime;

    if (learningAnalysis.needs_feedback) {
      performanceMetrics.activeLearningCount++;
    }

    const totalTime = Date.now() - startTime;
    performanceMetrics.totalTime += totalTime;

    console.log(`   ⏱️  Performance Breakdown:`);
    console.log(`      Enhanced NLP: ${enhancedTime}ms`);
    console.log(`      LUIS Analysis: ${luisTime}ms`);
    console.log(`      QnA Knowledge: ${qnaTime}ms`);
    console.log(`      Active Learning: ${learningTime}ms`);
    console.log(`      Total Pipeline: ${totalTime}ms`);

    console.log(`   🎯 Results:`);
    console.log(`      Selected Route: ${selectedRoute}`);
    console.log(`      Intent: ${selectedResponse?.intent || luisAnalysis.topIntent || 'Unknown'}`);
    console.log(`      Confidence: ${Math.round(selectedConfidence * 100)}%`);
    console.log(`      Learning Needed: ${learningAnalysis.needs_feedback ? 'Yes' : 'No'}`);

    // Check if results match expectations
    const routeMatches = selectedRoute.includes(scenario.expectedRoute.split(' ')[0]) ||
                        scenario.expectedRoute === 'Any' ||
                        (scenario.expectedRoute === 'Fallback + Learning' && learningAnalysis.needs_feedback);

    const intentMatches = selectedResponse?.intent === scenario.expectedIntent ||
                         luisAnalysis.topIntent === scenario.expectedIntent ||
                         scenario.expectedIntent === 'Various' ||
                         scenario.expectedIntent === 'Uncertain' ||
                         scenario.expectedIntent === 'Multiple options';

    if (routeMatches && intentMatches) {
      console.log(`   ✅ Test PASSED - Results match expectations`);
    } else {
      console.log(`   ❌ Test FAILED - Results don't match expectations`);
    }

    // Store results for analysis
    pipelineResults.push({
      scenario: scenario.id,
      route: selectedRoute,
      intent: selectedResponse?.intent || luisAnalysis.topIntent,
      confidence: selectedConfidence,
      totalTime,
      enhancedTime,
      luisTime,
      qnaTime,
      learningTime,
      needsLearning: learningAnalysis.needs_feedback,
      passed: routeMatches && intentMatches
    });

  } catch (error) {
    console.log(`   ❌ Pipeline Error: ${error.message}`);
    pipelineResults.push({
      scenario: scenario.id,
      error: error.message,
      passed: false
    });
  }

  console.log('\n' + '-'.repeat(70) + '\n');
}

// Calculate performance metrics
performanceMetrics.averageTime = Math.round(performanceMetrics.totalTime / totalTests);
const passedTests = pipelineResults.filter(r => r.passed).length;
const successRate = Math.round((passedTests / totalTests) * 100);

console.log('📊 Pipeline Performance Summary:\n');

console.log('🎯 Accuracy Results:');
console.log(`   ✅ Tests Passed: ${passedTests}/${totalTests} (${successRate}%)`);
console.log(`   🎯 Route Distribution:`);
console.log(`      LUIS-style: ${performanceMetrics.luisCount} times`);
console.log(`      QnA Knowledge: ${performanceMetrics.qnaCount} times`);
console.log(`      Enhanced NLP: ${performanceMetrics.enhancedNLPCount} times`);
console.log(`      Active Learning Triggered: ${performanceMetrics.activeLearningCount} times`);

console.log('\n⚡ Performance Results:');
console.log(`   📈 Total Processing Time: ${performanceMetrics.totalTime}ms`);
console.log(`   📊 Average Time per Request: ${performanceMetrics.averageTime}ms`);
console.log(`   🚀 Throughput Capacity: ~${Math.round(1000/performanceMetrics.averageTime)} requests/second`);

// Detailed breakdown
const avgEnhanced = Math.round(pipelineResults.reduce((sum, r) => sum + (r.enhancedTime || 0), 0) / totalTests);
const avgLuis = Math.round(pipelineResults.reduce((sum, r) => sum + (r.luisTime || 0), 0) / totalTests);
const avgQna = Math.round(pipelineResults.reduce((sum, r) => sum + (r.qnaTime || 0), 0) / totalTests);
const avgLearning = Math.round(pipelineResults.reduce((sum, r) => sum + (r.learningTime || 0), 0) / totalTests);

console.log('\n🔧 Component Performance Breakdown:');
console.log(`   🧠 Enhanced NLP: ${avgEnhanced}ms average`);
console.log(`   🎯 LUIS Classification: ${avgLuis}ms average`);
console.log(`   📚 QnA Knowledge Base: ${avgQna}ms average`);
console.log(`   📖 Active Learning: ${avgLearning}ms average`);

// Pipeline health assessment
console.log('\n💊 Pipeline Health Assessment:');

const healthChecks = [
  { metric: 'Average Response Time', value: performanceMetrics.averageTime, threshold: 200, unit: 'ms' },
  { metric: 'Success Rate', value: successRate, threshold: 80, unit: '%' },
  { metric: 'Active Learning Rate', value: Math.round((performanceMetrics.activeLearningCount/totalTests)*100), threshold: 50, unit: '%', inverted: true }
];

healthChecks.forEach(check => {
  const isHealthy = check.inverted ?
    check.value <= check.threshold :
    check.value >= check.threshold;

  const status = isHealthy ? '✅ HEALTHY' : '⚠️  NEEDS ATTENTION';
  console.log(`   ${status} ${check.metric}: ${check.value}${check.unit} (target: ${check.inverted ? '≤' : '≥'}${check.threshold}${check.unit})`);
});

// Optimization recommendations
console.log('\n💡 Pipeline Optimization Recommendations:');

if (performanceMetrics.averageTime > 100) {
  console.log('⚡ Performance: Consider caching frequent queries or optimizing model inference');
}

if (successRate < 90) {
  console.log('🎯 Accuracy: Review failed test cases and adjust confidence thresholds');
}

if (performanceMetrics.activeLearningCount === 0) {
  console.log('📖 Learning: Lower confidence thresholds to capture more learning opportunities');
} else if (performanceMetrics.activeLearningCount > totalTests * 0.5) {
  console.log('📖 Learning: Raise confidence thresholds to reduce excessive feedback requests');
}

console.log('\n🏆 Production Readiness Assessment:');

const readinessScore = (
  (successRate >= 85 ? 25 : 0) +                                    // Accuracy
  (performanceMetrics.averageTime <= 150 ? 25 : 0) +               // Performance
  (performanceMetrics.activeLearningCount > 0 ? 25 : 0) +          // Learning capability
  (pipelineResults.every(r => !r.error) ? 25 : 0)                  // Reliability
);

console.log(`📊 Overall Readiness Score: ${readinessScore}/100`);

if (readinessScore >= 90) {
  console.log('🎉 EXCELLENT - Pipeline is production-ready with optimal performance');
} else if (readinessScore >= 70) {
  console.log('✅ GOOD - Pipeline is production-ready with minor optimizations needed');
} else if (readinessScore >= 50) {
  console.log('⚠️  FAIR - Pipeline needs improvement before production deployment');
} else {
  console.log('❌ POOR - Significant issues need to be addressed');
}

console.log('\n🚀 Model Pipeline Testing Complete!');
console.log(`The AI system demonstrates ${successRate}% accuracy with ${performanceMetrics.averageTime}ms average response time.`);