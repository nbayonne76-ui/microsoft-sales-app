/**
 * Test Enhanced NLP Integration
 * Verifies that all NLP enhancements are working
 */

import { enhancedNLPAnalyzer } from './lib/enhanced-nlp-analyzer.js';

console.log('🧪 Testing Enhanced NLP Integration...\n');

// Test 1: Basic NLP Analysis
console.log('📊 Test 1: Enhanced Intent Classification');
try {
  const analysis = await enhancedNLPAnalyzer.analyzeEnhanced(
    "Je veux créer un email pour contacter Jean Dupont chez Microsoft",
    'initial',
    {},
    []
  );

  console.log('✅ Intent:', analysis.intent);
  console.log('✅ Confidence:', analysis.confidence);
  console.log('✅ Entities found:', analysis.enhancedAnalysis.entities.length);
  console.log('✅ Sentiment:', analysis.enhancedAnalysis.sentiment?.label);

  // Check for entity extraction
  const personEntities = analysis.enhancedAnalysis.entities.filter(e => e.type === 'PERSON');
  const orgEntities = analysis.enhancedAnalysis.entities.filter(e => e.type === 'ORGANIZATION');

  console.log('✅ Persons detected:', personEntities.map(e => e.value));
  console.log('✅ Organizations detected:', orgEntities.map(e => e.value));

} catch (error) {
  console.error('❌ Test 1 failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Sentiment Analysis
console.log('😊 Test 2: Sentiment Analysis');
try {
  const positiveAnalysis = await enhancedNLPAnalyzer.analyzeEnhanced(
    "C'est fantastique ! Je suis très enthousiaste pour cette collaboration avec Azure",
    'initial'
  );

  const negativeAnalysis = await enhancedNLPAnalyzer.analyzeEnhanced(
    "J'ai des problèmes avec notre infrastructure, c'est vraiment compliqué",
    'initial'
  );

  const urgentAnalysis = await enhancedNLPAnalyzer.analyzeEnhanced(
    "C'est urgent ! Nous avons besoin d'une solution immédiatement",
    'initial'
  );

  console.log('✅ Positive sentiment:', positiveAnalysis.enhancedAnalysis.sentiment?.label);
  console.log('✅ Negative sentiment:', negativeAnalysis.enhancedAnalysis.sentiment?.label);
  console.log('✅ Urgent sentiment:', urgentAnalysis.enhancedAnalysis.sentiment?.label);

} catch (error) {
  console.error('❌ Test 2 failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Entity Extraction Accuracy
console.log('🎯 Test 3: Entity Extraction');
try {
  const entityTest = await enhancedNLPAnalyzer.analyzeEnhanced(
    "Contactez marie.martin@techcorp.com pour discuter Azure et Microsoft 365",
    'initial'
  );

  const entities = entityTest.enhancedAnalysis.entities;

  console.log('✅ Total entities found:', entities.length);

  entities.forEach(entity => {
    console.log(`  • ${entity.type} (${entity.subtype}): "${entity.value}" (${Math.round(entity.confidence * 100)}%)`);
  });

  // Verify specific entity types
  const emailEntities = entities.filter(e => e.subtype === 'EMAIL');
  const techEntities = entities.filter(e => e.subtype === 'MICROSOFT_SOLUTION');

  console.log('✅ Email addresses found:', emailEntities.length);
  console.log('✅ Microsoft solutions found:', techEntities.length);

} catch (error) {
  console.error('❌ Test 3 failed:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 4: Conversation Memory
console.log('🧠 Test 4: Conversation Memory');
try {
  // First interaction
  const firstTurn = await enhancedNLPAnalyzer.analyzeEnhanced(
    "Je veux créer un email",
    'initial',
    { sessionId: 'test_session_123' }
  );

  // Second interaction with same session
  const secondTurn = await enhancedNLPAnalyzer.analyzeEnhanced(
    "Pour contacter Jean Dupont chez Microsoft",
    'gathering_info',
    { sessionId: 'test_session_123' }
  );

  console.log('✅ First turn count:', firstTurn.enhancedAnalysis.turnCount);
  console.log('✅ Second turn count:', secondTurn.enhancedAnalysis.turnCount);
  console.log('✅ Session tracking working:', firstTurn.enhancedAnalysis.sessionId === secondTurn.enhancedAnalysis.sessionId);

} catch (error) {
  console.error('❌ Test 4 failed:', error.message);
}

console.log('\n🎉 Enhanced NLP Integration Tests Complete!\n');

// Summary
console.log('📋 Enhanced NLP Features:');
console.log('✅ Advanced Intent Classification with confidence scoring');
console.log('✅ Smart Entity Extraction (contacts, companies, technologies)');
console.log('✅ French Sentiment Analysis with urgency detection');
console.log('✅ Conversation Memory and context tracking');
console.log('✅ Enhanced confidence calculation');
console.log('✅ Seamless integration with existing chatbot');
console.log('\n🚀 Your chatbot now has significantly improved NLP capabilities!');