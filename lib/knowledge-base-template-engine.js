/**
 * Knowledge Base Template Engine
 * Dynamically populates email templates using Microsoft knowledge base
 */

import { microsoftKnowledgeBase, generateEmailContext } from './microsoft-knowledge-base.js';

export class KnowledgeBaseTemplateEngine {
  constructor() {
    this.knowledgeBase = microsoftKnowledgeBase;
  }

  /**
   * Process template variables with knowledge base data
   */
  processTemplate(templateContent, emailData) {
    const {
      recipientName,
      companyName,
      recipientRole,
      companySize = 'sme',
      industry = 'retail',
      specificNeeds = []
    } = emailData;

    // Get context from knowledge base
    const context = generateEmailContext({ size: companySize }, recipientRole, industry);

    // Replace standard variables
    let processedContent = templateContent
      .replace(/{nom_contact}/g, recipientName || '[Nom]')
      .replace(/{entreprise}/g, companyName || '[Entreprise]')
      .replace(/{taille_entreprise}/g, companySize)
      .replace(/{secteur}/g, industry);

    // Process dynamic content blocks
    processedContent = this._processGreetings(processedContent, recipientName, recipientRole);
    processedContent = this._processIndustryContext(processedContent, industry, context);
    processedContent = this._processValueProposition(processedContent, companySize, context);
    processedContent = this._processCallToAction(processedContent, recipientRole);
    processedContent = this._processSectorBenefits(processedContent, industry, context);
    processedContent = this._processCompliance(processedContent, industry);
    processedContent = this._processSignature(processedContent);
    processedContent = this._processUseCases(processedContent, industry);

    return processedContent;
  }

  /**
   * Generate personalized greetings
   */
  _processGreetings(content, recipientName, recipientRole) {
    const greetings = {
      'DSI': `Bonjour ${recipientName || 'Monsieur/Madame'},

En tant que DSI, vous êtes au cœur de la transformation digitale de votre organisation.`,
      'Directeur Général': `Bonjour ${recipientName || 'Monsieur/Madame'},

En tant que dirigeant, vous cherchez constamment des leviers de croissance et d'innovation.`,
      'DRH': `Bonjour ${recipientName || 'Monsieur/Madame'},

L'expérience collaborateur et la productivité des équipes sont au cœur de vos préoccupations.`,
      'RSSI': `Bonjour ${recipientName || 'Monsieur/Madame'},

La cybersécurité est devenue un enjeu stratégique majeur pour votre organisation.`
    };

    const defaultGreeting = `Bonjour ${recipientName || 'Monsieur/Madame'},

J'espère que ce message vous trouve en bonne santé.`;

    const greeting = greetings[recipientRole] || defaultGreeting;

    return content
      .replace(/{greeting_personnalise}/g, greeting)
      .replace(/{greeting_contextuel}/g, greeting)
      .replace(/{salutation_adaptee}/g, greeting)
      .replace(/{salutation_securite}/g, greeting);
  }

  /**
   * Process industry-specific context
   */
  _processIndustryContext(content, industry, context) {
    const industryContexts = {
      retail: "Le secteur du commerce connaît une transformation accélérée avec l'essor de l'e-commerce et l'évolution des attentes clients.",
      manufacturing: "L'industrie 4.0 révolutionne les processus de production avec l'IoT, l'IA et l'automatisation.",
      healthcare: "Le secteur de la santé fait face à des défis de digitalisation tout en maintenant les plus hauts standards de sécurité.",
      finance: "Les services financiers doivent concilier innovation digitale et conformité réglementaire stricte."
    };

    const industryContext = industryContexts[industry] || "Votre secteur d'activité connaît une transformation digitale rapide.";

    return content.replace(/{contexte_secteur}/g, industryContext);
  }

  /**
   * Process value proposition based on company size
   */
  _processValueProposition(content, companySize, context) {
    const valueProps = {
      startup: `**🚀 Avantages pour les startups :**
• Solutions scalables qui grandissent avec vous
• Coûts maîtrisés et prévisibles
• Mise en place rapide sans expertise technique`,

      sme: `**💼 Bénéfices PME :**
• Transformation digitale accompagnée
• ROI mesurable dès les premiers mois
• Support dédié et formation incluse`,

      enterprise: `**🏢 Valeur Enterprise :**
• Solutions enterprise-grade éprouvées
• Innovation continue et partenariat stratégique
• Sécurité et conformité de niveau entreprise`
    };

    const valueProp = valueProps[companySize] || valueProps.sme;

    return content.replace(/{value_proposition_taille}/g, valueProp);
  }

