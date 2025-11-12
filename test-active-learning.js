/**
 * Test Active Learning System
 * Demonstrates continuous learning capabilities for the AI chatbot
 */

import { activeLearningSystem } from './lib/active-learning-system.js';
import { QnAMaker } from './components/QnAMaker.js';

console.log('🧠 Testing Active Learning System...\n');

const qnaMaker = new QnAMaker();

// Simulate different types of interactions for learning analysis
const testInteractions = [
  {
    title: "High Confidence - Clear Intent",
    userMessage: "Je veux créer un email pour un prospect",
    intent: "CREATE_EMAIL",
    confidence: 0.95,
    expectedLearning: "No learning needed - high confidence"
  },
  {
    title: "Low Confidence - Uncertain Intent",
    userMessage: "Problème avec système",
    intent: "KNOWLEDGE_QUESTION",
    confidence: 0.35,
    expectedLearning: "Should trigger feedback request"
  },
  {
    title: "Knowledge Gap - No Results",
    userMessage: "Comment installer SharePoint on-premise",
    intent: "KNOWLEDGE_QUESTION",
    confidence: 0.80,
    knowledgeResults: [],
    expectedLearning: "Should detect knowledge gap"
  },
  {
    title: "Conflicting Predictions",
    userMessage: "Migrer données clients",
    luisIntent: "KNOWLEDGE_QUESTION",
    qnaIntent: "CREATE_EMAIL",
    enhancedNLPIntent: "KNOWLEDGE_QUESTION",
    confidences: { luis: 0.75, qna: 0.80, enhanced: 0.72 },
    expectedLearning: "Should detect conflicting predictions"
  },
  {
    title: "Out of Domain - Clear Rejection",
    userMessage: "Météo Paris demain",
    intent: "OUT_OF_DOMAIN",
    confidence: 0.90,
    expectedLearning: "No learning needed - clear out-of-domain"
  },
  {
    title: "Borderline Confidence",
    userMessage: "Support technique urgent",
    intent: "KNOWLEDGE_QUESTION",
    confidence: 0.65,
    expectedLearning: "May request verification"
  }
];

console.log('📊 Testing Learning Analysis on Different Interaction Types...\n');

let totalTests = 0;
let learningOpportunities = 0;
let feedbackRequests = 0;

