import fs from 'fs';
import path from 'path';

export class TemplateAnalyzer {
  constructor(templatesPath = './templates') {
    this.templatesPath = templatesPath;
    this.templateDatabase = new Map();
    this.supportedExtensions = ['.txt', '.md', '.json', '.html'];
  }

  /**
   * Scanne et analyse tous les templates du dossier
   */
  async scanAndAnalyzeTemplates() {
    const results = {
      analyzed: 0,
      errors: 0,
      categories: {},
      templates: []
    };

    try {
      const categories = await this.getCategories();
      
      for (const category of categories) {
        const categoryPath = path.join(this.templatesPath, category);
        const categoryResults = await this.analyzeCategory(category, categoryPath);
        
        results.categories[category] = categoryResults;
        results.templates.push(...categoryResults.templates);
        results.analyzed += categoryResults.analyzed;
        results.errors += categoryResults.errors;
      }

      // Sauvegarder les résultats
      await this.saveAnalysisResults(results);
      
    } catch (error) {
      console.error('❌ Erreur lors du scan des templates:', error);
      results.errors++;
    }

    return results;
  }

  /**
   * Obtient la liste des catégories (dossiers)
   */
  async getCategories() {
    try {
      const items = await fs.promises.readdir(this.templatesPath);
      const categories = [];
      
      for (const item of items) {
        const itemPath = path.join(this.templatesPath, item);
        const stat = await fs.promises.stat(itemPath);
        if (stat.isDirectory()) {
          categories.push(item);
        }
      }
      
      return categories;
    } catch (error) {
      console.error('❌ Erreur lecture dossier templates:', error);
      return [];
    }
  }

  /**
   * Analyse une catégorie de templates
   */
  async analyzeCategory(categoryName, categoryPath) {
    const result = {
      category: categoryName,
      analyzed: 0,
      errors: 0,
      templates: []
    };

    try {
      if (!fs.existsSync(categoryPath)) {
        return result;
      }

      const files = await fs.promises.readdir(categoryPath);
      
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (this.supportedExtensions.includes(ext)) {
          try {
            const filePath = path.join(categoryPath, file);
            const templateAnalysis = await this.analyzeTemplate(filePath, categoryName);
            
            if (templateAnalysis) {
              result.templates.push(templateAnalysis);
              result.analyzed++;
            }
          } catch (error) {
            console.error(`❌ Erreur analyse ${file}:`, error);
            result.errors++;
          }
        }
      }
      
    } catch (error) {
      console.error(`❌ Erreur catégorie ${categoryName}:`, error);
      result.errors++;
    }

