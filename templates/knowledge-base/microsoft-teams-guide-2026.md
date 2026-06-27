# Microsoft Teams : Guide complet 2026

*Source : Microsoft Learn (learn.microsoft.com/microsoftteams) : Mis à jour juin 2026*

---

## 1. QU'EST-CE QUE MICROSOFT TEAMS ?

Microsoft Teams est la plateforme de collaboration centrale de Microsoft 365. Elle réunit chat, réunions, appels, fichiers et applications dans une interface unique, accessible sur desktop (Windows, Mac), mobile (iOS, Android) et web.

Teams est inclus dans la quasi-totalité des plans Microsoft 365 Business et Enterprise. Pour les organisations qui ont besoin de fonctionnalités avancées, deux add-ons sont disponibles : **Teams Premium** et **Teams Phone**.

---

## 2. FONCTIONNALITÉS DE BASE TEAMS (incluses dans M365)

### 💬 Chat et Canaux
- Chat 1:1 et chat de groupe (persistant, avec historique)
- Canaux d'équipe : Standard, Privés, Partagés
- Fil de conversation, @mentions, réactions
- Traduction de messages en temps réel (IA)
- Accès invités externes (Guest Access) et utilisateurs fédérés
- Partage de fichiers dans Teams → stocké automatiquement sur SharePoint

### 📹 Réunions et Conférences
- Réunions jusqu'à 1 000 participants (mode interactif)
- Mode Live Events : jusqu'à 10 000 spectateurs
- Transcription automatique des réunions (Speech-to-Text)
- Résumé de réunion et liste des points d'action (IA)
- Partage d'écran, tableau blanc collaboratif, sondages
- Sous-titres en direct (60 langues)
- Salles de réunion (Breakout Rooms) : jusqu'à 50 salles
- Vue Together Mode et personnalisation des arrière-plans
- Microsoft Teams Rooms : solution pour salles physiques

### 📁 Fichiers et Collaboration
- Intégration SharePoint et OneDrive : co-édition en temps réel
- Toutes les apps Microsoft 365 (Word, Excel, PowerPoint) dans Teams
- Bibliothèques de fichiers d'équipe par canal
- Synchronisation OneDrive pour accès hors ligne

### 📲 Apps et Intégrations
- +1 400 applications tierces disponibles (AppSource)
- Power Apps, Power Automate, Power BI natifs dans Teams
- Bots et connecteurs personnalisables
- Intégration avec Dynamics 365, ServiceNow, SAP, Salesforce
- Copilot Studio : créer des agents IA personnalisés dans Teams

---

## 3. MICROSOFT TEAMS PREMIUM : Add-on IA et Sécurité

**Prix** : Add-on payant (en plus de la licence Teams incluse dans M365)
**Important** : Depuis le 1er avril 2026, certaines fonctionnalités précédemment Teams Premium exclusives ont été intégrées dans **Teams Enterprise** (inclus dans M365 E3/E5). Teams Premium conserve les fonctionnalités avancées.

### 🤖 Fonctionnalités IA (Teams Premium)
| Fonctionnalité | Description |
|---------------|-------------|
| **Intelligent Meeting Recap** | Résumé personnalisé post-réunion avec chapitres, actions, qui a dit quoi |
| **Live Translated Captions** | Sous-titres traduits en temps réel (langue de préférence de chaque participant) |
| **Live Translated Transcripts** | Transcription traduite en temps réel |
| **Intelligent Call Recap** | IA appliquée aux appels PSTN et appels Teams 1:1 (nécessite aussi Teams Phone) |
| **Decorate My Background** | IA pour embellir l'arrière-plan (suppression bruit, décoration) |

### 🛡️ Protection avancée des réunions (Teams Premium)
- **End-to-End Encryption (E2EE)** : Chiffrement bout en bout via sensitivity label
- **Watermarking** : Filigrane avec email du participant pour réunions confidentielles
- **Sensitivity Labels** : Contrôle via Purview (lobby, chat, enregistrement, présentation)
- **Restrict Chat Copy/Forward** : Empêcher copie/transfert des messages de réunion
- **Screen Sharing Detection** : Alerte si contenu sensible détecté à l'écran
- **Real-time Telemetry** : Alertes qualité audio/vidéo/partage en temps réel

### 🎨 Personnalisation (Teams Premium)
- **Meeting Templates** : Templates organisationnels pour imposer des paramètres de réunion
- **Meeting Themes** : Thèmes visuels avec logo de l'organisation (invitation, lobby, réactions)
- **Custom Meeting Backgrounds** : Arrière-plans personnalisés à l'échelle de l'org
- **Custom Together Mode Scenes** : Scènes Together Mode brandées