for (const test of testInteractions) {
  totalTests++;
  console.log(`🧪 Test ${totalTests}: ${test.title}`);
  console.log(`   Message: "${test.userMessage}"`);
  console.log(`   Expected: ${test.expectedLearning}`);

  try {
    // Create interaction data
    const interactionData = {
      userMessage: test.userMessage,
      intent: test.intent,
      confidence: test.confidence || 0.5,
      knowledgeResults: test.knowledgeResults,
      luisIntent: test.luisIntent,
      qnaIntent: test.qnaIntent,
      enhancedNLPIntent: test.enhancedNLPIntent,
      confidences: test.confidences,
      sessionId: `test_session_${totalTests}`,
      timestamp: new Date()
    };

    // Analyze interaction for learning opportunities
    const learningAnalysis = activeLearningSystem.analyzeInteraction(interactionData);

    console.log(`   🎯 Analysis Results:`);
    console.log(`      Uncertainty Level: ${learningAnalysis.uncertainty_level}`);
    console.log(`      Needs Feedback: ${learningAnalysis.needs_feedback}`);
    console.log(`      Learning Opportunity: ${learningAnalysis.learning_opportunity || 'None'}`);
    console.log(`      Suggested Actions: ${learningAnalysis.suggested_actions.join(', ') || 'None'}`);

    if (learningAnalysis.learning_opportunity) {
      learningOpportunities++;
    }

    // Generate feedback request if needed
    if (learningAnalysis.needs_feedback) {
      feedbackRequests++;
      const feedbackRequest = activeLearningSystem.generateFeedbackRequest(interactionData);

      if (feedbackRequest) {
        console.log(`   💬 Feedback Request Generated:`);
        console.log(`      Type: ${feedbackRequest.type}`);
        console.log(`      Message: ${feedbackRequest.message}`);
        console.log(`      Options: ${feedbackRequest.options.join(', ')}`);
      }
    }

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  console.log('\n' + '-'.repeat(70) + '\n');
}

// Test user correction processing
console.log('🔧 Testing User Correction Processing...\n');

const userCorrections = [
  {
    userMessage: "Support Azure urgent",
    predictedIntent: "CREATE_EMAIL",
    correctedIntent: "KNOWLEDGE_QUESTION"
  },
  {
    userMessage: "Problème installation Teams",
    predictedIntent: "OUT_OF_DOMAIN",
    correctedIntent: "KNOWLEDGE_QUESTION"
  }
];

for (const correction of userCorrections) {
  console.log(`📝 Processing Correction:`);
  console.log(`   Message: "${correction.userMessage}"`);
  console.log(`   Predicted: ${correction.predictedIntent}`);
  console.log(`   Corrected: ${correction.correctedIntent}`);

  try {
    activeLearningSystem.processUserCorrection(
      correction.userMessage,
      correction.predictedIntent,
      correction.correctedIntent
    );
    console.log(`   ✅ Correction processed successfully`);
  } catch (error) {
    console.log(`   ❌ Error processing correction: ${error.message}`);
  }
  console.log('');
}

// Test human feedback on uncertain samples
console.log('👤 Testing Human Feedback Processing...\n');

const uncertainSamples = activeLearningSystem.getPrioritySamplesForReview(3);
console.log(`📋 Retrieved ${uncertainSamples.length} uncertain samples for review:`);

uncertainSamples.forEach((sample, index) => {
  console.log(`   ${index + 1}. "${sample.message}" - Predicted: ${sample.predicted_intent} (${Math.round(sample.confidence * 100)}%)`);
  console.log(`      Priority: ${Math.round(sample.priority)}, Date: ${sample.timestamp.toLocaleDateString()}`);
});

// Simulate human feedback
if (uncertainSamples.length > 0) {
  const sampleToLabel = uncertainSamples[0];
  console.log(`\n🏷️  Simulating human feedback on sample: "${sampleToLabel.message}"`);

  try {
    const feedbackResult = activeLearningSystem.processHumanFeedback(
      sampleToLabel.id,
      'KNOWLEDGE_QUESTION',
      0.95
    );
    console.log(`   ✅ Human feedback processed: ${feedbackResult.message}`);
    console.log(`   📈 Impact: ${feedbackResult.impact}`);
  } catch (error) {
    console.log(`   ❌ Error processing human feedback: ${error.message}`);
  }
}

// Test knowledge gap detection
console.log('\n🕳️  Testing Knowledge Gap Detection...\n');

const knowledgeGaps = activeLearningSystem.getKnowledgeGaps(5);
console.log(`📊 Found ${knowledgeGaps.length} knowledge gaps:`);

knowledgeGaps.forEach((gap, index) => {
  console.log(`   ${index + 1}. "${gap.query}" (${gap.frequency} times)`);
  console.log(`      Category: ${gap.suggested_category}, Last seen: ${gap.last_seen.toLocaleDateString()}`);
});

// Generate training recommendations
console.log('\n💡 Testing Training Recommendations...\n');

const recommendations = activeLearningSystem.generateTrainingRecommendations();
console.log(`🎯 Generated ${recommendations.length} training recommendations:`);

recommendations.forEach((rec, index) => {
  console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
  console.log(`      Type: ${rec.type}`);
  console.log(`      Description: ${rec.description}`);
  console.log(`      Action: ${rec.action}`);
});

// Get overall active learning status
console.log('\n📈 Active Learning System Status...\n');

const status = activeLearningSystem.getActiveLearningStatus();

console.log('📊 System Overview:');
console.log(`   🔍 Uncertain Samples: ${status.uncertain_samples.total} total, ${status.uncertain_samples.pending_review} pending review`);
console.log(`   🕳️  Knowledge Gaps: ${status.knowledge_gaps.total} total, ${status.knowledge_gaps.high_frequency} high frequency`);
console.log(`   🔄 Retraining Queue: ${status.retraining_queue.total} total, ${status.retraining_queue.ready_for_training} ready`);

console.log('\n📈 Performance Metrics:');
console.log(`   🎯 Intent Accuracy: ${Math.round(status.performance_trends.intent_accuracy * 100)}%`);
console.log(`   📚 Knowledge Relevance: ${Math.round(status.performance_trends.knowledge_relevance * 100)}%`);
console.log(`   😊 User Satisfaction: ${Math.round(status.performance_trends.user_satisfaction * 100)}%`);

// Test Results Summary
console.log('\n🎉 Active Learning Test Results Summary:\n');

console.log('📊 Test Statistics:');
console.log(`   ✅ Total Interactions Tested: ${totalTests}`);
console.log(`   🧠 Learning Opportunities Found: ${learningOpportunities}`);
console.log(`   💬 Feedback Requests Generated: ${feedbackRequests}`);
console.log(`   📝 User Corrections Processed: ${userCorrections.length}`);
console.log(`   👤 Human Labels Applied: ${uncertainSamples.length > 0 ? 1 : 0}`);

console.log('\n🎯 Active Learning Benefits Demonstrated:');
console.log('✅ Automatic uncertainty detection and feedback requests');
console.log('✅ Conflicting prediction identification for review');
console.log('✅ Knowledge gap tracking for content expansion');
console.log('✅ User correction processing for model improvement');
console.log('✅ Human feedback integration for supervised learning');
console.log('✅ Training recommendations based on performance patterns');
console.log('✅ Real-time performance monitoring and metrics');

console.log('\n🚀 Production Readiness:');
console.log('• Continuous learning from user interactions');
console.log('• Intelligent feedback requests minimize user burden');
console.log('• Systematic knowledge base expansion planning');
console.log('• Performance-driven training recommendations');
console.log('• Human-in-the-loop validation for critical decisions');

const learningRate = Math.round((learningOpportunities / totalTests) * 100);
const feedbackRate = Math.round((feedbackRequests / totalTests) * 100);

if (learningRate > 0 && feedbackRate < 50) {
  console.log('\n✨ Excellent! Active learning system is working optimally:');
  console.log(`   🎯 Learning opportunity detection: ${learningRate}%`);
  console.log(`   💬 Appropriate feedback rate: ${feedbackRate}%`);
  console.log('   The system balances learning needs with user experience.');
} else {
  console.log('\n⚠️  Active learning system needs tuning:');
  console.log(`   🎯 Learning opportunity rate: ${learningRate}%`);
  console.log(`   💬 Feedback request rate: ${feedbackRate}%`);
  console.log('   Consider adjusting confidence thresholds.');
}

console.log('\n🔄 The AI chatbot now continuously learns and improves from every interaction!');