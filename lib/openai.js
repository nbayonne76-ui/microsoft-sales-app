import OpenAI from 'openai';
import { FeedbackService } from './analytics.js';

// Configuration OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

// System prompt optimisé pour des emails Microsoft avec méthodologie de persuasion avancée
const SYSTEM_PROMPT = `Tu es Nicolas BAYONNE, Account Manager Microsoft expert avec 10+ ans d'expérience dans la vente consultative B2B.

# EXPERTISE TECHNIQUE
- Solutions Azure (migration, DevOps, sécurité, optimisation coûts)
- Microsoft 365 (productivité, collaboration, gouvernance)
- Copilot et IA (adoption, change management, ROI)
- Sécurité Microsoft (Zero Trust, conformité, RGPD)

# EXPERTISE COMMERCIALE & PERSUASION
- Analyse des besoins business et techniques
- Construction de business cases ROI avec métriques concrètes
- Maîtrise des 7 principes de Cialdini (réciprocité, rareté, autorité, preuve sociale, cohérence, sympathie, unité)
- Techniques de persuasion éthique : framing gain/perte, pattern interrupts, réduction de friction
- Gestion des objections (coût, complexité, sécurité, résistance au changement)

# ARCHITECTURE D'EMAIL OPTIMALE
Tu dois TOUJOURS structurer tes emails selon ce framework :

1. HOOK (1 phrase) - Capter l'attention immédiatement
   • Utilise personnalisation contextuelle
   • Référence empathique ou donnée intrigante
   • Pattern interrupt si besoin (briser les attentes)

2. VALEUR PRINCIPALE (2-3 phrases)
   • Bénéfices concrets et chiffrés (pas de features génériques)
   • Focus sur les gains mesurables (temps, argent, efficacité)
   • Utilise le framing selon contexte :
     * Gain framing : "Économisez 4,5h/semaine" (phase attraction)
     * Loss framing : "Sans action, vous perdez..." (phase urgence)

3. PREUVE & CRÉDIBILITÉ (liste ou paragraphe court)
   • Données chiffrées récentes (ROI, satisfaction, déploiements)
   • Cas clients similaires avec résultats concrets
   • Témoignages directs quand pertinent
   • Autorité : position Microsoft, expertise technique

4. CALL-TO-ACTION CLAIR
   • UN SEUL CTA principal (ne jamais diluer l'attention)
   • Réduire friction au maximum (plus c'est court, mieux c'est)
   • Progression de friction : Échange 15min → Atelier 30min → POC
   • Toujours proposer choix de créneaux concrets

# PRINCIPES DE PERSUASION À INTÉGRER

**Réciprocité** : Donner de la valeur AVANT de demander
- Partage de cas d'usage gratuits
- Données ROI et insights sectoriels
- Audit ou diagnostic gratuit

**Preuve sociale** : Montrer que d'autres ont adopté
- "Une organisation de votre secteur a déployé..."
- "87% de satisfaction utilisateurs mesurée"
- Références clients similaires (taille, secteur)

**Autorité** : Établir crédibilité
- "Données issues de 1000+ déploiements Microsoft"
- "Avec l'appui d'une équipe de spécialistes techniques"
- Position de point de contact Microsoft officiel

**Rareté** : Créer urgence éthique
- "Places limitées pour les ateliers Q1"
- "Offre valable jusqu'au [date]"
- "Seulement X organisations sélectionnées"

**Cohérence** : S'appuyer sur engagement passé
- Référence aux collaborations antérieures
- "Vous avez été sélectionné" (engagement implicite)
- Rappel des besoins exprimés précédemment

**Sympathie** : Construire relation
- Ton empathique et compréhensif
- "Je comprends que vous êtes sollicité..."
- Respect des limites et du timing client

# ADAPTATION CONTEXTUELLE DU TON

**Enterprise (1000+ employés)**
- Ton : Très formel, professionnel
- Focus : ROI stratégique, gouvernance, conformité
- Preuves : Cas clients grands comptes, chiffres d'impact business
- CTA : Executive briefing, atelier C-level

**PME (50-1000 employés)**
- Ton : Professionnel accessible, pragmatique
- Focus : Efficacité opérationnelle, gains immédiats, rapport qualité/prix
- Preuves : Cas clients PME similaires, ROI rapide
- CTA : Démo personnalisée, atelier pratique

**Startup (<50 employés)**
- Ton : Décontracté expert, dynamique
- Focus : Innovation, agilité, scalabilité, time-to-market
- Preuves : Startups à forte croissance, rapidité déploiement
- CTA : Session rapide, POC agile

# RÈGLES STRICTES
- Maximum 250 mots (150-250 optimal pour taux de lecture)
- UN SEUL message central par email (ne pas diluer)
- Toujours des exemples CHIFFRÉS (%, €, heures, jours)
- Éviter jargon commercial générique ("solution innovante", "meilleur de sa catégorie")
- Signature systématique : "Nicolas BAYONNE\\nMicrosoft Account Manager"
- Ne JAMAIS inventer de données techniques ou financières
- Toujours terminer par un CTA SPÉCIFIQUE (pas "N'hésitez pas à me contacter")

# TECHNIQUES PSYCHOLOGIQUES AVANCÉES

**Pattern Interrupt** : Briser les attentes pour capter attention
- Sujet inhabituel : "[Nom] - ROI : 4,5h/semaine" au lieu de "Re: Copilot"
- Ouverture transparente : "N'ayant pas eu de retour..." (empathie inattendue)
- Inversion CTA : "Si vous préférez que je cesse..." (donner contrôle)

**Réduction progressive de friction**
- Email 1 : "15 minutes d'échange" (engagement modéré)
- Email 2 : "Atelier 30min" (si intérêt montré)
- Email 3 : "Appel rapide 5min" (urgence + facilité)
- Email 4 : "Simple réponse aux questions" (friction minimale)

**Ancrage de valeur**
- Toujours présenter bénéfice AVANT prix
- "4,5h économisées/semaine = 18h/mois = 2,5 jours productifs"
- ROI timeline : "Positif après 3,4 mois en moyenne"

# FORMAT DE RÉPONSE ATTENDU
Objet: [Personnalisé, accrocheur, spécifique]

[Hook captivant]

[Valeur avec chiffres]

[Preuve crédible]

[CTA clair et spécifique]

[Signature]`;


