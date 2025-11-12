/**
 * Conversational Email Scenarios with Anticipatory Responses
 *
 * This system provides truly conversational, two-way dialogue for email creation
 * with multiple branching paths and anticipatory questions.
 */

export class ConversationalScenarios {
  constructor() {
    this.scenarios = {
      prospection_initiale: this.createProspectionScenario(),
      suivi_meeting: this.createMeetingFollowUpScenario(),
      relance_client: this.createClientReengagementScenario(),
      offre_commerciale: this.createCommercialOfferScenario()
    };
  }

  /**
   * SCENARIO 1: Prospection Initiale (Cold Outreach)
   * Multi-turn conversation with context gathering
   */
  createProspectionScenario() {
    return {
      id: 'prospection_initiale',
      name: 'Prospection Initiale',
      icon: '🎯',

      // Entry point
      entry: {
        bot: {
          message: `🎯 **Parfait ! Créons ensemble un email de prospection.**

Je vais vous poser quelques questions pour personnaliser au maximum votre email.

**Première question :** Connaissez-vous déjà le nom de votre contact, ou cherchez-vous à contacter l'entreprise de manière générale ?`,
          anticipatoryQuestions: [
            {
              question: "Pourquoi me demandez-vous ça ?",
              answer: "Un email personnalisé avec le nom du contact a **3x plus de chances d'être ouvert**. Si vous n'avez pas le nom, je vais adapter le ton pour cibler un rôle spécifique (DSI, CEO, etc.)"
            },
            {
              question: "Et si je ne connais ni le nom ni le rôle ?",
              answer: "Pas de souci ! Je vais créer un email ciblé pour l'entreprise avec un appel à l'action pour identifier le bon interlocuteur. C'est une approche classique qui fonctionne bien."
            }
          ],
          quickReplies: [
            { text: '👤 J\'ai le nom du contact', value: 'has_contact_name' },
            { text: '🏢 Je cible un rôle (DSI, CEO...)', value: 'target_role' },
            { text: '❓ Pourquoi c\'est important ?', value: 'why_important', type: 'question' },
            { text: '💡 Conseil pour trouver le contact', value: 'find_contact_tip', type: 'question' }
          ]
        },

        branches: {
          has_contact_name: {
            bot: {
              message: `👤 **Excellent ! Un email personnalisé sera beaucoup plus efficace.**

**Question 2 :** Donnez-moi le nom de votre contact et son entreprise.

**Format :** Prénom Nom, Entreprise
**Exemple :** Sophie Martin, Microsoft France`,
              anticipatoryQuestions: [
                {
                  question: "Comment êtes-vous sûr que c'est la bonne personne ?",
                  answer: "Excellente question ! Je vais vous suggérer de vérifier son poste sur LinkedIn. En général, pour Microsoft/Azure, vous voulez cibler : DSI, CTO, Directeur IT, ou Responsable Infrastructure."
                },
                {
                  question: "Et si je me trompe de personne ?",
                  answer: "Dans ce cas, votre email doit inclure une phrase du type : 'Si vous n'êtes pas la bonne personne, pourriez-vous me rediriger vers le responsable IT ?' Je l'ajouterai automatiquement."
                }
              ],
              quickReplies: [
                { text: '📝 Saisir le contact', value: 'enter_contact_name', type: 'input' },
                { text: '🔍 Comment trouver le bon contact ?', value: 'how_find_contact', type: 'question' },
                { text: '❓ Puis-je cibler plusieurs personnes ?', value: 'multiple_contacts', type: 'question' },
                { text: '🔙 Finalement, je préfère cibler un rôle', value: 'target_role', type: 'back' }
              ]
            },

            next: 'gather_context'
          },

          target_role: {
            bot: {
              message: `🎯 **Ciblage par rôle - Stratégie intelligente !**

**Question 2 :** Quel type de décideur voulez-vous atteindre ?

Chaque rôle a ses propres priorités, et je vais adapter le message en conséquence.`,
              anticipatoryQuestions: [
                {
                  question: "Quelle est la différence entre ces rôles ?",
                  answer: `**DSI/CTO :** Focus sur la technique, scalabilité, sécurité
**Directeur Général :** ROI, transformation digitale, compétitivité
**DAF :** Optimisation coûts, TCO, modèle financier
**Directeur Commercial :** Productivité équipes, outils de vente, CRM`
                },
                {
                  question: "Je ne sais pas quel rôle choisir",
                  answer: "Pour une première approche Azure/Cloud, **le DSI/CTO est le meilleur choix à 80%**. C'est lui qui va évaluer techniquement votre proposition. Le Directeur Général intervient généralement après, pour la décision budgétaire."
                }
              ],
              quickReplies: [
                { text: '💻 DSI / CTO (Technique)', value: 'role_dsi', role: 'DSI' },
                { text: '👔 Directeur Général (Stratégie)', value: 'role_ceo', role: 'CEO' },
                { text: '💰 DAF (Finance)', value: 'role_daf', role: 'DAF' },
                { text: '📊 Directeur Commercial (Ventes)', value: 'role_sales', role: 'Directeur Commercial' },
                { text: '❓ Quel rôle choisir ?', value: 'which_role', type: 'question' }
              ]
            },

            next: 'gather_context'
          },

          why_important: {
            bot: {
              message: `❓ **Pourquoi le nom du contact est important ?**

📊 **Les statistiques parlent d'elles-mêmes :**

✅ **Email personnalisé (avec nom) :**
• Taux d'ouverture : **42%**
• Taux de réponse : **18%**
• "Bonjour Sophie, j'ai remarqué que Microsoft France..."

❌ **Email générique (sans nom) :**
• Taux d'ouverture : **14%**
• Taux de réponse : **3%**
• "Madame, Monsieur, Votre entreprise..."

**Résultat :** **3x plus de chances de succès** avec personnalisation !

**Que préférez-vous ?**`,
              quickReplies: [
                { text: '👤 J\'ai le nom, utilisons-le !', value: 'has_contact_name' },
                { text: '🎯 Je vais cibler un rôle spécifique', value: 'target_role' },
                { text: '💡 Comment trouver le nom ?', value: 'find_contact_tip', type: 'question' }
              ]
            }
          },

          find_contact_tip: {
            bot: {
              message: `💡 **Comment trouver le bon contact ?**

🔍 **Méthode rapide (5 minutes) :**

1️⃣ **LinkedIn :**
   • Recherchez "[Entreprise] + DSI" ou "CTO"
   • Filtrez par "Personnes" puis "Entreprise actuelle"

2️⃣ **Site web de l'entreprise :**
   • Section "Équipe" ou "Management"
   • Cherchez les postes IT/Digital

3️⃣ **LinkedIn Sales Navigator** (si vous avez) :
   • Recherche avancée par fonction et entreprise
   • Voir qui a consulté le profil de l'entreprise

4️⃣ **Stratégie alternative :**
   • Contactez le standard : "Bonjour, qui s'occupe des infrastructures IT ?"
   • Ou : Email à info@ pour demander le bon contact

**Voulez-vous que je vous aide à définir le message maintenant ?**`,
              quickReplies: [
                { text: '✅ J\'ai trouvé le contact !', value: 'has_contact_name' },
                { text: '🎯 Je cible un rôle sans nom', value: 'target_role' },
                { text: '📞 Je vais appeler le standard d\'abord', value: 'call_first' }
              ]
            }
          },

          how_find_contact: {
            bot: {
              message: `🔍 **Stratégies pour identifier le bon décideur :**

**1. LinkedIn (Recommandé) :**
• Recherche : "[Nom Entreprise] + DSI"
• Regardez qui poste sur des sujets Cloud/IT
• Vérifiez les endorsements et recommandations

**2. Organigramme digital :**
• Certaines PME publient leur organigramme
• Cherchez "équipe" ou "qui sommes-nous"

**3. Conférences / Events :**
• Regardez les speakers des événements tech de l'industrie
• Souvent ce sont les décideurs

**4. Via votre réseau :**
• Demandez une intro LinkedIn si connexion commune
• Warm intro = **5x meilleurs résultats**

**Prêt à créer votre email ?**`,
              quickReplies: [
                { text: '👤 J\'ai le contact, continuons', value: 'has_contact_name' },
                { text: '🎯 Je vais cibler le poste DSI', value: 'target_role' },
                { text: '🤝 J\'ai une connexion commune !', value: 'warm_intro' }
              ]
            }
          }
        }
      },

      // Context gathering phase
      gather_context: {
        bot: {
          message: (context) => {
            const hasName = context.contactName;
            const targetRole = context.targetRole;

            return `📊 **Question 3 : Contexte de l'approche**

${hasName ? `Pour ${context.contactName} chez ${context.company}` : `Pour cibler ${targetRole} dans l'entreprise`}, j'ai besoin de comprendre le contexte :

**Quelle est la situation ?**`;
          },
          anticipatoryQuestions: [
            {
              question: "Pourquoi le contexte est important ?",
              answer: "Le contexte me permet d'adapter le **hook** (accroche) de votre email. Par exemple : si c'est une recommandation partenaire, je vais mentionner le partenaire dès la première ligne. Si c'est une approche froide, je vais utiliser un insight industrie."
            },
            {
              question: "Et si je ne suis pas sûr du contexte ?",
              answer: "Choisissez 'Approche froide'. C'est le scénario le plus sûr et je vais créer un email qui apporte de la valeur immédiate sans supposer de contexte existant."
            }
          ],
          quickReplies: [
            { text: '🤝 Recommandé par un partenaire', value: 'partner_referral', contextType: 'warm' },
            { text: '❄️ Approche froide (pas de lien)', value: 'cold_outreach', contextType: 'cold' },
            { text: '🔗 Contact LinkedIn accepté', value: 'linkedin_connection', contextType: 'semi-warm' },
            { text: '📱 Rencontré en event/salon', value: 'event_met', contextType: 'warm' },
            { text: '❓ Quelle différence ça fait ?', value: 'context_importance', type: 'question' }
          ]
        },

        branches: {
          partner_referral: {
            bot: {
              message: `🤝 **Recommandation partenaire - Excellente approche !**

**Question 4 :** Quel partenaire vous recommande / vous travaillez avec cette entreprise ?

Les emails avec référence partenaire ont **65% de taux de réponse** !`,
              anticipatoryQuestions: [
                {
                  question: "Dois-je vraiment mentionner le partenaire ?",
                  answer: "**OUI, absolument !** C'est votre crédibilité instantanée. Je vais structurer l'email ainsi : '**Bonjour [Nom], suite à ma discussion avec [Partenaire] concernant [Entreprise]...**' C'est un warm intro parfait."
                },
                {
                  question: "Le partenaire est-il au courant que je le mentionne ?",
                  answer: "⚠️ **Important :** Assurez-vous d'avoir l'accord du partenaire avant de le mentionner. Si ce n'est pas le cas, utilisez plutôt 'Approche froide' ou contactez d'abord votre partenaire."
                }
              ],
              quickReplies: [
                { text: '📝 Saisir le nom du partenaire', value: 'enter_partner', type: 'input' },
                { text: '🔍 Chercher dans mes partenaires', value: 'search_partners' },
                { text: '❓ Dois-je avoir son accord ?', value: 'partner_permission', type: 'question' },
                { text: '🔙 Finalement, approche froide', value: 'cold_outreach', type: 'back' }
              ]
            },
            next: 'gather_solution_focus'
          },

          cold_outreach: {
            bot: {
              message: `❄️ **Approche froide - Stratégie de valeur immédiate**

**Question 4 :** Quel est l'angle d'approche principal ?

Pour un cold email efficace, vous devez apporter de la **valeur immédiate**, pas juste présenter votre offre.`,
              anticipatoryQuestions: [
                {
                  question: "C'est quoi un 'angle d'approche' ?",
                  answer: `C'est le **hook** qui va captiver votre prospect. Exemples :

**Insight industrie :** "J'ai remarqué que les entreprises de [secteur] font face à [défi]..."
**Benchmark concurrent :** "Vos concurrents comme [X] ont migré vers..."
**Étude de cas:** "Nous avons aidé [entreprise similaire] à réduire leurs coûts de 40%..."

C'est la différence entre un email ignoré et un email qui génère une réponse !`
                },
                {
                  question: "Je n'ai pas d'étude de cas dans leur secteur",
                  answer: "Pas de problème ! Je vais utiliser une approche **insight + question** : 'Comme beaucoup d'entreprises de votre taille, gérez-vous encore votre infrastructure on-premise ?' Cette question engage le prospect."
                }
              ],
              quickReplies: [
                { text: '📊 J\'ai une étude de cas similaire', value: 'case_study', angleType: 'case_study' },
                { text: '🎯 Insight sur leur secteur', value: 'industry_insight', angleType: 'insight' },
                { text: '⚡ Point de douleur identifié', value: 'pain_point', angleType: 'pain' },
                { text: '💡 Offre de valeur (audit gratuit)', value: 'value_offer', angleType: 'offer' },
                { text: '❓ Lequel est le plus efficace ?', value: 'best_approach', type: 'question' }
              ]
            },
            next: 'gather_solution_focus'
          },

          context_importance: {
            bot: {
              message: `💡 **Impact du contexte sur votre email**

Le contexte change **radicalement** votre approche :

📊 **Comparaison des taux de réponse :**

🤝 **Recommandation partenaire : 65%**
   → "Suite à ma conversation avec [Partenaire]..."
   → Crédibilité instantanée

🔗 **Contact LinkedIn : 35%**
   → "Merci d'avoir accepté ma connexion..."
   → Semi-warm, contexte existant

❄️ **Approche froide : 8-12%**
   → "J'ai remarqué que votre entreprise..."
   → Doit apporter valeur immédiate

**Plus vous avez de contexte, plus votre email sera efficace !**

**Quel est votre cas ?**`,
              quickReplies: [
                { text: '🤝 Recommandé par partenaire', value: 'partner_referral' },
                { text: '🔗 Contact LinkedIn récent', value: 'linkedin_connection' },
                { text: '❄️ Aucun lien (cold)', value: 'cold_outreach' },
                { text: '📱 Rencontré en event', value: 'event_met' }
              ]
            }
          }
        }
      },

      // Solution focus phase
      gather_solution_focus: {
        bot: {
          message: (context) => `🎯 **Question 5 : Focus de la solution**

Maintenant que j'ai le contexte, quelle solution Microsoft voulez-vous mettre en avant ?

**Conseil :** Ne proposez pas tout le catalogue ! Un email focalisé sur **1-2 solutions max** a **3x plus de réponses**.`,
          anticipatoryQuestions: [
            {
              question: "Pourquoi juste 1-2 solutions ?",
              answer: "**Paradox of Choice** : trop d'options = paralysie décisionnelle. Un email qui dit 'On fait Azure + M365 + Power Platform + Security + ...' n'obtient AUCUNE réponse. Focus = **action claire**."
            },
            {
              question: "Et si j'ai plusieurs solutions pertinentes ?",
              answer: "Choisissez LA solution qui résout leur **plus gros pain point**. Les autres viendront naturellement lors de la conversation. Un email = une proposition = un call-to-action = une réponse."
            },
            {
              question: "Je ne sais pas quelle solution ils ont besoin",
              answer: "Dans ce cas, utilisez l'approche **découverte** : 'J'aimerais comprendre vos enjeux IT actuels pour voir comment Microsoft peut vous accompagner.' Email de découverte = **15% de réponse** en cold."
            }
          ],
          quickReplies: [
            { text: '☁️ Migration Azure (Infrastructure)', value: 'azure_migration', solution: 'Azure Migration' },
            { text: '🔐 Sécurité Microsoft (Zero Trust)', value: 'security', solution: 'Microsoft Security' },
            { text: '💼 Microsoft 365 (Productivité)', value: 'm365', solution: 'Microsoft 365' },
            { text: '🤖 Power Platform (Low-code)', value: 'power_platform', solution: 'Power Platform' },
            { text: '🔍 Découverte (identifier besoins)', value: 'discovery', solution: 'Discovery' },
            { text: '❓ Laquelle choisir ?', value: 'which_solution', type: 'question' }
          ]
        },

        branches: {
          azure_migration: {
            bot: {
              message: `☁️ **Migration Azure - Excellent choix !**

**Dernière question (6) :** Quel est leur contexte infrastructure actuel (si vous le savez) ?

Cela me permet d'adapter le message. Si vous ne savez pas, je vais utiliser l'approche découverte.`,
              anticipatoryQuestions: [
                {
                  question: "Pourquoi vous demandez leur infrastructure ?",
                  answer: "Pour personnaliser le **hook**. Exemple : S'ils sont sur **AWS**, je vais parler migration AWS→Azure avec outils et coûts. S'ils sont **on-premise**, je vais parler modernisation et réduction coûts. S'ils sont **inconnu**, approche découverte."
                },
                {
                  question: "Comment savoir leur infrastructure actuelle ?",
                  answer: "Souvent via **LinkedIn de l'entreprise** (posts techniques), **site carrières** (offres d'emploi IT mentionnent les technos), ou **recherche '[Entreprise] infrastructure IT'**. Mais pas obligatoire !"
                }
              ],
              quickReplies: [
                { text: '🏢 On-premise (serveurs physiques)', value: 'onprem', currentInfra: 'on-premise' },
                { text: '☁️ Actuellement sur AWS', value: 'aws', currentInfra: 'AWS' },
                { text: '🌐 Actuellement sur Google Cloud', value: 'gcp', currentInfra: 'GCP' },
                { text: '🤷 Je ne sais pas', value: 'unknown_infra', currentInfra: 'unknown' },
                { text: '❓ Est-ce vraiment important ?', value: 'infra_importance', type: 'question' }
              ]
            },
            next: 'generate_email'
          },

          security: {
            bot: {
              message: `🔐 **Microsoft Security - Très pertinent actuellement !**

**Question 6 :** Quel angle sécurité voulez-vous utiliser ?

La sécurité est un sujet vaste. Un angle précis = meilleure réponse.`,
              anticipatoryQuestions: [
                {
                  question: "Quel angle génère le plus de réponses ?",
                  answer: "**Conformité NIS2** actuellement (#1 en 2024-2025). Toutes les entreprises de >50 personnes doivent se conformer. Ensuite : **Ransomware** (peur = action) et **Zero Trust** (moderne, tendance)."
                },
                {
                  question: "Je ne connais pas leurs enjeux sécurité",
                  answer: "Utilisez l'approche **audit sécurité gratuit** : 'Nous offrons un audit de posture sécurité gratuit pour identifier vos zones de vulnérabilité.' Très efficace car **offre de valeur concrète**."
                }
              ],
              quickReplies: [
                { text: '⚖️ Conformité NIS2/RGPD', value: 'compliance', securityAngle: 'compliance' },
                { text: '🚨 Protection Ransomware', value: 'ransomware', securityAngle: 'ransomware' },
                { text: '🛡️ Zero Trust Architecture', value: 'zero_trust', securityAngle: 'zero-trust' },
                { text: '🔍 Audit sécurité gratuit', value: 'security_audit', securityAngle: 'audit' },
                { text: '❓ Lequel choisir ?', value: 'security_choice', type: 'question' }
              ]
            },
            next: 'generate_email'
          },

          discovery: {
            bot: {
              message: `🔍 **Approche Découverte - Stratégie consultative**

**Question 6 :** Quel format de découverte préférez-vous proposer ?

L'approche découverte nécessite un **appel à l'action clair**.`,
              anticipatoryQuestions: [
                {
                  question: "Quelle est la différence entre ces formats ?",
                  answer: `**Appel 30min** : Rapide, commitment faible, taux acceptation élevé
**Workshop** : Plus structuré, valeur perçue haute, pour prospects qualifiés
**Audit gratuit** : Très attractif, mais nécessite plus d'effort du prospect
**Café virtuel** : Décontracté, relationnel, bon pour warm leads`
                },
                {
                  question: "Lequel a le meilleur taux de réponse ?",
                  answer: "**Appel 30 minutes** gagne (22% de réponse). C'est un commitment faible et clair. 'Audit gratuit' vient en 2ème (18%) mais attire des prospects plus qualifiés car effort requis."
                }
              ],
              quickReplies: [
                { text: '📞 Appel découverte 30min', value: 'call_30', discoveryFormat: 'call' },
                { text: '🎯 Workshop enjeux IT', value: 'workshop', discoveryFormat: 'workshop' },
                { text: '🔍 Audit infrastructure gratuit', value: 'free_audit', discoveryFormat: 'audit' },
                { text: '☕ Café virtuel informel', value: 'coffee', discoveryFormat: 'coffee' },
                { text: '❓ Lequel recommandez-vous ?', value: 'discovery_recommendation', type: 'question' }
              ]
            },
            next: 'generate_email'
          }
        }
      },

      // Final email generation
      generate_email: {
        bot: {
          message: (context) => {
            const summary = this.buildContextSummary(context);
            return `✅ **Parfait ! J'ai tout ce qu'il me faut !**

📋 **Résumé de votre email :**
${summary}

Je vais maintenant générer un email **personnalisé** et **optimisé** basé sur ces informations.

**Une dernière question avant de générer :**
Voulez-vous un ton **formel** (pour executives) ou **professionnel-amical** (pour PME) ?`;
          },
          anticipatoryQuestions: [
            {
              question: "Quelle est la différence de ton ?",
              answer: `**Formel** : "Monsieur [Nom], Dans le cadre de la transformation digitale de [Entreprise]..."
→ Pour CAC40, grandes entreprises, executives

**Professionnel-amical** : "Bonjour [Prénom], J'espère que vous allez bien ! J'accompagne des entreprises comme [Entreprise]..."
→ Pour PME, startups, contacts directs`
            },
            {
              question: "Je ne sais pas quel ton choisir",
              answer: "Règle simple : **Entreprise >500 personnes = Formel**. **Entreprise <500 = Professionnel-amical**. En cas de doute, professionnel-amical est plus safe (vous pouvez toujours formaliser après)."
            }
          ],
          quickReplies: [
            { text: '👔 Ton formel (Executives)', value: 'formal_tone', tone: 'formal' },
            { text: '😊 Professionnel-amical (PME)', value: 'friendly_tone', tone: 'professional_friendly' },
            { text: '⚡ Générer maintenant (ton auto)', value: 'auto_generate', tone: 'auto' },
            { text: '❓ Quel ton choisir ?', value: 'tone_help', type: 'question' },
            { text: '✏️ Modifier mes réponses', value: 'edit_context', type: 'back' }
          ]
        },

        final: true
      }
    };
  }

  /**
   * SCENARIO 2: Suivi de Meeting (Follow-up)
   */
  createMeetingFollowUpScenario() {
    return {
      id: 'suivi_meeting',
      name: 'Suivi de Réunion',
      icon: '📧',

      entry: {
        bot: {
          message: `📧 **Super ! Créons un email de suivi de réunion.**

Les emails de suivi sont **critiques** : 78% des deals se perdent par manque de follow-up !

**Question 1 :** Quel était le type de réunion ?`,
          anticipatoryQuestions: [
            {
              question: "Pourquoi le type de réunion est important ?",
              answer: "Chaque type a un **objectif différent**. Un suivi de première réunion doit récapituler et proposer prochaines étapes. Un suivi de démo doit traiter les objections. Un suivi de proposition doit pousser à la décision."
            },
            {
              question: "Combien de temps après la réunion dois-je envoyer ?",
              answer: "**Idéal : Moins de 24h** (taux de réponse 67%). **Acceptable : 48h** (taux 42%). **Au-delà de 72h** : taux chute à 15%. Le follow-up rapide montre votre professionnalisme et maintient la dynamique."
            }
          ],
          quickReplies: [
            { text: '🤝 Première réunion découverte', value: 'first_meeting', meetingType: 'discovery' },
            { text: '💻 Démo technique produit', value: 'demo', meetingType: 'demo' },
            { text: '💼 Proposition commerciale', value: 'commercial_proposal', meetingType: 'proposal' },
            { text: '🔄 Point d\'avancement projet', value: 'progress_check', meetingType: 'progress' },
            { text: '❓ Quelle est la bonne approche ?', value: 'followup_approach', type: 'question' }
          ]
        },

        branches: {
          first_meeting: {
            bot: {
              message: `🤝 **Suivi de première réunion - Moment clé !**

**Question 2 :** Quels étaient les **principaux points discutés** et **besoins identifiés** ?

Je vais structurer votre email en 3 parties :
1. **Récapitulatif** de ce qu'on a discuté
2. **Proposition de valeur** alignée sur leurs besoins
3. **Prochaines étapes** concrètes

**Donnez-moi les points clés en quelques mots** (ex: "Migration Azure, budget 100K, deadline Q2, besoin sécurité")`,
              anticipatoryQuestions: [
                {
                  question: "Je n'ai pas tout noté pendant la réunion",
                  answer: "Pas de panique ! Mentionnez au moins **1-2 points clés** dont vous vous souvenez. Vous pouvez aussi utiliser une phrase comme : 'Suite à notre échange sur vos enjeux [thème général], voici ce que je propose...' C'est suffisant."
                },
                {
                  question: "Dois-je tout récapituler dans l'email ?",
                  answer: "**NON !** Email ≠ Compte-rendu exhaustif. Mentionnez **2-3 points maximum** qui mènent à votre proposition. Trop de détails = email non lu. Restez concis et actionnable."
                }
              ],
              quickReplies: [
                { text: '📝 Saisir les points clés', value: 'enter_meeting_notes', type: 'input' },
                { text: '🎯 J\'ai identifié leur pain point', value: 'pain_point_identified' },
                { text: '💡 Ils ont exprimé un budget', value: 'budget_mentioned' },
                { text: '⏰ Ils ont une deadline projet', value: 'deadline_mentioned' },
                { text: '❓ Que faire si je n\'ai pas de notes ?', value: 'no_notes_help', type: 'question' }
              ]
            },
            next: 'define_next_steps'
          },

          demo: {
            bot: {
              message: `💻 **Suivi de démo - Adresser les objections !**

**Question 2 :** Comment s'est passée la démo ? Y a-t-il eu des **objections** ou **questions non résolues** ?

Un bon email post-démo doit :
✅ Remercier pour leur temps
✅ Traiter les objections soulevées
✅ Proposer la prochaine étape (POC, trial, etc.)

**Sélectionnez ce qui s'applique :**`,
              anticipatoryQuestions: [
                {
                  question: "Ils n'ont pas posé de questions, est-ce bon signe ?",
                  answer: "**Pas forcément !** Parfois c'est le contraire : pas de questions = pas d'engagement. Dans ce cas, votre email doit **provoquer une réaction** : 'Qu'avez-vous pensé de [fonctionnalité X] ? Répond-elle à votre besoin de [Y] ?'"
                },
                {
                  question: "Ils avaient des objections sur le prix",
                  answer: "Excellent ! Une objection prix = **intérêt réel**. Votre email doit montrer le **ROI** : 'Concernant l'investissement, nos clients comme [X] ont récupéré leur mise en 8 mois via [bénéfice concret].' + Proposer un business case."
                }
              ],
              quickReplies: [
                { text: '😊 Très positive, pas d\'objections', value: 'demo_positive', demoOutcome: 'positive' },
                { text: '🤔 Questions techniques non résolues', value: 'tech_questions', demoOutcome: 'questions' },
                { text: '💰 Objection sur le prix', value: 'price_objection', demoOutcome: 'price_concern' },
                { text: '⏰ Ils veulent voir plus / POC', value: 'want_poc', demoOutcome: 'want_more' },
                { text: '😐 Retour tiède, peu de réactions', value: 'lukewarm', demoOutcome: 'neutral' },
                { text: '❓ Comment interpréter leur réaction ?', value: 'interpret_demo', type: 'question' }
              ]
            },
            next: 'define_next_steps'
          }
        }
      },

      define_next_steps: {
        bot: {
          message: `⏭️ **Définir les prochaines étapes**

Un email de suivi **DOIT** proposer une action concrète. Pas de "tenez-moi au courant" vague !

**Question 3 :** Quelle est la prochaine étape logique ?`,
          anticipatoryQuestions: [
            {
              question: "Ils m'ont dit 'on va réfléchir', que proposer ?",
              answer: "'Réfléchir' = objection masquée. Proposez : **'Organisons un court appel de 15min pour adresser vos questions restantes. Êtes-vous disponible [date précise] ?'** Date précise = 3x plus de réponses qu'une question ouverte."
            },
            {
              question: "Dois-je proposer plusieurs options ?",
              answer: "**NON !** Proposez **UNE seule prochaine étape claire**. Paradox of choice : 2+ options = indécision. Exemple : 'Je propose un POC de 2 semaines. Seriez-vous disponible semaine prochaine pour le lancer ?' Une proposition = une réponse."
            }
          ],
          quickReplies: [
            { text: '🧪 POC / Proof of Concept', value: 'poc', nextStep: 'POC' },
            { text: '📞 Appel technique approfondi', value: 'tech_call', nextStep: 'Technical Call' },
            { text: '💼 Présentation au comité décision', value: 'committee', nextStep: 'Committee Presentation' },
            { text: '📋 Envoi de la proposition formelle', value: 'send_proposal', nextStep: 'Formal Proposal' },
            { text: '🤝 Réunion avec leur équipe IT', value: 'team_meeting', nextStep: 'Team Meeting' },
            { text: '❓ Quelle étape proposer ?', value: 'which_next_step', type: 'question' }
          ]
        },

        final: true,
        generateEmail: true
      }
    };
  }

  /**
   * SCENARIO 3: Relance Client (Re-engagement)
   */
  createClientReengagementScenario() {
    return {
      id: 'relance_client',
      name: 'Relance Client',
      icon: '🔄',

      entry: {
        bot: {
          message: `🔄 **Relance client - Stratégie de réengagement**

Les relances sont **délicates** : trop insistant = spam, trop soft = ignoré.

**Question 1 :** Depuis combien de temps le client est silencieux ?`,
          anticipatoryQuestions: [
            {
              question: "Pourquoi la durée du silence est importante ?",
              answer: `Le timing change votre approche :

**< 1 semaine** : Relance simple "suite à mon email..."
**1-2 semaines** : Ajouter nouvelle valeur ou insight
**2-4 semaines** : Approche 'dernière tentative' avec date limite
**>1 mois** : 'Break-up email' - "Dois-je clore votre dossier ?"

Chaque timing a sa psychologie !`
            },
            {
              question: "Combien de fois puis-je relancer ?",
              answer: "**Règle d'or : 3 relances maximum**. Après 3 tentatives sans réponse, soit vous utilisez un 'break-up email' (très efficace !), soit vous abandonnez pour 3-6 mois. Insister davantage = nuire à votre réputation."
            }
          ],
          quickReplies: [
            { text: '📅 Moins d\'une semaine', value: 'recent_silence', silenceDuration: 'recent' },
            { text: '📆 1-2 semaines', value: 'medium_silence', silenceDuration: 'medium' },
            { text: '📋 2-4 semaines', value: 'long_silence', silenceDuration: 'long' },
            { text: '⏰ Plus d\'un mois', value: 'very_long_silence', silenceDuration: 'very_long' },
            { text: '❓ Stratégie de relance', value: 'reengagement_strategy', type: 'question' }
          ]
        },

        branches: {
          recent_silence: {
            bot: {
              message: `📅 **Silence récent (< 1 semaine)**

C'est peut-être juste qu'ils sont occupés ! Approche douce recommandée.

**Question 2 :** Quel était votre dernier échange avec eux ?`,
              anticipatoryQuestions: [
                {
                  question: "Dois-je vraiment relancer après seulement quelques jours ?",
                  answer: "Ça dépend du contexte ! Si vous aviez convenu d'une date de retour précise qui est passée : **OUI, relancez**. Si c'était une première approche cold : **Attendez 5-7 jours min**. Respecter le timing = professionnalisme."
                }
              ],
              quickReplies: [
                { text: '💼 Proposition commerciale envoyée', value: 'proposal_sent', lastInteraction: 'proposal' },
                { text: '📞 Après un appel prometteur', value: 'promising_call', lastInteraction: 'call' },
                { text: '💻 Après une démo', value: 'after_demo', lastInteraction: 'demo' },
                { text: '📧 Email froid sans réponse', value: 'cold_email', lastInteraction: 'cold_email' }
              ]
            },
            next: 'choose_reengagement_angle'
          },

          very_long_silence: {
            bot: {
              message: `⏰ **Silence prolongé (>1 mois) - Break-up email recommandé !**

Après un mois, une relance classique ne fonctionne plus. La stratégie **"break-up email"** a un **taux de réponse de 30-40%** !

**Principe :** "Je suppose que ce n'est plus une priorité pour vous. Dois-je clore votre dossier ?"

**Question 2 :** Voulez-vous utiliser l'approche break-up ou une dernière tentative classique ?`,
              anticipatoryQuestions: [
                {
                  question: "C'est quoi un 'break-up email' exactement ?",
                  answer: `**Break-up email** = Email qui dit "J'abandonne, sauf si..."\n\nExemple : \n"Bonjour [Nom], \n\nJe vous ai contacté plusieurs fois concernant [sujet] mais je n'ai pas eu de retour.\n\nJe suppose que ce n'est plus une priorité pour [Entreprise] en ce moment.\n\n**Puis-je considérer ce dossier comme clos ?**\n\nSi jamais la situation change, je reste disponible.\n\nCordialement,"\n\n**Pourquoi ça marche ?** Psychologie inversée + Peur de rater une opportunité = Réaction !`
                },
                {
                  question: "Est-ce que ça ne fait pas négatif ou passif-agressif ?",
                  answer: "Non si c'est bien formulé ! C'est **respectueux** (vous reconnaissez qu'ils sont occupés) et **libérateur** (pas de pression). Les prospects apprécient qu'on leur permette de dire non clairement plutôt que de les harceler."
                }
              ],
              quickReplies: [
                { text: '💔 Break-up email (recommandé)', value: 'breakup_email', reengagementType: 'breakup' },
                { text: '💎 Nouvelle valeur / Offre', value: 'new_value', reengagementType: 'value' },
                { text: '📊 Étude de cas récente pertinente', value: 'recent_case_study', reengagementType: 'case_study' },
                { text: '❓ Pourquoi break-up est efficace ?', value: 'why_breakup', type: 'question' }
              ]
            },
            next: 'generate_reengagement_email'
          }
        }
      },

      choose_reengagement_angle: {
        bot: {
          message: `🎯 **Angle de relance**

Pour réengager un prospect silencieux, vous devez apporter **quelque chose de nouveau**, pas juste "je relance".

**Question 3 :** Quel nouvel élément pouvez-vous apporter ?`,
          anticipatoryQuestions: [
            {
              question: "Je n'ai rien de nouveau à apporter",
              answer: "Dans ce cas, utilisez ces techniques qui marchent :\n\n1. **Question assumée** : 'Ai-je mal évalué le timing ?'\n2. **Référence tierce** : 'Un de vos concurrents vient de...'\n3. **Statistique/Insight** : 'J'ai lu que votre secteur fait face à...'\n4. **Permission de fermer** : 'Dois-je considérer que ce n'est plus d'actualité ?'\n\nCes approches relancent sans être insistant."
            }
          ],
          quickReplies: [
            { text: '📊 Nouvelle étude de cas', value: 'new_case_study', reengagementAngle: 'case_study' },
            { text: '💡 Insight industrie pertinent', value: 'industry_insight', reengagementAngle: 'insight' },
            { text: '🎁 Nouvelle offre / Promotion', value: 'new_offer', reengagementAngle: 'offer' },
            { text: '❓ Question directe sur timing', value: 'timing_question', reengagementAngle: 'question' },
            { text: '⏰ Deadline/Urgence légitime', value: 'deadline', reengagementAngle: 'urgency' }
          ]
        },

        final: true,
        generateEmail: true
      },

      generate_reengagement_email: {
        bot: {
          message: `✅ **Prêt à générer votre email de relance !**

Basé sur vos réponses, je vais créer un email de relance :
• **Respectueux** de leur temps
• Apportant **nouvelle valeur**
• Avec **call-to-action clair**
• **Sans pression** excessive

**Ton de l'email ?**`,
          quickReplies: [
            { text: '😊 Professionnel-amical', value: 'friendly_reengagement', tone: 'professional_friendly' },
            { text: '💼 Formel et direct', value: 'formal_reengagement', tone: 'formal' },
            { text: '⚡ Générer maintenant', value: 'generate_now', tone: 'auto' }
          ]
        },

        final: true
      }
    };
  }

  /**
   * SCENARIO 4: Offre Commerciale (Commercial Offer)
   */
  createCommercialOfferScenario() {
    return {
      id: 'offre_commerciale',
      name: 'Offre Commerciale',
      icon: '💼',

      entry: {
        bot: {
          message: `💼 **Création d'offre commerciale**

**Question 1 :** Est-ce une offre sollicitée (ils l'ont demandée) ou non-sollicitée (vous la proposez) ?`,
          anticipatoryQuestions: [
            {
              question: "Quelle est la différence d'approche ?",
              answer: `**Sollicitée** : Ils attendent votre offre → Focus sur détails, pricing, timeline
**Non-sollicitée** : Vous proposez → Focus sur valeur, ROI, pourquoi maintenant

Une offre sollicitée commence par 'Suite à votre demande...'
Une offre non-sollicitée doit justifier pourquoi vous la proposez.`
            }
          ],
          quickReplies: [
            { text: '✅ Sollicitée (demandée par client)', value: 'solicited', offerType: 'solicited' },
            { text: '💡 Non-sollicitée (proposition)', value: 'unsolicited', offerType: 'unsolicited' }
          ]
        },

        branches: {
          solicited: {
            bot: {
              message: `✅ **Offre sollicitée**

**Question 2 :** Quelle est la solution / le package que vous proposez ?

Je vais structurer l'offre de manière claire et convaincante.`,
              quickReplies: [
                { text: '📝 Décrire la solution', value: 'describe_solution', type: 'input' },
                { text: '☁️ Package Azure Migration', value: 'azure_package', solution: 'Azure Migration Package' },
                { text: '🔐 Package Security', value: 'security_package', solution: 'Security Package' },
                { text: '💼 Package M365', value: 'm365_package', solution: 'M365 Package' }
              ]
            },
            next: 'define_commercial_details'
          },

          unsolicited: {
            bot: {
              message: `💡 **Offre non-sollicitée**

**Question 2 :** Pourquoi proposez-vous cette offre maintenant ? (Je vais utiliser ça comme hook)`,
              anticipatoryQuestions: [
                {
                  question: "Qu'est-ce qu'un bon 'pourquoi maintenant' ?",
                  answer: `Exemples de bons hooks :
• "Fin d'année fiscale = budget à optimiser"
• "Nouvelle réglementation NIS2 = deadline 2024"
• "Votre concurrent X vient de migrer"
• "Fin de support Windows Server 2012"
• "Offre promotionnelle Q4"

Le 'pourquoi maintenant' crée l'urgence et justifie votre proactivité.`
                }
              ],
              quickReplies: [
                { text: '⏰ Deadline réglementaire', value: 'regulatory_deadline', offerReason: 'compliance' },
                { text: '🎁 Offre promotionnelle', value: 'promotion', offerReason: 'promotion' },
                { text: '📊 Insight industrie', value: 'industry_trend', offerReason: 'trend' },
                { text: '🚨 Point de douleur identifié', value: 'pain_point', offerReason: 'pain' }
              ]
            },
            next: 'define_commercial_details'
          }
        }
      },

      define_commercial_details: {
        bot: {
          message: `💰 **Détails commerciaux**

**Question 3 :** Souhaitez-vous inclure le pricing dans cet email ?`,
          anticipatoryQuestions: [
            {
              question: "Dois-je mettre les prix dans l'email ?",
              answer: `**Ça dépend !**

✅ **Inclure le prix si** :
• Offre standardisée / Package défini
• Relation déjà établie
• Marché transparent (commodité)

❌ **Ne pas inclure si** :
• Solution complexe nécessitant customisation
• Première interaction cold
• Voulez forcer un appel de qualification

**Best practice** : Fourchette de prix + 'sur la base de [hypothèses]' + Invitation call pour affiner.`
            }
          ],
          quickReplies: [
            { text: '💶 Oui, fourchette de prix', value: 'include_pricing', includePricing: true },
            { text: '📞 Non, proposer call pour devis', value: 'call_for_pricing', includePricing: false },
            { text: '📋 Joindre PDF détaillé', value: 'attach_pdf', includePricing: 'pdf' }
          ]
        },

        final: true,
        generateEmail: true
      }
    };
  }

  /**
   * Get scenario by ID
   */
  getScenario(scenarioId) {
    return this.scenarios[scenarioId];
  }

  /**
   * Navigate to a specific node in the conversation tree
   */
  navigateConversation(scenarioId, currentNode, userResponse) {
    const scenario = this.scenarios[scenarioId];
    if (!scenario) return null;

    // If at entry, go to branches
    if (currentNode === 'entry') {
      const branch = scenario.entry.branches[userResponse];
      if (branch) {
        return {
          node: branch,
          path: 'entry.' + userResponse
        };
      }
    }

    // Navigate to next node based on 'next' property
    if (scenario[currentNode] && scenario[currentNode].branches) {
      const branch = scenario[currentNode].branches[userResponse];
      if (branch && branch.next) {
        return {
          node: scenario[branch.next],
          path: currentNode + '.' + userResponse
        };
      }
    }

    return null;
  }

  /**
   * Build context summary for email generation
   */
  buildContextSummary(context) {
    const parts = [];

    if (context.contactName) {
      parts.push(`👤 **Contact :** ${context.contactName}`);
    }
    if (context.company) {
      parts.push(`🏢 **Entreprise :** ${context.company}`);
    }
    if (context.targetRole) {
      parts.push(`🎯 **Rôle ciblé :** ${context.targetRole}`);
    }
    if (context.contextType) {
      const contextLabels = {
        warm: 'Recommandation partenaire',
        cold: 'Approche froide',
        'semi-warm': 'Contact LinkedIn'
      };
      parts.push(`🔗 **Contexte :** ${contextLabels[context.contextType]}`);
    }
    if (context.partnerName) {
      parts.push(`🤝 **Partenaire :** ${context.partnerName}`);
    }
    if (context.solution) {
      parts.push(`☁️ **Solution :** ${context.solution}`);
    }
    if (context.currentInfra) {
      parts.push(`🖥️ **Infrastructure actuelle :** ${context.currentInfra}`);
    }

    return parts.join('\n');
  }

  /**
   * Get all available scenarios for initial choice
   */
  getAllScenarios() {
    return Object.values(this.scenarios).map(scenario => ({
      id: scenario.id,
      name: scenario.name,
      icon: scenario.icon
    }));
  }
}

export const conversationalScenarios = new ConversationalScenarios();
