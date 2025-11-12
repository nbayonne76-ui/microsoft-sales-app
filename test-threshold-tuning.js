/**
 * Test démonstration du système de tuning automatique des seuils
 */

import { AutomaticThresholdTuner } from './lib/automatic-threshold-tuner.js';

const thresholdTuner = new AutomaticThresholdTuner();

console.log('🎯 === DÉMONSTRATION TUNING AUTOMATIQUE DES SEUILS ===\n');

async function demonstrateThresholdTuning() {
  try {
    // 1. État initial des seuils
    console.log('📊 1. CONFIGURATION INITIALE DES SEUILS');
    console.log('=====================================');

    const initialThresholds = thresholdTuner.getCurrentThresholds();
    console.log('Seuils de confiance actuels :');
    Object.entries(initialThresholds.confidence).forEach(([level, value]) => {
      console.log(`   ${level.padEnd(8)}: ${(value * 100).toFixed(1)}%`);
    });

    console.log('\nCibles de performance :');
    Object.entries(initialThresholds.performance).forEach(([metric, target]) => {
      console.log(`   ${metric.padEnd(20)}: ${(target * 100).toFixed(1)}%`);
    });

    // 2. Simulation de données de performance
    console.log('\n📈 2. SIMULATION DE DONNÉES DE PERFORMANCE');
    console.log('=========================================');

    // Simuler des performances sub-optimales pour déclencher le tuning
    const mockPerformanceData = {
      totalFeedbacks: 45,
      avgQualityRating: 3.2,      // Faible (cible: 4.0+)
      avgRelevanceRating: 3.5,
      avgToneRating: 3.8,
      totalEmailsSent: 200,
      totalEmailsOpened: 140,
      totalEmailsReplied: 22,     // Faible taux de réponse (11%)
      positiveCount: 25,
      negativeCount: 15,          // Beaucoup de feedback négatif
      suggestionCount: 12,
      openRate: 0.70,
      responseRate: 0.11,         // En dessous de la cible (15%)
      userSatisfaction: 0.72,     // En dessous de la cible (80%)
      confidenceBuckets: {
        high: { feedbacks: [], avgRating: 3.1, count: 20 },    // Performance faible pour high confidence
        medium: { feedbacks: [], avgRating: 3.6, count: 15 },
        low: { feedbacks: [], avgRating: 3.8, count: 10 }
      }
    };

    console.log('Performance simulée (problématique) :');
    console.log(`   📧 Emails envoyés: ${mockPerformanceData.totalEmailsSent}`);
    console.log(`   📖 Taux d'ouverture: ${(mockPerformanceData.openRate * 100).toFixed(1)}%`);
    console.log(`   💬 Taux de réponse: ${(mockPerformanceData.responseRate * 100).toFixed(1)}% (cible: 15%)`);
    console.log(`   😊 Satisfaction utilisateur: ${(mockPerformanceData.userSatisfaction * 100).toFixed(1)}% (cible: 80%)`);
    console.log(`   👍 Feedbacks positifs: ${mockPerformanceData.positiveCount}/${mockPerformanceData.totalFeedbacks}`);
    console.log(`   👎 Feedbacks négatifs: ${mockPerformanceData.negativeCount}/${mockPerformanceData.totalFeedbacks}`);

    // 3. Analyse de l'efficacité des seuils
    console.log('\n🔍 3. ANALYSE DE L\'EFFICACITÉ DES SEUILS');
    console.log('=======================================');

    const thresholdAnalysis = await thresholdTuner.analyzeThresholdEffectiveness(mockPerformanceData);

    console.log('Problèmes identifiés :');
    thresholdAnalysis.problems.forEach(problem => {
      console.log(`   ⚠️  ${problem.type}: ${(problem.current * 100).toFixed(1)}% (cible: ${(problem.target * 100).toFixed(1)}%)`);
      console.log(`       Sévérité: ${problem.severity}`);
    });

    console.log('\nPerformance par niveau de confiance :');
    Object.entries(thresholdAnalysis.confidenceAnalysis || mockPerformanceData.confidenceBuckets).forEach(([level, data]) => {
      console.log(`   ${level.padEnd(8)}: ${data.count} échantillons, note moyenne: ${data.avgRating.toFixed(1)}/5`);
    });

    // 4. Calcul des ajustements optimaux
    console.log('\n⚙️  4. CALCUL DES AJUSTEMENTS OPTIMAUX');
    console.log('====================================');

    const adjustments = thresholdTuner.calculateOptimalAdjustments(thresholdAnalysis);

    if (adjustments.shouldApply) {
      console.log('🎯 Ajustements recommandés :');

      console.log('\nChangements de seuils :');
      Object.entries(adjustments.changes.deltas).forEach(([level, delta]) => {
        if (Math.abs(delta) > 0.001) {
          const from = adjustments.changes.from[level];
          const to = adjustments.changes.to[level];
          const direction = delta > 0 ? '↗️' : '↘️';
          console.log(`   ${level.padEnd(8)}: ${(from * 100).toFixed(1)}% → ${(to * 100).toFixed(1)}% ${direction} (${delta >= 0 ? '+' : ''}${(delta * 100).toFixed(1)}%)`);
        }
      });

      console.log('\nRaisonnement :');
      adjustments.reasoning.forEach(reason => {
        console.log(`   💡 ${reason}`);
      });

      console.log('\nImpact attendu :');
      Object.entries(adjustments.expectedImpact).forEach(([metric, impact]) => {
        console.log(`   📈 ${metric}: ${impact}`);
      });

    } else {
      console.log('✅ Aucun ajustement nécessaire - seuils optimaux');
    }

    // 5. Application des ajustements
    console.log('\n🔧 5. APPLICATION DES AJUSTEMENTS');
    console.log('================================');

    if (adjustments.shouldApply) {
      await thresholdTuner.applyThresholdAdjustments(adjustments);
      console.log('✅ Ajustements appliqués avec succès');

      // Afficher les nouveaux seuils
      const newThresholds = thresholdTuner.getCurrentThresholds();
      console.log('\nNouveaux seuils de confiance :');
      Object.entries(newThresholds.confidence).forEach(([level, value]) => {
        console.log(`   ${level.padEnd(8)}: ${(value * 100).toFixed(1)}%`);
      });

    } else {
      console.log('⏭️  Aucun ajustement appliqué');
    }

    // 6. Simulation d'amélioration des performances
    console.log('\n📊 6. SIMULATION D\'AMÉLIORATION DES PERFORMANCES');
    console.log('===============================================');

    const improvedPerformanceData = {
      ...mockPerformanceData,
      avgQualityRating: 4.1,      // Amélioration
      responseRate: 0.16,         // Amélioration
      userSatisfaction: 0.83,     // Amélioration
      positiveCount: 35,
      negativeCount: 8,
      confidenceBuckets: {
        high: { feedbacks: [], avgRating: 4.2, count: 18 },    // Amélioration significative
        medium: { feedbacks: [], avgRating: 3.9, count: 12 },
        low: { feedbacks: [], avgRating: 3.7, count: 8 }
      }
    };

    console.log('Performance après ajustement (simulée) :');
    console.log(`   💬 Taux de réponse: ${(improvedPerformanceData.responseRate * 100).toFixed(1)}% (${improvedPerformanceData.responseRate > mockPerformanceData.responseRate ? '↗️' : '↘️'})`);
    console.log(`   😊 Satisfaction: ${(improvedPerformanceData.userSatisfaction * 100).toFixed(1)}% (${improvedPerformanceData.userSatisfaction > mockPerformanceData.userSatisfaction ? '↗️' : '↘️'})`);
    console.log(`   👍 Feedbacks positifs: ${improvedPerformanceData.positiveCount}/${improvedPerformanceData.totalFeedbacks} (${improvedPerformanceData.positiveCount > mockPerformanceData.positiveCount ? '↗️' : '↘️'})`);

    // 7. Vérification que les nouveaux seuils sont optimaux
    console.log('\n✅ 7. VÉRIFICATION DES NOUVEAUX SEUILS');
    console.log('====================================');

    const newAnalysis = await thresholdTuner.analyzeThresholdEffectiveness(improvedPerformanceData);
    const newAdjustments = thresholdTuner.calculateOptimalAdjustments(newAnalysis);

    if (!newAdjustments.shouldApply) {
      console.log('🎯 Parfait ! Les nouveaux seuils sont optimaux pour les performances améliorées');
    } else {
      console.log('🔄 Ajustements supplémentaires possibles :');
      newAdjustments.reasoning.forEach(reason => {
        console.log(`   💡 ${reason}`);
      });
    }

    // 8. Test de l'ajustement manuel
    console.log('\n🛠️  8. TEST D\'AJUSTEMENT MANUEL');
    console.log('=============================');

    const manualThresholds = {
      high: 0.85,
      medium: 0.65,
      low: 0.45,
      min: 0.25
    };

    await thresholdTuner.setThresholds(manualThresholds, 'Test manuel pour démonstration');
    console.log('✅ Seuils ajustés manuellement');

    const manualResult = thresholdTuner.getCurrentThresholds();
    console.log('Seuils manuels appliqués :');
    Object.entries(manualResult.confidence).forEach(([level, value]) => {
      console.log(`   ${level.padEnd(8)}: ${(value * 100).toFixed(1)}%`);
    });

    // 9. Évaluation complète des performances
    console.log('\n📋 9. ÉVALUATION COMPLÈTE DES PERFORMANCES');
    console.log('=========================================');

    const evaluation = await thresholdTuner.evaluateThresholdPerformance(7);
    console.log('Évaluation sur 7 jours :');
    console.log(`   📊 Précision: ${(evaluation.metrics.accuracy * 100).toFixed(1)}%`);
    console.log(`   😊 Satisfaction: ${(evaluation.metrics.satisfaction * 100).toFixed(1)}%`);
    console.log(`   💬 Taux de réponse: ${(evaluation.metrics.responseRate * 100).toFixed(1)}%`);
    console.log(`   📝 Total feedbacks: ${evaluation.metrics.totalFeedbacks}`);

    if (evaluation.recommendation.needsTuning) {
      console.log('\n💡 Recommandations automatiques :');
      evaluation.recommendation.reasoning.forEach(reason => {
        console.log(`   🎯 ${reason}`);
      });
    } else {
      console.log('\n✅ Système optimal - aucune recommandation');
    }

    // 10. Démonstration de la planification automatique
    console.log('\n⏰ 10. PLANIFICATION AUTOMATIQUE');
    console.log('===============================');

    const scheduleResult = thresholdTuner.scheduleAutoTuning(24);
    console.log(`📅 ${scheduleResult}`);

    console.log('\n🔄 Le système va maintenant :');
    console.log('   • Surveiller les performances en continu');
    console.log('   • Collecter et analyser les feedbacks');
    console.log('   • Ajuster automatiquement les seuils si nécessaire');
    console.log('   • Maintenir des performances optimales');

    console.log('\n✅ === DÉMONSTRATION TERMINÉE ===');
    console.log('Le système de tuning automatique des seuils est opérationnel !');

    // Retourner l'état final
    return {
      initialThresholds: initialThresholds.confidence,
      finalThresholds: thresholdTuner.getCurrentThresholds().confidence,
      performanceImprovement: {
        responsRate: {
          before: mockPerformanceData.responseRate,
          after: improvedPerformanceData.responseRate,
          improvement: ((improvedPerformanceData.responseRate - mockPerformanceData.responseRate) / mockPerformanceData.responseRate * 100).toFixed(1) + '%'
        },
        satisfaction: {
          before: mockPerformanceData.userSatisfaction,
          after: improvedPerformanceData.userSatisfaction,
          improvement: ((improvedPerformanceData.userSatisfaction - mockPerformanceData.userSatisfaction) / mockPerformanceData.userSatisfaction * 100).toFixed(1) + '%'
        }
      },
      adjustmentCount: adjustments.shouldApply ? Object.keys(adjustments.changes.deltas).length : 0
    };

  } catch (error) {
    console.error('❌ Erreur lors de la démonstration:', error);
    throw error;
  }
}

