# Microsoft Intune — Plans & Licensing 2026

*Source : Microsoft Learn (learn.microsoft.com/mem/intune) — Mis à jour juin 2026*

---

## Qu'est-ce que Microsoft Intune ?

Microsoft Intune est la solution Microsoft de **gestion unifiée des endpoints** (UEM — Unified Endpoint Management). Il permet de gérer et sécuriser les appareils (Windows, macOS, iOS, Android) et les applications d'une organisation depuis le cloud.

---

## Les 3 plans Intune

| Plan | Description | Ce qui est inclus dans M365 |
|------|-------------|----------------------------|
| **Intune Plan 1** | Service de base — MDM/MAM cloud | M365 E3, E5, E7, Business Premium, EMS E3/E5 |
| **Intune Plan 2** | Additif au Plan 1 — capacités endpoint avancées | M365 E5, Microsoft 365 E7 (via Intune Suite) |
| **Intune Suite** | Additif au Plan 1 — endpoint management + security unifiés. Inclut le Plan 2 | M365 E5 Security add-on, Intune Suite standalone |

---

## Plans M365 incluant Intune

| Plan M365 | Intune inclus |
|-----------|--------------|
| Microsoft 365 Business Premium | Plan 1 |
| Microsoft 365 E3 | Plan 1 |
| Microsoft 365 E5 | Plan 1 + certaines capacités avancées |
| Microsoft 365 E7 | Plan 1 + Intune Suite |
| Microsoft 365 F1 | Plan 1 (périmètre limité) |
| Microsoft 365 F3 | Plan 1 |
| EMS E3 | Plan 1 |
| EMS E5 | Plan 1 |

> **Règle clé** : La plupart des clients obtiennent Intune Plan 1 dans leur bundle M365 — les capacités avancées nécessitent Plan 2 ou Suite en add-on.

---

## Intune Plan 1 — Fonctionnalités de base

- Gestion MDM Windows, macOS, iOS, Android
- Gestion MAM (Mobile Application Management) — sans inscription appareil
- Politiques de conformité et d'accès conditionnel (avec Entra ID P1/P2)
- Déploiement d'applications
- Windows Autopilot
- Co-gestion avec Configuration Manager
- Endpoint Analytics (basique)
- Microsoft Defender for Endpoint intégration
- Certificats SCEP/PKCS
- BitLocker / FileVault management

---

## Intune Plan 2 — Capacités avancées (add-on)

Inclut tout du Plan 1 plus :

| Capacité | Description |
|----------|-------------|
| **Remote Help** | Support helpdesk sécurisé via cloud (RBAC, session recording) |
| **Advanced Endpoint Analytics** | Insights IA sur l'expérience utilisateur, anomaly detection |
| **Tunnel for MAM** | VPN Microsoft Tunnel pour apps non-inscrites (Android/iOS) |
| **Firmware-over-the-Air** | Mises à jour firmware Android Enterprise à distance |
| **Specialized device management** | AR/VR, grands écrans, salles de réunion |

---

## Intune Suite — Toutes les capacités (add-on premium)

Inclut Plan 2 + :

| Capacité | Description |
|----------|-------------|
| **Endpoint Privilege Management (EPM)** | Least privilege — élévation ponctuelle approuvée sans droits admin permanents |
| **Microsoft Cloud PKI** | CA managée par Microsoft — émission, renouvellement, révocation de certificats |
| **Enterprise App Management** | Catalogue d'applications Win32 Microsoft-hosted avec paramètres d'installation |
| **Remote Help** (inclus) | Voir Plan 2 |
| **Advanced Analytics** (inclus) | Voir Plan 2 |
| **Tunnel for MAM** (inclus) | Voir Plan 2 |

---

## Licences spéciales

### Licence device-only
Pour les appareils sans utilisateur affilié (kiosques, IoT, salles de réunion) :
- Inscription via : Autopilot Self-Deploying, Apple DEP sans affinité utilisateur, Android Enterprise dedicated
- **Limitations** : pas d'App Protection Policies, pas de Conditional Access, pas de gestion basée sur l'utilisateur

### Intune for Education
- Inclus dans : Microsoft 365 Education A3, A5
- Fonctionnalités adaptées aux établissements scolaires

---

## Accès admin non-licencié

Les administrateurs peuvent gérer Intune **sans licence Intune** assignée :
- Tenants créés après juillet 2021 : activé par défaut
- Tenants créés avant juillet 2021 : option à activer manuellement (`Allow access to unlicensed admins`)
- Limite : 1 000 admins non-licenciés par groupe de sécurité

> Note : Les fonctionnalités qui dépendent de Microsoft Entra ID P1/P2 continuent de nécessiter la licence appropriée.

---

## Co-gestion avec Configuration Manager

La plupart des licences incluant Intune incluent aussi les droits d'utilisation de **Microsoft Configuration Manager (SCCM)**.

Prérequis pour l'auto-enrollment co-management :
- Microsoft Entra ID P1 ou P2 (par utilisateur)
- Intune Plan 1 (inclus automatiquement)

---

## Trials disponibles

- **Durée** : 90 jours
- **Limite** : 250 utilisateurs par tenant
- **Période de grâce post-trial** : 30 jours
- Accessible depuis : Microsoft Intune admin center → Tenant administration → Intune add-ons

---

## Comparatif commercial — Arguments de vente

| Situation client | Recommandation |
|-----------------|---------------|
| Client M365 E3, besoin gestion basique MDM | **Intune Plan 1 inclus** — rien à vendre |
| Client M365 E3, besoin helpdesk remote | **Intune Plan 2 add-on** (+Remote Help) |
| Client avec employés sans droits admin, sécurité élevée | **Intune Suite** (EPM = zero admin rights) |
| Client avec beaucoup de certificats internes | **Intune Suite** (Cloud PKI) |
| Client gérant kiosques / tablettes partagées | **Device-only license** |
| Client M365 E5 | Vérifier si Intune Suite inclus — souvent déjà couvert |

---

## Pricing de référence (juin 2026)

| Plan | Prix indicatif |
|------|---------------|
| Intune Plan 1 | Inclus dans M365 E3/E5 (~$36-57/user/mois M365) |
| Intune Plan 2 | ~$8/user/mois add-on |
| Intune Suite | ~$10/user/mois add-on |

> Vérifier tarifs exacts sur Microsoft Intune plans and pricing : https://aka.ms/MicrosoftIntunePricing

---

## Sources
- https://learn.microsoft.com/en-us/mem/intune/fundamentals/licenses
- https://learn.microsoft.com/en-us/mem/intune/fundamentals/advanced-capabilities
- https://aka.ms/MicrosoftIntunePricing
