/**
 * Service d'analyse des contacts pour améliorer la personnalisation des emails
 * Inspiré du système intelligent fourni
 */

const ContactRole = {
  CEO: "CEO",
  CTO: "CTO", 
  DSI: "DSI",
  CDO: "CDO",
  MARKETING_DIRECTOR: "Directeur Marketing",
  SALES_DIRECTOR: "Directeur Commercial", 
  IT_MANAGER: "Responsable IT",
  FINANCE_DIRECTOR: "Directeur Financier",
  UNKNOWN: "Non défini"
};

class ContactAnalyzer {
  constructor() {
    this.roleKeywords = {
      [ContactRole.CEO]: ['ceo', 'pdg', 'président', 'directeur général', 'dg'],
      [ContactRole.CTO]: ['cto', 'directeur technique', 'chief technical', 'responsable technique'],
      [ContactRole.DSI]: ['dsi', 'directeur système', 'directeur informatique', 'chief information'],
      [ContactRole.CDO]: ['cdo', 'chief digital', 'directeur digital', 'transformation digitale'],
      [ContactRole.MARKETING_DIRECTOR]: ['directeur marketing', 'responsable marketing', 'marketing manager'],
      [ContactRole.SALES_DIRECTOR]: ['directeur commercial', 'responsable ventes', 'sales director'],
      [ContactRole.IT_MANAGER]: ['responsable it', 'manager it', 'administrateur système'],
      [ContactRole.FINANCE_DIRECTOR]: ['directeur financier', 'responsable finance', 'cfo']
    };
  }

  /**
   * Analyse un contact et détermine son rôle
   */
  analyzeContact(contactName, partnerName, additionalInfo = '') {
    const role = this.detectRole(contactName, additionalInfo);
    const analysis = {
      name: contactName,
      company: partnerName,
      role: role,
      emailPersonalization: this.getEmailPersonalization(role),
      insights: this.generateInsights(role, partnerName)
    };

    return analysis;
  }

  /**
   * Détecte le rôle d'un contact basé sur son nom et infos additionnelles
   */
  detectRole(contactName, additionalInfo = '') {
    const searchText = `${contactName} ${additionalInfo}`.toLowerCase();
    
    for (const [role, keywords] of Object.entries(this.roleKeywords)) {
      for (const keyword of keywords) {
        if (searchText.includes(keyword)) {
          return role;
        }
      }
    }
    
    // Détection basée sur les patterns de noms
    if (contactName.toLowerCase().includes('directeur')) {
      return ContactRole.UNKNOWN; // Directeur mais pas spécifique
    }
    
    return ContactRole.UNKNOWN;
  }

  /**
   * Génère des éléments de personnalisation pour l'email selon le rôle
   */
  getEmailPersonalization(role) {
    const personalizations = {
      [ContactRole.CEO]: {
        tone: 'executive',
        focus: ['ROI', 'transformation digitale', 'avantage concurrentiel'],
        approach: 'Vision stratégique et impact business',
        callToAction: 'Échange stratégique sur les enjeux de transformation'
      },
      [ContactRole.CTO]: {
        tone: 'technical_expert',
        focus: ['architecture', 'innovation technique', 'scalabilité'],
        approach: 'Solutions techniques et roadmap technologique',
        callToAction: 'Discussion technique avec nos experts'
      },
      [ContactRole.DSI]: {
        tone: 'technical_leader',
        focus: ['infrastructure', 'sécurité', 'optimisation'],
        approach: 'Gestion IT et optimisation des systèmes',
        callToAction: 'Analyse de votre environnement IT'
      },
      [ContactRole.CDO]: {
        tone: 'digital_transformation',
        focus: ['digitalisation', 'modernisation', 'collaboration'],
        approach: 'Transformation digitale et outils collaboratifs',
        callToAction: 'Stratégie de transformation digitale'
      },
      [ContactRole.IT_MANAGER]: {
        tone: 'technical_implementation',
        focus: ['déploiement', 'gestion quotidienne', 'support'],
        approach: 'Implémentation et gestion opérationnelle',
        callToAction: 'Support dans vos projets IT'
      }
    };

    return personalizations[role] || {
      tone: 'professional',
      focus: ['collaboration', 'productivité', 'efficacité'],
      approach: 'Solutions adaptées à vos besoins',
      callToAction: 'Échange sur vos enjeux'
    };
  }

  /**
   * Génère des insights spécifiques selon le rôle et l'entreprise
   */
  generateInsights(role, companyName) {
    const baseInsights = {
      companySize: this.estimateCompanySize(companyName),
      likely_challenges: this.identifyLikelyChallenges(role),
      microsoft_relevance: this.getMicrosoftRelevance(role)
    };

    return baseInsights;
  }

