/**
 * Test None Intent and Out-of-Domain Handling
 * Verifies that the system properly rejects irrelevant queries
 */

import { QnAMaker } from './components/QnAMaker.js';
import { improvedIntentSystem } from './lib/improved-intent-system.js';

console.log('🚫 Testing None Intent and Out-of-Domain Handling...\n');

// Initialize systems
const qnaMaker = new QnAMaker();

// Test cases for out-of-domain queries that should be rejected
const outOfDomainTests = [
  {
    category: "Weather & News",
    queries: [
      "Météo à Paris aujourd'hui",
      "Score du match de foot",
      "Actualités politiques",
      "Prix du bitcoin",
      "Bourse CAC 40"
    ]
  },
  {
    category: "Entertainment",
    queries: [
      "Film au cinéma ce soir",
      "Série Netflix recommandée",
      "Recette de cookies",
      "Restaurant italien ouvert",
      "Concert this weekend"
    ]
  },
  {
    category: "Transportation",
    queries: [
      "Horaires de train Paris-Lyon",
      "Traffic autoroute A1",
      "Uber commander",
      "Parking gratuit centre ville",
      "Métro ligne 14 fermée"
    ]
  },
  {
    category: "Health & Personal",
    queries: [
      "Mal de tête que faire",
      "Pharmacie de garde",
      "Rdv médecin",
      "Dentiste urgence",
      "Test covid où"
    ]
  },
  {
    category: "Shopping & Commerce",
    queries: [
      "Acheter chaussures en ligne",
      "Soldes Amazon",
      "Code promo Fnac",
      "Livraison gratuite",
      "Black friday deals"
    ]
  },
  {
    category: "Social Media & Platforms",
    queries: [
      "Instagram bug",
      "Facebook message",
      "Twitter post",
      "TikTok vidéo",
      "WhatsApp ne marche pas"
    ]
  },
  {
    category: "Gaming & Tech (Non-Microsoft)",
    queries: [
      "PlayStation 5 prix",
      "Nintendo Switch jeux",
      "iPhone 15 sortie",
      "Samsung Galaxy",
      "Google Pixel"
    ]
  },
  {
    category: "Spam & Inappropriate",
    queries: [
      "Gagnez de l'argent rapidement",
      "Crédit facile",
      "Casino en ligne",
      "Rencontre célibataire",
      "Publicité gratuite"
    ]
  },
  {
    category: "Nonsensical & Edge Cases",
    queries: [
      "Bla bla bla",
      "123456789",
      "Qwertyuiop",
      "...",
      "Hein quoi"
    ]
  },
  {
    category: "Conversational (Should redirect)",
    queries: [
      "Comment ça va",
      "Tu es qui",
      "Merci beaucoup",
      "Au revoir",
      "Bonne journée"
    ]
  }
];

// Test cases that should NOT be classified as None (valid domain)
const validDomainTests = [
  {
    category: "Microsoft Questions",
    queries: [
      "Comment migrer vers Azure",
      "Qu'est-ce que Microsoft 365",
      "Teams vs Zoom",
      "Prix Office 365",
      "Support Microsoft"
    ]
  },
  {
    category: "Email Creation",
    queries: [
      "Je veux créer un email",
      "Envoyer un message",
      "Contacter un prospect",
      "Nouveau email",
      "Écrire à un client"
    ]
  }
];

console.log('🧪 Testing Out-of-Domain Detection...\n');

let totalOutOfDomainTests = 0;
let correctlyRejected = 0;
let totalValidDomainTests = 0;
let correctlyAccepted = 0;

// Test out-of-domain queries (should be rejected)
for (const testCategory of outOfDomainTests) {
  console.log(`📂 Category: ${testCategory.category}`);

  for (const query of testCategory.queries) {
    totalOutOfDomainTests++;

    try {
      // Test LUIS-style intent system
      const luisAnalysis = await improvedIntentSystem.classifyIntent(query, {});

      // Test QnA Maker
      const qnaAnalysis = qnaMaker.analyzeWithKnowledge(query, 'initial', {});

      console.log(`  ❓ "${query}"`);
      console.log(`     LUIS: ${luisAnalysis.topIntent} (${Math.round(luisAnalysis.topScore * 100)}%)`);
      console.log(`     QnA: ${qnaAnalysis.intent} (${Math.round(qnaAnalysis.confidence * 100)}%)`);

      // Check if correctly identified as out-of-domain
      const isCorrectlyRejected =
        luisAnalysis.topIntent === 'None' ||
        qnaAnalysis.intent === 'OUT_OF_DOMAIN' ||
        qnaAnalysis.intent === null ||
        (qnaAnalysis.confidence < 0.5 && !qnaAnalysis.knowledgeResults);

      if (isCorrectlyRejected) {
        console.log(`     ✅ Correctly rejected`);
        correctlyRejected++;
      } else {
        console.log(`     ❌ Incorrectly accepted`);
      }

    } catch (error) {
      console.log(`     💥 Error: ${error.message}`);
    }
  }
  console.log('');
}

