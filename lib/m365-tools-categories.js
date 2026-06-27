/**
 * M365 Tools Categories — Données enrichies pour l'onglet "Disponibilités Features"
 * Utilisé par : app/knowledge-base/page.jsx
 */

export const AVAIL_STYLES = {
  all:      { label: 'Tous plans',  bg: 'bg-gray-100',    text: 'text-gray-600',    border: 'border-gray-200'    },
  business: { label: 'Business',   bg: 'bg-sky-100',     text: 'text-sky-700',     border: 'border-sky-200'     },
  premium:  { label: 'Prem.',      bg: 'bg-indigo-100',  text: 'text-indigo-700',  border: 'border-indigo-200'  },
  e3:       { label: 'E3+',        bg: 'bg-purple-100',  text: 'text-purple-700',  border: 'border-purple-200'  },
  e5:       { label: 'E5',         bg: 'bg-violet-100',  text: 'text-violet-700',  border: 'border-violet-200'  },
  frontline:{ label: 'Frontline',  bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  addon:    { label: 'Add-on',     bg: 'bg-orange-100',  text: 'text-orange-700',  border: 'border-orange-200'  },
};

export const M365_TOOL_CATEGORIES = [
  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'core-productivity', letter: 'A', emoji: '🟦',
    label: 'Core Productivity', sublabel: 'Cœur historique Modern Work — Office apps',
    gradient: 'from-blue-500 to-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800',
    tools: [
      {
        name: 'Word', icon: '📝', avail: 'all',
        note: 'Desktop inclus sauf Business Basic & Frontline',
        details: [
          'Co-rédaction en temps réel jusqu\'à 512 auteurs simultanés',
          'Microsoft Editor (IA) : grammaire, style, réécriture — 20+ langues',
          'Dictée vocale, lecture immersive, accessibilité avancée',
        ],
        angle: 'Argument clé : les équipes juridiques/RH/marketing réduisent le cycle de révision de 40% avec la co-rédaction',
      },
      {
        name: 'Excel', icon: '📊', avail: 'all',
        note: 'Desktop inclus sauf Business Basic & Frontline',
        details: [
          '500+ fonctions dont XLOOKUP, LET, LAMBDA, fonctions de tableau',
          'Power Query intégré pour connexion à toutes les sources de données',
          'Copilot Excel : analyse en langage naturel, graphiques auto, insights IA',
        ],
        angle: 'ROI : remplace des outils BI légers — économie de $20-100/u/m sur des solutions tierces',
      },
      {
        name: 'PowerPoint', icon: '📑', avail: 'all',
        note: 'Desktop inclus sauf Business Basic & Frontline',
        details: [
          'Designer IA : suggestions de mise en page automatiques',
          'Presenter Coach : entraînement avant les présentations importantes',
          'Morph + Zoom : transitions cinématographiques sans code',
        ],
        angle: 'Pitch : commerciaux et dirigeants créent des decks pro en 2x moins de temps',
      },
      {
        name: 'Outlook', icon: '📧', avail: 'all',
        note: 'Inclus dans tous les plans (Exchange Online requis pour hébergement)',
        details: [
          'Focused Inbox : filtre IA des emails importants vs. secondaires',
          'Scheduling Assistant : trouve les créneaux libres entre participants',
          'Copilot in Outlook : rédige, résume les fils de discussion, planning',
        ],
        angle: 'Argument productivité : 2,5h gagnées/semaine/utilisateur selon Microsoft',
      },
      {
        name: 'OneNote', icon: '📓', avail: 'all',
        note: 'Inclus dans tous les plans',
        details: [
          'Blocs-notes partagés avec contrôle d\'accès granulaire',
          'OCR : reconnaissance de texte dans photos et PDF intégrés',
          'Intégration Loop pour composants collaboratifs en temps réel',
        ],
        angle: 'Remplace les wikis tiers (Confluence basique) — déjà inclus dans la licence',
      },
      {
        name: 'Access (PC)', icon: '🗄️', avail: 'business',
        note: 'Business Standard/Premium, E3/E5 (Windows uniquement)',
        details: [
          'SGBD relationnel desktop pour apps métier locales sans IT',
          'Connexion à SQL Server, SharePoint, Excel comme sources externes',
          'Migration possible vers Power Apps pour accès web/mobile',
        ],
        angle: 'Cible : équipes ops/ADV qui gèrent des bases locales — argument modernisation vers Power Apps',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'collaboration', letter: 'B', emoji: '🟩',
    label: 'Collaboration & Content', sublabel: 'Pilier Modern Work — CRITIQUE pour toute vente M365',
    gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800',
    tools: [
      {
        name: 'Microsoft Teams', icon: '💬', avail: 'all',
        note: 'Inclus partout sauf Apps for Business (apps bureautiques seules)',
        details: [
          'Réunions jusqu\'à 1 000 participants (Teams Premium : 20 000)',
          'Phone System : remplacement IPBX — appels PSTN depuis Teams',
          'Teams Rooms : salles de réunion connectées (matériel certifié)',
          'Transcription, sous-titres live, traduction en temps réel',
        ],
        angle: 'Argument convergence : remplace Zoom + Slack + système téléphonique dans un seul outil',
      },
      {
        name: 'SharePoint', icon: '🔗', avail: 'business',
        note: 'Depuis Business Basic — storage infrastructure de Teams & OneDrive',
        details: [
          'Intranet moderne : sites, hubs, pages, actualités d\'entreprise',
          'Gestion documentaire : versioning, check-out, métadonnées, workflow',
          'SharePoint Advanced Management (SAM) : inclus avec M365 Copilot',
        ],
        angle: 'Key insight : SharePoint = colonne vertébrale de tout stockage Teams & OneDrive — toujours présent',
      },
      {
        name: 'OneDrive', icon: '💾', avail: 'all',
        note: '1TB Business/Enterprise, 2GB F1/F3, extensible 5TB sur E3/E5',
        details: [
          'Personal Vault : coffre-fort chiffré avec authentification renforcée',
          'Files On-Demand : accès sans téléchargement, sync sélectif',
          'Partage externe sécurisé avec liens à expiration et mot de passe',
        ],
        angle: 'Argument sécurité vs. Dropbox/Box : contrôle IT centralisé + DLP natif inclus',
      },
      {
        name: 'Exchange Online', icon: '📬', avail: 'business',
        note: '50GB Business, 100GB E3, illimité E5 (archivage auto)',
        details: [
          'Anti-spam/phishing : EOP (inclus) + Defender for Office 365 (E5)',
          'Calendriers partagés, salles et ressources, délégation',
          'Archive in-place illimitée sur E3/E5 — conformité légale',
        ],
        angle: 'Argument migration : sortez de l\'Exchange on-premises — 0 serveur à maintenir',
      },
      {
        name: 'Loop', icon: '🔄', avail: 'all',
        note: 'Composants Loop inclus M365 Business/Enterprise',
        details: [
          'Composants portables : tableaux, listes, votes — synchronisés partout',
          'Espaces Loop : collaboration asynchrone projet avec pages et blocs',
          'Intégration native Teams, Outlook, OneNote, Word',
        ],
        angle: 'Nouveau différenciateur face à Notion : Loop est inclus dans la licence existante',
      },
      {
        name: 'Viva Engage', icon: '🌐', avail: 'e3',
        note: 'Ex-Yammer — M365 E3/E5 et Business Standard/Premium',
        details: [
          'Communautés métier, groupes d\'intérêt, storyline personnel',
          'Q&A avec dirigeants (Leadership Corner), événements live',
          'Analytics d\'engagement et de portée des communications',
        ],
        angle: 'Remplacement d\'Yammer : plateforme RSE intégrée — remplace des outils intranet tiers',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'work-management', letter: 'C', emoji: '🟨',
    label: 'Work Management', sublabel: 'Task & Project management — toujours vendre ensemble',
    gradient: 'from-amber-500 to-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800',
    tools: [
      {
        name: 'Planner', icon: '📋', avail: 'all',
        note: 'Inclus partout — tâches équipe simples (Kanban)',
        details: [
          'Vues Kanban, liste, planning, graphiques — intégré dans Teams',
          'My Tasks : vue consolidée de toutes les tâches (Planner + To Do)',
          'Planner Premium = Project for the Web (add-on)',
        ],
        angle: '💡 Planner = team tasks simple / Project = PPM enterprise / Lists = tracking métier — ces 3 sont complémentaires',
      },
      {
        name: 'Project', icon: '📅', avail: 'addon',
        note: 'Add-on payant — Project Plan 1 ($10), 3 ($30), 5 ($55)/u/mois',
        details: [
          'Gantt interactif, jalons, chemins critiques, baselines',
          'Gestion des ressources : capacité, taux, affectations',
          'Portefeuille projets : roadmap, priorités, alignement stratégique',
        ],
        angle: 'Argument upsell : PME avec 5+ projets simultanés ont besoin de Project — ROI vs MS Project Server on-prem',
      },
      {
        name: 'To Do', icon: '✅', avail: 'all',
        note: 'Inclus dans tous les plans — tâches personnelles + délégation',
        details: [
          'Ma journée : sélection quotidienne des priorités avec suggestions IA',
          'Emails marqués Outlook → tâches To Do automatiquement',
          'Partage de listes, assignation de sous-tâches, rappels répétés',
        ],
        angle: 'Remplacement de Todoist/Things : déjà inclus, synchronisé avec Outlook et Teams',
      },
      {
        name: 'Lists', icon: '📝', avail: 'all',
        note: 'Inclus — tracking métier configurable (CRM léger, incidents, stock…)',
        details: [
          'Vues : grille, galerie, calendrier, Gantt (basique), cartes',
          'Règles & alertes automatiques, flux Power Automate natifs',
          'Intégration Power Apps pour créer des formulaires métier sur mesure',
        ],
        angle: 'Argument sans code : remplace des bases Access ou des fichiers Excel partagés problématiques',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'power-platform', letter: 'D', emoji: '🟪',
    label: 'Apps & Automation', sublabel: 'Power Platform — low-code & automatisation',
    gradient: 'from-orange-400 to-amber-500', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800',
    tools: [
      {
        name: 'Power Apps', icon: '📱', avail: 'all',
        note: 'Version M365 limitée incluse — Premium = add-on ($20/u/m)',
        details: [
          'Canvas apps : design libre, mobile-first, 600+ connecteurs',
          'Model-driven : basé sur Dataverse — apps métier complexes',
          'AI Builder intégré : OCR, prédictions, extraction de données',
        ],
        angle: 'Cible DSI : remplace des apps métier custom coûteuses — 70% moins cher à maintenir',
      },
      {
        name: 'Power Automate', icon: '⚙️', avail: 'all',
        note: 'Cloud flows M365 inclus — RPA Desktop = add-on ($15/u/m)',
        details: [
          '900+ connecteurs : SAP, Salesforce, ServiceNow, Oracle, SQL...',
          'RPA Desktop : automatisation d\'interfaces sans API (legacy apps)',
          'Process Mining : analyse et cartographie des processus réels',
        ],
        angle: 'ROI concret : 1 flux = 2-8h économisées/semaine — payback en < 1 mois',
      },
      {
        name: 'Power BI', icon: '📈', avail: 'addon',
        note: 'Pro $10/u/m — Premium Per User $20/u/m — inclus avec M365 E5',
        details: [
          '100+ connecteurs natifs (Azure, SAP, Google Analytics, Salesforce...)',
          'Rapports paginés, KPI, scorecards, goals (OKR)',
          'Fabric : unification données warehouse + BI dans un seul espace',
        ],
        angle: 'Argument décideurs : 1 dashboard Power BI remplace 3-5 rapports Excel envoyés par email',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'employee-experience', letter: 'E', emoji: '🟧',
    label: 'Employee Experience', sublabel: 'Suite Viva — engagement, bien-être, formation',
    gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-800',
    tools: [
      {
        name: 'Viva Connections', icon: '🔗', avail: 'all',
        note: 'Inclus M365 & O365 — Hub employé personnalisé dans Teams',
        details: [
          'Dashboard configurable : KPI RH, outils métier, notifications',
          'Feed d\'actualités : SharePoint + Yammer/Viva Engage centralisés',
          'App mobile Teams : portail employé accessible depuis le terrain',
        ],
        angle: 'Pitch RH : remplace un intranet legacy — 0 dev requis, déployé en 2 semaines',
      },
      {
        name: 'Viva Insights', icon: '💡', avail: 'e3',
        note: 'Personal insights E1+, Manager/Leader insights = add-on Viva Suite',
        details: [
          'Insights personnels : temps focus, réunions dos-à-dos, heures tardives',
          'Dashboard manager : tendances équipe, saturation de réunions',
          'Wellbeing score : indice de bien-être collaboratif anonymisé',
        ],
        angle: 'Argument DRH : données factuelles pour négocier la réduction des réunions inutiles',
      },
      {
        name: 'Viva Learning', icon: '📚', avail: 'e3',
        note: 'Basique inclus M365, Premium (intégrations LMS) = add-on',
        details: [
          'Intégrations : LinkedIn Learning, Coursera, SAP SuccessFactors, LMS',
          'Recommandations IA selon le rôle, l\'historique et les objectifs',
          'Assignation de formations par managers directement dans Teams',
        ],
        angle: 'ROI L&D : centralise les formations sans changer les outils — Teams = seul portail d\'accès',
      },
      {
        name: 'Viva Glint', icon: '📊', avail: 'addon',
        note: 'Add-on payant — inclus dans Viva Suite ($12/u/m)',
        details: [
          'Pulse surveys : enquêtes de 2-5 questions à fréquence configurable',
          'Lifecycle surveys : onboarding, départ, 90 jours...',
          'Analyse thématique IA des réponses ouvertes',
        ],
        angle: 'Cible RH/DG : données engagement avant les décisions de rétention critiques',
      },
      {
        name: 'Viva Amplify', icon: '📣', avail: 'e3',
        note: 'Depuis M365 E3 — communication interne multi-canal',
        details: [
          'Éditeur de campagnes communication : email, Viva Engage, SharePoint',
          'Planification et publication multi-canal depuis un seul outil',
          'Analytics de portée : ouvertures, clics, reach par segment',
        ],
        angle: 'Pitch com interne : une campagne = tous les canaux en 1 clic — remplace MailChimp interne',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'security-compliance', letter: 'F', emoji: '🟥',
    label: 'Security & Compliance', sublabel: 'Indispensable pour pitcher E5 — argument RGPD/NIS2',
    gradient: 'from-red-500 to-rose-600', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800',
    tools: [
      {
        name: 'Microsoft Defender', icon: '🛡️', avail: 'premium',
        note: 'Basique tous plans — P1 Business Premium — P2 E5/M365 E5 Security',
        details: [
          'Defender for Endpoint : EDR, détection comportementale, remédiation auto',
          'Defender for Identity : protection contre les attaques Active Directory',
          'Defender XDR : corrélation des signaux multi-sources (SIEM lite)',
        ],
        angle: 'Argument ROI sécurité : -60% du coût vs. solutions EDR tierces (CrowdStrike, SentinelOne)',
      },
      {
        name: 'Microsoft Purview', icon: '🔒', avail: 'e3',
        note: 'Standard E3 — Premium (suite Compliance) inclus E5',
        details: [
          'MIP : étiquetage et classification des données sensibles (RGPD, PCI)',
          'DLP : prévention des fuites sur email, Teams, SharePoint, Endpoint',
          'eDiscovery Premium : recherche légale, conservation, export structuré',
        ],
        angle: 'Levier compliance RGPD/NIS2 : Purview = outil principal pour les audits réglementaires',
      },
      {
        name: 'Entra ID', icon: '🔑', avail: 'all',
        note: 'Free (tous plans) — P1 avec E3/Business Premium — P2 avec E5',
        details: [
          'Conditional Access (P1) : règles d\'accès basées sur risque, device, localisation',
          'MFA + Passwordless : authenticator app, FIDO2, Windows Hello',
          'Privileged Identity Management PIM (P2) : accès admin JIT',
        ],
        angle: 'Argument Zero Trust : Entra P2 = colonne vertébrale d\'une architecture conforme NIS2',
      },
      {
        name: 'DLP / Audit', icon: '🔍', avail: 'e3',
        note: 'Depuis E3 / Business Premium (partiel) — Audit Premium sur E5',
        details: [
          'Audit Standard : 90 jours de logs — Audit Premium : 180 jours + requêtes avancées',
          'Insider Risk Management : détection comportements anormaux (E5)',
          'Communication Compliance : surveillance des échanges pour conformité',
        ],
        angle: 'Pitch secteur banque/santé : Audit Premium + Insider Risk = exigences AMF/ANSSI couvertes',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'devices', letter: 'G', emoji: '🟫',
    label: 'Cloud Endpoints / Devices', sublabel: 'Gestion et sécurité des appareils — from-to zero trust',
    gradient: 'from-slate-500 to-gray-600', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800',
    tools: [
      {
        name: 'Microsoft Intune', icon: '📱', avail: 'premium',
        note: 'Plan 1 : Business Premium, E3/E5, F1/F3 — Plan 2 / Suite = add-on',
        details: [
          'MDM : gestion politique Windows/iOS/Android/macOS depuis le cloud',
          'MAM : protection apps sans inscription appareil (BYOD)',
          'Autopilot : provisioning Windows zero-touch à la livraison',
          'Plan 2 : + Remote Help, Tunnel MAM, Analytics avancés',
          'Suite : + EPM (Endpoint Privilege Management), Cloud PKI',
        ],
        angle: 'Argument IT : retire les droits admin permanent avec EPM — exigence NIS2 pour les accès élevés',
      },
      {
        name: 'Windows 11 Enterprise', icon: '🪟', avail: 'e3',
        note: 'Upgrade licence depuis Windows Pro — inclus M365 E3/E5/F3',
        details: [
          'Virtualization Based Security, Credential Guard, HVCI',
          'DirectAccess / Always On VPN natif, BitLocker management centralisé',
          'Enterprise features : AppLocker, Assigned Access, Enterprise Mode IE',
        ],
        angle: 'Migration de Windows 10 (fin de support Oct 2025) : argument timing critique pour les upgrades',
      },
      {
        name: 'Windows 365', icon: '💻', avail: 'addon',
        note: 'Add-on Cloud PC — 2GB/4GB/8GB/16GB RAM — $28-$162/u/m',
        details: [
          'PC Cloud persistant : streaming depuis n\'importe quel appareil',
          'Provisioning < 30 min — scalable instantanément selon les besoins',
          'Stockage Azure : données jamais sur l\'appareil local',
        ],
        angle: 'Cible IT/Finance : remplace les VDI Citrix/VMware coûteux — opex vs. capex infra',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'ai-copilot', letter: 'H', emoji: '🤖',
    label: 'AI / Copilot', sublabel: 'Nouveau cœur de la suite Microsoft — argument FY26',
    gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800',
    tools: [
      {
        name: 'Microsoft 365 Copilot', icon: '🤖', avail: 'addon',
        note: '+$30/u/m add-on sur E3/E5/Business — prérequis : plan M365 existant',
        details: [
          'Copilot in Word : rédaction, résumé, reformulation de documents',
          'Copilot in Teams : résumé de réunions, actions, rattrapage de réunions manquées',
          'Copilot in Excel : analyse de données, formules complexes, graphiques auto',
          'Copilot in Outlook : rédaction, résumé de fils, tri priorité',
          'Copilot Chat : assistant work avec accès aux données M365 (Graph)',
        ],
        angle: 'Stat Microsoft : 70% des utilisateurs Copilot plus productifs dès les 3 premiers mois',
      },
      {
        name: 'Copilot Chat', icon: '💬', avail: 'all',
        note: 'Inclus avec abonnement M365 — web gratuit, Work = M365 Copilot',
        details: [
          'Web grounding : internet en temps réel (Bing Enterprise)',
          'Work grounding (avec M365 Copilot) : emails, docs, Teams, calendar',
          'Enterprise Data Protection : données jamais utilisées pour entraîner les modèles',
        ],
        angle: 'Point d\'entrée gratuit : faire tester Copilot Chat à un prospect sans investissement',
      },
      {
        name: 'Copilot Studio', icon: '🎨', avail: 'all',
        note: 'Plan Teams inclus dans M365 — Standalone ~$200/tenant/mois',
        details: [
          'Plan Teams : chatbots dans Teams uniquement, orchestration classique',
          'Standalone : tous canaux (web, WhatsApp, Teams...), génératif, Premium connectors',
          'Copilot Credits : monnaie de consommation depuis sept. 2025',
        ],
        angle: 'Entrée no-code IA : chatbot FAQ interne Teams en 2h sans dev — argument DSI',
      },
      {
        name: 'GitHub Copilot', icon: '💻', avail: 'addon',
        note: 'Business $19/siège/m — Enterprise $39/siège/m (GitHub Enterprise Cloud)',
        details: [
          'Complétion de code dans VS Code, JetBrains, Visual Studio (multi-modèles)',
          'Copilot Chat : questions sur le code, refactoring, debug dans l\'IDE',
          'Coding Agent : GitHub Issue → branche → code → PR automatique',
          'Enterprise : knowledge bases sur la doc interne, recherche sémantique',
        ],
        angle: 'ROI dev : 55% plus rapide selon GitHub research — break-even < 0.5h/jour économisée',
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  {
    id: 'other-services', letter: 'I', emoji: '🟦',
    label: 'Autres Services', sublabel: 'Valeur cachée — souvent oubliés mais déjà inclus dans la licence',
    gradient: 'from-cyan-500 to-teal-500', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800',
    tools: [
      {
        name: 'Visio', icon: '📐', avail: 'addon',
        note: 'Add-on Plan 1 ($5/m) Plan 2 ($15/m) — Visio for Web inclus M365',
        details: [
          'Diagrammes : processus, organigrammes, réseaux, BPMN, UML',
          'Visio for Web : visualisation de diagrammes sans licence payante',
          'Intégration SharePoint, Teams pour partage et collaboration',
        ],
        angle: 'Argument : Visio Plan 1 = $5/m vs. Lucidchart $10/m — déjà dans l\'écosystème M365',
      },
      {
        name: 'Bookings', icon: '📆', avail: 'business',
        note: 'Business Standard/Premium & E3/E5',
        details: [
          'Page de réservation publique pour RDV clients/prospects',
          'Synchronisation calendrier Outlook, rappels automatiques SMS/email',
          'Multi-staff : gestion des plannings de toute une équipe de service',
        ],
        angle: 'Pitch PME : remplace Calendly ($12/m) — déjà inclus dans Business Standard',
      },
      {
        name: 'Forms', icon: '📋', avail: 'all',
        note: 'Inclus partout sauf F1 — formulaires, quiz, sondages',
        details: [
          'Logique conditionnelle, branchement, randomisation des questions',
          'Mode quiz : notation auto, feedback immédiat, classement',
          'Export Excel des réponses, visualisations en temps réel',
        ],
        angle: 'Remplacement Typeform/SurveyMonkey : déjà inclus — argument pendant les RDV de renouvellement',
      },
      {
        name: 'Stream', icon: '🎬', avail: 'all',
        note: 'Basé sur SharePoint depuis 2023 — stockage vidéo partagé',
        details: [
          'Enregistrements Teams stockés automatiquement dans Stream',
          'Transcription automatique + chapitres IA, sous-titres, recherche dans le contenu',
          'Partage sécurisé avec contrôle d\'expiration, intégration Teams/SharePoint',
        ],
        angle: 'Cas d\'usage formation/onboarding : bibliothèque vidéo interne — 0 coût additionnel',
      },
      {
        name: 'Whiteboard', icon: '🖊️', avail: 'all',
        note: 'Inclus dans tous les plans — tableau blanc collaboratif',
        details: [
          'Sticky notes, templates, formes, connecteurs, dessin à la main',
          'Accessible depuis Teams Meetings et depuis whiteboard.office.com',
          'Export PNG/SVG, partage en lecture ou édition',
        ],
        angle: 'Remplace Miro/Mural (€8-16/u/m) pour les cas d\'usage basiques — argument lors du renouvellement',
      },
      {
        name: 'Sway', icon: '🎭', avail: 'all',
        note: 'Inclus dans tous les plans — présentations web interactives',
        details: [
          'Design adaptatif automatique (responsive mobile, écran, TV)',
          'Intégration médias : YouTube, Twitter, Flickr, carte Bing, Office files',
          'Partage par lien public ou restreint à l\'organisation',
        ],
        angle: 'Alternative légère aux présentations PowerPoint statiques pour contenus web/newsletters',
      },
      {
        name: 'Clipchamp', icon: '🎥', avail: 'all',
        note: 'Inclus M365 Business/Enterprise — édition vidéo IA dans le navigateur',
        details: [
          'Text-to-speech IA : voix naturelles en 140+ langues',
          'Suppression fond d\'écran, sous-titres auto, templates pro',
          'Bibliothèque stock : vidéos, musiques, effets libres de droits',
        ],
        angle: 'Pitch com/marketing : équipes créent des vidéos corporate sans agence — déjà inclus',
      },
      {
        name: 'Places', icon: '📍', avail: 'e3',
        note: 'M365 E3/E5 — gestion hybride des espaces de travail',
        details: [
          'Workplace analytics : présence bureau, taux d\'occupation par zone',
          'Hot-desking : réservation de bureaux flexibles depuis Teams/Outlook',
          'Building Insights : recommandations sur l\'optimisation des espaces',
        ],
        angle: 'Argument post-Covid : organisations hybrides réduisent leur surface de bureau de 20-30% avec Places',
      },
      {
        name: 'Designer', icon: '🎨', avail: 'addon',
        note: 'Inclus avec M365 Copilot — génération graphique IA',
        details: [
          'Génération d\'images IA (DALL-E) depuis l\'écosystème M365',
          'Templates sociaux : posts LinkedIn/Instagram/email depuis Word/PPT',
          'Brand kit : intégration des couleurs et polices de l\'entreprise',
        ],
        angle: 'Argument Copilot : Designer renforce le ROI de la licence $30/m — créations visuelles sans graphiste',
      },
    ],
  },
];
