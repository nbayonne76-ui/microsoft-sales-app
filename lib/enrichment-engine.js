/**
 * MOTEUR D'ENRICHISSEMENT ENTREPRISE - MÉTHODOLOGIE PROFESSIONNELLE
 *
 * Basé sur l'approche systématique en 6 phases:
 * 1. Analyse de la requête
 * 2. Recherche initiale générique
 * 3. Extraction site web principal
 * 4. Recherche ciblée informations légales
 * 5. Validation croisée et synthèse
 * 6. Scoring de confiance
 */

// ============================================================================
// PHASE 1: ANALYSE DE LA REQUÊTE
// ============================================================================

export class EnrichmentEngine {
  constructor(companyName) {
    this.companyName = companyName;
    this.searchResults = [];
    this.extractedData = {
      identification: {},
      legal: {},
      contact: {},
      team: {},
      projects: [],
      history: [],
      brands: [],
      finances: {}
    };
    this.confidenceScores = {};
    this.sources = [];
  }

  /**
   * PHASE 1: Analyse sémantique de la requête
   */
  analyzeQuery() {
    return {
      entityType: 'COMPANY',
      searchComplexity: 'HIGH',
      estimatedSearches: 3,
      requiredInfo: [
        'SIRET/SIREN',
        'Adresse légale',
        'Dirigeants',
        'Activité',
        'Chiffre d\'affaires',
        'Effectif',
        'Historique'
      ]
    };
  }

  // ============================================================================
  // PHASE 2: RECHERCHES PROGRESSIVES
  // ============================================================================