### 📊 Virtual Appointments & Bookings (Teams Premium)
- Queue de rendez-vous (file d'attente clients)
- Notifications SMS aux clients
- Analytics d'utilisation avancées (Bookings + Virtual Appointments)

### 📞 Queues App (Teams Premium + Teams Phone)
- Gestion des files d'appel (Call Queues) et Auto Attendants depuis Teams client
- Métriques en temps réel : appels en attente, durée d'attente moyenne
- Reporting historique (27 derniers jours)
- Monitor, Whisper, Barge, Takeover : supervision des agents par les managers

---

## 4. MICROSOFT TEAMS PHONE : Téléphonie Cloud

Teams Phone transforme Teams en système téléphonique d'entreprise complet, remplaçant les PBX traditionnels.

### Ce que fait Teams Phone
- Appels entrants/sortants vers le réseau téléphonique public (PSTN)
- Auto Attendants (SVI/accueil automatique)
- Call Queues (files d'appel)
- Messagerie vocale cloud
- Transfert, mise en attente, parking d'appel
- Enregistrement des appels
- Plans d'appel géographiques (locaux, nationaux, internationaux)
- Compatibilité avec tous les clients Teams (desktop, mobile, web)
- Support des téléphones certifiés Teams (Poly, Yealink, Cisco, etc.)

### Options de connexion PSTN
| Option | Description | Idéal pour |
|--------|-------------|------------|
| **Microsoft Calling Plans** | Microsoft fournit les numéros et l'accès PSTN directement | Déploiements simples, pas d'infrastructure existante |
| **Direct Routing** | Connecter votre propre opérateur via SBC (Session Border Controller) | Organisations avec contrats opérateurs existants |
| **Operator Connect** | Opérateur certifié Microsoft s'intègre directement dans Teams Admin Center | Simplicité + opérateur préféré |
| **Teams Phone Mobile** | Numéro SIM = numéro Teams : appels mobiles natifs dans Teams | Commerciaux, travailleurs nomades |

### Licences Teams Phone
- **Teams Phone Standard** : ~$10/user/mois (add-on E3/E5)
- **Teams Phone with Calling Plan** : Bundle licence + forfait appels
- **Teams Phone Mobile** : Licence Teams Phone + plan mobile opérateur certifié
- Inclus dans **Microsoft 365 E5** (Teams Phone System inclus : forfait appels séparé)

---

## 5. MICROSOFT TEAMS POUR CAS D'USAGE SPÉCIFIQUES

### Éducation
- Teams for Education : classes virtuelles, devoirs, notes
- Protections spécifiques pour la sécurité des étudiants

### Santé (Healthcare)
- Virtual Appointments pour consultations patient-médecin
- Conformité HIPAA, messages sécurisés entre cliniciens

### Commerce (Retail)
- Turnovers de poste, formations en magasin
- Communication entre siège et points de vente

### Secteur public
- Déploiements GCC (Government Community Cloud) et GCC High
- Conformité FedRAMP, DoD

---

## 6. DÉPLOIEMENT ENTERPRISE TEAMS

### Phases de déploiement recommandées
1. **Pilot** : Démarrage avec groupe restreint (20-50 users)
2. **Prepare** : Infrastructure (réseau, endpoints) + change management
3. **Deploy** : Déploiement par vagues (par département/région)
4. **Adopt** : Formation, Champions Program, adoption resources

### Prérequis réseau
- Bande passante : 1.2 Mbps montant+descendant par appel HD
- QoS (Quality of Service) recommandé pour trafic voix/vidéo
- Ports TCP 80/443 + UDP 3478-3481 à ouvrir
- Network Assessment Tool disponible pour validation

### FastTrack
Microsoft propose le programme **FastTrack** pour accélérer le déploiement Teams :
- Ingénieurs Microsoft dédiés
- Guidance onboarding, migration, adoption
- Gratuit pour licences éligibles (150+ seats)

---

## 7. GOUVERNANCE ET SÉCURITÉ TEAMS

- **Politique de création d'équipes** : Limiter qui peut créer des équipes
- **Guest Access** : Configurer l'accès des utilisateurs externes
- **External Access (Federation)** : Communiquer avec d'autres organisations Teams
- **Data Loss Prevention (DLP)** : Via Microsoft Purview dans Teams
- **eDiscovery** : Recherche légale sur messages, fichiers, enregistrements
- **Retention Policies** : Durée de conservation des messages
- **Sensitivity Labels** : Classification et protection des réunions et canaux
- **Conditional Access** : Intégration Azure AD pour contrôle d'accès contextuel

---

## 8. QUESTIONS DE DÉCOUVERTE COMMERCIALE TEAMS

### Douleurs courantes à identifier
- "Combien d'outils de communication utilisent vos équipes aujourd'hui ?" (email, Slack, Zoom, téléphone fixe...)
- "Avez-vous des travailleurs en déplacement ou hors bureau qui ont du mal à rester connectés ?"
- "Votre système téléphonique actuel est-il maintenu/vieillissant ?"
- "Avez-vous des réunions client confidentielles qui nécessitent un niveau de sécurité renforcé ?"
- "Combien coûte votre contrat téléphonique actuel par utilisateur/mois ?"

### ROI et chiffres clés à citer
- Réduction jusqu'à **60%** des coûts de communication vs. systèmes traditionnels
- Productivité réunions : **2x moins de temps** en post-meeting avec l'IA Recap
- Adoption en entreprise : **320 millions d'utilisateurs actifs quotidiens** (Teams, 2025)
- Teams Phone : remplacement PBX en quelques semaines vs. mois pour systèmes on-prem

---

## 9. POSITIONNEMENT CONCURRENTIEL

| Concurrent | Différenciateur Teams |
|-----------|----------------------|
| **Slack** | Téléphonie intégrée, réunions vidéo, SharePoint, sécurité Enterprise |
| **Zoom** | Collaboration fichiers native, Dynamics/M365 intégration, économie de licence |
| **Google Meet/Chat** | Écosystème Windows/Office natif, gouvernance Purview, conformité |
| **Cisco Webex** | Interface unifiée (pas besoin de systèmes séparés), Power Platform |

---

*Source : learn.microsoft.com/microsoftteams : Mise à jour : Juin 2026*
