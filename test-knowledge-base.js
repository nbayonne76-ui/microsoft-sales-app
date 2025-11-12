/**
 * Test script for Microsoft Knowledge Base integration
 */

import { smartEmailGenerator } from './lib/smart-email-generator.js';
import { microsoftKnowledgeBase } from './lib/microsoft-knowledge-base.js';

console.log('🧪 Testing Microsoft Knowledge Base Integration...\n');

// Test 1: Basic email generation
console.log('📧 Test 1: Basic email generation');
try {
  const email = smartEmailGenerator.generatePersonalizedEmail({
    companyName: 'TechCorp',
    recipientName: 'Jean Dupont',
    recipientRole: 'DSI',
    companySize: 'sme',
    industry: 'retail',
    emailType: 'prospection'
  });

  console.log('✅ Subject:', email.subject);
  console.log('✅ Recommendations:', email.metadata.recommendedSolutions);
  console.log('✅ Personalization Level:', email.metadata.personalizationLevel + '%');
} catch (error) {
  console.error('❌ Error:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 2: Solutions for use case
console.log('📋 Test 2: Get solutions for specific use case');
try {
  const solutions = smartEmailGenerator.getRecommendationsForUseCase('migration_cloud');
  console.log('✅ Cloud Migration Solutions:');
  solutions.forEach(solution => {
    console.log(`  • ${solution.name}: ${solution.shortDescription}`);
  });
} catch (error) {
  console.error('❌ Error:', error.message);
}

console.log('\n' + '='.repeat(50) + '\n');

// Test 3: Knowledge base categories
console.log('📚 Test 3: Knowledge base structure');
console.log('✅ Available categories:');
Object.entries(microsoftKnowledgeBase.categories).forEach(([key, category]) => {
  console.log(`  ${category.icon} ${category.name}: ${category.description}`);
});

console.log('\n✅ Available solutions:', Object.keys(microsoftKnowledgeBase.solutions).length);
console.log('✅ Available industries:', Object.keys(microsoftKnowledgeBase.industries).length);
console.log('✅ Company profiles:', Object.keys(microsoftKnowledgeBase.companyProfiles).length);

console.log('\n🎉 Knowledge Base Integration Test Complete!');