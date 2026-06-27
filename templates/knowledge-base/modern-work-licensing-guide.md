# Modern Work + Security Licensing Guide (SCIM+P)
*Source : Microsoft Modern Work Licensing Deck : PEJ-00008 (Oct 2024)*

---

## 1. Vue d'ensemble : Disponibilité des plans par canal

### Plans Enterprise (Information Workers)
| Plan | CSP | MCA-E | EA/EAS |
|------|-----|-------|--------|
| Microsoft 365 Apps for enterprise | ● | ● | ● |
| Microsoft 365 E3 (no Teams) | ● | ● | ● |
| Microsoft 365 E5 (no Teams) | ● | ● | ● |
| Office 365 E1/E3/E5 (no Teams) | ● | ● | ● |

### Plans Frontline Workers
| Plan | CSP | MCA-E | EA/EAS |
|------|-----|-------|--------|
| Microsoft 365 F1 | ● | ● | ● |
| Microsoft 365 F3 | ● | ● | ● |

### Plans SMB (300 users max)
| Plan | Canal |
|------|-------|
| Business Basic/Standard/Premium | CSP uniquement |

---

## 2. Changements packaging Teams (EEA vs non-EEA)

### Points communs toutes régions
- Les suites Enterprise avec Teams (O365 E1/E3/E5, M365 E3/E5) sont **en fin de vente** pour les nouveaux clients
- Les clients existants avec Teams gardent leur accès jusqu'à la fin de leur abonnement

### Différences régionales
| Région | SKU sans Teams | Cutoff date |
|--------|---------------|-------------|
| EEA + Suisse | "EEA (no Teams)" | 1er Oct 2023 |
| Reste du monde | "(no Teams)" | 1er Avr 2024 |

### Teams standalone
- **EEA** : Microsoft Teams EEA ($5.25/u/m)
- **Non-EEA** : Microsoft Teams Enterprise ($5.25/u/m)

---

## 3. Microsoft 365 E5 : Valeur ajoutée vs E3

M365 E5 ajoute 4 piliers sur M365 E3 :

| Pilier | Ce qui est ajouté |
|--------|------------------|
| **Security** | Defender for Endpoint P2, Defender for Identity, Defender for Cloud Apps, Entra ID P2 |
| **Compliance** | Purview Information Protection, DLP avancé, eDiscovery Premium, Insider Risk Management |
| **Calling & Meetings** | Teams Phone Standard inclus + Audio Conferencing (60 min dial-out Zone A) |
| **Analytics** | Power BI Pro inclus |

### Chemins flexibles E3 → E5
Les clients peuvent ajouter la valeur E5 par composant ou faire un step-up complet :

| Option | Prix USD ERP |
|--------|-------------|
| M365 E5 Security | $12/u/m |
| M365 E5 Compliance | $12/u/m |
| Audio Conferencing (w/ dial-out USA/CAN) | $0/u/m |
| Audio Conferencing (legacy, Zone A) | $2.50/u/m |
| Teams Phone Standard | $8/u/m |
| Power BI Pro | $10/u/m |
| **Step-up E3 → E5 complet** | **$21/u/m** |

### Scénarios upsell E3 → E5

**Scénario 1 : Client veut E5 Security + E5 Compliance ($24)**
→ Step-up E5 complet ($21) = économie $3 + Teams Phone Standard + Power BI Pro inclus !

**Scénario 2 : Client veut E5 Security + Power BI Pro ($22)**
→ Step-up E5 complet ($21) = économie $1 + E5 Compliance + Teams Phone Standard + Audio Conf inclus !

**Scénario 3 : Client veut E5 Security + Audio Conf + Teams Phone Standard ($22.50)**
→ Step-up E5 complet ($21) = économie $1.50 + E5 Compliance + Power BI Pro inclus !

---

## 4. Microsoft 365 E5 Security : Détail ($12/u/m)

Contient les 7 composants suivants :

