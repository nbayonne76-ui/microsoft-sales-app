/**
 * OPTIMIZED QnA Knowledge Base - Microsoft Solutions
 *
 * Performance improvements:
 * - Query result caching (5-minute TTL)
 * - Limited fuzzy matching scope
 * - Pre-computed common queries
 * - Optimized search algorithm
 */

// ✅ QUERY CACHE - Cache search results for 5 minutes
const QUERY_CACHE = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Limit cache size

export class QnAKnowledgeBase {
  constructor() {
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.searchIndex = this.buildSearchIndex();
    // ✅ NEW: Pre-compute common queries
    this.commonQueries = this.precomputeCommonQueries();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  // ... (keep all the initializeKnowledgeBase content - copy from original file) ...
  initializeKnowledgeBase() {
    // NOTE: This would contain all the knowledge base data from the original file
    // For brevity, I'm showing the structure only
    return {
      azure: {
        category: "Azure Cloud Solutions",
        icon: "☁️",
        qaList: [
          // All Azure questions from original file
        ]
      },
      microsoft365: {
        category: "Microsoft 365",
        icon: "📧",
        qaList: [
          // All M365 questions from original file
        ]
      },
      teams: {
        category: "Microsoft Teams",
        icon: "👥",
        qaList: [
          // All Teams questions from original file
        ]
      },
      power_platform: {
        category: "Power Platform",
        icon: "⚡",
        qaList: [
          // All Power Platform questions from original file
        ]
      },
      dynamics: {
        category: "Dynamics 365",
        icon: "💼",
        qaList: [
          // All Dynamics questions from original file
        ]
      },
      security: {
        category: "Security & Compliance",
        icon: "🔒",
        qaList: [
          // All Security questions from original file
        ]
      }
    };
  }

  /**
   * ✅ NEW: Pre-compute answers for common queries
   */
  precomputeCommonQueries() {
    const commonQueries = [
      'azure',
      'migration',
      'prix',
      'coût',
      'sécurité',
      'teams',
      'office',
      'm365',
      'power platform',
      'dynamics',
      'cloud'
    ];

    const precomputed = new Map();

    commonQueries.forEach(query => {
      const results = this._findAnswersUncached(query, 5);
      precomputed.set(query.toLowerCase(), results);
    });

    console.log(`✅ Pre-computed ${precomputed.size} common queries`);
    return precomputed;
  }

  /**
   * Build search index for fast lookups
   */
  buildSearchIndex() {
    const index = new Map();

    for (const category of Object.values(this.knowledgeBase)) {
      for (const qa of category.qaList) {
        // Index by main question
        this.addToIndex(index, qa.question, qa);

        // Index by alternate questions
        qa.alternateQuestions.forEach(altQ => {
          this.addToIndex(index, altQ, qa);
        });

        // Index by tags
        qa.tags.forEach(tag => {
          this.addToIndex(index, tag, qa);
        });

        // Index by context keywords
        qa.context.forEach(keyword => {
          this.addToIndex(index, keyword, qa);
        });
      }
    }

    return index;
  }

  addToIndex(index, key, qa) {
    const normalizedKey = key.toLowerCase().trim();
    if (!index.has(normalizedKey)) {
      index.set(normalizedKey, []);
    }
    index.get(normalizedKey).push(qa);
  }

  /**
   * ✅ OPTIMIZED: Find answers with caching
   */
  findAnswers(query, maxResults = 5) {
    const normalizedQuery = query.toLowerCase().trim();

    // Check cache first
    const cached = this.getCachedResult(normalizedQuery);
    if (cached) {
      this.cacheHits++;
      console.log(`💾 Cache hit for query: "${query}" (${this.cacheHits} hits, ${this.cacheMisses} misses)`);
      return cached.slice(0, maxResults);
    }

    this.cacheMisses++;

    // Check pre-computed common queries
    if (this.commonQueries.has(normalizedQuery)) {
      const precomputed = this.commonQueries.get(normalizedQuery);
      this.setCachedResult(normalizedQuery, precomputed);
      return precomputed.slice(0, maxResults);
    }

    // Compute and cache result
    const results = this._findAnswersUncached(normalizedQuery, maxResults);
    this.setCachedResult(normalizedQuery, results);

    return results;
  }

  /**
   * ✅ OPTIMIZED: Actual search logic with reduced fuzzy matching
   */
  _findAnswersUncached(normalizedQuery, maxResults) {
    const words = normalizedQuery.split(/\s+/);
    const results = new Map();

    // 1. Exact phrase matching (highest score)
    for (const [key, qaList] of this.searchIndex.entries()) {
      if (key.includes(normalizedQuery)) {
        qaList.forEach(qa => {
          const score = this.calculateRelevanceScore(qa, normalizedQuery, 1.0);
          this.addResult(results, qa, score);
        });
      }
    }

    // 2. Individual word matching
    words.forEach(word => {
      if (word.length > 2) { // Skip very short words
        for (const [key, qaList] of this.searchIndex.entries()) {
          if (key.includes(word)) {
            qaList.forEach(qa => {
              const score = this.calculateRelevanceScore(qa, word, 0.7);
              this.addResult(results, qa, score);
            });
          }
        }
      }
    });

    // 3. ✅ OPTIMIZED: Limited fuzzy matching
    // Only if we have very few results (<3) and query is short enough
    if (results.size < 3 && normalizedQuery.length <= 20) {
      const candidateKeys = Array.from(this.searchIndex.keys())
        // ✅ Only check keys of similar length (±30%)
        .filter(key => {
          const lengthDiff = Math.abs(key.length - normalizedQuery.length);
          return lengthDiff <= normalizedQuery.length * 0.3;
        })
        // ✅ Limit to first 50 candidates to avoid O(n²) explosion
        .slice(0, 50);

      for (const key of candidateKeys) {
        const similarity = this.calculateStringSimilarity(normalizedQuery, key);
        if (similarity > 0.6) {
          const qaList = this.searchIndex.get(key);
          qaList.forEach(qa => {
            const score = this.calculateRelevanceScore(qa, normalizedQuery, similarity * 0.5);
            this.addResult(results, qa, score);
          });
        }
      }
    }

    // Convert to array and sort by relevance
    return Array.from(results.values())
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  /**
   * ✅ NEW: Cache management
   */
  getCachedResult(query) {
    const cached = QUERY_CACHE.get(query);
    if (!cached) return null;

    // Check if cache expired
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      QUERY_CACHE.delete(query);
      return null;
    }

    return cached.results;
  }

  setCachedResult(query, results) {
    // Limit cache size (LRU-like eviction)
    if (QUERY_CACHE.size >= MAX_CACHE_SIZE) {
      // Remove oldest entry
      const firstKey = QUERY_CACHE.keys().next().value;
      QUERY_CACHE.delete(firstKey);
    }

    QUERY_CACHE.set(query, {
      results,
      timestamp: Date.now()
    });
  }

  addResult(results, qa, score) {
    if (results.has(qa.id)) {
      // Boost existing result
      results.get(qa.id).relevanceScore = Math.max(results.get(qa.id).relevanceScore, score);
    } else {
      results.set(qa.id, { ...qa, relevanceScore: score });
    }
  }

  calculateRelevanceScore(qa, query, baseScore) {
    let score = baseScore;

    // Boost based on confidence
    score *= qa.confidence;

    // Boost if query matches category
    if (query.includes(qa.category)) {
      score *= 1.2;
    }

    // Boost popular/important topics
    const importantTopics = ['azure', 'migration', 'sécurité', 'teams', 'office'];
    if (importantTopics.some(topic => query.includes(topic))) {
      score *= 1.1;
    }

    return Math.min(score, 1.0);
  }

  calculateStringSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Get random FAQ suggestions
   */
  getRandomSuggestions(count = 4) {
    const allQAs = [];

    for (const category of Object.values(this.knowledgeBase)) {
      allQAs.push(...category.qaList);
    }

    const shuffled = allQAs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(qa => ({
      question: qa.question,
      category: qa.category,
      icon: this.knowledgeBase[qa.category]?.icon || "❓"
    }));
  }

  /**
   * Get category-specific suggestions
   */
  getCategorySuggestions(categoryKey, count = 3) {
    const category = this.knowledgeBase[categoryKey];
    if (!category) return [];

    return category.qaList.slice(0, count).map(qa => ({
      question: qa.question,
      answer: qa.answer.substring(0, 200) + "...",
      confidence: qa.confidence
    }));
  }

  /**
   * Get all categories for navigation
   */
  getCategories() {
    return Object.entries(this.knowledgeBase).map(([key, category]) => ({
      key,
      name: category.category,
      icon: category.icon,
      count: category.qaList.length
    }));
  }

  /**
   * Analyze query and suggest related topics
   */
  getRelatedTopics(query) {
    const results = this.findAnswers(query, 10);
    const relatedCategories = new Set();
    const relatedTags = new Set();

    results.forEach(result => {
      relatedCategories.add(result.category);
      result.tags.forEach(tag => relatedTags.add(tag));
    });

    return {
      categories: Array.from(relatedCategories),
      tags: Array.from(relatedTags).slice(0, 8),
      suggestedQuestions: results.slice(0, 3).map(r => r.question)
    };
  }

  /**
   * ✅ NEW: Clear query cache (for testing/admin)
   */
  clearCache() {
    QUERY_CACHE.clear();
    this.cacheHits = 0;
    this.cacheMisses = 0;
    console.log('🗑️ QnA query cache cleared');
  }

  /**
   * ✅ NEW: Get cache statistics
   */
  getCacheStats() {
    return {
      size: QUERY_CACHE.size,
      maxSize: MAX_CACHE_SIZE,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: this.cacheHits > 0
        ? ((this.cacheHits / (this.cacheHits + this.cacheMisses)) * 100).toFixed(1) + '%'
        : '0%',
      precomputedQueries: this.commonQueries.size
    };
  }
}

// ✅ Export singleton instance
export const qnaKnowledgeBase = new QnAKnowledgeBase();

// ✅ Export function to clear cache globally
export function clearQnACache() {
  QUERY_CACHE.clear();
  console.log('🗑️ Global QnA cache cleared');
}
