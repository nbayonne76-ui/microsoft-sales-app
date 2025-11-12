/**
 * Microsoft 365 Collaboration Tools - Comprehensive Database
 * Based on M365 Maps (https://m365maps.com/matrix.htm)
 *
 * This is a complete catalog of Microsoft 365 collaboration and productivity tools
 * with licensing details, use cases, and integration information.
 */

export const m365CollaborationTools = {
  // ============================================================================
  // CORE COLLABORATION TOOLS
  // ============================================================================

  collaboration: {
    "microsoft-teams": {
      id: "microsoft-teams",
      name: "Microsoft Teams",
      category: "collaboration",
      icon: "💬",
      shortDescription: "Hub de collaboration et communication d'équipe",
      detailedDescription: "Plateforme unifiée combinant chat, visioconférence, appels, partage de fichiers et intégration d'applications pour la collaboration moderne.",

      features: [
        "Chat individuel et de groupe",
        "Réunions vidéo jusqu'à 1000 participants",
        "Partage d'écran et co-édition en temps réel",
        "Canaux d'équipe organisés par projet",
        "Intégration avec 1000+ applications",
        "Enregistrement de réunions avec transcription",
        "Salles de sous-groupes (breakout rooms)",
        "Mode Ensemble et arrière-plans personnalisés"
      ],

      businessValue: [
        "Réduction de 50% des emails internes",
        "Économie de 4h/semaine par employé en réunions optimisées",
        "Collaboration en temps réel de n'importe où",
        "Centralisation de toutes les communications"
      ],

      useCases: [
        "Travail hybride et télétravail",
        "Gestion de projets collaboratifs",
        "Réunions virtuelles et webinaires",
        "Support client en interne",
        "Communication d'équipe quotidienne"
      ],

      licensing: {
        "Microsoft 365 Business Basic": "✓ Inclus",
        "Microsoft 365 Business Standard": "✓ Inclus",
        "Microsoft 365 Business Premium": "✓ Inclus",
        "Microsoft 365 E3": "✓ Inclus",
        "Microsoft 365 E5": "✓ Inclus + fonctionnalités avancées",
        "Microsoft 365 F3": "✓ Inclus (fonctionnalités limitées)"
      },

      pricing: "Inclus dans tous les plans M365 (à partir de 4.20€/utilisateur/mois)",
      implementation: "1-2 semaines",
      targetAudience: ["Tous les employés", "Équipes projet", "Direction"],
      competitors: ["Slack", "Zoom", "Google Meet"],

      integrations: [
        "SharePoint Online",
        "OneDrive for Business",
        "Microsoft 365 apps",
        "Power Platform",
        "Dynamics 365",
        "Applications tierces via connecteurs"
      ]
    },

    "teams-premium": {
      id: "teams-premium",
      name: "Microsoft Teams Premium",
      category: "collaboration",
      icon: "💎",
      shortDescription: "Fonctionnalités Teams avancées pour réunions intelligentes",
      detailedDescription: "Extension premium de Teams ajoutant IA, personnalisation avancée et fonctionnalités d'entreprise pour les réunions et webinaires.",

      features: [
        "Résumés de réunion automatiques par IA",
        "Chapitres intelligents et points d'action",
        "Marque personnalisée pour les réunions",
        "Salles d'attente personnalisées",
        "Webinaires interactifs avancés",
        "Traduction en temps réel (40+ langues)",
        "Protection avancée contre les fuites de données",
        "Rapports détaillés sur l'engagement"
      ],

      businessValue: [
        "Gain de 30 min par réunion grâce aux résumés IA",
        "Amélioration de 40% de la rétention d'informations",
        "Image de marque professionnelle renforcée",
        "Conformité et sécurité enterprise"
      ],

      licensing: {
        "Add-on": "7€/utilisateur/mois (nécessite Teams de base)"
      },

      pricing: "7€/utilisateur/mois (module complémentaire)",
      targetAudience: ["Direction", "Équipes commerciales", "Customer Success"],
      competitors: ["Zoom Webinars", "Webex Premium"]
    },

    "sharepoint-online": {
      id: "sharepoint-online",
      name: "SharePoint Online",
      category: "collaboration",
      icon: "📁",
      shortDescription: "Plateforme de gestion de contenu et intranet",
      detailedDescription: "Solution de gestion documentaire, sites d'équipe et intranet avec workflows, recherche intelligente et sécurité avancée.",

      features: [
        "Sites d'équipe et de communication",
        "Bibliothèques de documents avec versioning",
        "Listes et bases de données personnalisées",
        "Workflows automatisés (Power Automate)",
        "Recherche intelligente avec IA",
        "Métadonnées et taxonomie",
        "Pages modernes et web parts",
        "Intégration Microsoft 365"
      ],

      businessValue: [
        "Centralisation de 100% des documents d'entreprise",
        "Réduction de 60% du temps de recherche de documents",
        "Collaboration documentaire en temps réel",
        "Conformité et gouvernance des données"
      ],

      useCases: [
        "Intranet d'entreprise",
        "Gestion documentaire centralisée",
        "Sites de projets collaboratifs",
        "Base de connaissances",
        "Portails clients/partenaires"
      ],

      licensing: {
        "SharePoint Online Plan 1": "Standalone 4.20€/utilisateur/mois",
        "SharePoint Online Plan 2": "Standalone 8.40€/utilisateur/mois",
        "Microsoft 365 Business": "✓ Inclus",
        "Microsoft 365 E3/E5": "✓ Inclus",
        "Microsoft 365 F3": "✓ Inclus (limité)"
      },

      storage: "1 To + 10 Go par utilisateur sous licence",
      implementation: "2-6 semaines selon complexité",
      targetAudience: ["DSI", "Équipes IT", "Tous les employés"],
      competitors: ["Google Drive", "Box", "Dropbox Business"]
    },

    "onedrive-business": {
      id: "onedrive-business",
      name: "OneDrive for Business",
      category: "collaboration",
      icon: "☁️",
      shortDescription: "Stockage cloud personnel et partage de fichiers",
      detailedDescription: "Espace de stockage cloud sécurisé pour chaque utilisateur avec synchronisation multi-appareils et partage collaboratif.",

      features: [
        "1 To de stockage par utilisateur (extensible)",
        "Synchronisation automatique multi-appareils",
        "Partage sécurisé avec permissions granulaires",
        "Co-édition en temps réel (Office)",
        "Récupération de fichiers supprimés (93 jours)",
        "Versioning et historique des modifications",
        "Protection contre ransomware",
        "Accès hors ligne"
      ],

      businessValue: [
        "Accès aux fichiers de n'importe où, n'importe quand",
        "Élimination des conflits de versions",
        "Protection contre la perte de données",
        "Réduction des coûts de serveurs de fichiers"
      ],

      licensing: {
        "OneDrive for Business Plan 1": "Standalone 4.20€/utilisateur/mois",
        "OneDrive for Business Plan 2": "Standalone 8.40€/utilisateur/mois (stockage illimité)",
        "Microsoft 365 Business": "✓ Inclus (1 To)",
        "Microsoft 365 E3/E5": "✓ Inclus (1 To+)",
        "Microsoft 365 F3": "✓ Inclus (2 Go)"
      },

      implementation: "1-2 semaines",
      targetAudience: ["Tous les employés"],
      competitors: ["Google Drive", "Dropbox", "Box"]
    },

    "exchange-online": {
      id: "exchange-online",
      name: "Exchange Online",
      category: "collaboration",
      icon: "📧",
      shortDescription: "Messagerie professionnelle hébergée dans le cloud",
      detailedDescription: "Service de messagerie, calendrier et contacts hébergé dans le cloud avec protection anti-spam avancée et boîtes aux lettres de 50-100 Go.",

      features: [
        "Boîtes aux lettres 50-100 Go selon plan",
        "Protection anti-spam et anti-malware",
        "Calendrier partagé et réservation de salles",
        "Contacts d'entreprise unifiés",
        "Archivage et eDiscovery",
        "Politique de rétention",
        "Accès Outlook (Windows, Mac, Web, Mobile)",
        "Disponibilité 99.9% garantie"
      ],

      businessValue: [
        "Élimination des serveurs Exchange on-premises",
        "Sécurité email enterprise avec ATP",
        "Mobilité totale (accès partout)",
        "Conformité réglementaire facilitée"
      ],

      licensing: {
        "Exchange Online Plan 1": "Standalone 3.40€/utilisateur/mois (boîte 50 Go)",
        "Exchange Online Plan 2": "Standalone 6.70€/utilisateur/mois (boîte 100 Go)",
        "Microsoft 365 Business": "✓ Inclus (Plan 1)",
        "Microsoft 365 E3": "✓ Inclus (Plan 2)",
        "Microsoft 365 E5": "✓ Inclus (Plan 2 + avancé)",
        "Microsoft 365 F3": "✓ Inclus (boîte 2 Go)"
      },

      implementation: "1-4 semaines (migration incluse)",
      targetAudience: ["Tous les employés", "DSI"],
      competitors: ["Gmail Business", "Zoho Mail"]
    },

    "outlook": {
      id: "outlook",
      name: "Microsoft Outlook",
      category: "collaboration",
      icon: "📨",
      shortDescription: "Client de messagerie et gestion du temps",
      detailedDescription: "Application de gestion d'emails, calendrier, contacts et tâches avec fonctionnalités avancées de productivité.",

      features: [
        "Boîte de réception prioritaire (Focused Inbox)",
        "Règles et filtres automatiques",
        "Calendrier intelligent avec suggestions",
        "Intégration Teams pour réunions",
        "Add-ins et connecteurs",
        "Recherche avancée",
        "Signature électronique",
        "Mode sombre et personnalisation"
      ],

      licensing: {
        "Microsoft 365 Apps": "✓ Inclus",
        "Microsoft 365 Business/E3/E5": "✓ Inclus"
      },

      platforms: ["Windows", "Mac", "Web", "iOS", "Android"],
      targetAudience: ["Tous les employés"]
    }
  },

  // ============================================================================
  // MICROSOFT VIVA SUITE - Employee Experience
  // ============================================================================

  viva: {
    "viva-engage": {
      id: "viva-engage",
      name: "Viva Engage (Yammer)",
      category: "viva",
      icon: "🎯",
      shortDescription: "Réseau social d'entreprise et communautés",
      detailedDescription: "Plateforme de communication d'entreprise permettant de créer des communautés, partager des connaissances et renforcer la culture d'entreprise.",

      features: [
        "Communautés d'intérêt et de pratique",
        "Fil d'actualités d'entreprise",
        "Événements et livestreams",
        "Questions-réponses (Q&A)",
        "Reconnaissance entre pairs",
        "Sondages et feedback",
        "Intégration Teams native",
        "Analytics d'engagement"
      ],

      businessValue: [
        "Renforcement de 35% de l'engagement employé",
        "Partage de connaissances accéléré",
        "Culture d'entreprise unifiée",
        "Visibilité leadership et communications"
      ],

      useCases: [
        "Communautés de pratique",
        "Communications RH et direction",
        "Innovation participative (crowdsourcing)",
        "Onboarding nouveaux employés",
        "Événements d'entreprise virtuels"
      ],

      licensing: {
        "Microsoft 365 E3/E5": "✓ Inclus (Viva Engage Core)",
        "Viva Suite": "✓ Inclus (fonctionnalités complètes)",
        "Standalone": "Disponible en add-on"
      },

      implementation: "2-4 semaines",
      targetAudience: ["RH", "Communications internes", "Tous les employés"],
      competitors: ["Workplace by Meta", "Slack Communities"]
    },

    "viva-connections": {
      id: "viva-connections",
      name: "Viva Connections",
      category: "viva",
      icon: "🏢",
      shortDescription: "Portail intranet personnalisé et expérience employé",
      detailedDescription: "Expérience intranet moderne personnalisée accessible via Teams, web et mobile pour connecter les employés aux informations et outils.",

      features: [
        "Tableau de bord personnalisé par rôle",
        "Fil d'actualités intelligent",
        "Ressources et liens rapides",
        "Intégration SharePoint",
        "Cartes adaptatives pour workflows",
        "Accessibilité mobile native",
        "Recherche unifiée Microsoft 365",
        "Multi-langue"
      ],

      businessValue: [
        "Point d'entrée unique pour tous les employés",
        "Productivité accrue avec accès rapide aux outils",
        "Communications ciblées par département/rôle",
        "Engagement mobile pour frontline workers"
      ],

      licensing: {
        "Microsoft 365 E3/E5/F3": "✓ Inclus",
        "Viva Suite": "✓ Inclus"
      },

      implementation: "3-6 semaines",
      targetAudience: ["RH", "Communications", "IT"],
      competitors: ["LumApps", "Simpplr"]
    },

    "viva-insights": {
      id: "viva-insights",
      name: "Viva Insights",
      category: "viva",
      icon: "📊",
      shortDescription: "Analytics bien-être et productivité personnels",
      detailedDescription: "Informations sur les habitudes de travail, le bien-être et la productivité avec recommandations personnalisées et analytics organisationnels.",

      features: [
        "Tableau de bord personnel de productivité",
        "Statistiques temps de réunion/focus",
        "Recommandations de bien-être",
        "Protection du temps de concentration",
        "Analytics manager (tendances équipe)",
        "Insights organisation (leaders uniquement)",
        "Plans de déconnexion et pauses",
        "Intégration Headspace pour méditation"
      ],

      businessValue: [
        "Réduction de 25% du temps en réunions inefficaces",
        "Amélioration de l'équilibre vie pro/perso",
        "Détection précoce du burnout",
        "Optimisation de la collaboration"
      ],

      licensing: {
        "Microsoft 365 E3/E5": "✓ Inclus (Personal insights)",
        "Viva Insights": "5.25€/utilisateur/mois (Manager + Organization insights)",
        "Viva Suite": "✓ Inclus (complet)"
      },

      targetAudience: ["Tous les employés", "Managers", "RH"],
      competitors: ["Clockwise", "RescueTime", "Time Doctor"]
    },

    "viva-learning": {
      id: "viva-learning",
      name: "Viva Learning",
      category: "viva",
      icon: "🎓",
      shortDescription: "Hub d'apprentissage centralisé dans Teams",
      detailedDescription: "Plateforme d'apprentissage intégrée à Teams agrégeant contenus de multiples sources (LinkedIn Learning, interne, tiers).",

      features: [
        "Catalogue unifié de formations",
        "Intégration LinkedIn Learning",
        "Contenus SharePoint et internes",
        "Recommandations personnalisées par IA",
        "Parcours d'apprentissage (learning paths)",
        "Assignation de formations par managers",
        "Tracking et certifications",
        "Apprentissage social et partage"
      ],

      businessValue: [
        "Centralisation de 100% des ressources de formation",
        "Augmentation de 40% de l'engagement formation",
        "Upskilling continu des employés",
        "Réduction des coûts de formation externe"
      ],

      licensing: {
        "Microsoft 365 E3/E5/F3": "✓ Inclus (version de base)",
        "Viva Learning": "3.50€/utilisateur/mois (fonctionnalités premium)",
        "Viva Suite": "✓ Inclus"
      },

      integrations: ["LinkedIn Learning", "Coursera", "Pluralsight", "SAP SuccessFactors", "Cornerstone"],
      targetAudience: ["RH", "L&D", "Tous les employés"],
      competitors: ["Degreed", "EdCast", "Docebo"]
    },

    "viva-goals": {
      id: "viva-goals",
      name: "Viva Goals",
      category: "viva",
      icon: "🎯",
      shortDescription: "Gestion des objectifs et alignement OKRs",
      detailedDescription: "Solution de gestion des objectifs (OKRs) pour aligner les équipes, suivre la progression et célébrer les succès.",

      features: [
        "Création et cascade d'OKRs",
        "Tableaux de bord temps réel",
        "Intégrations automatiques (Azure DevOps, Jira, Salesforce)",
        "Check-ins réguliers et updates",
        "Visualisations de progression",
        "Célébration des succès",
        "Reviews et rétrospectives",
        "Analytics et reporting"
      ],

      businessValue: [
        "Alignement stratégique de 100% des équipes",
        "Visibilité en temps réel sur la progression",
        "Augmentation de 30% de l'atteinte des objectifs",
        "Culture de résultats renforcée"
      ],

      licensing: {
        "Viva Goals": "8.75€/utilisateur/mois",
        "Viva Suite": "✓ Inclus"
      },

      targetAudience: ["Direction", "Managers", "Chefs de projet"],
      competitors: ["Lattice", "15Five", "Betterworks", "Ally.io"]
    },

    "viva-amplify": {
      id: "viva-amplify",
      name: "Viva Amplify",
      category: "viva",
      icon: "📣",
      shortDescription: "Gestion et amplification des communications d'entreprise",
      detailedDescription: "Centralisation de la création, gestion et distribution des communications internes sur tous les canaux Microsoft 365.",

      features: [
        "Création de campagnes de communication",
        "Distribution multi-canal (Teams, Outlook, SharePoint, Viva Engage)",
        "Templates et branding",
        "Planification et calendrier éditorial",
        "Analytics d'impact et engagement",
        "Gestion de workflows d'approbation",
        "Ciblage d'audience",
        "Bibliothèque de contenus"
      ],

      businessValue: [
        "Portée de 95%+ des communications critiques",
        "Gain de 70% de temps de création de contenu",
        "Cohérence des messages d'entreprise",
        "Mesure de l'impact réel des communications"
      ],

      licensing: {
        "Viva Suite": "✓ Inclus",
        "Standalone": "En cours de disponibilité"
      },

      targetAudience: ["Communications internes", "RH", "Direction"],
      competitors: ["Staffbase", "ContactMonkey", "Cerkl"]
    }
  },

  // ============================================================================
  // PRODUCTIVITY & OFFICE APPS
  // ============================================================================

  office: {
    "microsoft-365-apps": {
      id: "microsoft-365-apps",
      name: "Microsoft 365 Apps (Office)",
      category: "office",
      icon: "📄",
      shortDescription: "Suite Office complète (Word, Excel, PowerPoint, etc.)",
      detailedDescription: "Applications bureautiques complètes avec co-édition, cloud et fonctionnalités IA (Copilot disponible).",

      apps: ["Word", "Excel", "PowerPoint", "OneNote", "Access (PC)", "Publisher (PC)", "Outlook"],

      features: [
        "Toujours la dernière version",
        "Installation sur 5 PC/Mac + 5 tablettes + 5 mobiles",
        "1 To OneDrive par utilisateur",
        "Co-édition en temps réel",
        "Fonctionnalités IA (Designer, Editor)",
        "Versions web et mobile",
        "Accès hors ligne",
        "Support premium"
      ],

      licensing: {
        "Microsoft 365 Apps for Business": "10.50€/utilisateur/mois",
        "Microsoft 365 Apps for Enterprise": "10.50€/utilisateur/mois",
        "Microsoft 365 Business Standard": "✓ Inclus",
        "Microsoft 365 E3/E5": "✓ Inclus"
      },

      targetAudience: ["Tous les employés"],
      competitors: ["Google Workspace", "LibreOffice", "WPS Office"]
    },

    "loop": {
      id: "loop",
      name: "Microsoft Loop",
      category: "office",
      icon: "∞",
      shortDescription: "Espaces de travail collaboratifs flexibles",
      detailedDescription: "Nouvelle façon de collaborer avec des composants modulaires et espaces de travail partageables en temps réel.",

      features: [
        "Composants Loop (partagés partout)",
        "Espaces de travail (workspaces)",
        "Pages collaboratives flexibles",
        "Synchronisation temps réel",
        "Intégration Teams, Outlook, OneNote",
        "Templates personnalisables",
        "Mentions et tâches",
        "Recherche intelligente"
      ],

      businessValue: [
        "Collaboration fluide entre applications",
        "Réduction de la fragmentation d'information",
        "Productivité accrue avec composants réutilisables",
        "Agilité dans la gestion de projets"
      ],

      licensing: {
        "Microsoft 365 Business/E3/E5": "✓ Inclus (actuellement en déploiement)",
        "Microsoft 365 F3": "✓ Inclus (limité)"
      },

      status: "En déploiement progressif",
      targetAudience: ["Équipes projet", "Tous les employés"],
      competitors: ["Notion", "Coda"]
    },

    "onenote": {
      id: "onenote",
      name: "Microsoft OneNote",
      category: "office",
      icon: "📓",
      shortDescription: "Bloc-notes numérique collaboratif",
      detailedDescription: "Application de prise de notes avec organisation par sections, tags, recherche et collaboration en temps réel.",

      features: [
        "Organisation par blocs-notes, sections, pages",
        "Entrée texte, stylet, audio, images",
        "Tags et recherche intelligente",
        "Collaboration temps réel",
        "Synchronisation multi-appareils",
        "Capture web (Clipper)",
        "Mathématiques et équations",
        "Intégration Outlook, Teams"
      ],

      licensing: {
        "Gratuit": "Version de base",
        "Microsoft 365": "✓ Inclus (toutes versions premium)"
      },

      platforms: ["Windows", "Mac", "Web", "iOS", "Android"],
      targetAudience: ["Étudiants", "Professionnels", "Équipes"]
    }
  },

  // ============================================================================
  // PLANNING & PROJECT MANAGEMENT
  // ============================================================================

  planning: {
    "planner": {
      id: "planner",
      name: "Microsoft Planner",
      category: "planning",
      icon: "📋",
      shortDescription: "Gestion de tâches et projets simples",
      detailedDescription: "Outil visuel de gestion de tâches avec tableaux Kanban, assignments et intégration Teams.",

      features: [
        "Tableaux de type Kanban",
        "Attribution de tâches",
        "Dates d'échéance et priorités",
        "Pièces jointes et checklists",
        "Vues: tableau, graphique, planning",
        "Intégration Teams (onglet Planner)",
        "Notifications et rappels",
        "Exportation Excel"
      ],

      businessValue: [
        "Visibilité totale sur les tâches d'équipe",
        "Simplicité d'utilisation sans formation",
        "Collaboration transparente",
        "Intégration native Microsoft 365"
      ],

      useCases: [
        "Gestion de projets simples",
        "Suivi de tâches d'équipe",
        "Organisation d'événements",
        "Workflows marketing"
      ],

      licensing: {
        "Microsoft 365 Business/E3/E5/F3": "✓ Inclus"
      },

      implementation: "Immédiat",
      targetAudience: ["Équipes projet", "Managers"],
      competitors: ["Trello", "Asana", "Monday.com"]
    },

    "project": {
      id: "project",
      name: "Microsoft Project",
      category: "planning",
      icon: "📊",
      shortDescription: "Gestion de projets enterprise avec Gantt",
      detailedDescription: "Solution professionnelle de gestion de projets avec diagrammes de Gantt, gestion des ressources et portefeuilles.",

      plans: {
        "Project Plan 1": {
          price: "8.40€/utilisateur/mois",
          features: ["Grilles et tableaux", "Gestion de tâches", "Collaboration Teams", "Pas de Gantt"]
        },
        "Project Plan 3": {
          price: "25.20€/utilisateur/mois",
          features: ["Diagrammes de Gantt", "Gestion des ressources", "Feuilles de temps", "Rapports avancés", "Intégration Power BI"]
        },
        "Project Plan 5": {
          price: "44.80€/utilisateur/mois",
          features: ["Gestion de portefeuille", "Gouvernance projet", "Optimisation ressources", "Scenarios what-if"]
        }
      },

      businessValue: [
        "Visibilité complète sur les projets complexes",
        "Optimisation de l'utilisation des ressources",
        "Réduction de 30% des dépassements de budget",
        "Reporting exécutif en temps réel"
      ],

      targetAudience: ["PMO", "Chefs de projet", "Direction"],
      competitors: ["Smartsheet", "Wrike", "Jira"]
    },

    "tasks": {
      id: "tasks",
      name: "Microsoft To Do / Tasks",
      category: "planning",
      icon: "✓",
      shortDescription: "Gestion de tâches personnelles et listes",
      detailedDescription: "Application de gestion de tâches personnelles avec listes, rappels et synchronisation.",

      features: [
        "Ma journée (My Day) avec suggestions IA",
        "Listes personnalisées",
        "Tâches récurrentes",
        "Rappels et échéances",
        "Pièces jointes",
        "Partage de listes",
        "Synchronisation Outlook Tasks",
        "Intégration Planner"
      ],

      licensing: {
        "Gratuit": "Version standalone",
        "Microsoft 365": "✓ Synchronisation complète"
      },

      platforms: ["Windows", "Mac", "Web", "iOS", "Android"],
      targetAudience: ["Tous les utilisateurs"],
      competitors: ["Todoist", "Any.do", "Things"]
    }
  },

  // ============================================================================
  // CONTENT CREATION & MEDIA
  // ============================================================================

  media: {
    "stream": {
      id: "stream",
      name: "Microsoft Stream",
      category: "media",
      icon: "🎥",
      shortDescription: "Plateforme vidéo d'entreprise",
      detailedDescription: "Service de streaming vidéo d'entreprise avec transcription automatique, recherche intelligente et sécurité.",

      features: [
        "Upload et streaming de vidéos",
        "Transcription automatique avec IA",
        "Sous-titres multi-langues",
        "Recherche dans les transcriptions",
        "Chaînes et permissions",
        "Analytics de visionnage",
        "Intégration Teams et SharePoint",
        "Enregistrements Teams automatiques"
      ],

      businessValue: [
        "Bibliothèque vidéo d'entreprise centralisée",
        "Accessibilité avec sous-titres automatiques",
        "Formation et onboarding à l'échelle",
        "Communication vidéo asynchrone"
      ],

      licensing: {
        "Microsoft 365 E3/E5": "✓ Inclus",
        "Microsoft 365 F3": "✓ Inclus (consommation uniquement)"
      },

      storage: "10 Go + 0.5 Go par utilisateur sous licence",
      targetAudience: ["Communications", "Formation", "Tous les employés"],
      competitors: ["Vimeo Business", "Wistia", "Panopto"]
    },

    "whiteboard": {
      id: "whiteboard",
      name: "Microsoft Whiteboard",
      category: "media",
      icon: "🖍️",
      shortDescription: "Tableau blanc collaboratif numérique",
      detailedDescription: "Espace de brainstorming et collaboration visuelle en temps réel avec stylet, sticky notes et templates.",

      features: [
        "Canevas infini",
        "Sticky notes et formes",
        "Dessins au stylet ou souris",
        "Templates (brainstorming, sprint planning, etc.)",
        "Images et fichiers",
        "Collaboration temps réel",
        "Intégration Teams (pendant réunions)",
        "Export en image/PDF"
      ],

      useCases: [
        "Brainstorming d'équipe",
        "Sprint planning (Agile)",
        "Design thinking workshops",
        "Sessions de formation interactives",
        "Réunions créatives"
      ],

      licensing: {
        "Microsoft 365 Business/E3/E5": "✓ Inclus"
      },

      platforms: ["Windows", "iOS", "Web", "Surface Hub"],
      targetAudience: ["Équipes créatives", "Facilitateurs", "Formateurs"],
      competitors: ["Miro", "Mural", "FigJam"]
    },

    "sway": {
      id: "sway",
      name: "Microsoft Sway",
      category: "media",
      icon: "📰",
      shortDescription: "Création de présentations et newsletters interactives",
      detailedDescription: "Outil de création de contenus web interactifs et responsive (présentations, newsletters, rapports).",

      features: [
        "Templates professionnels",
        "Design responsive automatique",
        "Intégration médias (YouTube, Twitter, etc.)",
        "Animations et transitions fluides",
        "Pas de compétences design requises",
        "Partage public ou privé",
        "Analytics de lecture",
        "Accessibilité intégrée"
      ],

      useCases: [
        "Newsletters d'entreprise",
        "Rapports interactifs",
        "Portfolios projets",
        "Présentations commerciales",
        "Contenus formation"
      ],

      licensing: {
        "Gratuit": "Version de base",
        "Microsoft 365": "✓ Inclus (version complète)"
      },

      targetAudience: ["Marketing", "Communications", "Formateurs"],
      competitors: ["Canva", "Prezi", "Beautiful.ai"]
    },

    "forms": {
      id: "forms",
      name: "Microsoft Forms",
      category: "media",
      icon: "📝",
      shortDescription: "Création de sondages, quiz et formulaires",
      detailedDescription: "Outil de création rapide de formulaires, sondages et quiz avec analytics et intégration données.",

      features: [
        "Formulaires et sondages",
        "Quiz avec notation automatique",
        "Logique de branchement",
        "Thèmes personnalisables",
        "Réponses anonymes ou authentifiées",
        "Analytics temps réel",
        "Export Excel et Power BI",
        "Intégration Power Automate"
      ],

      useCases: [
        "Sondages d'engagement employé",
        "Feedback événements",
        "Quiz de formation",
        "Formulaires d'inscription",
        "Collecte de données"
      ],

      licensing: {
        "Gratuit": "Version de base (200 réponses/formulaire)",
        "Microsoft 365": "✓ Illimité + fonctionnalités pro"
      },

      targetAudience: ["RH", "Formateurs", "Managers", "Marketing"],
      competitors: ["Google Forms", "SurveyMonkey", "Typeform"]
    },

    "bookings": {
      id: "bookings",
      name: "Microsoft Bookings",
      category: "media",
      icon: "📅",
      shortDescription: "Prise de rendez-vous et planification en ligne",
      detailedDescription: "Solution de prise de rendez-vous en ligne avec page de réservation personnalisée et synchronisation calendrier.",

      features: [
        "Page de réservation personnalisée",
        "Disponibilités automatiques",
        "Réservations par clients/employés",
        "Notifications et rappels automatiques",
        "Intégration Teams (réunions virtuelles)",
        "Paiements en ligne (intégration)",
        "Reporting et analytics",
        "Application mobile"
      ],

      useCases: [
        "Réservation rendez-vous clients",
        "Sessions de conseil/coaching",
        "Réservation de salles/ressources",
        "RDV IT support",
        "Consultations RH"
      ],

      licensing: {
        "Microsoft 365 Business Standard/Premium": "✓ Inclus",
        "Microsoft 365 E3/E5": "✓ Inclus",
        "Microsoft 365 A3/A5": "✓ Inclus"
      },

      targetAudience: ["Services clients", "RH", "IT Support", "Consultants"],
      competitors: ["Calendly", "Acuity Scheduling", "SimplyBook.me"]
    }
  }
};