| Composant | Description |
|-----------|-------------|
| **Defender for Office 365 Plan 2** | Protection email zero-day, automated investigation, attack simulator |
| **Defender for Cloud Apps** | CASB multimode : visibilité, contrôle data, analytics cyberthreats cloud |
| **Microsoft Entra ID P2** | Risk-based Conditional Access + Privileged Identity Management |
| **Defender for Identity** | Détection menaces avancées via signaux Active Directory on-premises |
| **Defender for Endpoint Plan 2** | EDR, TVM, ASR, automated investigation, threat hunting géré |
| **Safe Documents** | Scan documents Office avant ouverture (via Defender for Endpoint) |
| **Application Guard for Office 365** | Isolation documents non fiables dans sandbox sécurisé |
| **Defender for IoT – Enterprise IoT** | 5 devices IoT couverts/licence, $0.85/device/mois supplémentaire |

*Uniquement disponible via M365 E5 ou M365 E5 Security.*

---

## 5. Microsoft 365 E5 Compliance : Détail ($12/u/m)

Trois sous-suites :

### Information Protection & Governance ($7/u/m standalone)
- Purview Data Lifecycle & Records Management
- Purview DLP (Data Loss Prevention)
- Purview Information Protection (labels de sensibilité)
- Purview Message Encryption
- Defender for Cloud Apps ($3.50)
- Purview Customer Key
- Purview Data Connectors

### Insider Risk Management ($6/u/m standalone)
- Purview Customer Lockbox
- Purview Communication Compliance
- Purview Privileged Access Management
- Purview Insider Risk Management
- Purview Information Barriers

### eDiscovery & Audit ($6/u/m standalone)
- Purview eDiscovery (Premium)
- Purview Audit (Premium)

*Prérequis : M365 E3/A3 ou [O365 E3/A3 + EMS E3]*

---

## 6. Microsoft Intune Suite : Packaging ($10/u/m)

| Composant | Prix standalone | Description |
|-----------|----------------|-------------|
| Intune Remote Help | $3.50 | Assistance distante sécurisée IT/helpdesk/users |
| Intune Endpoint Privilege Management | $3.00 | Élévation contrôlée droits utilisateurs standard Windows |
| Intune Advanced Analytics | $5.00 | Anomaly detection, device timeline, device query |
| Intune Enterprise Application Management | $2.00 | Catalogue ~500 apps Windows auto-gérées par Microsoft |
| Microsoft Cloud PKI | $2.00 | Certificats cloud pour auth app, Wi-Fi/VPN, S/MIME, NAC |
| **Intune Plan 2** | $4.00 | Tunnel MAM + gestion Specialty Devices + firmware OTA |

*Prérequis : Microsoft Intune Plan 1 (inclus dans M365 Business Premium/E3/E5/F1/F3)*

---

## 7. Microsoft Entra Suite : Packaging ($12/u/m)

| Composant | Prix standalone | Description |
|-----------|----------------|-------------|
| Entra ID Governance | $7/u/m | Gouvernance identités avancée |
| Face Check with Entra Verified ID | $0.25/utilisation | 8 Face Checks/mois inclus, puis $0.25/vérification |
| Entra Internet Access | $5/u/m | Sécurise accès SaaS et internet, protège contre menaces |
| Entra Private Access | $5/u/m | ZTNA identity-centric pour apps privées depuis n'importe où |
| Entra ID Protection | Inclus* | Détection/investigation/remédiation risques identité |

*Entra ID Protection inclus dans Entra ID P2 et Entra Suite (pas en standalone)*
*Prérequis : Microsoft Entra ID P1*

---

## 8. Plans Frontline Workers (FLW)

### Comparaison M365 F1 vs F3

| Feature | M365 F1 | M365 F3 |
|---------|---------|---------|
| Prix | ~$2.25/u/m | ~$8/u/m |
| Microsoft Intune | ● | ● |
| Entra ID P1 | ● | ● |
| Microsoft Teams | ● | ● |
| Shifts, Tasks, Walkie Talkie | ● | ● |
| Yammer, SharePoint | ● | ● |
| Office Web (lecture seule) | Lecture seule | ● |
| Exchange email | ✗ (calendrier seulement) | 2 GB (POP3) |
| Windows 10 E3 | ✗ | ● |
| Power Apps/Automate | ✗ | ● (2000 req/jour) |

### F5 Security & Compliance : Add-ons FLW

| Suite | Prix | Contenu |
|-------|------|---------|
| F5 Security | $8/u/m | Defender for Office 365 P2, Cloud Apps, Endpoint P2, Defender for Identity, Entra ID P2 (-72% vs standalone $28.20) |
| F5 Compliance | $8/u/m | Info Protection & Governance, Insider Risk, eDiscovery & Audit, Purview DLP, Exchange Archiving (-58% vs standalone $19) |
| F5 Security + Compliance | $13/u/m | Tout ci-dessus combiné |

### F5 Compliance Mini-Suites
| Suite | Prix | vs Standalone E5 |
|-------|------|-----------------|
| F5 Information Protection & Governance | $5/u/m | -33% vs $7 |
| F5 Insider Risk Management | $4/u/m | -33% vs $6 |
| F5 eDiscovery and Audit | $4/u/m | -33% vs $6 |

### Restrictions licence FLW
- **Assignation** : Device principal < 10.9" OU device partagé avec d'autres utilisateurs F1/F3
- **Office Mobile** : Uniquement pour devices < 10.9" (F3 inclus)
- **SharePoint/Yammer** : Pas administrateur, pas de site mailbox, pas de personal site
- **Power Apps/Automate** : 2000 API requests/jour max (F3 seulement)

---

## 9. Plans SMB : Microsoft 365 Business (300 users max)

### Comparaison plans Business

| Feature | Basic | Standard | Premium |
|---------|-------|----------|---------|
| Desktop Apps (Word/Excel/PPT) | ✗ | ● | ● |
| Microsoft Teams | ● | ● | ● |
| Exchange 50 GB | ● | ● | ● |
| SharePoint Plan 1 | ● | ● | ● |
| OneDrive 1 TB | ● | ● | ● |
| Microsoft Defender for Business | ✗ | ✗ | ● |
| Microsoft Intune Plan 1 | ✗ | ✗ | ● |
| Entra ID P1 | ✗ | ✗ | ● |
| Azure Information Protection P1 | ✗ | ✗ | ● |
| BitLocker | ✗ | ✗ | ● |
| Windows 11 Business | ✗ | ✗ | ● |
| Conditional Access | ✗ | ✗ | ● |

**Différenciateur clé Business Premium** : Threat protection (Defender) + Intune + Entra ID P1 → Solution complète endpoint security pour PME.

---

## 10. Teams Licensing : Voice Services

### Teams Phone Standard
- **Prix** : $8/u/m commercial ; $4/u/m FLW
- **Ce que ça inclut** : PBX cloud, call handling, IP desk phones, call park, voicemail, auto attendant
- **Prérequis** : Microsoft Teams (via suite ou standalone)
- **FLW** : Prérequis M365 F1/F3 ou O365 F3

### Calling Plans disponibles
| Plan | Prix US/PR/CA/UK | Prix autres marchés |
|------|-----------------|---------------------|
| Pay-as-you-go | $3/u/m (US) / $2/u/m (Zone 1) / $3/u/m (Zone 2) | Variable |
| Domestic 120 min | $6/u/m | $6/u/m |
| Domestic Plan | $8/u/m | $12/u/m |
| International (+ Domestic) | $24/u/m | $24/u/m |

### Audio Conferencing
| Option | Prix | Dial-out inclus |
|--------|------|----------------|
| Audio Conf w/ dial-out USA/CAN | **$0/u/m** | 60 min/u/mois → US/Canada uniquement |
| Audio Conf (legacy) | $2.50/u/m | 60 min/u/mois → tous pays Zone A |
| Extended Dial-out USA/CAN | $4/u/m | Illimité US/Canada (50k min max) |

*Note : Le SKU $0 doit être acquis et assigné manuellement : il n'est PAS ajouté automatiquement.*

### Teams Phone with Calling Plan (bundle)
| Zone utilisateur | Prix |
|-----------------|------|
| US/Puerto Rico | $15/u/m (ou $20 sans bundle) |
| UK/Canada | $15/u/m |
| Autres marchés | $20/u/m |

### Teams Rooms
| Licence | Prix | Limite |
|---------|------|--------|
| Teams Rooms Basic | $0/room/mois | 25 salles max |
| Teams Rooms Pro | $40/room/mois | Illimité |