// Fonction principale de génération d'email intelligente
export async function generateIntelligentEmail({ 
  context, 
  intent, 
  clientProfile, 
  previousInteractions = [] 
}) {
  
  // Si pas de clé API, utilise le mode simulation
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
    return generateMockEmail({ context, intent, clientProfile, previousInteractions });
  }

  try {
    // Récupérer les patterns d'apprentissage pour enrichir le prompt
    const learningPatterns = await FeedbackService.getLearningPatterns(
      context, 
      clientProfile?.segment
    );
    
    // Construction du prompt contextuel enrichi avec l'apprentissage
    const prompt = buildContextualPrompt({ 
      context, 
      intent, 
      clientProfile, 
      previousInteractions,
      learningPatterns 
    });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modèle rapide et économique
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      max_tokens: 600, // Optimisé pour 350 mots max
      temperature: 0.6, // Équilibre créativité/consistance
      top_p: 0.9, // Focus sur les tokens les plus probables
      frequency_penalty: 0.3, // Évite la répétition
      presence_penalty: 0.2, // Encourage la diversité
    });

    const generatedContent = completion.choices[0]?.message?.content;
    
    if (!generatedContent) {
      throw new Error('Pas de contenu généré');
    }

    return {
      content: generatedContent,
      reasoning: `Généré par GPT-4 basé sur : ${getReasoningFromContext({ context, clientProfile, previousInteractions })}`,
      suggestions: generateSmartSuggestions({ context, intent, clientProfile }),
      confidence: 0.95 // Haute confiance avec vraie IA
    };

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Fallback vers simulation si API fail
    const fallback = generateMockEmail({ context, intent, clientProfile, previousInteractions });
    return {
      ...fallback,
      reasoning: `Simulation (API indisponible) - ${fallback.reasoning}`,
      confidence: 0.75
    };
  }
}

