# Microsoft 365 : Feature Availability Officielle
*Source : Microsoft Learn Service Descriptions (learn.microsoft.com) : Mise à jour juin 2026*

---

## INDEX

1. [Platform M365/O365 : Features transversales](#1-platform-m365o365)
2. [Microsoft 365 Copilot](#2-microsoft-365-copilot)
3. [Microsoft Teams](#3-microsoft-teams)
4. [Exchange Online](#4-exchange-online)
5. [Exchange Online Archiving](#5-exchange-online-archiving)
6. [SharePoint Online](#6-sharepoint-online)
7. [OneDrive for Business](#7-onedrive-for-business)
8. [Office Applications (desktop)](#8-office-applications-desktop)
9. [Office for the Web](#9-office-for-the-web)
10. [Power BI](#10-power-bi)
11. [Microsoft Viva](#11-microsoft-viva)
12. [Microsoft Entra (Azure AD)](#12-microsoft-entra)
13. [Microsoft Defender for Office 365](#13-microsoft-defender-for-office-365)

---

## 1. Platform M365/O365

### Features disponibles dans TOUS les plans
(Business Basic/Standard/Premium, O365 E1/E3/E5, M365 E3/E5/F1/F3)

- Microsoft 365 admin center / PowerShell
- Microsoft Graph API, Microsoft Planner, Microsoft Teams, Microsoft 365 Groups, Microsoft Search
- Directory Sync, Bulk upload CSV, Multiple admin roles, Security groups management
- Domain management (custom domains, DNS, up to 900 custom domains)
- Service health dashboard, Message Center
- IPv4 et IPv6
- Compliance certifications (SAS 70/SSAE16, ISO 27001, FISMA, HIPAA-BAA)
- Partners & delegated administration
- Activity reports, Microsoft Graph Usage Reports APIs

### Features disponibles sur CERTAINS plans

| Feature | Business Basic & Standard | Business Premium | O365 E1 | M365 E3 / O365 E3 | M365 E5 / O365 E5 | M365 F1 | M365 F3 / O365 F3 |
|---------|--------------------------|-----------------|---------|------------------|--------------------|---------|-----------------|
| Microsoft Bookings | Oui | Oui | Non | Oui | Oui | Oui | Oui (F3 seulement) |
| Microsoft Intune | Non | **Oui** | Non | Oui (M365 E3 seulement) | Oui (M365 E5 seulement) | Oui | Oui (M365 F3 seulement) |
| Power Automate M365 | Oui | Oui | Oui¹ | Oui | Oui | Non | Oui¹ |
| Microsoft Forms | Oui | Oui | Oui | Oui | Oui | Non | Oui |
| Viva Insights personal² | Oui | Oui | Oui | Oui | Oui | Non | Non |
| Power Apps M365 | Oui | Oui | Oui | Oui | Oui | Non | Oui |
| Microsoft Stream | Oui | Oui | Oui³ | Oui | Oui | Oui³ | Oui³ |
| Microsoft Sway | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| Microsoft Delve | Oui | Oui | Oui | Oui | Oui | Non | Non |
| People Skills | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| Cloud App Security Discovery | Non | **Oui** | Non | Oui (M365 E3) | Oui | Oui | Oui (M365 F3) |
| **Defender for Cloud Apps (full)** | Non | Non | Non | Non | **Oui (M365 E5)** | Non | Non |
| **Defender for Office 365** | Non | **Oui (P1)** | Non | Non | **Oui (P2)** | Non | Non |
| **Customer Lockbox** | Non | Non | Non | Non | **Oui** | Non | Non |
| **Customer Key** | Non | Non | Non | Non | **Oui** | Non | Non |
| **eDiscovery (Premium)** | Non | Non | Non | Non | **Oui** | Non | Non |
| Purview Audit (Standard) | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| **Purview Audit (Premium)** | Non | Non | Non | Non | **Oui** | Non | Non |
| Microsoft Secure Score | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| Office 365 Threat Intelligence (Defender P2) | Non | Non | Non | Non | **Oui** | Non | Non |

¹ Cloud flows uniquement  
² Premium personal insights nécessite Viva Insights add-on  
³ Stream limité à la visualisation (pas de publication/partage)  

---

## 2. Microsoft 365 Copilot

**Prix** : $30/u/m : Add-on (ne peut pas être acheté seul)  
**Prérequis** : M365 E3/E5/F1/F3, O365 E1/E3/E5/F3, Business Basic/Standard/Premium, Teams Essentials/Enterprise

### Feature Availability par Cloud

| Feature | Commercial | GCC | GCC-H | DoD |
|---------|-----------|-----|-------|-----|
| **Grounding** | | | | |
| Web data + referenced/uploaded files | Oui | Oui¹ | Oui¹ | Oui¹ |
| Work data / Microsoft Graph | Oui | Oui | Oui | Oui |
| **Microsoft 365 Copilot App** | | | | |
| Chat | Oui | Oui² | Oui² | Oui² |
| Copilot Search | Oui | Oui | Oui | Oui |
| Copilot Notebooks | Oui² | Oui | Oui | Oui |
| Pages | Oui | Oui | Oui | Oui |
| Create | Oui | Oui | Oui | Non dispo |
| Researcher | Oui² | Oui | Oui | Non dispo |
| Analyst | Oui² | Oui | Oui | Oui |
| Word/Excel/PPT Agents | Oui | Non dispo | Non dispo | Non dispo |
| Copilot Prompt Gallery | Oui | Oui | Oui | Non dispo |
| **Copilot dans M365 Apps** | | | | |
| Copilot in Outlook | Oui | Oui³ | Oui³ | Oui³ |
| Copilot Chat (Word/Excel/PPT/OneNote) | Oui | Oui | Oui | Oui |
| Edit with Copilot (Word/Excel/PPT/OneNote) | Oui² | Non dispo | Non dispo | Non dispo |
| Copilot in Teams (Chat/Channel/Meetings) | Oui | Oui | Non dispo | Oui |
| **Copilot SharePoint & OneDrive** | | | | |
| Copilot in SharePoint | Oui | Oui | Non dispo | Oui |
| SharePoint agents | Oui | Oui | Non dispo | Oui |
| **Agents & Extensibilité** | | | | |
| Declarative agents | Oui | Oui | Oui⁴ | Non dispo |
| Agent Builder | Oui | Oui | Oui | Non dispo |
| M365 Copilot Connectors | Oui | Oui⁵ | Oui⁵ | Non dispo |
| **Sécurité** | | | | |
| Enterprise Data Protection (EDP) | Oui | Oui | Oui | Oui |
| Purview controls for Copilot | Oui | Oui | Oui | Oui |
| Copilot Analytics (Viva Insights) | Oui | Oui | Non dispo | Non dispo |

¹ Web grounding non activé par défaut dans les clouds gouvernementaux  
² Nécessite une licence Microsoft 365 Copilot (Premium)  
³ Schedule with Copilot et Themes by Copilot non disponibles en GCC/GCCH/DoD  
⁴ GCC-H supporte seulement les declarative agents via Agent Builder  
⁵ External connections et partner connectors non activés par défaut  

---

## 3. Microsoft Teams

### Disponibilité par plan et cloud

| Feature | Small Business | Enterprise | GCC | GCC-H | DoD | Education |
|---------|---------------|-----------|-----|-------|-----|-----------|
| Teams Apps | Oui | Oui | Oui | Oui¹ | Oui¹ | Oui |
| Audio Conferencing | Oui | Oui | Oui | Oui² | Oui² | Oui |
| Channels - Standard | Oui | Oui | Oui | Oui | Oui | Oui |
| Channels - Private | Oui | Oui | Oui | Oui | Oui | Oui |
| Channels - Shared | Oui | Oui | Oui | **Non** | **Non** | Oui³ |
| Chat | Oui | Oui | Oui | Oui | Oui | Oui |
| Live Events | **Non** | Oui | Oui | Oui | Oui | Oui |
| Meetings | Oui | Oui | Oui | Oui | Oui | Oui |
| Screen Sharing (PPT/Audio/Video/Desktop) | Oui | Oui | Oui | Oui | Oui | Oui |
| Teams | Oui | Oui | Oui | Oui | Oui | Oui |
| Voice (Teams Phone)⁴ | Oui | Oui | Oui | Oui² | Oui² | Oui |
| Webinars | Oui | Oui | Oui | Oui | **Non** | Oui⁵ |
| Town Hall | Oui | Oui | Oui | Oui | Oui | Oui |
| Loop Integrations | Oui | Oui | Oui | Oui | Oui | Oui |

¹ Applications tierces et publication d'apps non disponibles  
² Direct Routing requis pour GCCH et DoD  
³ Shared channels non supportés pour les Class teams  
⁴ Nécessite une licence Teams Phone supplémentaire  
⁵ Education A1 et SMB : limite de 300 personnes pour les webinars  

---

## 4. Exchange Online

### Features disponibles sur TOUS les plans (Business, E1/E3/E5, F3, Exchange Plan 1/2/Kiosk)

- Anti-spam et anti-malware intégrés, politiques personnalisées, quarantaine
- Exchange admin center (EAC), PowerShell, Mobile device policies (ActiveSync)
- Haute disponibilité, Mailbox replication, Single item recovery
- Skype for Business presence dans OWA, SharePoint interoperability
- Mail flow : custom routing, secure messaging trusted partner
- Migration hybride : IMAP, cutover, staged
- Resource mailboxes, Distribution groups, External contacts, Calendar sharing
- Journaling (per database niveau Standard)

### Features disponibles sur CERTAINS plans

| Feature | Business Basic & Standard | Business Premium | O365 E1 | M365 E3 / O365 E3/E5 | M365 F3 / O365 F3 | Exchange Plan 2 | Exchange Plan 1 | Exchange Kiosk |
|---------|--------------------------|-----------------|---------|----------------------|-------------------|----------------|-----------------|---------------|
| POP & IMAP | Oui | Oui | Oui | Oui | Oui² | Oui | Oui | Oui² |
| Outlook desktop (Windows/Mac) | Oui³ | Oui | Oui³ | Oui | **Non** | Oui³ | Oui³ | Non |
| **Exchange Online Archiving** | **Non** | **Oui** | Non | **Oui** | **Non** | **Oui** | Non | Non |
| Archiving pour Exchange Server | Non | Non | Non | Oui | Non | Oui | Non | Non |
| Retention policies, labels, tags | Non | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| IRM avec Azure Information Protection | Non | Non | Non | **Oui** | Non | Non | Non | Non |
| Microsoft Purview Message Encryption (Basic) | Oui | Oui | Non | Oui | Oui | Oui | Oui | Oui |
| **Purview Advanced Message Encryption** | Non | Non | Non | Oui⁴ | Non | Non | Non | Non |
| **Customer Key** | Non | Non | Non | **Oui** | Non | Non | Non | Non |
| **In-Place Hold / Litigation Hold** | Non | **Oui** | Non | **Oui** | Non | **Oui** | Non | Non |
| **Purview DLP** | Non | **Oui** | Non | **Oui** | Non | **Oui** | Non | Non |
| Inactive mailboxes | Non | Non | Non | **Oui** | Non | **Oui** | Non | Non |
| Microsoft 365 Groups | Oui | Oui | Oui | Oui | Oui | Oui⁵ | Oui⁵ | Non |

² POP supporté, IMAP non  
³ Nécessite licence Office desktop apps  
⁴ Advanced Message Encryption uniquement M365 E5/O365 E5 ou Compliance add-on sur M365 E3  
⁵ Fonctionnalité réduite  

**Note importante** : Exchange Web Services (EWS) dans Exchange Online est déprécié. Désactivation progressive à partir du 1er octobre 2026, retraite permanente le 1er avril 2027. Migrer vers Microsoft Graph.

---

## 5. Exchange Online Archiving

### Plans incluant l'archivage (pas besoin d'add-on)
- Exchange Online Plan 2
- Microsoft 365 Business Premium
- Microsoft 365 E3/E5
- Microsoft 365 F5 Compliance
- Office 365 A3/A5/E3/E5

### Plans nécessitant Exchange Online Archiving comme add-on
- Exchange Online Plan 1
- Exchange Online Kiosk
- Microsoft 365 Business Basic/Standard
- Office 365 E1/A1/G1/F3
- Microsoft 365 F3

### Features Archiving

| Feature | EOA for Exchange Server | EOA for Exchange Online |
|---------|------------------------|------------------------|
| Archive mailbox | Oui | Oui |
| Move messages via archive policy | Oui | Oui |
| Import data vers archive | Oui | Oui |
| Deleted item recovery | Oui | Oui |
| Mailbox backup | Oui | Oui |
| Outlook client | Oui | Oui |
| Outlook on the web (OWA) | **Non** (retiré) | Oui |
| Retention policies | Oui | Oui |
| In-Place Hold / Litigation Hold | Oui | Oui |
| In-Place eDiscovery | Non | Oui |
| Encryption transit | Oui | Oui |
| S/MIME et PGP | Oui | Oui |
| IRM Azure Information Protection | Non | Non (add-on requis) |
| IRM Windows Server AD RMS | Oui | Oui |
| Audit | Oui | Oui |

**Stockage** : 100 GB initial → auto-expanding jusqu'à 1.5 TB maximum.

---

## 6. SharePoint Online

### Features disponibles sur TOUS les plans incluant SharePoint

**Développeur** : App Catalog, OAuth, REST/OData, SharePoint Framework (SPFx), Site designs/scripts

**IT Admin** : Activity reports, Change site URL, Multi-geo (add-on), SharePoint admin center, Migration tools (SPMT, Migration Manager), Term store/managed metadata

**Recherche** : Hybrid search, Microsoft Search integration, Promoted results, Search schema

**Sécurité & Compliance** : Access control (network location, unmanaged devices), Customer Lockbox, DLP, eDiscovery, Encryption transit/at rest, Idle session sign-out, Information Barriers, IRM (requires AIP), Defender for Office 365, Sensitivity labels, Unified auditing, Virus scanning

**Sites & Content** : Document libraries, Document sets, Lists, Mega menus, News, Pages, SharePoint mobile app, Web parts, Team OneNote, Themes

### SharePoint Advanced Management (SAM)
Inclus dans Microsoft 365 Copilot ou disponible comme add-on ($3/u/m).

| Feature SAM | Commercial | GCC | GCC-H | DoD |
|-------------|-----------|-----|-------|-----|
| Site ownership policy | Oui | Oui | Oui | Oui |
| Inactive sites policy | Oui | Oui | Oui | Oui |
| Site attestation policy | Oui | Oui | Oui | Oui |
| Content management assessment | Oui | Oui | Oui | Oui |
| Block download policy | Oui | Oui | Oui | Oui |
| Enterprise app insights | Oui | Oui | Oui | Oui |
| SharePoint agent insights | Oui | Oui | Oui | Oui |
| Restricted access control (RAC) | Oui | Oui | Oui | Oui |
| Restricted content discovery (RCD) | Oui | Oui | Oui | Oui |
| Permission state reports | Oui | Oui | Oui | Oui |
| Site access review | Oui | Oui | Oui | Oui |
| Catalog management | Oui | Oui | Oui | Oui |
| Change history reports | Oui | Oui | Oui | Oui |

---

## 7. OneDrive for Business

### Stockage par plan

| Plan | Stockage |
|------|----------|
| OneDrive Plan 1 | 1 TB/user |
| M365 Business Basic/Standard/Premium | 1 TB/user |
| M365 E3/E5 | 1 TB/user (extensible à 5 TB) |
| M365 F3 | **2 GB/user** |

### Features disponibles sur tous les plans
- Stockage, Sync, Sharing & collaboration, Web features, Mobile features
- IT admin, Security & Compliance features
- External collaboration via Microsoft Entra B2B (guest accounts automatiques)

---

## 8. Office Applications (Desktop)

### Disponibilité des apps par plan

| App/Feature | Office Pro Plus 2013/2016/2019 | Office LTSC 2021 | M365 Apps Enterprise | M365 Apps Business | Business Basic | Business Standard & Premium | O365 E1 | O365 E3/E5 |
|-------------|-------------------------------|-----------------|---------------------|-------------------|---------------|---------------------------|---------|-----------|
| Word/Excel/PPT/OneNote/Outlook/Publisher/Access | Oui | Oui | **Oui** | **Oui** | **Non** | **Oui** | **Non** | **Oui** |
| Office Mobile (5 installs PC/Mac + 5 tablets + 5 phones) | Non | Non | Oui | Oui | Oui⁴ | Oui | Oui⁴ | Oui |
| Microsoft Teams | Non | Oui | Oui | Oui | Oui | Oui | Oui | Oui |
| 5 installs per user + version upgrades | Non | Non | Oui | Oui | Non | Oui | Non | Oui |
| Shared Computer Activation | Non | Non | **Oui** | Non | Non | Oui⁸ | Non | Oui |
| Group Policy support | Oui | Oui | Oui | Oui¹¹ | Non | Oui¹¹ | Non | Oui |
| Cloud Policy support | Non | Non | Oui | Oui¹¹ | Oui¹² | Oui¹¹ | Oui¹² | Oui |
| Manual sensitivity labeling (Purview) | Non¹³ | Non | Oui | Non | Non | Oui⁸ | Non | Oui |
| Auto sensitivity labeling (Purview) | Non¹³ | Non | Oui¹⁵ | Non | Non | Non | Non | Oui¹⁶ |
| Desktop virtualization | Oui | Oui | Oui⁷ | Non | Non | Oui⁸ | Non | Oui |
| OneDrive offline + archive | Oui | Oui | Oui | Oui | Non | Oui | Non | Oui |
| Information Rights Management | Oui | Oui | Oui | Oui | Oui | Oui | Oui | Oui |

⁴ Limité aux devices avec écran intégré ≤ 10.9"  
⁷ VDI dédié, RDS uniquement via Volume Licensing avec Shared Computer Activation  
⁸ Non disponible pour Business Standard  
¹¹ Limité aux politiques web apps et privacy policies  
¹² Limité aux politiques web apps  
¹³ Add-in AIP peut être utilisé pour activer sensitivity labeling  
¹⁵ Nécessite M365 E5, O365 E5, EMS E5, M365 Compliance, ou M365 E5 Info Protection  
¹⁶ Non disponible pour O365 E3  

**Note** : Office 2016 et Office 2019 : fin de support le 14 octobre 2025, sans extension ni security updates.

### Office sur Mac
Disponible pour : M365 Apps Enterprise, Office LTSC 2021 pour Mac
Apps disponibles : Word, Excel, PowerPoint, OneNote, Outlook, Teams
Apps NON disponibles sur Mac : Publisher, Access, InfoPath

---

## 9. Office for the Web

### Word for the web : Différences vs Desktop

| Feature | Web | Desktop |
|---------|-----|---------|
| Captions | Non | Oui |
| Citations & bibliography | Non | Oui |
| Mail merge | Non | Oui |
| Offline authoring | Non | Oui |
| Index | Non | Oui |
| IRM & password protection | Non | Oui |
| VBA & Forms scripts | Non | Oui |
| Watermarks | Non | Oui |
| SmartArt | Non (affichage seulement) | Oui |
| Table of Authority | Non | Oui |
| Advanced page layout | Non | Oui |
| Transcribe | **Oui** | Non |
| Export to PPT | **Oui** | Non |
| Designer | **Oui** | Non |
| Immersive Reader | Oui | Oui |
| Real-time co-authoring | Oui | Oui |
| Table of Contents | Oui | Oui |

### Excel for the web : Différences vs Desktop

| Feature | Web | Desktop |
|---------|-----|---------|
| Create external data connections | Non | Oui |
| PivotCharts (edit) | Non (affichage) | Oui |
| Advanced time filtering (Timeline slicer) | Non | Oui |
| Creation of advanced analysis (Power View, Power Pivot) | Non | Oui |
| External references | Non | Oui |
| Formula tools, advanced | Non | Oui |
| Rights management (IRM) | Non | Oui |
| Spreadsheet audit & compliance | Non | Oui |
| What-if analysis tools | Non | Oui |
| VBA / Macros (run/create) | **Non** | Oui |
| Offline authoring | Non | Oui |
| Embed workbook on web/blog | Oui | Non |
| Surveys | Oui | Non |
| Rename file while open | Oui | Non |

### PowerPoint for the web : Différences vs Desktop

| Feature | Web | Desktop |
|---------|-----|---------|
| Custom animation | Non (8 transitions, 37 animations) | Oui (full) |
| Broadcast slide show | Non | Oui |
| Full ink support | Non | Oui |
| Headers & footers | Non | Oui |
| Integration avec Excel pour charts | Non | Oui |
| Offline authoring | Non | Oui |
| Presenter view | Non | Oui |
| Rights management (IRM) | Non | Oui |
| Embed presentation on web | Oui | Non |

### Formats supportés (Office for the Web)

| Format | Visualisation | Edition |
|--------|--------------|---------|
| .docx/.xlsx/.pptx (Open XML) | Oui | Oui |
| .doc/.xls/.ppt (Binary) | Oui | Converti vers Open XML |
| .odt/.ods/.odp (OpenDocument) | Oui | Oui |
| .pdf | Non | Non |
| Macros (.docm/.xlsm/.pptm) | Oui¹ | Oui² |
| Templates (.dotx/.xltx/.potx) | Oui | Non |

¹ Macros affichées mais non exécutables  
² Pour Excel : si macros présentes, proposé de sauvegarder sans les macros  

---

## 10. Power BI

### Disponibilité par plan

| Feature | Power BI Pro | Power BI Premium par user | Power BI Premium par capacity |
|---------|-------------|--------------------------|-------------------------------|
| **Collaboration & Analytics** | | | |
| Access to Fabric workloads | Non | Non | **Oui** |
| Consommation sans licence per-user | Non | Non | **Oui** |
| Copilot in Fabric (Power BI) | Non | Non | **Oui** |
| Mobile app | Oui | Oui | Oui |
| On-premises (Power BI Report Server) | Non | Non | **Oui** |
| Paginated (RDL) reports | Oui | Oui | Oui |
| Publish reports | Oui | Oui | Non |
| **Data & Modeling** | | | |
| Advanced AI | Non | **Oui** | Oui |
| Advanced dataflows | Non | **Oui** | Oui |
| AI visuals | Oui | Oui | Oui |
| Connect to 100+ data sources | Oui | Oui | Oui |
| Create reports (Power BI Desktop) | Oui | Oui | Oui |
| Model size limit | 1 GB | 100 GB | Variable |
| Refresh rate | 8/jour | 48/jour | 48/jour |
| XMLA endpoint read/write | Non | **Oui** | Oui |
| **Gouvernance** | | | |
| Data security & encryption | Oui | Oui | Oui |
| Deployment pipelines (ALM) | Non | **Oui** | Oui |
| Max storage | 10 GB/user | 100 TB | 100 TB |
| Multi-geo deployment | Non | Non | **Oui** |

**Note** : Power BI Pro est inclus dans Microsoft 365 E5/O365 E5. Power BI est également disponible via Microsoft Fabric (F-SKU).  
À partir d'août 2025 : limite de 1 000 users/groupes par workspace Fabric.

---

## 11. Microsoft Viva

### Feature Availability par plan M365

| Feature | M365 F1/F3 / O365 F3 | O365 E1 | M365 E3/A3 / O365 E3/A3 | M365 E5/A5 / O365 E5/A5 | Business Basic/Standard/Premium |
|---------|----------------------|---------|--------------------------|--------------------------|--------------------------------|
| **Viva Connections** | | | | | |
| Dashboard, Feed, Mobile app | Oui | Oui | Oui | Oui | Oui |
| Branding personnalisé | Oui | Oui | Oui | Oui | Oui |
| Custom adaptive cards | Oui | Oui | Oui | Oui | Oui |
| **Viva Insights** | | | | | |
| Personal insights app Teams/web | Oui¹¹ | Oui | Oui | Oui | Oui |
| Briefing email + digest Outlook | Non | Oui | Oui | Oui | Non (Basic) / Oui (Standard/Premium) |
| Viva Insights add-in Outlook | Non | Oui | Oui | Oui | Non (Basic) / Oui (Standard/Premium) |
| Premium personal insights | Non⁹ | Non⁹ | Non⁹ | Non⁹ | Non⁹ |
| Manager insights | Non⁹ | Non⁹ | Non⁹ | Non⁹ | Non⁹ |
| Leader insights | Non⁹ | Non⁹ | Non⁹ | Non⁹ | Non⁹ |
| Custom analysis tools | Non⁹ | Non⁹ | Non⁹ | Non⁹ | Non⁹ |
| Microsoft Copilot Dashboard | Non¹⁵ | Non¹⁵ | Non¹⁵ | Non¹⁵ | Non¹⁵ |
| **Viva Learning** | | | | | |
| Teams app, search, share, tabs | Oui | Oui | Oui | Oui | Oui |
| SharePoint content | Oui | Oui | Oui | Oui | Oui |
| 125 LinkedIn Learning + Microsoft Learn | Oui | Oui | Oui | Oui | Oui |
| LMS integration + 3rd party content | Non⁷ | Non⁷ | Non⁷ | Non⁷ | Non⁷ |
| Recommend & track completion | Non⁷ | Non⁷ | Non⁷ | Non⁷ | Non⁷ |
| **Viva Engage** | | | | | |
| Communautés, Conversations, Storyline | Oui | Oui | Oui | Oui | Oui |
| Virtual events | Oui | Oui | Oui | Oui | Oui |
| Advanced Security Engage | Non | Non | Non | **Oui** | Non |
| **Viva Answers (Q&A, Badging)** | Non¹² | Non¹² | Non¹² | Non¹² | Non¹² |
| **Viva Glint** | Non⁹ | Non⁹ | Non⁹ | Non⁹ | Non⁹ |
| **Viva Pulse** | Non⁹ | Non⁹ | Non⁹ | Non⁹ | Non⁹ |
| **Viva Amplify** | Non¹⁴ | Non¹⁴ | Non¹⁴ | Non¹⁴ | Non¹⁴ |

⁷ Nécessite achat Viva Learning SKU ou Viva Suite SKU  
⁹ Disponible uniquement en standalone SKU ou via Viva Suite  
¹¹ F1 : limité à Headspace, Send Praise, Reflect, Virtual Commute  
¹² Uniquement pour clients Viva Suite  
¹⁴ Nécessite Viva Suite ou Viva Employee Communications  
¹⁵ Nécessite Microsoft 365 Copilot ou 10 licences Viva Insights  

---

## 12. Microsoft Entra

### Plan Availability

| Plan | M365 E3 | M365 E5/Defender Suite Add-on | O365 E1/E3/E5 / Teams Enterprise | EMS E3 | EMS E5 | M365 F1/F3 | Defender Suite FLW | Purview Suite FLW | Teams Essentials | Business Basic/Standard | Business Premium |
|------|---------|-------------------------------|----------------------------------|--------|--------|-----------|-------------------|------------------|-----------------|------------------------|----------------|
| Entra ID **Free** | Non | Non | **Oui** | Non | Non | Non | Non | Non | **Oui** | **Oui** | Non |
| Entra ID **Plan 1** | **Oui** | Non | Non | **Oui** | Non | **Oui** | Non | Non | Non | Non | **Oui** |
| Entra ID **Plan 2** | Non | **Oui** | Non | Non | **Oui** | Non | **Oui** | **Oui** | Non | Non | Non |

### Famille de produits Entra

| Produit | Description | Plan requis |
|---------|-------------|-------------|
| **Entra ID Free** | SSO, directory sync, MFA basique | Inclus dans tout M365/O365 |
| **Entra ID P1** | Conditional Access, SSPR hybride, dynamic groups, Intune MDM | M365 E3/F1/F3, EMS E3, Business Premium |
| **Entra ID P2** | Identity Protection (risk-based CA), PIM, Access Reviews, Entitlement Mgmt | M365 E5, EMS E5 |
| **Entra External ID** | Identités externes (B2B, B2C) | Facturation Azure |
| **Entra Workload ID** | Identités applications/services/workloads | Add-on |
| **Entra ID Protection** | Détection risques identité, remédiation automatisée | Inclus dans Entra ID P2 et Entra Suite |
| **Entra ID Governance** | Lifecycle identités, access packages, access reviews, PIM | $7/u/m, prérequis Entra ID P1 |
| **Entra Verified ID** | Credentials vérifiables décentralisés | Inclus Entra Suite, $0.25/Face Check |
| **Entra Internet Access** | SWG : sécurise accès SaaS, public internet, menaces web | $5/u/m |
| **Entra Private Access** | ZTNA : remplace VPN pour apps privées | $5/u/m |
| **Entra Suite** | Bundle : ID Protection + ID Governance + Verified ID + Internet Access + Private Access | $12/u/m |
| **Entra Domain Services** | Domain join, Group Policy, LDAP, Kerberos/NTLM managé | Facturation Azure |

---

## 13. Microsoft Defender for Office 365

### Feature Availability par plan

| Feature | Defender pour O365 Plan 1 | Defender pour O365 Plan 2 | Microsoft Defender Suite/EDU/GOV/FLW |
|---------|--------------------------|--------------------------|--------------------------------------|
| **Configuration, protection & détection** | | | |
| Preset security policies | Oui | Oui | Oui |
| **Safe Attachments** | **Oui** | Oui | Oui |
| Safe Attachments in Teams | Oui | Oui | Oui |
| **Safe Links** | **Oui** | Oui | Oui |
| **Safe Documents** | Non | Non | **Oui** (M365 E5/E5 Security seulement) |
| Safe Links in Teams | Oui | Oui | Oui |
| Report Message Add-in | Oui | Oui | Oui |
| Protection SharePoint/OneDrive/Teams | Oui | Oui | Oui |
| **Anti-phishing** (user+domain impersonation¹) | **Oui** | Oui | Oui |
| Real-time reports | Oui | Oui | Oui |
| Advanced protection internal mail | Oui | Oui | Oui |
| **Automation, investigation, remédiation** | | | |
| Threat Trackers | **Non** | **Oui** | Oui |
| Campaign Views | **Non** | **Oui** | Oui |
| Threat investigation | Real-time detections | **Threat Explorer** | Threat Explorer |
| Automated Investigation & Response (AIR) | **Non** | **Oui** | Oui |
| Attack Simulation Training | **Non** | **Oui** | Oui |
| **Intégration Microsoft Defender XDR** | **Non** | **Oui** | Oui |

¹ User and domain impersonation protection disponible en Plan 1

### Quels plans incluent Defender for Office 365 ?
| Plan 1 inclus dans | Plan 2 inclus dans |
|------------------|------------------|
| M365 Business Premium | M365 E5 |
| M365 E3 (via add-on E5 Security) | O365 E5 |
| | M365/O365 A5 |
| | M365/O365 G5 |

---

## Récapitulatif des URLs officielles

| Service | URL |
|---------|-----|
| Index principal | https://learn.microsoft.com/en-us/office365/servicedescriptions/office-365-service-descriptions-technet-library |
| Platform M365/O365 | https://learn.microsoft.com/en-us/office365/servicedescriptions/office-365-platform-service-description/office-365-platform-service-description |
| M365 Copilot | https://learn.microsoft.com/en-us/office365/servicedescriptions/office-365-platform-service-description/microsoft-365-copilot |
| Teams | https://learn.microsoft.com/en-us/office365/servicedescriptions/teams-service-description |
| Exchange Online | https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-service-description |
| Exchange Archiving | https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-archiving-service-description/exchange-online-archiving-service-description |
| SharePoint | https://learn.microsoft.com/en-us/office365/servicedescriptions/sharepoint-online-service-description/sharepoint-online-service-description |
| OneDrive | https://learn.microsoft.com/en-us/office365/servicedescriptions/onedrive-for-business-service-description |
| Office Apps | https://learn.microsoft.com/en-us/office365/servicedescriptions/office-applications-service-description/office-applications-service-description |
| Office for the Web | https://learn.microsoft.com/en-us/office365/servicedescriptions/office-online-service-description/office-online-service-description |
| Power BI | https://learn.microsoft.com/en-us/office365/servicedescriptions/power-bi-service-description |
| Microsoft Viva | https://learn.microsoft.com/en-us/office365/servicedescriptions/microsoft-viva-service-description |
| Microsoft Entra | https://learn.microsoft.com/en-us/office365/servicedescriptions/azure-active-directory |
| Defender for Office 365 | https://learn.microsoft.com/en-us/office365/servicedescriptions/office-365-advanced-threat-protection-service-description |
| Security & Compliance guide | https://learn.microsoft.com/en-us/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance |
