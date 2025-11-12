/**
 * AI Agent Knowledge Base Enrichment System
 *
 * Enrichit le contexte de l'AI agent avec des informations précises
 * de la Microsoft Knowledge Base pour des réponses plus pertinentes et factuelles.
 */

import { microsoftKnowledgeBase } from './microsoft-knowledge-base.js';

export class AIAgentKBEnrichment {
  constructor() {
    this.kb = microsoftKnowledgeBase;
  }

  /**
   * Enrichit le contexte complet pour l'AI agent
   * @param {Object} params - Paramètres de génération
   * @returns {Object} Contexte enrichi avec KB
   */
  enrichContext({ context, intent, clientProfile, previousInteractions }) {
    console.log('🔍 KB Enrichment - Starting analysis...');

    const enrichedData = {
      // Données originales
      originalContext: context,
      originalIntent: intent,
      clientProfile: clientProfile,

      // Enrichissement KB
      relevantSolutions: this.findRelevantSolutions(clientProfile, intent, context),
      industryInsights: this.getIndustryInsights(clientProfile),
      solutionDetails: [],
      competitivePositioning: [],
      businessValuePoints: [],
      useCaseExamples: [],
      pricingGuidance: null,
      implementationTimeline: null,
      targetDecisionMakers: [],

      // Métadonnées d'enrichissement
      enrichmentQuality: 0,
      dataSourcesUsed: []
    };

    // Enrichir chaque solution pertinente
    enrichedData.relevantSolutions.forEach(solutionKey => {
      const solution = this.kb.solutions[solutionKey];
      if (solution) {
        enrichedData.solutionDetails.push({
          key: solutionKey,
          name: solution.name,
          category: solution.category,
          shortDescription: solution.shortDescription,
          detailedDescription: solution.detailedDescription,
          businessValue: solution.businessValue,
          useCases: solution.useCases,
          targetAudience: solution.targetAudience,
          pricing: solution.pricing,
          implementation: solution.implementation,
          competitors: solution.competitors
        });

        // Agréger les points de valeur métier
        enrichedData.businessValuePoints.push(...solution.businessValue);

        // Agréger les use cases
        enrichedData.useCaseExamples.push(...solution.useCases.map(uc => ({
          solution: solution.name,
          useCase: uc
        })));

        // Agréger les décideurs cibles
        enrichedData.targetDecisionMakers.push(...solution.targetAudience);

        // Positioning compétitif
        if (solution.competitors && solution.competitors.length > 0) {
          enrichedData.competitivePositioning.push({
            solution: solution.name,
            competitors: solution.competitors,
            differentiators: this.getCompetitiveDifferentiators(solutionKey)
          });
        }
      }
    });

    // Déduplication
    enrichedData.targetDecisionMakers = [...new Set(enrichedData.targetDecisionMakers)];
    enrichedData.businessValuePoints = [...new Set(enrichedData.businessValuePoints)];

    // Guidance pricing et timeline
    if (enrichedData.solutionDetails.length > 0) {
      enrichedData.pricingGuidance = this.aggregatePricingGuidance(enrichedData.solutionDetails);
      enrichedData.implementationTimeline = this.aggregateImplementationTimeline(enrichedData.solutionDetails);
    }

    // Calculer la qualité de l'enrichissement
    enrichedData.enrichmentQuality = this.calculateEnrichmentQuality(enrichedData);

    enrichedData.dataSourcesUsed = [
      'Microsoft Solutions Knowledge Base',
      'Industry-specific recommendations',
      'Competitive analysis database'
    ];

    console.log(`✅ KB Enrichment complete:`, {
      solutions: enrichedData.relevantSolutions.length,
      businessValuePoints: enrichedData.businessValuePoints.length,
      useCases: enrichedData.useCaseExamples.length,
      quality: `${Math.round(enrichedData.enrichmentQuality * 100)}%`
    });

    return enrichedData;
  }

  /**
   * Trouve les solutions Microsoft pertinentes
   */
  findRelevantSolutions(clientProfile, intent, context) {
    const relevantSolutions = new Set();
    const contextLower = (context || '').toLowerCase();
    const intentLower = (intent || '').toLowerCase();

    // 1. Solutions basées sur l'industrie
    if (clientProfile?.industry) {
      const industryKey = this.mapIndustryToKnowledgeBase(clientProfile.industry);
      if (this.kb.industries[industryKey]) {
        this.kb.industries[industryKey].solutions.forEach(sol => relevantSolutions.add(sol));
      }
    }

    // 2. Solutions basées sur l'intent
    const intentMapping = {
      'migration': ['azure-migrate', 'azure-security-center'],
      'cloud': ['azure-migrate', 'microsoft-365'],
      'sécurité': ['azure-security-center', 'microsoft-365'],
      'security': ['azure-security-center', 'microsoft-365'],
      'collaboration': ['microsoft-365', 'power-platform'],
      'productivité': ['microsoft-365', 'power-platform'],
      'productivity': ['microsoft-365', 'power-platform'],
      'données': ['azure-ai', 'power-platform'],
      'data': ['azure-ai', 'power-platform'],
      'analytics': ['azure-ai', 'power-platform'],
      'crm': ['dynamics-365'],
      'erp': ['dynamics-365'],
      'ventes': ['dynamics-365'],
      'sales': ['dynamics-365'],
      'ia': ['azure-ai'],
      'ai': ['azure-ai'],
      'intelligence': ['azure-ai'],
      'automation': ['power-platform', 'azure-ai'],
      'automatisation': ['power-platform', 'azure-ai']
    };

    Object.keys(intentMapping).forEach(keyword => {
      if (intentLower.includes(keyword) || contextLower.includes(keyword)) {
        intentMapping[keyword].forEach(sol => relevantSolutions.add(sol));
      }
    });

    // 3. Solutions basées sur les challenges client
    if (clientProfile?.currentChallenges) {
      const challengesLower = clientProfile.currentChallenges.toLowerCase();

      if (challengesLower.includes('coût') || challengesLower.includes('budget') || challengesLower.includes('cost')) {
        relevantSolutions.add('azure-migrate'); // Réduction coûts infra
        relevantSolutions.add('power-platform'); // ROI élevé
      }

      if (challengesLower.includes('cyber') || challengesLower.includes('sécurité') || challengesLower.includes('conformité')) {
        relevantSolutions.add('azure-security-center');
      }

      if (challengesLower.includes('télétravail') || challengesLower.includes('remote') || challengesLower.includes('hybride')) {
        relevantSolutions.add('microsoft-365');
      }

      if (challengesLower.includes('innovation') || challengesLower.includes('digital') || challengesLower.includes('transformation')) {
        relevantSolutions.add('power-platform');
        relevantSolutions.add('azure-ai');
      }
    }

    // 4. Solutions basées sur la taille de l'entreprise
    if (clientProfile?.segment) {
      if (clientProfile.segment === 'enterprise') {
        relevantSolutions.add('dynamics-365');
        relevantSolutions.add('azure-security-center');
      } else if (clientProfile.segment === 'sme') {
        relevantSolutions.add('microsoft-365');
        relevantSolutions.add('power-platform');
      }
    }

    // 5. Si aucune solution trouvée, proposer un ensemble par défaut
    if (relevantSolutions.size === 0) {
      return ['microsoft-365', 'azure-migrate', 'azure-security-center']; // Solutions génériques
    }

    // Limiter à 5 solutions max pour éviter l'overload
    return Array.from(relevantSolutions).slice(0, 5);
  }

  /**
   * Récupère les insights spécifiques à l'industrie
   */
  getIndustryInsights(clientProfile) {
    if (!clientProfile?.industry) {
      return null;
    }

    const industryKey = this.mapIndustryToKnowledgeBase(clientProfile.industry);
    const industryData = this.kb.industries[industryKey];

    if (!industryData) {
      return null;
    }

    return {
      name: industryData.name,
      recommendedSolutions: industryData.solutions,
      specificBenefits: industryData.specificBenefits || [],
      industryTrends: industryData.trends || [],
      commonChallenges: industryData.challenges || []
    };
  }

  /**
   * Map l'industrie du client vers la KB
   */
  mapIndustryToKnowledgeBase(industry) {
    const mapping = {
      'retail': 'retail',
      'commerce': 'retail',
      'manufacturing': 'manufacturing',
      'industrie': 'manufacturing',
      'healthcare': 'healthcare',
      'santé': 'healthcare',
      'finance': 'finance',
      'banque': 'finance',
      'technology': 'technology',
      'tech': 'technology',
      'education': 'education',
      'éducation': 'education'
    };

    const industryLower = (industry || '').toLowerCase();

    for (const [key, value] of Object.entries(mapping)) {
      if (industryLower.includes(key)) {
        return value;
      }
    }

    return 'general'; // Fallback
  }

