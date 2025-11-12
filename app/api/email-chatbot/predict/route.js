export async function POST(request) {
  try {
    const { input, conversationState, emailData, conversationHistory } = await request.json();
    
    if (!input || input.length < 3) {
      return Response.json({ predictions: [] });
    }

    const predictions = generatePredictiveText(input, {
      conversationState,
      emailData,
      conversationHistory
    });

    return Response.json({ predictions });

  } catch (error) {
    console.error('❌ Predictive text error:', error);
    return Response.json({ predictions: [] });
  }
}

function generatePredictiveText(currentInput, conversationContext) {
  const predictions = [];
  const inputLower = currentInput.toLowerCase();
  const { conversationState, emailData } = conversationContext;
  
  // Predict based on conversation flow
  if (conversationState === 'initial') {
    if (inputLower.includes('je')) {
      predictions.push('je dois contacter un nouveau prospect Azure');
      predictions.push('je veux faire un suivi de réunion technique');
      predictions.push('je souhaite présenter une offre Microsoft');
    }
    if (inputLower.includes('il faut')) {
      predictions.push('il faut que j\'envoie une proposition commerciale');
      predictions.push('il faut relancer ce client silencieux depuis 2 semaines');
    }
    if (inputLower.includes('nouveau')) {
      predictions.push('nouveau prospect intéressé par Azure migration');
      predictions.push('nouveau contact commercial à développer');
    }
    if (inputLower.includes('suivi')) {
      predictions.push('suivi de notre réunion technique d\'hier');
      predictions.push('suivi commercial après démonstration Azure');
    }
    if (inputLower.includes('relance')) {
      predictions.push('relance douce après 2 semaines sans réponse');
      predictions.push('relance avec nouvelle proposition de valeur');
    }
    if (inputLower.includes('offre') || inputLower.includes('proposition')) {
      predictions.push('offre commerciale Microsoft Azure migration');
      predictions.push('proposition personnalisée selon leurs besoins');
    }
  }
  
  if (conversationState === 'gathering_info') {
    // Name predictions
    if (inputLower.includes('monsieur') || inputLower.includes('m.')) {
      predictions.push('Monsieur Dupont, CTO chez Microsoft France');
      predictions.push('M. Martin, responsable infrastructure chez TechCorp');
    }
    if (inputLower.includes('madame') || inputLower.includes('mme')) {
      predictions.push('Madame Leroy, directrice technique chez StartupTech');
      predictions.push('Mme Sophie Martin, IT Manager chez Azure Solutions');
    }
    
    // Company predictions
    if (inputLower.includes('entreprise') || inputLower.includes('société')) {
      predictions.push('entreprise TechCorp spécialisée en transformation digitale');
      predictions.push('société Microsoft France - Issy-les-Moulineaux');
    }
    if (inputLower.includes('startup')) {
      predictions.push('startup TechSolutions cherchant infrastructure cloud');
      predictions.push('startup en scaling rapide sur Azure');
    }
    
    // Email predictions
    if (inputLower.includes('@')) {
      const emailPart = inputLower.split('@')[0];
      const domain = inputLower.split('@')[1];
      if (domain && !domain.includes('.')) {
        predictions.push(`${emailPart}@${domain}.com`);
        predictions.push(`${emailPart}@${domain}.fr`);
      }
    }
    if (emailData.recipientName && emailData.company && !inputLower.includes('@')) {
      const firstName = emailData.recipientName.split(' ')[0].toLowerCase();
      const companyShort = emailData.company.toLowerCase().replace(/[\s\-\.]/g, '').substring(0, 8);
      predictions.push(`${firstName}@${companyShort}.com`);
      predictions.push(`contact@${companyShort}.fr`);
    }
    
    // Context-based suggestions
    if (inputLower.includes('urgent') || inputLower.includes('important')) {
      predictions.push('urgent - décision attendue avant vendredi');
      predictions.push('important projet de transformation digitale');
    }
  }
  
  // Smart common patterns
  if (inputLower.includes('azure')) {
    predictions.push('Azure migration avec accompagnement personnalisé');
    predictions.push('Azure infrastructure et optimisation des coûts');
  }
  if (inputLower.includes('microsoft')) {
    predictions.push('Microsoft 365 et solutions cloud intégrées');
    predictions.push('Microsoft Azure pour leur transformation digitale');
  }
  if (inputLower.includes('migration')) {
    predictions.push('migration cloud sécurisée et progressive');
    predictions.push('migration infrastructure vers Azure avec ROI optimisé');
  }
  
  // Remove duplicates and limit to 3 predictions
  return [...new Set(predictions)].slice(0, 3);
}