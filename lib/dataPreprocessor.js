/**
 * Comprehensive Data Preprocessing Pipeline
 * Improves data quality for email generation and chatbot interactions
 */

export class DataPreprocessor {
  constructor() {
    this.emailPatterns = this.initializeEmailPatterns();
    this.phonePatterns = this.initializePhonePatterns();
    this.companyPatterns = this.initializeCompanyPatterns();
    this.namePatterns = this.initializeNamePatterns();
  }

  // Email patterns for various formats
  initializeEmailPatterns() {
    return [
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      /[a-zA-Z0-9._%+-]+\s*@\s*[a-zA-Z0-9.-]+\s*\.\s*[a-zA-Z]{2,}/g, // With spaces
      /[a-zA-Z0-9._%+-]+\[at\][a-zA-Z0-9.-]+\[dot\][a-zA-Z]{2,}/g, // Obfuscated
    ];
  }

  // Phone number patterns (French and international)
  initializePhonePatterns() {
    return [
      /(?:\+33|0)[1-9](?:[.\-\s]?\d{2}){4}/g, // French format
      /\+\d{1,3}[\s.-]?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g, // International
      /\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/g, // 10 digits
    ];
  }

  // Company name indicators
  initializeCompanyPatterns() {
    return {
      suffixes: [
        'sarl', 'sas', 'sa', 'eurl', 'sci', 'snc', 'scp', 'sep',
        'ltd', 'inc', 'corp', 'llc', 'gmbh', 'ag', 'spa', 'bv',
        'group', 'groupe', 'holding', 'international', 'worldwide',
        'solutions', 'services', 'consulting', 'technologies', 'systems'
      ],
      keywords: [
        'microsoft', 'azure', 'office', 'teams', 'outlook', 'sharepoint',
        'dynamics', 'power', 'bi', 'copilot', 'windows', 'surface'
      ]
    };
  }

  // Name patterns and common names
  initializeNamePatterns() {
    return {
      titles: ['m.', 'mr', 'mrs', 'mme', 'mlle', 'ms', 'dr', 'prof'],
      commonFirstNames: [
        'jean', 'marie', 'michel', 'alain', 'pierre', 'philippe', 'bernard',
        'christophe', 'nicolas', 'laurent', 'françois', 'david', 'eric',
        'sophie', 'nathalie', 'isabelle', 'catherine', 'françoise', 'anne'
      ]
    };
  }

  /**
   * Main preprocessing function - cleans and normalizes input text
   */
  preprocessText(text, options = {}) {
    if (!text || typeof text !== 'string') return '';

    const {
      normalizeWhitespace = true,
      removeSpecialChars = false,
      preserveFormatting = true,
      extractStructuredData = true
    } = options;

    let processed = text;

    // 1. Basic cleaning
    if (normalizeWhitespace) {
      processed = this.normalizeWhitespace(processed);
    }

    // 2. Character normalization
    processed = this.normalizeCharacters(processed);

    // 3. Remove unwanted characters (optional)
    if (removeSpecialChars) {
      processed = this.removeSpecialCharacters(processed);
    }

    // 4. Extract and validate structured data
    const structuredData = extractStructuredData ? this.extractStructuredData(processed) : {};

    // 5. Quality assessment
    const quality = this.assessTextQuality(processed, structuredData);

    return {
      originalText: text,
      processedText: processed,
      structuredData,
      quality,
      suggestions: this.generateImprovementSuggestions(processed, structuredData, quality)
    };
  }

  /**
   * Normalize whitespace and line breaks
   */
  normalizeWhitespace(text) {
    return text
      .replace(/\r\n/g, '\n')                // Normalize line endings
      .replace(/\r/g, '\n')                  // Convert CR to LF
      .replace(/\t/g, ' ')                   // Convert tabs to spaces
      .replace(/\u00A0/g, ' ')              // Convert non-breaking spaces
      .replace(/ +/g, ' ')                   // Multiple spaces to single
      .replace(/\n +/g, '\n')                // Remove spaces at line start
      .replace(/ +\n/g, '\n')                // Remove spaces at line end
      .replace(/\n{3,}/g, '\n\n')            // Max 2 consecutive line breaks
      .trim();
  }

