export async function POST(request) {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError.message);
      return Response.json({ 
        error: 'Invalid JSON format', 
        details: 'Make sure your content is properly escaped' 
      }, { status: 400 });
    }
    
    const { content } = requestBody;
    
    if (!content || !content.trim()) {
      return Response.json({ error: 'Content is required' }, { status: 400 });
    }

    const text = content.toLowerCase();
    
    // French sentiment analysis keywords
    const sentimentKeywords = {
      positive: [
        'excellente', 'merci', 'plaisir', 'ravi', 'enchanté', 'parfait', 'superbe',
        'génial', 'formidable', 'magnifique', 'fantastique', 'réussi', 'succès',
        'opportunité', 'bénéfice', 'avantage', 'amélioration', 'optimisation',
        'innovation', 'efficace', 'productif', 'satisfait', 'heureux'
      ],
      negative: [
        'problème', 'erreur', 'échec', 'difficile', 'compliqué', 'impossible',
        'frustrant', 'décevant', 'inquiet', 'préoccupé', 'risque', 'menace',
        'critique', 'urgent', 'bloqué', 'retard', 'coût', 'cher', 'budget',
        'limitation', 'contrainte', 'obstacle'
      ],
      neutral: [
        'information', 'détail', 'donnée', 'fait', 'analyse', 'étude',
        'rapport', 'présentation', 'réunion', 'planning', 'agenda',
        'question', 'demande', 'besoin', 'requirement'
      ]
    };

    // Count sentiment words
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;

    sentimentKeywords.positive.forEach(word => {
      const matches = (text.match(new RegExp(word, 'g')) || []).length;
      positiveScore += matches;
    });

    sentimentKeywords.negative.forEach(word => {
      const matches = (text.match(new RegExp(word, 'g')) || []).length;
      negativeScore += matches;
    });

    sentimentKeywords.neutral.forEach(word => {
      const matches = (text.match(new RegExp(word, 'g')) || []).length;
      neutralScore += matches;
    });

    // Additional context analysis
    const hasExclamation = (text.match(/!/g) || []).length;
    const hasQuestion = (text.match(/\?/g) || []).length;
    const hasCapitalization = (content.match(/[A-Z]{2,}/g) || []).length;
    
    // Professional tone indicators
    const professionalIndicators = [
      'cordialement', 'respectueusement', 'monsieur', 'madame',
      'veuillez', 'je vous prie', 'dans l\'attente'
    ];
    
    const professionalScore = professionalIndicators.reduce((score, indicator) => {
      return score + (text.includes(indicator) ? 1 : 0);
    }, 0);

    // Calculate overall sentiment
    const totalScore = positiveScore + negativeScore + neutralScore;
    let sentiment;
    let confidence;
    
    if (totalScore === 0) {
      sentiment = 'neutral';
      confidence = 0.5;
    } else {
      const positiveRatio = positiveScore / totalScore;
      const negativeRatio = negativeScore / totalScore;
      
      if (positiveRatio > negativeRatio + 0.2) {
        sentiment = 'positive';
        confidence = Math.min(0.95, 0.6 + positiveRatio * 0.4);
      } else if (negativeRatio > positiveRatio + 0.2) {
        sentiment = 'negative';
        confidence = Math.min(0.95, 0.6 + negativeRatio * 0.4);
      } else {
        sentiment = 'neutral';
        confidence = Math.min(0.95, 0.7 + (neutralScore / totalScore) * 0.25);
      }
    }

    // Engagement score calculation
    const wordCount = content.trim().split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const avgSentenceLength = wordCount / Math.max(sentenceCount, 1);
    
    // Engagement factors
    const engagementFactors = {
      wordCount: Math.min(1, wordCount / 200), // Optimal around 200 words
      sentenceVariety: Math.min(1, sentenceCount / 10), // More sentences = better
      personalTouch: (text.includes('nicolas') || text.includes('bayonne')) ? 0.2 : 0,
      callToAction: (hasQuestion > 0 || text.includes('disponibilité') || text.includes('créneaux')) ? 0.3 : 0,
      professional: Math.min(0.3, professionalScore * 0.05),
      enthusiasm: Math.min(0.2, hasExclamation * 0.1)
    };
    
    const engagementScore = Object.values(engagementFactors).reduce((sum, factor) => sum + factor, 0) / Object.keys(engagementFactors).length;

    // Readability score (simplified French readability)
    const readabilityScore = Math.max(0, Math.min(1, 1 - (avgSentenceLength - 15) / 20));
    
    // Professional tone score
    const professionalToneScore = Math.min(1, professionalScore / 3);

    return Response.json({
      sentiment,
      confidence: Math.round(confidence * 100) / 100,
      engagementScore: Math.round(engagementScore * 100) / 100,
      readabilityScore: Math.round(readabilityScore * 100) / 100,
      professionalToneScore: Math.round(professionalToneScore * 100) / 100,
      metrics: {
        wordCount,
        sentenceCount,
        avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
        positiveWords: positiveScore,
        negativeWords: negativeScore,
        neutralWords: neutralScore,
        exclamations: hasExclamation,
        questions: hasQuestion,
        professionalTerms: professionalScore
      },
      suggestions: generateImprovementSuggestions(sentiment, engagementScore, professionalToneScore, wordCount)
    });
    
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return Response.json(
      { error: 'Sentiment analysis failed', details: error.message },
      { status: 500 }
    );
  }
}

function generateImprovementSuggestions(sentiment, engagementScore, professionalScore, wordCount) {
  const suggestions = [];
  
  if (engagementScore < 0.6) {
    suggestions.push("Ajoutez une question ou un call-to-action pour augmenter l'engagement");
  }
  
  if (professionalScore < 0.5) {
    suggestions.push("Utilisez un vocabulaire plus formel (Cordialement, Monsieur/Madame)");
  }
  
  if (wordCount < 50) {
    suggestions.push("Email trop court - développez votre message");
  } else if (wordCount > 300) {
    suggestions.push("Email trop long - condensez le message principal");
  }
  
  if (sentiment === 'negative') {
    suggestions.push("Le ton semble négatif - ajoutez des éléments positifs");
  }
  
  return suggestions;
}