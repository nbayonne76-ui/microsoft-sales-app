/**
 * Test démonstration du système A/B Testing automatisé
 */

import { AutomatedABTesting } from './lib/automated-ab-testing.js';

const abTesting = new AutomatedABTesting();

// Mock template pour la démonstration
const mockTemplate = {
  id: 'template_azure_migration',
  name: 'Azure Migration Template',
  subject: 'Optimisez votre infrastructure avec Azure',
  content: `Bonjour,

J'espère que vous allez bien.

Je me permets de vous contacter concernant l'optimisation de votre infrastructure IT avec Microsoft Azure.

Notre analyse préliminaire suggère que votre organisation pourrait bénéficier d'une migration vers le cloud, avec des avantages significatifs :

• Réduction des coûts opérationnels (25-40% en moyenne)
• Amélioration de la sécurité et de la résilience
• Scalabilité automatique selon vos besoins

Souhaitez-vous que nous discutions de votre situation spécifique lors d'un échange de 30 minutes ?

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`,
  category: 'migration',
  segment: 'enterprise'
};

console.log('🧪 === DÉMONSTRATION A/B TESTING AUTOMATISÉ ===\n');

async function demonstrateABTesting() {
  try {
    // 1. Génération automatique de variations
    console.log('📝 1. GÉNÉRATION DE VARIATIONS AUTOMATIQUES');
    console.log('================================================');

    // Test variations de sujet
    const subjectVariations = await abTesting.generateTemplateVariations(
      mockTemplate,
      'subject_line',
      3
    );

    console.log('🎯 Variations de ligne de sujet générées :');
    subjectVariations.forEach((variation, index) => {
      console.log(`   ${String.fromCharCode(65 + index)}. "${variation.subject}"`);
      console.log(`      Stratégie: ${variation.changes.strategy}`);
    });

    // Test variations d'ouverture
    console.log('\n📖 Variations d\'ouverture générées :');
    const openingVariations = await abTesting.generateTemplateVariations(
      mockTemplate,
      'opening_paragraph',
      2
    );

    openingVariations.forEach((variation, index) => {
      console.log(`   ${String.fromCharCode(65 + index)}. Stratégie: ${variation.changes.strategy}`);
      console.log(`      Ouverture: "${variation.changes.new_opening}"`);
    });

    // 2. Création d'un test A/B automatique
    console.log('\n🧪 2. CRÉATION DE TEST A/B AUTOMATIQUE');
    console.log('=======================================');

    const abTest = await abTesting.createABTest(
      mockTemplate,
      subjectVariations,
      {
        testType: 'subject_line',
        name: 'Auto_Subject_Azure_Migration',
        minSampleSize: 50,
        trafficSplit: [40, 30, 30]
      }
    );

    console.log(`✅ Test A/B créé avec succès :`);
    console.log(`   ID: ${abTest.test.id}`);
    console.log(`   Nom: ${abTest.test.name}`);
    console.log(`   Variants: ${abTest.variants.length}`);
    console.log(`   Répartition du traffic: ${abTest.test.trafficSplit.join('% / ')}%`);

    // 3. Simulation d'assignation de variants
    console.log('\n👥 3. SIMULATION D\'ASSIGNATION DE VARIANTS');
    console.log('==========================================');

    const userContexts = [
      { userId: 'user_001', sessionId: 'session_abc', segment: 'enterprise' },
      { userId: 'user_002', sessionId: 'session_def', segment: 'sme' },
      { userId: 'user_003', sessionId: 'session_ghi', segment: 'startup' }
    ];

    for (const context of userContexts) {
      const selectedVariant = await abTesting.selectVariantForEmail(abTest.test.id, context);
      console.log(`👤 User ${context.userId} → Variant ${selectedVariant.name}`);
      console.log(`   Sujet assigné: "${selectedVariant.subject}"`);
    }

    // 4. Simulation de résultats de test
    console.log('\n📊 4. SIMULATION DE RÉSULTATS');
    console.log('============================');

    // Simuler des résultats pour chaque variant
    const mockResults = [
      { variantId: abTest.variants[0].id, sent: 100, opened: 25, clicked: 8, responded: 3 },
      { variantId: abTest.variants[1].id, sent: 100, opened: 32, clicked: 12, responded: 5 },
      { variantId: abTest.variants[2].id, sent: 100, opened: 28, clicked: 10, responded: 4 }
    ];

    for (const result of mockResults) {
      await abTesting.recordTestResult(result.variantId, 'sent', result.sent);
      await abTesting.recordTestResult(result.variantId, 'opened', result.opened);
      await abTesting.recordTestResult(result.variantId, 'clicked', result.clicked);
      await abTesting.recordTestResult(result.variantId, 'responded', result.responded);
    }

    console.log('📈 Résultats simulés enregistrés pour tous les variants');

    // 5. Analyse des résultats
    console.log('\n🔍 5. ANALYSE STATISTIQUE DES RÉSULTATS');
    console.log('======================================');

    const analysis = await abTesting.analyzeTestResults(abTest.test.id);

    console.log(`🎯 Status du test: ${analysis.status}`);
    console.log(`📊 Confiance statistique: ${(analysis.confidence * 100).toFixed(1)}%`);

    if (analysis.winner) {
      console.log(`🏆 Variant gagnant: ${analysis.winner.name}`);
      console.log(`📈 Amélioration: ${analysis.improvement}%`);
    }

    console.log('\n📋 Performance par variant:');
    analysis.variants.forEach(variant => {
      console.log(`   ${variant.name} ${variant.isControl ? '(Contrôle)' : ''}:`);
      console.log(`      📧 Assignations: ${variant.assignments}`);
      console.log(`      📖 Taux d'ouverture: ${variant.metrics.open_rate.toFixed(1)}%`);
      console.log(`      🖱️  Taux de clic: ${variant.metrics.click_rate.toFixed(1)}%`);
      console.log(`      💬 Taux de réponse: ${variant.metrics.response_rate.toFixed(1)}%`);
    });

    // 6. Recommandations automatiques
    console.log('\n💡 6. RECOMMANDATIONS AUTOMATIQUES');
    console.log('==================================');

    analysis.recommendations.forEach(rec => {
      console.log(`${getRecommendationIcon(rec.type)} ${rec.message}`);
      console.log(`   Action recommandée: ${rec.action}`);
    });

    // 7. Tests multiples automatiques
    console.log('\n🤖 7. CRÉATION AUTOMATIQUE DE TESTS MULTIPLES');
    console.log('==============================================');

    const autoTests = await abTesting.autoCreateABTestsForTemplate(
      mockTemplate.id,
      ['opening_paragraph', 'call_to_action', 'tone']
    );

    console.log(`✨ ${autoTests.length} tests A/B créés automatiquement :`);
    autoTests.forEach(test => {
      console.log(`   📋 ${test.test.name} (${test.test.testType})`);
      console.log(`      Variants: ${test.variants.length}`);
    });

    // 8. Insights sur l'optimisation
    console.log('\n🚀 8. INSIGHTS D\'OPTIMISATION');
    console.log('=============================');

    const insights = generateOptimizationInsights(analysis);
    console.log('🎯 Insights automatiques basés sur les résultats :');
    insights.forEach(insight => {
      console.log(`   ${insight.icon} ${insight.message}`);
    });

    console.log('\n✅ === DÉMONSTRATION TERMINÉE ===');
    console.log('Le système A/B Testing automatisé est opérationnel !');

  } catch (error) {
    console.error('❌ Erreur lors de la démonstration:', error);
  }
}