  /**
   * Normalize special characters and accents
   */
  normalizeCharacters(text) {
    return text
      .replace(/[''`]/g, "'")                // Normalize quotes
      .replace(/[""]/g, '"')                 // Normalize double quotes
      .replace(/[–—]/g, '-')                 // Normalize dashes
      .replace(/…/g, '...')                  // Normalize ellipsis
      .replace(/\u2022/g, '•');              // Normalize bullet points
  }

  /**
   * Remove unwanted special characters (preserve business-relevant ones)
   */
  removeSpecialCharacters(text) {
    // Keep: letters, numbers, basic punctuation, business symbols (@, ., -, _, +)
    return text.replace(/[^\w\s@.\-_+()[\]{}:;,!?'"]/g, '');
  }

  /**
   * Extract structured data from text
   */
  extractStructuredData(text) {
    const data = {
      emails: this.extractEmails(text),
      phones: this.extractPhones(text),
      companies: this.extractCompanies(text),
      names: this.extractNames(text),
      addresses: this.extractAddresses(text),
      dates: this.extractDates(text),
      urls: this.extractUrls(text),
      amounts: this.extractAmounts(text)
    };

    // Clean and deduplicate
    Object.keys(data).forEach(key => {
      data[key] = [...new Set(data[key])].filter(item => item && item.trim());
    });

    return data;
  }

  /**
   * Extract email addresses
   */
  extractEmails(text) {
    const emails = [];
    
    this.emailPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => {
        // Clean and validate
        let email = match.toLowerCase()
          .replace(/\s/g, '')
          .replace(/\[at\]/g, '@')
          .replace(/\[dot\]/g, '.');
          
        if (this.isValidEmail(email)) {
          emails.push(email);
        }
      });
    });

    return emails;
  }

  /**
   * Extract phone numbers
   */
  extractPhones(text) {
    const phones = [];
    
    this.phonePatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => {
        const cleaned = this.cleanPhoneNumber(match);
        if (cleaned && this.isValidPhone(cleaned)) {
          phones.push(cleaned);
        }
      });
    });

    return phones;
  }

  /**
   * Extract company names
   */
  extractCompanies(text) {
    const companies = [];
    const lines = text.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (this.isLikelyCompanyName(trimmed)) {
        companies.push(trimmed);
      }
    });

    // Also check for Microsoft-related companies
    const msPattern = new RegExp(
      `\\b(${this.companyPatterns.keywords.join('|')})\\s+\\w*`, 'gi'
    );
    const msMatches = text.match(msPattern) || [];
    companies.push(...msMatches);

    return companies;
  }

  /**
   * Extract person names
   */
  extractNames(text) {
    const names = [];
    const words = text.split(/\s+/);
    
    for (let i = 0; i < words.length - 1; i++) {
      const word1 = words[i].toLowerCase();
      const word2 = words[i + 1].toLowerCase();
      
      // Check for title + name patterns
      if (this.namePatterns.titles.includes(word1)) {
        names.push(`${words[i]} ${words[i + 1]}`);
      }
      
      // Check for common first name + capitalized word
      if (this.namePatterns.commonFirstNames.includes(word1) && 
          words[i + 1].match(/^[A-Z][a-z]+$/)) {
        names.push(`${words[i]} ${words[i + 1]}`);
      }
    }

    return names;
  }

  /**
   * Extract addresses (basic implementation)
   */
  extractAddresses(text) {
    const addresses = [];
    const addressPattern = /\d+\s+[A-Za-z\s]+,\s*\d{5}\s+[A-Za-z\s]+/g;
    const matches = text.match(addressPattern) || [];
    addresses.push(...matches);
    return addresses;
  }

  /**
   * Extract dates
   */
  extractDates(text) {
    const dates = [];
    const datePatterns = [
      /\d{1,2}\/\d{1,2}\/\d{2,4}/g,        // DD/MM/YYYY
      /\d{1,2}-\d{1,2}-\d{2,4}/g,          // DD-MM-YYYY
      /\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+\d{4}/gi,
    ];

    datePatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      dates.push(...matches);
    });

    return dates;
  }

  /**
   * Extract URLs
   */
  extractUrls(text) {
    const urlPattern = /https?:\/\/[^\s]+/g;
    return text.match(urlPattern) || [];
  }

  /**
   * Extract monetary amounts
   */
  extractAmounts(text) {
    const amountPatterns = [
      /\d+[,.]?\d*\s*€/g,                    // Euros
      /€\s*\d+[,.]?\d*/g,                    // Euros (prefix)
      /\$\d+[,.]?\d*/g,                      // Dollars
      /\d+[,.]?\d*\s*EUR/g,                  // EUR suffix
    ];

    const amounts = [];
    amountPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      amounts.push(...matches);
    });

    return amounts;
  }

  /**
   * Assess text quality
   */
  assessTextQuality(text, structuredData) {
    const quality = {
      score: 0,
      issues: [],
      strengths: [],
      readability: 'unknown',
      completeness: 'unknown',
      businessRelevance: 'unknown'
    };

    // Length check
    if (text.length < 10) {
      quality.issues.push('Texte trop court');
      quality.score -= 20;
    } else if (text.length > 50) {
      quality.strengths.push('Longueur appropriée');
      quality.score += 10;
    }

    // Structured data check
    const hasEmails = structuredData.emails?.length > 0;
    const hasPhones = structuredData.phones?.length > 0;
    const hasCompanies = structuredData.companies?.length > 0;
    const hasNames = structuredData.names?.length > 0;

    if (hasEmails) {
      quality.strengths.push('Email détecté');
      quality.score += 15;
    }
    if (hasPhones) {
      quality.strengths.push('Téléphone détecté');
      quality.score += 10;
    }
    if (hasCompanies) {
      quality.strengths.push('Entreprise détectée');
      quality.score += 10;
    }
    if (hasNames) {
      quality.strengths.push('Nom détecté');
      quality.score += 10;
    }

    // Business relevance
    const businessKeywords = [
      'réunion', 'meeting', 'projet', 'devis', 'proposition',
      'azure', 'microsoft', 'office', 'teams', 'sharepoint'
    ];
    const hasBusinessKeywords = businessKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );

    if (hasBusinessKeywords) {
      quality.businessRelevance = 'high';
      quality.score += 15;
    } else if (hasEmails || hasPhones) {
      quality.businessRelevance = 'medium';
      quality.score += 5;
    } else {
      quality.businessRelevance = 'low';
    }

    // Readability assessment
    const sentences = text.split(/[.!?]+/).length;
    const words = text.split(/\s+/).length;
    const avgWordsPerSentence = words / Math.max(sentences, 1);

    if (avgWordsPerSentence > 25) {
      quality.issues.push('Phrases trop longues');
      quality.readability = 'difficult';
    } else if (avgWordsPerSentence < 5) {
      quality.issues.push('Phrases trop courtes');
      quality.readability = 'choppy';
    } else {
      quality.readability = 'good';
      quality.score += 5;
    }

    // Completeness
    if (hasEmails && hasNames && (hasCompanies || hasPhones)) {
      quality.completeness = 'high';
      quality.score += 10;
    } else if (hasEmails || hasNames) {
      quality.completeness = 'medium';
    } else {
      quality.completeness = 'low';
      quality.issues.push('Informations de contact incomplètes');
    }

    // Normalize score to 0-100
    quality.score = Math.max(0, Math.min(100, quality.score + 50));

    return quality;
  }

  /**
   * Generate improvement suggestions
   */
  generateImprovementSuggestions(text, structuredData, quality) {
    const suggestions = [];

    // Missing information suggestions
    if (!structuredData.emails?.length) {
      suggestions.push({
        type: 'missing_data',
        message: 'Ajouter une adresse email pour améliorer la génération',
        action: 'add_email'
      });
    }

    if (!structuredData.companies?.length && !structuredData.names?.length) {
      suggestions.push({
        type: 'missing_data',
        message: 'Préciser le nom du contact ou de l\'entreprise',
        action: 'add_contact_info'
      });
    }

    // Quality improvements
    if (quality.score < 50) {
      suggestions.push({
        type: 'quality',
        message: 'Le texte pourrait être enrichi avec plus d\'informations',
        action: 'enhance_content'
      });
    }

    // Business context suggestions
    if (quality.businessRelevance === 'low') {
      suggestions.push({
        type: 'context',
        message: 'Ajouter le contexte business (projet, objectif, etc.)',
        action: 'add_business_context'
      });
    }

    // Formatting suggestions
    if (text.length > 500) {
      suggestions.push({
        type: 'formatting',
        message: 'Texte long - considérer la structuration en sections',
        action: 'structure_content'
      });
    }

    return suggestions;
  }

  /**
   * Validation helpers
   */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone) {
    const cleaned = phone.replace(/[^\d]/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  isLikelyCompanyName(text) {
    if (text.length < 3 || text.length > 100) return false;
    
    const lower = text.toLowerCase();
    
    // Check for company suffixes
    const hasSuffix = this.companyPatterns.suffixes.some(suffix => 
      lower.includes(suffix)
    );
    
    // Check for business keywords
    const hasKeyword = this.companyPatterns.keywords.some(keyword => 
      lower.includes(keyword)
    );
    
    // Check for multiple capital letters (likely company name)
    const capitalLetters = (text.match(/[A-Z]/g) || []).length;
    
    return hasSuffix || hasKeyword || (capitalLetters >= 2 && text.length > 5);
  }

  cleanPhoneNumber(phone) {
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // French number normalization
    if (cleaned.startsWith('0')) {
      cleaned = '+33' + cleaned.substring(1);
    }
    
    return cleaned;
  }

  /**
   * Specialized preprocessing for different data types
   */
  preprocessForEmailGeneration(data) {
    const processed = this.preprocessText(data, {
      normalizeWhitespace: true,
      removeSpecialChars: false,
      preserveFormatting: true,
      extractStructuredData: true
    });

    // Additional processing for email context
    const emailContext = {
      ...processed,
      emailType: this.detectEmailType(processed.processedText, processed.structuredData),
      tone: this.suggestTone(processed.processedText, processed.structuredData),
      priority: this.assessPriority(processed.processedText, processed.structuredData)
    };

    return emailContext;
  }

  detectEmailType(text, structuredData) {
    const lower = text.toLowerCase();
    
    if (lower.includes('suivi') || lower.includes('follow') || lower.includes('réunion')) {
      return 'follow_up';
    } else if (lower.includes('devis') || lower.includes('proposition') || lower.includes('offre')) {
      return 'proposal';
    } else if (lower.includes('relance') || lower.includes('rappel')) {
      return 'reminder';
    } else if (structuredData.companies?.length && !structuredData.emails?.length) {
      return 'prospection';
    } else {
      return 'general';
    }
  }

  suggestTone(text, structuredData) {
    const lower = text.toLowerCase();
    
    if (lower.includes('urgent') || lower.includes('asap')) {
      return 'urgent';
    } else if (lower.includes('formel') || structuredData.companies?.length) {
      return 'formal';
    } else if (lower.includes('amical') || lower.includes('décontracté')) {
      return 'friendly';
    } else {
      return 'professional';
    }
  }

  assessPriority(text, structuredData) {
    const lower = text.toLowerCase();
    
    const highPriorityKeywords = ['urgent', 'asap', 'important', 'critique'];
    const mediumPriorityKeywords = ['bientôt', 'rapide', 'priorité'];
    
    if (highPriorityKeywords.some(keyword => lower.includes(keyword))) {
      return 'high';
    } else if (mediumPriorityKeywords.some(keyword => lower.includes(keyword))) {
      return 'medium';
    } else {
      return 'normal';
    }
  }
}

export default DataPreprocessor;