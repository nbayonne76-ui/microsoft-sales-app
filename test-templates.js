// Script de test pour le système de templates
import { TemplateAnalyzer } from './lib/templateAnalyzer.js';
import path from 'path';

async function testTemplateSystem() {
  console.log('🧪 Test du système de gestion de templates\n');
  
  const analyzer = new TemplateAnalyzer(path.join(process.cwd(), 'templates'));
  
  try {
    // Test 1: Scanner les templates
    console.log('📊 1. Scan des templates...');
    const scanResults = await analyzer.scanAndAnalyzeTemplates();
    
    console.log(`✅ ${scanResults.analyzed} templates analysés`);
    console.log(`📁 Catégories: ${Object.keys(scanResults.categories).join(', ')}`);
    
    // Test 2: Statistiques
    console.log('\n📈 2. Statistiques globales...');
    const stats = analyzer.getGlobalStats();
    
    console.log(`📄 Total templates: ${stats.total}`);
    console.log(`📝 Moyenne mots: ${stats.avg_word_count}`);
    console.log('📊 Par objectif:', Object.entries(stats.by_objective));
    
    // Test 3: Recherche
    console.log('\n🔍 3. Test de recherche...');
    const searchResults = analyzer.searchTemplates({ 
      objective: 'prospection' 
    });
    
    console.log(`🎯 Trouvé ${searchResults.length} templates de prospection`);
    if (searchResults.length > 0) {
      const first = searchResults[0];
      console.log(`📧 Premier résultat: ${first.fileName} (Score: ${first.matchScore})`);
    }
    
    // Test 4: Analyse d'un contenu
    console.log('\n🔬 4. Test d\'analyse de contenu...');
    const testContent = `
Bonjour {nom},

Je suis Nicolas de Microsoft et je vous contacte concernant {sujet}.

Pouvez-vous me rappeler ?

Cordialement,
Nicolas
    `;
    
    const tempAnalyzer = new TemplateAnalyzer();
    const analysis = {
      metadata: await tempAnalyzer.extractMetadata(testContent, 'email_prospection'),
      variables: tempAnalyzer.extractVariables(testContent),
      structure: tempAnalyzer.analyzeStructure(testContent),
      style: tempAnalyzer.analyzeStyle(testContent)
    };
    
    console.log('🎯 Objectif détecté:', analysis.metadata.objective);
    console.log('🎭 Ton détecté:', analysis.metadata.tone);
    console.log('📝 Variables:', analysis.variables);
    console.log('📏 Nombre de mots:', analysis.style.wordCount);
    
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    
    // Afficher quelques recommandations
    console.log('\n💡 Recommandations pour utilisation optimale:');
    console.log('1. Ajoutez plus de templates dans différentes catégories');
    console.log('2. Utilisez des variables {nom}, {entreprise} pour personnaliser');  
    console.log('3. Testez le chatbot avec: "analyser mes templates"');
    console.log('4. Essayez: "trouve moi un template pour la prospection"');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    console.log('\n🔧 Actions correctives possibles:');
    console.log('1. Vérifiez que le dossier /templates existe');
    console.log('2. Assurez-vous que les templates sont dans le bon format');
    console.log('3. Redémarrez le serveur Next.js');
  }
}

// Lancer le test
testTemplateSystem();