  /**
   * Obtient les différenciateurs compétitifs
   */
  getCompetitiveDifferentiators(solutionKey) {
    const differentiators = {
      'azure-migrate': [
        'Évaluation gratuite complète',
        'Migration sans downtime',
        'Support multi-cloud',
        'Intégration native avec l\'écosystème Microsoft'
      ],
      'azure-security-center': [
        'Protection multi-cloud unifiée',
        'IA intégrée pour détection des menaces',
        'Conformité réglementaire automatisée',
        'Coût total de possession le plus bas du marché'
      ],
      'microsoft-365': [
        'Suite la plus complète du marché',
        'Sécurité enterprise-grade intégrée',
        'IA Copilot pour productivité augmentée',
        'Interopérabilité parfaite entre tous les outils'
      ],
      'power-platform': [
        'Plateforme low-code leader du marché (Gartner)',
        'Intégration native avec +1000 connecteurs',
        'ROI de 188% prouvé (étude Forrester)',
        'Adoption par les métiers sans IT requis'
      ],
      'azure-ai': [
        'IA responsable et éthique',
        'Modèles pré-entraînés de classe mondiale',
        'Déploiement en quelques clics',
        'Confidentialité et souveraineté des données garanties'
      ],
      'dynamics-365': [
        'Seule plateforme CRM+ERP unifiée',
        'IA embarquée dans tous les modules',
        'Flexibilité: modules indépendants ou suite complète',
        'Écosystème de partenaires le plus riche'
      ]
    };

    return differentiators[solutionKey] || [
      'Solution leader du marché',
      'Intégration Microsoft complète',
      'Support et fiabilité enterprise'
    ];
  }

  /**
   * Agrège les guidances de pricing
   */
  aggregatePricingGuidance(solutionDetails) {
    const pricingInfo = solutionDetails.map(sol => ({
      solution: sol.name,
      pricing: sol.pricing
    }));

    // Estimation budgétaire globale
    let estimatedMonthlyMin = 0;
    let estimatedMonthlyMax = 0;

    pricingInfo.forEach(p => {
      if (p.pricing.includes('€')) {
        const match = p.pricing.match(/(\d+)€/);
        if (match) {
          const price = parseInt(match[1]);
          estimatedMonthlyMin += price;
          estimatedMonthlyMax += price * 2; // Estimation haute
        }
      }
    });

    return {
      perSolution: pricingInfo,
      estimatedTotal: estimatedMonthlyMin > 0 ?
        `${estimatedMonthlyMin}-${estimatedMonthlyMax}€/mois pour un déploiement type` :
        'Pricing sur mesure selon besoins',
      note: 'Prix indicatifs - devis personnalisé requis'
    };
  }

  /**
   * Agrège les timelines d'implémentation
   */
  aggregateImplementationTimeline(solutionDetails) {
    const timelines = solutionDetails.map(sol => ({
      solution: sol.name,
      timeline: sol.implementation
    }));

    // Extraire min et max
    let minWeeks = Infinity;
    let maxWeeks = 0;

    timelines.forEach(t => {
      const weekMatches = t.timeline.match(/(\d+)-?(\d+)?\s*semaines?/i);
      const monthMatches = t.timeline.match(/(\d+)-?(\d+)?\s*mois/i);

      if (weekMatches) {
        const min = parseInt(weekMatches[1]);
        const max = weekMatches[2] ? parseInt(weekMatches[2]) : min;
        minWeeks = Math.min(minWeeks, min);
        maxWeeks = Math.max(maxWeeks, max);
      }

      if (monthMatches) {
        const min = parseInt(monthMatches[1]) * 4; // Convert to weeks
        const max = monthMatches[2] ? parseInt(monthMatches[2]) * 4 : min;
        minWeeks = Math.min(minWeeks, min);
        maxWeeks = Math.max(maxWeeks, max);
      }
    });

    let estimatedTimeline = 'Variable selon projet';
    if (minWeeks !== Infinity) {
      if (maxWeeks < 8) {
        estimatedTimeline = `${minWeeks}-${maxWeeks} semaines`;
      } else {
        const minMonths = Math.ceil(minWeeks / 4);
        const maxMonths = Math.ceil(maxWeeks / 4);
        estimatedTimeline = `${minMonths}-${maxMonths} mois`;
      }
    }

    return {
      perSolution: timelines,
      estimatedTotal: estimatedTimeline,
      note: 'Déploiement progressif possible pour ROI rapide'
    };
  }

  /**
   * Calcule la qualité de l'enrichissement
   */
  calculateEnrichmentQuality(enrichedData) {
    let score = 0;
    const maxScore = 100;

    // Solutions pertinentes trouvées (30 points)
    if (enrichedData.relevantSolutions.length > 0) {
      score += Math.min(30, enrichedData.relevantSolutions.length * 10);
    }

    // Points de valeur métier (25 points)
    if (enrichedData.businessValuePoints.length > 0) {
      score += Math.min(25, enrichedData.businessValuePoints.length * 3);
    }

    // Use cases (20 points)
    if (enrichedData.useCaseExamples.length > 0) {
      score += Math.min(20, enrichedData.useCaseExamples.length * 2);
    }

    // Industry insights (15 points)
    if (enrichedData.industryInsights) {
      score += 15;
    }

    // Competitive positioning (10 points)
    if (enrichedData.competitivePositioning.length > 0) {
      score += 10;
    }

    return Math.min(score / maxScore, 1.0);
  }

