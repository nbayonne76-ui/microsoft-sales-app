// ── Static Microsoft articles ─────────────────────────────────────────────────
// Content grounded in the Microsoft KB — same source as email generator & account intel

export const BLOG_CATEGORIES = [
  { id: 'all',         label: 'Tous',           labelEn: 'All',            emoji: '📋' },
  { id: 'news',        label: 'Actualités',      labelEn: 'News',           emoji: '⚡' },
  { id: 'm365',        label: 'Microsoft 365',   labelEn: 'Microsoft 365',  emoji: '💼' },
  { id: 'azure',       label: 'Azure & Cloud',   labelEn: 'Azure & Cloud',  emoji: '☁️' },
  { id: 'copilot',     label: 'Copilot & IA',    labelEn: 'Copilot & AI',   emoji: '🤖' },
  { id: 'dynamics',    label: 'Dynamics 365',    labelEn: 'Dynamics 365',   emoji: '🎯' },
  { id: 'securite',    label: 'Sécurité',        labelEn: 'Security',       emoji: '🛡️' },
];

export const CATEGORY_COLORS = {
  m365:     'bg-blue-100 text-blue-700 border-blue-200',
  azure:    'bg-sky-100 text-sky-700 border-sky-200',
  copilot:  'bg-purple-100 text-purple-700 border-purple-200',
  dynamics: 'bg-orange-100 text-orange-700 border-orange-200',
  securite: 'bg-red-100 text-red-700 border-red-200',
};

export const CATEGORY_GRADIENTS = {
  m365:     'from-blue-600 to-indigo-600',
  azure:    'from-sky-500 to-blue-600',
  copilot:  'from-purple-600 to-indigo-600',
  dynamics: 'from-orange-500 to-red-600',
  securite: 'from-red-500 to-rose-600',
};

