import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateTemplates() {
  try {
    console.log('📝 Ajout des templates dans Prisma Studio...');

    // Templates de l'application Template Generator
    const templateData = [
      // Templates Migration
      {
        name: 'Migration Azure Enterprise Formel',
        category: 'migration',
        segment: 'enterprise',
        tone: 'formal',
        subject: 'Stratégie de Migration Microsoft Azure - Accompagnement Exécutif',
        content: `Madame, Monsieur,

Dans le cadre de la transformation digitale de votre organisation, nous avons identifié des opportunités significatives d'optimisation via Microsoft Azure.

Notre analyse préliminaire suggère que votre infrastructure actuelle pourrait bénéficier d'une approche de migration structurée, avec un focus sur:

• Optimisation des coûts opérationnels (estimation: 25-40% de réduction)
• Amélioration de la résilience et de la sécurité
• Facilitation de la scalabilité selon vos besoins business

Cette migration nécessite une attention prioritaire compte tenu des enjeux stratégiques.

Je propose d'organiser un executive briefing de 45 minutes pour présenter notre méthodologie éprouvée et discuter de vos priorités stratégiques.

Je demeure à votre disposition pour organiser cette discussion dans les meilleurs délais.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`,
        reasoning: 'Template optimisé pour les grandes entreprises avec processus formels',
        useCount: 12,
        successRate: 0.78
      },
      {
        name: 'Migration Azure PME Accessible',
        category: 'migration',
        segment: 'sme',
        tone: 'professional_friendly',
        subject: '🚀 Votre projet Azure - Accompagnement personnalisé',
        content: `Bonjour,

J'espère que vous allez bien ! 😊

Je reviens vers vous concernant votre projet de migration Azure. Après avoir analysé votre contexte, je pense qu'on peut vraiment vous aider à simplifier cette transition.

Ce que je vous propose:
✨ Un accompagnement étape par étape (pas de stress !)
💰 Une optimisation des coûts dès le départ
🛡️ Une sécurité renforcée pour vos données
📈 Une infrastructure qui grandit avec vous

J'adorerais qu'on puisse en discuter de vive voix - ça serait plus simple pour répondre à toutes vos questions !

Est-ce qu'on pourrait se caler un petit call cette semaine ? Je m'adapte complètement à votre agenda !

Au plaisir d'échanger,

Nicolas 🤝
Votre contact Microsoft`,
        reasoning: 'Template adapté aux PME avec ton accessible et rassurant',
        useCount: 18,
        successRate: 0.82
      },
      {
        name: 'Migration Azure Startup Dynamique',
        category: 'migration',
        segment: 'startup',
        tone: 'casual_expert',
        subject: '🚀 Ton projet Azure - Let\'s make it happen!',
        content: `Salut !

Alors, cette migration Azure ? J'ai regardé un peu ton contexte et franchement, je pense qu'on peut faire des trucs vraiment cool ensemble ! 😎

Ce que je vois pour toi:
💡 Une migration smart (pas de stress inutile)
💰 Des économies dès le départ (tu vas adorer ça !)
🔧 Une infrastructure qui scale avec tes besoins
⚡ Plus de performance, moins de headaches

Je sais que ça peut paraître un gros chantier, mais crois-moi, on va y aller step by step !

Que dis-tu d'un call décontracté cette semaine ? On pourrait brainstormer sur ton setup idéal !

Keep it simple,
Nicolas 🤙`,
        reasoning: 'Template décontracté pour startups avec langage moderne',
        useCount: 8,
        successRate: 0.89
      },

      // Templates Budget
      {
        name: 'Optimisation Budget Enterprise',
        category: 'budget',
        segment: 'enterprise',
        tone: 'formal',
        subject: 'Optimisation Budgétaire Microsoft - Stratégie Financière',
        content: `Madame, Monsieur,

Dans le cadre de notre engagement d'optimisation continue de votre investissement Microsoft, nous avons identifié des opportunités significatives de rationalisation budgétaire.

Notre analyse financière préliminaire révèle des leviers d'optimisation substantiels :

• Consolidation des licences redondantes
• Réallocation des ressources sous-utilisées  
• Optimisation du mix produits selon l'usage réel
• Exploitation des crédits et programmes disponibles

Cette démarche s'inscrit dans notre volonté d'accompagnement financier optimal.

Je propose d'organiser une session de revue budgétaire executive avec présentation de business case chiffré.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`,
        reasoning: 'Template formel pour optimisation budgétaire en entreprise',
        useCount: 15,
        successRate: 0.75
      },
      {
        name: 'Budget PME Économies Concrètes',
        category: 'budget',
        segment: 'sme',
        tone: 'professional_friendly',
        subject: '💰 Optimisation budget Microsoft - Économies garanties',
        content: `Bonjour,

J'ai une bonne nouvelle à vous annoncer ! 📈

Après analyse de votre environnement Microsoft, j'ai identifié plusieurs leviers d'optimisation qui pourraient considérablement impacter votre budget IT de manière positive.

Les opportunités que je vois:
🎯 Optimisation des licences existantes
💡 Consolidation des services redondants  
🔄 Migration vers des solutions plus économiques
📊 Utilisation de crédits Azure disponibles

L'objectif, c'est de vous faire économiser de l'argent tout en améliorant vos capacités !

Que diriez-vous qu'on se pose 30 minutes pour que je vous présente ces opportunités concrètes ? Pas de blabla commercial, que du concret chiffré !

Hâte de vous faire découvrir ça,

Nicolas 💪`,
        reasoning: 'Template PME axé sur les économies tangibles',
        useCount: 22,
        successRate: 0.84
      },
      {
        name: 'Budget Startup Smart',
        category: 'budget',
        segment: 'startup',
        tone: 'casual_expert',
        subject: '💰 Money talks - Optimisons ton budget Microsoft !',
        content: `Hey !

J'ai de bonnes nouvelles côté budget ! 💪

J'ai épluché ton setup Microsoft et j'ai trouvé plein d'opportunités pour te faire économiser du cash tout en améliorant tes perfs !

Les quick wins que j'ai repérés:
🎯 Licences en doublon → économies immédiates  
💡 Services sous-utilisés → redirection smart
🔄 Upgrades qui payent d'eux-mêmes
📊 Crédits Azure dormants → activation !

L'objectif c'est simple: même qualité, moins cher (ou mieux pour le même prix) !

On se fait un call quick pour que je te montre les chiffres ? Promis, que du factuel !

Talk soon,
Nicolas 💼`,
        reasoning: 'Template startup focus ROI et efficiency',
        useCount: 6,
        successRate: 0.91
      },

      // Templates Change Management
      {
        name: 'Change Management Formel',
        category: 'change_management',
        segment: 'enterprise',
        tone: 'formal',
        subject: 'Accompagnement Transformation Digitale - Gestion du Changement',
        content: `Madame, Monsieur,

La réussite d'une transformation digitale repose essentiellement sur l'adhésion et l'accompagnement des équipes. Notre méthodologie éprouvée de change management garantit une adoption optimale des solutions Microsoft.

Notre approche structurée comprend :

• Analyse des résistances et facteurs d'adoption
• Programme de formation personnalisé par profil utilisateur
• Communication change management adaptée à votre culture
• Support post-déploiement avec mesure de l'adoption

Notre expérience démontre que l'investissement dans l'accompagnement humain multiplie le ROI technique par 3.

Je propose une présentation de notre méthodologie change management avec études de cas sectorielles.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`,
        reasoning: 'Template enterprise pour accompagnement changement',
        useCount: 9,
        successRate: 0.72
      },
      {
        name: 'Accompagnement Équipes PME',
        category: 'change_management',
        segment: 'sme',
        tone: 'professional_friendly',
        subject: '😊 Accompagnons vos équipes dans cette belle transformation !',
        content: `Bonjour,

J'espère que vous allez bien !

Je souhaitais vous parler d'un aspect super important de votre projet : vos équipes ! 👥

Parce qu'au final, les meilleures technos du monde ne servent à rien si les utilisateurs ne sont pas à l'aise avec. Et ça, on le sait bien chez Microsoft ! 😊

Notre approche bienveillante :
✨ Formation adaptée à chaque profil (pas de one-size-fits-all !)  
🤝 Accompagnement personnalisé pour les plus réticents
📞 Hotline dédiée pendant la transition
🎯 Célébration des quick wins pour maintenir la motivation

L'objectif, c'est que tout le monde soit enthousiaste et autonome avec les nouveaux outils !

Que diriez-vous qu'on en discute autour d'un café ? J'adorerais vous présenter quelques success stories inspirantes !

Bonne journée !
Nicolas 🌟`,
        reasoning: 'Template PME bienveillant pour accompagnement équipes',
        useCount: 14,
        successRate: 0.88
      },
      {
        name: 'Teams Startup Fun',
        category: 'change_management',
        segment: 'startup',
        tone: 'casual_expert',
        subject: '🚀 Tes teams vont adorer le changement !',
        content: `Salut !

Alors, parlons de tes équipes ! Parce que c'est eux qui vont faire le succès de ton projet, pas vrai ? 😎

Mon approche pour que tout le monde soit à fond :
🎮 Formation gamifiée (apprendre en s'amusant !)
🏆 Programme de champions internes  
📱 Support via Teams/Slack (dans leur environnement)
🍕 Sessions pizza & formation (ça marche toujours !)

Le secret : transformer l'appréhension en excitation. C'est notre spécialité !

On organise un workshop fun avec ton équipe ? Je peux même amener les pizzas ! 🍕

Keep rocking,
Nicolas ⚡`,
        reasoning: 'Template startup gamifié pour adoption joyeuse',
        useCount: 5,
        successRate: 0.95
      },

      // Templates Follow-up
      {
        name: 'Suivi Enterprise Standard',
        category: 'follow_up',
        segment: 'enterprise',
        tone: 'formal',
        subject: 'Suivi de votre projet Microsoft - Prochaines étapes',
        content: `Madame, Monsieur,

Suite à notre dernier échange très constructif, je souhaitais faire le point sur les prochaines étapes de votre projet Microsoft.

Les actions identifiées lors de notre dernière rencontre nécessitent une coordination étroite pour assurer le succès de l'implémentation.

Je propose d'organiser une session de travail avec vos équipes techniques pour définir le planning détaillé et les jalons de validation.

Seriez-vous disponible pour un échange téléphonique cette semaine afin de faire avancer votre projet ?

Je reste à votre disposition.

Cordialement,

Nicolas BAYONNE
Microsoft Account Manager`,
        reasoning: 'Template de suivi formel pour grandes entreprises',
        useCount: 20,
        successRate: 0.68
      },
      {
        name: 'Relance PME Constructive',
        category: 'follow_up',
        segment: 'sme',
        tone: 'professional_friendly',
        subject: 'Comment avance votre réflexion ? 🤔',
        content: `Bonjour,

J'espère que vous allez bien !

Je me permets de revenir vers vous pour prendre des nouvelles de votre réflexion sur le projet Microsoft dont nous avions discuté.

Je sais que ce type de décision demande du temps et de la mûrissage - c'est tout à fait normal ! 

Si vous avez des questions qui ont émergé depuis notre échange, ou si vous souhaitez approfondir certains points, je suis là pour vous accompagner.

Pas de pression, juste l'envie de vous aider à y voir plus clair si besoin 😊

N'hésitez pas à me faire signe quand le timing sera bon pour vous !

Excellente journée,
Nicolas`,
        reasoning: 'Template PME de relance sans pression',
        useCount: 25,
        successRate: 0.74
      }
    ];

    // Supprimer les anciens templates
    await prisma.emailTemplate.deleteMany();
    console.log('🧹 Anciens templates supprimés');

    // Insérer les nouveaux templates
    for (const template of templateData) {
      await prisma.emailTemplate.create({
        data: template
      });
    }

    console.log(`✅ ${templateData.length} templates ajoutés dans Prisma Studio !`);
    console.log('');
    console.log('🎯 Accès Prisma Studio : http://localhost:5556');
    console.log('👉 Clique sur la table "EmailTemplate" pour voir tous les templates');
    console.log('');
    console.log('📊 Statistiques des templates ajoutés:');
    
    // Statistiques par catégorie
    const categories = templateData.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   • ${cat}: ${count} templates`);
    });

    // Statistiques par segment
    const segments = templateData.reduce((acc, t) => {
      acc[t.segment] = (acc[t.segment] || 0) + 1;
      return acc;
    }, {});

    console.log('');
    console.log('👥 Par segment:');
    Object.entries(segments).forEach(([seg, count]) => {
      console.log(`   • ${seg}: ${count} templates`);
    });

    // Top performers
    const topPerformers = templateData
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 3);

    console.log('');
    console.log('🏆 Templates les plus performants:');
    topPerformers.forEach((t, i) => {
      console.log(`   ${i + 1}. ${t.name} (${Math.round(t.successRate * 100)}% succès)`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateTemplates();