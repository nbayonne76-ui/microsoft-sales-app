/**
 * Smart Email Generator with Microsoft Knowledge Base Integration
 * Generates intelligent, personalized emails using the Microsoft solutions knowledge base
 */

import { microsoftKnowledgeBase, generateEmailContext, getSolutionDetails } from './microsoft-knowledge-base.js';

export class SmartEmailGenerator {
  constructor() {
    this.knowledgeBase = microsoftKnowledgeBase;
  }

  /**
   * Generate a personalized email based on company and recipient data
   */
  generatePersonalizedEmail({
    companyName,
    recipientName,
    recipientRole,
    companySize = 'sme',
    industry = 'retail',
    emailType = 'prospection',
    specificNeeds = [],
    currentChallenges = []
  }) {

    // Get context from knowledge base
    const context = generateEmailContext(
      { size: companySize },
      recipientRole,
      industry
    );

    // Generate personalized content
    const emailContent = this._buildEmailContent({
      companyName,
      recipientName,
      recipientRole,
      context,
      emailType,
      specificNeeds,
      currentChallenges
    });

    return emailContent;
  }

  /**
   * Build email content using knowledge base insights
   */
  _buildEmailContent({
    companyName,
    recipientName,
    recipientRole,
    context,
    emailType,
    specificNeeds,
    currentChallenges
  }) {

    const recommendations = context.recommendations.slice(0, 2); // Top 2 recommendations
    const industryBenefits = context.industryBenefits.slice(0, 3);

    // Generate subject line
    const subject = this._generateSubject({
      companyName,
      emailType,
      recommendations
    });

    // Generate greeting
    const greeting = this._generateGreeting(recipientName);

    // Generate introduction
    const introduction = this._generateIntroduction({
      companyName,
      recipientRole,
      context
    });

    // Generate solution presentation
    const solutionsSection = this._generateSolutionsSection({
      recommendations,
      industryBenefits,
      recipientRole,
      specificNeeds
    });

    // Generate value proposition
    const valueProposition = this._generateValueProposition({
      recommendations,
      context,
      recipientRole
    });

    // Generate call to action
    const callToAction = this._generateCallToAction({
      companyName,
      recipientRole
    });

    // Generate signature
    const signature = this._generateSignature();

    return {
      subject,
      body: `${greeting}

${introduction}

${solutionsSection}

${valueProposition}

${callToAction}

${signature}`,
      metadata: {
        recommendedSolutions: recommendations.map(r => r.name),
        targetAudience: recipientRole,
        industry: context.industryBenefits ? 'identified' : 'generic',
        personalizationLevel: this._calculatePersonalizationLevel({
          specificNeeds,
          currentChallenges,
          recipientRole
        })
      }
    };
  }

  /**
   * Generate intelligent subject line
   */
  _generateSubject({ companyName, emailType, recommendations }) {
    const subjects = {
      prospection: [
        `Transformation digitale ${companyName} - Solutions Microsoft`,
        `${companyName} : Optimisez vos performances avec Microsoft`,
        `Solutions ${recommendations[0]?.category || 'cloud'} pour ${companyName}`,
        `Microsoft x ${companyName} : Accélérez votre croissance`
      ],
      follow_up: [
        `Suite à notre échange - Solutions pour ${companyName}`,
        `${companyName} : Prochaines étapes de votre transformation`,
        `Proposition Microsoft personnalisée pour ${companyName}`
      ],
      demo: [
        `Démonstration ${recommendations[0]?.name || 'Microsoft 365'} pour ${companyName}`,
        `${companyName} : Découvrez vos solutions en action`
      ]
    };

    const subjectList = subjects[emailType] || subjects.prospection;
    return subjectList[Math.floor(Math.random() * subjectList.length)];
  }

  /**
   * Generate personalized greeting
   */
  _generateGreeting(recipientName) {
    const hour = new Date().getHours();
    let timeGreeting = hour < 12 ? 'Bonjour' : 'Bon après-midi';

    return recipientName
      ? `${timeGreeting} ${recipientName},`
      : `${timeGreeting},`;
  }

  /**
   * Generate contextual introduction
   */
  _generateIntroduction({ companyName, recipientRole, context }) {
    const roleIntros = {
      'DSI': `En tant que partenaire technologique de nombreuses entreprises, j'accompagne les DSI dans leur transformation digitale.`,
      'Directeur Général': `Microsoft accompagne les dirigeants dans leur stratégie de croissance et d'innovation.`,
      'DAF': `Nous aidons les directions financières à optimiser leurs investissements IT et mesurer le ROI de la transformation digitale.`,
      'DRH': `Microsoft propose des solutions qui améliorent l'expérience collaborateur et la productivité des équipes.`,
      'Directeur Commercial': `Nos solutions permettent aux équipes commerciales d'augmenter leurs performances et d'améliorer l'expérience client.`
    };

    const roleIntro = roleIntros[recipientRole] ||
      `Je me présente, Nicolas BAYONNE, en charge de l'accompagnement des entreprises chez Microsoft.`;

    return `${roleIntro}

J'ai découvert ${companyName} et je pense que nos solutions pourraient vous intéresser dans votre démarche ${context.approachMessage}.`;
  }

