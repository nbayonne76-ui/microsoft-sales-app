/**
 * Workflow Templates - Predefined workflow configurations
 */

export const workflowTemplates = [
  // ========================================
  // 1. WELCOME SEQUENCE (Nouveaux leads)
  // ========================================
  {
    name: 'welcome_sequence',
    displayName: 'Séquence de Bienvenue',
    description: 'Séquence automatique de 3 emails pour accueillir et qualifier les nouveaux leads sur 2 semaines',
    category: 'welcome',
    icon: '👋',
    recommendedFor: 'Nouveaux leads qui viennent d\'être créés ou enrichis',
    templateData: {
      name: 'Séquence de Bienvenue - Nouveau Lead',
      description: 'Séquence automatique pour engager les nouveaux leads',
      category: 'welcome',
      triggerType: 'lead_enriched',
      triggerConfig: {
        autoStart: true,
        conditions: {
          enrichmentStatus: 'enriched',
          hasEmail: true
        }
      },
      targetSegment: 'all',
      targetPriority: 'all',
      steps: [
        {
          name: 'Email de Premier Contact',
          description: 'Introduction et présentation de la valeur',
          stepType: 'email',
          config: {
            subject: 'Bonjour {{lead.companyName}} - Optimisons votre environnement Microsoft',
            content: `
<p>Bonjour,</p>

<p>Je suis Nicolas BAYONNE, consultant Microsoft chez KAELIO. J'ai remarqué que {{lead.companyName}} utilise probablement des solutions Microsoft, et je me permets de vous contacter car nous aidons des entreprises comme la vôtre à optimiser leurs investissements Microsoft.</p>

<p><strong>Pourquoi ce message ?</strong></p>
<ul>
  <li>Réduction des coûts de licence jusqu'à 30%</li>
  <li>Optimisation de la productivité avec M365 et Power Platform</li>
  <li>Accompagnement personnalisé par des experts certifiés</li>
</ul>

<p>Seriez-vous disponible pour un échange rapide de 15 minutes la semaine prochaine ?</p>

<p>Cordialement,</p>
<p>Nicolas BAYONNE<br>
Consultant Microsoft - KAELIO<br>
📧 nicolas.bayonne@kaelio.fr</p>
            `
          }
        },
        {
          name: 'Attente 3 jours',
          description: 'Délai avant relance',
          stepType: 'wait',
          config: {
            delay: 3,
            unit: 'days'
          }
        },
        {
          name: 'Email de Suivi - Cas Client',
          description: 'Partage d\'un cas client pertinent',
          stepType: 'email',
          config: {
            subject: 'Comment {{lead.companyName}} pourrait économiser 30% sur Microsoft ?',
            content: `
<p>Bonjour,</p>

<p>Je reviens vers vous suite à mon premier message. J'imagine que vous êtes très occupé, alors je vais être bref.</p>

<p><strong>Cas concret similaire à {{lead.companyName}} :</strong></p>
<p>Récemment, nous avons aidé une entreprise du secteur {{lead.nafCode}} avec environ {{lead.employeeCount}} employés à :</p>
<ul>
  <li>Réduire leurs coûts de licence Microsoft de 25%</li>
  <li>Migrer vers Microsoft 365 E5 avec un ROI en 8 mois</li>
  <li>Automatiser 15 processus métier avec Power Automate</li>
</ul>

<p>Pensez-vous que ce type d'optimisation pourrait intéresser {{lead.companyName}} ?</p>

<p>Je suis disponible pour un appel rapide cette semaine si vous souhaitez en discuter.</p>

<p>Cordialement,</p>
<p>Nicolas BAYONNE</p>
            `
          }
        },
        {
          name: 'Attente 7 jours',
          description: 'Délai avant dernier contact',
          stepType: 'wait',
          config: {
            delay: 7,
            unit: 'days'
          }
        },
        {
          name: 'Email Final - Ressource Gratuite',
          description: 'Dernier contact avec offre de valeur',
          stepType: 'email',
          config: {
            subject: 'Guide gratuit : Optimiser vos licences Microsoft en 2025',
            content: `
<p>Bonjour,</p>

<p>Dernier message de ma part ! Je ne veux pas encombrer votre boîte mail.</p>

<p><strong>Cadeau sans engagement :</strong></p>
<p>J'ai préparé pour vous un guide complet pour optimiser vos licences Microsoft en 2025. Ce guide contient :</p>
<ul>
  <li>Comparatif détaillé M365 E3 vs E5</li>
  <li>Grille tarifaire Microsoft 2025</li>
  <li>Checklist d'optimisation des coûts</li>
  <li>Modèles de calcul ROI</li>
</ul>

<p><strong>Téléchargement gratuit :</strong> <a href="https://kaelio.fr/guide-microsoft-2025">Télécharger le guide</a></p>

<p>Si à l'avenir vous souhaitez échanger sur l'optimisation de votre environnement Microsoft, n'hésitez pas à me contacter directement.</p>

<p>Je vous souhaite une excellente journée !</p>

<p>Nicolas BAYONNE<br>
KAELIO - Experts Microsoft</p>
            `
          }
        },
        {
          name: 'Marquer comme traité',
          description: 'Mise à jour du statut du lead',
          stepType: 'action',
          config: {
            actionType: 'create_task',
            task: {
              action: 'Relancer manuellement si pas de réponse',
              priority: 'BASSE',
              assignedTo: 'Nicolas BAYONNE'
            }
          }
        }
      ]
    }
  },

  // ========================================
  // 2. FOLLOW-UP SEQUENCE (Relance sans réponse)
  // ========================================
  {
    name: 'no_response_followup',
    displayName: 'Relance Sans Réponse',
    description: 'Séquence de 2 emails pour relancer les leads qui n\'ont pas répondu après 7 jours',
    category: 'follow_up',
    icon: '🔔',
    recommendedFor: 'Leads actifs sans interaction depuis 7+ jours',
    templateData: {
      name: 'Relance Sans Réponse',
      description: 'Réengager les leads qui n\'ont pas répondu',
      category: 'follow_up',
      triggerType: 'no_response',
      triggerConfig: {
        autoStart: false, // Déclenchement manuel
        conditions: {
          daysSinceLastContact: 7,
          noResponse: true
        }
      },
      targetSegment: 'all',
      targetPriority: 'HAUTE,MOYENNE',
      steps: [
        {
          name: 'Enrichir le Lead',
          description: 'Mettre à jour les données avant relance',
          stepType: 'action',
          config: {
            actionType: 'enrich_lead'
          }
        },
        {
          name: 'Email de Relance Personnalisé',
          description: 'Relance avec nouvelle approche',
          stepType: 'email',
          config: {
            subject: 'J\'ai peut-être contacté le mauvais interlocuteur chez {{lead.companyName}} ?',
            content: `
<p>Bonjour,</p>

<p>J'ai envoyé quelques messages récemment concernant l'optimisation de vos investissements Microsoft, mais je me demande si je contacte la bonne personne.</p>

<p><strong>Pourriez-vous m\'aider ?</strong></p>
<p>Si vous n'êtes pas la personne en charge de la stratégie Microsoft chez {{lead.companyName}}, pourriez-vous me rediriger vers la personne responsable ?</p>

<p>Sinon, j'aimerais savoir :</p>
<ul>
  <li>Quel est votre niveau de satisfaction actuel avec vos solutions Microsoft ?</li>
  <li>Avez-vous des projets de migration ou d'optimisation en 2025 ?</li>
  <li>Quels sont vos principaux défis liés à Microsoft actuellement ?</li>
</ul>

<p>Un simple "Oui, intéressé" ou "Non merci" me permettrait de savoir si je dois continuer ou arrêter de vous contacter.</p>

<p>Merci pour votre temps !</p>

<p>Nicolas BAYONNE<br>
KAELIO</p>
            `
          }
        },
        {
          name: 'Attente 5 jours',
          description: 'Délai final avant clôture',
          stepType: 'wait',
          config: {
            delay: 5,
            unit: 'days'
          }
        },
        {
          name: 'Vérifier Réponse',
          description: 'Checker si le lead a répondu',
          stepType: 'condition',
          config: {
            field: 'context.emailReplied',
            operator: 'equals',
            value: true
          }
        },
        {
          name: 'Email de Clôture',
          description: 'Dernier email si toujours pas de réponse',
          stepType: 'email',
          executeIf: {
            condition: 'context.emailReplied',
            value: false
          },
          config: {
            subject: 'Je vous laisse tranquille - Dernières ressources utiles',
            content: `
<p>Bonjour,</p>

<p>Je comprends que ce n'est peut-être pas le bon moment pour {{lead.companyName}}.</p>

<p>Je ne vais plus vous contacter, mais je vous laisse ces ressources qui pourraient vous être utiles :</p>
<ul>
  <li><a href="https://kaelio.fr/ressources/microsoft-pricing-2025">Grille tarifaire Microsoft 2025</a></li>
  <li><a href="https://kaelio.fr/ressources/m365-security-checklist">Checklist Sécurité M365</a></li>
  <li><a href="https://kaelio.fr/ressources/azure-cost-optimization">Guide d'optimisation Azure</a></li>
</ul>

<p>Si un jour vous avez besoin d'expertise Microsoft, vous savez où me trouver.</p>

<p>Bonne continuation !</p>

<p>Nicolas BAYONNE</p>
            `
          }
        },
        {
          name: 'Réduire Priorité',
          description: 'Passer le lead en priorité basse',
          stepType: 'action',
          executeIf: {
            condition: 'context.emailReplied',
            value: false
          },
          config: {
            actionType: 'update_priority',
            priority: 'BASSE'
          }
        }
      ]
    }
  },

  // ========================================
  // 3. NURTURE SEQUENCE (Lead nurturing long terme)
  // ========================================
  {
    name: 'long_term_nurture',
    displayName: 'Nurturing Long Terme',
    description: 'Séquence de 4 emails éducatifs sur 1 mois pour maintenir l\'engagement',
    category: 'nurture',
    icon: '🌱',
    recommendedFor: 'Leads qualifiés mais pas encore prêts à acheter',
    templateData: {
      name: 'Nurturing Long Terme',
      description: 'Éduquer et engager les leads sur le long terme',
      category: 'nurture',
      triggerType: 'manual',
      triggerConfig: {
        autoStart: false
      },
      targetSegment: 'all',
      targetPriority: 'MOYENNE,HAUTE',
      steps: [
        {
          name: 'Email 1 - Tendances 2025',
          description: 'Contenu éducatif sur les tendances Microsoft',
          stepType: 'email',
          config: {
            subject: 'Les 5 tendances Microsoft qui vont impacter {{lead.companyName}} en 2025',
            content: `
<p>Bonjour,</p>

<p>En tant qu'expert Microsoft, je voulais partager avec vous les 5 tendances majeures pour 2025 :</p>

<ol>
  <li><strong>AI Copilot partout</strong> - L'IA s'intègre dans tous les outils M365</li>
  <li><strong>Zero Trust Security</strong> - La sécurité devient prioritaire</li>
  <li><strong>Power Platform Low-Code</strong> - Automatisation accessible à tous</li>
  <li><strong>Hybrid Work</strong> - Teams et SharePoint en évolution constante</li>
  <li><strong>Azure pour tous</strong> - Cloud accessible même aux PME</li>
</ol>

<p>Laquelle de ces tendances pourrait le plus bénéficier à {{lead.companyName}} ?</p>

<p>Cordialement,</p>
<p>Nicolas</p>
            `
          }
        },
        {
          name: 'Attente 1 semaine',
          stepType: 'wait',
          config: { delay: 7, unit: 'days' }
        },
        {
          name: 'Email 2 - Cas d\'Usage',
          description: 'Exemples concrets d\'utilisation',
          stepType: 'email',
          config: {
            subject: 'Comment une entreprise comme {{lead.companyName}} a économisé 40K€/an',
            content: `
<p>Bonjour,</p>

<p>Cas client qui pourrait vous inspirer :</p>

<p><strong>Entreprise similaire :</strong> {{lead.employeeCount}} employés, secteur {{lead.nafCode}}</p>

<p><strong>Problème :</strong> Coûts Microsoft en hausse, licences mal utilisées, sécurité insuffisante</p>

<p><strong>Solution KAELIO :</strong></p>
<ul>
  <li>Audit complet des licences → Économie de 40 000€/an</li>
  <li>Migration M365 E3 → E5 avec formation → Productivité +25%</li>
  <li>Mise en place Security Copilot → 0 incidents en 6 mois</li>
</ul>

<p><strong>ROI :</strong> 8 mois</p>

<p>Intéressé par un audit gratuit similaire pour {{lead.companyName}} ?</p>

<p>Nicolas</p>
            `
          }
        },
        {
          name: 'Attente 1 semaine',
          stepType: 'wait',
          config: { delay: 7, unit: 'days' }
        },
        {
          name: 'Email 3 - Outil Gratuit',
          description: 'Offrir un outil de calcul ROI',
          stepType: 'email',
          config: {
            subject: 'Outil gratuit : Calculez votre ROI Microsoft en 2 minutes',
            content: `
<p>Bonjour,</p>

<p>J'ai créé un outil simple pour vous aider à calculer votre ROI potentiel avec Microsoft.</p>

<p><strong>Calculateur ROI Microsoft :</strong></p>
<p>Entrez simplement :</p>
<ul>
  <li>Nombre d'employés</li>
  <li>Licences actuelles</li>
  <li>Budget annuel Microsoft</li>
</ul>

<p><strong>→ Résultat instantané :</strong> Économies potentielles, recommandations personnalisées</p>

<p><a href="https://kaelio.fr/calculateur-roi">Accéder au calculateur gratuit</a></p>

<p>Aucune inscription requise. Essayez-le en 2 minutes !</p>

<p>Nicolas</p>
            `
          }
        },
        {
          name: 'Attente 1 semaine',
          stepType: 'wait',
          config: { delay: 7, unit: 'days' }
        },
        {
          name: 'Email 4 - Appel à l\'Action',
          description: 'Proposition concrète d\'engagement',
          stepType: 'email',
          config: {
            subject: 'Prêt à passer à l\'action pour {{lead.companyName}} ?',
            content: `
<p>Bonjour,</p>

<p>Après plusieurs échanges, je pense que nous pourrions vraiment aider {{lead.companyName}} à optimiser son environnement Microsoft.</p>

<p><strong>Je vous propose :</strong></p>
<ol>
  <li><strong>Audit gratuit</strong> (1h) - Analyse de vos licences et besoins</li>
  <li><strong>Rapport personnalisé</strong> - Recommandations et estimations d'économies</li>
  <li><strong>Roadmap 2025</strong> - Plan d'action concret si vous êtes intéressé</li>
</ol>

<p><strong>Zéro engagement</strong> - C'est 100% gratuit et sans obligation.</p>

<p>Seriez-vous disponible pour cet audit la semaine prochaine ?</p>

<p><a href="https://calendly.com/nicolas-kaelio">Réserver un créneau</a></p>

<p>Ou répondez simplement à cet email avec vos disponibilités.</p>

<p>Au plaisir d'échanger !</p>

<p>Nicolas BAYONNE<br>
KAELIO - Experts Microsoft Certifiés</p>
            `
          }
        },
        {
          name: 'Créer Tâche de Suivi',
          description: 'Planifier appel de suivi',
          stepType: 'action',
          config: {
            actionType: 'create_task',
            task: {
              action: 'Appeler le lead pour discuter de l\'audit gratuit',
              priority: 'HAUTE',
              deadline: '+3 days',
              assignedTo: 'Nicolas BAYONNE'
            }
          }
        }
      ]
    }
  },

  // ========================================
  // 4. HOT LEAD FAST TRACK (Leads très engagés)
  // ========================================
  {
    name: 'hot_lead_fast_track',
    displayName: 'Fast Track - Lead Chaud',
    description: 'Séquence rapide et directe pour leads très engagés (multiples opens/clicks)',
    category: 'conversion',
    icon: '🔥',
    recommendedFor: 'Leads avec engagement élevé (score >70)',
    templateData: {
      name: 'Fast Track - Lead Chaud',
      description: 'Conversion rapide des leads très engagés',
      category: 'conversion',
      triggerType: 'high_engagement',
      triggerConfig: {
        autoStart: true,
        conditions: {
          engagementScore: { min: 70 }
        }
      },
      targetSegment: 'all',
      targetPriority: 'HAUTE',
      steps: [
        {
          name: 'Augmenter Priorité',
          description: 'Marquer comme lead prioritaire',
          stepType: 'action',
          config: {
            actionType: 'update_priority',
            priority: 'HAUTE'
          }
        },
        {
          name: 'Email Direct - Appel à l\'Action',
          description: 'Message court et direct',
          stepType: 'email',
          config: {
            subject: '{{lead.companyName}} - Vous semblez intéressé, parlons-en maintenant ?',
            content: `
<p>Bonjour,</p>

<p>J'ai remarqué que vous avez consulté plusieurs fois nos communications récentes. Cela semble indiquer un intérêt réel pour optimiser votre environnement Microsoft !</p>

<p><strong>Soyons directs :</strong></p>
<p>Au lieu d'échanger par email, que diriez-vous d'un appel de 20 minutes cette semaine pour :</p>
<ul>
  <li>Comprendre vos besoins spécifiques</li>
  <li>Vous présenter nos solutions concrètes</li>
  <li>Estimer les économies potentielles pour {{lead.companyName}}</li>
</ul>

<p><strong>🗓️ Réservez directement :</strong> <a href="https://calendly.com/nicolas-kaelio/20min">Voir mes disponibilités</a></p>

<p>Ou répondez simplement avec vos disponibilités et je m'adapte !</p>

<p>Nicolas BAYONNE<br>
📞 +33 X XX XX XX XX<br>
📧 nicolas.bayonne@kaelio.fr</p>
            `
          }
        },
        {
          name: 'Attente 24h',
          description: 'Court délai pour réponse rapide',
          stepType: 'wait',
          config: {
            delay: 24,
            unit: 'hours'
          }
        },
        {
          name: 'Relance Urgente',
          description: 'Relance si pas de réponse',
          stepType: 'email',
          config: {
            subject: 'Dernière chance pour un audit gratuit cette semaine',
            content: `
<p>Bonjour,</p>

<p>Je ne voudrais pas que vous manquiez cette opportunité.</p>

<p><strong>Je vous offre un audit gratuit</strong> (valeur 1 500€) cette semaine si vous confirmez avant vendredi.</p>

<p>Cet audit inclut :</p>
<ul>
  <li>✅ Analyse complète de vos licences Microsoft</li>
  <li>✅ Rapport d'optimisation personnalisé</li>
  <li>✅ Estimation des économies potentielles</li>
  <li>✅ Recommandations d'experts certifiés</li>
</ul>

<p><strong>Réservez maintenant :</strong> <a href="https://calendly.com/nicolas-kaelio/audit-gratuit">Choisir un créneau</a></p>

<p>Ou appelez-moi directement : +33 X XX XX XX XX</p>

<p>À très vite !</p>

<p>Nicolas BAYONNE</p>
            `
          }
        },
        {
          name: 'Créer Tâche Appel Urgent',
          description: 'Prioriser l\'appel manuel',
          stepType: 'action',
          config: {
            actionType: 'create_task',
            task: {
              action: 'APPEL URGENT - Lead chaud à convertir',
              priority: 'HAUTE',
              deadline: '+1 day',
              assignedTo: 'Nicolas BAYONNE'
            }
          }
        }
      ]
    }
  },

  // ========================================
  // 5. RE-ENGAGEMENT (Leads froids réactivation)
  // ========================================
  {
    name: 'cold_lead_reengagement',
    displayName: 'Réactivation Leads Froids',
    description: 'Réengager les leads inactifs depuis 30+ jours avec nouvelle approche',
    category: 're_engagement',
    icon: '❄️',
    recommendedFor: 'Leads sans activité depuis plus de 30 jours',
    templateData: {
      name: 'Réactivation Leads Froids',
      description: 'Nouvelle approche pour leads dormants',
      category: 're_engagement',
      triggerType: 'inactivity_threshold',
      triggerConfig: {
        autoStart: true,
        conditions: {
          daysSinceLastActivity: { min: 30 }
        }
      },
      targetSegment: 'all',
      targetPriority: 'all',
      steps: [
        {
          name: 'Enrichir Données Lead',
          description: 'Mise à jour des informations',
          stepType: 'action',
          config: {
            actionType: 'enrich_lead'
          }
        },
        {
          name: 'Email Réactivation',
          description: 'Nouvelle approche avec changement d\'angle',
          stepType: 'email',
          config: {
            subject: 'On repart de zéro ? {{lead.companyName}}',
            content: `
<p>Bonjour,</p>

<p>Il y a quelques mois, je vous ai contacté concernant l'optimisation de vos solutions Microsoft. Vous n'avez pas donné suite, et c'est tout à fait normal - le timing n'était probablement pas le bon.</p>

<p><strong>Pourquoi je vous recontacte aujourd'hui ?</strong></p>
<p>Nous avons lancé 3 nouvelles offres qui pourraient vraiment changer la donne pour {{lead.companyName}} :</p>

<ol>
  <li><strong>Audit Express</strong> - 2h pour identifier 20% d'économies minimum (gratuit)</li>
  <li><strong>AI Readiness Check</strong> - Préparez votre entreprise à Copilot</li>
  <li><strong>Security Health Check</strong> - Évaluation sécurité M365 (offert en février)</li>
</ol>

<p>Est-ce que l'une de ces offres pourrait intéresser {{lead.companyName}} aujourd'hui ?</p>

<p>Un simple "oui" ou "non" suffit !</p>

<p>Nicolas BAYONNE<br>
KAELIO</p>
            `
          }
        },
        {
          name: 'Attente 5 jours',
          stepType: 'wait',
          config: { delay: 5, unit: 'days' }
        },
        {
          name: 'Dernière Tentative',
          description: 'Email de clôture définitive',
          stepType: 'email',
          config: {
            subject: 'On se dit au revoir ? (pour de bon cette fois)',
            content: `
<p>Bonjour,</p>

<p>Je comprends le message : ce n'est pas le bon moment, ou KAELIO n'est tout simplement pas le bon partenaire pour {{lead.companyName}}.</p>

<p><strong>Pas de problème !</strong> Je vais arrêter de vous contacter.</p>

<p><strong>Une dernière chose :</strong> Si jamais la situation change et que vous avez besoin d'aide avec Microsoft (migration, optimisation, formation, sécurité), n'hésitez pas à me contacter directement.</p>

<p>Je vous laisse mes coordonnées :</p>
<ul>
  <li>📧 nicolas.bayonne@kaelio.fr</li>
  <li>📞 +33 X XX XX XX XX</li>
  <li>🌐 <a href="https://kaelio.fr">kaelio.fr</a></li>
</ul>

<p>Je vous souhaite beaucoup de succès pour 2025 !</p>

<p>Nicolas</p>
            `
          }
        },
        {
          name: 'Archiver Lead',
          description: 'Passer en priorité basse',
          stepType: 'action',
          config: {
            actionType: 'update_priority',
            priority: 'BASSE'
          }
        }
      ]
    }
  },

  // ========================================
  // 6. POST-DEMO FOLLOW-UP (Après démonstration)
  // ========================================
  {
    name: 'post_demo_followup',
    displayName: 'Suivi Post-Démo',
    description: 'Séquence après démonstration pour convertir en client',
    category: 'conversion',
    icon: '🎯',
    recommendedFor: 'Leads ayant assisté à une démonstration',
    templateData: {
      name: 'Suivi Post-Démo',
      description: 'Convertir les leads après démonstration',
      category: 'conversion',
      triggerType: 'manual',
      triggerConfig: {
        autoStart: false
      },
      targetSegment: 'all',
      targetPriority: 'HAUTE',
      steps: [
        {
          name: 'Email Immédiat - Remerciement',
          description: 'Email dans les 2h après la démo',
          stepType: 'email',
          config: {
            subject: 'Merci pour votre temps {{lead.companyName}} - Récapitulatif de notre échange',
            content: `
<p>Bonjour,</p>

<p>Merci pour le temps que vous nous avez accordé aujourd'hui. C'était un plaisir d'échanger avec vous sur les besoins de {{lead.companyName}}.</p>

<p><strong>Récapitulatif de notre échange :</strong></p>
<ul>
  <li>Vos défis : [À personnaliser selon la démo]</li>
  <li>Solutions présentées : [Liste des solutions]</li>
  <li>Prochaines étapes : [Actions convenues]</li>
</ul>

<p><strong>Documents attachés :</strong></p>
<ul>
  <li>📄 Présentation de la démonstration (PDF)</li>
  <li>📊 Estimation budgétaire personnalisée</li>
  <li>📋 Cas clients similaires</li>
</ul>

<p><strong>Prochaine étape :</strong> Je vous propose un second rendez-vous dans 3 jours pour répondre à vos questions et affiner la proposition.</p>

<p>Quand seriez-vous disponible ?</p>

<p>Nicolas BAYONNE<br>
KAELIO</p>
            `
          }
        },
        {
          name: 'Attente 2 jours',
          stepType: 'wait',
          config: { delay: 2, unit: 'days' }
        },
        {
          name: 'Check-in Rapide',
          description: 'Vérifier si questions',
          stepType: 'email',
          config: {
            subject: 'Des questions suite à la démo ?',
            content: `
<p>Bonjour,</p>

<p>J'espère que vous avez eu le temps de consulter les documents que je vous ai envoyés.</p>

<p><strong>Avez-vous des questions ?</strong></p>
<p>N'hésitez pas si vous souhaitez :</p>
<ul>
  <li>Des clarifications sur la solution proposée</li>
  <li>Une démonstration complémentaire sur un point spécifique</li>
  <li>Discuter du budget et des délais</li>
  <li>Obtenir des références clients</li>
</ul>

<p>Je reste disponible par téléphone ou email.</p>

<p>Nicolas</p>
            `
          }
        },
        {
          name: 'Attente 3 jours',
          stepType: 'wait',
          config: { delay: 3, unit: 'days' }
        },
        {
          name: 'Proposition Commerciale',
          description: 'Envoyer la proposition formelle',
          stepType: 'email',
          config: {
            subject: 'Proposition commerciale pour {{lead.companyName}}',
            content: `
<p>Bonjour,</p>

<p>Suite à notre démonstration et à nos échanges, j'ai le plaisir de vous envoyer notre proposition commerciale détaillée pour {{lead.companyName}}.</p>

<p><strong>Cette proposition inclut :</strong></p>
<ul>
  <li>📋 Périmètre détaillé de la prestation</li>
  <li>💰 Tarification transparente et détaillée</li>
  <li>📅 Planning de déploiement (8-12 semaines)</li>
  <li>✅ Garanties et support inclus</li>
  <li>🎁 Offre spéciale valable jusqu'au [DATE]</li>
</ul>

<p><strong>ROI estimé :</strong> Retour sur investissement en 6-10 mois</p>

<p>Je vous propose un appel cette semaine pour discuter de la proposition et répondre à vos questions.</p>

<p>Quand êtes-vous disponible ?</p>

<p>Au plaisir de collaborer avec {{lead.companyName}} !</p>

<p>Nicolas BAYONNE<br>
KAELIO - Experts Microsoft Certifiés</p>
            `
          }
        },
        {
          name: 'Créer Tâche Suivi',
          description: 'Appel de suivi proposition',
          stepType: 'action',
          config: {
            actionType: 'create_task',
            task: {
              action: 'Appeler pour discuter de la proposition commerciale',
              priority: 'HAUTE',
              deadline: '+2 days',
              assignedTo: 'Nicolas BAYONNE'
            }
          }
        }
      ]
    }
  },

  // ========================================
  // 7. PRICING INTEREST (Lead intéressé par les prix)
  // ========================================
  {
    name: 'pricing_interest_sequence',
    displayName: 'Intérêt Tarification',
    description: 'Séquence déclenchée quand un lead clique sur lien pricing',
    category: 'conversion',
    icon: '💰',
    recommendedFor: 'Leads ayant cliqué sur lien pricing ou tarif',
    templateData: {
      name: 'Séquence Intérêt Tarification',
      description: 'Convertir les leads intéressés par les prix',
      category: 'conversion',
      triggerType: 'pricing_interest',
      triggerConfig: {
        autoStart: true,
        conditions: {
          clickedUrl: { contains: 'pricing' }
        }
      },
      targetSegment: 'all',
      targetPriority: 'all',
      steps: [
        {
          name: 'Email Immédiat - Tarifs',
          description: 'Réponse rapide avec information pricing',
          stepType: 'email',
          config: {
            subject: 'Tarifs personnalisés pour {{lead.companyName}}',
            content: `
<p>Bonjour,</p>

<p>J'ai vu que vous vous intéressiez à nos tarifs. Excellente nouvelle !</p>

<p><strong>Nos formules pour les entreprises comme {{lead.companyName}} :</strong></p>

<p><strong>🥉 Starter (PME 10-50 pers)</strong></p>
<ul>
  <li>Audit licences Microsoft</li>
  <li>Optimisation M365 Basic</li>
  <li>À partir de 2 500€</li>
</ul>

<p><strong>🥈 Professional (50-200 pers)</strong></p>
<ul>
  <li>Audit + Migration M365</li>
  <li>Formation équipes</li>
  <li>Support 3 mois</li>
  <li>À partir de 8 500€</li>
</ul>

<p><strong>🥇 Enterprise (200+ pers)</strong></p>
<ul>
  <li>Solution complète sur-mesure</li>
  <li>Accompagnement dédié</li>
  <li>Support prioritaire 12 mois</li>
  <li>Sur devis personnalisé</li>
</ul>

<p><strong>💡 Je vous propose :</strong> Un devis gratuit et personnalisé pour {{lead.companyName}} en 24h</p>

<p>Intéressé ? Répondez simplement avec :</p>
<ul>
  <li>Nombre d'employés</li>
  <li>Licences Microsoft actuelles</li>
  <li>Vos objectifs principaux</li>
</ul>

<p>Nicolas BAYONNE<br>
📞 +33 X XX XX XX XX</p>
            `
          }
        },
        {
          name: 'Attente 48h',
          stepType: 'wait',
          config: { delay: 48, unit: 'hours' }
        },
        {
          name: 'Relance avec Promotion',
          description: 'Offre limitée',
          stepType: 'email',
          config: {
            subject: '🎁 Offre spéciale Février - Économisez 20%',
            content: `
<p>Bonjour,</p>

<p><strong>Offre exclusive Février 2025</strong></p>

<p>Suite à votre intérêt pour nos tarifs, je vous propose une réduction exceptionnelle :</p>

<p><strong>🎁 -20% sur toute prestation réservée avant le 28 février</strong></p>

<p><strong>Exemple pour {{lead.companyName}} :</strong></p>
<ul>
  <li>Audit licences (valeur 1 500€) → <strong>OFFERT</strong></li>
  <li>Migration M365 → <strong>-20%</strong></li>
  <li>Formation équipes → <strong>-20%</strong></li>
</ul>

<p><strong>⏰ Offre limitée :</strong> Plus que 15 places disponibles</p>

<p><strong>Réservez votre créneau :</strong> <a href="https://calendly.com/nicolas-kaelio/offre-fevrier">Cliquez ici</a></p>

<p>Ou répondez à cet email pour un devis personnalisé.</p>

<p>Nicolas</p>
            `
          }
        },
        {
          name: 'Créer Tâche Follow-up',
          stepType: 'action',
          config: {
            actionType: 'create_task',
            task: {
              action: 'Appeler lead intéressé par pricing',
              priority: 'HAUTE',
              deadline: '+1 day',
              assignedTo: 'Nicolas BAYONNE'
            }
          }
        }
      ]
    }
  },

  // ========================================
  // 8. FIRST INTERACTION (Premier engagement)
  // ========================================
  {
    name: 'first_interaction_sequence',
    displayName: 'Premier Engagement',
    description: 'Séquence déclenchée au premier open/click d\'un lead',
    category: 'engagement',
    icon: '✨',
    recommendedFor: 'Leads qui ouvrent ou cliquent pour la première fois',
    templateData: {
      name: 'Séquence Premier Engagement',
      description: 'Capitaliser sur le premier engagement',
      category: 'engagement',
      triggerType: 'first_interaction',
      triggerConfig: {
        autoStart: true
      },
      targetSegment: 'all',
      targetPriority: 'all',
      steps: [
        {
          name: 'Email de Bienvenue Engagement',
          description: 'Capitaliser sur l\'intérêt initial',
          stepType: 'email',
          config: {
            subject: 'Merci de votre intérêt {{lead.companyName}} !',
            content: `
<p>Bonjour,</p>

<p>J'ai vu que vous avez consulté notre message récent - merci pour votre intérêt !</p>

<p><strong>Pour vous aider :</strong></p>
<p>Voici les 3 ressources les plus utiles pour des entreprises comme {{lead.companyName}} :</p>

<ol>
  <li><strong>Guide d'optimisation Microsoft 2025</strong> - <a href="#">Télécharger</a></li>
  <li><strong>Calculateur ROI en ligne</strong> - <a href="#">Essayer gratuitement</a></li>
  <li><strong>Cas clients similaires</strong> - <a href="#">Lire les success stories</a></li>
</ol>

<p><strong>Questions fréquentes :</strong></p>
<ul>
  <li>Combien pouvons-nous économiser ? → En moyenne 25-35%</li>
  <li>Combien de temps prend un audit ? → 2-3 heures</li>
  <li>C'est vraiment gratuit ? → Oui, audit gratuit sans engagement</li>
</ul>

<p>Une question ? Répondez simplement à cet email.</p>

<p>Nicolas BAYONNE<br>
KAELIO</p>
            `
          }
        },
        {
          name: 'Attente 3 jours',
          stepType: 'wait',
          config: { delay: 3, unit: 'days' }
        },
        {
          name: 'Email de Valeur',
          description: 'Apporter de la valeur sans vendre',
          stepType: 'email',
          config: {
            subject: '3 erreurs coûteuses avec Microsoft (et comment les éviter)',
            content: `
<p>Bonjour,</p>

<p>Suite à notre premier contact, je voulais partager avec vous les 3 erreurs les plus coûteuses que je vois chez nos clients :</p>

<p><strong>❌ Erreur #1 : Sur-licencier</strong></p>
<p>80% des entreprises paient pour des licences non utilisées. Coût moyen : 15-25K€/an de gaspillage.</p>

<p><strong>❌ Erreur #2 : Sous-utiliser M365</strong></p>
<p>Les entreprises utilisent moins de 30% des fonctionnalités payées. Potentiel inexploité énorme.</p>

<p><strong>❌ Erreur #3 : Négliger la sécurité</strong></p>
<p>70% des configurations M365 ont des failles de sécurité. Risque cyber majeur.</p>

<p><strong>✅ La bonne nouvelle :</strong> Ces 3 erreurs sont faciles à corriger !</p>

<p>Voulez-vous que je vérifie si {{lead.companyName}} fait l'une de ces erreurs ? (Audit gratuit 1h)</p>

<p>Nicolas</p>
            `
          }
        },
        {
          name: 'Augmenter Priorité si Actif',
          stepType: 'action',
          config: {
            actionType: 'update_priority',
            priority: 'MOYENNE'
          }
        }
      ]
    }
  }
];

/**
 * Seed workflow templates into database
 */
export async function seedWorkflowTemplates(prisma) {
  console.log('📝 Seeding workflow templates...');

  for (const template of workflowTemplates) {
    const existing = await prisma.workflowTemplate.findUnique({
      where: { name: template.name }
    });

    if (existing) {
      console.log(`✓ Template exists: ${template.displayName}`);
      continue;
    }

    await prisma.workflowTemplate.create({
      data: template
    });

    console.log(`✅ Created template: ${template.displayName}`);
  }

  console.log('✅ All workflow templates seeded!');
}