  /**
   * Process role-specific call to action
   */
  _processCallToAction(content, recipientRole) {
    const ctas = {
      'DSI': "Seriez-vous disponible pour une session technique de 45 minutes où nous pourrions explorer l'architecture et les bénéfices techniques ?",
      'Directeur Général': "Souhaiteriez-vous un executive briefing de 30 minutes sur l'impact business et le ROI de ces solutions ?",
      'DRH': "Pourriez-vous être intéressé par une démonstration de 30 minutes sur l'amélioration de l'expérience collaborateur ?",
      'RSSI': "Seriez-vous disponible pour un audit sécurité de 45 minutes avec démonstration de nos capacités de protection ?"
    };

    const defaultCta = "Seriez-vous disponible pour un échange de 30 minutes dans les prochains jours ?";
    const cta = ctas[recipientRole] || defaultCta;

    return content
      .replace(/{call_to_action_personnalise}/g, cta)
      .replace(/{call_to_action_role}/g, cta)
      .replace(/{proposition_meeting}/g, cta)
      .replace(/{urgence_securite}/g, recipientRole === 'RSSI' ?
        "**⚡ Action immédiate recommandée** - Les cybermenaces ne dorment jamais." : "");
  }

  /**
   * Process sector-specific benefits
   */
  _processSectorBenefits(content, industry, context) {
    const sectorBenefits = context.industryBenefits || [];

    let benefitsText = "";
    if (sectorBenefits.length > 0) {
      benefitsText = `**🎯 Bénéfices spécifiques à votre secteur :**\n`;
      sectorBenefits.forEach(benefit => {
        benefitsText += `• ${benefit}\n`;
      });
    }

    return content.replace(/{benefices_sectoriels}/g, benefitsText);
  }

  /**
   * Process compliance requirements
   */
  _processCompliance(content, industry) {
    const complianceMap = {
      healthcare: "HDS/RGPD",
      finance: "PCI-DSS/RGPD",
      retail: "RGPD",
      manufacturing: "ISO 27001"
    };

    const compliance = complianceMap[industry] || "RGPD/ISO 27001";

    return content.replace(/{conformite_secteur}/g, compliance)
                 .replace(/{conformite_requise}/g, compliance);
  }

  /**
   * Process signature
   */
  _processSignature(content) {
    const signature = `Cordialement,

**Nicolas BAYONNE**
Microsoft - Accompagnement Entreprises
📧 nicolas.bayonne@microsoft.com
📱 +33 6 XX XX XX XX
🌐 [linkedin.com/in/nicolas-bayonne](https://linkedin.com/in/nicolas-bayonne)`;

    return content.replace(/{signature_microsoft}/g, signature);
  }

  /**
   * Process use cases by sector
   */
  _processUseCases(content, industry) {
    const useCases = {
      retail: [
        "Personnalisation en temps réel des recommandations",
        "Optimisation de la chaîne d'approvisionnement",
        "Expérience client omnicanal"
      ],
      manufacturing: [
        "Maintenance prédictive des équipements",
        "Optimisation des processus de production",
        "Traçabilité et qualité produit"
      ],
      healthcare: [
        "Dossiers patients digitalisés et sécurisés",
        "Télémédecine et consultation à distance",
        "Analyse prédictive des soins"
      ],
      finance: [
        "Détection de fraude en temps réel",
        "Automatisation des processus de conformité",
        "Expérience client digitale personnalisée"
      ]
    };

    const sectorUseCases = useCases[industry] || [
      "Automatisation des processus métier",
      "Amélioration de l'expérience client",
      "Optimisation des performances"
    ];

    let useCaseText = "";
    sectorUseCases.forEach(useCase => {
      useCaseText += `• ${useCase}\n`;
    });

    return content
      .replace(/{exemples_sectoriels}/g, useCaseText)
      .replace(/{cas_usage_secteur}/g, useCaseText)
      .replace(/{menaces_sectorielles}/g, industry === 'finance' || industry === 'healthcare' ?
        "⚠️ **Votre secteur est particulièrement ciblé par les cyberattaques** - Protection renforcée essentielle." : "");
  }

  /**
   * Get available templates
   */
  getAvailableTemplates() {
    return [
      {
        id: 'azure-migration',
        name: 'Migration Azure',
        category: 'cloud',
        audience: ['DSI', 'Directeur IT'],
        description: 'Template pour la migration vers Azure'
      },
      {
        id: 'microsoft-365-collaboration',
        name: 'Microsoft 365 & Collaboration',
        category: 'productivity',
        audience: ['DRH', 'Directeur Général'],
        description: 'Template pour les solutions de collaboration'
      },
      {
        id: 'power-platform-digital',
        name: 'Power Platform & Innovation',
        category: 'development',
        audience: ['Directeur Général', 'Directeur Digital'],
        description: 'Template pour la transformation low-code'
      },
      {
        id: 'security-compliance',
        name: 'Sécurité & Conformité',
        category: 'security',
        audience: ['RSSI', 'DSI'],
        description: 'Template pour la cybersécurité'
      }
    ];
  }
}

// Export default instance
export const knowledgeBaseTemplateEngine = new KnowledgeBaseTemplateEngine();