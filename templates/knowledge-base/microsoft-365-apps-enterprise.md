# Microsoft 365 Apps — Guide Enterprise 2026

*Source : Microsoft Learn (learn.microsoft.com/microsoft-365-apps) — Mis à jour juin 2026*

---

## 1. QU'EST-CE QUE MICROSOFT 365 APPS FOR ENTERPRISE ?

**Microsoft 365 Apps for Enterprise** est la suite d'applications de productivité de bureau Microsoft, fournie sous forme d'abonnement cloud avec mises à jour continues. Elle remplace l'ancien "Office 365 ProPlus".

### Applications incluses

| Application | Plateforme | Usage principal |
|-------------|-----------|----------------|
| **Microsoft Word** | Windows, Mac, Web, Mobile | Traitement de texte, rédaction de documents |
| **Microsoft Excel** | Windows, Mac, Web, Mobile | Tableurs, analyse de données, formules avancées |
| **Microsoft PowerPoint** | Windows, Mac, Web, Mobile | Présentations professionnelles |
| **Microsoft Outlook** | Windows, Mac, Web, Mobile | Email, calendrier, contacts, tâches |
| **Microsoft OneNote** | Windows, Mac, Web, Mobile | Prise de notes collaborative |
| **Microsoft Access** | Windows uniquement | Bases de données desktop (Enterprise) |
| **Microsoft Publisher** | Windows uniquement | Publications et mise en page |
| **Microsoft Teams** | Windows, Mac, Web, Mobile | Collaboration (inclus dans M365) |
| **Microsoft OneDrive** | Windows, Mac, Web, Mobile | Stockage cloud (1 TB par utilisateur) |
| **Microsoft SharePoint** | Web | Intranet, gestion de contenu d'équipe |

### Capacités IA incluses avec M365 Copilot
Avec la licence Microsoft 365 Copilot ($30/user/mois) ajoutée :
- Copilot dans Word : rédaction, révision, résumé IA
- Copilot dans Excel : analyse en langage naturel, génération de formules
- Copilot dans PowerPoint : création de présentations depuis un prompt ou document
- Copilot dans Outlook : résumé de fils de discussion, rédaction d'emails
- Copilot dans OneNote : organisation et résumé de notes
- Microsoft 365 Copilot Chat : assistant IA cross-app ancré dans les données M365

---

## 2. PLANS INCLUANT MICROSOFT 365 APPS

| Plan | Apps Desktop incluses | Licence par |
|------|-----------------------|-------------|
| **M365 Apps for Business** | ✅ Oui (Word, Excel, PPT, Outlook, Teams, OneDrive) | $8.25/user/mois |
| **M365 Business Standard** | ✅ Oui | $12.50/user/mois |
| **M365 Business Premium** | ✅ Oui | $22.00/user/mois |
| **M365 Apps for Enterprise** | ✅ Oui (version Enterprise) | Licence séparée |
| **M365 E3** | ✅ Oui | $36/user/mois |
| **M365 E5** | ✅ Oui | $57/user/mois |
| **M365 F1 (Frontline)** | ❌ Non (web/mobile uniquement) | $2.25/user/mois |
| **M365 F3 (Frontline)** | ❌ Non (web/mobile uniquement) | $8/user/mois |
| **Office LTSC 2024** | ✅ Oui (version perpétuelle, sans updates IA) | Achat unique |

> **Note importante** : Les plans Frontline (F1/F3) n'incluent **pas** les apps desktop Word/Excel/PowerPoint. Ils offrent uniquement les versions web et mobile.

---

## 3. CANAUX DE MISE À JOUR (UPDATE CHANNELS)

Microsoft 365 Apps reçoit des mises à jour continues selon 3 canaux principaux :

| Canal | Fréquence | Idéal pour | Recommandation |
|-------|-----------|------------|----------------|
| **Current Channel** | Dès que prêt (pas de calendrier fixe) | Early adopters, power users | ✅ Recommandé pour la majorité |
| **Monthly Enterprise Channel** | Le 2e mardi de chaque mois (mensuel) | Organisations voulant de la prévisibilité | ✅ Recommandé avec Cloud Update |
| **Semi-Annual Enterprise Channel** | Janvier + Juillet (semestriel) | Environnements nécessitant des tests approfondis | Pour systèmes critiques uniquement |

### Cloud Update (Monthly Enterprise Channel)
Microsoft propose **Cloud Update**, un service cloud de gestion des mises à jour :
- Déploiement en vagues automatiques pour préserver la bande passante
- Monitoring avancé et reporting de progression
- Validation des updates (update validation)
- Rollback en cas de problème
- Recommandé avec Monthly Enterprise Channel

---

## 4. OPTIONS DE DÉPLOIEMENT

### Option 1 : Auto-installation depuis Office.com (le plus simple)
- Utilisateurs installent depuis portal.office.com → Apps → Install
- Minimal admin overhead
- Requiert droits admin local sur le poste
- Adapté : PME, organisations avec peu de contrôle nécessaire

### Option 2 : Microsoft Intune (recommandé Enterprise)
- Déploiement et configuration centralisés via Intune
- Policies ADMX pour contrôler les paramètres
- Compatible avec Conditional Access Azure AD
- Adapté : organisations gérant des flottes d'appareils

### Option 3 : Configuration Manager (SCCM)
- Téléchargement depuis sources locales (Distribution Points)
- Réduit la charge réseau internet
- Plus de complexité administrative
- Adapté : grandes organisations avec infrastructure on-prem