    return result;
  }

  /**
   * Analyse un template individuel
   */
  async analyzeTemplate(filePath, category) {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const extension = path.extname(filePath);

    const analysis = {
      id: this.generateTemplateId(filePath),
      fileName: fileName,
      filePath: filePath,
      category: category,
      extension: extension,
      content: content,
      metadata: await this.extractMetadata(content, category),
      variables: this.extractVariables(content),
      structure: this.analyzeStructure(content),
      style: this.analyzeStyle(content),
      lastModified: (await fs.promises.stat(filePath)).mtime,
      createdAt: new Date()
    };

    // Stocker dans la base en mémoire
    this.templateDatabase.set(analysis.id, analysis);

    return analysis;
  }

  /**
   * Extrait les métadonnées du template
   */
  async extractMetadata(content, category) {
    const metadata = {
      objective: this.detectObjective(content, category),
      targetAudience: this.detectTargetAudience(content),
      channel: this.detectChannel(content),
      tone: this.detectTone(content),
      language: this.detectLanguage(content),
      urgency: this.detectUrgency(content),
      cta: this.extractCallToAction(content),
      keywords: this.extractKeywords(content)
    };

    return metadata;
  }

  /**
   * Détecte l'objectif du template
   */
  detectObjective(content, category) {
    const contentLower = content.toLowerCase();
    
    // Mapping des catégories vers objectifs
    const categoryObjectives = {
      'email_prospection': 'prospection',
      'suivi_clients': 'fidélisation',
      'newsletters': 'information',
      'co_sell': 'partenariat',
      'relance': 'reactivation'
    };

    // Détection par mots-clés
    const objectiveKeywords = {
      'prospection': ['nouveau client', 'découvrir', 'présenter', 'première fois', 'contact froid'],
      'fidélisation': ['suivi', 'relation', 'satisfaction', 'fidélité', 'merci'],
      'vente': ['offre', 'promotion', 'achat', 'commande', 'devis', 'prix'],
      'reactivation': ['relance', 'rappel', 'n\'avez pas', 'sans nouvelles'],
      'information': ['newsletter', 'actualité', 'nouveau', 'mise à jour'],
      'partenariat': ['partenaire', 'collaboration', 'ensemble', 'co-sell']
    };

    // Priorité à la catégorie
    if (categoryObjectives[category]) {
      return categoryObjectives[category];
    }

    // Détection par contenu
    for (const [objective, keywords] of Object.entries(objectiveKeywords)) {
      for (const keyword of keywords) {
        if (contentLower.includes(keyword)) {
          return objective;
        }
      }
    }

    return 'general';
  }

  /**
   * Détecte l'audience cible
   */
  detectTargetAudience(content) {
    const contentLower = content.toLowerCase();
    
    const audiencePatterns = {
      'b2b': ['entreprise', 'sociéte', 'directeur', 'manager', 'équipe', 'business'],
      'b2c': ['particulier', 'client', 'famille', 'personnel', 'privé'],
      'startup': ['startup', 'innovation', 'entrepreneur', 'croissance rapide'],
      'pme': ['pme', 'petite entreprise', 'tpe', 'artisan'],
      'grande_entreprise': ['groupe', 'multinationale', 'filiale', 'corporate'],
      'partenaire': ['partenaire', 'distributeur', 'revendeur', 'intégrateur']
    };

    const scores = {};
    for (const [audience, keywords] of Object.entries(audiencePatterns)) {
      scores[audience] = 0;
      for (const keyword of keywords) {
        if (contentLower.includes(keyword)) {
          scores[audience]++;
        }
      }
    }

    const bestMatch = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );

    return scores[bestMatch] > 0 ? bestMatch : 'general';
  }

  /**
   * Détecte le canal de communication
   */
  detectChannel(content) {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('objet:') || contentLower.includes('subject:')) {
      return 'email';
    }
    if (contentLower.includes('linkedin') || contentLower.includes('réseau professionnel')) {
      return 'linkedin';
    }
    if (contentLower.includes('whatsapp') || contentLower.includes('message')) {
      return 'whatsapp';
    }
    if (contentLower.includes('sms') || contentLower.length < 160) {
      return 'sms';
    }
    
    return 'email'; // Par défaut
  }

  /**
   * Détecte le ton du message
   */
  detectTone(content) {
    const contentLower = content.toLowerCase();
    
    const tonePatterns = {
      'formel': ['monsieur', 'madame', 'cordialement', 'respectueusement', 'veuillez', 'je vous prie'],
      'amical': ['salut', 'bonjour', 'bonne journée', 'à bientôt', 'merci beaucoup'],
      'urgent': ['urgent', 'rapidement', 'immédiatement', 'dès que possible', 'important'],
      'commercial': ['offre', 'promotion', 'réduction', 'opportunité', 'limitée'],
      'professionnel': ['expertise', 'solutions', 'accompagnement', 'partenariat']
    };

    const scores = {};
    for (const [tone, keywords] of Object.entries(tonePatterns)) {
      scores[tone] = 0;
      for (const keyword of keywords) {
        if (contentLower.includes(keyword)) {
          scores[tone]++;
        }
      }
    }

    const bestTone = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );

    return scores[bestTone] > 0 ? bestTone : 'professionnel';
  }

  /**
   * Détecte la langue du contenu
   */
  detectLanguage(content) {
    const contentLower = content.toLowerCase();
    
    const frenchWords = ['le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'ou', 'mais', 'donc', 'dans', 'sur', 'avec', 'pour', 'par', 'à', 'ce', 'cette', 'ces', 'qui', 'que', 'quoi', 'dont', 'où'];
    const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'this', 'that', 'these', 'those', 'what', 'who', 'where', 'when'];
    
    let frenchScore = 0;
    let englishScore = 0;
    
    for (const word of frenchWords) {
      if (contentLower.includes(` ${word} `)) frenchScore++;
    }
    
    for (const word of englishWords) {
      if (contentLower.includes(` ${word} `)) englishScore++;
    }
    
    return frenchScore > englishScore ? 'fr' : 'en';
  }

  /**
   * Détecte l'urgence du message
   */
  detectUrgency(content) {
    const contentLower = content.toLowerCase();
    const urgentKeywords = ['urgent', 'rapidement', 'immédiatement', 'aujourd\'hui', 'maintenant', 'vite', 'pressé', 'deadline', 'échéance'];
    
    const urgencyScore = urgentKeywords.reduce((score, keyword) => {
      return score + (contentLower.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (urgencyScore >= 2) return 'high';
    if (urgencyScore === 1) return 'medium';
    return 'low';
  }

  /**
   * Extrait les variables du template
   */
  extractVariables(content) {
    // Détection de différents formats de variables
    const patterns = [
      /\{([^}]+)\}/g,           // {variable}
      /\[\[([^\]]+)\]\]/g,      // [[variable]]
      /\$\{([^}]+)\}/g,         // ${variable}
      /%([^%]+)%/g,             // %variable%
      /\{#([^}]+)\}/g           // {#variable}
    ];

    const variables = new Set();
    
    patterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        variables.add(match[1].trim());
      }
    });

    return Array.from(variables);
  }

  /**
   * Analyse la structure du template
   */
  analyzeStructure(content) {
    const lines = content.split('\n').filter(line => line.trim());
    
    return {
      totalLines: lines.length,
      paragraphs: content.split('\n\n').filter(p => p.trim()).length,
      hasSubject: content.toLowerCase().includes('objet:') || content.toLowerCase().includes('subject:'),
      hasSignature: content.toLowerCase().includes('cordialement') || content.toLowerCase().includes('sincèrement'),
      hasCallToAction: this.hasCallToAction(content),
      structure_type: this.detectStructureType(content)
    };
  }

  /**
   * Détecte si le template a un call-to-action
   */
  hasCallToAction(content) {
    const ctaPatterns = [
      'cliquez', 'appelez', 'contactez', 'répondez', 'inscrivez', 'commandez',
      'téléchargez', 'découvrez', 'profitez', 'rejoignez', 'visitez'
    ];
    
    const contentLower = content.toLowerCase();
    return ctaPatterns.some(pattern => contentLower.includes(pattern));
  }

  /**
   * Extrait le call-to-action principal
   */
  extractCallToAction(content) {
    const ctaPatterns = [
      /(cliquez.*)/i,
      /(appelez.*)/i, 
      /(contactez.*)/i,
      /(répondez.*)/i,
      /(téléchargez.*)/i,
      /(découvrez.*)/i
    ];

    for (const pattern of ctaPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return null;
  }

  /**
   * Détecte le type de structure
   */
  detectStructureType(content) {
    const contentLower = content.toLowerCase();
    
    if (contentLower.includes('objet:')) return 'email_complet';
    if (content.includes('•') || content.includes('-') || content.includes('*')) return 'liste_puces';
    if (content.split('\n\n').length > 3) return 'multi_paragraphes';
    if (content.length < 200) return 'court';
    
    return 'standard';
  }

  /**
   * Analyse le style du template
   */
  analyzeStyle(content) {
    return {
      wordCount: content.split(/\s+/).length,
      characterCount: content.length,
      averageWordsPerSentence: this.getAverageWordsPerSentence(content),
      readabilityScore: this.calculateReadabilityScore(content),
      formalityLevel: this.calculateFormalityLevel(content)
    };
  }

  /**
   * Calcule la moyenne de mots par phrase
   */
  getAverageWordsPerSentence(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim());
    const totalWords = content.split(/\s+/).length;
    return sentences.length > 0 ? Math.round(totalWords / sentences.length) : 0;
  }

  /**
   * Calcule un score de lisibilité simplifié
   */
  calculateReadabilityScore(content) {
    const avgWordsPerSentence = this.getAverageWordsPerSentence(content);
    
    if (avgWordsPerSentence < 10) return 'facile';
    if (avgWordsPerSentence < 15) return 'moyen';
    return 'difficile';
  }

  /**
   * Calcule le niveau de formalité
   */
  calculateFormalityLevel(content) {
    const contentLower = content.toLowerCase();
    
    const formalWords = ['monsieur', 'madame', 'veuillez', 'cordialement', 'respectueusement'];
    const informalWords = ['salut', 'bonjour', 'à bientôt', 'merci beaucoup', 'super'];
    
    let formalScore = 0;
    let informalScore = 0;
    
    formalWords.forEach(word => {
      if (contentLower.includes(word)) formalScore++;
    });
    
    informalWords.forEach(word => {
      if (contentLower.includes(word)) informalScore++;
    });
    
    if (formalScore > informalScore) return 'formel';
    if (informalScore > formalScore) return 'informel';
    return 'neutre';
  }

  /**
   * Extrait les mots-clés principaux
   */
  extractKeywords(content) {
    const stopWords = new Set([
      'le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'ou', 'mais', 
      'donc', 'dans', 'sur', 'avec', 'pour', 'par', 'à', 'ce', 'cette', 'ces',
      'qui', 'que', 'quoi', 'dont', 'où', 'est', 'sont', 'avoir', 'être'
    ]);
    
    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    // Comptage des occurrences
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Retourner les 10 mots les plus fréquents
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Génère un ID unique pour le template
   */
  generateTemplateId(filePath) {
    return Buffer.from(filePath).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  /**
   * Sauvegarde les résultats d'analyse
   */
  async saveAnalysisResults(results) {
    const outputPath = path.join(this.templatesPath, 'analysis_results.json');
    
    const analysisReport = {
      timestamp: new Date().toISOString(),
      summary: {
        total_templates: results.analyzed,
        total_errors: results.errors,
        categories: Object.keys(results.categories).length
      },
      categories: results.categories,
      templates: results.templates.map(t => ({
        id: t.id,
        fileName: t.fileName,
        category: t.category,
        objective: t.metadata.objective,
        targetAudience: t.metadata.targetAudience,
        tone: t.metadata.tone,
        variables: t.variables,
        wordCount: t.style.wordCount
      }))
    };
    
    await fs.promises.writeFile(outputPath, JSON.stringify(analysisReport, null, 2));
    console.log(`✅ Rapport d'analyse sauvegardé: ${outputPath}`);
  }

  /**
   * Recherche des templates par critères
   */
  searchTemplates(criteria) {
    const results = [];
    
    for (const [id, template] of this.templateDatabase) {
      let score = 0;
      
      if (criteria.objective && template.metadata.objective === criteria.objective) score += 10;
      if (criteria.targetAudience && template.metadata.targetAudience === criteria.targetAudience) score += 10;
      if (criteria.tone && template.metadata.tone === criteria.tone) score += 5;
      if (criteria.category && template.category === criteria.category) score += 5;
      if (criteria.keywords) {
        criteria.keywords.forEach(keyword => {
          if (template.metadata.keywords.includes(keyword.toLowerCase())) score += 3;
        });
      }
      
      if (score > 0) {
        results.push({ ...template, matchScore: score });
      }
    }
    
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Obtient les statistiques globales
   */
  getGlobalStats() {
    const templates = Array.from(this.templateDatabase.values());
    
    const stats = {
      total: templates.length,
      by_category: {},
      by_objective: {},
      by_audience: {},
      by_tone: {},
      avg_word_count: 0,
      languages: {}
    };

    templates.forEach(template => {
      // Par catégorie
      stats.by_category[template.category] = (stats.by_category[template.category] || 0) + 1;
      
      // Par objectif
      stats.by_objective[template.metadata.objective] = (stats.by_objective[template.metadata.objective] || 0) + 1;
      
      // Par audience
      stats.by_audience[template.metadata.targetAudience] = (stats.by_audience[template.metadata.targetAudience] || 0) + 1;
      
      // Par ton
      stats.by_tone[template.metadata.tone] = (stats.by_tone[template.metadata.tone] || 0) + 1;
      
      // Par langue
      stats.languages[template.metadata.language] = (stats.languages[template.metadata.language] || 0) + 1;
    });

    // Moyenne de mots
    stats.avg_word_count = Math.round(
      templates.reduce((sum, t) => sum + t.style.wordCount, 0) / templates.length
    );

    return stats;
  }
}