Teams Rooms Pro inclut : Teams Phone Standard, Intune, Entra ID P1, Defender for Endpoint P2, Pro Management.

---

## 11. Microsoft 365 Copilot ($30/u/m)

- Combine LLMs + Microsoft Graph (calendrier, emails, chats, documents, meetings)
- **Disponible** : EA, MCA-E, CSP, Buy Online (NCE)
- **Prérequis** : M365 E3/E5/F1/F3, O365 E1/E3/E5/F3, Business Basic/Standard/Premium, Teams Essentials/Enterprise/EEA
- **Non disponible** : M365 F3 FLW (note importante)
- Inclut Copilot Studio pour créer des plugins Microsoft 365 Copilot

---

## 12. Microsoft Viva Suite : Pricing & Features

### Tarification
| Offre | Prix commercial | Prix faculty |
|-------|----------------|-------------|
| Viva Suite complet | $12/u/m | $2.25/u/m |
| Viva Workplace Analytics & Employee Feedback | $6/u/m | : |
| Viva Employee Communications & Communities | $2/u/m (intro) | : |
| Viva Learning | $4/u/m | $1/u/m |
| Viva Insights | $4/u/m | $1/u/m |
| Viva Goals | $6/u/m | $1.20/u/m |
| Viva Glint | $2/u/m | : |
| Viva Pulse | $2/u/m | : |

### Ce qui est inclus dans M365 (sans Viva payant)
- **M365 F1/F3/E3** : Viva Learning basique (Teams app, création onglets, search/share, Microsoft Learn + 125 cours LinkedIn Learning), Viva Engage (Communities, Conversations, Storyline), Viva Connections, Personal Insights (E3/O365 E1+)
- **M365 E5** : + Advanced Security Viva Engage, Premium Personal Insights

### Ce qui nécessite Viva Suite/add-on
- Course recommendations & tracking LMS
- Integration 3rd party content providers
- Manager & Leader insights
- Analyst workbench (illimité depuis Avril 2022)
- Leadership Corner, AMAs, Storyline Delegate Posting
- Viva Amplify (campaign management)
- Answers in Viva
- OKRs (Viva Goals)
- Employee engagement surveys (Viva Glint)

---

## 13. Step-ups Volume Licensing (EA/EAS)

### Principe
- **Step-up SKU** = différence de prix entre plan bas et plan haut
- Utilisable **à tout moment** pendant le terme EA
- Au renouvellement : remplacer base + step-up par USL complet

### Top Step-ups commerciaux
| De → Vers | SKU | Prix step-up |
|-----------|-----|-------------|
| O365 E3 → M365 E3 | AAD-86538 | $13/u/m |
| EMS E3 → M365 E3 | AAD-86550 | : |
| M365 F3 → M365 E3 | AAD-33120 | : |
| M365 E3 → M365 E5 | AAD-33237 | $21/u/m |
| O365 E5 → M365 E5 | AAD-86532 | : |
| M365 E3 → M365 E5 Security | PEJ-00002 | $12/u/m |
| M365 E3 → M365 E5 Compliance | PEP-00002 | $12/u/m |
| Defender for Office 365 P1 → P2 | FSZ-00004 | : |
| Defender for Endpoint P1 → P2 | QLS-00007 | : |
| Viva Learning → Viva Suite | IM3-00008 | : |
| Viva Insights → Viva Suite | IM3-00009 | : |

### Standard vs Non-standard Base License
- **Standard** : Le SKU de base est mappé automatiquement au step-up dans les systèmes commerce → commande simplifiée
- **Non-standard** : Commande manuelle requise ; licenses stepped-up assignables UNIQUEMENT aux users du plan de base

---

## 14. Add-on Subscriptions Security & Compliance (Enterprise)

### E5 Security Add-ons (sur base M365 E3)
| Add-on | Disponibilité |
|--------|--------------|
| Microsoft 365 E5 Security | $12/u/m |
| Microsoft 365 E5 Compliance | $12/u/m |
| M365 E5 Info Protection & Governance | $7/u/m |
| M365 E5 Insider Risk Management | $6/u/m |
| M365 E5 eDiscovery & Audit | $6/u/m |