// Construction du prompt contextuel optimisé avec apprentissage et analyse psychologique
function buildContextualPrompt({ context, intent, clientProfile, previousInteractions, learningPatterns = [] }) {
  let prompt = `🎯 MISSION EMAIL :\n${intent}\n\n`;

  prompt += `📊 CONTEXTE BUSINESS ANALYSÉ :\n${context}\n\n`;

  // Analyse du profil client avec recommandations psychologiques
  if (clientProfile.company) {
    prompt += `👤 PROFIL CLIENT DÉTAILLÉ :\n`;
    prompt += `• Entreprise : ${clientProfile.company}\n`;
    prompt += `• Segment : ${getSegmentDescription(clientProfile.segment)}\n`;
    if (clientProfile.industry) prompt += `• Secteur d'activité : ${clientProfile.industry}\n`;
    if (clientProfile.currentChallenges) prompt += `• Challenges identifiés : ${clientProfile.currentChallenges}\n`;
    prompt += `\n`;
  }

  // Analyse de l'historique avec insights comportementaux
  if (previousInteractions.length > 0) {
    prompt += `📅 HISTORIQUE RELATIONNEL :\n`;
    previousInteractions.forEach((interaction, i) => {
      prompt += `${i + 1}. ${interaction.type} → ${interaction.response} (${interaction.sentiment})\n`;
    });

    // Analyse du comportement pour adapter l'approche
    const engagementLevel = analyzeEngagement(previousInteractions);
    prompt += `\n🧠 ANALYSE COMPORTEMENTALE :\n`;
    prompt += `• Niveau d'engagement : ${engagementLevel.level}\n`;
    prompt += `• Stratégie recommandée : ${engagementLevel.strategy}\n`;
    prompt += `• Principe de persuasion optimal : ${engagementLevel.persuasion_principle}\n\n`;
  }

  // Détection et recommandations psychologiques contextuelles
  const psychoAnalysis = analyzePsychologicalContext(context, clientProfile, previousInteractions);

  prompt += `🎭 STRATÉGIE DE PERSUASION RECOMMANDÉE :\n`;
  prompt += `• Principes Cialdini à utiliser : ${psychoAnalysis.cialdini_principles.join(', ')}\n`;
  prompt += `• Type de framing : ${psychoAnalysis.framing_type}\n`;
  prompt += `• Niveau de friction CTA : ${psychoAnalysis.cta_friction}\n`;
  prompt += `• Techniques spéciales : ${psychoAnalysis.special_techniques.join(', ')}\n\n`;

  // Instructions détaillées enrichies
  prompt += `⚡ INSTRUCTIONS DE GÉNÉRATION :\n`;
  prompt += `1. STRUCTURE selon framework : Hook → Valeur chiffrée → Preuve → CTA unique\n`;
  prompt += `2. INTÈGRE les principes de persuasion recommandés ci-dessus de manière SUBTILE\n`;
  prompt += `3. ADAPTE le ton selon segment : ${getToneGuidance(clientProfile.segment)}\n`;
  prompt += `4. UTILISE ${psychoAnalysis.framing_type} (gains mesurables ou pertes évitées)\n`;
  prompt += `5. CTA avec friction ${psychoAnalysis.cta_friction} : ${getCTAExample(psychoAnalysis.cta_friction)}\n`;
  prompt += `6. INCLUS minimum 2-3 chiffres concrets (ROI, %, temps, €)\n`;
  prompt += `7. ÉVITE absolument : jargon générique, features sans bénéfices, multiples CTA\n`;
  prompt += `8. LONGUEUR : 150-250 mots maximum\n\n`;

  // Contexte temporel et urgence
  const urgencyKeywords = ['urgent', 'rapidement', 'deadline', 'important', 'expire'];
  const isUrgent = urgencyKeywords.some(word => context.toLowerCase().includes(word));
  if (isUrgent) {
    prompt += `⚠️ URGENCE DÉTECTÉE :\n`;
    prompt += `• Utilise principe de RARETÉ (deadline, places limitées)\n`;
    prompt += `• Loss framing : "Sans action avant [date], vous risquez..."\n`;
    prompt += `• CTA immédiat avec créneaux précis dans les 48-72h\n`;
    prompt += `• Pattern interrupt dans le sujet : "[URGENT]" ou "[Point important]"\n\n`;
  }

  // Détection de résistance/objections
  const objectionKeywords = ['coût', 'cher', 'prix', 'budget', 'complexe', 'difficile', 'temps'];
  const hasObjections = objectionKeywords.some(word => context.toLowerCase().includes(word));
  if (hasObjections) {
    prompt += `💡 OBJECTIONS DÉTECTÉES :\n`;
    const objection = objectionKeywords.find(word => context.toLowerCase().includes(word));
    prompt += `• Type : ${objection}\n`;
    prompt += `• Contre-argument : ${getObjectionResponse(objection)}\n`;
    prompt += `• Tactique : Réciprocité (donner audit/diagnostic gratuit) + Ancrage de valeur\n\n`;
  }

  // Intégrer les patterns d'apprentissage
  if (learningPatterns.length > 0) {
    prompt += `🧠 PATTERNS D'APPRENTISSAGE (basés sur succès passés) :\n`;
    learningPatterns.forEach((pattern, index) => {
      prompt += `${index + 1}. [${pattern.patternType}] ${pattern.description} (${Math.round(pattern.confidenceScore * 100)}% succès)\n`;
    });
    prompt += `\n⚡ Applique ces patterns gagnants dans ton email !\n\n`;
  }

  // Exemples de preuves sociales contextuelles
  if (clientProfile.industry) {
    prompt += `📊 PREUVES SOCIALES À PRIVILÉGIER :\n`;
    prompt += `• Cas client secteur "${clientProfile.industry}" avec résultats chiffrés\n`;
    prompt += `• "87% de satisfaction mesurée auprès de clients similaires"\n`;
    prompt += `• "Déploiement réussi chez ${getSocialProofExample(clientProfile.industry)}"\n\n`;
  }

  prompt += `📧 FORMAT FINAL ATTENDU :\n`;
  prompt += `Objet: [Personnalisé avec nom/chiffre/urgence selon contexte]\n\n`;
  prompt += `[Hook captivant - 1 phrase]\n\n`;
  prompt += `[Valeur avec 2-3 chiffres concrets]\n\n`;
  prompt += `[Preuve sociale ou autorité]\n\n`;
  prompt += `[UN SEUL CTA clair avec proposition concrète]\n\n`;
  prompt += `Cordialement,\n\nNicolas BAYONNE\nMicrosoft Account Manager`;

  return prompt;
}

// Analyse du niveau d'engagement basé sur l'historique
function analyzeEngagement(interactions) {
  const openCount = interactions.filter(i => i.type === 'opened').length;
  const clickCount = interactions.filter(i => i.type === 'clicked').length;
  const positiveCount = interactions.filter(i => i.sentiment === 'positive').length;

  const totalScore = (openCount * 1) + (clickCount * 2) + (positiveCount * 3);

  if (totalScore >= 5) {
    return {
      level: 'ÉLEVÉ (Hot lead)',
      strategy: 'Accélérer vers conversion - Proposer POC ou atelier immédiat',
      persuasion_principle: 'Cohérence + Preuve sociale'
    };
  } else if (totalScore >= 2) {
    return {
      level: 'MOYEN (Warm lead)',
      strategy: 'Renforcer intérêt - Focus ROI concret et cas clients',
      persuasion_principle: 'Preuve sociale + Autorité'
    };
  } else {
    return {
      level: 'FAIBLE (Cold lead)',
      strategy: 'Capter attention - Pattern interrupt + Réciprocité forte',
      persuasion_principle: 'Réciprocité + Rareté'
    };
  }
}

// Analyse psychologique du contexte pour recommander stratégie
function analyzePsychologicalContext(context, clientProfile, previousInteractions) {
  const analysis = {
    cialdini_principles: [],
    framing_type: 'Gain framing',
    cta_friction: 'Faible (15min)',
    special_techniques: []
  };

  // Déterminer principes Cialdini pertinents
  if (previousInteractions.length > 0) {
    analysis.cialdini_principles.push('Cohérence');
  }

  if (context.toLowerCase().includes('urgent') || context.toLowerCase().includes('deadline')) {
    analysis.cialdini_principles.push('Rareté');
    analysis.framing_type = 'Loss framing (urgence)';
    analysis.cta_friction = 'Très faible (5min)';
  }

  if (context.toLowerCase().includes('coût') || context.toLowerCase().includes('budget')) {
    analysis.cialdini_principles.push('Réciprocité', 'Autorité');
    analysis.special_techniques.push('Ancrage de valeur', 'ROI chiffré');
  }

  if (clientProfile.segment === 'enterprise') {
    analysis.cialdini_principles.push('Autorité', 'Preuve sociale');
    analysis.special_techniques.push('Cas clients grands comptes');
  }

  // Par défaut, toujours utiliser réciprocité
  if (analysis.cialdini_principles.length === 0) {
    analysis.cialdini_principles.push('Réciprocité', 'Preuve sociale');
  }

  return analysis;
}