export const ARTICLES = [
  // ── Article 1 — M365 E7 ─────────────────────────────────────────────────
  {
    slug: 'microsoft-365-e7-frontier-worker-suite',
    category: 'm365',
    date: '2026-05-20',
    readTime: '8 min',
    author: 'Nicolas BAYONNE',
    authorRole: 'Microsoft Partner Account Manager',
    featured: true,
    fr: {
      title: 'Microsoft 365 E7 : le Frontier Worker Suite expliqué',
      excerpt: 'Microsoft lance son plan Enterprise le plus ambitieux : M365 E7 regroupe M365 E5, Entra Suite, Microsoft 365 Copilot et Agent 365 en un seul bundle à $99/user/mois. Tout ce que les DSI doivent savoir avant le 1er mai 2026.',
      sections: [
        {
          type: 'intro',
          text: 'Le 1er mai 2026, Microsoft lance officiellement Microsoft 365 E7, baptisé "The Frontier Worker Suite". Ce nouveau plan Enterprise premium marque une rupture majeure : pour la première fois, productivité, sécurité Zero Trust, IA générative et gouvernance des agents IA sont réunis dans un seul abonnement.',
        },
        {
          type: 'h2', text: 'Qu\'est-ce que Microsoft 365 E7 ?',
        },
        {
          type: 'p',
          text: 'M365 E7 est la somme de quatre composants distincts : Microsoft 365 E5 (la base sécurisée), Microsoft Entra Suite (Zero Trust complet), Microsoft 365 Copilot (IA dans toutes les apps) et Microsoft Agent 365 (le plan de contrôle des agents IA).',
        },
        {
          type: 'pricing',
          rows: [
            { component: 'Microsoft 365 E5 + Entra Suite', price: '$60/user/mois', note: '$51.45 sans Teams à partir du 1/7/26' },
            { component: 'Microsoft Entra Suite', price: '$12/user/mois', note: '$9 pour clients E5 existants' },
            { component: 'Microsoft 365 Copilot', price: '$30/user/mois', note: '' },
            { component: 'Microsoft Agent 365', price: '$15/user/mois', note: 'NOUVEAU' },
            { component: 'M365 E7 (bundle)', price: '$99/user/mois', note: 'Économie : $18/user/mois vs achat séparé', bold: true },
          ],
        },
        {
          type: 'h2', text: 'Microsoft Agent 365 : la vraie nouveauté',
        },
        {
          type: 'p',
          text: 'Agent 365 est le composant véritablement inédit de E7. Il fournit trois capacités critiques pour les organisations qui déploient des agents IA à grande échelle :',
        },
        {
          type: 'list',
          items: [
            '🔭 Observe : visibilité en temps réel sur tous les agents déployés dans l\'organisation (qui fait quoi, quand, avec quelles données)',
            '⚙️ Govern : guardrails, cycle de vie des agents, conformité et rétention des données — audit-ready',
            '🛡️ Secure : sécuriser les identités des agents, contrôler leurs accès, prévenir le data oversharing et les menaces IA',
          ],
        },
        {
          type: 'h2', text: 'Work IQ : l\'IA personnalisée à votre organisation',
        },
        {
          type: 'p',
          text: 'Work IQ est la couche d\'intelligence qui personnalise Copilot pour chaque utilisateur et chaque organisation. Elle combine trois dimensions : Skills & Tools (instructions spécialisées), Context (mémoire des habitudes et workflows) et Data (fusion des signaux M365 + données métier via connecteurs).',
        },
        {
          type: 'h2', text: 'Pour qui est fait M365 E7 ?',
        },
        {
          type: 'list',
          items: [
            'Clients actuellement sur M365 E5 souhaitant intégrer Copilot + gouvernance agents',
            'DSI / RSSI confrontés à la prolifération d\'agents IA non contrôlés',
            'Organisations +300 utilisateurs cherchant un plan IA complet, sécurisé, économique',
            'Toute organisation soumise à NIS2, DORA, RGPD, HIPAA ou FCA',
          ],
        },
        {
          type: 'cta',
          text: 'Vous souhaitez évaluer l\'impact de M365 E7 sur votre organisation ?',
          action: 'Générer un dossier Account Intel',
          href: '/account',
        },
      ],
    },
    en: {
      title: 'Microsoft 365 E7: The Frontier Worker Suite Explained',
      excerpt: 'Microsoft launches its most ambitious Enterprise plan: M365 E7 bundles M365 E5, Entra Suite, Microsoft 365 Copilot, and Agent 365 into a single $99/user/month package. Everything CIOs need to know before May 1, 2026.',
    },
  },

  // ── Article 2 — Copilot ──────────────────────────────────────────────────
  {
    slug: 'microsoft-365-copilot-guide-entreprise',
    category: 'copilot',
    date: '2026-05-15',
    readTime: '6 min',
    author: 'Nicolas BAYONNE',
    authorRole: 'Microsoft Partner Account Manager',
    featured: false,
    fr: {
      title: 'Microsoft 365 Copilot : le guide complet pour les entreprises',
      excerpt: 'Microsoft 365 Copilot intègre l\'IA générative dans Teams, Outlook, Word, Excel et PowerPoint. À $30/user/mois, il promet +30% de productivité. Mode d\'emploi pour les entreprises françaises.',
      sections: [
        {
          type: 'intro',
          text: 'Microsoft 365 Copilot est l\'assistant IA générative de Microsoft, intégré nativement dans toutes les applications de la suite M365. Alimenté par les grands modèles de langage d\'OpenAI et ancré dans les données de votre organisation, il transforme la façon dont les équipes travaillent.',
        },
        {
          type: 'h2', text: 'Copilot dans vos applications au quotidien',
        },
        {
          type: 'list',
          items: [
            '📧 Outlook : résume vos emails, rédige des réponses, priorise votre boîte de réception',
            '💬 Teams : résumé automatique des réunions, transcription, points d\'action extraits',
            '📝 Word : génère, reformule et améliore vos documents à partir d\'un brief',
            '📊 Excel : analyse de données, formules complexes, insights business en langage naturel',
            '📊 PowerPoint : crée des présentations complètes depuis un document Word ou un brief',
          ],
        },
        {
          type: 'h2', text: 'Work IQ : la mémoire professionnelle de Copilot',
        },
        {
          type: 'p',
          text: 'Avec M365 E7, Copilot gagne Work IQ — une couche d\'intelligence qui apprend votre style, vos habitudes et votre contexte métier. Copilot ne répond plus de façon générique : il répond en connaissant votre secteur, vos clients et vos processus.',
        },
        {
          type: 'h2', text: 'Les résultats clients mesurés',
        },
        {
          type: 'list',
          items: [
            '+30% d\'efficacité développeur (CapitaLand, Gerdau)',
            '+30% de productivité employés (DSB, Accenture)',
            '-40% de temps sur le support client (PwC, Hitachi)',
            '+94% d\'amélioration du temps de prospection (Lumen)',
          ],
        },
        {
          type: 'h2', text: 'Prérequis et tarification',
        },
        {
          type: 'p',
          text: 'Microsoft 365 Copilot est disponible en add-on sur tous les plans Enterprise (E3, E5) et Business Standard/Premium. Tarif : $30/user/mois. Inclus dans M365 E7. Nécessite une licence M365 active et Entra ID P1 minimum.',
        },
        {
          type: 'cta',
          text: 'Prêt à évaluer l\'impact Copilot pour votre client ?',
          action: 'Générer un email Copilot personnalisé',
          href: '/email-generator',
        },
      ],
    },
    en: {
      title: 'Microsoft 365 Copilot: The Complete Enterprise Guide',
      excerpt: 'Microsoft 365 Copilot brings generative AI to Teams, Outlook, Word, Excel and PowerPoint. At $30/user/month, it promises +30% productivity gains. A guide for enterprise decision-makers.',
    },
  },

  // ── Article 3 — Azure ────────────────────────────────────────────────────
  {
    slug: 'azure-vs-aws-migration-cloud-2026',
    category: 'azure',
    date: '2026-05-10',
    readTime: '7 min',
    author: 'Nicolas BAYONNE',
    authorRole: 'Microsoft Partner Account Manager',
    featured: false,
    fr: {
      title: 'Azure vs AWS en 2026 : pourquoi les entreprises françaises choisissent Microsoft',
      excerpt: 'AWS reste le leader mondial du cloud, mais Azure gagne du terrain en Europe grâce à sa souveraineté des données, son intégration M365 et son offre IA (Azure OpenAI). Comparatif objectif pour aider votre décision.',
      sections: [
        {
          type: 'intro',
          text: 'Le choix d\'un fournisseur cloud est une décision stratégique qui engage votre organisation pour 5 à 10 ans. En 2026, Azure et AWS se disputent le marché enterprise, mais avec des propositions de valeur très différentes selon votre contexte.',
        },
        {
          type: 'h2', text: 'Pourquoi Azure gagne en Europe',
        },
        {
          type: 'list',
          items: [
            '🇫🇷 Souveraineté des données : régions Azure France Centre + France Sud, compliance RGPD native',
            '🔗 Intégration M365 : si vous êtes sur M365/Office 365, Azure est l\'extension naturelle (Entra ID, Defender for Cloud, Purview)',
            '🤖 Azure OpenAI Service : accès aux modèles GPT-4, DALL·E et Whisper avec les garanties enterprise Microsoft',
            '💰 Hybride : Azure Arc gère votre infrastructure on-premise ET cloud depuis un seul plan de contrôle',
          ],
        },
        {
          type: 'h2', text: 'Les arguments d\'AWS',
        },
        {
          type: 'list',
          items: [
            'Maturité et profondeur des services (plus de 250 services vs ~200 chez Azure)',
            'Tarifs compétitifs sur le compute pur (EC2 vs Azure VM)',
            'Meilleure tooling DevOps native (CodePipeline, CodeDeploy)',
          ],
        },
        {
          type: 'h2', text: 'Notre recommandation',
        },
        {
          type: 'p',
          text: 'Pour une entreprise française déjà sur M365 : **Azure est le choix évident**. L\'intégration entre Entra ID, M365, Azure et Defender for Cloud crée une synergie que AWS ne peut pas répliquer. Pour une pure play cloud-native sans M365 : évaluez les deux selon vos workloads.',
        },
        {
          type: 'cta',
          text: 'Besoin d\'un dossier de migration Azure personnalisé ?',
          action: 'Analyser votre compte',
          href: '/account',
        },
      ],
    },
    en: {
      title: 'Azure vs AWS in 2026: Why French Enterprises Choose Microsoft',
      excerpt: 'AWS remains the global cloud leader, but Azure is gaining ground in Europe through data sovereignty, M365 integration, and AI capabilities (Azure OpenAI). An objective comparison to guide your decision.',
    },
  },

  // ── Article 4 — Dynamics 365 ─────────────────────────────────────────────
  {
    slug: 'dynamics-365-sales-guide-commercial',
    category: 'dynamics',
    date: '2026-05-05',
    readTime: '5 min',
    author: 'Nicolas BAYONNE',
    authorRole: 'Microsoft Partner Account Manager',
    featured: false,
    fr: {
      title: 'Dynamics 365 Sales : comment transformer votre pipeline commercial',
      excerpt: 'Dynamics 365 Sales n\'est plus un simple CRM — c\'est une plateforme de vente IA-native qui prédit les deals à risque, automatise les séquences d\'engagement et connecte vos données métier à Copilot.',
      sections: [
        {
          type: 'intro',
          text: 'Dynamics 365 Sales est le CRM enterprise de Microsoft, conçu pour les équipes commerciales B2B. En 2025/2026, avec l\'intégration de Copilot for Sales, il devient une plateforme de vente augmentée par l\'IA.',
        },
        {
          type: 'h2', text: 'Les fonctionnalités clés',
        },
        {
          type: 'list',
          items: [
            '🎯 Pipeline management : opportunités, leads scoring, forecasting IA',
            '🤖 Copilot for Sales : résumés de réunions, next-best-action, emails générés automatiquement',
            '📊 Sales Insights : prédiction des deals à risque, analyse des conversations (Teams + Gong)',
            '🔗 Connecté à M365 : Teams, Outlook, SharePoint intégrés nativement',
            '📱 Mobile first : appli iOS/Android pour les commerciaux terrain',
          ],
        },
        {
          type: 'h2', text: 'Dynamics 365 Sales vs Salesforce',
        },
        {
          type: 'p',
          text: 'Salesforce domine historiquement le marché CRM, mais Dynamics 365 Sales s\'impose dans les organisations Microsoft-first. L\'avantage décisif : l\'intégration native M365/Teams/Outlook. Chez Salesforce, c\'est une intégration tierce (souvent cassée après les mises à jour).',
        },
        {
          type: 'h2', text: 'Tarification 2025',
        },
        {
          type: 'list',
          items: [
            'Dynamics 365 Sales Professional : $65/user/mois',
            'Dynamics 365 Sales Enterprise : $95/user/mois (avec Copilot for Sales)',
            'Dynamics 365 Sales Premium : $135/user/mois (avec Sales Insights avancé)',
          ],
        },
        {
          type: 'cta',
          text: 'Comparer Dynamics 365 Sales pour votre prospect ?',
          action: 'Générer un email Dynamics 365',
          href: '/email-generator',
        },
      ],
    },
    en: {
      title: 'Dynamics 365 Sales: How to Transform Your Commercial Pipeline',
      excerpt: 'Dynamics 365 Sales is no longer just a CRM — it\'s an AI-native sales platform that predicts at-risk deals, automates engagement sequences, and connects your business data to Copilot.',
    },
  },

  // ── Article 5 — Sécurité ─────────────────────────────────────────────────
  {
    slug: 'microsoft-purview-defender-nis2-rgpd',
    category: 'securite',
    date: '2026-04-28',
    readTime: '6 min',
    author: 'Nicolas BAYONNE',
    authorRole: 'Microsoft Partner Account Manager',
    featured: false,
    fr: {
      title: 'NIS2, RGPD & Microsoft Purview : la conformité simplifiée pour les DSI',
      excerpt: 'La directive NIS2 est entrée en vigueur en octobre 2024. Microsoft Purview et Defender for Cloud offrent une réponse intégrée : DLP, classification automatique, audit trail et incident response en un seul tableau de bord.',
      sections: [
        {
          type: 'intro',
          text: 'La directive NIS2 impose de nouvelles obligations de cybersécurité aux organisations européennes depuis octobre 2024. Pour les DSI et RSSI, la question n\'est plus "si" mais "comment" se mettre en conformité efficacement sans exploser le budget.',
        },
        {
          type: 'h2', text: 'Ce que NIS2 exige concrètement',
        },
        {
          type: 'list',
          items: [
            'Notification d\'incident sous 24h à l\'ANSSI (rapport préliminaire) et 72h (rapport complet)',
            'Gestion des risques cybersécurité documentée et testée',
            'Sécurité de la chaîne d\'approvisionnement (vos fournisseurs IT inclus)',
            'Continuité d\'activité et plan de reprise après sinistre',
            'Sanctions : jusqu\'à 10M€ ou 2% du CA mondial',
          ],
        },
        {
          type: 'h2', text: 'La réponse Microsoft',
        },
        {
          type: 'list',
          items: [
            '🔍 Microsoft Purview : classification automatique des données sensibles, DLP, audit complet, eDiscovery',
            '🛡️ Microsoft Defender XDR : détection et réponse unifiée (email, endpoint, identité, cloud)',
            '🔐 Microsoft Entra ID Protection : Zero Trust, MFA adaptatif, détection des comptes compromis',
            '📋 Microsoft Sentinel : SIEM/SOAR cloud-native avec playbooks d\'automatisation des incidents',
          ],
        },
        {
          type: 'h2', text: 'Quel plan Microsoft pour la conformité NIS2 ?',
        },
        {
          type: 'p',
          text: 'La réponse minimale NIS2 pour une organisation Enterprise : **Microsoft 365 E5** (inclut Purview E5 + Defender suite + Entra P2). Pour une conformité maximale avec gouvernance des agents IA : **Microsoft 365 E7** (inclut tout E5 + Entra Suite + Agent 365).',
        },
        {
          type: 'cta',
          text: 'Évaluer votre posture NIS2 avec Microsoft ?',
          action: 'Générer un dossier sécurité',
          href: '/account',
        },
      ],
    },
    en: {
      title: 'NIS2, GDPR & Microsoft Purview: Compliance Simplified for CIOs',
      excerpt: 'NIS2 came into force in October 2024. Microsoft Purview and Defender for Cloud offer an integrated response: DLP, automatic classification, audit trail, and incident response in a single dashboard.',
    },
  },
];

export function getArticle(slug) {
  return ARTICLES.find(a => a.slug === slug) || null;
}

export function getArticlesByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return ARTICLES;
  return ARTICLES.filter(a => a.category === categoryId);
}