### Defender Standalone Add-ons
| Add-on | Notes |
|--------|-------|
| Defender for Identity | $5.50/u/m standalone |
| Defender for Office 365 Plan 1 | Inclus Business Premium & O365 E3 |
| Defender for Office 365 Plan 2 | Inclus M365 E5 Security |
| Defender for Cloud Apps | CASB multimode |
| Defender for Endpoint Plan 1 | Inclus M365 E3 |
| Defender for Endpoint Plan 2 | Inclus M365 E5/E5 Security/Windows E5 |
| Defender Vulnerability Management (standalone) | Add-on universel |

### Microsoft Entra Add-ons
| Add-on | Notes |
|--------|-------|
| Entra ID Plan 1 | Inclus M365 E3/F1/F3 et Business Premium |
| Entra ID Plan 2 | Inclus M365 E5 Security |
| Entra ID Governance | Prérequis Entra ID P1 |
| Entra Suite | $12/u/m, prérequis Entra P1 |
| Entra Internet Access | $5/u/m |
| Entra Private Access | $5/u/m |
| Entra Internet/Private Access for FLW | $3.35/u/m chacun |
| 10-year Audit Log Retention | Add-on, inclus M365 E5 |

### Microsoft Intune Add-ons
| Add-on | Prix | Notes |
|--------|------|-------|
| Intune Plan 1 | Inclus M365 E3/Business Premium/F1/F3 | : |
| Intune Plan 2 | $4/u/m | Prérequis Intune P1 |
| Intune Suite | $10/u/m | Prérequis Intune P1 |
| Intune Remote Help | $3.50/u/m | : |
| Intune Advanced Analytics | $5/u/m | : |
| Intune Enterprise App Management | $2/u/m | : |
| Microsoft Cloud PKI | $2/u/m | : |
| Intune Endpoint Privilege Management | $3/u/m | : |

---

## 15. Canaux de licensing : Comparaison

| Programme | Taille org | Produits | Engagement |
|-----------|-----------|----------|------------|
| EA/EAS (Volume Licensing) | >500 | On-prem + Online | 3 ans |
| Open/OV/OVS | >5 users | On-prem + Online | 1-3 ans |
| MPSA | >250 | On-prem + Online | 3 ans L/SA |
| EES (Education) | >1000 FTE | On-prem + Online | 1 an |
| CSP | 1+ | Online seulement | 1 an |
| Buy Online (MOSP) | 1+ | Online seulement | Mensuel ou 1 an |

---

## 16. Microsoft 365 Apps : Licensing

### Comparaison Office client
| Feature | Office LTSC Standard | LTSC Professional | M365 Apps for Business | M365 Apps for Enterprise |
|---------|---------------------|-------------------|-----------------------|--------------------------|
| Modèle | Per device | Per device | Per user (300 max) | Per user OU per device |
| Word/Excel/PPT/Outlook | ● | ● | ● | ● |
| Access | ✗ | ● | ● | ● |
| Install 5 PCs + 5 tablets + 5 phones | ✗ | ✗ | ● | ● |
| OneDrive 1 TB | ✗ | ✗ | ● | ● |
| Always up-to-date | ✗ | ✗ | ● | ● |
| Shared computer activation | ✗ | ✗ | Via Business Premium | ● |
| Enterprise management | ✗ | ● | ✗ | ● |

### Device-Based Subscription (DBS) pour M365 Apps Enterprise
- **Usage** : Devices partagés (nurses stations, manufacturing line, loading dock, conference rooms)
- **Prix ERP** : $36/device/mois (public) / $18/device/mois (Lead Status interne)
- **Avantage** : Pas de connexion utilisateur requise, pas de limite de connexions
- **Ne remplace PAS** le Shared Computer Activation (SCA = pour RDS multi-users simultanés)

---

## 17. Microsoft 365 Mobile Apps

### Droits commerciaux par taille d'écran

| Action | Screen < 10.9" | Screen ≥ 10.9" |
|--------|---------------|----------------|
| Visualiser | Gratuit | Gratuit |
| Créer/éditer personnel | Gratuit | M365 Personal/Family requis |
| Features premium usage personnel | M365 suite | M365 suite |
| **Créer/éditer usage commercial** | **M365 F3/E3+** | **M365 E3/Apps for enterprise** |

