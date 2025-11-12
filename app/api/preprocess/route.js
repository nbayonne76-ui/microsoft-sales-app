import { NextResponse } from 'next/server';
import { DataPreprocessor } from '../../../lib/dataPreprocessor.js';

export async function POST(request) {
  try {
    const { text, options = {} } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Texte requis pour le traitement' },
        { status: 400 }
      );
    }

    const preprocessor = new DataPreprocessor();
    
    // Choose preprocessing type based on options
    const processingType = options.type || 'general';
    let result;

    switch (processingType) {
      case 'email_generation':
        result = preprocessor.preprocessForEmailGeneration(text);
        break;
      case 'contact_extraction':
        result = preprocessor.preprocessText(text, {
          extractStructuredData: true,
          normalizeWhitespace: true
        });
        break;
      case 'quality_assessment':
        result = preprocessor.preprocessText(text, {
          extractStructuredData: true
        });
        break;
      default:
        result = preprocessor.preprocessText(text, options);
    }

    // Add processing metadata
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      processingType,
      originalLength: text.length,
      processedLength: result.processedText.length,
      ...result,
      // Add enhancement suggestions specifically for the chatbot
      chatbotEnhancements: generateChatbotEnhancements(result)
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erreur preprocessing:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors du traitement des données',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Generate specific enhancements for chatbot integration
function generateChatbotEnhancements(preprocessingResult) {
  const enhancements = {
    suggestedPrompts: [],
    missingData: [],
    qualityImprovements: [],
    nextSteps: []
  };

  const { structuredData, quality, suggestions } = preprocessingResult;

  // Suggested prompts based on extracted data
  if (structuredData.emails?.length > 0) {
    enhancements.suggestedPrompts.push(
      `Créer un email professionnel pour ${structuredData.emails[0]}`
    );
  }

  if (structuredData.companies?.length > 0) {
    enhancements.suggestedPrompts.push(
      `Email de prospection pour ${structuredData.companies[0]}`
    );
  }

  if (structuredData.names?.length > 0 && structuredData.companies?.length > 0) {
    enhancements.suggestedPrompts.push(
      `Contacter ${structuredData.names[0]} chez ${structuredData.companies[0]}`
    );
  }

  // Missing data identification
  if (!structuredData.emails?.length) {
    enhancements.missingData.push({
      type: 'email',
      message: 'Adresse email manquante',
      suggestion: 'Ajoutez une adresse email pour personnaliser l\'email'
    });
  }

  if (!structuredData.companies?.length && !structuredData.names?.length) {
    enhancements.missingData.push({
      type: 'contact',
      message: 'Contact ou entreprise manquant',
      suggestion: 'Précisez le nom du contact ou de l\'entreprise cible'
    });
  }

  // Quality improvements
  if (quality.score < 70) {
    enhancements.qualityImprovements.push({
      type: 'content_enhancement',
      message: 'Le contenu pourrait être enrichi',
      suggestions: [
        'Ajouter le contexte du projet ou de la demande',
        'Préciser l\'objectif de l\'email',
        'Inclure des informations sur les besoins du client'
      ]
    });
  }

  if (quality.businessRelevance === 'low') {
    enhancements.qualityImprovements.push({
      type: 'business_context',
      message: 'Contexte business insuffisant',
      suggestions: [
        'Mentionner les solutions Microsoft/Azure pertinentes',
        'Ajouter les bénéfices business attendus',
        'Préciser le timing ou l\'urgence du projet'
      ]
    });
  }

  // Next steps based on data quality
  if (structuredData.emails?.length > 0 && structuredData.companies?.length > 0) {
    enhancements.nextSteps.push({
      action: 'generate_email',
      confidence: 'high',
      message: 'Prêt pour la génération d\'email'
    });
  } else if (structuredData.emails?.length > 0 || structuredData.companies?.length > 0) {
    enhancements.nextSteps.push({
      action: 'request_missing_info',
      confidence: 'medium',
      message: 'Informations partielles - demander les données manquantes'
    });
  } else {
    enhancements.nextSteps.push({
      action: 'guided_input',
      confidence: 'low',
      message: 'Guider l\'utilisateur pour saisir les informations nécessaires'
    });
  }

  return enhancements;
}

// GET endpoint for preprocessing capabilities info
export async function GET(request) {
  return NextResponse.json({
    service: 'Data Preprocessing API',
    version: '1.0.0',
    capabilities: {
      text_normalization: 'Normalisation des espaces, caractères et formats',
      structured_extraction: 'Extraction d\'emails, téléphones, noms, entreprises',
      quality_assessment: 'Évaluation de la qualité et complétude des données',
      business_context: 'Détection du contexte business et suggestions',
      email_optimization: 'Préparation optimisée pour la génération d\'emails'
    },
    processing_types: {
      general: 'Traitement général avec extraction de base',
      email_generation: 'Optimisé pour la génération d\'emails',
      contact_extraction: 'Focus sur l\'extraction des informations de contact',
      quality_assessment: 'Évaluation complète de la qualité des données'
    },
    example_request: {
      text: "Martin Dubois, Microsoft, martin@microsoft.com",
      options: {
        type: "email_generation",
        normalizeWhitespace: true,
        extractStructuredData: true
      }
    }
  });
}