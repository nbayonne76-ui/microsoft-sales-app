import { TemplateAnalyzer } from '../../../lib/templateAnalyzer.js';
import path from 'path';

const analyzer = new TemplateAnalyzer(path.join(process.cwd(), 'templates'));

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'scan';
    
    console.log('🔍 Template Analyzer API - Action:', action);
    
    switch (action) {
      case 'scan':
        return await handleFullScan();
        
      case 'stats':
        return await handleStats();
        
      case 'search':
        return await handleSearch(searchParams);
        
      case 'suggest':
        return await handleSuggest(searchParams);
        
      default:
        return Response.json({ 
          error: `Action '${action}' non supportée`,
          availableActions: ['scan', 'stats', 'search', 'suggest']
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Erreur Template Analyzer API:', error);
    return Response.json({ 
      error: 'Erreur interne',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, data } = body;
    
    switch (action) {
      case 'analyze-content':
        return await analyzeContent(data);
        
      case 'find-best-match':
        return await findBestMatch(data);
        
      default:
        return Response.json({ 
          error: `Action POST '${action}' non supportée`,
          availableActions: ['analyze-content', 'find-best-match']
        }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Erreur POST Template Analyzer:', error);
    return Response.json({ 
      error: 'Erreur interne POST',
      details: error.message 
    }, { status: 500 });
  }
}

/**
 * Scan complet de tous les templates
 */
async function handleFullScan() {
  try {
    console.log('🚀 Début du scan complet...');
    const results = await analyzer.scanAndAnalyzeTemplates();
    
    // Générer un rapport synthétique
    const report = {
      success: true,
      timestamp: new Date().toISOString(),
      summary: {
        templates_found: results.analyzed,
        errors: results.errors,
        categories: Object.keys(results.categories).length,
        category_details: Object.keys(results.categories)
      },
      highlights: generateHighlights(results),
      next_steps: [
        "Utilisez /api/template-analyzer?action=suggest&objective=prospection pour des suggestions",
        "Consultez /api/template-analyzer?action=stats pour les statistiques détaillées",
        "Testez /api/template-analyzer?action=search&keywords=azure pour la recherche"
      ]
    };
    
    return Response.json(report);
    
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Scan échoué',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * Statistiques détaillées
 */
async function handleStats() {
  try {
    const stats = analyzer.getGlobalStats();
    
    return Response.json({
      success: true,
      stats: stats,
      insights: generateInsights(stats),
      charts_data: generateChartsData(stats)
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Statistiques non disponibles',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * Recherche de templates
 */
async function handleSearch(searchParams) {
  try {
    const criteria = {
      objective: searchParams.get('objective'),
      audience: searchParams.get('audience'),
      tone: searchParams.get('tone'),
      category: searchParams.get('category'),
      keywords: searchParams.get('keywords')?.split(',').map(k => k.trim().toLowerCase())
    };
    
    // Nettoyer les critères vides
    Object.keys(criteria).forEach(key => {
      if (!criteria[key] || (Array.isArray(criteria[key]) && criteria[key].length === 0)) {
        delete criteria[key];
      }
    });
    
    const results = analyzer.searchTemplates(criteria);
    
    return Response.json({
      success: true,
      search_criteria: criteria,
      results_count: results.length,
      templates: results.slice(0, 10).map(formatTemplateForAPI)
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Recherche échouée',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * Suggestions intelligentes
 */
async function handleSuggest(searchParams) {
  try {
    const objective = searchParams.get('objective');
    const audience = searchParams.get('audience');
    const context = searchParams.get('context');
    
    let suggestions = [];
    
    if (objective) {
      const criteria = { objective: objective };
      if (audience) criteria.targetAudience = audience;
      
      const matches = analyzer.searchTemplates(criteria);
      
      suggestions = matches.slice(0, 5).map(template => ({
        id: template.id,
        name: template.fileName.replace(/\.[^/.]+$/, ""),
        category: template.category,
        match_score: template.matchScore,
        why_suggested: generateSuggestionReason(template, objective, audience),
        preview: template.content.substring(0, 200) + '...',
        variables: template.variables,
        estimated_time: estimateCustomizationTime(template)
      }));
    }
    
    return Response.json({
      success: true,
      context: { objective, audience, context },
      suggestions_count: suggestions.length,
      suggestions: suggestions,
      tips: generateCustomizationTips(objective)
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Suggestions non disponibles',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * Analyse un contenu fourni
 */
async function analyzeContent(data) {
  try {
    const { content, category } = data;
    
    if (!content) {
      return Response.json({ 
        error: 'Contenu requis' 
      }, { status: 400 });
    }
    
    const tempAnalyzer = new TemplateAnalyzer();
    
    const analysis = {
      metadata: await tempAnalyzer.extractMetadata(content, category || 'general'),
      variables: tempAnalyzer.extractVariables(content),
      structure: tempAnalyzer.analyzeStructure(content),
      style: tempAnalyzer.analyzeStyle(content)
    };
    
    const improvements = generateImprovements(analysis);
    const score = calculateTemplateScore(analysis);
    
    return Response.json({
      success: true,
      analysis: analysis,
      score: score,
      improvements: improvements,
      ready_for_use: score.total >= 70
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Analyse échouée',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * Trouve le meilleur template pour une situation
 */
async function findBestMatch(data) {
  try {
    const { situation, client_info, preferences } = data;
    
    // Analyser la situation pour extraire des critères
    const criteria = extractCriteriaFromSituation(situation);
    
    // Ajouter les infos client si disponibles
    if (client_info?.industry) {
      criteria.targetAudience = mapIndustryToAudience(client_info.industry);
    }
    
    if (preferences?.tone) {
      criteria.tone = preferences.tone;
    }
    
    const matches = analyzer.searchTemplates(criteria);
    
    const bestMatch = matches.length > 0 ? matches[0] : null;
    
    return Response.json({
      success: true,
      situation_analyzed: situation,
      criteria_detected: criteria,
      best_match: bestMatch ? formatTemplateForAPI(bestMatch) : null,
      alternatives: matches.slice(1, 4).map(formatTemplateForAPI),
      customization_needed: bestMatch ? estimateCustomizationNeeded(bestMatch, data) : null
    });
    
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Recherche de correspondance échouée',
      details: error.message
    }, { status: 500 });
  }
}

// --- Fonctions utilitaires ---

function generateHighlights(results) {
  const highlights = [];
  
  if (results.analyzed > 0) {
    highlights.push(`📧 ${results.analyzed} templates analysés avec succès`);
  }
  
  const categories = Object.keys(results.categories);
  if (categories.length > 0) {
    highlights.push(`🗂️ ${categories.length} catégories détectées: ${categories.join(', ')}`);
  }
  
  if (results.errors === 0) {
    highlights.push("✅ Aucune erreur détectée - tous les templates sont valides");
  }
  
  return highlights;
}

function generateInsights(stats) {
  const insights = [];
  
  if (stats.total === 0) {
    insights.push("📝 Aucun template trouvé. Ajoutez des fichiers dans le dossier /templates");
    return insights;
  }
  
  // Insight sur la diversité
  const categories = Object.keys(stats.by_category).length;
  const objectives = Object.keys(stats.by_objective).length;
  
  if (categories >= 3 && objectives >= 3) {
    insights.push("🎯 Excellente diversité de templates - vous couvrez plusieurs scénarios");
  } else if (categories < 2) {
    insights.push("📁 Pensez à diversifier en créant des templates dans différentes catégories");
  }
  
  // Insight sur la longueur
  if (stats.avg_word_count > 200) {
    insights.push("📏 Vos templates sont détaillés. Considérez créer des versions courtes pour mobile");
  } else if (stats.avg_word_count < 50) {
    insights.push("📝 Vos templates sont concis. Parfait pour l'engagement rapide");
  }
  
  return insights;
}

function generateChartsData(stats) {
  return {
    by_category: Object.entries(stats.by_category).map(([name, count]) => ({ name, count })),
    by_objective: Object.entries(stats.by_objective).map(([name, count]) => ({ name, count })),
    by_tone: Object.entries(stats.by_tone).map(([name, count]) => ({ name, count }))
  };
}

function formatTemplateForAPI(template) {
  return {
    id: template.id,
    name: template.fileName?.replace(/\.[^/.]+$/, "") || 'Template',
    category: template.category,
    objective: template.metadata?.objective || 'general',
    tone: template.metadata?.tone || 'professionnel',
    target_audience: template.metadata?.targetAudience || 'general',
    word_count: template.style?.wordCount || 0,
    variables: template.variables || [],
    has_cta: template.structure?.hasCallToAction || false,
    match_score: template.matchScore || 0,
    preview: template.content?.substring(0, 150) + '...' || 'Pas de contenu'
  };
}

function generateSuggestionReason(template, objective, audience) {
  let reason = `Template adapté pour ${objective}`;
  
  if (audience && template.metadata.targetAudience === audience) {
    reason += ` ciblant ${audience}`;
  }
  
  if (template.variables.length > 0) {
    reason += `. ${template.variables.length} variables pour personnalisation`;
  }
  
  return reason;
}

function estimateCustomizationTime(template) {
  const variables = template.variables?.length || 0;
  const wordCount = template.style?.wordCount || 0;
  
  if (variables === 0) return "5-10 min";
  if (variables <= 3 && wordCount < 100) return "2-5 min";
  if (variables <= 5 && wordCount < 200) return "10-15 min";
  
  return "15-30 min";
}

function generateCustomizationTips(objective) {
  const tips = {
    prospection: [
      "Personnalisez avec le nom de l'entreprise et du contact",
      "Adaptez l'accroche selon le secteur d'activité",
      "Incluez une référence ou cas d'usage similaire"
    ],
    suivi: [
      "Récapitulez les points clés de l'échange précédent", 
      "Définissez clairement les prochaines étapes",
      "Fixez une échéance pour le suivi"
    ],
    relance: [
      "Référencez le dernier contact de manière positive",
      "Apportez une nouveauté ou mise à jour",
      "Proposez plusieurs options de réponse"
    ]
  };
  
  return tips[objective] || [
    "Adaptez le ton selon votre interlocuteur",
    "Personnalisez les variables entre {}",
    "Vérifiez la cohérence du message final"
  ];
}

function generateImprovements(analysis) {
  const improvements = [];
  
  if (analysis.variables.length === 0) {
    improvements.push({
      priority: "high",
      type: "personnalisation",
      message: "Ajoutez des variables {nom}, {entreprise} pour personnaliser"
    });
  }
  
  if (!analysis.structure.hasCallToAction) {
    improvements.push({
      priority: "high", 
      type: "engagement",
      message: "Incluez un appel à l'action clair (répondez, contactez-nous, etc.)"
    });
  }
  
  if (analysis.style.wordCount > 300) {
    improvements.push({
      priority: "medium",
      type: "longueur",
      message: "Template long, créez une version condensée pour mobile"
    });
  }
  
  return improvements;
}

function calculateTemplateScore(analysis) {
  const scores = {
    structure: 0,
    personalization: 0,
    engagement: 0,
    readability: 0
  };
  
  // Score structure (35 points max)
  if (analysis.structure.hasSubject) scores.structure += 10;
  if (analysis.structure.hasSignature) scores.structure += 10;
  if (analysis.structure.paragraphs > 1) scores.structure += 10;
  if (analysis.structure.hasCallToAction) scores.structure += 5;
  
  // Score personnalisation (25 points max)
  if (analysis.variables.length > 0) scores.personalization += 10;
  if (analysis.variables.length >= 3) scores.personalization += 10;
  if (analysis.variables.length >= 5) scores.personalization += 5;
  
  // Score engagement (25 points max)
  if (analysis.structure.hasCallToAction) scores.engagement += 15;
  if (analysis.metadata.urgency === 'high') scores.engagement += 5;
  if (analysis.metadata.cta) scores.engagement += 5;
  
  // Score lisibilité (15 points max)
  if (analysis.style.readabilityScore === 'facile') scores.readability += 15;
  else if (analysis.style.readabilityScore === 'moyen') scores.readability += 10;
  else scores.readability += 5;
  
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  return {
    ...scores,
    total,
    grade: total >= 80 ? 'A' : total >= 60 ? 'B' : total >= 40 ? 'C' : 'D'
  };
}

function extractCriteriaFromSituation(situation) {
  const situationLower = situation.toLowerCase();
  const criteria = {};
  
  // Détecter l'objectif
  if (situationLower.includes('nouveau client') || situationLower.includes('prospect')) {
    criteria.objective = 'prospection';
  } else if (situationLower.includes('suivi') || situationLower.includes('réunion')) {
    criteria.objective = 'fidélisation';
  } else if (situationLower.includes('relance') || situationLower.includes('sans nouvelles')) {
    criteria.objective = 'reactivation';
  }
  
  // Détecter le ton
  if (situationLower.includes('urgent') || situationLower.includes('rapide')) {
    criteria.tone = 'urgent';
  } else if (situationLower.includes('formel') || situationLower.includes('officiel')) {
    criteria.tone = 'formel';
  }
  
  return criteria;
}

function mapIndustryToAudience(industry) {
  const mapping = {
    'technology': 'startup',
    'healthcare': 'b2b', 
    'finance': 'grande_entreprise',
    'retail': 'pme',
    'manufacturing': 'b2b'
  };
  
  return mapping[industry.toLowerCase()] || 'b2b';
}

function estimateCustomizationNeeded(template, data) {
  const needs = [];
  
  if (template.variables.length > 0) {
    needs.push(`Remplir ${template.variables.length} variables`);
  }
  
  if (data.client_info) {
    needs.push("Adapter selon le profil client");
  }
  
  if (template.metadata.tone !== (data.preferences?.tone || 'professionnel')) {
    needs.push("Ajuster le ton");
  }
  
  return needs;
}