---

## 18. Power Platform inclus dans M365

| Suite M365 | Power Apps | Power Automate (cloud) | Power Automate (desktop) | Copilot Studio Teams | Dataverse Teams |
|-----------|-----------|----------------------|------------------------|---------------------|----------------|
| O365 E1/E3/E5/F3 | ● | ● | ✗ | ● | ● |
| M365 Business Basic/Standard | ● | ● | ✗ | ● | ● |
| M365 Business Premium | ● | ● | ● | ● | ● |
| M365 F1 | ✗ | ✗ | ✗ | ✗ | ✗ |
| M365 F3 | ● | ● | ● | ● | ● |
| M365 E3 | ● | ● | ● | ● | ● |
| M365 E5 | ● | ● | ● | ● | ● |
| Windows Enterprise E3 | ✗ | ✗ | ● | ✗ | ✗ |

*Limite : 2000 Power Platform Requests/jour (partagé Power Apps + Power Automate)*
*Connecteurs premium/custom : NON inclus → nécessite licences Power Platform standalone*

---

## 19. Copilot Studio : Summary

| Plan | Prix | Output | Canaux |
|------|------|--------|--------|
| **Copilot Studio Subscription** | $200/tenant/mois | Copilot standalone | Externes + Internes (Teams, web...) |
| Copilot Studio in M365 Copilot | Inclus avec M365 Copilot ($30/u/m) | Plugins M365 Copilot | M365 Copilot uniquement |
| Copilot Studio for Teams | Inclus dans M365 E3/E5/F3 | Teams chatbot | Teams uniquement |

- 25 000 messages/tenant/mois inclus dans subscription ($200/tenant)
- Messages additionnels achetables via add-on
- Note : Licence user Copilot Studio ($0) requise pour chaque auteur

---

## 20. Questions de découverte commerciale

**Sécurité & Compliance :**
- Avez-vous des incidents de sécurité récents (ransomware, phishing, data leak) ?
- Êtes-vous soumis à des réglementations (RGPD, ISO 27001, NIS2) ?
- Utilisez-vous déjà Defender ou une solution EDR tierce ?

**Productivité & Collaboration :**
- Avez-vous des utilisateurs "terrain" ou "firstline workers" (retail, santé, manufacturing) ?
- Votre équipe utilise-t-elle Teams pour les appels téléphoniques ou uniquement pour les meetings ?
- Avez-vous besoin de remplacement de votre système PBX on-premises ?

**Licensing & Budget :**
- Êtes-vous en EA, CSP, ou achat direct (Buy Online) ?
- Quelle est votre date de renouvellement EA ?
- Avez-vous des utilisateurs sur O365 E3 que vous souhaitez migrer vers M365 E3 ou E5 ?

**Upsell E3 → E5 :**
- Avez-vous besoin de Power BI Pro pour vos analyses business ?
- Souhaitez-vous des capacités avancées de compliance (DLP, eDiscovery, Insider Risk) ?
- Votre DSI cherche-t-il à consolider ses outils de sécurité pour réduire les coûts ?

---

## 21. Chiffres clés à retenir

- **M365 E3** : $36/u/m → Suite entreprise complète (sans Teams Phone ni Power BI Pro)
- **M365 E5** : $57/u/m → Tout E3 + Sécurité complète + Compliance + Teams Phone + Power BI Pro
- **Step-up E3→E5** : $21/u/m → Meilleur rapport qualité/prix vs achat add-ons séparés
- **M365 F1** : ~$2.25/u/m → Workers terrain sans email ni Office
- **M365 F3** : ~$8/u/m → Workers terrain avec Office web + Power Apps
- **M365 Copilot** : $30/u/m → IA générative dans toute la suite M365
- **F5 Security** : $8/u/m → -72% vs valeur standalone ($28.20)
- **F5 Security + Compliance** : $13/u/m → -72% vs standalone combiné ($47.20)
- **Teams Phone Standard** : $8/u/m (ou $4/u/m FLW)
- **Audio Conferencing w/ dial-out USA/CAN** : **$0/u/m** (à assigner manuellement)
