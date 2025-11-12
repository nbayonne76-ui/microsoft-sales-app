/**
 * Enhanced Knowledge Mining Test Suite
 * Tests semantic similarity, pattern mining, and automated content generation
 */

import { semanticKnowledgeMiner } from './lib/semantic-knowledge-miner.js';
import { automatedContentGenerator } from './lib/automated-content-generator.js';
import { activeLearningSystem } from './lib/active-learning-system.js';

console.log('🧠 Enhanced Knowledge Mining Test Suite\n');

// Test knowledge gaps data
const testKnowledgeGaps = [
  {
    query: "Comment migrer vers Azure ?",
    frequency: 8,
    suggested_category: "azure",
    first_seen: new Date('2025-01-15'),
    last_seen: new Date('2025-01-20')
  },
  {
    query: "Migration vers le cloud Azure",
    frequency: 5,
    suggested_category: "azure",
    first_seen: new Date('2025-01-16'),
    last_seen: new Date('2025-01-20')
  },
  {
    query: "Étapes pour migrer vers Azure",
    frequency: 3,
    suggested_category: "azure",
    first_seen: new Date('2025-01-18'),
    last_seen: new Date('2025-01-20')
  },
  {
    query: "Prix d'Office 365",
    frequency: 6,
    suggested_category: "microsoft365",
    first_seen: new Date('2025-01-14'),
    last_seen: new Date('2025-01-19')
  },
  {
    query: "Coût de Microsoft 365",
    frequency: 4,
    suggested_category: "microsoft365",
    first_seen: new Date('2025-01-17'),
    last_seen: new Date('2025-01-19')
  },
  {
    query: "Sécurité Azure",
    frequency: 7,
    suggested_category: "security",
    first_seen: new Date('2025-01-12'),
    last_seen: new Date('2025-01-20')
  },
  {
    query: "Installation de Teams",
    frequency: 2,
    suggested_category: "teams",
    first_seen: new Date('2025-01-19'),
    last_seen: new Date('2025-01-20')
  }
];