// Guidance sur le ton selon segment
function getToneGuidance(segment) {
  const guidance = {
    enterprise: 'Très formel, focus stratégie et gouvernance',
    sme: 'Professionnel accessible, focus résultats pratiques',
    startup: 'Décontracté expert, focus innovation et rapidité'
  };
  return guidance[segment] || 'Professionnel équilibré';
}

// Exemples de CTA selon niveau de friction
function getCTAExample(friction) {
  const examples = {
    'Très faible (5min)': '"Êtes-vous disponible pour un appel rapide de 5 minutes jeudi ou vendredi ?"',
    'Faible (15min)': '"Pouvons-nous échanger 15 minutes cette semaine ? Je propose mardi 14h ou jeudi 10h"',
    'Moyenne (30min)': '"Que diriez-vous d\'un atelier de 30min pour explorer les opportunités ?"'
  };
  return examples[friction] || examples['Faible (15min)'];
}

// Réponses aux objections courantes
function getObjectionResponse(objection) {
  const responses = {
    'coût': 'ROI positif après 3-4 mois + Économies chiffrées (4,5h/semaine/personne)',
    'cher': 'Coût vs valeur - 20€/mois = 0,80€/jour pour 4,5h gagnées/semaine',
    'prix': 'Offre actuelle -20% + Audit gratuit inclus',
    'budget': 'Options de paiement flexibles + Programme migration avec incentives',
    'complexe': 'Accompagnement 360° inclus + Formation équipes + Support 24/7',
    'difficile': 'POC de 2 semaines sans engagement pour valider facilité',
    'temps': 'Déploiement progressif par phases + ROI dès la première phase'
  };
  return responses[objection] || 'Audit gratuit pour évaluer ensemble';
}

// Exemples de preuve sociale par secteur
function getSocialProofExample(industry) {
  const examples = {
    'Santé': 'CHU de Lyon, Hôpitaux de Paris',
    'Public': 'Ministères et collectivités territoriales',
    'Finance': 'Grandes banques et assurances françaises',
    'Industrie': 'Leaders industriels européens',
    'Tech': 'Scale-ups et licornes françaises',
    'Retail': 'Enseignes nationales de distribution'
  };
  return examples[industry] || 'organisations de taille similaire';
}

function getSegmentDescription(segment) {
  const descriptions = {
    enterprise: 'Grande entreprise (1000+ employés) - Décision committee, process formels',
    sme: 'PME (50-1000 employés) - Décision rapide, focus ROI pratique',
    startup: 'Startup (<50 employés) - Innovation, agilité, croissance rapide'
  };
  return descriptions[segment] || segment;
}

function getReasoningFromContext({ context, clientProfile, previousInteractions }) {
  const elements = [];
  
  if (context.toLowerCase().includes('migration')) elements.push('migration technique');
  if (context.toLowerCase().includes('coût') || context.toLowerCase().includes('budget')) elements.push('préoccupations budgétaires');
  if (context.toLowerCase().includes('sécurité')) elements.push('enjeux sécurité');
  if (clientProfile.segment) elements.push(`profil ${clientProfile.segment}`);
  if (previousInteractions.length > 0) elements.push('historique client');
  
  return elements.length > 0 ? elements.join(', ') : 'contexte général';
}

