/**
 * Semantic Knowledge Mining System
 * Enhanced knowledge mining using semantic similarity and pattern analysis
 */

// Note: Using fallback implementation since @huggingface/inference not installed
// import { HfInference } from '@huggingface/inference';

export class SemanticKnowledgeMiner {
  constructor() {
    // this.hf = new HfInference(process.env.HUGGINGFACE_API_KEY || '');
    this.model = 'sentence-transformers/all-MiniLM-L6-v2';
    this.cache = new Map();
    this.clusters = new Map();
    this.patternThreshold = 0.75; // Semantic similarity threshold
    this.highFrequencyThreshold = 5; // Minimum frequency for content generation
    this.useHuggingFace = false; // Set to true when package is installed
  }

  /**
   * Generate semantic embeddings for text
   */
  async generateEmbedding(text) {
    const cacheKey = `embedding_${text}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Use Hugging Face inference for embeddings when available
      if (this.useHuggingFace && this.hf) {
        const response = await this.hf.featureExtraction({
          model: this.model,
          inputs: text
        });

        const embedding = Array.isArray(response) ? response : [response];
        this.cache.set(cacheKey, embedding);
        return embedding;
      }
    } catch (error) {
      console.error('Error generating embedding:', error);
    }

    // Fallback to simple text features
    return this.generateSimpleEmbedding(text);
  }

  /**
   * Fallback embedding generation using text features
   */
  generateSimpleEmbedding(text) {
    const words = text.toLowerCase().split(/\s+/);
    const features = {
      length: text.length,
      wordCount: words.length,
      questionWords: words.filter(w => ['comment', 'que', 'quoi', 'où', 'quand', 'pourquoi'].includes(w)).length,
      microsoftTerms: words.filter(w => ['azure', 'microsoft', 'teams', 'office', 'power', 'dynamics'].includes(w)).length,
      technicalTerms: words.filter(w => ['migration', 'cloud', 'sécurité', 'backup', 'intégration'].includes(w)).length
    };

    // Convert to normalized vector
    const maxVal = Math.max(...Object.values(features));
    return Object.values(features).map(v => maxVal > 0 ? v / maxVal : 0);
  }

  /**
   * Calculate semantic similarity between two texts
   */
  async calculateSemanticSimilarity(text1, text2) {
    const embedding1 = await this.generateEmbedding(text1);
    const embedding2 = await this.generateEmbedding(text2);

    return this.cosineSimilarity(embedding1, embedding2);
  }

  /**
   * Cosine similarity calculation
   */
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  /**
   * Mine semantic patterns from knowledge gaps
   */
  async mineSemanticPatterns(knowledgeGaps) {
    const patterns = [];
    const processedQueries = [];

    // Convert knowledge gaps to processable format
    for (const gap of knowledgeGaps) {
      processedQueries.push({
        id: gap.query,
        text: gap.query,
        frequency: gap.frequency || 1,
        category: gap.suggested_category,
        firstSeen: gap.first_seen,
        lastSeen: gap.last_seen
      });
    }

    // Find semantic clusters
    const clusters = await this.clusterSimilarQueries(processedQueries);

    // Analyze each cluster for patterns
    for (const cluster of clusters) {
      if (cluster.queries.length >= 2) {
        const pattern = await this.analyzeClusterPattern(cluster);
        if (pattern.confidence > 0.6) {
          patterns.push(pattern);
        }
      }
    }

    return patterns;
  }

  /**
   * Cluster semantically similar queries
   */
  async clusterSimilarQueries(queries) {
    const clusters = [];
    const processed = new Set();

    for (let i = 0; i < queries.length; i++) {
      if (processed.has(i)) continue;

      const cluster = {
        centroid: queries[i],
        queries: [queries[i]],
        totalFrequency: queries[i].frequency,
        categories: new Set([queries[i].category])
      };

      // Find similar queries
      for (let j = i + 1; j < queries.length; j++) {
        if (processed.has(j)) continue;

        const similarity = await this.calculateSemanticSimilarity(
          queries[i].text,
          queries[j].text
        );

        if (similarity > this.patternThreshold) {
          cluster.queries.push(queries[j]);
          cluster.totalFrequency += queries[j].frequency;
          cluster.categories.add(queries[j].category);
          processed.add(j);
        }
      }

      processed.add(i);
      clusters.push(cluster);
    }

    return clusters.sort((a, b) => b.totalFrequency - a.totalFrequency);
  }

  /**
   * Analyze pattern within a cluster
   */
  async analyzeClusterPattern(cluster) {
    const queries = cluster.queries.map(q => q.text);
    const commonWords = this.extractCommonWords(queries);
    const intentPattern = this.identifyIntentPattern(queries);
    const contextPattern = this.identifyContextPattern(queries);

    return {
      id: `semantic_pattern_${Date.now()}`,
      type: 'semantic_cluster',
      queries: queries,
      frequency: cluster.totalFrequency,
      categories: Array.from(cluster.categories),
      commonWords: commonWords,
      intentPattern: intentPattern,
      contextPattern: contextPattern,
      confidence: this.calculatePatternConfidence(cluster),
      needsContent: cluster.totalFrequency >= this.highFrequencyThreshold,
      suggestedContent: await this.generateContentSuggestion(cluster)
    };
  }

  /**
   * Extract common words from query cluster
   */
  extractCommonWords(queries) {
    const wordFreq = new Map();
    const stopWords = new Set(['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'à', 'est', 'pour', 'avec', 'dans']);

    queries.forEach(query => {
      const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
      words.forEach(word => {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      });
    });

    return Array.from(wordFreq.entries())
      .filter(([word, freq]) => freq >= Math.ceil(queries.length / 2))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  }

  /**
   * Identify intent pattern in queries
   */
  identifyIntentPattern(queries) {
    const intentKeywords = {
      question: ['comment', 'que', 'quoi', 'où', 'quand', 'pourquoi'],
      migration: ['migrer', 'migration', 'passer', 'transférer'],
      pricing: ['prix', 'coût', 'tarif', 'licence'],
      comparison: ['différence', 'comparaison', 'vs', 'mieux'],
      setup: ['installer', 'configurer', 'paramétrer', 'mettre en place'],
      troubleshooting: ['problème', 'erreur', 'bug', 'ne fonctionne pas']
    };

    const scores = {};
    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      scores[intent] = 0;
      queries.forEach(query => {
        const text = query.toLowerCase();
        keywords.forEach(keyword => {
          if (text.includes(keyword)) scores[intent]++;
        });
      });
    }

    const topIntent = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return topIntent[1] > 0 ? topIntent[0] : 'general';
  }

  /**
   * Identify context pattern in queries
   */
  identifyContextPattern(queries) {
    const microsoftProducts = {
      azure: ['azure', 'cloud'],
      office365: ['office', '365', 'outlook', 'word', 'excel'],
      teams: ['teams', 'réunion', 'chat'],
      powerplatform: ['power', 'bi', 'automate', 'apps'],
      dynamics: ['dynamics', 'crm', 'erp'],
      security: ['sécurité', 'conformité', 'protection']
    };

    const productScores = {};
    for (const [product, keywords] of Object.entries(microsoftProducts)) {
      productScores[product] = 0;
      queries.forEach(query => {
        const text = query.toLowerCase();
        keywords.forEach(keyword => {
          if (text.includes(keyword)) productScores[product]++;
        });
      });
    }

    const topProduct = Object.entries(productScores).sort((a, b) => b[1] - a[1])[0];
    return topProduct[1] > 0 ? topProduct[0] : 'general';
  }

  /**
   * Calculate pattern confidence score
   */
  calculatePatternConfidence(cluster) {
    const factors = {
      frequency: Math.min(cluster.totalFrequency / 10, 1), // Max at 10 occurrences
      consistency: cluster.queries.length > 1 ? 0.8 : 0.4,
      categoryAlignment: cluster.categories.size === 1 ? 0.9 : 0.6,
      recentActivity: this.calculateRecencyScore(cluster.queries)
    };

    return Object.values(factors).reduce((sum, val) => sum + val, 0) / Object.keys(factors).length;
  }

  /**
   * Calculate recency score for pattern relevance
   */
  calculateRecencyScore(queries) {
    const now = new Date();
    const recentQueries = queries.filter(q => {
      if (!q.lastSeen) return false;
      const daysDiff = (now - new Date(q.lastSeen)) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30; // Within last 30 days
    });

    return recentQueries.length / queries.length;
  }

  /**
   * Generate content suggestion for high-frequency patterns
   */
  async generateContentSuggestion(cluster) {
    if (cluster.totalFrequency < this.highFrequencyThreshold) {
      return null;
    }

    const representative = cluster.queries[0].text;
    const category = Array.from(cluster.categories)[0] || 'general';
    const commonWords = this.extractCommonWords(cluster.queries.map(q => q.text));

    return {
      suggestedQuestion: representative,
      category: category,
      keyTopics: commonWords,
      urgency: cluster.totalFrequency >= 10 ? 'high' : 'medium',
      estimatedValue: this.calculateContentValue(cluster),
      contentHints: this.generateContentHints(cluster)
    };
  }

  /**
   * Calculate potential value of creating content for this pattern
   */
  calculateContentValue(cluster) {
    const baseValue = cluster.totalFrequency * 10; // 10 points per occurrence
    const categoryBonus = cluster.categories.size === 1 ? 20 : 0; // Focused content bonus
    const recentBonus = this.calculateRecencyScore(cluster.queries) * 30; // Recent activity bonus

    return Math.round(baseValue + categoryBonus + recentBonus);
  }

  /**
   * Generate content creation hints
   */
  generateContentHints(cluster) {
    const intentPattern = this.identifyIntentPattern(cluster.queries.map(q => q.text));
    const contextPattern = this.identifyContextPattern(cluster.queries.map(q => q.text));

    const hints = {
      contentType: this.getContentTypeForIntent(intentPattern),
      targetAudience: this.getAudienceForContext(contextPattern),
      keyPoints: this.extractKeyPoints(cluster),
      relatedTopics: this.suggestRelatedTopics(contextPattern)
    };

    return hints;
  }

  /**
   * Map intent to content type
   */
  getContentTypeForIntent(intent) {
    const mapping = {
      question: 'FAQ entry with detailed explanation',
      migration: 'Step-by-step migration guide',
      pricing: 'Pricing comparison table with explanations',
      comparison: 'Feature comparison matrix',
      setup: 'Configuration tutorial with screenshots',
      troubleshooting: 'Problem-solution guide'
    };

    return mapping[intent] || 'General information article';
  }

  /**
   * Map context to target audience
   */
  getAudienceForContext(context) {
    const mapping = {
      azure: 'IT professionals and cloud architects',
      office365: 'Business users and administrators',
      teams: 'Collaboration teams and IT managers',
      powerplatform: 'Business analysts and power users',
      dynamics: 'Sales and customer service teams',
      security: 'Security professionals and compliance officers'
    };

    return mapping[context] || 'General business users';
  }

  /**
   * Extract key points from cluster
   */
  extractKeyPoints(cluster) {
    const commonWords = this.extractCommonWords(cluster.queries.map(q => q.text));
    const categories = Array.from(cluster.categories);

    return [
      `Address ${commonWords.join(', ')} concerns`,
      `Focus on ${categories.join(' and ')} solutions`,
      `Cover ${cluster.queries.length} common question variations`,
      `High impact content (${cluster.totalFrequency} requests)`
    ];
  }

  /**
   * Suggest related topics
   */
  suggestRelatedTopics(context) {
    const relatedTopics = {
      azure: ['cloud migration', 'hybrid cloud', 'azure security', 'cost optimization'],
      office365: ['productivity tips', 'collaboration features', 'mobile access', 'admin tools'],
      teams: ['meeting best practices', 'integration options', 'mobile apps', 'security'],
      powerplatform: ['automation workflows', 'custom apps', 'data visualization', 'connectors'],
      dynamics: ['sales process', 'customer insights', 'integration', 'customization'],
      security: ['compliance frameworks', 'threat protection', 'identity management', 'data governance']
    };

    return relatedTopics[context] || ['microsoft ecosystem', 'best practices', 'implementation tips'];
  }

  /**
   * Get mining status and statistics
   */
  getMiningStatus() {
    return {
      cacheSize: this.cache.size,
      clusterCount: this.clusters.size,
      configuration: {
        model: this.model,
        patternThreshold: this.patternThreshold,
        highFrequencyThreshold: this.highFrequencyThreshold
      },
      capabilities: [
        'Semantic similarity detection',
        'Query clustering',
        'Pattern analysis',
        'Automated content suggestions',
        'Value-based prioritization'
      ]
    };
  }
}

export const semanticKnowledgeMiner = new SemanticKnowledgeMiner();