function getRecommendationIcon(type) {
  const icons = {
    'winner_found': '🏆',
    'trending_winner': '📈',
    'inconclusive': '⚠️',
    'high_performance': '🚀',
    'extend_test': '⏱️'
  };
  return icons[type] || '💡';
}

function generateOptimizationInsights(analysis) {
  const insights = [];

  const bestVariant = analysis.variants.sort((a, b) => b.metrics.response_rate - a.metrics.response_rate)[0];
  const worstVariant = analysis.variants.sort((a, b) => a.metrics.response_rate - b.metrics.response_rate)[0];

  if (bestVariant.metrics.response_rate > worstVariant.metrics.response_rate * 1.5) {
    insights.push({
      icon: '🎯',
      message: `Le variant ${bestVariant.name} performe ${((bestVariant.metrics.response_rate / worstVariant.metrics.response_rate - 1) * 100).toFixed(0)}% mieux`
    });
  }

  if (bestVariant.metrics.open_rate > 30) {
    insights.push({
      icon: '📖',
      message: `Excellent taux d'ouverture de ${bestVariant.metrics.open_rate.toFixed(1)}% - optimiser ce style de sujet`
    });
  }

  if (analysis.confidence < 0.8) {
    insights.push({
      icon: '📊',
      message: 'Augmenter la taille d\'échantillon pour plus de fiabilité statistique'
    });
  }

  insights.push({
    icon: '🔄',
    message: 'Continuer les tests A/B pour une amélioration continue des performances'
  });

  return insights;
}

// Lancer la démonstration
demonstrateABTesting();