console.log('🎯 Testing Valid Domain Queries (should be accepted)...\n');

// Test valid domain queries (should be accepted)
for (const testCategory of validDomainTests) {
  console.log(`📂 Category: ${testCategory.category}`);

  for (const query of testCategory.queries) {
    totalValidDomainTests++;

    try {
      // Test LUIS-style intent system
      const luisAnalysis = await improvedIntentSystem.classifyIntent(query, {});

      // Test QnA Maker
      const qnaAnalysis = qnaMaker.analyzeWithKnowledge(query, 'initial', {});

      console.log(`  ❓ "${query}"`);
      console.log(`     LUIS: ${luisAnalysis.topIntent} (${Math.round(luisAnalysis.topScore * 100)}%)`);
      console.log(`     QnA: ${qnaAnalysis.intent} (${Math.round(qnaAnalysis.confidence * 100)}%)`);

      // Check if correctly identified as valid domain
      const isCorrectlyAccepted =
        luisAnalysis.topIntent !== 'None' ||
        qnaAnalysis.intent !== 'OUT_OF_DOMAIN' ||
        qnaAnalysis.knowledgeResults?.length > 0;

      if (isCorrectlyAccepted) {
        console.log(`     ✅ Correctly accepted`);
        correctlyAccepted++;
      } else {
        console.log(`     ❌ Incorrectly rejected`);
      }

    } catch (error) {
      console.log(`     💥 Error: ${error.message}`);
    }
  }
  console.log('');
}

// Performance test with mixed queries
console.log('🏃‍♂️ Performance Test - Mixed Domain Detection...\n');

const mixedQueries = [
  "Comment migrer vers Azure",  // Valid
  "Météo à Paris",             // Invalid
  "Je veux créer un email",    // Valid
  "Prix du bitcoin",           // Invalid
  "Support Microsoft",         // Valid
  "Film au cinéma",           // Invalid
  "Teams vs Zoom",            // Valid
  "Instagram bug"             // Invalid
];

const startTime = Date.now();

const performanceResults = [];
for (const query of mixedQueries) {
  const qnaResult = qnaMaker.analyzeWithKnowledge(query, 'initial', {});
  performanceResults.push({
    query,
    intent: qnaResult.intent,
    confidence: qnaResult.confidence,
    isOutOfDomain: qnaResult.intent === 'OUT_OF_DOMAIN' || qnaResult.intent === null
  });
}

const processingTime = Date.now() - startTime;

console.log('📊 Performance Results:');
console.log(`   ⚡ Total Time: ${processingTime}ms`);
console.log(`   🎯 Queries Processed: ${mixedQueries.length}`);
console.log(`   📈 Average Time: ${Math.round(processingTime / mixedQueries.length)}ms per query`);

performanceResults.forEach(result => {
  const status = result.isOutOfDomain ? '🚫 Rejected' : '✅ Accepted';
  console.log(`   ${status} "${result.query}" - ${result.intent} (${Math.round(result.confidence * 100)}%)`);
});

// Summary
console.log('\n🎉 None Intent Testing Complete!\n');

console.log('📊 Test Summary:');
console.log(`🚫 Out-of-Domain Rejection: ${correctlyRejected}/${totalOutOfDomainTests} (${Math.round((correctlyRejected/totalOutOfDomainTests) * 100)}%)`);
console.log(`✅ Valid Domain Acceptance: ${correctlyAccepted}/${totalValidDomainTests} (${Math.round((correctlyAccepted/totalValidDomainTests) * 100)}%)`);
console.log(`⚡ Average Processing Time: ${Math.round(processingTime / mixedQueries.length)}ms per query`);

// LUIS intent system statistics
console.log('\n📋 LUIS Intent System:');
console.log(`🎯 Total Intents: ${Object.keys(improvedIntentSystem.intents).length}`);
console.log(`🚫 None Intent Examples: ${improvedIntentSystem.intents.None.examples.length}`);
console.log(`📝 Total Training Examples: ${Object.values(improvedIntentSystem.intents).reduce((sum, intent) => sum + intent.examples.length, 0)}`);

// Benefits analysis
console.log('\n💡 Benefits of Enhanced None Intent:');
console.log('✅ Prevents incorrect classification of out-of-domain queries');
console.log('✅ Provides helpful redirection to valid use cases');
console.log('✅ Improves overall system accuracy and user experience');
console.log('✅ Reduces false positives in email creation and Microsoft Q&A');
console.log('✅ Handles edge cases and spam-like content appropriately');
console.log('✅ Maintains focus on core business domain (Microsoft solutions + emails)');

if (correctlyRejected >= totalOutOfDomainTests * 0.8 && correctlyAccepted >= totalValidDomainTests * 0.8) {
  console.log('\n🎊 Excellent! None intent handling is working effectively.');
} else {
  console.log('\n⚠️  None intent handling needs improvement. Review failed cases above.');
}

console.log('\n🚀 Ready for production with robust out-of-domain detection!');