/**
 * Automated Content Generator
 * Generates knowledge base content from high-frequency patterns
 */

// Using mock generation since OpenAI integration needs proper configuration
// import { openai } from './openai.js';

export class AutomatedContentGenerator {
  constructor() {
    this.generationThreshold = 5; // Minimum frequency for auto-generation
    this.qualityScoreMinimum = 0.7; // Minimum quality score for acceptance
    this.maxGenerationsPerHour = 10; // Rate limiting
    this.generationHistory = [];
  }

  /**
   * Generate content from semantic patterns
   */
  async generateContentFromPatterns(semanticPatterns) {
    const generatedContent = [];
    const highValuePatterns = semanticPatterns
      .filter(pattern => pattern.needsContent && pattern.frequency >= this.generationThreshold)
      .sort((a, b) => b.estimatedValue - a.estimatedValue)
      .slice(0, this.maxGenerationsPerHour);

    for (const pattern of highValuePatterns) {
      try {
        const content = await this.generateSingleContent(pattern);
        if (content && this.assessContentQuality(content) >= this.qualityScoreMinimum) {
          generatedContent.push(content);
          this.recordGeneration(pattern, content);
        }
      } catch (error) {
        console.error('Error generating content for pattern:', pattern.id, error);
      }
    }

    return generatedContent;
  }

  /**
   * Generate single piece of content from pattern
   */
  async generateSingleContent(pattern) {
    const prompt = this.buildGenerationPrompt(pattern);

    try {
      // Use mock generation for testing (replace with OpenAI when configured)
      const response = this.generateMockResponse(pattern);
      return this.parseGeneratedContent(response, pattern);
    } catch (error) {
      console.error('Content generation error:', error);
      return this.generateFallbackContent(pattern);
    }
  }

  /**
   * Generate mock response for testing
   */
  generateMockResponse(pattern) {
    const category = pattern.categories[0] || 'general';
    const intent = pattern.intentPattern;
    const mainQuery = pattern.queries[0];

    const mockResponses = {
      azure: {
        question: mainQuery,
        answer: `## Migration vers Azure\n\nLa migration vers Azure est un processus structuré qui nécessite une planification approfondie. Voici les étapes clés :\n\n### 1. Évaluation de l'infrastructure\n• Audit des systèmes existants\n• Analyse des dépendances\n• Estimation des coûts\n\n### 2. Stratégie de migration\n• Azure Migrate pour l'évaluation\n• Choix du modèle (Lift & Shift, modernisation)\n• Timeline et phases\n\n### 3. Mise en œuvre\n• Tests de compatibilité\n• Migration pilote\n• Déploiement progressif\n\n### 4. Optimisation post-migration\n• Monitoring des performances\n• Optimisation des coûts\n• Formation des équipes\n\n**Conseil:** Commencez par un projet pilote pour valider votre approche avant la migration complète.`,
        alternateQuestions: ["Migration cloud Azure", "Comment passer vers Azure", "Étapes migration Azure"],
        category: "azure",
        tags: ["migration", "azure", "cloud", "infrastructure"],
        confidence: 0.9
      },
      microsoft365: {
        question: mainQuery,
        answer: `## Tarification Microsoft 365\n\nMicrosoft 365 propose plusieurs plans adaptés aux différents besoins :\n\n### Plans Business\n• **Business Basic** : 5,60€/utilisateur/mois - Applications web, Teams, Exchange\n• **Business Standard** : 11,70€/utilisateur/mois - Applications desktop incluses\n• **Business Premium** : 20,60€/utilisateur/mois - Sécurité avancée\n\n### Plans Enterprise\n• **E3** : 20,60€/utilisateur/mois - Fonctionnalités avancées\n• **E5** : 34,40€/utilisateur/mois - Sécurité et conformité complètes\n\n### Facteurs de coût\n• Nombre d'utilisateurs\n• Fonctionnalités requises\n• Add-ons (Phone System, Audio Conferencing)\n• Stockage supplémentaire\n\n**Recommandation:** Analysez vos besoins spécifiques pour choisir le plan optimal et éviter le sur-dimensionnement.`,
        alternateQuestions: ["Coût Microsoft 365", "Prix Office 365", "Tarif M365"],
        category: "microsoft365",
        tags: ["pricing", "microsoft365", "licensing", "cost"],
        confidence: 0.85
      },
      security: {
        question: mainQuery,
        answer: `## Sécurité Azure\n\nAzure propose une approche de sécurité multicouche pour protéger vos données et applications :\n\n### 1. Sécurité des identités\n• Azure Active Directory\n• Authentification multifacteur\n• Conditional Access\n\n### 2. Sécurité réseau\n• Azure Firewall\n• Network Security Groups\n• DDoS Protection\n\n### 3. Sécurité des données\n• Chiffrement au repos et en transit\n• Azure Key Vault\n• Information Protection\n\n### 4. Monitoring et conformité\n• Azure Security Center\n• Azure Sentinel (SIEM)\n• Compliance Manager\n\n### Best practices\n• Principe du moindre privilège\n• Surveillance continue\n• Plans de réponse aux incidents\n\n**Important:** La sécurité cloud est une responsabilité partagée entre Microsoft et le client.`,
        alternateQuestions: ["Protection Azure", "Sécurité cloud Microsoft", "Azure security"],
        category: "security",
        tags: ["security", "azure", "protection", "compliance"],
        confidence: 0.88
      }
    };

    return JSON.stringify(mockResponses[category] || mockResponses.azure);
  }