### Option 4 : Office Deployment Tool (ODT)
- Outil en ligne de commande pour scénarios personnalisés
- Permet installation depuis source locale ou cloud
- Packaging avancé (langues, architecture 32/64 bits)
- Adapté : cas spéciaux, environnements sans SCCM/Intune

### Bonnes pratiques Microsoft
- **Déployer depuis le cloud via Intune** dans la majorité des cas
- Construire le minimum de packages (réduire la complexité)
- Utiliser le **Office Customization Tool** (OCT) pour créer les packages
- Activer le **Shared Computer Activation** pour environnements VDI/partagés

---

## 5. ARCHITECTURE ET PRÉREQUIS

### Prérequis système
- **Windows** : Windows 10/11 (64 bits recommandé)
- **macOS** : Trois dernières versions de macOS
- **RAM** : 4 GB minimum, 8 GB recommandé
- **Espace disque** : 4 GB pour l'installation
- **Résolution** : 1280x768 minimum

### Architecture (32 vs 64 bits)
- **64 bits recommandé** dans la quasi-totalité des cas
- Excel 64 bits gère des fichiers plus volumineux (>2 GB)
- 32 bits uniquement si add-ins COM/VBA 32 bits incompatibles 64 bits

### Installation multi-produits sur le même poste
- Microsoft 365 Apps + Project (abonnement) : ✅ Supporté
- Microsoft 365 Apps + Visio (abonnement) : ✅ Supporté
- Microsoft 365 Apps + Office LTSC 2024 sur le même poste : ⚠️ Scénarios limités uniquement

---

## 6. FONCTIONNALITÉS AVANCÉES ENTERPRISE

### Partage d'ordinateur (Shared Computer Activation)
- Permet à plusieurs utilisateurs de se connecter sur le même poste (VDI, shift workers)
- Chaque utilisateur voit ses apps activées avec sa licence personnelle
- Essentiel pour : hôtels d'entreprise, postes partagés, VDI (Citrix, AVD)

### Microsoft 365 Apps Admin Center
- Gestion centralisée des politiques Office
- Monitoring de l'état des apps sur tous les devices
- Security Baseline : configurations de sécurité recommandées
- Health dashboard : état des déploiements et mises à jour

### Langues
- Plus de 90 langues disponibles
- Déploiement de langues par région automatique
- Packs de langue additionnels installables par les utilisateurs

---

## 7. OFFICE LTSC 2024 — VERSION PERPÉTUELLE

Pour les organisations qui ne peuvent pas migrer vers le cloud ou qui ont des besoins spécifiques (déconnecté, conformité stricte) :

| Caractéristique | Office LTSC 2024 | Microsoft 365 Apps |
|----------------|------------------|-------------------|
| **Modèle** | Achat unique (perpétuel) | Abonnement mensuel |
| **Mises à jour** | Sécurité uniquement | Fonctionnalités + sécurité |
| **Copilot IA** | ❌ Non | ✅ Oui (avec licence Copilot) |
| **Nouvelles fonctions** | ❌ Figées à la date de lancement | ✅ Continues (Current Channel) |
| **Cloud** | ❌ Pas requis | ✅ Requis (activation cloud) |
| **Disponibilité** | Depuis fin 2024 | Toujours disponible |

**Recommandation** : Sauf contrainte réglementaire forte, Microsoft 365 Apps Enterprise (abonnement) est largement préférable pour bénéficier des innovations IA continues.

---

## 8. MICROSOFT VISIO ET PROJECT (ADD-ONS)

Ces deux produits ne sont pas inclus dans Microsoft 365 Apps et nécessitent des licences séparées :

### Microsoft Visio
| Plan | Prix | Inclut |
|------|------|--------|
| **Visio Plan 1** | ~$5/user/mois | Web uniquement |
| **Visio Plan 2** | ~$15/user/mois | Desktop + web + Visio pour le web |

### Microsoft Project
| Plan | Prix | Inclut |
|------|------|--------|
| **Project Plan 1** | ~$10/user/mois | Web uniquement (tâches, gestion basique) |
| **Project Plan 3** | ~$30/user/mois | Desktop + web, feuilles de route, rapports |
| **Project Plan 5** | ~$55/user/mois | Tout + gestion de portfolio, resource management |

---

## 9. QUESTIONS DE DÉCOUVERTE COMMERCIALE M365 APPS

### Douleurs à identifier
- "Utilisez-vous encore des versions d'Office perpétuelles (2016, 2019, 2021) ?"
- "Vos employés ont-ils accès à Office sur leurs appareils mobiles et personnels ?"
- "Avez-vous des problèmes de compatibilité de fichiers avec des partenaires qui utilisent des versions différentes d'Office ?"
- "Des utilisateurs Excel avec des gros fichiers ont-ils des problèmes de performance ?"
- "Gérez-vous des projets complexes ? Avez-vous un outil de gestion de projet ?"

### Arguments migration vers M365 Apps
- **Sécurité** : Office 2016/2019 = vulnérabilités non patchées → risque cyber
- **IA** : Seul M365 Apps permet d'activer Copilot IA — pas l'Office perpétuel
- **Coût TCO** : Licences perpétuelles + maintenance IT > abonnement M365 sur 3 ans
- **Flexibilité** : Installation sur 5 appareils par utilisateur (PC, Mac, tablette, mobile)

---

*Source : learn.microsoft.com/microsoft-365-apps — Mise à jour : Juin 2026*