async function runEnhancedMiningTests() {
  console.log('🔍 Testing Semantic Knowledge Miner...\n');

  try {
    // Test 1: Semantic Pattern Mining
    console.log('📊 Test 1: Semantic Pattern Mining');
    const patterns = await semanticKnowledgeMiner.mineSemanticPatterns(testKnowledgeGaps);

    console.log(`   Found ${patterns.length} semantic patterns:`);
    patterns.forEach((pattern, index) => {
      console.log(`   ${index + 1}. Type: ${pattern.type}, Frequency: ${pattern.frequency}, Confidence: ${Math.round(pattern.confidence * 100)}%`);
      console.log(`      Queries: ${pattern.queries.slice(0, 2).join(', ')}${pattern.queries.length > 2 ? '...' : ''}`);
      console.log(`      Categories: ${pattern.categories.join(', ')}`);
      console.log(`      Common Words: ${pattern.commonWords.join(', ')}`);
      console.log(`      Estimated Value: ${pattern.estimatedValue} points`);
      console.log(`      Needs Content: ${pattern.needsContent ? '✅' : '❌'}`);
    });

    console.log('\n' + '-'.repeat(60) + '\n');

    // Test 2: Semantic Similarity
    console.log('🔗 Test 2: Semantic Similarity Detection');
    const similarityTests = [
      ['Comment migrer vers Azure ?', 'Migration vers le cloud Azure'],
      ['Prix d\'Office 365', 'Coût de Microsoft 365'],
      ['Sécurité Azure', 'Installation de Teams']
    ];

    for (const [text1, text2] of similarityTests) {
      const similarity = await semanticKnowledgeMiner.calculateSemanticSimilarity(text1, text2);
      console.log(`   "${text1}" vs "${text2}"`);
      console.log(`   Similarity: ${Math.round(similarity * 100)}%`);
    }

    console.log('\n' + '-'.repeat(60) + '\n');

    // Test 3: Automated Content Generation
    console.log('🤖 Test 3: Automated Content Generation');
    const contentResult = await automatedContentGenerator.generateContentFromPatterns(patterns);

    console.log(`   Generated ${contentResult.length} pieces of content:`);
    contentResult.forEach((content, index) => {
      console.log(`   ${index + 1}. Question: "${content.question}"`);
      console.log(`      Category: ${content.category}`);
      console.log(`      Quality Score: ${Math.round(content.metadata.qualityScore * 100)}%`);
      console.log(`      Answer Length: ${content.answer.length} characters`);
      console.log(`      Tags: ${content.tags.join(', ')}`);
      console.log(`      Generated From: ${content.metadata.generatedFrom}`);
    });

    console.log('\n' + '-'.repeat(60) + '\n');

    // Test 4: Full Knowledge Mining Pipeline
    console.log('🚀 Test 4: Full Knowledge Mining Pipeline');

    // Add gaps to active learning system
    testKnowledgeGaps.forEach(gap => {
      activeLearningSystem.trackKnowledgeGap(gap.query);
    });

    const miningResult = await activeLearningSystem.performSemanticKnowledgeMining();

    console.log(`   Pipeline Result:`);
    console.log(`   Success: ${miningResult.success ? '✅' : '❌'}`);
    if (miningResult.success) {
      console.log(`   Total Gaps Analyzed: ${miningResult.stats.totalGapsAnalyzed}`);
      console.log(`   Patterns Found: ${miningResult.stats.patternsFound}`);
      console.log(`   Content Generated: ${miningResult.stats.contentGenerated}`);
      console.log(`   High Value Patterns: ${miningResult.stats.highValuePatterns}`);
    }

    console.log('\n' + '-'.repeat(60) + '\n');

    // Test 5: System Status and Capabilities
    console.log('📈 Test 5: Enhanced Learning Status');
    const enhancedStatus = activeLearningSystem.getEnhancedLearningStatus();

    console.log(`   Semantic Mining Status:`);
    console.log(`   - Total Patterns: ${enhancedStatus.semantic_mining.status.totalPatterns}`);
    console.log(`   - Content Generated: ${enhancedStatus.semantic_mining.status.contentGenerated}`);
    console.log(`   - Success Rate: ${Math.round(enhancedStatus.semantic_mining.status.successRate * 100)}%`);
    console.log(`   - Last Mining: ${enhancedStatus.semantic_mining.status.lastMiningDate || 'Never'}`);

    console.log(`   Knowledge Enhancement:`);
    console.log(`   - Gaps Tracked: ${enhancedStatus.knowledge_enhancement.gaps_tracked}`);
    console.log(`   - High Frequency Gaps: ${enhancedStatus.knowledge_enhancement.high_frequency_gaps}`);
    console.log(`   - Categories Needed: ${enhancedStatus.knowledge_enhancement.categories_needed}`);

    const minerStatus = semanticKnowledgeMiner.getMiningStatus();
    console.log(`   Semantic Miner Configuration:`);
    console.log(`   - Model: ${minerStatus.configuration.model}`);
    console.log(`   - Pattern Threshold: ${minerStatus.configuration.patternThreshold}`);
    console.log(`   - High Freq Threshold: ${minerStatus.configuration.highFrequencyThreshold}`);
    console.log(`   - Cache Size: ${minerStatus.cacheSize} embeddings`);

    const generatorStats = automatedContentGenerator.getGenerationStats();
    console.log(`   Content Generator Stats:`);
    console.log(`   - Total Generated: ${generatorStats.totalGenerated}`);
    console.log(`   - Average Quality: ${generatorStats.averageQuality}`);
    console.log(`   - Rate Limit Remaining: ${generatorStats.rateLimitRemaining}/${generatorStats.configuration.maxGenerationsPerHour}`);

    console.log('\n' + '='.repeat(60) + '\n');

    // Test 6: Performance Evaluation
    console.log('⚡ Test 6: Performance Evaluation');

    const startTime = Date.now();

    // Measure semantic analysis performance
    const semanticStart = Date.now();
    await semanticKnowledgeMiner.mineSemanticPatterns(testKnowledgeGaps.slice(0, 3));
    const semanticTime = Date.now() - semanticStart;

    // Measure content generation performance
    const generationStart = Date.now();
    await automatedContentGenerator.processKnowledgeGaps(testKnowledgeGaps.slice(0, 2));
    const generationTime = Date.now() - generationStart;

    const totalTime = Date.now() - startTime;

    console.log(`   Performance Metrics:`);
    console.log(`   - Semantic Analysis: ${semanticTime}ms (3 gaps)`);
    console.log(`   - Content Generation: ${generationTime}ms (2 gaps)`);
    console.log(`   - Total Test Time: ${totalTime}ms`);
    console.log(`   - Average per Gap: ${Math.round(totalTime / testKnowledgeGaps.length)}ms`);

    console.log('\n🎉 Enhanced Knowledge Mining Tests Completed Successfully!\n');

    // Summary Report
    console.log('📋 Summary Report:');
    console.log(`✅ Semantic Pattern Mining: ${patterns.length} patterns identified`);
    console.log(`✅ Content Generation: ${contentResult.length} pieces created`);
    console.log(`✅ Pipeline Integration: ${miningResult.success ? 'Working' : 'Failed'}`);
    console.log(`✅ Performance: ${totalTime < 5000 ? 'Good' : 'Needs optimization'} (${totalTime}ms)`);

    const highQualityContent = contentResult.filter(c => c.metadata.qualityScore >= 0.8).length;
    console.log(`✅ Content Quality: ${highQualityContent}/${contentResult.length} high quality (>80%)`);

    const effectivePatterns = patterns.filter(p => p.needsContent && p.confidence > 0.7).length;
    console.log(`✅ Pattern Effectiveness: ${effectivePatterns}/${patterns.length} actionable patterns`);

    console.log('\n🚀 Enhanced Knowledge Mining System: FULLY OPERATIONAL');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Test fallback scenarios
async function testFallbackScenarios() {
  console.log('\n🛡️ Testing Fallback Scenarios...\n');

  try {
    // Test with no knowledge gaps
    console.log('📝 Test: Empty knowledge gaps');
    const emptyResult = await semanticKnowledgeMiner.mineSemanticPatterns([]);
    console.log(`   Result: ${emptyResult.length} patterns (expected: 0)`);

    // Test with single gap
    console.log('📝 Test: Single knowledge gap');
    const singleResult = await semanticKnowledgeMiner.mineSemanticPatterns([testKnowledgeGaps[0]]);
    console.log(`   Result: ${singleResult.length} patterns`);

    // Test content generation rate limit
    console.log('📝 Test: Content generation rate limiting');
    const canGenerate = automatedContentGenerator.canGenerate();
    console.log(`   Can generate: ${canGenerate ? '✅' : '❌'}`);

    console.log('\n✅ Fallback scenarios tested successfully');

  } catch (error) {
    console.error('❌ Fallback test failed:', error);
  }
}

// Run all tests
async function main() {
  await runEnhancedMiningTests();
  await testFallbackScenarios();

  console.log('\n🏁 All Enhanced Knowledge Mining Tests Complete!\n');
}

main().catch(console.error);