  /**
   * Estime la taille de l'entreprise (basique pour l'instant)
   */
  estimateCompanySize(companyName) {
    const knownLargeCompanies = ['microsoft', 'google', 'amazon', 'total', 'orange', 'bnp'];
    const knownMediumCompanies = ['efisens', 'adista', 'be cloud', 'crayon'];
    
    const nameLower = companyName.toLowerCase();
    
    if (knownLargeCompanies.some(company => nameLower.includes(company))) {
      return 'enterprise';
    } else if (knownMediumCompanies.some(company => nameLower.includes(company))) {
      return 'medium';
    }
    
    return 'unknown';
  }

  /**
   * Identifie les défis probables selon le rôle
   */
  identifyLikelyChallenges(role) {
    const challenges = {
      [ContactRole.CEO]: ['Croissance', 'Compétitivité', 'Transformation digitale'],
      [ContactRole.CTO]: ['Innovation', 'Scalabilité', 'Architecture moderne'],
      [ContactRole.DSI]: ['Sécurité', 'Coûts IT', 'Modernisation infrastructure'],
      [ContactRole.CDO]: ['Adoption digitale', 'Collaboration', 'Outils modernes'],
      [ContactRole.IT_MANAGER]: ['Productivité équipe', 'Support utilisateurs', 'Maintenance']
    };

    return challenges[role] || ['Efficacité', 'Productivité', 'Modernisation'];
  }

  /**
   * Détermine la pertinence Microsoft selon le rôle
   */
  getMicrosoftRelevance(role) {
    const relevance = {
      [ContactRole.CEO]: ['ROI M365', 'Copilot pour dirigeants', 'Sécurité entreprise'],
      [ContactRole.CTO]: ['Azure architecture', 'AI et développement', 'DevOps'],
      [ContactRole.DSI]: ['Gestion M365', 'Sécurité avancée', 'Compliance'],
      [ContactRole.CDO]: ['Teams collaboration', 'SharePoint moderne', 'Power Platform'],
      [ContactRole.IT_MANAGER]: ['Administration M365', 'Support utilisateurs', 'Formation']
    };

    return relevance[role] || ['M365 productivité', 'Collaboration Teams', 'Sécurité basique'];
  }

  /**
   * Améliore le template Introduction FY25/26 avec l'analyse du contact
   */
  enhanceIntroductionTemplate(template, contactAnalysis) {
    const { role, emailPersonalization } = contactAnalysis;
    
    // Adaptation du contenu selon le rôle
    let enhancedContent = template.content;
    
    // Ajout d'une phrase personnalisée selon le rôle
    const roleSpecificIntro = this.getRoleSpecificIntro(role);
    if (roleSpecificIntro) {
      enhancedContent = enhancedContent.replace(
        'Je prends le relai sur votre accompagnement',
        `Je prends le relai sur votre accompagnement ${roleSpecificIntro}`
      );
    }

    // Adaptation des points d'approche selon le rôle
    const focusPoints = emailPersonalization.focus;
    if (focusPoints && focusPoints.length > 0) {
      const focusText = focusPoints.slice(0, 2).join(', ');
      enhancedContent = enhancedContent.replace(
        'Workshop par thématique pour atteindre vos objectives',
        `Workshop ciblés sur ${focusText} pour atteindre vos objectifs`
      );
    }

    return {
      ...template,
      content: enhancedContent,
      metadata: {
        role: role,
        personalization_applied: true,
        focus_areas: emailPersonalization.focus
      }
    };
  }

  /**
   * Génère une intro spécifique au rôle
   */
  getRoleSpecificIntro(role) {
    const intros = {
      [ContactRole.CEO]: 'avec un focus sur la vision stratégique et le ROI',
      [ContactRole.CTO]: 'avec une approche technique et innovation',
      [ContactRole.DSI]: 'en me concentrant sur l\'optimisation de votre IT',
      [ContactRole.CDO]: 'dans votre démarche de transformation digitale',
      [ContactRole.IT_MANAGER]: 'pour simplifier votre gestion quotidienne'
    };

    return intros[role] || '';
  }
}

// Fonction utilitaire pour intégrer dans l'API existante
function analyzeContactForEmail(contactName, partnerName, additionalInfo = '') {
  const analyzer = new ContactAnalyzer();
  return analyzer.analyzeContact(contactName, partnerName, additionalInfo);
}

function enhanceTemplateWithContactAnalysis(template, contactAnalysis) {
  const analyzer = new ContactAnalyzer();
  return analyzer.enhanceIntroductionTemplate(template, contactAnalysis);
}

module.exports = {
  ContactAnalyzer,
  ContactRole,
  analyzeContactForEmail,
  enhanceTemplateWithContactAnalysis
};