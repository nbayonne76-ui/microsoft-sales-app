import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux (max 10MB)' },
        { status: 400 }
      );
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Configuration Tesseract optimisée pour les emails/documents business
    const tesseractConfig = {
      logger: () => {}, // Désactiver les logs pour l'API
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0',
    };

    // Exécuter l'OCR
    const { data } = await Tesseract.recognize(
      buffer,
      'fra+eng', // Français et anglais
      {
        ...tesseractConfig,
        // Paramètres optimisés pour le texte business
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,;:!?@-_()[]{}"/\\\'àéèêëïîôùûüÿç',
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK
      }
    );

    const extractedText = data.text.trim();

    // Post-traitement du texte
    const processedText = extractedText
      // Nettoyer les espaces multiples
      .replace(/\s+/g, ' ')
      // Nettoyer les sauts de ligne multiples
      .replace(/\n\s*\n/g, '\n')
      // Supprimer les espaces en début/fin de lignes
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')
      .trim();

    // Analyser la qualité du texte extrait
    const confidence = data.confidence;
    const wordCount = processedText.split(/\s+/).length;
    
    // Détection automatique du contenu
    const contentAnalysis = analyzeExtractedContent(processedText);

    return NextResponse.json({
      success: true,
      text: processedText,
      rawText: extractedText,
      confidence: Math.round(confidence),
      wordCount,
      contentAnalysis,
      suggestions: generateTextSuggestions(processedText, contentAnalysis)
    });

  } catch (error) {
    console.error('Erreur OCR:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors du traitement de l\'image',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Analyser le contenu extrait pour détecter le type de document
function analyzeExtractedContent(text) {
  const lowerText = text.toLowerCase();
  
  const analysis = {
    type: 'unknown',
    language: 'fr', // Par défaut français
    businessRelevant: false,
    containsEmail: false,
    containsPhone: false,
    containsCompany: false,
    containsNames: false
  };

  // Détecter les emails
  if (/@\w+\.\w+/.test(text)) {
    analysis.containsEmail = true;
    analysis.businessRelevant = true;
  }

  // Détecter les numéros de téléphone
  if (/(?:\+33|0)[1-9](?:[.\-\s]?\d{2}){4}/.test(text)) {
    analysis.containsPhone = true;
    analysis.businessRelevant = true;
  }

  // Détecter les noms d'entreprises (mots clés courants)
  const companyKeywords = [
    'microsoft', 'azure', 'office', 'teams', 'outlook',
    'société', 'entreprise', 'sarl', 'sas', 'sa',
    'ltd', 'inc', 'corp', 'group', 'holding'
  ];
  
  if (companyKeywords.some(keyword => lowerText.includes(keyword))) {
    analysis.containsCompany = true;
    analysis.businessRelevant = true;
  }

  // Détecter le type de document
  if (lowerText.includes('facture') || lowerText.includes('invoice')) {
    analysis.type = 'invoice';
    analysis.businessRelevant = true;
  } else if (lowerText.includes('contrat') || lowerText.includes('contract')) {
    analysis.type = 'contract';
    analysis.businessRelevant = true;
  } else if (lowerText.includes('devis') || lowerText.includes('quote')) {
    analysis.type = 'quote';
    analysis.businessRelevant = true;
  } else if (analysis.containsEmail && analysis.containsPhone) {
    analysis.type = 'contact_info';
    analysis.businessRelevant = true;
  } else if (lowerText.includes('réunion') || lowerText.includes('meeting')) {
    analysis.type = 'meeting_notes';
    analysis.businessRelevant = true;
  }

  // Détecter la langue (simple heuristique)
  const frenchWords = ['le', 'la', 'les', 'de', 'du', 'des', 'et', 'à', 'avec', 'pour'];
  const englishWords = ['the', 'and', 'or', 'with', 'for', 'to', 'in', 'on', 'at'];
  
  const frenchScore = frenchWords.reduce((score, word) => 
    score + (lowerText.split(word).length - 1), 0);
  const englishScore = englishWords.reduce((score, word) => 
    score + (lowerText.split(word).length - 1), 0);
  
  if (englishScore > frenchScore) {
    analysis.language = 'en';
  }

  // Détecter les noms propres (mots commençant par une majuscule)
  const properNouns = text.match(/\b[A-Z][a-z]+\b/g);
  if (properNouns && properNouns.length > 2) {
    analysis.containsNames = true;
  }

  return analysis;
}

// Générer des suggestions basées sur le contenu extrait
function generateTextSuggestions(text, analysis) {
  const suggestions = [];

  if (analysis.businessRelevant) {
    suggestions.push('💼 Contenu professionnel détecté');
    
    if (analysis.containsEmail) {
      suggestions.push('📧 Email(s) détecté(s) - Ajouter aux contacts ?');
    }
    
    if (analysis.containsPhone) {
      suggestions.push('📞 Numéro(s) de téléphone détecté(s)');
    }
    
    if (analysis.containsCompany) {
      suggestions.push('🏢 Information d\'entreprise détectée');
    }
  }

  switch (analysis.type) {
    case 'invoice':
      suggestions.push('🧾 Facture détectée - Créer un email de suivi ?');
      break;
    case 'contract':
      suggestions.push('📄 Contrat détecté - Créer un email de négociation ?');
      break;
    case 'quote':
      suggestions.push('💰 Devis détecté - Créer un email de suivi commercial ?');
      break;
    case 'contact_info':
      suggestions.push('👤 Informations de contact - Créer un email de prospection ?');
      break;
    case 'meeting_notes':
      suggestions.push('📝 Notes de réunion - Créer un email de suivi ?');
      break;
  }

  if (text.length > 500) {
    suggestions.push('📝 Texte long détecté - Résumer pour email ?');
  }

  return suggestions.slice(0, 4); // Limiter à 4 suggestions
}