  /**
   * Build comprehensive prompt for content generation
   */
  buildGenerationPrompt(pattern) {
    const queries = pattern.queries.slice(0, 3); // Use top 3 similar queries
    const category = pattern.categories[0] || 'general';
    const intent = pattern.intentPattern;
    const context = pattern.contextPattern;

    return `
Génère un contenu de base de connaissances professionnel pour Microsoft Solutions.

📊 DONNÉES D'ANALYSE:
- Fréquence des demandes: ${pattern.frequency} occurrences
- Catégorie: ${category}
- Type d'intention: ${intent}
- Contexte produit: ${context}
- Valeur estimée: ${pattern.estimatedValue} points

❓ QUESTIONS FRÉQUENTES SIMILAIRES:
${queries.map((q, i) => `${i + 1}. "${q}"`).join('\n')}

🎯 MOTS-CLÉS COMMUNS: ${pattern.commonWords.join(', ')}

📝 REQUIS POUR LE CONTENU:
1. Question principale claire et naturelle
2. Réponse complète et structurée (300-500 mots)
3. Format markdown avec sections
4. Exemples pratiques Microsoft
5. Conseils d'implémentation
6. Questions alternatives (3-5 variations)
7. Tags pertinents

💼 PUBLIC CIBLE: ${pattern.suggestedContent?.contentHints?.targetAudience || 'Utilisateurs professionnels Microsoft'}

🎨 STYLE:
- Ton professionnel mais accessible
- Français avec termes techniques anglais appropriés
- Structure claire avec sections
- Exemples concrets
- Focus solutions Microsoft

Génère le contenu au format JSON suivant:
{
  "question": "Question principale optimisée",
  "answer": "Réponse complète en markdown",
  "alternateQuestions": ["variation 1", "variation 2", "variation 3"],
  "category": "${category}",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.85,
  "context": ["contexte1", "contexte2"]
}`;
  }