  /**
   * Génère un prompt enrichi pour OpenAI
   */
  generateEnrichedPrompt(enrichedData) {
    const sections = [];

    // Section 1: Contexte client
    sections.push(`**CONTEXTE CLIENT:**
${enrichedData.originalContext}

**INTENTION:** ${enrichedData.originalIntent}

**PROFIL CLIENT:**
- Entreprise: ${enrichedData.clientProfile?.company || 'Non spécifié'}
- Segment: ${enrichedData.clientProfile?.segment || 'PME'}
- Industrie: ${enrichedData.clientProfile?.industry || 'Non spécifié'}
- Défis actuels: ${enrichedData.clientProfile?.currentChallenges || 'À identifier'}`);

    // Section 2: Solutions Microsoft recommandées
    if (enrichedData.solutionDetails.length > 0) {
      sections.push(`\n**SOLUTIONS MICROSOFT RECOMMANDÉES:**`);

      enrichedData.solutionDetails.forEach((sol, idx) => {
        sections.push(`
${idx + 1}. **${sol.name}** (${this.kb.categories[sol.category]?.name || sol.category})
   - Description: ${sol.shortDescription}
   - Valeur métier clé: ${sol.businessValue[0]}
   - Use case principal: ${sol.useCases[0]}
   - Public cible: ${sol.targetAudience.join(', ')}
   - Pricing: ${sol.pricing}
   - Timeline: ${sol.implementation}`);
      });
    }

    // Section 3: Insights industrie
    if (enrichedData.industryInsights) {
      sections.push(`\n**INSIGHTS INDUSTRIE (${enrichedData.industryInsights.name}):**
- Bénéfices spécifiques: ${enrichedData.industryInsights.specificBenefits.join(' | ')}
- Solutions prioritaires: ${enrichedData.industryInsights.recommendedSolutions.map(s => this.kb.solutions[s]?.name).join(', ')}`);
    }

    // Section 4: Positionnement compétitif
    if (enrichedData.competitivePositioning.length > 0) {
      sections.push(`\n**POSITIONNEMENT COMPÉTITIF:**`);
      enrichedData.competitivePositioning.forEach(cp => {
        sections.push(`- ${cp.solution} vs ${cp.competitors.join('/')}:
  ${cp.differentiators.slice(0, 2).map(d => `• ${d}`).join('\n  ')}`);
      });
    }

    // Section 5: Guidance
    sections.push(`\n**GUIDANCE DE RÉPONSE:**
- Utilise UNIQUEMENT les informations factuelles fournies ci-dessus
- Personnalise selon l'industrie et les défis du client
- Mentionne les bénéfices métier concrets avec chiffres
- Propose un use case pertinent pour leur secteur
- Inclus le pricing et timeline estimés
- Reste concis et orienté valeur métier`);

    return sections.join('\n');
  }

  /**
   * Génère un contexte structuré pour l'AI
   */
  generateStructuredContext(enrichedData) {
    return {
      clientContext: {
        company: enrichedData.clientProfile?.company,
        industry: enrichedData.clientProfile?.industry,
        segment: enrichedData.clientProfile?.segment,
        challenges: enrichedData.clientProfile?.currentChallenges
      },

      recommendedSolutions: enrichedData.solutionDetails.map(sol => ({
        name: sol.name,
        category: sol.category,
        description: sol.shortDescription,
        keyValue: sol.businessValue[0],
        primaryUseCase: sol.useCases[0],
        pricing: sol.pricing,
        timeline: sol.implementation
      })),

      industrySpecific: enrichedData.industryInsights ? {
        name: enrichedData.industryInsights.name,
        benefits: enrichedData.industryInsights.specificBenefits,
        recommendedSolutions: enrichedData.industryInsights.recommendedSolutions
      } : null,

      competitiveEdge: enrichedData.competitivePositioning.map(cp => ({
        solution: cp.solution,
        differentiators: cp.differentiators.slice(0, 3)
      })),

      estimatedInvestment: enrichedData.pricingGuidance?.estimatedTotal,
      estimatedTimeline: enrichedData.implementationTimeline?.estimatedTotal,

      enrichmentQuality: Math.round(enrichedData.enrichmentQuality * 100)
    };
  }
}

// Export singleton
export const aiAgentKBEnrichment = new AIAgentKBEnrichment();