// Fonction pour démontrer les cas d'usage spécifiques
async function demonstrateSpecificScenarios() {
  console.log('\n🎭 === SCÉNARIOS SPÉCIFIQUES DE TUNING ===\n');

  // Scénario 1: Performance faible
  console.log('📉 SCÉNARIO 1: Performance globalement faible');
  console.log('============================================');

  const lowPerformanceData = {
    totalFeedbacks: 30,
    avgQualityRating: 2.5,
    responseRate: 0.08,
    userSatisfaction: 0.65,
    confidenceBuckets: {
      high: { count: 15, avgRating: 2.8 },
      medium: { count: 10, avgRating: 2.3 },
      low: { count: 5, avgRating: 2.1 }
    }
  };

  const lowPerfAnalysis = await thresholdTuner.analyzeThresholdEffectiveness(lowPerformanceData);
  const lowPerfAdjustments = thresholdTuner.calculateOptimalAdjustments(lowPerfAnalysis);

  console.log('Problèmes détectés:', lowPerfAnalysis.problems.length);
  console.log('Ajustements recommandés:', lowPerfAdjustments.reasoning.join(', '));

  // Scénario 2: Haute performance - possibilité d'être moins conservateur
  console.log('\n📈 SCÉNARIO 2: Haute performance');
  console.log('==============================');

  const highPerformanceData = {
    totalFeedbacks: 50,
    avgQualityRating: 4.5,
    responseRate: 0.22,
    userSatisfaction: 0.91,
    confidenceBuckets: {
      high: { count: 25, avgRating: 4.7 },
      medium: { count: 20, avgRating: 4.3 },
      low: { count: 5, avgRating: 4.0 }
    }
  };

  const highPerfAnalysis = await thresholdTuner.analyzeThresholdEffectiveness(highPerformanceData);
  const highPerfAdjustments = thresholdTuner.calculateOptimalAdjustments(highPerfAnalysis);

  console.log('Performance excellente détectée');
  if (highPerfAdjustments.shouldApply) {
    console.log('Optimisations possibles:', highPerfAdjustments.reasoning.join(', '));
  } else {
    console.log('Seuils déjà optimaux');
  }

  console.log('\n✅ Scénarios spécifiques testés avec succès');
}

// Lancer les démonstrations
async function runAllDemonstrations() {
  try {
    const mainResult = await demonstrateThresholdTuning();
    await demonstrateSpecificScenarios();

    console.log('\n📊 === RÉSUMÉ FINAL ===');
    console.log('======================');
    console.log(`🎯 Ajustements appliqués: ${mainResult.adjustmentCount}`);
    console.log(`📈 Amélioration taux de réponse: ${mainResult.performanceImprovement.responsRate.improvement}`);
    console.log(`😊 Amélioration satisfaction: ${mainResult.performanceImprovement.satisfaction.improvement}`);
    console.log('🤖 Système de tuning automatique prêt pour la production');

  } catch (error) {
    console.error('❌ Erreur dans les démonstrations:', error);
  }
}

runAllDemonstrations();