  /**
   * Parse generated content from OpenAI response
   */
  parseGeneratedContent(response, pattern) {
    try {
      // Try to parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.enhanceGeneratedContent(parsed, pattern);
      }

      // Fallback: extract structured data from text
      return this.extractStructuredContent(response, pattern);
    } catch (error) {
      console.error('Error parsing generated content:', error);
      return this.generateFallbackContent(pattern);
    }
  }

  /**
   * Enhance generated content with metadata
   */
  enhanceGeneratedContent(content, pattern) {
    return {
      id: `generated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: content.question || pattern.queries[0],
      answer: content.answer || this.generateBasicAnswer(pattern),
      alternateQuestions: content.alternateQuestions || pattern.queries.slice(1, 4),
      category: content.category || pattern.categories[0] || 'general',
      tags: content.tags || pattern.commonWords,
      confidence: content.confidence || 0.8,
      context: content.context || [pattern.intentPattern, pattern.contextPattern],
      metadata: {
        generatedFrom: 'semantic_pattern',
        patternId: pattern.id,
        sourceFrequency: pattern.frequency,
        generationDate: new Date().toISOString(),
        estimatedValue: pattern.estimatedValue,
        qualityScore: this.assessContentQuality(content)
      }
    };
  }

  /**
   * Extract structured content from unformatted text
   */
  extractStructuredContent(text, pattern) {
    const lines = text.split('\n').filter(line => line.trim());

    // Extract question (usually first meaningful line)
    const question = this.extractQuestion(lines, pattern);

    // Extract answer (main content)
    const answer = this.extractAnswer(lines);

    // Generate alternate questions from pattern
    const alternateQuestions = pattern.queries.slice(1, 4);

    return this.enhanceGeneratedContent({
      question,
      answer,
      alternateQuestions,
      category: pattern.categories[0] || 'general',
      tags: pattern.commonWords.slice(0, 5),
      confidence: 0.7
    }, pattern);
  }

  /**
   * Extract question from text lines
   */
  extractQuestion(lines, pattern) {
    // Look for lines that end with '?'
    const questionLines = lines.filter(line => line.trim().endsWith('?'));
    if (questionLines.length > 0) {
      return questionLines[0].trim();
    }

    // Fallback to pattern's most frequent query
    return pattern.queries[0];
  }

  /**
   * Extract answer from text lines
   */
  extractAnswer(lines) {
    // Find content after question, before metadata
    const contentLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 20 &&
             !trimmed.startsWith('{') &&
             !trimmed.startsWith('}') &&
             !trimmed.includes('"question"') &&
             !trimmed.includes('"answer"');
    });

    return contentLines.join('\n\n') || 'Contenu en cours de génération automatique.';
  }

  /**
   * Generate fallback content when automated generation fails
   */
  generateFallbackContent(pattern) {
    const category = pattern.categories[0] || 'general';
    const question = pattern.queries[0];

    return {
      id: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: question,
      answer: this.generateBasicAnswer(pattern),
      alternateQuestions: pattern.queries.slice(1, 4),
      category: category,
      tags: pattern.commonWords.slice(0, 3),
      confidence: 0.6,
      context: [pattern.intentPattern],
      metadata: {
        generatedFrom: 'fallback',
        patternId: pattern.id,
        sourceFrequency: pattern.frequency,
        generationDate: new Date().toISOString(),
        estimatedValue: pattern.estimatedValue,
        qualityScore: 0.6,
        requiresReview: true
      }
    };
  }

  /**
   * Generate basic answer from pattern data
   */
  generateBasicAnswer(pattern) {
    const category = pattern.categories[0] || 'general';
    const intent = pattern.intentPattern;
    const context = pattern.contextPattern;

    const templates = {
      azure: `Cette question concerne ${context} dans l'écosystème Microsoft Azure. Voici les points clés à considérer:\n\n• Configuration et mise en place\n• Meilleures pratiques de sécurité\n• Optimisation des coûts\n• Intégration avec vos systèmes existants\n\nPour obtenir des informations détaillées, nous recommandons de consulter la documentation officielle Microsoft ou de contacter notre équipe technique.`,

      microsoft365: `Cette demande porte sur Microsoft 365 et ses fonctionnalités. Les aspects importants incluent:\n\n• Administration et gestion des utilisateurs\n• Collaboration et productivité\n• Sécurité et conformité\n• Migration et déploiement\n\nNous pouvons vous accompagner dans l'implémentation et l'optimisation de votre environnement Microsoft 365.`,

      teams: `Cette question concerne Microsoft Teams et la collaboration. Points essentiels:\n\n• Configuration des équipes et canaux\n• Intégration avec d'autres applications\n• Gestion des réunions et appels\n• Sécurité et gouvernance\n\nNotre équipe peut vous aider à maximiser l'adoption et l'efficacité de Teams dans votre organisation.`,

      general: `Cette demande fait partie de nos questions fréquentes sur les solutions Microsoft. Nous pouvons vous fournir:\n\n• Informations détaillées sur les produits\n• Conseils d'implémentation\n• Support technique\n• Formation utilisateur\n\nContactez-nous pour une consultation personnalisée.`
    };

    return templates[context] || templates.general;
  }

  /**
   * Assess quality of generated content
   */
  assessContentQuality(content) {
    if (!content) return 0;

    let score = 0;
    const maxScore = 10;

    // Question quality (2 points)
    if (content.question && content.question.length > 10 && content.question.includes('?')) {
      score += 2;
    }

    // Answer length and structure (3 points)
    if (content.answer && content.answer.length > 100) {
      score += 1;
      if (content.answer.length > 200) score += 1;
      if (content.answer.includes('•') || content.answer.includes('#')) score += 1;
    }

    // Alternate questions (2 points)
    if (content.alternateQuestions && content.alternateQuestions.length >= 2) {
      score += 1;
      if (content.alternateQuestions.length >= 3) score += 1;
    }

    // Category and tags (2 points)
    if (content.category) score += 1;
    if (content.tags && content.tags.length >= 2) score += 1;

    // Context relevance (1 point)
    if (content.context && content.context.length > 0) score += 1;

    return score / maxScore;
  }

  /**
   * Record generation for tracking and rate limiting
   */
  recordGeneration(pattern, content) {
    this.generationHistory.push({
      timestamp: new Date(),
      patternId: pattern.id,
      contentId: content.id,
      qualityScore: content.metadata.qualityScore,
      estimatedValue: pattern.estimatedValue
    });

    // Keep only last 24 hours of history
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.generationHistory = this.generationHistory.filter(
      record => record.timestamp > oneDayAgo
    );
  }

  /**
   * Check if generation is allowed (rate limiting)
   */
  canGenerate() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentGenerations = this.generationHistory.filter(
      record => record.timestamp > oneHourAgo
    );

    return recentGenerations.length < this.maxGenerationsPerHour;
  }

  /**
   * Get generation statistics
   */
  getGenerationStats() {
    const totalGenerated = this.generationHistory.length;
    const averageQuality = totalGenerated > 0
      ? this.generationHistory.reduce((sum, record) => sum + record.qualityScore, 0) / totalGenerated
      : 0;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentGenerations = this.generationHistory.filter(
      record => record.timestamp > oneHourAgo
    );

    return {
      totalGenerated,
      averageQuality: Math.round(averageQuality * 100) / 100,
      generationsLastHour: recentGenerations.length,
      rateLimitRemaining: this.maxGenerationsPerHour - recentGenerations.length,
      configuration: {
        generationThreshold: this.generationThreshold,
        qualityScoreMinimum: this.qualityScoreMinimum,
        maxGenerationsPerHour: this.maxGenerationsPerHour
      }
    };
  }

  /**
   * Process knowledge gaps and generate content
   */
  async processKnowledgeGaps(knowledgeGaps, semanticPatterns = []) {
    if (!this.canGenerate()) {
      return {
        success: false,
        reason: 'Rate limit exceeded',
        stats: this.getGenerationStats()
      };
    }

    const generatedContent = [];

    // Process semantic patterns first (higher quality)
    if (semanticPatterns.length > 0) {
      const semanticContent = await this.generateContentFromPatterns(semanticPatterns);
      generatedContent.push(...semanticContent);
    }

    // Process high-frequency individual gaps
    const highFrequencyGaps = knowledgeGaps.filter(gap => gap.frequency >= this.generationThreshold);

    for (const gap of highFrequencyGaps.slice(0, 3)) { // Limit to 3 additional generations
      if (!this.canGenerate()) break;

      try {
        const pattern = this.convertGapToPattern(gap);
        const content = await this.generateSingleContent(pattern);
        if (content) {
          generatedContent.push(content);
        }
      } catch (error) {
        console.error('Error processing knowledge gap:', gap.query, error);
      }
    }

    return {
      success: true,
      generated: generatedContent,
      stats: this.getGenerationStats()
    };
  }

  /**
   * Convert knowledge gap to pattern format
   */
  convertGapToPattern(gap) {
    return {
      id: `gap_${Date.now()}`,
      queries: [gap.query],
      frequency: gap.frequency || 1,
      categories: [gap.suggested_category || 'general'],
      commonWords: gap.query.toLowerCase().split(/\s+/).filter(w => w.length > 2),
      intentPattern: 'question',
      contextPattern: gap.suggested_category || 'general',
      estimatedValue: (gap.frequency || 1) * 10,
      needsContent: true,
      suggestedContent: {
        contentHints: {
          targetAudience: 'Utilisateurs professionnels Microsoft'
        }
      }
    };
  }
}

export const automatedContentGenerator = new AutomatedContentGenerator();