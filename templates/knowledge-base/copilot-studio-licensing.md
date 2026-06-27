# Microsoft Copilot Studio — Licensing & Plans 2026

*Source : Microsoft Learn (learn.microsoft.com/microsoft-copilot-studio) — Mis à jour juin 2026*

---

## Qu'est-ce que Copilot Studio ?

Copilot Studio (anciennement Power Virtual Agents) est la plateforme Microsoft de création d'**agents IA conversationnels** sans code / low-code. Il permet de créer des chatbots, des agents autonomes, et d'étendre Microsoft 365 Copilot avec des capacités personnalisées.

---

## Les 2 plans principaux

### 1. Copilot Studio — Plan Teams (inclus dans certains M365)
Inclus dans les abonnements Microsoft 365 sélectionnés (M365 Business Standard, Business Premium, E3, E5).

| Capacité | Plan Teams |
|----------|-----------|
| Déploiement | Teams uniquement |
| Orchestration générative (GenAI) | ❌ Non disponible |
| Connecteurs Premium Power Platform | ❌ Non disponible |
| Environnements Power Platform | Dataverse for Teams uniquement |
| Flows Power Automate | ✅ Oui (cloud flows) |
| Création/édition avec Copilot | ❌ Non disponible |
| Hand-off vers agent humain | ❌ Non disponible |
| Compétences Bot Framework | ❌ Non disponible |
| Sécurité web | Sécurité activée par défaut (impossible de générer des secrets) |

**Usage** : Chatbots internes simples publiés sur Teams, FAQ d'entreprise, bots classiques sans IA générative.

---

### 2. Copilot Studio — Abonnement Standalone (payant)
Le plan complet qui débloque toutes les capacités de la plateforme.

| Capacité | Plan Standalone |
|----------|----------------|
| Déploiement | Tous les canaux supportés (Teams, Web, WhatsApp, etc.) |
| Orchestration générative (GenAI) | ✅ Oui |
| Connecteurs Premium Power Platform | ✅ Oui |
| Environnements Power Platform | Tous types |
| Flows Power Automate | ✅ Oui |
| Création/édition avec Copilot | ✅ Oui (IA génère les topics) |
| Hand-off vers agent humain | ✅ Oui |
| Compétences Bot Framework | ✅ Oui |
| Sécurité web | Contrôle complet (génération de secrets) |

---

## Structure de licence Standalone

La licence standalone nécessite **deux éléments** :

| Composant | Description | Qui l'achète |
|-----------|-------------|--------------|
| **Tenant License** ("Copilot Studio") | Capacité en Copilot Credits pour le tenant | Admin tenant (non assignable aux utilisateurs) |
| **User License** ("Copilot Studio User License") | Accès pour les créateurs d'agents | Admin → utilisateurs makers |

> Les **utilisateurs finaux** (ceux qui parlent au bot) n'ont pas besoin de licence.

---

## Copilot Credits — Monnaie de consommation

Depuis septembre 2025, la consommation est mesurée en **Copilot Credits** (remplacement des "messages").

| Mode d'achat | Description |
|--------------|-------------|
| **Prepaid pack** | Abonnement annuel avec un pool de Copilot Credits |
| **Pay-as-you-go** | Facturation Azure mensuelle — paiement à l'usage réel |
| **Prepurchase Plan** | Copilot Credit Commit Units (CCCUs) — pool cross-produits Microsoft |

- Les crédits non utilisés **ne sont pas reportés** d'un mois à l'autre
- La capacité est mutualisée (**poolée**) au niveau du tenant
- En cas de dépassement : enforcement technique (dégradation puis coupure)

**Outil d'estimation** : [Copilot Studio Agent Usage Estimator](https://microsoft.github.io/copilot-studio-estimator/)

---

## Copilot Studio inclus dans Microsoft 365 Copilot

Les détenteurs d'une **licence M365 Copilot ($30/user/mois)** peuvent utiliser Copilot Studio pour **étendre M365 Copilot** avec des agents personnalisés.

Inclus avec M365 Copilot :
- Copilot Chat (web + work grounding)
- Agents dans Teams, SharePoint
- Utilisation d'agents en "zero-rated" (pas de décompte de Copilot Credits pour les réponses classiques, génératives, ou Microsoft Graph grounding)
- SharePoint Advanced Management
- Copilot Analytics (Dashboard, Viva Insights)

---

## Canaux de déploiement (Plan Standalone)

- Microsoft Teams
- Sites web (widget embed)
- WhatsApp
- Facebook
- Slack
- Azure Bot Service
- Twilio SMS
- Skype, Telegram, Line
- Custom channels via Direct Line API
- Dynamics 365 Customer Service

---

## Inclus dans Dynamics 365

Les add-ons **Digital Messaging** et **Chat** pour Dynamics 365 Customer Service incluent des entitlements Copilot Studio (agents pour le service client).

---

## Plan Gouvernement (GCC)

Copilot Studio est disponible dans le cloud **US Government Community Cloud (GCC)**. Les plans GCC High et DoD ont des restrictions sur les canaux et features IA.

---

## Comparatif rapide pour vendeurs

| Scénario | Recommandation |
|----------|---------------|
| Bot FAQ interne Teams, client déjà M365 E3/E5 | **Plan Teams inclus** — pas de coût additionnel |
| Chatbot multicanal (web + Teams + WhatsApp) | **Standalone Copilot Studio** |
| Étendre Microsoft 365 Copilot avec IA custom | **M365 Copilot + Copilot Studio** |
| Centre de contact IA avec hand-off agent humain | **Copilot Studio Standalone + D365 Customer Service** |
| Bot IA générative avec connecteurs SAP/Salesforce | **Standalone** (connecteurs Premium requis) |

---

## Pricing de référence (juin 2026)

| Composant | Prix |
|-----------|------|
| Copilot Studio Tenant License (pack 25K messages/mois) | ~$200/tenant/mois |
| Copilot Studio User License | ~$200/user/mois (makers) |
| M365 Copilot add-on | $30/user/mois |

> Tarifs CSP variables. Toujours vérifier le Price List Microsoft Partner Center.

---

## Sources
- https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing
- https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-licensing
- https://learn.microsoft.com/en-us/microsoft-copilot-studio/requirements-licensing-subscriptions