  /**
   * Recherche #1: Requête générique initiale
   */
  async searchPhase1_Generic() {
    console.log('🔍 PHASE 1: Recherche générique');
    const query = this.companyName;

    try {
      const response = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(query)}&per_page=1`);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        return null;
      }

      const company = data.results[0];
      this.sources.push({
        type: 'API_OFFICIELLE',
        name: 'data.gouv.fr',
        reliability: 100,
        timestamp: new Date()
      });

      return this.extractFromGouvernement(company);
    } catch (error) {
      console.error('❌ Erreur recherche gouvernementale:', error.message);
      return null;
    }
  }

  /**
   * Recherche #2: Recherche site web et contexte
   */
  async searchPhase2_WebContext() {
    console.log('🌐 PHASE 2: Recherche web contextuelle');

    // Ici on pourrait utiliser Google Custom Search API ou Bing Search API
    // Pour l'instant on simule la logique

    return {
      officialWebsite: null,
      linkedinProfile: null,
      newsArticles: [],
      projects: []
    };
  }

  /**
   * Recherche #3: Informations légales ciblées (SIRET, dirigeants, finances)
   */
  async searchPhase3_LegalData() {
    console.log('⚖️ PHASE 3: Recherche données légales ciblées');

    // Recherche avec termes spécifiques: SIRET, société, dirigeants
    // Sources potentielles:
    // - pappers.fr API (payant mais très complet)
    // - societe.com scraping (avec rate limiting)
    // - manageo.fr

    return {
      legal_form: null,
      capital: null,
      directors: [],
      finances: {},
      brands: []
    };
  }

  // ============================================================================
  // PHASE 3: EXTRACTION ET NORMALISATION
  // ============================================================================

  /**
   * Extraction depuis API gouvernementale
   */
  extractFromGouvernement(company) {
    const extracted = {
      identification: {
        siren: company.siren,
        siret: company.siege?.siret || null,
        nom_complet: company.nom_complet || company.nom_raison_sociale,
        nom_commercial: company.nom_raison_sociale
      },
      legal: {
        forme_juridique: this.mapNatureJuridique(company.nature_juridique),
        code_naf: company.activite_principale,
        date_creation: company.date_creation,
        etat: company.etat_administratif
      },
      contact: {
        adresse: company.siege?.adresse || null,
        code_postal: company.siege?.code_postal || null,
        ville: company.siege?.libelle_commune || null,
        departement: company.siege?.libelle_commune ? this.extractDepartement(company.siege.code_postal) : null
      },
      effectif: this.parseEffectif(company.tranche_effectif_salarie)
    };

    // Calculer score de confiance
    this.confidenceScores.gouvernement = this.calculateConfidence(extracted);

    return extracted;
  }

  /**
   * Mapping nature juridique vers forme lisible
   */
  mapNatureJuridique(code) {
    const mapping = {
      '5499': 'SA à conseil d\'administration (s.a.i.)',
      '5498': 'SAS, société par actions simplifiée',
      '5410': 'SARL unipersonnelle',
      '5499': 'SARL, société à responsabilité limitée'
    };
    return mapping[code] || code;
  }

  /**
   * Parser tranche effectif
   */
  parseEffectif(tranche) {
    const tranches = {
      '00': { min: 0, max: 0, label: '0 salarié' },
      '01': { min: 1, max: 2, label: '1 à 2 salariés' },
      '02': { min: 3, max: 5, label: '3 à 5 salariés' },
      '03': { min: 6, max: 9, label: '6 à 9 salariés' },
      '11': { min: 10, max: 19, label: '10 à 19 salariés' },
      '12': { min: 20, max: 49, label: '20 à 49 salariés' },
      '21': { min: 50, max: 99, label: '50 à 99 salariés' },
      '22': { min: 100, max: 199, label: '100 à 199 salariés' },
      '31': { min: 200, max: 249, label: '200 à 249 salariés' },
      '32': { min: 250, max: 499, label: '250 à 499 salariés' },
      '41': { min: 500, max: 999, label: '500 à 999 salariés' },
      '42': { min: 1000, max: 1999, label: '1 000 à 1 999 salariés' },
      '51': { min: 2000, max: 4999, label: '2 000 à 4 999 salariés' },
      '52': { min: 5000, max: 9999, label: '5 000 à 9 999 salariés' },
      '53': { min: 10000, max: null, label: '10 000 salariés et plus' }
    };

    const range = tranches[tranche];
    return range ? range.min : null;
  }

  /**
   * Extraire département du code postal
   */
  extractDepartement(codePostal) {
    if (!codePostal) return null;
    const dept = codePostal.substring(0, 2);

    const departements = {
      '01': 'Ain', '02': 'Aisne', '03': 'Allier', '04': 'Alpes-de-Haute-Provence',
      '05': 'Hautes-Alpes', '06': 'Alpes-Maritimes', '07': 'Ardèche', '08': 'Ardennes',
      '09': 'Ariège', '10': 'Aube', '11': 'Aude', '12': 'Aveyron',
      '13': 'Bouches-du-Rhône', '14': 'Calvados', '15': 'Cantal', '16': 'Charente',
      '17': 'Charente-Maritime', '18': 'Cher', '19': 'Corrèze', '21': 'Côte-d\'Or',
      '22': 'Côtes-d\'Armor', '23': 'Creuse', '24': 'Dordogne', '25': 'Doubs',
      '26': 'Drôme', '27': 'Eure', '28': 'Eure-et-Loir', '29': 'Finistère',
      '30': 'Gard', '31': 'Haute-Garonne', '32': 'Gers', '33': 'Gironde',
      '34': 'Hérault', '35': 'Ille-et-Vilaine', '36': 'Indre', '37': 'Indre-et-Loire',
      '38': 'Isère', '39': 'Jura', '40': 'Landes', '41': 'Loir-et-Cher',
      '42': 'Loire', '43': 'Haute-Loire', '44': 'Loire-Atlantique', '45': 'Loiret',
      '46': 'Lot', '47': 'Lot-et-Garonne', '48': 'Lozère', '49': 'Maine-et-Loire',
      '50': 'Manche', '51': 'Marne', '52': 'Haute-Marne', '53': 'Mayenne',
      '54': 'Meurthe-et-Moselle', '55': 'Meuse', '56': 'Morbihan', '57': 'Moselle',
      '58': 'Nièvre', '59': 'Nord', '60': 'Oise', '61': 'Orne',
      '62': 'Pas-de-Calais', '63': 'Puy-de-Dôme', '64': 'Pyrénées-Atlantiques',
      '65': 'Hautes-Pyrénées', '66': 'Pyrénées-Orientales', '67': 'Bas-Rhin',
      '68': 'Haut-Rhin', '69': 'Rhône', '70': 'Haute-Saône', '71': 'Saône-et-Loire',
      '72': 'Sarthe', '73': 'Savoie', '74': 'Haute-Savoie', '75': 'Paris',
      '76': 'Seine-Maritime', '77': 'Seine-et-Marne', '78': 'Yvelines', '79': 'Deux-Sèvres',
      '80': 'Somme', '81': 'Tarn', '82': 'Tarn-et-Garonne', '83': 'Var',
      '84': 'Vaucluse', '85': 'Vendée', '86': 'Vienne', '87': 'Haute-Vienne',
      '88': 'Vosges', '89': 'Yonne', '90': 'Territoire de Belfort', '91': 'Essonne',
      '92': 'Hauts-de-Seine', '93': 'Seine-Saint-Denis', '94': 'Val-de-Marne',
      '95': 'Val-d\'Oise'
    };

    return departements[dept] || dept;
  }

  // ============================================================================
  // PHASE 4: VALIDATION CROISÉE
  // ============================================================================

  /**
   * Valider information avec plusieurs sources
   */
  validateCrossSource(field, value) {
    const sources = this.sources.filter(s => s.data && s.data[field] === value);

    return {
      value,
      validated: sources.length >= 2,
      sources: sources.length,
      confidence: Math.min(100, sources.length * 40)
    };
  }

  // ============================================================================
  // PHASE 5: SCORING DE CONFIANCE
  // ============================================================================

  /**
   * Calculer score de confiance global
   */
  calculateConfidence(data) {
    const weights = {
      siret: 0.30,
      adresse: 0.15,
      forme_juridique: 0.10,
      dirigeants: 0.15,
      activite: 0.10,
      effectif: 0.10,
      finances: 0.10
    };

    let score = 0;

    if (data.identification?.siret) score += weights.siret;
    if (data.contact?.adresse) score += weights.adresse;
    if (data.legal?.forme_juridique) score += weights.forme_juridique;
    if (data.legal?.code_naf) score += weights.activite;
    if (data.effectif) score += weights.effectif;

    return Math.round(score * 100);
  }

  // ============================================================================
  // ORCHESTRATION PRINCIPALE
  // ============================================================================

  /**
   * Lancer enrichissement complet
   */
  async enrich() {
    console.log(`\n🚀 DÉMARRAGE ENRICHISSEMENT: ${this.companyName}`);
    console.log('=' .repeat(80));

    const analysis = this.analyzeQuery();
    console.log(`📊 Complexité: ${analysis.searchComplexity}`);
    console.log(`🔢 Recherches estimées: ${analysis.estimatedSearches}`);

    let hasData = false;

    // Phase 1: Recherche API gouvernementale
    try {
      console.log('🔍 PHASE 1: Appel API gouvernementale...');
      const govData = await this.searchPhase1_Generic();
      if (govData) {
        Object.assign(this.extractedData, govData);
        console.log(`✅ Données gouvernementales récupérées (Confiance: ${this.confidenceScores.gouvernement}%)`);
        console.log(`   SIRET: ${govData.identification?.siret || 'N/A'}`);
        console.log(`   Adresse: ${govData.contact?.adresse || 'N/A'}`);
        hasData = true;
      } else {
        console.log('⚠️ Aucune donnée gouvernementale trouvée');
      }
    } catch (error) {
      console.error('❌ ERREUR Phase 1:', error.message);
    }

    // Phase 2: Contexte web (à implémenter avec API)
    // const webData = await this.searchPhase2_WebContext();

    // Phase 3: Données légales complémentaires (à implémenter)
    // const legalData = await this.searchPhase3_LegalData();

    // Score de confiance final
    const finalConfidence = this.calculateConfidence(this.extractedData);

    console.log('=' .repeat(80));
    if (hasData) {
      console.log(`✅ ENRICHISSEMENT TERMINÉ - Score de confiance: ${finalConfidence}%`);
    } else {
      console.log(`⚠️ ENRICHISSEMENT TERMINÉ SANS DONNÉES - Score: ${finalConfidence}%`);
    }

    return {
      success: hasData, // Only success if we actually got data
      data: this.extractedData,
      confidence: finalConfidence,
      sources: this.sources.length,
      timestamp: new Date(),
      message: hasData ? 'Enrichissement réussi' : 'Aucune donnée trouvée'
    };
  }
}

// ============================================================================
// FONCTION UTILITAIRE PRINCIPALE
// ============================================================================

/**
 * Point d'entrée simplifié pour enrichissement
 */
export async function enrichCompany(companyName) {
  const engine = new EnrichmentEngine(companyName);
  return await engine.enrich();
}
