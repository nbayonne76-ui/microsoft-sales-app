const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const exampleSequences = [
  {
    name: 'Cloud Migration Outreach',
    description: 'Multi-touch sequence for cloud migration prospects',
    goal: 'demo_booking',
    targetIndustry: 'Manufacturing',
    targetCompanySize: 'sme',
    targetRole: 'DSI',
    isActive: true,
    isTemplate: true,
    steps: [
      {
        stepNumber: 1,
        delayDays: 0,
        delayHours: 0,
        subject: 'Reducing your datacenter costs by 40% - {{companyName}}',
        bodyTemplate: `Bonjour {{contactName}},

Je travaille avec des entreprises manufacturières comme {{companyName}} pour les aider à réduire leurs coûts d'infrastructure tout en améliorant leurs performances.

Nos clients dans l'industrie ont réalisé en moyenne:
• -40% de coûts d'infrastructure sur 3 ans
• +30% d'amélioration des performances
• Élimination des investissements matériels

Seriez-vous disponible pour un échange de 15 minutes cette semaine sur vos enjeux infrastructure?

Cordialement,
Nicolas BAYONNE`,
        emailType: 'prospection'
      },
      {
        stepNumber: 2,
        delayDays: 3,
        delayHours: 0,
        subject: 'Re: Réduction coûts datacenter - {{companyName}}',
        bodyTemplate: `Bonjour {{contactName}},

Je vous recontacte suite à mon message sur la réduction de vos coûts d'infrastructure.

J'ai remarqué que {{companyName}} pourrait bénéficier particulièrement de notre approche, notamment sur:
• Migration progressive sans interruption de production
• ROI mesurable dès les premiers mois
• Accompagnement complet de vos équipes

Voici un cas client similaire qui pourrait vous intéresser: [lien case study]

Avez-vous 15 minutes cette semaine pour en discuter?

Cordialement,
Nicolas`,
        emailType: 'follow_up'
      },
      {
        stepNumber: 3,
        delayDays: 4,
        delayHours: 0,
        subject: 'Calculateur ROI migration cloud - {{companyName}}',
        bodyTemplate: `Bonjour {{contactName}},

Pour vous aider à évaluer rapidement le potentiel d'économies pour {{companyName}}, j'ai préparé un calculateur ROI personnalisé.

En 5 minutes, vous aurez:
• Estimation des économies sur 3 ans
• Période de retour sur investissement
• Comparaison avec votre situation actuelle

Lien vers le calculateur: [lien]

Même si vous n'êtes pas prêt à démarrer maintenant, cela vous donnera une bonne idée du potentiel.

Cordialement,
Nicolas`,
        emailType: 'value_add'
      },
      {
        stepNumber: 4,
        delayDays: 7,
        delayHours: 0,
        subject: 'Dernier message - Migration cloud {{companyName}}',
        bodyTemplate: `Bonjour {{contactName}},

Je comprends que le timing n'est peut-être pas le bon en ce moment.

Dois-je considérer ce sujet comme non prioritaire pour {{companyName}} et fermer votre dossier?

Si vous préférez qu'on en reparle dans quelques mois, dites-le moi simplement.

Cordialement,
Nicolas`,
        emailType: 'breakup'
      }
    ]
  },
  {
    name: 'Dynamics 365 Business Central - PME',
    description: 'Séquence pour prospects ERP PME',
    goal: 'demo_booking',
    targetIndustry: 'All',
    targetCompanySize: 'sme',
    targetRole: 'CEO',
    isActive: true,
    isTemplate: true,
    steps: [
      {
        stepNumber: 1,
        delayDays: 0,
        delayHours: 0,
        subject: 'ERP tout-en-un pour PME: Finances, Supply Chain, CRM - {{companyName}}',
        bodyTemplate: `Bonjour {{contactName}},

Beaucoup de PME comme {{companyName}} jonglent avec plusieurs logiciels pour gérer leurs finances, achats, stocks et CRM.

Dynamics 365 Business Central centralise tout cela dans une seule plateforme cloud:
• Comptabilité générale + consolidation
• Gestion stocks et achats
• CRM ventes intégré
• IA Copilot pour automatiser les tâches répétitives

Prix PME: à partir de 70€/utilisateur/mois

Seriez-vous intéressé par une démo personnalisée?

Cordialement,
Nicolas BAYONNE`,
        emailType: 'prospection'
      },
      {
        stepNumber: 2,
        delayDays: 3,
        delayHours: 0,
        subject: 'Re: ERP Business Central - Cas client {{industry}}',
        bodyTemplate: `Bonjour {{contactName}},

Suite à mon message sur Business Central, je voulais partager un cas concret dans votre secteur {{industry}}.

Une PME similaire a obtenu:
• -40% de coûts IT (élimination de 3 logiciels distincts)
• -30% de temps sur la clôture mensuelle
• Inventaire optimisé en temps réel

Voici leur témoignage: [lien case study]

Disponible pour un échange de 20 minutes cette semaine?

Cordialement,
Nicolas`,
        emailType: 'follow_up'
      },
      {
        stepNumber: 3,
        delayDays: 5,
        delayHours: 0,
        subject: 'Dois-je fermer votre dossier? {{companyName}}',
        bodyTemplate: `Bonjour {{contactName}},

Je n'ai pas eu de retour de votre part sur Business Central.

Est-ce que:
1. Le timing n'est pas bon? (Dites-moi quand en reparler)
2. Vous avez déjà une solution en place?
3. Ce n'est tout simplement pas prioritaire?

Un simple mot me permet de savoir si je dois fermer votre dossier ou si vous préférez qu'on en reparle plus tard.

Cordialement,
Nicolas`,
        emailType: 'breakup'
      }
    ]
  }
];

async function main() {
  console.log('Creating example email sequences...\n');

  for (const seqData of exampleSequences) {
    const { steps, ...sequenceData } = seqData;

    const sequence = await prisma.emailSequence.create({
      data: {
        ...sequenceData,
        steps: {
          create: steps
        }
      },
      include: { steps: true }
    });

    console.log(`✅ Created sequence: ${sequence.name}`);
    console.log(`   ${sequence.steps.length} steps configured`);
    console.log(`   Target: ${sequence.targetCompanySize} in ${sequence.targetIndustry}\n`);
  }

  const total = await prisma.emailSequence.count();
  console.log(`\n✅ Total email sequences in database: ${total}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