// ============================================================================
// LICENSING PLANS COMPARISON - COMPLET
// ============================================================================

export const licensingPlans = {
  // ========== BUSINESS PLANS (PME jusqu'à 300 utilisateurs) ==========
  business: {
    "Microsoft 365 Business Basic": {
      id: "business-basic",
      price: "4.20€/utilisateur/mois",
      priceAnnual: "50.40€/utilisateur/an",
      maxUsers: 300,
      target: "PME - Collaboration cloud sans Office Desktop",
      color: "blue",
      officialUrl: "https://www.microsoft.com/en-us/microsoft-365/business/microsoft-365-business-basic",

      officeApps: {
        desktop: "❌ Non inclus",
        web: "✅ Word, Excel, PowerPoint, Outlook (web uniquement)",
        mobile: "✅ Applications mobiles complètes"
      },

      services: {
        exchange: "✅ Exchange Online - Boîte mail 50 Go",
        onedrive: "✅ OneDrive - 1 To de stockage",
        sharepoint: "✅ SharePoint Online",
        teams: "✅ Microsoft Teams (complet)",
        yammer: "✅ Viva Engage (Yammer)",
        stream: "✅ Microsoft Stream",
        sway: "✅ Microsoft Sway",
        forms: "✅ Microsoft Forms",
        planner: "✅ Microsoft Planner",
        bookings: "❌ Microsoft Bookings",
        vivaConnections: "✅ Viva Connections (basic)"
      },

      security: {
        mfa: "✅ Authentification multi-facteurs",
        conditionalAccess: "❌ Accès conditionnel",
        dlp: "❌ Data Loss Prevention",
        defender: "❌ Microsoft Defender",
        intune: "❌ Intune MDM/MAM",
        informationProtection: "❌ Azure Information Protection"
      },

      limits: {
        mailboxSize: "50 Go",
        oneDriveStorage: "1 To par utilisateur",
        maxFileSize: "100 Go (Teams)",
        maxMeetingDuration: "24 heures",
        maxMeetingParticipants: "300 participants"
      },

      bestFor: [
        "Entreprises voulant collaboration cloud uniquement",
        "Utilisateurs avec Office déjà installé (autre licence)",
        "Budget serré avec besoins basiques",
        "Équipes mobiles ou web-first"
      ]
    },

    "Microsoft 365 Business Standard": {
      id: "business-standard",
      price: "10.50€/utilisateur/mois",
      priceAnnual: "126€/utilisateur/an",
      maxUsers: 300,
      target: "PME - Solution complète avec Office Desktop",
      color: "green",
      officialUrl: "https://www.microsoft.com/en-US/microsoft-365/business/microsoft-365-business-standard",

      officeApps: {
        desktop: "✅ Office Desktop complet (Word, Excel, PowerPoint, Outlook, OneNote, Access, Publisher)",
        installations: "✅ 5 PC/Mac + 5 tablettes + 5 mobiles par utilisateur",
        web: "✅ Office Web Apps",
        mobile: "✅ Applications mobiles complètes"
      },

      services: {
        exchange: "✅ Exchange Online - Boîte mail 50 Go",
        onedrive: "✅ OneDrive - 1 To de stockage",
        sharepoint: "✅ SharePoint Online",
        teams: "✅ Microsoft Teams (complet)",
        yammer: "✅ Viva Engage (Yammer)",
        stream: "✅ Microsoft Stream",
        sway: "✅ Microsoft Sway",
        forms: "✅ Microsoft Forms",
        planner: "✅ Microsoft Planner",
        bookings: "✅ Microsoft Bookings",
        lists: "✅ Microsoft Lists",
        vivaConnections: "✅ Viva Connections"
      },

      security: {
        mfa: "✅ Authentification multi-facteurs",
        conditionalAccess: "❌ Accès conditionnel",
        dlp: "❌ Data Loss Prevention",
        defender: "❌ Microsoft Defender",
        intune: "❌ Intune MDM/MAM",
        informationProtection: "❌ Azure Information Protection"
      },

      limits: {
        mailboxSize: "50 Go",
        oneDriveStorage: "1 To par utilisateur",
        maxFileSize: "100 Go (Teams)",
        archiveMailbox: "50 Go In-Place Archive"
      },

      bestFor: [
        "PME ayant besoin d'Office Desktop complet",
        "Entreprises sans infrastructure IT lourde",
        "Besoins de collaboration + productivité",
        "Migration depuis Office 2016/2019 perpetual"
      ]
    },

    "Microsoft 365 Business Premium": {
      id: "business-premium",
      price: "18.60€/utilisateur/mois",
      priceAnnual: "223.20€/utilisateur/an",
      maxUsers: 300,
      target: "PME - Sécurité avancée et gestion des appareils",
      color: "purple",
      officialUrl: "https://www.microsoft.com/en-us/security/business/microsoft365-business-premium",

      officeApps: {
        desktop: "✅ Office Desktop complet",
        installations: "✅ 5 PC/Mac + 5 tablettes + 5 mobiles",
        web: "✅ Office Web Apps",
        mobile: "✅ Applications mobiles complètes"
      },

      services: {
        exchange: "✅ Exchange Online Plan 1 - 50 Go",
        onedrive: "✅ OneDrive - 1 To",
        sharepoint: "✅ SharePoint Online",
        teams: "✅ Microsoft Teams (complet)",
        yammer: "✅ Viva Engage",
        allStandardApps: "✅ Toutes les apps Business Standard",
        windowsEnterprise: "✅ Windows 10/11 Enterprise E3"
      },

      security: {
        mfa: "✅ Authentification multi-facteurs",
        conditionalAccess: "✅ Accès conditionnel (Azure AD P1)",
        dlp: "✅ Data Loss Prevention",
        defender: "✅ Microsoft Defender for Business",
        defenderEndpoint: "✅ Defender for Endpoint P1",
        defenderOffice: "✅ Defender for Office 365 P1",
        intune: "✅ Microsoft Intune (MDM/MAM complet)",
        informationProtection: "✅ Azure Information Protection P1",
        azureAD: "✅ Azure AD Premium P1",
        attackSimulator: "✅ Attack Simulation Training",
        autoLabeling: "❌ Auto-labeling (nécessite E5)"
      },

      compliance: {
        dlp: "✅ DLP pour Exchange, SharePoint, OneDrive, Teams",
        retention: "✅ Politiques de rétention",
        litigation: "❌ Litigation Hold (nécessite E3)",
        eDiscovery: "❌ eDiscovery avancé (nécessite E5)"
      },

      limits: {
        mailboxSize: "50 Go",
        oneDriveStorage: "1 To",
        archiveMailbox: "50 Go In-Place Archive"
      },

      bestFor: [
        "PME avec besoins de sécurité renforcés",
        "Conformité RGPD/ISO 27001",
        "Gestion d'appareils mobiles (BYOD)",
        "Protection contre cybermenaces",
        "Secteurs réglementés (santé, finance, légal)"
      ]
    }
  },

  // ========== ENTERPRISE PLANS (Grandes entreprises) ==========
  enterprise: {
    "Office 365 E1": {
      id: "office-365-e1",
      price: "8.80€/utilisateur/mois",
      priceAnnual: "105.60€/utilisateur/an",
      maxUsers: "Illimité",
      target: "Enterprise - Services cloud sans Office Desktop",
      color: "cyan",
      officialUrl: "https://www.microsoft.com/en-us/microsoft-365/enterprise/office-365-e1",

      officeApps: {
        desktop: "❌ Non inclus",
        web: "✅ Office Web Apps (Word, Excel, PowerPoint, OneNote)",
        mobile: "✅ Applications mobiles"
      },

      services: {
        exchange: "✅ Exchange Online Plan 1 - Boîte mail 50 Go",
        onedrive: "✅ OneDrive - 1 To",
        sharepoint: "✅ SharePoint Online",
        teams: "✅ Microsoft Teams (complet)",
        yammer: "✅ Viva Engage",
        stream: "✅ Microsoft Stream",
        sway: "✅ Microsoft Sway",
        forms: "✅ Microsoft Forms",
        planner: "✅ Microsoft Planner",
        delve: "✅ Delve",
        myAnalytics: "✅ MyAnalytics (basic)"
      },

      security: {
        mfa: "✅ MFA",
        conditionalAccess: "❌ Nécessite Azure AD P1 séparé",
        dlp: "❌ DLP",
        defender: "❌ Defender",
        intune: "❌ Intune",
        informationProtection: "❌ AIP"
      },

      bestFor: [
        "Grandes entreprises cloud-only",
        "Utilisateurs avec Office Desktop existant",
        "Kiosques et postes partagés",
        "Budget contraint"
      ]
    },

    "Microsoft 365 E3": {
      id: "microsoft-365-e3",
      price: "31.20€/utilisateur/mois",
      priceAnnual: "374.40€/utilisateur/an",
      maxUsers: "Illimité",
      target: "Enterprise - Suite complète productivité + sécurité",
      color: "indigo",
      officialUrl: "https://www.microsoft.com/en-us/microsoft-365/enterprise/e3",

      officeApps: {
        desktop: "✅ Microsoft 365 Apps for Enterprise (Office complet)",
        installations: "✅ 5 PC/Mac + 5 tablettes + 5 mobiles",
        web: "✅ Office Web Apps",
        mobile: "✅ Applications mobiles complètes",
        access: "✅ Access, Publisher (PC uniquement)"
      },

      services: {
        exchange: "✅ Exchange Online Plan 2 - Boîte mail 100 Go",
        onedrive: "✅ OneDrive - Stockage illimité (>5 utilisateurs) sinon 1 To",
        sharepoint: "✅ SharePoint Online",
        teams: "✅ Microsoft Teams + Phone System",
        yammer: "✅ Viva Engage",
        stream: "✅ Microsoft Stream",
        planner: "✅ Microsoft Planner",
        project: "✅ Project for the web",
        bookings: "✅ Microsoft Bookings",
        myAnalytics: "✅ MyAnalytics",
        vivaInsights: "✅ Viva Insights (personal)",
        vivaConnections: "✅ Viva Connections",
        vivaEngage: "✅ Viva Engage premium",
        powerAutomate: "✅ Power Automate (2000 requêtes/utilisateur/jour)",
        powerApps: "✅ Power Apps (consommation limitée)"
      },

      windows: {
        license: "✅ Windows 11 Enterprise E3",
        virtualDesktop: "✅ Windows Virtual Desktop",
        universalPrint: "✅ Universal Print",
        autopatch: "✅ Windows Autopatch"
      },

      security: {
        azureAD: "✅ Azure AD Premium P1",
        mfa: "✅ MFA",
        conditionalAccess: "✅ Accès conditionnel",
        dlp: "✅ Data Loss Prevention",
        defender: "✅ Microsoft Defender for Office 365 P1",
        intune: "✅ Microsoft Intune (MDM/MAM)",
        informationProtection: "✅ Azure Information Protection P1",
        cloudAppSecurity: "❌ MCAS (nécessite E5)",
        defenderEndpoint: "❌ Defender for Endpoint (nécessite E5 ou add-on)"
      },

      compliance: {
        retention: "✅ Politiques de rétention avancées",
        litigationHold: "✅ Litigation Hold",
        archiveMailbox: "✅ Archive illimitée",
        eDiscovery: "✅ eDiscovery de base",
        advancedEDiscovery: "❌ Nécessite E5",
        auditBasic: "✅ Audit de base (90 jours)",
        advancedAudit: "❌ Nécessite E5"
      },

      limits: {
        mailboxSize: "100 Go",
        oneDriveStorage: "Illimité (>5 users) sinon 1 To",
        archiveMailbox: "Illimité avec auto-expanding",
        teamsFileStorage: "Illimité"
      },

      bestFor: [
        "Grandes entreprises standard",
        "Transformation digitale complète",
        "Besoins de sécurité et conformité modérés",
        "Migration depuis infrastructure on-premises",
        "Bon équilibre prix/fonctionnalités"
      ]
    },

    "Microsoft 365 E5": {
      id: "microsoft-365-e5",
      price: "51.00€/utilisateur/mois",
      priceAnnual: "612€/utilisateur/an",
      maxUsers: "Illimité",
      target: "Enterprise - Sécurité maximale, analytics et voix",
      color: "red",
      officialUrl: "https://www.microsoft.com/en-us/microsoft-365/enterprise/e5",

      officeApps: {
        desktop: "✅ Microsoft 365 Apps for Enterprise",
        installations: "✅ 5 PC/Mac + 5 tablettes + 5 mobiles",
        web: "✅ Office Web Apps",
        mobile: "✅ Applications mobiles complètes"
      },

      services: {
        exchange: "✅ Exchange Online Plan 2 - 100 Go",
        onedrive: "✅ OneDrive - Stockage illimité",
        sharepoint: "✅ SharePoint Online",
        teams: "✅ Teams + Phone System + Audio Conferencing + 60 min appels/mois",
        powerBI: "✅ Power BI Pro inclus",
        myAnalytics: "✅ MyAnalytics premium",
        vivaInsights: "✅ Viva Insights (complet avec Manager & Leader)",
        allE3Services: "✅ Tous les services E3"
      },

      windows: {
        license: "✅ Windows 11 Enterprise E5",
        allE3Windows: "✅ Toutes les fonctionnalités E3"
      },

      security: {
        azureAD: "✅ Azure AD Premium P2",
        mfa: "✅ MFA avancé",
        conditionalAccess: "✅ Accès conditionnel avancé",
        identityProtection: "✅ Azure AD Identity Protection",
        privilegedIdentity: "✅ Privileged Identity Management (PIM)",
        dlp: "✅ DLP avancé (Teams calls, fichiers on-premises)",
        defender: "✅ Microsoft Defender for Office 365 P2",
        defenderEndpoint: "✅ Microsoft Defender for Endpoint P2",
        defenderIdentity: "✅ Microsoft Defender for Identity",
        defenderCloudApps: "✅ Microsoft Defender for Cloud Apps (MCAS)",
        microsoft365Defender: "✅ Microsoft 365 Defender (XDR)",
        informationProtection: "✅ Azure Information Protection P2",
        autoLabeling: "✅ Auto-classification et labeling",
        customerKey: "✅ Customer Key (encryption)",
        customerLockbox: "✅ Customer Lockbox"
      },

      compliance: {
        purview: "✅ Microsoft Purview (complet)",
        advancedEDiscovery: "✅ eDiscovery avancé avec ML",
        advancedAudit: "✅ Audit avancé (1 an, 10 ans option)",
        communicationCompliance: "✅ Communication Compliance",
        insiderRisk: "✅ Insider Risk Management",
        informationBarriers: "✅ Information Barriers",
        privilegedAccess: "✅ Privileged Access Management",
        recordsManagement: "✅ Records Management",
        advancedDataGovernance: "✅ Advanced Data Governance"
      },

      analytics: {
        powerBI: "✅ Power BI Pro",
        myAnalytics: "✅ MyAnalytics premium",
        cloudAppSecurity: "✅ Cloud App Security analytics"
      },

      voice: {
        phoneSystem: "✅ Phone System",
        audioConferencing: "✅ Audio Conferencing",
        callingPlan: "✅ 60 minutes/utilisateur/mois vers fixes (zone 1)",
        emergencyCalling: "✅ Emergency Calling"
      },

      limits: {
        mailboxSize: "100 Go",
        oneDriveStorage: "Illimité",
        archiveMailbox: "Illimité auto-expanding",
        auditRetention: "1 an (10 ans en option)"
      },

      bestFor: [
        "Grandes entreprises avec besoins de sécurité maximale",
        "Secteurs hautement réglementés (finance, santé, gouvernement)",
        "Conformité stricte (RGPD, HIPAA, SOC 2)",
        "Protection contre menaces avancées (APT)",
        "Besoins de téléphonie cloud (PSTN)",
        "Analytics et BI (Power BI Pro inclus)",
        "Zero Trust security model"
      ]
    }
  },

  // ========== FRONTLINE WORKER PLANS ==========
  frontline: {
    "Microsoft 365 F1": {
      id: "microsoft-365-f1",
      price: "2.10€/utilisateur/mois",
      priceAnnual: "25.20€/utilisateur/an",
      maxUsers: "Illimité",
      target: "Travailleurs de première ligne - Accès kiosque uniquement",
      color: "teal",
      deprecated: "⚠️ Remplacé par F3 (disponible jusqu'à épuisement)",
      officialUrl: "https://www.microsoft.com/en-us/microsoft-365/enterprise/f1",

      officeApps: {
        desktop: "❌ Non inclus",
        web: "✅ Office Web Apps (lecture seule principalement)",
        mobile: "✅ Applications mobiles (Teams, Outlook, SharePoint)"
      },

      services: {
        exchange: "✅ Exchange Kiosk - Boîte mail 2 Go",
        onedrive: "✅ OneDrive - 2 Go",
        sharepoint: "✅ SharePoint (lecture principalement)",
        teams: "✅ Microsoft Teams",
        yammer: "✅ Viva Engage",
        shifts: "✅ Shifts (planning)",
        tasks: "✅ Tasks",
        stream: "✅ Stream (consommation)",
        forms: "✅ Forms (réponse uniquement)"
      },

      security: {
        mfa: "✅ MFA",
        intune: "✅ Intune (gestion d'appareils)",
        informationProtection: "✅ Information Protection (basic)"
      },

      limits: {
        mailboxSize: "2 Go",
        oneDriveStorage: "2 Go",
        usageRestriction: "Kiosk mode uniquement"
      },

      bestFor: [
        "Travailleurs terrain avec accès kiosque",
        "Utilisateurs sans besoin d'Office complet",
        "Budget très contraint"
      ]
    },

    "Microsoft 365 F3": {
      id: "microsoft-365-f3",
      price: "6.30€/utilisateur/mois",
      priceAnnual: "75.60€/utilisateur/an",
      maxUsers: "Illimité",
      target: "Travailleurs de première ligne - Solution complète",
      color: "emerald",
      officialUrl: "https://www.microsoft.com/en-us/microsoft-365/enterprise/f3",

      officeApps: {
        desktop: "❌ Non inclus",
        web: "✅ Office Web Apps complets",
        mobile: "✅ Applications mobiles complètes (Teams, Outlook, Office)"
      },

      services: {
        exchange: "✅ Exchange Online Kiosk - Boîte mail 2 Go",
        onedrive: "✅ OneDrive - 2 Go",
        sharepoint: "✅ SharePoint (consommation)",
        teams: "✅ Microsoft Teams (complet)",
        yammer: "✅ Viva Engage",
        shifts: "✅ Shifts (planning et gestion d'équipe)",
        tasks: "✅ Tasks by Planner",
        stream: "✅ Microsoft Stream",
        forms: "✅ Microsoft Forms",
        lists: "✅ Microsoft Lists",
        walkieTalkie: "✅ Walkie Talkie (Teams)",
        updates: "✅ Updates (check-ins)",
        approvals: "✅ Approvals",
        vivaConnections: "✅ Viva Connections",
        vivaEngage: "✅ Viva Engage",
        vivaLearning: "✅ Viva Learning (basic)",
        powerApps: "✅ Power Apps (consommation limitée)"
      },

      windows: {
        license: "✅ Windows 10/11 Enterprise E3",
        virtualDesktop: "✅ Windows Virtual Desktop"
      },

      security: {
        azureAD: "✅ Azure AD Premium P1",
        mfa: "✅ MFA",
        conditionalAccess: "✅ Accès conditionnel",
        intune: "✅ Microsoft Intune (MDM/MAM complet)",
        informationProtection: "✅ Azure Information Protection P1",
        defenderEndpoint: "✅ Microsoft Defender for Endpoint P1"
      },

      compliance: {
        dlp: "✅ DLP basique",
        retention: "✅ Politiques de rétention"
      },

      limits: {
        mailboxSize: "2 Go",
        oneDriveStorage: "2 Go",
        sharePointUsage: "Consommation uniquement (pas de création sites)"
      },

      bestFor: [
        "Retail (magasins, caissiers)",
        "Hôtellerie et restauration",
        "Santé (infirmiers, aides-soignants)",
        "Manufacturing (ouvriers)",
        "Logistique et transport",
        "Sécurité et gardiennage",
        "Tout travailleur sans bureau fixe"
      ]
    },

    "Office 365 F3": {
      id: "office-365-f3",
      price: "3.40€/utilisateur/mois",
      priceAnnual: "40.80€/utilisateur/an",
      maxUsers: "Illimité",
      target: "Frontline - Services Office 365 uniquement (sans Windows/Intune)",
      color: "sky",
      officialUrl: "https://learn.microsoft.com/en-us/microsoft-365/frontline/flw-licensing-options",

      officeApps: {
        desktop: "❌ Non inclus",
        web: "✅ Office Web Apps",
        mobile: "✅ Applications mobiles"
      },

      services: {
        exchange: "✅ Exchange Kiosk - 2 Go",
        onedrive: "✅ OneDrive - 2 Go",
        sharepoint: "✅ SharePoint (consommation)",
        teams: "✅ Teams",
        shifts: "✅ Shifts",
        allF3CloudServices: "✅ Mêmes services cloud que M365 F3"
      },

      security: {
        intune: "❌ Non inclus (différence vs M365 F3)",
        azureAD: "❌ Azure AD P1 non inclus",
        mfa: "✅ MFA basique"
      },

      windows: {
        license: "❌ Windows Enterprise non inclus"
      },

      bestFor: [
        "Organisations n'ayant pas besoin de Windows Enterprise",
        "Appareils iOS/Android principalement",
        "Pas de besoins Intune"
      ]
    },

    // ========== F5 ADD-ONS (Add-ons pour F1 et F3) ==========
    "Microsoft 365 F5 Security": {
      id: "microsoft-365-f5-security",
      price: "8.00€/utilisateur/mois",
      priceAnnual: "96€/utilisateur/an",
      type: "Add-on",
      prerequisite: "Nécessite Microsoft 365 F1 ou F3",
      target: "Add-on Sécurité pour Frontline Workers",
      color: "orange",
      officialUrl: "https://www.microsoft.com/en-us/licensing/news/new_f5_security_and_compliance_offer_for_frontline_workers",

      security: {
        defenderEndpoint: "✅ Microsoft Defender for Endpoint Plan 2",
        defenderOffice: "✅ Defender for Office 365 Plan 2",
        defenderIdentity: "✅ Defender for Identity",
        defenderCloudApps: "✅ Defender for Cloud Apps (MCAS)",
        microsoft365Defender: "✅ Microsoft 365 Defender (XDR complet)",
        azureAD: "✅ Azure AD Premium P2",
        identityProtection: "✅ Azure AD Identity Protection",
        privilegedIdentity: "✅ Privileged Identity Management (PIM)",
        informationProtection: "✅ Azure Information Protection P2",
        autoLabeling: "✅ Auto-labeling",
        cloudAppSecurity: "✅ Cloud App Security analytics"
      },

      features: [
        "Protection avancée contre les menaces (APT)",
        "Détection et réponse aux menaces (XDR)",
        "Protection des identités privilégiées",
        "Classification et protection automatiques des données",
        "Gestion des accès à privilèges"
      ],

      bestFor: [
        "Frontline workers avec accès à données sensibles",
        "Secteurs réglementés (santé, finance)",
        "Organisations avec besoins de sécurité renforcés",
        "Protection contre cybermenaces avancées"
      ]
    },

    "Microsoft 365 F5 Compliance": {
      id: "microsoft-365-f5-compliance",
      price: "8.00€/utilisateur/mois",
      priceAnnual: "96€/utilisateur/an",
      type: "Add-on",
      prerequisite: "Nécessite Microsoft 365 F1 ou F3",
      target: "Add-on Conformité pour Frontline Workers",
      color: "purple",
      officialUrl: "https://www.microsoft.com/en-us/licensing/news/new_f5_security_and_compliance_offer_for_frontline_workers",

      compliance: {
        purview: "✅ Microsoft Purview (complet)",
        advancedEDiscovery: "✅ eDiscovery avancé avec ML",
        advancedAudit: "✅ Audit avancé (1 an, 10 ans option)",
        communicationCompliance: "✅ Communication Compliance",
        insiderRisk: "✅ Insider Risk Management",
        informationBarriers: "✅ Information Barriers",
        privilegedAccess: "✅ Privileged Access Management",
        recordsManagement: "✅ Records Management",
        advancedDataGovernance: "✅ Advanced Data Governance",
        informationProtection: "✅ Information Protection & Governance",
        customerKey: "✅ Customer Key (encryption)",
        customerLockbox: "✅ Customer Lockbox"
      },

      features: [
        "Gouvernance avancée des données",
        "Conformité réglementaire (RGPD, HIPAA, SOC 2)",
        "Gestion des risques internes",
        "eDiscovery avec intelligence artificielle",
        "Audit et conservation avancés"
      ],

      bestFor: [
        "Secteurs hautement réglementés",
        "Conformité RGPD/HIPAA stricte",
        "Gestion des risques internes",
        "Organisations avec besoins d'audit avancés"
      ]
    },

    "Microsoft 365 F5 Security + Compliance": {
      id: "microsoft-365-f5-security-compliance",
      price: "13.00€/utilisateur/mois",
      priceAnnual: "156€/utilisateur/an",
      type: "Add-on Bundle",
      prerequisite: "Nécessite Microsoft 365 F1 ou F3",
      target: "Add-on Sécurité + Conformité pour Frontline Workers",
      color: "red",
      officialUrl: "https://www.microsoft.com/en-us/licensing/news/new_f5_security_and_compliance_offer_for_frontline_workers",
      savings: "Économie de 3€/mois vs achat séparé",

      security: {
        all: "✅ Toutes les fonctionnalités F5 Security"
      },

      compliance: {
        all: "✅ Toutes les fonctionnalités F5 Compliance"
      },

      features: [
        "Combine F5 Security + F5 Compliance",
        "Protection complète niveau Enterprise E5",
        "Sécurité maximale pour Frontline Workers",
        "Conformité et gouvernance avancées",
        "Économies vs achat séparé (23% de réduction)"
      ],

      bestFor: [
        "Frontline workers nécessitant sécurité ET conformité maximales",
        "Santé (HIPAA), Finance (PCI DSS), Gouvernement",
        "Zero Trust security model pour travailleurs terrain",
        "Alternative économique à E5 pour Frontline"
      ]
    },

    "Microsoft 365 F5 Information Protection and Governance": {
      id: "microsoft-365-f5-ipg",
      price: "Voir tarification Microsoft",
      type: "Add-on",
      prerequisite: "Nécessite Microsoft 365 F1 ou F3",
      target: "Protection et gouvernance des informations",
      color: "indigo",
      officialUrl: "https://www.microsoft.com/en-us/licensing/news/new_f5_security_and_compliance_offer_for_frontline_workers",

      features: [
        "Étiquetage et classification des données",
        "Politiques de rétention avancées",
        "Prévention de perte de données (DLP)",
        "Gouvernance des informations"
      ],

      bestFor: [
        "Focus sur protection des données uniquement",
        "Budget plus contraint que F5 Compliance complet"
      ]
    },

    "Microsoft 365 F5 Insider Risk Management": {
      id: "microsoft-365-f5-irm",
      price: "Voir tarification Microsoft",
      type: "Add-on",
      prerequisite: "Nécessite Microsoft 365 F1 ou F3",
      target: "Gestion des risques internes",
      color: "amber",
      officialUrl: "https://www.microsoft.com/en-us/licensing/news/new_f5_security_and_compliance_offer_for_frontline_workers",

      features: [
        "Détection des comportements à risque",
        "Analyse des communications",
        "Alertes sur activités suspectes",
        "Protection contre l'exfiltration de données"
      ],

      bestFor: [
        "Organisations préoccupées par les menaces internes",
        "Protection des données sensibles",
        "Conformité et surveillance des employés"
      ]
    },

    "Microsoft 365 F5 eDiscovery and Audit": {
      id: "microsoft-365-f5-ediscovery",
      price: "Voir tarification Microsoft",
      type: "Add-on",
      prerequisite: "Nécessite Microsoft 365 F1 ou F3",
      target: "eDiscovery et audit avancés",
      color: "teal",
      officialUrl: "https://www.microsoft.com/en-us/licensing/news/new_f5_security_and_compliance_offer_for_frontline_workers",

      features: [
        "eDiscovery avancé avec machine learning",
        "Audit avancé (rétention 1 an, option 10 ans)",
        "Recherche et analyse de contenu",
        "Conformité juridique et réglementaire"
      ],

      bestFor: [
        "Besoins juridiques et contentieux",
        "Investigations internes",
        "Conformité réglementaire stricte"
      ]
    }
  },

  // ========== EDUCATION PLANS ==========
  education: {
    "Microsoft 365 A1": {
      id: "microsoft-365-a1",
      price: "GRATUIT",
      maxUsers: "Illimité",
      target: "Éducation - Plan gratuit pour étudiants et enseignants",
      color: "violet",
      eligibility: "Établissements éducatifs éligibles uniquement",
      officialUrl: "https://www.microsoft.com/en-us/education/products/office",

      officeApps: {
        desktop: "❌ Non inclus",
        web: "✅ Office Web Apps complets",
        mobile: "✅ Applications mobiles"
      },

      services: {
        exchange: "✅ Exchange Online Plan 1 - 50 Go",
        onedrive: "✅ OneDrive - 1 To",
        sharepoint: "✅ SharePoint Online",
        teams: "✅ Microsoft Teams (complet avec classes)",
        teamsClasses: "✅ Teams for Education (devoirs, notes)",
        forms: "✅ Microsoft Forms (quiz auto-notés)",
        sway: "✅ Microsoft Sway",
        stream: "✅ Microsoft Stream",
        flipgrid: "✅ Flipgrid (vidéos éducatives)",
        minecraft: "✅ Minecraft Education Edition",
        whiteboard: "✅ Microsoft Whiteboard",
        yammer: "✅ Yammer"
      },

      security: {
        mfa: "✅ MFA",
        informationProtection: "✅ Information Protection basique"
      },

      limits: {
        mailboxSize: "50 Go",
        oneDriveStorage: "1 To par utilisateur"
      },

      bestFor: [
        "Écoles publiques et privées",
        "Universités",
        "Enseignants et étudiants",
        "Apprentissage en ligne et hybride"
      ]
    },

    "Microsoft 365 A3": {
      id: "microsoft-365-a3",
      price: "2.80€/utilisateur/mois (étudiant) | 6.80€/utilisateur/mois (enseignant)",
      priceAnnual: "33.60€ ou 81.60€/an",
      maxUsers: "Illimité",
      target: "Éducation - Suite complète avec Office Desktop",
      color: "fuchsia",
      eligibility: "Établissements éducatifs éligibles",
      officialUrl: "https://www.microsoft.com/en-us/licensing/product-licensing/microsoft-365-education",

      officeApps: {
        desktop: "✅ Microsoft 365 Apps for Enterprise",
        installations: "✅ 5 PC/Mac + 5 tablettes + 5 mobiles",
        web: "✅ Office Web Apps",
        mobile: "✅ Applications mobiles"
      },

      services: {
        exchange: "✅ Exchange Online Plan 2 - 100 Go",
        onedrive: "✅ OneDrive - Illimité",
        sharepoint: "✅ SharePoint Online",
        teams: "✅ Teams for Education (complet)",
        allA1Services: "✅ Tous les services A1",
        stream: "✅ Stream (avancé)",
        forms: "✅ Forms Pro (sondages avancés)",
        bookings: "✅ Bookings",
        myAnalytics: "✅ MyAnalytics"
      },

      windows: {
        license: "✅ Windows 10/11 Education A3",
        autopatch: "✅ Windows Autopatch"
      },

      security: {
        azureAD: "✅ Azure AD Premium P1",
        mfa: "✅ MFA",
        conditionalAccess: "✅ Accès conditionnel",
        intune: "✅ Microsoft Intune for Education",
        informationProtection: "✅ Azure Information Protection P1",
        dlp: "✅ Data Loss Prevention",
        advancedThreat: "✅ Advanced Threat Protection P1"
      },

      compliance: {
        retention: "✅ Politiques de rétention",
        eDiscovery: "✅ eDiscovery de base",
        auditBasic: "✅ Audit basique"
      },

      limits: {
        mailboxSize: "100 Go",
        oneDriveStorage: "Illimité",
        archiveMailbox: "Illimité"
      },

      bestFor: [
        "Établissements nécessitant Office Desktop",
        "Besoins de sécurité renforcés",
        "Gestion d'appareils (BYOD, 1:1 programs)",
        "Conformité FERPA, COPPA"
      ]
    },

    "Microsoft 365 A5": {
      id: "microsoft-365-a5",
      price: "5.60€/utilisateur/mois (étudiant) | 13.60€/utilisateur/mois (enseignant)",
      priceAnnual: "67.20€ ou 163.20€/an",
      maxUsers: "Illimité",
      target: "Éducation - Sécurité maximale et analytics",
      color: "rose",
      eligibility: "Établissements éducatifs éligibles",
      officialUrl: "https://www.microsoft.com/en-us/licensing/product-licensing/microsoft-365-education",

      officeApps: {
        desktop: "✅ Microsoft 365 Apps for Enterprise",
        installations: "✅ 5 PC/Mac + 5 tablettes + 5 mobiles",
        web: "✅ Office Web Apps",
        mobile: "✅ Applications mobiles"
      },

      services: {
        exchange: "✅ Exchange Online Plan 2 - 100 Go",
        onedrive: "✅ OneDrive - Illimité",
        sharepoint: "✅ SharePoint Online",
        teams: "✅ Teams for Education + Audio Conferencing",
        powerBI: "✅ Power BI Pro",
        allA3Services: "✅ Tous les services A3",
        myAnalytics: "✅ MyAnalytics premium"
      },

      windows: {
        license: "✅ Windows 10/11 Education A5"
      },

      security: {
        azureAD: "✅ Azure AD Premium P2",
        identityProtection: "✅ Identity Protection",
        privilegedIdentity: "✅ Privileged Identity Management",
        defenderOffice: "✅ Defender for Office 365 P2",
        defenderEndpoint: "✅ Defender for Endpoint P2",
        cloudAppSecurity: "✅ Cloud App Security",
        informationProtection: "✅ Azure Information Protection P2",
        autoLabeling: "✅ Auto-labeling",
        customerKey: "✅ Customer Key"
      },

      compliance: {
        advancedEDiscovery: "✅ eDiscovery avancé",
        advancedAudit: "✅ Audit avancé (1 an)",
        communicationCompliance: "✅ Communication Compliance",
        insiderRisk: "✅ Insider Risk Management",
        informationBarriers: "✅ Information Barriers"
      },

      analytics: {
        powerBI: "✅ Power BI Pro inclus",
        educationInsights: "✅ Education Insights premium"
      },

      voice: {
        phoneSystem: "✅ Phone System",
        audioConferencing: "✅ Audio Conferencing"
      },

      limits: {
        mailboxSize: "100 Go",
        oneDriveStorage: "Illimité",
        archiveMailbox: "Illimité"
      },

      bestFor: [
        "Universités de recherche",
        "Établissements avec besoins de sécurité maximum",
        "Protection des données sensibles (recherche, santé)",
        "Analytics et BI pour l'éducation",
        "Téléphonie cloud pour campus"
      ]
    }
  }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getAllCollaborationTools = () => {
  const tools = [];

  Object.values(m365CollaborationTools).forEach(category => {
    Object.values(category).forEach(tool => {
      tools.push(tool);
    });
  });

  return tools;
};

export const getToolsByCategory = (categoryName) => {
  return Object.values(m365CollaborationTools[categoryName] || {});
};

export const searchTools = (query) => {
  const allTools = getAllCollaborationTools();
  const lowerQuery = query.toLowerCase();

  return allTools.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.shortDescription.toLowerCase().includes(lowerQuery) ||
    tool.detailedDescription.toLowerCase().includes(lowerQuery) ||
    (tool.features && tool.features.some(f => f.toLowerCase().includes(lowerQuery)))
  );
};

export const getToolById = (toolId) => {
  const allTools = getAllCollaborationTools();
  return allTools.find(tool => tool.id === toolId);
};

export const getToolsByLicensePlan = (planName) => {
  const allTools = getAllCollaborationTools();

  return allTools.filter(tool => {
    if (!tool.licensing) return false;

    return Object.keys(tool.licensing).some(key =>
      key.toLowerCase().includes(planName.toLowerCase()) &&
      tool.licensing[key].includes('✓')
    );
  });
};
