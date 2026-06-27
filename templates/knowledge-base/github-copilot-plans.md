# GitHub Copilot — Plans & Pricing 2026

*Source : GitHub Docs (docs.github.com/copilot) — Mis à jour juin 2026*

---

## Qu'est-ce que GitHub Copilot ?

GitHub Copilot est l'assistant IA de développement de Microsoft/GitHub. Il offre de la **complétion de code**, du **chat IA dans les IDEs**, de la **revue de code automatisée**, et des **agents de développement autonomes** directement dans VS Code, Visual Studio, JetBrains, Neovim, et autres IDEs.

> **Lien stratégique M365** : GitHub Copilot est distinct de Microsoft 365 Copilot mais fait partie de la famille Copilot Microsoft. Les clients développeurs/DSI sont souvent acheteurs des deux.

---

## Plans disponibles (juin 2026)

### Plans Individuels

| Plan | Prix | Pour qui |
|------|------|---------|
| **Copilot Free** | Gratuit | Développeurs individuels — accès limité |
| **Copilot Student** | Gratuit (étudiants vérifiés) | Étudiants — completions illimitées |
| **Copilot Pro** | $10/mois | Développeurs professionnels |
| **Copilot Pro+** | $39/mois | Utilisateurs avancés (modèles premium) |
| **Copilot Max** | $100/mois | Power users, volume élevé |

### Plans Organisationnels

| Plan | Prix | Prérequis |
|------|------|----------|
| **Copilot Business** | $19/siège/mois | GitHub Free, Team, ou Enterprise Cloud |
| **Copilot Enterprise** | $39/siège/mois | GitHub Enterprise Cloud uniquement |

---

## Comparaison features clés

| Feature | Free | Pro | Pro+ | Business | Enterprise |
|---------|------|-----|------|----------|------------|
| Complétion de code | Limitée | Illimitée | Illimitée | Pool org | Pool org |
| Chat dans IDEs | ✅ | ✅ | ✅ | ✅ | ✅ |
| Revue de code IA | Limitée | Complète | Complète | Complète | Complète |
| Agent cloud (Copilot coding agent) | ❌ | ✅ | ✅ | ✅ | ✅ |
| Sélection de modèle | Auto seulement | ✅ | ✅ | ✅ | ✅ |
| Modèles premium (GPT-4o, Claude, Gemini) | ❌ | Limité | ✅ | ✅ | ✅ |
| Gestion organisation | N/A | N/A | N/A | ✅ | ✅ |
| Audit logs | N/A | N/A | N/A | ✅ | ✅ |
| Politique d'utilisation (policy controls) | N/A | N/A | N/A | ✅ | ✅ |
| Knowledge bases (doc custom) | ❌ | ❌ | ❌ | ❌ | ✅ |
| Résumés de Pull Request | ❌ | ❌ | ❌ | ✅ | ✅ |
| Recherche sémantique dans le repo | ❌ | ❌ | ❌ | ❌ | ✅ |
| Priorité modèles / nouvelles features | ❌ | ❌ | ✅ | ❌ | ✅ |

---

## Copilot Business — Pour les organisations

**Prix : $19/siège/mois**

### Inclus :
- Complétion de code illimitée (pool organisationnel)
- Chat dans VS Code, Visual Studio, JetBrains, Neovim, CLI
- Copilot coding agent (tâches autonomes sur GitHub Issues)
- Catalogue de modèles (GPT-4o, Claude Sonnet, Gemini, etc.)
- Contrôle centralisé des politiques (activer/désactiver par équipe)
- Audit logs pour la conformité
- Résumés automatiques de Pull Requests
- Protection IP (code snippet filtering activé par défaut)
- Ne s'entraîne pas sur le code propriétaire

### Prérequis :
- Plan GitHub : Free, Team, ou Enterprise Cloud
- Facturation par siège (seat-based)

---

## Copilot Enterprise — Pour les grandes entreprises

**Prix : $39/siège/mois**

### Tout Business + :
- **Knowledge bases** : index de documentation interne (wiki, repos) accessible via chat
- **Recherche sémantique** dans les repos GitHub Enterprise
- **Priorité d'accès** aux nouveaux modèles et features
- Pool de crédits IA plus grand
- Intégration plus profonde avec GitHub Enterprise Cloud

### Prérequis :
- GitHub Enterprise Cloud uniquement

---

## IDEs et outils supportés

| Outil | Chat | Complétion | Agent |
|-------|------|------------|-------|
| VS Code | ✅ | ✅ | ✅ |
| Visual Studio | ✅ | ✅ | ✅ |
| JetBrains IDEs | ✅ | ✅ | ✅ |
| Neovim | ❌ | ✅ | ❌ |
| GitHub.com (web) | ✅ | ✅ | ✅ |
| GitHub Mobile | ✅ | ❌ | ❌ |
| GitHub CLI | ✅ | ❌ | ❌ |
| Windows Terminal | ✅ | ❌ | ❌ |
| Azure Data Studio | ✅ | ✅ | ❌ |
| Eclipse | ❌ | ✅ | ❌ |

---

## Copilot Coding Agent (nouveau 2026)

L'agent autonome de développement de GitHub Copilot :
- Assigné à un **GitHub Issue**, il crée une branche, code la solution, ouvre une PR
- Fonctionne dans un environnement cloud isolé (sandbox sécurisé)
- L'humain **review et merge** la PR
- Disponible : Copilot Pro+, Business, Enterprise

---

## Modèles IA supportés (sélectables par l'utilisateur)

| Fournisseur | Modèles disponibles |
|-------------|---------------------|
| OpenAI | GPT-4o, GPT-4.1, o1, o3 |
| Anthropic | Claude Sonnet, Claude Opus |
| Google | Gemini 1.5 Pro, Gemini 2.0 |
| Meta | Llama 3.1, Llama 3.3 |
| Microsoft | Phi-4 |

---

## Lien avec l'écosystème Microsoft

| Produit | Relation avec GitHub Copilot |
|---------|------------------------------|
| Microsoft 365 Copilot | Produit distinct — focus productivity M365, pas code |
| Azure DevOps | Integration partielle — GitHub est le hub principal |
| VS Code | Microsoft développe VS Code + extension GitHub Copilot officielle |
| Azure | GitHub Actions → Azure Deployments intégrés |
| Microsoft Entra | SSO possible via Entra pour GitHub Enterprise |

---

## Comparatif pour vendeurs

| Profil client | Recommandation |
|---------------|---------------|
| Développeur individuel, budget limité | **Copilot Pro** ($10/mois) |
| Équipe dev 5-200 personnes | **Copilot Business** ($19/siège) |
| Grande entreprise avec repo documentaire interne | **Copilot Enterprise** ($39/siège) — knowledge bases |
| DSI avec Azure + GitHub Enterprise | **Copilot Enterprise** + Azure DevOps intégration |
| Client déjà sur M365 E5 | Cross-sell GitHub Copilot Business/Enterprise (distinct mais complémentaire) |

---

## ROI & Arguments de vente

- **25-55% de code généré par Copilot** selon GitHub (étude interne 2024)
- **Développeurs 55% plus rapides** sur les tâches avec Copilot (GitHub research)
- Break-even rapide : ~0.5h/jour d'économie = ROI positif pour $19/mois
- Réduction du temps de review avec résumés PR automatiques (Enterprise)
- Knowledge bases = intégration de toute la documentation technique interne

---

## Note commerciale importante (avril 2026)
Les nouvelles souscriptions self-serve **Copilot Business** pour organisations sur GitHub Free et GitHub Team sont **temporairement suspendues depuis le 22 avril 2026**. Contacter Microsoft/GitHub pour les options de souscription actuelles.

---

## Sources
- https://docs.github.com/en/enterprise-cloud@latest/copilot/about-github-copilot/subscription-plans-for-github-copilot
- https://github.com/features/copilot
- https://docs.github.com/en/copilot