  /**
   * Generate solutions section with knowledge base insights
   */
  _generateSolutionsSection({ recommendations, industryBenefits, recipientRole, specificNeeds }) {
    let solutionsText = "Nos solutions pourraient vous accompagner notamment sur :\n\n";

    recommendations.forEach(solution => {
      const icon = this.knowledgeBase.categories[solution.category]?.icon || "•";
      const valueForRole = this.knowledgeBase.emailHelpers.getValueProposition(
        Object.keys(this.knowledgeBase.solutions).find(key =>
          this.knowledgeBase.solutions[key].name === solution.name
        ),
        recipientRole
      );

      solutionsText += `${icon} **${solution.name}** - ${valueForRole}\n`;

      // Add top business values
      if (solution.businessValue && solution.businessValue.length > 0) {
        solutionsText += `  → ${solution.businessValue[0]}\n`;
      }
      solutionsText += "\n";
    });

    // Add industry-specific benefits if available
    if (industryBenefits.length > 0) {
      solutionsText += "🎯 **Bénéfices spécifiques à votre secteur :**\n";
      industryBenefits.forEach(benefit => {
        solutionsText += `• ${benefit}\n`;
      });
    }

    return solutionsText;
  }

  /**
   * Generate value proposition based on context
   */
  _generateValueProposition({ recommendations, context, recipientRole }) {
    const keyMessages = context.keyMessages || [];
    let valueText = "🚀 **Pourquoi Microsoft ?**\n\n";

    // Add key messages from company profile
    keyMessages.forEach(message => {
      valueText += `✅ ${message}\n`;
    });

    // Add specific ROI information if available
    if (recommendations.length > 0 && recommendations[0].businessValue) {
      valueText += `\n📊 **Impact mesurable :** ${recommendations[0].businessValue[0]}`;
    }

    return valueText;
  }

  /**
   * Generate contextual call to action
   */
  _generateCallToAction({ companyName, recipientRole }) {
    const ctas = {
      'DSI': `Seriez-vous disponible pour une démonstration technique de 45 minutes ?`,
      'Directeur Général': `Seriez-vous intéressé par un échange de 30 minutes sur votre stratégie digitale ?`,
      'DAF': `Souhaiteriez-vous une présentation du ROI et des modèles économiques sur 30 minutes ?`,
      'DRH': `Seriez-vous disponible pour découvrir l'impact sur l'expérience collaborateur en 30 minutes ?`,
      'Directeur Commercial': `Seriez-vous intéressé par une démonstration de l'impact sur les performances commerciales ?`
    };

    const cta = ctas[recipientRole] ||
      `Seriez-vous disponible pour un échange de 30 minutes dans les prochains jours ?`;

    return `🎯 **Objectif :** Comprendre vos défis actuels et voir comment Microsoft peut accompagner ${companyName} dans sa transformation.

${cta}

Je peux me déplacer ou organiser une visioconférence selon votre préférence.`;
  }

  /**
   * Generate professional signature
   */
  _generateSignature() {
    return `Cordialement,

**Nicolas BAYONNE**
Microsoft - Accompagnement Entreprises
📧 nicolas.bayonne@microsoft.com
📱 +33 6 XX XX XX XX
🌐 [linkedin.com/in/nicolas-bayonne](https://linkedin.com/in/nicolas-bayonne)

---
*P.S. : Toutes nos solutions sont conformes RGPD et bénéficient du support Microsoft France.*`;
  }

  /**
   * Calculate personalization level for analytics
   */
  _calculatePersonalizationLevel({ specificNeeds, currentChallenges, recipientRole }) {
    let score = 0;

    if (recipientRole) score += 20;
    if (specificNeeds && specificNeeds.length > 0) score += 30;
    if (currentChallenges && currentChallenges.length > 0) score += 30;
    score += 20; // Base knowledge base usage

    return Math.min(score, 100);
  }

  /**
   * Get solution recommendations for a specific use case
   */
  getRecommendationsForUseCase(useCase) {
    const useCaseMapping = {
      'migration_cloud': ['azure-migrate', 'azure-security-center'],
      'collaboration': ['microsoft-365', 'power-platform'],
      'securite': ['azure-security-center', 'microsoft-365'],
      'crm': ['dynamics-365', 'power-platform'],
      'ai': ['azure-ai', 'power-platform'],
      'digital_transformation': ['microsoft-365', 'azure-migrate', 'power-platform']
    };

    const solutionKeys = useCaseMapping[useCase] || ['microsoft-365'];
    return solutionKeys.map(key => this.knowledgeBase.solutions[key]);
  }

  /**
   * Generate follow-up email content
   */
  generateFollowUpEmail({
    companyName,
    recipientName,
    previousInteraction,
    nextSteps,
    solutionsDiscussed = []
  }) {
    const subject = `${companyName} : Suite à notre échange - Prochaines étapes`;

    const body = `${this._generateGreeting(recipientName)}

Merci pour le temps que vous m'avez accordé ${previousInteraction.date ? `le ${previousInteraction.date}` : 'récemment'}.

${previousInteraction.summary ? `Je retiens de notre échange : ${previousInteraction.summary}` : ''}

**🎯 Prochaines étapes proposées :**

${nextSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

${solutionsDiscussed.length > 0 ? `
**📋 Solutions évoquées :**
${solutionsDiscussed.map(solution => `• ${solution}`).join('\n')}
` : ''}

Je reste à votre disposition pour toute question complémentaire.

${this._generateSignature()}`;

    return { subject, body };
  }
}

// Export default instance
export const smartEmailGenerator = new SmartEmailGenerator();