function generateSmartSuggestions({ context, intent, clientProfile }) {
  const suggestions = [];
  
  // Suggestions basées sur le contexte
  if (context.toLowerCase().includes('migration')) {
    suggestions.push('Proposer un POC Azure gratuit');
    suggestions.push('Organiser une session avec un architecte solution');
  }
  
  if (context.toLowerCase().includes('coût')) {
    suggestions.push('Présenter un business case ROI');
    suggestions.push('Planifier un workshop optimisation coûts');
  }
  
  // Suggestions basées sur le profil
  if (clientProfile.segment === 'enterprise') {
    suggestions.push('Executive briefing avec leadership Microsoft');
  } else if (clientProfile.segment === 'startup') {
    suggestions.push('Présentation Microsoft for Startups program');
  }
  
  // Suggestions génériques
  suggestions.push('Follow-up avec étude de cas similaire');
  suggestions.push('Démonstration produit personnalisée');
  
  return suggestions.slice(0, 4); // Max 4 suggestions
}

// Simulation pour développement/tests (quand pas de clé API)
function generateMockEmail({ context, intent, clientProfile, previousInteractions }) {
  
  const mockTemplates = {
    migration: `Objet: 🚀 Votre projet de migration Azure - Approche personnalisée

Bonjour,

Suite à notre discussion sur votre projet de migration, j'ai analysé votre contexte et je pense pouvoir vous accompagner efficacement.

Approche recommandée :
• Assessment détaillé de votre infrastructure existante
• Plan de migration par phases pour minimiser les risques  
• Accompagnement change management pour vos équipes
• Support 24/7 pendant la transition

${previousInteractions.length > 0 ? 'Tenant compte de nos échanges précédents, ' : ''}je vous propose d'organiser un atelier de 2h pour définir ensemble la roadmap optimale.

Êtes-vous disponible cette semaine pour en discuter ?

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`,

    budget: `Objet: 💰 Optimisation de votre investissement Microsoft

Bonjour,

Je comprends vos préoccupations budgétaires et j'ai de bonnes nouvelles à vous annoncer !

Opportunités identifiées :
• Consolidation des licences pour réduire les coûts
• Optimisation de votre mix produits existant
• Utilisation des crédits Azure disponibles
• Programme de migration avec incentives financiers

Une analyse rapide de votre environnement pourrait vous faire économiser 15-25% sur votre facture Microsoft actuelle.

Que diriez-vous d'un audit gratuit de 30 minutes ?

Bien à vous,

Nicolas BAYONNE
Microsoft Account Manager`,

    general: `Objet: Votre projet Microsoft - Prochaines étapes

Bonjour,

J'espère que vous allez bien.

Concernant votre projet Microsoft, j'aimerais vous proposer une approche personnalisée qui tient compte de vos spécificités.

${clientProfile.segment === 'enterprise' ? 
  'En tant qu\'organisation de premier plan, vous méritez un accompagnement premium.' : 
  clientProfile.segment === 'startup' ? 
  'Votre agilité est un atout - adaptons Microsoft à votre rythme de croissance !' :
  'Optimisons ensemble votre productivité avec les bonnes solutions Microsoft.'}

Seriez-vous disponible pour un échange de 30 minutes cette semaine ?

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`
  };

  // Sélection du template selon le contexte
  let selectedTemplate = mockTemplates.general;
  if (context.toLowerCase().includes('migration') || context.toLowerCase().includes('azure')) {
    selectedTemplate = mockTemplates.migration;
  } else if (context.toLowerCase().includes('coût') || context.toLowerCase().includes('budget')) {
    selectedTemplate = mockTemplates.budget;
  }

  return {
    content: selectedTemplate,
    reasoning: `Simulation avancée basée sur : ${getReasoningFromContext({ context, clientProfile, previousInteractions })}`,
    suggestions: generateSmartSuggestions({ context, intent, clientProfile }),
    confidence: 0.85
  };
}